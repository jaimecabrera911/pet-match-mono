import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { pets, users, adoptions, type InsertPet, type InsertUser, type InsertAdoption, insertUserSchema, questionaries, selectUserSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import express from 'express';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

export function registerRoutes(app: Express): Server {
  // Rutas de autenticación básica
  app.post("/api/login", async (req, res) => {
    try {
      const { correo, password } = req.body;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.correo, correo))
        .limit(1);

      if (!user) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      if (password !== user.password) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      res.json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user.id,
          correo: user.correo,
          nombres: user.nombres,
          apellidos: user.apellidos,
          role: user.rolNombre.toLowerCase() // Convertimos ADMIN/USER a admin/user
        }
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  // Ruta para obtener el usuario actual
  app.get("/api/user", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: user.id,
      correo: user.correo,
      nombres: user.nombres,
      apellidos: user.apellidos,
      role: user.rolNombre.toLowerCase() // Convertimos ADMIN/USER a admin/user
    });
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      // Create a copy of req.body to modify
      const updateData = { ...req.body };
      updateData.fechaNacimiento = new Date(updateData.fechaNacimiento);

      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, parseInt(req.params.id)))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning();

      if (!deletedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      console.log("Datos recibidos:", req.body);

      const userData = {
        ...req.body,
        rolNombre: "adoptante"
      };

      const result = insertUserSchema.safeParse(userData);
      if (!result.success) {
        console.log("Error de validación:", result.error.errors);
        return res.status(400).json({
          error: "Datos de usuario inválidos",
          details: result.error.errors
        });
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.correo, result.data.correo))
        .limit(1);

      if (existingUser) {
        return res.status(400).json({ error: "El correo electrónico ya está registrado" });
      }

      const { id, ...insertData } = result.data;
      const [newUser] = await db
        .insert(users)
        .values({ ...insertData })
        .returning();

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: {
          id: newUser.id,
          correo: newUser.correo,
          nombres: newUser.nombres,
          apellidos: newUser.apellidos,
          role: newUser.rolNombre.toLowerCase()
        }
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await db.select().from(users).where(eq(users.id, Number(id))).limit(1);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Extraer y formatear fechaNacimiento
      const { fechaNacimiento, ...restBody } = req.body;
      const formattedDate = fechaNacimiento ? new Date(fechaNacimiento) : null;

      const updatedUser = await db.update(users).set({
        ...restBody,
        fechaNacimiento: formattedDate,
        password: user[0].password
      }).where(eq(users.id, Number(id))).returning();

      res.json(updatedUser);
    } catch (error) {
      console.error("Error en actualizar usuario:", error);
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  });
  // Ruta para obtener usuarios
  app.get("/api/users", async (_req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  });

  // Rutas existentes
  app.get("/api/pets", async (_req, res) => {
    try {
      const allPets = await db.select().from(pets);
      res.json(allPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ error: "Error al obtener las mascotas" });
    }
  });

  app.get("/api/adoptions/user", async (req, res) => {
    try {
      const userHeader = req.headers.user;
      if (!userHeader || typeof userHeader !== 'string') {
        return res.status(400).json({ error: "User header is required" });
      }
      const user = JSON.parse(userHeader);

      const userAdoptions = await db
        .select({
          id: adoptions.id,
          status: adoptions.status,
          applicationDate: adoptions.applicationDate,
          notes: adoptions.notes,
          pet: {
            id: pets.id,
            name: pets.name,
            breed: pets.breed,
            imageUrl: pets.imageUrl
          },
          user: {
            id: users.id,
            nombres: users.nombres,
            apellidos: users.apellidos,
            correo: users.correo
          },
        })
        .from(adoptions)
        .where(eq(adoptions.userId, user.id))
        .innerJoin(pets, eq(pets.id, adoptions.petId))
        .innerJoin(users, eq(users.id, adoptions.userId));

      res.json(userAdoptions);
    } catch (error) {
      console.error("Error fetching user adoptions:", error);
      res.status(500).json({ error: "Error al obtener las adopciones del usuario" });
    }
  });

  // Rutas para adopciones
  app.get("/api/adoptions", async (_req, res) => {
    try {
      const allAdoptions = await db
        .select({
          id: adoptions.id,
          status: adoptions.status,
          applicationDate: adoptions.applicationDate,
          notes: adoptions.notes,
          pet: {
            id: pets.id,
            name: pets.name,
            breed: pets.breed,
            imageUrl: pets.imageUrl
          },
          user: {
            id: users.id,
            nombres: users.nombres,
            apellidos: users.apellidos,
            correo: users.correo
          },
        })
        .from(adoptions)
        .innerJoin(pets, eq(pets.id, adoptions.petId))
        .innerJoin(users, eq(users.id, adoptions.userId));
      res.json(allAdoptions);
    } catch (error) {
      console.error("Error fetching adoptions:", error);
      res.status(500).json({ error: "Error al obtener las adopciones" });
    }
  });

  app.post("/api/adoptions", async (req, res) => {
    try {
      const [newAdoption] = await db
        .insert(adoptions)
        .values(req.body as InsertAdoption)
        .returning();
      res.json(newAdoption);
    } catch (error) {
      console.error("Error creating adoption:", error);
      res.status(500).json({ error: "Error al crear la solicitud de adopción" });
    }
  });

  app.get("/api/adoptions/:id", async (req, res) => {
    try {
      const adoptionId = parseInt(req.params.id);

      const [adoption] = await db
        .select({
          id: adoptions.id,
          status: adoptions.status,
          applicationDate: adoptions.applicationDate,
          notes: adoptions.notes,
          pet: {
            id: pets.id,
            name: pets.name,
            breed: pets.breed,
            imageUrl: pets.imageUrl
          },
          user: {
            id: users.id,
            nombres: users.nombres,
            apellidos: users.apellidos,
            correo: users.correo
          },
        })
        .from(adoptions)
        .where(eq(adoptions.id, adoptionId))
        .innerJoin(pets, eq(pets.id, adoptions.petId))
        .innerJoin(users, eq(users.id, adoptions.userId))
        .limit(1);

      if (!adoption) {
        return res.status(404).json({ error: "Adopción no encontrada" });
      }

      res.json(adoption);
    } catch (error) {
      console.error("Error fetching adoption:", error);
      res.status(500).json({ error: "Error al obtener la adopción" });
    }
  });

  app.put("/api/adoptions/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [updatedAdoption] = await db
        .update(adoptions)
        .set(req.body)
        .where(eq(adoptions.id, parseInt(id)))
        .returning();

      if (!updatedAdoption) {
        return res.status(404).json({ error: "Solicitud de adopción no encontrada" });
      }

      // Si la adopción fue aprobada, actualizar el estado de la mascota
      if (req.body.status === "approved") {
        await db
          .update(pets)
          .set({ isAdopted: true })
          .where(eq(pets.id, updatedAdoption.petId));
      }

      res.json(updatedAdoption);
    } catch (error) {
      console.error("Error updating adoption:", error);
      res.status(500).json({ error: "Error al actualizar la solicitud de adopción" });
    }
  });

  app.post("/api/pets", upload.single('image'), async (req, res) => {
    try {
      const petData = {
        name: req.body.name,
        age: req.body.age,
        breed: req.body.breed,
        location: req.body.location,
        gender: req.body.gender,
        size: req.body.size || "mediano",
        requirements: JSON.parse(req.body.requirements),
        healthStatus: JSON.parse(req.body.healthStatus),
        personality: JSON.parse(req.body.personality),
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        isAdopted: false
      };

      const [newPet] = await db
        .insert(pets)
        .values({
          ...petData,
          imageUrl: petData.imageUrl ?? '' // Provide empty string as fallback instead of null
        })
        .returning();

      res.json(newPet);
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ error: "Error al crear la mascota" });
    }
  });

  // Add PUT endpoint for updating pets
  app.put("/api/pets/:id", upload.single('image'), async (req, res) => {
    try {
      const petId = parseInt(req.params.id);

      // Verificar si la mascota existe
      const [existingPet] = await db
        .select()
        .from(pets)
        .where(eq(pets.id, petId))
        .limit(1);

      if (!existingPet) {
        return res.status(404).json({ error: "Mascota no encontrada" });
      }

      const updateData = {
        name: req.body.name,
        age: req.body.age,
        breed: req.body.breed,
        location: req.body.location,
        gender: req.body.gender,
        size: req.body.size || existingPet.size,
        requirements: JSON.parse(req.body.requirements),
        healthStatus: JSON.parse(req.body.healthStatus),
        personality: JSON.parse(req.body.personality),
        // Mantener la imagen existente si no se proporciona una nueva
        imageUrl: req.file ? `/uploads/${req.file.filename}` : existingPet.imageUrl
      };

      const [updatedPet] = await db
        .update(pets)
        .set(updateData)
        .where(eq(pets.id, petId))
        .returning();

      res.json(updatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
      if (error instanceof SyntaxError) {
        return res.status(400).json({ error: "Error en el formato de los datos" });
      }
      res.status(500).json({ error: "Error al actualizar la mascota" });
    }
  });

  // Add DELETE endpoint for removing pets
  app.delete("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const [deletedPet] = await db
        .delete(pets)
        .where(eq(pets.id, petId))
        .returning();

      if (!deletedPet) {
        return res.status(404).json({ error: "Mascota no encontrada" });
      }

      res.json({ message: "Mascota eliminada correctamente" });
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(500).json({ error: "Error al eliminar la mascota" });
    }
  });

  // Serve static files from the uploads directory
  app.use('/uploads', express.static('uploads'));


  app.post("/api/questionaries", async (req, res) => {
    const userHeader = req.headers.user;
    if (!userHeader || typeof userHeader !== 'string') {
      return res.status(400).json({ error: "User header is required" });
    }

    const user = JSON.parse(userHeader);
    // const questionary = await db.select().from(questionaries).where(eq(questionaries.userId, user?.id)).limit(1);

    // if (questionary.length > 0) {
    //   return res.status(400).json({ error: "Ya existe una encuesta para este usuario" });
    // }
    try {
      const points = calculatePoints(req.body);
    
      const status= points >= 50 ? "approved" : "rejected";
      const questionaryData = {
        ...req.body,
        status,
        points,
        userId: user?.id
      };

      const userModel = await db.select().from(users).where(eq(users.id, user?.id)).limit(1);
      if (!userModel) {
        return res.status(400).json({ error: "Usuario no encontrado" });
      }

      const [newQuestionary] = await db
        .insert(questionaries)
        .values({
          ...questionaryData,
          userId: userModel[0].id
        })
        .returning();

      res.json(newQuestionary);
    } catch (error) {
      console.error("Error creating questionary:", error);
      res.status(500).json({ error: "Error al crear la cuestionario" });
    }
  });

  app.get("/api/questionaries", async (req, res) => {
    const userHeader = req.headers.user;
    if (!userHeader || typeof userHeader !== 'string') {
      return res.status(400).json({ error: "User header is required" });
    }
    const user = JSON.parse(userHeader);
    const questionary = await db.select().from(questionaries).where(eq(questionaries.userId, user?.id));
    res.json(questionary);
  });


  function calculatePoints(answers: Record<string, string>): number {
    // Primero verificamos las respuestas críticas que resultan en cero automático
    const zeroPointAnswers = {
      atencionVeterinaria: "Esperar a ver si mejora por sí solo",
      reaccionDanos: "Ignoraría el comportamiento, esperando que pase",
      compromisoLargoPlazo: "No",
      problemasComportamiento: "Devolverlo al refugio",
      adaptacionNuevaVivienda: "No haría nada específico, esperando que se adapte solo",
      cuidadoExtraTiempo: "Dejaría suficiente comida y agua, esperando que se maneje solo"
    };

    // Verificar si hay alguna respuesta crítica que resulte en cero
    for (const [field, zeroAnswer] of Object.entries(zeroPointAnswers)) {
      if (answers[field] === zeroAnswer) {
        return 0; // Retorna 0 inmediatamente si encuentra una respuesta crítica
      }
    }

    // Si no hay respuestas críticas, proceder con el cálculo normal
    const answerPoints = {
      experienciaMascotas: {
        "Si, he tenido perros antes": 20,
        "Si, pero no he tenido perros": 15,
        "No, nunca he tenido mascotas": 5
      },
      tipoVivienda: {
        "Casa con jardín grande": 20,
        "Casa con jardín pequeño": 15,
        "Apartamento grande": 10,
        "Apartamento pequeño": 5
      },
      cuidadoExtraTiempo: {
        "Contrataría un cuidador de mascotas o dejaría a mi perro en una guardería": 20,
        "Pediría a un amigo o familiar que lo cuide": 15
      },
      otrasMascotas: {
        "Sí, otro perro": 20,
        "Sí, un gato": 15,
        "Sí, otras mascotas": 10,
        "No, no tengo otras mascotas": 5
      },
      adaptacionNuevaVivienda: {
        "Llevarlo gradualmente para que se familiarice con el lugar": 20,
        "Proporcionarle sus juguetes y objetos familiares": 15
      },
      problemasComportamiento: {
        "Consultar a un adiestrador profesional": 20,
        "Intentar entrenarlo por mi cuenta": 10
      },
      presupuestoMensual: {
        "Más de $350.000": 20,
        "Entre $250.000 y $350.000": 15,
        "Menos de $250.000": 5
      },
      compromisoLargoPlazo: {
        "Sí, estoy comprometido": 20,
        "No estoy seguro": 5
      },
      atencionVeterinaria: {
        "Llevarlo al veterinario de inmediato, sin importar el costo": 20,
        "Consultar opciones económicas antes de tomar una decisión": 10
      },
      reaccionDanos: {
        "Buscaría un adiestrador para corregir el comportamiento": 20,
        "Intentaría entrenarlo por mi cuenta y proporcionarle juguetes adecuados": 15
      }
    };

    let totalPoints = 0;
    let maxPossiblePoints = 0;

    Object.entries(answers).forEach(([field, answer]) => {
      const categoryPoints = answerPoints[field as keyof typeof answerPoints];
      if (categoryPoints && typeof answer === 'string') {
        totalPoints += (categoryPoints as Record<string, number>)[answer] || 0;
        maxPossiblePoints += 20;
      }
    });

    // Convertir a porcentaje
    return Math.round((totalPoints / maxPossiblePoints) * 100);
  }

  const httpServer = createServer(app);
  return httpServer;
}