# 🤖 AI Prompt Template for Project JSON (ChatGPT / Claude)

Use this prompt with **ChatGPT**, **Claude**, or **Gemini** to instantly generate a 100% valid, copy-paste ready JSON for your DevRox Agency project.

---

## 📋 Copy & Paste This Prompt into ChatGPT / Claude:

```markdown
Act as a senior technical copywriter and agency case study specialist for DevRox, a high-end AI & custom software engineering studio.

Generate a complete, valid JSON object for a portfolio case study based on the project details below.

PROJECT DETAILS:
- Project Name: [INSERT PROJECT NAME HERE, e.g. RecruitFlow AI]
- Tagline / Brief: [INSERT 1-SENTENCE SUMMARY OF WHAT IT DOES]
- Category: [Choose from: AI, Automation, Web Apps, Mobile, SaaS]
- Key Technologies Used: [e.g. Next.js, OpenAI, Python, PostgreSQL, n8n]
- What Problem Did It Solve: [e.g. High manual hiring screening time, messy candidate data]
- Key Metrics / Results: [e.g. 70% faster screening, 4.5x candidate throughput]

RULES:
1. Do NOT include any "image" or "cover" image path in the JSON (DevRox handles image uploads automatically).
2. Output ONLY the raw valid JSON inside a code block, with no conversational preamble or markdown explanations outside the JSON block.
3. Ensure the JSON follows the exact schema below:

{
  "title": "<Project Title>",
  "basics": {
    "id": "prj-<slug-id>",
    "tagline": "<Compelling 5-8 word tagline>"
  },
  "category": "<Card Category, e.g. AI / Recruitment>",
  "categories": ["AI", "SaaS", "Automation"],
  "listing": {
    "shortDescription": "<1-2 punchy sentences describing what the platform does for cards>",
    "fullDescription": "<2-3 engaging sentences explaining what the project is, the core stack, and the business impact for the case study hero>"
  },
  "technologies": ["Next.js", "React", "TypeScript", "Python", "OpenAI"],
  "techStack": [
    {
      "group": "Frontend",
      "items": ["Next.js", "React", "TypeScript", "Tailwind CSS"]
    },
    {
      "group": "AI & Backend",
      "items": ["Python", "OpenAI", "FastAPI", "PostgreSQL"]
    },
    {
      "group": "Automation & Cloud",
      "items": ["n8n", "Docker", "AWS"]
    }
  ],
  "features": [
    {
      "title": "<Feature 1 Title>",
      "description": "<Feature 1 explanation>",
      "icon": "Sparkles"
    },
    {
      "title": "<Feature 2 Title>",
      "description": "<Feature 2 explanation>",
      "icon": "Zap"
    },
    {
      "title": "<Feature 3 Title>",
      "description": "<Feature 3 explanation>",
      "icon": "Brain"
    },
    {
      "title": "<Feature 4 Title>",
      "description": "<Feature 4 explanation>",
      "icon": "ShieldCheck"
    }
  ],
  "challenge": {
    "summary": "<2 sentences explaining the client's bottleneck before the engagement>",
    "points": [
      {
        "icon": "Layers",
        "title": "<Pain point 1>",
        "description": "<1-2 sentences on pain point 1>"
      },
      {
        "icon": "Puzzle",
        "title": "<Pain point 2>",
        "description": "<1-2 sentences on pain point 2>"
      },
      {
        "icon": "AlertTriangle",
        "title": "<Pain point 3>",
        "description": "<1-2 sentences on pain point 3>"
      }
    ]
  },
  "solution": {
    "summary": "<2 sentences explaining the technical architecture DevRox delivered>",
    "points": [
      {
        "icon": "Cpu",
        "title": "<Solution component 1>",
        "description": "<1-2 sentences explaining component 1>"
      },
      {
        "icon": "Workflow",
        "title": "<Solution component 2>",
        "description": "<1-2 sentences explaining component 2>"
      },
      {
        "icon": "CheckCircle2",
        "title": "<Solution component 3>",
        "description": "<1-2 sentences explaining component 3>"
      }
    ]
  },
  "objectives": [
    "<Objective 1>",
    "<Objective 2>",
    "<Objective 3>",
    "<Objective 4>"
  ],
  "closing": {
    "clientOverview": "<1-2 sentences on who the client / target market is>",
    "conclusion": "<2-3 sentences summarizing the long-term success of the build>"
  },
  "results": [
    {
      "value": "75%",
      "label": "<Key metric label>",
      "detail": "<Context of metric>"
    },
    {
      "value": "3.5x",
      "label": "<Speed / Efficiency label>",
      "detail": "<Context of metric>"
    },
    {
      "value": "< 2w",
      "label": "<Delivery time>",
      "detail": "<Context of metric>"
    }
  ],
  "workflow": [
    {
      "id": "w1",
      "tag": "INGEST",
      "title": "<Step 1 Title>",
      "description": "<Step 1 details>"
    },
    {
      "id": "w2",
      "tag": "PROCESS",
      "title": "<Step 2 Title>",
      "description": "<Step 2 details>"
    },
    {
      "id": "w3",
      "tag": "EXECUTE",
      "title": "<Step 3 Title>",
      "description": "<Step 3 details>"
    }
  ],
  "workflowLayout": "linear",
  "overview": {
    "client": "Confidential Client",
    "industry": "<Industry, e.g. HR Tech / SaaS>",
    "timeline": "6 weeks",
    "year": "2026",
    "platforms": ["Web Application"],
    "services": ["AI Automation", "Web Application Development"],
    "team": "2 engineers, 1 designer"
  },
  "featured": true,
  "accent": "brand",
  "order": 30
}
```

---

## 🚀 How To Use:
1. Copy the prompt above into ChatGPT.
2. Fill in your project name, what it does, and technologies.
3. ChatGPT will generate the JSON instantly.
4. Go to `/keystatic` ➔ **Portfolio page** ➔ **Projects** ➔ **New**.
5. Upload your cover image in **Cover image**.
6. Paste ChatGPT's output into **Raw JSON (Paste your project JSON here)** and hit **Save**!
