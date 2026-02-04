
/**
 * Free URL Shortener Service (No API Key Required)
 * 
 * Uses TinyURL via a CORS Proxy to generate short links client-side.
 * This allows the app to remain stateless and zero-config.
 */

// We use 'api.allorigins.win' as a CORS proxy because TinyURL doesn't support client-side CORS.
// In a production environment, you should route this through your own simple backend function.
const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const TINY_API = "https://tinyurl.com/api-create.php?url=";

export const shortenUrl = async (longUrl: string, customAlias?: string): Promise<string | null> => {
  try {
    let endpoint = `${TINY_API}${encodeURIComponent(longUrl)}`;
    
    // Attempt to append custom alias (Note: TinyURL's simple API doesn't officially document alias support 
    // via this endpoint, but some versions accept it. If it fails, it usually falls back to random).
    if (customAlias) {
        // Strip spaces/special chars from alias for compatibility
        const cleanAlias = customAlias.replace(/[^a-zA-Z0-9-_]/g, '');
        if (cleanAlias) {
             endpoint += `&alias=${encodeURIComponent(cleanAlias)}`;
        }
    }

    // Wrap in CORS proxy
    const finalUrl = `${CORS_PROXY}${encodeURIComponent(endpoint)}`;

    const response = await fetch(finalUrl);
    
    if (!response.ok) {
        throw new Error(`Shortener HTTP Error: ${response.status}`);
    }

    const shortLink = await response.text();

    // Verify we got a valid TinyURL back
    if (shortLink && shortLink.startsWith('http')) {
        return shortLink;
    }
    
    return null;
  } catch (error) {
    console.warn("Shortener failed (Network or Proxy issue). Using long URL.", error);
    return null;
  }
};
