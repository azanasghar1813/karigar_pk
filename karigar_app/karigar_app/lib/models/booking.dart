class Booking {
  final String id;
  final String customerId;
  final String karigerId;
  final String service;
  final DateTime bookingDate;
  final DateTime? completionDate;
  final String status; // 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'
  final String description;
  final String address;
  final String city;
  final double totalPrice;
  final String paymentStatus; // 'pending', 'completed', 'failed'
  final int? rating;
  final String? review;
  final DateTime createdAt;

  Booking({
    required this.id,
    required this.customerId,
    required this.karigerId,
    required this.service,
    required this.bookingDate,
    this.completionDate,
    required this.status,
    required this.description,
    required this.address,
    required this.city,
    required this.totalPrice,
    required this.paymentStatus,
    this.rating,
    this.review,
    required this.createdAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as String,
      customerId: json['customerId'] as String,
      karigerId: json['karigerId'] as String,
      service: json['service'] as String,
      bookingDate: DateTime.parse(json['bookingDate'] as String),
      completionDate: json['completionDate'] != null
          ? DateTime.parse(json['completionDate'] as String)
          : null,
      status: json['status'] as String? ?? 'pending',
      description: json['description'] as String? ?? '',
      address: json['address'] as String,
      city: json['city'] as String,
      totalPrice: (json['totalPrice'] as num).toDouble(),
      paymentStatus: json['paymentStatus'] as String? ?? 'pending',
      rating: json['rating'] as int?,
      review: json['review'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customerId': customerId,
      'karigerId': karigerId,
      'service': service,
      'bookingDate': bookingDate.toIso8601String(),
      'completionDate': completionDate?.toIso8601String(),
      'status': status,
      'description': description,
      'address': address,
      'city': city,
      'totalPrice': totalPrice,
      'paymentStatus': paymentStatus,
      'rating': rating,
      'review': review,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}