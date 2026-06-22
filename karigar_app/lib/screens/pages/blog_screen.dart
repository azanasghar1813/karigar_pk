import 'package:flutter/material.dart';
import '../../config/theme.dart';

class BlogScreen extends StatelessWidget {
  const BlogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final blogs = [
      {
        'title': 'How to Find the Right Electrician for Your Home',
        'date': 'May 15, 2024',
        'image': '⚡',
        'excerpt': 'Learn key tips for hiring a reliable electrician...',
      },
      {
        'title': 'Common Plumbing Issues and How to Fix Them',
        'date': 'May 10, 2024',
        'image': '💧',
        'excerpt': 'Discover solutions to the most common plumbing problems...',
      },
      {
        'title': 'AC Maintenance Guide for Summer',
        'date': 'May 5, 2024',
        'image': '❄️',
        'excerpt': 'Keep your AC running smoothly with these maintenance tips...',
      },
      {
        'title': 'DIY vs Professional Carpentry Work',
        'date': 'April 28, 2024',
        'image': '🪵',
        'excerpt': 'When should you hire a professional carpenter?...',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Blog'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
              color: AppTheme.darkCard,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Karigar Blog',
                    style: Theme.of(context).textTheme.displaySmall,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Tips, guides, and insights about home services',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: blogs.length,
                itemBuilder: (context, index) {
                  final blog = blogs[index];
                  return GestureDetector(
                    onTap: () {},
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.darkBorder),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Text(
                                blog['image'] as String,
                                style: const TextStyle(fontSize: 32),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  blog['title'] as String,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleLarge,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  blog['excerpt'] as String,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  blog['date'] as String,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall
                                      ?.copyWith(
                                    color: AppTheme.textTertiary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}