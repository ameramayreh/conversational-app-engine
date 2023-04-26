import { ConversationalApp } from '../ConversationalApp.js';

export class QuizGenerator extends ConversationalApp {
    appName = 'Quiz Generator';
    chatListTitle = 'My Topics';
    newChatLabel = 'New Topic';
    chatStartInstruction = 'Please provide the article/document that you want to generate quiz for. Please keep in mind that we need to ensure that the API usage does not exceed 4K.';

    constructor(context) {
        super(context);
        this.context = context;
    }

    getDefaultMessages() {
        return [
            { "role": "system", "content": "You are Quizzer, the quiz generator."},
            { "role": "user", "content": "I'll provide an article or document content and you will generate a comprehensive multiple choice quiz that covers only the provided content in YAML format based on the following JSON schema:\n" + JSON.stringify(this.getResponseSchema(), null, 2)},
            { "role": "user", "content": "Please put the YAML between \n----\nand\n----\n (this is a must), please don't include code markdown characters ``` in the response"},
            { "role": "assistant", "content": "Plese provide the content that you would like me to generate a quiz for."}
        ];
    }

    getChatNameFromMessage(message) {
        let msg = this.getAppContentData(message);
        return msg?.QuizTitle || '';
    }

    getTextMessage(message) {
        const messageParts = message.split(/----*/g);
        let responseMessage = (messageParts[0] || '').trim();
        responseMessage += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return responseMessage;
    }

    getAppContentData(message) {
        const messageParts = message.split(/----*/g);

        let yaml = messageParts[1] || null;
        if(!yaml) {
            return null;
        }
        return this.parseYaml(yaml);
    }

    getAppContent(message) {
        let quizInfo = this.getAppContentData(message);
        if(!quizInfo) {
            return null;
        }

        let quizHtml = '<h1>' + quizInfo.QuizTitle + '</h1><ul>';
        const questions = quizInfo.Questions || [];
        let questionNumber = 0;
        for(let question of questions) {
            quizHtml += '<li class="quesion"><h3><span>' + (++questionNumber) + '</span> ' + question.Question + '</h3><ul>';
            const choices = question.Choices || [];
            for(let choice of choices) {
                quizHtml += '<li><input type="radio" name="q' + questionNumber + '" value="' + choice.Letter + '" data-correct="' + (choice.Letter == question.CorrectAnswerLetter) + '" /><span>' + choice.Letter + ' - ' + choice.Choice + '</span></li>';
            }
            quizHtml += '</ul></li>';
        }

        quizHtml += '</ul>';
            
        return this.getStyles() + quizHtml;
    }

    getStyles() {
        return `<style>
        .quesion input[type=radio]:checked+span {
            color: red;
            font-weight: bold;
        }
        .quesion input[type=radio][data-correct=true]:checked+span {
            color: green;
            font-weight: bold;
        }
        </style>`;
    }

    getResponseSchema() {
        return {
            "type" : "object",
            "properties": {
                "Questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "Question": { "type": "string" },
                            "CorrectAnswerLetter":  { "type": "string",  "enum": ["A", "B", "C", "D", "E", "F"]},
                            "Choices": { 
                                "type": "array",
                                "items": { 
                                    "type": "object" ,
                                    "properties": {
                                        "Choice": { "type": "string" },
                                        "Letter": { "type": "string",  "enum": ["A", "B", "C", "D", "E", "F"]}
                                    }
                                } 
                            }
                        }
                    }
                },
                "QuizTitle": {
                    "type" : "string"
                }
            }
        };
    }
}