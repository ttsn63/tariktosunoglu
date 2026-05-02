const { createClient } = require("@supabase/supabase-js");

const headers = {
  "Content-Type": "application/json",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return json(400, { error: "Invalid JSON" });
  }

  const lead = {
    name: clean(payload.name),
    email: clean(payload.email).toLowerCase(),
    telefon: clean(payload.telefon),
    vorhaben: clean(payload.vorhaben),
    branche: clean(payload.branche),
    zweck: clean(payload.zweck),
    startkapital: clean(payload.startkapital),
    umsatzziel: clean(payload.umsatzziel),
    mitarbeiter: clean(payload.mitarbeiter),
    status: "neu",
  };

  if (!lead.name || !lead.email || !lead.vorhaben) {
    return json(400, {
      error: "Name, E-Mail und Vorhaben sind Pflichtfelder.",
    });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase environment variables");
    return json(500, { error: "Server configuration missing" });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      },
    );

    const { error: insertError } = await supabase
      .from("businessplan_leads")
      .insert(lead);

    if (insertError) {
      throw insertError;
    }

    return json(200, { success: true });
  } catch (error) {
    console.error("Businessplan lead error:", error);
    return json(500, {
      error: "Die Anfrage konnte nicht verarbeitet werden.",
    });
  }
};
