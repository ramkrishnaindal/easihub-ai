import React, { useState } from "react";
import AnswerDisplay from "../shared/AnswerDisplay";

const SearchAssistPage = () => {
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchForAnswers = async (question) => {
    if (!question.trim() || isSearching) return;

    setIsSearching(true);
    setAnswers([{ type: "question", content: question }]);

    try {
      const response = await fetch("/api/doc-api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let sources = [];
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (let line of lines) {
          line = line.trim();
          if (!line.startsWith("data:")) continue;

          const dataStr = line.replace(/^data:\s*/, "");
          if (dataStr === "[DONE]") break;

          try {
            if (dataStr.trim()) {
              const data = JSON.parse(dataStr);
              
              // Handle different response formats
              if (data.answer) {
                result = data.answer;
                if (data.sources_with_summary) {
                  sources = data.sources_with_summary;
                }
              } else if (data.choices && data.choices[0]) {
                const choice = data.choices[0];
                if (choice.message && choice.message.content) {
                  result = choice.message.content;
                }
                
                // Handle sources from search_results
                if (data.search_results && data.search_results.length > 0) {
                  sources = data.search_results;
                }
              }
            }
          } catch (err) {
            console.error("Error parsing JSON:", err);
          }
        }
      }

      setAnswers((prev) => [
        ...prev,
        { type: "answer", content: result, sources },
      ]);
    } catch (error) {
      console.error("Search error:", error);
      setAnswers((prev) => [
        ...prev,
        { type: "error", content: `Error: ${error.message}` },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      searchForAnswers(input);
      setInput("");
    }
  };

  return (
    <div className="ai-body">
      <div id="answers">
        {answers.map((answer, index) => (
          <AnswerDisplay key={index} answer={answer} />
        ))}
        {isSearching && (
          <div className="loading">
            <span>Thinking</span>
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        )}
      </div>

      <div id="chat-container">
        <form id="question-form" onSubmit={handleSubmit}>
          <input
            id="question-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            autoComplete="off"
          />
          <button id="ask-btn" type="submit" disabled={isSearching}>
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchAssistPage;
