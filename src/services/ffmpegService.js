const { spawn } = require('child_process');
const fs = require('fs').promises; // Using promises for cleaner async code
const path = require("path");

module.exports = {
    // Start streaming with FFmpeg
    startStreaming:  async (inputFile, event_uuid, callback) => {
      const ffmpegPath = 'ffmpeg'; // change if needed
      const outputFilePath = path.join(__dirname, "..", "..",  "media", "live", event_uuid);
      await fs.mkdir(outputFilePath, { recursive: true });
      const outputFile = path.join(outputFilePath, "index.m3u8")
      console.log({outputFilePath});
    
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
        callback();
      });
    }
}