import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // 🌐 BASE URL
  static String get baseUrl {
    if (kIsWeb) return "http://localhost:8080/api";
    return "http://10.0.2.2:8080/api";
  }

  //"http://10.0.2.2:8080/api";

  // 🔐 HEADERS
  static Future<Map<String, String>> getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    return {
      "Content-Type": "application/json",
      if (token != null) "Authorization": "Bearer $token",
    };
  }

  // 🔥 SAFE REQUEST (network + timeout)
  static Future<http.Response> safeRequest(
    Future<http.Response> request,
  ) async {
    try {
      return await request.timeout(const Duration(seconds: 10));
    } on SocketException {
      throw Exception("No internet connection ❌");
    } on HttpException {
      throw Exception("Server error ❌");
    } on FormatException {
      throw Exception("Invalid response ❌");
    }
  }

  // 🔥 RESPONSE HANDLER
  static Future<dynamic> handleResponse(http.Response res) async {
    if (res.statusCode == 401) {
      await logout();
      throw Exception("SESSION_EXPIRED");
    }

    if (res.statusCode >= 400) {
      try {
        final body = jsonDecode(res.body);

        final msg = body["message"] ?? "Something went wrong";

        throw Exception(msg);
      } catch (e) {
        throw Exception(
          res.body.isNotEmpty ? res.body : "Error ${res.statusCode}",
        );
      }
    }

    if (res.body.isEmpty) return null;

    try {
      return jsonDecode(res.body);
    } catch (_) {
      return res.body; // ✅ handles "Entry marked"
    }
  }

  // 🔐 LOGOUT
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  static List<dynamic> parseList(dynamic data) {
    if (data == null) return [];
    return data is List ? data : [];
  }

  // 🔐 LOGIN
  static Future<Map<String, dynamic>> guardLogin(   // login m1
    String username,
    String password,
  ) async {
    final res = await safeRequest(
      http.post(
        Uri.parse("$baseUrl/auth/guard/login"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"username": username, "password": password}),
      ),
    );

    final data = await handleResponse(res);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("token", data["token"]);
    await prefs.setString("role", data["role"]);

    return data;
  }

  // 🔍 BOOKING DETAILS
  static Future<Map<String, dynamic>> getBookingDetails(String id) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/details/$id"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  // 🚓 ENTRY
  static Future<void> markEntry(String id) async {
    final res = await safeRequest(
      http.put(
        Uri.parse("$baseUrl/booking/entry/$id"),
        headers: await getHeaders(),
      ),
    );

    // 🔥 FIX
    if (res.statusCode != 200) {
      throw Exception("Failed to mark entry");
    }
  }

  // 🚪 EXIT
  static Future<Map<String, dynamic>> markExit(String id) async {
    final res = await safeRequest(
      http.put(
        Uri.parse("$baseUrl/booking/exit/$id"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  // 🚗 ACTIVE BOOKINGS
  static Future<List<dynamic>> getActiveBookings() async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/active"),
        headers: await getHeaders(),
      ),
    );

    return parseList(await handleResponse(res));
  }

  // 🚶 ACTIVE WALKINS (🔥 NEW)
  static Future<List<dynamic>> getActiveWalkins(String parkingId) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/walkin/active/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return parseList(await handleResponse(res));
  }

  // ⏳ OVERTIME
  static Future<List<dynamic>> getOvertimeBookings() async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/overtime"),
        headers: await getHeaders(),
      ),
    );

    return parseList(await handleResponse(res));
  }

  static Future<List<dynamic>> getOverstayedVehicles(String parkingId) async {   // monitoring screen m4 + overstayed screen m1
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/overstayed/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return parseList(await handleResponse(res));
  }

  static Future<List<dynamic>> getNotEnteredBookings(String parkingId) async {   // not entered screen m1
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/not-entered/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return parseList(await handleResponse(res));
  }

  // 🚶 WALK-IN ENTRY
  static Future<Map<String, dynamic>> walkinEntry(    // walkin screen m2
    Map<String, String> data,
  ) async {
    final res = await safeRequest(
      http.post(
        Uri.parse("$baseUrl/booking/walkin/entry"),
        headers: await getHeaders(),
        body: jsonEncode(data),
      ),
    );

    return await handleResponse(res);
  }

  // 🅿️ PARKINGS
  static Future<List<dynamic>> getParkings() async {   // parking selection m1 + walkin screen m1
    final res = await safeRequest(
      http.get(Uri.parse("$baseUrl/parking"), headers: await getHeaders()),
    );

    return parseList(await handleResponse(res));
  }

  // 🔍 VEHICLE SEARCH
  static Future<Map<String, dynamic>> getByVehicle(String vehicle) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/vehicle/$vehicle"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<void> markEntryByVehicle(     // operations m8
    String vehicle,
    String parkingId,
  ) async {
    final res = await safeRequest(
      http.put(
        Uri.parse("$baseUrl/booking/entry/vehicle/$vehicle/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    await handleResponse(res);
  }

  static Future<dynamic> createFineOrder(String bookingId) async {
    final res = await safeRequest(
      http.post(
        Uri.parse("$baseUrl/payment/create-fine-order?bookingId=$bookingId"),
        headers: await getHeaders(),
      ),
    );

    return handleResponse(res);
  }

  static Future<dynamic> markExitByVehicle(     // operations screen m2 , m3 , m5
    String vehicleNumber,
    String parkingId,
    String mode,
  ) async {
    final res = await safeRequest(
      http.put(
        Uri.parse(
          "$baseUrl/booking/exit/vehicle/$vehicleNumber/$parkingId/$mode",
        ),
        headers: await getHeaders(),
      ),
    );

    return handleResponse(res);
  }

  static Future<dynamic> getBookingByVehicle( // operations screen m7
    String vehicle,
    String parkingId,
  ) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/details/vehicle/$vehicle/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return handleResponse(res);
  }

  static Future<String?> getSelectedParkingId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("parkingId");
  }

  static Future<Map<String, dynamic>> getGuardDashboard(    // monitoring screen m3
    String parkingId,
  ) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/dashboard/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<Map<String, dynamic>> getCapacity(String parkingId) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/capacity/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<List<dynamic>> getUpcomingArrivals(String parkingId) async {    // monitoring screen m5
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/upcoming/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return List<dynamic>.from(await handleResponse(res));
  }

  static Future<List<dynamic>> getLogs(String parkingId) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/logs/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return List<dynamic>.from(await handleResponse(res));
  }

  static Future<Map<String, dynamic>> getRevenue(String parkingId) async {  // monitoring screen m2
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/revenue/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<Map<String, dynamic>> getWalkinStats(String parkingId) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/walkin/stats/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<List<dynamic>> getTodayActivity(String parkingId) async {    // monitoring screen m6  +  today activity m1
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/activity/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<List<dynamic>> getTodayBookings(String parkingId) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/bookings/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<bool> verifyExitPayment({    //monitoring screen m4
    required String bookingId,
    required String orderId,
    required String paymentId,
    required String signature,
  }) async {
    final res = await safeRequest(
      http.post(
        Uri.parse(
          "$baseUrl/payment/verify-exit-payment"
          "?bookingId=$bookingId"
          "&orderId=$orderId"
          "&paymentId=$paymentId"
          "&signature=$signature",
        ),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<bool> verifyFinePayment({
    required String bookingId,
    required String orderId,
    required String paymentId,
    required String signature,
  }) async {
    final res = await safeRequest(
      http.post(
        Uri.parse(
          "$baseUrl/payment/verify-fine-payment"
          "?bookingId=$bookingId"
          "&orderId=$orderId"
          "&paymentId=$paymentId"
          "&signature=$signature",
        ),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<List<dynamic>> getInsideVehicles(   // inside vehicles m1
    String parkingId,
    String vehicleType,
    String sourceType,
  ) async {
    final res = await safeRequest(
      http.get(
        Uri.parse(
          "$baseUrl/guard/inside"
          "?parkingId=$parkingId"
          "&vehicleType=$vehicleType"
          "&sourceType=$sourceType",
        ),
        headers: await getHeaders(),
      ),
    );

    return parseList(await handleResponse(res));
  }

  static Future<Map<String, dynamic>> getRevenueDetails(   // Revenue Details m1
    String parkingId,
  ) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/revenue-details/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<Map<String, dynamic>> getExitPreview(   // operations screen m1
    String vehicleNumber,
    String parkingId,
  ) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/exit-preview/$vehicleNumber/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<Map<String, dynamic>> createExitOrder(String bookingId) async {   // operations screen m6
    final res = await safeRequest(
      http.post(
        Uri.parse(
          "$baseUrl/payment/create-exit-order"
          "?bookingId=$bookingId",
        ),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<Map<String, dynamic>> getCapacityBreakdown(   // monitoring screen m1
    String parkingId,
  ) async {
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/guard/capacity-breakdown/$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }

  static Future<List<dynamic>> getLongStayWalkins(String parkingId) async {    // longstaywalkins m1  + monitoring screen m7
    final res = await safeRequest(
      http.get(
        Uri.parse("$baseUrl/booking/long-stay-walkins?parkingId=$parkingId"),
        headers: await getHeaders(),
      ),
    );

    return await handleResponse(res);
  }
}
