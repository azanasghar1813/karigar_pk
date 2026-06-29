import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:go_router/go_router.dart';

/// The Flutter-side branded splash.
///
/// Shown for ~600 ms immediately after the OS native splash dissolves.
/// Same dark background ensures zero color discontinuity across the
/// native → Flutter → home transition.
///
/// Navigation is driven by [GoRouter]: this screen calls [context.go('/')] and
/// the router's redirect logic decides the actual destination (karigar dashboard,
/// home, etc.) based on auth state.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _logoFade;
  late final Animation<double> _logoScale;
  late final Animation<double> _spinnerFade;

  @override
  void initState() {
    super.initState();

    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    // Logo fades + scales in during the first 65 % of the animation.
    _logoFade = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
    );
    _logoScale = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(
        parent: _ctrl,
        curve: const Interval(0.0, 0.65, curve: Curves.easeOutCubic),
      ),
    );

    // Spinner fades in after the logo has settled.
    _spinnerFade = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.55, 1.0, curve: Curves.easeIn),
    );

    _ctrl.forward();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Release the OS native splash — our Flutter splash takes over.
      FlutterNativeSplash.remove();

      // Short delay: lets the logo animation finish and the first route
      // build in the background before we navigate away.
      Future.delayed(const Duration(milliseconds: 600), () {
        if (mounted) context.go('/');
      });
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Transparent status bar with light icons — matches the dark splash bg.
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));

    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27), // matches native splash
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // ── Logo ──────────────────────────────────────────────────────────
            Image.asset(
              'assets/images/app_logo.png',
              width: 140,
              height: 140,
              filterQuality: FilterQuality.high,
            ),

            const SizedBox(height: 12),

            // ── App name ──────────────────────────────────────────────────────
            FadeTransition(
              opacity: _logoFade,
              child: const Text(
                'Karigar PK',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ),

            const SizedBox(height: 6),

            FadeTransition(
              opacity: _logoFade,
              child: const Text(
                "Pakistan's Most Trusted Home Services",
                style: TextStyle(
                  color: Color(0xFFB8C0CC),
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  letterSpacing: 0.2,
                ),
              ),
            ),

            const SizedBox(height: 40),

            // ── Spinner ───────────────────────────────────────────────────────
            FadeTransition(
              opacity: _spinnerFade,
              child: const SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    Color(0xFFF97316), // brand orange
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
