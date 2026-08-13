/**
 * Maps a technology name to a first-party brand logo in `/public/logos`.
 *
 * The SVGs are the official marks, vendored into the repo so the strip renders
 * with no external request and no new dependency. A name with no entry here —
 * a proprietary tool with no published mark, or a newly added one — simply falls
 * back to the accent dot, so editing the technology list in the panel can never
 * break the marquee.
 *
 * Keyed by the exact `name` in `src/content/technologies.json`.
 */
export const techLogos: Record<string, string> = {
  React: "/logos/react.svg",
  "Next.js": "/logos/nextjs.svg",
  TypeScript: "/logos/typescript.svg",
  "Tailwind CSS": "/logos/tailwindcss.svg",
  "Node.js": "/logos/nodejs.svg",
  Express: "/logos/express.svg",
  Python: "/logos/python.svg",
  FastAPI: "/logos/fastapi.svg",
  PostgreSQL: "/logos/postgresql.svg",
  MongoDB: "/logos/mongodb.svg",
  MySQL: "/logos/mysql.svg",
  Firebase: "/logos/firebase.svg",
  OpenAI: "/logos/openai.svg",
  Gemini: "/logos/gemini.svg",
  Claude: "/logos/claude.svg",
  "Amazon Bedrock": "/logos/aws.svg",
  "Hugging Face": "/logos/huggingface.svg",
  n8n: "/logos/n8n.svg",
  Make: "/logos/make.svg",
  Zapier: "/logos/zapier.svg",
  Twilio: "/logos/twilio.svg",
  ElevenLabs: "/logos/elevenlabs.svg",
  Vercel: "/logos/vercel.svg",
  Docker: "/logos/docker.svg",
  "GitHub Actions": "/logos/githubactions.svg",
  AWS: "/logos/aws.svg",
  "Amazon EC2": "/logos/aws.svg",
  "Amazon S3": "/logos/aws.svg",
  "AWS Lambda": "/logos/aws.svg",
  "Amazon RDS": "/logos/aws.svg",
  "Amazon ECS": "/logos/aws.svg",
  "Amazon CloudFront": "/logos/aws.svg",
  "AWS IAM": "/logos/aws.svg",
  "Amazon CloudWatch": "/logos/aws.svg",
};

/** The logo path for a technology, or `undefined` when there is no mark for it. */
export function techLogo(name: string): string | undefined {
  return techLogos[name];
}
