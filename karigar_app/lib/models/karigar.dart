class Karigar {
  final String id;
  final String name;
  final String service;
  final String city;
  final double rating;
  final int reviewCount;
  final String pricePerHour;
  final bool isVerified;
  final String profileImage;
  final String bio;
  final List<String> skills;
  final List<String> certifications;
  final int yearsExperience;
  final double? latitude;
  final double? longitude;
  final String status; // 'available', 'busy', 'offline'
  final DateTime createdAt;

  Karigar({
    required this.id,
    required this.name,
    required this.service,
    required this.city,
    required this.rating,
    required this.reviewCount,
    required this.pricePerHour,
    required this.isVerified,
    required this.profileImage,
    required this.bio,
    required this.skills,
    required this.certifications,
    required this.yearsExperience,
    this.latitude,
    this.longitude,
    required this.status,
    required this.createdAt,
  });

  factory Karigar.fromJson(Map<String, dynamic> json) {
    return Karigar(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
      name: json['name'] as String? ?? json['fullName'] as String? ?? 'Karigar',
      service: json['service'] as String? ?? (json['services'] != null && (json['services'] as List).isNotEmpty ? json['services'][0].toString() : 'General'),
      city: json['city'] as String? ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: json['reviewCount'] as int? ?? json['reviewsCount'] as int? ?? 0,
      pricePerHour: json['pricePerHour']?.toString() ?? json['hourlyRate']?.toString() ?? '500',
      isVerified: json['isVerified'] as bool? ?? (json['verificationStatus'] == 'approved'),
      profileImage: json['profileImage'] as String? ?? json['profilePhoto'] as String? ?? '',
      bio: json['bio'] as String? ?? '',
      skills: List<String>.from(json['skills'] as List? ?? []),
      certifications: List<String>.from(json['certifications'] as List? ?? []),
      yearsExperience: json['yearsExperience'] as int? ?? json['experience'] as int? ?? 0,
      latitude: (json['latitude'] as num?)?.toDouble() ?? (json['location'] != null ? (json['location']['latitude'] as num?)?.toDouble() : null),
      longitude: (json['longitude'] as num?)?.toDouble() ?? (json['location'] != null ? (json['location']['longitude'] as num?)?.toDouble() : null),
      status: json['status'] as String? ?? (json['isOnline'] == true ? 'available' : 'offline'),
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'service': service,
      'city': city,
      'rating': rating,
      'reviewCount': reviewCount,
      'pricePerHour': pricePerHour,
      'isVerified': isVerified,
      'profileImage': profileImage,
      'bio': bio,
      'skills': skills,
      'certifications': certifications,
      'yearsExperience': yearsExperience,
      'latitude': latitude,
      'longitude': longitude,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}