package com.parking.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class VirtualGridResponse {

    private int capacity;

    private int occupied;

    private int available;

    private List<Boolean> grid;
}