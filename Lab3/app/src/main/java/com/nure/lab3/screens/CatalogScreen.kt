package com.nure.lab3.screens

import android.content.Context
import android.text.InputType
import android.view.Gravity
import android.widget.LinearLayout
import com.nure.lab3.Product
import com.nure.lab3.UiKit
import com.nure.lab3.components.productCard
import com.nure.lab3.components.retryCard
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.withMargins
import com.nure.lab3.withTop
import com.nure.lab3.wrap

data class CatalogScreenState(
    val products: List<Product>,
    val searchText: String,
    val loadedCount: Int,
    val totalCount: Int,
    val errorMessage: String?
)

fun renderCatalogScreen(
    context: Context,
    ui: UiKit,
    parent: LinearLayout,
    state: CatalogScreenState,
    onSearch: (String) -> Unit,
    onClear: () -> Unit,
    onLoadMore: () -> Unit,
    onRefresh: () -> Unit,
    onAddToCart: (Product) -> Unit
) {
    parent.addView(ui.sectionTitle("Каталог товарів", "Обирайте товари та додавайте їх у кошик."))

    val search = ui.input("Пошук товару", InputType.TYPE_CLASS_TEXT).apply {
        setText(state.searchText)
        setOnEditorActionListener { _, _, _ ->
            onSearch(text.toString())
            true
        }
    }
    parent.addView(search, LinearLayout.LayoutParams(match(), ui.dp(52)).withBottom(ui.dp(12)))

    val searchActions = LinearLayout(context).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
    }
    parent.addView(searchActions, LinearLayout.LayoutParams(match(), ui.dp(46)).withBottom(ui.dp(12)))
    searchActions.addView(
        ui.primaryButton("Знайти").apply { setOnClickListener { onSearch(search.text.toString()) } },
        LinearLayout.LayoutParams(0, match(), 1f).withMargins(0, 0, ui.dp(6), 0)
    )
    searchActions.addView(
        ui.secondaryButton("Очистити").apply { setOnClickListener { onClear() } },
        LinearLayout.LayoutParams(0, match(), 1f).withMargins(ui.dp(6), 0, 0, 0)
    )

    val catalogError = state.errorMessage
    if (catalogError != null && state.products.isEmpty()) {
        parent.addView(retryCard(ui, "Каталог недоступний", catalogError, onRefresh))
        return
    }

    if (state.products.isEmpty() && state.searchText.isNotBlank()) {
        parent.addView(ui.emptyState("Нічого не знайдено", "Спробуйте змінити запит."))
    } else if (state.products.isEmpty()) {
        parent.addView(retryCard(ui, "Каталог порожній", "Не вдалося завантажити товари.", onRefresh))
    } else {
        state.products.forEach { product ->
            parent.addView(
                productCard(context, ui, product, onAddToCart),
                LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12))
            )
        }
    }

    if (state.searchText.isBlank() && state.loadedCount < state.totalCount) {
        parent.addView(
            ui.secondaryButton("Показати більше").apply { setOnClickListener { onLoadMore() } },
            LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(2))
        )
    }

    parent.addView(
        ui.secondaryButton("Оновити").apply { setOnClickListener { onRefresh() } },
        LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(10))
    )
}
