package com.parking.backend.repository;

import com.parking.backend.model.Parking;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ParkingRepository extends MongoRepository<Parking, String> {

    // 📍 Find nearby parkings using bounding box
    @Query("{ 'latitude': { $gte: ?0, $lte: ?1 }, 'longitude': { $gte: ?2, $lte: ?3 } }")
    List<Parking> findNearby(double minLat, double maxLat, double minLng, double maxLng);

}