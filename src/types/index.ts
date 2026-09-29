export type StaticQRKind = "url" | "text" | "wifi" | "vcard" | "email" | "sms";

export interface StaticFormState {
  kind: StaticQRKind;
  url: string;
  text: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: "WPA" | "WEP" | "nopass";
  vcardName: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardOrg: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  smsNumber: string;
  smsBody: string;
}

export interface DynamicLink {
  id: string;
  title: string;
  slug: string;
  destination: string;
  scans: number;
  updatedAt: string;
  createdAt: string;
  active: boolean;
}

export interface QRExportOptions {
  fgColor: string;
  bgColor: string;
  size: number;
}

/* ── QR customization (shared by static + dynamic flows) ────────── */

export type QRModuleStyle =
  | "square"
  | "rounded"
  | "dots"
  | "extra-rounded"
  | "classy"
  | "classy-rounded";

export type QREyeBorderStyle = "square" | "extra-rounded" | "circle";
export type QREyeCenterStyle = "square" | "dot" | "diamond" | "round";

export type QRLogoType = "none" | "builtin" | "upload";
export type QRLogoSize = "sm" | "md" | "lg";

export type QRErrorCorrection = "L" | "M" | "Q" | "H";

export interface QRCustomization {
  moduleStyle: QRModuleStyle;
  foregroundColor: string;
  backgroundColor: string;
  eyeBorderStyle: QREyeBorderStyle;
  eyeCenterStyle: QREyeCenterStyle;
  /** Empty string = follow the module (foreground) color. */
  eyeBorderColor: string;
  /** Empty string = follow the module (foreground) color. */
  eyeCenterColor: string;
  logoType: QRLogoType;
  builtinLogo: string | null;
  /** Data URL of the composited logo tile (built-in or uploaded). */
  uploadedLogo: string | null;
  logoSize: QRLogoSize;
  errorCorrection: QRErrorCorrection;
  /** Designer module motif id ("none" or a MODULE_MOTIFS id). */
  moduleMotif: string;
}

export const DEFAULT_QR_CUSTOMIZATION: QRCustomization = {
  moduleStyle: "square",
  foregroundColor: "#000000",
  backgroundColor: "#FFFFFF",
  eyeBorderStyle: "square",
  eyeCenterStyle: "square",
  eyeBorderColor: "",
  eyeCenterColor: "",
  logoType: "none",
  builtinLogo: null,
  uploadedLogo: null,
  logoSize: "md",
  errorCorrection: "M",
  moduleMotif: "none",
};
