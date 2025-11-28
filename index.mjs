import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "l6slz5o3eduzatkw.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "qe0yesjgactqnlm9",
    password: "z1x2t25usk6ucz7v",
    database: "y9ldj76rljpmzotz",
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
                FROM q_authors
                ORDER BY lastName`;
    const [rows] = await pool.query(sql);

    //categories in alphabetical order
    let sql2 = `SELECT DISTINCT category
                FROM q_quotes
                ORDER BY category`;
    const [catRows] = await pool.query(sql2);

    res.render("index", {"authors": rows, "categories": catRows}); //catefoies object added
});

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;
    let sql = `SELECT authorId, firstName, lastName, quote 
        FROM q_quotes 
        NATURAL JOIN q_authors 
        WHERE quote LIKE '%${keyword}%'`;
    let sqlParams = [keyword];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote 
        FROM q_quotes 
        NATURAL JOIN q_authors 
        WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

app.get('/api/author/:id', async (req, res) => {
  let authorId = req.params.id;
  let sql = `SELECT *
            FROM q_authors
            WHERE authorId = ?`;           
  let [rows] = await pool.query(sql, [authorId]);
  res.send(rows)
});

//The list of categories should be retrieved from the database, in alphabetical order.
//Hint: Use “SELECT DISTINCT” to get unique values!
app.get("/searchByCategory", async (req, res) => {
    let userCategory = req.query.category;

    let sql = `SELECT authorId, firstName, lastName, quote 
        FROM q_quotes 
        NATURAL JOIN q_authors 
        WHERE category = ?`;

    let sqlParams = [userCategory];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
});

//Add a “Search by Likes” feature with two text boxes for users to enter the range of likes
app.get("/searchByLikes", async (req, res) => {
    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;

    // making blanks safe
    if (minLikes === "" || minLikes == null) minLikes = 0;
    if (maxLikes === "" || maxLikes == null) maxLikes = 999999999;

    let sql = `SELECT authorId, firstName, lastName, quote 
        FROM q_quotes 
        NATURAL JOIN q_authors 
        WHERE likes BETWEEN ? AND ?`;

    let sqlParams = [minLikes, maxLikes];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
});


app.get("/dbTest", async(req, res) => {
   let sql = "SELECT CURDATE()";
   const [rows] = await pool.query(sql);
   res.send(rows);
});

// app.get("/dbTest", async(req, res) => {
//    try {
//         const [rows] = await pool.query("SELECT CURDATE()");
//         res.send(rows);
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).send("Database error");
//     }
// });//dbTest

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Express server running")
})