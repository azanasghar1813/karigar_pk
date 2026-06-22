import 'package:flutter/material.dart';
import '../config/theme.dart';

/// Card with subtle border, optional tap ripple, and light hover on desktop.
class AppSurfaceCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final BorderRadius borderRadius;
  final Color? color;

  const AppSurfaceCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.borderRadius = const BorderRadius.all(Radius.circular(16)),
    this.color,
  });

  @override
  State<AppSurfaceCard> createState() => _AppSurfaceCardState();
}

class _AppSurfaceCardState extends State<AppSurfaceCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final bg = widget.color ?? AppTheme.darkCard;
    final borderColor = _hovered && widget.onTap != null
        ? AppTheme.primaryColor.withValues(alpha: 0.5)
        : AppTheme.darkBorder;

    final decoration = BoxDecoration(
      color: bg,
      borderRadius: widget.borderRadius,
      border: Border.all(color: borderColor),
      boxShadow: _hovered && widget.onTap != null
          ? [
              BoxShadow(
                color: AppTheme.primaryColor.withValues(alpha: 0.12),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ]
          : null,
    );

    final content = Padding(
      padding: widget.padding ?? EdgeInsets.zero,
      child: widget.child,
    );

    if (widget.onTap == null) {
      return AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        decoration: decoration,
        child: content,
      );
    }

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        decoration: decoration,
        child: Material(
          color: Colors.transparent,
          borderRadius: widget.borderRadius,
          child: InkWell(
            onTap: widget.onTap,
            borderRadius: widget.borderRadius,
            splashColor: AppTheme.primaryColor.withValues(alpha: 0.15),
            highlightColor: AppTheme.primaryColor.withValues(alpha: 0.08),
            child: content,
          ),
        ),
      ),
    );
  }
}
