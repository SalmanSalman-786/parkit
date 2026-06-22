import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'vehicle_details_screen.dart';

class LongStayWalkinsScreen extends StatefulWidget {
  const LongStayWalkinsScreen({super.key});

  @override
  State<LongStayWalkinsScreen> createState() =>
      _LongStayWalkinsScreenState();
}

class _LongStayWalkinsScreenState
    extends State<LongStayWalkinsScreen> {
  List vehicles = [];
  List filtered = [];

  bool loading = true;

  String? parkingId;

  final TextEditingController searchController =
      TextEditingController();

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
      final data =
          await ApiService.getLongStayWalkins(
        parkingId!,
      );

      if (!mounted) return;

      data.sort((a, b) {
        return (b["hoursInside"] ?? 0)
            .compareTo(a["hoursInside"] ?? 0);
      });

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
        String vehicle =
            (item["vehicleNumber"] ?? "")
                .toString()
                .toLowerCase();

        return vehicle.contains(
          value.toLowerCase(),
        );
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
      appBar: AppBar(
        title: const Text(
          "Long Stay Walk-ins",
        ),
      ),
      body: loading
          ? const Center(
              child:
                  CircularProgressIndicator(),
            )
          : Column(
              children: [
                Padding(
                  padding:
                      const EdgeInsets.all(12),
                  child: TextField(
                    controller:
                        searchController,
                    onChanged: search,
                    decoration:
                        const InputDecoration(
                      hintText:
                          "Search Vehicle Number",
                      prefixIcon:
                          Icon(Icons.search),
                      border:
                          OutlineInputBorder(),
                    ),
                  ),
                ),
                Expanded(
                  child: filtered.isEmpty
                      ? const Center(
                          child: Text(
                            "No long stay walk-ins",
                          ),
                        )
                      : ListView.builder(
                          itemCount:
                              filtered.length,
                          itemBuilder:
                              (context, index) {
                            final item =
                                filtered[index];

                            int hoursInside =
                                item["hoursInside"] ??
                                    0;

                            Color borderColor =
                                hoursInside >= 24
                                    ? Colors.red
                                    : Colors.orange;

                            return Card(
                              margin:
                                  const EdgeInsets
                                      .all(8),
                              shape:
                                  RoundedRectangleBorder(
                                side: BorderSide(
                                  color:
                                      borderColor,
                                  width: 2,
                                ),
                                borderRadius:
                                    BorderRadius
                                        .circular(
                                            12),
                              ),
                              child: ListTile(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) =>
                                          VehicleDetailsScreen(
                                        vehicle:
                                            item,
                                      ),
                                    ),
                                  );
                                },
                                leading: Icon(
                                  Icons.access_time,
                                  color:
                                      borderColor,
                                ),
                                title: Text(
                                  item["vehicleNumber"] ??
                                      "",
                                ),
                                subtitle:
                                    Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment
                                          .start,
                                  children: [
                                    Text(
                                      "Phone: ${item["phoneNumber"] ?? "-"}",
                                    ),
                                    Text(
                                      "Hours Inside: $hoursInside",
                                    ),
                                  ],
                                ),
                                trailing: Text(
                                  hoursInside >= 24
                                      ? "RED"
                                      : "ORANGE",
                                  style:
                                      TextStyle(
                                    color:
                                        borderColor,
                                    fontWeight:
                                        FontWeight
                                            .bold,
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