const express = require("express");
const mongoose = require("mongoose");
const postModel = require("./Models/postSchema");
const userModel = require("./Models/UserSchema");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URI =
  "mongodb+srv://TalhaAsif:qWCP9tOlTA9W6pFO@learing.vxv2gkc.mongodb.net/postingapp";

mongoose
  .connect(BASE_URI)
  .then((res) => console.log("Mongo DB Connected"))
  .catch((err) => console.log("not connected"));

app.use(cors());
app.use(express.json());

app.get("/api/posts", (req, res) => {
  userModel.find((err, data) => {
    if (err) {
      res.json({
        massege: `Something went Wrong`,
      });
    } else {
      res.json({
        massege: "Post founded",
        data,
      });
    }
  });
});

// app.put("/api/postdatail/update", (req, res) => {
//   const { id, isActive } = req.body;
//   console.log(id);
//   userModel.findByIdAndUpdate(id, { isActive }, { new: true }, (err, data) => {
//     if (err) {
//       res.json({
//         message: "Something went wrong",
//       });
//     } else {
//       res.json({
//         message: "User updated",
//         data: data,
//       });
//     }
//   });
// });

// app.delete("/api/postdetail/delete", (req, res) => {
//   const { id } = req.body;
//   userModel.findByIdAndDelete(id, (err, data) => {
//     if (err) {
//       res.json({
//         message: "User deleted",
//       });
//     }else({
//         message:"User deleted",
//         data:data
//     })
//   });
// });

app.post("/api/posts", (req, res) => {
  postModel.create(req.body, (err, data) => {
    if (err) {
      res.send("error", err);
    } else {
      res.json({
        message: "The Post is succesfully created",
        data,
      });
    }
  });
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);

  if ((!name, !email, !password, !phoneNumber)) {
    res.json({
      message: "requied field are empty",
    });
    return;
  }

  const dataTosend = {
    name,
    email,
    password: hashpassword,
    phone_number: phoneNumber,
  };

  userModel.findOne({ email }, (err, data) => {
    if (err) {
      res.json({
        message: "Something went wrong",
      });
    } else {
      if (data) {
        res.json({
          message: "Email is already exist",
        });
      } else {
        userModel.create(dataTosend, (err, data) => {
          if (err) {
            res.json({
              message: "Something went Wrong",
            });
          } else {
            res.json({
              message: "user Successfully signup",
              data: data,
              status: true,
            });
          }
        });
      }
    }
  });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  if (!email || !password){
    res.json({
      message:'fill the required field'
    })
    return;
  }
  
  userModel.findOne({email}, async (err, user)=>{
    if(err){
      res.json({
        message:'Something went Wrong',   
      })
    }else{
      if(user){
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        console.log(isPasswordMatch);
        if(isPasswordMatch){
          res.json({
            message: "Successfully login"
          })
        }else{
          message: "credential error"
        }

        
      }
    }
  });
  
  
});

app.get("/api/users", (req, res) => {
  userModel.find((err, data) => {
    if (err) {
      res.json({
        message: "Something Went Wrong",
      });
    } else {
      res.json({
        message: "User founded",
        data,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`This server is running on http://localhost:${PORT} `);
});
