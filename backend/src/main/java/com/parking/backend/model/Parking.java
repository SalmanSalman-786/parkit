package com.parking.backend.model;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "parkings")
public class Parking {

    @Id
    private String id;

    private String name;
    private String location;

    @Indexed
    private double latitude;

    @Indexed
    private double longitude;

    private int twoWheelerCapacity;
    private int twoWheelerAvailable;

    private int fourWheelerCapacity;
    private int fourWheelerAvailable;

    // private Map<String, Integer> slotUsage = new HashMap<>();
    private Map<String, SlotInfo> slotUsage = new HashMap<>();

    private String imageUrl;
    private String description;
    private boolean active = true;



    private int graceMinutes = 30;
    private int waitlistReservationMinutes = 15;

   

    private int activeCars;
    private int activeBikes;

    private int bookingCapacityCars = 2;
    private int bookingCapacityBikes = 2;

    private double bikeHourlyRate = 10;

    private double carHourlyRate = 20;

   

    public Integer getGraceMinutes() {
        return graceMinutes;
    }

    public void setGraceMinutes(Integer graceMinutes) {
        this.graceMinutes = graceMinutes;
    }
}