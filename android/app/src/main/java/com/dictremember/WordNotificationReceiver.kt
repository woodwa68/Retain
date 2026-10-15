package com.dictremember

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class WordNotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val word = intent.getStringExtra("word") ?: return
        val definition = intent.getStringExtra("definition") ?: return
        val notifId = intent.getIntExtra("notifId", System.currentTimeMillis().toInt())

        NotificationDisplay.show(context, word, definition, notifId)
    }
}
