import { getStore } from '@netlify/blobs';

export const handler = async () => {
  const store = getStore({ name: 'wyr-store' });
  let json = await store.get('questions', { type: 'json' });

  if (!json) {
    json = {
      questions: [
        { id: 1,  A: "Komme til at tisse lidt hver gang du griner", B: "Komme til at slå en lydløs, men meget lugtende prut hver gang du rejser dig", votesA: 0, votesB: 0 },
        { id: 2,  A: "Komme til at sige “tak” hver gang nogen fornærmer dig", B: "Komme til at fnise hver gang nogen græder", votesA: 0, votesB: 0 },
        { id: 3,  A: "Have lidt toiletpapir hængende fra bukserne én gang om ugen", B: "Få en plet sved i armhulen, hver gang du skal tage et billede", votesA: 0, votesB: 0 },
        { id: 4,  A: "Skulle bruge et offentligt toilet uden lås", B: "Skulle tørre dig med vådt toiletpapir hver gang", votesA: 0, votesB: 0 },
        { id: 5,  A: "Komme til at prutte diskret i en elevator, og alle tror det er dig", B: "Komme til at hoste en lille snotklat ud, hver gang du griner", votesA: 0, votesB: 0 }
      ]
    };
    await store.set('questions', JSON.stringify(json));
  }

  const arr = json.questions;
  const q = arr[Math.floor(Math.random() * arr.length)];

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(q)
  };
};
