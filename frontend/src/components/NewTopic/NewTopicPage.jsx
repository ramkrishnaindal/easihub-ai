import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getCurrentUser } from "../../utils/userUtils";

const NewTopicPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          raw: formData.content,
          category: formData.category,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          target_recipients: getCurrentUser()?.username || 'guest',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Topic created successfully!');
        const baseUrl = process.env.REACT_APP_DISCOURSE_BASE_URL || 'https://easihub.com';
        window.open(`${baseUrl}/t/${data.topic_slug}/${data.topic_id}`, '_blank');
        window.history.pushState({}, '', '/');
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(`Failed to create topic: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("Error creating topic: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily:
          "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: 1.6,
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "1200px", padding: "60px 40px" }}
      >
        <div className="text-center" style={{ marginBottom: "50px" }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create New Topic
          </h1>
          <p className="text-gray-600">
            Share your knowledge with the EASIHUB community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="What's your topic about?"
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                <option value="687">Questions</option>
                <option value="688">Use Cases</option>
                <option value="689">Discussions</option>
                <option value="690">Articles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="tag1, tag2, tag3"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write your topic content here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark"
            >
              {isSubmitting ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTopicPage;
