import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/home/home_screen.dart';
import '../components/navbar.dart';

/// Legacy entry — prefer [HomeScreen] via GoRouter at `/`.
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const KarigarNavbar(),
      body: const HomeScreen(),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        onDestinationSelected: (index) {
          switch (index) {
            case 1:
              context.go('/services');
            case 2:
              context.go('/find-karigar');
            case 3:
              context.go('/my-account');
            default:
              context.go('/');
          }
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.grid_view), label: 'Services'),
          NavigationDestination(icon: Icon(Icons.search), label: 'Find'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Account'),
        ],
      ),
    );
  }
}
