package com.dictremember

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import android.util.Log

object NotificationDisplay {
    const val CHANNEL_ID = "custom_word_channel_no_expo"

    fun ensureChannel(context: Context) {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Word Notifications",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Custom native word notifications"
        }
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(channel)
    }

    /**
     * Shows a BigTextStyle notification where:
     * - Collapsed: shows the word + "Expand to reveal definition"
     * - Expanded:  shows the full definition, with line breaks preserved
     */
    fun show(context: Context, word: String, definition: String, notifId: Int) {
        ensureChannel(context)
        Log.d("ProcessText", "show() building notification for ${word}, notifId=${notifId}")
         val launchIntent = Intent(context, MainActivity::class.java).apply {
            action = "com.dictremember.OPEN_WORD_NOTIFICATION"
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("notif_word", word)
            putExtra("notif_definition", definition)
        }

        val pendingIntent = PendingIntent.getActivity(
            context, notifId, launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        val style = NotificationCompat.BigTextStyle()
            .bigText(definition)
            .setBigContentTitle(word)

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setContentTitle(word)
            .setContentText("Expand to reveal definition")
            .setStyle(style)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(notifId, notification)
    }
}
