import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema, type SelectUser, type InsertUser, documentTypes } from "@db/schema";
import { DialogDescription } from "@radix-ui/react-dialog";

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: SelectUser;
}

export function UserFormDialog({ isOpen, onClose, user }: UserFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      tipoDocumento: "CEDULA DE CIUDADANIA",
      numeroDocumento: "",
      nombres: "",
      apellidos: "",
      genero: "M",
      fechaNacimiento: undefined,
      telefono: "",
      direccion: "",
      ciudad: "",
      departamento: "",
      ocupacion: "",
      correo: "",
      password: "",
      rolNombre: "admin"
    }
  });

  const { errors } = form.formState;



  useEffect(() => {
    console.error(errors);
    if (user) {
      form.reset({
        ...user,
        fechaNacimiento: user.fechaNacimiento ? new Date(user.fechaNacimiento) : new Date(),
        password: "", // Don't show password
      });
    } else {
      form.reset({
        tipoDocumento: "CEDULA DE CIUDADANIA",
        numeroDocumento: "",
        nombres: "",
        apellidos: "",
        genero: "M",
        fechaNacimiento: undefined,
        telefono: "",
        direccion: "",
        ciudad: "",
        departamento: "",
        ocupacion: "",
        correo: "",
        password: "",
        rolNombre: "admin",
      });
    }
  }, [user, form]);

  const createUserMutation = useMutation({
  mutationFn: async (data: InsertUser) => {
    try {
      console.log("Sending data:", data);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fechaNacimiento: data.fechaNacimiento.toISOString(),
        }),
        credentials: "include",
      });

      // Log the full response details
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      const contentType = response.headers.get("content-type");
      console.log("Content type:", contentType);

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Error response body:", responseText);
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || "Error al crear el usuario");
        } catch (e) {
          // If not JSON, throw with response details
          throw new Error(
            `Server Error (${response.status}): ${responseText.substring(0, 200)}...`
          );
        }
      }

      const responseData = await response.text();
      console.log("Success response body:", responseData);
      
      try {
        return JSON.parse(responseData);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseData.substring(0, 200)}...`);
      }
    } catch (error) {
      console.error("Full error details:", error);
      throw error;
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    toast({
      title: "Éxito",
      description: "Usuario creado correctamente",
    });
    onClose();
    form.reset();
  },
  onError: (error: Error) => {
    console.error("Mutation error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    });
  },
});

  const updateUserMutation = useMutation({
    mutationFn: async (data: InsertUser & { id?: number }) => {
      console.log("Datos de actualización (updateUserMutation):", data);
      if (!user?.id) return;
      const body= JSON.stringify({
        ...data,
        fechaNacimiento: data.fechaNacimiento.toISOString(),
      })

      console.log("BODY",body)

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el usuario");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
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

  const onSubmit = async (data: InsertUser) => {
    console.log("Form submitted with data:", data); // Add logging
    console.log("USER",user)
    try {
      if (user) {
        console.log("Datos de actualización (onSubmit):", data);
        await updateUserMutation.mutateAsync(data);
      } else {
        console.log("Datos de creación (onSubmit):", data);
        await createUserMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error in form submission:", error); // Add logging
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {user ? "Modifica los datos del usuario" : "Ingresa los datos del nuevo usuario"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log("Form submitted with data:", data);
                onSubmit(data);
              },
              (errors) => {
                console.log("Form validation errors:", errors);
              }
            )}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipoDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo de documento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
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
                name="numeroDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Documento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                        <SelectItem value="O">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rolNombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="adoptante">Adoptante</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaNacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : new Date();
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
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
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ocupacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ocupación</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de creación</FormLabel>
                  <FormControl>
                  <Input
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                      onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {user ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}