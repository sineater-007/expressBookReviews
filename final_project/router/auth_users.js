const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const review = req.query.review;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.json({ message: "User not authenticated" });
    }
  
    if (!review) {
      return res.json({ message: "Review is required as a query parameter" });
    }
  
    const book = Object.values(books).find(book => book.ISBN === isbn);
  
    if (!book) {
      return res.json({ message: "Book not found" });
    }
  
    if (typeof book.reviews !== "object") {
      book.reviews = {};
    }
  
    book.reviews[username] = review;
  
    return res.json({ message: "Review added/updated successfully", reviews: book.reviews });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.json({ message: "User not authenticated" });
    }
  
    const book = Object.values(books).find(b => b.ISBN === isbn);
  
    if (!book) {
      return res.json({ message: "Book not found" });
    }
  
    if (typeof book.reviews !== "object") {
      return res.json({ message: "No reviews available to delete." });
    }
  
    if (!book.reviews[username]) {
      return res.json({ message: "You have not posted a review for this book." });
    }
  
    delete book.reviews[username];
  
    return res.json({
      message: "Your review was deleted successfully.",
      reviews: book.reviews
    });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
