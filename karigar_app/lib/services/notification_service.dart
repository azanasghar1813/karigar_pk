import 'package:flutter/foundation.dart';

/// Local notification stub (Firebase removed for web/mobile compatibility).
/// Wire [initialize] to FCM or another provider when you add push later.
class NotificationService {
  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;
    if (kDebugMode) {
      debugPrint('NotificationService: ready (push not configured)');
    }
  }

  Future<String?> getDeviceToken() async => null;

  Future<void> subscribeToTopic(String topic) async {
    if (kDebugMode) {
      debugPrint('NotificationService: subscribeToTopic($topic) — no-op');
    }
  }

  Future<void> unsubscribeFromTopic(String topic) async {
    if (kDebugMode) {
      debugPrint('NotificationService: unsubscribeFromTopic($topic) — no-op');
    }
  }

  void handleMessage({String? title, String? body}) {
    if (kDebugMode && (title != null || body != null)) {
      debugPrint('Notification: $title — $body');
    }
  }
}
