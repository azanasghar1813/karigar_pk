class Service {
  final String id;
  final String name;
  final String icon;
  final String description;
  final String details;
  final bool isAvailable;

  Service({
    required this.id,
    required this.name,
    required this.icon,
    required this.description,
    required this.details,
    this.isAvailable = true,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'] as String,
      name: json['name'] as String,
      icon: json['icon'] as String,
      description: json['description'] as String,
      details: json['details'] as String,
      isAvailable: json['isAvailable'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'icon': icon,
      'description': description,
      'details': details,
      'isAvailable': isAvailable,
    };
  }
}