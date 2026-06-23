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
import '../widgets/shell_lazy_tab.dart';

// ─────────────────────────────────────────────────────────────────────────────
// ALL keys are top-level file-scope constants. They are created ONCE for the
// entire lifetime of the app process. Flutter crashes when the same GlobalKey
// appears twice in the widget tree — so these must NEVER be created inside a
// class, build method, or any callable that can be invoked more than once.
// ─────────────────────────────────────────────────────────────────────────────

/// Root navigator key — used by GoRouter and standalone (modal) routes.
final GlobalKey<NavigatorState> rootNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'root');

// ─────────────────────────────────────────────────────────────────────────────
// createRouter() is called EXACTLY ONCE from main(). The returned GoRouter is
// stored by the caller and passed into MaterialApp.router.
//
// IMPORTANT: StatefulShellRoute.indexedStack MUST NOT have parentNavigatorKey.
// It manages its own internal GlobalKey<StatefulNavigationShellState>. If you
// pass parentNavigatorKey, go_router re-inserts the shell under the root
// navigator on every refresh, causing duplicate-GlobalKey crashes.
// Only regular GoRoutes that should appear as modal overlays (above the shell)
// need parentNavigatorKey: rootNavigatorKey.
// ─────────────────────────────────────────────────────────────────────────────
GoRouter createRouter(AuthProvider authProvider) {
  return GoRouter(
    navigatorKey: rootNavigatorKey,
    refreshListenable: authProvider,
    initialLocation: '/',
    redirect: (context, state) {
      // Wait until cached auth is loaded — avoids wrong redirects on cold start.
      if (!authProvider.isInitialized) return null;

      final isAuth = authProvider.isAuthenticated;
      final isKarigar = authProvider.user?.userType == 'karigar';
      final path = state.uri.path;
      final isGoingToKarigarPath = path.startsWith('/karigar');
      final isAuthRoute =
          path == '/login' || path == '/signup' || path == '/register-karigar';

      // Karigar logged in → redirect to karigar dashboard (except auth routes)
      if (isAuth && isKarigar && !isGoingToKarigarPath && !isAuthRoute) {
        return '/karigar/dashboard';
      }

      // Regular customer logged in → can't visit karigar portal
      if (isAuth && !isKarigar && isGoingToKarigarPath) {
        return '/';
      }

      // Not logged in → can't visit karigar portal
      if (!isAuth && isGoingToKarigarPath) {
        return '/login';
      }

      return null;
    },
    routes: [
      // ── Customer Shell ────────────────────────────────────────────────────
      // NO parentNavigatorKey — StatefulShellRoute manages its own key.
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            AppScaffold(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/',
                name: 'home',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 0,
                  child: HomeScreen(),
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/services',
                name: 'services',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 1,
                  child: ServicesScreen(),
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/find-karigar',
                name: 'find-karigar',
                builder: (context, state) => ShellLazyTab(
                  branchIndex: 2,
                  child: FindKarigarScreen(
                    service: state.uri.queryParameters['service'],
                    city: state.uri.queryParameters['city'],
                  ),
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/my-account',
                name: 'my-account',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 3,
                  child: MyAccountScreen(),
                ),
              ),
            ],
          ),
        ],
      ),

      // ── Karigar Shell ─────────────────────────────────────────────────────
      // NO parentNavigatorKey — same rule applies.
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            KarigarScaffold(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/dashboard',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 0,
                  child: KarigarDashboardScreen(),
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/requests',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 1,
                  child: KarigarRequestsScreen(),
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/schedule',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 2,
                  child: KarigarScheduleScreen(),
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/earnings',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 3,
                  child: KarigarEarningsScreen(),
                ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/karigar/profile',
                builder: (context, state) => const ShellLazyTab(
                  branchIndex: 4,
                  child: KarigarProfileScreen(),
                ),
              ),
            ],
          ),
        ],
      ),

      // ── Modal / standalone routes (pushed on top of the shell) ────────────
      // These routes overlay on top of the shell, so they DO need
      // parentNavigatorKey: rootNavigatorKey so they use the root navigator
      // instead of the shell's nested navigator.
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/worker/:id',
        name: 'worker-profile',
        builder: (context, state) => WorkerProfileScreen(
          workerId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/book/:id',
        name: 'book-now',
        builder: (context, state) => BookNowScreen(
          workerId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/register-karigar',
        name: 'register-karigar',
        builder: (context, state) => const RegisterKarigarScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/join-karigar',
        name: 'join-karigar',
        builder: (context, state) => const JoinKarigarScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/about',
        name: 'about',
        builder: (context, state) => const AboutScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/blog',
        name: 'blog',
        builder: (context, state) => const BlogScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/contact',
        name: 'contact',
        builder: (context, state) => const ContactScreen(),
      ),
    ],
  );
}
