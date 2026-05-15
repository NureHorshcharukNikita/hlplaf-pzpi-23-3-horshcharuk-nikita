package com.nure.lab3.screens

import android.content.Context
import android.graphics.Typeface
import android.text.InputType
import android.widget.LinearLayout
import com.nure.lab3.UiKit
import com.nure.lab3.match
import com.nure.lab3.withBottom
import com.nure.lab3.withTop
import com.nure.lab3.wrap

fun renderLoginScreen(
    context: Context,
    ui: UiKit,
    parent: LinearLayout,
    onLogin: (String, String) -> Unit,
    onShowRegister: () -> Unit
) {
    val card = ui.card()
    parent.addView(card, LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(14)))
    card.addView(ui.text("Вхід", 22, ui.ink, Typeface.BOLD))
    card.addView(ui.text("Увійдіть у свій акаунт, щоб перейти до магазину.", 14, ui.muted, Typeface.NORMAL).withTop(ui.dp(4)))

    val email = ui.input("Email", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS)
    val password = ui.input("Пароль", InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD)
    card.addView(email, LinearLayout.LayoutParams(match(), ui.dp(54)).withTop(ui.dp(12)))
    card.addView(password, LinearLayout.LayoutParams(match(), ui.dp(54)).withTop(ui.dp(8)))

    card.addView(
        ui.primaryButton("Увійти").apply { setOnClickListener { onLogin(email.text.toString(), password.text.toString()) } },
        LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(12))
    )
    card.addView(
        ui.secondaryButton("Створити акаунт").apply { setOnClickListener { onShowRegister() } },
        LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(10))
    )
}

fun renderRegisterScreen(
    context: Context,
    ui: UiKit,
    parent: LinearLayout,
    onRegister: (String, String) -> Unit,
    onShowLogin: () -> Unit
) {
    val card = ui.card()
    parent.addView(card, LinearLayout.LayoutParams(match(), wrap()).withBottom(ui.dp(14)))
    card.addView(ui.text("Реєстрація", 22, ui.ink, Typeface.BOLD))
    card.addView(ui.text("Створіть акаунт для оформлення замовлень.", 14, ui.muted, Typeface.NORMAL).withTop(ui.dp(4)))

    val email = ui.input("Email", InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS)
    val password = ui.input("Пароль", InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD)
    card.addView(email, LinearLayout.LayoutParams(match(), ui.dp(54)).withTop(ui.dp(12)))
    card.addView(password, LinearLayout.LayoutParams(match(), ui.dp(54)).withTop(ui.dp(8)))

    card.addView(
        ui.primaryButton("Зареєструватися").apply {
            setOnClickListener { onRegister(email.text.toString(), password.text.toString()) }
        },
        LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(12))
    )
    card.addView(
        ui.secondaryButton("У мене вже є акаунт").apply { setOnClickListener { onShowLogin() } },
        LinearLayout.LayoutParams(match(), ui.dp(50)).withTop(ui.dp(10))
    )
}
