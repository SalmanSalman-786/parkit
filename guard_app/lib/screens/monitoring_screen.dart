import 'dart:async';
import 'package:flutter/material.dart';
import 'package:guard_app/screens/revenue_details_screen.dart';
import 'package:guard_app/screens/today_activity_screen.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'inside_vehicles_screen.dart';
import 'overstayed_vehicles_screen.dart';
import 'not_entered_screen.dart';
import 'long_stay_walkins_screen.dart';

class MonitoringScreen extends StatefulWidget {
  const MonitoringScreen({super.key});

  @override
  State<MonitoringScreen> createState() => MonitoringScreenState();
}

class MonitoringScreenState extends State<MonitoringScreen> {
  String? parkingId;

  Timer? refreshTimer;

  int carWalkinActive = 0;
  int carWalkinCapacity = 0;

  int bikeWalkinActive = 0;
  int bikeWalkinCapacity = 0;

  int carBooked = 0;
  int carActive = 0;
  int carBookingCapacity = 0;

  int bikeBooked = 0;
  int bikeActive = 0;
  int bikeBookingCapacity = 0;

  double todayRevenue = 0;

  double cashCollection = 0;
  double onlineCollection = 0;

  bool isLoading = true;

  int notEnteredCount = 0;
  int overstayedCount = 0;
  int longStayCount = 0;

  List<dynamic> upcomingArrivals = [];
  List<dynamic> overstayedVehicles = [];
  List<dynamic> todayActivity = [];
  List<dynamic> longStayWalkins = [];

  Future<void> reload() async {
    await loadData();
  }

  @override
  void initState() {
    super.initState();

    loadData();

    refreshTimer = Timer.periodic(const Duration(seconds: 15), (timer) {
      if (mounted) {
        loadData();
      }
    });
  }

  @override
  void dispose() {
    refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> loadData() async {
    final prefs = await SharedPreferences.getInstance();

    parkingId = prefs.getString("parkingId");

    if (parkingId == null) return;

    try {
      final breakdown = await ApiService.getCapacityBreakdown(parkingId!);

      final revenue = await ApiService.getRevenue(parkingId!);

      final dashboard = await ApiService.getGuardDashboard(parkingId!);

      final overstayed = await ApiService.getOverstayedVehicles(parkingId!);

      final upcoming = await ApiService.getUpcomingArrivals(parkingId!);

      final activity = await ApiService.getTodayActivity(parkingId!);

      final longStay = await ApiService.getLongStayWalkins(parkingId!);

      if (!mounted) return;

      setState(() {
        carWalkinActive = breakdown["cars"]["walkinActive"] ?? 0;

        carWalkinCapacity = breakdown["cars"]["walkinCapacity"] ?? 0;

        carBookingCapacity = breakdown["cars"]["bookingCapacity"] ?? 0;

        bikeWalkinActive = breakdown["bikes"]["walkinActive"] ?? 0;

        bikeWalkinCapacity = breakdown["bikes"]["walkinCapacity"] ?? 0;

        carBooked = breakdown["cars"]["bookedCount"] ?? 0;

        carActive = breakdown["cars"]["activeCount"] ?? 0;

        bikeBooked = breakdown["bikes"]["bookedCount"] ?? 0;

        bikeActive = breakdown["bikes"]["activeCount"] ?? 0;

        bikeBookingCapacity = breakdown["bikes"]["bookingCapacity"] ?? 0;

        todayRevenue = (revenue["revenue"] ?? 0).toDouble();

        cashCollection = (revenue["cashCollection"] ?? 0).toDouble();

        onlineCollection = (revenue["onlineCollection"] ?? 0).toDouble();

        notEnteredCount = dashboard["notEntered"] ?? 0;

        overstayedCount = overstayed.length;

        longStayCount = longStay.length;

        longStayWalkins = longStay;

        upcomingArrivals = upcoming;

        overstayedVehicles = overstayed;

        todayActivity = activity;

        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        isLoading = false;
      });
    }
  }

  String formatDateTime(String? value) {
    if (value == null || value.isEmpty) {
      return "-";
    }

    try {
      final dt = DateTime.parse(value);

      return DateFormat("dd MMM yyyy • h:mm a").format(dt);
    } catch (_) {
      return value;
    }
  }

  Widget buildInfoCard({
    required String title,
    required String value,
    required IconData icon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),

      child: Padding(
        padding: const EdgeInsets.all(18),

        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,

          children: [
            Container(
              width: 50,
              height: 50,

              decoration: BoxDecoration(
                color: const Color(0xFFE8EEFF),
                borderRadius: BorderRadius.circular(15),
              ),

              child: Icon(icon, color: const Color(0xFF3F51F5), size: 28),
            ),

            const SizedBox(height: 12),

            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
            ),

            const SizedBox(height: 10),

            Text(
              value,
              style: const TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2D3142),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildBookingCard({
    required String title,
    required int capacity,
    required int booked,
    required int active,
  }) {
    int available = capacity - (booked + active);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),

      child: Padding(
        padding: const EdgeInsets.all(18),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,

          children: [
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),

            const SizedBox(height: 15),

            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildChip(
                  "Capacity",
                  capacity.toString(),
                  const Color(0xFFE3F2FD),
                ),

                _buildChip(
                  "Booked",
                  booked.toString(),
                  const Color(0xFFFFF3E0),
                ),

                _buildChip(
                  "Active",
                  active.toString(),
                  const Color(0xFFE8F5E9),
                ),

                _buildChip(
                  "Available",
                  available.toString(),
                  const Color(0xFFF3E5F5),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),

      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),

      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),

          Text(label, style: const TextStyle(fontSize: 11)),
        ],
      ),
    );
  }

  Widget buildAlertCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),

      child: Padding(
        padding: const EdgeInsets.all(16),

        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,

          children: [
            CircleAvatar(
              radius: 22,
              backgroundColor: color.withOpacity(0.15),

              child: Icon(icon, color: color),
            ),

            const SizedBox(height: 12),

            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),

            const SizedBox(height: 6),

            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),

      child: Column(
        children: [
          Container(
            height: 170,
            width: double.infinity,

            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),

              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF3F51F5), Color(0xFF00BCD4)],
              ),

              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 12,
                  offset: Offset(0, 5),
                ),
              ],
            ),

            child: Padding(
              padding: const EdgeInsets.all(24),

              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,

                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Icon(Icons.monitor, color: Colors.white, size: 42),

                      Container(
                        padding: const EdgeInsets.all(10),

                        decoration: BoxDecoration(
                          color: Colors.white24,
                          borderRadius: BorderRadius.circular(12),
                        ),

                        child: const Icon(Icons.analytics, color: Colors.white),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  const Text(
                    "Parking Overview",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 4),

                  Text(
                    "Revenue ₹${todayRevenue.toStringAsFixed(0)}",
                    style: const TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const InsideVehiclesScreen(
                          vehicleType: "FOUR_WHEELER",
                          sourceType: "WALKIN",
                          title: "Walk-in Cars",
                        ),
                      ),
                    );
                  },

                  child: buildInfoCard(
                    title: "Walk-in Cars",
                    value: "$carWalkinActive / $carWalkinCapacity",
                    icon: Icons.directions_car,
                  ),
                ),
              ),

              Expanded(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const InsideVehiclesScreen(
                          vehicleType: "TWO_WHEELER",
                          sourceType: "WALKIN",
                          title: "Walk-in Bikes",
                        ),
                      ),
                    );
                  },

                  child: buildInfoCard(
                    title: "Walk-in Bikes",
                    value: "$bikeWalkinActive / $bikeWalkinCapacity",
                    icon: Icons.two_wheeler,
                  ),
                ),
              ),
            ],
          ),

          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const InsideVehiclesScreen(
                          vehicleType: "FOUR_WHEELER",
                          sourceType: "BOOKING",
                          title: "Active Booking Cars",
                        ),
                      ),
                    );
                  },
                  child: buildBookingCard(
                    title: "Cars Booking",
                    capacity: carBookingCapacity,
                    booked: carBooked,
                    active: carActive,
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const InsideVehiclesScreen(
                          vehicleType: "TWO_WHEELER",
                          sourceType: "BOOKING",
                          title: "Active Booking Bikes",
                        ),
                      ),
                    );
                  },
                  child: buildBookingCard(
                    title: "Bikes Booking",
                    capacity: bikeBookingCapacity,
                    booked: bikeBooked,
                    active: bikeActive,
                  ),
                ),
              ),
            ],
          ),

          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => RevenueDetailsScreen()),
              );
            },
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),

                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF3F51F5), Color(0xFF00BCD4)],
                ),

                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 12,
                    offset: Offset(0, 5),
                  ),
                ],
              ),

              child: Padding(
                padding: const EdgeInsets.all(20),

                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,

                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,

                      children: [
                        const Text(
                          "Today's Collection",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        Container(
                          padding: const EdgeInsets.all(10),

                          decoration: BoxDecoration(
                            color: Colors.white24,
                            borderRadius: BorderRadius.circular(12),
                          ),

                          child: const Icon(
                            Icons.currency_rupee,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    Text(
                      "₹${todayRevenue.toStringAsFixed(0)}",
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 34,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 20),

                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(12),

                            decoration: BoxDecoration(
                              color: Colors.white24,
                              borderRadius: BorderRadius.circular(14),
                            ),

                            child: Column(
                              children: [
                                const Text(
                                  "Cash",
                                  style: TextStyle(color: Colors.white70),
                                ),

                                const SizedBox(height: 4),

                                Text(
                                  "₹${cashCollection.toStringAsFixed(0)}",
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        const SizedBox(width: 10),

                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(12),

                            decoration: BoxDecoration(
                              color: Colors.white24,
                              borderRadius: BorderRadius.circular(14),
                            ),

                            child: Column(
                              children: [
                                const Text(
                                  "Online",
                                  style: TextStyle(color: Colors.white70),
                                ),

                                const SizedBox(height: 4),

                                Text(
                                  "₹${onlineCollection.toStringAsFixed(0)}",
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    const Align(
                      alignment: Alignment.centerRight,
                      child: Text(
                        "Tap to view details →",
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => TodayActivityScreen()),
              );
            },

            child: Container(
              width: double.infinity,

              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),

                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),

              child: Padding(
                padding: const EdgeInsets.all(20),

                child: Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,

                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),

                        gradient: const LinearGradient(
                          colors: [Color(0xFF3F51F5), Color(0xFF00BCD4)],
                        ),
                      ),

                      child: const Icon(
                        Icons.timeline,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),

                    const SizedBox(width: 15),

                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,

                        children: [
                          Text(
                            "Today's Activity",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          SizedBox(height: 4),

                          Text(
                            "View entries, exits and payments",
                            style: TextStyle(color: Colors.grey, fontSize: 13),
                          ),
                        ],
                      ),
                    ),

                    const Icon(
                      Icons.arrow_forward_ios,
                      color: Colors.grey,
                      size: 18,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 15),

          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const NotEnteredScreen(),
                      ),
                    );
                  },
                  child: buildAlertCard(
                    title: "Not Entered",
                    value: "$notEnteredCount",
                    icon: Icons.hourglass_empty,
                    color: Colors.orange,
                  ),
                ),
              ),

              Expanded(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const OverstayedVehiclesScreen(),
                      ),
                    );
                  },
                  child: buildAlertCard(
                    title: "Overstayed",
                    value: "$overstayedCount",
                    icon: Icons.warning_amber_rounded,
                    color: Colors.red,
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const LongStayWalkinsScreen(),
                      ),
                    );
                  },
                  child: buildAlertCard(
                    title: "Long Stay",
                    value: "$longStayCount",
                    icon: Icons.access_time,
                    color: Colors.blue,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              "Upcoming Arrivals",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),

          const SizedBox(height: 10),

          if (upcomingArrivals.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text("No upcoming arrivals"),
              ),
            ),

          ...upcomingArrivals.map(
            (item) => Container(
              margin: const EdgeInsets.only(bottom: 12),

              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),

              child: Padding(
                padding: const EdgeInsets.all(16),

                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,

                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,

                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),

                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF3F51F5), Color(0xFF00BCD4)],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),

                          child: Text(
                            item["vehicleNumber"] ?? "-",
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),

                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 6,
                          ),

                          decoration: BoxDecoration(
                            color: const Color(0xFFE8EEFF),
                            borderRadius: BorderRadius.circular(10),
                          ),

                          child: Text(
                            item["vehicleType"] ?? "-",
                            style: const TextStyle(
                              color: Color(0xFF3F51F5),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 15),

                    Row(
                      children: [
                        const Icon(Icons.phone, size: 18, color: Colors.grey),

                        const SizedBox(width: 8),

                        Expanded(
                          child: Text(
                            item["phoneNumber"]?.toString() ?? "-",
                            style: const TextStyle(fontWeight: FontWeight.w500),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    Row(
                      children: [
                        const Icon(
                          Icons.schedule,
                          size: 18,
                          color: Colors.grey,
                        ),

                        const SizedBox(width: 6),

                        Expanded(
                          child: Text(
                            formatDateTime(item["startTime"]?.toString()),
                            style: const TextStyle(fontWeight: FontWeight.w500),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    Align(
                      alignment: Alignment.centerRight,

                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),

                        decoration: BoxDecoration(
                          color: item["paymentStatus"] == "PAID"
                              ? Colors.green.shade100
                              : Colors.orange.shade100,

                          borderRadius: BorderRadius.circular(10),
                        ),

                        child: Text(
                          item["paymentStatus"] ?? "-",
                          style: TextStyle(
                            color: item["paymentStatus"] == "PAID"
                                ? Colors.green
                                : Colors.orange,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
