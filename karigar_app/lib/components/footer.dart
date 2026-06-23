import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../config/constants.dart';
import '../utils/responsive.dart';
import '../widgets/app_logo.dart';
import '../widgets/whatsapp_button.dart';

class AppFooter extends StatelessWidget {
  const AppFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: EdgeInsets.symmetric(
        vertical: 32,
        horizontal: Responsive.horizontalPadding(context),
      ),
      decoration: BoxDecoration(color: Theme.of(context).cardColor,
        border: Border(top: BorderSide(color: Theme.of(context).dividerColor)),
      ),
      child: ResponsiveContainer(
        padding: EdgeInsets.zero,
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const AppLogo(size: 32, showBorder: true),
                const SizedBox(width: 8),
                Text(
                  'Karigar PK',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: AppTheme.textPrimary,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Pakistan\'s Most Trusted Home Services Platform',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 16),
            const WhatsAppButton(),
            const SizedBox(height: 8),
            Text(
              AppConstants.whatsappDisplayNumber,
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 12),
            Text(
              '© ${DateTime.now().year} Karigar PK · All rights reserved',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppTheme.textTertiary,
                    fontSize: 11,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class Footer extends AppFooter {
  const Footer({super.key});
}
