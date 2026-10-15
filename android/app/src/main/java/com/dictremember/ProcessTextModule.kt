package com.dictremember

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ProcessTextModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ProcessTextModule"

    @ReactMethod
    fun getNotificationPayload(promise: Promise) {

        try {
            val intent = reactContext.currentActivity?.intent
            Log.d("ProcessText", "notif extras: ${intent?.extras}, action: ${intent?.action}")
            val word = intent?.getStringExtra("notif_word")
            val definition = intent?.getStringExtra("notif_definition")
            if (word == null) {
                promise.resolve(null)
                return
            }
            val map = com.facebook.react.bridge.Arguments.createMap()
            map.putString("word", word)
            map.putString("definition", definition)
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_PAYLOAD_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clearNotificationPayload(promise: Promise) {
        try {
            val intent = reactContext.currentActivity?.intent
            intent?.removeExtra("notif_word")
            intent?.removeExtra("notif_definition")
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_PAYLOAD_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getSelectedText(promise: Promise) {
        try {
            val activity = reactContext.currentActivity
            if (activity == null) {
                promise.resolve(null)
                return
            }

            val intent = activity.intent
            val text = intent
                ?.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT)
                ?.toString()
                ?.trim()
            Log.d("ProcessText", "intent extra: $text")
            Log.d("ProcessText", "intent action: ${activity.intent?.action}")
            promise.resolve(text)
        } catch (e: Exception) {
            promise.reject("PROCESS_TEXT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clearIntent(promise: Promise) {
        try {
            reactContext.currentActivity?.intent?.removeExtra(Intent.EXTRA_PROCESS_TEXT)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("PROCESS_TEXT_ERROR", e.message, e)
        }
    }
}
