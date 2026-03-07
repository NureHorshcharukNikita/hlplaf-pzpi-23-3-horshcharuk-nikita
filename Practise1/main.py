#Level 1
print("Level 1")

#1. Вивести числа від 1 до 10
print("Вивести числа від 1 до 10")
for i in range(1, 11):
  print(i)

print("")

#Level 2
print("Level 2")

#1. Середнє значення трьох чисел
print("Середнє значення трьох чисел")

a = float(input("Перше число: "))
b = float(input("Друге число: "))
c = float(input("Третє число: "))

average = (a + b + c) / 3
print("Середнє значення:", average)

print("")

#Level 3
print("Level 3")

#3.	Створіть клас "Калькулятор" з методами для додавання, віднімання, множення та ділення. 
# Виведіть результат обчислень для певного прикладу.
class Calculator:

  def add(self, a, b):
    return a + b

  def subtract(self, a, b):
    return a - b

  def multiply(self, a, b):
    return a * b

  def divide(self, a, b):
    return a / b

calculator = Calculator()

print("Введіть два числа для калькулятора")
number1 = float(input("Перше число: "))
number2 = float(input("Друге число: "))

print(f"Додавання ({number1} + {number2}):", calculator.add(number1, number2))
print(f"Віднімання ({number1} - {number2}):", calculator.subtract(number1, number2))
print(f"Множення ({number1} * {number2}):", calculator.multiply(number1, number2))
print(f"Ділення ({number1} / {number2}):", calculator.divide(number1, number2))

print("")

#Level 4
print("Level 4")

#3.	Створіть клас "Книготека" з можливістю додавання та видалення книг, 
# а також виведення списку усіх книг.
class Library:

  def __init__(self):
    self.books = []

  def add_book(self, book):
    self.books.append(book)

  def remove_book(self, book):
    if book in self.books:
      self.books.remove(book)

  def show_books(self):
    for book in self.books:
      print(book)


library = Library()

library.add_book("1984")
library.add_book("Harry Potter")
library.add_book("The Hobbit")

print("До видалення:")
library.show_books()
print("")

library.remove_book("1984")

print("Після видалення:")
library.show_books()