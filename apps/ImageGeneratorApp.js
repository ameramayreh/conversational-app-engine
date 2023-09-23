import { ConversationalApp } from '../ConversationalApp.js';
import fs from 'fs';
import fetch from 'node-fetch';

class ImageGeneratorApp extends ConversationalApp {
    appName = 'Image Generator';
    chatListTitle = 'My Images';
    newChatLabel = 'New Image';
    appIconName = 'palette';
    chatStartInstruction = 'Please let me know what you are trying to innovate?';

    model = "gpt-3.5-turbo-16k-0613";
    modelMaxTokens = 16384;

    constructor(context) {
        super(context);
    }

    getInstructionMessages() {
        return [
            {
                "role": "system", "content": `You are creative image generator.
                User will provide you with what they need the image to contain, and you will generate a 'prompt' that describes the image that represents the user input in details in English language.
                DON'T guess or make-up the image url.
                Response format 'must' be as follows:
                <image>
                    <div class="flex justify-center mb-2"><img src="{generated image url}" title="{image title}"/></div>
                    <p>{image generation prompt}</p>
                </image>

                
                
                The user may request to make changes on the image, you should modify the prompt.
            `},
            { "role": "assistant", "content": "Please let me know what your image should contain." }
        ];
    }

    getChatNameFromMessage(responseMessage) {
        const titleMatch = responseMessage.match(/title="([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : null;
        return title;
    }

    getDialogText(responseMessage) {
        const messageParts = responseMessage.split(/<\/?image[^>]*>/);
        return `${messageParts[0].trim()}\n${messageParts.length <= 2 ? '' : messageParts.slice(2).join('\n').trim()}`;
    }

    getAppContent(responseMessage) {
        const messageParts = responseMessage.split(/<\/?image[^>]*>/);
        const image = messageParts[1];
        if (!image || !image.trim()) return '';
        return `
            <div class="chapter-container">${image}</div>
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
                        },
                        "imageStyle": {
                            "type": "string",
                            "enum": ["3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture"],
                            "description": "The style of the generated image"
                        }
                    },
                    "required": ["prompt", "imageStyle"]
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

        const imageStyle = parameters.imageStyle;
        const engineId = 'stable-diffusion-xl-1024-v1-0';
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
                    cfg_scale: 35,
                    clip_guidance_preset: 'NONE',
                    style_preset: imageStyle || 'photographic',
                    height: 896,
                    width: 1152,
                    samples: 1,
                    steps: 50,
                    seed: 22923
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

export { ImageGeneratorApp };