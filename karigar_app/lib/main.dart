import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
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

final StorageService storageService = StorageService();

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Fire a background warmup ping to the Render server immediately
  _warmupServer();

  runApp(const AppInitializer());
}

void _warmupServer() {
  Dio(
    BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: AppConstants.warmupTimeout,
      receiveTimeout: AppConstants.warmupTimeout,
    ),
  ).get('/api/health').catchError((_) => Response(requestOptions: RequestOptions(path: '/')));
}

class AppInitializer extends StatefulWidget {
  const AppInitializer({super.key});

  @override
  State<AppInitializer> createState() => _AppInitializerState();
}

class _AppInitializerState extends State<AppInitializer> {
  late Future<SharedPreferences> _initFuture;

  @override
  void initState() {
    super.initState();
    // Initialize SharedPreferences using a Future so the UI doesn't block natively.
    _initFuture = _initializeApp();
  }

  Future<SharedPreferences> _initializeApp() async {
    final prefs = await SharedPreferences.getInstance();
    storageService.injectPrefs(prefs);
    return prefs;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<SharedPreferences>(
      future: _initFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting || !snapshot.hasData) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            home: Scaffold(
              backgroundColor: AppTheme.primaryColor,
              body: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Image.asset('assets/images/app_logo.png', width: 120, height: 120),
                    const SizedBox(height: 24),
                    const CircularProgressIndicator(color: Colors.white),
                  ],
                ),
              ),
            ),
          );
        }

        final prefs = snapshot.data!;
        final authProvider = AuthProvider(storageService: storageService);
        final appProvider = AppProvider()..initFromPrefs(prefs);
        final router = createRouter(authProvider);

        return KarigarApp(
          authProvider: authProvider,
          appProvider: appProvider,
          router: router,
        );
      },
    );
  }
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
