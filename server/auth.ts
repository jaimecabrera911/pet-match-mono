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
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    },
    store: new MemoryStore({
      checkPeriod: 86400000,
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
          console.log("[Auth] Intentando autenticar usuario:", correo);

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.correo, correo))
            .limit(1);

          if (!user) {
            console.log("[Auth] Usuario no encontrado:", correo);
            return done(null, false, { message: "Usuario incorrecto." });
          }

          if (password !== user.password) {
            console.log("[Auth] Contraseña incorrecta para usuario:", correo);
            return done(null, false, { message: "Contraseña incorrecta." });
          }

          console.log("[Auth] Autenticación exitosa para usuario:", correo);
          return done(null, user);
        } catch (err) {
          console.error("[Auth] Error en autenticación:", err);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("[Auth] Serializando usuario:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log("[Auth] Deserializando usuario:", id);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        console.log("[Auth] Usuario no encontrado en deserialización:", id);
        return done(null, false);
      }

      console.log("[Auth] Usuario deserializado exitosamente:", user.id);
      done(null, user);
    } catch (err) {
      console.error("[Auth] Error en deserialización:", err);
      done(err);
    }
  });

  // Error handler middleware to ensure JSON responses
  const errorHandler = (err: any, req: any, res: any, next: any) => {
    console.error("[Auth] Error middleware:", err);
    res.status(500).json({ error: err.message || "Error interno del servidor" });
  };

  // JSON response middleware
  const jsonMiddleware = (req: any, res: any, next: any) => {
    res.setHeader('Content-Type', 'application/json');

    // Override res.send to ensure JSON
    const originalSend = res.send;
    res.send = function(body: any) {
      try {
        // If body is not already stringified JSON, convert it
        if (typeof body === 'string' && !body.startsWith('{') && !body.startsWith('[')) {
          return originalSend.call(this, JSON.stringify({ message: body }));
        }
        return originalSend.call(this, body);
      } catch (err) {
        next(err);
      }
    };
    next();
  };

  // Apply middlewares to auth routes
  const authRoutes = ['/api/login', '/api/logout', '/api/user', '/api/register'];
  authRoutes.forEach(route => {
    app.use(route, jsonMiddleware);
  });

  app.post("/api/login", (req, res, next) => {
    console.log("[Auth] Recibida solicitud de login:", req.body);

    passport.authenticate(
      "local",
      (err: any, user: Express.User | false, info: IVerifyOptions) => {
        if (err) {
          console.error("[Auth] Error en autenticación:", err);
          return next(err);
        }

        if (!user) {
          console.log("[Auth] Autenticación fallida:", info.message);
          return res.status(400).json({ error: info.message ?? "Error al iniciar sesión" });
        }

        req.logIn(user, (err) => {
          if (err) {
            console.error("[Auth] Error en login:", err);
            return next(err);
          }

          console.log("[Auth] Login exitoso para usuario:", user.correo);
          return res.json({
            message: "Inicio de sesión exitoso",
            user: { 
              id: user.id, 
              correo: user.correo,
              nombres: user.nombres,
              apellidos: user.apellidos,
              rolNombre: user.rolNombre
            },
          });
        });
      }
    )(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    console.log("[Auth] Recibida solicitud de logout");
    req.logout((err) => {
      if (err) {
        console.error("[Auth] Error en logout:", err);
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      console.log("[Auth] Logout exitoso");
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("[Auth] Verificando usuario actual:", req.isAuthenticated() ? "autenticado" : "no autenticado");
    if (req.isAuthenticated() && req.user) {
      return res.json({
        id: req.user.id,
        correo: req.user.correo,
        nombres: req.user.nombres,
        apellidos: req.user.apellidos,
        rolNombre: req.user.rolNombre
      });
    }
    res.status(401).json({ error: "No ha iniciado sesión" });
  });

  // Apply error handler
  app.use(errorHandler);
}