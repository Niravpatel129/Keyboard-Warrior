const { exec } = require('child_process');
const path = require('path');

module.exports = async function (configuration) {
  console.log('Starting HourBlock Windows code signing process...');

  const certPath = path.resolve('C:\\Users\\mrmap\\Documents\\HourBlock_CodeSigningCert.pfx');
  const signtool =
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.26100.0\\x86\\signtool.exe';

  const certPassword = 'dragon1';

  if (!certPassword) {
    console.error('HourBlock certificate password not found in environment variables');
    return Promise.reject(new Error('Certificate password not found'));
  }

  const signCommand = `"${signtool}" sign /fd SHA256 /f "${certPath}" /p "${certPassword}" /tr http://timestamp.digicert.com /td SHA256 "${configuration.path}"`;

  return new Promise((resolve, reject) => {
    exec(signCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during HourBlock signing: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return reject(new Error(stderr));
      }
      console.log(`HourBlock signing completed successfully: ${stdout}`);
      resolve();
    });
  });
};
