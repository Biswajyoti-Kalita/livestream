require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');

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




app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});
