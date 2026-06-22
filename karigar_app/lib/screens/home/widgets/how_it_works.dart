import 'package:flutter/material.dart';
import '../../../config/theme.dart';
import '../../../utils/responsive.dart';

class HowItWorks extends StatelessWidget {
  const HowItWorks({super.key});

  static const _steps = [
    (Icons.touch_app_rounded, 'Select Service', 'Pick what you need from 9+ categories'),
    (Icons.person_search_rounded, 'Find Karigar', 'Browse CNIC-verified professionals'),
    (Icons.event_available_rounded, 'Book Now', 'Schedule at your preferred time'),
    (Icons.star_rounded, 'Rate & Review', 'Help others choose the best'),
  ];

  @override
  Widget build(BuildContext context) {
    final isWide = Responsive.sizeOf(context) == ScreenSize.desktop;

    if (isWide) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: _steps
            .map((s) => Expanded(child: _StepCard(step: s)))
            .toList(),
      );
    }

    return Column(
      children: List.generate(_steps.length, (i) {
        return Padding(
          padding: EdgeInsets.only(bottom: i < _steps.length - 1 ? 12 : 0),
          child: _StepCard(step: _steps[i], showConnector: i < _steps.length - 1),
        );
      }),
    );
  }
}

class _StepCard extends StatelessWidget {
  final (IconData, String, String) step;
  final bool showConnector;

  const _StepCard({required this.step, this.showConnector = false});

  @override
  Widget build(BuildContext context) {
    final (icon, title, description) = step;

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.darkBorder),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.primaryColor.withValues(alpha: 0.3),
                      AppTheme.primaryColor.withValues(alpha: 0.1),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: AppTheme.primaryColor.withValues(alpha: 0.4),
                  ),
                ),
                child: Icon(icon, color: AppTheme.primaryColor, size: 26),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 4),
                    Text(description, style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (showConnector)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Icon(
              Icons.keyboard_arrow_down_rounded,
              color: AppTheme.darkBorder,
            ),
          ),
      ],
    );
  }
}
