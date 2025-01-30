import { useState } from "react";
import { MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import axios from "axios";

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I am Kanika, SixD's Virtual Assistant. Please type your query or choose the required option from the quick actions tab.",
      sender: "bot",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to send a message to the backend
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: userInput, sender: "user" },
    ]);

    // Show loading indicator
    setLoading(true);

    // Clear input
    setUserInput("");

    try {
      // Send request to the Django backend
      const response = await axios.post("http://127.0.0.1:8000/api/ask-question/", {
        question: userInput,
      });

      // Display the bot's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: response.data.answer, sender: "bot" },
      ]);
    } catch {
      // Handle errors
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: "Error connecting to server!", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quick actions (predefined responses)
  const urls = {
    services: "https://sixdindia.com/services",
    sectors: "https://sixdindia.com/sectors",
    "case-studies": "https://sixdindia.com/case-studies",
    industry4: "https://sixdindia.com/industry4",
    about: "https://sixdindia.com/about",
    "contact-us": "https://sixdindia.com/contact",
  };

  const handleQuickAction = (action: keyof typeof urls) => {
    if (action === "contact-us") {
      // Ask the user about their sector
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: "Your organisation belongs to which sector?", sender: "bot" },
      ]);
      return;
    }

    // For other quick actions
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: action, sender: "user" },
    ]);

    setTimeout(() => {
      window.open(urls[action], "_blank");
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: "I have opened the tab for you, please check.", sender: "bot" },
      ]);
    }, 1000);
  };

  // Function to handle sector selection
  const handleSectorSelection = (sector: string) => {
    // Add user's sector selection to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: sector, sender: "user" },
    ]);

    // Show loading indicator
    setLoading(true);

    // Simulate a delay for fetching contact details
    setTimeout(() => {
      let contactMessage = "";
      if (sector === "Oil & Gas" || sector === "Green Energy" || sector === "Automobile") {
        contactMessage = `Contact Her:<br>  
          Alfisha Khan<br>  
          <a class="email-link" href="mailto:alfisha.khan@sixdindia.com">alfisha.khan@sixdindia.com</a><br>  
          +91 8800554157`;
      } else if (sector === "Steel") {
        contactMessage = `Contact Her:<br>  
          Nidhi Bharti<br>  
          <a class="email-link" href="mailto:nidhi@sixdindia.com">nidhi@sixdindia.com</a><br>  
          +91 8800797883`;
      } else if (sector === "Power" || sector === "Cement") {
        contactMessage = `Contact Her:<br>  
          Manmeet Kaur<br>  
          <a class="email-link" href="mailto:manmeet.kaur@sixdindia.com">manmeet.kaur@sixdindia.com</a><br>  
          +91 8130110300`;
      } else if (sector === "Others") {
        contactMessage = `Contact Him:<br>  
          Suraj Prakash Pandey<br>  
          <a class="email-link" href="mailto:suraj.pandey@sixdindia.com">suraj.pandey@sixdindia.com</a><br>  
          +91 9790020583`;
      }

      // Add contact details to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: contactMessage, sender: "bot" },
      ]);

      // Hide loading indicator
      setLoading(false);
    }, 1000);
  };

  // Scroll to top
  const scrollToTop = () => {
    const chatArea = document.querySelector(".chat-area");
    if (chatArea) {
      chatArea.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen bg-orange-500 flex flex-col items-center justify-center relative"
      style={{ fontFamily: "'Futura Md BT', Arial, sans-serif" }}
    >
      {/* Main Content */}
      {!showChat && (
        <div className="text-center space-y-8 p-6">
          <h1 className="text-6xl font-bold text-white mb-6">
            <strong>Welcome to SixD Chatbot</strong>
          </h1>
          <p className="text-xl text-white mb-8">Your intelligent assistant for engineering solutions</p>
          <button
            onClick={() => setShowChat(true)}
            className="bg-white text-orange-500 px-8 py-4 rounded-full text-xl font-semibold hover:bg-orange-100 transition-colors duration-300 flex items-center gap-2"
          >
            <MessageCircle className="w-6 h-6" />
            Get Started
          </button>
        </div>
      )}

      {/* Chat Interface */}
      {showChat && (
        <div className="fixed inset-0 bg-orange-500 w-full h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-orange-600 text-white p-4 text-center font-bold">Welcome to SixD Chatbot</div>

          {/* Chat Area */}
          <div className="chat-area flex-1 overflow-y-auto p-4 bg-orange-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
                  style={{
                    backgroundColor: message.sender === "user" ? "#ff8c00" : "#ffffff",
                    color: message.sender === "user" ? "#000" : "#333",
                    border: message.sender === "bot" ? "1px solid #ccc" : "none",
                    padding: "10px",
                    borderRadius: "8px",
                    maxWidth: "70%",
                    margin: "5px 0",
                  }}
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              </div>
            ))}

            {/* Show loading dots if waiting for a response */}
            {loading && (
              <div className="flex justify-start">
                <div className="bot-message">Typing...</div>
              </div>
            )}

            {/* Quick Actions Dropdown */}
            <div className="mt-4 relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center justify-between"
                style={{ width: "fit-content" }}
              >
                Quick Actions
                {showDropdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showDropdown && (
                <div
                  className="mt-2 space-y-2 absolute left-0 bg-white shadow-lg rounded-lg p-2"
                  style={{ width: "200px" }}
                >
                  {["services", "sectors", "case-studies", "industry4", "about", "contact-us"].map((action) => (
                    <button
                      key={action}
                      onClick={() => handleQuickAction(action as keyof typeof urls)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full text-left"
                    >
                      {action.replace("-", " ").toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sector Selection Buttons */}
            {messages[messages.length - 1]?.text === "Your organisation belongs to which sector?" && (
              <div className="sector-btn-container mt-4">
                {["Oil & Gas", "Steel", "Power", "Green Energy", "Cement", "Automobile", "Others"].map((sector) => (
                  <button
                    key={sector}
                    onClick={() => handleSectorSelection(sector)}
                    className="sector-btn bg-orange-500 text-white px-4 py-2 rounded-lg w-full text-left mt-2"
                  >
                    {sector}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Container */}
          <div className="bg-white p-4 flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button onClick={sendMessage} className="bg-orange-500 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;