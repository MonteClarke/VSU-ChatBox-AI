// Inside your Overall.html script
document.addEventListener("DOMContentLoaded", () => {
    const conversationContainer = document.getElementById("conversation-container");

    // Retrieve the conversation from local storage
    const conversation = JSON.parse(localStorage.getItem("conversation")) || [];

    // Display the conversation on the page
    conversation.forEach(entry => {
        const userElement = document.createElement("div");
        userElement.textContent = `User: ${entry.user}`;
    
        const breakElement = document.createElement("br");
    
        const botElement = document.createElement("div");
        botElement.textContent = `Bot: ${entry.bot}`;
        botElement.style.color = "white";  // Set the color to white
    
        conversationContainer.appendChild(userElement);
        conversationContainer.appendChild(breakElement);
        conversationContainer.appendChild(botElement);
        conversationContainer.appendChild(breakElement);
    });
});
