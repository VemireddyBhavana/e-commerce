from django.urls import path
from . import views

urlpatterns = [
    # HTML pages
    path('', views.index, name='home'),
    path('products/', views.product_list, name='product_list'),
    path('products/<slug:slug>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart_page, name='cart'),
    path('checkout/', views.checkout_page, name='checkout'),
    path('orders/', views.orders_page, name='orders'),

    # API endpoints
    path('api/categories/', views.api_categories, name='api_categories'),
    path('api/products/', views.api_products, name='api_products'),
    path('api/products/<slug:slug>/', views.api_product_detail, name='api_product_detail'),
    path('api/cart/', views.api_cart, name='api_cart'),
    path('api/cart/add/', views.api_cart_add, name='api_cart_add'),
    path('api/cart/update/<int:item_id>/', views.api_cart_update, name='api_cart_update'),
    path('api/cart/remove/<int:item_id>/', views.api_cart_remove, name='api_cart_remove'),
    path('api/cart/clear/', views.api_cart_clear, name='api_cart_clear'),
    path('api/orders/', views.api_orders, name='api_orders'),
    path('api/orders/create/', views.api_order_create, name='api_order_create'),
    path('api/orders/<int:order_id>/', views.api_order_detail, name='api_order_detail'),

    # Wishlist API
    path('api/wishlist/', views.api_wishlist, name='api_wishlist'),
    path('api/wishlist/ids/', views.api_wishlist_ids, name='api_wishlist_ids'),
    path('api/wishlist/toggle/', views.api_wishlist_toggle, name='api_wishlist_toggle'),

    # Newsletter API
    path('api/newsletter/subscribe/', views.api_newsletter_subscribe, name='api_newsletter_subscribe'),
]
