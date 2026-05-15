package com.nure.lab3

enum class Tab {
    Catalog,
    Cart,
    Orders,
    Recommendations
}

enum class AuthPage {
    Login,
    Register
}

data class Product(
    val id: Int,
    val name: String,
    val price: Int,
    val description: String,
    val stock: Int
)

data class ProductPage(
    val items: List<Product>,
    val total: Int
)

data class UserSession(
    val id: Int,
    val email: String,
    val role: String
) {
    val isAdmin: Boolean
        get() = role == "admin"
}

data class CartLine(
    val product: Product,
    val quantity: Int
)

data class Order(
    val id: Int,
    val total: Int,
    val status: String,
    val userEmail: String?,
    val items: List<OrderItem>
)

data class OrderItem(
    val name: String,
    val quantity: Int
)
