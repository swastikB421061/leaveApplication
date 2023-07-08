const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/studentsdb",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})

const Eschema = new mongoose.Schema({
        id: String,
        password: String,
        name: String,
        roomno: String,
        period: String,
        address: String,
        phone: String,
        permission:String
    
})

const teacher=new mongoose.model("Student",Eschema);
module.exports=teacher;