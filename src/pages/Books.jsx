import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookPlus, Search, Trash2, ExternalLink, X } from 'lucide-react';

const Books = () => {
  const { currentUser, books, addBook, deleteBook } = useApp();
  const isManager = currentUser?.role === 'manager';

  const [filterText, setFilterText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(filterText.toLowerCase()) ||
      b.author.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleAddBookSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !description) return;

    addBook({
      title,
      author,
      description,
      link,
      price: price || '0.00'
    });

    setTitle('');
    setAuthor('');
    setDescription('');
    setLink('');
    setPrice('');
    setShowAddModal(false);
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            Book Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Explore available books in the library system.
          </p>
        </div>

        {isManager && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <BookPlus size={18} />
            <span>Add New Book</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Filter books by title or author..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button style={{ cursor: 'default' }}>
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="card-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No books match your criteria.</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div>
                <h3 className="book-title">{book.title}</h3>
                <div className="book-author">by {book.author}</div>
                <p className="book-desc">{book.description}</p>
              </div>

              <div className="book-footer">
                <div className="book-price">${parseFloat(book.price || 0).toFixed(2)}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {book.link && book.link !== '#' && (
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      title="Read details"
                    >
                      <ExternalLink size={14} />
                      <span>Link</span>
                    </a>
                  )}
                  {isManager && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBook(book.id)}
                      title="Delete book"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Add a New Book</h2>
              <button
                className="flash-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBookSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Book Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramayana"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Author *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Valmiki"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Description *</label>
                <textarea
                  className="form-control"
                  placeholder="Brief synopsis of the book..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="10.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Link / URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
