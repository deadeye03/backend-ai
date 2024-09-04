import express from 'express'
import ImageKit from 'imagekit';
import mongoose from 'mongoose';
import Chat from './model/chat.js'
import UserChats from './model/chatsUser.js'
import 'dotenv/config'
import cors from 'cors'
import path from "path";
import url, { fileURLToPath } from "url";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
const app = express();

console.log(process.env.CLERK_PUBLISHABLE_KEY)
console.log(process.env.CLERK_SECRET_KEY)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}));
console.log(process.env.CLIENT_URL)
app.use(express.json());

const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('Connected to database')

    } catch (error) {
        console.log('unable to connect database')
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});
app.get('/api/upload', (req, res) => {
    var result = imagekit.getAuthenticationParameters();
    res.send(result);
})
app.post('/api/chats',ClerkExpressRequireAuth(), async (req, res) => {
    const userId=req.auth.userId;
    console.log(userId)
    const { text } = req.body;
    try {
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }]
        })
        const savedChat = await newChat.save();
        const userChats = await UserChats.find({ userId })
        if (!userChats.length) {
            const newUserChat = new UserChats({
                user_id:userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    },
                ],
            })
            await newUserChat.save();
        }
        else{
            await UserChats.updateOne(userId,{
                $push:{
                    chats:{
                        _id:savedChat._id,
                        title: text.substring(0, 40),
                    }
                }
            })
        }
        res.status(201).send(newChat._id);
    } catch (error) {
        console.log('Error during save chats', error)
        res.status(500).send('Error during save chats')
    }
})
app.get('/api/userChats',ClerkExpressRequireAuth({debug:true}),async (req,res)=>{
    const userId=req.auth.userId;
    try {
        const userChats=await UserChats.find({user_id:userId})
        console.log("all chats",userChats)
        const allChats = userChats.flatMap(doc => doc.chats);
        
        console.log("All chats extracted:", allChats);

        res.status(200).send(allChats);
        
    } catch (error) {
        console.log('Error during fetching chats', error)
        res.status(500).send('Error during fetching chats')
    }
})

app.get('/api/chats/:id',ClerkExpressRequireAuth(),async (req,res)=>{
    const userId=req.auth.userId;
    try {
        const chat =await Chat.findOne({_id:req.params.id,userId})
        
        res.status(200).send(chat)
    } catch (error) {
        console.log('Error fetching chat  chat', error)
        res.status(500).send('Error in getting chat chats')
    }
})

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
  
    const { question, answer, img } = req.body;
  
    const newItems = [
      ...(question
        ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
        : []),
      { role: "model", parts: [{ text: answer }] },
    ];
  
    try {
      const updatedChat = await Chat.updateOne(
        { _id: req.params.id, userId },
        {
          $push: {
            history: {
              $each: newItems,
            },
          },
        }
      );
      res.status(200).send(updatedChat);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error adding conversation!");
    }
  });

  // PRODUCTION
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
  })
const port = process.env.PORT || 3000;

app.listen(port, () => {
    connect()
    console.log('server is listing at port ', port)
})