package com.nure.practice3

import android.content.Context
import android.os.Bundle
import android.widget.Button
import android.widget.CalendarView
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class EventCalendarActivity : AppCompatActivity() {
    private companion object {
        const val PREFS_NAME = "event_calendar_prefs"
        const val EVENTS_KEY = "events_by_date"
    }

    private val eventsByDate = mutableMapOf<String, MutableList<String>>()
    private val dateFormat = SimpleDateFormat("dd.MM.yyyy", Locale.getDefault())
    private var selectedDate = dateFormat.format(Date())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_event_calendar)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.calendarMain)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val selectedDateTextView = findViewById<TextView>(R.id.selectedDateTextView)
        val eventEditText = findViewById<EditText>(R.id.eventEditText)
        val eventsContainer = findViewById<LinearLayout>(R.id.eventsContainer)

        fun refreshEvents() {
            selectedDateTextView.text = getString(R.string.selected_date_format, selectedDate)
            eventsContainer.removeAllViews()

            val events = eventsByDate[selectedDate].orEmpty()
            if (events.isEmpty()) {
                eventsContainer.addView(createEmptyEventsTextView())
                return
            }

            events.forEachIndexed { index, event ->
                eventsContainer.addView(createEventRow(event) {
                    eventsByDate[selectedDate]?.removeAt(index)
                    if (eventsByDate[selectedDate].isNullOrEmpty()) {
                        eventsByDate.remove(selectedDate)
                    }
                    saveEvents()
                    refreshEvents()
                })
            }
        }

        loadEvents()
        findViewById<CalendarView>(R.id.calendarView).setOnDateChangeListener { _, year, month, dayOfMonth ->
            selectedDate = "%02d.%02d.%04d".format(dayOfMonth, month + 1, year)
            refreshEvents()
        }

        findViewById<Button>(R.id.addEventButton).setOnClickListener {
            val event = eventEditText.text.toString().trim()
            if (event.isNotEmpty()) {
                eventsByDate.getOrPut(selectedDate) { mutableListOf() }.add(event)
                eventEditText.text.clear()
                saveEvents()
                refreshEvents()
            }
        }

        refreshEvents()
    }

    private fun createEmptyEventsTextView(): TextView = TextView(this).apply {
        text = getString(R.string.no_events)
        textSize = 18f
    }

    private fun createEventRow(event: String, onDelete: () -> Unit): LinearLayout {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, 8, 0, 8)
        }

        val eventTextView = TextView(this).apply {
            text = getString(R.string.event_item_format, event)
            textSize = 18f
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }

        val deleteButton = Button(this).apply {
            text = getString(R.string.delete_event)
            setOnClickListener { onDelete() }
        }

        row.addView(eventTextView)
        row.addView(deleteButton)
        return row
    }

    private fun loadEvents() {
        eventsByDate.clear()
        val jsonText = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).getString(EVENTS_KEY, null)
            ?: return
        val jsonObject = JSONObject(jsonText)

        jsonObject.keys().forEach { date ->
            val eventsArray = jsonObject.getJSONArray(date)
            val events = MutableList(eventsArray.length()) { index -> eventsArray.getString(index) }
            eventsByDate[date] = events
        }
    }

    private fun saveEvents() {
        val jsonObject = JSONObject()
        eventsByDate.forEach { (date, events) ->
            jsonObject.put(date, JSONArray(events))
        }

        getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(EVENTS_KEY, jsonObject.toString())
            .apply()
    }
}
