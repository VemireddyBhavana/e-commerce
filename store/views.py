from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.db import models as django_models
from django.views.decorators.cache import never_cache
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
import random

from .models import Category, Product, Cart, CartItem, Order, OrderItem, Review, Wishlist, NewsletterSubscriber
from .serializers import (
    CategorySerializer, ProductSerializer, CartSerializer,
    CartItemSerializer, OrderSerializer, ReviewSerializer, WishlistItemSerializer
)


# ─── Helper: get or create cart ──────────────────────────────────────────────

def get_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
    return cart


# ─── Page Views (HTML) ────────────────────────────────────────────────────────

@never_cache
def index(request):
    # Random order every page load — like Flipkart / Meesho
    all_products = list(Product.objects.select_related('category').all())
    random.shuffle(all_products)

    # Section 1: Trending Now
    trending = all_products[:8]
    # Section 2: New Arrivals – unique 8 products
    new_arrivals = all_products[8:16]
    # Section 3: Top Deals – discounted products
    discounted = [p for p in all_products if p.original_price and p.original_price > p.price]
    top_deals = discounted[:8]

    categories = Category.objects.all()
    response = render(request, 'store/index.html', {
        'featured_products': trending,
        'new_arrivals': new_arrivals,
        'top_deals': top_deals,
        'categories': categories,
    })
    # Prevent ALL caching so browser always fetches a fresh page
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


@never_cache
def product_list(request):
    categories = Category.objects.all()
    category_slug = request.GET.get('category')
    search = request.GET.get('q', '')
    sort = request.GET.get('sort', '')
    # Drop the internal shuffle param so it doesn't pollute filters
    request.GET._mutable = True if hasattr(request.GET, '_mutable') else None

    products = Product.objects.select_related('category').all()
    if category_slug:
        products = products.filter(category__slug=category_slug)
    if search:
        products = products.filter(
            django_models.Q(name__icontains=search) |
            django_models.Q(description__icontains=search)
        )

    if sort == 'price-asc':
        products = products.order_by('price')
    elif sort == 'price-desc':
        products = products.order_by('-price')
    elif sort == 'rating':
        products = products.order_by('-rating')
    else:
        # Default: random every visit
        products = list(products)
        random.shuffle(products)

    response = render(request, 'store/product_list.html', {
        'products': products,
        'categories': categories,
        'selected_category': category_slug,
        'search_query': search,
        'current_sort': sort,
    })
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    related = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
    reviews = product.reviews.select_related('user').order_by('-created_at')
    return render(request, 'store/product_detail.html', {
        'product': product,
        'related_products': related,
        'reviews': reviews,
    })


def cart_page(request):
    cart = get_cart(request)
    return render(request, 'store/cart.html', {'cart': cart})


def checkout_page(request):
    cart = get_cart(request)
    if not request.user.is_authenticated:
        from django.shortcuts import redirect
        return redirect('/accounts/login/?next=/checkout/')
    return render(request, 'store/checkout.html', {'cart': cart})


def orders_page(request):
    if not request.user.is_authenticated:
        from django.shortcuts import redirect
        return redirect('/accounts/login/')
    orders = Order.objects.filter(user=request.user).prefetch_related('items')
    return render(request, 'store/orders.html', {'orders': orders})


# ─── REST API Views ────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def api_categories(request):
    cats = Category.objects.all()
    return Response(CategorySerializer(cats, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_products(request):
    products = Product.objects.select_related('category').all()
    category_slug = request.GET.get('category')
    featured = request.GET.get('featured')
    search = request.GET.get('q', '')
    if category_slug:
        products = products.filter(category__slug=category_slug)
    if featured:
        products = products.filter(is_featured=True)
    if search:
        products = products.filter(
            django_models.Q(name__icontains=search) |
            django_models.Q(description__icontains=search)
        )
    return Response(ProductSerializer(products, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    return Response(ProductSerializer(product).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_cart(request):
    cart = get_cart(request)
    return Response(CartSerializer(cart).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_cart_add(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    product = get_object_or_404(Product, id=product_id)
    cart = get_cart(request)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()
    return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_cart_update(request, item_id):
    cart = get_cart(request)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)
    quantity = int(request.data.get('quantity', 1))
    if quantity <= 0:
        item.delete()
    else:
        item.quantity = quantity
        item.save()
    return Response(CartSerializer(cart).data)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def api_cart_remove(request, item_id):
    cart = get_cart(request)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)
    item.delete()
    return Response(CartSerializer(cart).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_cart_clear(request):
    cart = get_cart(request)
    cart.items.all().delete()
    return Response({'message': 'Cart cleared'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_order_create(request):
    cart = get_cart(request)
    if not cart.items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    order = Order.objects.create(
        user=request.user,
        total_price=cart.total_price,
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        email=data.get('email', request.user.email),
        phone=data.get('phone', ''),
        address=data.get('address', ''),
        city=data.get('city', ''),
        state=data.get('state', ''),
        zip_code=data.get('zip_code', ''),
    )

    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            product_name=cart_item.product.name,
            price=cart_item.product.price,
            quantity=cart_item.quantity,
        )
        # Decrease stock
        cart_item.product.stock -= cart_item.quantity
        cart_item.product.save()

    cart.items.all().delete()
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related('items')
    return Response(OrderSerializer(orders, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return Response(OrderSerializer(order).data)


# ─── Wishlist API ──────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_wishlist(request):
    """Return all wishlist items (with full product detail) for the logged-in user."""
    items = request.user.wishlist_items.select_related('product__category').all()
    return Response(WishlistItemSerializer(items, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_wishlist_ids(request):
    """Return just the product IDs in the wishlist – used to sync heart buttons on every page."""
    ids = list(request.user.wishlist_items.values_list('product_id', flat=True))
    return Response({'ids': ids})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_wishlist_toggle(request):
    """Toggle a product in/out of the wishlist. Returns {status, product_id}."""
    product_id = request.data.get('product_id')
    product = get_object_or_404(Product, id=product_id)
    item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
    if not created:
        item.delete()
        return Response({'status': 'removed', 'product_id': product_id})
    return Response({'status': 'added', 'product_id': product_id}, status=status.HTTP_201_CREATED)


# ─── Newsletter API ───────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def api_newsletter_subscribe(request):
    """Save a subscriber email to NewsletterSubscriber table."""
    email = request.data.get('email', '').strip()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    obj, created = NewsletterSubscriber.objects.get_or_create(email=email)
    if not obj.is_active:
        obj.is_active = True
        obj.save()
    msg = 'Subscribed successfully! 🎉' if created else 'You are already subscribed!'
    return Response({'message': msg}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
