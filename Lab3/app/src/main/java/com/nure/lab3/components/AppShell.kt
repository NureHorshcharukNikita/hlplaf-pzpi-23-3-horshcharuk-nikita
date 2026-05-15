package com.nure.lab3.components

import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.nure.lab3.Tab
import com.nure.lab3.UiKit
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.withMargins
import com.nure.lab3.withTop
import com.nure.lab3.wrap

class AppShell(
    private val activity: AppCompatActivity,
    private val ui: UiKit
) {
    lateinit var content: LinearLayout
        private set

    private lateinit var root: LinearLayout
    private lateinit var statusText: TextView
    private lateinit var progress: ProgressBar
    private lateinit var bottomNav: LinearLayout
    private lateinit var catalogTab: MaterialButton
    private lateinit var cartTab: MaterialButton
    private lateinit var ordersTab: MaterialButton
    private lateinit var recTab: MaterialButton
    private lateinit var logoutButton: MaterialButton

    fun build(container: FrameLayout, onLogout: () -> Unit) {
        container.removeAllViews()

        root = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(ui.dp(18), ui.dp(14), ui.dp(18), ui.dp(12))
            background = GradientDrawable(
                GradientDrawable.Orientation.TOP_BOTTOM,
                intArrayOf(Color.rgb(248, 250, 250), Color.rgb(237, 241, 238))
            )
        }
        container.addView(root, FrameLayout.LayoutParams(match(), match()))

        root.addView(header(onLogout), LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12)))

        progress = ProgressBar(activity).apply { visibility = View.GONE }
        root.addView(
            progress,
            LinearLayout.LayoutParams(wrap(), ui.dp(32)).apply { gravity = Gravity.CENTER_HORIZONTAL }
        )

        val scroll = ScrollView(activity).apply { overScrollMode = View.OVER_SCROLL_NEVER }
        root.addView(scroll, LinearLayout.LayoutParams(match(), 0, 1f))

        content = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, ui.dp(4), 0, ui.dp(16))
        }
        scroll.addView(content, ViewGroup.LayoutParams(match(), wrap()))

        bottomNav = bottomNavigation()
        root.addView(bottomNav, LinearLayout.LayoutParams(match(), ui.dp(76)).withTop(ui.dp(10)))
    }

    fun update(
        isLoggedIn: Boolean,
        status: String,
        currentTab: Tab,
        cartCount: Int,
        onTabSelected: (Tab) -> Unit
    ) {
        statusText.text = status
        logoutButton.visibility = if (isLoggedIn) View.VISIBLE else View.GONE
        bottomNav.visibility = if (isLoggedIn) View.VISIBLE else View.GONE

        cartTab.text = "Кошик ($cartCount)"
        listOf(
            catalogTab to Tab.Catalog,
            cartTab to Tab.Cart,
            ordersTab to Tab.Orders,
            recTab to Tab.Recommendations
        ).forEach { (button, tab) ->
            button.isChecked = currentTab == tab
            button.backgroundTintList = ColorStateList.valueOf(
                if (currentTab == tab) Color.rgb(232, 246, 241) else Color.WHITE
            )
            button.setTextColor(if (currentTab == tab) ui.primary else ui.muted)
            button.setOnClickListener { onTabSelected(tab) }
        }
    }

    fun clearContent() {
        content.removeAllViews()
    }

    fun setLoading(value: Boolean) {
        progress.visibility = if (value) View.VISIBLE else View.GONE
    }

    private fun header(onLogout: () -> Unit) = LinearLayout(activity).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL

        val titleBlock = LinearLayout(context).apply { orientation = LinearLayout.VERTICAL }
        addView(titleBlock, LinearLayout.LayoutParams(0, wrap(), 1f))
        titleBlock.addView(ui.text("Store", 28, ui.ink, Typeface.BOLD))

        statusText = ui.text("", 13, ui.muted, Typeface.NORMAL)
        titleBlock.addView(statusText)

        logoutButton = ui.chip("Вийти").apply { setOnClickListener { onLogout() } }
        addView(logoutButton)
    }

    private fun bottomNavigation() = LinearLayout(activity).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER
        setPadding(ui.dp(6), ui.dp(6), ui.dp(6), ui.dp(6))
        background = ui.rounded(Color.WHITE, ui.dp(24), strokeColor = Color.rgb(224, 232, 228))
        elevation = ui.dp(8).toFloat()

        catalogTab = ui.navButton("Товари")
        cartTab = ui.navButton("Кошик")
        ordersTab = ui.navButton("Замовл.")
        recTab = ui.navButton("Підбір")

        listOf(catalogTab, cartTab, ordersTab, recTab).forEach {
            addView(it, LinearLayout.LayoutParams(0, match(), 1f).withMargins(ui.dp(2)))
        }
    }
}
