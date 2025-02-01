import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function CuestionarioAdopcion() {
  const [step, setStep] = useState(0);
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

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const onSubmit = async (data: AdoptionFormData) => {
    if (step < questions.length - 1) {
      // Validate current field before proceeding
      const currentField = currentQuestion.field as keyof AdoptionFormData;
      if (!data[currentField]) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Por favor selecciona una opción para continuar"
        });
        return;
      }
      setStep(step + 1);
    } else {
      console.log("Form submitted:", data);
      toast({
        title: "¡Gracias!",
        description: "Tu cuestionario ha sido enviado con éxito"
      });
      // TODO: Submit data to backend
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cuestionario de Adopción
      </h1>

      <div className="mb-4 flex items-center gap-2">
        <Progress value={progress} className="flex-1" />
        <span className="text-sm text-gray-500">
          {step + 1} de {questions.length}
        </span>
      </div>

      <Card className="transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestion.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name={currentQuestion.field as keyof AdoptionFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-4"
                      >
                        {currentQuestion.options.map((option) => (
                          <div key={option} className="flex items-center space-x-3">
                            <RadioGroupItem value={option} id={option} />
                            <FormLabel htmlFor={option} className="font-normal cursor-pointer">
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

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 0}
                >
                  Anterior
                </Button>
                <Button type="submit">
                  {step === questions.length - 1 ? "Enviar" : "Siguiente"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}