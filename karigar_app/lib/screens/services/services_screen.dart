import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/karigar_provider.dart';
import '../../services/quick_booking_service.dart';
import '../../utils/responsive.dart';
import '../../widgets/app_surface_card.dart';
import '../../widgets/section_header.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  static final _services = [
    ('⚡', 'Electrician', 'Wiring, repairs & installations', AppTheme.warningColor),
    ('💧', 'Plumber', 'Pipes, leaks & bathroom work', Color(0xFF38BDF8)),
    ('🪵', 'Carpenter', 'Furniture & structural woodwork', Color(0xFFA78BFA)),
    ('❄️', 'AC Repair', 'Maintenance, gas & cleaning', Color(0xFF67E8F9)),
    ('🎨', 'Painter', 'Interior & exterior painting', Color(0xFFF472B6)),
    ('🔐', 'Locksmith', 'Locks, keys & security', Color(0xFF94A3B8)),
    ('📹', 'CCTV Installation', 'Cameras, DVR & setup', Color(0xFF34D399)),
    ('🔧', 'General Repair', 'Multi-skill home fixes', Color(0xFFFB923C)),
    ('🛍️', 'Household Chores', 'Daily help & light tasks', Color(0xFFFCD34D)),
  ];

  @override
  Widget build(BuildContext context) {
    final columns = Responsive.gridColumns(context, mobile: 1, tablet: 2, desktop: 3);

    return CustomScrollView(
      physics: const BouncingScrollPhysics(
        parent: AlwaysScrollableScrollPhysics(),
      ),
      slivers: [
        SliverToBoxAdapter(
          child: ResponsiveContainer(
            padding: EdgeInsets.fromLTRB(
              Responsive.horizontalPadding(context),
              20,
              Responsive.horizontalPadding(context),
              8,
            ),
            child: const SectionHeader(
              title: 'All Services',
              subtitle: 'Verified professionals across Pakistan — book in minutes',
            ),
          ),
        ),
        SliverPadding(
          padding: EdgeInsets.all(Responsive.horizontalPadding(context)),
          sliver: SliverGrid(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: columns,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              childAspectRatio:
                  Responsive.serviceCardAspectRatio(context, columns),
            ),
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final (emoji, name, desc, color) = _services[index];
                return _ServiceCard(
                  emoji: emoji,
                  name: name,
                  description: desc,
                  accent: color,
                  onBook: () => _quickBookService(context, name),
                  onBrowse: () => _goFindKarigar(context, name),
                );
              },
              childCount: _services.length,
            ),
          ),
        ),
        const ShellBottomSliverPadding(),
      ],
    );
  }

  static void _goFindKarigar(BuildContext context, String service) {
    context.go(
      Uri(path: '/find-karigar', queryParameters: {'service': service}).toString(),
    );
  }

  static Future<void> _quickBookService(BuildContext context, String service) async {
    await context.read<KarigarProvider>().fetchKarigars(
          service: service,
          city: 'Lahore',
        );
    if (!context.mounted) return;
    final list = context.read<KarigarProvider>().filteredKarigars;
    if (list.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No karigar found for this service.')),
      );
      _goFindKarigar(context, service);
      return;
    }
    await QuickBookingService.bookKarigar(context, karigar: list.first);
  }
}

class _ServiceCard extends StatelessWidget {
  final String emoji;
  final String name;
  final String description;
  final Color accent;
  final VoidCallback onBook;
  final VoidCallback onBrowse;

  const _ServiceCard({
    required this.emoji,
    required this.name,
    required this.description,
    required this.accent,
    required this.onBook,
    required this.onBrowse,
  });

  @override
  Widget build(BuildContext context) {
    return AppSurfaceCard(
      onTap: onBrowse,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 52,
                height: 52,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Text(emoji, style: const TextStyle(fontSize: 28)),
              ),
              const Spacer(),
              Icon(Icons.arrow_forward_rounded, color: accent, size: 20),
            ],
          ),
          const SizedBox(height: 16),
          Text(name, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 6),
          Text(
            description,
            style: Theme.of(context).textTheme.bodySmall,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: onBook,
              icon: const Icon(Icons.event_available_rounded, size: 20),
              label: const Text('Book Now Here'),
              style: FilledButton.styleFrom(
                backgroundColor: AppTheme.secondaryColor,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
