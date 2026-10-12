import { useEffect, useState } from "react";
import { isValidURL, shorten } from "../lib/utils";

/**
 * Owns all of the shortening state and side-effects so the view stays
 * presentational. Behaviour (debounced validation, error handling and the
 * server round-trip) mirrors the original single-component implementation.
 */
export function useShorten() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [isValidLongUrl, setIsValidLongUrl] = useState(false);

  const [clientErrorMessage, setClientErrorMessage] = useState("");
  const [showClientError, setShowClientError] = useState(false);

  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [showServerError, setShowServerError] = useState(false);

  const handleShortened = async () => {
    setShortUrl("");
    setLoading(true);
    try {
      const result = await shorten(longUrl);
      if (result.status === "success") {
        setShortUrl(result.shortened_url);
      } else {
        setServerErrorMessage(result.error_message);
        setShowServerError(true);
      }
    } catch {
      setServerErrorMessage(
        "There was an error connecting to the server. Please try again later."
      );
      setShowServerError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateInput = (value: string) => {
    setShortUrl("");
    setShowServerError(false);
    setShowClientError(false);
    setLongUrl(value);
  };

  // Debounced validation: auto-check whether the long url is well-formed.
  useEffect(() => {
    setIsValidLongUrl(false);
    if (!longUrl) return;

    const handler = setTimeout(() => {
      if (!isValidURL(longUrl)) {
        setClientErrorMessage(
          "Must be a valid url. For example: https://google.com"
        );
        setShowClientError(true);
      } else {
        setIsValidLongUrl(true);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [longUrl]);

  return {
    longUrl,
    shortUrl,
    loading,
    isValidLongUrl,
    showClientError,
    clientErrorMessage,
    showServerError,
    serverErrorMessage,
    updateInput,
    handleShortened,
  };
}
