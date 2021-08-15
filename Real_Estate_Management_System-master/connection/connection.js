
var mysql      = require('mysql');
var options = {
  host     : 'localhost',
  user     : 'root',
  password : 'agrawal',
  database : 'project',
  multipleStatements : true
};
var connection = mysql.createConnection(options);
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    console.log('connection failed')
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

module.exports = {connection, options};