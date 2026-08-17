import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import FlashMessage from './components/FlashMessage';

import Home from './pages/Home';
import Books from './pages/Books';
import UsersPage from './pages/Users';
import TransactionsPage from './pages/Transactions';
import Contact from './pages/Contact';
import Auth from './pages/Auth';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'books':
        return <Books />;
      case 'users':
        return <UsersPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Auth initialMode="login" setActiveTab={setActiveTab} />;
      case 'register':
        return <Auth initialMode="register" setActiveTab={setActiveTab} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <FlashMessage />
        {renderPage()}
      </main>
      <footer className="app-footer">
        <p>© 2026 Library Management System | React Localhost Edition</p>
      </footer>
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
