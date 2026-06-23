import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../config/constants.dart';
import '../models/user.dart';

/// App-wide storage singleton — inject prefs once at startup via [injectPrefs].
final StorageService storageService = StorageService();

class StorageService {
  SharedPreferences? _prefs;

  /// Called from main() with the already-loaded SharedPreferences instance.
  /// This ensures storageService never awaits getInstance() again — zero delay.
  void injectPrefs(SharedPreferences prefs) {
    _prefs = prefs;
  }

  Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  Future<SharedPreferences> get _preferences async {
    if (_prefs != null) return _prefs!;
    _prefs = await SharedPreferences.getInstance();
    return _prefs!;
  }

  Future<void> saveToken(String token) async {
    final prefs = await _preferences;
    await prefs.setString(AppConstants.userTokenKey, token);
  }

  Future<String?> getToken() async {
    final prefs = await _preferences;
    return prefs.getString(AppConstants.userTokenKey);
  }

  /// Instant read when [injectPrefs] has already run (startup path).
  String? getTokenSync() => _prefs?.getString(AppConstants.userTokenKey);

  User? getUserDataSync() {
    final jsonString = _prefs?.getString(AppConstants.userDataKey);
    if (jsonString == null) return null;
    return User.fromJson(jsonDecode(jsonString) as Map<String, dynamic>);
  }

  Future<void> clearToken() async {
    final prefs = await _preferences;
    await prefs.remove(AppConstants.userTokenKey);
  }

  Future<void> saveUserData(User user) async {
    final prefs = await _preferences;
    final jsonString = jsonEncode(user.toJson());
    await prefs.setString(AppConstants.userDataKey, jsonString);
  }

  Future<User?> getUserData() async {
    final prefs = await _preferences;
    final jsonString = prefs.getString(AppConstants.userDataKey);
    if (jsonString != null) {
      return User.fromJson(jsonDecode(jsonString) as Map<String, dynamic>);
    }
    return null;
  }

  Future<void> clearUserData() async {
    final prefs = await _preferences;
    await prefs.remove(AppConstants.userTokenKey);
    await prefs.remove(AppConstants.userDataKey);
    await prefs.remove(AppConstants.authStateKey);
  }

  Future<void> setTheme(bool isDarkMode) async {
    final prefs = await _preferences;
    await prefs.setBool(AppConstants.themeKey, isDarkMode);
  }

  Future<bool> getTheme() async {
    final prefs = await _preferences;
    return prefs.getBool(AppConstants.themeKey) ?? true;
  }
}
