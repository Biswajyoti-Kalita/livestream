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


