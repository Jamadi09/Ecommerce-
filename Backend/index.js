const port = process.env.PORT || 4000;
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');


app.use(express.json());
app.use(cors({origin: "https://ecommerce-frontend-ulfv.onrender.com"}));

// Database connection with MongoDB
mongoose.connect("mongodb+srv://talk2joel12:07064630566@cluster0.8ulaaj3.mongodb.net/e-commerce");
//API Creation

app.get("/",(req, res)=>{
  res.send("Express App is Running")
})

//Image storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})



const upload = multer({storage:storage})

// Creating upload end point for images
app.use('/images', express.static('upload/images'))
app.post("/upload",upload.single('product'),(req, res)=>{
     res.json({
        success:1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
     })
})

//Schema for creating products

const Product = mongoose.model("product",{
    id:{
        type: Number,
        required:true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type:String,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
});

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name: req.body.name,
    })
})

// Creating API for deleting Products

app.post('/removeproduct',async (req, res)=>{
     await Product.findOneAndDelete({id:req.body.id});
     console.log("Removed");
     res.json({
        success:true,
        name: req.body.name
     })
})

//Creating API for getting all products
app.get('/allproducts',async (req, res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})



// Schema Creating for user Model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
// mddeol for subscription

const Subscribe = mongoose.model('Subscribe',{
   
    email:{
        type:String,
        unique:true,
    }
});

// Creating Endpoint for registering the user
app.get('/subscribe', async(req, res) =>{

   let subscribe = await Subscribe.find()

   res.status(200).send(subscribe);
})

app.post('/subscribe', async(req, res) =>{

    let check = await Subscribe.findOne({email: req.body.email})

    if(check){
        res.status(400).send("email already exists")
    }else{
      
        await Subscribe.create({email:req.body.email})

        res.status(200).send("subscribe succesfully")
    }
})

app.post('/signup',async (req, res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check) {
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
   for(let i = 0; i < 300; i++) {
    cart[i]=0;
   }

    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
      await user.save();
    

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})


})

//Creating endpoint for user login

app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong password"})
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email id"})
    }
})

// Creating endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
   let products = await Product.find({});
   let newcollection = products.slice(1).slice(-8);
   console.log("NewCollection Fetched");
   res.send(newcollection);
})

//Creating endpoint for popular in women section
app.get('/popularinwomen', async (req, res)=>{
  let products = await Product.find({category:"women"})
  let popular_in_women = products.slice(0,4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
})

//creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }
}

//Creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({id:req.body.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({id:req.body.id},{cartData:userData.cartData});
    res.send("Added")

})

//creating endpoint for removing products in cartData
app.post('/removefromcart', fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({id:req.body.id});
    if( userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({id:req.body.id},{cartData:userData.cartData});
    res.send("Removed")
})

// creating end point for increment in cartData
app.post('/increment', fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({id:req.body.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({id:req.body.id},{cartData:userData.cartData});
})

//Creating end point for decrement in cartData

app.post('/decrement', fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({id:req.body.id});
    if( userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({id:req.body.id},{cartData:userData.cartData});
    
})


// Creating end point for getting cartData

app.post('/getcart', fetchUser,async (req, res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port, (error)=>{
    if(!error) {
        console.log("Server running on port "+port)
    }
    else
    {
        console.log("Error : "+error)
    }
})
