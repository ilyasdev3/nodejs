const express = require("express")
const mongoose = require("mongoose")
const User = require("./models/User")
const Product = require("./models/Product")

const bcrypt = require("bcryptjs")

const app = express()
const port = 3000;


// get, post, put, delete


// STATUS.SUCCESS = 200
// STATUS.CREATED = 201
// STATUS.ACCEPTED = 202
// STATUS.NO_CONTENT = 204
// STATUS.BAD_REQUEST = 400
// STATUS.UNAUTHORIZED = 401
// STATUS.FORBIDDEN = 403
// STATUS.NOT_FOUND = 404
// STATUS.METHOD_NOT_ALLOWED = 405
// STATUS.CONFLICT = 409
// STATUS.INTERNAL_SERVER_ERROR = 500



app.use(express.json())

app.get("/users", (request, response)=>{
 response.send("testing")
})

app.post("/register", async(req,res)=>{
    // console.log(req.body);

   const user = await User.find({email:req.body.email})
   if(user){
    return res.status(400).send({message:"User already registered"})
   }
    let hashPass = await bcrypt.hash(req.body.password, 11)
   const newUser = await User.create({username:req.body.username, password:hashPass, email:req.body.email})
   const {password, ...userWithoutPass} = newUser._doc
   res.send(userWithoutPass)
})

app.post("/login", async(req,res)=>{

    const user = await User.findOne({email:req.body.email})
    if(!user){
    return res.status(404).send({message:"User not found"})
    }

    const comparePass = await bcrypt.compare(req.body.password, user.password)

    if(!comparePass){
        return res.status(401).send({message:"You are authenticated"})
    }
    const {password, ...userWithoutPass} = user._doc
    return res.status(200).send({userWithoutPass, message:"login success"})
})


app.post("/create-product", async(req,res)=>{
    const product = await Product(req.body)
    await product.save()

    res.status(200).send({product, message:"product added"})
})

app.get("/products", async(req,res)=>{

    const allProducts = await Product.find()
    res.status(200).send({allProducts})
})

app.get("/product",async (req,res)=>{
   const id = req.query.id;
   console.log(id);
    const singlePost = await Product.findById(id)

    res.status(200).send({singlePost})

})


const connectToMongoDB = async () => {

    await  mongoose.connect('mongodb+srv://ilyas:ilyas@cluster0.suvdu4n.mongodb.net/nodejsLearning')
    console.log('MongoDB connected...')  
 }
 connectToMongoDB()

app.listen((port), ()=>{
    console.log(`server started on port ${port}`);
})
