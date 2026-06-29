import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import 'config/theme.dart';
import 'config/routes.dart';
import 'config/constants.dart';
import 'providers/auth_provider.dart';
import 'providers/karigar_provider.dart';
import 'providers/booking_provider.dart';
import 'providers/app_provider.dart';
import 'providers/karigar_portal_provider.dart';
import 'services/storage_service.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';
import 'services/notification_service.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
}
void main() async {
  // 1. Core Flutter initialization — must be first.
  final widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  await NotificationService().initialize();

  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print(message.notification?.title);
    print(message.notification?.body);
  });

  // 2. Hold the native splash screen until SplashScreen calls remove().
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);

  // 3. Load preferences synchronously so theme is known before frame 1.
  final prefs = await SharedPreferences.getInstance();
  storageService.injectPrefs(prefs);

  final authProvider = AuthProvider(storageService: storageService);
  final appProvider = AppProvider()..initFromPrefs(prefs);
  final router = createRouter(authProvider);

  // 4. Fire background server warmup — non-blocking.
  Future.microtask(() => _warmupServer());

  // 5. Launch the app — ONE MaterialApp.router, no nested MaterialApp.
  runApp(KarigarApp(
    authProvider: authProvider,
    appProvider: appProvider,
    router: router,
  ));
}

/// Wakes the Render.com free-tier server in the background.
void _warmupServer() {
  Dio(
    BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: AppConstants.warmupTimeout,
      receiveTimeout: AppConstants.warmupTimeout,
    ),
  )
      .get('/api/health')
      .catchError((_) => Response(requestOptions: RequestOptions(path: '/')));
}

// ─────────────────────────────────────────────────────────────────────────────
// Single root widget — one MaterialApp.router, providers, done.
// The splash → home transition is handled entirely inside GoRouter:
//   initialLocation: '/splash'  →  SplashScreen navigates to '/'  →
//   GoRouter redirect picks the right destination (karigar portal / home / …)
// ─────────────────────────────────────────────────────────────────────────────

class KarigarApp extends StatelessWidget {
  final AuthProvider authProvider;
  final AppProvider appProvider;
  final GoRouter router;

  const KarigarApp({
    super.key,
    required this.authProvider,
    required this.appProvider,
    required this.router,
  });

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: authProvider),
        // Lazy by default — won't inflate until the tab is first visited.
        ChangeNotifierProvider(create: (_) => KarigarProvider()),
        ChangeNotifierProvider(create: (_) => BookingProvider()),
        ChangeNotifierProvider.value(value: appProvider),
        ChangeNotifierProvider(create: (_) => KarigarPortalProvider()),
      ],
      child: Consumer<AppProvider>(
        builder: (context, app, _) {
          return MaterialApp.router(
            title: 'Karigar PK',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: app.isDarkMode ? ThemeMode.dark : ThemeMode.light,
            routerConfig: router,
            scrollBehavior: const MaterialScrollBehavior().copyWith(
              physics: const BouncingScrollPhysics(
                parent: AlwaysScrollableScrollPhysics(),
              ),
              dragDevices: {
                PointerDeviceKind.touch,
                PointerDeviceKind.mouse,
                PointerDeviceKind.trackpad,
                PointerDeviceKind.stylus,
              },
            ),
          );
        },
      ),
    );
  }
}