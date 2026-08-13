# DevRox CMS Guide

The CMS lives at `/keystatic`.

## Daily Editing

Use the sidebar in this order:

1. **CRUD: add, edit, delete**
   - Add, edit, or remove Services.
   - Add, edit, or remove Projects.

2. **Page text**
   - Change headings, paragraphs, SEO text, buttons, and form labels for each page.
   - These entries are single forms. Do not use them for adding new services or projects.

3. **Reusable sections**
   - Edit repeated site blocks like stats, process steps, FAQ questions, testimonials, industries, technologies, team, values, and capabilities.

4. **Forms & business info**
   - Edit contact form dropdown options.
   - Edit agency name, URL, contact details, social links, and footer/shared copy.

5. **Legal**
   - Edit privacy policy, terms, effective date, and legal disclaimer.

## Add A Service

1. Open **CRUD: add, edit, delete**.
2. Open **Services - add / edit / delete**.
3. Click **Add**.
4. Fill the service title, card description, full description, deliverables, use cases, FAQ, related projects, accent, featured, and display order.
5. Save.

Important fields:

- **URL slug** becomes `/services/your-slug`. Avoid changing it after publish.
- **Internal ID** is not shown on the site. Keep it stable.
- **Display order** controls sorting. Lower numbers show first.
- **Related projects** must use project URL slugs, for example `verivoice`.

## Add A Project

1. Open **CRUD: add, edit, delete**.
2. Open **Projects - add / edit / delete**.
3. Click **Add**.
4. Fill the project title, card category, filters, descriptions, images, stack, features, challenge, solution, results, gallery, workflow, overview, featured, accent, and display order.
5. Save.
6. Run `npm run art` if the project needs generated placeholder artwork.

Important fields:

- **URL slug** becomes `/portfolio/your-slug`. Avoid changing it after publish.
- **Portfolio filters** decide which filter tabs show the project.
- **Results** should only contain verified client-approved numbers.
- **Display order** controls sorting. Lower numbers show first.

## Safe Rule

If a field says **Developer field**, do not change it unless you are also updating links/code that depend on it.
