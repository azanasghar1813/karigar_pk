import 'package:flutter/material.dart';
import '../models/karigar.dart';
import '../models/review.dart';
import '../services/api_service.dart';

class KarigarProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Karigar> _karigars = [];
  List<Karigar> _filteredKarigars = [];
  Karigar? _selectedKarigar;
  List<Review> _reviews = [];
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Karigar> get karigars => _karigars;
  List<Karigar> get filteredKarigars => _filteredKarigars;
  Karigar? get selectedKarigar => _selectedKarigar;
  List<Review> get reviews => _reviews;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchKarigars({
    String? service,
    String? city,
    double? minRating,
    String? sortBy,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _karigars = await _apiService.fetchKarigars(
        service: service,
        city: city,
        minRating: minRating,
        sortBy: sortBy,
      );

      _filteredKarigars = _karigars;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchKarigarDetails(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _selectedKarigar = await _apiService.fetchKarigarDetails(id);
      _reviews = await _apiService.fetchKarigarReviews(id);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  void filterKarigars({
    String? service,
    String? city,
    double? minRating,
    String? sortBy,
  }) {
    _filteredKarigars = _karigars.where((karigar) {
      bool matches = true;

      if (service != null && service.isNotEmpty && service != 'All') {
        matches = matches && karigar.service == service;
      }

      if (city != null && city.isNotEmpty) {
        matches = matches && karigar.city == city;
      }

      if (minRating != null && minRating > 0) {
        matches = matches && karigar.rating >= minRating;
      }

      return matches;
    }).toList();

    // Sort
    if (sortBy == 'price') {
      _filteredKarigars.sort((a, b) {
        int priceA = int.parse(a.pricePerHour.replaceAll(RegExp(r'[^0-9]'), ''));
        int priceB = int.parse(b.pricePerHour.replaceAll(RegExp(r'[^0-9]'), ''));
        return priceA.compareTo(priceB);
      });
    } else {
      _filteredKarigars.sort((a, b) => b.rating.compareTo(a.rating));
    }

    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}