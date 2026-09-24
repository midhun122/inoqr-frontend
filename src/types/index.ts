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
  fgColor: string;
  bgColor: string;
  size: number;
  margin: number;
  ecLevel: "L" | "M" | "Q" | "H";
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
