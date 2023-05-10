class ConversationalAppEngineClient {
    contentList = [];
    messageField;
    submitButton;
    chatMessagesList;
    speechRecognition;
    user;

    constructor(user) {
        this.user = user;
        this.messageField = document.getElementById("message");
        this.submitButton = document.getElementById("submitbutton");
        this.chatMessagesList = document.getElementById("chatmessages");
        this.chatsList = document.getElementById("chatslist");
        this.contentPreview = document.getElementById("contentpreview");
        this.initSpeechRecognition();
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
                    this.messageField.value = final_transcript;
                    this.postMessage();
                }
            };
        } else {
            console.log("Speech Recognition Not Available");
        }
    }

    disableChat() {
        this.messageField.disabled = true;
        this.submitButton.disabled = true;
    }

    enableChat() {
        this.messageField.disabled = false;
        this.submitButton.disabled = false;
    }

    addMessage(message, messageClass, id) {
        this.chatMessagesList.innerHTML += "<li" + (id === undefined ? '' : ' id="' + id + '"') + " class='" + messageClass + "'>" + message + "</li>";
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
        this.chatsList.innerHTML += "<li class='chat-item' id='chat" + chatid + "'><a tabindex=\"0\" onclick=\"appEngine.showChat('" + chatid + "')\">" + chatName + "</a><button onclick=\"appEngine.deleteChat('" + chatid + "')\">🗑</button></li>";
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
        this.chatMessagesList.innerHTML = "<li class='instructions'>{{CHAT_START_INSTRUCTIONS}}</li>";
        this.contentPreview.innerHTML = "";
        this.messageField.value = "";
        this.contentList.length = 0;
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
            showPreviewButton = '<button class="content-preview-button" onclick="appEngine.showContent(' + (this.contentList.length - 1) + ')" >📄 Preview ➤</button>';
        }

        let usageElement = '';
        if (response.usage) {
            usageElement = '<small title="Prompt: ' + response.usage.prompt_tokens + ', Response: ' + response.usage.completion_tokens + '">API Usage: ' + response.usage.total_tokens + '</small>';
        }
        responseMessage += '<div class="message-footer">' + showPreviewButton + usageElement + '</div>';

        if (isNew && "speechSynthesis" in window && response.message) {
            speechSynthesis.speak(new SpeechSynthesisUtterance(response.message));
        } else {
            console.log("Text to Speech Not Available");
        }
        this.addMessage(responseMessage.trim(), "response", id);
        if (id) {
            this.setCurrentContentMessage(this.contentList.length - 1);
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
        const message = this.messageField.value;
        if (!message) {
            return false;
        }

        const chatid = this.getCurrentChatId();
        const data = { message: message, userid: this.getUserId(), chatid: chatid };

        this.addMessage(message, "user");
        this.messageField.value = '';
        this.disableChat();

        fetch("http://" + location.hostname + ":3000/api/chat", {
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
            })
            .catch(error => {
                console.error(error);
                this.addMessage("Error: " + error, "error");
                this.messageField.value = message;
                this.enableChat();
            });
    }

    loadMessages(chatid) {
        fetch("http://" + location.hostname + ":3000/api/chatmessages?userid=" + this.getUserId() + "&chatid=" + chatid, {
            method: "get",
        })
            .then(response => response.json())
            .then(data => {
                this.clearChat();
                let i = 1;
                for (const responseMessage of data) {
                    if (i++ % 2) {
                        this.addMessage(responseMessage.message, "user");
                    } else {
                        this.addResponse(responseMessage);
                    }
                }
            })
            .catch(error => {
                console.error(error);
                this.addMessage("Failed to load message: " + error, "error");
            });
    }

    loadUserChats() {
        const userid = this.getUserId();

        fetch("http://" + location.hostname + ":3000/api/userchats?userid=" + userid, {
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
                this.addMessage("Failed to load old forms: " + error, "error");
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
        fetch("http://" + location.hostname + ":3000/api/userchat?userid=" + this.getUserId() + "&chatid=" + chatid, {
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
        appsMenu.innerHTML = appsList.map(a => '<a href="/?app=' + a.app + '"' + (a.current ? ' class="current"' : '') + '>' + a.name + '</a>').join('');
    }

    toggleAppsMenu() {
        const appsMenu = document.getElementById('appsmenu');
        appsMenu.classList.toggle('shown');
    }
}

class CurrentUser {
    db;
    userId;

    constructor(userTask) {
        this.openDatabase().then(db=>{
            this.loadUserId().then((id)=> {
                this.userId = id; 
                userTask(this);
            });
        });
    }

    openDatabase() {
        return new Promise((resolve, reject) => {// open the indexedDB database
            const request = window.indexedDB.open('chatDB', 1);

            // create object store and indexes
            request.onupgradeneeded = function (event) {
                this.db = event.target.result;
                const objectStore = this.db.createObjectStore('chats', { keyPath: 'id' });
                objectStore.createIndex('user_id', 'user_id', { unique: false });
            }

            // handle errors
            request.onerror = function (event) {
                reject('Failed to open chatDB:', event.target.error);
            }

            // store the database object for later use
            request.onsuccess = function (event) {
                resolve(this.db = event.target.result);
            }
        });
    }

    loadUserId() {
        return new Promise(async (resolve, reject) => {
            // check if the user id is stored in the database
            let db;
            await this.openDatabase().then(d => db = d);
            const transaction = db.transaction(['chats'], 'readwrite');
            const objectStore = transaction.objectStore('chats');
            const index = objectStore.index('user_id');
            const request = index.getAll();

            request.onerror = function (event) {
                reject(event.target.error);
            }

            request.onsuccess = function (event) {
                const users = event.target.result;
                const user = users.find(u => u.id === 'chat-user-id');

                // if user id is not found, create a new one
                if (!user) {
                    const newUserId = Math.random().toString(36).substring(2, 15);
                    const newUserData = { id: 'chat-user-id', user_id: newUserId };

                    const addRequest = objectStore.add(newUserData);

                    addRequest.onerror = function (event) {
                        reject(event.target.error);
                    }

                    addRequest.onsuccess = function (event) {
                        resolve(newUserId);
                    }
                } else {
                    resolve(user.user_id);
                }
            }
        });
    }
}

let appEngine = null;
window.addEventListener("DOMContentLoaded", (event) => {
    new CurrentUser((user) => {
        appEngine = new ConversationalAppEngineClient(user);
        appEngine.loadAppsMenu();
        appEngine.loadUserChats();
    });
});
