package com.nure.lab3

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import com.google.android.material.button.MaterialButton

class UiKit(private val context: Context) {
    val ink = Color.rgb(24, 33, 47)
    val muted = Color.rgb(102, 112, 133)
    val primary = Color.rgb(11, 107, 87)
    val accent = Color.rgb(216, 122, 54)

    fun dp(value: Int) = (value * context.resources.displayMetrics.density).toInt()

    fun card() = LinearLayout(context).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(16), dp(16), dp(16), dp(16))
        background = rounded(Color.WHITE, dp(18), strokeColor = Color.rgb(226, 232, 230))
        elevation = dp(2).toFloat()
    }

    fun productArt(product: Product) = TextView(context).apply {
        val palette = listOf(primary, accent, Color.rgb(42, 64, 92), Color.rgb(117, 81, 50))
        text = product.name.take(1)
        gravity = Gravity.CENTER
        setTextColor(Color.WHITE)
        textSize = 28f
        typeface = Typeface.DEFAULT_BOLD
        background = rounded(palette[product.id % palette.size], dp(16))
    }

    fun sectionTitle(title: String, subtitle: String) = LinearLayout(context).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(0, dp(4), 0, dp(12))
        addView(text(title, 22, ink, Typeface.BOLD))
        addView(text(subtitle, 14, muted, Typeface.NORMAL).withTop(dp(4)))
    }

    fun emptyState(title: String, subtitle: String) = card().apply {
        gravity = Gravity.CENTER
        setPadding(dp(20), dp(28), dp(20), dp(28))
        addView(text(title, 20, ink, Typeface.BOLD).apply { gravity = Gravity.CENTER })
        addView(text(subtitle, 14, muted, Typeface.NORMAL).apply { gravity = Gravity.CENTER }.withTop(dp(6)))
    }

    fun statusBadge(status: String) = text(status.uppercase(), 12, Color.WHITE, Typeface.BOLD).apply {
        setPadding(dp(10), dp(6), dp(10), dp(6))
        background = rounded(
            when (status.lowercase()) {
                "pending" -> accent
                "shipped", "processing" -> Color.rgb(42, 64, 92)
                "completed", "delivered" -> primary
                else -> muted
            },
            dp(18)
        )
    }

    fun text(value: String, sp: Int, color: Int, style: Int) = TextView(context).apply {
        text = value
        textSize = sp.toFloat()
        setTextColor(color)
        typeface = Typeface.create(Typeface.DEFAULT, style)
        includeFontPadding = true
    }

    fun input(hintValue: String, type: Int) = EditText(context).apply {
        hint = hintValue
        inputType = type
        textSize = 15f
        setSingleLine(true)
        setPadding(dp(14), 0, dp(14), 0)
        background = rounded(Color.WHITE, dp(14), strokeColor = Color.rgb(218, 225, 222))
    }

    fun tabButton(label: String) = MaterialButton(context).apply {
        text = label
        textSize = 12f
        isCheckable = true
        cornerRadius = dp(14)
        insetTop = 0
        insetBottom = 0
        setTextColor(ink)
        backgroundTintList = ColorStateList.valueOf(Color.WHITE)
        strokeColor = ColorStateList.valueOf(Color.rgb(220, 228, 224))
        strokeWidth = dp(1)
    }

    fun navButton(label: String) = MaterialButton(context).apply {
        text = label
        textSize = 13f
        isAllCaps = false
        isCheckable = true
        cornerRadius = dp(18)
        insetTop = 0
        insetBottom = 0
        minWidth = 0
        minimumWidth = 0
        setPadding(dp(4), 0, dp(4), 0)
        setTextColor(muted)
        backgroundTintList = ColorStateList.valueOf(Color.WHITE)
    }

    fun primaryButton(label: String) = MaterialButton(context).apply {
        text = label
        textSize = 14f
        cornerRadius = dp(14)
        insetTop = 0
        insetBottom = 0
        setTextColor(Color.WHITE)
        backgroundTintList = ColorStateList.valueOf(primary)
    }

    fun secondaryButton(label: String) = MaterialButton(context).apply {
        text = label
        textSize = 14f
        cornerRadius = dp(14)
        insetTop = 0
        insetBottom = 0
        setTextColor(primary)
        backgroundTintList = ColorStateList.valueOf(Color.WHITE)
        strokeColor = ColorStateList.valueOf(primary)
        strokeWidth = dp(1)
    }

    fun chip(label: String) = MaterialButton(context).apply {
        text = label
        textSize = 12f
        minWidth = 0
        minimumWidth = 0
        cornerRadius = dp(14)
        insetTop = 0
        insetBottom = 0
        setPadding(dp(12), 0, dp(12), 0)
        setTextColor(ink)
        backgroundTintList = ColorStateList.valueOf(Color.rgb(241, 245, 243))
    }

    fun iconChip(label: String) = MaterialButton(context).apply {
        text = label
        textSize = 14f
        minWidth = 0
        minimumWidth = 0
        cornerRadius = dp(16)
        insetTop = 0
        insetBottom = 0
        setPadding(0, 0, 0, 0)
        setTextColor(ink)
        backgroundTintList = ColorStateList.valueOf(Color.rgb(241, 245, 243))
    }

    fun rounded(color: Int, radius: Int, strokeColor: Int? = null) = GradientDrawable().apply {
        setColor(color)
        cornerRadius = radius.toFloat()
        strokeColor?.let { setStroke(dp(1), it) }
    }
}

fun match() = ViewGroup.LayoutParams.MATCH_PARENT

fun wrap() = ViewGroup.LayoutParams.WRAP_CONTENT

fun <T : View> T.withTop(top: Int): T {
    layoutParams = LinearLayout.LayoutParams(match(), wrap()).withTop(top)
    return this
}

fun LinearLayout.LayoutParams.withTop(top: Int): LinearLayout.LayoutParams {
    topMargin = top
    return this
}

fun LinearLayout.LayoutParams.withBottom(bottom: Int): LinearLayout.LayoutParams {
    bottomMargin = bottom
    return this
}

fun LinearLayout.LayoutParams.withMargins(
    left: Int = 0,
    top: Int = 0,
    right: Int = 0,
    bottom: Int = 0
): LinearLayout.LayoutParams {
    setMargins(left, top, right, bottom)
    return this
}
