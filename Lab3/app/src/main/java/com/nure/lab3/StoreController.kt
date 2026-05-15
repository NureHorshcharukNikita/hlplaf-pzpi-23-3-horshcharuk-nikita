package com.nure.lab3

import com.nure.lab3.screens.CartScreenState
import com.nure.lab3.screens.CatalogScreenState
import com.nure.lab3.screens.OrdersScreenState
import com.nure.lab3.screens.RecommendationsScreenState

class StoreController(
    private val state: StoreState,
    private val api: StoreApi,
    private val setLoading: (Boolean) -> Unit,
    private val toast: (String) -> Unit,
    private val render: () -> Unit
) {
    var currentTab = Tab.Catalog
        private set

    var authPage = AuthPage.Login
        private set

    private var productsCache = emptyList<Product>()
    private var productsTotal = 0
    private var recommendationsCache = emptyList<Product>()
    private var ordersCache = emptyList<Order>()
    private var catalogErrorMessage: String? = null
    private var recommendationsErrorMessage: String? = null
    private var cacheLoadedAt = 0L
    private var searchText = ""
    private val productPageSize = 3

    val isLoggedIn: Boolean
        get() = state.token != null

    val cartCount: Int
        get() = state.cartCount

    val headerStatus: String
        get() = if (isLoggedIn) {
            "Каталог товарів, кошик і ваші замовлення"
        } else {
            "Увійдіть, щоб переглядати товари та замовлення"
        }

    val catalogState: CatalogScreenState
        get() = CatalogScreenState(
            products = catalogProducts(),
            searchText = searchText,
            loadedCount = productsCache.size,
            totalCount = productsTotal,
            errorMessage = catalogErrorMessage
        )

    val cartState: CartScreenState
        get() = CartScreenState(state.cartLines.toList(), state.cartTotal)

    val ordersState: OrdersScreenState
        get() = OrdersScreenState(ordersCache)

    val recommendationsState: RecommendationsScreenState
        get() = RecommendationsScreenState(
            products = recommendationsCache,
            errorMessage = recommendationsErrorMessage
        )

    fun loadInitialData() {
        if (state.token != null) {
            loadProducts(force = false)
            loadOrders()
            loadRecommendations()
        }
    }

    fun showLogin() {
        authPage = AuthPage.Login
        render()
    }

    fun showRegister() {
        authPage = AuthPage.Register
        render()
    }

    fun selectTab(tab: Tab) {
        currentTab = tab
        if (tab == Tab.Orders) loadOrders()
        if (tab == Tab.Recommendations) loadRecommendations()
        render()
    }

    fun logout() {
        state.logout()
        ordersCache = emptyList()
        recommendationsCache = emptyList()
        toast("Сесію завершено")
        render()
    }

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) return toast("Введи email і пароль")

        setLoading(true)
        api.login(email, password) { result ->
            setLoading(false)
            result.onSuccess { token ->
                state.saveToken(token)
                currentTab = Tab.Catalog
                authPage = AuthPage.Login
                toast("Вхід виконано")
                loadProducts(force = true)
                loadOrders(force = true)
                loadRecommendations(force = true)
                render()
            }.onFailure { toast("Не вдалося увійти: ${it.message}") }
        }
    }

    fun register(email: String, password: String) {
        if (email.isBlank() || password.length < 4) {
            return toast("Пароль має містити мінімум 4 символи")
        }

        setLoading(true)
        api.register(email, password) { result ->
            setLoading(false)
            result.onSuccess {
                toast("Користувача створено")
                authPage = AuthPage.Login
                login(email, password)
            }.onFailure { toast("Реєстрація не виконана: ${it.message}") }
        }
    }

    fun loadProducts(force: Boolean) {
        val freshCache = productsCache.isNotEmpty() && System.currentTimeMillis() - cacheLoadedAt < 5 * 60 * 1000
        if (!force && freshCache) {
            render()
            return
        }

        setLoading(true)
        api.getProducts(productPageSize, 0) { result ->
            setLoading(false)
            result.onSuccess { page ->
                productsCache = page.items
                productsTotal = page.total
                catalogErrorMessage = null
                cacheLoadedAt = System.currentTimeMillis()
                render()
            }.onFailure {
                if (force) productsCache = emptyList()
                productsTotal = productsCache.size
                catalogErrorMessage = "Перевірте підключення до інтернету або доступність сервера."
                render()
            }
        }
    }

    fun loadMoreProducts() {
        if (productsCache.size >= productsTotal) return

        setLoading(true)
        api.getProducts(productPageSize, productsCache.size) { result ->
            setLoading(false)
            result.onSuccess { page ->
                val existingIds = productsCache.map { it.id }.toSet()
                productsCache = productsCache + page.items.filterNot { existingIds.contains(it.id) }
                productsTotal = page.total
                catalogErrorMessage = null
                cacheLoadedAt = System.currentTimeMillis()
                render()
            }.onFailure {
                catalogErrorMessage = "Не вдалося завантажити наступні товари."
                toast("Не вдалося завантажити товари")
                render()
            }
        }
    }

    fun applySearch(query: String) {
        searchText = query.trim()

        if (searchText.isBlank()) {
            render()
            return
        }

        if (productsTotal > productsCache.size) {
            loadAllProductsForSearch()
        } else {
            render()
        }
    }

    fun clearSearch() {
        searchText = ""
        loadProducts(force = true)
    }

    fun loadOrders(force: Boolean = false) {
        val token = state.token ?: return
        if (!force && ordersCache.isNotEmpty()) return

        setLoading(true)
        api.getOrders(token) { result ->
            setLoading(false)
            result.onSuccess {
                ordersCache = it
                if (currentTab == Tab.Orders) render()
            }.onFailure { toast("Статуси не завантажено: ${it.message}") }
        }
    }

    fun loadRecommendations(force: Boolean = false) {
        val token = state.token ?: return
        if (!force && recommendationsCache.isNotEmpty()) return

        setLoading(true)
        api.getRecommendations(token) { result ->
            setLoading(false)
            result.onSuccess {
                recommendationsCache = it
                recommendationsErrorMessage = null
                if (currentTab == Tab.Recommendations) render()
            }.onFailure {
                recommendationsErrorMessage = "Рекомендації завантажуються з сервера після покупок користувачів."
                if (currentTab == Tab.Recommendations) render()
            }
        }
    }

    fun checkout() {
        val token = state.token ?: return toast("Спочатку авторизуйся")
        if (state.cartLines.isEmpty()) return toast("Кошик порожній")

        setLoading(true)
        api.createOrder(token, state.cartLines) { result ->
            setLoading(false)
            result.onSuccess {
                state.clearCart()
                ordersCache = emptyList()
                currentTab = Tab.Orders
                toast("Замовлення оформлено")
                loadOrders(force = true)
                render()
            }.onFailure { toast("Не вдалося оформити: ${it.message}") }
        }
    }

    fun addToCart(product: Product) {
        state.addToCart(product)
        toast("${product.name} додано")
        render()
    }

    fun changeQuantity(product: Product, delta: Int) {
        state.changeQuantity(product, delta)
        render()
    }

    fun removeFromCart(productId: Int) {
        state.removeFromCart(productId)
        render()
    }

    private fun loadAllProductsForSearch() {
        val limit = if (productsTotal > 0) productsTotal else 50

        setLoading(true)
        api.getProducts(limit, 0) { result ->
            setLoading(false)
            result.onSuccess { page ->
                productsCache = page.items
                productsTotal = page.total
                catalogErrorMessage = null
                cacheLoadedAt = System.currentTimeMillis()
                render()
            }.onFailure {
                catalogErrorMessage = "Пошук недоступний. Перевірте підключення."
                render()
            }
        }
    }

    private fun catalogProducts(): List<Product> {
        return if (searchText.isBlank()) {
            productsCache
        } else {
            productsCache.filter {
                it.name.contains(searchText, ignoreCase = true) ||
                    it.description.contains(searchText, ignoreCase = true)
            }
        }
    }
}
