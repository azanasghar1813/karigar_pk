import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../utils/responsive.dart';
import '../widgets/app_logo.dart';
import '../widgets/whatsapp_button.dart';

class KarigarNavbar extends StatelessWidget implements PreferredSizeWidget {
  const KarigarNavbar({super.key});

  @override
  Widget build(BuildContext context) {
    final isLoggedIn = context.watch<AuthProvider>().isAuthenticated;
    final isMobile = Responsive.isMobile(context);
    final isWide = !isMobile;

    return AppBar(
      titleSpacing: isMobile ? 0 : null,
      title: InkWell(
        onTap: () => context.go('/'),
        borderRadius: BorderRadius.circular(8),
        child: Row(
          children: [
            AppLogo(size: isMobile ? 34 : 40, showBorder: true),
            const SizedBox(width: 10),
            Flexible(
              child: Text(
                'Karigar PK',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        if (isWide) ...[
          const _NavLink(label: 'Home', path: '/'),
          const _NavLink(label: 'Services', path: '/services'),
          const _NavLink(label: 'Find', path: '/find-karigar'),
          const SizedBox(width: 8),
          const WhatsAppButton(extended: false),
        ],
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          tooltip: 'Notifications',
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('No new notifications')),
            );
          },
        ),
        Padding(
          padding: EdgeInsets.only(right: isMobile ? 4 : 8),
          child: isLoggedIn
              ? (isMobile
                  ? IconButton(
                      tooltip: 'Account',
                      onPressed: () => context.go('/my-account'),
                      icon: const Icon(Icons.person_rounded),
                    )
                  : FilledButton.tonalIcon(
                      onPressed: () => context.go('/my-account'),
                      icon: const Icon(Icons.person_rounded, size: 20),
                      label: const Text('Account'),
                      style: FilledButton.styleFrom(
                        backgroundColor:
                            AppTheme.primaryColor.withValues(alpha: 0.2),
                        foregroundColor: Theme.of(context).colorScheme.onSurface,
                      ),
                    ))
              : (isMobile
                  ? IconButton(
                      tooltip: 'Login',
                      onPressed: () => context.pushNamed('login'),
                      icon: const Icon(Icons.login_rounded),
                    )
                  : OutlinedButton.icon(
                      onPressed: () => context.pushNamed('login'),
                      icon: const Icon(Icons.login_rounded, size: 18),
                      label: const Text('Login'),
                    )),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _NavLink extends StatelessWidget {
  final String label;
  final String path;

  const _NavLink({required this.label, required this.path});

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final active = location == path ||
        (path == '/find-karigar' && location.startsWith('/find-karigar'));

    return TextButton(
      onPressed: () => context.go(path),
      style: TextButton.styleFrom(
        foregroundColor:
            active ? AppTheme.secondaryColor : (Theme.of(context).textTheme.bodyMedium?.color ?? Colors.grey),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontWeight: active ? FontWeight.w700 : FontWeight.w500,
        ),
      ),
    );
  }
}

class Navbar extends KarigarNavbar {
  const Navbar({super.key});
}
