export const DESK_COOKIE = "pt_desk";
export const DESK_COOKIE_VALUE = "1";

export function deskPasscodeConfigured() {
  return Boolean(process.env.DESK_PASSCODE?.trim());
}

export function expectedDeskPasscode() {
  return process.env.DESK_PASSCODE?.trim() || "";
}
