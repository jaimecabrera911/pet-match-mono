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

export default function CuestionarioAdopcion() {
  const [step, setStep] = useState(0);
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
    // ... Add remaining questions
  ];

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const onSubmit = (data: AdoptionFormData) => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", data);
      // TODO: Submit data to backend
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cuestionario de Adopción
      </h1>
      
      <Progress value={progress} className="mb-8" />
      
      <Card>
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
                            <FormLabel htmlFor={option} className="font-normal">
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
                  onClick={() => setStep(step - 1)}
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
