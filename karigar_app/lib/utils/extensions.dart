extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }

  bool isValidEmail() {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(this);
  }

  bool isValidPhone() {
    final phoneRegex = RegExp(r'^3\d{2}-\d{7}$');
    return phoneRegex.hasMatch(this);
  }

  bool isValidCNIC() {
    final cnicRegex = RegExp(r'^\d{5}-\d{7}-\d$');
    return cnicRegex.hasMatch(this);
  }
}

extension DateTimeExtension on DateTime {
  String toFormattedString() {
    return '$day/$month/$year';
  }

  String toTimeString() {
    return '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';
  }

  bool isToday() {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  bool isTomorrow() {
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    return year == tomorrow.year && month == tomorrow.month && day == tomorrow.day;
  }
}

extension DoubleExtension on double {
  String toPriceString() {
    return 'Rs. ${toStringAsFixed(0)}';
  }

  String toRatingString() {
    return toStringAsFixed(1);
  }
}

extension IntExtension on int {
  String toOrdinal() {
    if (this % 100 >= 11 && this % 100 <= 13) {
      return '${this}th';
    }
    switch (this % 10) {
      case 1:
        return '${this}st';
      case 2:
        return '${this}nd';
      case 3:
        return '${this}rd';
      default:
        return '${this}th';
    }
  }
}