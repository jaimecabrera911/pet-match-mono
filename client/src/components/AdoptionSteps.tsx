import { Card, CardContent } from "@/components/ui/card";

export function AdoptionSteps() {
  const steps = [
    {
      number: 1,
      title: "Regístrate",
      description: "Queremos ayudarte a dar el primer paso, diligencia los datos solicitados para iniciar el proceso."
    },
    {
      number: 2,
      title: "Selecciona tu amigo",
      description: "Busca en nuestra lista y selecciona el amigo que quieres adoptar."
    },
    {
      number: 3,
      title: "Responder simulador",
      description: "Completa todas las preguntas, posteriormente recibirás la respuesta en línea del primer filtro."
    },
    {
      number: 4,
      title: "Entrevista",
      description: "Queremos conocerte mejor y a la vez, hacer de tu primer encuentro con tu futuro amigo una experiencia especial."
    },
    {
      number: 5,
      title: "Entrega",
      description: "Formalizaremos el proceso para que puedas llevar a tu nuevo amigo a su hogar."
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
