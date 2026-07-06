import { supabase } from "./supabase";

export interface CloudinaryResult {
  secure_url: string;
  public_id: string;
}

/**
 * Returns an optimized Cloudinary URL with auto-format (WebP) and quality compression.
 * Width is capped at 1200px for responsive gallery display.
 */
export const getOptimizedUrl = (url: string): string => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/");
};

/**
 * Helper to convert a File object to a Base64 Data URL.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a gallery image by converting it to Base64 and sending it to our secure /api/upload endpoint.
 */
export const uploadGalleryImage = async (file: File): Promise<CloudinaryResult> => {
  // Client-side validation for type and size
  const validExtensions = ["jpg", "jpeg", "png", "webp"];
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
  
  if (!validExtensions.includes(fileExt)) {
    throw new Error("Invalid file format. Only JPG, JPEG, PNG, and WEBP are permitted.");
  }
  
  if (file.size > 4.2 * 1024 * 1024) {
    throw new Error("File is too large. Maximum size allowed is 4.2MB to ensure clean transmission.");
  }

  const base64Data = await fileToBase64(file);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({ file: base64Data }),
    headers,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Cloudinary upload failed");
  }

  const result: CloudinaryResult = await res.json();
  return {
    secure_url: getOptimizedUrl(result.secure_url),
    public_id: result.public_id,
  };
};

/**
 * Permanently deletes an image from Cloudinary (reclaiming storage space) via /api/delete endpoint.
 */
export const deleteGalleryImage = async (public_id: string): Promise<void> => {
  if (!public_id) return;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  }

  const res = await fetch("/api/delete", {
    method: "POST",
    body: JSON.stringify({ public_id }),
    headers,
  });

  if (!res.ok) {
    const err = await res.json();
    console.warn("Cloudinary delete warning:", err.error || "Failed to delete from Cloudinary");
  }
};
