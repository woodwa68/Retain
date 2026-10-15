package com.dictremember

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NotificationModule"

    /**
     * Shows a BigTextStyle notification immediately.
     */
    @ReactMethod
    fun showWordNotification(word: String, definition: String, notifId: Int, promise: Promise) {
        try {
            val context = reactContext.applicationContext
            NotificationDisplay.show(context, word, definition, notifId)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_ERROR", e.message, e)
        }
    }

    private fun buildPendingIntent(context: Context, word: String, definition: String, notifId: Int): PendingIntent {
        val intent = Intent(context, WordNotificationReceiver::class.java).apply {
            putExtra("word", word)
            putExtra("definition", definition)
            putExtra("notifId", notifId)
        }
        return PendingIntent.getBroadcast(
            context, notifId, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }

    /**
     * Schedules a BigTextStyle notification to fire at [timestamp] (epoch millis),
     * surviving Doze via setExactAndAllowWhileIdle.
     */
    @ReactMethod
    fun scheduleWordNotification(word: String, definition: String, notifId: Int, timestamp: Double, promise: Promise) {
        try {
            val context = reactContext.applicationContext
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
                promise.reject("EXACT_ALARM_NOT_PERMITTED", "User has not granted exact alarm permission")
                return
            }

            val pendingIntent = buildPendingIntent(context, word, definition, notifId)

            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                timestamp.toLong(),
                pendingIntent,
            )
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("SCHEDULE_ERROR", e.message, e)
        }
    }

    /**
     * Cancels a previously scheduled alarm. word/definition must match what was
     * originally scheduled, since PendingIntent equality depends on the extras
     * only for the request code (notifId) — action/component are what's actually
     * matched, so notifId alone is sufficient here.
     */
    @ReactMethod
    fun cancelWordNotification(notifId: Int, promise: Promise) {
        try {
            val context = reactContext.applicationContext
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            val intent = Intent(context, WordNotificationReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context, notifId, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )

            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("CANCEL_ERROR", e.message, e)
        }
    }

    /**
     * Checks whether the app currently has permission to schedule exact alarms (Android 12+).
     * Always true below API 31.
     */
    @ReactMethod
    fun canScheduleExactAlarms(promise: Promise) {
        try {
            val context = reactContext.applicationContext
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val canSchedule = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                alarmManager.canScheduleExactAlarms()
            } else {
                true
            }
            promise.resolve(canSchedule)
        } catch (e: Exception) {
            promise.reject("PERMISSION_CHECK_ERROR", e.message, e)
        }
    }

    /**
     * Opens the system settings screen where the user can grant exact-alarm
     * permission (Android 12+ only; no-op below that).
     */
    @ReactMethod
    fun requestExactAlarmPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val context = reactContext.applicationContext
                val intent = Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                    data = android.net.Uri.parse("package:${context.packageName}")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                context.startActivity(intent)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("PERMISSION_REQUEST_ERROR", e.message, e)
        }
    }
}
