const express = require("express")
const router = express.Router();
const db = require("../lib/db");



router.post("/signup", async(req, res)=>{
    try{
        const {name, email, password} = req.body;

        const {data, error:authError} = await db.auth.signUp({
            email, 
            password
        })

        if(authError) return res.status(400).json({error:authError.message})


        const {error:tableError} = await db.from("six_chat")
        .insert({
            id:data.user.id,
            name,
            email
        });

         if(tableError) return res.status(400).json({error:tableError.message});
        
        res.status(201).json({message:"Account created successfully, please check your email for confirmation!"});



    }catch(error){return res.status(500).json({error:error.message})}
});


router.post("/login", async(req, res)=>{
   try{
     const {email, password} = req.body;

     const {data:authData, error} = await db.auth.signInWithPassword({
        email,
        password
     })

       if(error) {

        if(error.message == "Email not confirmed"){
         res.status(400).json({error:"Check your email for Confirmation"})
         return;
      }

        return res.status(400).json({error:error.message});
       }


       const {data:tableData} = await db.from("six_chat")
       .select("*")
       .eq("id", authData.user.id)
       .single()
      

      res.json({
        message:"Login Successful",
        user:{
            id:tableData.id,
            email:tableData.email,
            name:tableData.name
        },
        session:authData.session
      })

   }catch(error){return res.status(500).json({error:error.message})}
});

module.exports = router;
