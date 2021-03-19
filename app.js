const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const usuarios = require('./dummy');
const { exec } = require('child_process');
const { stdout, stderr } = require('process');

const data = {
    message: 'datos',
    payload: {
        temperatura: '20',
        presion: '1'
    }
}

//Middlewares
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
//CORS

//Rutas
app.get('/', (req, res)=>{
    res.status(200).send('<div> <h1>Mi sitio web<h1> <p>esp32 y aws<p> <div>');
});

app.get('/homepage', (req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
});

user_or=usuarios.sort((a,b)=>{return a.id-b.id});

//num_or = numeros.sort((a, b) => a - b)
//console.log(num_or)
app.get('/data', (req,res)=> {
    res.status(200).send(user_or);
});


app.get('/users/:id', (req, res)=>{
    const id = req.params.id;
    var user = {};
    for(let u of usuarios){
        if (u.id == id){
            user = u;
        }
    }
    var nuevaClave = '';
    var contador = 1;
    var cRef = '';
    for(let c of user.clave){
        if(c==cRef)
        {
            contador++;
        }
        else if(contador==1)
        {
            cRef=c;
            nuevaClave=nuevaClave + cRef;
            
        }
            else
            {
            cRef=c;
            nuevaClave= nuevaClave + String(contador)+ cRef;
            contador=1;
            }
    
    }
    console.log(nuevaClave);
    res.status(200).send(nuevaClave);
});

    

app.get('/users/:id', (req, res) =>{
    const id = req.params.id;
    var user = {};
    for(let u of usuarios){
        if(u.id == id){
            user = u;
        }
    }
    res.status(200).send(user);
});

app.get('/publish',(req,res)=>{
    
    exec("aws --region us-east-1 iot-data publish --topic 'inTopic' --cli-binary-format raw-in-base64-out --payload 'Hello world'", (error,stdout,stderr)=>{
        if(error){
            res.status(200).send(error)
        }
        if(stderr){
            res.status(200).send(stderr)
        }
        res.status(200).send("enviado correctamente");
    });
});

module.exports = app;

