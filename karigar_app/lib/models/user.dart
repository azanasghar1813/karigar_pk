class User {
  final String id;
  final String fullName;
  final String email;
  final String? phone;
  final String? cnic;
  final String? address;
  final bool isPhoneVerified;
  final String? userType;
  final String? service;
  final String? city;
  final String? pricePerHour;

  User({
    required this.id,
    required this.fullName,
    required this.email,
    this.phone,
    this.cnic,
    this.address,
    this.isPhoneVerified = false,
    this.userType,
    this.service,
    this.city,
    this.pricePerHour,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String?,
      cnic: json['cnic'] as String?,
      address: json['address'] as String?,
      isPhoneVerified: json['isPhoneVerified'] as bool? ?? false,
      userType: json['userType'] as String?,
      service: json['service'] as String?,
      city: json['city'] as String?,
      pricePerHour: json['pricePerHour']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'cnic': cnic,
      'address': address,
      'isPhoneVerified': isPhoneVerified,
      'userType': userType,
      'service': service,
      'city': city,
      'pricePerHour': pricePerHour,
    };
  }
}
