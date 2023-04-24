import { ConversationalApp } from '../ConversationalApp.js';

export class QuoteImageGenerator extends ConversationalApp {
    appName = 'Quote Image Generator';
    chatListTitle = 'My Quote Images';
    newChatLabel = 'New Quote';
    chatStartInstruction = 'Please provide the subject of the quote you want. Please keep in mind that we need to ensure that the API usage does not exceed 4K.';

    constructor(context) {
        super(context);
        this.context = context;
    }

    getDefaultMessages() {
        return [
            { "role": "system", "content": "You are artist that layout a quote in artistic way as SVG pc wallpaper."},
            { "role": "user", "content": "I'll provide a subject to provide a quote about as SVG wallpaper, the text of the quote should be provided in more than one color and on different lines and alignments if suitable. Example:\n" + this.getExample()},
            { "role": "user", "content": "Please put the svg between \n----\nand\n----\n, please don't put the code characters ```"},
            { "role": "assistant", "content": "What is the subject of the quote you want?"}
        ];
    }

    getChatNameFromMessage(message) {
        let msg = this.getTextMessage(message);
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
        const messageParts = message.split('----');
        let responseMessage = (messageParts[0] || '').trim();
        responseMessage += '\n' + (messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim());
        return responseMessage;
    }

    getAppContent(message) {
        const messageParts = message.split('----');

        let svg = messageParts[1] || '';
        if(!svg) {
            return '';
        }
        return this.getStyles() + this.getJS() + '<button onclick="downloadSVGAsFile()">Download</button><div id="resutl-container-svg" class="result-container">' + svg.trim() + '</div>';
    }

    getStyles() {
        return `<style>
        .result-container {
            max-width: 100%;
            overflow: auto;
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
        return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
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