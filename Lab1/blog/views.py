from django.shortcuts import render, redirect
from .models import Article
from django.core.paginator import Paginator
from django.db.models import Q

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



def article_search(request):
    query = request.GET.get('q', '').strip()

    if not query:
        return redirect('article_list')

    results = Article.objects.filter(
        Q(title__icontains=query) |
        Q(text__icontains=query)
    )

    return render(request, 'article/search.html', {
        'results': results,
        'query': query,
        'results_count': results.count(),
    })