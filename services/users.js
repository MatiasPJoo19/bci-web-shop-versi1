const { v4: uuidv4 } = require('uuid');
uuidv4();
let users = [
  {
    id: 1,
    username: 'tester',
    email: 'tester@mail.com',
    password: '$2y$06$PhZ74dT8/5g6B8SgssFq6ey4ojLxmP6pos2DcevMUGw25Vc9jGEou', // testerpassword
    
  },
 
];

module.exports = {
  getUserById: (id) => users.find(u => u.id == id),
  getUserByName: (username) => users.find(u => u.username == username),
  

}