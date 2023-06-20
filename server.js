const e = require("express");
const { urlencoded, query } = require("express");
var express = require("express");
var nodemailer = require('nodemailer');
var fileuploader = require("express-fileupload");
var app = express();

var mysql = require("mysql");
var path = require("path");
const { report } = require("process");

app.listen(2004, function () {
    console.log("server started");
})
app.use(express.static("public"));


var dbConfiguration = {
    host: "localhost",
    user: "root",
    password: "",
    database: "2022_medonor"
}
var refDB = mysql.createConnection(dbConfiguration);
refDB.connect(function (errobj) {
    if (errobj)
        console.log("error");
    else
        console.log("Server connected");
})

//____________________
app.get("/sign", function (req, resp) {
    console.log("heyyyyyyyy");
    var dataAry = [req.query.email, req.query.pwd, req.query.utype, 1];
    refDB.query("insert into users values(?,?,?,?)", dataAry, function (err, result) {
        if (err) {
            //alert("error");
            console.log(err);
        }
        else
            console.log("inserted successfully");
        resp.send(result);
    })
})


app.get("/profile1-donor", function (req, resp) {
    var fullpath = process.cwd() + "/public/profile-donor.html";
    resp.sendFile(fullpath);
})

//login go to dashboardss---------------------
app.get("/login", function (req, resp) {
    var ary = [req.query.email, req.query.pwd];
    refDB.query("select * from users where email=? and pwd=? and status=1", ary, function (err, result) {
        if (err) {
            console.log(err);
            resp.send(err);
        }
        else
            resp.send(result);
    })
})

//=========update password donor dashboard settings--------------
app.get("/updatedonor", function (req, resp) {
    console.log("hello updater");
    var ary = [req.query.mail, req.query.oldpwd, req.query.newpwd];
    console.log(req.query);
    var arysmall = [req.query.newpwd, req.query.mail];
    refDB.query("select * from users where email=? and pwd=?", ary, function (err, result) {
        if (err) {
            console.log(err);
            resp.send(err);
        }
        else
            if (result.length == 1) {
                refDB.query("update users set pwd =? where email=? ", arysmall, function (err, result) {
                    if (err) {
                        resp.send(err);
                    }
                    else {

                        resp.send("Password Successfully updated!!");
                    }

                });

            }
            else
                resp.send("Invalid Old Password ");
    })



})
//====================donor profile search===============
app.get("/getProfileObject", function (req,resp)
{ 

    refDB.query("select * from dprofile where emailid=?",[req.query.Email], function (err, resultAryOfObjects) {
        if (err) {

            resp.send(err);
        }

        else
            resp.send(resultAryOfObjects);;
    })
})
app.use(fileuploader());
//=------------------=======donor profile uupdate======-------------
app.post("/profile-donor-update",function(req,resp)
{
   var pic1, pic2;
if(req.files!=null)
{
    if(req.files.idproof!= null)
    {
        pic1=req.files.idproof.name;
        var des=process.cwd()+"/public/uploads/"+pic1;
        req.files.idproof.mv(des,function(err)
        {
            if(err)
            console.log(err);
            else
            console.log("prrofpic done");
        })
    }
    else
    {
        pic1=req.body.hdn1;
    }
    if(req.files.profilepic !=null)
    {
        pic2=req.files.profilepic.name;
        var des=process.cwd()+"/public/uploads/"+pic2;
        req.files.profilepic.mv(des,function(err)
        {
            if(err)
            console.log(err);
            else
            console.log("profilepic done");
        })
    }
    else
    {
        pic2=req.body.hdn2;
    } 
  
}
else{
    pic1=req.body.hdn1;
    pic2=req.body.hdn2;
}
var ary=[req.body.named,req.body.numberd,req.body.addrd,req.body.city,req.body.idtype,req.body.time,pic1,pic2,req.body.emailid]; 
console.log(ary);
refDB.query("update dprofile set name=?,mobile=?,address=?,city=?,prooftype=?,timing=?,proofpic=?,profilepic=? where emailid=?",ary,function(err)
{
    if(err)
    resp.send(err);
    else
    resp.send("doneee donor ");
})
})

//----------------------------------------------------
app.get("/admingo", function (req, resp) {
    var fullpath = process.cwd() + "/public/admin-panel.html";
    resp.sendFile(fullpath);
})
//-------------------
app.get("/list-my-medicines", function (req, resp) {
    var fullpath = process.cwd() + "/public/donor-med-manager.html";
    resp.sendFile(fullpath);
})
//==============

app.post("/profiledonor",function(req,resp){
    console.log(req.files.profilepic.name);
    //console.log("heyyyyy");
    console.log(req.body);
    var fname;
    if (req.files != null) 
    {
        fname = req.files.profilepic.name;
        var des = process.cwd() + "/public/uploads/" + fname;
        req.files.profilepic.mv(des, function (err)
         {
            if (err)
                console.log(err);
            else
                console.log("congo profile pic");
        })
    }
    

    var fname2;
        if (req.files != null) 
        {
            fname2 = req.files.idproof.name;
            var des2 = process.cwd() + "/public/uploads/" + fname2;
            req.files.idproof.mv(des2, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("congo id pic");
            })
        }

        var ary = [req.body.emailid, req.body.named, req.body.numberd, req.body.addrd, req.body.city, req.body.idtype, req.body.time, req.files.idproof.name, req.files.profilepic.name];
        refDB.query("insert into dprofile values(?,?,?,?,?,?,?,?,?)", ary, function (err, result) {
            if (err)
                resp.send(err);
            else
                resp.send("Inserted Successfully");
        })
    })
//donorprofile ends==========================
// ===========recipient profile
app.post("/profilerecipient",function(req,resp){
    console.log(req.files.profilepic2.name);
    //console.log("heyyyyy");
    console.log(req.body);
    var fname;
    if (req.files != null) 
    {
        fname = req.files.profilepic2.name;
        var des = process.cwd() + "/public/uploads/" + fname;
        req.files.profilepic2.mv(des, function (err)
         {
            if (err)
                console.log(err);
            else
                console.log("congo profile pic");
        })
    }
    

    var fname2;
        if (req.files != null) 
        {
            fname2 = req.files.idproof2.name;
            var des2 = process.cwd() + "/public/uploads/" + fname2;
            req.files.idproof2.mv(des2, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("congo id pic");
            })
        }

        var ary = [req.body.emailid, req.body.named, req.body.numberd, req.body.addrd, req.body.recipientcity, req.body.idtype, req.files.idproof2.name, req.files.profilepic2.name];
        refDB.query("insert into rprofile values(?,?,?,?,?,?,?,?)", ary, function (err, result) {
            if (err)
                resp.send(err);
            else
                resp.send("Inserted Successfully");
        })
    })
    // ----------------------------recipient profile ends==========
    // ===search recipeint
    app.get("/getProfileObjectrecipient", function (req,resp)
{ 

    refDB.query("select * from rprofile where email=?",[req.query.Email], function (err, resultAryOfObjects) {
        if (err) {

            resp.send(err);
        }

        else
            resp.send(resultAryOfObjects);;
    })
})
// =======ends


    // ======update recipient ==========
    app.post("/profile-recipient-update",function(req,resp)
{
   var pic1, pic2;
if(req.files!=null)
{
    if(req.files.idproof2!= null)
    {
        pic1=req.files.idproof2.name;
        var des=process.cwd()+"/public/uploads/"+pic1;
        req.files.idproof2.mv(des,function(err)
        {
            if(err)
            console.log(err);
            else
            console.log("proofpic done");
        })
    }
    else
    {
        pic1=req.body.hdn1;
    }
    if(req.files.profilepic2 !=null)
    {
        pic2=req.files.profilepic2.name;
        var des=process.cwd()+"/public/uploads/"+pic2;
        req.files.profilepic2.mv(des,function(err)
        {
            if(err)
            console.log(err);
            else
            console.log("profilepic done");
        })
    }
    else
    {
        pic2=req.body.hdn2;
    } 
  
}
else{
    pic1=req.body.hdn1;
    pic2=req.body.hdn2;
}
var ary=[req.body.named,req.body.numberd,req.body.addrd,req.body.recipientcity,req.body.idtype,pic1,pic2,req.body.emailid]; 
console.log(ary);
refDB.query("update rprofile set name=?,mobile=?,address=?,city=?,prooftype=?,proofpic=?,profilepic=? where email=?",ary,function(err)
{
    if(err)
    resp.send(err);
    else
    resp.send("doneee needy ");
})
})

app.get("/medicine-formsubmit", function (req, resp) {
    var fullpath = process.cwd() + "/public/avail-medicine.html";
    resp.sendFile(fullpath);
})
//---------------medicine form insertion ----------------------------------
app.post("/medicineform", function (req, resp) {
    console.log(req.body.emailid);
    var picname;
    if (req.files != null) {
        picname = req.files.medpic.name;
        var destination = process.cwd() + "/public/uploads/" + picname;
        req.files.medpic.mv(destination, function (err) {
            if (err)
                console.log(err);
            else
                console.log("congo med pic");
        })
    }
    var arry = [req.body.emailid, req.body.named, req.body.med, req.body.qty, req.body.date, req.body.company,picname,req.body.description];
    refDB.query("insert into medicines values(?,?,?,?,?,?,?,?,current_date())", arry,function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send("Inserted Successfully");
    })
})
app.get("/block-userany11", function (req, resp) {
    var fullpath = process.cwd() + "/public/admin-block-users.html";
    resp.sendFile(fullpath);
})

app.get("/all-donors11", function (req, resp) {
    var fullpath = process.cwd() + "/public/admin-all-donors.html";
    resp.sendFile(fullpath);
})

app.get("/all-recipients11", function (req, resp) {
    var fullpath = process.cwd() + "/public/admin-all-recipients.html";
    resp.sendFile(fullpath);
})
app.get("/profile-recipient11", function (req, resp) {
    var fullpath = process.cwd() + "/public/profile-recipient.html";
    resp.sendFile(fullpath);
})
//============================


app.get("/fetchAllusers",function(req,resp)
{
    refDB.query("select * from users ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})
app.get("/block-user",function(req,resp)
{
    refDB.query("update users set status=0 where email=?",[req.query.id],function(err,ary)
    {
        if(err)
        resp.send(err);
        else
        if(ary.affectedRows==0)
        resp.send("invalid id");
        else
        resp.send("blocked");
    })
})
//=========================================
app.get("/resume-user",function(req,resp)
{
    refDB.query("update users set status=1 where email=?",[req.query.id],function(err,ary)
    {
        if(err)
        resp.send(err);
        else
        if(ary.affectedRows==0)
        resp.send("invalid id");
        else
        resp.send("Resumed");
    })
})


//=======================
app.get("/fetchAlldonors",function(req,resp)
{
    refDB.query("select * from dprofile",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})
//==============
app.get("/profile-delete-donor",function(req,res)
{                                //table col name
    refDB.query("delete from dprofile where emailid=?",[req.query.emailid],function(err,result){
            if(err)
                res.send(err);
            // else
            // if(result.affectedRows==0)
            // res.send("Invalid Id");
            else
                res.send("Record Deleted Successfully");
    })
})
//==============nodemailer------------------------


// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'baggarwal_be21@thapar.edu',
//     pass: 'yjucplkbubjhqjnk'
//   }
// });

// var mailOptions = 
// {
//   from: 'baggarwal_be21@thapar.edu',
//   to: 'baggarwal_be21@thapar.edu',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
//-----------------=========fetch cities==========----------------
app.get("/fetchcity",function(req,resp)
{
refDB.query("select distinct city from dprofile",function(err,result)
{
    console.log(result);
    if(err)
    {
        resp.send(err);
    }
    else
    resp.send(result);
})
})
//=====================================================

app.get("/fetchmed",function(req,res){
    refDB.query("select distinct medicine from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=?",[req.query.city],function(err,resultmed){
        console.log(resultmed);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmed);
            res.send(resultmed);
        }
    })
})

app.get("/recipient-medicine-search", function (req, resp) {
    var fullpath = process.cwd() + "/public/needy-med-search.html";
    resp.sendFile(fullpath);
})
app.get("/fetchdonor",function(req,res){
    refDB.query("select * from dprofile inner join medicines on medicines.emailid=dprofile.emailid where dprofile.city=? and medicines.medicine=?",[req.query.city,req.query.med],function(err,resultmed){
        console.log(resultmed);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmed);
            res.send(resultmed);
        }
    })
})
app.get("/fetchmedlistall",function(req,resp)
{
refDB.query("select * from medicines where emailid=?",[req.query.email],function(err,result)
{
    if(err)
    resp.send(err);
   
else
    resp.send(result);
})
})
//=------------------------------------================
app.get("/medicine-delete",function(req,res)
{                                //table col name
    refDB.query("delete from medicines where emailid=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted !");
    })
})