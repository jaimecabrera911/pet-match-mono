import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const interviewFormSchema = z.object({
  experienciaPreviaDetalles: z.string().min(1, "Este campo es requerido"),
  tipoVivienda: z.enum(["casa", "apartamento", "otro"], {
    required_error: "Por favor seleccione un tipo de vivienda",
  }),
  tieneEspacioExterior: z.enum(["si", "no"], {
    required_error: "Por favor indique si tiene espacio exterior",
  }),
  horasAtencionDiaria: z.string().min(1, "Este campo es requerido"),
  tieneOtrasMascotas: z.enum(["si", "no"], {
    required_error: "Por favor indique si tiene otras mascotas",
  }),
  otrasMascotasDetalles: z.string().optional(),
  razonAdopcion: z.string().min(1, "Este campo es requerido"),
  compromisosVeterinarios: z.string().min(1, "Este campo es requerido"),
});

type InterviewFormData = z.infer<typeof interviewFormSchema>;

export function AdoptionInterview() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      experienciaPreviaDetalles: "",
      tieneOtrasMascotas: "no",
      otrasMascotasDetalles: "",
    },
  });

  const submitInterview = useMutation({
    mutationFn: async (data: InterviewFormData) => {
      const response = await fetch("/api/adoption-interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al enviar la entrevista");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Entrevista enviada correctamente",
      });
      navigate("/dashboard/adopciones");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la entrevista",
      });
    },
  });

  const onSubmit = async (data: InterviewFormData) => {
    await submitInterview.mutateAsync(data);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Entrevista de Adopción</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="experienciaPreviaDetalles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Tienes experiencia previa cuidando mascotas? Cuéntanos sobre ello</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoVivienda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿En qué tipo de vivienda resides?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="casa" />
                          </FormControl>
                          <FormLabel className="font-normal">Casa</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="apartamento" />
                          </FormControl>
                          <FormLabel className="font-normal">Apartamento</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="otro" />
                          </FormControl>
                          <FormLabel className="font-normal">Otro</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tieneEspacioExterior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Tienes espacio exterior (patio, jardín, terraza)?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="si" />
                          </FormControl>
                          <FormLabel className="font-normal">Sí</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horasAtencionDiaria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Cuántas horas al día podrás dedicarle a tu mascota?</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tieneOtrasMascotas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Tienes otras mascotas actualmente?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value === "no") {
                            form.setValue("otrasMascotasDetalles", "");
                          }
                        }}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="si" />
                          </FormControl>
                          <FormLabel className="font-normal">Sí</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("tieneOtrasMascotas") === "si" && (
                <FormField
                  control={form.control}
                  name="otrasMascotasDetalles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuéntanos sobre tus mascotas actuales</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="razonAdopcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Por qué deseas adoptar una mascota?</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compromisosVeterinarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Cómo planeas manejar los compromisos veterinarios y de salud de tu mascota?</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/adopciones")}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#FF5C7F] hover:bg-[#FF5C7F]/90">
                  Enviar Entrevista
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
