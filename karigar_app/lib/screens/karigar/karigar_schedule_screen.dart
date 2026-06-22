import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/karigar_portal_provider.dart';

class KarigarScheduleScreen extends StatefulWidget {
  const KarigarScheduleScreen({super.key});

  @override
  State<KarigarScheduleScreen> createState() => _KarigarScheduleScreenState();
}

class _KarigarScheduleScreenState extends State<KarigarScheduleScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<KarigarPortalProvider>().fetchMyBookings();
    });
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'accepted': return AppTheme.primaryColor;
      case 'in_progress': return AppTheme.accentColor;
      case 'completed': return AppTheme.successColor;
      case 'cancelled': return AppTheme.errorColor;
      default: return AppTheme.textTertiary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Schedule'),
        elevation: 0,
      ),
      body: Consumer<KarigarPortalProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.bookings.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          final scheduledBookings = provider.bookings
              .where((b) => b.status != 'pending')
              .toList();

          if (scheduledBookings.isEmpty) {
            return Center(
              child: Text(
                'No upcoming jobs',
                style: Theme.of(context).textTheme.titleLarge,
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => provider.fetchMyBookings(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: scheduledBookings.length,
              itemBuilder: (context, index) {
                final booking = scheduledBookings[index];
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
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _getStatusColor(booking.status).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                booking.status.toUpperCase(),
                                style: TextStyle(
                                  color: _getStatusColor(booking.status),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
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
                        const SizedBox(height: 16),
                        
                        if (booking.status == 'accepted') ...[
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  style: OutlinedButton.styleFrom(foregroundColor: AppTheme.errorColor),
                                  onPressed: () {
                                    provider.updateBookingStatus(booking.id, 'cancelled');
                                  },
                                  child: const Text('Cancel'),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: FilledButton(
                                  style: FilledButton.styleFrom(backgroundColor: AppTheme.accentColor),
                                  onPressed: () {
                                    provider.updateBookingStatus(booking.id, 'in_progress');
                                  },
                                  child: const Text('Start Job'),
                                ),
                              ),
                            ],
                          )
                        ] else if (booking.status == 'in_progress') ...[
                          SizedBox(
                            width: double.infinity,
                            child: FilledButton(
                              style: FilledButton.styleFrom(backgroundColor: AppTheme.successColor),
                              onPressed: () {
                                provider.updateBookingStatus(booking.id, 'completed');
                              },
                              child: const Text('Mark Completed'),
                            ),
                          ),
                        ]
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
