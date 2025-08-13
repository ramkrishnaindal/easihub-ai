import React, { useState } from "react";
import AnswerDisplay from "../shared/AnswerDisplay";

const AskDocsPage = () => {
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const askFromDocs = async (question) => {
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    setAnswers([{ type: "question", content: question }]);

    try {
      const response = await fetch("/api/doc-api/ask-docs", {
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
              console.log('Parsed data:', data);
              
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

      console.log('Setting answer:', { result, sources });
      setAnswers((prev) => [
        ...prev,
        { type: "answer", content: result, sources },
      ]);
    } catch (error) {
      console.error("Ask docs error:", error);
      setAnswers((prev) => [
        ...prev,
        { type: "error", content: `Error: ${error.message}` },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      askFromDocs(input);
      setInput("");
    }
  };

  console.log('Current answers:', answers);
  
  return (
    <div className="ai-body">
      <div id="answers">
        {answers.map((answer, index) => (
          <AnswerDisplay key={index} answer={answer} />
        ))}
        {isAsking && (
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
            placeholder="Ask about documentation..."
            autoComplete="off"
          />
          <button id="ask-btn" type="submit" disabled={isAsking}>
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskDocsPage;
