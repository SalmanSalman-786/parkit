CREATE TABLE facilities (
    facility_id SERIAL PRIMARY KEY,
    facility_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_color VARCHAR(50),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE visit_status AS ENUM (
    'Parked',
    'Exited'
);

CREATE TYPE detection_method AS ENUM (
    'Automatic',
    'Manual'
);

CREATE TABLE vehicle_visits (
    visit_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL,
    facility_id INT NOT NULL,
    entry_time TIMESTAMP NOT NULL,
    exit_time TIMESTAMP,
    status visit_status DEFAULT 'Parked',
    detection_mode detection_method DEFAULT 'Automatic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(vehicle_id)
        REFERENCES vehicles(vehicle_id),

    FOREIGN KEY(facility_id)
        REFERENCES facilities(facility_id)
);

CREATE TABLE cameras (
    camera_id SERIAL PRIMARY KEY,
    facility_id INT NOT NULL,
    camera_name VARCHAR(100),
    camera_type VARCHAR(50),
    camera_position VARCHAR(50),
    ip_address VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(facility_id)
        REFERENCES facilities(facility_id)
);

CREATE TABLE long_stay_alerts (
    alert_id SERIAL PRIMARY KEY,
    visit_id INT NOT NULL,
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    resolved BOOLEAN DEFAULT FALSE,

    FOREIGN KEY(visit_id)
        REFERENCES vehicle_visits(visit_id)
);

CREATE INDEX idx_vehicle_number
ON vehicles(vehicle_number);

CREATE INDEX idx_visit_status
ON vehicle_visits(status);

CREATE INDEX idx_entry_time
ON vehicle_visits(entry_time);

CREATE INDEX idx_exit_time
ON vehicle_visits(exit_time);