package com.nure.lab3

import android.content.Context
import kotlin.math.max

class StoreState(context: Context) {
    private val prefs = context.getSharedPreferences("lab3_store", Context.MODE_PRIVATE)
    private val cart = linkedMapOf<Int, CartLine>()

    var token: String? = prefs.getString("token", null)
        private set

    val user: UserSession?
        get() = parseUserSession(token)

    val isAdmin: Boolean
        get() = user?.isAdmin == true

    val cartLines: Collection<CartLine>
        get() = cart.values

    val cartCount: Int
        get() = cart.values.sumOf { it.quantity }

    val cartTotal: Int
        get() = cart.values.sumOf { it.product.price * it.quantity }

    fun saveToken(value: String) {
        token = value
        prefs.edit().putString("token", value).apply()
    }

    fun logout() {
        token = null
        prefs.edit().remove("token").apply()
    }

    fun addToCart(product: Product) {
        cart[product.id] = cart[product.id]?.copy(quantity = cart[product.id]!!.quantity + 1)
            ?: CartLine(product, 1)
    }

    fun changeQuantity(product: Product, delta: Int) {
        val current = cart[product.id] ?: return
        val next = current.copy(quantity = max(0, current.quantity + delta))

        if (next.quantity == 0) {
            cart.remove(product.id)
        } else {
            cart[product.id] = next
        }
    }

    fun removeFromCart(productId: Int) {
        cart.remove(productId)
    }

    fun clearCart() {
        cart.clear()
    }
}
