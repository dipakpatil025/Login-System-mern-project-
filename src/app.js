require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require("hbs");
require("./db/conn")
const register = require("./models/registers");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../Templates/views");
const partials_path = path.join(__dirname, "../Templates/partials");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(static_path));


const port = process.env.PORT || 3000;
// app.use

app.set('view engine', 'hbs');
app.set("views", views_path);
hbs.registerPartials(partials_path);


console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
    // res.render("index");
    try {
        const pass = req.body.pass;
        const cpass = req.body.cpass;
        // console.log(`pass : ${pass}`);
        // console.log(`cpass : ${cpass}`);
        
        if (pass === cpass) {
            const Insert = new register({
                fisrtname: req.body.fname,
                lastname: req.body.lname,
                gender: req.body.gender,
                email: req.body.email,
                pass: req.body.pass,
                
                
            });
            
            // Token gerneration
            
            const token =  await  Insert.generateAuthtoken();
            const result  = await Insert.save();
            res.status(201).render('login');
        }
        else {
            res.status(201).render("register",{
                error_msg :"Invalid cradisials"
            });
            console.log("else : ");
        }
        // register
    } catch (error) {
        res.status(201).render("register",{
            error_msg :"Invalid cradisials"
        });
        console.log("error : " + error);
    }
});


app.get("/login",(req,res)=>{
    res.render('login');
});
app.post("/login",async(req,res)=>{
    try {
        const email = req.body.email; 
        const pass = req.body.pass; 
    // const passHas1 = await bcrypt.compare(pass,passHas);

    
    const useremail = await register.findOne({email:email});
    const isMatch = await bcrypt.compare(pass,useremail.pass)


    const token =  await  useremail.generateAuthtoken();
    console.log(token);
        // console.log(`email : ${useremail}`);
        if (isMatch ) {
            
            res.status(201).render("index");
        }
        else{
            res.status(201).render("login",{
                error_msg :"Invalid cradisials"
            });
            // res.status(201).send("Invalid cradisials");
        }

    } catch (error) {
        res.status(201).render("login",{
            error_msg :"Invalid cradisials"
        });
    }

    
});




// Bcrypt demo testing

// const securePass = async(pass)=>{
//     try {
        
//         const passHas = await bcrypt.hash(pass,10);
//     } catch (error) {
        
//     }
//     // console.log(passHas);
//     // const passHas1 = await bcrypt.compare(pass,passHas);
//     // console.log(passHas1);
    
//     return passHas;

// }
// $2b$10$5eGRIKaNvUd4.hr4OEcWpev/rWSe6K5G4nucO/uN92ZYalJJ3DDGi

// $2b$10$7sZbMZGscLOGERlhAOPNfuRHZe5iMCsug2sp84Jmk8iKd2F/F0cbG
// const result1 = securePass("dipak@123");
// console.log(result1);





// JWT tesing
// const createTocken = async()=>{
//     const tocken =  await jwt.sign({_id:"$2b$10$bW9TjiCuPGWQyXSIpsIyQud5MsDhAiLImTZZLAfdcqk9858Plba82"},"mynameisdipakhukumchandpatiliamfromkhardi",{
//         expiresIn:"2 seconds"
//     })
//     console.log(tocken);

//     const userverify = await jwt.verify(tocken,"mynameisdipakhukumchandpatiliamfromkhardi");
//     console.log(userverify);
// }
// createTocken();


app.listen(port, () => {
    console.log(`Running at ${port}`);
});