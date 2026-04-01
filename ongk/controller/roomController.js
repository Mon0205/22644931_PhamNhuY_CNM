const crypto = require("crypto");
const model = require("../model/roomModel");
const {s3} = require("../config/aws");
const {log} = require("console");

// exports.index = async(req, res)=>{
//     const rooms  = await model.getAll();
//     res.render("index", {rooms});
// }

exports.index = async(req, res)=>{
    const keyword = req.query.keyword;
    console.log("kw", keyword);
    
    let rooms;
    if(keyword){
        rooms= await model.search(keyword);
    }else{
        rooms = await model.getAll();
    }
    res.render("index", {rooms, keyword});
};

exports.delete = async(req,res)=>{
    const roomId = req.params.roomId;
    const room = await model.getByroomId(roomId);
    if(room && room.imgUrl){
        try{
            const key = room.imgUrl.split("/").pop();
            await s3.deleteObject({
                Bucket: process.env.BUCKET,
                Key: key
            }).promise();
            console.log("delete img", key);
            
        }catch(err){
            console.log("s3 delete err:", err);
            
        }
       
    }
     await model.delete(roomId);
        res.redirect("/");
}

exports.createForm = (req, res)=>{
    res.render("add");
}

exports.create = async(req, res)=>{
    const{
        roomName,
        roomType, 
        capacity, 
        status, 
        price, 
    } = req.body;

    if(roomName==null) throw "Invalid name"
    if(price<=0) throw "invalid price"
    if(capacity<0 && capacity > 10) throw "invalid capacity"
    const validStatus = ["Available", "Book"]
    if(!validStatus.includes(status)) throw "invalid status"
    const imgUrl = req.file?req.file.location:"";
    await model.create({
        roomId: crypto.randomUUID(),
        roomName,
        roomType,
        capacity: Number(capacity),
        status,
        imgUrl,
        price: Number(price),
        createAt: new Date().toISOString(),
    })
    res.redirect("/")
}

exports.detail = async(req,res)=>{
    const room = await model.getByroomId(req.params.roomId)
    res.render("detail",{room})
}