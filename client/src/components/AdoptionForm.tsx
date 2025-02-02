import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SelectPet, SelectUser } from "@db/schema";

const adoptionFormSchema = z.object({
  petId: z.number({
    required_error: "Por favor selecciona una mascota",
  }),
  userId: z.number({
    required_error: "Por favor selecciona un usuario",
  }),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  notes: z.string().optional(),
  // Campos de la entrevista
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

type AdoptionFormData = z.infer<typeof adoptionFormSchema>;

export function AdoptionForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pets = [] } = useQuery<SelectPet[]>({
    queryKey: ["/api/pets"],
  });

  const { data: users = [] } = useQuery<SelectUser[]>({
    queryKey: ["/api/users"],
  });

  const availablePets = pets.filter(pet => !pet.isAdopted);

  const form = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionFormSchema),
    defaultValues: {
      status: "pending",
      tieneOtrasMascotas: "no",
      otrasMascotasDetalles: "",
    },
  });

  const createAdoptionMutation = useMutation({
    mutationFn: async (data: AdoptionFormData) => {
      const response = await fetch("/api/adoptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear la adopción");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/adoptions"] });
      toast({
        title: "Éxito",
        description: "Solicitud de adopción creada correctamente",
      });
      navigate("/dashboard/adopciones");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la solicitud de adopción",
      });
    },
  });

  const onSubmit = async (data: AdoptionFormData) => {
    await createAdoptionMutation.mutateAsync(data);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Solicitud de Adopción</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Información Básica</h3>
                <FormField
                  control={form.control}
                  name="petId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mascota</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una mascota" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availablePets.map((pet) => (
                            <SelectItem key={pet.id} value={pet.id.toString()}>
                              {pet.name} - {pet.breed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adoptante</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un adoptante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.nombres} {user.apellidos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Entrevista de Adopción</h3>

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
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/adopciones")}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#FF5C7F] hover:bg-[#FF5C7F]/90">
                  Crear Adopción
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}