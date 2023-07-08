const express = require("express");
const app = express();
const path=require("path");
const session=require('express-session');
const student = require("./connect");
require("./connect");

const port=3000;


app.use(session({
    secret: 'Swastik',
    // path:'/saved',
    resave: false,
    saveUninitialized: true
  }));

app.use(express.urlencoded({extended:true}));
const staticPath=path.join(__dirname,"../public");
app.use(express.static(staticPath));

app.set("view engine","ejs");


app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/check",(req,res)=>{
    res.render("check");
})

app.post("/choose",async(req,res)=>{
      try {
        const id = req.body.username;
        const password = req.body.password;
        const check = await student.findOne({id:id});
        console.log(check);

        if(check.password===password){
            req.session.st = check;
            res.redirect("/check");
        }
        else{
            res.send("invalid pass");
        }
    } 
    catch (error) {
        res.status(400).send("invalid");
    }
})


app.post('/fill', (req, res) => {
    const selectedoption = req.body.selector;
    console.log(selectedoption);
    if (selectedoption === 'f-option') {
      res.render("apply");
    } else {
      const st = req.session.st;
      console.log(st);
      if(st.permission=='accept')
      res.render("accept",{st});
      else if(st.permission=="reject") res.render("reject",{st});
      else if(st.permission=="waiting") res.render("wait",{st})
    }
  });


  app.post('/saved', (req, res) => {
    const st = req.session.st;
    const username = st.name;
    const userid = st.id;
    const phone = req.body.phone;
    const roomno = req.body.roomno;
    const period = req.body.period;
    const address = req.body.address;
    console.log(st);

      student.findOneAndUpdate(
        { id: userid },
        {
          $set: {
            name: username,
            roomno: roomno,
            period: period,
            address: address,
            phone: phone,
            permission:"waiting"
          }
        },
        { upsert: false }
      )
        .then(savedStudent => {
          console.log('User saved:', savedStudent.name);
          res.sendStatus(200);
        })
        .catch(error => {
          console.log('Error saving user:', error);
          res.sendStatus(500);
        });
  });
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})