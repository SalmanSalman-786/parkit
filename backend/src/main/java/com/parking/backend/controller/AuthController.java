package com.parking.backend.controller;

import com.parking.backend.model.User;
import com.parking.backend.repository.UserRepository;
import com.parking.backend.security.JwtUtil;
import com.parking.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.parking.backend.service.PushNotificationService;
import org.springframework.beans.factory.annotation.Value;

import java.util.concurrent.ConcurrentHashMap;


@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    private final JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final PushNotificationService pushNotificationService;

    private final Map<String, Integer> loginAttempts = new ConcurrentHashMap<>();

    @Value("${admin.registration.key}")
    private String adminRegistrationKey;

    AuthController(AuthService authService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder,
            UserRepository userRepository, PushNotificationService pushNotificationService) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.pushNotificationService = pushNotificationService;
    }

    private void checkLoginAttempts(
            String username) {

        if (loginAttempts.getOrDefault(
                username,
                0) >= 5) {

            throw new RuntimeException(
                    "Account temporarily locked");
        }
    }

    @PostMapping("/login") // User App (login m1)
    public Map<String, Object> login(@RequestBody User request) {

        // 🔥 INPUT VALIDATION
        if (request.getPhoneNumber() == null || request.getPhoneNumber().isEmpty()) {
            throw new RuntimeException("Phone number required");
        }

        if (request.getPhoneNumber().length() != 10) {
            throw new RuntimeException("Invalid phone number");
        }

        User user = authService.login(request.getPhoneNumber());

        if ((user.getName() == null || user.getName().isEmpty())
                && request.getName() != null && !request.getName().isEmpty()) {

            user.setName(request.getName());
            authService.saveUser(user);
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("role", user.getRole());
        response.put("name", user.getName());

        return response;
    }

    @PostMapping("/admin/register")
    public String registerAdmin(@RequestBody User user,
            @RequestHeader("admin-key") String key) {

        if (!adminRegistrationKey.equals(key)) {
            throw new RuntimeException("Unauthorized");
        }

        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new RuntimeException("Weak password");
        }

        user.setRole("ADMIN");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        authService.saveUser(user);

        return "Admin registered";
    }

    @PostMapping("/guard/register") // Admin Website (Guards m1)
    public String registerGuard(@RequestBody User user,
            @RequestHeader("admin-key") String key) {

        if (!adminRegistrationKey.equals(key)) {
            throw new RuntimeException("Unauthorized");
        }

        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new RuntimeException("Weak password");
        }

        user.setRole("GUARD");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getAssignedParkingId() == null ||
                user.getAssignedParkingId().isBlank()) {

            throw new RuntimeException(
                    "Parking assignment required");
        }

        authService.saveUser(user);

        return "Guard registered";
    }

    @PostMapping("/guard/login") // Guard App (login m1)
    public Map<String, Object> guardLogin(@RequestBody User request) {

        checkLoginAttempts(
                request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            loginAttempts.merge(
                    request.getUsername(),
                    1,
                    Integer::sum);

            throw new RuntimeException(
                    "Invalid password");
        }

        // 🔥 CHECK ROLE
        if (!"GUARD".equals(user.getRole())) {
            throw new RuntimeException("Not a guard account");
        }

        loginAttempts.remove(
        request.getUsername());

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getRole());

        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("role", user.getRole());

        res.put(
                "assignedParkingId",
                user.getAssignedParkingId());

        res.put(
                "assignedParkingName",
                user.getAssignedParkingName());

        res.put(
                "name",
                user.getName());

        return res;
    }

    @PostMapping("/admin/login") // Admin Website (login m1)
    public Map<String, Object> adminLogin(@RequestBody User request) {

        checkLoginAttempts(
                request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            loginAttempts.merge(
                    request.getUsername(),
                    1,
                    Integer::sum);

            throw new RuntimeException("Invalid password");
        }

        // 🔥 CHECK ROLE
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Not an admin account");
        }

        loginAttempts.remove(
        request.getUsername());

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getRole());

        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("role", user.getRole());

        return res;
    }

    @PostMapping("/save-fcm-token") // User App (login m2)
    public String saveFcmToken(
            @RequestParam String token,
            HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");

        if (userId == null) {
            return "User not authenticated";
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFcmToken(token);

        userRepository.save(user);

        return "FCM token saved";
    }

    @PostMapping("/test-notification")
    public String testNotification(
            HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");

        if (userId == null) {
            return "User not authenticated";
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getFcmToken() == null ||
                user.getFcmToken().isEmpty()) {

            throw new RuntimeException("FCM token not found");
        }

        pushNotificationService.sendPushNotification(
                user.getFcmToken(),
                "🚗 ParkIt Notification",
                "Push notifications are working!");

        return "Notification sent";
    }
}