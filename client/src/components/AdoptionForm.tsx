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
import { Check, X } from "lucide-react";

const adoptionFormSchema = z.object({
  petId: z.number({
    required_error: "Por favor selecciona una mascota",
  }),
  userId: z.number({
    required_error: "Por favor selecciona un adoptante",
  }),
  status: z.enum(["creada", "en_entrevista", "aceptada", "rechazada"]).default("creada"),
  etapa: z.enum(["cuestionario", "entrevista", "adopcion"]).default("cuestionario"),
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
  const [currentStage, setCurrentStage] = useState<"cuestionario" | "entrevista" | "adopcion">("cuestionario");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pets = [] } = useQuery<any[]>({
    queryKey: ["/api/pets"],
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const availablePets = pets.filter(pet => !pet.isAdopted);

  const form = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionFormSchema),
    defaultValues: {
      status: "creada",
      etapa: "cuestionario",
      tieneOtrasMascotas: "no",
      otrasMascotasDetalles: "",
    },
  });

  const createAdoptionMutation = useMutation({
    mutationFn: async (data: AdoptionFormData & { action?: 'aprobar' | 'rechazar' }) => {
      const status = data.action === 'aprobar' ? 'aceptada' : 
                     data.action === 'rechazar' ? 'rechazada' : 
                     currentStage === 'entrevista' ? 'en_entrevista' : 'creada';

      const response = await fetch("/api/adoptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, status, etapa: currentStage }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la información");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/adoptions"] });
      toast({
        title: "Éxito",
        description: variables.action ? 
          `Adopción ${variables.action === 'aprobar' ? 'aprobada' : 'rechazada'} correctamente` :
          `${currentStage === "cuestionario" ? "Solicitud guardada" : 
            currentStage === "entrevista" ? "Entrevista guardada" : 
            "Adopción guardada"} correctamente`
      });
      navigate("/dashboard/adopciones");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la información",
      });
    },
  });

  const onSubmit = async (data: AdoptionFormData, action?: 'aprobar' | 'rechazar') => {
    await createAdoptionMutation.mutateAsync({ ...data, action });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Cuestionario Inicial de Adopción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5C7F]" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
              </div>
              <div className="text-sm text-gray-500">
                Paso {currentStage === "cuestionario" ? "1" : currentStage === "entrevista" ? "2" : "3"} de 3
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-6">
              {currentStage === "cuestionario" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-700">Información Básica</h3>
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
              )}

              {currentStage === "entrevista" && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="experienciaPreviaDetalles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Tienes experiencia previa cuidando mascotas?</FormLabel>
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
              )}

              {currentStage === "adopcion" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Decisión Final</h3>
                  <p className="text-muted-foreground">
                    Revisa toda la información proporcionada y decide si apruebas o rechazas la solicitud de adopción.
                  </p>
                </div>
              )}

              <div className="flex justify-between space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/adopciones")}
                >
                  Cancelar
                </Button>
                <div className="flex space-x-2">
                  {currentStage === "adopcion" ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => form.handleSubmit((data) => onSubmit(data, 'rechazar'))()}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button
                        type="button"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => form.handleSubmit((data) => onSubmit(data, 'aprobar'))()}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                    </>
                  ) : (
                    <Button type="submit" className="bg-[#FF5C7F] hover:bg-[#FF5C7F]/90">
                      Guardar {currentStage === "cuestionario" ? "y Continuar" : "Entrevista"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}