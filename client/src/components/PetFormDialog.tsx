import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InsertPet, SelectPet } from "@db/schema";

const petSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  age: z.string().min(1, "La edad es requerida"),
  breed: z.string().min(1, "La raza es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
  imageFile: z.any(),
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

  const form = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: pet?.name ?? "",
      age: pet?.age ?? "",
      breed: pet?.breed ?? "",
      location: pet?.location ?? "",
      imageUrl: pet?.imageUrl ?? "",
    },
  });

  const createPetMutation = useMutation({
    mutationFn: async (data: InsertPet) => {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
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
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la mascota",
      });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async (data: InsertPet & { id: number }) => {
      const response = await fetch(`/api/pets/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la mascota");
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
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la mascota",
      });
    },
  });

  const onSubmit = async (data: PetFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', data.age);
    formData.append('breed', data.breed);
    formData.append('location', data.location);
    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }

    if (pet) {
      await updatePetMutation.mutateAsync({ formData, id: pet.id });
    } else {
      await createPetMutation.mutateAsync(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{pet ? "Editar" : "Agregar"} Mascota</DialogTitle>
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
              name="imageFile"
              render={({ field: { onChange, ...field } }) => (
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
                      {...field}
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
