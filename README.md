# About
Conversational App Engine is an open-source engine that allows developers to quickly implement chat based apps using OpenAI's completion API. With Conversational App Engine, developers can focus on their app's use case while leveraging the power of conversational AI to handle the chat management.


## History
Conversational App Engine was initially created as a demonstration of how OpenAI's completion API can be used to build a form designer. However, we quickly realized that the same technology could be applied to a wide range of use cases. Our goal is to provide developers with an easy-to-use engine that can improve their app's user experience with conversational AI.

![History-Form-Designer-slower-80](https://user-images.githubusercontent.com/129025554/229411348-b2d4da89-bce9-483d-93b0-29ec698172c6.gif)


# How to use
To use Conversational App Engine, you will need to have Node.js and npm installed on your computer. You will also need an OpenAI API key to access the completion API. Once you have these prerequisites, you can clone this project using Git or download it as a zip file.

Next, set the environment variable OPENAI_API_KEY to your OpenAI API key. This will allow Conversational App Engine to authenticate your requests to the API.

To implement your own app, create a new class in the apps directory that extends the ConversationApp class. You will need to implement several methods, such as getDefaultMessages, getChatNameFromMessage, and getTextMessage, to define your app's behavior. You can also overwrite any of the default messages, such as appName and chatListTitle, to customize the user interface.

Once you have created your app, import it into the index.js file and use it to initialize a new instance of ConversationalAppEngine. Then, run node ./index.js in the project directory and navigate to http://localhost:3000/ to see your app in action.

## Prerequisets
* [Nodejs and npm](https://nodejs.org/en/download)
* [Git (Optional)](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Set the environment variable OPENAI_API_KEY to your openai api key

## Clone this project
```
git clone https://github.com/david-m-s/conversational-app-engine.git
cd conversational-app-engine
npm install
```
If you don't have git installed. You can download the prject from [here](https://github.com/ameramayreh/conversational-app-engine/archive/refs/heads/main.zip)

## Implement your app
1- Crate a class that extends ConversationApp in the apps directory
2- Implement the following methods:
- getDefaultMessages: an array of instructions that tells GPT about its role and the expected response. Format [{"role": "system", "content": "You are ABC asesseten, you provide help in..."}, {"role": "user", "content": "Your responses should be structured in yaml format"}, ...]
- getChatNameFromMessage: The name of the chat, it can be derived fom the message
- getTextMessage: the response text that should be shown in the chat dialog
- getAppContent: HTML (usually) based conted, generated based an extracted content from the message based on the app business need

3- Overwrite any of the follwoing messages if needed
- appName
- chatListTitle
- newChatLabel
- newChatName
- contentPreviewPlaceholder
- chatStartInstruction

4- Import and use your class in the index.js file
 ```
  import { MyApp } from './apps/MyApp.js';
  ...
  const engine = new ConversationalAppEngine(MyApp);
 ```

## Run your project
5- Run node ./index.js in the project directory
6- Navigate to http:/localhost:3000/

# Demos
Currently this project includes the following demo apps:

## Quote Image Generator (Default)
The Quote Image Generator is an application that uses GPT to create wallpapers in SVG format. These wallpapers feature suggested quotes that are relevant to a specified topic. It's important to note that sometimes the generated images may have rendering issues. However, you can simply request to fix them in the conversation. To give you an idea of what these wallpapers look like, here's an example of a few generated SVGs:
![quote - failure](https://user-images.githubusercontent.com/129025554/233998565-b5e51ef3-e3e9-42bd-af25-f283f2885d29.svg)

![quote - success](https://user-images.githubusercontent.com/129025554/234000131-793d5b14-3404-4a09-8eeb-314e6dcb8c64.svg)

![quote - life](https://user-images.githubusercontent.com/129025554/233998665-66b3552c-e6f5-4546-bb47-32e93ccb6494.svg)


## Todo Tasks Manager
The Todo Tasks Manager is an application that uses GPT to manage your tasks as a todo list, where you can tell the app about your new tasks and completed ones and the app will render them in a list:

![todo-app](https://user-images.githubusercontent.com/129025554/233999585-ee9403db-11f4-46d1-a5b1-1dd5f90292ff.PNG)

