import 'package:flutter/material.dart';

class AppLogo extends StatelessWidget {
  final double size;
  final bool showBorder;

  const AppLogo({
    super.key,
    this.size = 40,
    this.showBorder = false,
  });

  @override
  Widget build(BuildContext context) {
    Widget image = Image.asset(
      'assets/images/app_logo.png',
      width: size,
      height: size,
      fit: BoxFit.contain,
      errorBuilder: (_, __, ___) => Icon(
        Icons.handyman_rounded,
        size: size * 0.7,
        color: Colors.white,
      ),
    );

    if (showBorder) {
      image = Container(
        width: size,
        height: size,
        padding: EdgeInsets.all(size * 0.08),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(size * 0.22),
        ),
        child: image,
      );
    }

    return image;
  }
}
