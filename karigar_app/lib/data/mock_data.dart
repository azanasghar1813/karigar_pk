import '../models/booking.dart';
import '../models/karigar.dart';
import '../models/review.dart';
import '../models/user.dart';

/// Demo data used when [AppConstants.useMockData] is true.
class MockData {
  static const demoEmail = 'demo@karigar.pk';
  static const demoPassword = 'password123';

  static final User demoUser = User(
    id: 'user-1',
    fullName: 'Ahmed Hassan',
    email: demoEmail,
    phone: '312-3456789',
    cnic: '35201-1234567-1',
    address: 'House 12, Block C, Gulberg III, Lahore',
    isPhoneVerified: true,
    userType: 'customer',
  );

  static final List<Karigar> karigars = [
    _karigar(
      id: 'k1',
      name: 'Ali Raza',
      service: 'Electrician',
      city: 'Lahore',
      rating: 4.9,
      reviewCount: 128,
      pricePerHour: 'Rs. 800/hr',
      bio: 'Licensed electrician with 8 years of residential and commercial experience.',
      skills: ['Wiring', 'Panel repair', 'Emergency fixes'],
      yearsExperience: 8,
      status: 'available',
    ),
    _karigar(
      id: 'k2',
      name: 'Hassan Mehmood',
      service: 'Plumber',
      city: 'Lahore',
      rating: 4.7,
      reviewCount: 95,
      pricePerHour: 'Rs. 700/hr',
      bio: 'Expert in pipe fitting, leak detection, and bathroom installations.',
      skills: ['Leak repair', 'Water heater', 'Drain cleaning'],
      yearsExperience: 6,
      status: 'available',
    ),
    _karigar(
      id: 'k3',
      name: 'Imran Siddiqui',
      service: 'Carpenter',
      city: 'Karachi',
      rating: 4.8,
      reviewCount: 72,
      pricePerHour: 'Rs. 900/hr',
      bio: 'Custom furniture and door/window fitting specialist.',
      skills: ['Furniture', 'Kitchen cabinets', 'Doors'],
      yearsExperience: 10,
      status: 'busy',
    ),
    _karigar(
      id: 'k4',
      name: 'Usman Khan',
      service: 'AC Repair',
      city: 'Islamabad',
      rating: 4.6,
      reviewCount: 54,
      pricePerHour: 'Rs. 1000/hr',
      bio: 'All brands AC installation, gas refill, and deep cleaning.',
      skills: ['Split AC', 'Gas refill', 'Maintenance'],
      yearsExperience: 5,
      status: 'available',
    ),
    _karigar(
      id: 'k5',
      name: 'Bilal Ahmed',
      service: 'Painter',
      city: 'Lahore',
      rating: 4.5,
      reviewCount: 41,
      pricePerHour: 'Rs. 600/hr',
      bio: 'Interior and exterior painting with premium finish.',
      skills: ['Wall paint', 'Texture', 'Waterproofing'],
      yearsExperience: 7,
      status: 'available',
    ),
    _karigar(
      id: 'k6',
      name: 'Faisal Iqbal',
      service: 'Locksmith',
      city: 'Rawalpindi',
      rating: 4.4,
      reviewCount: 38,
      pricePerHour: 'Rs. 500/hr',
      bio: '24/7 emergency lockout and security lock installation.',
      skills: ['Lock change', 'Key cutting', 'Smart locks'],
      yearsExperience: 4,
      status: 'available',
    ),
    _karigar(
      id: 'k7',
      name: 'Kamran Ali',
      service: 'CCTV Installation',
      city: 'Karachi',
      rating: 4.7,
      reviewCount: 29,
      pricePerHour: 'Rs. 1200/hr',
      bio: 'HD camera setup with mobile app configuration.',
      skills: ['DVR setup', 'IP cameras', 'Cabling'],
      yearsExperience: 6,
      status: 'available',
    ),
    _karigar(
      id: 'k8',
      name: 'Tariq Mahmood',
      service: 'General Repair',
      city: 'Faisalabad',
      rating: 4.3,
      reviewCount: 67,
      pricePerHour: 'Rs. 550/hr',
      bio: 'Handyman for multiple small home repair tasks.',
      skills: ['Fixtures', 'Minor repairs', 'Assembly'],
      yearsExperience: 9,
      status: 'offline',
    ),
    _karigar(
      id: 'k9',
      name: 'Sana Ullah',
      service: 'Household Chores',
      city: 'Lahore',
      rating: 4.6,
      reviewCount: 22,
      pricePerHour: 'Rs. 400/hr',
      bio: 'Reliable help for daily chores and light household tasks.',
      skills: ['Cleaning', 'Organizing', 'Errands'],
      yearsExperience: 3,
      status: 'available',
    ),
    _karigar(
      id: 'k10',
      name: 'Nadeem Hussain',
      service: 'Electrician',
      city: 'Karachi',
      rating: 4.8,
      reviewCount: 110,
      pricePerHour: 'Rs. 850/hr',
      bio: 'Industrial and home electrical systems expert.',
      skills: ['Generators', 'UPS', 'Solar wiring'],
      yearsExperience: 12,
      status: 'available',
    ),
  ];

  static List<Karigar> filterKarigars({
    String? service,
    String? city,
    double? minRating,
    String? sortBy,
  }) {
    var list = karigars.where((k) {
      if (service != null && service.isNotEmpty && service != 'All') {
        if (k.service != service) return false;
      }
      if (city != null && city.isNotEmpty && k.city != city) return false;
      if (minRating != null && minRating > 0 && k.rating < minRating) {
        return false;
      }
      return true;
    }).toList();

    if (sortBy == 'price') {
      list.sort((a, b) => _priceValue(a).compareTo(_priceValue(b)));
    } else {
      list.sort((a, b) => b.rating.compareTo(a.rating));
    }
    return list;
  }

  static Karigar? karigarById(String id) {
    try {
      return karigars.firstWhere((k) => k.id == id);
    } catch (_) {
      return null;
    }
  }

  static List<Review> reviewsForKarigar(String karigerId) {
    return [
      Review(
        id: 'r1',
        bookingId: 'b1',
        karigerId: karigerId,
        customerId: 'user-2',
        customerName: 'Fatima Ali',
        rating: 5,
        comment: 'Excellent work, very professional and on time.',
        createdAt: DateTime.now().subtract(const Duration(days: 5)),
      ),
      Review(
        id: 'r2',
        bookingId: 'b2',
        karigerId: karigerId,
        customerId: 'user-3',
        customerName: 'Muhammad Khan',
        rating: 4,
        comment: 'Good service, fair pricing.',
        createdAt: DateTime.now().subtract(const Duration(days: 12)),
      ),
      Review(
        id: 'r3',
        bookingId: 'b3',
        karigerId: karigerId,
        customerId: 'user-4',
        customerName: 'Ayesha Malik',
        rating: 5,
        comment: 'Highly recommend! Will book again.',
        createdAt: DateTime.now().subtract(const Duration(days: 20)),
      ),
    ];
  }

  static final List<Booking> _bookings = [
    Booking(
      id: 'b-demo-1',
      customerId: 'user-1',
      karigerId: 'k1',
      service: 'Electrician',
      bookingDate: DateTime.now().add(const Duration(days: 2)),
      status: 'pending',
      description: 'Fix kitchen socket and install new ceiling fan.',
      address: 'House 12, Gulberg III',
      city: 'Lahore',
      totalPrice: 2400,
      paymentStatus: 'pending',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    Booking(
      id: 'b-demo-2',
      customerId: 'user-1',
      karigerId: 'k2',
      service: 'Plumber',
      bookingDate: DateTime.now().subtract(const Duration(days: 7)),
      completionDate: DateTime.now().subtract(const Duration(days: 6)),
      status: 'completed',
      description: 'Bathroom leak repair.',
      address: 'House 12, Gulberg III',
      city: 'Lahore',
      totalPrice: 1500,
      paymentStatus: 'completed',
      rating: 5,
      review: 'Fixed quickly and cleanly.',
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
    ),
  ];

  static List<Booking> get myBookings => List.unmodifiable(_bookings);

  static Booking createBooking({
    required String karigerId,
    required String service,
    required DateTime bookingDate,
    required String description,
    required String address,
    required String city,
    required double totalPrice,
  }) {
    final booking = Booking(
      id: 'b-${DateTime.now().millisecondsSinceEpoch}',
      customerId: demoUser.id,
      karigerId: karigerId,
      service: service,
      bookingDate: bookingDate,
      status: 'pending',
      description: description,
      address: address,
      city: city,
      totalPrice: totalPrice,
      paymentStatus: 'pending',
      createdAt: DateTime.now(),
    );
    _bookings.insert(0, booking);
    return booking;
  }

  static void cancelBooking(String id) {
    final index = _bookings.indexWhere((b) => b.id == id);
    if (index >= 0) {
      _bookings[index] = Booking(
        id: _bookings[index].id,
        customerId: _bookings[index].customerId,
        karigerId: _bookings[index].karigerId,
        service: _bookings[index].service,
        bookingDate: _bookings[index].bookingDate,
        completionDate: _bookings[index].completionDate,
        status: 'cancelled',
        description: _bookings[index].description,
        address: _bookings[index].address,
        city: _bookings[index].city,
        totalPrice: _bookings[index].totalPrice,
        paymentStatus: _bookings[index].paymentStatus,
        rating: _bookings[index].rating,
        review: _bookings[index].review,
        createdAt: _bookings[index].createdAt,
      );
    }
  }

  static int _priceValue(Karigar k) {
    return int.tryParse(
          k.pricePerHour.replaceAll(RegExp(r'[^0-9]'), ''),
        ) ??
        0;
  }

  static Karigar _karigar({
    required String id,
    required String name,
    required String service,
    required String city,
    required double rating,
    required int reviewCount,
    required String pricePerHour,
    required String bio,
    required List<String> skills,
    required int yearsExperience,
    required String status,
  }) {
    return Karigar(
      id: id,
      name: name,
      service: service,
      city: city,
      rating: rating,
      reviewCount: reviewCount,
      pricePerHour: pricePerHour,
      isVerified: true,
      profileImage: name.substring(0, 1),
      bio: bio,
      skills: skills,
      certifications: const ['CNIC Verified', 'Background Checked'],
      yearsExperience: yearsExperience,
      status: status,
      createdAt: DateTime.now().subtract(Duration(days: yearsExperience * 365)),
    );
  }
}
