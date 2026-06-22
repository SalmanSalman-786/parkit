import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import 'package:stomp_dart_client/stomp_frame.dart';

class SocketService {
  static StompClient? _client;

  static void connect(Function(String) onMessage) {
    _client = StompClient(
      config: StompConfig.SockJS(
        url: 'http://192.168.5.227:8080/ws', // 🔥 change for emulator if needed

        onConnect: (StompFrame frame) {
          print("✅ Socket Connected");

          _client!.subscribe(
            destination: '/topic/dashboard',
            callback: (frame) {
              if (frame.body != null) {
                print("Realtime: ${frame.body}");
                onMessage(frame.body!);
              }
            },
          );
        },

        onWebSocketError: (error) {
          print("❌ Socket error: $error");
        },

        onDisconnect: (frame) {
          print("⚠ Socket disconnected");
        },
      ),
    );

    _client!.activate();
  }

  static void disconnect() {
    _client?.deactivate();
  }
}