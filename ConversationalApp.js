

import yaml from 'js-yaml';

class ConversationalApp {
    appName = 'My App';
    chatListTitle = 'My Chats';
    newChatLabel = 'New Chat';
    newChatName = 'New Chat...';
    contentPreviewPlaceholder = 'No Preview';
    chatStartInstruction = 'How can I help you?';
    appIconName = 'token';

    temperature = 1;
    model = 'gpt-3.5-turbo-0613';
    modelMaxTokens = 4096;

    constructor(context) {
        this.context = context
    }

    /**
     * Returns a list of messages that till OpenAI chat API about its role in the conversation,
     * the expected user input, how to process it, and, what is the expected response.
     * It can also includes examples about the user input and/or expected response.
     * Each message is an object that contains a role and content properties: {"role": "...", "content": "..."}
     * The role of first message should be "system", and the content is a high level description of OpenAI chat API's role in this conversation
     * Then it followed by one or more messages with the "user" role, that tells OpenAI chat API how to process and response to the user input
     * You may add a last message with role "assistant", where you ask the user to provide input.
     * 
     * @returns array of messages
     */
    getInstructionMessages() { return [] };

    /**
     * @deprecated use getInstructionMessages instead
     */
    getDefaultMessages() { return this.getInstructionMessages(); };

    /**
     * Returns the title of the chat or a promise that resolves to the title, this can be derived from OpenAI chat API's responseMessage,
     * especially if you instruct to include it in the response in the default messages.
     * If no title can be derived from the message you can return a constant value.
     * Or return null to keep the previous chat title.
     * 
     * @param {*} responseMessage the response content returned by OpenAI chat API
     * @param {*} userMessage the user message resulted on this response
     * @param {*} chat the current chat
     * @returns the chat title
     */
    getChatNameFromMessage(responseMessage, userMessage, chat) { return 'Unknown'; };

    /**
     * Returns the normal conversation text returned in OpenAI chat API's responseMessage (if any)
     * after excluding the required app's business data.
     * 
     * @param {*} responseMessage the response content returned by OpenAI chat API
     * @returns 
     */
    getDialogText(responseMessage) { return responseMessage; }

    /**
     * @deprecated use getDialogText instead
     */
    getTextMessage(responseMessage) { return this.getDialogText(responseMessage); }

    /**
     * Returns formatted the app's business data that returned in OpenAI chat API's responseMessage (if any),
     * after excluding the normal conversation text.
     * Usually you will format the app's business data as HTML along with any needed css and js (local and included).
     * 
     * @param {*} responseMessage the response content returned by OpenAI chat API
     * @returns 
     */
    getAppContent(responseMessage) { return '<h1>No Content</h1>'; }


    /**
     * Returns a list of function descriptors that can be used by GPT based on the user input
     * See the functions call api guide: https://platform.openai.com/docs/guides/gpt/function-calling
     * @returns .
     */
    getAvailableFunctions() { return []; }

    /**
     * Execute the function logic and return the result.
     * This method is called when GPT requests the result of a function.
     * The app must implement the logic of the functions described in 
     * the function descriptor returned by the getAvailableFunctions()
     * 
     * @param {*} functionName 
     * @param {*} args 
     * @returns string or promise that resolves to string
     */
    callFunction(functionName, args) { return 'none'; }

    parseYaml(yamlStr) {
        return yaml.load(yamlStr.replace(/```+[^\n]*\n?/g, ''));
    }
}

export { ConversationalApp };