import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'config/routes.dart';
import 'providers/auth_provider.dart';
import 'providers/karigar_provider.dart';
import 'providers/booking_provider.dart';
import 'providers/app_provider.dart';
import 'providers/karigar_portal_provider.dart';
import 'services/storage_service.dart';

final StorageService storageService = StorageService();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await storageService.init();
  runApp(const KarigarApp());
}

class KarigarApp extends StatefulWidget {
  const KarigarApp({super.key});

  @override
  State<KarigarApp> createState() => _KarigarAppState();
}

class _KarigarAppState extends State<KarigarApp> {
  late final AuthProvider _authProvider;
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _authProvider = AuthProvider(storageService: storageService);
    _router = createRouter(_authProvider);
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: _authProvider),
        ChangeNotifierProvider(create: (_) => KarigarProvider()),
        ChangeNotifierProvider(create: (_) => BookingProvider()),
        ChangeNotifierProvider(create: (_) => AppProvider()),
        ChangeNotifierProvider(create: (_) => KarigarPortalProvider()),
      ],
      child: Consumer<AppProvider>(
        builder: (context, appProvider, child) {
          return MaterialApp.router(
            title: 'Karigar PK',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            routerConfig: _router,
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
