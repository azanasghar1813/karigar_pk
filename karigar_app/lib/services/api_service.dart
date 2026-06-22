import 'package:dio/dio.dart';
import '../main.dart';
import '../config/constants.dart';
import '../data/mock_data.dart';
import '../models/karigar.dart';
import '../models/booking.dart';
import '../models/review.dart';

class ApiService {
  late final Dio _dio;

  ApiService() {
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

  Future<void> _mockDelay() =>
      Future<void>.delayed(const Duration(milliseconds: 350));

  Future<List<Karigar>> fetchKarigars({
    String? service,
    String? city,
    double? minRating,
    String? sortBy,
  }) async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      return MockData.filterKarigars(
        service: service,
        city: city,
        minRating: minRating,
        sortBy: sortBy,
      );
    }

    try {
      final response = await _dio.get(
        '/karigars',
        queryParameters: {
          if (service != null && service != 'All') 'service': service,
          if (city != null) 'city': city,
          if (minRating != null && minRating > 0) 'minRating': minRating,
          if (sortBy != null) 'sortBy': sortBy,
        },
      );

      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => Karigar.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Karigar> fetchKarigarDetails(String id) async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      final karigar = MockData.karigarById(id);
      if (karigar == null) throw 'Karigar not found';
      return karigar;
    }

    try {
      final response = await _dio.get('/karigars/$id');
      return Karigar.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Review>> fetchKarigarReviews(String karigerId) async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      return MockData.reviewsForKarigar(karigerId);
    }

    try {
      final response = await _dio.get(
        '/reviews',
        queryParameters: {'karigerId': karigerId},
      );

      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => Review.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Booking> createBooking({
    required String karigerId,
    required String service,
    required DateTime bookingDate,
    required String description,
    required String address,
    required String city,
    required double totalPrice,
  }) async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      return MockData.createBooking(
        karigerId: karigerId,
        service: service,
        bookingDate: bookingDate,
        description: description,
        address: address,
        city: city,
        totalPrice: totalPrice,
      );
    }

    try {
      final response = await _dio.post(
        '/bookings',
        data: {
          'karigerId': karigerId,
          'service': service,
          'bookingDate': bookingDate.toIso8601String(),
          'description': description,
          'address': address,
          'city': city,
          'totalPrice': totalPrice,
        },
      );

      return Booking.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Booking>> fetchMyBookings() async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      return MockData.myBookings;
    }

    try {
      final response = await _dio.get('/bookings/mybookings');
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => Booking.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Booking> fetchBookingDetails(String id) async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      return MockData.myBookings.firstWhere(
        (b) => b.id == id,
        orElse: () => throw 'Booking not found',
      );
    }

    try {
      final response = await _dio.get('/bookings/$id');
      return Booking.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> cancelBooking(String bookingId) async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      MockData.cancelBooking(bookingId);
      return;
    }

    try {
      await _dio.patch('/bookings/$bookingId/cancel');
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> rateBooking({
    required String bookingId,
    required int rating,
    required String review,
  }) async {
    if (AppConstants.useMockData) {
      await _mockDelay();
      return;
    }

    try {
      await _dio.post(
        '/bookings/$bookingId/rate',
        data: {
          'rating': rating,
          'review': review,
        },
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
