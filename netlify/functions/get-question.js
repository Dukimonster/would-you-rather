exports.handler = async () => {
  const questions = [
    { id: 1, A: "Aldrig kunne grine igen", B: "Aldrig kunne sove igen", votesA: 0, votesB: 0 },
    { id: 2, A: "Kunne tale med dyr", B: "Kunne flyve", votesA: 0, votesB: 0 },
    { id: 3, A: "Spise pizza hver dag", B: "Aldrig spise pizza igen", votesA: 0, votesB: 0 }
  ];

  const random = questions[Math.floor(Math.random() * questions.length)];

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(random)
  };
};
