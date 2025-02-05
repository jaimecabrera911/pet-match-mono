import { PlayCircle } from "lucide-react";

interface Video {
  id: number;
  title: string;
  thumbnailUrl: string;
  description: string;
}

export function VideoGallery() {
  const videos: Video[] = [
    {
      id: 1,
      title: "Higiene",
      thumbnailUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
      description: "Mantén a tu mascota limpia y saludable"
    },
    {
      id: 2,
      title: "Cuidados",
      thumbnailUrl: "https://images.unsplash.com/photo-1494256997604-768d1f608cac",
      description: "Aprende sobre los cuidados básicos"
    },
    {
      id: 3,
      title: "Alimentación",
      thumbnailUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
      description: "Consejos para una dieta balanceada"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mb-8 text-[#FF585F]">Tips y Consejos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="group relative">
            <div className="aspect-square mx-auto w-48 h-48 relative">
              <div className="absolute inset-0 rounded-full overflow-hidden transform transition-transform group-hover:scale-105 duration-300">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:bg-black/60 transition-all duration-300">
                  <PlayCircle className="w-12 h-12 text-white transform group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-[#FF5C7F] transition-colors duration-300">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
