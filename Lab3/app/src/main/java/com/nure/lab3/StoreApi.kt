package com.nure.lab3

import android.os.Handler
import android.os.Looper
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.lang.IllegalStateException
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class StoreApi {
    private val baseUrls = listOf(
        "http://192.168.0.77:3000",
        "http://10.0.2.2:3000",
        "http://127.0.0.1:3000"
    )
    private val mainHandler = Handler(Looper.getMainLooper())

    fun login(email: String, password: String, callback: (Result<String>) -> Unit) {
        request("POST", "/login", JSONObject().put("email", email).put("password", password)) { result ->
            callback(result.map { JSONObject(it).getString("token") })
        }
    }

    fun register(email: String, password: String, callback: (Result<Unit>) -> Unit) {
        request("POST", "/register", JSONObject().put("email", email).put("password", password)) { result ->
            callback(result.map { })
        }
    }

    fun getProducts(limit: Int, offset: Int, callback: (Result<ProductPage>) -> Unit) {
        request("GET", "/products?limit=$limit&offset=$offset", null) { result ->
            callback(result.map { response ->
                val json = JSONObject(response)
                val items = json.getJSONArray("items")
                ProductPage(
                    items = (0 until items.length()).map { index -> items.getJSONObject(index).toProduct() },
                    total = json.optInt("total", items.length())
                )
            })
        }
    }

    fun getOrders(token: String, callback: (Result<List<Order>>) -> Unit) {
        request("GET", "/orders", null, token) { result ->
            callback(result.map { response ->
                val items = JSONArray(response)
                (0 until items.length()).map { index -> items.getJSONObject(index).toOrder() }
            })
        }
    }

    fun getRecommendations(token: String, callback: (Result<List<Product>>) -> Unit) {
        request("GET", "/recommendations", null, token) { result ->
            callback(result.map { response ->
                val items = JSONArray(response)
                (0 until items.length()).map { index -> items.getJSONObject(index).toProduct() }
            })
        }
    }

    fun createOrder(token: String, cartLines: Collection<CartLine>, callback: (Result<Unit>) -> Unit) {
        val items = JSONArray()
        cartLines.forEach { line ->
            items.put(
                JSONObject()
                    .put("id", line.product.id)
                    .put("name", line.product.name)
                    .put("price", line.product.price)
                    .put("quantity", line.quantity)
            )
        }

        request("POST", "/order", JSONObject().put("items", items), token) { result ->
            callback(result.map { })
        }
    }

    private fun request(
        method: String,
        path: String,
        body: JSONObject?,
        token: String? = null,
        callback: (Result<String>) -> Unit
    ) {
        thread {
            var lastFailure: Exception? = null

            for (baseUrl in baseUrls) {
                try {
                    val result = performRequest(baseUrl, method, path, body, token)
                    mainHandler.post { callback(result) }
                    return@thread
                } catch (ex: Exception) {
                    lastFailure = ex
                }
            }

            mainHandler.post {
                callback(Result.failure(lastFailure ?: IllegalStateException("Connection failed")))
            }
        }
    }

    private fun performRequest(
        baseUrl: String,
        method: String,
        path: String,
        body: JSONObject?,
        token: String?
    ): Result<String> {
        val connection = (URL("$baseUrl$path").openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 3500
            readTimeout = 3500
            setRequestProperty("Content-Type", "application/json")
            token?.let { setRequestProperty("Authorization", "Bearer $it") }
            if (body != null) doOutput = true
        }

        if (body != null) {
            OutputStreamWriter(connection.outputStream).use { it.write(body.toString()) }
        }

        val stream = if (connection.responseCode in 200..299) {
            connection.inputStream
        } else {
            connection.errorStream
        }
        val response = BufferedReader(InputStreamReader(stream)).use { it.readText() }

        return if (connection.responseCode in 200..299) {
            Result.success(response)
        } else {
            Result.failure(IllegalStateException(errorMessage(response, connection.responseCode)))
        }
    }

    private fun errorMessage(response: String, code: Int): String {
        return runCatching { JSONObject(response).optString("error") }.getOrDefault("HTTP $code")
    }

    private fun JSONObject.toProduct() = Product(
        id = optInt("id"),
        name = optString("name"),
        price = optInt("price"),
        description = optString("description", "Tech product"),
        stock = optInt("stock", 0)
    )

    private fun JSONObject.toOrder(): Order {
        val items = optJSONArray("items") ?: JSONArray()
        return Order(
            id = optInt("id"),
            total = optInt("total"),
            status = optString("status", "pending"),
            items = (0 until items.length()).map { index ->
                val item = items.getJSONObject(index)
                OrderItem(
                    name = item.optString("name"),
                    quantity = item.optInt("quantity", 1)
                )
            }
        )
    }
}
