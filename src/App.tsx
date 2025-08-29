import { useEffect, useState } from "react";
import "./App.css";
import {
  copyToClipboard,
  isValidURL,
  pasteFromClipboard,
  shorten,
} from "./lib/utils";
import clsx from "clsx";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  // States for the send button
  const [loading, setLoading] = useState(false);
  const [isValidLongUrl, setIsValidLongUrl] = useState(false);

  // TODO: Make a better error message handling? Maybe a list of errors or something
  // Client error messages
  const [clientErrorMessage, setClientErrorMessage] = useState("");
  const [showClientError, setShowClientError] = useState(false);

  // Server error message
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [showServerError, setShowServerError] = useState(false);

  // Popups
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);
  const [showPastedPopup, setShowPastedPopup] = useState(false);

  // Event handlers

  const handleShortened = async () => {
    setShortUrl("");
    setLoading(true);
    shorten(longUrl).then((result) => {
      if (result.status === "success") {
        setShortUrl(result.shortened_url);
      } else {
        setServerErrorMessage(result.error_message);
        // I wonder if we should just make this a useEffect
        setShowServerError(true);
      }
      setLoading(false);
    });
  };

  const handleInputChange = (value: string) => {
    if (shortUrl) {
      setShortUrl("");
    }
    if (showServerError) {
      setShowServerError(false);
    }

    setShowClientError(false);
    setLongUrl(value);
  };

  const handlePasteFromClipboard = async () => {
    const text = await pasteFromClipboard();
    if (text) {

      if (shortUrl) setShortUrl("")

      setLongUrl(text);
      setShowPastedPopup(true)
    }
  };

  const handleCopyToClipboard = async () => {
    copyToClipboard(shortUrl).then(() => {
      setShowCopiedPopup(true);
    });
  };

  // Debounced
  // Auto check if long url is valid
  useEffect(() => {
    setIsValidLongUrl(false);
    if (!longUrl) return;

    const handler = setTimeout(() => {
      // TODO: Maybe this could be a chain of responsibility thing that returns a list of errors
      if (!isValidURL(longUrl)) {
        setClientErrorMessage(
          "Must be a valid url. For example: https://google.com"
        );

        // TODO: Separate this logic? Maybe use a useEffect to detect changes in error message and then show?
        setShowClientError(true);
      } else {
        setIsValidLongUrl(true);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [longUrl]);

  // hide copied popup
  useEffect(() => {
    if (!showCopiedPopup) return;

    const handler = setTimeout(() => {
      setShowCopiedPopup(false);
    }, 800);

    return () => clearTimeout(handler);
  }, [showCopiedPopup]);

  // hide pasted popup
    useEffect(() => {
    if (!showPastedPopup) return;

    const handler = setTimeout(() => {
      setShowPastedPopup(false);
    }, 800);

    return () => clearTimeout(handler);
  }, [showPastedPopup]);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-blue-400 to-blue-700 text-white flex items-center flex-col font-roboto">
      <h1 className="text-4xl  font-light pb-20 pt-20">URL SHORTENER</h1>

      <div className="w-[90vw] max-w-[650px]">
        <p className="font-normal">Paste your long url below to shorten.</p>
      </div>

      {/* input */}
      <div className="w-[90vw] max-w-[650px]  mt-8 flex relative ">
        <div className="relative grow-1 bg-white py-3 px-4">
          <input
            type="text"
            className=" text-gray-800 disabled:text-gray-500 focus-visible:outline-none w-full "
            value={longUrl}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={loading}
          />

          {/* clipboard paste from */}
          <button
            onClick={handlePasteFromClipboard}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-900  hover:text-blue-700 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              />
            </svg>
          </button>

          {/* Copied from clipboard popup */}
          <div
            className={clsx(
              "absolute left-1/2 -translate-x-1/2 bg-green-50 p-3 text-green-800 flex gap-2 transition-opacity duration-300",
              showPastedPopup ? 'opacity-100': 'opacity-0',
              showClientError ? '-bottom-24': '-bottom-16'
            )}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                />
              </svg>
            </div>
            <span>Pasted from clipboard</span>
          </div>
        </div>

        {/* send */}

        {loading ? (
          <div className="h-[48px] aspect-square flex items-center justify-center bg-blue-900 cursor-not-allowed">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin  fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleShortened}
            className={`h-[48px] aspect-square  flex items-center
              hover:bg-blue-800 bg-blue-900
              justify-center  cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500`}
            disabled={!isValidLongUrl}
          >
            <div className=" ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </button>
        )}

        {/* Error message */}
        {showClientError && clientErrorMessage && (
          <div className="absolute w-full left-0 -bottom-2 ">
            <div className="relative w-full">
              <p className="absolute w-fit py-1 px-2 text-xs bg-white text-gray-800 top-0">
                <span className="text-red-500">* </span>
                {clientErrorMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {shortUrl && (
        <div className="w-[90vw] max-w-[650px] flex  flex-col mt-8">
          <h3 className="font-semibold">shortened url:</h3>

          {/* result */}
          <div className="flex justify-center mt-4">
            <div className="bg-white py-3  min-w-60 justify-between px-4 text-gray-800 w-fit flex items-center gap-4 relative">
              <span className="">{shortUrl}</span>

              <button
                className="text-blue-900  hover:text-blue-700 cursor-pointer"
                onClick={handleCopyToClipboard}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                  />
                </svg>
              </button>

              {/* Copied popup */}
              <div
                className={clsx(
                  "absolute -bottom-18 flex gap-2 px-3 py-3 left-1/2 -translate-x-1/2 text-green-800 bg-green-50 transition-opacity duration-300",
                  showCopiedPopup ? "opacity-100" : "opacity-0"
                )}
              >
                {/* icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                  />
                </svg>

                {/* text */}
                <span>Copied</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Server error message */}
      {showServerError && (
        <div className="flex items-center bg-white w-fit text-gray-800 py-2 px-3 gap-2 mt-8 mx-4">
          {/* icon */}
          <div className="text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-10"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <p>
            {serverErrorMessage ||
              "There was an error connecting to the server. Please try again later."}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
