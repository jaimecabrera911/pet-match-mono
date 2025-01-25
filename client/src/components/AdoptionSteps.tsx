import { Card, CardContent } from "@/components/ui/card";

export function AdoptionSteps() {
  const steps = [
    {
      number: 1,
      title: "Regístrate",
      description: "Completa tu perfil para poder adoptar"
    },
    {
      number: 2,
      title: "Selecciona tu amigo",
      description: "Encuentra la mascota que mejor se adapte a ti"
    },
    {
      number: 3,
      title: "Responder cuestionario",
      description: "Completa un breve formulario sobre tu estilo de vida"
    },
    {
      number: 4,
      title: "Entrevista",
      description: "Conoce a tu futura mascota y a su cuidador actual"
    },
    {
      number: 5,
      title: "Entrega",
      description: "¡Lleva a tu nuevo amigo a casa!"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">Pasos para adoptar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {steps.map((step) => (
          <Card key={step.number}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
