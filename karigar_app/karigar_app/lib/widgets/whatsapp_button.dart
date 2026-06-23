import 'package:flutter/material.dart';
import '../utils/whatsapp_launcher.dart';

/// Official WhatsApp green: #25D366
const Color whatsAppGreen = Color(0xFF25D366);
const Color whatsAppGreenDark = Color(0xFF128C7E);

class WhatsAppIcon extends StatelessWidget {
  final double size;

  const WhatsAppIcon({super.key, this.size = 24});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: _WhatsAppLogoPainter(),
    );
  }
}

class _WhatsAppLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final r = size.width / 2;
    final center = Offset(r, r);

    canvas.drawCircle(center, r, Paint()..color = whatsAppGreen);

    final phone = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.07
      ..strokeCap = StrokeCap.round;

    final path = Path();
    final w = size.width;
    final h = size.height;
    path.moveTo(w * 0.38, h * 0.32);
    path.cubicTo(w * 0.28, h * 0.42, w * 0.28, h * 0.58, w * 0.38, h * 0.68);
    path.cubicTo(w * 0.48, h * 0.78, w * 0.62, h * 0.76, w * 0.72, h * 0.66);
    path.lineTo(w * 0.76, h * 0.78);
    path.lineTo(w * 0.64, h * 0.74);
    canvas.drawPath(path, phone);

    canvas.drawCircle(
      Offset(w * 0.42, h * 0.48),
      w * 0.04,
      Paint()..color = Colors.white,
    );
    canvas.drawCircle(
      Offset(w * 0.58, h * 0.48),
      w * 0.04,
      Paint()..color = Colors.white,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class WhatsAppButton extends StatelessWidget {
  final String? message;
  final bool extended;
  final VoidCallback? onPressed;

  const WhatsAppButton({
    super.key,
    this.message,
    this.extended = true,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    if (extended) {
      return FilledButton.icon(
        onPressed: onPressed ??
            () => WhatsAppLauncher.openOrSnackBar(context, message: message),
        icon: const WhatsAppIcon(size: 22),
        label: const Text('Chat on WhatsApp'),
        style: FilledButton.styleFrom(
          backgroundColor: whatsAppGreen,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        ),
      );
    }

    return IconButton.filled(
      onPressed: onPressed ??
          () => WhatsAppLauncher.openOrSnackBar(context, message: message),
      style: IconButton.styleFrom(backgroundColor: whatsAppGreen),
      icon: const WhatsAppIcon(size: 22),
      tooltip: 'WhatsApp',
    );
  }
}

class WhatsAppFab extends StatelessWidget {
  final String? message;

  const WhatsAppFab({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      heroTag: 'whatsapp_fab',
      onPressed: () =>
          WhatsAppLauncher.openOrSnackBar(context, message: message),
      backgroundColor: whatsAppGreen,
      foregroundColor: Colors.white,
      icon: const WhatsAppIcon(size: 26),
      label: const Text(
        'WhatsApp',
        style: TextStyle(fontWeight: FontWeight.w700),
      ),
    );
  }
}
