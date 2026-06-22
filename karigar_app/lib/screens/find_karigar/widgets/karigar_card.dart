import 'package:flutter/material.dart';
import '../../../config/theme.dart';
import '../../../models/karigar.dart';
import '../../../services/quick_booking_service.dart';
import '../../../widgets/app_surface_card.dart';

class KarigarCard extends StatelessWidget {
  final Karigar karigar;
  final VoidCallback onTap;

  const KarigarCard({
    super.key,
    required this.karigar,
    required this.onTap,
  });

  Color _statusColor(String status) {
    switch (status) {
      case 'available':
        return AppTheme.successColor;
      case 'busy':
        return AppTheme.warningColor;
      default:
        return AppTheme.textTertiary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppSurfaceCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: onTap,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Container(
            height: 88,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.primaryColor.withValues(alpha: 0.35),
                  AppTheme.primaryColor.withValues(alpha: 0.08),
                ],
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Stack(
              children: [
                Center(
                  child: CircleAvatar(
                    radius: 30,
                    backgroundColor: AppTheme.primaryColor,
                    child: Text(
                      karigar.profileImage.isNotEmpty
                          ? karigar.profileImage.substring(0, 1).toUpperCase()
                          : 'K',
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _statusColor(karigar.status).withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: _statusColor(karigar.status)),
                    ),
                    child: Text(
                      karigar.status.toUpperCase(),
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        color: _statusColor(karigar.status),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                InkWell(
                  onTap: onTap,
                  child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        karigar.name,
                        style: Theme.of(context).textTheme.titleLarge,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (karigar.isVerified)
                      const Icon(
                        Icons.verified_rounded,
                        color: AppTheme.successColor,
                        size: 18,
                      ),
                  ],
                ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${karigar.service} · ${karigar.city}',
                  style: Theme.of(context).textTheme.bodySmall,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 16, color: AppTheme.warningColor),
                    const SizedBox(width: 4),
                    Text(
                      karigar.rating.toStringAsFixed(1),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                    ),
                    Text(
                      ' (${karigar.reviewCount})',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  karigar.pricePerHour,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppTheme.secondaryColor,
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  height: 34,
                  child: FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: AppTheme.secondaryColor,
                      padding: EdgeInsets.zero,
                      textStyle: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    onPressed: () => QuickBookingService.bookKarigar(
                      context,
                      karigar: karigar,
                    ),
                    child: const Text('Book Now'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
