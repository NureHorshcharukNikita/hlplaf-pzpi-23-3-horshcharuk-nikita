package com.nure.lab3

import android.util.Base64
import org.json.JSONObject

fun parseUserSession(token: String?): UserSession? {
    if (token.isNullOrBlank()) return null

    return runCatching {
        val payload = token.split(".").getOrNull(1) ?: return null
        val normalized = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=')
        val decoded = String(Base64.decode(normalized, Base64.URL_SAFE or Base64.NO_WRAP))
        val json = JSONObject(decoded)

        UserSession(
            id = json.optInt("id"),
            email = json.optString("email"),
            role = json.optString("role", "user")
        )
    }.getOrNull()
}
