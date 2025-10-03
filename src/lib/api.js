import { supabase } from './supabaseClient'

/**
 * Fetch all software with related reviews
 */
export async function getAllSoftwareWithReviews() {
  const { data, error } = await supabase
    .from('software')
    .select(`
      id,
      name,
      url,
      eigenschaften,
      kurzbeschreibung,
      logo_url,
      screenshot_url,
      clients_installation,
      live,
      land,
      award,
      rating,
      bewertungen (
        id,
        vorname_nachname,
        bewertung,
        erfahrung,
        created_on
      )
    `)
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}
