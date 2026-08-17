import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_BOOKS = [
  {
    id: 1,
    title: "Ramayana",
    author: "Valmiki",
    description: "An ancient Indian epic about Prince Rama's quest to rescue his wife Sita.",
    link: "https://en.wikipedia.org/wiki/Ramayana",
    price: 10.00,
    addedBy: "manager"
  },
  {
    id: 2,
    title: "Mahabharata",
    author: "Vyasa",
    description: "One of the two major Sanskrit epics of ancient India, detailing the Kurukshetra War.",
    link: "https://en.wikipedia.org/wiki/Mahabharata",
    price: 15.00,
    addedBy: "manager"
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A Handbook of Agile Software Craftsmanship for writing readable and reusable code.",
    link: "https://en.wikipedia.org/wiki/Software_craftsmanship",
    price: 25.50,
    addedBy: "manager"
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A inspiring novel about Santiago, an Andalusian shepherd boy who dreams of traveling to Egypt.",
    link: "https://en.wikipedia.org/wiki/The_Alchemist_(novel)",
    price: 12.99,
    addedBy: "manager"
  }
];

const INITIAL_USERS = [
  {
    id: 1,
    fullname: "System Manager",
    email: "manager@library.org",
    username: "manager",
    password: "password123",
    phone: "9876543210",
    role: "manager"
  },
  {
    id: 2,
    fullname: "John Doe",
    email: "john@example.com",
    username: "john_doe",
    password: "user123",
    phone: "9123456789",
    role: "user"
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    userId: 2,
    username: "john_doe",
    bookId: 1,
    bookTitle: "Ramayana",
    issueDate: "2025-01-10",
    returnDate: "2025-01-24",
    price: 10.00,
    status: "returned"
  },
  {
    id: 2,
    userId: 2,
    username: "john_doe",
    bookId: 2,
    bookTitle: "Mahabharata",
    issueDate: "2025-02-01",
    returnDate: "2026-12-31",
    price: 15.00,
    status: "issued"
  }
];

export const AppProvider = ({ children }) => {
  // LocalStorage state wrappers
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('lms_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lms_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [flash, setFlash] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lms_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lms_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('lms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lms_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Flash message helper
  const showFlash = (message, type = 'success') => {
    setFlash({ message, type });
    setTimeout(() => {
      setFlash(null);
    }, 4000);
  };

  // Auth actions
  const login = (username, password) => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        fullname: foundUser.fullname,
        email: foundUser.email,
        role: foundUser.role
      };
      setCurrentUser(userSession);
      showFlash(`Welcome back, ${foundUser.fullname}!`, 'success');
      return true;
    } else {
      showFlash('Invalid username or password!', 'error');
      return false;
    }
  };

  const register = (userData) => {
    const existing = users.find(
      (u) => u.username.toLowerCase() === userData.username.trim().toLowerCase()
    );
    if (existing) {
      showFlash('Username already exists. Please choose a different one.', 'error');
      return false;
    }

    const newUser = {
      id: Date.now(),
      fullname: userData.fullname,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      phone: userData.phone,
      role: 'user'
    };

    setUsers((prev) => [...prev, newUser]);
    showFlash('Registration successful! You can now log in.', 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showFlash('Logged out successfully.', 'success');
  };

  // Book actions
  const addBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      title: bookData.title,
      author: bookData.author,
      description: bookData.description,
      link: bookData.link || '#',
      price: parseFloat(bookData.price) || 0.0,
      addedBy: currentUser ? currentUser.username : 'manager'
    };
    setBooks((prev) => [newBook, ...prev]);
    showFlash(`Book "${newBook.title}" added successfully!`, 'success');
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    showFlash('Book deleted successfully.', 'success');
  };

  // User Management actions (Manager)
  const addUser = (userData) => {
    const existing = users.find(
      (u) => u.username.toLowerCase() === userData.username.trim().toLowerCase()
    );
    if (existing) {
      showFlash('Username already exists!', 'error');
      return false;
    }
    const newUser = {
      id: Date.now(),
      fullname: userData.fullname,
      email: userData.email,
      username: userData.username,
      password: userData.password || 'password123',
      phone: userData.phone,
      role: userData.role
    };
    setUsers((prev) => [...prev, newUser]);
    showFlash(`User "${newUser.username}" added successfully!`, 'success');
    return true;
  };

  const editUser = (id, updatedData) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
    );
    showFlash('User updated successfully!', 'success');
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showFlash('User deleted successfully.', 'success');
  };

  // Transaction actions
  const issueBook = (transactionData) => {
    const userObj = users.find((u) => u.id === parseInt(transactionData.userId));
    const bookObj = books.find((b) => b.id === parseInt(transactionData.bookId));

    if (!userObj || !bookObj) {
      showFlash('Invalid user or book selection.', 'error');
      return false;
    }

    const newTransaction = {
      id: Date.now(),
      userId: userObj.id,
      username: userObj.username,
      bookId: bookObj.id,
      bookTitle: bookObj.title,
      issueDate: transactionData.issueDate,
      returnDate: transactionData.returnDate,
      price: parseFloat(transactionData.price) || 0,
      status: 'issued'
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    showFlash(`Book "${bookObj.title}" issued to ${userObj.username} successfully!`, 'success');
    return true;
  };

  const returnBook = (transactionId, returnDate) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, returnDate: returnDate || new Date().toISOString().split('T')[0], status: 'returned' }
          : t
      )
    );
    showFlash('Book returned successfully!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        books,
        users,
        transactions,
        flash,
        showFlash,
        login,
        register,
        logout,
        addBook,
        deleteBook,
        addUser,
        editUser,
        deleteUser,
        issueBook,
        returnBook
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
