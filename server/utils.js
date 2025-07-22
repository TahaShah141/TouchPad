const { exec } = require("child_process");

const directionKeyCodes = {
  up: 126,
  down: 125,
  left: 123,
  right: 124
};

const triggerMissionControl = (direction) => {
  const keyCode = directionKeyCodes[direction.toLowerCase()];
  if (!keyCode) {
    throw new Error(`Invalid direction: ${direction}. Use "up", "down", "left", or "right".`);
  }

  const script = `tell application "System Events" to key code ${keyCode} using control down`;
  exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error triggering Mission Control: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`osascript stderr: ${stderr}`);
      return;
    }
  });
}

module.exports = { triggerMissionControl }