import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../components/app_scaffold.dart';
import '../components/karigar_scaffold.dart';
import '../providers/auth_provider.dart';

import '../screens/home/home_screen.dart';
import '../screens/services/services_screen.dart';
import '../screens/find_karigar/find_karigar_screen.dart';
import '../screens/find_karigar/worker_profile_screen.dart';
import '../screens/booking/book_now_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/signup_screen.dart';
import '../screens/auth/register_karigar_screen.dart';
import '../screens/join_karigar/join_karigar_screen.dart';
import '../screens/pages/about_screen.dart';
import '../screens/pages/blog_screen.dart';
import '../screens/pages/contact_screen.dart';
import '../screens/pages/my_account_screen.dart';

import '../screens/karigar/karigar_dashboard_screen.dart';
import '../screens/karigar/karigar_requests_screen.dart';
import '../screens/karigar/karigar_schedule_screen.dart';
import '../screens/karigar/karigar_earnings_screen.dart';
import '../screens/karigar/karigar_profile_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();

GoRouter createRouter(AuthProvider authProvider) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    refreshListenable: authProvider,
    initialLocation: '/',
    redirect: (context, state) {
      final isAuth = authProvider.isAuthenticated;
      final isKarigar = authProvider.user?.userType == 'karigar';
      final isGoingToKarigarPath = state.uri.path.startsWith('/karigar');
      
      if (isAuth && isKarigar && !isGoingToKarigarPath) {
        return '/karigar/dashboard';
      }
      
      if (isAuth && !isKarigar && isGoingToKarigarPath) {
        return '/';
      }
      
      if (!isAuth && isGoingToKarigarPath) {
        return '/login';
      }

      return null;
    },
    routes: [
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return AppScaffold(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/',
                name: 'home',
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/services',
                name: 'services',
                builder: (context, state) => const ServicesScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/find-karigar',
                name: 'find-karigar',
                builder: (context, state) => FindKarigarScreen(
                  service: state.uri.queryParameters['service'],
                  city: state.uri.queryParameters['city'],
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/my-account',
                name: 'my-account',
                builder: (context, state) => const MyAccountScreen(),
              ),
            ],
          ),
        ],
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return KarigarScaffold(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/dashboard',
                builder: (context, state) => const KarigarDashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/requests',
                builder: (context, state) => const KarigarRequestsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/schedule',
                builder: (context, state) => const KarigarScheduleScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/earnings',
                builder: (context, state) => const KarigarEarningsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/profile',
                builder: (context, state) => const KarigarProfileScreen(),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: '/worker/:id',
        name: 'worker-profile',
        builder: (context, state) => WorkerProfileScreen(
          workerId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/book/:id',
        name: 'book-now',
        builder: (context, state) => BookNowScreen(
          workerId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/register-karigar',
        name: 'register-karigar',
        builder: (context, state) => const RegisterKarigarScreen(),
      ),
      GoRoute(
        path: '/join-karigar',
        name: 'join-karigar',
        builder: (context, state) => const JoinKarigarScreen(),
      ),
      GoRoute(
        path: '/about',
        name: 'about',
        builder: (context, state) => const AboutScreen(),
      ),
      GoRoute(
        path: '/blog',
        name: 'blog',
        builder: (context, state) => const BlogScreen(),
      ),
      GoRoute(
        path: '/contact',
        name: 'contact',
        builder: (context, state) => const ContactScreen(),
      ),
    ],
  );
}
