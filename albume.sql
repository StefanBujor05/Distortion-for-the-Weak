DROP TYPE IF EXISTS categ_muzicale;
DROP TYPE IF EXISTS format_muzical;
DROP TYPE IF EXISTS culoare_principala;

CREATE TYPE categ_muzicale AS ENUM( 'death metal', 'thrash metal', 'heavy metal', 'black metal', 'alternative rock','progressive metal', 'metal');
CREATE TYPE format_muzical AS ENUM('cd', 'vinyl', 'caseta', 'digital');
CREATE TYPE culoare_principala AS ENUM('rosu', 'albastru', 'negru', 'mov', 'roz', 'gri', 'alb', 'maro', 'verde', 'multi');

CREATE TABLE IF NOT EXISTS albume (
    id serial PRIMARY KEY, --a
    nume VARCHAR(50) UNIQUE NOT NULL, --b
    descriere TEXT, --c
    imagine VARCHAR(300), --d
    categ_muzicala categ_muzicale DEFAULT 'metal', --e
    format format_muzical DEFAULT 'digital', --f
    pret NUMERIC(8,2) NOT NULL, --g
    numar_piese INT NOT NULL CHECK (numar_piese >= 0), --h
    data_lansare TIMESTAMP DEFAULT current_timestamp, --i
    culoare culoare_principala DEFAULT 'multi', --j
    piese VARCHAR[],
    membrii VARCHAR[], --k
    livrare BOOLEAN NOT NULL DEFAULT FALSE --l
);

INSERT INTO albume (nume, descriere, imagine, categ_muzicala, format, pret, numar_piese, data_lansare, culoare, piese, livrare) VALUES
('Dying Fetus - Destroy the Opposition', 'Un pilon al death metal-ului tehnic si brutal.', 'DF_DTO.jpg', 'death metal', 'cd', 59.99, 8, '2000-10-03 00:00:00', 'negru', ARRAY['Praise the Lord', 'Destroy the Opposition'], TRUE),
('Obituary - Cause of Death', 'Album clasic de death metal din Florida.', 'O_COD.jpg', 'death metal', 'vinyl', 89.99, 9, '1990-09-19 00:00:00', 'albastru', ARRAY['Infected', 'Body Bag', 'Chopped in Half'], TRUE),
('Morbid Angel - Altars of Madness', 'Considerat unul dintre cele mai influente albume death.', 'MA_AOM.jpg', 'death metal', 'vinyl', 95.00, 9, '1989-05-12 00:00:00', 'multi', ARRAY['Immortal Rites', 'Visions from the Dark Side'], FALSE),
('Megadeth - Rust in Peace', 'Capodopera thrash metal cu riffuri legendare.', 'MD_RIP.png', 'thrash metal', 'cd', 45.00, 9, '1990-09-24 00:00:00', 'albastru', ARRAY['Holy Wars... The Punishment Due', 'Hangar 18'], TRUE),
('Metallica - Master of Puppets', 'Unul dintre cele mai bune albume de heavy/thrash din istorie.', 'M_MOP.jpg', 'thrash metal', 'vinyl', 120.00, 8, '1986-03-03 00:00:00', 'rosu', ARRAY['Battery', 'Master of Puppets', 'Disposable Heroes'], TRUE),
('Metallica - Metallica', 'Cunoscut ca Black Album, un succes comercial masiv.', 'M_M.jpeg', 'heavy metal', 'cd', 50.00, 12, '1991-08-12 00:00:00', 'negru', ARRAY['Enter Sandman', 'Sad but True', 'The Unforgiven'], TRUE),
('Megadeth - Countdown to Extinction', 'Album nominalizat la Grammy, sunet heavy metal curat.', 'MD_CTE.jpg', 'heavy metal', 'caseta', 35.00, 13, '1992-07-14 00:00:00', 'gri', ARRAY['Symphony of Destruction', 'Sweating Bullets'], FALSE),
('Dissection - The Somberlain', 'Lansare de referinta pentru melodic black metal.', 'D_TS.jpg', 'black metal', 'cd', 65.00, 11, '1993-12-03 00:00:00', 'negru', ARRAY['Black Horizons', 'The Somberlain'], TRUE),
('Dissection - Storm of the Lights Bane', 'O imbinare perfecta de intuneric si melodie.', 'D_SOTLB.jpg', 'black metal', 'vinyl', 110.00, 8, '1995-11-17 00:00:00', 'albastru', ARRAY['Night''s Blood', 'Unhallowed'], TRUE),
('My Chemical Romance - Three Cheers for Revenge', 'Album iconic de rock alternativ de la inceputul anilor 2000.', 'MCR_TCFSR.png', 'alternative rock', 'cd', 40.00, 13, '2004-06-08 00:00:00', 'rosu', ARRAY['Helena', 'I''m Not Okay (I Promise)'], TRUE),
('My Chemical Romance - The Black Parade', 'O opera rock alternativa dramatica si complexa.', 'MCR_TBP.jpg', 'alternative rock', 'vinyl', 90.00, 13, '2006-10-23 00:00:00', 'alb', ARRAY['Welcome to the Black Parade', 'Famous Last Words'], TRUE),
('Metallica - ...And Justice for All', 'Structuri complexe, piese lungi si tenta progresiva.', 'M_AJFA.jpg', 'thrash metal', 'vinyl', 99.99, 9, '1988-09-07 00:00:00', 'alb', ARRAY['Blackened', 'One', 'Harvester of Sorrow'], TRUE),
('Bolt Thrower - Realm of Chaos', 'Death metal masiv inspirat din universul Warhammer 40k.', 'BT_ROC.jpg', 'death metal', 'caseta', 45.00, 11, '1989-10-28 00:00:00', 'multi', ARRAY['Eternal War', 'Realm of Chaos'], FALSE),
('Bolt Thrower - Those Once Loyal', 'Riffuri grele de pilon, dedicat primului razboi mondial.', 'BT_TOL.jpg', 'death metal', 'cd', 55.00, 9, '2005-11-14 00:00:00', 'maro', ARRAY['At First Light', 'Those Once Loyal'], TRUE),
('Obituary - Slowly We Rot', 'Sunet brut, mlastinos si voci inconfundabile.', 'O_SWR.jpeg', 'death metal', 'vinyl', 85.00, 12, '1989-06-14 00:00:00', 'verde', ARRAY['Slowly We Rot', 'Internal Bleeding'], TRUE),
('Dying Fetus - Wrong One to Fuck With', 'Death metal modern, rapid si extrem de tehnic.', 'DF_WOTFW.jpg', 'death metal', 'digital', 30.00, 11, '2017-06-23 00:00:00', 'gri', ARRAY['Fixated on Devastation', 'Wrong One to Fuck With'], FALSE),
('Morbid Angel - Covenant', 'Cel mai bine vandut album de death metal din era SoundScan.', 'MA_C.jpg', 'death metal', 'cd', 49.99, 10, '1993-06-22 00:00:00', 'negru', ARRAY['Rapture', 'God of Emptiness'], TRUE); 
(
    'I Brought You My Bullets', 
    'Albumul de debut al trupei My Chemical Romance, lansat in 2002, cu o atmosfera raw post-hardcore si emo.', 
    'MCR_IBYMBYBMYL.jpg', 
    'alternative rock', 
    'cd', 
    45.00, 
    11, 
    '2002-07-23 00:00:00', 
    'negru', 
    '{"Vampires Will Never Hurt You", "Honey This Mirror Isnt Big Enough for the Two of Us", "Demolition Lovers"}', 
    '{"Gerard Way", "Ray Toro", "Mikey Way", "Matt Pelissier"}', 
    TRUE
),

(
    'Danger Days', 
    'Un album conceptual pop-punk si alternative rock plasat intr-o Californie post-apocaliptica in anul 2019.', 
    'MCR_DD.jpg', 
    'alternative rock', 
    'vinil', 
    65.50, 
    15, 
    '2010-11-22 00:00:00', 
    'multi', 
    '{"Na Na Na", "Sing", "The Only Hope for Me Is You", "Bulletproof Heart"}', 
    '{"Gerard Way", "Ray Toro", "Mikey Way", "Frank Iero"}', 
    TRUE
),

(
    'Lateralus', 
    'Capodopera progressive metal de la Tool, cunoscuta pentru structurile matematice complexe si utilizarea sirului Fibonacci.', 
    'T_L.jpg', 
    'progressive metal', 
    'cd', 
    55.00, 
    13, 
    '2001-05-15 00:00:00', 
    'negru', 
    '{"The Grudge", "Schism", "Parabola", "Lateralus"}', 
    '{"Maynard James Keenan", "Adam Jones", "Justin Chancellor", "Danny Carey"}', 
    FALSE
),

(
    'For Victory', 
    'Un album clasic de death metal old-school lansat de trupa britanica Bolt Thrower, axat pe teme de razboi.', 
    'BT_FV.jpg', 
    'death metal', 
    'digital', 
    39.99, 
    10, 
    '1994-11-28 00:00:00', 
    'multi', 
    '{"For Victory", "War", "Remembrance", "When Glory Beckons"}', 
    '{"Karl Willetts", "Gavin Ward", "Barry Thomson", "Jo Bench", "Andrew Whale"}', 
    FALSE
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO stefan;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO stefan;