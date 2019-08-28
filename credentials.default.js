/* This is a default credentials file.
 * Please rename this as credentials.js and fill in credentials information when start server.
 * Do not add credentials.js to your version control system.
 */

module.exports = {
  cookieSecret: 'Your Cookie Key',
  mongo: {
    development: {
      connectionString: 'Your Dev Connection String'
    },
    production: {
      connectionString: 'Your Production Connection String'
    }
  }
};
