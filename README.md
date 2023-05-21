# About
Conversational App Engine is an open-source engine that allows developers to quickly implement chat based apps using OpenAI's completion API. With Conversational App Engine, developers can focus on their app's use case while leveraging the power of Conversational App Engine to handle the chat management.

**Content:**
 - [History](#history)
 - [How to use](#how-to-use)
 - [Demos](#demos)
 - [Create your App](#create-your-app)

## History
Conversational App Engine was initially created as a demonstration of how OpenAI's completion API can be used to build a form designer. However, we quickly realized that the same technology could be applied to a wide range of use cases. Our goal is to provide developers with an easy-to-use engine that can improve their app's user experience with conversational AI.

![History-Form-Designer-slower-80](https://user-images.githubusercontent.com/129025554/229411348-b2d4da89-bce9-483d-93b0-29ec698172c6.gif)


# How to use
To use Conversational App Engine, you will need to have Node.js and npm installed on your computer. You will also need an OpenAI API key to access the completion API. Once you have these prerequisites, you can clone this project using Git or download it as a zip file.

Next, set the environment variable OPENAI_API_KEY to your OpenAI API key. This will allow Conversational App Engine to authenticate your requests to the API.

To implement your own app, create a new class in the apps directory that extends the ConversationApp class. You will need to implement several methods, such as getDefaultMessages, getChatNameFromMessage, and getTextMessage, to define your app's behavior. You can also overwrite any of the default messages, such as appName and chatListTitle, to customize the user interface.

Once you have created your app, import it into the index.js file and use it to initialize a new instance of ConversationalAppEngine. Then, run node ./index.js in the project directory and navigate to http://localhost:3000/ to see your app in action.

## Prerequisets
* [An OpenAI API Key](https://platform.openai.com/account/api-keys)
* [Nodejs and npm](https://nodejs.org/en/download)
* [Git (Optional)](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## [1] Set the environment variable OPENAI_API_KEY to your openai api key
You need to obtain an “OpenAI” API key from https://platform.openai.com/account/api-keys and set the OPENAI_API_KEY environment variable. This will allow the app to make API calls to OpenAI.


## [2] Clone this project
```
git clone https://github.com/david-m-s/conversational-app-engine.git
cd conversational-app-engine
npm install
```
If you don't have git installed. You can download the project [here](https://github.com/ameramayreh/conversational-app-engine/archive/refs/heads/main.zip)

## [3] Implement your app [Optional]
See [Create your App](#create-your-app).

## [4] Run your project
1- Run node ./index.js in the project directory

2- Navigate to http:/localhost:3000/

3- Click on one of the available apps in the side bar.

![Apps](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/78cf7bc6-9723-4778-8f6c-bdc6bf6acadf)


# Demos
Currently this project includes the following demo apps:

## Quiz Generator
The Quiz Generator is an application that harnesses the power of GPT technology to effortlessly create a quiz based on any given paragraph of text. Users can easily generate a comprehensive quiz that tests their knowledge and comprehension of the subject matter contained within the text. The generated quiz can then be exported in both HTML and GIFT formats:
![Quiz-Generator-2](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/8414736e-8e94-495d-b4ea-319bb91d3f72)


## Statistical Data Analyzer
The Statistical Data Analyzer is an application that extract Statistical Data from the provided text and visualize it as chart and as a data table. It will describe any trends in the data.
![SDA-2-01](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/4d58bf58-4a08-4608-bcad-d121e2bad530)
![SDA-2-02](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/040d232e-dc79-49f7-acb5-3819c9dee396)
![SDA-2-04](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/61382695-9a65-423d-841c-b41e414554f2)



## Quote Image Generator
The Quote Image Generator is an application that uses GPT to create wallpapers in SVG format. These wallpapers feature suggested quotes that are relevant to a specified topic. It's important to note that sometimes the generated images may have rendering issues. However, you can simply request to fix them in the conversation. To give you an idea of what these wallpapers look like, here's an example of a few generated SVGs:
![QuoteImageGenerator](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/82b72d06-0d64-4138-9a1f-64749cc283c6)

![quote - failure](https://user-images.githubusercontent.com/129025554/233998565-b5e51ef3-e3e9-42bd-af25-f283f2885d29.svg)

![quote - life](https://user-images.githubusercontent.com/129025554/233998665-66b3552c-e6f5-4546-bb47-32e93ccb6494.svg)


## Todo Assistant
The Todo Assistant is an application that uses GPT to manage your tasks as a todo list, where you can tell the app about your new tasks and completed ones and the app will render them in a list:
![todo-app-1](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/0502b868-daa8-4353-9c64-5033863d10c6)


# Create your App
1- Crate a class that extends ConversationApp and save it in the ./apps directory of the project folder
```js
export class SpellAndGrammarChecker extends ConversationalApp {
    constructor(context) {
        super(context);
    }
}
```


2- Implement the following methods:
- getDefaultMessages: 
Returns a list of messages that till OpenAI chat API about its role in the conversation, the expected user input, how to process it, and, what is the expected response (see [OpenAI guide](https://platform.openai.com/docs/guides/chat/introduction)). It can also includes examples about the user input and/or expected response.
Each message is an object that contains a role and content properties: `{"role": "...", "content": "..."}`
The `role` of first message should be "system", and the `content` is a high level description of OpenAI chat API's role in this conversation. Then it followed by one or more messages with the "user" `role`, that tells OpenAI chat API how to process and response to the user input.
You may add a last message with role "assistant", where you ask the user to provide input.

```js
getDefaultMessages() {
    return [
        {"role": "system", "content": "You are a spell and grammar checker. You can help with identifying different types of mistakes in a text."},
        {"role": "user", "content": `Provided with a text, find the grammar and spelling mistakes, return the same text with the mistakes surround with <span> tag with a title attribute that contains the mistakes description.
        the resulting text must be delimited by "\`\`\`".
        Example:
        Input: "I use grammer checker"
        Response:
        \`\`\`
        I use <span title="Misspelled, correct is grammar">grammer</span> checker
        \`\`\`
        `},
        {"role": "assistant", "content": "Please share your paragraph:"}
    ]
}
```

- getChatNameFromMessage:
Returns the title of the chat, this can be derived from OpenAI chat API's responseMessage, especially if you instruct to include it in the response in the default messages. If no title can be derived from the message you can return a constant value. Or return null to keep the previous chat title.

```js
getChatNameFromMessage(responseMessage) {
    return 'Document';
}
```

- getTextMessage:
Returns the normal conversation text returned in OpenAI chat API's responseMessage (if any) after excluding the required app's business data.

```js
getTextMessage(responseMessage) {
    let messageParts = responseMessage.split(/```+[^\n]*\n?/);
    let result = (messageParts[0] || '').trim();
    result += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
    return result;
}
```

- getAppContent:
Returns formatted the app's business data that returned in OpenAI chat API's responseMessage (if any), after excluding the normal conversation text. Usually you will format the app's business data as HTML along with any needed css and js (local and included).

```js
// Extracted some of the method logic in a separate method getStyles
getAppContent(responseMessage) {
    let messageParts = responseMessage.split(/```+[^\n]*\n?/);
    const text = messageParts[1];
    if(!text) {
        return null;
    }

    return this.getStyles() + `<div class="result-text">${text}</div>`;
}

getStyles() {
    return `<style>
    .result-text {
        background-color: white;
        border-radius: 10px;
        padding: 30px;
        font-color: #000000BB;
        font-family: Arial;
        white-space: pre-wrap;
        border-bottom: 2px solid #4ade80;
    }

    .result-text:has(span) {
        border-color: #fecaca;
    }

    .result-text span {
        background-color: #fee2e2;
    }
    </style>`;
}
```

3- Overwrite any of the following messages if needed
- appName
- chatListTitle
- newChatLabel
- newChatName
- contentPreviewPlaceholder
- appIconName: google material icon name
- chatStartInstruction

```js
appName = 'Spell and Grammar Checker';
chatListTitle = 'My Documents';
newChatLabel = 'New Document';
appIconName = 'find_replace';
chatStartInstruction = "Please share your paragraph:";
```

4- If needed Overwrite the `temperature` property if needed, default is 1, valid values are between 0 and 2 inclusive

Here is the full file content, save it as `./apps/SpellAndGrammarChecker.js` folder and restart nodejs
```js
import { ConversationalApp } from '../ConversationalApp.js';

export class SpellAndGrammarChecker extends ConversationalApp {
    appName = 'Spell and Grammar Checker';
    chatListTitle = 'My Documents';
    newChatLabel = 'New Document';
    appIconName = 'find_replace';
    chatStartInstruction = "Please share your paragraph:";

    constructor(context) {
        super(context);
    }

    getDefaultMessages() {
        return [
            {"role": "system", "content": "You are a spell and grammar checker. You can help with identifying different types of mistakes in a text."},
            {"role": "user", "content": `Provided with a text, find the grammar and spelling mistakes, return the same text with the mistakes surround with <span> tag with a title attribute that contains the mistakes description.
            the resulting text must be delimited by "\`\`\`".
            Example:
            Input: "I use grammer checker"
            Response:
            \`\`\`
            I use <span title="Misspelled, correct is grammar">grammer</span> checker
            \`\`\`
            `},
            {"role": "assistant", "content": "Please share your paragraph:"}
        ]
    }

    getChatNameFromMessage(responseMessage) {
        return 'Document';
    }

    getTextMessage(responseMessage) {
        let messageParts = responseMessage.split(/```+[^\n]*\n?/);
        let result = (messageParts[0] || '').trim();
        result += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return result;
    }

    getAppContent(responseMessage) {
        let messageParts = responseMessage.split(/```+[^\n]*\n?/);
        const text = messageParts[1];
        if(!text) {
            return null;
        }

        return this.getStyles() + `<div class="result-text">${text}</div>`;
    }

    getStyles() {
        return `<style>
        .result-text {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            font-color: #000000BB;
            font-family: Arial;
            white-space: pre-wrap;
            border-bottom: 2px solid #4ade80;
        }

        .result-text:has(span) {
            border-color: #fecaca;
        }

        .result-text span {
            background-color: #fee2e2;
        }
        </style>`;
    }
}
```
