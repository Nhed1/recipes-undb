import { PrismaClient } from "@prisma/client";
import express from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const app = express();

const prisma = new PrismaClient();

app.use("/uploads", express.static("uploads"));

app.get("/recipes", async (req, res) => {
  const { diabetesLevel } = req.query;

  try {
    let recipes;

    if (diabetesLevel) {
      recipes = await prisma.recipe.findMany({
        where: {
          diabetesLevel: Number(diabetesLevel),
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

app.post("/recipes", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const { diabetesLevel, name, ingredients, description } = req.body;

  const diabeteLevelNumber = Number(diabetesLevel);
  try {
    const image = req.file;

    const recipe = await prisma.recipe.create({
      data: {
        diabetesLevel: diabeteLevelNumber,
        name,
        ingredients,
        description,
        image: Buffer.from(image.buffer),
      },
    });

    res.json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).send("An error occurred while creating the recipe.");
  }
});
