// Import necessary modules and create the server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const spawn = require('child_process').spawn;

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = "mongodb+srv://Obhi:Obhi8032@cluster0.edvmx.mongodb.net/?retryWrites=true&w=majority";
const { default: axios } = require('axios');
app.use(cors());
app.use(bodyParser.json());


const uploadRouter = require('./routes/upload');
const deleteRouter = require('./routes/delete');
const { userInfo } = require('os');
app.use('/', uploadRouter);
app.use('/', deleteRouter);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

  
  async function run() {
    // const uri = `mongodb+srv://Obhi:Obhi8032@cluster0.edvmx.mongodb.net/hisab-nikash?retryWrites=true&w=majority`;

    const uri = "mongodb+srv://alaminobhi2:obhi8032@cluster0.edvmx.mongodb.net/hisab-nikash?retryWrites=true&w=majority";

    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {

    await client.connect();
    // Get the database and collection on which to run the operation
    const collection = client.db().collection("hisabs");
    console.log("You successfully connected to MongoDB!");

    app.get('/all-hisab', async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const doc = await cursor.toArray();
      res.send(doc)
    });

    io.on('connection', (socket) => {
      // console.log('socket connected');
        socket.on('disconnect', () => {});

        socket.on('add-hisab', async (data) => {
        console.log(data);
          // collection.createIndex(data)
        // collection.insertMany(product)
        await collection.insertOne(data);
        
      
        });
      
      socket.on("hisab", async(data)=>{

        const query = {};
      const cursor = collection.find(query);
      const doc = await cursor.toArray();
        console.log("room data", data);
        socket.emit('hisab', doc)
      
      })
      
      });


    // io.on('connection', (socket) => {

    //   socket.on('add-hisab', async (data) => {
    //     console.log(data);
    //     // collection.createIndex(data)
    //   // collection.insertMany(product)
    //   await collection.insertOne(data);
      
     
    //   });


      
    
    //   // try {
    //   //   // Start the streaming process
    //   //   await startStreaming();
    //   //   socket.emit('stream-status', 'Live stream is running');
    //   // } catch (error) {
    //   //   console.error('Error starting the stream:', error);
    //   //   socket.emit('stream-status', 'Error starting the stream');
    //   // }
    
    //   // Handle the start streaming event
    //   socket.on('start-stream', async ({fileurl, loop, urlkey}) => { 
    
    //     const inputFilePath = path.resolve(__dirname, `${fileurl}`);
        
    //     const url = 'http://localhost:8000/video-live';

    //     const videoPath = "./video.mp4";
       
      
      
    //     const inputFilePath1 = `https://obhistream-server.vercel.app/video_file/${fileurl}`
    //     console.log('Start streaming event received', urlkey);
    //     // axios.get('https://www.youtube.com/watch?v=RLzC55ai0eo').then(res => {
    //     //   const data = (res.data);
    //     //   console.log(data);
    //     const ffmpegProcess = spawn(ffmpegPath, ['-stream_loop', loop, '-re', '-i', url, 
    //     '-c', 'copy',
    //     '-f', 'flv', urlkey]);
        
    //     // const ffmpegCommand = [
    //     //   '-f', 'lavfi',
    //     //   '-i', 'anullsrc=cl=stereo:r=44100',
    //     //   '-f', 'x11grab',
    //     //   '-framerate', '30',
    //     //   '-s', '1920x1080',
    //     //   '-i', ':0.0',
    //     //   '-c:v', 'libx264',
    //     //   '-profile:v', 'main',
    //     //   '-pix_fmt', 'yuv420p',
    //     //   '-preset', 'ultrafast',
    //     //   '-g', '30',
    //     //   '-b:v', '2500k',
    //     //   '-c:a', 'aac',
    //     //   '-ar', '44100',
    //     //   '-b:a', '128k',
    //     //   '-f', 'flv',
    //     //   'rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY',
    //     // ];
    //     // const ffmpegProcess = spawn(ffmpegPath, ['-stream_loop', '-1', '-re', '-i', url, 
    //     // '-vcodec', 'libx264', '-preset', 'veryfast', '-r', '30', '-g', '(30 * 2)', '-b:v', '1500k',
    //     // '-acodec', 'libmp3lame', '-ar', '44100', '-b:a', '712000', '-bufsize', '128k', 
    //     // '-f', 'flv', outputUrl]);
    
    //     ffmpegProcess.stdout.on('data', (data) => {
    //           console.log(data.toString());
    //         });
    //     ffmpegProcess.stderr.on('data', (data) => {
    //               console.log(data.toString());
    //             });
    //     ffmpegProcess.on('close', (code) => {
    //       console.log(`child process exited with code ${code}`);
    //     });
    //     // Handle errors
    //     ffmpegProcess.on('error', (err) => {
    //         console.error(`Error spawning ffmpeg: ${err}`);
    //     });

    
    //     // Send a confirmation message to the client
    //     socket.emit('stream-started', 'Live stream has started');
    //   });
    //   // });
    
    //   // Handle the stop streaming event
    //   socket.on('stop-stream', () => {
    //     console.log('Stop streaming event received');
    
    //     // Stop the FFmpeg process or take necessary actions to stop streaming
    //     console.log('kill: SIGINT')
    //     ffmpegProcess.kill('SIGINT')
    //     // Send a confirmation message to the client
    //     socket.emit('stream-stopped', 'Live stream has stopped');
    //   });
    
    
    //   socket.on('disconnect', () => {
        
    //   });
    // });

  }
  catch (e) {
    console.error(e);
}
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

  // client.connect(err => {
  //   // const collection = client.db("hisab-nikash").collection("hisabs");
  //   // const ordersCollection = client.db("hisab-nikash").collection("orders");

  //   app.post('/addhisab', (req, res)=>{
  //     const hisab =req.body;
  //     console.log(hisab);
  //     collection.insertOne(hisab)
  //     // collection.insertMany(product)
  //     .then(result =>{
  //       res.send(result.insertedCount)
  //     })
  // })
  
  // app.get('/hisabs',(req, res)=>{
  //     collection.find({})
  //     .toArray( (err, documents)=>{
  //         res.send(documents);
  //     })
  // })
    
  // });


app.get('/video-live', function(req, res){
  
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header");
    }
    const video = 'https://www.youtube.com/watch?v=RLzC55ai0eo';
    const videoPath = "./video.mp4";
    const videoSize = fs.statSync(videoPath).size;
    // console.log("size of video is:", videoSize);
    const CHUNK_SIZE = 10**6; //1 MB
    const start = Number(range.replace(/\D/g, "")); 
    const end = Math.min(start + CHUNK_SIZE , videoSize-1);
    const contentLength = end-start+1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206,headers);
    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res);

});





const server2 = server.listen(8000, () => {
  console.log('Server is running on port 8000');
});

const io = require("socket.io")(server2, {
  pingTimeout: 60000,
  cors:{
    origin: "*",
  },
})


// const token2 = "808032"
// io.use( async (socket, next)=>{
// try{
//   const token = socket.handshake.query.token;
//   token = token2;
//   next();
// }
// catch (err){}

// })





