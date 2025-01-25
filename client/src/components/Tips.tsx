import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

export function Tips() {
  const tips = [
    {
      title: "Higiene",
      imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
      description: "Mantén a tu mascota limpia y saludable"
    },
    {
      title: "Cuidados",
      imageUrl: "https://images.unsplash.com/photo-1494256997604-768d1f608cac",
      description: "Aprende sobre los cuidados básicos"
    },
    {
      title: "Alimentación",
      imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
      description: "Consejos para una dieta balanceada"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <Card key={index} className="bg-transparent border-none shadow-none">
            <CardContent className="p-0">
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}