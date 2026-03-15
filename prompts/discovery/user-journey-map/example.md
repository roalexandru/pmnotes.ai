# User Journey Map: CampaignHub

## 1. Journey Overview

| Detail | Value |
| :--- | :--- |
| **Persona** | Mid-level marketing manager at a B2B SaaS company, 3–5 years experience, manages a team of 2–3, uses multiple tools for campaign management |
| **Core Goal** | Launch and track a multi-channel marketing campaign from planning through performance analysis |
| **Product** | CampaignHub — a marketing automation platform with email, social, and analytics modules |
| **Journey Scope** | Awareness → Evaluation → Onboarding → First Campaign → Ongoing Use → Advocacy |
| **Known Pain Points** | Template setup struggles, confusing report customization, low onboarding email open rates |

---

## 2. Stage-by-Stage Journey Map

### Stage 1: Awareness

*The user first discovers CampaignHub exists and recognizes it might solve a problem.*

**User Actions**
- Reads a LinkedIn post from a peer about consolidating marketing tools
- Searches Google for "best marketing automation platform for B2B"
- Skims a CampaignHub comparison article on a review site (G2 or Capterra)
- Visits the CampaignHub homepage and scans the feature list

**Touchpoints**
- LinkedIn feed, Google search results, third-party review sites, CampaignHub marketing website

**User Thoughts**
- "We're using three different tools and nothing talks to each other. There has to be a better way."
- "This looks promising, but I've been burned by platforms that overpromise on integrations."
- "I need something my team can actually adopt — not just another tool I end up managing alone."

**Emotional State**
- 😐 Neutral → Cautiously optimistic. The user is in research mode — interested but skeptical. They've tried new tools before and been disappointed.

**Pain Points & Friction**
- CampaignHub's pricing page requires a demo request for enterprise tiers — the user wants to self-serve and compare quickly.
- Review site comparisons are outdated and don't reflect recent features.
- The homepage is feature-heavy but doesn't clearly articulate the workflow benefit for a team lead managing multi-channel campaigns.

**Opportunities**
- Add a transparent pricing calculator that lets users estimate cost without a sales call.
- Publish fresh, detailed comparison pages targeting specific competitors (e.g., "CampaignHub vs. Mailchimp + Hootsuite + Google Analytics").
- Lead with a use-case-driven homepage section: "For marketing managers running multi-channel campaigns."

**Key Metrics**
- Website visit-to-signup conversion rate
- Time on pricing page
- Bounce rate on homepage

---

### Stage 2: Evaluation & Signup

*The user decides to try CampaignHub and creates an account.*

**User Actions**
- Watches a 3-minute product tour video
- Signs up for a 14-day free trial using work email
- Connects Google and LinkedIn ad accounts during onboarding wizard
- Invites one team member to join the workspace

**Touchpoints**
- Product tour video, signup page, onboarding wizard, email confirmation, team invite flow

**User Thoughts**
- "The product tour makes it look clean, but I need to see it working with our actual data."
- "Connecting accounts was easier than expected — good sign."
- "I'm not sure my teammate will have time to learn another tool this week."

**Emotional State**
- 😊 Positive. The signup is smooth and integrations connect without friction. Momentum is building.

**Pain Points & Friction**
- The onboarding wizard doesn't explain what each integration unlocks — the user connects things without understanding the payoff.
- Team invite email lands in spam for teammates using Outlook.
- No clear guidance on what to do first after the wizard completes — the user stares at an empty dashboard.

**Opportunities**
- Add contextual tooltips in the onboarding wizard: "Connecting LinkedIn lets you track ad spend alongside email performance in one dashboard."
- Partner with email deliverability service to improve invite email inbox placement.
- After onboarding wizard, present a "Your First Campaign in 10 Minutes" guided flow instead of an empty dashboard.

**Key Metrics**
- Trial signup rate (from pricing/tour page)
- Integration connection rate during onboarding
- Team invite acceptance rate

---

### Stage 3: Onboarding & Setup

*The user configures their workspace, templates, and preferences to prepare for their first campaign.*

**User Actions**
- Browses template gallery for email campaign templates
- Attempts to customize a template with brand colors, logo, and copy
- Sets up audience segments by importing a CSV of contacts
- Configures email sender domain and verifies DNS records

**Touchpoints**
- Template gallery, template editor, contact import tool, domain settings, help docs, onboarding email sequence

**User Thoughts**
- "These templates are okay but none of them match our brand. I'm going to have to spend an hour customizing."
- "Why do I need to verify DNS records? I don't manage our domain — I need to loop in IT."
- "The onboarding emails keep telling me things I've already done. Not helpful."

**Emotional State**
- 😟 Frustrated. The template customization feels clunky, DNS verification is a blocker that requires external help, and onboarding emails feel generic. Momentum stalls.

**Pain Points & Friction**
- **Template customization is rigid.** Users can't easily adjust layouts — only swap text and images in fixed blocks. This is the most frequently cited pain point.
- **DNS/sender domain verification requires technical knowledge** the user doesn't have, creating a dependency on IT teams with different timelines.
- **Onboarding emails have low open rates (18%)** because they're generic drip sequences, not triggered by actual user behavior.
- CSV import fails silently on rows with formatting issues — no clear error messages.

**Opportunities**
- Rebuild the template editor with drag-and-drop blocks and a live brand-kit feature that auto-applies logo, colors, and fonts.
- Create a one-click DNS setup guide with copy-paste records, and add an "invite your IT admin" flow that sends them just the technical steps.
- Replace drip onboarding emails with behavior-triggered messages (e.g., "You imported contacts — here's how to create your first segment").
- Show inline validation errors during CSV import with row-level detail.

**Key Metrics**
- Template customization completion rate
- Time from signup to sender domain verified
- Onboarding email open rate and click-through rate

---

### Stage 4: First Campaign Launch

*The user builds and launches their first real campaign through CampaignHub.*

**User Actions**
- Creates a new multi-channel campaign (email + LinkedIn)
- Writes email copy and schedules send for Tuesday 10am
- Sets up a LinkedIn promoted post linked to the same campaign
- Reviews the pre-send checklist and hits "Launch"

**Touchpoints**
- Campaign builder, email composer, LinkedIn integration, scheduling tool, pre-send checklist, confirmation screen

**User Thoughts**
- "This is the moment of truth — if this works well, I'm going to push for the paid plan."
- "I like that there's a pre-send checklist. Catches the stuff I'd normally miss."
- "Wait, I can't A/B test the email subject line on the free plan? That feels like a basic feature."

**Emotional State**
- 😊 Positive with a dip. The campaign builder is intuitive and the pre-send checklist builds confidence. But hitting a paywall on A/B testing during the first campaign creates a moment of friction.

**Pain Points & Friction**
- A/B testing is locked behind the Pro plan, which feels like a core feature being gated too aggressively for a trial user.
- The LinkedIn integration shows a 15-minute sync delay — the user doesn't know if the post actually published.
- No real-time preview of how the email renders across clients (Gmail, Outlook, Apple Mail).

**Opportunities**
- Allow one free A/B test per campaign on the trial plan — let users experience the value before asking them to pay.
- Add real-time sync status for LinkedIn with a progress indicator and push notification on completion.
- Integrate an email rendering preview (like Litmus) directly into the pre-send checklist.

**Key Metrics**
- First campaign launch rate (% of trial users who launch at least one campaign)
- Time from signup to first campaign launched
- Campaign builder completion rate (started vs. launched)

---

### Stage 5: Results & Analysis

*The user reviews campaign performance and tries to extract actionable insights.*

**User Actions**
- Opens the campaign dashboard the morning after launch
- Checks open rates, click-through rates, and LinkedIn engagement
- Attempts to build a custom report comparing email vs. social performance
- Exports a PDF report to share with their manager

**Touchpoints**
- Campaign dashboard, analytics module, custom report builder, PDF export, email summary notification

**User Thoughts**
- "The dashboard gives me the basics, but I need to compare channels side by side — where is that view?"
- "Building a custom report is way more complicated than it should be. Too many dropdowns and filter options."
- "My manager is going to ask about ROI. I can't calculate that from what's here."

**Emotional State**
- 😟 Frustrated. The basic dashboard is fine, but the custom reporting experience is confusing and the user can't easily get the cross-channel comparison they need for stakeholder communication.

**Pain Points & Friction**
- **Custom report builder is overly complex.** Too many configuration options without sensible defaults. Users abandon it and screenshot the basic dashboard instead.
- No native cross-channel comparison view — email and social metrics live in separate tabs.
- PDF export formatting is broken — tables overflow the page and charts lose their labels.
- No revenue attribution or ROI calculation, which is what managers and leadership actually care about.

**Opportunities**
- Ship pre-built report templates: "Campaign Summary," "Channel Comparison," "Executive Brief." Let users start from a template and customize.
- Create a unified cross-channel dashboard as the default campaign results view.
- Fix PDF export rendering and add a "Share Report" link that generates a live, view-only dashboard URL.
- Add simple ROI tracking: let users input campaign cost and connect to CRM for revenue attribution.

**Key Metrics**
- Report builder usage rate (started vs. completed)
- PDF export count per user
- Dashboard return visits within 48 hours of campaign launch

---

### Stage 6: Ongoing Use & Expansion

*The user runs multiple campaigns and integrates CampaignHub into their regular workflow.*

**User Actions**
- Creates campaign templates from their successful first campaign
- Sets up recurring weekly reports auto-sent to their manager
- Adds the second team member and assigns campaign ownership
- Explores the social scheduling module for organic posts

**Touchpoints**
- Template management, recurring reports, team management, role permissions, social scheduler, in-app feature announcements

**User Thoughts**
- "I'm starting to rely on this for our weekly rhythm. That's a good sign."
- "I wish I could set permissions so my team member can edit campaigns but not change the audience segments."
- "The social scheduler is basic compared to dedicated tools like Buffer. Not sure if it's worth consolidating."

**Emotional State**
- 😐 Neutral → 😊 Positive. The platform is becoming a habit, which is good. But gaps in permissions and the social module's limitations prevent full team adoption.

**Pain Points & Friction**
- Role-based permissions are too coarse — only "Admin" and "Member" roles, no granular control.
- Social scheduling lacks features like optimal send-time suggestions and bulk scheduling.
- Feature announcements show as modal pop-ups that interrupt workflow — users dismiss them without reading.

**Opportunities**
- Add granular permission roles: Campaign Editor, Analyst (read-only), Admin. Let workspace owners customize.
- Enhance social scheduling with AI-suggested posting times and bulk CSV upload for post queues.
- Replace modal announcements with a non-intrusive changelog sidebar or in-app notification center.

**Key Metrics**
- Campaigns launched per user per month (frequency)
- Team seats added beyond initial user
- Feature adoption breadth (% of modules used)

---

### Stage 7: Advocacy & Referral

*The user becomes a champion for CampaignHub and recommends it to others.*

**User Actions**
- Shares campaign results in a team all-hands, attributing success to CampaignHub
- Writes a G2 review after receiving an in-app prompt
- Refers a peer at another company through the referral program
- Provides feedback through a quarterly NPS survey

**Touchpoints**
- In-app review prompt, referral program page, NPS survey, G2/Capterra review sites, LinkedIn (organic sharing)

**User Thoughts**
- "CampaignHub genuinely saved me 4-5 hours a week. I'd recommend it to someone in my shoes."
- "The referral program gives me an account credit — nice, but I'd rather get access to a premium feature for a month."
- "I have ideas for improvement but I never know if my feedback actually goes anywhere."

**Emotional State**
- 🤩 Delighted. The user has experienced tangible value, their team relies on the product, and they're willing to advocate — if given the right nudge and incentive.

**Pain Points & Friction**
- Referral incentives feel transactional (account credit) rather than experiential (feature access, early beta, swag).
- No feedback loop — users submit NPS and feature requests but never hear back on what was built or prioritized.
- Review prompts appear at random times, not when the user just achieved a win (like after a successful campaign).

**Opportunities**
- Redesign referral incentives: offer one month of a premium feature, early access to betas, or CampaignHub swag box for top advocates.
- Close the feedback loop: send a quarterly "You asked, we built" email showing shipped features that were user-requested.
- Trigger review prompts contextually — after a user's campaign exceeds their previous best performance, or after they hit a usage milestone.

**Key Metrics**
- NPS score
- Referral program participation rate
- G2/Capterra review count and average rating

---

## 3. Moments of Truth

### Moment 1: The Empty Dashboard (Post-Onboarding)

**What happens:** The user completes the onboarding wizard and lands on an empty dashboard with no clear next step.

**Why it matters:** This is the highest-risk drop-off point. The user just invested effort in setup and expects momentum. An empty screen signals "you're on your own" and breaks the activation flow.

**What can go wrong:** The user closes the tab, intending to come back "when they have time." Most never do. Trial engagement drops by 60% if no meaningful action happens within the first session.

**How to win it:** Replace the empty dashboard with a guided "Launch Your First Campaign in 10 Minutes" flow. Pre-populate a sample campaign using the brand assets they just uploaded. Show progress — "3 of 5 steps complete."

---

### Moment 2: First Campaign Results (The Morning After)

**What happens:** The user opens CampaignHub the morning after their first campaign launch to see how it performed.

**Why it matters:** This is the value-confirmation moment. If the results are easy to understand and impressive to share, the user becomes a believer. If the dashboard is confusing or the data looks incomplete, trust erodes.

**What can go wrong:** Cross-channel data hasn't fully synced, so LinkedIn metrics show zeros. The user thinks the campaign failed or the integration broke. They lose confidence in data reliability.

**How to win it:** Ensure data syncs within 2 hours. Send a morning-after email summary with key highlights: "Your campaign reached 2,400 people — 18% open rate, 3.2% CTR. Here's how that compares to industry benchmarks." Make the user feel successful.

---

### Moment 3: Template Customization Wall (Onboarding)

**What happens:** The user tries to make a campaign template match their brand and hits the limitations of the editor.

**Why it matters:** Brand consistency is non-negotiable for marketing managers. If the tool can't produce on-brand output, it's a dealbreaker regardless of other features.

**What can go wrong:** The user spends 45 minutes wrestling with a rigid editor, produces something that looks "close enough," and resents the tool. Or worse — they give up and go back to their old tool.

**How to win it:** Invest in a flexible drag-and-drop editor. Offer a brand-kit feature where users upload logo, colors, and fonts once — every template auto-applies them. Provide a "design concierge" option during trial where the team customizes one template for the user.

---

### Moment 4: The Manager Ask (Results & Analysis)

**What happens:** The user's manager asks for a campaign performance summary and the user tries to build a report.

**Why it matters:** The user's internal credibility is on the line. If CampaignHub helps them look good in front of leadership, it becomes indispensable. If it makes reporting harder, it gets cut.

**What can go wrong:** The custom report builder is overwhelming, the PDF export looks broken, and the user ends up manually assembling a Google Slides deck from screenshots. CampaignHub becomes "another tool that can't do reporting right."

**How to win it:** Pre-built executive report templates with one-click generation. Include benchmark comparisons ("Your open rate was 22% — 4 points above industry average"). Make the user the hero in their own meeting.

---

### Moment 5: Team Adoption Tipping Point (Ongoing Use)

**What happens:** The user tries to bring their full team onto CampaignHub and needs role-based access and shared workflows.

**Why it matters:** Single-user tools get cut in budget reviews. Multi-user adoption makes the tool sticky and increases willingness to pay for higher tiers.

**What can go wrong:** Coarse permission settings mean the manager has to choose between giving teammates too much access or too little. Onboarding new team members requires the original user to hand-hold through every feature.

**How to win it:** Granular roles, a team onboarding checklist, and shared template libraries. When a second user launches their first campaign independently, that's the stickiness signal.

---

## 4. Journey Summary Table

| Stage | Sentiment | Top Pain Point | Top Opportunity | Key Metric |
| :--- | :--- | :--- | :--- | :--- |
| Awareness | 😐 Neutral | Pricing requires demo request | Self-serve pricing calculator | Visit-to-signup rate |
| Evaluation & Signup | 😊 Positive | Empty dashboard after onboarding wizard | "First Campaign in 10 Minutes" guided flow | Trial signup rate |
| Onboarding & Setup | 😟 Frustrated | Template customization is rigid | Drag-and-drop editor with brand kit | Template completion rate |
| First Campaign Launch | 😊 Positive (with dip) | A/B testing paywalled on trial | Allow one free A/B test per campaign | First campaign launch rate |
| Results & Analysis | 😟 Frustrated | Custom report builder is too complex | Pre-built report templates | Report completion rate |
| Ongoing Use & Expansion | 😊 Positive | Permissions are too coarse | Granular role-based access | Campaigns per user per month |
| Advocacy & Referral | 🤩 Delighted | No feedback loop on requests | "You asked, we built" email | NPS score |

---

## 5. Prioritized Opportunities

| # | Opportunity | Effort | Impact | Owner |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Guided "First Campaign" flow** replacing the empty dashboard | Medium | High | Product + Design |
| 2 | **Pre-built report templates** (Campaign Summary, Channel Comparison, Executive Brief) | Medium | High | Product + Analytics |
| 3 | **Drag-and-drop template editor** with brand-kit auto-apply | High | High | Engineering + Design |
| 4 | **Behavior-triggered onboarding emails** replacing generic drip sequence | Low | Medium | Marketing + Product |
| 5 | **Self-serve pricing calculator** on the website | Low | Medium | Marketing + Engineering |
| 6 | **Granular role-based permissions** (Campaign Editor, Analyst, Admin) | Medium | Medium | Engineering + Product |
| 7 | **Cross-channel unified dashboard** as default campaign results view | Medium | High | Product + Design |

---

## 6. Emotional Arc

The journey begins at a **neutral baseline** during the Awareness stage — the user is curious but skeptical, having been let down by tool-switching promises before. Emotion ticks **upward during Evaluation** as the signup experience is smooth and integrations connect easily. The user feels optimistic.

Then comes the first significant **dip during Onboarding & Setup**. Template customization friction and DNS verification blockers stall momentum. This is where many trial users go silent. The emotional low point is staring at a rigid template editor thinking "this is going to be another tool that almost works."

Emotion **recovers during First Campaign Launch** — the campaign builder is intuitive and the pre-send checklist builds confidence. But there's a minor dip when A/B testing is paywalled, reminding the user they're on a trial.

The **second major dip arrives during Results & Analysis** when the user needs to report on campaign performance. The custom report builder is overwhelming and the PDF export breaks formatting. The user's emotional state is tied directly to their ability to look competent in front of their manager.

From there, emotion **gradually climbs during Ongoing Use** as the product becomes part of the weekly workflow. The user starts seeing compound value — saved time, better visibility, team alignment.

The journey **peaks at Advocacy** — the user has genuinely improved their workflow and is willing to tell peers about it.

**Ideal trajectory after improvements:** Flatten the Onboarding dip by investing in the template editor and guided first-campaign flow. Eliminate the Results dip by shipping pre-built report templates. The goal is a steady upward slope from Evaluation through Advocacy, with no stage dropping below Neutral.

---

## 7. Next Steps

- **Validate with user interviews.** Recruit 6–8 trial users who churned and 6–8 who converted. Test whether the pain points identified here match their actual experience. Use the Customer Interview Guide prompt to structure these sessions.
- **Run a journey mapping workshop.** Bring together Product, Design, Marketing, and Support leads. Walk through this map, overlay support ticket data and analytics, and pressure-test the opportunity prioritization.
- **Instrument the key metrics.** Ensure analytics tracking is in place for each stage's key metric. Pay special attention to: first campaign launch rate, template completion rate, and report builder usage rate.
- **Prototype the top 2 opportunities.** Build quick prototypes of the guided first-campaign flow and the pre-built report templates. Test with 5 trial users in the next sprint.
- **Establish a journey health dashboard.** Create a recurring dashboard that tracks sentiment proxies (NPS by cohort, support ticket themes, feature adoption rates) mapped to journey stages. Review monthly.
