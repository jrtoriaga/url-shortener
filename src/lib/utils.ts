
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


export const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText();
    console.log("Pasted:", text);
    return text
    // do something with text here
  } catch (err) {
    console.error("Failed to read clipboard:", err);
  }
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard!")
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
