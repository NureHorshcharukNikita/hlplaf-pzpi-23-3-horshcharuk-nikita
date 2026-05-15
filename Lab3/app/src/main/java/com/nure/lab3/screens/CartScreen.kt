package com.nure.lab3.screens

import android.content.Context
import android.graphics.Typeface
import android.widget.LinearLayout
import com.nure.lab3.CartLine
import com.nure.lab3.Product
import com.nure.lab3.UiKit
import com.nure.lab3.components.cartLineCard
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.withTop
import com.nure.lab3.wrap

data class CartScreenState(
    val lines: List<CartLine>,
    val total: Int
)

fun renderCartScreen(
    context: Context,
    ui: UiKit,
    parent: LinearLayout,
    state: CartScreenState,
    onChangeQuantity: (Product, Int) -> Unit,
    onRemove: (Int) -> Unit,
    onCheckout: () -> Unit
) {
    parent.addView(ui.sectionTitle("Кошик", "Перевірте товари перед оформленням замовлення."))

    if (state.lines.isEmpty()) {
        parent.addView(ui.emptyState("Кошик порожній", "Додай товари з каталогу, щоб перейти до оформлення."))
        return
    }

    state.lines.forEach { line ->
        parent.addView(
            cartLineCard(context, ui, line, onChangeQuantity, onRemove),
            LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12))
        )
    }

    val summary = ui.card()
    summary.setPadding(ui.dp(20), ui.dp(20), ui.dp(20), ui.dp(20))
    parent.addView(summary, LinearLayout.LayoutParams(match(), wrap()).withTop(ui.dp(2)))
    summary.addView(ui.text("Разом: $${state.total}", 22, ui.ink, Typeface.BOLD))
    summary.addView(
        ui.primaryButton("Оформити замовлення").apply { setOnClickListener { onCheckout() } },
        LinearLayout.LayoutParams(match(), ui.dp(54)).withTop(ui.dp(16))
    )
}
