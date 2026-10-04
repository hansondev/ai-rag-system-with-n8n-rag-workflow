import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Chat Based RAG Document Upload & Query App",
    short_name: "RAG Chat",
    description:
      "This is the Agentic RAG System Chat App With Uploading Own Documents and Chat With Your Documents Like ChatGPT",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
