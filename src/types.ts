

export type Result =
  | { status: "success"; shortened_url: string }
  | { status: "error"; error_message: string };
