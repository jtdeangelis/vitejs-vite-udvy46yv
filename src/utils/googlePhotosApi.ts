// src/utils/googlePhotosApi.ts
/**
 * Expand a shortened Google Photos URL using a HEAD request.
 */
export const expandShortenedUrl = async (shortUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
    console.log('Expanded response:', response.url);
    return response.url || null;
  } catch (error) {
    console.error('Error expanding URL:', error);
    return null;
  }
};

/**
 * Extract the album ID from a Google Photos album URL.
 */
export const extractAlbumId = async (url: string): Promise<string | null> => {
  try {
    console.log('Extracting album ID from URL:', url);
    
    // Handle URLs with '/share/' format (most common)
    if (url.includes('/share/')) {
      // For URLs like: https://photos.google.com/share/AF1QipMpWQhrFLm9bW171skEbTOTOiQ_V...
      const shareMatch = url.match(/\/share\/([A-Za-z0-9_-]+)/);
      if (shareMatch && shareMatch[1]) {
        console.log('Extracted Album ID (share format):', shareMatch[1]);
        return shareMatch[1];
      }
    }
    
    // Handle URLs with direct album format
    if (url.includes('/album/')) {
      const albumMatch = url.match(/\/album\/([A-Za-z0-9_-]+)/);
      if (albumMatch && albumMatch[1]) {
        console.log('Extracted Album ID (album format):', albumMatch[1]);
        return albumMatch[1];
      }
    }
    
    // Handle shortened URLs
    if (url.includes('goo.gl/photos')) {
      console.warn('Shortened URL detected. Expanding...');
      const fullUrl = await expandShortenedUrl(url);
      if (!fullUrl) {
        console.error('Failed to expand shortened URL');
        return null;
      }
      url = fullUrl;
      console.log('Expanded URL:', url);
      // Try extraction again with expanded URL
      return extractAlbumId(url);
    }
    
    // Handle other formats or try generic extraction
    const genericMatch = url.match(/([A-Za-z0-9_-]{20,})/);
    if (genericMatch && genericMatch[1]) {
      console.log('Extracted Album ID (generic format):', genericMatch[1]);
      return genericMatch[1];
    }
    
    console.error('Failed to extract album ID from URL:', url);
    return null;
  } catch (err) {
    console.error('Error extracting album ID:', err);
    return null;
  }
};

/**
 * Fetch real photos from a Google Photos album using the official Photos API.
 * @param albumId - The album ID extracted from the URL.
 * @param accessToken - The OAuth access token obtained from Google.
 * @returns An array of photo base URLs.
 */
export async function fetchPhotosFromAlbum(
  albumIdOrObject: string | any,
  accessToken: string,
  pageSize: number = 25
): Promise<string[]> {
  try {
    // Extract album ID from the album object if provided
    const albumId = typeof albumIdOrObject === 'string' 
      ? albumIdOrObject 
      : albumIdOrObject?.id;
    
    if (!albumId) {
      throw new Error("No valid album ID provided");
    }
    
    console.log(`Fetching photos from album ID: ${albumId}`);
    
    // Log the request details for debugging
    const requestBody = {
      albumId,
      pageSize
    };
    
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    // Make the API request
    const response = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    // Get full response text for debugging
    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    
    // Parse JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing response:", e);
      throw new Error(`Invalid response: ${responseText.substring(0, 100)}...`);
    }
    
    // Handle error cases
    if (!response.ok) {
      console.error("API Error:", data.error || response.statusText);
      throw new Error(data.error?.message || `API error: ${response.status}`);
    }
    
    if (!data.mediaItems || !Array.isArray(data.mediaItems)) {
      console.warn("No media items found in album");
      return [];
    }
    
    console.log(`Found ${data.mediaItems.length} media items in album`);
    return data.mediaItems.map((item: any) => item.baseUrl);
  } catch (error) {
    console.error("Error fetching album items:", error);
    throw error;
  }
}

/**
 * Try to fetch specific shared album information
 * @param albumId - The album ID extracted from the URL.
 * @param accessToken - The OAuth access token obtained from Google.
 */
export async function getSharedAlbumInfo(albumId: string, accessToken: string) {
  try {
    const response = await fetch(`https://photoslibrary.googleapis.com/v1/albums/${albumId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`Error fetching album info: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching album info:", error);
    return null;
  }
}

/**
 * Alternative method to fetch photos when the API fails
 * This uses the search endpoint instead of album ID
 */
/**
 * Fetch user's personal photos as a reliable fallback method
 * This doesn't try to use album ID which can often fail with permissions issues
 */
export async function searchForPhotos(
  accessToken: string,
  filters?: { contentCategory?: string, dateFilter?: any },
  pageSize: number = 25
): Promise<string[]> {
  try {
    console.log("Searching for user's photos as fallback");
    
    // Default to fetching photos
    const contentCategory = filters?.contentCategory || "PHOTO";
    
    // This simplified request doesn't include any filters that might cause errors
    const requestBody = {
      pageSize
    };
    
    // Add filters only if specified
    if (filters) {
      requestBody["filters"] = {
        mediaTypeFilter: {
          mediaTypes: [contentCategory]
        }
      };
      
      if (filters.dateFilter) {
        requestBody["filters"]["dateFilter"] = filters.dateFilter;
      }
    }
    
    // Make the API request
    const response = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error(`Google Photos search API error (${response.status})`);
      try {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      } catch (e) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log(`Search returned ${data.mediaItems?.length || 0} items`);
    
    if (!data.mediaItems || !Array.isArray(data.mediaItems)) {
      console.warn("No media items found in search response");
      return [];
    }
    
    // Extract the base URLs
    return data.mediaItems.map((item: any) => item.baseUrl);
  } catch (error) {
    console.error("Error searching for photos:", error);
    throw error;
  }
}

/**
 * Find a shared album by title in the user's shared albums
 * @param accessToken - OAuth access token
 * @param searchTitle - Optional title to search for 
 * @returns First matching shared album or null
 */
export async function findSharedAlbumByTitle(
  accessToken: string,
  searchTitle?: string
): Promise<any | null> {
  try {
    console.log(`Fetching shared albums list${searchTitle ? ` to find "${searchTitle}"` : ''}`);
    
    // Request shared albums list from Google Photos API
    const response = await fetch("https://photoslibrary.googleapis.com/v1/sharedAlbums", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching shared albums: ${response.status}`, errorText);
      return null;
    }

    const data = await response.json();
    console.log(`Found ${data.sharedAlbums?.length || 0} shared albums`);
    
    // Return all shared albums if no search title provided
    if (!searchTitle || !data.sharedAlbums || data.sharedAlbums.length === 0) {
      return data.sharedAlbums?.[0] || null;
    }

    // Try to find an album with a matching title
    const matchingAlbum = data.sharedAlbums.find((album: any) => 
      album.title && album.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    
    return matchingAlbum || data.sharedAlbums[0];
  } catch (error) {
    console.error("Error fetching shared albums:", error);
    return null;
  }
}

export default {
  expandShortenedUrl,
  extractAlbumId,
  fetchPhotosFromAlbum,
  searchForPhotos,
  getSharedAlbumInfo
};