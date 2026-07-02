import 'package:dio/dio.dart';
import '../config/constants.dart';
import '../data/mock_data.dart';
import '../models/user.dart';

class AuthService {
  late final Dio _dio;

  AuthService() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl + AppConstants.apiVersion,
      connectTimeout: AppConstants.apiTimeout,
      receiveTimeout: AppConstants.apiTimeout,
      contentType: 'application/json',
    ));
  }

  Future<Map<String, dynamic>> login(String email, String password, {bool isKarigar = false}) async {
    if (AppConstants.useMockData) {
      await Future<void>.delayed(const Duration(milliseconds: 400));
      if (email.trim().toLowerCase() == MockData.demoEmail &&
          password == MockData.demoPassword) {
        return {
          'token': 'mock-jwt-token',
          'user': MockData.demoUser.toJson(),
        };
      }
      throw 'Invalid email or password';
    }

    try {
      final endpoint = isKarigar ? '/karigars/login' : '/auth/login';
      final response = await _dio.post(
        endpoint,
        data: {
          'email': email,
          'password': password,
        },
      );

      final responseData = response.data as Map<String, dynamic>;
      final userMap = Map<String, dynamic>.from(responseData);
      userMap['userType'] = userMap['role'] ?? (isKarigar ? 'karigar' : 'customer');

      return {
        'token': responseData['token'],
        'user': userMap,
      };
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> signup({
    required String fullName,
    required String email,
    required String phone,
    required String cnic,
    required String address,
    required String password,
  }) async {
    if (AppConstants.useMockData) {
      await Future<void>.delayed(const Duration(milliseconds: 500));
      final user = User(
        id: 'user-${DateTime.now().millisecondsSinceEpoch}',
        fullName: fullName,
        email: email,
        phone: phone,
        cnic: cnic,
        address: address,
        isPhoneVerified: false,
        userType: 'customer',
      );
      return {
        'token': 'mock-jwt-token',
        'user': user.toJson(),
      };
    }

    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'fullName': fullName,
          'email': email,
          'phone': phone,
          'cnic': cnic,
          'address': address,
          'password': password,
        },
      );

      final responseData = response.data as Map<String, dynamic>;
      final userMap = Map<String, dynamic>.from(responseData);
      userMap['userType'] = userMap['role'] ?? 'customer';

      return {
        'token': responseData['token'],
        'user': userMap,
      };
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> registerKarigar({
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
    if (AppConstants.useMockData) {
      await Future<void>.delayed(const Duration(milliseconds: 500));
      return {
        'token': 'mock-jwt-token',
        'user': {
          'id': 'karigar-${DateTime.now().millisecondsSinceEpoch}',
          'fullName': fullName,
          'email': email,
          'phone': phone,
          'userType': 'karigar',
          'service': service,
        },
      };
    }

    try {
      final formData = FormData.fromMap({
        'fullName': fullName,
        'email': email,
        'phone': phone,
        'cnicNumber': cnic,
        'city': address,
        'password': password,
        'services': '["$service"]',
        'experience': experience.toString(),
        'pricePerHour': pricePerHour.toString(),
        if (bio != null && bio.isNotEmpty) 'bio': bio,
      });

      if (profileImagePath != null) {
        formData.files.add(
          MapEntry('profilePhoto', await MultipartFile.fromFile(profileImagePath)),
        );
      }
      if (cnicFrontPath != null) {
        formData.files.add(
          MapEntry('cnicFrontFile', await MultipartFile.fromFile(cnicFrontPath)),
        );
      }
      if (cnicBackPath != null) {
        formData.files.add(
          MapEntry('cnicBackFile', await MultipartFile.fromFile(cnicBackPath)),
        );
      }

      final response = await _dio.post(
        '/karigars/register',
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        ),
      );

      final responseData = response.data as Map<String, dynamic>;
      final userMap = Map<String, dynamic>.from(responseData);
      userMap['userType'] = 'karigar';

      return {
        'token': responseData['token'],
        'user': userMap,
      };
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> verifyOTP(String otp) async {
    if (AppConstants.useMockData) {
      await Future<void>.delayed(const Duration(milliseconds: 300));
      if (otp.length != 6) {
        throw 'Please enter a valid 6-digit OTP';
      }
      return;
    }

    try {
      await _dio.post(
        '/auth/verify-otp',
        data: {'otp': otp},
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> logout() async {
    if (AppConstants.useMockData) return;

    try {
      await _dio.post('/auth/logout');
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> updateProfile(dynamic user) async {
    if (AppConstants.useMockData) {
      await Future<void>.delayed(const Duration(milliseconds: 300));
      return user.toJson();
    }

    try {
      final response = await _dio.put(
        '/auth/profile',
        data: user.toJson(),
      );

      return response.data['data'];
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> updateFcmToken(String fcmToken, String jwtToken, {bool isKarigar = false}) async {
    if (AppConstants.useMockData) return;
    try {
      final endpoint = isKarigar ? '/karigars/fcm-token' : '/auth/fcm-token';
      await _dio.post(
        endpoint,
        data: {'fcmToken': fcmToken},
        options: Options(headers: {'Authorization': 'Bearer $jwtToken'}),
      );
    } catch (e) {
      print('Error updating FCM token: $e');
    }
  }

  String _handleError(dynamic error) {
    if (error is String) return error;
    if (error is DioException) {
      if (error.response?.data is Map) {
        return error.response?.data['message'] ?? 'An error occurred';
      }
      return error.message ?? 'An error occurred';
    }
    return error.toString();
  }
}
