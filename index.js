import { QuizGenerator } from './apps/QuizGenerator.js';
import {ConversationalAppEngine} from './ConversationalAppEngine.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const port = 3000;


const engine = new ConversationalAppEngine(QuizGenerator);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Client
app.get('/', (req, res) => {
    fs.readFile('client/index.html', (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Error loading the file');
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(engine.substituteText(data.toString()));
        }
    });
});

app.get('/script.js', (req, res) => {
    fs.readFile('client/script.js', (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Error loading the file');
        } else {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(engine.substituteText(data.toString()));
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
    console.log("Recived [Get User Chats] from user: " + userid);

    if (!userid) {
        res.status(400).send({
            message: "User id is not provided"
        });
        return;
    }

    res.json(engine.getUserChats(userid));
});

app.delete('/api/userchat', async (req, res) => {
    const userid = req.query.userid;
    const chatid = req.query.chatid;
    console.log("Recived [Delete Chat: '" + chatid + "'] from user: " + userid);

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

    engine.deleteUserChat(userid, chatid);

    res.json({ success: true });
});

app.get('/api/chatmessages', async (req, res) => {
    const userid = req.query.userid;
    const chatid = req.query.chatid;
    console.log("Recived [Get Chat: '" + chatid + "'] from user: " + userid);

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

    res.json(engine.getUserChat(userid, chatid));
});

app.post('/api/chat', (req, res) => {
    const message = req.body.message;
    const userid = req.body.userid;
    const chatid = req.body.chatid;
    console.log("Recived Message from user [" + userid + "], chat [" + chatid + "]: " + message);

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

    engine.postMessage(userid, chatid, message, (err, data) => {
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
