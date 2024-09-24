const { exec } = require('child_process');
const path = require('path');

function playSound(soundPath) {
  if (!soundPath || typeof soundPath !== 'string') {
    console.error('Invalid sound path provided');
    return;
  }

  const absolutePath = path.resolve(soundPath);
  const command = `afplay "${absolutePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error playing sound: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log('Sound played successfully');
  });
}

module.exports = {
  playSound,
};
