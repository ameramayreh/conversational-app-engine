

import yaml from 'js-yaml';

class ConversationalApp {
    appName = 'My App';
    chatListTitle = 'My Chats';
    newChatLabel = 'New Chat';
    newChatName = 'New Chat...';
    contentPreviewPlaceholder = 'No Preview';
    chatStartInstruction = 'Please keep in mind that we need to ensure that the API usage does not exceed 4K.';

    temperature = 1;

    constructor(context) {
        this.context = context;
    }
    getDefaultMessages() {return []};

    getChatNameFromMessage(message) {return 'Unknown';};
    getTextMessage(message) {return message;}
    getAppContent(message) {return '<h1>No Content</h1>';}
    parseYaml(yamlStr) {
        return yaml.load(yamlStr);
    }
}

export {ConversationalApp};