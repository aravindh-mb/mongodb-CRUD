const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const exhbs = require('express-handlebars')
const dbo = require('./db')
const ObjectId = dbo.ObjectID

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs')
app.set('views','views')
app.use(bodyparser.urlencoded())

app.get('/',async (req,res)=>{
    let database =await  dbo.getDatabase()
    const collection = database.collection('books')
    const cursor =collection.find({})
    let employees =await cursor.toArray()
    // log
    // console.log(employees)
    let message = ''
    switch (req.query.status) {
        case "1":
            message = "inserted successfully"
            break;
        case "2":
            message = "updated successfully"
            break;
        case "3":
            message = "deleted successfully"
            break;
        default:
            break;
    }
    let edit_id ,edit_details 

    if(req.query.edit_id){
        edit_id = req.query.edit_id
        edit_details =  await collection.findOne({_id: new ObjectId(edit_id)})
        
    }
    if(req.query.delete_id){
       delete_id = req.query.delete_id
       await collection.deleteOne({_id: new ObjectId(delete_id)})
       return res.redirect('/?status=3')
    }

    res.render('main',{message,employees,edit_id,edit_details})
})

// post details object to mongoDB
app.post('/store_details',async (req,res)=>{
    let database = await  dbo.getDatabase()
    let collection = database.collection('books')
    let details = {
        images:req.body.src,
        first_name:req.body.firstname,
        last_name:req.body.lastname,
        email:req.body.email,
        gender:req.body.gender
    }
    await collection.insertOne(details)
    return res.redirect('/?status=1')
})

// update data
app.post('/update_details/:edit_id',async (req,res)=>{
    let database = await  dbo.getDatabase()
    let collection = database.collection('books')
    let details = {
        images:req.body.src,
        first_name:req.body.firstname,
        last_name:req.body.lastname,
        email:req.body.email,
        gender:req.body.gender
    }
    let edit_id = req.params.edit_id
    await collection.updateOne({_id:new ObjectId(edit_id)},{$set:details})
    return res.redirect('/?status=2')
})
// app port detail
app.listen(8000,()=>{
    console.log("app is running on 8000 port"); 
})

