package com.nure.practice3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class WheelGameActivity : AppCompatActivity() {
    private lateinit var words: List<String>
    private lateinit var secretWord: String
    private val guessedLetters = mutableSetOf<Char>()
    private var attemptsLeft = 7

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_wheel_game)
        words = resources.getStringArray(R.array.wheel_game_words).toList()
        secretWord = words.random()
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.gameMain)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val wordTextView = findViewById<TextView>(R.id.wordTextView)
        val attemptsTextView = findViewById<TextView>(R.id.attemptsTextView)
        val messageTextView = findViewById<TextView>(R.id.gameMessageTextView)
        val letterEditText = findViewById<EditText>(R.id.letterEditText)
        val checkButton = findViewById<Button>(R.id.checkLetterButton)

        fun visibleWord(): String = secretWord
            .map { letter -> if (letter in guessedLetters) letter else '_' }
            .joinToString(" ")

        fun refreshGame(message: String = "") {
            wordTextView.text = visibleWord()
            attemptsTextView.text = getString(R.string.attempts_left_format, attemptsLeft)
            messageTextView.text = message
            checkButton.isEnabled = attemptsLeft > 0 && '_' in visibleWord()
        }

        checkButton.setOnClickListener {
            val input = letterEditText.text.toString().trim().uppercase()
            letterEditText.text.clear()

            if (input.length != 1 || !input[0].isLetter()) {
                refreshGame(getString(R.string.enter_one_letter))
                return@setOnClickListener
            }

            val letter = input[0]
            val message = when {
                letter in guessedLetters -> getString(R.string.letter_already_used)
                letter in secretWord -> {
                    guessedLetters.add(letter)
                    getString(R.string.letter_exists)
                }
                else -> {
                    guessedLetters.add(letter)
                    attemptsLeft--
                    getString(R.string.letter_missing)
                }
            }

            val finalMessage = when {
                secretWord.all { it in guessedLetters } -> getString(R.string.game_win_format, secretWord)
                attemptsLeft == 0 -> getString(R.string.game_over_format, secretWord)
                else -> message
            }
            refreshGame(finalMessage)
        }

        findViewById<Button>(R.id.restartGameButton).setOnClickListener {
            secretWord = words.random()
            guessedLetters.clear()
            attemptsLeft = 7
            letterEditText.text.clear()
            refreshGame(getString(R.string.new_game_message))
        }

        refreshGame()
    }
}
