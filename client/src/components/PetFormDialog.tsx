import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SelectPet } from "@db/schema";
import { X } from "lucide-react";

const petSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  age: z.string().min(1, "La edad es requerida"),
  breed: z.string().min(1, "La raza es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
  gender: z.enum(["macho", "hembra"], {
    required_error: "El género es requerido",
  }),
  imageFile: z.any(),
  requirements: z.array(z.string()).min(1, "Debe especificar al menos un requisito"),
  healthStatus: z.array(z.string()).min(1, "Debe especificar al menos un estado de salud"),
  personality: z.array(z.string()).min(1, "Debe especificar al menos un rasgo de personalidad"),
});

type PetFormData = z.infer<typeof petSchema>;

interface PetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pet?: SelectPet;
}

export function PetFormDialog({ isOpen, onClose, pet }: PetFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newRequirement, setNewRequirement] = useState("");
  const [newHealthStatus, setNewHealthStatus] = useState("");
  const [newPersonality, setNewPersonality] = useState("");

  const form = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      age: "",
      breed: "",
      location: "",
      gender: "macho",
      requirements: [],
      healthStatus: [],
      personality: [],
    },
  });

  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        age: pet.age,
        breed: pet.breed,
        location: pet.location,
        gender: pet.gender,
        requirements: pet.requirements,
        healthStatus: pet.healthStatus,
        personality: pet.personality,
      });
    } else {
      form.reset({
        name: "",
        age: "",
        breed: "",
        location: "",
        gender: "macho",
        requirements: [],
        healthStatus: [],
        personality: [],
      });
    }
  }, [pet, form]);

  const createPetMutation = useMutation({
    mutationFn: async (data: PetFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("age", data.age);
      formData.append("breed", data.breed);
      formData.append("location", data.location);
       formData.append("gender", data.gender);
      formData.append("requirements", JSON.stringify(data.requirements));
      formData.append("healthStatus", JSON.stringify(data.healthStatus));
      formData.append("personality", JSON.stringify(data.personality));

      if (data.imageFile instanceof File) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch("/api/pets", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al crear la mascota");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "¡Éxito!",
        description: "Mascota creada correctamente",
      });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async (data: PetFormData & { id: number }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("age", data.age);
      formData.append("breed", data.breed);
      formData.append("location", data.location);
       formData.append("gender", data.gender);
      formData.append("requirements", JSON.stringify(data.requirements));
      formData.append("healthStatus", JSON.stringify(data.healthStatus));
      formData.append("personality", JSON.stringify(data.personality));

      if (data.imageFile instanceof File) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(`/api/pets/${data.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar la mascota");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "¡Éxito!",
        description: "Mascota actualizada correctamente",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: PetFormData) => {
    if (pet) {
      await updatePetMutation.mutateAsync({ ...data, id: pet.id });
    } else {
      await createPetMutation.mutateAsync(data);
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const currentRequirements = form.getValues("requirements") || [];
      form.setValue("requirements", [...currentRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleAddHealthStatus = () => {
    if (newHealthStatus.trim()) {
      const currentStatus = form.getValues("healthStatus") || [];
      form.setValue("healthStatus", [...currentStatus, newHealthStatus.trim()]);
      setNewHealthStatus("");
    }
  };

  const handleAddPersonality = () => {
    if (newPersonality.trim()) {
      const currentPersonality = form.getValues("personality") || [];
      form.setValue("personality", [...currentPersonality, newPersonality.trim()]);
      setNewPersonality("");
    }
  };

  const handleRemoveItem = (field: "requirements" | "healthStatus" | "personality", index: number) => {
    const current = form.getValues(field) || [];
    form.setValue(field, current.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pet ? "Editar" : "Agregar"} Mascota</DialogTitle>
          <DialogDescription>
            {pet
              ? "Modifica los detalles de la mascota seleccionada"
              : "Ingresa la información de la nueva mascota"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="macho">Macho</SelectItem>
                        <SelectItem value="hembra">Hembra</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raza</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={() => (
                <FormItem>
                  <FormLabel>Requisitos de Adopción</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Agregar requisito"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    />
                    <Button type="button" onClick={handleAddRequirement}>
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("requirements")?.map((req, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        <span>{req}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("requirements", index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthStatus"
              render={() => (
                <FormItem>
                  <FormLabel>Estado de Salud</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newHealthStatus}
                      onChange={(e) => setNewHealthStatus(e.target.value)}
                      placeholder="Agregar estado de salud"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHealthStatus())}
                    />
                    <Button type="button" onClick={handleAddHealthStatus}>
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("healthStatus")?.map((status, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        <span>{status}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("healthStatus", index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personality"
              render={() => (
                <FormItem>
                  <FormLabel>Personalidad</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newPersonality}
                      onChange={(e) => setNewPersonality(e.target.value)}
                      placeholder="Agregar rasgo de personalidad"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPersonality())}
                    />
                    <Button type="button" onClick={handleAddPersonality}>
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("personality")?.map((trait, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        <span>{trait}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("personality", index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Imagen de la mascota</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {pet ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}