import 'package:flutter/material.dart';
import '../config/constants.dart';

class AppProvider extends ChangeNotifier {
  String _selectedService = 'All';
  String _selectedCity = 'Lahore';
  double _selectedRating = 0;
  String _sortBy = 'rating';
  bool _isDarkMode = false;

  // Getters
  String get selectedService => _selectedService;
  String get selectedCity => _selectedCity;
  double get selectedRating => _selectedRating;
  String get sortBy => _sortBy;
  bool get isDarkMode => _isDarkMode;

  List<String> get services => AppConstants.services;
  List<String> get cities => AppConstants.cities;
  List<double> get ratings => AppConstants.ratings;

  void setSelectedService(String service) {
    _selectedService = service;
    notifyListeners();
  }

  void setSelectedCity(String city) {
    _selectedCity = city;
    notifyListeners();
  }

  void setSelectedRating(double rating) {
    _selectedRating = rating;
    notifyListeners();
  }

  void setSortBy(String sortBy) {
    _sortBy = sortBy;
    notifyListeners();
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  void resetFilters() {
    _selectedService = 'All';
    _selectedCity = 'Lahore';
    _selectedRating = 0;
    _sortBy = 'rating';
    notifyListeners();
  }
}