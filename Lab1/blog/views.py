from django.shortcuts import render
from .models import Article
from django.core.paginator import Paginator

# Create your views here.
def article_list(request):
    articles = Article.objects.all()
    paginator = Paginator(articles, 1)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    current = page_obj.number
    total = paginator.num_pages

    start = max(current - 2, 1)
    end = min(current + 2, total)

    page_range = range(start, end + 1)

    return render(request, 'article/article_list.html', {
        'page_obj': page_obj,
        'page_range': page_range,
        'total_pages': total,
    })