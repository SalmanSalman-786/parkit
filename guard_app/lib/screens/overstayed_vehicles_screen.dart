import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'vehicle_details_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OverstayedVehiclesScreen extends StatefulWidget {
  const OverstayedVehiclesScreen({super.key});

  @override
  State<OverstayedVehiclesScreen> createState() =>
      _OverstayedVehiclesScreenState();
}

class _OverstayedVehiclesScreenState extends State<OverstayedVehiclesScreen> {
  List vehicles = [];
  List filtered = [];

  bool loading = true;

  String? parkingId;

  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    final prefs = await SharedPreferences.getInstance();

    parkingId = prefs.getString("parkingId");

    if (parkingId == null) {
      setState(() {
        loading = false;
      });
      return;
    }

    try {
      final data = await ApiService.getOverstayedVehicles(parkingId!);

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

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Overstayed Vehicles")),

      body: loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(12),

                  child: TextField(
                    controller: searchController,

                    onChanged: search,

                    decoration: const InputDecoration(
                      hintText: "Search Vehicle Number",

                      prefixIcon: Icon(Icons.search),

                      border: OutlineInputBorder(),
                    ),
                  ),
                ),

                Expanded(
                  child: filtered.isEmpty
                      ? const Center(child: Text("No overstayed vehicles"))
                      : ListView.builder(
                          itemCount: filtered.length,

                          itemBuilder: (context, index) {
                            final item = filtered[index];

                            String severity = item["severity"] ?? "NORMAL";

                            Color borderColor;

                            if (severity == "RED") {
                              borderColor = Colors.red;
                            } else if (severity == "ORANGE") {
                              borderColor = Colors.orange;
                            } else {
                              borderColor = Colors.grey;
                            }

                            return Card(
                              margin: const EdgeInsets.all(8),
                              shape: RoundedRectangleBorder(
                                side: BorderSide(color: borderColor, width: 2),
                                borderRadius: BorderRadius.circular(12),
                              ),

                              child: ListTile(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) =>
                                          VehicleDetailsScreen(vehicle: item),
                                    ),
                                  );
                                },

                                leading: const Icon(
                                  Icons.warning,
                                  color: Colors.red,
                                ),

                                title: Text(item["vehicleNumber"] ?? ""),

                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,

                                  children: [
                                    Text(
                                      "Phone: ${item["phoneNumber"] ?? "-"}",
                                    ),

                                    Text("Fine: ₹${item["fineAmount"] ?? 0}"),

                                    Text(
                                      "Overdue: ${item["overdueMinutes"] ?? 0} min",
                                    ),
                                  ],
                                ),

                                trailing: Text(
                                  severity,
                                  style: TextStyle(
                                    color: borderColor,
                                    fontWeight: FontWeight.bold,
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
