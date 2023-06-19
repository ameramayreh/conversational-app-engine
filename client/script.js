const MAX_TOKENS = {{MAX_TOKENS}};

class ConversationalAppEngineClient {
    contentList = [];
    messageField;
    submitButton;
    chatMessagesList;
    speechRecognition;
    messageform;
    capacityIndecator;
    user;
    app;

    mesageStyleClasses = {
        "user": "user rounded-md bg-blue-50 rounded-tl-none p-2 ml-9 mt-4",
        "response": "response rounded-md bg-blue-200 rounded-tr-none p-2 mr-9 mt-4",
        "error": "error rounded-md bg-red-200 p-2"
    };

    constructor(user) {
        this.user = user;
        const appsList = window['appsList'] || [];
        this.app = appsList.find(a => a.current) || {};
        this.capacityIndecator = document.getElementById("capacity-indecator");
        this.initMessageField();
        this.submitButton = document.getElementById("submitbutton");
        this.chatMessagesList = document.getElementById("chatmessages");
        this.chatsList = document.getElementById("chatslist");
        this.contentPreview = document.getElementById("contentpreview");
        this.messageform = document.getElementById("messageform");
        this.initSpeechRecognition();
    }

    initMessageField() {
        this.messageField = document.getElementById("message");
        this.messageField.addEventListener("keypress", (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.postMessage();
                return false;
            }
        });

        this.messageField.addEventListener("paste", (e) => {
            // Prevent the default action
            e.preventDefault();

            // Get the copied text from the clipboard
            const text = e.clipboardData
                ? (e.originalEvent || e).clipboardData.getData('text/plain')
                : // For IE
                window.clipboardData
                    ? window.clipboardData.getData('Text')
                    : '';

            if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                document.execCommand('insertText', false, text);
            } else {
                // Insert text at the current position of caret
                const range = document.getSelection().getRangeAt(0);
                range.deleteContents();

                const textNode = document.createTextNode(text);
                range.insertNode(textNode);
                range.selectNodeContents(textNode);
                range.collapse(false);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }

    initSpeechRecognition() {
        if ("webkitSpeechRecognition" in window) {
            // Initialize webkitSpeechRecognition
            this.speechRecognition = new webkitSpeechRecognition();

            // String for the Final Transcript
            let final_transcript = "";

            // Set the properties for the Speech Recognition object
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'en-US'

            // Callback Function for the onStart Event
            this.speechRecognition.onstart = () => {
                this.disableChat();
            };
            this.speechRecognition.onerror = (error) => {
                // Hide the Status Element
                console.error(error);
                this.enableChat();
                alert(error?.error);
            };
            this.speechRecognition.onend = () => {
            };

            this.speechRecognition.onresult = (event) => {
                // Create the interim transcript string locally because we don't want it to persist like final transcript
                let interim_transcript = "";
                final_transcript = "";

                // Loop through the results from the speech recognition object.
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }

                // Set the Final transcript and Interim transcript.
                console.log(final_transcript);
                console.log(interim_transcript);
                if (final_transcript) {
                    this.messageField.innerText = final_transcript;
                    this.postMessage();
                }
            };
        } else {
            console.log("Speech Recognition Not Available");
        }
    }

    disableChat() {
        this.messageField.contentEditable = false;
        this.submitButton.disabled = true;
    }

    enableChat() {
        this.messageField.contentEditable = true;
        this.submitButton.disabled = false;
    }

    addMessage(message, messageClass, id, userName, userImageUrl, userIconName) {
        let messageUser = '';
        if (userImageUrl) {
            messageUser = `<img src="${userImageUrl}" class="message-user rounded-full w-8 h-8 absolute"/>`
        } else if (userIconName) {
            messageUser = `<i class="message-user material-icons rounded-full w-8 h-8 absolute text-gray-500">${userIconName}</i>`;
        } else if (userName) {
            messageUser = `<div class="message-user absolute w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span class="text-l text-gray-600" title="${userName}">${userName.toUpperCase()[0]}</span>
          </div>`;
        }

        this.chatMessagesList.innerHTML += "<li" + (id === undefined ? '' : ' id="' + id + '"') + " class='relative " + messageClass + "'>" + messageUser + message + "</li>";
        this.chatMessagesList.scrollTop = this.chatMessagesList.scrollHeight;
    }

    getCurrentChatId() {
        let chatid = localStorage.getItem(this.getChatIdLocalStorageKey(this.getUserId()));
        if (!chatid) {
            chatid = this.newChat();
        }
        return chatid;
    }

    addChatItem(chatid, chatName) {
        this.chatsList.innerHTML += "<li class='chat-item flex bg-white rounded-md mb-1 px-2 py-1 items-center hover:bg-gray-200' id='chat" + chatid + "'><a class='flex-grow cursor-pointer font-bolder text-gray-600 hover:text-gray-900' tabindex=\"0\" onclick=\"appEngine.showChat('" + chatid + "')\">" + chatName + "</a><button onclick=\"appEngine.deleteChat('" + chatid + "')\"><i class='material-icons text-gray-400 hover:text-gray-600'>delete</i></button></li>";
    }


    clearChatItems() {
        this.chatsList.innerHTML = "";
    }

    getUserId() {
        return this.user.userId;
    }

    newChat() {
        const chatid = Math.random().toString(36).substring(2, 15);
        this.setCurrentChatId(chatid);
        this.addChatItem(chatid, "{{NEW_CHAT_NAME}}");
        this.setCurrentChat(chatid);
        this.clearChat();
        return chatid;
    }

    setCurrentChatId(chatid) {
        localStorage.setItem(this.getChatIdLocalStorageKey(this.getUserId()), chatid);
    }

    clearChat() {
        this.chatMessagesList.innerHTML = '';
        this.addMessage("{{CHAT_START_INSTRUCTIONS}}", this.mesageStyleClasses.response, undefined, null, null, this.app.icon)
        this.contentPreview.innerHTML = "";
        this.messageField.innerHTML = "";
        this.contentList.length = 0;
        this.capacityIndecator.style.width = '0%';
        this.capacityIndecator.title = null;
        this.enableChat();
    }

    showContent(index) {
        if (this.contentList[index]) {
            this.setContentPreview(this.contentList[index], index);
        }
    }

    showChat(chatid) {
        this.setCurrentChatId(chatid);
        this.loadMessages(chatid);
        this.setCurrentChat(chatid);
    }

    setCurrentChat(chatid) {
        document.querySelectorAll('.chat-item').forEach((li) => li.classList.remove('current-chat'));
        document.getElementById('chat' + chatid).classList.add('current-chat');
    }

    addResponse(response, isNew) {
        let responseMessage = response.message;

        const appContent = response.appContent;
        let showPreviewButton = '';
        let id = undefined;
        if (appContent) {
            this.setContentPreview(appContent, this.contentList.length);
            id = 'content' + this.contentList.length;
            this.contentList.push(appContent);
            showPreviewButton = '<button class="content-preview-button" onclick="appEngine.showContent(' + (this.contentList.length - 1) + ')" ><i class="material-icons">preview</i></button>';
        }

        if (response.usage) {
            const usagePerc = Math.round(100 * Math.min(response.usage.total_tokens, MAX_TOKENS) / MAX_TOKENS);
            this.capacityIndecator.style.width = usagePerc + '%';
            this.capacityIndecator.title = 'Used ' + response.usage.total_tokens;
        }

        if (showPreviewButton) {
            responseMessage += '<div class="message-footer">' + showPreviewButton + '</div>';
        }

        if (isNew && "speechSynthesis" in window && response.message) {
            speechSynthesis.speak(new SpeechSynthesisUtterance(response.message));
        } else {
            console.log("Text to Speech Not Available");
        }
        this.addMessage(responseMessage.trim(), this.mesageStyleClasses.response, id, null, null, this.app.icon);
        if (id) {
            this.setCurrentContentMessage(this.contentList.length - 1);
        }
        if (response?.usage?.total_tokens >= MAX_TOKENS) {
            this.addMessage("Reached the maximun tokens count for a signle converation, sorry :(", this.mesageStyleClasses.error);
            this.disableChat();
        }
    }

    setContentPreview(html, formIndex) {
        this.setCurrentContentMessage(formIndex);
        this.setInnerHTML(this.contentPreview, html);
    }

    setInnerHTML(elm, html) {
        elm.innerHTML = html;

        Array.from(elm.querySelectorAll("script"))
            .forEach(oldScriptEl => {
                const newScriptEl = document.createElement("script");

                Array.from(oldScriptEl.attributes).forEach(attr => {
                    newScriptEl.setAttribute(attr.name, attr.value)
                });

                const scriptText = document.createTextNode(oldScriptEl.innerHTML);
                newScriptEl.appendChild(scriptText);

                oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
            });
    }

    setCurrentContentMessage(contentIndex) {
        for (let i = 0; i < this.contentList.length; i++) {
            if (i == contentIndex) {
                document.getElementById('content' + i).classList.add('current-content');
            } else {
                document.getElementById('content' + i).classList.remove('current-content');
            }
        }
    }

    postMessage() {
        const message = this.messageField.innerText.trim();
        if (!message) {
            return false;
        }

        const chatid = this.getCurrentChatId();
        const data = { message: message, userid: this.getUserId(), chatid: chatid };

        this.addMessage(message, this.mesageStyleClasses.user, undefined, this.user.name, this.user.imageUrl);
        this.messageField.innerHTML = '';
        this.disableChat();
        this.messageform.classList.add('processing');

        fetch(`${location.origin}/api/chat?app=${this.app.app}`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                this.addResponse(data, true);
                let chatItem = document.getElementById("chat" + chatid);
                if (!chatItem) {
                    this.addChatItem(chatid, data.chatName);
                } else {
                    chatItem.childNodes[0].innerHTML = data.chatName ? data.chatName : chatItem.childNodes[0].innerHTML;
                }
                this.enableChat();
                this.messageform.classList.remove('processing');
            })
            .catch(error => {
                console.error(error);
                this.addMessage("Error: " + error, this.mesageStyleClasses.error);
                this.messageField.innerText = message;
                this.enableChat();
                this.messageform.classList.remove('processing');
            });
    }

    loadMessages(chatid) {
        fetch(`${location.origin}/api/chatmessages?app=${this.app.app}&userid=${this.getUserId()}&chatid=${chatid}`, {
            method: "get",
        })
            .then(response => response.json())
            .then(data => {
                this.clearChat();
                let i = 1;
                for (const responseMessage of data) {
                    if (i++ % 2) {
                        this.addMessage(responseMessage.message, this.mesageStyleClasses.user, undefined, this.user.name, this.user.imageUrl);
                    } else {
                        this.addResponse(responseMessage);
                    }
                }
            })
            .catch(error => {
                console.error(error);
                this.addMessage("Failed to load message: " + error, this.mesageStyleClasses.error);
            });
    }

    loadUserChats() {
        const userid = this.getUserId();

        fetch(`${location.origin}/api/userchats?app=${this.app.app}&userid=${userid}`, {
            method: "get",
        })
            .then(response => response.json())
            .then(data => {
                this.clearChatItems();
                if (!data?.length) {
                    this.newChat();
                    return;
                }
                for (const chatItem of data) {
                    this.addChatItem(chatItem.id, chatItem.name);
                }

                const chatIdLocalStorageKey = this.getChatIdLocalStorageKey(userid);
                let chatid = localStorage.getItem(chatIdLocalStorageKey);
                if ((!chatid || !data?.find(c => c.id === chatid)) && data?.length) {
                    chatid = data[0].id;
                    localStorage.setItem(chatIdLocalStorageKey, chatid);
                }
                if (chatid) {
                    this.loadMessages(chatid);
                    this.setCurrentChat(chatid);
                }
            })
            .catch(error => {
                console.error(error);
                this.addMessage("Failed to load old forms: " + error, this.mesageStyleClasses.error);
            });
    }

    getChatIdLocalStorageKey(userid) {
        const params = (new URL(document.location)).searchParams;
        let appId = params.get("app");
        appId = appId ? '-' + appId : '';
        return userid + appId + "-current-chat-id";
    }

    deleteChat(chatid) {
        if (!confirm('Are you shore you want to delete this chat [' + document.getElementById('chat' + chatid).getElementsByTagName('a')[0].innerText + ']?')) {
            return;
        }
        fetch(`${location.origin}/api/userchat?app=${this.app.app}&userid=${this.getUserId()}&chatid=${chatid}`, {
            method: "delete",
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const chatIdLocalStorageKey = this.getChatIdLocalStorageKey(this.getUserId());
                    if (chatid == localStorage.getItem(chatIdLocalStorageKey)) {
                        localStorage.removeItem(chatIdLocalStorageKey);
                    }
                    this.loadUserChats();
                } else {
                    alert("Failed to delete chat: " + data.error);
                }
            })
            .catch(error => {
                alert("Failed to delete chat: " + data.error);
                console.log(error);
            });
    }

    loadAppsMenu() {
        const appsMenu = document.getElementById('appsmenu');
        const appsList = window['appsList'] || [];
        appsMenu.innerHTML = appsList.map(a => {
            const appLinkClasses = `flex flex-col relative items-center text-center mb-4 ${a.current ? ' text-white' : 'text-gray-600 hover:text-gray-50'}`;
            const appIcon = `<i class="material-icons">${a.icon}</i>`;
            const appBadge = a.badge ? `<span class="app-badge absolute -top-2 -right-4 bg-red-500 text-white font-bold px-1 rounded-full">${a.badge}</span>` : '';
            return `<a href="/?app=${a.app}" title="${a.name}" class="${appLinkClasses}">${appIcon}${appBadge}</a>`;
        }).join('');
    }

    toggleAppsMenu() {
        const appsMenu = document.getElementById('appsmenu');
        appsMenu.classList.toggle('shown');
    }
}

class CurrentUser {
    db;
    userId;
    name = 'Guest';
    imageUrl;

    constructor(userTask) {
        this.userId = localStorage.getItem('chat-user-id');
        if (!this.userId) {
            this.userId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('chat-user-id', this.userId);
        }
        userTask(this);
    }
}

let appEngine = null;
window.addEventListener("DOMContentLoaded", (event) => {
    window.currentUser = window.currentUser || new CurrentUser((user) => {
        appEngine = new ConversationalAppEngineClient(user);
        appEngine.loadAppsMenu();
        appEngine.loadUserChats();
    });
});
