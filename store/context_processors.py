from .models import Category


def categories(request):
    """Make all categories available in every template for nav/footer."""
    return {
        'all_categories': Category.objects.all()
    }
