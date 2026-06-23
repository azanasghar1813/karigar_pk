import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';
import '../config/theme.dart';

class WhatsAppLauncher {
  static Uri _waMeUri({String? message}) {
    final text = Uri.encodeComponent(
      message ?? AppConstants.whatsappDefaultMessage,
    );
    return Uri.parse(
      'https://wa.me/${AppConstants.whatsappNumber}?text=$text',
    );
  }

  static Uri _whatsappSchemeUri({String? message}) {
    final text = Uri.encodeComponent(
      message ?? AppConstants.whatsappDefaultMessage,
    );
    return Uri.parse(
      'whatsapp://send?phone=${AppConstants.whatsappNumber}&text=$text',
    );
  }

  static Future<bool> open({String? message}) async {
    final uris = [_waMeUri(message: message), _whatsappSchemeUri(message: message)];

    for (final uri in uris) {
      try {
        final launched = await launchUrl(
          uri,
          mode: LaunchMode.externalApplication,
        );
        if (launched) return true;
      } catch (_) {
        // Try next URI scheme.
      }
    }
    return false;
  }

  static Future<void> openOrSnackBar(
    BuildContext context, {
    String? message,
  }) async {
    final ok = await open(message: message);
    if (!context.mounted) return;
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Could not open WhatsApp. Chat us at ${AppConstants.whatsappDisplayNumber}',
          ),
          backgroundColor: AppTheme.errorColor,
          action: SnackBarAction(
            label: 'Call',
            textColor: Colors.white,
            onPressed: () => launchUrl(
              Uri.parse('tel:${AppConstants.supportPhone}'),
              mode: LaunchMode.externalApplication,
            ),
          ),
        ),
      );
    }
  }
}
