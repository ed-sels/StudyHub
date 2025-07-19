// src/pages/api/upload.ts
export const prerender = false;

import type { APIRoute } from "astro";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  bodyParser: false,
};

export const POST: APIRoute = async (context) => {
  const req = (context as any).locals?.node?.req;
  const res = (context as any).locals?.node?.res;

  if (!req || !res) {
    console.error("Missing Node.js request/response");
    return new Response("Server mode required", { status: 500 });
  }

  const form = formidable({
    uploadDir: "./uploads",
    keepExtensions: true,
    multiples: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return resolve(new Response("Upload failed", { status: 500 }));
      }

      const file = files.studyFile?.[0];
      if (!file) {
        return resolve(new Response("No file received", { status: 400 }));
      }

      const fileName = path.basename(file.originalFilename || file.newFilename);
      return resolve(new Response(`File uploaded successfully: ${fileName}`, { status: 200 }));
    });
  });
};
