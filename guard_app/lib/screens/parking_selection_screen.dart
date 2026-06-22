import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'guard_main_screen.dart';

class ParkingSelectionScreen extends StatefulWidget {
  @override
  State<ParkingSelectionScreen> createState() =>
      _ParkingSelectionScreenState();
}

class _ParkingSelectionScreenState
    extends State<ParkingSelectionScreen> {

  List parkings = [];
  String? selectedParkingId;

  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadParkings();
  }

  Future<void> loadParkings() async {
    try {
      final res = await ApiService.getParkings();

      setState(() {
        parkings = res;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  Future<void> continueToDashboard() async {

    if (selectedParkingId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Select a parking location"),
        ),
      );
      return;
    }

    final selected = parkings.firstWhere(
      (p) => p["id"] == selectedParkingId,
    );

    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(
      "parkingId",
      selected["id"],
    );

    await prefs.setString(
      "parkingName",
      selected["name"],
    );

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => GuardMainScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: Text("Select Parking"),
      ),

      body: isLoading
          ? Center(
              child: CircularProgressIndicator(),
            )
          : Padding(
              padding: EdgeInsets.all(20),
              child: Column(
                children: [

                  DropdownButtonFormField<String>(
                    value: selectedParkingId,

                    items: parkings.map<DropdownMenuItem<String>>((p) {

                      return DropdownMenuItem<String>(
                        value: p["id"],
                        child: Text(
                          p["name"],
                        ),
                      );
                    }).toList(),

                    onChanged: (v) {
                      setState(() {
                        selectedParkingId = v;
                      });
                    },

                    decoration: InputDecoration(
                      labelText: "Parking Location",
                      border: OutlineInputBorder(),
                    ),
                  ),

                  SizedBox(height: 20),

                  ElevatedButton(
                    onPressed: continueToDashboard,
                    child: Text("Continue"),
                  ),
                ],
              ),
            ),
    );
  }
}