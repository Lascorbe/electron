const express = require('express');

class Server {
  // start a server, store logging block for later
  // - parameter logBlock lambda (String)=>Void
  constructor(port, logBlock) {
    this.logger = logBlock;

    this.app = express();
    this.app.set('json spaces', 2);
    this.app.listen(port);
  }

  // add a mocked json response under a given path
  // if response is an array, add dynamic path to fetch single objects by id
  // - parameter path url API path like 'users' or 'dogs'
  // - parameter json array or object to respond to requests
  addPath(path, json) {
    this.app.get('/'+path, (request, response) => {
      this.logger({time: (new Date()).toUTCString(), status: 200, url: request.originalUrl});
      response.json(json);
    });
    
    if (!Array.isArray(json)) return;
    
    this.app.get('/'+path+'/:id', (request, response) => {
      const userId = request.params.id
      const found = json.filter((item) => item.id == userId)
      let status
      if (found.length > 0) {
        status = 200
        response.json(found[0]);
      } else {
        status = 404
        response.status(status).send(`'Sorry, we cannot find user with id "${userId}"!'`);
      }
      this.logger({time: (new Date()).toUTCString(), status: status, url: request.originalUrl});
    });
  }
}

module.exports.Server = Server;
