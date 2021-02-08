const path = require('path');
const fs = require('fs');
// const execSync = require('child_process').execSync;


const PROJECT_PATH = process.cwd();


// const TODAY = (new Date()).toISOString().replace(/-|(T.+$)/g, '');
// const GIT_HEAD = execSync('git rev-parse --short HEAD').toString().trim();
// const REV = TODAY + '-' + GIT_HEAD;


const pkg = JSON.parse(fs.readFileSync(path.resolve(PROJECT_PATH, './package.json'), 'utf-8'));
const {
  name,
  ENTRY,
  DLL,
  EXTERNAL,
  DEV_HOST = '0.0.0.0',
  DEV_PORT = '3001',
  TARGET_DIR = '../kratos-ui/src/app/public/rsrc',
  PUBLIC_PATH,
} = pkg;


const WEBPACK = {
  entry: ENTRY,

  resolve: {
    modules: [ path.resolve(PROJECT_PATH, 'src'), 'node_modules' ],
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      'rsrc': path.resolve(PROJECT_PATH, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
            }
          },
        ],
      }
    ]
  },
};

if (EXTERNAL) {
  WEBPACK.externals = EXTERNAL;
}

module.exports = {
  // REV: REV,

  NAME: name.toLowerCase(),
  ENTRY: ENTRY,
  DLL: DLL,
  DEV_HOST: DEV_HOST,
  DEV_PORT: DEV_PORT,
  PROJECT_PATH: PROJECT_PATH,
  TARGET_DIR: TARGET_DIR,
  PUBLIC_PATH: PUBLIC_PATH || `/${name.toLowerCase()}/rsrc/dist/`,

  WEBPACK: WEBPACK,
};
