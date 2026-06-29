import 'package:flutter_test/flutter_test.dart';
import 'package:karigar/main.dart';
import 'package:karigar/services/storage_service.dart';
import 'package:karigar/providers/auth_provider.dart';
import 'package:karigar/providers/app_provider.dart';
import 'package:karigar/config/routes.dart';

void main() {
  testWidgets('KarigarApp builds without crashing', (WidgetTester tester) async {
    final storage = StorageService();
    final auth = AuthProvider(storageService: storage);
    final app = AppProvider();
    final router = createRouter(auth);

    await tester.pumpWidget(
      KarigarApp(authProvider: auth, appProvider: app, router: router),
    );
    await tester.pump();

    expect(find.byType(KarigarApp), findsOneWidget);
  });
}
