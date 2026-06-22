class AppConstants {
  /// Set to true to run the app with local demo data (no backend required).
  static const bool useMockData = false;

  // API
  static const String baseUrl = 'https://karigar-pk-xuea.onrender.com';
  static const String apiVersion = '/api';
  static const Duration apiTimeout = Duration(seconds: 30);

  // Contact — WhatsApp (country code + number, no + or spaces)
  static const String whatsappNumber = '923427066034';
  static const String whatsappDisplayNumber = '+92 342 7066034';
  static const String whatsappDefaultMessage =
      'Hi Karigar PK! I need help with a home service.';

  // Support phone for "Request a call"
  static const String supportPhone = '923427066034';
  static const String supportDisplayPhone = '+92 342 7066034';

  // Storage Keys
  static const String userTokenKey = 'user_token';
  static const String userDataKey = 'user_data';
  static const String authStateKey = 'auth_state';
  static const String themeKey = 'theme';

  // Services
  static const List<String> services = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'AC Repair',
    'Painter',
    'Locksmith',
    'CCTV Installation',
    'General Repair',
    'Household Chores'
  ];

  static List<String> get servicesWithAll => ['All', ...services];

  // Cities
  static const List<String> cities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad'
  ];

  // Rating
  static const List<double> ratings = [0, 3, 3.5, 4, 4.5];

  // Validation patterns
  static const String emailPattern =
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
  static const String cnicPattern = r'^\d{5}-\d{7}-\d$';
  static const String phonePattern = r'^3\d{2}-\d{7}$';
  static const int passwordMinLength = 8;

  // Pagination
  static const int pageSize = 20;
  static const int initialPage = 1;
}
