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