import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';

class TodayActivityScreen extends StatefulWidget {
  const TodayActivityScreen({super.key});

  @override
  State<TodayActivityScreen> createState() => _TodayActivityScreenState();
}

class _TodayActivityScreenState extends State<TodayActivityScreen> {
  final TextEditingController searchController = TextEditingController();

  List<dynamic> allActivity = [];
  List<dynamic> filteredActivity = [];

  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadActivity();
  }

  Future<void> loadActivity() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      String? parkingId = prefs.getString("parkingId");

      if (parkingId == null) return;

      final data = await ApiService.getTodayActivity(parkingId);

      if (!mounted) return;

      setState(() {
        allActivity = data;
        filteredActivity = data;
        loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        loading = false;
      });
    }
  }

  String formatTime(dynamic value) {
    try {
      final dt = DateTime.parse(value.toString());
      return DateFormat('hh:mm a').format(dt);
    } catch (e) {
      return value.toString();
    }
  }

  void search(String value) {
    setState(() {
      filteredActivity = allActivity.where((item) {
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
    final entries = filteredActivity
        .where((e) => e["type"] == "ENTRY")
        .toList();

    final exits = filteredActivity.where((e) => e["type"] == "EXIT").toList();

    return Scaffold(
      appBar: AppBar(title: const Text("Today's Activity")),

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
                  child: ListView(
                    padding: const EdgeInsets.all(12),

                    children: [
                       Text(
                        "ENTRY TODAY (${entries.length})",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 10),

                      ...entries.map(
                        (item) => Card(
                          child: ListTile(
                            leading: const Icon(
                              Icons.login,
                              color: Colors.green,
                            ),

                            title: Text(item["vehicleNumber"] ?? ""),

                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("Time: ${formatTime(item["time"])}"),

                                Text("Type: ${item["vehicleType"] ?? "-"}"),

                                Text("Source: ${item["bookingType"] ?? "-"}"),

                                Text("Phone: ${item["phoneNumber"] ?? "-"}"),
                              ],
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                       Text(
                        "EXIT TODAY (${exits.length})",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 10),

                      ...exits.map(
                        (item) => Card(
                          child: ListTile(
                            leading: const Icon(
                              Icons.logout,
                              color: Colors.red,
                            ),

                            title: Text(item["vehicleNumber"] ?? ""),

                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("Time: ${formatTime(item["time"])}"),

                                Text("Type: ${item["vehicleType"] ?? "-"}"),

                                Text("Source: ${item["bookingType"] ?? "-"}"),

                                Text("Phone: ${item["phoneNumber"] ?? "-"}"),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
