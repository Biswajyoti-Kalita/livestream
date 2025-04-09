require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT;

app.use(express.static('public'));

const NodeMediaServer = require('node-media-server');

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg', // path to your ffmpeg
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: false
            }
        ]
    }
};

var nms = new NodeMediaServer(config);
nms.run();

nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', StreamPath);
    // e.g., save stream status in memory or DB
});

nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', StreamPath);
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});
