import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/clients/supabaseClient';

export async function GET({ params }) {
  const { id } = params;

  const { data, error: dbError } = await supabase
    .from('moments')
    .select('title, description, link')
    .eq('short_id', Number(id))
    .eq('status', 'approved')
    .single();

  if (dbError || !data) {
    throw error(404, 'Description not found');
  }

  return json({
    short_id: id,
    title: data.title,
    description: data.description,
    link: data.link
  });
}
