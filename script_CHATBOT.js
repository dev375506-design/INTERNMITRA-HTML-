
document.addEventListener('DOMContentLoaded', function() {
    const messagesArea = document.getElementById('messagesArea');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const addButton = document.querySelector('.add-button');
    const voiceButton = document.querySelector('.icon-button');

    
    if (!messagesArea || !messageInput || !sendButton) {
        console.error('Required elements not found');
        return;
    }

    
    const conversationFlow = [
        {
            trigger: ['hi', 'hello', 'hey', 'start'],
            response: "Hello! 👋 I'm excited to help you find the perfect internship. Let's start with your interests - what field are you passionate about? (e.g., Technology, Design, Marketing, Data Science)"
        },
        {
            trigger: ['technology', 'tech', 'it', 'software', 'coding', 'programming'],
            response: "Great choice! Technology offers amazing opportunities. 💻 What specific tech skills do you have? (e.g., Python, JavaScript, Java, React, etc.)"
        },
        {
            trigger: ['design', 'ui', 'ux', 'graphic'],
            response: "Awesome! Design is such a creative field. 🎨 What design tools are you familiar with? (e.g., Figma, Adobe XD, Photoshop)"
        },
        {
            trigger: ['marketing', 'sales', 'business'],
            response: "Excellent! Marketing is very dynamic. 📊 Do you have experience with digital marketing, social media, or content creation?"
        },
        {
            trigger: ['data', 'analytics', 'analyst'],
            response: "Perfect! Data analytics is in high demand. 📈 Are you familiar with tools like Excel, Python, SQL, or Tableau?"
        },
        {
            trigger: ['python', 'javascript', 'java', 'react', 'node', 'figma', 'photoshop', 'excel', 'sql'],
            response: "Impressive skills! 🌟 Now, which location do you prefer for your internship? (e.g., Remote, Mumbai, Delhi, Bangalore, or any specific city)"
        },
        {
            trigger: ['remote', 'mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai', 'ahmedabad'],
            response: "Perfect! Let me search for the best internship opportunities for you... 🔍"
        },
        {
            default: true,
            response: "I understand. Can you tell me more about your educational background and when you'd like to start the internship?"
        }
    ];

    let conversationStep = 0;
    let userContext = {
        interests: [],
        skills: [],
        location: null
    };

    function getSmartResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        for (let flow of conversationFlow) {
            if (flow.trigger) {
                for (let trigger of flow.trigger) {
                    if (message.includes(trigger)) {
                        
                        if (conversationStep === 1) {
                            userContext.interests.push(trigger);
                        } else if (conversationStep === 2) {
                            userContext.skills.push(trigger);
                        } else if (conversationStep === 3) {
                            userContext.location = trigger;
                        }
                        conversationStep++;
                        return flow.response;
                    }
                }
            }
        }
        
        
        if (conversationStep >= 3 && userContext.location) {
            conversationStep = 0;
            return generateResults();
        }
        
        
        conversationStep++;
        return conversationFlow[conversationFlow.length - 1].response;
    }

    function generateResults() {
        const interests = userContext.interests.join(', ');
        const skills = userContext.skills.join(', ');
        const location = userContext.location || 'Remote';
        
        return '🎉 Great! I found several internships matching your profile:<br><br>' +
               '<strong>Your Profile:</strong><br>' +
               '• Interests: ' + interests + '<br>' +
               '• Skills: ' + skills + '<br>' +
               '• Location: ' + location + '<br><br>' +
               '<strong>Top Matches:</strong><br>' +
               '1️⃣ ' + (interests.includes('tech') ? 'Frontend Developer Intern' : 'Marketing Intern') + ' - ' + location + '<br>' +
               '   ₹10k/month • 3 months • Remote<br><br>' +
               '2️⃣ ' + (skills.length > 0 ? skills[0].toUpperCase() + ' Specialist' : 'Business Analyst') + ' - Bangalore<br>' +
               '   ₹15k/month • 6 months<br><br>' +
               '3️⃣ Product Design Intern - Mumbai<br>' +
               '   ₹12k/month • 3 months<br><br>' +
               'Would you like to view detailed information or apply to any of these? 🚀';
    }

    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + (isUser ? 'user' : 'bot');
        
        if (!isUser) {
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            
            const botAvatarDiv = document.createElement('div');
            botAvatarDiv.className = 'bot-avatar';
            
            const botFaceDiv = document.createElement('div');
            botFaceDiv.className = 'bot-face';
            botFaceDiv.textContent = '😊';
            
            botAvatarDiv.appendChild(botFaceDiv);
            avatarDiv.appendChild(botAvatarDiv);
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = text;
            
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
        } else {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = text;
            messageDiv.appendChild(contentDiv);
        }
        
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-indicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        
        const botAvatarDiv = document.createElement('div');
        botAvatarDiv.className = 'bot-avatar';
        
        const botFaceDiv = document.createElement('div');
        botFaceDiv.className = 'bot-face';
        botFaceDiv.textContent = '😊';
        
        botAvatarDiv.appendChild(botFaceDiv);
        avatarDiv.appendChild(botAvatarDiv);
        
        const typingIndicatorDiv = document.createElement('div');
        typingIndicatorDiv.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicatorDiv.appendChild(dot);
        }
        
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(typingIndicatorDiv);
        messagesArea.appendChild(typingDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    function sendMessage() {
        const text = messageInput.value.trim();
        
        
        if (text === '') return;
        if (text.length > 500) {
            alert('Message is too long. Please keep it under 500 characters.');
            return;
        }

        addMessage(text, true);
        messageInput.value = '';

        
        showTypingIndicator();

        setTimeout(function() {
            removeTypingIndicator();
            const response = getSmartResponse(text);
            addMessage(response, false);
        }, 1500);
    }

    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    
    if (addButton) {
        addButton.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf,.doc,.docx';
            fileInput.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    addMessage('📎 Attached: ' + file.name, true);
                    setTimeout(function() {
                        showTypingIndicator();
                        setTimeout(function() {
                            removeTypingIndicator();
                            addMessage('Thank you for uploading your resume! I\'ll analyze it to find better matches. 📄', false);
                        }, 1500);
                    }, 500);
                }
            };
            fileInput.click();
        });
    }

    
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                
                recognition.onstart = function() {
                    voiceButton.style.color = '#dc2626';
                    messageInput.placeholder = 'Listening...';
                };
                
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    messageInput.value = transcript;
                    voiceButton.style.color = '';
                    messageInput.placeholder = 'Type your answer here...';
                };
                
                recognition.onerror = function() {
                    voiceButton.style.color = '';
                    messageInput.placeholder = 'Type your answer here...';
                    alert('Voice recognition failed. Please try again or type your message.');
                };
                
                recognition.start();
            } else {
                alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
            }
        });
    }
});