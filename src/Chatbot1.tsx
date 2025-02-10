import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

// Define all constants before using them
const existingStyles = `
  @font-face {
    font-family: 'Futura Md BT';
    src: url('https://db.onlinewebfonts.com/t/3ddd0e3d1a076e112b27d8d9b7e20200.woff2') format('woff2');
  }

  .mic-btn {
    background: #ff8c00;
    color: rgb(0, 0, 0);
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 15px;
    margin-right: 10px;
    transition: transform 0.2s ease-in-out; /* Smooth transition for scaling */
  }

  .mic-btn.active {
    background-color: #e77f00; /* Change color when active */
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.5); /* Add a glow effect */
    transform: scale(1.2); /* Enlarge the button */
  }

  .mic-btn i {
    font-size: 16px;
    transition: transform 0.2s ease-in-out; /* Smooth transition for icon scaling */
  }

  .mic-btn.active i {
    transform: scale(1.2); /* Enlarge the icon */
  }

  /* Typewriter animation */
  @keyframes typing {
    from { width: 0; }
    to { width: 100%; }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: black; }
  }

  .typewriter {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: conic-gradient(
      from 90deg at 50% 50%,
      rgba(255, 140, 0, 0) 0deg,
      #ff8c00 360deg
    );
    animation: spin 1s linear infinite;
    position: relative;
  }

  .spinner::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 90deg at 50% 50%,
      rgba(255, 140, 0, 0) 0deg,
      rgba(255, 140, 0, 0.5) 180deg,
      rgba(255, 140, 0, 0) 360deg
    );
    filter: blur(10px);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  body {
    font-family: 'Futura Md BT', Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: hsla(34, 18%, 83%, 0.871);
    height: 100vh;
    overflow: hidden;
    font-size: 15px;
  }

  #chatbot-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgb(245, 234, 220);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    font-family: 'Futura Md BT', Arial, sans-serif;
  }

  #chat-header {
    background: #ff8c00;
    color: rgb(2, 1, 1);
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 16px;
  }

  #chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

  .message {
    margin: 5px 0;
    padding: 10px;
    border-radius: 8px;
    max-width: 80%;
    word-wrap: break-word;
    font-size: 15px;
    font-family: 'Futura Md BT', Arial, sans-serif;
  }

  .user-message {
    align-self: flex-end;
    background-color: #ff8c00;
    color: rgb(0, 0, 0);
  }

  .bot-message {
    align-self: flex-start;
    background-color: #ffffff;
    color: black;
    border: 1px solid #ccc;
  }

  #input-container {
    display: flex;
    border-top: 1px solid #ccc;
    padding: 10px;
    background: white;
    position: relative;
  }

  #user-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 15px;
  }

  #send-btn {
    background: #ff8c00;
    color: rgb(0, 0, 0);
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 15px;
  }

  #send-btn:active {
   background-color: #e77f00; /* Darker shade of the original color */
   transform: scale(0.95); /* Slightly shrink the button */
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Add a shadow for a pressed effect */
   transition: background-color 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease; /* Smooth transition */
  }

  .send-btn-pressed {
   background-color: #e77f00;
   transform: scale(0.95);
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
   transition: background-color 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease;
  }

  .scroll-top-btn {
    position: absolute;
    right: 10px;
    bottom: 100%;
    margin-bottom: 10px;
    width: 32px;
    height: 32px;
    background: #ff8c00;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: right 0.3s ease;
  }

  .scroll-top-btn.with-scrollbar {
    right: 30px;
  }

  .scroll-top-btn svg {
    width: 20px;
    height: 20px;
    color: black;
  }

  .quick-reply-btn {
    background-color: #ff8c00;
    color: white;
    border: none;
    padding: 8px 12px;
    margin: 5px 0;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 15px;
  }

  .quick-reply-btn:hover {
    background-color: #e77f00;
  }

  .dropdown {
    margin-top: 8px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    background-color: rgb(253, 168, 71);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 15px;
  }

  .dropdown-content {
    display: none;
    margin-top: 10px;
  }

  .dropdown-content button {
    width: 100%;
    padding: 10px;
    background-color: #ff8c00;
    border: none;
    color: rgb(0, 0, 0);
    margin-top: 5px;
    cursor: pointer;
    border-radius: 5px;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 15px;
  }

  .dropdown-content button:hover {
    background-color: #e77f00;
  }

  .dropdown-content.show {
    display: block;
  }

  .dropdown i {
    font-size: 20px;
    transition: transform 0.3s ease-in-out;
  }

  .dropdown i.rotate {
    transform: rotate(180deg);
  }

  .sector-btn-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
  }

  .sector-btn {
    background-color: #ff8c00;
    color: rgb(0, 0, 0);
    padding: 12px;
    border-radius: 5px;
    width: 48%;
    text-align: center;
    cursor: pointer;
    border: none;
    font-family: 'Futura Md BT', Arial, sans-serif;
    font-size: 15px;
  }

  .sector-btn:hover {
    background-color: #e77f00;
  }

  .contact-info {
    font-size: 15px;
    white-space: pre-wrap;
  }

  .email-link {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
    font-size: 15px;
  }
`;

const existingChatbotHTML = `
  <div id="chatbot-container">
    <div id="chat-header"><strong>Welcome to SixD Chatbot</strong></div>
    <div id="chat-area">
      <div class="bot-message message">
        <span class="typewriter">Hi, I am Kanika, SixD's Virtual Assistant.</span>
      </div>
      <div class="bot-message message">
        <span class="typewriter">How can I help you.</span>
      </div>
      <div class="bot-message message">
        <button id="dropdown-btn" class="dropdown" onclick="toggleDropdown()">
          Quick Actions\uFEFF  \uFEFF  \uFEFF<i id="dropdown-arrow" class="fas fa-chevron-down"></i>
        </button>
        <div id="dropdown-content" class="dropdown-content">
          <button class="quick-reply-btn" onclick="redirectTo('services')">Services</button>
          <button class="quick-reply-btn" onclick="redirectTo('sectors')">Sectors</button>
          <button class="quick-reply-btn" onclick="redirectTo('case-studies')">Case Studies</button>
          <button class="quick-reply-btn" onclick="redirectTo('industry4')">Industry 4.0</button>
          <button class="quick-reply-btn" onclick="redirectTo('about')">About Us</button>
          <button class="quick-reply-btn" onclick="handleContactUs()">Contact Us</button>
        </div>
      </div>
    </div>
    <div id="input-container">
      <button class="scroll-top-btn" onclick="scrollToTop()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>
      <input type="text" id="user-input" placeholder="Type your message here...">
      <button id="mic-btn" class="mic-btn">
        <i class="fas fa-microphone"></i>
      </button>
      <button id="send-btn" onclick="sendMessage()">Send</button>
    </div>
  </div>
`;

const existingJavaScript = `
const chatArea = document.getElementById('chat-area');
const chatbotContainer = document.getElementById('chatbot-container');
const dropdownArrow = document.getElementById('dropdown-arrow');
const dropdownContent = document.getElementById('dropdown-content');
const scrollTopBtn = document.querySelector('.scroll-top-btn');
const micBtn = document.getElementById('mic-btn');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let loadingMessage = null;
let recognition = null;
let isListening = false;

// Initialize voice recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        userInput.value = transcript;
    };

    recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        appendMessage('Sorry, I could not understand that. Please try again.', 'bot');
    };

    recognition.onend = function() {
        if (isListening) {
            recognition.start(); // Restart recognition if still listening
        }
    };
} else {
    console.warn('Web Speech API is not supported in this browser.');
    micBtn.style.display = 'none'; // Hide mic button if not supported
}

micBtn.addEventListener('mousedown', () => {
    if (recognition) {
        isListening = true;
        recognition.start();
        micBtn.classList.add('active'); // Add active class for visual feedback
    }
});

micBtn.addEventListener('mouseup', () => {
    if (recognition) {
        isListening = false;
        recognition.stop();
        micBtn.classList.remove('active'); // Remove active class
    }
});

micBtn.addEventListener('mouseleave', () => {
    if (isListening) {
        isListening = false;
        recognition.stop();
        micBtn.classList.remove('active'); // Remove active class if mouse leaves while pressed
    }
});

// Function to check if scrollbar is visible
function isScrollbarVisible() {
    return chatArea.scrollHeight > chatArea.clientHeight;
}

// Function to update scroll button position
function updateScrollButtonPosition() {
    if (isScrollbarVisible() && chatArea.scrollTop > 0) {
        scrollTopBtn.classList.add('with-scrollbar');
        scrollTopBtn.style.display = 'flex';  // Show button
    } else {
        scrollTopBtn.style.display = 'none';  // Hide button
    }
}

// Add scroll event listener to chat area
chatArea.addEventListener('scroll', updateScrollButtonPosition);

// Add mutation observer to watch for content changes
const observer = new MutationObserver(updateScrollButtonPosition);
observer.observe(chatArea, { childList: true, subtree: true });

function scrollToTop() {
    chatArea.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function appendMessage(message, sender, isLoading = false) {
  if (!message.trim() && !isLoading) return; // Prevent empty messages unless it's a loading message

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

  if (isLoading) {
    messageDiv.innerHTML = \`
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    \`;
    loadingMessage = messageDiv;
  } else {
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 0; // Start hidden for all messages
  }

  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
  updateScrollButtonPosition();

  if (!isLoading && loadingMessage) {
    loadingMessage.remove();
    loadingMessage = null;
  }

  // Apply gradual fade-in effect for both user and bot messages
  setTimeout(() => {
    messageDiv.style.transition = 'opacity 0.5s ease-in-out';
    messageDiv.style.opacity = 1;
  }, 300);
}

async function sendMessage() {
  sendBtn.classList.add('send-btn-pressed'); // Add the pressed class

  const userInput = document.getElementById('user-input').value.trim();
  if (userInput === '') {
    sendBtn.classList.remove('send-btn-pressed'); // Remove the class if input is empty
    return;
  }

  appendMessage(userInput, 'user');
  document.getElementById('user-input').value = '';
  appendMessage('', 'bot', true); // Show loading spinner

  setTimeout(() => {
    sendBtn.classList.remove('send-btn-pressed'); // Remove the class after a short delay
  }, 200); // Adjust the delay as needed

  try {
    const response = await fetch('http://127.0.0.1:8000/api/ask-question/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userInput }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    appendMessage(data.answer, 'bot', false); // Append bot's response
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
    appendMessage('Sorry, something went wrong. Please try again later.', 'bot', false);
  }
}

function toggleDropdown() {
    dropdownContent.classList.toggle('show');
    dropdownArrow.classList.toggle('rotate');
}

function redirectTo(section) {
   appendMessage(section.charAt(0).toUpperCase() + section.slice(1), 'user');
    
    appendMessage('', 'bot', true);
    setTimeout(() => {
      const urls = {
        services: "https://sixdindia.com/services",
        sectors: "https://sixdindia.com/sectors",
        "case-studies": "https://sixdindia.com/case-studies",
        industry4: "https://sixdindia.com/industry4",
        about: "https://sixdindia.com/about",
        "contact-us": "https://sixdindia.com/contact"
      };
      window.open(urls[section], '_blank');
      appendMessage('I have opened the tab for you, please check.', 'bot');
    }, 1000);
}
    
function handleContactUs() {
  appendMessage('Contact Us', 'user');
  appendMessage('', 'bot', true); // Show loading icon
  setTimeout(() => {
    askSector();
  }, 1000);
}

function askSector() {
  // Remove any existing loading message
  if (loadingMessage) {
    loadingMessage.remove();
    loadingMessage = null;
  }

  appendMessage('Your organisation belongs to which sector?', 'bot');

  // Show sector buttons immediately without additional loading
  const sectors = ['Oil & Gas', 'Steel', 'Power', 'Green Energy', 'Cement', 'Automobile'];
  const sectorBtnContainer = document.createElement('div');
  sectorBtnContainer.classList.add('sector-btn-container');
  sectors.forEach(sector => {
    const sectorBtn = document.createElement('button');
    sectorBtn.classList.add('sector-btn');
    sectorBtn.textContent = sector;
    sectorBtn.onclick = () => selectSector(sector);
    sectorBtnContainer.appendChild(sectorBtn);
  });

  chatArea.appendChild(sectorBtnContainer);
  chatArea.scrollTop = chatArea.scrollHeight;
  updateScrollButtonPosition();
}

function selectSector(sector) {
  // Remove the sector buttons container to prevent multiple clicks
  const sectorBtnContainer = document.querySelector('.sector-btn-container');
  if (sectorBtnContainer) {
    sectorBtnContainer.remove();
  }

  appendMessage(sector, 'user');
  appendMessage('', 'bot', true); // Show loading icon while preparing contact info
  setTimeout(() => {
    let contactMessage = "Please contact the following for more details:";
    if (sector === 'Oil & Gas' || sector === 'Green Energy' || sector === 'Automobile') {
      contactMessage = \`Contact:<br>  
        Alfisha Khan<br>  
        <a class="email-link" href="javascript:void(0);" onclick="openComposeEmail('alfisha.khan@sixdindia.com')">alfisha.khan@sixdindia.com</a><br>  
        +91 8800554157
      \`;
    } else if (sector === 'Steel') {
      contactMessage = \`Contact:<br>  
        Nidhi Bharti<br>  
        <a class="email-link" href="javascript:void(0);" onclick="openComposeEmail('nidhi@sixdindia.com')">nidhi@sixdindia.com</a><br>  
        +91 8800797883
      \`;
    } else if (sector === 'Power' || sector === 'Cement') {
      contactMessage = \`Contact:<br>  
        Manmeet Kaur<br>  
        <a class="email-link" href="javascript:void(0);" onclick="openComposeEmail('manmeet.kaur@sixdindia.com')">manmeet.kaur@sixdindia.com</a><br>  
        +91 8800188112
      \`;
    } else if (sector === 'Others') {
      contactMessage = \`Contact:<br>  
        Suraj Prakash Pandey<br>  
        <a class="email-link" href="javascript:void(0);" onclick="openComposeEmail('suraj.pandey@sixdindia.com')">suraj.pandey@sixdindia.com</a><br>  
        +91 9790020583
      \`;
    }

    // Remove the loading message before appending the contact info
    if (loadingMessage) {
      loadingMessage.remove();
      loadingMessage = null;
    }

    appendMessage(contactMessage, 'bot');
  }, 1000);
}

function openComposeEmail(email) {
    const mailUrl = \`https://mail.google.com/mail/?view=cm&to=\${email}&su=Subject&body=Message\`;
    window.open(mailUrl, '_blank');
}

document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
});

// Initial check for scrollbar
updateScrollButtonPosition();
`;

const chatbotHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SixD-ChatBot</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <style>${existingStyles}</style>
  <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7EHJXETHGT"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-7EHJXETHGT');
</script>
</head>                                           
<body>
  ${existingChatbotHTML}
  <script>${existingJavaScript}</script>
</body>
</html>
`;

function Chatbot() {
  const [showChat, setShowChat] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const [subText, setSubText] = useState('');

  // Inject Google Analytics script
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-7EHJXETHGT';
    script1.async = true;

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7EHJXETHGT');
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    // Cleanup function to remove scripts if the component unmounts
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Rest of your component code...
  useEffect(() => {
    const welcomeMessage = "Weelcome to SixD Chatbot";
    const subMessage = "Yoour intelligent assistant for engineering solutions";

    let i = 0;
    let j = 0;
    let timeoutId1: NodeJS.Timeout, timeoutId2: NodeJS.Timeout;

    const typeWelcome = () => {
      if (i < welcomeMessage.length) {
        setWelcomeText((prev) => prev + welcomeMessage.charAt(i));
        i++;
        timeoutId1 = setTimeout(typeWelcome, 70);
      } else {
        typeSub();
      }
    };

    const typeSub = () => {
      if (j < subMessage.length) {
        setSubText((prev) => prev + subMessage.charAt(j));
        j++;
        timeoutId2 = setTimeout(typeSub, 50);
      }
    };

    typeWelcome();

    // Cleanup function to clear timeouts
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, []);

  const handleGetStarted = () => {
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center relative" style={{ fontFamily: "Futura Md BT, Arial, sans-serif" }}>
      {/* Main Content */}
      {!showChat && (
        <div className="text-center space-y-8 p-6">
          <h1 className="text-6xl font-bold text-white mb-6">
            <strong>{welcomeText}</strong>
          </h1>
          <p className="text-xl text-white mb-8">
            {subText}
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-orange-500 px-8 py-4 rounded-full text-xl font-semibold 
                     hover:bg-orange-100 transition-colors duration-300 
                     flex items-center gap-2 pulsate"
          >
            <MessageCircle className="w-6 h-6" />
            Get Started
          </button>
        </div>
      )}

      {/* Chat Interface */}
      {showChat && (
        <div className="fixed inset-0 bg-orange-500 w-full h-full">
          <iframe 
            srcDoc={chatbotHTML}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="SixD Chatbot"
          />
        </div>
      )}

      {/* Add CSS for pulsate animation */}
      <style>
        {`
          @keyframes pulsate {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .pulsate {
            animation: pulsate 1.5s infinite;
          }
        `}
      </style>
    </div>
  );
}

export default Chatbot;
