const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseTableUrl = supabaseUrl ? `${supabaseUrl}/rest/v1/registrations` : null;

const allowHeaders = [
  "Content-Type",
  "Accept",
  "Accept-Version",
  "Authorization",
  "Prefer"
];

function respond(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

/**
 * @param {import("http").IncomingMessage & { body?: unknown }} req
 * @param {import("http").ServerResponse} res
 */
export default async function handler(req = {}, res = {}) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", allowHeaders.join(","));
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    respond(res, 405, { error: "Method Not Allowed" });
    return;
  }

  if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseTableUrl) {
    respond(res, 500, { error: "Supabase backend is not configured" });
    return;
  }

  const body = parseBody(req);
  const {
    first_name,
    last_name,
    email,
    phone_number,
    age_group,
    school,
    school_other,
    mcgill_email,
    mcgill_student_id,
    discord_username,
    team_mode,
    team_name,
    captain_email,
    fields_of_study,
    interests,
    other_interest,
    dietary_restrictions,
    other_dietary,
    accessibility_needs,
    mlh_code_of_conduct,
    mlh_privacy_policy,
    mlh_emails
  } = body ?? {};

  const mcgillEmailRegex = /@(mcgill\.ca|mail\.mcgill\.ca)$/i;
  const discordRegex = /^[a-z0-9._]{2,32}$/;
  const trimmed = (value) => (typeof value === "string" ? value.trim() : "");

  const normalizedSchool = trimmed(school);
  const normalizedDiscord = trimmed(discord_username);
  const normalizedMcgillEmail = trimmed(mcgill_email);
  const normalizedSchoolOther = trimmed(school_other);
  const normalizedTeamMode = trimmed(team_mode);
  const normalizedTeamName = trimmed(team_name);
  const normalizedCaptainEmail = trimmed(captain_email);
  const normalizedOtherInterest = trimmed(other_interest);
  const normalizedOtherDietary = trimmed(other_dietary);
  const normalizedAccessibilityNeeds = trimmed(accessibility_needs);
  const normalizedFieldsOfStudy = Array.isArray(fields_of_study)
    ? fields_of_study.map((field) => trimmed(field)).filter(Boolean)
    : [];
  const normalizedInterests = Array.isArray(interests)
    ? interests.map((interest) => trimmed(interest)).filter(Boolean)
    : [];
  const normalizedDietaryRestrictions = Array.isArray(dietary_restrictions)
    ? dietary_restrictions.map((restriction) => trimmed(restriction)).filter(Boolean)
    : [];

  if (
    !trimmed(first_name) ||
    !trimmed(last_name) ||
    !trimmed(email) ||
    !trimmed(phone_number) ||
    !trimmed(age_group) ||
    !normalizedSchool ||
    !mlh_code_of_conduct ||
    !mlh_privacy_policy
  ) {
    respond(res, 400, { error: "Missing required registration fields" });
    return;
  }

  if (!normalizedTeamMode) {
    respond(res, 400, { error: "Please select how you are participating." });
    return;
  }

  if (normalizedTeamMode !== "team" && normalizedTeamMode !== "free_agent") {
    respond(res, 400, { error: "Participation mode must be team or free agent." });
    return;
  }

  if (normalizedTeamMode === "team" && !normalizedTeamName) {
    respond(res, 400, { error: "Team name is required when registering with a team." });
    return;
  }

  if (!Array.isArray(fields_of_study) || normalizedFieldsOfStudy.length === 0) {
    respond(res, 400, { error: "Please select at least one field of study." });
    return;
  }

  if (!Array.isArray(interests) || normalizedInterests.length === 0) {
    respond(res, 400, { error: "Please select at least one topic of interest." });
    return;
  }

  if (normalizedSchool === "Other" && !normalizedSchoolOther) {
    respond(res, 400, { error: "Please provide your school name." });
    return;
  }

  if (normalizedSchool === "McGill University") {
    if (!normalizedMcgillEmail) {
      respond(res, 400, { error: "McGill email is required for McGill students." });
      return;
    }

    if (!mcgillEmailRegex.test(normalizedMcgillEmail)) {
      respond(res, 400, { error: "McGill email must end with @mcgill.ca or @mail.mcgill.ca." });
      return;
    }
  }

  if (normalizedDiscord && !discordRegex.test(normalizedDiscord)) {
    respond(res, 400, { error: "Discord username must be 2-32 characters and contain only lowercase letters, numbers, dots, or underscores." });
    return;
  }

  const sanitizedPayload = {
    first_name: trimmed(first_name),
    last_name: trimmed(last_name),
    email: trimmed(email).toLowerCase(),
    phone_number: trimmed(phone_number),
    age_group: trimmed(age_group),
    school: normalizedSchool,
    school_other: normalizedSchool === "Other" ? normalizedSchoolOther : null,
    mcgill_email: normalizedSchool === "McGill University" ? normalizedMcgillEmail.toLowerCase() : null,
    mcgill_student_id: normalizedSchool === "McGill University" ? trimmed(mcgill_student_id) || null : null,
    discord_username: normalizedDiscord || null,
    team_mode: normalizedTeamMode,
    team_name: normalizedTeamMode === "team" ? normalizedTeamName : null,
    captain_email: normalizedTeamMode === "team" && normalizedCaptainEmail
      ? normalizedCaptainEmail.toLowerCase()
      : null,
    fields_of_study: normalizedFieldsOfStudy,
    interests: normalizedInterests,
    other_interest: normalizedOtherInterest || null,
    dietary_restrictions: normalizedDietaryRestrictions,
    other_dietary: normalizedOtherDietary || null,
    accessibility_needs: normalizedAccessibilityNeeds || null,
    mlh_code_of_conduct: Boolean(mlh_code_of_conduct),
    mlh_privacy_policy: Boolean(mlh_privacy_policy),
    mlh_emails: Boolean(mlh_emails ?? false)
  };

  try {
    if (normalizedTeamMode === "team" && normalizedCaptainEmail) {
      const teamSizeUrl = `${supabaseTableUrl}?select=id&team_name=eq.${encodeURIComponent(normalizedTeamName)}&captain_email=eq.${encodeURIComponent(normalizedCaptainEmail.toLowerCase())}`;
      const teamSizeResponse = await fetch(teamSizeUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseServiceRoleKey,
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          Prefer: "count=exact"
        }
      });

      if (!teamSizeResponse.ok) {
        const errorText = await teamSizeResponse.text();
        respond(res, 500, { error: "Failed to validate team size", details: errorText });
        return;
      }

      const contentRange = teamSizeResponse.headers.get("content-range");
      const totalCount = contentRange?.split("/")[1];
      const teamCount = Number(totalCount ?? 0);

      if (teamCount >= 5) {
        respond(res, 400, {
          error: "This team already has 5 members. Please register as a free agent or contact the organizers."
        });
        return;
      }
    }

    const response = await fetch(supabaseTableUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify(sanitizedPayload)
    });

    if (!response.ok) {
      const isConflict = response.status === 409;
      const errorText = await response.text();
      const errorMessage = isConflict
        ? "This email is already registered."
        : "Failed to save registration";

      respond(res, isConflict ? 409 : 500, { error: errorMessage, details: errorText });
      return;
    }

    respond(res, 200, { success: true });
  } catch (error) {
    respond(res, 500, { error: "Unexpected server error" });
    console.error("Supabase registration error", error);
  }
}
