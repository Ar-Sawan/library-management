import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const FlashMessage = () => {
  const { flash, showFlash } = useApp();

  if (!flash) return null;

  return (
    <div className="flash-container">
      <div className={`flash-message ${flash.type}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {flash.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{flash.message}</span>
        </div>
        <button
          className="flash-close-btn"
          onClick={() => showFlash(null)}
          title="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlashMessage;
