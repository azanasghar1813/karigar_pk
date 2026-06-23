import 'package:flutter/material.dart';
import '../models/booking.dart';
import '../services/api_service.dart';

class BookingProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Booking> _bookings = [];
  Booking? _currentBooking;
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Booking> get bookings => _bookings;
  Booking? get currentBooking => _currentBooking;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<bool> createBooking({
    required String karigerId,
    required String service,
    required DateTime bookingDate,
    required String description,
    required String address,
    required String city,
    required double totalPrice,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final booking = await _apiService.createBooking(
        karigerId: karigerId,
        service: service,
        bookingDate: bookingDate,
        description: description,
        address: address,
        city: city,
        totalPrice: totalPrice,
      );

      _currentBooking = booking;
      _bookings.add(booking);
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

  Future<void> fetchMyBookings() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _bookings = await _apiService.fetchMyBookings();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchBookingDetails(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _currentBooking = await _apiService.fetchBookingDetails(id);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> cancelBooking(String bookingId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _apiService.cancelBooking(bookingId);
      _bookings.removeWhere((b) => b.id == bookingId);
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

  Future<bool> rateBooking({
    required String bookingId,
    required int rating,
    required String review,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _apiService.rateBooking(
        bookingId: bookingId,
        rating: rating,
        review: review,
      );
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