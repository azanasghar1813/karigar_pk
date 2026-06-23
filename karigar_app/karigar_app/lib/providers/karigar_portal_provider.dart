import 'package:flutter/material.dart';
import '../models/booking.dart';
import '../services/karigar_portal_service.dart';

class KarigarPortalProvider extends ChangeNotifier {
  final KarigarPortalService _service = KarigarPortalService();

  Map<String, dynamic>? _stats;
  List<Booking> _bookings = [];
  bool _isLoading = false;
  String? _error;

  Map<String, dynamic>? get stats => _stats;
  List<Booking> get bookings => _bookings;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchDashboardStats() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _stats = await _service.fetchDashboardStats();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchMyBookings() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _bookings = await _service.fetchMyBookings();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateBookingStatus(String bookingId, String status) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _service.updateBookingStatus(bookingId, status);
      await fetchMyBookings(); // Refresh bookings
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> toggleAvailability(bool isAvailable) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _service.toggleAvailability(isAvailable);
      await fetchDashboardStats(); // Refresh stats
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
