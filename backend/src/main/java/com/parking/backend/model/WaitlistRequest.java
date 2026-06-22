package com.parking.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import lombok.Data;

@Data
@Document(collection = "waitlist_requests")
public class WaitlistRequest {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String parkingId;

    @Indexed
    private String vehicleType;

    @Indexed
    private LocalDate bookingDate;

    private int queuePosition;

    private boolean notified;

    private LocalDateTime notificationTime;

    private int missedNotifications;

    private LocalDateTime createdAt;

    private boolean booked;
}