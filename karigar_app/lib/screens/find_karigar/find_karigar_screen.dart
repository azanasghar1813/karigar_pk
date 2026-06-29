import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/constants.dart';
import '../../config/theme.dart';
import '../../providers/karigar_provider.dart';
import '../../providers/app_provider.dart';
import '../../utils/responsive.dart';
import '../../widgets/section_header.dart';
import 'widgets/karigar_card.dart';

class FindKarigarScreen extends StatefulWidget {
  final String? service;
  final String? city;

  const FindKarigarScreen({
    super.key,
    this.service,
    this.city,
  });

  @override
  State<FindKarigarScreen> createState() => _FindKarigarScreenState();
}

class _FindKarigarScreenState extends State<FindKarigarScreen> {
  late String selectedService;
  late String selectedCity;
  late double selectedRating;
  late String sortBy;
  bool showFilters = false;

  @override
  void initState() {
    super.initState();
    _applyRouteParams();
    WidgetsBinding.instance.addPostFrameCallback((_) => _fetchKarigars());
  }

  @override
  void didUpdateWidget(FindKarigarScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.service != widget.service || oldWidget.city != widget.city) {
      _applyRouteParams();
      _fetchKarigars();
    }
  }

  void _applyRouteParams() {
    final appProvider = context.read<AppProvider>();
    selectedService = widget.service ?? appProvider.selectedService;
    if (!AppConstants.servicesWithAll.contains(selectedService)) {
      selectedService = 'All';
    }
    selectedCity = widget.city ?? appProvider.selectedCity;
    selectedRating = appProvider.selectedRating;
    sortBy = appProvider.sortBy;
  }

  void _fetchKarigars() {
    context.read<KarigarProvider>().fetchKarigars(
          service: selectedService != 'All' ? selectedService : null,
          city: selectedCity,
          minRating: selectedRating > 0 ? selectedRating : null,
          sortBy: sortBy,
        );
  }

  void _applyFilters() {
    context.read<KarigarProvider>().filterKarigars(
          service: selectedService,
          city: selectedCity,
          minRating: selectedRating,
          sortBy: sortBy,
        );
    setState(() => showFilters = false);
  }

  @override
  Widget build(BuildContext context) {
    final columns = Responsive.gridColumns(context, mobile: 2, tablet: 3, desktop: 4);

    return Column(
      children: [
        ResponsiveContainer(
          padding: EdgeInsets.fromLTRB(
            Responsive.horizontalPadding(context),
            12,
            Responsive.horizontalPadding(context),
            0,
          ),
          child: Row(
            children: [
              Expanded(
                child: SectionHeader(
                  title: 'Find Karigar',
                  subtitle: '$selectedService · $selectedCity',
                ),
              ),
              IconButton.filledTonal(
                onPressed: () => setState(() => showFilters = !showFilters),
                icon: AnimatedRotation(
                  turns: showFilters ? 0.125 : 0,
                  duration: const Duration(milliseconds: 200),
                  child: const Icon(Icons.tune_rounded),
                ),
              ),
            ],
          ),
        ),
        AnimatedCrossFade(
          firstChild: const SizedBox.shrink(),
          secondChild: _buildFiltersPanel(context),
          crossFadeState:
              showFilters ? CrossFadeState.showSecond : CrossFadeState.showFirst,
          duration: const Duration(milliseconds: 220),
        ),
        Expanded(
          child: Consumer<KarigarProvider>(
            builder: (context, provider, _) {
              if (provider.isLoading) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const CircularProgressIndicator(color: AppTheme.secondaryColor),
                      const SizedBox(height: 16),
                      Text(
                        'Finding karigars near you…',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                );
              }

              if (provider.filteredKarigars.isEmpty) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.person_search_rounded,
                          size: 72,
                          color: AppTheme.textTertiary.withValues(alpha: 0.6),
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'No karigars found',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Try different filters or another city',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(height: 20),
                        FilledButton.icon(
                          onPressed: () => setState(() => showFilters = true),
                          icon: const Icon(Icons.tune_rounded),
                          label: const Text('Adjust Filters'),
                        ),
                      ],
                    ),
                  ),
                );
              }

              return ResponsiveContainer(
                padding: EdgeInsets.all(Responsive.horizontalPadding(context)),
                child: GridView.builder(
                  physics: const BouncingScrollPhysics(),
                  // Pre-build items 400 px outside the viewport so fast
                  // scrolling never shows blank tiles while Flutter catches up.
                  cacheExtent: 400,
                  // Cards are stateless — no need for keep-alives.
                  addAutomaticKeepAlives: false,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: columns,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio:
                        Responsive.karigarCardAspectRatio(context, columns),
                  ),
                  padding: EdgeInsets.only(
                    bottom: Responsive.shellBottomScrollPadding(context),
                  ),
                  itemCount: provider.filteredKarigars.length,
                  itemBuilder: (context, index) {
                    final karigar = provider.filteredKarigars[index];
                    return KarigarCard(
                      karigar: karigar,
                      onTap: () => context.pushNamed(
                        'worker-profile',
                        pathParameters: {'id': karigar.id},
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFiltersPanel(BuildContext context) {
    final isWide = !Responsive.isMobile(context);

    return Container(
      width: double.infinity,
      margin: EdgeInsets.symmetric(
        horizontal: Responsive.horizontalPadding(context),
      ),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Filters', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 16),
          if (isWide)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: _buildFilterDropdown(
                    label: 'Service',
                    value: selectedService,
                    items: AppConstants.servicesWithAll,
                    onChanged: (v) => setState(() => selectedService = v),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFilterDropdown(
                    label: 'City',
                    value: selectedCity,
                    items: AppConstants.cities,
                    onChanged: (v) => setState(() => selectedCity = v),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFilterDropdown(
                    label: 'Min Rating',
                    value: selectedRating.toString(),
                    items: AppConstants.ratings.map((r) => r.toString()).toList(),
                    onChanged: (v) => setState(() => selectedRating = double.parse(v)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFilterDropdown(
                    label: 'Sort By',
                    value: sortBy,
                    items: const ['rating', 'price'],
                    onChanged: (v) => setState(() => sortBy = v),
                  ),
                ),
              ],
            )
          else ...[
            _buildFilterDropdown(
              label: 'Service',
              value: selectedService,
              items: AppConstants.servicesWithAll,
              onChanged: (v) => setState(() => selectedService = v),
            ),
            const SizedBox(height: 12),
            _buildFilterDropdown(
              label: 'City',
              value: selectedCity,
              items: AppConstants.cities,
              onChanged: (v) => setState(() => selectedCity = v),
            ),
            const SizedBox(height: 12),
            _buildFilterDropdown(
              label: 'Min Rating',
              value: selectedRating.toString(),
              items: AppConstants.ratings.map((r) => r.toString()).toList(),
              onChanged: (v) => setState(() => selectedRating = double.parse(v)),
            ),
            const SizedBox(height: 12),
            _buildFilterDropdown(
              label: 'Sort By',
              value: sortBy,
              items: const ['rating', 'price'],
              onChanged: (v) => setState(() => sortBy = v),
            ),
          ],
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() {
                    selectedService = 'All';
                    selectedCity = 'Your City';
                    selectedRating = 0;
                    sortBy = 'rating';
                  }),
                  child: const Text('Reset'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: FilledButton(
                  onPressed: _applyFilters,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppTheme.secondaryColor,
                  ),
                  child: const Text('Apply'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterDropdown({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: value,
          isExpanded: true,
          items: items
              .map((item) => DropdownMenuItem(value: item, child: Text(item)))
              .toList(),
          onChanged: (val) => onChanged(val!),
        ),
      ],
    );
  }
}
