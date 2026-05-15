package com.nure.lab3.components

import android.content.Context
import android.graphics.Typeface
import android.view.Gravity
import android.view.View
import android.widget.LinearLayout
import com.nure.lab3.CartLine
import com.nure.lab3.Order
import com.nure.lab3.Product
import com.nure.lab3.UiKit
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.withMargins
import com.nure.lab3.withTop
import com.nure.lab3.wrap

fun productCard(
    context: Context,
    ui: UiKit,
    product: Product,
    onAddToCart: (Product) -> Unit
): LinearLayout {
    val card = ui.card()
    val row = LinearLayout(context).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.TOP
    }
    card.addView(row)

    row.addView(
        ui.productArt(product),
        LinearLayout.LayoutParams(ui.dp(72), ui.dp(72)).withMargins(0, 0, ui.dp(12), 0)
    )

    val info = LinearLayout(context).apply { orientation = LinearLayout.VERTICAL }
    row.addView(info, LinearLayout.LayoutParams(0, wrap(), 1f))
    info.addView(ui.text(product.name, 18, ui.ink, Typeface.BOLD))
    info.addView(ui.text(product.description, 14, ui.muted, Typeface.NORMAL).withTop(ui.dp(3)))
    info.addView(ui.text("$${product.price}", 15, ui.primary, Typeface.BOLD).withTop(ui.dp(8)))

    card.addView(
        ui.primaryButton("До кошика").apply { setOnClickListener { onAddToCart(product) } },
        LinearLayout.LayoutParams(match(), ui.dp(48)).withTop(ui.dp(14))
    )
    return card
}

fun cartLineCard(
    context: Context,
    ui: UiKit,
    line: CartLine,
    onChangeQuantity: (Product, Int) -> Unit,
    onRemove: (Int) -> Unit
): LinearLayout {
    val card = ui.card()
    card.setPadding(ui.dp(20), ui.dp(18), ui.dp(20), ui.dp(18))

    val row = LinearLayout(context).apply { gravity = Gravity.CENTER_VERTICAL }
    card.addView(row, LinearLayout.LayoutParams(match(), wrap()))
    row.addView(ui.text(line.product.name, 17, ui.ink, Typeface.BOLD), LinearLayout.LayoutParams(0, wrap(), 1f))
    row.addView(ui.text("$${line.product.price * line.quantity}", 17, ui.primary, Typeface.BOLD))

    val controls = LinearLayout(context).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
    }
    card.addView(controls, LinearLayout.LayoutParams(match(), ui.dp(48)).withTop(ui.dp(12)))
    controls.addView(
        ui.iconChip("-").apply { setOnClickListener { onChangeQuantity(line.product, -1) } },
        LinearLayout.LayoutParams(ui.dp(42), ui.dp(42))
    )
    controls.addView(
        ui.text("${line.quantity} шт.", 16, ui.ink, Typeface.BOLD).apply { gravity = Gravity.CENTER },
        LinearLayout.LayoutParams(ui.dp(74), match()).withMargins(ui.dp(8), 0, ui.dp(8), 0)
    )
    controls.addView(
        ui.iconChip("+").apply { setOnClickListener { onChangeQuantity(line.product, 1) } },
        LinearLayout.LayoutParams(ui.dp(42), ui.dp(42))
    )
    controls.addView(View(context), LinearLayout.LayoutParams(0, 1, 1f))
    controls.addView(
        ui.chip("Видалити").apply { setOnClickListener { onRemove(line.product.id) } },
        LinearLayout.LayoutParams(ui.dp(112), ui.dp(42))
    )

    return card
}

fun orderCard(ui: UiKit, order: Order): LinearLayout {
    val card = ui.card()
    val top = LinearLayout(card.context).apply { gravity = Gravity.CENTER_VERTICAL }
    card.addView(top, LinearLayout.LayoutParams(match(), wrap()))
    top.addView(ui.text("Замовлення #${order.id}", 18, ui.ink, Typeface.BOLD), LinearLayout.LayoutParams(0, wrap(), 1f))
    top.addView(ui.statusBadge(order.status))
    card.addView(ui.text("Сума: $${order.total}", 15, ui.primary, Typeface.BOLD).withTop(ui.dp(6)))

    val items = order.items.joinToString(", ") { "${it.name} x${it.quantity}" }.ifBlank { "Позиції не вказані" }
    card.addView(ui.text(items, 14, ui.muted, Typeface.NORMAL).withTop(ui.dp(4)))

    return card
}

fun retryCard(
    ui: UiKit,
    title: String,
    message: String,
    retry: () -> Unit
): LinearLayout {
    return ui.card().apply {
        setPadding(ui.dp(20), ui.dp(24), ui.dp(20), ui.dp(24))
        addView(ui.text(title, 20, ui.ink, Typeface.BOLD).apply { gravity = Gravity.CENTER })
        addView(ui.text(message, 14, ui.muted, Typeface.NORMAL).apply { gravity = Gravity.CENTER }.withTop(ui.dp(8)))
        addView(
            ui.primaryButton("Повторити").apply { setOnClickListener { retry() } },
            LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(16))
        )
    }
}
