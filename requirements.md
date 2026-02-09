# Automotive Reviews Website — Project Requirements

## 1. Goal

Build a multilingual automotive review website for the European market.

Users select a car brand and model and view aggregated ratings and user reviews.

Default language is English.

Supported languages:
- English (default)
- Portuguese
- French
- Spanish

No social interaction between users. Focus on structured reviews and aggregated scores.

---

## 2. Stack Constraints

- Frontend: SvelteKit
- Hosting and platform: Cloudflare-first approach
- Prefer:
  - Cloudflare Pages
  - Cloudflare Workers
  - Cloudflare KV / D1 if needed
  - Cloudflare Turnstile for bot protection
- Use existing external API: CarDataAPI
- API must support an eternal, unlimited API key

---

## 3. Data Sources

### 3.1 Vehicle Data

Use CarDataAPI for:
- Brands
- Models
- Vehicle metadata

Requirement:
- Generate and use a permanent unlimited API key.

### 3.2 Vehicle Images

Do not store images in database.

Image must be resolved at runtime using the same logic already defined in:
- carimg.html

Rules:
- Generate image URL dynamically
- No image persistence layer
- No image upload feature

---

## 4. Internationalization

- Default locale: English
- Full UI translation required
- Reviews remain in the language written by the user
- Static labels translated via i18n files

Content to translate:
- Navigation
- Forms
- Rating labels
- Empty states
- Buttons
- Errors

---

## 5. User Roles

### 5.1 Visitors
- Browse brands and models
- View aggregated ratings
- View reviews

### 5.2 Registered Users
- Register account
- Login/logout
- Create review
- Edit own review
- Delete own review

Restrictions:
- No comments on reviews
- No likes or votes on reviews
- No user-to-user messaging

---

## 6. Main User Flow

### 6.1 Browse

- User enters homepage
- Selects:
  - Brand
  - Model
- System routes to model review page

Route example:

/car/{brand}/{model}

---

## 7. Car Review Page Layout

### 7.1 Top Section

Contains:

- Vehicle image (dynamic from carimg logic)
- Summary rating card

Summary rating card shows:

- Overall average score (1–10)
- Star ratings (1–10 scale) for:
  - Reliability
  - Maintenance cost
  - Comfort
  - Performance
  - Fuel consumption

Score source:
- Average from all approved user reviews

### 7.2 Highlight Sentence

- Each review may include a one-line summary sentence
- Top card displays:
  - One random summary sentence
  - Selected randomly on each page load
- If none exists, hide this element

---

## 8. Empty State (No Reviews)

When no reviews exist for the model:

Show empty state block:
- Message: no reviews yet
- CTA: create the first review
- Visible button for logged users
- Login/register prompt for guests

---

## 9. Review Cards List

Each review appears as a card.

### 9.1 Review Card Fields

Header:
- Username
- Vehicle year
- Fuel type
- Transmission type
- Ownership status:
  - Current owner since date
  - Former owner from–to dates

Ratings (1–10 each):
- Reliability
- Maintenance cost
- Comfort
- Performance
- Fuel consumption

Text fields:
- Recommendation text (short paragraph)
- Pros (short text, char-limited)
- Cons (short text, char-limited)
- One-line experience summary (optional)

---

## 10. Review Submission

### 10.1 Access

Only authenticated users can submit.

### 10.2 Form Fields

Structured inputs:

Numeric ratings (1–10):
- Reliability
- Maintenance cost
- Comfort
- Performance
- Fuel consumption

Vehicle info:
- Year
- Fuel type
- Transmission
- Ownership status:
  - Current owner + start date
  - Former owner + start and end date

Text inputs:
- Recommendation text (required, max length)
- Pros (short, max length)
- Cons (short, max length)
- One-line summary (optional, short)

### 10.3 Rules

- One review per user per model
- User can:
  - Edit own review
  - Delete own review

---

## 11. Aggregation Logic

For each model:

Compute averages:
- Overall score = mean of all category ratings across reviews
- Category averages:
  - Reliability
  - Maintenance cost
  - Comfort
  - Performance
  - Fuel consumption

Update aggregates on:
- Review create
- Review edit
- Review delete

Aggregation can be:
- Precomputed and cached
- Or computed on read with cache layer

---

## 12. Authentication

Required features:
- Email + password login
- Registration
- Session management

Cloudflare-first options preferred:
- Worker-based auth
- Turnstile on register and login

---

## 13. API Layer

### 13.1 External

CarDataAPI:
- Brands
- Models
- Vehicle metadata

### 13.2 Internal

Custom API endpoints via Cloudflare Workers:

GET  /api/reviews?brand=&model=
POST /api/reviews
PUT  /api/reviews/{id}
DELETE /api/reviews/{id}
GET  /api/aggregates?brand=&model=

---

## 14. Storage

Required data:

- Users
- Reviews
- Aggregates (optional cache)

Suggested:
- Cloudflare D1 for relational data

Tables:

Users:
- id
- email
- password_hash
- created_at

Reviews:
- id
- user_id
- brand
- model
- year
- fuel_type
- transmission
- ownership_from
- ownership_to
- ratings fields
- pros
- cons
- recommendation
- summary_line
- created_at
- updated_at

---

## 15. Performance Rules

- No image storage
- Cache vehicle data responses
- Cache aggregates per model
- Use edge rendering where possible

---

## 16. Security

- Turnstile on:
  - Register
  - Login
  - Review submit
- Rate limit review endpoints
- Validate all numeric ranges (1–10)
- Sanitize text fields

---

## 17. Nice-to-Have (Optional Later)

- Sorting reviews by:
  - Newest
  - Highest score
  - Lowest maintenance score
- Filter by:
  - Fuel type
  - Transmission
- Verified owner badge based on stronger proof flow

---

## 18. Primary Business Goal

Primary objective of the site:

- Generate revenue through display advertising
- Focus on organic SEO traffic
- Prepare structure for heavy ad placement (AdSense and similar networks)
- Design every page to rank well in search engines

Product decisions must favor:
- Indexable content
- High page volume
- Strong keyword coverage
- Long-tail search queries per car model and year

---

## 19. SEO-First Architecture

### 19.1 Indexable Pages Required

Create static or prerendered pages for:

- Brand pages  
  /brand/{brand}

- Model pages  
  /car/{brand}/{model}

- Model + year pages (if data exists)  
  /car/{brand}/{model}/{year}

Each page must include:
- Unique title tag
- Unique meta description
- Structured headings (H1, H2, H3)
- Crawlable text content

Prefer:
- SSR or prerender in SvelteKit

---

## 20. Structured Data

Add schema markup (JSON-LD):

- Product schema for each car model
- AggregateRating schema using computed averages
- Review schema per user review

Fields to expose:
- ratingValue
- reviewCount
- author
- reviewBody
- itemReviewed

---

## 21. Content Expansion for SEO

Add a blog/content section.

Routes:

/blog/{slug}

Content types:

- Car buying guides
- Model comparisons
- Maintenance cost guides
- Reliability rankings
- Best cars for X lists
- Fuel consumption comparisons
- Transmission type guides

Rules:

- Each post targets one keyword cluster
- Evergreen content preferred
- Internal links to brand/model pages required

---

## 22. Programmatic SEO Pages

Generate pages automatically using data.

Examples:

- Best {brand} cars for fuel economy
- Most reliable {segment} cars
- {model} maintenance cost guide
- {model} reliability by year

These pages must include:
- Intro text
- Data tables
- Internal links
- FAQ sections

---

## 23. Ad Monetization Requirements

Layout must support many ad slots without layout break.

Prepare fixed ad areas:

- Top banner slot
- In-content banner after first section
- In-content banner between review cards
- Sidebar slot (desktop)
- Footer banner slot
- Sticky mobile bottom slot

Rules:

- No layout shift when ads load
- Reserve space with fixed containers
- Lazy load ads below the fold

---

## 24. AdSense Readiness Rules

Pages must include:

- Privacy policy page
- Terms page
- Contact page
- About page
- Cookie consent banner
- No thin pages with near-empty content

Review pages must show:
- Enough original text
- User generated content
- Aggregated stats
- Helpful structure

---

## 25. Performance for SEO + Ads

Targets:

- Fast LCP
- Low CLS even with ads
- Edge caching for model pages
- Image lazy loading
- Script splitting

---

## 26. Internal Linking Strategy

Every model page links to:

- Brand page
- Related models
- Blog posts mentioning the model

Every blog post links to:

- At least 3 model pages
- At least 1 brand page

Use keyword-based anchor text.

---

## 27. Sitemap and Crawling

Generate:

- XML sitemap auto-updated
- Separate sitemap for:
  - Cars
  - Brands
  - Blog posts

Provide:

- robots.txt
- Canonical URLs on every page

---

## 28. Content Quality Signals

Add visible helpful content blocks:

- FAQ per model
- Pros and cons summary from reviews
- Ownership tips section
- Maintenance notes

Goal:

- Increase dwell time
- Increase indexable text
- Improve ranking potential
