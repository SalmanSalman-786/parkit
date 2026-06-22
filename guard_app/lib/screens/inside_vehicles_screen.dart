import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'vehicle_details_screen.dart';
import 'package:intl/intl.dart';

class InsideVehiclesScreen extends StatefulWidget {
  final String vehicleType;
  final String title;
  final String sourceType;

  const InsideVehiclesScreen({
    super.key,
    required this.vehicleType,
    required this.title,
    required this.sourceType,
  });

  @override
  State<InsideVehiclesScreen> createState() => _InsideVehiclesScreenState();
}

class _InsideVehiclesScreenState extends State<InsideVehiclesScreen> {
  List vehicles = [];
  List filtered = [];

  bool loading = true;

  final searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    loadData();
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

  Future<void> loadData() async {
    final prefs = await SharedPreferences.getInstance();

    String? parkingId = prefs.getString("parkingId");

    if (parkingId == null) return;

    final data = await ApiService.getInsideVehicles(
      parkingId,
      widget.vehicleType,
      widget.sourceType,
    );
    if (!mounted) return;

    setState(() {
      vehicles = data;
      filtered = data;
      loading = false;
    });
  }

  void search(String value) {
    setState(() {
      filtered = vehicles.where((v) {
        String vehicle = (v["vehicleNumber"] ?? "").toString().toLowerCase();

        return vehicle.contains(value.toLowerCase());
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,

        title: Text(
          widget.title,
          style: const TextStyle(
            color: Color(0xFF2D3142),
            fontSize: 22,
            fontWeight: FontWeight.bold,
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

                  height: 190,

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
                              Icons.directions_car,
                              color: Colors.white,
                              size: 40,
                            ),

                            Container(
                              padding: const EdgeInsets.all(10),

                              decoration: BoxDecoration(
                                color: Colors.white24,
                                borderRadius: BorderRadius.circular(12),
                              ),

                              child: const Icon(
                                Icons.list_alt,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 18),

                        Text(
                          widget.title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 4),

                        Text(
                          "${filtered.length} Active Vehicles",
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 15),

                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),

                  child: Container(
                    padding: const EdgeInsets.all(20),

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

                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,

                      children: [
                        const Text(
                          "Vehicle Search",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),

                        const SizedBox(height: 15),

                        TextField(
                          controller: searchController,
                          onChanged: search,

                          decoration: InputDecoration(
                            hintText: "Search vehicle number",

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

                const SizedBox(height: 15),

                Expanded(
                  child: filtered.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,

                            children: [
                              Icon(
                                Icons.search_off,
                                size: 70,
                                color: Colors.grey.shade400,
                              ),

                              const SizedBox(height: 15),

                              const Text(
                                "No vehicles found",
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 6),

                              Text(
                                "Try another vehicle number",
                                style: TextStyle(color: Colors.grey.shade600),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          itemCount: filtered.length,

                          itemBuilder: (context, index) {
                            final item = filtered[index];
                            final fine =
                                double.tryParse("${item["fineAmount"] ?? 0}") ??
                                0;

                            return GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        VehicleDetailsScreen(vehicle: item),
                                  ),
                                );
                              },

                              child: Container(
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
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,

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

                                              borderRadius:
                                                  BorderRadius.circular(12),
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

                                          const Icon(
                                            Icons.arrow_forward_ios,
                                            color: Colors.grey,
                                            size: 18,
                                          ),
                                        ],
                                      ),

                                      const SizedBox(height: 15),

                                      Row(
                                        children: [
                                          const Icon(Icons.phone, size: 18),
                                          const SizedBox(width: 8),

                                          Expanded(
                                            child: Text(
                                              item["phoneNumber"] ?? "-",
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 10,
                                              vertical: 5,
                                            ),

                                            decoration: BoxDecoration(
                                              color:
                                                  widget.sourceType == "BOOKING"
                                                  ? Colors.orange.shade100
                                                  : Colors.blue.shade100,

                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),

                                            child: Text(
                                              widget.sourceType,
                                              style: TextStyle(
                                                color:
                                                    widget.sourceType ==
                                                        "BOOKING"
                                                    ? Colors.orange.shade800
                                                    : Colors.blue.shade800,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 11,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),

                                      const SizedBox(height: 8),

                                      Row(
                                        children: [
                                          const Icon(
                                            Icons.directions_car,
                                            size: 18,
                                          ),
                                          const SizedBox(width: 8),

                                          Expanded(
                                            child: Text(
                                              item["vehicleType"] ?? "-",
                                            ),
                                          ),
                                        ],
                                      ),

                                      const SizedBox(height: 8),

                                      Row(
                                        children: [
                                          const Icon(
                                            Icons.access_time,
                                            size: 18,
                                          ),
                                          const SizedBox(width: 8),

                                          Expanded(
                                            child: Text(
                                              formatDateTime(
                                                item["entryTime"]?.toString(),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),

                                      if (widget.sourceType == "BOOKING") ...[
                                        const SizedBox(height: 8),

                                        Row(
                                          children: [
                                            const Icon(
                                              Icons.payments,
                                              size: 18,
                                            ),
                                            const SizedBox(width: 8),
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal: 10,
                                                    vertical: 4,
                                                  ),
                                              decoration: BoxDecoration(
                                                color: Colors.green.shade100,
                                                borderRadius:
                                                    BorderRadius.circular(8),
                                              ),
                                              child: Text(
                                                item["paymentStatus"] ?? "-",
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),

                                        const SizedBox(height: 8),

                                        Row(
                                          children: [
                                            const Icon(Icons.event, size: 18),
                                            const SizedBox(width: 8),

                                            Expanded(
                                              child: Text(
                                                formatDateTime(
                                                  item["expectedExitTime"]
                                                      ?.toString(),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],

                                      const SizedBox(height: 12),

                                      const SizedBox(height: 12),

                                      Align(
                                        alignment: Alignment.centerRight,
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.red.shade50,
                                            borderRadius: BorderRadius.circular(
                                              10,
                                            ),
                                          ),
                                          child: Text(
                                            fine <= 0
                                                ? "No Fine"
                                                : "Fine ₹${fine.toStringAsFixed(0)}",
                                            style: TextStyle(
                                              color: fine <= 0
                                                  ? Colors.green.shade700
                                                  : Colors.red.shade700,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
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
