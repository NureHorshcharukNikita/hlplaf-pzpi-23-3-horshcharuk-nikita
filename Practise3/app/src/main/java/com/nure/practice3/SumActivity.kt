package com.nure.practice3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class SumActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_sum)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.sumMain)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val firstNumberEditText = findViewById<EditText>(R.id.firstNumberEditText)
        val secondNumberEditText = findViewById<EditText>(R.id.secondNumberEditText)
        val resultTextView = findViewById<TextView>(R.id.sumResultTextView)

        findViewById<Button>(R.id.calculateSumButton).setOnClickListener {
            val firstNumber = firstNumberEditText.text.toString().replace(',', '.').toDoubleOrNull()
            val secondNumber = secondNumberEditText.text.toString().replace(',', '.').toDoubleOrNull()

            if (firstNumber == null || secondNumber == null) {
                resultTextView.text = getString(R.string.invalid_numbers)
            } else {
                resultTextView.text = getString(R.string.sum_result_format, (firstNumber + secondNumber).toString())
            }
        }
    }
}
