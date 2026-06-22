import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/karigar_provider.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/whatsapp_button.dart';

class WorkerProfileScreen extends StatefulWidget {
  final String workerId;

  const WorkerProfileScreen({
    super.key,
    required this.workerId,
  });

  @override
  State<WorkerProfileScreen> createState() => _WorkerProfileScreenState();
}

class _WorkerProfileScreenState extends State<WorkerProfileScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<KarigarProvider>().fetchKarigarDetails(widget.workerId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Worker Profile'),
        actions: const [
          WhatsAppButton(extended: false),
          SizedBox(width: 8),
        ],
      ),
      body: Consumer<KarigarProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final karigar = provider.selectedKarigar;
          if (karigar == null) {
            return Center(
              child: Text(
                'Karigar not found',
                style: Theme.of(context).textTheme.titleLarge,
              ),
            );
          }

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(24),
                  color: AppTheme.darkCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundColor: AppTheme.primaryColor,
                            child: Text(
                              karigar.profileImage.isNotEmpty
                                  ? karigar.profileImage.substring(0, 1)
                                  : 'K',
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        karigar.name,
                                        style: Theme.of(context)
                                            .textTheme
                                            .headlineSmall,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (karigar.isVerified)
                                      const Icon(
                                        Icons.verified,
                                        color: AppTheme.successColor,
                                      ),
                                  ],
                                ),
                                Text(
                                  karigar.service,
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Icon(
                                      Icons.star,
                                      color: AppTheme.warningColor,
                                      size: 18,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${karigar.rating} (${karigar.reviewCount} reviews)',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        karigar.bio,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Details
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildDetailSection(
                        title: 'Experience',
                        content: '${karigar.yearsExperience}+ years',
                        icon: Icons.work_outline,
                      ),
                      const SizedBox(height: 16),
                      _buildDetailSection(
                        title: 'Price',
                        content: karigar.pricePerHour,
                        icon: Icons.paid_outlined,
                      ),
                      const SizedBox(height: 16),
                      _buildDetailSection(
                        title: 'Status',
                        content: karigar.status,
                        icon: Icons.circle,
                      ),
                      const SizedBox(height: 24),

                      // Skills
                      if (karigar.skills.isNotEmpty) ...[
                        Text(
                          'Skills',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: karigar.skills
                              .map((skill) => Chip(
                            label: Text(skill),
                            backgroundColor:
                            AppTheme.primaryColor.withValues(alpha: 0.2),
                          ))
                              .toList(),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Reviews
                      Text(
                        'Recent Reviews',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 12),
                      if (provider.reviews.isNotEmpty)
                        ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: provider.reviews.length,
                          itemBuilder: (context, index) {
                            final review = provider.reviews[index];
                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.darkCard,
                                borderRadius: BorderRadius.circular(8),
                                border:
                                Border.all(color: AppTheme.darkBorder),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        review.customerName,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleLarge,
                                      ),
                                      Row(
                                        children: List.generate(
                                          5,
                                              (i) => Icon(
                                            i < review.rating
                                                ? Icons.star
                                                : Icons.star_outline,
                                            color: AppTheme.warningColor,
                                            size: 14,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    review.comment,
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodySmall,
                                  ),
                                ],
                              ),
                            );
                          },
                        )
                      else
                        Text(
                          'No reviews yet',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      const SizedBox(height: 24),

                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: FilledButton.icon(
                          style: FilledButton.styleFrom(
                            backgroundColor: AppTheme.secondaryColor,
                          ),
                          onPressed: () => context.pushNamed(
                            'book-now',
                            pathParameters: {'id': karigar.id},
                          ),
                          icon: const Icon(Icons.event_available_rounded),
                          label: const Text('Book Now'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: WhatsAppButton(
                          message:
                              'Hi, I want to book ${karigar.name} (${karigar.service}) via Karigar.',
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildDetailSection({
    required String title,
    required String content,
    required IconData icon,
  }) {
    return Row(
      children: [
        Icon(icon, color: AppTheme.secondaryColor),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
            ),
            Text(
              content,
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ],
        ),
      ],
    );
  }
}