import { ConversationalApp } from '../ConversationalApp.js';

export class QuoteImageGenerator extends ConversationalApp {
    appName = 'Quote Image Generator';
    chatListTitle = 'My Quote Images';
    newChatLabel = 'New Quote';
    chatStartInstruction = 'Please provide the subject of the quote you want.';
    appIconName = 'format_quote';

    temperature = 1;

    constructor() {
        super();
    }

    getDefaultMessages() {
        return [
            { "role": "system", "content": "You are artist that layout a quote in artistic way as SVG pc wallpaper."},
            { "role": "user", "content": "I'll provide a subject to provide a quote about as SVG wallpaper, the text of the quote should be provided in more than one color and on different lines and alignments if suitable, please add title attribute to the SVG. Example:\n" + this.getExample()},
            { "role": "user", "content": "Please put the svg between \n----\nand\n----\n, please don't include code markdown characters ``` in the response"},
            { "role": "assistant", "content": "What is the subject of the quote you want?"}
        ];
    }

    getChatNameFromMessage(message) {
        let msg = '';
        const content = this.getAppContent(message);
        if(content && content.match(/title=/i)){
            msg = content.split(/title=/i)[1].split('"')[1].trim();
            if(msg) {
                return msg;
            }
        }
        msg = this.getTextMessage(message);
        if(!msg) {
            return '';
        }

        msg = msg.split('\n')[0];
        if(!msg.toLowerCase().includes('quote')) {
            return '';
        }
        return msg;
    }

    getTextMessage(message) {
        const messageParts = message.split(/----*/g);
        let responseMessage = (messageParts[0] || '').trim();
        responseMessage += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return responseMessage;
    }

    getAppContent(message) {
        const messageParts = message.split(/----*/g);

        let svg = messageParts[1] || '';
        if(!svg) {
            return '';
        }
        if(svg.includes('```')) {
            return (svg.split(/```\n*/i)[1] || svg).trim();
        }
        return this.getStyles() + this.getJS() + '<button id="download-button" style="" onclick="downloadSVGAsFile()">Download</button><div id="resutl-container-svg" class="result-container">' + svg.trim() + '</div>';
    }

    getStyles() {
        return `<style>
        .result-container {
            max-width: 100%;
            overflow: auto;
        }
        .result-container svg {
            max-width: 100% !important;
            height: auto !important;
        }
        #download-button {
            margin-bottom: 5px;
            padding: 1px 10px;
            border-radius: 5px;
            background-color: #34d399;
            color: #FFF;
            font-weight: 300;
        }
        </style>`;
    }

    getJS() {
        return `<script>
        function downloadSVGAsFile() {
            var text = document.getElementById('resutl-container-svg').innerHTML;
            // Create a Blob object from the text
            const blob = new Blob([text], { type: 'image/svg+xml' });
          
            // Create a URL for the Blob object
            const url = URL.createObjectURL(blob);
          
            // Create a link element for the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'quote.svg';
          
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

    getExample() {
        return `<svg title="Family" width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse" >
            <rect x="0" y="0" width="200" height="200" fill="#7D7D7D"/>
            <circle cx="50" cy="50" r="20" fill="#D6CFC4" opacity="0.1"/>
            <circle cx="150" cy="150" r="15" fill="#D6CFC4" opacity="0.15"/>
            <circle cx="100" cy="100" r="25" fill="#D6CFC4" opacity="0.13"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        <text x="5" y="380" font-size="150" fill="#FFFFFF" text-anchor="left" dominant-baseline="middle" letter-spacing="1">
          <tspan x="40" dy="-20" font-size="128" fill="#5C5A5A">Family is not an important thing.</tspan>
          <tspan x="925" dy="190" fill="#3C3A3A">It's everything.</tspan>
        </text>
        <text x="960" y="800" font-size="100" fill="#FFFFFF" text-anchor="middle">-Michael J. Fox</text>
      </svg>
      `;
    }
}