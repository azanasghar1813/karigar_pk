import 'package:dio/dio.dart';
import '../main.dart';
import '../config/constants.dart';
import '../models/booking.dart';


class KarigarPortalService {
  late final Dio _dio;

  KarigarPortalService() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl + AppConstants.apiVersion,
      connectTimeout: AppConstants.apiTimeout,
      receiveTimeout: AppConstants.apiTimeout,
      contentType: 'application/json',
    ));

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await storageService.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) => handler.next(e),
      ),
    );
  }

  Future<Map<String, dynamic>> fetchDashboardStats() async {
    try {
      final response = await _dio.get('/karigar-portal/stats');
      return response.data['data'] as Map<String, dynamic>;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Booking>> fetchMyBookings() async {
    try {
      final response = await _dio.get('/karigar-portal/bookings');
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => Booking.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> updateBookingStatus(String bookingId, String status) async {
    try {
      await _dio.put(
        '/karigar-portal/bookings/$bookingId/status',
        data: {'status': status},
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> toggleAvailability(bool isAvailable) async {
    try {
      await _dio.put(
        '/karigar-portal/availability',
        data: {'isAvailable': isAvailable},
      );
    } catch (e) {
      throw _handleError(e);
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
