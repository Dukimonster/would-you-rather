// 🚀 Ny version der snakker med Netlify Functions i stedet for Google Apps Script

const apiBase = "/.netlify/functions";
let currentQuestion = null;

async function getQuestion() {
  document.getElementById("result-box").classList.add("hidden");

  try {
    const res = await fetch(`${apiBase}/get-question`);
    if (!res.ok) throw new Error("Kunne ikke hente spørgsmål");
    const data = await res.json();

    currentQuestion = data;
    document.getElementById("questionA").textContent = data.A;
    document.getElementById("questionB").textContent = data.B;
  } catch (err) {
    console.error("Fejl ved hentning af spørgsmål:", err);
    alert("Kunne ikke hente spørgsmål – prøv igen senere!");
  }
}

async function sendVote(choice) {
  if (!currentQuestion) return;

  try {
    const res = await fetch(`${apiBase}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentQuestion.id, choice })
    });

    if (!res.ok) throw new Error("Fejl ved afstemning");
    const result = await res.json();
    console.log("Afstemning sendt:", result);

    // Opdater lokalt visningen
    if (choice === "A") currentQuestion.votesA++;
    else currentQuestion.votesB++;

    const total = currentQuestion.votesA + currentQuestion.votesB;
    const percentA = Math.round((currentQuestion.votesA / total) * 100);
    const percentB = Math.round((currentQuestion.votesB / total) * 100);

    document.getElementById("resultA").textContent = `${percentA}% valgte: ${currentQuestion.A}`;
    document.getElementById("resultB").textContent = `${percentB}% valgte: ${currentQuestion.B}`;
    document.getElementById("result-box").classList.remove("hidden");

  } catch (err) {
    console.error("Fejl ved afstemning:", err);
    alert("Kunne ikke sende stemme – prøv igen senere!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("questionA").addEventListener("click", () => sendVote("A"));
  document.getElementById("questionB").addEventListener("click", () => sendVote("B"));
  document.getElementById("nextBtn").addEventListener("click", getQuestion);
  getQuestion();
});
