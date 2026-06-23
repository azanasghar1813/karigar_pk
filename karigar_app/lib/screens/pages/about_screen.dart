import 'package:flutter/material.dart';
import '../../config/theme.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Karigar'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppTheme.primaryColor,
                    AppTheme.primaryColor.withValues(alpha: 0.7),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'About Karigar',
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Connecting quality professionals with customers',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Our Mission',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Karigar is dedicated to connecting verified professionals with customers seeking quality home services. We believe in transparency, trust, and excellence in every service delivered.',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'What We Offer',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 12),
                  _buildOfferingCard(
                    context,
                    'Verified Professionals',
                    'All professionals are CNIC verified for your safety',
                  ),
                  const SizedBox(height: 12),
                  _buildOfferingCard(
                    context,
                    'Wide Service Range',
                    'From electricians to general repairs - we have it all',
                  ),
                  const SizedBox(height: 12),
                  _buildOfferingCard(
                    context,
                    'Secure Payments',
                    'Safe and encrypted payment system for peace of mind',
                  ),
                  const SizedBox(height: 12),
                  _buildOfferingCard(
                    context,
                    'Customer Support',
                    'Dedicated support team available 24/7',
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'Why Choose Karigar?',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '✓ Transparent pricing\n'
                        '✓ Quality assured professionals\n'
                        '✓ Easy booking process\n'
                        '✓ Secure payment system\n'
                        '✓ Customer ratings and reviews\n'
                        '✓ 24/7 customer support',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOfferingCard(
      BuildContext context,
      String title,
      String description,
      ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}