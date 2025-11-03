import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event) {
  try {
    const { id, choice } = JSON.parse(event.body);

    const column = choice === 'A' ? 'votes_a' : 'votes_b';
    const { data, error } = await supabase
      .from('questions')
      .update({ [column]: supabase.rpc ? undefined : undefined })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error('Fejl i vote.js:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
