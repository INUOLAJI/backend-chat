const express = require("express")
const db = require("../lib/db")
const router = express.Router();


router.post("/", async(req, res)=>{
    try{
        const {user_id, name, message} = req.body

        const {error:msgError} = await db.from("six_message")
        .insert({
            user_id,
            name,
            message
        })

        if(msgError) return res.status(400).json({error:msgError.message});
        res.json({message:"Message sent"});

    }catch(error){return res.status(500).json({error:error.message})}
})

router.get("/", async(req, res)=>{
    try{
        const {data, error:msgError} = await db.from("six_message")
        .select("*")
        .order("created_at", {ascending:true});


        res.json(data)
    //    console.log(res.json(data))
    }catch(error){return res.status(500).json({error:error.message})}
});


router.put("/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        const {newMessage} = req.body;
       const {data, error} = await db.from("six_message")
        .update({message:newMessage})
        .eq("id", id)

        if(error) return res.status(400).json({error:error.message});

        res.json({message:"Message updated successfully"});

    }catch(error){return res.status(500).json({error:error.message})}
});

router.post("/reply/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        const {user_id, name, reply_old_msg, replyMessage} = req.body;
       const {data, error} = await db.from("six_message")
        .insert({
            user_id,
            name,
            reply_msg_id:id,
            reply_old_msg,
            message:replyMessage
        });

        if(error) return res.status(400).json({error:error.message});

        res.json({message:"Message sent"});

    }catch(error){return res.status(500).json({error:error.message})}
});


router.delete("/:id", async(req, res)=>{
    try{
        const {id} = req.params;
       const {data, error} = await db.from("six_message")
        .delete()
        .eq("id", id)

        if(error) return res.status(400).json({error:error.message});

        res.json({message:"Message deleted successfully"});

    }catch(error){return res.status(500).json({error:error.message})}
})


module.exports = router;