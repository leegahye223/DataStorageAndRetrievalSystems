/* Week 02 Exercise - Task 1
   Define the database schemas */

CREATE TABLE film(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(128) NOT NULL,
    year INTEGER NOT NULL,
    duration INTEGER,
    budget INTEGER,
    boxoffice INTEGER,
    genre VARCHAR(32),
    genre_complex VARCHAR(64),
    rating REAL,
    imdb_votes REAL
);


CREATE TABLE actor(
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name VARCHAR(64) NOT NULL UNIQUE 

);


CREATE TABLE starring(
    filmid INTEGER REFERENCES film ON DELETE CASCADE,
    actorid INTEGER REFERENCES actor ON DELETE CASCADE,
 
    PRIMARY KEY(filmid,actorid)

);