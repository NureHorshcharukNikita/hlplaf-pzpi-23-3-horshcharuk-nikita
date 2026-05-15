package com.nure.lab3

import android.os.Bundle
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.nure.lab3.components.AppShell
import com.nure.lab3.screens.renderCartScreen
import com.nure.lab3.screens.renderCatalogScreen
import com.nure.lab3.screens.renderLoginScreen
import com.nure.lab3.screens.renderOrdersScreen
import com.nure.lab3.screens.renderRecommendationsScreen
import com.nure.lab3.screens.renderRegisterScreen

class MainActivity : AppCompatActivity() {
    private val state by lazy { StoreState(this) }
    private val api = StoreApi()
    private val ui by lazy { UiKit(this) }
    private val shell by lazy { AppShell(this, ui) }
    private lateinit var controller: StoreController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { view, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        controller = StoreController(
            state = state,
            api = api,
            setLoading = shell::setLoading,
            toast = ::toast,
            render = ::render
        )
        shell.build(findViewById<FrameLayout>(R.id.appContainer), controller::logout)
        render()
        controller.loadInitialData()
    }

    private fun render() {
        shell.update(
            isLoggedIn = controller.isLoggedIn,
            status = controller.headerStatus,
            currentTab = controller.currentTab,
            cartCount = controller.cartCount,
            onTabSelected = controller::selectTab
        )

        shell.clearContent()

        if (!controller.isLoggedIn) {
            renderAuth()
            return
        }

        when (controller.currentTab) {
            Tab.Catalog -> renderCatalogScreen(
                context = this,
                ui = ui,
                parent = shell.content,
                state = controller.catalogState,
                onSearch = controller::applySearch,
                onClear = controller::clearSearch,
                onLoadMore = controller::loadMoreProducts,
                onRefresh = { controller.loadProducts(force = true) },
                onAddToCart = controller::addToCart
            )

            Tab.Cart -> renderCartScreen(
                context = this,
                ui = ui,
                parent = shell.content,
                state = controller.cartState,
                onChangeQuantity = controller::changeQuantity,
                onRemove = controller::removeFromCart,
                onCheckout = controller::checkout
            )

            Tab.Orders -> renderOrdersScreen(
                context = this,
                ui = ui,
                parent = shell.content,
                state = controller.ordersState,
                onRefresh = { controller.loadOrders(force = true) }
            )

            Tab.Recommendations -> renderRecommendationsScreen(
                context = this,
                ui = ui,
                parent = shell.content,
                state = controller.recommendationsState,
                onRefresh = { controller.loadRecommendations(force = true) },
                onAddToCart = controller::addToCart
            )
        }
    }

    private fun renderAuth() {
        when (controller.authPage) {
            AuthPage.Login -> renderLoginScreen(
                context = this,
                ui = ui,
                parent = shell.content,
                onLogin = controller::login,
                onShowRegister = controller::showRegister
            )

            AuthPage.Register -> renderRegisterScreen(
                context = this,
                ui = ui,
                parent = shell.content,
                onRegister = controller::register,
                onShowLogin = controller::showLogin
            )
        }
    }

    private fun toast(value: String) {
        Toast.makeText(this, value, Toast.LENGTH_SHORT).show()
    }
}
