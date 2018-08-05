

// mongoimport -u root --db admin --collection books --type csv --file /wk09hw/goodreads.csv --headerline --columnsHaveTypes --ignoreBlanks


/*

Query 1

Try to find out how many books in this person's data were written by Isaac 
Asimov. However, some auhtors are listed in the additional_authors field. You 
will need to use the regular expression `/Isaac Asimov/` to see if the string 
"Isaac Asimov" is in the `additional_authors` field in addition to finding 
books with `author` equal to "Isaac Asimov". This will involve using the `$or` 
operator since your are looking in two fields. Project only the titles, and 
sort them in alphabetical order.

*Expected Result:*

```
{ "title" : "Dangerous Visions" }
{ "title" : "Forward the Foundation (Foundation: Prequel #2)" }
{ "title" : "Foundation (Foundation #1)" }
{ "title" : "Foundation and Earth (Foundation #5)" }
{ "title" : "Foundation and Empire (Foundation #2)" }
{ "title" : "Foundation's Edge (Foundation #4)" }
{ "title" : "Second Foundation (Foundation #3)" }
{ "title" : "The Currents of Space (Galactic Empire, #2)" }
{ "title" : "The Gods Themselves" }
{ "title" : "The Science Fiction Hall of Fame: Volume 1 (Science Fiction Hall of Fame, #1)" }
{ "title" : "The Stars, Like Dust (Galactic Empire, #1)" }
```

*/

// I'll do this one for you
db.books.find({
    $or: [
        {"author":/Isaac Asimov/}, 
        {"additional_authors": /Isaac Asimov/}
    ]}, 
    {"_id":0, "title":1}).sort({"title":1})






/*
Query 2

Get the count of all books that have been read. To determine if a book has been
read, use the $exists match operator on the date_read field.

Hint: To do this one, use the count() method instead of the find() method.

Expected result:

409
*/

// Your code goes here

db.books.count(
    {date_read:{$exists:1}}
    )


/*

Query 3

OK, now lets look at the count of books read by month to see when this reader 
is most active. Now you will need to use the aggregate() method instead of the
find() method. Recall from the exercise that aggregate() takes an array of
stages. In this query, you will need to use a $match, $group, and $sort stage.

In the $match stage, just check that date_read exists, like the previous query.
In the $group stage, create a group _id based on the number of the month (using
the $month operator, and create a count field that is the sum of the documents 
in that group. In the $sort stage, just sort by the month (which is the group 
_id field).

Expected Result:

{ "_id" : 1, "count" : 138 }
{ "_id" : 2, "count" : 29 }
{ "_id" : 3, "count" : 31 }
{ "_id" : 4, "count" : 13 }
{ "_id" : 5, "count" : 21 }
{ "_id" : 6, "count" : 26 }
{ "_id" : 7, "count" : 20 }
{ "_id" : 8, "count" : 26 }
{ "_id" : 9, "count" : 19 }
{ "_id" : 10, "count" : 18 }
{ "_id" : 11, "count" : 32 }
{ "_id" : 12, "count" : 36 }

*/

// I will do this one for you.
db.books.aggregate(
    [
        {
            $match: {
                date_read: {$exists: 1}
            }
        },
        {
            $group: {
                _id: {$month: "$date_read"},
                count: {$sum: 1}
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]
)

/*

Query 4

It looks as though this reader does a lot of reading in January. Let's look a 
little closer though. Now get the count of books, grouped by day of the month 
for all books read in January. You can reuse the previous query, but you will 
need to insert two more stages. After the initial $match stage, add a $project 
stage and another $match stage.

In the $project stage use the $year operator to create a year field, use the 
$month operator to create a month field, and use the $dayOfMonth operator to 
create a day field.

In the second $match stage, simply set a criteria thet month is equal to 1 
(use the $eq operator)

In the $group stage, simply set the _id to "$day" instead of the month.

Expected result:

{ "_id" : 1, "count" : 115 }
{ "_id" : 2, "count" : 1 }
{ "_id" : 3, "count" : 1 }
{ "_id" : 4, "count" : 2 }
{ "_id" : 5, "count" : 1 }
{ "_id" : 6, "count" : 2 }
{ "_id" : 7, "count" : 2 }
{ "_id" : 8, "count" : 1 }
{ "_id" : 9, "count" : 1 }
{ "_id" : 12, "count" : 1 }
{ "_id" : 13, "count" : 1 }
{ "_id" : 14, "count" : 1 }
{ "_id" : 17, "count" : 1 }
{ "_id" : 18, "count" : 2 }
{ "_id" : 19, "count" : 1 }
{ "_id" : 23, "count" : 2 }
{ "_id" : 24, "count" : 1 }
{ "_id" : 26, "count" : 1 }
{ "_id" : 30, "count" : 1 }

*/


// Your code goes here


db.books.aggregate(
    [
        {
            $match: {
                date_read: {$exists: 1}
            }
        },
        {
            $project: {
                year: {$year: "$date_read"},
                month: {$month: "$date_read"},
                day: {$dayOfMonth:"$date_read"}
            }
        },
        {
            $match: {
                month: {$eq: 1}
            }
        },
        {
            $group: {
                _id: "$day",
                count: {$sum: 1}
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]
)



/*

Query 5

You can see from the result of Query 4 that there are a lot of books read on 
January 1st. This is likely because the user knew a year, but not the month or 
day, so the default is January 1st.

So, let's remove those from the results of Query 3. Rewrite Query 3 such that 
books read on January 1st of any year are not included.

This query is nearly identical to query 4. Change the second $match stage; use 
an $or operator to get documents where the month does not equal 1 (use the $ne
operator) OR day does not equal 1. And change the _id in the $group stage back to 
"$month"/

Expected result:

{ "_id" : 1, "count" : 23 }
{ "_id" : 2, "count" : 29 }
{ "_id" : 3, "count" : 31 }
{ "_id" : 4, "count" : 13 }
{ "_id" : 5, "count" : 21 }
{ "_id" : 6, "count" : 26 }
{ "_id" : 7, "count" : 20 }
{ "_id" : 8, "count" : 26 }
{ "_id" : 9, "count" : 19 }
{ "_id" : 10, "count" : 18 }
{ "_id" : 11, "count" : 32 }
{ "_id" : 12, "count" : 36 }

*/
// Your code goes here

db.books.aggregate(
    [
        {
            $match: {
                date_read: {$exists: 1}
            }
        },
        {
            $project: {
                year: {$year: "$date_read"},
                month: {$month: "$date_read"},
                day: {$dayOfMonth:"$date_read"}
            }
        },
        {
            $match: {
                $or:[
               { month: {$ne: 1}},
                {day: {$ne: 1}}]
            }
        },
        {
            $group: {
                _id: "$month",
                count: {$sum: 1}
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]
)











