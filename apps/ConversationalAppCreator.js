import { ConversationalApp } from '../ConversationalApp.js';

export class ConversationalAppCreator extends ConversationalApp {
    appName = 'Conversational App Creator';
    chatListTitle = 'My Apps';
    newChatLabel = 'New App';
    chatStartInstruction = 'Please briefly describe the purpose of your app, what information will it require from its user, and, what should it display to them.';
    appIconName = 'design_services';

    model =  "gpt-4-0613";
    modelMaxTokens =  8192;

    constructor(context) {
        super(context);
    }

    getDefaultMessages() {
        return [
            { "role": "system", "content": `You are Conversational App Creator; you are expert in GPT prompting and in Javascript, Html and css.
            A conversational app runs under Conversational App Engine (CAE), that manages taking the user input and sending it to GPT to generate the intended response based on the App's instructions.
            A conversational app is responsible to provide CAE with:
            [1] instructions to GPT about its role and how to deal with user input, and how to prepare the intended response and the format of that response.
            [2] processing the GPT's generated response and format it based on the app requirements with a high quality and user friendly UI.
            
            User will provide a description of the intended app, a description of the app's user input and a description of expected app's output. You will:
            1) Decide about the role of GPT and prepare instruction messages defining this role, e.g., if the user describes the needed app with "the app needs to check for spelling and grammar mistakes in a text provided by the app's user", the message could be "You are spelling and grammar assistant, you help in identifying ...".
            2) Decide about the input for the app and prepare instruction to explain it to GPT, e.g., if the user describes the needed app with "the app needs to check for spelling and grammar mistakes in a text provided by the app's user", the instruction message could be "User will provide you with a text paragraph(s) ...".
            3) Decide about the desired output from the app and prepare instructions for GPT on how to handle the input (may be in a step by step approach), and the expected generated response, e.g. if the user describes the needed app with "the app needs to extract the statistical data from a text provided by the app's user, and display it as a table", the instruction message could be "You will identify the statistical data in the provided text, and will extract it, and format it as html table. Format the response as follows:\n\`\`\`\n{HTML TABLE}\n\`\`\`".
            4) Decide about how to extract the desired output from the response, and how to extract the dialog text (as GPT may include dialog text in addition to the desired output), e.g. for the example in the previous step's example, you may split the response message by '\`\`\`', the desired output will be the second part in the splitted text, and the dialog text will be the other parts.
            5) Decide about how to format the extracted output to meet the app's output requirements. This should be browser supported format, usually HTML and any supported CSS or js if needed. Please include the result in a div with suitable background color, consider a high quality and user friendly UI.
            6) Utilizing the outcomes of the previous steps, Generate the conversational app as a nodejs class that extends the 'ConversationalApp' class defined below, it must be a fully functional class, please keep the class size as small as possible (no method comments at all), please don't provide any explanation:
\`\`\`
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

    constructor(context) {
        super(context);
    }

    /**
     * Returns a list of messages that till OpenAI chat API about its role in the conversation,
     * the expected user input, how to process it, and, what is the expected response.
     * It can also includes examples about the user input and/or expected response.
     * Each message is an object that contains a role and content properties: {"role": "...", "content": "..."}
     * The role of first message should be "system", and the content is a high level description of OpenAI chat API's role in this conversation, 
     * and tells OpenAI chat API how to process and response to the user input
     * You may add a last message with role "assistant", where you ask the user to provide input.
     * 
     * @returns array of messages
     */
    getInstructionMessages() { return [] };

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
     * Returns the formatted app's business data that returned in OpenAI chat API's responseMessage (if any),
     * after excluding the normal conversation text.
     * Usually you will format the app's business data as HTML along with any needed css and js (local and included).
     * 
     * @param {*} responseMessage the response content returned by OpenAI chat API
     * @returns 
     */
    getAppContent(responseMessage) { return '<h1>No Content</h1>'; }

    parseYaml(yamlStr) {
        return yaml.load(yamlStr.replace(/\`\`\`+[^\n]*\n?/g, ''));
    }
}

export { ConversationalApp };
\`\`\`


If a js library will be used with the app output, make sure to use setTimeout after including the library before using it, example:
\`\`\`
<div class="content-container">
    ...
    <pre class=".mermaid">...</pre>
    ...
</div>
<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    setTimeout(() => {
        mermaid.run({ querySelector: '.mermaid' });
    }, 200);
</script>
\`\`\`

If the user prompt results in modifying part of the class, response with the whole class.
Make sure the generated class has the string delimiting characters (', ", \`) are escaped correctly.
The generated class must be a fully functional (no partial implementation)

Response should be formatted as follows: 
App class generated, please save it to {ClassName}.js under the apps folder, then restart the app engine        
\`\`\`
{generated class}
\`\`\`

Example conversational app nodejs classes:
${this.getExamples()}
` },
            { "role": "assistant", "content": "What the app you are trying to create is about? What is the expected input and the expected output?"}
        ];
    }

    getChatNameFromMessage(message) {
        const config = this.getGeneratedAppClass(message);
        if(!config) {
            return null;
        }
        let m = config.match(/appName\s*=\s*['"](.+)['"]/);
        m = m || config.match(/class\s+([^\s]+)\s+extends/);
        return (m && m[1]) || null;
    }

    getDialogText(message) {
        let messageParts = message.split(/^```+[^\n]*\n?/m);
        let responseMessage = (messageParts[0] || '').trim();
        responseMessage += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return responseMessage;
    }

    getAppContent(message) {
        let config = this.getGeneratedAppClass(message);
        if(!config) {
            return '';
        }

        return `${this.getStyles()}<button onclick="downloadClass()"
            id="install-button"
            class="action-button rounded-md px-2 bg-gray-800 text-white pr-3 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        ><span class="material-icons">download</span> Install</button> <button onclick="copyToClipboard()"
        class="action-button rounded-md px-2 bg-gray-800 text-white pr-3 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
    ><span class="material-icons" id="copy-button-icon">file_copy</span> Copy</button><pre id="generated-class"><code id="class-code" class="language-javascript">${config.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</code></pre>${this.getJS()}`;
    }

    getGeneratedAppClass(message) {
        const messageParts = message.split(/^```+[^\n]*\n?/m);

        let chartConfig = messageParts[1] || '';
        if(!chartConfig) {
            return '';
        }

        return chartConfig;
    }

    getStyles() {
        return `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" integrity="sha512-tN7Ec6zAFaVSG3TpNAKtk4DOHNpSwKHxxrsiw4GHKESGPs5njn/0sMCUMl2svV4wo4BK/rCP7juYz+zx+l6oeQ==" crossorigin="anonymous" referrerpolicy="no-referrer" 
        /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-coy.min.css" integrity="sha512-LOT5F67SMZVdXMrvQe4S1ZHu5l6xk3CST2qqno9kY329OsJBBpybnq+fM9qG4ZSaNzPOjoGzHAeBamSSJyyuZg==" crossorigin="anonymous" referrerpolicy="no-referrer"
        /><style>
            #generated-class {
                overflow: hidden !important;
                height: calc(100% - 35px) !important;
                margin-bottom: 0 !important;
            }
            #generated-class::after,
            #generated-class::before {
                display: none !important;
            }
            .action-button {
                line-height: 24px;
            }
            .action-button .material-icons{
                font-size:16px;
                height:16px;
                width:16px;
                line-height: 24px;
                vertical-align: text-top;
            }
            #class-code {
                height: 100%;
            }
        </style>`;
    }

    getJS() {
        return `<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"
        integrity="sha512-7Z9J3l1+EYfeaPKcGXu3MS/7T+w19WtKQY/n+xzmw4hZhJ9tyYmcUS+4QqAlzhicE5LAfMQSF3iFTK9bQdTxXg==" 
        crossorigin="anonymous" referrerpolicy="no-referrer"
        ></script><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"
        integrity="sha512-jwrwRWZWW9J6bjmBOJxPcbRvEBSQeY4Ad0NEXSfP0vwYi/Yu9x5VhDBl3wz6Pnxs8Rx/t1P8r9/OHCRciHcT7Q=="
        crossorigin="anonymous"referrerpolicy="no-referrer"></script><script>
        function downloadClass() {
            var text = document.getElementById('class-code').textContent + '';
            var mimeType = 'text/javascript';
            var classNameMatch = text.match(/.*class\\s+([^\\s]+)\\s+extends.*/);
            var title = (classNameMatch && classNameMatch[1]) || 'JavaScriptSnippet';
            downloadAsFile(text, mimeType, title + '.js');
        }

        function copyToClipboard() {
            var text = document.getElementById('class-code').textContent;
            const textarea = document.createElement('textarea');
            textarea.value = text;
          
            // Make the textarea hidden
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
          
            document.body.appendChild(textarea);
            textarea.select();
          
            try {
              // Copy the text to the clipboard
              document.execCommand('copy');
              console.log('Text copied to clipboard');
              document.getElementById('copy-button-icon').innerHTML = 'check';
            } catch (err) {
              console.error('Failed to copy text to clipboard', err);
            }
          
            document.body.removeChild(textarea);
          }
          

        function downloadAsFile(text, mimeType, fileName) {
            // Create a Blob object from the text
            const blob = new Blob([text], { type: mimeType });
          
            // Create a URL for the Blob object
            const url = URL.createObjectURL(blob);
          
            // Create a link element for the download
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
          
            // Add the link element to the document
            document.body.appendChild(link);
          
            // Click the link to start the download
            link.click();
          
            // Remove the link element from the document
            document.body.removeChild(link);
          
            // Revoke the URL to free up memory
            URL.revokeObjectURL(url);
          }
        </script>`;
    }

    getExamples() {
        return `
        Example #1: Statistical Data Analyser app, it takes a text with statistical information as input, and the out put will be the statistical information extracted as a table, and rendered as suitable chart:
        \`\`\`
        import { ConversationalApp } from '../ConversationalApp.js';

export class StatisticalDataAnalyzer extends ConversationalApp {
    appName = 'Statistical Data Analyzer';
    chatListTitle = 'My Data';
    newChatLabel = 'New Data';
    chatStartInstruction = 'Please provide me with the data you want to analyze';
    appIcon = "insert_chart";

    constructor(context) {
        super(context);
    }

    // Instructions to OpenAI GPT
    getInstructionMessages() {
        return [
            { "role": "system", "content": \`You are statistical data analyzer, you help in extract and visualize statistical data from paragraph of text
            User will provide you with a text that may contain statistical data.
            If the text does not contain statistical data, simply response with 'No statistical data'.
            If there is statistical data, please extract them as a table (in markdown format) delimited by 4 equal marks (====).
            After that, please provide a YAML structure that represents a config for Chart.js library based on the following JSON schema:
            \${JSON.stringify(this.getJSONSchema())}

            The YAML structure must be delimited by \\\`\\\`\\\`.
            After that list important trends in the extracted data if any.
            So, the expected response for the first response and subsequence responses for modifications will be:
            ====
            {Table}
            ====
            \\\`\\\`\\\`
            {YAML}
            \\\`\\\`\\\`
            {Trends}
            \` },
            { "role": "assistant", "content": "Sure, please provide your text"}
        ];
    }

    // Get the conversation name from GPT generated response
    getChatNameFromMessage(responseMessage) {
        const config = this.getChartConfig(responseMessage);
        if(!config) {
            return null;
        }
        return config.options?.title?.text || null;
    }

    // Get the dialog text from GPT generated response by excluding the app intended content
    getDialogText(responseMessage) {
        let messageParts = responseMessage.split(/\`\`\`[^\\n]*\\n?/);
        let textMessage = (messageParts[0] || '').trim();
        textMessage += '\\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\\n').trim());
        messageParts = textMessage.split(/===[^\\n]*\\n?/);
        textMessage = (messageParts[0] || '').trim();
        textMessage += '\\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\\n').trim());
        return textMessage;
    }

    // Get the app intended content from GPT generated response by excluding the dialog text
    getAppContent(responseMessage) {
        const config = this.getChartConfig(responseMessage);
        const messageParts = responseMessage.split(/===[^\\n]*\\n?/);
        let data = messageParts[1] || '';
        if(!config && !data) {
            return '';
        }

        if(data) {
            data = JSON.stringify(data);
        }

        return this.getStyles() + '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js"></script><script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script><div class="result-container"><canvas id="myChart"></canvas><div id="data-table"></div></div>' + \`<script>
        clearTimeout(window['charttimeout']);
        window['data'] = \${data} || window['data'] || '';
        window['charttimeout'] = setTimeout(()=> {
            new Chart(document.getElementById('myChart'), \${JSON.stringify(config)});
            if(window['data']) {
                document.getElementById('data-table').innerHTML = marked.parse(window['data']);
            }
        }, 500);

        </script>\`;
    }

    getChartConfig(responseMessage) {
        const messageParts = responseMessage.split(/\`\`\`[^\\n]*\\n?/);

        let chartConfig = messageParts[1] || '';
        if(!chartConfig) {
            return '';
        }

        return this.parseYaml(chartConfig.trim());
    }

    getStyles() {
        return \`<style>
        table {
            background-color: #f8f9fa;
            color: #202122;
            margin: 1em 0;
            border: 1px solid #a2a9b1;
            border-collapse: collapse;
            min-width: 80%;
            margin: 10px auto;
        }
        th {
            background-color: #eaecf0;
            text-align: center;
        }
        th, td {
            border: 1px solid #a2a9b1;
            padding: 0.2em 0.4em;
        }
        .result-container {
            padding: 20px;
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            background-color: #FFFFFF99;
        }
        </style>\`;
    }

    getJSONSchema() {
        return {
          /* JSON Schema for Chart.js */
          };
    }
}
        \`\`\`

        Example #2: To-do Assistant app, user will provide information about their tasks, including the status, the output will be a formatted to-do list:
        \`\`\`
        import { ConversationalApp } from '../ConversationalApp.js';

export class ToDoAssistant extends ConversationalApp {
    appName = 'To-Do Assistant';
    chatListTitle = 'My To-Do Lists';
    newChatLabel = 'New To-Do';
    appIconName = 'fact_check';
    chatStartInstruction = 'Please share your exciting tasks with me!';

    constructor(context) {
        super(context);
    }

    getInstructionMessages() {
        return [
            { "role": "system", "content": \`You are a To Do list assistant, you help in managing to do lists. Current date: \${(new Date()).toISOString().split('T')[0]}.
            User will keep telling you about their tasks: what they need to do, doing, and/or done and you will provide them with a list of their tasks (pending and completed) as a to-do list.
            Each task must be shown in a separate line prefixed by [ ] for pending task and [*] for done task.
            Please add metadata about the task in the format [Metadata Name: value], the needed metadata are 'Creation Datetime', 'Completion Datetime', 'Due by'
            The response format must be as follows (the [{To-Do List Name}] line is needed when creating the to-do list, but not after modifying it):
[{To-Do List Name}]
<---->
{todo list}
<---->\`},
            {"role": "assistant", "content": "Please share your exciting tasks with me!"}
        ];
    }

    getChatNameFromMessage(responseMessage) {
        const titleMatch = responseMessage.split('<---->')[0].match(/\\[([^\\]]+)\\]/);
        return (titleMatch && titleMatch[1]) || "My Todo";
    }

    getDialogText(responseMessage) {
        const messageParts = responseMessage.split('<---->');
        let result = (messageParts[0] || '').trim();
        result += '\\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\\n').trim());
        return result;
    }

    getAppContent(responseMessage) {
        const messageParts = responseMessage.split('<---->');

        let form = messageParts[1] || '';
        form = form.replaceAll('[*]', '✅').replaceAll('[ ]', '⬜');
        form = form.replace(/ *\\[Creation Datetime:[^\\]]+\\] */g, '').replace(/ *\\[Completion Datetime:[^\\]]+\\] */g, '').replace(/\\n[ -]+/g, '\\n');
        form = form.replace(/ *\\[Due by: *([^\\]]+)\\] */g, '<span title="$1">🕑</span>');
        form = form.split(/ *\\n */).filter(l => !!l.trim()).map(l => '<div class="task' + (l.includes('✅') ? ' task-done' : '') + '">' + l.trim() + '</div>').join('');

        return this.getStyles() + '<div class="list-container">' + form.trim() + '</div>';
    }

    getStyles() {
        return \`<style>
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
        </style>\`;
    }
}
        \`\`\`
        `
    }
}