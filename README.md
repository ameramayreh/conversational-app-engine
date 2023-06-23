# About
Conversational App Engine is a free engine that helps developers prototype chat-based apps quickly using OpenAI's chat completion API. With Conversational App Engine, developers can focus on designing their app's functionality while utilizing the power of Conversational App Engine to handle chat management.

A Conversational App, running on Conversational App Engine, utilizes OpenAI's chat completion API to generate textual data based on user input. It then processes the generated data and presents it in a more useful visual format, usually. For detailed technical information about creating a Conversational App, please refer to the [Create your App](#create-your-app) section.

This project includes several [demo apps](#demos) that showcase different techniques for implementing Conversational Apps using the Conversational App Engine.

We strongly believe in the immense potential of GPT technology (and generative AI in general). Our aim is to make this technology more accessible for developers and innovators. As part of our efforts, we have developed a Conversational App called [Conversational App Creator](#conversational-app-creator) to help in creating conversational apps without coding knowledge. Although it is not perfect and currently requires **GPT-4 API access**, it demonstrates satisfactory performance. We have made it available to the community and are continuously improving it.


# Content:
 - [History](#history)
 - [How to use](#how-to-use)
 - [Demos](#demos)
 - [Create your App](#create-your-app)

# History
Conversational App Engine was initially created as a demonstration of how OpenAI's completion API can be used to build a form designer. However, we quickly realized that the same technology could be applied to a wide range of use cases. Our goal is to make implementing GPT based apps accessible to a wide range of developers and innovators.

![History-Form-Designer-slower-80](https://user-images.githubusercontent.com/129025554/229411348-b2d4da89-bce9-483d-93b0-29ec698172c6.gif)


# How to use
To use Conversational App Engine, you will need to have Node.js and npm installed on your computer. You will also need an OpenAI API key to access the completion API. Once you have these prerequisites, you can clone this project using Git or download it as a zip file.

Next, set the environment variable OPENAI_API_KEY to your OpenAI API key. This will allow Conversational App Engine to authenticate your requests to the API.

To implement your own app, create a new class that extends the ConversationApp class and save it in the `apps` directory. You will need to implement several methods, such as `getInstructionMessages`, `getChatNameFromMessage`, `getDialogText`, `getAvailableFunctions`, and, `callFunction` to define your app's behavior. You can also overwrite any of the default messages, such as appName and chatListTitle, to customize the user interface.

Once you have created your app, and stored it under the `apps` directory. Then, run `node ./index.js` in the project directory and navigate to http://localhost:3000/ , and select your app from the side bar menu to see your app in action.

## Prerequisites
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
If you don't have git installed. You can download and extract the project [here](https://github.com/ameramayreh/conversational-app-engine/archive/refs/heads/main.zip)

## [3] Implement your app [Optional]
See [Create your App](#create-your-app).

## [4] Run your project
1- Run `node ./index.js` in the project directory

2- Navigate to http:/localhost:3000/

3- Click on one of the available apps in the side bar.

![Apps](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/78cf7bc6-9723-4778-8f6c-bdc6bf6acadf)


# Demos
Currently this project includes the following demo apps:

## Conversational App Creator [ALPHA, GPT-4 Only]
The Conversational App Creator is an application that generates conversational apps based on the requirements of the Conversational App Engine. Its main purpose is to assist innovators, particularly non-developers, in transforming their ideas that utilize GPT technology into functional apps without requiring coding knowledge. We have currently achieved an acceptable level of performance in the implementation, so we are making it available for the community to try while continuously improving it.

If you are a developer, you can benefit from this app by quickly converting your ideas into an app. You can then fine-tune it until you achieve the desired result.

We are actively working on the following enhancements for this app:

- Reducing the number of tokens
- Improving accuracy
- Adding a preview section to display example output from the app during the creation process and before installation

The first screenshot below showcases an app that has been fully generated by the Conversational App Creator, and the subsequent screenshot displays the conversation that led to its generation.
![ConversationAppCreator-03](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/88f996b7-ea74-4858-ae2f-2b0d90f8f328)

![ConversationAppCreator-01-Error](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/db828e5d-eb8a-43e5-8653-f98fe35a4371)
Note: The statement highlighted with red rectangle is not accurate, the app class already includes mermaid js library.



## Quiz Generator
The Quiz Generator is an app that harnesses the power of GPT technology to effortlessly create a quiz based on any given paragraph of text. Users can easily generate a comprehensive quiz that tests their knowledge and comprehension of the subject matter contained within the text. The generated quiz can then be exported in both HTML and GIFT formats:
![Quiz-Generator-2](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/8414736e-8e94-495d-b4ea-319bb91d3f72)


## Statistical Data Analyzer
The Statistical Data Analyzer is an app that extract Statistical Data from the provided text and visualize it as chart and as a data table. It will describe any trends in the data.
![SDA-2-01](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/4d58bf58-4a08-4608-bcad-d121e2bad530)
![SDA-2-02](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/040d232e-dc79-49f7-acb5-3819c9dee396)
![SDA-2-04](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/61382695-9a65-423d-841c-b41e414554f2)



## Quote Image Generator
The Quote Image Generator is an app that uses GPT to create wallpapers in SVG format. These wallpapers feature suggested quotes that are relevant to a specified topic. It's important to note that sometimes the generated images may have rendering issues. However, you can simply request to fix them in the conversation. To give you an idea of what these wallpapers look like, here's an example of a few generated SVGs:
![QuoteImageGenerator](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/82b72d06-0d64-4138-9a1f-64749cc283c6)

![quote - failure](https://user-images.githubusercontent.com/129025554/233998565-b5e51ef3-e3e9-42bd-af25-f283f2885d29.svg)

![quote - life](https://user-images.githubusercontent.com/129025554/233998665-66b3552c-e6f5-4546-bb47-32e93ccb6494.svg)


## Todo Assistant
The Todo Assistant is an app that uses GPT to manage your tasks as a todo list, where you can tell the app about your new tasks and completed ones and the app will render them in a list:
![todo-app-1](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/0502b868-daa8-4353-9c64-5033863d10c6)


# Create your App
Your app should extend ConversationalApp class to allow Conversational App Engine to interact with.
The Conversational App Engine will create a single instance of your app and will interact with its inherited instance variables and methods.

The following sequence diagram shows the messages between the user, Conversational App Engine, your App and OpenAI Chat API in a single chat thread.


The following sequence diagram shows the messages between the user, Conversational App Engine, your App and OpenAI Chat API in a single chat thread.
![app-sequence](https://github.com/ameramayreh/conversational-app-engine/assets/129025554/82a1ed2a-43a2-44ea-b0bd-2de31ec39e66)

Please follow the steps below to implement your app:

1- Crate a class that extends ConversationalApp and save it in the ./apps directory of the project folder
```js
export class SpellAndGrammarChecker extends ConversationalApp {
    constructor(context) {
        super(context);
    }
}
```


2- Implement the following methods:
- getInstructionMessages: 
Returns a list of messages that till OpenAI chat API about its role in the conversation, the expected user input, how to process it, and, what is the expected response (see [OpenAI guide](https://platform.openai.com/docs/guides/chat/introduction)). It can also includes examples about the user input and/or expected response.
Each message is an object that contains a role and content properties: `{"role": "...", "content": "..."}`
The `role` of first message should be "system", and the `content` is a description of the role of the app and what expected from it to do and how to process and response to the user input.
You may add a last message with role "assistant", where you ask the user to provide input.

```js
getInstructionMessages() {
    return [
        {"role": "system", "content": `You are a spell and grammar checker. You can help with identifying different types of mistakes in a text.
        User will provide you with a text, find the grammar and spelling mistakes, return the same text with the mistakes surround with <span> tag with a title attribute that contains the mistakes description.
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
Returns the title of the chat, this can be derived from OpenAI chat API's responseMessage, especially if you instruct to include it in the response in the instruction messages. If no title can be derived from the message you can return a constant value. Or return null to keep the previous chat title.

```js
getChatNameFromMessage(responseMessage) {
    return 'Document';
}
```

- getDialogText:
Returns the normal conversation text returned in OpenAI chat API's responseMessage (if any) after excluding the required app's business data.

```js
getDialogText(responseMessage) {
    let messageParts = responseMessage.split(/^```+[^\n]*\n?/m);
    let result = (messageParts[0] || '').trim();
    result += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
    return result;
}
```

- getAppContent:
Returns formatted app's business data that returned in OpenAI chat API's responseMessage (if any), after excluding the normal conversation text. Usually you will format the app's business data as HTML along with any needed css and js (local and libraries).

```js
// Extracted some of the method logic in a separate method getStyles
getAppContent(responseMessage) {
    let messageParts = responseMessage.split(/^```+[^\n]*\n?/m);
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
- appIconName: google material icon name (default: token)
- chatStartInstruction
- model: openai chat model id (default gpt-3.5-turbo-0613)
- temperature: openai temperature parameter

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

    getInstructionMessages() {
        return [
            {"role": "system", "content": `You are a spell and grammar checker. You can help with identifying different types of mistakes in a text.
            User will provide you with a text, find the grammar and spelling mistakes, return the same text with the mistakes surround with <span> tag with a title attribute that contains the mistakes description.
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

    getDialogText(responseMessage) {
        let messageParts = responseMessage.split(/^```+[^\n]*\n?/m);
        let result = (messageParts[0] || '').trim();
        result += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return result;
    }

    getAppContent(responseMessage) {
        let messageParts = responseMessage.split(/^```+[^\n]*\n?/m);
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
