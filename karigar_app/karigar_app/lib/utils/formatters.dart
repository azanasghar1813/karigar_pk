import 'package:flutter/services.dart';

class Formatters {
  static final cnicFormatter = TextInputFormatter.withFunction((oldValue, newValue) {
    String text = newValue.text.replaceAll('-', '');
    if (text.isEmpty) return newValue;
    if (text.length > 13) return oldValue;

    StringBuffer buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      if (i == 5 || i == 12) {
        buffer.write('-');
      }
      buffer.write(text[i]);
    }

    return TextEditingValue(
      text: buffer.toString(),
      selection: TextSelection.collapsed(offset: buffer.toString().length),
    );
  });

  static final phoneFormatter = TextInputFormatter.withFunction((oldValue, newValue) {
    String text = newValue.text.replaceAll('-', '');
    if (text.isEmpty) return newValue;
    if (text.length > 10) return oldValue;

    StringBuffer buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      if (i == 3) {
        buffer.write('-');
      }
      buffer.write(text[i]);
    }

    return TextEditingValue(
      text: buffer.toString(),
      selection: TextSelection.collapsed(offset: buffer.toString().length),
    );
  });

  static String formatPrice(double price) {
    return 'Rs. ${price.toStringAsFixed(0)}';
  }

  static String formatRating(double rating) {
    return rating.toStringAsFixed(1);
  }

  static String formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  static String formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}