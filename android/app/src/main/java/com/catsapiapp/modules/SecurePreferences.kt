package com.catsapiapp.modules

import android.content.Context
import android.content.SharedPreferences

class SecurePreferences(context: Context) {
    private val PREFS_NAME = "SecureVaultPrefs"
    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun save(key: String, value: String) {
        prefs.edit().putString(key, value).apply()
    }

    fun get(key: String): String? {
        return prefs.getString(key, null)
    }

    fun clear(key: String) {
        prefs.edit().remove(key).apply()
    }
}
