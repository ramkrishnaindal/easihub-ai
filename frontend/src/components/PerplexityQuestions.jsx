import React, { useEffect, useState } from "react";
import { marked } from "marked";
const PerplexityQuestions = () => {
  const [question, setQuestion] = useState;

  const formatContent = (rawText, sources) => {
    // Use marked if available, otherwise fallback to basic formatting
    let html;
    if (typeof marked !== "undefined") {
      html = marked.parse(rawText);
    } else {
      // Basic markdown-like formatting
      html = rawText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
    }

    // Replace citation numbers with links
    html = html.replace(/\[(\d+)\]/g, (match, num) => {
      const idx = parseInt(num, 10) - 1;
      if (sources && sources[idx]) {
        const summary = sources[idx].summary || "";
        return `<a href="${sources[idx].url}" class="source-link" data-tooltip="${summary}" target="_blank">[${num}]</a>`;
      }
      return match;
    });
    return html;
  };
  const renderAnswerStream = async function ({
    response,
    question,
    targetDiv,
  }) {
    console.log("renderAnswerStream called for targetDiv:", targetDiv.id);

    // More robust check for existing container
    const existingContainer = targetDiv.querySelector(".answer-container");
    if (existingContainer) {
      console.log(
        "DUPLICATE DETECTED: Answer container already exists, aborting render"
      );
      return;
    }

    console.log("Creating new answer container...");

    const answerContainer = document.createElement("div");
    answerContainer.className = "answer-container";
    answerContainer.setAttribute("data-created", Date.now());

    const tabs = document.createElement("div");
    tabs.className = "tabs";

    const contentTab = document.createElement("button");
    contentTab.className = "tab-btn active";
    contentTab.textContent = "Answer";

    const sourcesTab = document.createElement("button");
    sourcesTab.className = "tab-btn";
    sourcesTab.textContent = "Sources (0)";

    tabs.appendChild(contentTab);
    tabs.appendChild(sourcesTab);
    answerContainer.appendChild(tabs);

    const contentContent = document.createElement("div");
    contentContent.className = "tab-content";
    contentContent.id = "content-tab";

    const sourcesContent = document.createElement("div");
    sourcesContent.className = "tab-content";
    sourcesContent.id = "sources-tab";
    sourcesContent.style.display = "none";

    contentContent.innerHTML = `<div class="loading"><span>Thinking</span><div class="loading-dots"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div></div>`;
    sourcesContent.innerHTML = `<div class="no-sources">No sources available</div>`;

    answerContainer.appendChild(contentContent);
    answerContainer.appendChild(sourcesContent);
    targetDiv.appendChild(answerContainer);

    console.log("Container created and appended");

    function showTab(tabName) {
      if (tabName === "content") {
        contentContent.style.display = "block";
        sourcesContent.style.display = "none";
        contentTab.classList.add("active");
        sourcesTab.classList.remove("active");
      } else {
        contentContent.style.display = "none";
        sourcesContent.style.display = "block";
        contentTab.classList.remove("active");
        sourcesTab.classList.add("active");
      }
    }

    contentTab.onclick = () => showTab("content");
    sourcesTab.onclick = () => showTab("sources");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    let sources = [];
    let buffer = "";
    let dataCount = 0;
    let hasProcessedCompleteResponse = false;

    try {
      while (true) {
        const { value, done } = await reader.read();

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (let line of lines) {
          line = line.trim();
          if (!line.startsWith("data:")) continue;

          const dataStr = line.replace(/^data:\s*/, "");
          if (dataStr === "[DONE]") {
            break;
          }

          try {
            if (dataStr.trim()) {
              const data = JSON.parse(dataStr);
              dataCount++;

              // Debug: Log the entire data object structure

              // Handle complete response structure (Perplexity format)
              if (data.answer && !hasProcessedCompleteResponse) {
                hasProcessedCompleteResponse = true;

                result = data.answer;
                const loading = contentContent.querySelector(".loading");
                if (loading) loading.remove();

                // Handle sources if available
                if (
                  data.sources_with_summary &&
                  Array.isArray(data.sources_with_summary) &&
                  data.sources_with_summary.length > 0
                ) {
                  sources = data.sources_with_summary.map((src) => ({
                    title: src.url || "Unknown Source",
                    url: src.url || "#",
                    summary: src.summary || "",
                  }));

                  sourcesTab.textContent = `Sources (${sources.length})`;
                  sourcesContent.innerHTML = `<div class="sources-list">${sources
                    .map(
                      (src, i) => `
                                    <div class="source-item">
                                        <div class="source-number">${
                                          i + 1
                                        }</div>
                                        <div class="source-info">
                                            <div class="source-title">${
                                              src.title || `Source ${i + 1}`
                                            }</div>
                                            <a href="${
                                              src.url
                                            }" class="source-url" target="_blank">${
                        src.url
                      }</a>
                                            ${
                                              src.summary
                                                ? `<div class="source-summary">${src.summary}</div>`
                                                : ""
                                            }
                                        </div>
                                    </div>`
                    )
                    .join("")}</div>`;
                }
              } else if (data.answer && hasProcessedCompleteResponse) {
                console.log("Ignoring duplicate complete answer");
              } else if (
                data.choices &&
                data.choices[0] &&
                data.choices[0].message &&
                data.choices[0].message.content &&
                !hasProcessedCompleteResponse
              ) {
                // Handle complete response in message format
                hasProcessedCompleteResponse = true;

                result = data.choices[0].message.content;
                const loading = contentContent.querySelector(".loading");
                if (loading) loading.remove();

                // Handle sources from search_results
                if (data.search_results && data.search_results.length > 0) {
                  sources = data.search_results.map((src) => ({
                    title: src.title || src.url || "Unknown Source",
                    url: src.url || "#",
                    summary: src.summary || "",
                  }));

                  sourcesTab.textContent = `Sources (${sources.length})`;
                  sourcesContent.innerHTML = `<div class="sources-list">${sources
                    .map(
                      (src, i) => `
                                    <div class="source-item">
                                        <div class="source-number">${
                                          i + 1
                                        }</div>
                                        <div class="source-info">
                                            <div class="source-title">${
                                              src.title || `Source ${i + 1}`
                                            }</div>
                                            <a href="${
                                              src.url
                                            }" class="source-url" target="_blank">${
                        src.url
                      }</a>
                                            ${
                                              src.summary
                                                ? `<div class="source-summary">${src.summary}</div>`
                                                : ""
                                            }
                                        </div>
                                    </div>`
                    )
                    .join("")}</div>`;
                }
              } else {
                // Handle streaming format (OpenAI-style)
                let textDelta = "";
                if (data.choices && data.choices[0]) {
                  if (data.choices[0].delta && data.choices[0].delta.content) {
                    textDelta = data.choices[0].delta.content;
                  } else if (
                    data.choices[0].message &&
                    data.choices[0].message.content
                  ) {
                    textDelta = data.choices[0].message.content;
                  }
                }

                if (textDelta) {
                  result += textDelta;
                  const loading = contentContent.querySelector(".loading");
                  if (loading) loading.remove();

                  const formattedContent = formatContent(result, sources);
                  contentContent.innerHTML = `<div class="answer-text">${formattedContent}</div>`;
                }

                // Handle sources from search results
                if (
                  data.search_results &&
                  data.search_results.length > 0 &&
                  sources.length === 0
                ) {
                  sources = data.search_results.map((src) => ({
                    title: src.title || src.url || "Unknown Source",
                    url: src.url || "#",
                    summary: src.summary || "",
                  }));

                  sourcesTab.textContent = `Sources (${sources.length})`;
                  sourcesContent.innerHTML = `<div class="sources-list">${sources
                    .map(
                      (src, i) => `
                                    <div class="source-item">
                                        <div class="source-number">${
                                          i + 1
                                        }</div>
                                        <div class="source-info">
                                            <div class="source-title">${
                                              src.title || `Source ${i + 1}`
                                            }</div>
                                            <a href="${
                                              src.url
                                            }" class="source-url" target="_blank">${
                        src.url
                      }</a>
                                            ${
                                              src.summary
                                                ? `<div class="source-summary">${src.summary}</div>`
                                                : ""
                                            }
                                        </div>
                                    </div>`
                    )
                    .join("")}</div>`;

                  contentContent.innerHTML = `<div class="answer-text">${formatContent(
                    result,
                    sources
                  )}</div>`;
                }
              }
            }
          } catch (err) {
            console.error(
              "Error parsing JSON:",
              err,
              "Data preview:",
              dataStr.substring(0, 100)
            );
          }
        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
    }

    if (sources.length === 0) {
      sourcesContent.innerHTML = `<div class="no-sources">No sources available for this query</div>`;
    }

    // Initialize tooltips only once at the end
    // initTooltips();
  };
  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const resp = await fetch("/api/doc-api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        if (!resp.ok) throw new Error("Network response was not ok");

        await renderAnswerStream({
          response: resp,
          question: question,
          targetDiv: answersDiv,
        });

        return resp;
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request was aborted");
          return;
        }

        const errorDiv = document.createElement("div");
        errorDiv.className = "error";
        errorDiv.textContent = `Error: ${error.message}`;
        answersDiv.appendChild(errorDiv);
        throw error;
      } finally {
        isSearching = false;
      }
    };
    fetchAnswer();
  }, [renderAnswerStream]);
  return (
    <div id="searchAssistPage" class="ai-content-section" style="display:none;">
      <div class="ai-body">
        <div id="answers"></div>
        <div id="chat-container">
          <form id="question-form">
            <input
              id="question-input"
              type="text"
              placeholder="Ask something..."
              autocomplete="off"
            />
            <button type="submit" id="ask-btn">
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerplexityQuestions;
