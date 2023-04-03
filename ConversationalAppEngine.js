import { Configuration, OpenAIApi } from "openai";
import * as fs from 'node:fs';

export class ConversationalAppEngine {
    userMessages = {};
    openai = null;
    defaultMesages = [];
    userMessages = {};

    constructor(appClass) {
        this.openai = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        }));

        this.app = new appClass(this);
        this.defaultMesages = this.app.getDefaultMessages();

        if(!fs.existsSync('./data/')) {
            fs.mkdirSync('./data/');
        }

        this.loadData();
    }

    loadData() {
        fs.readFile(this.getDataFileName(), 'utf8', (error, data) => {
            if (error) {
                console.log("Error: " + error);
            } else {
                this.userMessages = JSON.parse(data);
            }
        });
    }

    getDataFileName() {
        return 'data/' + this.app.constructor.name + '-data.json';
    }

    storeData() {
        const json = JSON.stringify(this.userMessages);
        fs.writeFile(this.getDataFileName(), json, 'utf8', (error) => {
            if (error) {
                console.log("Error: " + error);
            }
        });
    }

    getUserChats(userid) {
        const user = this.getUser(userid);
        const chats = [];
        for (const chatid of Object.keys(user)) {
            const chat = user[chatid];
            chats.push({ name: chat.name, id: chatid });
        }
        return chats;
    }

    getUser(userId) {
        const user = this.userMessages[userId] = this.userMessages[userId] || {};
        return user;
    }

    getChat(user, chatId) {
        return user[chatId] = user[chatId] || { messages: [...this.defaultMesages], name: "", usage: [] };
    }

    getUserChat(userid, chatid) {
        const user = this.getUser(userid);
        const chat = this.getChat(user, chatid);
        const chatMessages = [];

        let i = 0;
        for (const message of chat.messages.slice(this.defaultMesages.length)) {
            const msg = {
                message: this.app.getTextMessage(message.content),
                appContent: this.app.getAppContent(message.content)
            };
            if (message.role == 'assistant') {
                msg.usage = chat.usage[i++];
            }
            chatMessages.push(msg);
        }
        return chatMessages;
    }

    deleteUserChat(userid, chatid) {
        const user = this.getUser(userid);
        delete user[chatid];
        this.storeData();
    }

    postMessage(userid, chatid, message, callback) {
        const user = this.getUser(userid);
        const chat = this.getChat(user, chatid);
        const messages = chat.messages;

        messages.push({ "role": "user", "content": message });

        try {
            this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            }).then((completion) => {
                console.log("Recived from ChatGPT: ");
                console.log(JSON.stringify(completion.data));
                const responseMessage = completion.data.choices[0].message.content;

                const chatName = this.app.getChatNameFromMessage(responseMessage);
                if (chatName) {
                    chat.name = chatName;
                }

                messages.push(completion.data.choices[0].message);
                chat.usage.push(completion.data.usage);
                this.storeData();

                const response = {
                    status: 'success',
                    message: this.app.getTextMessage(responseMessage),
                    appContent: this.app.getAppContent(responseMessage),
                    chatName: chat.name,
                    usage: completion.data.usage
                };

                callback(null, response);
            }).catch(error => {
                messages.pop();
                console.error(error);
                callback({
                    message: error?.message || error
                }, null);
            });
        } catch (error) {
            messages.pop();
            console.error(error);
            callback({
                message: error.message || error
            }, null);
        }
    }

    substituteText(text) {
        text = text.replaceAll('{{APP_NAME}}', this.app.appName);
        text = text.replaceAll('{{CHATS_LIST_TITLE}}', this.app.chatListTitle);
        text = text.replaceAll('{{NEW_CHAT}}', this.app.newChatLabel);
        text = text.replaceAll('{{CONTENT_PREVIEW_PLACE_HOLDER}}', this.app.contentPreviewPlaceholder);
        text = text.replaceAll('{{CHAT_START_INSTRUCTIONS}}', this.app.chatStartInstruction);
        text = text.replaceAll('{{NEW_CHAT_NAME}}', this.app.newChatName);
        return text;
    }
}