import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Adoption {
  id: number;
  status: "creada" | "en_entrevista" | "aceptada" | "rechazada";
  applicationDate: string;
  aprobada: boolean | null;
  estadoDecision: string | null;
  experienciaPreviaDetalles: string | null;
  tipoVivienda: string | null;
  tieneEspacioExterior: string | null;
  horasAtencionDiaria: string | null;
  tieneOtrasMascotas: string | null;
  otrasMascotasDetalles: string | null;
  razonAdopcion: string | null;
  compromisosVeterinarios: string | null;
  notes: string | null;
  pet: {
    id: number;
    name: string;
    breed: string;
    imageUrl: string;
  };
  user: {
    id: number;
    nombres: string;
    apellidos: string;
    correo: string;
  };
}

const adoptionFormSchema = z.object({
  experienciaPreviaDetalles: z.string().optional(),
  tipoVivienda: z.enum(["casa", "apartamento", "otro"]).optional(),
  tieneEspacioExterior: z.enum(["si", "no"]).optional(),
  horasAtencionDiaria: z.string().optional(),
  tieneOtrasMascotas: z.enum(["si", "no"]).optional(),
  otrasMascotasDetalles: z.string().optional(),
  razonAdopcion: z.string().optional(),
  compromisosVeterinarios: z.string().optional(),
});

type AdoptionFormData = z.infer<typeof adoptionFormSchema>;

interface AdoptionDetailsProps {
  adoptionId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AdoptionDetailsDialog({ adoptionId, isOpen, onClose }: AdoptionDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: adoption, isLoading, error } = useQuery<Adoption>({
    queryKey: ["/api/adoptions", adoptionId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/adoptions/${adoptionId}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Error al obtener los detalles de la adopción: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching adoption details:', error);
        throw error;
      }
    },
    enabled: isOpen && !!adoptionId,
  });

  const form = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionFormSchema),
    defaultValues: {
      experienciaPreviaDetalles: adoption?.experienciaPreviaDetalles || "",
      tipoVivienda: adoption?.tipoVivienda as "casa" | "apartamento" | "otro" || "casa",
      tieneEspacioExterior: adoption?.tieneEspacioExterior as "si" | "no" || "no",
      horasAtencionDiaria: adoption?.horasAtencionDiaria || "",
      tieneOtrasMascotas: adoption?.tieneOtrasMascotas as "si" | "no" || "no",
      otrasMascotasDetalles: adoption?.otrasMascotasDetalles || "",
      razonAdopcion: adoption?.razonAdopcion || "",
      compromisosVeterinarios: adoption?.compromisosVeterinarios || "",
    },
  });

  const updateAdoptionMutation = useMutation({
    mutationFn: async (data: AdoptionFormData) => {
      const response = await fetch(`/api/adoptions/${adoptionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la adopción");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/adoptions", adoptionId] });
      toast({
        title: "Éxito",
        description: "Adopción actualizada correctamente",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la adopción",
      });
    },
  });

  const onSubmit = async (data: AdoptionFormData) => {
    await updateAdoptionMutation.mutateAsync(data);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'creada':
        return 'Creada';
      case 'en_entrevista':
        return 'En Entrevista';
      case 'aceptada':
        return 'Aceptada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return status;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'creada':
        return 'bg-blue-100 text-blue-800';
      case 'en_entrevista':
        return 'bg-yellow-100 text-yellow-800';
      case 'aceptada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAprobadaLabel = (aprobada: boolean | null, estadoDecision: string | null) => {
    if (aprobada === true) return `Aprobada en ${getStatusLabel(estadoDecision || '')}`;
    if (aprobada === false) return `Rechazada en ${getStatusLabel(estadoDecision || '')}`;
    return "Pendiente";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalles de la Adopción</DialogTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription>
            Información detallada sobre la solicitud de adopción
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error: {error.toString()}
          </div>
        ) : adoption ? (
          isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          value={field.value}
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
                          value={field.value}
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
                          onValueChange={field.onChange}
                          value={field.value}
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

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Mascota</h3>
                  <div className="flex items-center space-x-3">
                    <img
                      src={adoption.pet.imageUrl}
                      alt={adoption.pet.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{adoption.pet.name}</p>
                      <p className="text-sm text-gray-500">{adoption.pet.breed}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Adoptante</h3>
                  <p className="font-medium">
                    {adoption.user.nombres} {adoption.user.apellidos}
                  </p>
                  <p className="text-sm text-gray-500">{adoption.user.correo}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Estado de la Adopción</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Estado actual:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(adoption.status)}`}>
                      {getStatusLabel(adoption.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Decisión:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(adoption.estadoDecision || '')}`}>
                      {getAprobadaLabel(adoption.aprobada, adoption.estadoDecision)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Fecha de solicitud: {format(new Date(adoption.applicationDate), "PPP", { locale: es })}
                  </p>
                </div>
              </div>

              {adoption.experienciaPreviaDetalles && (
                <div>
                  <h3 className="font-semibold mb-2">Experiencia Previa</h3>
                  <p className="text-sm">{adoption.experienciaPreviaDetalles}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Vivienda</h3>
                  <p className="text-sm">Tipo: {adoption.tipoVivienda || 'No especificado'}</p>
                  <p className="text-sm">
                    Espacio exterior: {adoption.tieneEspacioExterior === 'si' ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Otras Mascotas</h3>
                  <p className="text-sm">
                    ¿Tiene otras mascotas?: {adoption.tieneOtrasMascotas === 'si' ? 'Sí' : 'No'}
                  </p>
                  {adoption.otrasMascotasDetalles && (
                    <p className="text-sm mt-1">{adoption.otrasMascotasDetalles}</p>
                  )}
                </div>
              </div>

              {adoption.horasAtencionDiaria && (
                <div>
                  <h3 className="font-semibold mb-2">Atención Diaria</h3>
                  <p className="text-sm">{adoption.horasAtencionDiaria}</p>
                </div>
              )}

              {adoption.razonAdopcion && (
                <div>
                  <h3 className="font-semibold mb-2">Razón de Adopción</h3>
                  <p className="text-sm">{adoption.razonAdopcion}</p>
                </div>
              )}

              {adoption.compromisosVeterinarios && (
                <div>
                  <h3 className="font-semibold mb-2">Compromisos Veterinarios</h3>
                  <p className="text-sm">{adoption.compromisosVeterinarios}</p>
                </div>
              )}

              {adoption.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notas Adicionales</h3>
                  <p className="text-sm">{adoption.notes}</p>
                </div>
              )}
            </div>
          )
        ) : (
          <p className="text-center text-gray-500">No se encontraron detalles de la adopción</p>
        )}
      </DialogContent>
    </Dialog>
  );
}