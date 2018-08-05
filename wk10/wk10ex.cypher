
//Query 1: Find the actor named "Tom Hanks".

MATCH (tom {name: "Tom Hanks"}) 
RETURN tom;



//Query 2: Find the movie with title "Cloud Atlas".

MATCH (c {title: "Cloud Atlas"})
RETURN c;


//Query 3: Find 10 people.


MATCH (x: Person)
RETURN x
LIMIT 10;


//Query 4: Find movies released in the 1990s.


MATCH (nineties: Movie)
WHERE nineties.released >= 1990
AND nineties.released < 2000
RETURN nineties.title;


//Query 5: List all Tom Hanks movies.


MATCH (tom: Person {name:"Tom Hanks"})-[:ACTED_IN]->(m)
RETURN m.title;



//Query 6: Who directed "Cloud Atlas"?

MATCH (director:Person)-[:DIRECTED]->(:Movie {title:"Cloud Atlas"})
RETURN director.name;



//Query 7: Get all of Tom Hanks' co-actors.


MATCH (tom: Person {name:"Tom Hanks"})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(costar:Person)
RETURN costar.name;



//Query 8: How are people related to "Cloud Atlas"?


MATCH (p:Person)-[r]->(m:Movie {title:"Cloud Atlas"})
RETURN p.name, r;



//Query 9: Find movies and actors up to 4 "hops" away from Kevin Bacon.


MATCH(bacon:Person {name:"Kevin Bacon"})-[*1..4]-(hollywood)
RETURN DISTINCT hollywood;



//Query 10: Get the Bacon path for Keanu Reeves


MATCH p = shortestPath(
	(bacon:Person {name:"Kevin Bacon"})-[*]-(keanu:Person{name:"Keanu Reeves"})
)
RETURN p;



//Query 11: Find co-actors of Tom Hanks' co-actors (who haven't worked with Tom Hanks themselves)

MATCH (tom: Person {name:"Tom Hanks"}) -[:ACTED_IN]->(m)<-[:ACTED_IN]-(coActors), 
(coActors)-[:ACTED_IN]->(m2)<-[:ACTED_IN]-(cocoActors)
WHERE NOT (tom)-[:ACTED_IN]->()<-[:ACTED_IN]-(cocoActors) 
AND tom <> cocoActors
RETURN cocoActors.name AS Recommended, count(*) AS Strength 
ORDER BY Strength DESC;



//Query 12: Find someone to introduce Tom Hanks to Tom Cruise

MATCH (tom: Person {name:"Tom Hanks"}) -[:ACTED_IN]->(m)<-[:ACTED_IN]-(coActors),
(coActors)-[:ACTED_IN]->(m2)<-[:ACTED_IN]-(cruise: Person {name:"Tom Cruise"})
RETURN tom, m, coActors, m2, cruise;





