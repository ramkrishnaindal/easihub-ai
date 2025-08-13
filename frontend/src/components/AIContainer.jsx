import React, { useEffect, useCallback } from "react";
import { marked } from "marked";
import "../../src/front-end-ui-css.css";
const AIContainer = () => {
  let editingField = null;
  function initializeSmartPost(aiContainer, elements) {
    // Helper for switching smart post steps
    window.switchSmartStep = function (event, stepId) {
      if (event && event.target.classList.contains("disabled")) return;

      const tabs = aiContainer.querySelectorAll("#smartPostSteps .ai-tab");
      tabs.forEach((t) => t.classList.remove("active"));
      if (event && event.target) event.target.classList.add("active");

      const stepIds = ["create", "describe", "submit"];
      stepIds.forEach((id) => {
        const el = aiContainer.querySelector(`#smartStep${capitalize(id)}`);
        if (el) el.style.display = id === stepId ? "block" : "none";
      });
    };

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Smart Post card selection logic
    let selectedType = "";
    window.selectCard = function (card, type) {
      const wasSelected = card.classList.contains("selected");
      const cards = aiContainer.querySelectorAll(".card");
      cards.forEach((c) => c.classList.remove("selected"));

      if (!wasSelected) {
        card.classList.add("selected");
        const input = elements.postTitle;
        input.placeholder = placeholderMap[type] || "";

        // Check for stored easibot input
        const easibotInput = localStorage.getItem("easibot_smart_post_input");
        if (easibotInput && !input.value) {
          input.value = easibotInput;
          localStorage.removeItem("easibot_smart_post_input");
        }

        updateNextButton();

        // Use more efficient event handling
        if (!input.hasAttribute("data-listener-attached")) {
          input.addEventListener("input", updateNextButton);
          input.setAttribute("data-listener-attached", "true");
        }

        selectedType = type;
      } else {
        elements.postTitle.value = "";
        elements.toStep2.setAttribute("disabled", "true");
        selectedType = "";
      }
    };

    function updateNextButton() {
      const isValid = elements.postTitle.value.length >= 5;
      elements.toStep2.toggleAttribute("disabled", !isValid);
    }

    window.handleNext = function () {
      const type = selectedType;
      const title = elements.postTitle.value;
      localStorage.setItem("ai_post_type", type);
      localStorage.setItem("ai_post_title", title);

      // Enable Describe tab
      const describeTab = aiContainer.querySelector(
        ".ai-sub-tabs .ai-tab:nth-child(2)"
      );
      describeTab.classList.remove("disabled");
      describeTab.click();
      aiContainer.querySelector(
        "#step2Header"
      ).innerText = `${type} – Describe Your Post`;
      renderStep2Fields(type, aiContainer);
    };

    window.startPostingAI = function () {
      elements.launcherPanel.style.display = "none";
      elements.smartPostSteps.style.display = "block";
    };

    window.startPostingManual = function () {
      elements.launcherPanel.style.display = "none";
      aiContainer.classList.remove("active");
      setTimeout(() => {
        if (aiContainer && aiContainer.parentNode) aiContainer.remove();
        const overlayEl = document.querySelector(".ai-panel-overlay");
        if (overlayEl && overlayEl.parentNode) overlayEl.remove();
      }, 400);
    };

    // Smart Post placeholder map
    const placeholderMap = {
      Question: "e.g., How to integrate SAP with Power BI?",
      "Use Case": "e.g., Automating invoice validation using RPA",
      Discussion: "e.g., Best architecture for hybrid cloud setup?",
      Article: "e.g., 7 Lessons Learned from SAP S/4HANA Migration",
      Job: "e.g., SAP Consultant – Remote | 6 months",
      Event: "e.g., Tech Talk: Digital Thread in PLM",
      Bulletin: "e.g., Oracle Patch Update – April 2025",
    };

    // Describe tab logic with better performance
    function buildField(label, placeholder, id = "") {
      return `<label class="textarea-desc">${label}</label><br>
        <textarea class="textarea-box" placeholder="${placeholder}" ${
        id ? `id="${id}"` : ""
      }></textarea>`;
    }

    function renderStep2Fields(type, container) {
      let contentHTML = "";
      switch (type.toLowerCase()) {
        case "question":
          contentHTML =
            buildField(
              "Step 2: Problem Details",
              "Describe domain/software/tech area, version, specific error, API or module you're working with...",
              "step2Desc"
            ) +
            buildField(
              "Step 3: Attempted Solutions",
              "What configurations, code, logic or solution have you already attempted and what were the results?"
            );
          break;
        case "use case":
          contentHTML =
            buildField(
              "Step 2: Problem & Objective",
              "Explain the business or technical challenge, and your goal or what needed to be solved...",
              "step2Desc"
            ) +
            buildField(
              "Step 3: Solution & Implementation",
              "Describe APIs, scripts, tools, configuration, or integrations used to implement the solution..."
            );
          break;
        case "discussion":
          contentHTML =
            buildField(
              "Step 2: Background & Context",
              "Briefly explain the system, problem, or scenario you're thinking through...",
              "step2Desc"
            ) +
            buildField(
              "Step 3: Insight You're Seeking",
              "Are you seeking opinions, strategies, architecture trade-offs, or experience-based input?"
            );
          break;
        case "article":
          contentHTML = buildField(
            "Step 2: Article Content or External URL",
            "Write your content here (Markdown/HTML) or paste an article URL (e.g., https://yourdomain.com/article123)",
            "step2Desc"
          );
          break;
        case "event":
          contentHTML = buildField(
            "Step 2: Event Overview or URL",
            "Provide event details or paste registration link...",
            "step2Desc"
          );
          break;
        case "bulletin":
          contentHTML =
            buildField(
              "Step 2: Bulletin Summary",
              'Summarize the purpose of this bulletin. Example: "Oracle released a quarterly patch update affecting middleware."',
              "step2Desc"
            ) +
            buildField(
              "Step 3: Important Details or Impact",
              "Provide links, release notes, impacted versions, or timing. Include key highlights or urgency."
            );
          break;
        case "job":
          contentHTML =
            buildField(
              "Step 2: Responsibilities",
              "List duties and job role expectations...",
              "step2Desc"
            ) +
            buildField(
              "Step 3: Qualifications/Apply Info",
              "Application link, email, or required skills..."
            );
          break;
        case "feedback":
          contentHTML = buildField(
            "Step 2: Feedback Details",
            "Drop your feedback here — big or small, we care about it all!",
            "step2Desc"
          );
          break;
        default:
          contentHTML = "<p>No template found for this type.</p>";
      }

      const fieldsContainer = container.querySelector("#step2Fields");
      fieldsContainer.innerHTML = contentHTML;

      // Use event delegation instead of attaching to each textarea
      fieldsContainer.addEventListener("input", function (e) {
        if (e.target.tagName === "TEXTAREA") {
          const textareas = fieldsContainer.querySelectorAll("textarea");
          const allFilled = Array.from(textareas).every(
            (el) => el.value.length > 10
          );
          container.querySelector("#toStep3").disabled = !allFilled;
        }
      });
    }

    // Rest of smart post functions with minor optimizations
    window.handleNextDesc = function () {
      const textareas = aiContainer.querySelectorAll(
        "#smartStepDescribe .step textarea"
      );
      const descs = Array.from(textareas)
        .map((el) => el.value.trim())
        .filter(Boolean);

      const desc = descs.join("\n");
      localStorage.setItem("ai_post_desc", desc);

      const reviewTab = aiContainer.querySelector(
        "#smartPostSteps .ai-tab:nth-child(3)"
      );
      if (reviewTab) {
        reviewTab.classList.remove("disabled");
        reviewTab.click();
        aiContainer.querySelector("#reviewType").innerText =
          localStorage.getItem("ai_post_type") || "";
        aiContainer.querySelector("#reviewTitle").innerText =
          localStorage.getItem("ai_post_title") || "";
        aiContainer.querySelector("#reviewDesc").innerText = desc;
      }
    };

    window.handleBackDesc = function () {
      const selectTab = aiContainer.querySelector(
        "#smartPostSteps .ai-tab:nth-child(1)"
      );
      if (selectTab) selectTab.click();
    };

    const submitPost = function () {
      const type = localStorage.getItem("ai_post_type");
      const title = localStorage.getItem("ai_post_title");
      const description = localStorage.getItem("ai_post_desc");
      const cat_id = "687";
      const tags = ["questions", "api-migration", "test-plm"];
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      ).content;

      const payload = {
        title: title,
        raw: description,
        category: cat_id,
        tags: tags,
        archetype: "regular",
        target_recipients: JSON.parse(localStorage.getItem('currentUser') || '{}').username || 'guest',
      };

      fetch("https://easihub.com/posts.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
        credentials: "same-origin",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          alert("Post submitted successfully!");
          const baseUrl = process.env.REACT_APP_DISCOURSE_BASE_URL || 'https://easihub.com';
          window.open(`${baseUrl}/t/${data.topic_slug}/${data.topic_id}`, '_blank');
          window.history.pushState({}, '', '/');
          window.location.reload();
        })
        .catch((error) => {
          alert("Failed to submit post: " + error.message);
        });
    };

    const handleBack = function () {
      const describeTab = aiContainer.querySelector(
        "#smartPostSteps .ai-tab:nth-child(2)"
      );
      if (describeTab) describeTab.click();
    };

    // Modal handling
    let editingField = null;

    function handleEditClick(btn) {
      editingField = btn.getAttribute("data-edit");
      const modal = elements.editModal;
      const textarea = modal.querySelector("textarea");

      if (editingField === "title") {
        textarea.value = localStorage.getItem("ai_post_title") || "";
      } else if (editingField === "desc") {
        textarea.value = localStorage.getItem("ai_post_desc") || "";
      }
      modal.style.display = "flex";
    }

    function handleSaveClick() {
      const modal = elements.editModal;
      const textarea = modal.querySelector("textarea");
      const newValue = textarea.value.trim();

      if (!newValue) return;

      if (editingField === "title") {
        localStorage.setItem("ai_post_title", newValue);
        aiContainer.querySelector("#reviewTitle").innerText = newValue;
      } else if (editingField === "desc") {
        localStorage.setItem("ai_post_desc", newValue);
        aiContainer.querySelector("#reviewDesc").innerText = newValue;
      }

      modal.style.display = "none";
      editingField = null;
    }

    const closeModal = function () {
      elements.editModal.style.display = "none";
      editingField = null;
    };
  }
  // Initialize tooltips for citation hover - improved version
  function initTooltips() {
    // Remove existing tooltips first
    document
      .querySelectorAll(".citation-tooltip")
      .forEach((tooltip) => tooltip.remove());

    // Remove existing event listeners by cloning nodes
    document.querySelectorAll(".source-link").forEach((link) => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
    });

    // Add fresh event listeners
    document.querySelectorAll(".source-link").forEach((link) => {
      link.addEventListener("mouseenter", function (e) {
        const tooltip = this.getAttribute("data-tooltip");
        if (!tooltip || tooltip.trim() === "") return;

        // Remove any existing tooltips
        document
          .querySelectorAll(".citation-tooltip")
          .forEach((t) => t.remove());

        const tooltipEl = document.createElement("div");
        tooltipEl.className = "citation-tooltip";
        tooltipEl.textContent = tooltip;
        tooltipEl.style.position = "absolute";
        tooltipEl.style.backgroundColor = "#333";
        tooltipEl.style.color = "white";
        tooltipEl.style.padding = "8px 12px";
        tooltipEl.style.borderRadius = "4px";
        tooltipEl.style.fontSize = "12px";
        tooltipEl.style.maxWidth = "200px";
        tooltipEl.style.zIndex = "1000";
        tooltipEl.style.pointerEvents = "none";
        tooltipEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

        document.body.appendChild(tooltipEl);

        const linkRect = this.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();

        // Position tooltip above the link, centered
        let left = linkRect.left + linkRect.width / 2 - tooltipRect.width / 2;
        let top = linkRect.top - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
          left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
          top = linkRect.bottom + 10; // Show below if no space above
        }

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;
      });

      link.addEventListener("mouseleave", function () {
        setTimeout(() => {
          document
            .querySelectorAll(".citation-tooltip")
            .forEach((t) => t.remove());
        }, 100);
      });
    });
  }
  function initializeCopilot(aiContainer) {
    // const userInfo = api.getCurrentUser();
    // const userProfile = userInfo?.avatar_template;

    // const PROFILE_CONFIG = {
    //   user: {
    //     imageUrl: userProfile,
    //     fallbackText: 'U',
    //     fallbackColor: '#4F46E5'
    //   },
    //   bot: {
    //     imageUrl: 'https://cdn.easihub.com/uploads/default/original/1X/ef2da94754050869cd287944bce52d5c30f4ef18.jpeg',
    //     fallbackText: 'AI',
    //     fallbackColor: '#10B981'
    //   }
    // };

    // function createProfileImage(sender) {
    //   const config = PROFILE_CONFIG[sender];
    //   const profileImg = document.createElement('img');
    //   profileImg.className = 'copilot-profile-img';

    //   profileImg.onerror = function() {
    //     this.style.display = 'none';
    //     const fallbackDiv = document.createElement('div');
    //     fallbackDiv.className = 'copilot-profile-fallback';
    //     fallbackDiv.textContent = config.fallbackText;
    //     fallbackDiv.style.cssText = `
    //       width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center;
    //       justify-content: center; color: white; font-weight: bold; font-size: 12px;
    //       background-color: ${config.fallbackColor}; flex-shrink: 0;
    //     `;
    //     this.parentNode.replaceChild(fallbackDiv, this);
    //   };

    //   profileImg.src = config.imageUrl;
    //   profileImg.alt = sender === 'user' ? 'User' : 'Bot';
    //   return profileImg;
    // }

    function appendCopilotMessage(text, sender) {
      const chatBody = aiContainer.querySelector("#copilotChatBody");
      const msgDiv = document.createElement("div");
      msgDiv.className =
        "copilot-message " + (sender === "user" ? "user" : "bot");

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const messageContainer = document.createElement("div");
      messageContainer.className = "copilot-message-container";

      // const profileImg = createProfileImage(sender);
      const bubble = document.createElement("div");
      bubble.className =
        "copilot-bubble " + (sender === "user" ? "user" : "bot");
      bubble.innerText = text;

      const timeElement = document.createElement("span");
      timeElement.className = "copilot-timestamp";
      timeElement.innerText = timestamp;

      // messageContainer.appendChild(profileImg);
      messageContainer.appendChild(bubble);
      messageContainer.appendChild(timeElement);
      msgDiv.appendChild(messageContainer);
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    const copilotInput = aiContainer.querySelector("#copilotInput");
    const copilotSendBtn = aiContainer.querySelector("#copilotSendBtn");

    function generateSessionId() {
      return (
        "user_" + Math.random().toString(36).substr(2, 16) + "_" + Date.now()
      );
    }

    let sessionId = generateSessionId();
    let messageCounter = 0;

    function sendCopilotMessage() {
      const msg = copilotInput.value.trim();
      if (!msg) return;

      appendCopilotMessage(msg, "user");
      copilotInput.value = "";

      messageCounter++;
      const loadingId = `loadingMessage_${messageCounter}`;
      const streamingId = `streamingMessage_${messageCounter}`;
      const streamingBubbleId = `streamingBubble_${messageCounter}`;

      const chatBody = aiContainer.querySelector("#copilotChatBody");
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "copilot-message bot loading";
      loadingDiv.id = loadingId;

      const messageContainer = document.createElement("div");
      messageContainer.className = "copilot-message-container";

      // const profileImg = createProfileImage('bot');
      const bubble = document.createElement("div");
      bubble.className = "copilot-bubble bot";
      bubble.innerText = "Typing...";

      const timeElement = document.createElement("span");
      timeElement.className = "copilot-timestamp";
      timeElement.innerText = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // messageContainer.appendChild(profileImg);
      messageContainer.appendChild(bubble);
      messageContainer.appendChild(timeElement);
      loadingDiv.appendChild(messageContainer);
      chatBody.appendChild(loadingDiv);
      chatBody.scrollTop = chatBody.scrollHeight;

      fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer easihub-4f00fa05-d242-4ac7-9872-904e4391be0b",
        },
        body: JSON.stringify({
          session_id: sessionId,
          query: msg,
        }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const loadingElement = aiContainer.querySelector("#" + loadingId);
          if (loadingElement) loadingElement.remove();

          const streamingMsgDiv = document.createElement("div");
          streamingMsgDiv.className = "copilot-message bot";
          streamingMsgDiv.id = streamingId;

          const messageContainer = document.createElement("div");
          messageContainer.className = "copilot-message-container";

          // const profileImg = createProfileImage('bot');
          const bubble = document.createElement("div");
          bubble.className = "copilot-bubble bot";
          bubble.id = streamingBubbleId;
          bubble.innerHTML = '<span class="cursor">|</span>';

          const timeElement = document.createElement("span");
          timeElement.className = "copilot-timestamp";
          timeElement.innerText = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // messageContainer.appendChild(profileImg);
          messageContainer.appendChild(bubble);
          messageContainer.appendChild(timeElement);
          streamingMsgDiv.appendChild(messageContainer);
          chatBody.appendChild(streamingMsgDiv);
          chatBody.scrollTop = chatBody.scrollHeight;

          return response.text();
        })
        .then((responseText) => {
          const lines = responseText.split("\n");
          let fullResponse = "";
          let index = 0;

          function processNextChunk() {
            if (index >= lines.length) {
              const streamingBubble = aiContainer.querySelector(
                "#" + streamingBubbleId
              );
              if (streamingBubble) {
                streamingBubble.innerHTML =
                  fullResponse || "No response received";
              }
              return;
            }

            const line = lines[index].trim();
            index++;

            if (line.startsWith("data: ")) {
              let jsonStr;
              try {
                jsonStr = line.substring(6);
                const data = JSON.parse(jsonStr);

                if (data.chunk && data.type === "content") {
                  fullResponse += data.chunk;
                  const streamingBubble = aiContainer.querySelector(
                    "#" + streamingBubbleId
                  );
                  if (streamingBubble) {
                    streamingBubble.innerHTML =
                      fullResponse + '<span class="cursor">|</span>';
                    chatBody.scrollTop = chatBody.scrollHeight;
                  }
                }
              } catch (e) {
                console.warn("Failed to parse JSON:", jsonStr, e);
              }
            }

            setTimeout(processNextChunk, 50);
          }

          processNextChunk();
        })
        .catch((error) => {
          const loadingElement = aiContainer.querySelector("#" + loadingId);
          if (loadingElement) loadingElement.remove();

          const streamingElement = aiContainer.querySelector("#" + streamingId);
          if (streamingElement) streamingElement.remove();

          console.error("Fetch error:", error);
          appendCopilotMessage(
            "Sorry, I'm having trouble connecting to the server. Please try again.",
            "bot"
          );
        });
    }

    if (copilotSendBtn) {
      copilotSendBtn.onclick = sendCopilotMessage;
    }

    if (copilotInput) {
      copilotInput.onkeypress = function (e) {
        if (e.key === "Enter") sendCopilotMessage();
      };
    }
  }
  function formatContent(rawText, sources) {
    let html;
    if (typeof marked !== "undefined") {
      html = marked.parse(rawText);
    } else {
      html = rawText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
    }

    html = html.replace(/\[(\d+)\]/g, (match, num) => {
      const idx = parseInt(num, 10) - 1;
      if (sources && sources[idx]) {
        const summary = sources[idx].summary || "";
        return `<a href="${sources[idx].url}" class="source-link" data-tooltip="${summary}" target="_blank">[${num}]</a>`;
      }
      return match;
    });
    return html;
  }
  function initializeSearchAssist(aiContainer) {
    const answersDiv = aiContainer.querySelector("#answers");
    const form = aiContainer.querySelector("#question-form");
    const input = aiContainer.querySelector("#question-input");
    const askBtn = aiContainer.querySelector("#ask-btn");

    if (!answersDiv || !form || !input || !askBtn) return;

    function initTooltips() {
      document
        .querySelectorAll(".citation-tooltip")
        .forEach((tooltip) => tooltip.remove());

      document.querySelectorAll(".source-link").forEach((link) => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
      });

      document.querySelectorAll(".source-link").forEach((link) => {
        link.addEventListener("mouseenter", function (e) {
          const tooltip = this.getAttribute("data-tooltip");
          if (!tooltip || tooltip.trim() === "") return;

          document
            .querySelectorAll(".citation-tooltip")
            .forEach((t) => t.remove());

          const tooltipEl = document.createElement("div");
          tooltipEl.className = "citation-tooltip";
          tooltipEl.textContent = tooltip;
          tooltipEl.style.cssText = `
            position: absolute; background-color: #333; color: white; padding: 8px 12px;
            border-radius: 4px; font-size: 12px; max-width: 200px; z-index: 1000;
            pointer-events: none; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          `;

          document.body.appendChild(tooltipEl);

          const linkRect = this.getBoundingClientRect();
          const tooltipRect = tooltipEl.getBoundingClientRect();

          let left = linkRect.left + linkRect.width / 2 - tooltipRect.width / 2;
          let top = linkRect.top - tooltipRect.height - 10;

          if (left < 10) left = 10;
          if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
          }
          if (top < 10) {
            top = linkRect.bottom + 10;
          }

          tooltipEl.style.left = `${left}px`;
          tooltipEl.style.top = `${top}px`;
        });

        link.addEventListener("mouseleave", function () {
          setTimeout(() => {
            document
              .querySelectorAll(".citation-tooltip")
              .forEach((t) => t.remove());
          }, 100);
        });
      });
    }

    let controllerA = new AbortController();
    let isSearching = false;

    async function searchForAnswers(question) {
      if (!question || typeof question !== "string" || !question.trim()) {
        throw new Error("Question is required");
      }

      if (isSearching) return;

      isSearching = true;
      controllerA.abort();
      controllerA = new AbortController();

      answersDiv.innerHTML = "";

      const questionDiv = document.createElement("div");
      questionDiv.className = "question-display";
      questionDiv.innerHTML = `<div class="user-question-card">${question}</div>`;
      answersDiv.appendChild(questionDiv);

      try {
        const resp = await fetch("/api/doc-api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
          signal: controllerA.signal,
        });

        if (!resp.ok) throw new Error("Network response was not ok");

        await renderAnswerStream({
          response: resp,
          question: question,
          targetDiv: answersDiv,
        });

        return resp;
      } catch (error) {
        if (error.name === "AbortError") return;

        const errorDiv = document.createElement("div");
        errorDiv.className = "error";
        errorDiv.textContent = `Error: ${error.message}`;
        answersDiv.appendChild(errorDiv);
        throw error;
      } finally {
        isSearching = false;
      }
    }

    askBtn.addEventListener("click", async function () {
      const question = input.value.trim();
      if (!question || isSearching) return;

      this.disabled = true;

      try {
        await searchForAnswers(question);
        input.value = "";
      } catch (error) {
        console.error("Error in search button click:", error);
      } finally {
        this.disabled = false;
      }
    });

    form.onsubmit = function (e) {
      e.preventDefault();
      const question = input.value.trim();
      if (!question || isSearching) return;

      searchForAnswers(question)
        .then(() => {
          input.value = "";
        })
        .catch((error) => {
          console.error("Error in form submission:", error);
        });
    };

    // Render answer stream function
    const renderAnswerStream = async function ({
      response,
      question,
      targetDiv,
    }) {
      const existingContainer = targetDiv.querySelector(".answer-container");
      if (existingContainer) return;

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
      let hasProcessedCompleteResponse = false;

      try {
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

                if (data.answer && !hasProcessedCompleteResponse) {
                  hasProcessedCompleteResponse = true;
                  result = data.answer;
                  const loading = contentContent.querySelector(".loading");
                  if (loading) loading.remove();

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
                        <div class="source-number">${i + 1}</div>
                        <div class="source-info">
                          <div class="source-title">${
                            src.title || `Source ${i + 1}`
                          }</div>
                          <a href="${
                            src.url
                          }" class="source-url" target="_blank">${src.url}</a>
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

                  contentContent.innerHTML = `<div class="answer-text">${formatContent(
                    result,
                    sources
                  )}</div>`;
                }
              }
            } catch (err) {
              console.error("Error parsing JSON:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error reading stream:", error);
      }

      if (sources.length === 0) {
        sourcesContent.innerHTML = `<div class="no-sources">No sources available for this query</div>`;
      }

      initTooltips();
    };

    if (input) input.focus();
  }

  function initializeAskDocs(aiContainer) {
    const aiResponseDocsDiv = aiContainer.querySelector("#aiResponseDocs");
    const askDocsForm = aiContainer.querySelector("#ask-docs");
    const aiPromptDocs = aiContainer.querySelector("#aiPromptDocs");
    const aiSubmitDocs = aiContainer.querySelector("#aiSubmitDocs");

    if (!aiResponseDocsDiv || !askDocsForm || !aiPromptDocs || !aiSubmitDocs)
      return;

    let controllerB = new AbortController();
    let isAskingDocs = false;

    async function askFromDocs(question) {
      if (!question || typeof question !== "string" || !question.trim()) {
        throw new Error("Question is required");
      }

      if (isAskingDocs) return;

      isAskingDocs = true;
      controllerB.abort();
      controllerB = new AbortController();

      aiResponseDocsDiv.innerHTML = "";

      const questionDiv = document.createElement("div");
      questionDiv.className = "question-display";
      questionDiv.innerHTML = `<div class="user-question-card">${question}</div>`;
      aiResponseDocsDiv.appendChild(questionDiv);

      try {
        const resp = await fetch("/api/doc-api/ask-docs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
          signal: controllerB.signal,
        });

        if (!resp.ok) throw new Error("Network response was not ok");

        await renderDocsStream({ response: resp, question: question });

        return resp;
      } catch (error) {
        if (error.name === "AbortError") return;

        const errorDiv = document.createElement("div");
        errorDiv.className = "error";
        errorDiv.textContent = `Error: ${error.message}`;
        aiResponseDocsDiv.appendChild(errorDiv);
        throw error;
      } finally {
        isAskingDocs = false;
      }
    }

    aiSubmitDocs.addEventListener("click", async function () {
      const question = aiPromptDocs.value.trim();
      if (!question || isAskingDocs) return;

      this.disabled = true;

      try {
        await askFromDocs(question);
        aiPromptDocs.value = "";
      } catch (error) {
        console.error("Error in ask docs button click:", error);
      } finally {
        this.disabled = false;
      }
    });

    askDocsForm.onsubmit = function (e) {
      e.preventDefault();
      const question = aiPromptDocs.value.trim();
      if (!question || isAskingDocs) return;

      askFromDocs(question)
        .then(() => {
          aiPromptDocs.value = "";
        })
        .catch((error) => {
          console.error("Error in form submission:", error);
        });
    };

    // Similar renderDocsStream implementation as renderAnswerStream
    const renderDocsStream = async function ({ response, question }) {
      const existingContainer =
        aiResponseDocsDiv.querySelector(".answer-container");
      if (existingContainer) return;

      const answerContainer = document.createElement("div");
      answerContainer.className = "answer-container";
      answerContainer.setAttribute("data-created", Date.now());

      const tabs = document.createElement("div");
      tabs.className = "tabs";

      const answersTab = document.createElement("button");
      answersTab.className = "tab-btn active";
      answersTab.textContent = "Answer";

      const sourcesTab = document.createElement("button");
      sourcesTab.className = "tab-btn";
      sourcesTab.textContent = "Sources (0)";

      tabs.appendChild(answersTab);
      tabs.appendChild(sourcesTab);
      answerContainer.appendChild(tabs);

      const answersContent = document.createElement("div");
      answersContent.className = "tab-content";
      answersContent.id = "answers-tab";

      const sourcesContent = document.createElement("div");
      sourcesContent.className = "tab-content";
      sourcesContent.id = "sources-tab";
      sourcesContent.style.display = "none";

      answersContent.innerHTML = `<div class="loading"><span>Thinking</span><div class="loading-dots"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div></div>`;
      sourcesContent.innerHTML = `<div class="no-sources">No sources available</div>`;

      answerContainer.appendChild(answersContent);
      answerContainer.appendChild(sourcesContent);
      aiResponseDocsDiv.appendChild(answerContainer);

      function showTab(tabName) {
        if (tabName === "answers") {
          answersContent.style.display = "block";
          sourcesContent.style.display = "none";
          answersTab.classList.add("active");
          sourcesTab.classList.remove("active");
        } else {
          answersContent.style.display = "none";
          sourcesContent.style.display = "block";
          answersTab.classList.remove("active");
          sourcesTab.classList.add("active");
        }
      }

      answersTab.onclick = () => showTab("answers");
      sourcesTab.onclick = () => showTab("sources");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let sources = [];
      let buffer = "";
      let hasProcessedCompleteResponse = false;

      try {
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

                if (data.answer && !hasProcessedCompleteResponse) {
                  hasProcessedCompleteResponse = true;
                  result = data.answer;
                  const loading = answersContent.querySelector(".loading");
                  if (loading) loading.remove();

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
                        <div class="source-number">${i + 1}</div>
                        <div class="source-info">
                          <div class="source-title">${
                            src.title || `Source ${i + 1}`
                          }</div>
                          <a href="${
                            src.url
                          }" class="source-url" target="_blank">${src.url}</a>
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

                  answersContent.innerHTML = `<div class="answer-text">${formatContent(
                    result,
                    sources
                  )}</div>`;
                } else if (data.answer && hasProcessedCompleteResponse) {
                  console.log("Ignoring duplicate complete docs answer");
                } else if (
                  data.choices &&
                  data.choices[0] &&
                  data.choices[0].message &&
                  data.choices[0].message.content &&
                  !hasProcessedCompleteResponse
                ) {
                  hasProcessedCompleteResponse = true;
                  result = data.choices[0].message.content;
                  const loading = answersContent.querySelector(".loading");
                  if (loading) loading.remove();

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
                        <div class="source-number">${i + 1}</div>
                        <div class="source-info">
                          <div class="source-title">${
                            src.title || `Source ${i + 1}`
                          }</div>
                          <a href="${
                            src.url
                          }" class="source-url" target="_blank">${src.url}</a>
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

                  answersContent.innerHTML = `<div class="answer-text">${formatContent(
                    result,
                    sources
                  )}</div>`;
                } else {
                  // Handle streaming format
                  let textDelta = "";
                  if (data.choices && data.choices[0]) {
                    if (
                      data.choices[0].delta &&
                      data.choices[0].delta.content
                    ) {
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
                    const loading = answersContent.querySelector(".loading");
                    if (loading) loading.remove();
                    answersContent.innerHTML = `<div class="answer-text">${formatContent(
                      result,
                      sources
                    )}</div>`;
                  }

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
                        <div class="source-number">${i + 1}</div>
                        <div class="source-info">
                          <div class="source-title">${
                            src.title || `Source ${i + 1}`
                          }</div>
                          <a href="${
                            src.url
                          }" class="source-url" target="_blank">${src.url}</a>
                          ${
                            src.summary
                              ? `<div class="source-summary">${src.summary}</div>`
                              : ""
                          }
                        </div>
                      </div>`
                      )
                      .join("")}</div>`;

                    answersContent.innerHTML = `<div class="answer-text">${formatContent(
                      result,
                      sources
                    )}</div>`;
                  }
                }
              }
            } catch (err) {
              console.error(
                "Error parsing docs JSON:",
                err,
                "Data preview:",
                dataStr.substring(0, 100)
              );
            }
          }
        }
      } catch (error) {
        console.error("Error reading docs stream:", error);
      }

      if (sources.length === 0) {
        sourcesContent.innerHTML = `<div class="no-sources">No sources available for this query</div>`;
      }

      // Initialize tooltips using the same function as search assist
      initTooltips();
    };
  }

  const initializePanelLogic = useCallback((aiContainer) => {
    // Show landing page first
    showSection("landingPage");

    // Event delegation for better performance
    aiContainer.addEventListener("click", handlePanelClicks);

    // Pre-cache DOM elements
    const elements = {
      landingPage: aiContainer.querySelector("#landingPage"),
      tabbedPages: aiContainer.querySelector("#tabbedPages"),
      smartPostSteps: aiContainer.querySelector("#smartPostSteps"),
      launcherPanel: aiContainer.querySelector("#launcherPanel"),
      postTitle: aiContainer.querySelector("#postTitle"),
      toStep2: aiContainer.querySelector("#toStep2"),
      editModal: aiContainer.querySelector("#editModal"),
    };
    function handleSaveClick() {
      const modal = elements.editModal;
      const textarea = modal.querySelector("textarea");
      const newValue = textarea.value.trim();

      if (!newValue) return;

      if (editingField === "title") {
        localStorage.setItem("ai_post_title", newValue);
        aiContainer.querySelector("#reviewTitle").innerText = newValue;
      } else if (editingField === "desc") {
        localStorage.setItem("ai_post_desc", newValue);
        aiContainer.querySelector("#reviewDesc").innerText = newValue;
      }

      modal.style.display = "none";
      editingField = null;
    }
    function handleEditClick(btn) {
      editingField = btn.getAttribute("data-edit");
      const modal = elements.editModal;
      const textarea = modal.querySelector("textarea");

      if (editingField === "title") {
        textarea.value = localStorage.getItem("ai_post_title") || "";
      } else if (editingField === "desc") {
        textarea.value = localStorage.getItem("ai_post_desc") || "";
      }
      modal.style.display = "flex";
    }
    function handlePanelClicks(event) {
      const target = event.target;
      const closest = target.closest(
        ".ai-option, .ai-top-tabs .ai-tab, #closeAiPanelBtn, .edit-btn[data-edit], .save-btn"
      );

      if (!closest) return;

      if (closest.classList.contains("ai-option")) {
        const pageId = closest.getAttribute("data-page");
        showSection("tabbedPages");
        showTab(pageId);
        activateTab(pageId);
      } else if (
        closest.classList.contains("ai-tab") &&
        closest.parentElement.id === "mainTabs"
      ) {
        const pageId = closest.getAttribute("data-page");
        showTab(pageId);
        activateTab(pageId);
      } else if (closest.id === "closeAiPanelBtn") {
        closePanel(aiContainer);
      } else if (closest.classList.contains("edit-btn")) {
        handleEditClick(closest);
      } else if (closest.classList.contains("save-btn")) {
        handleSaveClick();
      }
    }

    function showSection(sectionId) {
      const sections = aiContainer.querySelectorAll(
        ".ai-content-section, #tabbedPages"
      );
      sections.forEach((div) => (div.style.display = "none"));
      const targetSection = aiContainer.querySelector("#" + sectionId);
      if (targetSection) {
        targetSection.style.display =
          sectionId === "tabbedPages" ? "block" : "flex";
      }
    }

    function showTab(pageId) {
      const tabs = aiContainer.querySelectorAll(".ai-content-section");
      tabs.forEach((div) => (div.style.display = "none"));
      const targetTab = aiContainer.querySelector("#" + pageId);
      if (targetTab) targetTab.style.display = "block";
    }

    function activateTab(pageId) {
      const tabs = aiContainer.querySelectorAll(".ai-top-tabs .ai-tab");
      tabs.forEach((tab) => tab.classList.remove("active"));
      const targetTab = aiContainer.querySelector(`#tab-${pageId}`);
      if (targetTab) targetTab.classList.add("active");
    }

    function closePanel(container) {
      container.classList.remove("active");
      setTimeout(() => {
        if (container && container.parentNode) container.remove();
        const overlayEl = document.querySelector(".ai-panel-overlay");
        if (overlayEl && overlayEl.parentNode) overlayEl.remove();
      }, 400);
    }

    // Initialize all other functionality
    initializeSmartPost(aiContainer, elements);
    initializeCopilot(aiContainer);
    initializeSearchAssist(aiContainer);
    initializeAskDocs(aiContainer);
  }, []);
  useEffect(() => {
    // Handler for all edit buttons
    let aiContainer = document.getElementById("aiPanelContainer");
    if (!aiContainer) return;
    aiContainer.querySelectorAll(".edit-btn[data-edit]").forEach((btn) => {
      btn.onclick = function (e) {
        editingField = btn.getAttribute("data-edit");
        const modal = document.getElementById("editModal");
        const textarea = modal.querySelector("textarea");
        // Populate textarea
        if (editingField === "title") {
          textarea.value = localStorage.getItem("ai_post_title") || "";
        } else if (editingField === "desc") {
          textarea.value = localStorage.getItem("ai_post_desc") || "";
        }
        modal.style.display = "flex";
      };
    });
  }, []);

  useEffect(() => {
    const aiContainer = document.getElementById("aiPanelContainer");
    initializePanelLogic(aiContainer);
  }, []);

  return (
    <div id="aiPanelContainer" class="ai-panel-container">
      <div class="ai-header">
        <span>
          Welcome to EASIHUB AI ✨ (Meet <strong>EASIBOT</strong>)
        </span>
        <span class="close-btn" id="closeAiPanelBtn" title="Close">
          –
        </span>
      </div>

      <div class="ai-panel-content" id="aiPanelContent">
        {/* <!-- Landing Page --> */}
        <div id="landingPage" class="ai-content-section">
          <div class="main-landing-container">
            <h1 id="greeting">Welcome 👋</h1>
            <div class="ai-hero-section">
              <h2 class="ai-intro-headline">
                Meet <span class="highlight">EASIBOT</span>
              </h2>
              <div class="ai-intro-wrapper">
                <p class="ai-intro-subtitle">
                  Your AI-powered assistant for ERP, CRM, PLM, SCM, BI, HCM &
                  more — crafted to help you explore, contribute, and grow on
                  <span class="highlight">EASIHUB</span>. From structured post
                  creation to smart documentation and AI-driven search, EASIBOT
                  accelerates your enterprise learning journey.
                </p>
                <img
                  src="https://cdn.easihub.com/uploads/default/original/1X/6244acc629fbf32028dd7c3558961b975bde2628.jpeg"
                  alt="EASIBOT Avatar"
                  class="easihub-avatar"
                />
              </div>
            </div>
            <div class="ai-grid">
              <div
                class="ai-option"
                data-page="smartPostPage"
                title="Auto-generate structured posts with titles, tags, and descriptions."
              >
                <i class="fas fa-pen"></i> Smart Post
              </div>
              <div
                class="ai-option"
                data-page="searchAssistPage"
                title="Explore community wisdom, bulletins, and enterprise insights with AI."
              >
                <i class="fas fa-search"></i> Search Assist
              </div>
              <div
                class="ai-option"
                data-page="copilotPage"
                title="Get step-by-step help, onboarding tips, and quick actions."
              >
                <i class="fas fa-comments"></i> Copilot
              </div>
              <div
                class="ai-option"
                data-page="askDocsPage"
                title="Search within documentation and get summarized answers."
              >
                <i class="fas fa-file-alt"></i> Ask with Docs
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Tabbed panel structure (hidden by default, shown after landing) --> */}
        <div id="tabbedPages" style="display:none;">
          <div class="ai-top-tabs" id="mainTabs">
            <div
              class="ai-tab"
              id="tab-smartPostPage"
              data-page="smartPostPage"
            >
              📝 Smart Post
            </div>
            <div
              class="ai-tab"
              id="tab-searchAssistPage"
              data-page="searchAssistPage"
            >
              🔍 Search Assist
            </div>
            <div class="ai-tab" id="tab-copilotPage" data-page="copilotPage">
              💬 Copilot
            </div>
            <div class="ai-tab" id="tab-askDocsPage" data-page="askDocsPage">
              📘 Ask with Docs
            </div>
          </div>
          {/* <!-- Smart Post Page --> */}
          <div
            id="smartPostPage"
            class="ai-content-section"
            style="display:none;"
          >
            <div class="launcher-panel" id="launcherPanel">
              <div class="sparkle" style="top: 50px; left: 8%;">
                ✨
              </div>
              <div class="sparkle" style="top: 140px; right: 12%;">
                ✨
              </div>
              <div class="sparkle" style="bottom: 160px; left: 20%;">
                ✨
              </div>
              <div class="sparkle" style="bottom: 100px; right: 28%;">
                ✨
              </div>
              <div class="sparkle" style="top: 320px; left: 48%;">
                ✨
              </div>
              <h1>Let's begin your next post!</h1>
              <p>
                Use the power of AI to guide you through posting questions,
                jobs, or use cases quickly and easily.
              </p>
              <button class="btn-get-started" onclick="startPostingAI()">
                Get started using AI
              </button>
              <button class="btn-without-ai" onclick="startPostingManual()">
                I'll do it without AI
              </button>
              <div class="disclaimer">
                Beta feature powered by EASIBOT (uses OpenAI API). Your use of
                this feature will be subject to{" "}
                <a
                  href="https://openai.com/policies/usage-policies"
                  target="_blank"
                >
                  OpenAI's Usage Policy
                </a>
                and our <a href="#">Privacy Terms</a>.
              </div>
            </div>
            <div id="smartPostSteps" style="display: none;">
              <div class="ai-sub-tabs">
                <div
                  class="ai-tab active"
                  onclick="switchSmartStep(event, 'create')"
                >
                  📝 Create Topic
                </div>
                <div
                  class="ai-tab disabled"
                  onclick="switchSmartStep(event, 'describe')"
                >
                  📄 Describe Topic
                </div>
                <div
                  class="ai-tab disabled"
                  onclick="switchSmartStep(event, 'submit')"
                >
                  ✅ Review & Submit
                </div>
              </div>
              <div
                id="smartStepCreate"
                class="smart-post-card"
                style="display: block;"
              >
                <div class="select-type">
                  <div class="sparkle" style="top: 50px; left: 2%;">
                    ✨
                  </div>
                  <div class="sparkle" style="top: 140px; right: 4%;">
                    ✨
                  </div>
                  <div class="sparkle" style="bottom: 160px; left: 20%;">
                    ✨
                  </div>
                  <div class="sparkle" style="bottom: 100px; right: 28%;">
                    ✨
                  </div>
                  <div class="sparkle" style="top: 320px; left: 48%;">
                    ✨
                  </div>
                  <div
                    class="title-input"
                    id="titleInputBox"
                    style="display:flex; flex-direction: column; justify-content: center; align-items: center; font-size: 16px;"
                  >
                    <label class="title-header">
                      <strong>Give your post a title:</strong>
                    </label>
                    <input
                      type="text"
                      id="postTitle"
                      placeholder=""
                      style="width: 90%; max-width: 600px; padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 8px; margin-top: 0.5rem;"
                    />
                  </div>
                  <div class="card-grid">
                    <div
                      class="card"
                      onclick="selectCard(this, 'Question')"
                      title="Ask about issues in ERP, PLM, CRM, or other enterprise platforms"
                    >
                      <div class="checkmark"></div>
                      <h3>
                        <i class="fas fa-question-circle icon"></i> Ask Question
                      </h3>
                      <p>
                        Get help from the EASIHUB community on implementation
                        errors, integration bugs, or deployment issues.
                      </p>
                    </div>
                    <div
                      class="card"
                      onclick="selectCard(this, 'Use Case')"
                      title="Describe enterprise software customization, configuration, or integrations you've implemented"
                    >
                      <div class="checkmark"></div>
                      <h3>
                        <i class="fas fa-briefcase icon"></i> Use Case
                      </h3>
                      <p>
                        Share practical examples of how enterprise software is
                        customized, configured, or deployed.
                      </p>
                    </div>
                    <div
                      class="card"
                      onclick="selectCard(this, 'Discussion')"
                      title="Start a debate or collect feedback on architectural or process choices"
                    >
                      <div class="checkmark"></div>
                      <h3>
                        <i class="fas fa-comments icon"></i> Discussion
                      </h3>
                      <p>
                        Engage peers in discussions around best practices,
                        trade-offs, or architecture decisions in enterprise
                        systems.
                      </p>
                    </div>
                    <div
                      class="card"
                      onclick="selectCard(this, 'Article')"
                      title="Share insights, how-to guides, or tutorials for the EASIHUB community"
                    >
                      <div class="checkmark"></div>
                      <h3>
                        <i class="fas fa-file-alt icon"></i> Article
                      </h3>
                      <p>
                        Contribute deep-dive articles or tutorials on enterprise
                        software, use cases, or tool comparisons.
                      </p>
                    </div>
                    <div
                      class="card"
                      onclick="selectCard(this, 'Job')"
                      title="Post enterprise tech jobs such as ERP consultants or PLM architects"
                    >
                      <div class="checkmark"></div>
                      <h3>
                        <i class="fas fa-briefcase-medical icon"></i> Job
                      </h3>
                      <p>
                        List open positions related to ERP, PLM, CRM, or
                        enterprise tech roles your team is hiring for.
                      </p>
                    </div>
                    <div
                      class="card"
                      onclick="selectCard(this, 'Event')"
                      title="Promote community events, webinars, or training sessions"
                    >
                      <div class="checkmark"></div>
                      <h3>
                        <i class="fas fa-calendar-alt icon"></i> Event
                      </h3>
                      <p>
                        Announce upcoming webinars, user group sessions, or tech
                        conferences relevant to enterprise platforms.
                      </p>
                    </div>
                    <div
                      class="card"
                      onclick="selectCard(this, 'Bulletin')"
                      title="Publish system announcements, vendor updates, or release alerts"
                    >
                      <div class="checkmark"></div>
                      <h3>
                        <i class="fas fa-bullhorn icon"></i> Bulletin
                      </h3>
                      <p>
                        Share vendor release notes, patch advisories, or
                        important updates affecting enterprise software users.
                      </p>
                    </div>
                  </div>
                  <div
                    class="button-row"
                    style="text-align:center; margin-top: 2rem;"
                  >
                    <button
                      class="nav-btn"
                      id="toStep2"
                      disabled
                      onclick="handleNext()"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
              <div
                id="smartStepDescribe"
                class="smart-post-card"
                style="display: none;"
              >
                <div class="step">
                  <h2 class="heading" id="step2Header">
                    Step 2 – Describe Your Post
                  </h2>
                  <div id="step2Fields"></div>
                  <div class="button-row">
                    <button class="nav-btn" onclick="handleBackDesc()">
                      ← Back
                    </button>
                    <button
                      class="nav-btn"
                      id="toStep3"
                      disabled
                      onclick="handleNextDesc()"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
              <div
                id="smartStepSubmit"
                class="smart-post-card"
                style="display: none;"
              >
                <div class="step">
                  <h2 class="heading">Review & Submit</h2>
                  <div class="review-box">
                    <p>
                      <strong>Post Type:</strong> <span id="reviewType"></span>
                    </p>
                    <p>
                      <strong>Title:</strong> <span id="reviewTitle"></span>{" "}
                      <span class="edit-btn active" data-edit="title">
                        Edit
                      </span>
                    </p>
                    <div class="desc-container">
                      <p>
                        <strong>Description:</strong>
                      </p>
                      <div class="desc-content">
                        <p id="reviewDesc" style="white-space:pre-wrap;"></p>
                        <span
                          class="edit-btn active"
                          id="editBtn"
                          data-edit="desc"
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
                      <strong>Technical Area:</strong>{" "}
                      <span>(AI detected)</span>
                    </p>
                    <p>
                      <strong>Tags:</strong> <span>(auto-generated)</span>
                    </p>
                  </div>
                  <div class="button-row">
                    <button class="nav-btn" onclick="handleBack()">
                      ← Back
                    </button>
                    <button class="nav-btn" onclick="submitPost()">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Search Assist Page --> */}
          <div
            id="searchAssistPage"
            class="ai-content-section"
            style="display:none;"
          >
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
          {/* <!-- Copilot Page --> */}
          <div
            id="copilotPage"
            class="ai-content-section"
            style="display:none;"
          >
            <div class="ai-body">
              <div class="chat-container">
                <div class="chat-header">
                  <h2>
                    You're talking with <strong>EASIbot</strong>
                  </h2>
                  <span>ENTERPRISE AI</span>
                </div>
                <div class="chat-body">
                  <div class="chat-message-ai">
                    <h3>Hi there!</h3>
                    <p>
                      Welcome to <strong>EASIHUB</strong>!
                    </p>
                    <p>
                      You're now talking with <strong>EASIbot</strong> — your
                      exclusive AI companion, purpose-built for enterprise
                      application professionals.
                    </p>
                    <p>
                      Whether you're a{" "}
                      <strong>
                        developer, consultant, architect, or project manager
                      </strong>
                      , I'm here to help you:
                    </p>
                    <ul class="custom-list">
                      <li>
                        Find solutions across ERP, CRM, PLM, SCM, MES, HCM, and
                        more
                      </li>
                      <li>Break down complex implementation questions</li>
                      <li>
                        Guide you to the right use cases, discussions, or expert
                        threads
                      </li>
                      <li>
                        Or just spark new ideas as you explore your enterprise
                        tech stack
                      </li>
                    </ul>
                    <p>
                      <em>
                        I'm still an experimental AI, so please go easy on me,
                        but I'm learning quickly and will keep getting better
                        with time!
                      </em>
                    </p>
                    <p>
                      💡 Unlike general-purpose AIs, I'm trained exclusively on
                      enterprise software topics. So go ahead—ask me about APIs,
                      upgrades, workflows, or integration!
                    </p>
                    <p>
                      🛠️ Powered by <strong>EASIHUB</strong> — built for
                      enterprise minds like yours.
                    </p>
                  </div>
                  <div class="chat-image">
                    <img
                      src="https://cdn.easihub.com/uploads/default/original/1X/712760a2a2948e30b7e889b5ded00d990ebbcd41.jpeg"
                      alt="EASIbot"
                    />
                  </div>
                </div>
                <div
                  class="chat-body"
                  id="copilotChatBody"
                  style="flex-direction: column;"
                >
                  {/* <!-- Chat bubbles will be appended here --> */}
                </div>
                <div class="chat-input">
                  <input
                    type="text"
                    id="copilotInput"
                    placeholder="Ask me anything ..."
                  />
                  <button type="button" id="copilotSendBtn">
                    Send ✈️
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Ask with Docs Page --> */}
          <div
            id="askDocsPage"
            class="ai-content-section"
            style="display:none;"
          >
            <div class="ai-body">
              <div id="aiResponseDocs"></div>
              <div id="chat-container">
                <form id="ask-docs">
                  <input
                    class="ai-input"
                    id="aiPromptDocs"
                    placeholder="Ask about documentation..."
                  />
                  <button class="ai-submit" type="submit" id="aiSubmitDocs">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-overlay" id="editModal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Let's make some edits.</h2>
            <button class="close-btn" onclick="closeModal()">
              &times;
            </button>
          </div>
          <div class="action-buttons">
            <button class="action-button">
              <i class="fa fa-smile"></i> Make it casual
            </button>
            <button class="action-button">
              <i class="fa fa-briefcase"></i> Make it formal
            </button>
            <button class="action-button">
              <i class="fa fa-scissors"></i> Shorten it
            </button>
            <div style="display: flex; flex: 1 auto; gap: 8px;">
              <button class="action-button">
                <i class="fa fa-list-alt"></i> Add more details
              </button>
              <button class="action-button">
                <i class="fa fa-redo"></i> Rewrite it
              </button>
            </div>
          </div>
          <div class="modal-body">
            <textarea placeholder="Review and edit your topic content here..."></textarea>
          </div>
          <div class="modal-footer">
            <button class="save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIContainer;
