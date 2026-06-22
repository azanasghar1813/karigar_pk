import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/karigar.dart';
import '../providers/auth_provider.dart';
import '../providers/booking_provider.dart';
import '../providers/karigar_provider.dart';

class QuickBookingService {
  static double _estimatePrice(Karigar karigar) {
    final hourly = int.tryParse(
          karigar.pricePerHour.replaceAll(RegExp(r'[^0-9]'), ''),
        ) ??
        800;
    return (hourly * 2).toDouble();
  }

  /// One-tap booking — no form. Uses logged-in user details when available.
  static Future<bool> bookKarigar(
    BuildContext context, {
    required Karigar karigar,
  }) async {
    final auth = context.read<AuthProvider>();
    if (!auth.isAuthenticated) {
      final proceed = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Sign In Required'),
          content: const Text(
            'Please sign in to your account to book a karigar.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('Login'),
            ),
          ],
        ),
      );
      if (proceed == true && context.mounted) {
        await context.pushNamed('login');
      }
      return false;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirm booking'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Karigar: ${karigar.name}'),
            Text('Service: ${karigar.service}'),
            Text('City: ${karigar.city}'),
            Text('Est. price: Rs. ${_estimatePrice(karigar).toStringAsFixed(0)}'),
            const SizedBox(height: 12),
            const Text(
              'Your booking will be placed immediately — no extra form.',
              style: TextStyle(fontSize: 13),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: AppTheme.secondaryColor),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Book Now'),
          ),
        ],
      ),
    );

    if (confirmed != true || !context.mounted) return false;

    final user = auth.user!;
    final bookingProvider = context.read<BookingProvider>();
    final bookingDate = DateTime.now().add(const Duration(days: 1));

    final success = await bookingProvider.createBooking(
      karigerId: karigar.id,
      service: karigar.service,
      bookingDate: bookingDate,
      description: 'Quick booking via Karigar app',
      address: user.address ?? 'Customer address',
      city: karigar.city,
      totalPrice: _estimatePrice(karigar),
    );

    if (!context.mounted) return success;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Booked ${karigar.name} successfully!'),
          backgroundColor: AppTheme.successColor,
          action: SnackBarAction(
            label: 'My bookings',
            textColor: Colors.white,
            onPressed: () => context.go('/my-account'),
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(bookingProvider.error ?? 'Booking failed'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    }

    return success;
  }

  /// Book first available karigar for service/city (hero "Book Now Here").
  static Future<bool> bookFromHero(
    BuildContext context, {
    required String service,
    required String city,
  }) async {
    final provider = context.read<KarigarProvider>();
    await provider.fetchKarigars(
      service: service != 'All' ? service : null,
      city: city,
    );

    if (provider.filteredKarigars.isEmpty) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No karigar available. Try another city or service.'),
          ),
        );
        context.go('/find-karigar');
      }
      return false;
    }

    return bookKarigar(context, karigar: provider.filteredKarigars.first);
  }
}
