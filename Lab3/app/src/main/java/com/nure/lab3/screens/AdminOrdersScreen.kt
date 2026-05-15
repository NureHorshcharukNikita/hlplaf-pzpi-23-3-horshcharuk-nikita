package com.nure.lab3.screens

import android.content.Context
import android.widget.LinearLayout
import com.nure.lab3.Order
import com.nure.lab3.UiKit
import com.nure.lab3.components.adminOrderCard
import com.nure.lab3.components.adminSummaryCard
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.withTop
import com.nure.lab3.wrap

data class AdminOrdersScreenState(
    val orders: List<Order>
)

fun renderAdminOrdersScreen(
    context: Context,
    ui: UiKit,
    parent: LinearLayout,
    state: AdminOrdersScreenState,
    onRefresh: () -> Unit,
    onStatusChange: (Order, String) -> Unit
) {
    parent.addView(ui.sectionTitle("Адміністрування", "Керуйте замовленнями користувачів."))
    parent.addView(adminSummaryCard(ui, state.orders), LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12)))

    if (state.orders.isEmpty()) {
        parent.addView(ui.emptyState("Замовлень поки немає", "Нові покупки користувачів з'являться тут."))
    } else {
        state.orders.forEach { order ->
            parent.addView(
                adminOrderCard(ui, order, onStatusChange),
                LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(12))
            )
        }
    }

    parent.addView(
        ui.secondaryButton("Оновити статуси").apply { setOnClickListener { onRefresh() } },
        LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(16))
    )
}
