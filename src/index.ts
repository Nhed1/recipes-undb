import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();

const prisma = new PrismaClient();

app.get("/recipes", async (req, res) => {
  const { diabeteLevel } = req.query;

  try {
    let recipes;

    if (diabeteLevel) {
      recipes = await prisma.recipe.findMany({
        where: {
          diabeteLevel: diabeteLevel,
        },
      });
    } else {
      recipes = await prisma.recipe.findMany();
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).send("An error occurred while retrieving recipes.");
  }
});

app.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
    });

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).send("An error occurred while retrieving the recipe.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
