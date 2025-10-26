import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  // Load books from backend
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get("http://localhost:5000/api/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  // Add new book
  const addBook = () => {
    if (!title || !author || !price) return alert("Please fill all fields");
    axios.post("http://localhost:5000/api/books", { title, author, price })
      .then(() => {
        fetchBooks();
        setTitle("");
        setAuthor("");
        setPrice("");
      })
      .catch(err => console.error(err));
  };

  // Start editing a book
  const startEdit = (book) => {
    setEditId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price);
  };

  // Update book
  const updateBook = () => {
    if (!title || !author || !price) return alert("Please fill all fields");
    axios.put(`http://localhost:5000/api/books/${editId}`, { title, author, price })
      .then(() => {
        fetchBooks();
        setEditId(null);
        setTitle("");
        setAuthor("");
        setPrice("");
      })
      .catch(err => console.error(err));
  };

  // Delete book
  const deleteBook = (id) => {
    axios.delete(`http://localhost:5000/api/books/${id}`)
      .then(fetchBooks)
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Library Management</h2>

      <input
        placeholder="Book title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        placeholder="Author name"
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />
      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      {editId ? (
        <button onClick={updateBook}>Update Book</button>
      ) : (
        <button onClick={addBook}>Add Book</button>
      )}

      <h4>Total Books: {books.length}</h4>

      <ul>
        {books.map(b => (
          <li key={b._id}>
            {b.title} by {b.author} — ${b.price}{" "}
            <button onClick={() => startEdit(b)}>✏️ Edit</button>
            <button onClick={() => deleteBook(b._id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
