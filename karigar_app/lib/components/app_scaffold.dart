import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../config/theme.dart';
import '../utils/responsive.dart';
import '../widgets/app_logo.dart';
import 'navbar.dart';
import '../utils/whatsapp_launcher.dart';
import '../widgets/whatsapp_button.dart';

class AppScaffold extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const AppScaffold({
    super.key,
    required this.navigationShell,
  });

  static const _destinations = [
    (icon: Icons.home_outlined, active: Icons.home_rounded, label: 'Home'),
    (
      icon: Icons.grid_view_outlined,
      active: Icons.grid_view_rounded,
      label: 'Services'
    ),
    (icon: Icons.search_rounded, active: Icons.search_rounded, label: 'Find'),
    (
      icon: Icons.person_outline_rounded,
      active: Icons.person_rounded,
      label: 'Account'
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final useRail = !Responsive.isMobile(context);

    final isMobile = Responsive.isMobile(context);

    return Scaffold(
      appBar: const KarigarNavbar(),
      drawer: useRail ? null : _AppDrawer(currentIndex: navigationShell.currentIndex),
      floatingActionButton: isMobile
          ? FloatingActionButton(
              heroTag: 'whatsapp_fab',
              onPressed: () => WhatsAppLauncher.openOrSnackBar(context),
              backgroundColor: whatsAppGreen,
              child: const WhatsAppIcon(size: 26),
            )
          : const WhatsAppFab(),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
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
      leading: Padding(
        padding: const EdgeInsets.only(top: 8, bottom: 8),
        child: FloatingActionButton.small(
          heroTag: 'join_karigar_fab',
          backgroundColor: AppTheme.secondaryColor,
          onPressed: () => context.pushNamed('join-karigar'),
          child: const Icon(Icons.add, color: Colors.white),
        ),
      ),
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

class _AppDrawer extends StatelessWidget {
  final int currentIndex;

  const _AppDrawer({required this.currentIndex});

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
                    'Karigar PK',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    'Trusted home services across Pakistan',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.88),
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ),
          _drawerTile(context, Icons.home_rounded, 'Home', 0, currentIndex),
          _drawerTile(context, Icons.grid_view_rounded, 'Services', 1, currentIndex),
          _drawerTile(context, Icons.search_rounded, 'Find Karigar', 2, currentIndex),
          _drawerTile(context, Icons.person_rounded, 'My Account', 3, currentIndex),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.info_outline_rounded),
            title: const Text('About Us'),
            onTap: () {
              Navigator.pop(context);
              context.pushNamed('about');
            },
          ),
          ListTile(
            leading: const Icon(Icons.article_outlined),
            title: const Text('Blog'),
            onTap: () {
              Navigator.pop(context);
              context.pushNamed('blog');
            },
          ),
          ListTile(
            leading: const Icon(Icons.mail_outline_rounded),
            title: const Text('Contact'),
            onTap: () {
              Navigator.pop(context);
              context.pushNamed('contact');
            },
          ),
          ListTile(
            leading: const Icon(Icons.handyman_outlined, color: AppTheme.secondaryColor),
            title: const Text('Join as Karigar'),
            onTap: () {
              Navigator.pop(context);
              context.pushNamed('join-karigar');
            },
          ),
          ListTile(
            leading: Icon(context.watch<AppProvider>().isDarkMode ? Icons.light_mode_outlined : Icons.dark_mode_outlined),
            title: Text(context.watch<AppProvider>().isDarkMode ? 'Light Mode' : 'Dark Mode'),
            onTap: () {
              context.read<AppProvider>().toggleTheme();
            },
          ),
          ListTile(
            leading: const WhatsAppIcon(size: 24),
            title: const Text('WhatsApp Support'),
            onTap: () {
              Navigator.pop(context);
              WhatsAppLauncher.openOrSnackBar(context);
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
        color: isSelected ? AppTheme.secondaryColor : AppTheme.textSecondary,
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          color: isSelected ? AppTheme.textPrimary : AppTheme.textSecondary,
        ),
      ),
      selected: isSelected,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      onTap: () {
        Navigator.pop(context);
        if (!isSelected) context.go(_branchPath(index));
      },
    );
  }

  String _branchPath(int index) {
    switch (index) {
      case 1:
        return '/services';
      case 2:
        return '/find-karigar';
      case 3:
        return '/my-account';
      default:
        return '/';
    }
  }
}
