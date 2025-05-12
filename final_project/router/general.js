const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     res.send(JSON.stringify(books,null,4));
// });
public_users.get('/', async (req, res) => {
    try {
      const data = await new Promise((resolve) => {
        setTimeout(() => resolve(books), 500);
      });
  
      res.status(200).json(data);
    } catch (error) {
      res.json({ message: "Error retrieving books" });
    }
  });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const isbn = parseInt(req.params.isbn);
//     const entry = Object.entries(books).find(([key, book]) => book.ISBN === isbn);
//     if (entry) {
//         const [id, book] = entry;
//         return res.json({ [id]: book });
//     } else {
//         return res.json({ message: "Book not found" });
//     }
// });
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = parseInt(req.params.isbn);
  
    new Promise((resolve, reject) => {
      const entry = Object.entries(books).find(([key, book]) => book.ISBN === isbn);
      if (entry) {
        resolve(entry);
      } else {
        reject("Book not found");
      }
    })
    .then(([id, book]) => {
      res.json({ [id]: book });
    })
    .catch((err) => {
      res.json({ message: err });
    });
  });
  

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author;
//     const entries = Object.entries(books).filter(([key, book]) => book.author === author);
//     if (entries.length > 0) {
//         const result = Object.fromEntries(entries);
//         return res.json(result);
//     } else {
//         return res.json({ message: "Book not found" });
//     }
// });
public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
  
      const entries = await new Promise((resolve) => {
        const result = Object.entries(books).filter(([key, book]) => book.author === author);
        resolve(result);
      });
  
      if (entries.length > 0) {
        const result = Object.fromEntries(entries);
        res.json(result);
      } else {
        res.json({ message: "Book not found" });
      }
    } catch (err) {
      res.json({ message: "Internal server error" });
    }
  });

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title;
//     const entries = Object.entries(books).filter(([key, book]) => book.title === title);
//     if (entries.length > 0) {
//         const result = Object.fromEntries(entries);
//         return res.json(result);
//     } else {
//         return res.json({ message: "Book not found" });
//     }
// });
  public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
  
      const entries = await new Promise((resolve) => {
        const result = Object.entries(books).filter(([key, book]) => book.title === title);
        resolve(result);
      });
  
      if (entries.length > 0) {
        const result = Object.fromEntries(entries);
        res.json(result);
      } else {
        res.json({ message: "Book not found" });
      }
    } catch (err) {
      res.json({ message: "Internal server error" });
    }
  });
  
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = Object.values(books).find(book => book.ISBN === isbn);
    if (book) {
        return res.json(book.reviews);
    } else {
        return res.json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
