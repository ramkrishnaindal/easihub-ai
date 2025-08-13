import React, { useState } from 'react';

const EditModal = ({ field, value, onSave, onClose }) => {
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim()) {
      onSave(field, editValue.trim());
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Let's make some edits.</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="action-buttons">
          <button className="action-button">
            <i className="fa fa-smile"></i> Make it casual
          </button>
          <button className="action-button">
            <i className="fa fa-briefcase"></i> Make it formal
          </button>
          <button className="action-button">
            <i className="fa fa-scissors"></i> Shorten it
          </button>
          <div style={{ display: 'flex', flex: '1 auto', gap: '8px' }}>
            <button className="action-button">
              <i className="fa fa-list-alt"></i> Add more details
            </button>
            <button className="action-button">
              <i className="fa fa-redo"></i> Rewrite it
            </button>
          </div>
        </div>
        
        <div className="modal-body">
          <textarea 
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Review and edit your topic content here..."
            rows={8}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              border: '1px solid #e2e8f0', 
              borderRadius: '6px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>
        
        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;