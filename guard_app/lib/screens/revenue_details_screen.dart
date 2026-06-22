import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';

class RevenueDetailsScreen extends StatefulWidget {
  const RevenueDetailsScreen({super.key});

  @override
  State<RevenueDetailsScreen> createState() => _RevenueDetailsScreenState();
}

class _RevenueDetailsScreenState extends State<RevenueDetailsScreen> {
  bool loading = true;

  List revenueList = [];
  List filteredList = [];

  String selectedFilter = "ALL";

  double cashCollection = 0;
  double onlineCollection = 0;
  double totalCollection = 0;

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
      final data = await ApiService.getRevenueDetails(parkingId);

      if (!mounted) return;

      setState(() {
        cashCollection = (data["cashCollection"] ?? 0).toDouble();

        onlineCollection = (data["onlineCollection"] ?? 0).toDouble();

        totalCollection = (data["totalCollection"] ?? 0).toDouble();

        revenueList = data["transactions"] ?? [];

        filteredList = data["transactions"] ?? [];

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
      filteredList = revenueList.where((item) {
        bool matchesFilter = true;

        if (selectedFilter == "CASH" || selectedFilter == "ONLINE") {
          matchesFilter =
              (item["paymentMode"] ?? "").toString().toUpperCase() ==
              selectedFilter;
        } else if (selectedFilter == "BOOKING" || selectedFilter == "WALKIN") {
          matchesFilter =
              (item["type"] ?? "").toString().toUpperCase() == selectedFilter;
        }

        String vehicle = (item["vehicleNumber"] ?? "").toString().toLowerCase();

        String booking = (item["bookingId"] ?? "").toString().toLowerCase();

        bool matchesSearch =
            vehicle.contains(value.toLowerCase()) ||
            booking.contains(value.toLowerCase());

        return matchesFilter && matchesSearch;
      }).toList();
    });
  }

  void applyFilter(String filter) {
    setState(() {
      selectedFilter = filter;

      filteredList = revenueList.where((item) {
        if (filter == "ALL") {
          return true;
        }

        if (filter == "CASH" || filter == "ONLINE") {
          return (item["paymentMode"] ?? "").toString().toUpperCase() == filter;
        }

        return (item["type"] ?? "").toString().toUpperCase() == filter;
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

  Widget summaryCard(String title, String value) {
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
        padding: const EdgeInsets.all(12),

        child: Column(
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),

            const SizedBox(height: 8),

            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF3F51F5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,

        title: const Text(
          "Revenue Details",
          style: TextStyle(
            color: Color(0xFF2D3142),
            fontWeight: FontWeight.bold,
            fontSize: 22,
          ),
        ),

        iconTheme: const IconThemeData(color: Color(0xFF3F51F5)),
      ),

      body: SafeArea(
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.all(16),

              height: 160,

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
                          Icons.account_balance_wallet,
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
                            Icons.currency_rupee,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    const Text(
                      "Revenue Dashboard",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 6),

                    Row(
                      children: [
                        Text(
                          "Revenue ₹${totalCollection.toStringAsFixed(0)}",
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 14,
                          ),
                        ),

                        const Spacer(),

                        Text(
                          "${filteredList.length} Txns",
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: summaryCard(
                      "Cash",
                      "₹${cashCollection.toStringAsFixed(0)}",
                    ),
                  ),

                  const SizedBox(width: 12),

                  Expanded(
                    child: summaryCard(
                      "Online",
                      "₹${onlineCollection.toStringAsFixed(0)}",
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),

              child: Container(
                padding: const EdgeInsets.all(12),

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
                      "Filters",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 2),

                    Wrap(
                      spacing: 8,
                      runSpacing: 8,

                      children: [
                        FilterChip(
                          label: const Text("All"),
                          selected: selectedFilter == "ALL",
                          selectedColor: const Color(0xFFE8EEFF),
                          checkmarkColor: const Color(0xFF3F51F5),
                          onSelected: (_) => applyFilter("ALL"),
                        ),

                        FilterChip(
                          label: const Text("Cash"),
                          selected: selectedFilter == "CASH",
                          selectedColor: const Color(0xFFE8EEFF),
                          checkmarkColor: const Color(0xFF3F51F5),
                          onSelected: (_) => applyFilter("CASH"),
                        ),

                        FilterChip(
                          label: const Text("Online"),
                          selected: selectedFilter == "ONLINE",
                          selectedColor: const Color(0xFFE8EEFF),
                          checkmarkColor: const Color(0xFF3F51F5),
                          onSelected: (_) => applyFilter("ONLINE"),
                        ),

                        FilterChip(
                          label: const Text("Booking"),
                          selected: selectedFilter == "BOOKING",
                          selectedColor: const Color(0xFFE8EEFF),
                          checkmarkColor: const Color(0xFF3F51F5),
                          onSelected: (_) => applyFilter("BOOKING"),
                        ),

                        FilterChip(
                          label: const Text("Walk-in"),
                          selected: selectedFilter == "WALKIN",
                          selectedColor: const Color(0xFFE8EEFF),
                          checkmarkColor: const Color(0xFF3F51F5),
                          onSelected: (_) => applyFilter("WALKIN"),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),

              child: Container(
                padding: const EdgeInsets.all(10),

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
                      "Transaction Search",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 6),

                    TextField(
                      controller: searchController,
                      onChanged: search,

                      decoration: InputDecoration(
                        hintText: "Vehicle Number / Booking ID",

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

            Expanded(
              child: filteredList.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.receipt_long,
                            size: 70,
                            color: Colors.grey.shade400,
                          ),

                          const SizedBox(height: 15),

                          const Text(
                            "No Revenue Data",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          const SizedBox(height: 6),

                          Text(
                            "Transactions will appear here",
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: filteredList.length,

                      itemBuilder: (context, index) {
                        final item = filteredList[index];
                        final fine =
                            double.tryParse("${item["fine"] ?? 0}") ?? 0;

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

                                        borderRadius: BorderRadius.circular(12),
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

                                    Text(
                                      "₹${item["total"] ?? 0}",
                                      style: const TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF3F51F5),
                                      ),
                                    ),
                                  ],
                                ),

                                const SizedBox(height: 12),

                                Wrap(
                                  spacing: 8,

                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 5,
                                      ),

                                      decoration: BoxDecoration(
                                        color:
                                            (item["type"] ?? "")
                                                    .toString()
                                                    .toUpperCase() ==
                                                "BOOKING"
                                            ? Colors.blue.shade100
                                            : Colors.purple.shade100,
                                        borderRadius: BorderRadius.circular(8),
                                      ),

                                      child: Text(
                                        item["type"] ?? "-",
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color:
                                              (item["type"] ?? "")
                                                      .toString()
                                                      .toUpperCase() ==
                                                  "BOOKING"
                                              ? Colors.blue.shade800
                                              : Colors.purple.shade800,
                                        ),
                                      ),
                                    ),

                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 5,
                                      ),

                                      decoration: BoxDecoration(
                                        color:
                                            (item["paymentMode"] ?? "")
                                                    .toString()
                                                    .toUpperCase() ==
                                                "ONLINE"
                                            ? Colors.green.shade100
                                            : Colors.orange.shade100,

                                        borderRadius: BorderRadius.circular(8),
                                      ),

                                      child: Text(
                                        item["paymentMode"] ?? "-",
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color:
                                              (item["paymentMode"] ?? "")
                                                      .toString()
                                                      .toUpperCase() ==
                                                  "ONLINE"
                                              ? Colors.green.shade800
                                              : Colors.orange.shade800,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),

                                const SizedBox(height: 12),

                                Row(
                                  children: [
                                    const Icon(
                                      Icons.confirmation_number_outlined,
                                      size: 18,
                                      color: Colors.grey,
                                    ),
                                    const SizedBox(width: 6),

                                    Expanded(
                                      child: Text(item["bookingId"] ?? "-"),
                                    ),
                                  ],
                                ),

                                const SizedBox(height: 4),

                                Row(
                                  children: [
                                    const Icon(
                                      Icons.currency_rupee,
                                      size: 18,
                                      color: Colors.green,
                                    ),
                                    const SizedBox(width: 6),

                                    Text("Amount ₹${item["amount"] ?? 0}"),
                                  ],
                                ),

                                const SizedBox(height: 4),

                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 6,
                                  ),

                                  decoration: BoxDecoration(
                                    color: fine > 0
                                        ? Colors.red.shade50
                                        : Colors.green.shade50,

                                    borderRadius: BorderRadius.circular(8),
                                  ),

                                  child: Text(
                                    fine > 0
                                        ? "Fine ₹${fine.toStringAsFixed(0)}"
                                        : "No Fine",

                                    style: TextStyle(
                                      color: fine > 0
                                          ? Colors.red.shade700
                                          : Colors.green.shade700,

                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),

                                const SizedBox(height: 10),

                                Text(
                                  formatDate(item["time"]),
                                  style: TextStyle(color: Colors.grey.shade600),
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
      ),
    );
  }
}
