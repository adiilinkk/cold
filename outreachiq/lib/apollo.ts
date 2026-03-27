export interface ProspectData {
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  company: string | null;
  linkedinUrl: string | null;
  headline: string | null;
  city: string | null;
  country: string | null;
}

export async function lookupProspect(
  linkedinUrl: string,
  apiKey?: string
): Promise<ProspectData> {
  const key = apiKey || process.env.APOLLO_API_KEY;

  if (!key) {
    throw new Error("Apollo API key not configured");
  }

  const response = await fetch("https://api.apollo.io/v1/people/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      api_key: key,
      linkedin_url: linkedinUrl,
      reveal_personal_emails: true,
      reveal_phone_number: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apollo API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const person = data.person;

  if (!person) {
    throw new Error("No prospect data found for this LinkedIn URL");
  }

  return {
    name: `${person.first_name || ""} ${person.last_name || ""}`.trim(),
    email: person.email || person.personal_emails?.[0] || null,
    phone: person.phone_numbers?.[0]?.sanitized_number || null,
    title: person.title || null,
    company: person.organization?.name || person.employment_history?.[0]?.organization_name || null,
    linkedinUrl: person.linkedin_url || linkedinUrl,
    headline: person.headline || null,
    city: person.city || null,
    country: person.country || null,
  };
}
