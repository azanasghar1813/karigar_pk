import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';
import '../../../utils/call_launcher.dart';
import '../../../utils/responsive.dart';

class HeroSection extends StatelessWidget {
  const HeroSection({super.key});

  @override
  Widget build(BuildContext context) {
    final isWide = Responsive.sizeOf(context) != ScreenSize.mobile;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(gradient: AppTheme.heroGradient),
      child: ResponsiveContainer(
        padding: EdgeInsets.symmetric(
          horizontal: Responsive.horizontalPadding(context),
          vertical: isWide ? 56 : 40,
        ),
        child: _buildCopy(context, large: isWide),
      ),
    );
  }

  Widget _buildCopy(BuildContext context, {required bool large}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
          ),
          child: Text(
            '🇵🇰 Pakistan\'s #1 Home Services',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Professional Home\nServices at Your Door',
          style: (large
                  ? Theme.of(context).textTheme.displayLarge
                  : Theme.of(context).textTheme.displayMedium)
              ?.copyWith(color: Colors.white, height: 1.1),
        ),
        const SizedBox(height: 14),
        Text(
          'Book verified electricians, plumbers, carpenters & more — or request a quick callback from our team.',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.white.withValues(alpha: 0.88),
              ),
        ),
        const SizedBox(height: 28),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            FilledButton.icon(
              onPressed: () => CallLauncher.requestCall(context),
              icon: const Icon(Icons.phone_in_talk_rounded),
              label: const Text('Request a Call'),
              style: FilledButton.styleFrom(
                backgroundColor: AppTheme.secondaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 18),
                textStyle: const TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            OutlinedButton.icon(
              onPressed: () => context.go('/find-karigar'),
              icon: const Icon(Icons.search_rounded),
              label: const Text('Find Karigar'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: BorderSide(color: Colors.white.withValues(alpha: 0.5)),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
