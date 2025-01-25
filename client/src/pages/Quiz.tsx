import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SelectQuizQuestion } from "@db/schema";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery<SelectQuizQuestion[]>({
    queryKey: ["/api/quiz/questions"],
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: Record<number, string>) => {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1, // TODO: Implement auth and get real user ID
          answers,
        }),
      });
      if (!response.ok) throw new Error("Error al enviar el cuestionario");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Cuestionario completado!",
        description: "Procesando tus respuestas para encontrar tu mascota ideal.",
      });
      // TODO: Redirect to results page
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tus respuestas. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !questions) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Progress value={33} className="w-60 mb-4" />
          <p className="text-sm text-gray-500">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestionData.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuizMutation.mutate(newAnswers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-500 text-center">
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              {currentQuestionData.question}
            </h2>
            <div className="space-y-3">
              {(currentQuestionData.options as string[]).map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 px-6"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
