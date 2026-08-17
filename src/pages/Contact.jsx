import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const { showFlash } = useApp();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullname || !email || !subject || !message) return;

    showFlash(`Thank you, ${fullname}! Your message has been sent successfully.`, 'success');
    setFullname('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            Contact Us
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Have questions or feedback? Get in touch with our library administration.
          </p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'start' }}>
        {/* Contact Form */}
        <div className="card-panel" style={{ margin: 0 }}>
          <div className="panel-header" style={{ marginBottom: '1rem' }}>
            <h2 className="panel-title">
              <MessageSquare size={22} color="#818cf8" />
              <span>Send us a Message</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Subject *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Book inquiry, suggestion, etc."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Message *</label>
              <textarea
                className="form-control"
                placeholder="Write your query or feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <MapPin size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Library Address</div>
              <div className="stat-label">123 Knowledge Avenue, Central Library City, 10001</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Phone size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Phone Contact</div>
              <div className="stat-label">+1 (800) 555-LIBRARY / +1 (800) 555-5427</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Email Support</div>
              <div className="stat-label">support@librarymanagement.org</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Operating Hours</div>
              <div className="stat-label">Monday - Saturday: 8:00 AM - 8:00 PM (Closed Sundays)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
