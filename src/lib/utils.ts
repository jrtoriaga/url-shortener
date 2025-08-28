


export function shorten(url: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(url.slice(0,10)), 1000)
    });
}

export function isValidURL(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
