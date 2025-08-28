
import type { Result } from "../types";


export const shorten = async (url:string): Promise<Result> => {
  const res = await fetch("/.netlify/functions/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({url: url})
  })

  const data = await res.json()

  if (res.ok && data.shortUrl){
    return {status: 'success', shortened_url: data.shortUrl}
  }

  return {status: 'error', error_message: 'Something went wrong.'}

}


export function isValidURL(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
