import { z } from "zod";

export const adoptionFormSchema = z.object({
  experienciaMascotas: z.enum([
    "Si, he tenido perros antes",
    "Si, pero no he tenido perros",
    "No, nunca he tenido mascotas"
  ], {
    required_error: "Por favor selecciona una opción"
  }),
  tipoVivienda: z.enum([
    "Casa con jardín grande",
    "Casa con jardín pequeño",
    "Apartamento grande",
    "Apartamento pequeño"
  ], {
    required_error: "Por favor selecciona el tipo de vivienda"
  }),
  cuidadoExtraTiempo: z.enum([
    "Contrataría un cuidador de mascotas o dejaría a mi perro en una guardería",
    "Pediría a un amigo o familiar que lo cuide",
    "Dejaría suficiente comida y agua, esperando que se maneje solo"
  ], {
    required_error: "Por favor selecciona una opción"
  }),
  otrasMascotas: z.enum([
    "Sí, otro perro",
    "Sí, un gato",
    "Sí, otras mascotas",
    "No, no tengo otras mascotas"
  ], {
    required_error: "Por favor indica si tienes otras mascotas"
  }),
  adaptacionNuevaVivienda: z.enum([
    "Llevarlo gradualmente para que se familiarice con el lugar",
    "Proporcionarle sus juguetes y objetos familiares",
    "No haría nada específico, esperando que se adapte solo"
  ], {
    required_error: "Por favor selecciona una opción"
  }),
  problemasComportamiento: z.enum([
    "Consultar a un adiestrador profesional",
    "Intentar entrenarlo por mi cuenta",
    "Devolverlo al refugio"
  ], {
    required_error: "Por favor selecciona una opción"
  }),
  presupuestoMensual: z.enum([
    "Menos de $250.000",
    "Entre $250.000 y $350.000",
    "Más de $350.000"
  ], {
    required_error: "Por favor selecciona un rango de presupuesto"
  }),
  compromisoLargoPlazo: z.enum([
    "Sí, estoy comprometido/a",
    "No estoy seguro/a",
    "No"
  ], {
    required_error: "Por favor indica tu nivel de compromiso"
  }),
  atencionVeterinaria: z.enum([
    "Llevarlo al veterinario de inmediato, sin importar el costo",
    "Consultar opciones económicas antes de tomar una decisión",
    "Esperar a ver si mejora por sí solo"
  ], {
    required_error: "Por favor selecciona una opción"
  }),
  reaccionDaños: z.enum([
    "Buscaría un adiestrador para corregir el comportamiento",
    "Intentaría entrenarlo por mi cuenta y proporcionarle juguetes adecuados",
    "Ignoraría el comportamiento, esperando que pase"
  ], {
    required_error: "Por favor selecciona una opción"
  })
});

export type AdoptionFormData = z.infer<typeof adoptionFormSchema>;
