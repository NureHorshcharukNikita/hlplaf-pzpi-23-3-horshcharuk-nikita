package com.nure.lab3.components

import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.view.Gravity
import android.widget.LinearLayout
import com.nure.lab3.Order
import com.nure.lab3.UiKit
import com.nure.lab3.match
import com.nure.lab3.orderStatusActions
import com.nure.lab3.withMargins
import com.nure.lab3.withTop
import com.nure.lab3.wrap

fun adminSummaryCard(ui: UiKit, orders: List<Order>): LinearLayout {
    val activeCount = orders.count { it.status != "completed" }
    val completedCount = orders.count { it.status == "completed" }

    return ui.card().apply {
        addView(ui.text("Панель адміністратора", 20, ui.ink, Typeface.BOLD))
        addView(
            ui.text(
                "Усього замовлень: ${orders.size} | Активних: $activeCount | Завершених: $completedCount",
                14,
                ui.muted,
                Typeface.NORMAL
            ).withTop(ui.dp(6))
        )
    }
}

fun adminOrderCard(
    ui: UiKit,
    order: Order,
    onStatusChange: (Order, String) -> Unit
): LinearLayout {
    val card = ui.card()
    val top = LinearLayout(card.context).apply { gravity = Gravity.CENTER_VERTICAL }
    card.addView(top, LinearLayout.LayoutParams(match(), wrap()))
    top.addView(ui.text("Замовлення #${order.id}", 18, ui.ink, Typeface.BOLD), LinearLayout.LayoutParams(0, wrap(), 1f))
    top.addView(ui.statusBadge(order.status))

    val email = order.userEmail ?: "Користувача не вказано"
    card.addView(ui.text("Клієнт: $email", 14, ui.muted, Typeface.NORMAL).withTop(ui.dp(8)))
    card.addView(ui.text("Сума: $${order.total}", 15, ui.primary, Typeface.BOLD).withTop(ui.dp(6)))

    val items = order.items.joinToString(", ") { "${it.name} x${it.quantity}" }.ifBlank { "Позиції не вказані" }
    card.addView(ui.text(items, 14, ui.muted, Typeface.NORMAL).withTop(ui.dp(4)))

    card.addView(ui.text("Змінити статус", 14, ui.ink, Typeface.BOLD).withTop(ui.dp(14)))

    orderStatusActions.chunked(2).forEach { rowActions ->
        val row = LinearLayout(card.context).apply { orientation = LinearLayout.HORIZONTAL }
        card.addView(row, LinearLayout.LayoutParams(match(), ui.dp(44)).withTop(ui.dp(8)))

        rowActions.forEach { action ->
            val active = order.status == action.value
            row.addView(
                ui.secondaryButton(action.label).apply {
                    setTextColor(if (active) Color.WHITE else ui.primary)
                    backgroundTintList = ColorStateList.valueOf(if (active) ui.primary else Color.WHITE)
                    setOnClickListener { onStatusChange(order, action.value) }
                },
                LinearLayout.LayoutParams(0, match(), 1f).withMargins(ui.dp(3))
            )
        }
    }

    return card
}
