import { useState, useRef } from "react";

// ─── Question Data ────────────────────────────────────────────────────────────
const Q = [
  // PILLAR 1: Strategy and Intent (Q1-Q3)
  { n:1,  p:"Strategy & Intent",          w:3,   t:"Personalization Purpose", sub:"Does your organization have a defined reason for personalizing, tied to a business goal?",
    a:["We have no personalization strategy. We personalize because the tool allows it or because it feels like something we should be doing.",
       "We have a general strategy but it is designed for a broad audience. We do not differentiate our approach by target audience.",
       "We understand our ICP well enough to know our strategy needs to address different stages. Our channels have specific roles depending on where the customer is.",
       "We have a strategy for each target customer profile, understanding their jobs to be done, what makes them different, and what our properties need to do for each.",
       "We have a business strategy with nested strategies that roll up to it. Channels, content, and experience strategies are all aligned with each ICP and their specific journey."]},
  { n:2,  p:"Strategy & Intent",          w:2.5, t:"Customer Journey Alignment", sub:"Is personalization designed around where customers are in their journey?",
    a:["We have not mapped a customer journey for any audience.",
       "We have outlined a journey we want customers to follow. It is fairly linear and we do not yet have reliable data on how people actually move through it.",
       "We have a journey defined with measurement to track progression. It addresses needs generally across all segments but we have gaps in understanding the full picture.",
       "We have data showing different journeys for our main ICPs. We understand the role each property plays across journey stages and are beginning to tailor experiences accordingly.",
       "We have multiple journeys defined for our main ICPs. We know which segment is on a property and at which stage, tailor accordingly, and measure through the full funnel."]},
  { n:3,  p:"Strategy & Intent",          w:2,   t:"Targeting vs. Personalization", sub:"Does the team understand the difference between targeting and true personalization?",
    a:["We do not do any targeting or personalization. Everyone gets the same experience.",
       "We target ads and channels to certain groups, usually based on assumptions rather than behavioral evidence.",
       "We have data showing what content should be served to which segment and mechanisms to deliver it.",
       "We not only target the right audience but personalize the message and experience to their journey stage and needs.",
       "Our experiences are fully tailored with the right product, message, timing, and framing for each ICP segment. We understand the difference between who we are targeting and what we are personalizing."]},

  // PILLAR 2: Segmentation Discipline (Q4-Q6)
  { n:4,  p:"Segmentation",               w:2,   t:"Segment Discovery", sub:"How does your organization identify which segments exist and matter?",
    a:["Segments have been developed through opinions and assumptions. No data has been used to validate them.",
       "We use demographics and easily accessible variables to bucket customers into groups. We have not confirmed whether these reflect real behavioral differences.",
       "Segments were discovered through testing and data analysis showing that different groups may behave differently.",
       "We found different behavior through observation and data. We have segmented those behavioral differences and continue to test and validate them.",
       "Segments are vetted through data analysis and experimentation. Discovery is an ongoing discipline. We continuously look for behavioral drift or change over time."]},
  { n:5,  p:"Segmentation",               w:2.5, t:"Segment Validation", sub:"Are segments validated against actual behavioral differences -- or just defined by demographics?",
    a:["Segments are defined by opinions and easily accessible variables. They are not compared to other segments.",
       "We have segments defined by variables we can capture. We have some data showing these groups exist but have not confirmed they behave differently.",
       "Our segments are compared with other segments. Early data suggests they exhibit meaningfully different behavior.",
       "We compare and test our segments for actual behavioral differences and actively challenge whether a segment is real or just a demographic cut.",
       "Segments are constantly compared and challenged. Specific tests are designed to probe what actually differentiates each group. Data is monitored continuously for behavioral drift."]},
  { n:6,  p:"Segmentation",               w:1.5, t:"Segment Sizing and ROI", sub:"Does the team evaluate whether a segment is large enough and valuable enough to justify the effort?",
    a:["If we can technically target a segment, we do. There is no vetting, analysis, or sizing before we commit resources.",
       "We generally look at segment size but never determine whether the ROI justifies pursuing that segment with dedicated personalization investment.",
       "Segments are vetted through analysis of behavioral differentiation, size, and basic ROI calculation before resources are committed.",
       "We have established criteria for when a segment is worth pursuing. Segments go through a vetting process and are not created simply because the capability exists.",
       "We weigh new segments against competing priorities, factor in maintenance cost over time, and require justification that includes projected lift and effort estimate."]},

  // PILLAR 3: Data and Readiness (Q7-Q9)
  { n:7,  p:"Data & Readiness",           w:2.5, t:"Data Quality and Trust", sub:"Does your team have reliable, trusted data on how different segments behave?",
    a:["We have minimal reliable data on customer behavior. Personalization decisions are made on assumptions rather than data.",
       "We collect data in several systems but it lives in silos. There are known accuracy concerns and the team defaults to opinion when the data is unclear.",
       "We have a primary analytics source the team generally trusts. There are still gaps but we can make basic personalization decisions from what we have.",
       "Data is reasonably reliable and accessible to the people making personalization decisions. Quality issues are identified and addressed when found.",
       "Data is trusted, well-governed, and accessible across the systems that drive personalization decisions. Data quality is monitored proactively with clear ownership."]},
  { n:8,  p:"Data & Readiness",           w:2,   t:"Behavioral Signal Collection", sub:"Are the right behavioral signals being captured to identify segments and trigger personalized experiences?",
    a:["We capture basic pageview data but have not instrumented behavioral signals beyond standard analytics defaults.",
       "We track some behavioral events but inconsistently. We can identify some patterns but lack depth to reliably trigger personalized experiences.",
       "We have defined behavioral signals that matter and implemented tracking for most of them. We can use these signals to inform some personalization triggers.",
       "We systematically capture behavioral signals across key journey stages and use them to both define segments and trigger personalized experiences.",
       "Behavioral signal collection is intentional, comprehensive, and governed. We continuously evaluate whether our signals are predictive and identify new signals worth adding."]},
  { n:9,  p:"Data & Readiness",           w:3,   t:"Identity Resolution", sub:"Can your organization recognize the same person across sessions, devices, and channels?",
    a:["We treat every visit as anonymous. All personalization is based on in-session signals only.",
       "We can recognize some returning visitors through cookies or login but our identity data is fragmented. We have limited ability to use prior behavior to inform the current session.",
       "We can identify a meaningful portion of returning visitors and use basic profile data to shape personalized experiences. Cross-device stitching is limited.",
       "We have a functioning identity resolution approach for known visitors. We use behavioral history to personalize beyond the current session.",
       "We have a unified first-party data strategy. Known visitors receive experiences informed by their full behavioral history. We use progressive profiling to build profiles for anonymous visitors over time."]},

  // PILLAR 4: Content and Creative Architecture (Q10-Q11)
  { n:10, p:"Content Architecture",       w:2,   t:"Content Mapping", sub:"Do you have a structured map of what content is served to which segment at which journey stage?",
    a:["We have no content map. Personalization decisions are made based on whatever content happens to be available.",
       "We have content organized loosely by topic but it is not mapped to specific segments or journey stages. Personalization pulls from this library reactively.",
       "We have begun mapping content to broad journey stages but have not yet mapped by segment. Some content gaps are identified but not systematically addressed.",
       "We have a working content map connecting content to both journey stage and primary ICP. Gaps have been identified and content creation is planned to address them.",
       "Our content architecture is fully integrated with our personalization strategy. Content is tagged by segment, journey stage, and intent signal. Gaps are identified proactively through performance data."]},
  { n:11, p:"Content Architecture",       w:1.5, t:"Message Differentiation", sub:"Are value propositions and messages genuinely different for different segments -- or is it surface-level customization?",
    a:["Our messaging is identical across all segments. We make no attempt to differentiate the value proposition for different audiences.",
       "We make surface-level personalizations -- matching ad creative to landing page, inserting a company name -- but the core message is the same for all segments.",
       "We have developed segment-specific messaging for our primary ICPs. The value proposition is differentiated but still broad. We are beginning to test whether it outperforms our general approach.",
       "Segment-specific value propositions are defined and validated through testing. We know our primary segments respond to different frames, evidence types, and calls to action.",
       "Message differentiation is deeply integrated with our personalization strategy. We understand objections and motivations at each journey stage and construct experiences that address them specifically."]},

  // PILLAR 5: Technology and Implementation (Q12-Q13)
  { n:12, p:"Technology",                 w:2.5, t:"Tool Selection and Fit", sub:"Does your technology stack support the personalization approach you are trying to execute?",
    a:["Personalization is executed using tools not designed for it. We have no dedicated personalization capability.",
       "We use our A/B testing platform for personalization. It handles basic segment targeting but creates complexity and conflicts as we try to scale.",
       "We have a tool that supports current personalization needs but are aware of gaps as our ambitions grow.",
       "Our technology stack is well matched to our current personalization strategy. Tools are configured to read behavioral signals, deliver to defined segments, and report on performance.",
       "Our stack is purpose-built for personalization at scale. Tools are integrated, data flows cleanly across systems, and our capability can expand to new channels and segments without re-architecture."]},
  { n:13, p:"Technology",                 w:1.5, t:"Testing and Personalization Separation", sub:"Has your organization separated personalization delivery from experimentation tooling?",
    a:["We do not yet run personalization at a scale where this is a concern. We have not considered the operational implications.",
       "We run both testing and personalization in the same tool and are beginning to experience conflicts -- traffic distribution issues, unclear reporting, or audience overlap problems.",
       "We are aware that testing and personalization need to be operationally separated and are in the process of defining how to do this.",
       "We have separated primary personalization delivery from our testing program. The two run in different configurations with clear protocols for how they interact.",
       "Testing and personalization operate as distinct, well-integrated programs. Each has its own tooling, governance, and roadmap. Traffic conflicts are architected away at the platform level."]},

  // PILLAR 6: Experimentation and Validation (Q14-Q15)
  { n:14, p:"Experimentation",            w:2,   t:"Testing Before Personalizing", sub:"Does your organization validate personalized experiences through experimentation before committing to permanent delivery?",
    a:["Personalized experiences are deployed based on assumptions without any experimental validation.",
       "We occasionally test personalization assumptions but it is not consistent. Most experiences are deployed based on team confidence rather than evidence.",
       "We test our primary personalization hypotheses before deploying them permanently. Testing is becoming standard though not yet universal.",
       "Testing before personalizing is a defined part of our process. New campaigns go through a validation phase. Exceptions require justification.",
       "Experimental validation is embedded as a non-negotiable step. Insights from validation testing systematically inform the ongoing personalization strategy."]},
  { n:15, p:"Experimentation",            w:1.5, t:"Using Tests to Discover Segments", sub:"Does your organization use experiment results to discover which segments behave differently?",
    a:["We analyze experiment results only at the aggregate level. We do not break results down by segment to look for differential responses.",
       "We occasionally look at segment-level results but it is not systematic. When we find differences we do not have a reliable process for turning them into personalization initiatives.",
       "We have begun systematically analyzing experiment results by our primary segments. When we find behavioral differences we document them and consider them as inputs to our personalization roadmap.",
       "Segment-level analysis is a standard part of our experiment readout process. We actively look for differential responses as a way to discover new personalization opportunities.",
       "We design experiments with segment discovery as an explicit secondary objective. Our personalization roadmap is substantially driven by what our experimentation program surfaces."]},

  // PILLAR 7: Measurement and Performance (Q16-Q17)
  { n:16, p:"Measurement",                w:2.5, t:"Personalization Measurement", sub:"Can your organization measure whether personalization is working -- by segment, not just overall?",
    a:["We measure overall conversion rates and cannot separate personalization performance from general site performance.",
       "We have some visibility into personalization performance but it is inconsistent. We cannot reliably measure whether a campaign is outperforming the default for a targeted segment.",
       "We have defined primary KPIs for our main personalization campaigns. We can measure performance against a baseline for our most important experiences.",
       "Personalization-specific KPIs are defined before campaigns launch. We measure performance against a control condition and report at the segment level on a regular cadence.",
       "Personalization measurement is fully integrated into performance reporting. Every active experience has defined KPIs, a baseline comparison, and a reporting cadence."]},
  { n:17, p:"Measurement",                w:1.5, t:"ROI and Resource Accountability", sub:"Is the effort and cost of personalization measured against the business return it produces?",
    a:["We do not track resources invested in personalization or connect them to business outcomes. There is no ROI accountability.",
       "We have a general sense of what personalization costs but have not connected that investment to specific outcomes. We cannot tell which campaigns are generating sufficient return.",
       "We track resource investment in our primary campaigns and can estimate revenue or conversion impact. ROI calculations are informal and not on a consistent cadence.",
       "We have a defined approach to evaluating personalization ROI. Campaigns are reviewed against their resource cost and business outcome regularly. Underperforming campaigns are improved or retired.",
       "ROI accountability is built into our program governance. Every active campaign has a documented cost and measured outcome. Resource allocation is driven by projected ROI, not team preference."]},

  // PILLAR 8: Organization and Governance (Q18-Q20)
  { n:18, p:"Organization",               w:3,   t:"Ownership and Accountability", sub:"Is there a defined owner for personalization strategy and execution?",
    a:["Personalization has no defined owner. Activities happen in different teams without coordination. No one is accountable for strategy or results.",
       "Ownership is informal. There is a team or individual who tends to lead personalization efforts but it is not a defined responsibility and it competes with other priorities.",
       "There is a recognized owner with some dedicated time and authority over direction. Accountability is improving but governance and process are still developing.",
       "Personalization has a clear owner with defined responsibilities and accountability for results. The ownership model is documented and understood across contributing teams.",
       "Personalization ownership is embedded in the organizational structure. The owner has the authority, resources, and mandate to drive the program strategically with accountability tied to measurable outcomes."]},
  { n:19, p:"Organization",               w:1.5, t:"Cross-Functional Collaboration", sub:"Is the coordination across content, data, design, development, and marketing working -- or is it a bottleneck?",
    a:["There is no structured collaboration across teams. Cross-functional dependencies regularly cause campaigns to stall or be abandoned.",
       "Collaboration happens on an ad hoc basis. There are no defined processes for how personalization work is scoped, prioritized, or executed across teams.",
       "We have informal processes for cross-functional personalization work. Teams understand their roles. Coordination works for straightforward campaigns but breaks down for complex ones.",
       "Cross-functional collaboration is governed by a defined process. Teams have clear roles, a shared prioritization mechanism, and personalization work is visible on team roadmaps.",
       "Personalization operates as a fully integrated cross-functional program. Teams have dedicated capacity. Collaboration is structured and producing program velocity that matches strategic ambitions."]},
  { n:20, p:"Organization",               w:2,   t:"Executive Sponsorship", sub:"Is personalization treated as a strategic capability with leadership support?",
    a:["Personalization is not on leadership's agenda. It is treated as a marketing tactic managed entirely at the team level.",
       "Some leaders are supportive in principle but there is no formal sponsorship, dedicated budget, or inclusion of personalization results in business performance reviews.",
       "Personalization has a leadership champion who advocates for it and helps secure resources. Formal sponsorship is emerging but not yet fully established.",
       "Personalization has explicit executive sponsorship. It is included in business planning, has a dedicated budget, and results are reviewed at the leadership level.",
       "Personalization is recognized at the executive level as a strategic growth capability with consistent resource allocation, defined strategic goals, and leadership accountability for outcomes."]},
];

// ─── Pillars and colors ───────────────────────────────────────────────────────
const PILLARS = ["Strategy & Intent","Segmentation","Data & Readiness","Content Architecture","Technology","Experimentation","Measurement","Organization"];
const PCOL = {
  "Strategy & Intent":   "#2B6CB0",
  "Segmentation":        "#553C9A",
  "Data & Readiness":    "#276749",
  "Content Architecture":"#C05621",
  "Technology":          "#2C7A7B",
  "Experimentation":     "#975A16",
  "Measurement":         "#702459",
  "Organization":        "#1a365d",
};
const LETTERS = ["A","B","C","D","E"];

// ─── MAX score calculation ────────────────────────────────────────────────────
const MAX = Q.reduce((s, q) => s + 5 * q.w, 0);

// ─── Scoring ──────────────────────────────────────────────────────────────────
function score(ans) {
  let tot = 0;
  const pt = {}, pm = {};
  PILLARS.forEach(p => { pt[p] = 0; pm[p] = 0; });
  Q.forEach((q, i) => {
    const v = (ans[i] + 1) * q.w;
    tot += v;
    pt[q.p] += v;
    pm[q.p] += 5 * q.w;
  });
  const overall = Math.round((tot / MAX) * 100);
  const pillar = {};
  PILLARS.forEach(p => { pillar[p] = pm[p] > 0 ? Math.round((pt[p] / pm[p]) * 100) : 0; });
  const perQ = Q.map((_, i) => Math.round(((ans[i] + 1) / 5) * 100));
  return { overall, pillar, perQ };
}

// ─── Stage labels -- readiness framing ───────────────────────────────────────
function stage(s) {
  if (s >= 90) return { label: "Leading",    color: "#2B6CB0" };
  if (s >= 75) return { label: "Scaling",    color: "#276749" };
  if (s >= 60) return { label: "Establishing", color: "#B7791F" };
  if (s >= 40) return { label: "Building",   color: "#C05621" };
  return              { label: "Exploring",  color: "#553C9A" };
}

// ─── Focus areas ─────────────────────────────────────────────────────────────
function focusAreas(ans, n = 5) {
  return Q.map((q, i) => {
    const gap = 5 - (ans[i] + 1);
    const tier = q.w >= 3 ? 1 : q.w >= 2.5 ? 2 : q.w >= 2 ? 3 : 4;
    const boost = tier === 1 ? 1.4 : tier === 2 ? 1.15 : 1;
    return { i, score: gap * q.w * boost };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, n).map(x => x.i);
}

// ─── Static focus recommendations ────────────────────────────────────────────
const FOCUS_RECS = {
  1:  "Personalization without a strategy is just sophisticated guessing. The most common failure mode is starting with the tool -- learning what it can do and then looking for things to personalize -- rather than starting with the business question of who you are trying to serve and what a better experience would actually accomplish for them. The discipline here is to write down the answer to three questions before any personalization work begins: what business goal does this serve, which audience does it target, and what does success look like in measurable terms. Without that clarity upfront, the program will accumulate campaigns without a direction, and results will be impossible to defend.",
  2:  "A journey that exists on a whiteboard but not in your analytics is a plan, not a system. The most important investment at this stage is closing the gap between the journey you designed and the journey your customers are actually taking -- which almost always looks different. That means instrumenting the key transition points in your analytics, reviewing actual path data, and identifying where customers are falling out or taking unexpected routes. Once you can see what is actually happening, the personalization decisions become much more obvious, and the experiments you run to improve the journey are grounded in real behavior rather than assumption.",
  3:  "The distinction between targeting and personalization matters more than it might seem. Targeting is about audience selection -- getting your message in front of the right people. Personalization is about what happens after the click -- whether the experience they encounter addresses their specific needs, language, and situation. Many organizations invest heavily in targeting precision and then deliver a generic experience on arrival, which creates an expectation-reality mismatch that costs conversions. The next step is to audit one key landing experience: are visitors from different acquisition sources encountering the same content regardless of what brought them there? If so, that gap is your first personalization opportunity.",
  4:  "The best segments are not the ones that are easiest to define -- they are the ones that behave most differently from each other in ways you can act on. Most organizations start with demographic or technographic segments because the data is accessible, not because those segments have proven to behave differently. The discipline is to validate before you build: before investing resources in a tailored experience for a segment, confirm that the segment actually exhibits different behavior in your analytics. A segment that responds identically to your general population is not a personalization opportunity no matter how cleanly it can be defined.",
  5:  "Segment validation is the step that separates personalization programs that compound from ones that accumulate activity without results. The core discipline is comparison: a segment only reveals its value when measured against another segment. Mobile visitors versus desktop visitors. Enterprise accounts versus SMBs. First-time visitors versus fifth-time visitors. That comparison is where the behavioral difference either appears or does not. If it appears, you have a personalization hypothesis worth testing. If it does not, you have saved significant resources you would have spent building for an audience that responds just like everyone else.",
  6:  "Segment sizing is a resource allocation discipline that most programs skip entirely. The question is not whether a segment is technically targetable but whether the return on personalizing for it justifies the cost of building and maintaining a tailored experience. A segment that represents two percent of your traffic and shows different behavior may still not be worth the development and creative cycles unless that two percent represents disproportionate revenue. Run the calculation before you build: how many visitors will this affect, what do they represent in conversion value, how long will it take to build, and how much ongoing maintenance will it require? The answer to that calculation should drive the decision.",
  7:  "Data trust is more important than data volume. Many organizations have significant amounts of behavioral data and almost no confidence in it -- because different systems tell different stories, because events are instrumented inconsistently, or because past inaccuracies have trained the team to ignore data when it is inconvenient. Before investing in personalization sophistication, the higher-leverage work is almost always to clean up the data foundation: standardize event naming, validate that key metrics reconcile across systems, and build the organizational agreement about which data is authoritative for which decisions. A personalization program built on data that no one trusts will not get the investment it needs to succeed.",
  8:  "The behavioral signals you collect are the raw material of your personalization program. The gap between what you are currently capturing and what would actually be useful is usually significant and worth mapping explicitly. Start by identifying the three or four behavioral signals that would most change your personalization decisions if you had them reliably: return visit count, content category affinity, in-session search behavior, pricing page visits, form abandonment, content download history. Then assess whether those signals are actually being captured, consistently and accessibly. The instrumentation work required to fill those gaps is almost always less expensive than the personalization opportunity it unlocks.",
  9:  "Identity resolution is the capability that separates reactive personalization from intelligent personalization. When every visit is treated as anonymous, your program is limited to responding to what a customer is doing in this moment -- it has no memory of what they have done before, what content they have already consumed, or how far they are in their decision process. Closing this gap does not require rebuilding your entire data infrastructure. It starts with two questions: what percentage of your visitors can you actually recognize on return, and for those you can recognize, what historical behavioral data is accessible to your personalization system? Answering those questions honestly tells you exactly where to invest next.",
  10: "A content map is what separates an intentional personalization strategy from a reactive one. Without it, personalization decisions are made based on whatever content exists rather than what each segment actually needs at each stage of their journey. The practical starting point is a simple matrix: your primary ICPs down one axis, your key journey stages across the other, and an honest assessment in each cell of whether content exists, what it is, and whether it is actually serving that combination well. The gaps in that matrix are your content roadmap. Building for personalization without that map means you will consistently discover content gaps after you have committed to a campaign, not before.",
  11: "Surface-level personalization -- matching a logo, inserting a company name, reflecting the ad creative on the landing page -- is a starting point, not a destination. The leverage in personalization comes from genuinely different value propositions for genuinely different audiences: different arguments, different proof points, different framings of the same product. Getting to that level of differentiation requires actually knowing what each segment cares about, which comes from research -- customer interviews, sales call review, support pattern analysis -- not from internal assumptions about who the audience is and what they want. The highest-impact next step is usually to pick one segment and invest in genuinely understanding their decision criteria before building any new personalization for them.",
  12: "Technology is the most common false start in personalization programs. The tool gets purchased, the capability gets demonstrated, and the team assumes the hard work is done. It is not. The tool is only as effective as the strategy, data, and content behind it. If the technology is the starting point rather than the infrastructure serving a defined strategy, the program will produce sophisticated-looking campaigns with no coherent direction. The right framing is: what personalization decisions do we need to make, what data do those decisions require, and what tooling do we need to execute them and measure the results? Starting from the capability and working backwards to the strategy reliably produces expensive programs with unclear return.",
  13: "Managing testing and personalization in the same tool works at small scale and becomes a liability at medium scale. The fundamental problem is that A/B testing requires clean traffic splits and defined start and end dates, while personalization is persistent and always-on. When the two share a platform, they compete for traffic, create audience overlap problems, and produce reporting that cannot cleanly separate what a controlled experiment showed from what a persistent personalization campaign is delivering. The point at which this separation becomes necessary is usually when the program has more than five or six active personalization campaigns running concurrently. If you are approaching that threshold, the time to plan the separation is before the conflicts become critical.",
  14: "Deploying a personalized experience without validation is the fastest way to serve a worse experience to a defined audience at scale, indefinitely, without knowing it. The counter-intuitive discipline is that your most confident personalization assumptions are still assumptions -- and the history of testing is full of cases where the most confident idea in the room was disproven by the data. Testing before personalizing does not require running a full-length A/B test for every decision. It requires the habit of asking 'how do we know this is better?' before making it permanent. For high-traffic, high-stakes segments, a proper controlled test is essential. For lower-traffic scenarios, even a short validation window is better than no measurement at all.",
  15: "Experiments are the best discovery mechanism for personalization opportunities that assumption-based segmentation will never find. The technique is straightforward: run a test on general traffic, but instrument it to report results by your key segments simultaneously. A test that looks flat overall may be hiding a strongly positive result for one segment and a negative result for another. Those divergent responses are the signal you are looking for -- proof that the segment is real and behaviorally meaningful, and the foundation for a personalization initiative that is grounded in evidence rather than assumption. Programs that treat segment discovery as a byproduct of their experimentation work consistently find more and better personalization opportunities than programs that define segments upfront.",
  16: "Measuring overall conversion rates tells you very little about whether personalization is working. The question is not whether your site converts -- it is whether the personalized experience converts better than the default for the specific segment it is targeting. That requires a control condition, segment-level reporting, and the discipline to define what success looks like before the campaign launches rather than after the first reporting period. Without that measurement architecture, the program cannot learn, cannot improve, and cannot defend its investment. The practical starting point is to pick your single most important active personalization campaign and ask: can we currently answer, for the segment this campaign targets, whether the personalized experience is outperforming what they would have seen without it?",
  17: "Personalization is an investment, and like any investment it requires accountability for return. The organizations that sustain and grow personalization programs over time are the ones that can point to specific campaigns and say: this cost us this much to build and maintain, and it produced this much lift for this segment, which translates to this business outcome. Without that accounting, personalization becomes impossible to prioritize against competing investments, impossible to scale, and vulnerable to defunding when leadership asks where the budget is going. The starting point is simple: for your three most resource-intensive active personalization campaigns, can you state the cost and the measured return? If not, that is the gap to close first.",
  18: "Personalization without a clear owner is not a program -- it is a collection of disconnected activities. Marketing runs a personalized email sequence. The web team has a homepage targeting rule. Paid media has segment-specific landing pages. None of these know about each other, none share a strategy, and none accumulate into a program that compounds over time. The single most important structural decision for a personalization program is naming a person who is explicitly accountable for its strategy, its results, and its coordination across the teams that contribute to it. That accountability should be visible in a job description and in a performance metric, not just understood informally. Everything else in the program -- governance, roadmap, measurement, cross-functional coordination -- becomes easier once ownership is clear.",
  19: "Personalization requires content, data, design, development, and strategy to work together -- and in most organizations those functions operate on different roadmaps with different priorities. The result is that personalization work consistently gets deprioritized: development queues are full, content is committed elsewhere, and analytics instrumentation keeps getting deferred. The signal that cross-functional collaboration is the constraint is simple: compare what was planned on your personalization roadmap with what was actually delivered. If the gap is large and persistent, it is almost always a coordination problem, not a strategy problem. The fix requires either dedicated resource allocation for personalization across the contributing functions or a shared prioritization process that gives personalization work genuine visibility in team planning.",
  20: "The most sophisticated personalization strategy and the best-resourced team will be constrained without leadership visibility. Without it, development capacity goes to features leadership has explicitly prioritized. Content goes to campaigns executives can see. Analytics investment goes to dashboards the CEO reviews. Personalization -- complex, cross-functional, and difficult to summarize in a headline metric -- loses these resource competitions repeatedly. Getting to sponsorship requires telling the personalization story in business terms: revenue impact, conversion lift at scale, customer retention. It does not require weekly executive reviews. It requires that someone in the leadership structure has explicitly named personalization as a strategic priority, allocated resources to it, and agreed to review its outcomes as part of the business performance conversation.",
};

// ─── Prompt builders ──────────────────────────────────────────────────────────
function buildNarrativePrompt(ans, sc, fi) {
  const allA = Q.map((q, i) =>
    `Q${q.n} (${q.p}, ${q.w}x): "${q.t}" - Answer ${LETTERS[ans[i]]}: "${q.a[ans[i]]}"`
  ).join("\n");
  const focTitles = fi.map(i => `Q${Q[i].n}: "${Q[i].t}"`).join(", ");
  const pil = PILLARS.map(p => `${p}: ${sc.pillar[p]}/100`).join(" | ");
  const st = stage(sc.overall);

  return `You are a personalization strategy consultant with 15 years of experience building personalization programs and 21 years in digital marketing. You specialize in helping organizations build the architecture, strategy, and systems to do personalization correctly. Direct, constructive, authoritative. No hedging. No flattery. Second person throughout. No bullet points. No em dashes.

A marketing or digital leader completed a 20-question personalization readiness assessment.

OVERALL SCORE: ${sc.overall}/100
READINESS STAGE: ${st.label}
PILLAR SCORES: ${pil}

ALL ANSWERS:
${allA}

BUILDING BLOCKS NEEDING ATTENTION (titles only): ${focTitles}

CRITICAL TONE INSTRUCTION: This is a readiness assessment, not a grade. Most organizations are early in personalization maturity -- that is expected and normal. The output should be constructive and forward-looking. Frame low scores as "here is where to start and why it matters" not "here is where you are failing." The goal is to help them see the path clearly, not to make them feel behind. Be honest about gaps but frame everything in terms of what building this correctly looks like.

Write EXACTLY these four sections:

## Where You Are Starting From
Exactly 3 sentences. Sentence 1: state their score and readiness stage by name, framed constructively. Sentence 2: describe what the specific combination of high and low answers reveals about their current foundation. Sentence 3: one honest observation about what this pattern means and what it signals about the work ahead.

## What This Assessment Just Showed You
Exactly 3 sentences. This is the meta-insight section -- what did going through these questions reveal about what personalization actually requires that they may not have fully considered before? Reference 2 to 3 specific areas where the questions themselves likely surfaced gaps or complexity they had not mapped. Make them feel that taking this assessment was genuinely educational, not just diagnostic.

## The Pattern in Your Readiness
Exactly 4 sentences. Identify the single systemic pattern running through their answers that they probably cannot name themselves. Reference specific question titles. Be precise. This should make them say "that is exactly what we are dealing with."

## What Building This Correctly Looks Like
Exactly 3 sentences. Do not pitch. Frame what a structured approach to building a personalization program actually requires -- strategy first, then data foundation, then execution. Be specific about the expertise required and why getting the sequence right matters for compounding results over time.

No bullet points. No em dashes. Every sentence must be specific to this person's actual answers.`;
}

function buildFocusPrompt(ans, sc, qIdx) {
  const q = Q[qIdx];
  const pil = PILLARS.map(p => `${p}: ${sc.pillar[p]}/100`).join(" | ");
  const allA = Q.map((q2, i) =>
    `Q${q2.n}: "${q2.t}" - ${LETTERS[ans[i]]}: "${q2.a[ans[i]]}"`
  ).join("\n");
  return `You are a personalization strategy consultant with 15 years of experience. Direct, constructive, authoritative. No hedging. No flattery. Second person. No bullet points. No em dashes.

Scores: ${pil}

All answers for context:
${allA}

BUILDING BLOCK:
Q${q.n}: "${q.t}" (${q.p}, weight ${q.w}x)
Their answer - ${LETTERS[ans[qIdx]]}: "${q.a[ans[qIdx]]}"

TONE: Constructive and forward-looking. This is about what to build, not what is broken.

Write ONLY the following. Start with the ### heading, then exactly 3 sentences.

### ${q.t}
Sentence 1: name specifically what this answer reveals about where they are and why this building block matters for the personalization system they are trying to build.
Sentence 2: one concrete next step -- a specific direction, not a menu of options.
Sentence 3: name exactly what stays impossible or unreliable until this foundation is in place.

Output only the ### heading and the 3 sentences. Nothing else.`;
}

// ─── Report parser ────────────────────────────────────────────────────────────
function parseReport(text) {
  const sections = [];
  const parts = text.split(/\n##\s+/);
  for (const part of parts) {
    const lines = part.trim().split("\n");
    if (!lines[0]) continue;
    const h = lines[0].replace(/^#+\s*/, "").trim();
    const body = lines.slice(1).map(l => l.trim()).filter(Boolean);
    if (h) sections.push({ h, body });
  }
  return sections;
}

// ─── Streaming API call ───────────────────────────────────────────────────────
async function streamCall(prompt, onChunk, maxTokens = 1000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const d = line.slice(6).trim();
      if (d === "[DONE]") continue;
      try {
        const j = JSON.parse(d);
        if (j.type === "content_block_delta" && j.delta?.text) onChunk(j.delta.text);
      } catch (_) {}
    }
  }
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const SN = "'DM Sans', 'Inter', system-ui, sans-serif";
const BASE = { minHeight: "100vh", background: "#f7f9fc", fontFamily: SN };

// ─── Main component ───────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("intro");
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState(Array(20).fill(null));
  const [sc, setSc] = useState(null);
  const [fi, setFi] = useState([]);
  const [narrative, setNarrative] = useState("");
  const [focusRecs, setFocusRecs] = useState([]);
  const [loadingNarrative, setLoadingNarrative] = useState(false);
  const [loadingFocus, setLoadingFocus] = useState(false);
  const [loadingFocusIdx, setLoadingFocusIdx] = useState(-1);
  const topRef = useRef(null);

  const loading = loadingNarrative || loadingFocus;

  async function generate(finalAns) {
    const s = score(finalAns);
    const f = focusAreas(finalAns);
    setSc(s); setFi(f);
    setStep("loading");
    setNarrative(""); setFocusRecs([]);
    try {
      setLoadingNarrative(true);
      let flipped = false;
      await streamCall(
        buildNarrativePrompt(finalAns, s, f),
        chunk => {
          if (!flipped) { flipped = true; setStep("report"); if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" }); }
          setNarrative(p => p + chunk);
        },
        2400
      );
      setLoadingNarrative(false);
      setLoadingFocus(true);
      for (let k = 0; k < f.length; k++) {
        setLoadingFocusIdx(k);
        let text = "";
        await streamCall(
          buildFocusPrompt(finalAns, s, f[k]),
          chunk => {
            text += chunk;
            setFocusRecs(prev => { const next = [...prev]; next[k] = text; return next; });
          }
        );
      }
      setLoadingFocusIdx(-1);
      setLoadingFocus(false);
    } catch (e) {
      setStep("report");
      setNarrative("## Error\n\nUnable to generate report. Please try again.");
      setLoadingNarrative(false); setLoadingFocus(false);
    }
  }

  function pick(i) {
    const next = [...ans]; next[cur] = i; setAns(next);
    if (cur < 19) setTimeout(() => setCur(c => c + 1), 240);
    else setTimeout(() => generate(next), 240);
  }

  function restart() {
    setStep("intro"); setCur(0); setAns(Array(20).fill(null));
    setSc(null); setFi([]); setNarrative(""); setFocusRecs([]);
    setLoadingNarrative(false); setLoadingFocus(false); setLoadingFocusIdx(-1);
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (step === "intro") return (
    <div style={{ ...BASE, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
      <div style={{ maxWidth: 620, width: "100%" }}>
        <div style={{ fontFamily: SN, fontSize: 10, letterSpacing: 4, color: "#8896a7", textTransform: "uppercase", marginBottom: 16 }}>Growth Systems</div>
        <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px", color: "#0f1923" }}>
          Personalization<br /><span style={{ color: "#2B6CB0" }}>Readiness Assessment</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4a5568", margin: "0 0 14px" }}>
          Most companies want to personalize. Very few have built the foundation that makes personalization work. The gap is larger than most teams realize -- and it starts before the technology.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4a5568", margin: "0 0 14px" }}>
          This 20-question assessment evaluates your readiness across the eight pillars of a functioning personalization program. Many of the questions will surface things you have not yet considered. That is the point.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4a5568", margin: "0 0 32px" }}>
          By the end, you will have a clear picture of where your foundation is solid, where it is missing, and what to build first.
        </p>
        <div style={{ display: "flex", gap: 28, marginBottom: 36, flexWrap: "wrap" }}>
          {[["20", "Questions"], ["8", "Pillars"], ["~10 min", "Duration"], ["Free", "Report"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2B6CB0", fontFamily: SN }}>{v}</div>
              <div style={{ fontSize: 11, color: "#8896a7", fontFamily: SN, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "#8896a7", fontStyle: "italic", marginBottom: 28, fontFamily: SN }}>
          Answer honestly. Describe where you are today, not where you aspire to be. The value is in the honest picture.
        </p>
        <button onClick={() => setStep("quiz")} style={{ background: "#1a365d", color: "#fff", border: "none", borderRadius: 8, padding: "14px 36px", fontSize: 15, fontFamily: SN, fontWeight: 600, cursor: "pointer" }}>
          Begin Assessment
        </button>
      </div>
    </div>
  );

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  if (step === "quiz") {
    const q = Q[cur];
    const done = ans.filter(x => x !== null).length;
    const bgC = ["#FFF5F5", "#FFFAF0", "#FFFFF0", "#F0FFF4", "#EBF8FF"];
    const bdC = ["#FC8181", "#F6AD55", "#F6E05E", "#68D391", "#63B3ED"];
    const lbC = ["#C53030", "#C05621", "#975A16", "#276749", "#2B6CB0"];
    return (
      <div style={{ ...BASE, padding: "32px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: SN, fontSize: 10, letterSpacing: 4, color: "#8896a7", textTransform: "uppercase" }}>Growth Systems</div>
            <div style={{ fontFamily: SN, fontSize: 12, color: "#8896a7" }}>{cur + 1} / 20</div>
          </div>
          <div style={{ background: "#e8edf2", borderRadius: 99, height: 4, overflow: "hidden", marginBottom: 24 }}>
            <div style={{ width: `${(done / 20) * 100}%`, background: "#2B6CB0", height: "100%", borderRadius: 99, transition: "width 0.3s ease" }} />
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${PCOL[q.p]}33`, borderRadius: 99, padding: "4px 14px", marginBottom: 18 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: PCOL[q.p] }} />
            <span style={{ fontFamily: SN, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: PCOL[q.p] }}>{q.p}</span>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 20, border: "1px solid #e8edf2" }}>
            <h2 style={{ fontSize: "clamp(16px,3vw,20px)", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3, color: "#0f1923" }}>{q.t}</h2>
            <p style={{ fontFamily: SN, fontSize: 13, color: "#718096", margin: 0, fontStyle: "italic" }}>{q.sub}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {q.a.map((txt, i) => {
              const sel = ans[cur] === i;
              return (
                <button key={i} onClick={() => pick(i)} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  background: sel ? bgC[i] : "#fff",
                  border: `1.5px solid ${sel ? bdC[i] : "#e2e8f0"}`,
                  borderRadius: 10, padding: "12px 16px", cursor: "pointer", textAlign: "left", outline: "none",
                  transition: "border-color 0.15s ease"
                }}>
                  <span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: sel ? lbC[i] : "#f0f4f8", color: sel ? "#fff" : "#8896a7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, fontFamily: SN, flexShrink: 0 }}>
                    {LETTERS[i]}
                  </span>
                  <span style={{ fontSize: 13, lineHeight: 1.65, color: "#2d3748", fontFamily: SN }}>{txt}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {cur > 0 && <button onClick={() => setCur(c => c - 1)} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontFamily: SN, cursor: "pointer", color: "#718096" }}>Back</button>}
            {ans[cur] !== null && cur < 19 && <button onClick={() => setCur(c => c + 1)} style={{ background: "#1a365d", color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontFamily: SN, fontWeight: 600, cursor: "pointer" }}>Next</button>}
            {ans[cur] !== null && cur === 19 && <button onClick={() => generate(ans)} style={{ background: "#2B6CB0", color: "#fff", border: "none", borderRadius: 8, padding: "9px 24px", fontSize: 13, fontFamily: SN, fontWeight: 600, cursor: "pointer" }}>See My Results</button>}
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (step === "loading") return (
    <div style={{ ...BASE, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#2B6CB0", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#8896a7", fontFamily: SN, fontSize: 14 }}>Building your readiness picture...</p>
      </div>
    </div>
  );

  // ── REPORT ─────────────────────────────────────────────────────────────────
  if (!sc) return null;
  const st = stage(sc.overall);
  const narrativeSecs = parseReport(narrative);

  return (
    <div style={{ ...BASE, padding: "32px 20px 0" }} ref={topRef}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: SN, fontSize: 10, letterSpacing: 4, color: "#8896a7", textTransform: "uppercase" }}>Growth Systems</div>
          <button onClick={restart} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontFamily: SN, cursor: "pointer", color: "#8896a7" }}>Retake</button>
        </div>

        {/* Score hero */}
        <div style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 16, padding: "32px 28px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
            {/* Ring */}
            <div style={{ flexShrink: 0 }}>
              <svg width={100} height={100} viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={42} fill="none" stroke="#f0f4f8" strokeWidth={8} />
                <circle cx={50} cy={50} r={42} fill="none" stroke={st.color} strokeWidth={8}
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - sc.overall / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x={50} y={47} textAnchor="middle" fontSize={22} fontWeight={700} fill="#0f1923" fontFamily={SN}>{sc.overall}</text>
                <text x={50} y={62} textAnchor="middle" fontSize={11} fill="#8896a7" fontFamily={SN}>/100</text>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: SN, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#8896a7", marginBottom: 4 }}>Readiness Stage</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: st.color, fontFamily: SN, marginBottom: 6 }}>{st.label}</div>
              <div style={{ fontFamily: SN, fontSize: 13, color: "#718096", lineHeight: 1.6 }}>
                {st.label === "Exploring" && "You are in the right place. Most organizations start here. What matters is building on the right foundation."}
                {st.label === "Building" && "You have foundations forming. The path forward is clearer than it might feel right now."}
                {st.label === "Establishing" && "You are ahead of most organizations. The gaps you have are identifiable and addressable."}
                {st.label === "Scaling" && "Your program is real. The work now is compounding what you have already built."}
                {st.label === "Leading" && "You are operating at the ceiling of what most organizations achieve in personalization."}
              </div>
            </div>
          </div>
        </div>

        {/* 8-pillar scorecard */}
        <div style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 16, padding: "26px 28px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: SN, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 20px", color: "#1a202c" }}>
            Readiness by Pillar
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px 24px" }}>
            {PILLARS.map(p => {
              const psc = sc.pillar[p];
              const pst = stage(psc);
              return (
                <div key={p} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: PCOL[p], flexShrink: 0 }} />
                      <span style={{ fontFamily: SN, fontSize: 12, fontWeight: 600, color: "#2d3748" }}>{p}</span>
                    </div>
                    <span style={{ fontFamily: SN, fontSize: 12, fontWeight: 700, color: pst.color }}>{psc}</span>
                  </div>
                  <div style={{ background: "#f0f4f8", borderRadius: 99, height: 5, overflow: "hidden" }}>
                    <div style={{ width: `${psc}%`, background: PCOL[p], height: "100%", borderRadius: 99, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-question scorecard grouped by pillar */}
        <div style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 16, padding: "26px 28px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: SN, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 20px", color: "#1a202c" }}>
            Question Scorecard
          </h2>
          {PILLARS.map(p => {
            const pQs = Q.map((q, i) => ({ q, i })).filter(({ q }) => q.p === p);
            return (
              <div key={p} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: PCOL[p] }} />
                  <span style={{ fontFamily: SN, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: PCOL[p] }}>{p}</span>
                </div>
                {pQs.map(({ q, i }) => {
                  const qsc = sc.perQ[i];
                  const qst = stage(qsc);
                  const isFocus = fi.includes(i);
                  return (
                    <div key={i} style={{ border: `1px solid ${isFocus ? "#F6E05E" : "#f0f4f8"}`, borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: isFocus ? "#FFFEF5" : "#fff" }}>
                        <div style={{ minWidth: 16, textAlign: "center", fontSize: 11, color: "#D69E2E" }}>{isFocus ? "★" : ""}</div>
                        <div style={{ fontFamily: SN, fontSize: 11, fontWeight: 700, color: "#8896a7", minWidth: 24 }}>Q{q.n}</div>
                        <div style={{ flex: 1, fontFamily: SN, fontSize: 12, color: "#2d3748", fontWeight: isFocus ? 600 : 400 }}>{q.t}</div>
                        <div style={{ fontFamily: SN, fontSize: 12, fontWeight: 700, color: qst.color, minWidth: 20, textAlign: "center" }}>{LETTERS[ans[i]]}</div>
                        <div style={{ width: 56, background: "#e8edf2", borderRadius: 99, height: 4, overflow: "hidden", flexShrink: 0 }}>
                          <div style={{ width: `${qsc}%`, background: PCOL[p], height: "100%", borderRadius: 99 }} />
                        </div>
                        <div style={{ fontFamily: SN, fontSize: 11, fontWeight: 700, color: qst.color, minWidth: 28, textAlign: "right" }}>{qsc}</div>
                      </div>
                      {isFocus && (
                        <div style={{ borderTop: "1px solid #F6E05E", padding: "12px 14px 14px 40px", background: "#FFFEF5" }}>
                          <div style={{ fontFamily: SN, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#B7791F", marginBottom: 6 }}>What to build first</div>
                          {FOCUS_RECS[q.n] && <p style={{ fontFamily: "Georgia,serif", fontSize: 13, lineHeight: 1.8, color: "#4a3f20", margin: 0 }}>{FOCUS_RECS[q.n]}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, paddingTop: 10, borderTop: "1px solid #f0f4f8" }}>
            <span style={{ fontSize: 12, color: "#D69E2E" }}>★</span>
            <span style={{ fontFamily: SN, fontSize: 11, color: "#8896a7" }}>Starred rows are your priority building blocks -- with recommendations below</span>
          </div>
        </div>

        {/* Narrative sections */}
        {loadingNarrative && narrativeSecs.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 16, padding: 32, fontFamily: SN, fontSize: 14, color: "#8896a7" }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 18, height: 18, border: "2px solid #e2e8f0", borderTopColor: "#2B6CB0", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
              Generating your readiness report...
            </div>
          </div>
        )}
        {narrativeSecs.map((sec, si) => {
          const isLast = si === narrativeSecs.length - 1;
          const isBuild = sec.h.toLowerCase().includes("building this") || sec.h.toLowerCase().includes("looks like");
          const isPattern = sec.h.toLowerCase().includes("pattern");
          const isShowed = sec.h.toLowerCase().includes("showed");
          return (
            <div key={si} style={{
              background: isBuild ? "#0f2744" : "#fff",
              border: `1px solid ${isBuild ? "#1a3a5c" : isPattern ? "#BEE3F8" : isShowed ? "#C6F6D5" : "#e8edf2"}`,
              borderLeft: isPattern ? "4px solid #2B6CB0" : isShowed ? "4px solid #276749" : undefined,
              borderRadius: 16, padding: "26px 30px", marginBottom: 16
            }}>
              <h2 style={{ fontFamily: SN, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 14px", color: isBuild ? "#90cdf4" : isPattern ? "#2B6CB0" : isShowed ? "#276749" : "#1a202c" }}>
                {sec.h}
              </h2>
              {sec.body.map((p, pi) => (
                <p key={pi} style={{ fontSize: 15, lineHeight: 1.85, color: isBuild ? "#e2e8f0" : "#2d3748", margin: "0 0 10px", fontFamily: "Georgia,serif" }}>{p}</p>
              ))}
              {loadingNarrative && isLast && (
                <span style={{ display: "inline-block", width: 2, height: "1em", background: "#2B6CB0", marginLeft: 2, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
              )}
              <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
            </div>
          );
        })}

        {/* Focus area recommendations */}
        {(loadingFocus || focusRecs.length > 0) && (
          <div style={{ background: "#fff", border: "1px solid #e8edf2", borderRadius: 16, padding: "26px 30px", marginBottom: 16 }}>
            <h2 style={{ fontFamily: SN, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 20px", color: "#1a202c" }}>
              Your Priority Building Blocks
            </h2>
            {fi.map((qIdx, k) => {
              const q = Q[qIdx];
              const recText = focusRecs[k] || "";
              const isCurrentlyLoading = loadingFocusIdx === k;
              const parsed = parseReport(recText);
              const sub = parsed.length > 0 ? parsed[0] : null;
              const bodyLines = sub ? sub.body : recText.split("\n").filter(l => l.trim() && !l.startsWith("###"));
              return (
                <div key={qIdx} style={{ marginBottom: k < fi.length - 1 ? 24 : 0, paddingBottom: k < fi.length - 1 ? 24 : 0, borderBottom: k < fi.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ background: PCOL[q.p], color: "#fff", fontFamily: SN, fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "3px 10px", flexShrink: 0 }}>
                      {q.p}
                    </div>
                    <h3 style={{ fontFamily: SN, fontSize: 14, fontWeight: 700, margin: 0, color: "#1a365d" }}>{q.t}</h3>
                  </div>
                  <div style={{ fontFamily: SN, fontSize: 11, color: "#8896a7", marginBottom: 10, fontStyle: "italic" }}>
                    Your answer: "{q.a[ans[qIdx]]}"
                  </div>
                  {isCurrentlyLoading && bodyLines.length === 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#8896a7", fontFamily: SN, fontSize: 13 }}>
                      <div style={{ width: 14, height: 14, border: "2px solid #e2e8f0", borderTopColor: "#2B6CB0", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                      Analyzing...
                    </div>
                  )}
                  <div style={{ borderLeft: `3px solid ${PCOL[q.p]}44`, paddingLeft: 16 }}>
                    {bodyLines.map((line, li) => (
                      <p key={li} style={{ fontFamily: "Georgia,serif", fontSize: 14, lineHeight: 1.8, color: "#2d3748", margin: "0 0 8px" }}>{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Final CTA */}
        {!loading && narrative.length > 0 && (
          <>
            <div style={{ background: "#0f2744", border: "1px solid #1a3a5c", borderRadius: 16, padding: "40px 36px", marginBottom: 16 }}>
              <div style={{ fontFamily: SN, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#90cdf4", marginBottom: 16 }}>
                Ready to Build This?
              </div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, lineHeight: 1.3, color: "#fff", margin: "0 0 18px" }}>
                You now know what the system requires. Building it correctly is a different challenge.
              </h2>
              <p style={{ fontFamily: "Georgia,serif", fontSize: 15, lineHeight: 1.9, color: "#cbd5e0", margin: "0 0 14px" }}>
                Personalization programs that produce compound results are not built by purchasing the right tool or defining the right segments. They are built by getting the architecture right -- strategy, data foundation, segmentation discipline, content structure, measurement, and governance -- in the right sequence. Skipping steps is the most common and most expensive mistake.
              </p>
              <p style={{ fontFamily: "Georgia,serif", fontSize: 15, lineHeight: 1.9, color: "#cbd5e0", margin: "0 0 28px" }}>
                I bring 15 years of building personalization programs and 21 years in digital marketing -- inside real organizations, not just in theory. I have diagnosed what breaks these programs and know what the path from where you are now to a functioning program actually looks like. A conversation costs nothing. A poorly sequenced build costs months.
              </p>
              <button onClick={() => window.open("Yhttps://calendly.com/jason-haddock-hbej/30min", "_blank")} style={{ background: "#2B6CB0", color: "#fff", border: "none", borderRadius: 8, padding: "15px 32px", fontSize: 15, fontFamily: SN, fontWeight: 600, cursor: "pointer" }}>
                Let's Build This Together
              </button>
            </div>
            <div style={{ textAlign: "center", padding: "20px 0 48px" }}>
              <button onClick={restart} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "11px 22px", fontSize: 13, fontFamily: SN, cursor: "pointer", color: "#8896a7" }}>
                Retake Assessment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
