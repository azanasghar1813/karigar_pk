import 'package:flutter_test/flutter_test.dart';
import 'package:karigar/main.dart';

void main() {
  testWidgets('KarigarApp builds without crashing', (WidgetTester tester) async {
    await tester.pumpWidget(const KarigarApp());
    await tester.pump();

    expect(find.byType(KarigarApp), findsOneWidget);
  });
}
