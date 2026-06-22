import 'package:flutter/material.dart';

enum ScreenSize { mobile, tablet, desktop }

class Responsive {
  static const double mobileMax = 600;
  static const double tabletMax = 1024;
  static const double contentMaxWidth = 1200;

  static ScreenSize sizeOf(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    if (w >= tabletMax) return ScreenSize.desktop;
    if (w >= mobileMax) return ScreenSize.tablet;
    return ScreenSize.mobile;
  }

  static bool isMobile(BuildContext context) =>
      sizeOf(context) == ScreenSize.mobile;

  static bool isDesktop(BuildContext context) =>
      sizeOf(context) == ScreenSize.desktop;

  static double horizontalPadding(BuildContext context) {
    switch (sizeOf(context)) {
      case ScreenSize.desktop:
        return 32;
      case ScreenSize.tablet:
        return 24;
      case ScreenSize.mobile:
        return 16;
    }
  }

  static int gridColumns(BuildContext context, {int mobile = 2, int tablet = 3, int desktop = 4}) {
    switch (sizeOf(context)) {
      case ScreenSize.desktop:
        return desktop;
      case ScreenSize.tablet:
        return tablet;
      case ScreenSize.mobile:
        return mobile;
    }
  }

  static int serviceGridColumns(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    if (w >= tabletMax) return 6;
    if (w >= mobileMax) return 4;
    return 4;
  }

  static double testimonialCardWidth(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    if (w >= tabletMax) return 340;
    if (w >= mobileMax) return 300;
    return w * 0.82;
  }

  /// Extra scroll padding so content clears bottom nav + WhatsApp FAB.
  static double shellBottomScrollPadding(BuildContext context) {
    if (!isMobile(context)) return 32;
    return kBottomNavigationBarHeight + kFloatingActionButtonMargin * 2 + 56;
  }

  /// Grid aspect ratio for service cards (taller on narrow screens).
  static double serviceCardAspectRatio(BuildContext context, int columns) {
    if (columns == 1) return 1.35;
    if (columns == 2) return 1.05;
    return 0.92;
  }

  /// Grid aspect ratio for karigar cards.
  static double karigarCardAspectRatio(BuildContext context, int columns) {
    if (columns <= 2) return 0.58;
    if (columns == 3) return 0.70;
    return 0.76;
  }

  /// Home page "Our Services" grid (4 columns on mobile).
  static double homeServicesGridAspectRatio(BuildContext context, int columns) {
    if (columns >= 6) return 0.95;
    if (columns == 4) return 0.56;
    if (columns == 3) return 0.72;
    return 0.88;
  }

  static double gridChildAspectRatio(BuildContext context, {double mobile = 1.05}) {
    switch (sizeOf(context)) {
      case ScreenSize.desktop:
        return 0.95;
      case ScreenSize.tablet:
        return 1.0;
      case ScreenSize.mobile:
        return mobile;
    }
  }
}

/// Wraps tab content so lists/grids respect bottom nav and FAB.
class ShellTabBody extends StatelessWidget {
  final Widget child;

  const ShellTabBody({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      bottom: false,
      child: child,
    );
  }
}

/// Bottom padding for the last sliver in shell tab scroll views.
class ShellBottomSliverPadding extends StatelessWidget {
  const ShellBottomSliverPadding({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: EdgeInsets.only(
        bottom: Responsive.shellBottomScrollPadding(context),
      ),
    );
  }
}

/// Centers content and caps width on large screens.
class ResponsiveContainer extends StatelessWidget {
  final Widget child;
  final double? maxWidth;
  final EdgeInsetsGeometry? padding;

  const ResponsiveContainer({
    super.key,
    required this.child,
    this.maxWidth,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final pad = padding ??
        EdgeInsets.symmetric(
          horizontal: Responsive.horizontalPadding(context),
        );
    return Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: maxWidth ?? Responsive.contentMaxWidth,
        ),
        child: Padding(
          padding: pad,
          child: child,
        ),
      ),
    );
  }
}

class ResponsiveBuilder extends StatelessWidget {
  final Widget Function(BuildContext context, ScreenSize size) builder;

  const ResponsiveBuilder({super.key, required this.builder});

  @override
  Widget build(BuildContext context) => builder(context, Responsive.sizeOf(context));
}
