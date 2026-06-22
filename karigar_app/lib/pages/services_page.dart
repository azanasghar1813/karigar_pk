import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/services/services_screen.dart';
import '../components/navbar.dart';

/// Legacy entry — prefer [ServicesScreen] via GoRouter at `/services`.
class ServicesPage extends StatelessWidget {
  const ServicesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const KarigarNavbar(),
      body: const ServicesScreen(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go('/'),
        icon: const Icon(Icons.home),
        label: const Text('Home'),
      ),
    );
  }
}
