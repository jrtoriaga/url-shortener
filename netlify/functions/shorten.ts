// /netlify/functions/shorten.ts
import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body || "{}");

    if (!url) {
      return { statusCode: 400, body: "Missing URL" };
    }

    const res = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BITLY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ long_url: url }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error({ statusCode: res.status, body: JSON.stringify(data) })
      return { statusCode: 500, body: 'Something went wrong.' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ shortUrl: data.link }),
    };
  } catch (err: any) {
    console.error(err.message)
    return { statusCode: 500, body: 'Something went wrong.' };
  }
};

export { handler };
