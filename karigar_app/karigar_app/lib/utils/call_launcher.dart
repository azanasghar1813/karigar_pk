import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';
import '../config/theme.dart';

class CallLauncher {
  static Future<void> requestCall(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Request a call'),
        content: Text(
          'Our team will call you shortly at ${AppConstants.supportDisplayPhone}.\n\n'
          'Tap Call now to speak with Karigar support right away.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton.icon(
            onPressed: () => Navigator.pop(ctx, true),
            icon: const Icon(Icons.phone_rounded),
            label: const Text('Call now'),
            style: FilledButton.styleFrom(
              backgroundColor: AppTheme.secondaryColor,
            ),
          ),
        ],
      ),
    );

    if (confirmed != true || !context.mounted) return;

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
