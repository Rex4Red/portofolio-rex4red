"use client";

import { useState } from "react";

/**
 * Maps common skill names (case-insensitive) to Simple Icons slugs.
 * See https://simpleicons.org for all available icons.
 */
const ICON_SLUG_MAP: Record<string, string> = {
  // Languages
  "typescript": "typescript",
  "javascript": "javascript",
  "python": "python",
  "java": "java",
  "c++": "cplusplus",
  "c#": "csharp",
  "c": "c",
  "go": "go",
  "rust": "rust",
  "dart": "dart",
  "kotlin": "kotlin",
  "swift": "swift",
  "php": "php",
  "ruby": "ruby",
  "r": "r",
  "lua": "lua",
  "scala": "scala",
  "elixir": "elixir",
  "haskell": "haskell",

  // Frontend
  "react": "react",
  "react native": "react",
  "next.js": "nextdotjs",
  "nextjs": "nextdotjs",
  "vue": "vuedotjs",
  "vue.js": "vuedotjs",
  "angular": "angular",
  "svelte": "svelte",
  "nuxt": "nuxtdotjs",
  "nuxt.js": "nuxtdotjs",
  "astro": "astro",
  "gatsby": "gatsby",
  "solid": "solid",
  "solidjs": "solid",
  "remix": "remix",
  "html": "html5",
  "html5": "html5",
  "css": "css3",
  "css3": "css3",
  "sass": "sass",
  "scss": "sass",
  "less": "less",

  // CSS Frameworks
  "tailwind css": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "tailwind": "tailwindcss",
  "bootstrap": "bootstrap",
  "material ui": "mui",
  "mui": "mui",
  "chakra ui": "chakraui",
  "shadcn": "shadcnui",
  "shadcn/ui": "shadcnui",
  "styled-components": "styledcomponents",
  "ant design": "antdesign",

  // Backend / Runtime
  "node.js": "nodedotjs",
  "nodejs": "nodedotjs",
  "node": "nodedotjs",
  "express": "express",
  "express.js": "express",
  "fastify": "fastify",
  "nest.js": "nestjs",
  "nestjs": "nestjs",
  "deno": "deno",
  "bun": "bun",
  "django": "django",
  "flask": "flask",
  "fastapi": "fastapi",
  "spring": "spring",
  "spring boot": "springboot",
  "laravel": "laravel",
  "rails": "rubyonrails",
  "ruby on rails": "rubyonrails",
  ".net": "dotnet",
  "asp.net": "dotnet",

  // Mobile
  "flutter": "flutter",
  "android": "android",
  "ios": "ios",
  "expo": "expo",

  // Databases
  "postgresql": "postgresql",
  "postgres": "postgresql",
  "mysql": "mysql",
  "mongodb": "mongodb",
  "redis": "redis",
  "sqlite": "sqlite",
  "supabase": "supabase",
  "firebase": "firebase",
  "firestore": "firebase",
  "mariadb": "mariadb",
  "cassandra": "apachecassandra",
  "dynamodb": "amazondynamodb",
  "prisma": "prisma",

  // DevOps / Cloud
  "docker": "docker",
  "kubernetes": "kubernetes",
  "k8s": "kubernetes",
  "aws": "amazonaws",
  "gcp": "googlecloud",
  "google cloud": "googlecloud",
  "azure": "microsoftazure",
  "vercel": "vercel",
  "netlify": "netlify",
  "heroku": "heroku",
  "digitalocean": "digitalocean",
  "nginx": "nginx",
  "apache": "apache",
  "linux": "linux",
  "ubuntu": "ubuntu",
  "terraform": "terraform",
  "ansible": "ansible",
  "jenkins": "jenkins",
  "github actions": "githubactions",
  "circleci": "circleci",

  // Tools
  "git": "git",
  "github": "github",
  "gitlab": "gitlab",
  "bitbucket": "bitbucket",
  "vscode": "visualstudiocode",
  "vs code": "visualstudiocode",
  "figma": "figma",
  "postman": "postman",
  "insomnia": "insomnia",
  "jira": "jira",
  "notion": "notion",
  "slack": "slack",
  "discord": "discord",
  "npm": "npm",
  "yarn": "yarn",
  "pnpm": "pnpm",
  "webpack": "webpack",
  "vite": "vite",
  "eslint": "eslint",
  "prettier": "prettier",
  "babel": "babel",
  "storybook": "storybook",

  // Testing
  "jest": "jest",
  "cypress": "cypress",
  "playwright": "playwright",
  "vitest": "vitest",
  "selenium": "selenium",

  // AI / ML
  "tensorflow": "tensorflow",
  "pytorch": "pytorch",
  "openai": "openai",
  "langchain": "langchain",
  "hugging face": "huggingface",

  // Other
  "graphql": "graphql",
  "rest api": "swagger",
  "stripe": "stripe",
  "cloudinary": "cloudinary",
  "sanity": "sanity",
  "contentful": "contentful",
  "wordpress": "wordpress",
  "shopify": "shopify",
  "electron": "electron",
  "tauri": "tauri",
  "threejs": "threedotjs",
  "three.js": "threedotjs",
  "socket.io": "socketdotio",
  "rabbitmq": "rabbitmq",
  "kafka": "apachekafka",
  "grpc": "grpc",
  "arduino": "arduino",
  "raspberry pi": "raspberrypi",
  "blender": "blender",
  "unity": "unity",
  "unreal engine": "unrealengine",
};

/**
 * Custom hex colors for icons that look bad in white
 * (e.g., the official brand color for better recognition)
 */
const ICON_COLORS: Record<string, string> = {
  "react": "61DAFB",
  "typescript": "3178C6",
  "javascript": "F7DF1E",
  "python": "3776AB",
  "flutter": "02569B",
  "dart": "0175C2",
  "firebase": "DD2C00",
  "tailwindcss": "06B6D4",
  "nextdotjs": "FFFFFF",
  "nodedotjs": "5FA04E",
  "postgresql": "4169E1",
  "docker": "2496ED",
  "git": "F05032",
  "figma": "F24E1E",
  "html5": "E34F26",
  "css3": "1572B6",
  "mongodb": "47A248",
  "redis": "FF4438",
  "vue.js": "4FC08D",
  "angular": "0F0F11",
  "svelte": "FF3E00",
  "go": "00ADD8",
  "rust": "000000",
  "kotlin": "7F52FF",
  "swift": "F05138",
  "java": "437291",
};

function getSlug(skillName: string): string | null {
  const key = skillName.toLowerCase().trim();
  return ICON_SLUG_MAP[key] || null;
}

function getColor(slug: string): string {
  return ICON_COLORS[slug] || "FFFFFF";
}

export function TechIcon({
  name,
  size = 16,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const slug = getSlug(name);

  if (!slug || hasError) {
    return null; // No icon, Badge will render text-only
  }

  const color = getColor(slug);

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
