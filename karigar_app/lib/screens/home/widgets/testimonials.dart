import 'package:flutter/material.dart';
import '../../../config/theme.dart';
import '../../../utils/responsive.dart';

class Testimonials extends StatelessWidget {
  const Testimonials({super.key});

  static const _items = [
    ('Ahmed Hassan', 'Electrician', 5, 'Excellent service! Very professional and punctual.'),
    ('Fatima Ali', 'Plumber', 5, 'Fixed the leak perfectly. Highly recommend!'),
    ('Muhammad Khan', 'Carpenter', 4, 'Great quality work at reasonable prices.'),
  ];

  @override
  Widget build(BuildContext context) {
    final cardWidth = Responsive.testimonialCardWidth(context);
    final isWide = Responsive.sizeOf(context) == ScreenSize.desktop;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'What Our Customers Say',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: 6),
        Text(
          'Real reviews from homeowners across Pakistan',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 20),
        if (isWide)
          SizedBox(
            height: 200,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: _items
                  .map(
                    (t) => Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(right: 12),
                        child: _TestimonialCard(data: t),
                      ),
                    ),
                  )
                  .toList(),
            ),
          )
        else
          SizedBox(
            height: 200,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              itemCount: _items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 14),
              itemBuilder: (context, index) {
                return SizedBox(
                  width: cardWidth,
                  child: _TestimonialCard(data: _items[index]),
                );
              },
            ),
          ),
      ],
    );
  }
}

class _TestimonialCard extends StatelessWidget {
  final (String, String, int, String) data;

  const _TestimonialCard({required this.data});

  @override
  Widget build(BuildContext context) {
    final (name, service, rating, comment) = data;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.darkBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: List.generate(
              5,
              (i) => Icon(
                i < rating ? Icons.star_rounded : Icons.star_outline_rounded,
                color: AppTheme.warningColor,
                size: 18,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '"$comment"',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontStyle: FontStyle.italic,
                  height: 1.5,
                ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: AppTheme.primaryColor.withValues(alpha: 0.25),
                child: Text(
                  name[0],
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: Theme.of(context).textTheme.titleLarge),
                  Text(service, style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
