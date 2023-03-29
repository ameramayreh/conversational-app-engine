import { ConversationalApp } from '../ConversationalApp.js';

export class ToDoAssistant extends ConversationalApp {
    appName = 'To Do Assistent';
    chatListTitle = 'My To Do Lists';
    newChatLabel = 'New To Do';

    constructor(context) {
        super(context);
        this.context = context;
    }

    getDefaultMessages() {
        return [
            { "role": "system", "content": "You are advanced To Do list assistant, you help me manage my to do list. Current date: " + (new Date()).toISOString().split('T')[0] },
            { "role": "user", "content": "I'll tell you what I need to do, doing, and/or done and you will provide me with a list of todo tasks list" },
            { "role": "user", "content": "Each task must be shown in a separate line prefixed by [ ] for pending task and [*] for done task"},
            { "role": "user", "content": "Please add metadata about the task in the format [Metadata Name: value], the needed metadata are 'Creation Datetime', 'Completion Datetime', 'Due by'"},
            { "role": "user", "content": "Please insert the taks list between \n----\n and \n----\n"}
        ];
    }

    getChatNameFromMessage(message) {
        return "My Todo";
    }

    getTextMessage(message) {
        const messageParts = message.split('----');
        let responseMessage = (messageParts[0] || '').trim();
        responseMessage += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return responseMessage;
    }

    getAppContent(message) {
        const messageParts = message.split('----');

        let form = messageParts[1] || '';
        form = form.replaceAll('[*]', '✅').replaceAll('[ ]', '⬜');
        form = form.replace(/ *\[Creation Datetime:[^\]]+\] */g, '').replace(/ *\[Completion Datetime:[^\]]+\] */g, '').replace(/\n[ -]+/g, '\n');
        form = form.replace(/ *\[Due by: *([^\]]+)\] */g, '<span title="$1">🕑</span>');
        form = form.split(/ *\n */).filter(l => !!l.trim()).map(l => '<div class="task' + (l.includes('✅') ? ' task-done' : '') + '">' + l.trim() + '</div>').join('');

        return this.getStyles() + '<div class="list-container">' + form.trim() + '</div>';
    }

    getStyles() {
        return `<style>
        .task {
            margin: 3px;
            border-radius: 3px;
        }
        .task-done {
            opacity: 0.6;
        }
        </style>`;
    }
}