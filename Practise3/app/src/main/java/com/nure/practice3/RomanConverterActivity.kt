package com.nure.practice3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class RomanConverterActivity : AppCompatActivity() {
    private val romanValues = mapOf(
        'I' to 1,
        'V' to 5,
        'X' to 10,
        'L' to 50,
        'C' to 100,
        'D' to 500,
        'M' to 1000
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_roman_converter)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.romanMain)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val romanEditText = findViewById<EditText>(R.id.romanEditText)
        val resultTextView = findViewById<TextView>(R.id.romanResultTextView)

        findViewById<Button>(R.id.convertRomanButton).setOnClickListener {
            val romanNumber = romanEditText.text.toString().trim().uppercase()
            val result = romanToArabic(romanNumber)
            resultTextView.text = result?.let {
                getString(R.string.roman_result_format, it)
            } ?: getString(R.string.invalid_roman_number)
        }
    }

    private fun romanToArabic(roman: String): Int? {
        if (roman.isBlank() || roman.any { it !in romanValues }) return null

        var result = 0
        var previousValue = 0

        for (char in roman.reversed()) {
            val currentValue = romanValues[char] ?: return null
            if (currentValue < previousValue) {
                result -= currentValue
            } else {
                result += currentValue
                previousValue = currentValue
            }
        }

        return result.takeIf { it > 0 }
    }
}
