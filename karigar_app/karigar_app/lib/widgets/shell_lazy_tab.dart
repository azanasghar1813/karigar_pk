import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Defers building (and [initState]) of shell tab content until the user
/// opens that tab. [StatefulShellRoute.indexedStack] keeps every branch in an
/// [IndexedStack], which would otherwise mount all tabs — and their API calls —
/// on the first frame.
class ShellLazyTab extends StatefulWidget {
  final int branchIndex;
  final Widget child;

  const ShellLazyTab({
    super.key,
    required this.branchIndex,
    required this.child,
  });

  @override
  State<ShellLazyTab> createState() => _ShellLazyTabState();
}

class _ShellLazyTabState extends State<ShellLazyTab> {
  Widget? _cachedChild;

  @override
  Widget build(BuildContext context) {
    final shell = StatefulNavigationShell.of(context);
    final isActive = shell.currentIndex == widget.branchIndex;

    if (isActive || _cachedChild != null) {
      _cachedChild ??= widget.child;
      return _cachedChild!;
    }

    return const SizedBox.shrink();
  }
}
