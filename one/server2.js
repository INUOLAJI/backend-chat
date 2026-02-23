const express = require("express");

const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", async(req, res)=>{
    try{
    const {Username, Email} = req.body;

    const sql = "INSERT INTO `signup`(`Username`, `Email`) VALUES (?, ?)"
    const result = await db.query(sql, [Username, Email])
    res.json({success:true, id:result.insertId});
    }catch(err){
        res.status(500).json({error:err.signup})
    }
})

app.get("/", async (req, res)=>{
    try{
        const [rows] = await db.query("SELECT * FROM `signup` WHERE 1")
        res.json(rows)
    }catch(err){
        res.status(500).json({error:err.signup})

    }
})

// The backend MUST have this specific route
app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { email } = req.body; // This must match the key sent from Axios

    try {
        // 1. Use backticks for the query
        // 2. Use '?' placeholders to prevent SQL injection
        // 3. Use the variable 'id' in the WHERE clause, not 'WHERE 1' (which updates everyone!)
        const [result] = await db.query("UPDATE `signup` SET `Email` = ? WHERE `id` = ?", [email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Update successful", id: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Add this to your server.js / index.js
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id; // Get the ID from the URL (e.g., /users/9)

    try {
        // Execute the delete query
        const [result] = await db.query("DELETE FROM `signup` WHERE `id` = ?", [id]);

        // Check if a row was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }

        // Success response
        res.json({ message: "User deleted successfully", deletedId: id });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Database error occurred while deleting" });
    }
});



app.listen(5000, ()=>{
    console.log("listening on port http://localhost:5000")
})