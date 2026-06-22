import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/karigar_portal_provider.dart';

class KarigarEarningsScreen extends StatefulWidget {
  const KarigarEarningsScreen({super.key});

  @override
  State<KarigarEarningsScreen> createState() => _KarigarEarningsScreenState();
}

class _KarigarEarningsScreenState extends State<KarigarEarningsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<KarigarPortalProvider>().fetchDashboardStats();
      context.read<KarigarPortalProvider>().fetchMyBookings();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Earnings'),
        elevation: 0,
      ),
      body: Consumer<KarigarPortalProvider>(
        builder: (context, provider, _) {
          final stats = provider.stats ?? {};
          final totalEarnings = stats['totalEarnings'] ?? 0;

          final completedBookings = provider.bookings
              .where((b) => b.status == 'completed')
              .toList();

          return RefreshIndicator(
            onRefresh: () async {
              await provider.fetchDashboardStats();
              await provider.fetchMyBookings();
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.primaryColor.withValues(alpha: 0.3)),
                    ),
                    child: Column(
                      children: [
                        Text('Total Earnings', style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 8),
                        Text(
                          'Rs. $totalEarnings',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  Text('Recent Transactions', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 16),
                  
                  if (completedBookings.isEmpty)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Text('No completed jobs yet', style: Theme.of(context).textTheme.bodyLarge),
                      ),
                    )
                  else
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: completedBookings.length,
                      itemBuilder: (context, index) {
                        final booking = completedBookings[index];
                        return ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: CircleAvatar(
                            backgroundColor: AppTheme.successColor.withValues(alpha: 0.2),
                            child: const Icon(Icons.check_circle, color: AppTheme.successColor),
                          ),
                          title: Text(booking.service),
                          subtitle: Text('${booking.bookingDate.day}/${booking.bookingDate.month}/${booking.bookingDate.year}'),
                          trailing: Text(
                            '+ Rs. ${booking.totalPrice.toStringAsFixed(0)}',
                            style: const TextStyle(
                              color: AppTheme.successColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        );
                      },
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
