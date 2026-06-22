import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';

class JoinKarigarScreen extends StatelessWidget {
  const JoinKarigarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Join Karigar'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header
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
                    'Grow Your Business',
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Join thousands of professionals earning with Karigar',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Benefits
                  _buildBenefitSection(context),
                  const SizedBox(height: 40),

                  // Why Join
                  Text(
                    'Why Join Karigar?',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 16),
                  _buildWhyJoinCard(
                    context,
                    '📊',
                    'Grow Your Reach',
                    'Access thousands of customers looking for your services',
                  ),
                  const SizedBox(height: 12),
                  _buildWhyJoinCard(
                    context,
                    '💰',
                    'Earn More',
                    'Set your own rates and increase your income',
                  ),
                  const SizedBox(height: 12),
                  _buildWhyJoinCard(
                    context,
                    '⭐',
                    'Build Reputation',
                    'Earn ratings and reviews to boost your credibility',
                  ),
                  const SizedBox(height: 12),
                  _buildWhyJoinCard(
                    context,
                    '🛡️',
                    'Safe & Secure',
                    'Verified bookings and secure payment system',
                  ),
                  const SizedBox(height: 40),

                  // How It Works
                  Text(
                    'How It Works',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 16),
                  _buildHowItWorksStep(context, '1', 'Register', 'Create your profile'),
                  const SizedBox(height: 12),
                  _buildHowItWorksStep(context, '2', 'Get Verified', 'Complete CNIC verification'),
                  const SizedBox(height: 12),
                  _buildHowItWorksStep(context, '3', 'Get Bookings', 'Start receiving orders'),
                  const SizedBox(height: 12),
                  _buildHowItWorksStep(context, '4', 'Earn Money', 'Get paid directly to your account'),
                  const SizedBox(height: 40),

                  // Requirements
                  Text(
                    'Requirements',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 16),
                  _buildRequirement(context, '✓ Valid CNIC'),
                  _buildRequirement(context, '✓ Valid Phone Number'),
                  _buildRequirement(context, '✓ Experience in your field'),
                  _buildRequirement(context, '✓ Valid Bank Account'),
                  const SizedBox(height: 40),

                  // CTA Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondaryColor,
                      ),
                      onPressed: () => context.pushNamed('register-karigar'),
                      child: const Text('Register Now'),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Already registered
                  Center(
                    child: RichText(
                      text: TextSpan(
                        text: 'Already registered? ',
                        style: Theme.of(context).textTheme.bodySmall,
                        children: [
                          TextSpan(
                            text: 'Login',
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(
                              color: AppTheme.secondaryColor,
                              fontWeight: FontWeight.bold,
                            ),
                            recognizer: TapGestureRecognizer()
                              ..onTap = () => context.pushNamed('login'),
                          ),
                        ],
                      ),
                    ),
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

  Widget _buildBenefitSection(BuildContext context) {
    final benefits = [
      '💼 Professional Platform',
      '📱 Easy to Use App',
      '💳 Secure Payments',
      '⭐ Rating System',
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: benefits.length,
      itemBuilder: (context, index) {
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.darkBorder),
          ),
          child: Center(
            child: Text(
              benefits[index],
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ),
        );
      },
    );
  }

  Widget _buildWhyJoinCard(
      BuildContext context,
      String emoji,
      String title,
      String description,
      ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.darkBorder),
      ),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 28)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHowItWorksStep(
      BuildContext context,
      String number,
      String title,
      String description,
      ) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: AppTheme.primaryColor,
          ),
          child: Center(
            child: Text(
              number,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              Text(
                description,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRequirement(BuildContext context, String requirement) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(
        requirement,
        style: Theme.of(context).textTheme.bodySmall,
      ),
    );
  }
}