const mysql = require('mysql')
const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'db'
})

connection.connect((err)=>{
    if(err) throw err
    console.log("Connection Created")
})

app.set('view engine','hbs')
app.set('views','./view')

app.get('/',(req,resp)=>{
    resp.render('landing')
})

app.get('/login',(req,resp)=>{
    resp.render('login')
})

app.get('/register',(req,resp)=>{
    resp.render('register')
})

app.get('/loginu',(req,resp)=>{
    let {email,password} = req.query
    connection.query("SELECT * FROM users WHERE email=? and password=?",[email,password],(err,result)=>{
        if(err) throw err
        if(result.length>0){
            resp.render('patient')
        }
        else{
            resp.render('login',{invalid: true})
        }
    })
})
app.use(bodyparser.urlencoded())
app.post('/registeru',(req,resp)=>{
    let {email,password} = req.body
    connection.query("SELECT * FROM users WHERE email=?",[email],(err,result)=>{
        if(err) throw err
        if(result.length>0){
            resp.render('register',{msg: true})
        }
        else{
            connection.query("INSERT INTO users (email,password) VALUES (?,?)",[email,password],(err,result)=>{
                resp.render('login')
            })
        }
    })
})

app.listen(8080)