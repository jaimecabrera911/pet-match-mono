import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FiltersSectionProps {
  ageRange: [number, number];
  onAgeChange: (value: [number, number]) => void;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export function FiltersSection({
  ageRange,
  onAgeChange,
  selectedGender,
  onGenderChange,
  selectedSize,
  onSizeChange,
}: FiltersSectionProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold mb-6">Filtros</h2>
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Edad (años)</Label>
            <div className="pt-2">
              <Slider
                defaultValue={ageRange}
                max={15}
                min={0}
                step={1}
                onValueChange={onAgeChange}
                className="w-full"
              />
              <motion.div 
                className="flex justify-between mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="px-3 py-1 bg-primary/10 border-none">
                  <span className="text-sm font-medium text-primary">{ageRange[0]} años</span>
                </Card>
                <Card className="px-3 py-1 bg-primary/10 border-none">
                  <span className="text-sm font-medium text-primary">{ageRange[1]} años</span>
                </Card>
              </motion.div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Género</Label>
            <RadioGroup
              value={selectedGender}
              onValueChange={onGenderChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all-gender" />
                <Label htmlFor="all-gender">Todos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="macho" id="male" />
                <Label htmlFor="male">Macho</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hembra" id="female" />
                <Label htmlFor="female">Hembra</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Tamaño</Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={onSizeChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all-size" />
                <Label htmlFor="all-size">Todos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pequeño" id="small" />
                <Label htmlFor="small">Pequeño</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mediano" id="medium" />
                <Label htmlFor="medium">Mediano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grande" id="large" />
                <Label htmlFor="large">Grande</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}