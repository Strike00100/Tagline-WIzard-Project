document.addEventListener("DOMContentLoaded", function () {
  const generateButton = document.getElementById("generate-button");
  const loadingMessage = document.getElementById("loading-message");
  const taglinesContainer = document.getElementById("taglines-container");
  const savedTaglinesContainer = document.getElementById("saved-taglines-container");
  const noTaglinesMessage = document.getElementById("no-taglines-message");
  const savedTaglinesList = document.getElementById("saved-taglines-list");

  let savedTaglines = [];
  let taglineCount = 1;

  generateButton.addEventListener("click", function () {
    const businessName = document.getElementById("business-name").value;

    if (businessName.trim() !== "") {
      generateTaglines(businessName);
    }
  });

  function generateTaglines(businessName) {
    showLoadingMessage();
    taglinesContainer.innerHTML = "";

    fetch("https://api.ai21.com/studio/v1/j2-ultra/complete", {
      headers: {
        "Authorization": "Bearer AujFMx7nglVhdwGQUdgVbpIq8Jh0N4Oy",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "prompt": `Create 10 taglines for the business! Write name of the business: ${businessName} Taglines:`,
        "numResults": 10,
        "maxTokens": 200,
        "temperature": 0.7,
        "topKReturn": 0,
        "topP": 1,
        "countPenalty": {
          "scale": 0.58,
          "applyToNumbers": false,
          "applyToPunctuations": false,
          "applyToStopwords": false,
          "applyToWhitespaces": false,
          "applyToEmojis": false
        },
        "frequencyPenalty": {
          "scale": 204,
          "applyToNumbers": false,
          "applyToPunctuations": false,
          "applyToStopwords": false,
          "applyToWhitespaces": false,
          "applyToEmojis": false
        },
        "presencePenalty": {
          "scale": 2.04,
          "applyToNumbers": false,
          "applyToPunctuations": false,
          "applyToStopwords": false,
          "applyToWhitespaces": false,
          "applyToEmojis": false
        },
        "stopSequences": []
      }),
      method: "POST"
    })
      .then(response => response.json())
      .then(data => {
        if (data.completions && data.completions.length > 0) {
          const generatedTaglines = data.completions[0].data.text.split("\n");

            
            
          for (let i = 1; i < generatedTaglines.length; i++) { // Start from index 1
          const tagline = generatedTaglines[i].trim();

          if (tagline !== "") {
            addTaglineToContainer(tagline);
          }
        }
      } else {
          console.error("No completion data found.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      })
      .finally(() => {
        hideLoadingMessage();
      });
  }

  function addTaglineToContainer(tagline) {
    const taglineItem = document.createElement("div");
    taglineItem.classList.add("tagline-item");
    taglineItem.textContent = tagline;

    taglineItem.addEventListener("click", function () {
      saveTagline(tagline);
    });

    taglinesContainer.appendChild(taglineItem);
  }

  
    
    let savedTaglineCount = 0;

// Function to save tagline
function saveTagline(tagline) {
  savedTaglineCount++;
  const savedTaglinesContainer = document.getElementById("saved-taglines-container");
  const noTaglinesMessage = document.getElementById("no-taglines-message");
  const savedTaglinesList = document.getElementById("saved-taglines-list");
  const taglineItem = document.createElement("li");
  taglineItem.classList.add("saved-tagline-item");
  const taglineText = document.createElement("span");
  taglineText.classList.add("saved-tagline-text");
  taglineText.textContent = tagline;
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerHTML = "&#10006;";
  deleteButton.addEventListener("click", () => {
    taglineItem.remove();
    if (savedTaglinesList.childElementCount === 0) {
      noTaglinesMessage.style.display = "block";
    }
  });
  taglineItem.appendChild(taglineText);
  taglineItem.appendChild(deleteButton);
  savedTaglinesList.appendChild(taglineItem);
  noTaglinesMessage.style.display = "none";
}

// Event listener for generate button
generateButton.addEventListener("click", () => {
  const businessName = businessNameInput.value;
  if (businessName) {
    loadingMessage.style.display = "block";
    generateTaglines(businessName);
  }
});

  function deleteTagline(index) {
    savedTaglines.splice(index, 1);
    renderSavedTaglines();
  }

  function renderSavedTaglines() {
    savedTaglinesList.innerHTML = "";

    if (savedTaglines.length === 0) {
      noTaglinesMessage.style.display = "block";
    } else {
      noTaglinesMessage.style.display = "none";
      savedTaglines.forEach((tagline, index) => {
        const savedTaglineItem = document.createElement("li");
        savedTaglineItem.classList.add("saved-tagline-item");

        const savedTaglineText = document.createElement("span");
        savedTaglineText.classList.add("saved-tagline-text");
        savedTaglineText.textContent = `${taglineCount}. ${tagline}`;
        savedTaglineItem.appendChild(savedTaglineText);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
          deleteTagline(index);
        });
        savedTaglineItem.appendChild(deleteButton);

        savedTaglinesList.appendChild(savedTaglineItem);

        taglineCount++;
      });
    }
  }

  function showLoadingMessage() {
    loadingMessage.style.display = "block";
  }

  function hideLoadingMessage() {
    loadingMessage.style.display = "none";
  }
});
