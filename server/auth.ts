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
    interface User extends SelectUser {}
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || "mascota-adoption-secret",
    resave: false,
    saveUninitialized: false,
    name: 'sid', // Nombre específico para la cookie de sesión
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax' // Importante para las redirecciones
    },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      ...sessionSettings.cookie,
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
          console.log("Attempting login for:", correo);
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.correo, correo))
            .limit(1);

          if (!user) {
            console.log("User not found:", correo);
            return done(null, false, { message: "Usuario no encontrado." });
          }

          if (password !== user.password) {
            console.log("Invalid password for user:", correo);
            return done(null, false, { message: "Contraseña incorrecta." });
          }

          console.log("Login successful for:", correo);
          return done(null, user);
        } catch (err) {
          console.error("Login error:", err);
          return done(err);
        }
      }
    ),
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log("Deserializing user:", id);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        console.log("User not found during deserialization:", id);
        return done(null, false);
      }

      done(null, user);
    } catch (err) {
      console.error("Deserialize error:", err);
      done(err);
    }
  });

  // Custom middleware to log session and auth state
  app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Is Authenticated:', req.isAuthenticated());
    if (req.user) {
      console.log('Current User:', req.user.id);
    }
    next();
  });

  // Authentication routes
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: IVerifyOptions) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (!user) {
        return res.status(401).json({ error: info.message || "Credenciales inválidas" });
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "Error al iniciar sesión" });
        }

        return res.json({
          user: {
            id: user.id,
            correo: user.correo,
            nombres: user.nombres,
            apellidos: user.apellidos,
            role: user.rolNombre.toLowerCase()
          }
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    const wasAuthenticated = req.isAuthenticated();
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ error: "Error al destruir la sesión" });
        }
        res.clearCookie('sid');
        res.json({ 
          message: "Sesión cerrada exitosamente",
          wasAuthenticated 
        });
      });
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("GET /api/user - isAuthenticated:", req.isAuthenticated());
    console.log("Session:", req.session);
    console.log("User:", req.user);

    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "No autenticado" });
    }

    res.json({
      id: req.user.id,
      correo: req.user.correo,
      nombres: req.user.nombres,
      apellidos: req.user.apellidos,
      role: req.user.rolNombre.toLowerCase()
    });
  });
}