package com.nure.lab3.screens

import android.content.Context
import android.widget.LinearLayout
import com.nure.lab3.Order
import com.nure.lab3.UiKit
import com.nure.lab3.components.orderCard
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.withTop
import com.nure.lab3.wrap

data class OrdersScreenState(
    val orders: List<Order>
)

fun renderOrdersScreen(
    context: Context,
    ui: UiKit,
    parent: LinearLayout,
    state: OrdersScreenState,
    onRefresh: () -> Unit
) {
    parent.addView(ui.sectionTitle("Замовлення", "Відстежуйте статус оформлених покупок."))

    if (state.orders.isEmpty()) {
        parent.addView(ui.emptyState("Замовлень поки немає", "Оформи перше замовлення з кошика."))
    } else {
        state.orders.forEach { order ->
            parent.addView(orderCard(ui, order), LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12)))
        }
    }

    parent.addView(
        ui.secondaryButton("Оновити статуси").apply { setOnClickListener { onRefresh() } },
        LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(16))
    )
}
