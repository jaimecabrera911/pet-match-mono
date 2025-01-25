import { PetCard } from "./PetCard";

export function PetGrid() {
  const pets = [
    {
      name: "Luna",
      age: "2 años",
      breed: "Labrador",
      location: "Madrid",
      imageUrl: "https://images.unsplash.com/photo-1508568230916-c2692a5d7b1d"
    },
    {
      name: "Max",
      age: "1 año",
      breed: "Yorkshire",
      location: "Barcelona",
      imageUrl: "https://images.unsplash.com/photo-1508946621775-9d59b75e074e"
    },
    {
      name: "Rocky",
      age: "3 años",
      breed: "Dálmata",
      location: "Valencia",
      imageUrl: "https://images.unsplash.com/photo-1509559320938-387dfd4e074b"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {pets.map((pet, index) => (
        <PetCard key={index} {...pet} />
      ))}
    </div>
  );
}