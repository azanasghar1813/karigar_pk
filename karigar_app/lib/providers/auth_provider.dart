import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final StorageService _storageService;

  User? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;
  bool _isAuthenticated = false;
  bool _isInitialized = false;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _isAuthenticated;
  bool get isInitialized => _isInitialized;

  AuthProvider({required StorageService storageService})
      : _storageService = storageService {
    // Fire-and-forget — does NOT block the constructor.
    // The UI paints immediately; auth state resolves in background.
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    try {
      // StorageService has already-loaded SharedPreferences (injected from main).
      // getToken() / getUserData() are still async-signature but resolve
      // in a single microtask since no I/O is needed.
      _token = await _storageService.getToken();
      if (_token != null) {
        _isAuthenticated = true;
        final userData = await _storageService.getUserData();
        if (userData != null) {
          _user = userData;
        }
      }
    } catch (_) {
      // Storage failure — stay logged out.
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password, {bool isKarigar = false}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.login(email, password, isKarigar: isKarigar);
      _token = response['token'] as String;
      _user = User.fromJson(
        Map<String, dynamic>.from(response['user'] as Map),
      );
      _isAuthenticated = true;

      await _storageService.saveToken(_token!);
      await _storageService.saveUserData(_user!);

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> signup({
    required String fullName,
    required String email,
    required String phone,
    required String cnic,
    required String address,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.signup(
        fullName: fullName,
        email: email,
        phone: phone,
        cnic: cnic,
        address: address,
        password: password,
      );
      _token = response['token'] as String;
      _user = User.fromJson(
        Map<String, dynamic>.from(response['user'] as Map),
      );
      _isAuthenticated = true;

      await _storageService.saveToken(_token!);
      await _storageService.saveUserData(_user!);

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> registerKarigar({
    required String fullName,
    required String email,
    required String phone,
    required String cnic,
    required String address,
    required String password,
    required String service,
    required int experience,
    required double pricePerHour,
    String? bio,
    String? profileImagePath,
    String? cnicFrontPath,
    String? cnicBackPath,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.registerKarigar(
        fullName: fullName,
        email: email,
        phone: phone,
        cnic: cnic,
        address: address,
        password: password,
        service: service,
        experience: experience,
        pricePerHour: pricePerHour,
        bio: bio,
        profileImagePath: profileImagePath,
        cnicFrontPath: cnicFrontPath,
        cnicBackPath: cnicBackPath,
      );

      _token = response['token'] as String;
      _user = User.fromJson(
        Map<String, dynamic>.from(response['user'] as Map),
      );
      _isAuthenticated = true;

      await _storageService.saveToken(_token!);
      await _storageService.saveUserData(_user!);

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> verifyOTP(String otp) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.verifyOTP(otp);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.logout();
      _user = null;
      _token = null;
      _isAuthenticated = false;
      await _storageService.clearUserData();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProfile(User updatedUser) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.updateProfile(updatedUser);
      _user = User.fromJson(Map<String, dynamic>.from(response as Map));
      await _storageService.saveUserData(_user!);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
