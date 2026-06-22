// package com.parking.backend.model;

// import lombok.Data;
// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.index.Indexed;
// import org.springframework.data.mongodb.core.mapping.Document;

// import java.time.LocalDateTime;

// @Data
// @Document(collection = "bookings")
// public class Booking {

//     @Id
//     private String id;

//     @Indexed
//     private String userId;

//     @Indexed
//     private String status;

//     @Indexed(unique = true)
//     private String bookingId;

//     @Indexed
//     private String vehicleNumber;

//     //private String userId; // 🔥 NEW
//     private String parkingId;

//     //private String vehicleNumber; // 🔥 NEW
//     private String vehicleType;

//     private LocalDateTime startTime;
//     private LocalDateTime endTime;

//    // private String status;
//     private double amount; // 💰 NEW
//     private long durationMinutes; // ⏱️ NEW
//     private LocalDateTime entryTime;
//     private LocalDateTime exitTime;
//     //private String bookingId;
//     private String parkingName;
//     private String location;
//     private boolean isCancelled;
//     private double refundAmount;
//     private String cancelReason; // USER / SYSTEM / WARNED
//     private double fineAmount;
//     private LocalDateTime lastFineTime;
//     private boolean endTimeNotified;
//     private String type; // BOOKING or WALKIN

// }
package com.parking.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")

@CompoundIndex(name = "booking_index", def = "{'parkingId':1,'vehicleType':1,'status':1,'startTime':1,'endTime':1}")
public class Booking {

    // =====================================
    // BOOKING IDENTITY
    // =====================================

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String bookingId;

    @Indexed
    private String vehicleNumber;

    private String phoneNumber;

    // =====================================
    // PARKING DETAILS
    // =====================================

    @Indexed
    private String parkingId;

    private String parkingName;

    private String location;

    private String parkingImageUrl;

    @Indexed
    private String vehicleType;

    @Indexed
    private String type; // BOOKING or WALKIN

    // =====================================
    // BOOKING STATUS
    // =====================================

    @Indexed
    private String status;

    private boolean isCancelled;

    private String cancelReason;

    // =====================================
    // TIMINGS
    // =====================================

    @Indexed
    private LocalDateTime startTime;

    @Indexed
    private LocalDateTime endTime;

    private LocalDateTime entryTime;

    private LocalDateTime exitTime;

    private LocalDateTime expectedExitTime;

    private LocalDateTime createdAt;

    private long durationMinutes;

    // =====================================
    // BOOKING PAYMENT
    // =====================================

    private double bookingFee;

    private double assuranceDeposit;

    private double amount;

    private String paymentStatus; // PENDING, PAID, FAILED

    private String paymentMode; // CASH, ONLINE

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private LocalDateTime paymentTime;

    // =====================================
    // BOOKING REFUND
    // =====================================

    private double refundAmount;

    private String refundId;

    private String refundStatus;

    private LocalDateTime refundTime;

    // =====================================
    // DEPOSIT REFUND
    // =====================================

    private boolean depositRefunded;

    private LocalDateTime depositRefundTime;

    private String depositRefundId;

    private String depositRefundStatus;

    // =====================================
    // FINES
    // =====================================

    private double fineAmount;

    private double collectedFineAmount;

    private boolean finePaid = false;

    private LocalDateTime lastFineTime;

    private String finePaymentMode; // CASH, ONLINE

    private String fineOrderId;

    private String finePaymentId;

    private LocalDateTime finePaymentTime;

    // =====================================
    // NOTIFICATIONS
    // =====================================

    private boolean reminderSent = false;

    private boolean startNotificationSent;

    private boolean startTimeAlertSent = false;

    private boolean lateEntryWarningSent = false;

    private boolean expiryAlertSent = false;

    private boolean endTimeNotified;

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public LocalDateTime getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }

    public boolean isReminderSent() {
        return reminderSent;
    }

    public void setReminderSent(boolean reminderSent) {
        this.reminderSent = reminderSent;
    }

    public boolean isExpiryAlertSent() {
        return expiryAlertSent;
    }

    public void setExpiryAlertSent(boolean expiryAlertSent) {
        this.expiryAlertSent = expiryAlertSent;
    }
}