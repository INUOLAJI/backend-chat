const express = require("express");
const router = express.Router();
const db = require("../lib/db");

// 1. Fixed the empty route - always send a response
router.get("/users", (req, res) => {
    res.json({ message: "User route active" });
});

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const { data, error: authError } = await db.auth.signUp({
            email,
            password
        });

        if (authError) return res.status(400).json({ error: authError.message });

        // Ensure data.user exists before inserting into your custom table
        if (data?.user) {
            const { error: tableError } = await db.from("six_chat")
                .insert({
                    id: data.user.id,
                    name,
                    email
                });

            if (tableError) return res.status(400).json({ error: tableError.message });
        }

        res.status(201).json({ message: "Account created successfully, please check your email for confirmation!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: authData, error } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            if (error.message === "Email not confirmed") {
                return res.status(400).json({ error: "Check your email for Confirmation" });
            }
            return res.status(400).json({ error: error.message });
        }

        // Fetch user profile from custom table
        const { data: tableData, error: tableError } = await db.from("six_chat")
            .select("*")
            .eq("id", authData.user.id)
            .single();

        // 2. Safety check: Ensure tableData exists before accessing properties
        if (tableError || !tableData) {
            return res.status(404).json({ error: "User profile not found in database." });
        }

        res.json({
            message: "Login Successful",
            user: {
                id: tableData.id,
                email: tableData.email,
                name: tableData.name
            },
            session: authData.session
        });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
