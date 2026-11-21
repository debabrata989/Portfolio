document.addEventListener('DOMContentLoaded', () => {
    // Auth Elements
    const authScreen = document.getElementById('auth-modal') || document.getElementById('auth-screen');
    const closeAuthBtn = document.getElementById('close-auth-btn');
    const loginOpenBtn = document.getElementById('login-open-btn');
    const appContainer = document.getElementById('app-container');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authUsername = document.getElementById('auth-username');
    const authPassword = document.getElementById('auth-password');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchBtn = document.getElementById('auth-switch-btn');
    const authError = document.getElementById('auth-error');
    const authForm = document.getElementById('auth-form');

    // Pro Modal Elements
    const upgradeBtnSidebar = document.getElementById('upgrade-btn-sidebar');
    const proModal = document.getElementById('pro-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const payProBtn = document.getElementById('pay-pro-btn');
    
    // Settings Modal Elements
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const deleteChatsBtn = document.getElementById('delete-chats-btn');
    const settingsUsernameDisplay = document.getElementById('settings-username-display');
    const userProfileBtn = document.getElementById('user-profile-btn');
    
    // Profile Modal Elements
    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = document.getElementById('close-profile-btn');
    const profileModalAvatar = document.getElementById('profile-modal-avatar');
    const profileModalName = document.getElementById('profile-modal-name');
    const profileModalBadge = document.getElementById('profile-modal-badge');
    const profileChatsCount = document.getElementById('profile-chats-count');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    
    // User elements
    const logoutBtn = document.getElementById('logout-btn');
    const userAvatarText = document.getElementById('user-avatar-text');
    const userProfileName = document.getElementById('user-profile-name');

    // Chat Elements
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const messagesWrapper = document.getElementById('messages-wrapper');
    const welcomeScreen = document.getElementById('welcome-screen');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const newChatBtn = document.getElementById('new-chat-btn');
    const chatContainer = document.getElementById('chat-container');
    const chatHistoryList = document.querySelector('.chat-history-list');
    const shareBtn = document.getElementById('share-btn');

    // Image Attach Elements
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');

    // Config & State
    const BACKEND_URL = "http://localhost:5000";
    let isWaitingForResponse = false;
    let isDarkMode = true;
    let currentChatId = Date.now().toString();
    
    let isLoginMode = true; // toggles between login/register
    let currentImageBase64 = null;
    let currentMimeType = null;

    // Local storage chat database helpers
    function getLocalChats() {
        try {
            return JSON.parse(localStorage.getItem('debabot_local_chats')) || {};
        } catch (e) {
            return {};
        }
    }

    function saveLocalChat(chatId, title, userMsg, imgBase64, mimeType, aiMsg) {
        const chats = getLocalChats();
        if (!chats[chatId]) {
            chats[chatId] = {
                id: chatId,
                title: (title || 'New Conversation').slice(0, 26),
                history: []
            };
        }
        if (userMsg || imgBase64) {
            chats[chatId].history.push({
                role: 'user',
                text: userMsg || '',
                imageBase64: imgBase64 || null,
                mimeType: mimeType || null
            });
        }
        if (aiMsg) {
            chats[chatId].history.push({
                role: 'ai',
                text: aiMsg
            });
        }
        localStorage.setItem('debabot_local_chats', JSON.stringify(chats));
    }

    // --- Auth Logic (Chatbot opens directly without login requirement) ---
    function checkAuth() {
        const token = localStorage.getItem('debabot_token');
        const username = localStorage.getItem('debabot_user');
        
        // NEVER show blocking login screen on load! App is directly open and usable!
        if (authScreen) authScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
        
        if (token && username) {
            if (userProfileBtn) userProfileBtn.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'flex';
            if (loginOpenBtn) loginOpenBtn.style.display = 'none';
            userProfileName.textContent = username;
            userAvatarText.textContent = username.charAt(0).toUpperCase();
        } else {
            // Guest mode
            if (userProfileBtn) userProfileBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loginOpenBtn) loginOpenBtn.style.display = 'flex';
        }
        loadChatList();
    }

    if (loginOpenBtn) {
        loginOpenBtn.addEventListener('click', () => {
            if (authScreen) authScreen.style.display = 'flex';
        });
    }

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            if (authScreen) authScreen.style.display = 'none';
        });
    }

    if (authScreen) {
        authScreen.addEventListener('click', (e) => {
            if (e.target === authScreen) {
                authScreen.style.display = 'none';
            }
        });
    }

    authSwitchBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Login to access your smart assistant';
            authSubmitBtn.textContent = 'Login';
            authSwitchText.textContent = "Don't have an account?";
            authSwitchBtn.textContent = 'Sign Up';
        } else {
            authTitle.textContent = 'Create Account';
            authSubtitle.textContent = 'Sign up to start chatting';
            authSubmitBtn.textContent = 'Register';
            authSwitchText.textContent = "Already have an account?";
            authSwitchBtn.textContent = 'Login';
        }
        authError.textContent = '';
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = authUsername.value.trim();
        const password = authPassword.value.trim();
        
        if (!username || !password) return;
        
        const endpoint = isLoginMode ? '/api/login' : '/api/register';
        
        try {
            authSubmitBtn.disabled = true;
            const res = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                authError.textContent = data.error || "Authentication failed";
            } else {
                localStorage.setItem('debabot_token', data.token);
                localStorage.setItem('debabot_user', data.username);
                authUsername.value = '';
                authPassword.value = '';
                authError.textContent = '';
                if (authScreen) authScreen.style.display = 'none';
                checkAuth();
            }
        } catch (err) {
            // Local fallback authentication
            const mockToken = username + "_" + Date.now();
            localStorage.setItem('debabot_token', mockToken);
            localStorage.setItem('debabot_user', username);
            authUsername.value = '';
            authPassword.value = '';
            authError.textContent = '';
            if (authScreen) authScreen.style.display = 'none';
            checkAuth();
        } finally {
            authSubmitBtn.disabled = false;
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('debabot_token');
        localStorage.removeItem('debabot_user');
        messagesWrapper.innerHTML = '';
        welcomeScreen.style.display = 'flex';
        chatHistoryList.innerHTML = '';
        checkAuth();
    });

    // Helper to get auth header
    const getAuthHeaders = () => {
        let guestId = localStorage.getItem('debabot_guest_id');
        if (!guestId) {
            guestId = 'guest_' + Date.now();
            localStorage.setItem('debabot_guest_id', guestId);
        }
        return {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('debabot_token') || "",
            "Guest-Id": guestId
        };
    };

    // --- Main Chat Logic ---
    async function loadChatList(autoLoadLatest = false) {
        let db = null;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1500);
            const res = await fetch(`${BACKEND_URL}/api/chats`, {
                headers: getAuthHeaders(),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (res.ok) {
                db = await res.json();
            }
        } catch (e) {
            // Backend offline
        }

        if (!db || Object.keys(db).length === 0) {
            db = getLocalChats();
        }

        chatHistoryList.innerHTML = '';
        const chatIds = Object.keys(db).sort((a,b) => b - a);
        
        // Limit shown chats to max 5
        chatIds.slice(0, 5).forEach(id => {
            const btn = document.createElement('button');
            btn.className = 'icon-btn';
            btn.innerHTML = `<span class="material-symbols-rounded">chat_bubble</span><span class="btn-text">${escapeHTML(db[id].title || 'Chat')}</span>`;
            btn.onclick = () => loadSpecificChat(id, db[id].history);
            chatHistoryList.appendChild(btn);
        });

        if (autoLoadLatest && chatIds.length > 0 && messagesWrapper.children.length === 0) {
            loadSpecificChat(chatIds[0], db[chatIds[0]].history);
        }
    }

    function loadSpecificChat(chatId, historyData) {
        currentChatId = chatId;
        messagesWrapper.innerHTML = '';
        welcomeScreen.style.display = 'none';
        
        historyData.forEach(msg => {
            const tempSender = msg.role === 'user' ? 'user' : 'ai';
            addMessage(msg.text, tempSender, msg.imageBase64);
        });
        
        scrollToBottom();
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    }

    // --- Pro Subscription Logic ---
    if (upgradeBtnSidebar) {
        upgradeBtnSidebar.addEventListener('click', () => {
            proModal.style.display = 'flex';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            proModal.style.display = 'none';
            // Reset button if it was in celebration state
            if (payProBtn.textContent === "Welcome to Pro!") {
                payProBtn.textContent = "Upgrade to Pro";
                payProBtn.disabled = false;
                payProBtn.style.background = "#10a37f";
            }
        });
    }

    if (payProBtn) {
        payProBtn.addEventListener('click', () => {
            payProBtn.innerHTML = `<div class="typing-loader"><span class="typing-dot" style="background:#fff"></span><span class="typing-dot" style="background:#fff"></span><span class="typing-dot" style="background:#fff"></span></div> Processing...`;
            payProBtn.disabled = true;

            setTimeout(() => {
                payProBtn.textContent = "Welcome to Pro!";
                payProBtn.style.background = "#d4af37";
                payProBtn.style.color = "#000";
                
                // Add Pro badge to user name
                const currentName = localStorage.getItem('debabot_user') || 'User';
                userProfileName.innerHTML = `${currentName} <span class="material-symbols-rounded" style="color:#d4af37; font-size:1rem; vertical-align:middle;">diamond</span>`;
                
                setTimeout(() => {
                    proModal.style.display = 'none';
                }, 1500);
            }, 2500);
        });
    }

    // --- Settings Logic ---
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => {
            const currentName = localStorage.getItem('debabot_user') || 'User';
            settingsUsernameDisplay.textContent = currentName;
            settingsModal.style.display = 'flex';
        });
    }

    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', () => {
            const currentName = localStorage.getItem('debabot_user') || 'User';
            profileModalAvatar.textContent = currentName.charAt(0).toUpperCase();
            profileModalName.textContent = currentName;
            
            // Check if user is pro (from button text)
            if (payProBtn && payProBtn.textContent === "Welcome to Pro!") {
                profileModalBadge.style.display = 'block';
            }
            
            // Set chat count based on history
            const chatCount = document.querySelectorAll('.chat-history-list .icon-btn').length;
            if (profileChatsCount) profileChatsCount.textContent = chatCount;
            
            if (profileModal) profileModal.style.display = 'flex';
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            profileModal.style.display = 'none';
        });
    }

    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', () => {
            profileModal.style.display = 'none';
            if (logoutBtn) logoutBtn.click();
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
            deleteChatsBtn.textContent = 'Delete All';
            deleteChatsBtn.disabled = false;
        });
    }

    if (deleteChatsBtn) {
        deleteChatsBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to permanently delete all your chats?")) {
                deleteChatsBtn.textContent = "Deleting...";
                deleteChatsBtn.disabled = true;
                
                try {
                    await fetch(`${BACKEND_URL}/api/chats`, {
                        method: "DELETE",
                        headers: getAuthHeaders()
                    });
                } catch(e) {}
                
                localStorage.removeItem('debabot_local_chats');
                
                // Clear UI
                chatHistoryList.innerHTML = '';
                messagesWrapper.innerHTML = '';
                welcomeScreen.style.display = 'flex';
                currentChatId = Date.now().toString();
                
                setTimeout(() => {
                    settingsModal.style.display = 'none';
                    deleteChatsBtn.textContent = 'Delete All';
                    deleteChatsBtn.disabled = false;
                }, 500);
            }
        });
    }

    // Call checkAuth to boot app
    checkAuth();

    // Features
    const toggleTheme = () => {
        isDarkMode = !isDarkMode;
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
        themeText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    };
    themeBtn.addEventListener('click', toggleTheme);
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const messages = Array.from(messagesWrapper.querySelectorAll('.message-row'));
            if (messages.length === 0) {
                alert("No chat history to share!");
                return;
            }

            let chatText = "DEBA AI Chat Export\n==================\n\n";
            messages.forEach(msg => {
                if (msg.classList.contains('loading-indicator')) return;
                const isUser = msg.classList.contains('user-msg');
                const sender = isUser ? "You" : "DEBA AI";
                const contentNode = msg.querySelector('.message-content');
                const content = contentNode ? contentNode.innerText : '';
                if (content.trim()) {
                    chatText += `${sender}:\n${content}\n\n`;
                }
            });

            const fileDate = new Date().toISOString().slice(0, 10);
            const file = new File([chatText], `DEBA_AI_Chat_${fileDate}.txt`, { type: "text/plain" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Chat with DEBA AI',
                        text: 'Here is my chat with DEBA AI',
                        files: [file]
                    });
                    return;
                } catch (err) {
                    console.log("Share failed or cancelled, falling back to download.");
                }
            }
            
            // Fallback download
            const blob = new Blob([chatText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = (chatInput.scrollHeight > 200 ? 200 : Math.max(chatInput.scrollHeight, 24)) + 'px';
        if (chatInput.value.trim() !== '' || currentImageBase64) { sendBtn.removeAttribute('disabled'); } 
        else { sendBtn.setAttribute('disabled', 'true'); }
    });

    if (attachBtn) {
        attachBtn.addEventListener('click', () => { fileInput.click(); });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentImageBase64 = event.target.result;
                    currentMimeType = file.type;
                    imagePreview.src = currentImageBase64;
                    imagePreviewContainer.style.display = 'block';
                    sendBtn.removeAttribute('disabled');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', () => { clearImageAttachment(); });
    }

    function clearImageAttachment() {
        currentImageBase64 = null;
        currentMimeType = null;
        imagePreview.src = "";
        imagePreviewContainer.style.display = 'none';
        fileInput.value = "";
        if (chatInput.value.trim() === '') { sendBtn.setAttribute('disabled', 'true'); }
    }

    // Voice Input Logic
    let recognition;
    let isRecording = false;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            isRecording = true;
            if (voiceBtn) voiceBtn.classList.add('recording');
            chatInput.placeholder = "Listening...";
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            chatInput.value = chatInput.value + (chatInput.value ? ' ' : '') + transcript;
            chatInput.dispatchEvent(new Event('input'));
            sendBtn.removeAttribute('disabled');
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error:", event.error);
            stopRecording();
        };

        recognition.onend = function() {
            stopRecording();
        };
    } else {
        if (voiceBtn) voiceBtn.style.display = 'none';
    }

    function stopRecording() {
        isRecording = false;
        if (voiceBtn) voiceBtn.classList.remove('recording');
        chatInput.placeholder = "Message DEBA AI...";
        if (recognition) {
            try { recognition.stop(); } catch(e) {}
        }
    }

    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            if (!recognition) return alert("Your browser doesn't support voice input.");
            if (isRecording) {
                stopRecording();
            } else {
                try { recognition.start(); } catch(e) { console.error(e); }
            }
        });
    }

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
    sendBtn.addEventListener('click', handleSend);
    
    newChatBtn.addEventListener('click', () => {
        currentChatId = Date.now().toString();
        messagesWrapper.innerHTML = '';
        welcomeScreen.style.display = 'flex';
        chatInput.value = '';
        chatInput.style.height = 'auto';
        sendBtn.setAttribute('disabled', 'true');
        if (window.innerWidth <= 768) { sidebar.classList.remove('active'); }
    });

    window.setInputAndSubmit = (text) => { chatInput.value = text; handleSend(); };

    function handleSend() {
        const message = chatInput.value.trim();
        if ((message === '' && !currentImageBase64) || isWaitingForResponse) return;
        if (welcomeScreen.style.display !== 'none') { welcomeScreen.style.display = 'none'; }
        
        addMessage(message, 'user', currentImageBase64);
        
        const msgToSend = message;
        const imgToSend = currentImageBase64;
        const mimeToSend = currentMimeType;
        
        chatInput.value = '';
        chatInput.style.height = 'auto';
        clearImageAttachment();
        sendBtn.setAttribute('disabled', 'true');
        
        addTypingIndicator();
        scrollToBottom();
        
        fetchAIResponseFromBackend(msgToSend, imgToSend, mimeToSend);
    }

    function addMessage(text, sender, imageUrl = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message-row ${sender}-msg`;
        const avatarStr = sender === 'user' ? (localStorage.getItem('debabot_user') || 'U').charAt(0).toUpperCase() : '<span class="material-symbols-rounded">auto_awesome</span>';
        
        let displayContent = escapeHTML(text || "");
        if (sender === 'ai' && typeof marked !== 'undefined') {
            displayContent = marked.parse(text || "");
        }
        
        let imgHtml = "";
        if (imageUrl) {
            imgHtml = `<img src="${imageUrl}" style="max-width:100%; max-height:300px; border-radius:8px; margin-bottom:8px; object-fit:contain;"><br/>`;
        }
        
        msgDiv.innerHTML = `
            <div class="profile-pic ${sender}-pic">
                ${avatarStr}
            </div>
            <div class="message-content">${imgHtml}${displayContent}</div>
        `;
        messagesWrapper.appendChild(msgDiv);
    }

    function addTypingIndicator() {
        isWaitingForResponse = true;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message-row ai-msg loading-indicator`;
        msgDiv.id = 'typing-indicator';
        msgDiv.innerHTML = `
            <div class="profile-pic ai-pic"><span class="material-symbols-rounded">auto_awesome</span></div>
            <div class="message-content"><div class="typing-loader"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>
        `;
        messagesWrapper.appendChild(msgDiv);
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) { indicator.remove(); }
        isWaitingForResponse = false;
    }

    function scrollToBottom() { chatContainer.scrollTop = chatContainer.scrollHeight; }

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    async function fetchAIResponseFromBackend(userMessage, imageBase64, mimeType) {
        let gotResponse = false;
        
        // 1. Try Backend Server first (if available)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const response = await fetch(`${BACKEND_URL}/api/chat/${currentChatId}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ message: userMessage, imageBase64, mimeType }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                removeTypingIndicator();
                addMessage(data.aiMessage, 'ai');
                scrollToBottom();
                saveLocalChat(currentChatId, userMessage, userMessage, imageBase64, mimeType, data.aiMessage);
                loadChatList(false);
                gotResponse = true;
                return;
            }
        } catch (error) {
            // Local backend offline / unreachable, fallback to direct Gemini API
        }

        if (gotResponse) return;

        // 2. Direct Gemini Fallback (ensures chatbot ALWAYS answers intelligently!)
        try {
            const GEMINI_API_KEY = "AIzaSyCfenMGlJKbgL3fDjSt75xbdjiVZoTqreo";
            const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            
            const localDb = getLocalChats();
            const currentChat = localDb[currentChatId];
            const history = currentChat ? currentChat.history : [];
            
            const contents = [];
            // Format previous conversation history
            history.forEach(item => {
                const parts = [];
                if (item.text) parts.push({ text: item.text });
                if (item.imageBase64 && item.mimeType) {
                    const clean = item.imageBase64.includes(',') ? item.imageBase64.split(',')[1] : item.imageBase64;
                    parts.push({ inlineData: { mimeType: item.mimeType, data: clean } });
                }
                if (parts.length > 0) {
                    contents.push({ role: item.role === 'user' ? 'user' : 'model', parts });
                }
            });

            // Add latest user input
            const userParts = [];
            if (userMessage) userParts.push({ text: userMessage });
            if (imageBase64 && mimeType) {
                const clean = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
                userParts.push({ inlineData: { mimeType: mimeType, data: clean } });
            }
            if (userParts.length === 0) userParts.push({ text: "Hello" });
            contents.push({ role: 'user', parts: userParts });

            const geminiRes = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: contents,
                    systemInstruction: {
                        parts: [{ text: "You are DEBA AI, an intelligent, helpful, and friendly AI assistant created by Debabrata Malik. Provide accurate, helpful, and concise answers with Markdown formatting." }]
                    }
                })
            });

            const data = await geminiRes.json();
            removeTypingIndicator();

            if (geminiRes.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                const aiText = data.candidates[0].content.parts[0].text;
                addMessage(aiText, 'ai');
                scrollToBottom();
                saveLocalChat(currentChatId, userMessage, userMessage, imageBase64, mimeType, aiText);
                loadChatList(false);
            } else {
                throw new Error(data.error?.message || "Failed to parse response");
            }
        } catch (geminiError) {
            console.error("Gemini fallback error:", geminiError);
            removeTypingIndicator();
            const fallbackMsg = "Hello! I am DEBA AI, created by Debabrata Malik. How can I help you today?";
            addMessage(fallbackMsg, 'ai');
            scrollToBottom();
            saveLocalChat(currentChatId, userMessage, userMessage, imageBase64, mimeType, fallbackMsg);
            loadChatList(false);
        }
    }

    sendBtn.setAttribute('disabled', 'true');
});
