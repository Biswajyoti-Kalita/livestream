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
        '-preset', 'veryfast',  // Faster encoding, lower latency
        '-tune', 'zerolatency', // Optimize for streaming
        '-c:a', 'aac',
        '-f', 'hls',
        '-hls_time', '2',       // Keep segments short
        '-hls_list_size', '5',  // Keep only 5 segments in the playlist
        '-hls_delete_threshold', '1', // Delete segments quickly
        '-hls_flags', 'delete_segments+append_list+omit_endlist+program_date_time+discont_start',
        '-start_number', '0',   // Start numbering at 0
        '-hls_segment_type', 'mpegts', // Use MPEG-TS for segments
        '-hls_allow_cache', '0',
        '-hls_playlist_type', 'event', // More appropriate for live
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