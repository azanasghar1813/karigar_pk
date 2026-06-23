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

Future<void> main() async {
  final widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);

  // Wake Render server in parallel — never block UI on this.
  _warmupServer();

  final prefs = await SharedPreferences.getInstance();
  storageService.injectPrefs(prefs);

  final authProvider = AuthProvider(storageService: storageService);
  final appProvider = AppProvider()..initFromPrefs(prefs);
  final router = createRouter(authProvider);

  runApp(
    KarigarApp(
      authProvider: authProvider,
      appProvider: appProvider,
      router: router,
    ),
  );

  // Drop native splash as soon as the first frame is ready.
  WidgetsBinding.instance.addPostFrameCallback((_) {
    FlutterNativeSplash.remove();
  });
}

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
        ChangeNotifierProvider(create: (_) => KarigarProvider()),
        ChangeNotifierProvider(create: (_) => BookingProvider()),
        ChangeNotifierProvider.value(value: appProvider),
        ChangeNotifierProvider(create: (_) => KarigarPortalProvider()),
      ],
      child: Consumer<AppProvider>(
        builder: (context, appProvider, child) {
          return MaterialApp.router(
            title: 'Karigar PK',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            routerConfig: router,
            themeMode: appProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
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
