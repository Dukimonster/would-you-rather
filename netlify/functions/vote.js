import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event) {
  try {
    const { id, choice } = JSON.parse(event.body);
    const column = choice === 'A' ? 'votes_a' : 'votes_b';

    // Hent den aktuelle række
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select(column)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Opdater stemmen manuelt
    const newValue = (question[column] || 0) + 1;

    const { error: updateError } = await supabase
      .from('questions')
      .update({ [column]: newValue })
      .eq('id', id);

    if (updateError) throw updateError;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, column, newValue }),
    };
  } catch (err) {
    console.error('Fejl i vote.js:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
