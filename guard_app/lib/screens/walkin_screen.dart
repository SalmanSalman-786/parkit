import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class WalkinScreen extends StatefulWidget {
  const WalkinScreen({Key? key}) : super(key: key);

  @override
  WalkinScreenState createState() => WalkinScreenState();
}

class WalkinScreenState extends State<WalkinScreen> {
  final vehicleController = TextEditingController();
  final mobileController = TextEditingController();

  String? parkingId;

  String vehicleType = "TWO_WHEELER";

  bool isLoading = false;
  bool isParkingLoading = true;

  String? token;

  List parkings = [];
  String? selectedParkingId;

  @override
  void initState() {
    super.initState();
    loadSelectedParking();
  }

  // 🔥 ERROR HANDLER
  void handleError(dynamic e) {
    if (!mounted) return;

    String msg = e.toString();

    if (msg.contains("SESSION_EXPIRED")) {
      showMsg("Session expired 🔐");
      Navigator.pop(context);
    } else {
      showMsg(msg);
    }
  }

  Future<void> loadSelectedParking() async {
    final prefs = await SharedPreferences.getInstance();

    parkingId = prefs.getString("parkingId");

    if (!mounted) return;

    setState(() {});
  }

  // 🔥 LOAD PARKINGS
  Future<void> loadParkings() async {
    try {
      final res = await ApiService.getParkings();

      if (!mounted) return;

      setState(() {
        parkings = res;
        isParkingLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() => isParkingLoading = false);
      handleError(e);
    }
  }

  // 🚀 SUBMIT WALK-IN
  Future<void> submit() async {
    if (isLoading) return; // 🔥 prevent double click

    FocusScope.of(context).unfocus();

    String vehicle = vehicleController.text.trim().toUpperCase().replaceAll(
      " ",
      "",
    );

    String mobile = mobileController.text.trim();

    // 🔐 VALIDATION
    if (vehicle.isEmpty || mobile.isEmpty) {
      showMsg("Enter all details");
      return;
    }

    if (!RegExp(r'^[0-9]{10}$').hasMatch(mobile)) {
      showMsg("Invalid mobile number");
      return;
    }

    setState(() => isLoading = true);

    try {
      final res = await ApiService.walkinEntry({
        "vehicleNumber": vehicle,
        "vehicleType": vehicleType,
        "phoneNumber": mobile,
        "parkingId": parkingId!,
      });

      if (!mounted) return;

      setState(() {
        token = res['bookingId'];
        isLoading = false;
      });

      showMsg("Entry Created ✅");

      // 🔥 CLEAR FORM
      vehicleController.clear();
      mobileController.clear();
      selectedParkingId = null;
    } catch (e) {
      if (!mounted) return;

      setState(() => isLoading = false);
      handleError(e);
    }
  }

  void showMsg(String msg) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  void dispose() {
    vehicleController.dispose();
    mobileController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,

        title: const Text(
          "Walk-In Entry",
          style: TextStyle(
            color: Color(0xFF2D3142),
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),

        iconTheme: const IconThemeData(color: Color(0xFF3F51F5)),
      ),

      body: Padding(
        padding: EdgeInsets.all(20),

        child: SingleChildScrollView(
          child: Column(
            children: [
              // 🚗 VEHICLE NUMBER
              Container(
                height: 180,

                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),

                  gradient: const LinearGradient(
                    colors: [Color(0xFF3F51F5), Color(0xFF00BCD4)],
                  ),
                ),

                child: Padding(
                  padding: const EdgeInsets.all(24),

                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,

                    children: const [
                      Icon(
                        Icons.person_add_alt_1,
                        color: Colors.white,
                        size: 40,
                      ),

                      SizedBox(height: 8),

                      Text(
                        "New Walk-In",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      SizedBox(height: 2),

                      Text(
                        "Register vehicle instantly",
                        style: TextStyle(color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              ),

              SizedBox(height: 15),
              Container(
                padding: const EdgeInsets.all(24),

                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),

                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),

                child: Column(
                  children: [
                    TextField(
                      controller: vehicleController,
                      textCapitalization: TextCapitalization.characters,
                      decoration: InputDecoration(
                        hintText: "KL 01 AB 1234",
                        prefixIcon: const Icon(Icons.directions_car),
                        filled: true,
                        fillColor: Colors.grey.shade100,

                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),

                    const SizedBox(height: 15),

                    TextField(
                      controller: mobileController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        hintText: "Enter Mobile Number",
                        prefixIcon: const Icon(Icons.phone),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),

                    const SizedBox(height: 15),

                    DropdownButtonFormField(
                      value: vehicleType,
                      items: [
                        DropdownMenuItem(
                          value: "TWO_WHEELER",
                          child: Text("Two Wheeler"),
                        ),
                        DropdownMenuItem(
                          value: "FOUR_WHEELER",
                          child: Text("Four Wheeler"),
                        ),
                      ],
                      onChanged: (val) {
                        setState(() => vehicleType = val.toString());
                      },
                      decoration: InputDecoration(
                        labelText: "Vehicle Type",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide.none,
                        ),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                      ),
                    ),
                  ],
                ),
              ),

              // 📱 MOBILE
              SizedBox(height: 15),

              // 🚘 VEHICLE TYPE
              SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3F51F5),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  onPressed: isLoading ? null : submit,
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "Create Entry",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),

              const SizedBox(height: 20),

              // 🎫 TOKEN DISPLAY
              if (token != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 15,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      const CircleAvatar(
                        radius: 28,
                        backgroundColor: Color(0xFFE8F5E9),
                        child: Icon(
                          Icons.check_circle,
                          color: Colors.green,
                          size: 32,
                        ),
                      ),

                      const SizedBox(height: 8),

                      const Text(
                        "ENTRY CREATED",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),

                      const SizedBox(height: 10),

                      Text(
                        token!,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF3F51F5),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
