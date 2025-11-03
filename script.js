const apiUrl = "https://script.google.com/macros/s/AKfycbzfOSrxd2Qn0Lm5Oqmy9cQJmIrtvnrVNXd8GFhCqTfYI88HHUz8wiNG4OUwfJh1VzqibA/exec";


let currentQuestion = null;

async function getQuestion() {
  document.getElementById("result-box").classList.add("hidden");
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    currentQuestion = data;

    document.getElementById("questionA").textContent = data.questionA;
    document.getElementById("questionB").textContent = data.questionB;
  } catch (err) {
    console.error("Fejl ved hentning:", err);
  }
}

async function sendVote(choice) {
  if (!currentQuestion) return;
  try {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${currentQuestion.id}&choice=${choice}`
    });

    const total = currentQuestion.votesA + currentQuestion.votesB + 1;
    const votesA = choice === "A" ? currentQuestion.votesA + 1 : currentQuestion.votesA;
    const votesB = choice === "B" ? currentQuestion.votesB + 1 : currentQuestion.votesB;

    const percentA = Math.round((votesA / total) * 100);
    const percentB = Math.round((votesB / total) * 100);

    document.getElementById("resultA").textContent = `${percentA}% valgte: ${currentQuestion.questionA}`;
    document.getElementById("resultB").textContent = `${percentB}% valgte: ${currentQuestion.questionB}`;
    document.getElementById("result-box").classList.remove("hidden");
  } catch (err) {
    console.error("Fejl ved afstemning:", err);
  }
}

document.getElementById("questionA").addEventListener("click", () => sendVote("A"));
document.getElementById("questionB").addEventListener("click", () => sendVote("B"));
document.getElementById("nextBtn").addEventListener("click", getQuestion);

getQuestion();
