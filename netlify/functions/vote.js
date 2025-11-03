import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  try {
    const store = getStore({ name: 'wyr-store' });

    const ctype = (event.headers['content-type'] || '').toLowerCase();
    let id, choice;

    if (ctype.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(event.body || '');
      id = Number(params.get('id'));
      choice = String(params.get('choice') || '').toUpperCase();
    } else {
      const body = JSON.parse(event.body || '{}');
      id = Number(body.id);
      choice = String(body.choice || '').toUpperCase();
    }

    if (!id || !['A', 'B'].includes(choice)) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Bad request' }) };
    }

    const json = await store.get('questions', { type: 'json' });
    if (!json) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'No data' }) };

    const arr = json.questions;
    const idx = arr.findIndex(q => q.id === id);
    if (idx === -1) return { statusCode: 404, body: JSON.stringify({ success: false, error: 'Not found' }) };

    if (choice === 'A') arr[idx].votesA++;
    else arr[idx].votesB++;

    await store.set('questions', JSON.stringify({ questions: arr }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, id, choice })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: String(err) }) };
  }
};
