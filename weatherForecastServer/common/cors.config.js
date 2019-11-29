var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };

var cors = require('cors')

module.exports = (app) => {
    app.use(cors(corsOption))
}