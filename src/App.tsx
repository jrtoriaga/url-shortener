import { Masthead } from "./components/Masthead";
import { ResultCard } from "./components/ResultCard";
import { StatusMessage } from "./components/StatusMessage";
import { UrlForm } from "./components/UrlForm";
import { useShorten } from "./hooks/useShorten";

function App() {
  const {
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
  } = useShorten();

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col">
      <main className="mx-auto flex w-full max-w-[760px] grow flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
        <Masthead />

        <UrlForm
          value={longUrl}
          loading={loading}
          isValid={isValidLongUrl}
          showClientError={showClientError}
          clientErrorMessage={clientErrorMessage}
          onInputChange={updateInput}
          onShorten={handleShortened}
        />

        <StatusMessage show={showServerError} message={serverErrorMessage} />

        {shortUrl && <ResultCard shortUrl={shortUrl} />}
      </main>

      <footer className="mx-auto w-full max-w-[760px] px-5 pb-10 sm:px-8">
        <div className="mb-4 border-t border-rule" />
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-ink-faint sm:text-[0.68rem]">
          Printed on the web &middot; No trees were harmed
        </p>
      </footer>
    </div>
  );
}

export default App;
