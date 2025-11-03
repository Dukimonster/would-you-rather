import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: data.id,
        A: data.question_a,
        B: data.question_b,
        votesA: data.votes_a,
        votesB: data.votes_b
      }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
