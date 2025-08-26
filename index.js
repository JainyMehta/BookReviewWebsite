import express from "express";
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let filter = "most-recent";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "JainyM",
  port: 5432,
});

db.connect();

//fetch image from url
async function fetchImage(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

//set url according to data
async function fetchBookCover(coverId, size) {
  const url = `https://covers.openlibrary.org/b/isbn/${coverId}-${size}.jpg`;
  return fetchImage(url);
}

//Get request for home page, also called when sorting option changed. Returns result along with image from api as per the sorting option selected
app.get("/", async (req, res) => {
  let result;
  if (filter == "most-recent") {
    result = await db.query(
      "SELECT * FROM book ORDER BY dateofcompletion DESC"
    );
  } else if (filter == "most-oldest") {
    result = await db.query("SELECT * FROM book ORDER BY dateofcompletion ASC");
  } else if (filter == "ratings") {
    result = await db.query("SELECT * FROM book ORDER BY ratings DESC");
  } else if (filter == "title") {
    result = await db.query("SELECT * FROM book ORDER BY title");
  }
  const data = result.rows;
  for (const book of data) {
    const cover = await fetchBookCover(book.isbn, "L");
    book.coverUrl = cover ? `data:image/jpeg;base64,${cover}` : "";
  }

  return res.render("index.ejs", { pageTitle: "Home", books: data });
});

//add page is rendered
app.get("/add", async (req, res) => {
  return res.render("add.ejs", { pageTitle: "Add Book" });
});

//called when sorting option is changed and redirects to home page
app.post("/filter", (req, res) => {
  filter = req.body.sort;
  //console.log(filter);
  return res.redirect("/");
});

//When new book details are submitted. Adds data is database
app.post("/add", async (req, res) => {
  const data = req.body;
  try {
    //console.log(data.title);
    const result = await db.query(
      "INSERT INTO book (title, author, dateOfCompletion, feedback, ratings, isbn) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [
        data.title,
        data.author,
        data.dateOfCompletion,
        data.feedback,
        data.rating,
        data.isbn,
      ]
    );
    console.log(result.rows[0]);
  } catch (err) {
    console.log("Error:" + err);
  }
  res.redirect("/");
});

//specific book is selected
app.get("/book", async (req, res) => {
  let id = parseInt(req.query.id);
  try {
    const result = await db.query("SELECT * FROM book WHERE id=$1", [id]);
    const data = result.rows[0];
    const cover = await fetchBookCover(data.isbn, "L");
    data.coverUrl = cover ? `data:image/jpeg;base64,${cover}` : "";
    return res.render("book.ejs", {
      book: data,
      pageTitle: data.title,
    });
  } catch (err) {
    console.log("Error: " + err);
    return res.redirect("/");
  }
});

//when edit button of specific book is clicked, to load the data
app.get("/edit", async (req, res) => {
  let id = parseInt(req.query.id);
  try {
    const result = await db.query("SELECT * FROM book WHERE id=$1", [id]);
    const data = result.rows[0];
    return res.render("edit.ejs", { book: data, pageTitle: "Edit" });
  } catch (err) {
    console.log("Error: " + err);
    return res.redirect("/");
  }
});

//when book details are edited, data is updated in database
app.post("/edit", async (req, res) => {
  const data = req.body;
  try {
    const result = await db.query(
      "UPDATE book SET title = $1, author = $2, feedback = $3, ratings =$4, isbn = $5 WHERE id = $6;",
      [
        data.title,
        data.author,
        data.feedback,
        data.rating,
        data.isbn,
        data.updateId,
      ]
    );
    console.log("data updates: " + JSON.stringify(data));
  } catch (err) {
    console.log("Error:" + err);
  }
  res.redirect(`/book?id=${data.updateId}`);
});

//delete a specific book
app.get("/delete", async (req, res) => {
  let id = req.query.id;
  try {
    await db.query("DELETE FROM book WHERE id=$1", [id]);
  } catch (err) {
    console.log("Error: " + err);
  }

  return res.redirect("/");
});

app.listen(port, (err) => {
  if (err) {
    console.log("Error: " + err);
  } else {
    console.log(`Server Running at http://localhost:${port}`);
  }
});
