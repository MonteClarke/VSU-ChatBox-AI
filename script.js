const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "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"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

if (window.location.pathname === '/Homepage.html') {
    localStorage.clear();
}

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

// Define a function to save the conversation to local storage
const saveConversation = (userMessage, botMessage) => {
    const conversation = JSON.parse(localStorage.getItem("conversation")) || [];
    conversation.push({ user: userMessage, bot: botMessage });
    localStorage.setItem("conversation", JSON.stringify(conversation));
};

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const responseMessage = data.choices[0].message.content.trim();
            messageElement.textContent = responseMessage;

            // Save the conversation to local storage
            saveConversation(userMessage, responseMessage);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};


const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi(".......", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

const courseSelection = document.getElementById("courseSelection");

// Additional logic for course selection
courseSelection.addEventListener("change", (e) => {
  const selectedCourse = e.target.value;
  const welcomeMessage = `Hi there! I'm the VSU chatbox! Please share your feedback about ${selectedCourse}. Please provide details in your evaluation!`;
  
  // Update the welcome message in the chatbox
  const welcomeChatLi = createChatLi(welcomeMessage, "incoming");
  chatbox.innerHTML = ''; // Clear existing messages
  chatbox.appendChild(welcomeChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
});
  

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));