package com.catsapiapp.modules

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.security.KeyStore
import java.util.UUID
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import java.nio.charset.Charset
import android.util.Base64

class SecureVaultModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val KEYSTORE_PROVIDER = "AndroidKeyStore"
    private val KEY_ALIAS = "MySecureVaultKey"
    private val TRANSFORMATION = "AES/GCM/NoPadding"

    override fun getName(): String {
        return "SecureVault"
    }

    private val prefs: SecurePreferences

    init {
        prefs = SecurePreferences(reactContext)
        createKeyIfNotExists()
    }

    private fun createKeyIfNotExists() {
        try {
            val keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER)
            keyStore.load(null)
            if (!keyStore.containsAlias(KEY_ALIAS)) {
                val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KEYSTORE_PROVIDER)
                keyGenerator.init(
                    KeyGenParameterSpec.Builder(
                        KEY_ALIAS,
                        KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
                    )
                        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                        .setRandomizedEncryptionRequired(true)
                        .build()
                )
                keyGenerator.generateKey()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun setSecureValue(key: String, value: String, promise: Promise) {
        try {
            val encryptionResult = encryptData(value)
            prefs.save(key, encryptionResult.second)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STORAGE_ERROR", "Failed to save secure value: ${e.message}")
        }
    }

    @ReactMethod
    fun getSecureValue(key: String, promise: Promise) {
        try {
            val encryptedString = prefs.get(key)
            if (encryptedString == null) {
                promise.resolve(null)
                return
            }
            val decryptedValue = decryptData(encryptedString)
            promise.resolve(decryptedValue)
        } catch (e: Exception) {
            promise.resolve(null) // Return null on decryption error (data corrupted or key lost)
        }
    }

    @ReactMethod
    fun clearSecureValue(key: String, promise: Promise) {
        try {
            prefs.clear(key)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STORAGE_ERROR", "Failed to clear value")
        }
    }

    @ReactMethod
    fun tokenizeCard(cardNumber: String, promise: Promise) {
        try {
            // 1. Generate Token (UUID)
            val token = UUID.randomUUID().toString()

            // 2. Encrypt Card Number
            val encryptionResult = encryptData(cardNumber)

            // 3. Store in persistent storage (Using the simplified generic storage logic)
            prefs.save(token, encryptionResult.second)

            // 4. Return Token
            println("SECURE_VAULT: Card tokenized. Token: $token. Encrypted Blob: ${encryptionResult.second}")
            promise.resolve(token)
        } catch (e: Exception) {
            promise.reject("TOKENIZATION_ERROR", e.message)
        }
    }

    private fun encryptData(plainText: String): Pair<ByteArray, String> {
        val keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER)
        keyStore.load(null)
        val secretKey = keyStore.getKey(KEY_ALIAS, null) as SecretKey

        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)
        val iv = cipher.iv
        val encryptedBytes = cipher.doFinal(plainText.toByteArray(Charset.forName("UTF-8")))

        // Return IV + EncryptedData encoded in Base64 (Simulating storage format)
        val ivString = Base64.encodeToString(iv, Base64.DEFAULT)
        val encryptedString = Base64.encodeToString(encryptedBytes, Base64.DEFAULT)
        
        return Pair(iv, "$ivString:$encryptedString") // format: IV:CIPHERTEXT
    }

    private fun decryptData(encryptedValue: String): String {
        val parts = encryptedValue.split(":")
        if (parts.size != 2) throw IllegalArgumentException("Invalid encrypted format")
        
        val iv = Base64.decode(parts[0], Base64.DEFAULT)
        val encryptedBytes = Base64.decode(parts[1], Base64.DEFAULT)

        val keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER)
        keyStore.load(null)
        val secretKey = keyStore.getKey(KEY_ALIAS, null) as SecretKey

        // GCMParameterSpec needed for AES/GCM decryption
        val spec = GCMParameterSpec(128, iv)
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)

        val decryptedBytes = cipher.doFinal(encryptedBytes)
        return String(decryptedBytes, Charset.forName("UTF-8"))
    }
}
