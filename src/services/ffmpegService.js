const { spawn } = require('child_process');
const fs = require('fs').promises; // Using promises for cleaner async code
const path = require("path");

module.exports = {
    // Start streaming with FFmpeg
    startStreaming:  async (inputFile, event_uuid, callback) => {
      const ffmpegPath = 'ffmpeg'; // change if needed
      const outputFilePath = path.join(__dirname, "..", "..",  "media", "live", event_uuid);
      await fs.mkdir(outputFilePath, { recursive: true });
      // const outputFile = path.join(outputFilePath, "index.m3u8")
      const outputFile ="rtmp://localhost:1935/live/abc123"
      console.log({outputFilePath});
      const ffmpegArgs = [
        '-re',
        '-i', inputFile,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-tune', 'zerolatency',
        '-c:a', 'aac',
        '-ar', '44100',        // optional: standard audio sampling rate
        '-b:a', '128k',        // optional: standard audio bitrate
        '-pix_fmt', 'yuv420p', // ensures compatibility
        '-g', '50',            // keyframes every 2 seconds for 25fps
        '-f', 'flv',
        outputFile,            // RTMP URL (e.g., rtmp://your-ip:1935/live/streamKey)
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
        callback();
      });
    }
}