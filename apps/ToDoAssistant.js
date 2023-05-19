import { ConversationalApp } from '../ConversationalApp.js';

export class ToDoAssistant extends ConversationalApp {
    appName = 'To-Do Assistant';
    chatListTitle = 'My To-Do Lists';
    newChatLabel = 'New To-Do';
    appIconName = 'fact_check';

    constructor(context) {
        super(context);
        this.context = context;
    }

    getDefaultMessages() {
        return [
            { "role": "system", "content": "You are advanced To Do list assistant, you help in managing to do lists. Current date: " + (new Date()).toISOString().split('T')[0] },
            { "role": "user", "content": "I'll keep telling you about my tasks: what I need to do, doing, and/or done and you will provide me with a list of my tasks (pending and completed) as a to-do list" },
            { "role": "user", "content": "Each task must be shown in a separate line prefixed by [ ] for pending task and [*] for done task"},
            { "role": "user", "content": "Please add metadata about the task in the format [Metadata Name: value], the needed metadata are 'Creation Datetime', 'Completion Datetime', 'Due by'"},
            { "role": "user", "content": `Format your response as follows (the [{To-Do List Name}] line is needed when creating the to-do list, but not after modifying it):
[{To-Do List Name}]
----
{todo list}
----`}
        ];
    }

    getChatNameFromMessage(responseMessage) {
        const titleMatch = responseMessage.match(/\[([^\]]+)\]/);
        return (titleMatch && titleMatch[1]) || "My Todo";
    }

    getTextMessage(responseMessage) {
        const messageParts = responseMessage.split('----');
        let result = (messageParts[0] || '').trim();
        result += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return result;
    }

    getAppContent(responseMessage) {
        const messageParts = responseMessage.split('----');

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
        .list-container {
            border-radius: 10px;
            background-color: #FFFFFF99;
            padding: 30px 50px
        }
        </style>`;
    }
}