import { defineConfig, ViteDevServer, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import crypto from "crypto";
import { IncomingMessage, ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.url?.startsWith("/api/upload") || req.url?.startsWith("/api/delete")) {
            let body = "";
            req.on("data", (chunk: any) => {
              body += chunk;
            });
            req.on("end", async () => {
              try {
                const parsedBody = body ? JSON.parse(body) : {};
                const CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
                const API_KEY = env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
                const API_SECRET = env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

                if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
                  throw new Error("Missing Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).");
                }

                if (req.url?.startsWith("/api/upload")) {
                  const { file } = parsedBody;
                  if (!file) throw new Error("No file provided");

                  const timestamp = Math.floor(Date.now() / 1000).toString();
                  const folder = "ignitia/gallery";
                  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
                  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

                  const formData = new URLSearchParams();
                  formData.append("file", file);
                  formData.append("api_key", API_KEY);
                  formData.append("timestamp", timestamp);
                  formData.append("signature", signature);
                  formData.append("folder", folder);

                  const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: "POST",
                    body: formData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                  });

                  const result = (await cldRes.json()) as any;
                  if (!cldRes.ok) throw new Error(result.error?.message || "Cloudinary upload failed");

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ secure_url: result.secure_url, public_id: result.public_id }));
                } else if (req.url?.startsWith("/api/delete")) {
                  const { public_id } = parsedBody;
                  if (!public_id) throw new Error("No public_id provided");

                  const timestamp = Math.floor(Date.now() / 1000).toString();
                  const paramsToSign = `public_id=${public_id}&timestamp=${timestamp}${API_SECRET}`;
                  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

                  const formData = new URLSearchParams();
                  formData.append("public_id", public_id);
                  formData.append("api_key", API_KEY);
                  formData.append("timestamp", timestamp);
                  formData.append("signature", signature);

                  const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
                    method: "POST",
                    body: formData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                  });

                  const result = (await cldRes.json()) as any;
                  if (!cldRes.ok) throw new Error(result.error?.message || "Cloudinary delete failed");

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(result));
                }
              } catch (err: any) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
