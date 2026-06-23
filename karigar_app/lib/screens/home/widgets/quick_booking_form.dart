import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../config/constants.dart';
import '../../../config/theme.dart';
import '../../../providers/app_provider.dart';
import '../../../utils/responsive.dart';
import '../../../services/quick_booking_service.dart';
import '../../../widgets/app_surface_card.dart';

class QuickBookingForm extends StatefulWidget {
  const QuickBookingForm({super.key});

  @override
  State<QuickBookingForm> createState() => _QuickBookingFormState();
}

class _QuickBookingFormState extends State<QuickBookingForm> {
  late String selectedService;
  late String selectedCity;

  @override
  void initState() {
    super.initState();
    final appProvider = context.read<AppProvider>();
    selectedService = appProvider.selectedService;
    selectedCity = appProvider.selectedCity;
  }

  @override
  Widget build(BuildContext context) {
    final stackFields = Responsive.isMobile(context);

    return AppSurfaceCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.flash_on_rounded,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Quick Booking',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    Text(
                      'Find a karigar in your city instantly',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          if (stackFields)
            Column(
              children: [
                _buildDropdown(
                  label: 'Service',
                  value: selectedService,
                  items: AppConstants.servicesWithAll,
                  onChanged: (v) => setState(() => selectedService = v),
                ),
                const SizedBox(height: 16),
                _buildDropdown(
                  label: 'City',
                  value: selectedCity,
                  items: AppConstants.cities,
                  onChanged: (v) => setState(() => selectedCity = v),
                ),
              ],
            )
          else
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: _buildDropdown(
                    label: 'Service',
                    value: selectedService,
                    items: AppConstants.servicesWithAll,
                    onChanged: (v) => setState(() => selectedService = v),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildDropdown(
                    label: 'City',
                    value: selectedCity,
                    items: AppConstants.cities,
                    onChanged: (v) => setState(() => selectedCity = v),
                  ),
                ),
              ],
            ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: () => QuickBookingService.bookFromHero(
                context,
                service: selectedService,
                city: selectedCity,
              ),
              icon: const Icon(Icons.event_available_rounded),
              label: const Text('Book Now Here'),
              style: FilledButton.styleFrom(
                backgroundColor: AppTheme.secondaryColor,
                padding: const EdgeInsets.symmetric(vertical: 18),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: value,
          isExpanded: true,
          borderRadius: BorderRadius.circular(12),
          items: items
              .map((item) => DropdownMenuItem(value: item, child: Text(item)))
              .toList(),
          onChanged: (val) => onChanged(val!),
        ),
      ],
    );
  }
}
