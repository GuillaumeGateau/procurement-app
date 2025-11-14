import axios from "axios";
import dotenv from "dotenv";
import { DateTime } from "luxon";

dotenv.config({ path: "../.env" });

async function getToken() {
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.UNGM_CLIENT_ID,
    client_secret: process.env.UNGM_CLIENT_SECRET,
  });

  const { data } = await axios.post(process.env.UNGM_TOKEN_URL, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 30_000,
  });
  return data.access_token;
}

async function searchNotices(token) {
  const since = DateTime.utc().minus({ days: 1 }).toISO();
  const payload = {
    lastUpdatedDateFrom: since,
    pageSize: 100,
    pageNumber: 1,
    sort: { name: "lastUpdatedDate", order: "desc" },
  };

  const { data } = await axios.post(
    `${process.env.UNGM_API_BASE}/notice/search`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.items ?? [];
}

async function main() {
  if (!process.env.UNGM_CLIENT_ID || !process.env.UNGM_CLIENT_SECRET) {
    throw new Error("Missing UNGM credentials in environment");
  }
  const token = await getToken();
  const results = await searchNotices(token);
  console.log(`Retrieved ${results.length} notices in last 24 hours.`);
  for (const notice of results.slice(0, 5)) {
    console.log(`${notice.id} | ${notice.title}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
