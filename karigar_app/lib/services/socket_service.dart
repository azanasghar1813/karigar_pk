import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../config/constants.dart';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  IO.Socket? _socket;
  
  // Callbacks
  Function(dynamic)? onNewBooking;
  Function(dynamic)? onBookingCancelled;
  Function(dynamic)? onBookingStatusChanged;

  factory SocketService() {
    return _instance;
  }

  SocketService._internal();

  void initialize(String userId) {
    if (_socket != null && _socket!.connected) return;

    _socket = IO.io(AppConstants.apiBaseUrl.replaceAll('/api', ''), <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    _socket!.connect();

    _socket!.onConnect((_) {
      print('Socket connected: ${_socket!.id}');
      _socket!.emit('join', userId);
    });

    _socket!.on('newBooking', (data) {
      if (onNewBooking != null) onNewBooking!(data);
    });

    _socket!.on('bookingCancelled', (data) {
      if (onBookingCancelled != null) onBookingCancelled!(data);
    });
    
    _socket!.on('bookingStatusChanged', (data) {
      if (onBookingStatusChanged != null) onBookingStatusChanged!(data);
    });

    _socket!.onDisconnect((_) {
      print('Socket disconnected');
    });
  }

  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
    }
  }
}
