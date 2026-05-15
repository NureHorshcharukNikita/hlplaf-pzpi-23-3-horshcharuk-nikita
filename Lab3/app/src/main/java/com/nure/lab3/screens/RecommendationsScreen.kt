package com.nure.lab3.screens

import android.content.Context
import android.widget.LinearLayout
import com.nure.lab3.Product
import com.nure.lab3.UiKit
import com.nure.lab3.components.productCard
import com.nure.lab3.components.retryCard
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.wrap

data class RecommendationsScreenState(
    val products: List<Product>,
    val errorMessage: String?
)

fun renderRecommendationsScreen(
    context: Context,
    ui: UiKit,
    parent: LinearLayout,
    state: RecommendationsScreenState,
    onRefresh: () -> Unit,
    onAddToCart: (Product) -> Unit
) {
    parent.addView(ui.sectionTitle("Рекомендації", "Товари, які можуть вам сподобатися."))

    if (state.products.isEmpty()) {
        parent.addView(
            retryCard(
                ui = ui,
                title = "Рекомендації недоступні",
                message = state.errorMessage ?: "Поки немає даних для рекомендацій.",
                retry = onRefresh
            ),
            LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12))
        )
    } else {
        state.products.forEach { product ->
            parent.addView(
                productCard(context, ui, product, onAddToCart),
                LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12))
            )
        }
    }

    parent.addView(
        ui.secondaryButton("Оновити рекомендації").apply { setOnClickListener { onRefresh() } },
        LinearLayout.LayoutParams(match(), ui.dp(50))
    )
}
