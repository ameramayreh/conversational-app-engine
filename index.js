import {ConversationalAppEngine} from './ConversationalAppEngine.js';
import { ConversationalApp } from './ConversationalApp.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const port = 3000;


const defaultEngineClassName = 'QuizGenerator';
const engines = {}; 
const appPath = './apps';
fs.readdirSync(appPath).forEach(file => { 
    // load app clases from apps folder
    if(!file.endsWith('.js')){
        return;
    }
    const modFile = appPath + "/" + file;
    try {
        import(modFile).then(appModule => {
           Object.keys(appModule).sort().forEach(k => {
               const moduleItem = appModule[k];
               if(moduleItem.prototype instanceof ConversationalApp) {
                   engines[moduleItem.name] = new ConversationalAppEngine(moduleItem);
               }
           });
        });
    } catch {
        console.error(`Failed to load app from file ${modFile}`);
    }
});


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Client
app.get('/', (req, res) => {
    const appName = req.query.app;
    if(!appName || !engines[appName]) {
        res.redirect('/?app=' + defaultEngineClassName);
        return;
    }
    fs.readFile('client/index.html', (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Error loading the file');
        } else {
            res.cookie('app', appName);
            res.writeHead(200, {'Content-Type': 'text/html'});
            let html = engines[appName].substituteText(data.toString());
            const appsList = Object.keys(engines).sort().map(k => ({
                'app': k,
                'name': engines[k].app.appName,
                'current': k === appName,
                'icon': engines[k].app.appIconName,
                'badge': engines[k].app.model == 'gpt-4'? 'GPT4' : null}));
            html += '<script> var appsList = ' + JSON.stringify(appsList) + ';</script>';
            res.end(html);
        }
    });
});

app.get('/script.js', (req, res) => {
    const appName = getAppNameCookieValue(req);
    fs.readFile('client/script.js', (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Error loading the file');
        } else {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(engines[appName].substituteText(data.toString()));
        }
    });
});

app.get('/style.css', (req, res) => {
     fs.readFile('client/style.css', (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Error loading the file');
        } else {
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(data);
        }
    });
});

// API
app.get('/api/userchats', async (req, res) => {
    const userid = req.query.userid;
    const appName = getAppNameCookieValue(req);
    console.log("Recived [Get User Chats] from user: " + userid);

    if (!userid) {
        res.status(400).send({
            message: "User id is not provided"
        });
        return;
    }

    res.json(engines[appName].getUserChats(userid));
});

app.delete('/api/userchat', async (req, res) => {
    const userid = req.query.userid;
    const chatid = req.query.chatid;
    const appName = getAppNameCookieValue(req);
    console.log("Received [Delete Chat: '" + chatid + "'] from user: " + userid);

    if (!userid) {
        res.status(400).send({
            message: "User id is not provided"
        });
        return;
    }

    if (!chatid) {
        res.status(400).send({
            message: "Chat Id is not provided"
        });
        return;
    }

    engines[appName].deleteUserChat(userid, chatid);

    res.json({ success: true });
});

app.get('/api/chatmessages', async (req, res) => {
    const userid = req.query.userid;
    const chatid = req.query.chatid;
    const appName = getAppNameCookieValue(req);
    console.log("Received [Get Chat: '" + chatid + "'] from user: " + userid);

    if (!userid) {
        res.status(400).send({
            message: "User id is not provided"
        });
        return;
    }

    if (!chatid) {
        res.status(400).send({
            message: "Chat Id is not provided"
        });
        return;
    }

    res.json(await Promise.resolve(engines[appName].getUserChat(userid, chatid)));
});

app.post('/api/chat', (req, res) => {
    const message = req.body.message;
    const userid = req.body.userid;
    const chatid = req.body.chatid;
    const appName = getAppNameCookieValue(req);
    console.log("Received Message from user [" + userid + "], chat [" + chatid + "]: " + message);

    if (!userid) {
        res.status(400).send({
            message: "User id is not provided"
        });
        return;
    }

    if (!chatid) {
        res.status(400).send({
            message: "Chat Id is not provided"
        });
        return;
    }

    if (!message) {
        res.status(400).send({
            message: "Message is not provided"
        });
        return;
    }

    engines[appName].postMessage(userid, chatid, message, (err, data) => {
        if(err) {
            res.status(500).send(err);
            return;
        }
        
        res.json(data);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
function getAppNameCookieValue(req) {
    return req.headers.cookie.split(';').filter(c => c.trim().startsWith('app='))[0].split('=')[1].trim();
}

