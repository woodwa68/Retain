const {
  withAndroidManifest,
  withDangerousMod,
  withMainApplication,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const { withMainActivity } = require("@expo/config-plugins");

const withProcessTextMainActivity = (config) => {
  return withMainActivity(config, (config) => {
    let contents = config.modResults.contents;

    if (contents.includes("onNewIntent")) return config;

    const isKotlin = config.modResults.language === "kt";

    if (isKotlin) {
      contents = contents.replace(
        /class MainActivity :[^{]+\{/,
        (match) => `${match}\n
        override fun onNewIntent(intent: Intent) {
          Log.d("ProcessText", "notif extras: \${intent?.extras}, action: \${intent?.action}")

          super.onNewIntent(intent)
          setIntent(intent)
        }
      `,
      );
      if (!contents.includes("import android.content.Intent")) {
        contents = contents.replace(
          /package .+\n/,
          (match) =>
            `${match}\nimport android.content.Intent\n\nimport android.util.Log\n`,
        );
      }
    }

    config.modResults.contents = contents;
    return config;
  });
};

const withProcessTextManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application[0];
    const activities = application.activity;

    application.$["android:allowBackup"] = "false";

    const mainActivity = activities.find((activity) =>
      activity.$["android:name"].includes("MainActivity"),
    );

    if (!mainActivity) {
      throw new Error("withProcessText: Could not find MainActivity");
    }

    mainActivity.$["android:launchMode"] = "singleTask";
    //mainActivity.$["android:taskAffinity"] = "";

    const intentFilters = mainActivity["intent-filter"] ?? [];
    const alreadyAdded = intentFilters.some((filter) =>
      filter.action?.some(
        (a) => a.$["android:name"] === "android.intent.action.PROCESS_TEXT",
      ),
    );

    if (!alreadyAdded) {
      intentFilters.push({
        action: [
          { $: { "android:name": "android.intent.action.PROCESS_TEXT" } },
        ],
        category: [
          { $: { "android:name": "android.intent.category.DEFAULT" } },
        ],
        data: [{ $: { "android:mimeType": "text/plain" } }],
      });

      mainActivity["intent-filter"] = intentFilters;
    }

    return config;
  });
};

// --- NEW: register WordNotificationReceiver + SCHEDULE_EXACT_ALARM permission ---
const withWordNotificationReceiverManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application[0];

    const permissions = manifest.manifest["uses-permission"] ?? [];
    const hasExactAlarmPermission = permissions.some(
      (p) => p.$["android:name"] === "android.permission.SCHEDULE_EXACT_ALARM",
    );
    if (!hasExactAlarmPermission) {
      permissions.push({
        $: { "android:name": "android.permission.SCHEDULE_EXACT_ALARM" },
      });
    }
    const hasReceiverPermission = permissions.some(
      (p) =>
        p.$["android:name"] === "android.permission.RECEIVE_BOOT_COMPLETED",
    );
    if (!hasReceiverPermission) {
      permissions.push({
        $: { "android:name": "android.permission.RECEIVE_BOOT_COMPLETED" },
      });
    }
    manifest.manifest["uses-permission"] = permissions;

    const receivers = application.receiver ?? [];
    const alreadyAdded = receivers.some((r) =>
      r.$["android:name"]?.includes("WordNotificationReceiver"),
    );

    if (!alreadyAdded) {
      receivers.push({
        $: {
          "android:name": ".WordNotificationReceiver",
          "android:exported": "false",
        },
      });
      application.receiver = receivers;
    }

    return config;
  });
};

const withProcessTextMainApplication = (config) => {
  return withMainApplication(config, (config) => {
    let contents = config.modResults.contents;

    if (contents.includes("ProcessTextPackage()")) return config;

    contents = contents.replace(
      "PackageList(this).packages.apply {",
      "PackageList(this).packages.apply {\n          add(ProcessTextPackage())",
    );

    config.modResults.contents = contents;
    return config;
  });
};

const withProcessTextModule = (config) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const packageName = config.android?.package;
      const packagePath = packageName.replace(/\./g, "/");

      const targetDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
      );

      fs.mkdirSync(targetDir, { recursive: true });

      // ProcessTextModule
      const kotlinSource = generateKotlinModule(packageName);
      fs.writeFileSync(
        path.join(targetDir, "ProcessTextModule.kt"),
        kotlinSource,
      );

      // NotificationDisplay — shared builder used by both the module and the receiver
      const notificationDisplaySource =
        generateNotificationDisplay(packageName);
      fs.writeFileSync(
        path.join(targetDir, "NotificationDisplay.kt"),
        notificationDisplaySource,
      );

      // WordNotificationReceiver — fired by AlarmManager
      const receiverSource = generateWordNotificationReceiver(packageName);
      fs.writeFileSync(
        path.join(targetDir, "WordNotificationReceiver.kt"),
        receiverSource,
      );

      // NotificationModule — now also exposes schedule/cancel via AlarmManager
      const notificationSource = generateNotificationModule(packageName);
      fs.writeFileSync(
        path.join(targetDir, "NotificationModule.kt"),
        notificationSource,
      );

      // Package — registers all native modules
      const packageFile = path.join(targetDir, "ProcessTextPackage.kt");
      fs.writeFileSync(packageFile, generateKotlinPackage(packageName));

      return config;
    },
  ]);
};

function generateKotlinModule(packageName) {
  return `package ${packageName}

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
            Log.d("ProcessText", "notif extras: \${intent?.extras}, action: \${intent?.action}")
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
            Log.d("ProcessText", "intent extra: \$text")
            Log.d("ProcessText", "intent action: \${activity.intent?.action}")
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
`;
}

function generateNotificationDisplay(packageName) {
  return `package ${packageName}

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
        Log.d("ProcessText", "show() building notification for \${word}, notifId=\${notifId}")
         val launchIntent = Intent(context, MainActivity::class.java).apply {
            action = "${packageName}.OPEN_WORD_NOTIFICATION"
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
`;
}

// --- NEW: BroadcastReceiver fired by AlarmManager at the scheduled time ---
function generateWordNotificationReceiver(packageName) {
  return `package ${packageName}

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
`;
}

function generateNotificationModule(packageName) {
  return `package ${packageName}

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
                    data = android.net.Uri.parse("package:\${context.packageName}")
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
`;
}

function generateKotlinPackage(packageName) {
  return `package ${packageName}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class ProcessTextPackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> = listOf(
        ProcessTextModule(reactContext),
        NotificationModule(reactContext),
    )

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> = emptyList()
}
`;
}

const withProcessText = (config) => {
  config = withProcessTextManifest(config);
  config = withWordNotificationReceiverManifest(config);
  config = withProcessTextModule(config);
  config = withProcessTextMainApplication(config);
  config = withProcessTextMainActivity(config);
  return config;
};

module.exports = withProcessText;
