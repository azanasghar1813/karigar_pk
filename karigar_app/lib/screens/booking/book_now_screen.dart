import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../providers/booking_provider.dart';
import '../../providers/karigar_provider.dart';
import 'location_picker_screen.dart';

class BookNowScreen extends StatefulWidget {
  final String workerId;

  const BookNowScreen({
    super.key,
    required this.workerId,
  });

  @override
  State<BookNowScreen> createState() => _BookNowScreenState();
}

class _BookNowScreenState extends State<BookNowScreen> {
  final _formKey = GlobalKey<FormState>();
  late DateTime selectedDate;
  late TimeOfDay selectedTime;
  late String selectedService;
  String description = '';
  String address = '';
  double? latitude;
  double? longitude;

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime.now().add(const Duration(days: 1));
    selectedTime = TimeOfDay.now();
    selectedService = '';

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<KarigarProvider>().fetchKarigarDetails(widget.workerId);
    });
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.dark(
              primary: AppTheme.primaryColor,
              surface: Theme.of(context).cardColor,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != selectedDate) {
      setState(() => selectedDate = picked);
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: selectedTime,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.dark(
              primary: AppTheme.primaryColor,
              surface: Theme.of(context).cardColor,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != selectedTime) {
      setState(() => selectedTime = picked);
    }
  }

  void _submitBooking() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    final bookingDate = DateTime(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day,
      selectedTime.hour,
      selectedTime.minute,
    );

    final success = await context.read<BookingProvider>().createBooking(
      karigerId: widget.workerId,
      service: selectedService,
      bookingDate: bookingDate,
      description: description,
      address: address,
      city: 'Your City', // Handled by coordinates context or generic now
      latitude: latitude,
      longitude: longitude,
      totalPrice: 5000, // This should be calculated based on service
    );

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Booking created successfully!')),
        );
        context.pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              context.read<BookingProvider>().error ?? 'Booking failed',
            ),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Book Service'),
      ),
      body: Consumer<KarigarProvider>(
        builder: (context, provider, _) {
          final karigar = provider.selectedKarigar;

          return SingleChildScrollView(
            child: Column(
              children: [
                if (karigar != null) ...[
                  // Karigar Summary
                  Container(
                    padding: const EdgeInsets.all(16),
                    color: Theme.of(context).cardColor,
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 40,
                          backgroundColor: AppTheme.primaryColor,
                          child: Text(
                            karigar.profileImage.isNotEmpty
                                ? karigar.profileImage.substring(0, 1)
                                : 'K',
                            style: const TextStyle(
                              fontSize: 24,
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
                              Text(
                                karigar.name,
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge,
                              ),
                              Text(
                                karigar.service,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodySmall,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Rs. ${karigar.pricePerHour}',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodySmall
                                    ?.copyWith(
                                  color: AppTheme.secondaryColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                ],

                // Booking Form
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Service Selection
                        Text(
                          'Select Service',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        DropdownButtonFormField<String>(
                          initialValue: selectedService.isEmpty ? null : selectedService,
                          items: AppConstants.services
                              .map((service) => DropdownMenuItem(
                            value: service,
                            child: Text(service),
                          ))
                              .toList(),
                          onChanged: (value) =>
                              setState(() => selectedService = value ?? ''),
                          decoration: const InputDecoration(
                            hintText: 'Choose a service',
                          ),
                          validator: (value) =>
                          value == null ? 'Please select a service' : null,
                        ),
                        const SizedBox(height: 20),

                        // Date Selection
                        Text(
                          'Select Date',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        GestureDetector(
                          onTap: () => _selectDate(context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              color: Theme.of(context).cardColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Theme.of(context).dividerColor),
                            ),
                            child: Row(
                              mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '${selectedDate.day}/${selectedDate.month}/${selectedDate.year}',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium,
                                ),
                                const Icon(
                                  Icons.calendar_today,
                                  color: AppTheme.secondaryColor,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Time Selection
                        Text(
                          'Select Time',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        GestureDetector(
                          onTap: () => _selectTime(context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              color: Theme.of(context).cardColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Theme.of(context).dividerColor),
                            ),
                            child: Row(
                              mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  selectedTime.format(context),
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium,
                                ),
                                const Icon(
                                  Icons.access_time,
                                  color: AppTheme.secondaryColor,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Address
                        Text(
                          'Address',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        GestureDetector(
                          onTap: () async {
                            final result = await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const LocationPickerScreen(),
                              ),
                            );

                            if (result != null) {
                              setState(() {
                                address = result['address'];
                                latitude = result['latitude'];
                                longitude = result['longitude'];
                              });
                            }
                          },
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              color: Theme.of(context).cardColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Theme.of(context).dividerColor),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.location_on_outlined, color: AppTheme.primaryColor),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    address.isEmpty ? 'Select location on Map' : address,
                                    style: address.isEmpty
                                        ? Theme.of(context).textTheme.bodyMedium?.copyWith(
                                            color: Colors.grey,
                                          )
                                        : Theme.of(context).textTheme.bodyMedium,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        if (address.isEmpty)
                           Padding(
                             padding: const EdgeInsets.only(top: 8.0, left: 12.0),
                             child: Text('Please select an address', style: TextStyle(color: AppTheme.errorColor, fontSize: 12)),
                           ),
                        const SizedBox(height: 20),

                        // Description
                        Text(
                          'Description (Optional)',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          decoration: const InputDecoration(
                            hintText: 'Describe your issue',
                            prefixIcon: Icon(Icons.description_outlined),
                          ),
                          onSaved: (value) => description = value ?? '',
                          maxLines: 3,
                        ),
                        const SizedBox(height: 32),

                        // Submit Button
                        Consumer<BookingProvider>(
                          builder: (context, bookingProvider, _) {
                            return SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                  AppTheme.secondaryColor,
                                ),
                                onPressed: bookingProvider.isLoading
                                    ? null
                                    : _submitBooking,
                                child: bookingProvider.isLoading
                                    ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child:
                                  CircularProgressIndicator(
                                    valueColor:
                                    AlwaysStoppedAnimation<
                                        Color>(
                                      Colors.white,
                                    ),
                                  ),
                                )
                                    : const Text('Confirm Booking'),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}