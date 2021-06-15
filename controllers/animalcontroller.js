const express = require("express");
const router = express.Router();
const { Animal } = require("../models");

router.post("/create", async(req, res) => {

    let { name, legNumber, predator } = req.body.animal;
    try {
        const newAnimal = await Animal.create({
            name,
            legNumber,
            predator,
        });
        res.status(201).json({
            animal: newAnimal,
            message: "Animal has been created"
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to create animal"
        });
    }
});

router.get("/", async(req, res) => {
    try {
        const animals = await Animal.findAll();
        res.status(200).json(animals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/delete/:id", async(req, res) => {
    const animalId = req.params.id;

    try {
        const query = {
            where: {
                id: animalId
            }
        };
        await Animal.destroy(query);
        res.status(200).json({ message: "Animal has been removed " });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put("/update/:id", async(req, res) => {
    const { name, legNumber, predator } = req.body.animal;
    const animalId = req.params.id;

    const query = {
        where: {
            id: animalId
        }
    };
    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
    };

    try {
        const update = await Animal.update(updatedAnimal, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;