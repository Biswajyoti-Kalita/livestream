require('dotenv').config();
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));

const NodeMediaServer = require('node-media-server');

const config = {
    logType: 3,
    rtmp: {
        port: 1935,
        chunk_size: 4096,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
        record: {
            directory: './media',  // Ensure this is the correct directory
            folder: './media',
            duration: 0,          // Duration of the file (optional, set to 0 for no limit)
            filesize: 100 * 1024 * 1024  // Maximum file size (optional)
        }
    },
    http: {
        port: 8000,
        allow_origin: '*',
        mediaroot: '/Users/biswajyotikalita/Desktop/projects/livestream/media',
        webroot: './www',
        api: true
    },
    trans: {
        ffmpeg: process.env.FFMPEG_PATH, // path to your ffmpeg
        tasks: [
            {   
                app: 'live',
                hls: true,
                vc: 'libx264',
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                hlsKeep: true, // to prevent hls file delete after end the stream
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
                dashKeep: true // to prevent dash file delete after end the stream
            }
        ]
    },
    record: {
        flv: true,
        folder: './media'
    }
};

var nms = new NodeMediaServer(config);
nms.run();

nms.on("errorMessage", (...err) => {
    console.log(`Error ${err}`);
})


nms.on('debugMessage', (...args) => {
    console.log(`Error ${args}`);
  });
  

nms.on('ffDebugMessage', (...args) => {
console.log(`Error ${args}`);
});
nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', StreamPath);
    // e.g., save stream status in memory or DB
});

nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', StreamPath);
});




// Serve HLS output (index.m3u8, .ts files)
app.use('/live', express.static(path.join(__dirname, 'media/live')));

// Serve the video player page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/player.html'));
});

// Start streaming with FFmpeg
function startStreaming(inputFile, outputFile) {
  const ffmpegPath = 'ffmpeg'; // change if needed

  const ffmpegArgs = [
    '-re',
    '-i', inputFile,
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '3',
    '-hls_flags', 'delete_segments',
    '-hls_playlist_type', 'event',
    outputFile
  ];

  const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

  ffmpeg.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
  });
}

app.get("/start", (req,res) => {

    // Start FFmpeg when the server starts
    startStreaming('./uploads/vid.mp4', './media/live/mystream/index.m3u8');
    return res.send({status: "okay"});
})

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
