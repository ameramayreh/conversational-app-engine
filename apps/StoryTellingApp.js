import { ConversationalApp } from '../ConversationalApp.js';
import fs from 'fs';
import fetch from 'node-fetch';

class StoryTellingApp extends ConversationalApp {
    appName = 'Story Telling App';
    chatListTitle = 'My Stories';
    newChatLabel = 'New Story';
    appIconName = 'book';
    chatStartInstruction = 'Please provide your age and the topic of the story';

    model = "gpt-3.5-turbo-16k-0613";
    modelMaxTokens = 16384;

    constructor(context) {
        super(context);
    }

    getInstructionMessages() {
        return [
            {
                "role": "system", "content": `You are a story-teller. You create a story for a user based on their age and the topic of the story.
                User will provide you with their age and the topic of the story.

                You will follow the steps:
                1) Generate a chapter of the story based on the provided age and topic, and in the language of the topic. The chapter should be in a narrative format and should be engaging for the user.
                2) Generate an image suitable for that chapter and the user age by preparing a prompt that describes the scene in details in English language. You can use a previous chapter image if suitable. DON'T guess or make-up the image url.
                3) At the end of the chapter, you will ask the user a question about their expectation of what will happen next in the story.
                4) Response format must be as follows:
                <story title="{story title}">
                    <chapter>
                        <div class="flex justify-center mb-2"><img src="{generated image url}" title="{image generation prompt}" /></div>
                        <p>{chapter text}</p>
                        <p><strong>{What do you think will happen next question}</strong></p>
                    </chapter>
                </story>

                
                
                When the user answers their expectation, or asks to continue, repeat the steps above to generate the next chapter.
                Manage to complete the story in up to 10 chapters or less.
            `},
            { "role": "assistant", "content": "Please provide your age and the topic of the story" }
        ];
    }

    getChatNameFromMessage(responseMessage) {
        const titleMatch = responseMessage.match(/<story\s+title="([^"]+)">/);
        const title = titleMatch ? titleMatch[1] : null;
        return title;
    }

    getDialogText(responseMessage) {
        const messageParts = responseMessage.split(/<\/?story[^>]*>/);
        return `${messageParts[0].trim()}\n${messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim()}`;
    }

    getAppContent(responseMessage) {
        const messageParts = responseMessage.split(/<\/?chapter[^>]*>/);
        const chapter = messageParts[1];
        if (!chapter || !chapter.trim()) return '';
        return `
            <div class="chapter-container">
                <div class="chapter">${chapter}</div>
            </div>
            <style>
                .chapter-container {
                    background-color: #000E;
                    padding: 20px;
                    margin: 10px;
                    border-radius: 5px;
                    color: white;
                }
                .chapter-container img {
                    max-width: 100%;
                    border-radius: 5px;
                }

                .chapter-container p {
                    max-width: 768px;
                    margin: 20px auto;
                    text-align: justify;
                }

                .chapter {
                    font-size: 18px;
                    margin-bottom: 10px;
                }
            </style>
        `;
    }

    getAvailableFunctions() {
        return [
            {
                "name": "generate_image",
                "description": "Generates an image based on a prompt",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "prompt": {
                            "type": "string",
                            "maxLength": 1000,
                            "description": `A detailed description of the image in English language, up to 1000 characters, examples:
                            'A photo of Charles Babbage building a robot by Philippe Halsman, setting in an engineer workshop, canon lens, shot on dslr 64 megapixels sharp focus, vintage photography, Victorian colorised,character design by mark ryden and pixar and hayao miyazaki'
                            'Cute small rabbit sitting in a movie theater eating popcorn watching a movie ,unreal engine, cozy indoor lighting, art station, detailed, digital painting,cinematic,character design by mark ryden and pixar and hayao miyazaki, unreal 5, daz, hyperrealistic, octane render'
                            `
                        }
                    },
                    "required": ["prompt"]
                }
            }
        ];
    }

    async callFunction(functionName, parameters) {
        console.log(`Calling function ${functionName} with parameters ${JSON.stringify(parameters)}`);
        if (functionName !== 'generate_image') {
            console.log('Function not found: ' + functionName);
            return 'none';
        }

        const prompt = parameters.prompt;
        if (!prompt || !prompt.trim()) {
            console.log('No prompt provided');
            return 'none';
        }

        const engineId = 'stable-diffusion-xl-beta-v2-2-2';
        const apiHost = 'https://api.stability.ai';
        const apiKey = process.env.STABILITY_API_KEY;

        if (!apiKey) throw new Error('Missing Stability API key.');

        const response = await fetch(
            `${apiHost}/v1/generation/${engineId}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: prompt,
                        },
                    ],
                    cfg_scale: 30,
                    clip_guidance_preset: 'FAST_BLUE',
                    style_preset: 'fantasy-art',
                    height: 512,
                    width: 768,
                    samples: 1,
                    steps: 50,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to generate image: ${await response.text()}`);
        }

        const responseJSON = (await response.json());
        console.log('\nResponse: ', responseJSON);
        if (!responseJSON.artifacts?.length) {
            throw new Error('Failed to generate image');
        } 

        const image = responseJSON.artifacts[0];
        const fileRandomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.png';
        fs.writeFileSync(
            `${this.context.filesDirectoryPath}${fileRandomName}`,
            Buffer.from(image.base64, 'base64')
        );

        const webPath = `${this.context.webBasePath}${fileRandomName}`
        console.log('Web Path: ', webPath);
        return webPath;
    }
}

export { StoryTellingApp };