USE reseed;

DELETE FROM categories;

INSERT INTO categories (category_number, name) VALUES
   (1, 'Kräuter'),
   (2, 'Gemüse'),
   (3, 'Blumen'),
   (4, 'Früchte'),
   (5, 'Getreide'),
   (6, 'Ursaat');

DELETE FROM seeds;

INSERT INTO seeds (dt_name, lt_name, description, stock, water, plant_time, climate, sun, growth_weeks) VALUES
    ('Tomate', 'Solanum lycopersicum', 'Beliebtes Fruchtgemüse, gut für Salate.', 50, 'Mittel', 'Frühling', 'Gemäßigt', TRUE, 12),
    ('Gurke', 'Cucumis sativus', 'Knackiges Gemüse für Salate und Snacks.', 120, 'Viel', 'Frühling', 'Warm', TRUE, 10),
    ('Karotte', 'Daucus carota', 'Wurzelgemüse mit hohem Vitamin A-Gehalt.', 200, 'Mittel', 'Frühling', 'Kühl', FALSE, 14),
    ('Paprika', 'Capsicum annuum', 'Scharf oder süß, vielseitig einsetzbar.', 80, 'Mittel', 'Frühling', 'Warm', TRUE, 16),
    ('Kürbis', 'Cucurbita pepo', 'Großes, süßes Herbstgemüse.', 50, 'Viel', 'Sommer', 'Warm', TRUE, 20),
    ('Zucchini', 'Cucurbita pepo', 'Ertragreiches Sommergemüse.', 90, 'Mittel', 'Frühling', 'Gemäßigt', TRUE, 10),
    ('Basilikum', 'Ocimum basilicum', 'Aromatisches Küchenkraut.', 300, 'Mittel', 'Frühling', 'Warm', TRUE, 6),
    ('Petersilie', 'Petroselinum crispum', 'Beliebtes Küchenkraut.', 220, 'Mittel', 'Frühling', 'Gemäßigt', FALSE, 8),
    ('Dill', 'Anethum graveolens', 'Kraut für Fischgerichte.', 180, 'Mittel', 'Frühling', 'Gemäßigt', TRUE, 7),
    ('Lauch', 'Allium porrum', 'Würz- und Suppengemüse.', 70, 'Mittel', 'Herbst', 'Kühl', FALSE, 15),
    ('Brokkoli', 'Brassica oleracea', 'Kreuzblütler mit viel Vitamin C.', 60, 'Mittel', 'Frühling', 'Kühl', TRUE, 12),
    ('Blumenkohl', 'Brassica oleracea var. botrytis', 'Feines Gemüse mit weißen Köpfen.', 55, 'Mittel', 'Frühling', 'Kühl', TRUE, 14),
    ('Spinat', 'Spinacia oleracea', 'Blattgemüse für Salate und Suppen.', 100, 'Mittel', 'Frühling', 'Kühl', FALSE, 6),
    ('Mangold', 'Beta vulgaris subsp. vulgaris', 'Blattgemüse mit bunten Stielen.', 65, 'Mittel', 'Frühling', 'Gemäßigt', TRUE, 8),
    ('Rote Beete', 'Beta vulgaris', 'Rote Wurzelknolle mit süßem Geschmack.', 85, 'Mittel', 'Frühling', 'Kühl', FALSE, 10),
    ('Erbse', 'Pisum sativum', 'Eiweißreiches Hülsenfruchtgemüse.', 110, 'Mittel', 'Frühling', 'Kühl', TRUE, 9),
    ('Bohne', 'Phaseolus vulgaris', 'Beliebtes Garten- und Feldgemüse.', 90, 'Mittel', 'Frühling', 'Warm', TRUE, 11),
    ('Salat', 'Lactuca sativa', 'Kopfbildender Blattsalat.', 150, 'Mittel', 'Frühling', 'Kühl', FALSE, 7),
    ('Radieschen', 'Raphanus sativus', 'Schnell wachsendes Knollengemüse.', 130, 'Mittel', 'Frühling', 'Gemäßigt', FALSE, 4),
    ('Zwiebel', 'Allium cepa', 'Würz- und Heilpflanze.', 140, 'Wenig', 'Frühling', 'Kühl', TRUE, 14),
    ('Knoblauch', 'Allium sativum', 'Stark aromatische Gewürzpflanze.', 90, 'Wenig', 'Herbst', 'Kühl', TRUE, 20),
    ('Kresse', 'Lepidium sativum', 'Sehr schnell wachsendes Würzkraut.', 250, 'Mittel', 'Ganzjährig', 'Gemäßigt', FALSE, 2),
    ('Schnittlauch', 'Allium schoenoprasum', 'Feines Lauchgewächs.', 180, 'Mittel', 'Frühling', 'Gemäßigt', TRUE, 5),
    ('Kohlrabi', 'Brassica oleracea var. gongylodes', 'Knolliges Kohlgemüse.', 95, 'Mittel', 'Frühling', 'Kühl', FALSE, 9),
    ('Fenchel', 'Foeniculum vulgare', 'Würz- und Heilpflanze.', 70, 'Mittel', 'Sommer', 'Warm', TRUE, 12);



INSERT INTO seed_categories (seed_number, category_number) VALUES
    (1, 2),
    (1, 4),
    (2, 1),
    (2, 2),
    (3, 2),
    (4, 2),
    (4, 4),
    (5, 2),
    (6, 2),
    (6, 4),
    (7, 2),
    (8, 2),
    (9, 2),
    (9, 4),
    (10, 2),
    (10, 5),
    (10, 6),
    (11, 2),
    (11, 5),
    (11, 6),
    (12, 1),
    (13, 1),
    (13, 2),
    (14, 1),
    (15, 1),
    (16, 1),
    (17, 1),
    (18, 1),
    (18, 2),
    (18, 6),
    (19, 1),
    (20, 1),
    (20, 2),
    (21, 1),
    (22, 3),
    (22, 1),
    (23, 3),
    (24, 3),
    (24, 1),
    (25, 1);