const { v4: uuidv4 } = require('uuid'); // uuid implementation
const express = require('express')
const app = express()
const bodyParser = require('body-parser');  //bodyParser implementation
const Ajv = require('ajv');
const ajv = new Ajv();
const bcrypt = require('bcryptjs');
const users = require('./services/users');
//const port = 3000       //local 3000 port

const ItemsInfoSchema = require('./schemas/Items.schema.json')
const ItemInfoValidator = ajv.compile(ItemsInfoSchema);

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy
//http basic
passport.use(new BasicStrategy(
    function(username, password, done) {
  
      const user = users.getUserByName(username);
      if(user == undefined) {
        // Username not found
        console.log("HTTP Basic username not found");
        return done(null, false, { message: "HTTP Basic username not found" });
      }
  
      /* Verify password match */
      if(bcrypt.compareSync(password, user.password) == false) {
        // Password does not match
        console.log("HTTP Basic password not matching username");
        return done(null, false, { message: "HTTP Basic password not found" });
      }
      return done(null, user);
    }
  ));



const ItemInfoValidateMw = function(req, res, next) {

    const validationResult = ItemInfoValidator(req.body);
    if(validationResult == true) {
        next();
    }else{
        res.sendStatus(400);
    }
}

const Items = [
{  
            "id": uuidv4(),
            "sellerName": "Tatu ",
            "title": "used winter jacket",
            "description": "Red winter jacket size M",
            "city": "Oulu",
            "photo": 0,
            "priceRequest": 50,
            "releaseDate": "4.10.2021",
            "phoNumber": "+35848598735",
            "category": "clothes",
            "shipping": false
    }
 
];
app.get('/', (req, res) => {
    res.send('Link to stoplight, "https://matiaspar-oamk.stoplight.io/docs/cloud-integration-graded-exercise/YXBpOjIzMjY3NjQz-web-store"')
    
    
  })
app.get('/items', (req, res) => {
    
        res.json(Items);
})

app.post('/items', ItemInfoValidateMw, (req, res) => {

    const validationResult = ItemInfoValidator(req.body);
    console.log(validationResult);
if(validationResult == true) {
    Items.push({
    id: uuidv4(),
    sellerName: req.body.sellerName,
    title: req.body.title,
    description: req.body.description,
    city: req.body.city,
    photo: req.body.photo,
    priceRequest: req.body.priceRequest,
    releaseDate: req.body.releaseDate,
    phoNumber: req.body.phoNumber,
    category: req.body.category,
    shipping: req.body.shipping
    

});
res.sendStatus(201);

}})
app.get('/httpBasicProtectedResource',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    res.json({
    yourProtectedResource: "profit"
    });
});

app.post('/registerBasic',
        (req, res) => {

  if('username' in req.body == false ) {
    res.status(400);
    res.json({status: "Missing username from body"})
    return;
  }
  if('password' in req.body == false ) {
    res.status(400);
    res.json({status: "Missing password from body"})
    return;
  }
  if('email' in req.body == false ) {
    res.status(400);
    res.json({status: "Missing email from body"})
    return;
  }

  const salt = bcrypt.genSaltSync(6);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  console.log(hashedPassword);
  users.addUser(req.body.username, req.body.email, hashedPassword);

  res.status(201).json({ status: "created" });
});


const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
      let jwtSecretKey = "MYsECRETkEY";

      let choice = {}

      choice.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
      choice.secretOrKey = jwtSecretKey;

      passport.use(new JwtStrategy(choice, function(jwt_payload, done) {
        console.log("Processing JWT payload for token content:");
        console.log(jwt_payload);
      
      
        const now = Date.now() / 1000;
        if(jwt_payload.exp > now) {
          done(null, jwt_payload.user);
        }
        else {
          done(null, false);
        }
      }));
      app.get(
        '/jwtProtectedResource',
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
          console.log("jwt");
          res.json(
            {
              status: "Successfully accessed protected resource with JWT",
              user: req.user
            }
          );
        }
      );
      app.post(
        '/loginForJWT',
        passport.authenticate('basic', { session: false }),
        (req, res) => {
          const body = {
            id: req.user.id,
            email : req.user.email
          };
      
          const payload = {
            user : body
          };
      
          const choice = {
            expiresIn: '1d'
          }
      
          const token = jwt.sign(payload, jwtSecretKey, choice);
      
          return res.json({ token });
      })
/*app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})*/

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});