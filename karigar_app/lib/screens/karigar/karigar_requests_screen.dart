import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/karigar_portal_provider.dart';

class KarigarRequestsScreen extends StatefulWidget {
  const KarigarRequestsScreen({super.key});

  @override
  State<KarigarRequestsScreen> createState() => _KarigarRequestsScreenState();
}

class _KarigarRequestsScreenState extends State<KarigarRequestsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<KarigarPortalProvider>().fetchMyBookings();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pending Requests'),
        elevation: 0,
      ),
      body: Consumer<KarigarPortalProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.bookings.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          final pendingBookings = provider.bookings
              .where((b) => b.status == 'pending')
              .toList();

          if (pendingBookings.isEmpty) {
            return Center(
              child: Text(
                'No pending requests',
                style: Theme.of(context).textTheme.titleLarge,
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => provider.fetchMyBookings(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: pendingBookings.length,
              itemBuilder: (context, index) {
                final booking = pendingBookings[index];
                return Card(
                  color: AppTheme.darkCard,
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(color: AppTheme.darkBorder),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              booking.service,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            Text(
                              'Rs. ${booking.totalPrice.toStringAsFixed(0)}',
                              style: const TextStyle(
                                color: AppTheme.secondaryColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text('Customer ID: ${booking.customerId}'), // Ideally Customer Name
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.location_on_outlined, size: 16),
                            const SizedBox(width: 4),
                            Expanded(child: Text(booking.address, maxLines: 1)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.access_time, size: 16),
                            const SizedBox(width: 4),
                            Text('${booking.bookingDate.day}/${booking.bookingDate.month}/${booking.bookingDate.year}'),
                          ],
                        ),
                        if (booking.description.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text('Issue: ${booking.description}', style: Theme.of(context).textTheme.bodySmall),
                        ],
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                style: OutlinedButton.styleFrom(foregroundColor: AppTheme.errorColor),
                                onPressed: () {
                                  provider.updateBookingStatus(booking.id, 'cancelled');
                                },
                                child: const Text('Decline'),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: FilledButton(
                                style: FilledButton.styleFrom(backgroundColor: AppTheme.primaryColor),
                                onPressed: () {
                                  provider.updateBookingStatus(booking.id, 'accepted');
                                },
                                child: const Text('Accept'),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
