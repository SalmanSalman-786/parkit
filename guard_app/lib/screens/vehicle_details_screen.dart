import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class VehicleDetailsScreen extends StatelessWidget {
  final Map vehicle;

  const VehicleDetailsScreen({
    super.key,
    required this.vehicle,
  });

  String formatDateTime(dynamic value) {
    if (value == null) return "-";

    try {
      final dt = DateTime.parse(value.toString());

      return DateFormat(
        'dd MMM yyyy • hh:mm a',
      ).format(dt);
    } catch (e) {
      return value.toString();
    }
  }

  Widget buildDetailTile(
    String title,
    String value,
    IconData icon,
  ) {
    return Card(
      child: ListTile(
        leading: Icon(icon),

        title: Text(title),

        subtitle: Text(
          value.isEmpty ? "-" : value,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Vehicle Details",
        ),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),

        child: Column(
          children: [

            Card(
              elevation: 3,

              child: Padding(
                padding: const EdgeInsets.all(20),

                child: Column(
                  children: [
                    const Icon(
                      Icons.directions_car,
                      size: 60,
                    ),

                    const SizedBox(height: 10),

                    Text(
                      vehicle["vehicleNumber"] ?? "-",
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 15),

            buildDetailTile(
              "Phone Number",
              vehicle["phone"] ??
                  vehicle["phoneNumber"] ??
                  "-",
              Icons.phone,
            ),

            buildDetailTile(
              "Source",
              vehicle["type"] ?? "-",
              Icons.category,
            ),

            buildDetailTile(
              "Vehicle Type",
              vehicle["vehicleType"] ?? "-",
              Icons.directions_car,
            ),

            buildDetailTile(
              "Entry Time",
              formatDateTime(
                vehicle["entryTime"],
              ),
              Icons.login,
            ),

            buildDetailTile(
              "Expected Exit",
              formatDateTime(
                vehicle["expectedExitTime"] ??
                    vehicle["endTime"],
              ),
              Icons.schedule,
            ),

            buildDetailTile(
              "Fine Amount",
              "₹${vehicle["fineAmount"] ?? 0}",
              Icons.currency_rupee,
            ),

            buildDetailTile(
              "Parking",
              vehicle["parkingName"] ?? "-",
              Icons.local_parking,
            ),
          ],
        ),
      ),
    );
  }
}