import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class NotEnteredScreen extends StatefulWidget {
  const NotEnteredScreen({super.key});

  @override
  State<NotEnteredScreen> createState() => _NotEnteredScreenState();
}

class _NotEnteredScreenState extends State<NotEnteredScreen> {
  List vehicles = [];
  List filtered = [];

  bool loading = true;

  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    final prefs = await SharedPreferences.getInstance();

    String? parkingId = prefs.getString("parkingId");

    if (parkingId == null) {
      setState(() {
        loading = false;
      });
      return;
    }

    try {
      final data = await ApiService.getNotEnteredBookings(parkingId);

      if (!mounted) return;

      setState(() {
        vehicles = data;
        filtered = data;
        loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        loading = false;
      });
    }
  }

  void search(String value) {
    setState(() {
      filtered = vehicles.where((item) {
        String vehicle = (item["vehicleNumber"] ?? "").toString().toLowerCase();

        return vehicle.contains(value.toLowerCase());
      }).toList();
    });
  }

  String formatDate(dynamic value) {
    if (value == null) return "-";

    try {
      return DateFormat(
        "dd MMM yyyy • hh:mm a",
      ).format(DateTime.parse(value.toString()));
    } catch (e) {
      return value.toString();
    }
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,

        title: const Text(
          "Not Entered Vehicles",
          style: TextStyle(
            color: Color(0xFF2D3142),
            fontWeight: FontWeight.bold,
            fontSize: 22,
          ),
        ),

        iconTheme: const IconThemeData(color: Color(0xFF3F51F5)),
      ),

      body: loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Container(
                  margin: const EdgeInsets.all(16),

                  height: 170,

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
                            const Icon(
                              Icons.hourglass_empty,
                              color: Colors.white,
                              size: 42,
                            ),

                            Container(
                              padding: const EdgeInsets.all(10),

                              decoration: BoxDecoration(
                                color: Colors.white24,
                                borderRadius: BorderRadius.circular(12),
                              ),

                              child: const Icon(
                                Icons.warning_amber_rounded,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 14),

                        const SizedBox(height: 14),

                        const Text(
                          "Not Entered Vehicles",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 6),

                        const Text(
                          "Delayed beyond grace period",
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),

                        const SizedBox(height: 6),

                        Text(
                          "${filtered.length} Vehicles",
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),

                  child: Container(
                    padding: const EdgeInsets.all(18),

                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),

                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),

                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,

                      children: [
                        const Text(
                          "Vehicle Search",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 12),

                        TextField(
                          controller: searchController,
                          onChanged: search,

                          decoration: InputDecoration(
                            hintText: "Search Vehicle Number",

                            prefixIcon: const Icon(Icons.search),

                            filled: true,
                            fillColor: Colors.grey.shade100,

                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                Expanded(
                  child: filtered.isEmpty
                      ? const Center(child: Text("No vehicles found"))
                      : ListView.builder(
                          itemCount: filtered.length,

                          itemBuilder: (context, index) {
                            final item = filtered[index];

                            return Container(
                              margin: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 6,
                              ),

                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(22),

                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.08),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),

                              child: Padding(
                                padding: const EdgeInsets.all(18),

                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,

                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,

                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 14,
                                            vertical: 8,
                                          ),

                                          decoration: BoxDecoration(
                                            gradient: const LinearGradient(
                                              colors: [
                                                Color(0xFF3F51F5),
                                                Color(0xFF00BCD4),
                                              ],
                                            ),

                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                          ),

                                          child: Text(
                                            (item["vehicleNumber"] ?? "-")
                                                .toString()
                                                .toUpperCase(),

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
                                            color:
                                                (item["paymentStatus"] ?? "")
                                                        .toString()
                                                        .toUpperCase() ==
                                                    "PAID"
                                                ? Colors.green.shade100
                                                : Colors.orange.shade100,

                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                          ),

                                          child: Text(
                                            item["paymentStatus"] ?? "-",

                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              color:
                                                  (item["paymentStatus"] ?? "")
                                                          .toString()
                                                          .toUpperCase() ==
                                                      "PAID"
                                                  ? Colors.green.shade800
                                                  : Colors.orange.shade800,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 14),

                                    Row(
                                      children: [
                                        const Icon(
                                          Icons.phone,
                                          size: 18,
                                          color: Colors.grey,
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(
                                            item["phoneNumber"]?.toString() ??
                                                "-",
                                          ),
                                        ),
                                      ],
                                    ),

                                    const SizedBox(height: 10),

                                    Row(
                                      children: [
                                        const Icon(
                                          Icons.directions_car,
                                          size: 18,
                                          color: Colors.grey,
                                        ),
                                        const SizedBox(width: 8),
                                        Text(item["vehicleType"] ?? "-"),
                                      ],
                                    ),

                                    const SizedBox(height: 12),

                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 8,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.grey.shade100,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Row(
                                        children: [
                                          const Icon(
                                            Icons.schedule,
                                            size: 18,
                                            color: Colors.grey,
                                          ),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Text(
                                              formatDate(item["startTime"]),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),

                                    const SizedBox(height: 12),

                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 8,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.red.shade50,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            Icons.warning_amber_rounded,
                                            color: Colors.red.shade700,
                                            size: 18,
                                          ),
                                          const SizedBox(width: 6),
                                          Text(
                                            "NOT ENTERED",
                                            style: TextStyle(
                                              color: Colors.red.shade700,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}
