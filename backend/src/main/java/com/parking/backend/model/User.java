package com.parking.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true) // 🔥 PREVENT DUPLICATE USERS
    private String phoneNumber;

    private String role; // THIS (USER / ADMIN / GUARD)

    private List<Vehicle> vehicles;

    private String name;

    private String username;
    private String password;

    private String fcmToken;

    private String assignedParkingId;
    private String assignedParkingName;

    public String getId() {
        return id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}