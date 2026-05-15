package com.nure.lab3

data class OrderStatusAction(
    val value: String,
    val label: String
)

val orderStatusActions = listOf(
    OrderStatusAction("pending", "Pending"),
    OrderStatusAction("processing", "Processing"),
    OrderStatusAction("shipped", "Shipped"),
    OrderStatusAction("completed", "Completed")
)
