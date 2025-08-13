import React, { useState } from "react";
import EditModal from "./EditModal";
import { getCurrentUser } from "../../utils/userUtils";

const ReviewSubmitStep = ({ onBack, postData }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [currentData, setCurrentData] = useState(postData);

  const handleEdit = (field) => {
    setEditingField(field);
    setShowEditModal(true);
  };

  const handleSaveEdit = (field, value) => {
    setCurrentData((prev) => ({ ...prev, [field]: value }));
    setShowEditModal(false);
    setEditingField(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: currentData.title,
        raw: currentData.description,
        category: "687", // Default category
        tags: ["questions", "api-migration", "test-plm"], // Default tags
        archetype: "regular",
        target_recipients: getCurrentUser()?.username || 'guest',
      };
      // const response = await fetch(
      //   `https://api.allorigins.win/raw?url=${encodeURIComponent(
      //     process.env.REACT_APP_DISCOURSE_BASE_URL + "/posts.json"
      //   )}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Api-Key": process.env.REACT_APP_DISCOURSE_API_KEY,
      //       "Api-Username": process.env.REACT_APP_DISCOURSE_API_USERNAME,
      //     },
      //     body: JSON.stringify(payload),
      //   }
      // );

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      alert("Post submitted successfully!");
      const baseUrl = process.env.REACT_APP_DISCOURSE_BASE_URL || 'https://easihub.com';
      window.open(`${baseUrl}/t/${data.topic_slug}/${data.topic_id}`, '_blank');
      window.history.pushState({}, '', '/');
      window.location.reload();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit post: " + error.message);
    }
  };

  return (
    <div className="smart-post-card">
      <div className="step">
        <h2 className="heading">Review & Submit</h2>

        <div className="review-box">
          <p>
            <strong>Post Type:</strong> {currentData.type}
          </p>

          <p>
            <strong>Title:</strong> {currentData.title}
            <span
              className="edit-btn active"
              onClick={() => handleEdit("title")}
              style={{
                marginLeft: "0.5rem",
                cursor: "pointer",
                color: "#667eea",
              }}
            >
              Edit
            </span>
          </p>

          <div className="desc-container">
            <p>
              <strong>Description:</strong>
            </p>
            <div className="desc-content">
              <p style={{ whiteSpace: "pre-wrap" }}>
                {currentData.description}
              </p>
              <span
                className="edit-btn active"
                onClick={() => handleEdit("description")}
                style={{ cursor: "pointer", color: "#667eea" }}
              >
                Edit
              </span>
            </div>
          </div>

          <p>
            <strong>Domain:</strong> <span>(AI detected)</span>
          </p>
          <p>
            <strong>Software:</strong> <span>(AI detected)</span>
          </p>
          <p>
            <strong>Technical Area:</strong> <span>(AI detected)</span>
          </p>
          <p>
            <strong>Tags:</strong> <span>(auto-generated)</span>
          </p>
        </div>

        <div className="button-row">
          <button className="nav-btn" onClick={onBack}>
            ← Back
          </button>
          <button className="nav-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditModal
          field={editingField}
          value={currentData[editingField]}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default ReviewSubmitStep;
