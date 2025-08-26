# 📚 Book Review Website

A simple **Book Review Website** built using **Node.js, Express, EJS, HTML, and CSS**. Users can view, add, and edit reviews for books, with data stored in a CSV file.

## 🚀 Features

* View a list of books
* Add new book reviews
* Edit existing reviews
* Delete specific reviews
* Sort books as per date, rating and name
* Structured and reusable **EJS templates**
* Responsive UI with custom CSS
* Static images for book covers from https://openlibrary.org/dev/docs/api/covers

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** HTML, CSS, EJS templates
* **Database:** CSV file
* **Template Engine:** EJS

## 📂 Project Structure

```
BookReview/
│── index.js              # Main server file
│── book.csv              # Book data storage
│── package.json          # Dependencies
│
├── public/               # Static assets
│   ├── static/styles/
│   │   └── main.css      # Main stylesheet
│   └── static/assets/    # Images (book covers, UI images)
│
├── views/                # EJS templates
│   ├── index.ejs         # Homepage
│   ├── book.ejs          # Book details page
│   ├── add.ejs           # Add review form
│   ├── edit.ejs          # Edit review form
│   └── partials/         
│       ├── header.ejs    # Header component
│       └── footer.ejs    # Footer component
```

## ⚙️ Installation & Setup

1. Clone this repository:

   ```bash
   git clone <repo-url>
   cd BookReview
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create Database books with table book and import from csv file in the folder:

   ```
   CREATE TABLE IF NOT EXISTS public.book
    (
    id integer NOT NULL DEFAULT nextval('book_id_seq'::regclass),
    title text,
    author text,
    dateofcompletion date,
    feedback text,
    ratings integer,
    olid text ,
    CONSTRAINT book_pkey PRIMARY KEY (id)
    )
   ```

4. Start the server:

   ```bash
   node index.js
   ```

5. Open in your browser:

   ```
   http://localhost:3000
   ```
