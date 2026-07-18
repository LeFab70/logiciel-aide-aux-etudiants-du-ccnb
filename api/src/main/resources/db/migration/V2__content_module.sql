CREATE TABLE faq (
    id BIGSERIAL PRIMARY KEY,
    campus_id BIGINT REFERENCES campus(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE directory_contact (
    id BIGSERIAL PRIMARY KEY,
    campus_id BIGINT NOT NULL REFERENCES campus(id),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150),
    department VARCHAR(150),
    email VARCHAR(255),
    phone VARCHAR(50),
    office_location VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE campus_plan (
    id BIGSERIAL PRIMARY KEY,
    campus_id BIGINT NOT NULL UNIQUE REFERENCES campus(id),
    image_url VARCHAR(500),
    description TEXT
);

CREATE TABLE plan_point (
    id BIGSERIAL PRIMARY KEY,
    campus_plan_id BIGINT NOT NULL REFERENCES campus_plan(id) ON DELETE CASCADE,
    label VARCHAR(150) NOT NULL,
    x_percent NUMERIC(5, 2) NOT NULL,
    y_percent NUMERIC(5, 2) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'OTHER',
    description TEXT
);

CREATE INDEX idx_faq_campus ON faq(campus_id);
CREATE INDEX idx_directory_contact_campus ON directory_contact(campus_id);
CREATE INDEX idx_plan_point_campus_plan ON plan_point(campus_plan_id);
