from .models import Category
from django.db.models import Count


def categories(request):
    """Make categories with products available in every template for nav/footer."""
    return {
        'all_categories': Category.objects.annotate(num_products=Count('products')).filter(num_products__gt=0).order_by('name')
    }

