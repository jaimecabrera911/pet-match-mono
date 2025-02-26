import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { users, insertUserSchema, type SelectUser } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface User extends SelectUser { }
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || "mascota-adoption-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      secure: true,
    };
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'correo',
        passwordField: 'password',
      },
      async (correo, password, done) => {
        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.correo, correo))
            .limit(1);

          if (!user) {
            return done(null, false, { message: "Usuario incorrecto." });
          }

          if (password !== user.password) {
            return done(null, false, { message: "Contraseña incorrecta." });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({
            error: "Datos inválidos",
            details: result.error.issues.map((i) => i.message)
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

      // Add default values for required fields if not provided
      const userData = {
        ...result.data,
        genero: result.data.genero || "M",
        fechaNacimiento: result.data.fechaNacimiento || new Date(),
        rolNombre: result.data.rolNombre || "adoptante"
      };

      const userToInsert = {
        ...userData,
        id: undefined, // Ensure id is not included as it's auto-generated
        fechaNacimiento: new Date(userData.fechaNacimiento), // Ensure proper Date type
      };

      const [newUser] = await db
        .insert(users)
        .values({
          ...userToInsert,
          id: undefined
        } as typeof users.$inferInsert)
        .returning();

      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json({
          message: "Registro exitoso",
          user: {
            id: newUser.id,
            correo: newUser.correo,
            nombres: newUser.nombres,
            apellidos: newUser.apellidos
          },
        });
      });
    } catch (error) {
      console.error("Error en registro:", error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate(
      "local",
      (err: any, user: Express.User | false, info: IVerifyOptions) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res
            .status(400)
            .json({ error: info.message ?? "Error al iniciar sesión" });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.json({
            message: "Inicio de sesión exitoso",
            user: {
              id: user.id,
              correo: user.correo,
              nombres: user.nombres,
              apellidos: user.apellidos
            },
          });
        });
      },
    )(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).json({ error: "No ha iniciado sesión" });
  });
}