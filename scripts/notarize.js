const SKIP = true;

const { notarize } = require('@electron/notarize');
const { build } = require('../package.json');
require('dotenv').config();

exports.default = async function notarizing(context) {
  if (SKIP) {
    console.log('Skipping notarization...');
    return;
  }

  console.log('Notarizing...');
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    console.log('Not on macOS, skipping notarization');
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  try {
    console.log('Checking environment variables...');
    // Check if all required environment variables are present
    const requiredEnvVars = ['APPLE_ID', 'APPLE_ID_PASSWORD', 'APPLE_TEAM_ID'];
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
      console.warn(
        `Skipped macOS notarization: 'notarize' options were unable to be generated. Missing environment variables: ${missingEnvVars.join(
          ', ',
        )}`,
      );
      return;
    }

    console.log('Notarizing...');
    await notarize({
      appBundleId: build.appId,
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });

    console.log('Notarization completed successfully');
  } catch (error) {
    console.error('Error during notarization:', error);
    throw error;
  }
};
