package com.nure.practice3

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        findViewById<android.view.View>(R.id.sumButton).setOnClickListener {
            startActivity(Intent(this, SumActivity::class.java))
        }
        findViewById<android.view.View>(R.id.calendarButton).setOnClickListener {
            startActivity(Intent(this, EventCalendarActivity::class.java))
        }
        findViewById<android.view.View>(R.id.gameButton).setOnClickListener {
            startActivity(Intent(this, WheelGameActivity::class.java))
        }
        findViewById<android.view.View>(R.id.romanButton).setOnClickListener {
            startActivity(Intent(this, RomanConverterActivity::class.java))
        }
    }
}
