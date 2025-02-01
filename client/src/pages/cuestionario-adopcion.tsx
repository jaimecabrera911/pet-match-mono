import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adoptionFormSchema, type AdoptionFormData } from "@/lib/schemas/adoption-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CuestionarioAdopcion() {
  const { toast } = useToast();

  const form = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionFormSchema),
    mode: "onChange",
  });

  const questions = [
    {
      field: "experienciaMascotas",
      title: "¿Tienes experiencia previa cuidando mascotas?",
      options: [
        "Si, he tenido perros antes",
        "Si, pero no he tenido perros",
        "No, nunca he tenido mascotas"
      ]
    },
    {
      field: "tipoVivienda",
      title: "¿Qué tipo de vivienda tienes?",
      options: [
        "Casa con jardín grande",
        "Casa con jardín pequeño",
        "Apartamento grande",
        "Apartamento pequeño"
      ]
    },
    {
      field: "cuidadoExtraTiempo",
      title: "Si descubres que tienes que estar fuera de casa por más tiempo del habitual, ¿cómo te asegurarías de que tu perro esté bien cuidado?",
      options: [
        "Contrataría un cuidador de mascotas o dejaría a mi perro en una guardería",
        "Pediría a un amigo o familiar que lo cuide",
        "Dejaría suficiente comida y agua, esperando que se maneje solo"
      ]
    },
    {
      field: "otrasMascotas",
      title: "¿Hay otras mascotas en tu hogar actualmente?",
      options: [
        "Sí, otro perro",
        "Sí, un gato",
        "Sí, otras mascotas",
        "No, no tengo otras mascotas"
      ]
    },
    {
      field: "adaptacionNuevaVivienda",
      title: "Si planeas mudarte a una nueva vivienda, ¿cómo te asegurarías de que tu perro se adapte bien al nuevo entorno?",
      options: [
        "Llevarlo gradualmente para que se familiarice con el lugar",
        "Proporcionarle sus juguetes y objetos familiares",
        "No haría nada específico, esperando que se adapte solo"
      ]
    },
    {
      field: "problemasComportamiento",
      title: "¿Qué harías si el perro presenta problemas de comportamiento?",
      options: [
        "Consultar a un adiestrador profesional",
        "Intentar entrenarlo por mi cuenta",
        "Devolverlo al refugio"
      ]
    },
    {
      field: "presupuestoMensual",
      title: "¿Cuál es tu presupuesto mensual estimado para los cuidados del perro (alimento, veterinario, juguetes, etc.)?",
      options: [
        "Menos de $250.000",
        "Entre $250.000 y $350.000",
        "Más de $350.000"
      ]
    },
    {
      field: "compromisoLargoPlazo",
      title: "¿Estás dispuesto a hacerte cargo de un perro durante toda su vida, que puede ser de 10 a 15 años o más?",
      options: [
        "Sí, estoy comprometido/a",
        "No estoy seguro/a",
        "No"
      ]
    },
    {
      field: "atencionVeterinaria",
      title: "¿Qué harías si tu perro se enferma y necesita atención veterinaria inmediata?",
      options: [
        "Llevarlo al veterinario de inmediato, sin importar el costo",
        "Consultar opciones económicas antes de tomar una decisión",
        "Esperar a ver si mejora por sí solo"
      ]
    },
    {
      field: "reaccionDaños",
      title: "Si tu perro mastica tus pertenencias, como zapatos o muebles, ¿cómo reaccionarías?",
      options: [
        "Buscaría un adiestrador para corregir el comportamiento",
        "Intentaría entrenarlo por mi cuenta y proporcionarle juguetes adecuados",
        "Ignoraría el comportamiento, esperando que pase"
      ]
    }
  ];

  const onSubmit = async (data: AdoptionFormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "¡Gracias!",
      description: "Tu cuestionario ha sido enviado con éxito"
    });
    // TODO: Submit data to backend
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cuestionario de Adopción
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Por favor, responde todas las preguntas para evaluar tu compatibilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {questions.map((question, index) => (
                <FormField
                  key={question.field}
                  control={form.control}
                  name={question.field as keyof AdoptionFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        {index + 1}. {question.title}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          {question.options.map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`${question.field}-${option}`} />
                              <FormLabel
                                htmlFor={`${question.field}-${option}`}
                                className="font-normal cursor-pointer"
                              >
                                {option}
                              </FormLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Enviar Cuestionario
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}