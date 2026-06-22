class Validators {
  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter your email';
    }
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@gmail\.com$',
    );
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Please enter a valid Gmail address';
    }
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your password';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return null;
  }

  static String? validateCNIC(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your CNIC';
    }
    final cnicRegex = RegExp(r'^\d{5}-\d{7}-\d$');
    if (!cnicRegex.hasMatch(value)) {
      return 'Please enter CNIC in format: 12345-1234567-1';
    }
    return null;
  }

  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your phone number';
    }
    final phoneRegex = RegExp(r'^3\d{2}-\d{7}$');
    if (!phoneRegex.hasMatch(value)) {
      return 'Please enter phone in format: 312-3456789';
    }
    return null;
  }

  static String? validateFullName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your full name';
    }
    if (value.length < 3) {
      return 'Name must be at least 3 characters';
    }
    return null;
  }

  static String? validateAddress(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your address';
    }
    if (value.length < 10) {
      return 'Please enter a complete address';
    }
    return null;
  }
}