import Foundation
import React
import Security

@objc(SecureVault)
class SecureVault: NSObject {

    @objc(tokenizeCard:withResolver:withRejecter:)
    func tokenizeCard(
        cardNumber: String, resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {

        // 1. Generate Token (UUID)
        let token = UUID().uuidString

        // 2. Prepare Data for Keychain
        guard let data = cardNumber.data(using: .utf8) else {
            reject("ENCODING_ERROR", "Failed to encode card number", nil)
            return
        }

        // 3. Store in Keychain (Simulated "Vault")
        // In production, we'd use kSecAttrAccessControl for Biometric/Passcode protection
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: token,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlocked,
        ]

        // Delete existing item if any (just in case UUID collides, which is impossible but safe)
        SecItemDelete(query as CFDictionary)

        // Add new item
        let status = SecItemAdd(query as CFDictionary, nil)

        if status == errSecSuccess {
            // 4. Return Token to JS
            print("SECURE_VAULT_IOS: Tokenized for token: \(token)")
            resolve(token)
        } else {
            reject("KEYCHAIN_ERROR", "Failed to save to Keychain. Status: \(status)", nil)
        }
    }

    @objc(setSecureValue:value:withResolver:withRejecter:)
    func setSecureValue(
        key: String, value: String, resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let data = value.data(using: .utf8)!
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlocked,
        ]

        SecItemDelete(query as CFDictionary)
        let status = SecItemAdd(query as CFDictionary, nil)

        if status == errSecSuccess {
            resolve(true)
        } else {
            reject("KEYCHAIN_ERROR", "Failed to save. Status: \(status)", nil)
        }
    }

    @objc(getSecureValue:withResolver:withRejecter:)
    func getSecureValue(
        key: String, resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        if status == errSecSuccess {
            if let data = item as? Data, let value = String(data: data, encoding: .utf8) {
                resolve(value)
            } else {
                resolve(nil)
            }
        } else if status == errSecItemNotFound {
            resolve(nil)
        } else {
            reject("KEYCHAIN_ERROR", "Failed to retrieve. Status: \(status)", nil)
        }
    }

    @objc(clearSecureValue:withResolver:withRejecter:)
    func clearSecureValue(
        key: String, resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
        ]

        let status = SecItemDelete(query as CFDictionary)

        // Success or ItemNotFound are both "success" for clearing
        if status == errSecSuccess || status == errSecItemNotFound {
            resolve(true)
        } else {
            reject("KEYCHAIN_ERROR", "Failed to clear. Status: \(status)", nil)
        }
    }
}
