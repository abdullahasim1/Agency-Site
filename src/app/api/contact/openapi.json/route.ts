export async function GET(): Promise<Response> {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "DevRox Contact API",
      version: "1.0.0",
      description:
        "Submit a project enquiry via the contact form. All fields are required except phone and company. The API enforces a per-IP rate limit (5 requests per 10 minutes) and a honeypot `website` field (must be empty).",
      contact: {
        name: "DevRox",
        url: "https://thedevrox.com",
        email: "hello@thedevrox.com",
      },
    },
    servers: [
      {
        url: new URL("/api/contact", process.env.NEXT_PUBLIC_SITE_URL ?? "https://thedevrox.com").toString(),
        description: "Production",
      },
    ],
    paths: {
      "/api/contact": {
        post: {
          operationId: "submitContactEnquiry",
          summary: "Submit a new project enquiry",
          description:
            "Delivers the enquiry to the DevRox inbox via SMTP. Returns 200 on success (or silently drops honeypot submissions).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["fullName", "email", "projectType", "message"],
                  properties: {
                    fullName: {
                      type: "string",
                      maxLength: 100,
                      minLength: 2,
                      description: "Your full name",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      maxLength: 254,
                      description: "Business email for reply",
                    },
                    company: {
                      type: "string",
                      maxLength: 120,
                      description: "Your company or organisation (optional)",
                    },
                    phone: {
                      type: "string",
                      maxLength: 30,
                      description: "Phone number (optional)",
                    },
                    projectType: {
                      type: "string",
                      maxLength: 60,
                      description: "Type of project or service you are enquiring about",
                    },
                    budget: {
                      type: "string",
                      maxLength: 60,
                      description: "Indicative budget range (optional)",
                    },
                    message: {
                      type: "string",
                      maxLength: 5000,
                      minLength: 20,
                      description: "Describe the problem, goals and any existing systems",
                    },
                    website: {
                      type: "string",
                      maxLength: 0,
                      description: "Honeypot — must be empty",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Enquiry accepted (or honeypot silently accepted)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid JSON body",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean", enum: [false] },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "413": {
              description: "Request body too large (max 20 KB)",
            },
            "422": {
              description: "Validation failed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean", enum: [false] },
                      message: { type: "string" },
                      errors: {
                        type: "object",
                        additionalProperties: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            "429": {
              description: "Rate limit exceeded (5 requests per 10 min per IP)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean", enum: [false] },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "502": {
              description: "SMTP delivery failed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean", enum: [false] },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          "x-rate-limit": {
            max: 5,
            window: "10 minutes",
            scope: "per IP",
          },
        },
      },
    },
    components: {
      securitySchemes: {},
    },
  };

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}