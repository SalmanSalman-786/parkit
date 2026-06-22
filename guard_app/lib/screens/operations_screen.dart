import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'walkin_screen.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

class OperationsScreen extends StatefulWidget {
  const OperationsScreen({super.key});

  @override
  State<OperationsScreen> createState() => _OperationsScreenState();
}

class _OperationsScreenState extends State<OperationsScreen> {
  final TextEditingController vehicleController = TextEditingController();

  String parkingName = "";
  String? parkingId;
  bool isLoading = false;
  bool isActionLoading = false;

  String? currentBookingId;
  String? currentVehicleNumber;

  late Razorpay razorpay;

  Map<String, dynamic>? booking;

  double? currentAmount;
  double? currentFine;
  double? currentTotal;
  String? currentType;

  Future<void> showExitDialog(String vehicle) async {
    final preview = await ApiService.getExitPreview(vehicle, parkingId!);

    String type = preview["type"] ?? "";
    double amount = (preview["amount"] ?? 0).toDouble();
    double fine = (preview["fine"] ?? 0).toDouble();
    double total = (preview["total"] ?? 0).toDouble();

    // BOOKING + NO FINE
    if (type == "BOOKING" && fine <= 0) {
      final res = await ApiService.markExitByVehicle(
        vehicle,
        parkingId!,
        "PREPAID",
      );

      showMsg(
        "Exit Completed ✅\n"
        "Amount: ₹${res['amount']}",
      );

      vehicleController.clear();
      booking = null;

      return;
    }

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Payment Required"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Vehicle : ${preview["vehicleNumber"]}",
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 10),

            Text("Type : ${preview["type"]}"),

            const SizedBox(height: 10),

            Text("Parking Fee : ₹$amount"),

            Text("Fine : ₹$fine"),

            const Divider(),

            Text(
              "Total : ₹$total",
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text("CANCEL"),
          ),

          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);

              await ApiService.markExitByVehicle(vehicle, parkingId!, "CASH");
              vehicleController.clear();
              booking = null;

              double amount = (preview["amount"] ?? 0).toDouble();
              double fine = (preview["fine"] ?? 0).toDouble();
              double total = (preview["total"] ?? 0).toDouble();

              showDialog(
                context: context,
                builder: (_) => AlertDialog(
                  title: const Text("Receipt"),
                  content: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Vehicle : $vehicle"),
                      Text("Parking Fee : ₹$amount"),
                      Text("Fine : ₹$fine"),
                      const Divider(),
                      Text(
                        "Total Paid : ₹$total",
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const Text("Payment Mode : CASH"),
                    ],
                  ),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text("OK"),
                    ),
                  ],
                ),
              );
            },
            child: const Text("CASH"),
          ),

          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);

              currentBookingId = preview["bookingId"];

              currentVehicleNumber = vehicle;

              currentAmount = (preview["amount"] ?? 0).toDouble();

              currentFine = (preview["fine"] ?? 0).toDouble();

              currentTotal = (preview["total"] ?? 0).toDouble();

              currentType = preview["type"];

              await startExitPayment(currentBookingId!);
            },
            child: const Text("ONLINE"),
          ),
        ],
      ),
    );
  }

  void showMsg(String msg) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> handlePaymentSuccess(PaymentSuccessResponse response) async {
    try {
      bool verified = await ApiService.verifyExitPayment(
        bookingId: currentBookingId!,
        orderId: response.orderId!,
        paymentId: response.paymentId!,
        signature: response.signature!,
      );

      if (!verified) {
        showMsg("Payment verification failed");
        return;
      }

      await ApiService.markExitByVehicle(
        currentVehicleNumber!,
        parkingId!,
        "ONLINE",
      );

      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text("Payment Receipt"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Vehicle : $currentVehicleNumber"),
              Text("Booking : $currentBookingId"),
              Text("Type : $currentType"),

              const Divider(),

              Text("Parking Fee : ₹$currentAmount"),
              Text("Fine : ₹$currentFine"),

              const Divider(),

              Text(
                "Total Paid : ₹$currentTotal",
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),

              const Text("Payment Mode : ONLINE"),

              Text("Payment ID : ${response.paymentId}"),
              const Divider(),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text("OK"),
            ),
          ],
        ),
      );

      vehicleController.clear();

      booking = null;
    } catch (e) {
      showMsg("Payment verification failed");
    }
  }

  void handlePaymentError(PaymentFailureResponse response) {
    showMsg("Payment Failed");
  }

  void handleExternalWallet(ExternalWalletResponse response) {
    showMsg("External Wallet");
  }

  Future<void> startExitPayment(String bookingId) async {
    final order = await ApiService.createExitOrder(bookingId);

    var options = {
      "key": "rzp_test_SuM4awB90vRyr4",
      "amount": order["amount"],
      "name": "Parkit",
      "description": "Parking Payment",
      "order_id": order["id"],
    };

    razorpay.open(options);
  }

  void showDetailsDialog() {
    if (booking == null) return;

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Vehicle Details"),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("🚗 ${booking?['vehicleNumber'] ?? 'N/A'}"),

              Text("🚙 Type: ${booking?['vehicleType'] ?? 'N/A'}"),

              Text("📊 Status: ${booking?['status'] ?? 'N/A'}"),

              Text("💰 Fine: ₹${booking?['fineAmount'] ?? 0}"),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }

  @override
  void initState() {
    super.initState();

    loadParking();

    razorpay = Razorpay();

    razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, handlePaymentSuccess);

    razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, handlePaymentError);

    razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, handleExternalWallet);
  }

  Future<void> loadParking() async {
    final prefs = await SharedPreferences.getInstance();

    if (!mounted) return;

    setState(() {
      parkingName = prefs.getString("parkingName") ?? "";
      parkingId = prefs.getString("parkingId");
    });
  }

  Future<void> fetchBooking() async {
    FocusScope.of(context).unfocus();

    String vehicle = vehicleController.text.trim().toUpperCase().replaceAll(
      " ",
      "",
    );

    if (vehicle.isEmpty) {
      showMsg("Enter vehicle number");
      return;
    }

    setState(() => isLoading = true);

    try {
      final res = await ApiService.getBookingByVehicle(
        vehicleController.text,
        parkingId!,
      );
      if (!mounted) return;

      setState(() {
        booking = res;
        isLoading = false;
      });

      showDetailsDialog();
    } catch (e) {
      if (!mounted) return;

      setState(() {
        isLoading = false;
      });

      showMsg("Vehicle not found");
    }
  }

  Future<void> markEntry() async {
    setState(() {
      isActionLoading = true;
    });

    try {
      String vehicle = vehicleController.text.trim().toUpperCase().replaceAll(
        " ",
        "",
      );

      if (vehicle.isEmpty) {
        showMsg("Enter vehicle number");

        setState(() {
          isActionLoading = false;
        });

        return;
      }

      await ApiService.markEntryByVehicle(
        vehicleController.text.trim(),
        parkingId!,
      );

      showMsg("Entry marked ✅");

      vehicleController.clear();

      booking = null;
    } catch (e) {
      String msg = e.toString();

      msg = msg.replaceFirst("Exception: ", "");

      showMsg(msg);
    }

    if (!mounted) return;

    setState(() {
      isActionLoading = false;
    });
  }

  Future<void> markExit() async {
    setState(() {
      isActionLoading = true;
    });

    try {
      String vehicle = vehicleController.text.trim().toUpperCase().replaceAll(
        " ",
        "",
      );

      if (vehicle.isEmpty) {
        showMsg("Enter vehicle number");

        setState(() {
          isActionLoading = false;
        });

        return;
      }

      await showExitDialog(vehicle);
    } catch (e) {
      String msg = e.toString();
      msg = msg.replaceAll("Exception: ", "");
      showMsg(msg);
    }

    if (!mounted) return;

    setState(() {
      isActionLoading = false;
    });
  }

  @override
  void dispose() {
    razorpay.clear();

    vehicleController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,

        children: [
          Container(
            height: 180,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(25),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF3F51F5), Color(0xFF00BCD4)],
              ),
              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 15,
                  offset: Offset(0, 8),
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
                      const Icon(Icons.security, color: Colors.white, size: 42),

                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white24,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.local_parking,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  Text(
                    parkingName.isEmpty ? "Guard Terminal" : parkingName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 6),

                  const Text(
                    "Vehicle Entry & Exit Management",
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),
          Container(
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Vehicle Lookup",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),

                const SizedBox(height: 15),

                TextField(
                  controller: vehicleController,
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

                const SizedBox(height: 18),

                SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton.icon(
                    onPressed: isLoading ? null : fetchBooking,
                    icon: const Icon(Icons.search),
                    label: Text(isLoading ? "Loading..." : "Search Vehicle"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3F51F5),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 15),

          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: isActionLoading ? null : markEntry,
                  child: Container(
                    height: 120,
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
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        CircleAvatar(
                          radius: 22,
                          backgroundColor: Color(0xFFE8F5E9),
                          child: Icon(Icons.login, color: Colors.green),
                        ),

                        SizedBox(height: 10),

                        Text(
                          "ENTRY",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),

                        SizedBox(height: 4),

                        Text(
                          "Mark Entry",
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: GestureDetector(
                  onTap: isActionLoading ? null : markExit,
                  child: Container(
                    height: 120,
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
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        CircleAvatar(
                          radius: 22,
                          backgroundColor: Color(0xFFFFEBEE),
                          child: Icon(Icons.logout, color: Colors.red),
                        ),

                        SizedBox(height: 10),

                        Text(
                          "EXIT",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),

                        SizedBox(height: 4),

                        Text(
                          "Mark Exit",
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 25),

          GestureDetector(
            onTap: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const WalkinScreen()),
              );
            },

            child: Container(
              height: 110,

              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),

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

                child: Row(
                  children: [
                    Container(
                      width: 55,
                      height: 55,

                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(15),
                      ),

                      child: const Icon(
                        Icons.person_add_alt_1,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),

                    const SizedBox(width: 15),

                    const Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,

                        children: [
                          Text(
                            "New Walk-In",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          SizedBox(height: 4),

                          Text(
                            "Register vehicle instantly",
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
