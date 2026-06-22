import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/karigar_portal_provider.dart';
import '../../providers/auth_provider.dart';

class KarigarDashboardScreen extends StatefulWidget {
  const KarigarDashboardScreen({super.key});

  @override
  State<KarigarDashboardScreen> createState() => _KarigarDashboardScreenState();
}

class _KarigarDashboardScreenState extends State<KarigarDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<KarigarPortalProvider>().fetchDashboardStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.read<AuthProvider>().user;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: () => context.read<KarigarPortalProvider>().fetchDashboardStats(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome back, ${user?.fullName ?? 'Karigar'}!',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 24),
              Consumer<KarigarPortalProvider>(
                builder: (context, provider, _) {
                  if (provider.isLoading && provider.stats == null) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (provider.error != null && provider.stats == null) {
                    return Center(child: Text(provider.error!));
                  }

                  final stats = provider.stats ?? {};
                  final totalBookings = stats['totalBookings'] ?? 0;
                  final totalEarnings = stats['totalEarnings'] ?? 0;
                  final pendingRequests = stats['pendingRequests'] ?? 0;
                  final rating = stats['rating'] ?? 0.0;

                  return Column(
                    children: [
                      Row(
                        children: [
                          Expanded(child: _buildStatCard(context, 'Total Earnings', 'Rs. $totalEarnings', Icons.account_balance_wallet, AppTheme.successColor)),
                          const SizedBox(width: 16),
                          Expanded(child: _buildStatCard(context, 'Pending Requests', '$pendingRequests', Icons.assignment, AppTheme.warningColor)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(child: _buildStatCard(context, 'Total Bookings', '$totalBookings', Icons.event_available, AppTheme.primaryColor)),
                          const SizedBox(width: 16),
                          Expanded(child: _buildStatCard(context, 'Average Rating', '$rating', Icons.star, AppTheme.warningColor)),
                        ],
                      ),
                      const SizedBox(height: 32),
                      
                      // Availability Toggle
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkCard,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.darkBorder),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Availability Status', style: Theme.of(context).textTheme.titleLarge),
                                const SizedBox(height: 4),
                                Text(
                                  'Toggle your availability to receive requests',
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                            ),
                            Switch(
                              value: true, // You might get this from stats or auth provider
                              activeTrackColor: AppTheme.successColor,
                              onChanged: (val) {
                                provider.toggleAvailability(val);
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.darkBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(value, style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(title, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}
