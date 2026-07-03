import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';
import '../config/theme.dart';

class CallLauncher {
  static Future<void> callSupport(BuildContext context) async {
    final uri = Uri.parse('tel:${AppConstants.supportPhone}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Call us at ${AppConstants.supportDisplayPhone}',
          ),
        ),
      );
    }
  }
}
