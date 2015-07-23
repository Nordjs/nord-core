import http from 'http';
import fs from 'fs-extra';
import path from 'path';

import {transformFileSync} from 'babel';
import {sync as globSync} from 'glob';

export default class NordServer {

  constructor(userRoot='app', port=8080, appRoot=null) {
    this.userRootPath = userRoot;
    this.rootPath = appRoot ||
      path.join(path.dirname(userRoot), `.${path.basename(userRoot)}`);
    this.port = port;
  }

/**
 * Transpiles any babel app code and copies into a temporary folder for the
 * server to access it.
 * Ignoring some 'ES7' features due to https://github.com/babel/babel/issues/1990
 *
 * @param {string} outPath defines path where the files get copied to
 * @returns {array} the list of files that have been created
 */
  transformAppCode() {
    const appFiles = globSync(`${this.userRootPath}/**/*.js`);
    const outFiles = [];
    const babelOptions = {
      'stage'    : 0,
      'blacklist': [
        'react',
        'es7.comprehensions',
        'es7.doExpressions',
        'es7.functionBind',
        'es7.objectRestSpread',
        'es7.trailingFunctionCommas'
      ],
      'loose'   : true,
      'optional': ['runtime'],
      'modules' : 'common'
    };

    // TODO(markus): Make this for loop parallel or use async library
    for (const filePath of appFiles) {
      const {code} = transformFileSync(filePath, babelOptions);
      const filename = path.relative(this.userRootPath, filePath);
      const outFile = path.join(this.rootPath, filename);
      fs.outputFileSync(outFile, code);
      outFiles.push(outFile);
    }

    return outFiles;
  }

  /**
   * Starts the http server at the defined port, using the provided router
   * TODO(markus): Implement https support
   * @param {function} router A function used to route all requests
   */
  start(router) {

    console.log('Transforming app code into .app/'); // eslint-disable-line no-console
    this.transformAppCode();
    console.log('App code transformed.'); // eslint-disable-line no-console

    // Create a server
    const server = http.createServer(router.bind(this));

    // Lets start our server
    server.listen(this.port,  () => {
      // Callback triggered when server is successfully listening. Hurray!
      console.log(`Server started on: http://localhost:${this.port}`); // eslint-disable-line no-console
    });
  }
}
