import crypto from "crypto";
import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.FLICKR_API_KEY;
  const apiSecret = process.env.FLICKR_API_SECRET;
  const boundary = "----flickrBoundary";

  // Get file data
  const body = JSON.parse(event.body || "{}");
  const { image } = body;

  if (!image) {
    return { statusCode: 400, body: "No image provided" };
  }

  try {
    // Flickr upload endpoint
    const uploadUrl = "https://up.flickr.com/services/upload/";

    const form = new FormData();
    form.append("api_key", apiKey);
    form.append("photo", Buffer.from(image.split(",")[1], "base64"), {
      filename: "upload.jpg",
    });
    form.append("format", "json");
    form.append("nojsoncallback", "1");

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: form,
    });

    const data = await res.text();
    return {
      statusCode: 200,
      body: data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
