const { v4: uuidv4 } = require('uuid'); // uuid implementation
const express = require('express')
const app = express()
const bodyParser = require('body-parser');  //bodyParser implementation
const Ajv = require('ajv');
const ajv = new Ajv();
//const port = 3000       //local 3000 port

const ItemsInfoSchema = require('./schemas/Items.schema.json')
const ItemInfoValidator = ajv.compile(ItemsInfoSchema);

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));
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
/*app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})*/
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});