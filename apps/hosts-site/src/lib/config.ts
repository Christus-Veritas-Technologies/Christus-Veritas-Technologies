/** WhatsApp number from env — set NEXT_PUBLIC_WHATSAPP_NUMBER in your .env */
export const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.`;
