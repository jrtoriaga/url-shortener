import { createElement } from "react";
import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "../src/App";

const VALID_URL = "https://www.example.com/some/very/long/path";
const SHORT_URL = "https://bit.ly/abc123";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

// The url input is exposed with `role="url-input"` in UrlForm.tsx.
const getInput = () => screen.getByRole("url-input") as HTMLInputElement;

// The paste button is the only button with an accessible "paste" name.
const getPasteButton = () =>
  screen.getByRole("button", { name: /paste from clipboard/i });

// The input row wrapping the input, paste button and the submit ("send") button.
const getInputRow = () => getInput().closest("div.flex") as HTMLElement;

// The submit button lives in the input row and is the last button there.
// During loading it is replaced by a spinner, so this must be queried when idle.
const getSendButton = () => {
  const buttons = within(getInputRow()).getAllByRole("button");
  return buttons[buttons.length - 1] as HTMLButtonElement;
};

// The copy button lives inside the shortened-url result block.
const getCopyButton = () => {
  const result = screen.getByText(SHORT_URL).parentElement as HTMLElement;
  return within(result).getByRole("button");
};

// Show the send button only after the debounced validation marks the url valid.
const typeUrlAndWaitForSubmit = async (url: string) => {
  fireEvent.change(getInput(), { target: { value: url } });
  await waitFor(() => expect(getSendButton()).toBeEnabled(), { timeout: 2000 });
};

const mockSuccessfulShorten = () =>
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ shortUrl: SHORT_URL }),
  });

const mockFailedShorten = () =>
  vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({}),
  });

const submitValidUrl = async () => {
  await typeUrlAndWaitForSubmit(VALID_URL);
  fireEvent.click(getSendButton());
};

// jsdom does not implement the Clipboard API, so we provide a fresh,
// controllable mock (tests may override the resolved read/write values).
const installClipboardMock = () => {
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(""),
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                                Test lifecycle                              */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  installClipboardMock();
});

afterEach(() => {
  vi.unstubAllGlobals();
});


/* -------------------------------------------------------------------------- */
/*                                   Tests                                    */
/* -------------------------------------------------------------------------- */

describe("URL Shortener app", () => {
  describe("shortening a URL", () => {
    it("shortens a valid URL and displays the shortened url", async () => {
      vi.stubGlobal("fetch", mockSuccessfulShorten());

      render(createElement(App));
      expect(screen.queryByText(SHORT_URL)).not.toBeInTheDocument();

      await submitValidUrl();

      expect(await screen.findByText(SHORT_URL)).toBeInTheDocument();
      expect(screen.getByText(/shortened url/i)).toBeInTheDocument();
    });

    it("POSTs the long url to the shorten function", async () => {
      const fetchMock = mockSuccessfulShorten();
      vi.stubGlobal("fetch", fetchMock);

      render(createElement(App));
      await submitValidUrl();
      await screen.findByText(SHORT_URL);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "/.netlify/functions/shorten",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ url: VALID_URL }),
        })
      );
    });

    it("keeps the submit button disabled while the url is empty or invalid", async () => {
      vi.stubGlobal("fetch", mockSuccessfulShorten());
      render(createElement(App));

      // Empty input.
      expect(getSendButton()).toBeDisabled();

      // Invalid input.
      fireEvent.change(getInput(), { target: { value: "not a valid url" } });
      await waitFor(
        () => expect(screen.getByText(/must be a valid url/i)).toBeInTheDocument(),
        { timeout: 2000 }
      );
      expect(getSendButton()).toBeDisabled();

      // Valid input enables it.
      fireEvent.change(getInput(), { target: { value: VALID_URL } });
      await waitFor(() => expect(getSendButton()).toBeEnabled(), { timeout: 2000 });
    });

    it("clears a previously shortened url when the input changes", async () => {
      vi.stubGlobal("fetch", mockSuccessfulShorten());

      render(createElement(App));
      await submitValidUrl();
      expect(await screen.findByText(SHORT_URL)).toBeInTheDocument();

      fireEvent.change(getInput(), { target: { value: "https://changed.example.com" } });

      await waitFor(() => expect(screen.queryByText(SHORT_URL)).not.toBeInTheDocument());
    });
  });


  describe("copying the shortened url", () => {
    it("copies the shortened url to the clipboard immediately", async () => {
      vi.stubGlobal("fetch", mockSuccessfulShorten());

      render(createElement(App));
      await submitValidUrl();
      await screen.findByText(SHORT_URL);

      fireEvent.click(getCopyButton());

      await waitFor(() =>
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(SHORT_URL)
      );
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });

    it("shows the 'Copied' popup after copying", async () => {
      vi.stubGlobal("fetch", mockSuccessfulShorten());

      render(createElement(App));
      await submitValidUrl();
      await screen.findByText(SHORT_URL);

      const copiedPopup = screen.getByText("Copied").parentElement as HTMLElement;
      expect(copiedPopup).toHaveClass("opacity-0");

      fireEvent.click(getCopyButton());

      await waitFor(() => expect(copiedPopup).toHaveClass("opacity-100"));
    });

    it("hides the 'Copied' popup automatically", async () => {
      vi.stubGlobal("fetch", mockSuccessfulShorten());

      render(createElement(App));
      await submitValidUrl();
      await screen.findByText(SHORT_URL);

      const copiedPopup = screen.getByText("Copied").parentElement as HTMLElement;
      fireEvent.click(getCopyButton());
      await waitFor(() => expect(copiedPopup).toHaveClass("opacity-100"));

      await waitFor(() => expect(copiedPopup).toHaveClass("opacity-0"), {
        timeout: 2000,
      });
    });
  });

  describe("pasting from the clipboard", () => {
    it("pastes the clipboard content into the input and shows the popup", async () => {
      const pastedUrl = "https://pasted.example.com/into/input";
      (navigator.clipboard.readText as Mock).mockResolvedValue(pastedUrl);

      render(createElement(App));
      const pastedPopup = screen.getByText("Pasted from clipboard").parentElement as HTMLElement;
      expect(pastedPopup).toHaveClass("opacity-0");

      fireEvent.click(getPasteButton());

      await waitFor(() => expect(getInput().value).toBe(pastedUrl));
      expect(navigator.clipboard.readText).toHaveBeenCalledTimes(1);
      expect(pastedPopup).toHaveClass("opacity-100");
    });

    it("does nothing when the clipboard is empty", async () => {
      (navigator.clipboard.readText as Mock).mockResolvedValue("");

      render(createElement(App));
      fireEvent.click(getPasteButton());

      const pastedPopup = screen.getByText("Pasted from clipboard").parentElement as HTMLElement;
      expect(getInput().value).toBe("");
      expect(pastedPopup).toHaveClass("opacity-0");
    });
  });


  describe("validation and errors", () => {
    it("shows a client error message for an invalid url", async () => {
      vi.stubGlobal("fetch", mockSuccessfulShorten());
      render(createElement(App));

      fireEvent.change(getInput(), { target: { value: "definitely-not-a-url" } });

      expect(
        await screen.findByText(/must be a valid url/i, {}, { timeout: 2000 })
      ).toBeInTheDocument();
      expect(getSendButton()).toBeDisabled();
    });

    it("shows a server error message when shortening fails", async () => {
      vi.stubGlobal("fetch", mockFailedShorten());

      render(createElement(App));
      await submitValidUrl();

      expect(
        await screen.findByText(/something went wrong/i, {}, { timeout: 2000 })
      ).toBeInTheDocument();
    });

    it("recovers from a server error once the input changes", async () => {
      vi.stubGlobal("fetch", mockFailedShorten());

      render(createElement(App));
      await submitValidUrl();
      await screen.findByText(/something went wrong/i, {}, { timeout: 2000 });

      fireEvent.change(getInput(), { target: { value: "https://another.example.com" } });

      await waitFor(() =>
        expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
      );
    });
  });
});

