import 'package:flutter/material.dart';

import 'package:guard_app/screens/splash_screen.dart';
import 'package:guard_app/services/socket_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'operations_screen.dart';
import 'monitoring_screen.dart';

class GuardMainScreen extends StatefulWidget {
  @override
  _GuardMainScreenState createState() => _GuardMainScreenState();
}

class _GuardMainScreenState extends State<GuardMainScreen>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  bool isSocketConnected = false;
  String parkingName = "";

  final GlobalKey<MonitoringScreenState> monitoringKey =
      GlobalKey<MonitoringScreenState>();
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    loadParkingName();
    connectSocket();
  }

  // 🔌 CONNECT SOCKET
  void connectSocket() {
    if (isSocketConnected) return;

    SocketService.connect((event) {
      debugPrint("Realtime: $event");

      // 🔥 TRIGGER UI UPDATE
      refreshScreens(event);
    });

    isSocketConnected = true;
  }

  Future<void> loadParkingName() async {
    final prefs = await SharedPreferences.getInstance();

    setState(() {
      parkingName = prefs.getString("parkingName") ?? "";
    });
  }

  // 🔥 REALTIME REFRESH
  void refreshScreens(String event) {
    if (event == "ENTRY_MARKED" ||
        event == "EXIT_MARKED" ||
        event == "BOOKING_CREATED") {
      debugPrint("🔄 Refreshing UI");

      monitoringKey.currentState?.reload();
    }
  }

  // 🔁 HANDLE APP LIFECYCLE
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      connectSocket();
    } else if (state == AppLifecycleState.paused) {
      SocketService.disconnect();
      isSocketConnected = false;
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);

    if (isSocketConnected) {
      SocketService.disconnect();
    }

    super.dispose();
  }

  // 🔐 LOGOUT
  Future<void> logout() async {
    SocketService.disconnect();
    isSocketConnected = false;

    final prefs = await SharedPreferences.getInstance();

    await prefs.clear();

    if (!mounted) return;

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const SplashScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
          centerTitle: false,
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Guard Panel",
                style: TextStyle(
                  color: Color(0xFF2D3142),
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),

              if (parkingName.isNotEmpty)
                Text(
                  parkingName,
                  style: const TextStyle(color: Colors.grey, fontSize: 13),
                ),
            ],
          ),

          actions: [
            Container(
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 8),
                ],
              ),
              child: IconButton(
                icon: const Icon(Icons.logout),
                color: Color(0xFF3F51F5),
                onPressed: logout,
              ),
            ),
          ],

          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(58),
            child: Container(
              margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: TabBar(
                dividerColor: Colors.transparent,

                indicatorPadding: const EdgeInsets.all(4),

                labelStyle: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),

                indicator: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF3F51F5), Color(0xFF00BCD4)],
                  ),
                ),

                labelColor: Colors.white,
                unselectedLabelColor: const Color(0xFF6B7280),

                tabs: const [
                  Tab(
                    height: 55,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.settings_applications, size: 18),
                        SizedBox(width: 6),
                        Text("Operations"),
                      ],
                    ),
                  ),
                  Tab(
                    height: 55,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.settings_applications, size: 18),
                        SizedBox(width: 6),
                        Text("Monitoring"),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        body: TabBarView(
          children: [
            const OperationsScreen(),
            MonitoringScreen(key: monitoringKey),
          ],
        ),
      ),
    );
  }
}

// 🔥 KEEP ALIVE WRAPPER

class KeepAliveWrapper extends StatefulWidget {
  final Widget child;

  const KeepAliveWrapper({required this.child});

  @override
  _KeepAliveWrapperState createState() => _KeepAliveWrapperState();
}

class _KeepAliveWrapperState extends State<KeepAliveWrapper>
    with AutomaticKeepAliveClientMixin {
  @override
  Widget build(BuildContext context) {
    super.build(context);
    return widget.child;
  }

  @override
  bool get wantKeepAlive => true;
}
