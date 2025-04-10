require("dotenv").config();

const ffmpeg = require('fluent-ffmpeg');

ffmpeg()
  .input('./uploads/videoplayback.mp4')
  .inputOptions(['-re']) // Read input in real-time to simulate live
  .outputOptions([
    '-c copy',   // Copy codec (no transcoding)
    '-f flv'     // Use FLV container for RTMP
  ])
  .output('rtmp://localhost:1935/live/stream')
  .on('start', commandLine => {
    console.log('FFmpeg process started:', commandLine);
  })
  .on('error', (err, stdout, stderr) => {
    console.error('Error:', err.message);
    console.error('FFmpeg stderr:', stderr);
  })
  .on('end', () => {
    console.log('Streaming finished!');
  })
  .run();
