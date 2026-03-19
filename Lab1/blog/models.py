from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField("Назва", max_length=100)
    description = models.TextField("Опис", blank=True)

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField("Заголовок", max_length=200)
    text = models.TextField("Текст")
    published_at = models.DateTimeField("Дата публікації", auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
        return self.title