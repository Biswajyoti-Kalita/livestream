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
      const outputFile =`rtmp://localhost:1935/live/${process.env.STREAM_KEY}`;
      console.log({outputFilePath});
      const ffmpegArgs = [
        '-re',
        '-i', inputFile,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-b:v', '1500k',
        '-maxrate', '1500k',
        '-bufsize', '3000k',
        '-vf', 'scale=1280:-2',   // scales to 720p or similar, keeping aspect ratio
        '-g', '50',               // keyframe interval for 25fps (~2s)
        '-c:a', 'aac',
        '-ar', '44100',
        '-b:a', '128k',
        '-pix_fmt', 'yuv420p',
        '-f', 'flv',
        outputFile,
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