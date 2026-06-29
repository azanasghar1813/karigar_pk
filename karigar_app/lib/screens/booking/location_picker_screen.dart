import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import '../../config/theme.dart';

class LocationPickerScreen extends StatefulWidget {
  const LocationPickerScreen({super.key});

  @override
  State<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _LocationPickerScreenState extends State<LocationPickerScreen> {
  GoogleMapController? _mapController;
  LatLng? _selectedPosition;
  String _currentAddress = 'Searching...';
  bool _isLoading = true;

  static const CameraPosition _initialPosition = CameraPosition(
    target: LatLng(31.5204, 74.3587), // Default: Lahore
    zoom: 12,
  );

  @override
  void initState() {
    super.initState();
    _determinePosition();
  }

  Future<void> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      _showError('Location services are disabled.');
      setState(() => _isLoading = false);
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        _showError('Location permissions are denied');
        setState(() => _isLoading = false);
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      _showError('Location permissions are permanently denied, we cannot request permissions.');
      setState(() => _isLoading = false);
      return;
    }

    try {
      Position position = await Geolocator.getCurrentPosition();
      final latLng = LatLng(position.latitude, position.longitude);
      
      if (_mapController != null) {
        _mapController!.animateCamera(CameraUpdate.newLatLngZoom(latLng, 15));
      }
      
      setState(() {
        _selectedPosition = latLng;
        _isLoading = false;
      });
      
      await _getAddressFromLatLng(latLng);
    } catch (e) {
      _showError(e.toString());
      setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.errorColor,
      ),
    );
  }

  Future<void> _getAddressFromLatLng(LatLng position) async {
    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        setState(() {
          _currentAddress = '${place.street}, ${place.subLocality}, ${place.locality}, ${place.administrativeArea}';
        });
      }
    } catch (e) {
      setState(() {
        _currentAddress = 'Could not determine address';
      });
    }
  }

  void _onCameraIdle() {
    if (_selectedPosition != null) {
      _getAddressFromLatLng(_selectedPosition!);
    }
  }

  void _onCameraMove(CameraPosition position) {
    setState(() {
      _selectedPosition = position.target;
      _currentAddress = 'Searching...';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pick Location'),
      ),
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: _initialPosition,
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            onMapCreated: (GoogleMapController controller) {
              _mapController = controller;
              if (_selectedPosition != null) {
                controller.animateCamera(CameraUpdate.newLatLngZoom(_selectedPosition!, 15));
              }
            },
            onCameraMove: _onCameraMove,
            onCameraIdle: _onCameraIdle,
          ),
          // Center Pin Marker
          const Center(
            child: Padding(
              padding: EdgeInsets.only(bottom: 35.0),
              child: Icon(
                Icons.location_on,
                size: 40,
                color: AppTheme.primaryColor,
              ),
            ),
          ),
          
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(),
            ),

          // Bottom Address Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Selected Address',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppTheme.primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _currentAddress,
                    style: Theme.of(context).textTheme.bodyMedium,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _selectedPosition == null ? null : () {
                        Navigator.pop(context, {
                          'address': _currentAddress,
                          'latitude': _selectedPosition!.latitude,
                          'longitude': _selectedPosition!.longitude,
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Confirm Location'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
