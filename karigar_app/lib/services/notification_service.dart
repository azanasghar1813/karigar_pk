import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    final token = await _messaging.getToken();
    if (token != null) {
      print("FCM Token: $token");
    }

    FirebaseMessaging.instance.onTokenRefresh.listen((token) async {
      print("New Token: $token");
    });
  }
}
