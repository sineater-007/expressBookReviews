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
public_users.get('/', async (req, res) => {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    })
    get_books.then(() => console.log("resolved"));
});
// public_users.get('/', function (req, res) {
//     res.send(JSON.stringify(books,null,4));
// });
// public_users.get('/', async (req, res) => {
//     try {
//       const data = await promise((resolve) => {
//         const booksList = Object.values(books);
//         resolve(booksList)
//       }, 3000);
//       return res.json(data);
//     } catch (error) {
//       res.json({ message: "Error retrieving books" });
//     }
//   });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const entry = Object.entries(books).find(([key, book]) => book.ISBN === isbn);
    if (entry) {
        const [id, book] = entry;
        return res.json({ [id]: book });
    } else {
        return res.json({ message: "Book not found" });
    }
});
// public_users.get('/isbn/:isbn', async (req, res) => {
//     try{
//         const data = await promise((resolve) => {
//             const isbn = req.params.isbn + "";
//             const nook = books[isbn];
//             resolve(book);
//         }, 3000);
//         if(data){
//             return res.json(data);
//         }
//         return res.json("invalid isbn");
//     } catch(error){
//         return res.json("error");
//     }
// });


// public_users.get('/isbn/:isbn', (req, res) => {
//     const get_books_isbn = new Promise((resolve, reject) => {
//     const isbn = parseInt(req.params.isbn);
//     if(isbn <= 10){
//         resolve(books[isbn]);
//     } else {
//         reject('ISBN not found')
//     }
//   });
//     get_books_isbn.then(function(){
//         res.send(book);  
//         console.log("resolved");
//     }).catch(function(){
//         res.send(error)
//         console.log('not found');
//     });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const entries = Object.entries(books).filter(([key, book]) => book.author === author);
    if (entries.length > 0) {
        const result = Object.fromEntries(entries);
        return res.json(result);
    } else {
        return res.json({ message: "Book not found" });
    }
});


//Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const entries = Object.entries(books).filter(([key, book]) => book.title === title);
    if (entries.length > 0) {
        const result = Object.fromEntries(entries);
        return res.json(result);
    } else {
        return res.json({ message: "Book not found" });
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
