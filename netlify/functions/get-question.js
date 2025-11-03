import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // bruges til at generere unikke session-id'er

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Gemmer sessionsdata i hukommelsen (nulstilles når Netlify-funktionen genstartes)
const sessions = {};

export async function handler(event) {
  try {
    // 🧠 1. Find session ID i cookies (ellers lav et nyt)
    const cookies = event.headers.cookie || '';
    let sessionId = cookies.match(/sessionId=([a-zA-Z0-9\-]+)/)?.[1];

    if (!sessionId) {
      sessionId = uuidv4();
    }

    // 🧠 2. Hent alle spørgsmål fra databasen
    const { data: allQuestions, error } = await supabase
      .from('questions')
      .select('id, question_a, question_b, votes_a, votes_b');

    if (error) throw error;

    // Hvis ingen spørgsmål findes
    if (!allQuestions || allQuestions.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Ingen spørgsmål i databasen' }) };
    }

    // 🧩 3. Opret session hvis ny
    if (!sessions[sessionId]) {
      // Lav en tilfældig rækkefølge af spørgsmål
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      sessions[sessionId] = { remaining: shuffled };
    }

    // 🧩 4. Hent næste spørgsmål fra session
    const session = sessions[sessionId];
    const nextQuestion = session.remaining.pop();

    // Hvis brugeren har været igennem alle spørgsmål
    if (!nextQuestion) {
      // Start forfra med ny tilfældig rækkefølge
      const reshuffled = allQuestions.sort(() => Math.random() - 0.5);
      session.remaining = reshuffled;
    }

    // Sørg for at sende et spørgsmål
    const question = nextQuestion || session.remaining.pop();

    // 🧠 5. Returnér spørgsmålet og sæt cookie med session-id
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: question.id,
        A: question.question_a,
        B: question.question_b,
        votesA: question.votes_a,
        votesB: question.votes_b
      }),
    };

  } catch (err) {
    console.error('Fejl i get-question.js:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
