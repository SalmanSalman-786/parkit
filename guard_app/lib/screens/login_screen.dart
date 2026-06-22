import 'package:flutter/material.dart';
import 'package:guard_app/screens/guard_main_screen.dart';

import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  bool isLoading = false;

  // 🔐 LOGIN FUNCTION (FINAL VERSION)
  void login() async {
    FocusScope.of(context).unfocus(); // 🔥 close keyboard

    String username = usernameController.text.trim();
    String password = passwordController.text.trim();

    if (username.isEmpty || password.isEmpty) {
      showMsg("Enter username & password");
      return;
    }

    setState(() => isLoading = true);

    try {
      final res = await ApiService.guardLogin(username, password);

      if (!mounted) return; // 🔥 prevent crash
      setState(() => isLoading = false);

      // 🔥 ROLE CHECK
      if (res['role'] != "GUARD") {
        showMsg("Access denied ❌ Not a guard");
        return;
      }

      // 🔥 TOKEN CHECK (extra safety)
      if (res['token'] == null) {
        showMsg("Login failed ❌");
        return;
      }

      // ✅ SUCCESS
      final prefs = await SharedPreferences.getInstance();

      await prefs.setString("token", res["token"]);

      await prefs.setString("parkingId", res["assignedParkingId"] ?? "");

      await prefs.setString("parkingName", res["assignedParkingName"] ?? "");

      await prefs.setString("guardName", res["name"] ?? "");

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => GuardMainScreen()),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => isLoading = false);

      String msg = e.toString();

      if (msg.contains("SESSION_EXPIRED")) {
        showMsg("Session expired. Login again 🔐");
      } else if (msg.contains("401") || msg.contains("Invalid")) {
        showMsg("Invalid credentials ❌");
      } else {
        showMsg("Server error ⚠️ Try again");
      }
    }
  }

  void showMsg(String msg) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  void dispose() {
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Guard Login"), centerTitle: true),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.security, size: 80, color: Colors.blue),
            SizedBox(height: 20),

            // 👤 USERNAME
            TextField(
              controller: usernameController,
              textInputAction: TextInputAction.next,
              decoration: InputDecoration(
                labelText: "Username",
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person),
              ),
            ),

            SizedBox(height: 15),

            // 🔐 PASSWORD
            TextField(
              controller: passwordController,
              obscureText: true,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => login(),
              decoration: InputDecoration(
                labelText: "Password",
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock),
              ),
            ),

            SizedBox(height: 25),

            // 🚀 LOGIN BUTTON
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isLoading ? null : login,
                style: ElevatedButton.styleFrom(padding: EdgeInsets.all(15)),
                child: isLoading
                    ? SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : Text("Login"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
