import type { StaticFormState, StaticQRKind } from "../types";

export const STATIC_KINDS: { id: StaticQRKind; label: string; hint: string }[] = [
  { id: "url", label: "URL", hint: "https://…" },
  { id: "text", label: "Text", hint: "Plain text" },
  { id: "wifi", label: "Wi-Fi", hint: "Join network" },
  { id: "vcard", label: "Contact sharing", hint: "Contact card" },
  { id: "email", label: "Email", hint: "mailto:" },
  { id: "sms", label: "SMS", hint: "smsto:" },
];

export const DEFAULT_STATIC_FORM: StaticFormState = {
  kind: "url",
  url: "https://inoqr.app",
  text: "Hello from INOQR",
  wifiSsid: "INOQR-Guest",
  wifiPassword: "",
  wifiEncryption: "WPA",
  vcardName: "Ada Lovelace",
  vcardPhone: "+1 555 010 2030",
  vcardEmail: "ada@example.com",
  vcardOrg: "INOQR",
  emailTo: "hello@example.com",
  emailSubject: "Hello",
  emailBody: "Sent via INOQR",
  smsNumber: "+15550102030",
  smsBody: "Hello from INOQR",
  fgColor: "#141414",
  bgColor: "#FFFFFF",
  size: 640,
  margin: 2,
  ecLevel: "M",
};

function escapeWifi(v: string): string {
  return v.replace(/([\\;,":])/g, "\\$1");
}

export function buildStaticPayload(form: StaticFormState): string {
  switch (form.kind) {
    case "url":
      return form.url.trim();
    case "text":
      return form.text;
    case "wifi": {
      const enc = form.wifiEncryption;
      return `WIFI:T:${enc};S:${escapeWifi(form.wifiSsid)};P:${escapeWifi(form.wifiPassword)};;`;
    }
    case "vcard": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${form.vcardName}`,
        form.vcardOrg ? `ORG:${form.vcardOrg}` : "",
        form.vcardPhone ? `TEL:${form.vcardPhone}` : "",
        form.vcardEmail ? `EMAIL:${form.vcardEmail}` : "",
        "END:VCARD",
      ].filter(Boolean);
      return lines.join("\n");
    }
    case "email": {
      const params = new URLSearchParams();
      if (form.emailSubject) params.set("subject", form.emailSubject);
      if (form.emailBody) params.set("body", form.emailBody);
      const qs = params.toString();
      return `mailto:${form.emailTo}${qs ? `?${qs}` : ""}`;
    }
    case "sms":
      return `SMSTO:${form.smsNumber}:${form.smsBody}`;
    default:
      return "";
  }
}

export function validateStaticForm(form: StaticFormState): Record<string, string> {
  const errors: Record<string, string> = {};
  if (form.kind === "url") {
    if (!form.url.trim()) errors.url = "Enter a URL.";
    else if (!/^https?:\/\/.+\..+/.test(form.url.trim()))
      errors.url = "Use a full URL starting with http:// or https://";
  }
  if (form.kind === "text" && !form.text.trim()) errors.text = "Enter some text.";
  if (form.kind === "wifi" && !form.wifiSsid.trim()) errors.wifiSsid = "Enter the network name.";
  if (form.kind === "vcard" && !form.vcardName.trim()) errors.vcardName = "Enter a display name.";
  if (form.kind === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.emailTo.trim()))
    errors.emailTo = "Enter a valid email address.";
  if (form.kind === "sms" && !form.smsNumber.trim()) errors.smsNumber = "Enter a phone number.";
  return errors;
}

export function payloadCharInfo(payload: string): { chars: number; level: "ok" | "warn" | "risk" } {
  const chars = payload.length;
  if (chars < 200) return { chars, level: "ok" };
  if (chars < 800) return { chars, level: "warn" };
  return { chars, level: "risk" };
}
