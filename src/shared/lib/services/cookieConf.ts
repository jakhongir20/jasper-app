export function getCookie(key: string) {
  if (!key) return;
  const regex = new RegExp(`(?:^|;\\s*)${key}\\s*=\\s*([^;]*)`);
  const match = document.cookie.match(regex);
  return match ? match[1] : undefined;
}

export function setCookie(
  key: string,
  value: string,
  options?: {
    domain?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    expires?: Date;
  },
) {
  let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)};`;
  cookieString += `Path=/;`;
  if (options?.domain) {
    cookieString += `Domain=${options.domain};`;
  }
  if (options?.maxAge) {
    cookieString += `Max-Age=${options.maxAge};`;
  }
  if (options?.expires) {
    cookieString += `Expires=${options.expires.toUTCString()};`;
  }
  if (options?.secure) {
    cookieString += `Secure;`;
  }
  if (options?.sameSite) {
    cookieString += `SameSite=${options.sameSite};`;
  }
  document.cookie = cookieString;
}

export function deleteCookie(
  key: string,
  options?: {
    domain?: string;
    path?: string;
  },
) {
  let cookieString = `${key}=; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  cookieString += `Path=${options?.path || "/"};`;
  if (options?.domain) {
    cookieString += `Domain=${options.domain};`;
  }
  document.cookie = cookieString;
}
