// const express = require("express");
const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/create", async(req, res) => {

    let { username, password } = req.body.user;
    try {
        const user = await User.create({
            username,
            password: bcrypt.hashSync(password, 11),
        });

        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User has been created",
            user: user,
            sessionToken: token
        })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already exists"
            });
        } else {
            res.status(500).json({
                message: "Failed to create user"
            });
        }
    }
});

router.post("/login", async(req, res) => {
    let { username, password } = req.body.user;

    try {
        const userLogin = await User.findOne({
            where: {
                username: username,
            },
        });
        if (userLogin) {
            let passwordComparison = await bcrypt.compare(password, userLogin.password);
            if (passwordComparison) {
                let token = jwt.sign({ id: userLogin.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: userLogin,
                    message: "You have been logged in.",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect username or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect username or password"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in."
        });
    }
});

module.exports = router;