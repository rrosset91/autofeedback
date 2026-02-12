-- Seed European car brands and models
-- This is temporary data until R2 migration is complete

-- European Brands
INSERT OR IGNORE INTO brands (id, name, slug, country) VALUES
(1, 'Volkswagen', 'volkswagen', 'Germany'),
(2, 'BMW', 'bmw', 'Germany'),
(3, 'Mercedes-Benz', 'mercedes-benz', 'Germany'),
(4, 'Audi', 'audi', 'Germany'),
(5, 'Renault', 'renault', 'France'),
(6, 'Peugeot', 'peugeot', 'France'),
(7, 'Citroën', 'citroen', 'France'),
(8, 'Fiat', 'fiat', 'Italy'),
(9, 'Alfa Romeo', 'alfa-romeo', 'Italy'),
(10, 'Ferrari', 'ferrari', 'Italy'),
(11, 'Lamborghini', 'lamborghini', 'Italy'),
(12, 'Volvo', 'volvo', 'Sweden'),
(13, 'Saab', 'saab', 'Sweden'),
(14, 'Seat', 'seat', 'Spain'),
(15, 'Škoda', 'skoda', 'Czech Republic'),
(16, 'Opel', 'opel', 'Germany'),
(17, 'Porsche', 'porsche', 'Germany'),
(18, 'Land Rover', 'land-rover', 'UK'),
(19, 'Jaguar', 'jaguar', 'UK'),
(20, 'Mini', 'mini', 'UK'),
(21, 'Rolls-Royce', 'rolls-royce', 'UK'),
(22, 'Bentley', 'bentley', 'UK'),
(23, 'Aston Martin', 'aston-martin', 'UK'),
(24, 'Dacia', 'dacia', 'Romania'),
(25, 'Lancia', 'lancia', 'Italy');

-- Volkswagen Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(1, 1, 'Golf', 'golf', 'Hatchback'),
(2, 1, 'Polo', 'polo', 'Hatchback'),
(3, 1, 'Passat', 'passat', 'Sedan'),
(4, 1, 'Tiguan', 'tiguan', 'SUV'),
(5, 1, 'T-Roc', 't-roc', 'SUV'),
(6, 1, 'Arteon', 'arteon', 'Sedan'),
(7, 1, 'ID.3', 'id3', 'Hatchback'),
(8, 1, 'ID.4', 'id4', 'SUV');

-- BMW Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(10, 2, '3 Series', '3-series', 'Sedan'),
(11, 2, '5 Series', '5-series', 'Sedan'),
(12, 2, 'X1', 'x1', 'SUV'),
(13, 2, 'X3', 'x3', 'SUV'),
(14, 2, 'X5', 'x5', 'SUV'),
(15, 2, 'i4', 'i4', 'Sedan'),
(16, 2, 'iX', 'ix', 'SUV');

-- Mercedes-Benz Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(20, 3, 'A-Class', 'a-class', 'Hatchback'),
(21, 3, 'C-Class', 'c-class', 'Sedan'),
(22, 3, 'E-Class', 'e-class', 'Sedan'),
(23, 3, 'GLA', 'gla', 'SUV'),
(24, 3, 'GLC', 'glc', 'SUV'),
(25, 3, 'GLE', 'gle', 'SUV'),
(26, 3, 'EQC', 'eqc', 'SUV');

-- Audi Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(30, 4, 'A3', 'a3', 'Hatchback'),
(31, 4, 'A4', 'a4', 'Sedan'),
(32, 4, 'A6', 'a6', 'Sedan'),
(33, 4, 'Q3', 'q3', 'SUV'),
(34, 4, 'Q5', 'q5', 'SUV'),
(35, 4, 'Q7', 'q7', 'SUV'),
(36, 4, 'e-tron', 'e-tron', 'SUV');

-- Renault Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(40, 5, 'Clio', 'clio', 'Hatchback'),
(41, 5, 'Mégane', 'megane', 'Hatchback'),
(42, 5, 'Captur', 'captur', 'SUV'),
(43, 5, 'Kadjar', 'kadjar', 'SUV'),
(44, 5, 'Zoe', 'zoe', 'Hatchback');

-- Peugeot Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(50, 6, '208', '208', 'Hatchback'),
(51, 6, '308', '308', 'Hatchback'),
(52, 6, '3008', '3008', 'SUV'),
(53, 6, '5008', '5008', 'SUV'),
(54, 6, 'e-208', 'e-208', 'Hatchback');

-- Fiat Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(60, 8, '500', '500', 'Hatchback'),
(61, 8, 'Panda', 'panda', 'Hatchback'),
(62, 8, 'Tipo', 'tipo', 'Hatchback'),
(63, 8, '500X', '500x', 'SUV');

-- Škoda Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(70, 15, 'Fabia', 'fabia', 'Hatchback'),
(71, 15, 'Octavia', 'octavia', 'Sedan'),
(72, 15, 'Superb', 'superb', 'Sedan'),
(73, 15, 'Kodiaq', 'kodiaq', 'SUV'),
(74, 15, 'Karoq', 'karoq', 'SUV');

-- Volvo Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(80, 12, 'V40', 'v40', 'Hatchback'),
(81, 12, 'V60', 'v60', 'Wagon'),
(82, 12, 'S60', 's60', 'Sedan'),
(83, 12, 'XC40', 'xc40', 'SUV'),
(84, 12, 'XC60', 'xc60', 'SUV'),
(85, 12, 'XC90', 'xc90', 'SUV');

-- Porsche Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(90, 17, '911', '911', 'Coupe'),
(91, 17, 'Cayenne', 'cayenne', 'SUV'),
(92, 17, 'Macan', 'macan', 'SUV'),
(93, 17, 'Taycan', 'taycan', 'Sedan');

-- Dacia Models
INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type) VALUES
(100, 24, 'Sandero', 'sandero', 'Hatchback'),
(101, 24, 'Duster', 'duster', 'SUV'),
(102, 24, 'Logan', 'logan', 'Sedan');
