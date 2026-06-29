import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../providers/app_provider.dart';
import '../utils/responsive.dart';
import '../widgets/app_logo.dart';
import 'navbar.dart';

class KarigarScaffold extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const KarigarScaffold({
    super.key,
    required this.navigationShell,
  });

  static const _destinations = [
    (icon: Icons.dashboard_outlined, active: Icons.dashboard_rounded, label: 'Dashboard'),
    (icon: Icons.assignment_outlined, active: Icons.assignment_rounded, label: 'Requests'),
    (icon: Icons.calendar_month_outlined, active: Icons.calendar_month_rounded, label: 'Schedule'),
    (icon: Icons.account_balance_wallet_outlined, active: Icons.account_balance_wallet_rounded, label: 'Earnings'),
    (icon: Icons.person_outline_rounded, active: Icons.person_rounded, label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    final useRail = !Responsive.isMobile(context);

    return Scaffold(
      appBar: const KarigarNavbar(), // We can reuse or create a Karigar specific navbar
      drawer: useRail ? null : _KarigarDrawer(currentIndex: navigationShell.currentIndex),
      body: Row(
        children: [
          if (useRail) _buildNavigationRail(context),
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 280),
              switchInCurve: Curves.easeOutCubic,
              switchOutCurve: Curves.easeInCubic,
              child: KeyedSubtree(
                key: ValueKey(navigationShell.currentIndex),
                child: ShellTabBody(child: navigationShell),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: useRail
          ? null
          : NavigationBar(
              selectedIndex: navigationShell.currentIndex,
              onDestinationSelected: navigationShell.goBranch,
              destinations: _destinations
                  .map(
                    (d) => NavigationDestination(
                      icon: Icon(d.icon),
                      selectedIcon: Icon(d.active),
                      label: d.label,
                    ),
                  )
                  .toList(),
            ),
    );
  }

  Widget _buildNavigationRail(BuildContext context) {
    return NavigationRail(
      selectedIndex: navigationShell.currentIndex,
      onDestinationSelected: navigationShell.goBranch,
      extended: Responsive.isDesktop(context),
      minExtendedWidth: 180,
      labelType: Responsive.isDesktop(context)
          ? NavigationRailLabelType.none
          : NavigationRailLabelType.selected,
      destinations: _destinations
          .map(
            (d) => NavigationRailDestination(
              icon: Icon(d.icon),
              selectedIcon: Icon(d.active),
              label: Text(d.label),
            ),
          )
          .toList(),
    );
  }
}

class _KarigarDrawer extends StatelessWidget {
  final int currentIndex;

  const _KarigarDrawer({required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(gradient: AppTheme.heroGradient),
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const AppLogo(size: 48, showBorder: true),
                  const SizedBox(height: 12),
                  const Text(
                    'Karigar Portal',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    'Manage your work easily',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.88),
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ),
          _drawerTile(context, Icons.dashboard_rounded, 'Dashboard', 0, currentIndex),
          _drawerTile(context, Icons.assignment_rounded, 'Requests', 1, currentIndex),
          _drawerTile(context, Icons.calendar_month_rounded, 'Schedule', 2, currentIndex),
          _drawerTile(context, Icons.account_balance_wallet_rounded, 'Earnings', 3, currentIndex),
          _drawerTile(context, Icons.person_rounded, 'Profile', 4, currentIndex),
          const Divider(),
          ListTile(
            leading: Icon(context.watch<AppProvider>().isDarkMode ? Icons.light_mode_outlined : Icons.dark_mode_outlined),
            title: Text(context.watch<AppProvider>().isDarkMode ? 'Light Mode' : 'Dark Mode'),
            onTap: () {
              context.read<AppProvider>().toggleTheme();
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout, color: AppTheme.errorColor),
            title: const Text('Logout', style: TextStyle(color: AppTheme.errorColor)),
            onTap: () async {
              Navigator.pop(context);
              await context.read<AuthProvider>().logout();
              if (context.mounted) context.go('/');
            },
          ),
        ],
      ),
    );
  }

  Widget _drawerTile(
    BuildContext context,
    IconData icon,
    String title,
    int index,
    int selected,
  ) {
    final isSelected = index == selected;
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? AppTheme.secondaryColor : (Theme.of(context).textTheme.bodyMedium?.color ?? Colors.grey),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          color: isSelected ? Theme.of(context).colorScheme.onSurface : (Theme.of(context).textTheme.bodyMedium?.color ?? Colors.grey),
        ),
      ),
      selected: isSelected,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      onTap: () {
        Navigator.pop(context);
        if (!isSelected) {
          context.go(_branchPath(index));
        }
      },
    );
  }

  String _branchPath(int index) {
    switch (index) {
      case 0:
        return '/karigar/dashboard';
      case 1:
        return '/karigar/requests';
      case 2:
        return '/karigar/schedule';
      case 3:
        return '/karigar/earnings';
      case 4:
        return '/karigar/profile';
      default:
        return '/karigar/dashboard';
    }
  }
}

