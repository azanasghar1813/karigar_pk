import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../components/footer.dart';
import '../../utils/responsive.dart';
import '../../widgets/section_header.dart';
import 'widgets/hero_section.dart';
import 'widgets/quick_booking_form.dart';
import 'widgets/services_grid.dart';
import 'widgets/how_it_works.dart';
import 'widgets/testimonials.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      physics: const BouncingScrollPhysics(
        parent: AlwaysScrollableScrollPhysics(),
      ),
      slivers: [
        const SliverToBoxAdapter(child: HeroSection()),
        SliverToBoxAdapter(
          child: ResponsiveContainer(
            padding: EdgeInsets.only(
              left: Responsive.horizontalPadding(context),
              right: Responsive.horizontalPadding(context),
              top: 28,
              bottom: 16,
            ),
            child: const QuickBookingForm(),
          ),
        ),
        SliverToBoxAdapter(
          child: ResponsiveContainer(
            child: Column(
              children: [
                SectionHeader(
                  title: 'Our Services',
                  subtitle: 'Tap a service to find professionals near you',
                  onViewAll: () => context.go('/services'),
                ),
                const SizedBox(height: 20),
                const ServicesGrid(),
                const SizedBox(height: 48),
                const SectionHeader(
                  title: 'How It Works',
                  subtitle: 'Book a trusted karigar in four simple steps',
                ),
                const SizedBox(height: 20),
                const HowItWorks(),
                const SizedBox(height: 48),
                const Testimonials(),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
        const SliverToBoxAdapter(child: AppFooter()),
        const ShellBottomSliverPadding(),
      ],
    );
  }
}
