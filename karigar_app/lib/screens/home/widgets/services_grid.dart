import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';
import '../../../utils/responsive.dart';
import '../../../widgets/app_surface_card.dart';

class ServicesGrid extends StatelessWidget {
  const ServicesGrid({super.key});

  static const _services = [
    (Icons.bolt_rounded, 'Electrician', Color(0xFFFBBF24)),
    (Icons.water_drop_rounded, 'Plumber', Color(0xFF38BDF8)),
    (Icons.carpenter_rounded, 'Carpenter', Color(0xFFA78BFA)),
    (Icons.ac_unit_rounded, 'AC Repair', Color(0xFF67E8F9)),
    (Icons.format_paint_rounded, 'Painter', Color(0xFFF472B6)),
    (Icons.lock_rounded, 'Locksmith', Color(0xFF94A3B8)),
    (Icons.videocam_rounded, 'CCTV', Color(0xFF34D399)),
    (Icons.build_rounded, 'Repair', Color(0xFFFB923C)),
  ];

  @override
  Widget build(BuildContext context) {
    final columns = Responsive.serviceGridColumns(context);

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: columns,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio:
            Responsive.homeServicesGridAspectRatio(context, columns),
      ),
      itemCount: _services.length,
      itemBuilder: (context, index) {
        final (icon, name, color) = _services[index];
        return AppSurfaceCard(
          onTap: () {
            context.go(
              Uri(
                path: '/find-karigar',
                queryParameters: {
                  'service': name == 'CCTV' ? 'CCTV Installation' : name == 'Repair' ? 'General Repair' : name,
                },
              ).toString(),
            );
          },
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 8),
              Text(
                name,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        );
      },
    );
  }
}
