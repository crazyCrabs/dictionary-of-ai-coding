#!/usr/bin/env -S npx tsx
// Generate a self-contained static site (3D force graph + detail panel) from
// internal/Curriculum.md + dictionary/*.md. Output: site/index.html.
// The graph libraries are bundled by `npm run vendor` into a single IIFE
// script (internal/vendor/graph.iife.min.js) and copied to site/vendor/.

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  existsSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Marked } from "marked";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const CURRICULUM = join(HERE, "Curriculum.md");
const DICT_DIR = join(ROOT, "dictionary");
const OUT_DIR = join(ROOT, "site");
const VENDOR_SRC = join(HERE, "vendor");
const VENDOR_FILES = ["graph.iife.min.js"];

const SECTION_RE = /^## Section \d+ — .+$/;
const BULLET_RE = /^- (.+)$/;

type Term = {
  name: string;
  slug: string;
  section: number;
  description: string;
  links: string[];
  usage: string[]; // html bubbles
  firstPara: string; // html
  restHtml: string; // html after first paragraph
  bodyMd: string; // raw markdown
};

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

// Working copies may have CRLF line endings (git autocrlf); normalize to LF.
function readLF(path: string): string {
  return readFileSync(path, "utf8").replace(/\r\n/g, "\n");
}

function parseCurriculum(text: string): { heading: string; terms: string[] }[] {
  const sections: { heading: string; terms: string[] }[] = [];
  let current: { heading: string; terms: string[] } | null = null;

  text.split("\n").forEach((raw, idx) => {
    const lineNo = idx + 1;
    const line = raw.trimEnd();
    if (line === "") return;

    if (line.startsWith("## ")) {
      if (!SECTION_RE.test(line)) {
        fail(
          `Curriculum.md:${lineNo}: section heading must match "## Section N — Title" (em-dash required): ${line}`
        );
      }
      current = { heading: line.slice(3), terms: [] };
      sections.push(current);
      return;
    }

    if (line.startsWith("- ")) {
      if (!current)
        fail(`Curriculum.md:${lineNo}: bullet before any section heading`);
      const m = line.match(BULLET_RE);
      if (!m || !m[1])
        fail(`Curriculum.md:${lineNo}: malformed bullet: ${line}`);
      current.terms.push(m[1]);
      return;
    }

    fail(
      `Curriculum.md:${lineNo}: only "## Section N — Title" headings and "- Term" bullets are allowed: ${line}`
    );
  });

  return sections;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatter(body: string): { description: string; rest: string } {
  if (!body.startsWith("---\n")) return { description: "", rest: body };
  const end = body.indexOf("\n---\n", 4);
  if (end === -1) return { description: "", rest: body };
  const fm = body.slice(4, end);
  const rest = body.slice(end + 5).replace(/^\n+/, "");
  const m = fm.match(/^description: ?(.*)$/m);
  let description = m?.[1] ?? "";
  if (
    (description.startsWith('"') && description.endsWith('"')) ||
    (description.startsWith("'") && description.endsWith("'"))
  ) {
    description = description.slice(1, -1);
  }
  return { description, rest };
}

const marked = new Marked({ gfm: true });
const renderMd = (md: string) => marked.parse(md) as string;

function rewriteLinks(html: string): string {
  return html.replace(/href="\.\/([^"]+)\.md"/g, (_, target: string) => {
    return `href="#term=${target}"`;
  });
}

function splitUsage(md: string): { def: string; usage: string[] } {
  const lines = md.split("\n");
  const idx = lines.findIndex((l) => /^_Usage:_\s*$/.test(l.trim()));
  if (idx === -1) return { def: md, usage: [] };
  const def = lines.slice(0, idx).join("\n").trimEnd();
  const usageMd = lines
    .slice(idx + 1)
    .join("\n")
    .trim();
  const usage = usageMd
    .split(/\n\s*\n/)
    .map((p) => rewriteLinks(renderMd(p.trim())).trim())
    .filter(Boolean);
  return { def, usage };
}

const allNames = new Set(
  readdirSync(DICT_DIR)
    .filter((n) => n.endsWith(".md"))
    .map((n) => n.slice(0, -3))
);

function extractLinks(md: string): string[] {
  const links = new Set<string>();
  for (const m of md.matchAll(/\]\(\.\/([^)]+)\.md\)/g)) {
    const name = decodeURIComponent(m[1]);
    if (allNames.has(name)) links.add(name);
  }
  return [...links];
}

function build() {
  const curriculum = parseCurriculum(readLF(CURRICULUM));
  const seen = new Set<string>();
  const terms: Term[] = [];

  curriculum.forEach((section, si) => {
    for (const name of section.terms) {
      if (seen.has(name)) fail(`Curriculum.md: duplicate term "${name}"`);
      seen.add(name);
      const entryPath = join(DICT_DIR, `${name}.md`);
      let raw: string;
      try {
        raw = readLF(entryPath);
      } catch {
        fail(
          `Curriculum.md references "${name}" but ${entryPath} does not exist`
        );
      }
      const { description, rest } = parseFrontmatter(raw);
      const { def, usage } = splitUsage(rest);
      const firstBlock = def.trim().split(/\n\s*\n/)[0] ?? "";
      const restMd = def.trim().slice(firstBlock.length).trim();
      terms.push({
        name,
        slug: slugify(name),
        section: si,
        description,
        links: extractLinks(rest),
        usage,
        firstPara: rewriteLinks(renderMd(firstBlock)),
        restHtml: rewriteLinks(renderMd(restMd)),
        bodyMd: rest.trim(),
      });
    }
  });

  const onDisk = new Set([...allNames]);
  const orphans = [...onDisk].filter((t) => !seen.has(t)).sort();
  if (orphans.length)
    fail(
      `dictionary/ entries not referenced by Curriculum.md: ${orphans.join(", ")}`
    );

  const index = new Map(terms.map((t, i) => [t.name, i]));
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  terms.forEach((t, i) => {
    t.links.forEach((target) => {
      const j = index.get(target);
      if (j === undefined || j === i) return;
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push(i < j ? [i, j] : [j, i]);
      }
    });
  });

  const graph = {
    nodes: terms.map((t, i) => ({
      name: t.name,
      slug: t.slug,
      degree: 0,
      id: i,
    })),
    edges,
  };
  terms.forEach((t, i) => {
    graph.nodes[i].degree = edges.filter(
      (e) => e[0] === i || e[1] === i
    ).length;
  });

  return { sections: curriculum, terms, graph };
}

function escapeForScriptTag(json: string): string {
  return json.replace(/<\//g, "<\\/");
}

const { sections, terms, graph } = build();
const dataJson = escapeForScriptTag(
  JSON.stringify({
    sections: sections.map((s) => s.heading),
    terms: terms.map((t) => ({
      name: t.name,
      slug: t.slug,
      section: t.section,
      description: t.description,
      links: t.links,
      usage: t.usage,
      firstPara: t.firstPara,
      restHtml: t.restHtml,
      bodyMd: t.bodyMd,
    })),
    graph,
  })
);

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI 编程词典</title>
<style>
  /* Palette & motion tokens mirror the reference site (aicodingdictionary.com):
     paper/ink neutral colours, Helvetica-first sans, mono only for kickers,
     and a single reveal curve reused by the panel, canvas shift and search. */
  :root {
    --paper: #f2f2f0;
    --paper-panel: #f2f2f0;
    --ink: #1a1a19;
    --ink-panel: #171717;
    --surface: #e2e2e0;
    --surface-2: #d9d9d7;
    --line: rgba(26, 26, 25, 0.14);
    --line-strong: rgba(26, 26, 25, 0.28);
    --muted: rgba(26, 26, 25, 0.6);
    --muted-soft: rgba(26, 26, 25, 0.42);
    --sans: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
    --mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    --reveal-ease: cubic-bezier(0.16, 1, 0.3, 1);
    --panel-w: 33.3333vw;
    --panel-shift: 16.6666vw;
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --paper: #131311;
      --paper-panel: #1b1a17;
      --ink: #eceae4;
      --ink-panel: #f2f0ea;
      --surface: #1e1d1a;
      --surface-2: #26241f;
      --line: rgba(236, 234, 228, 0.14);
      --line-strong: rgba(236, 234, 228, 0.28);
      --muted: rgba(236, 234, 228, 0.62);
      --muted-soft: rgba(236, 234, 228, 0.42);
      color-scheme: dark;
    }
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; background: var(--paper); color: var(--ink); overflow: hidden;
    font: 15px/1.55 var(--sans); -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ::selection { background: var(--ink); color: var(--paper); }

  /* Canvas occupies the whole viewport; when the panel opens the canvas slides
     left by half the panel width so the focused node stays visible (matches
     the reference site's data-shift behaviour). */
  #canvasWrap {
    position: fixed; inset: 0; z-index: 0;
    transition: transform 0.62s var(--reveal-ease);
    will-change: transform;
  }
  #canvasWrap[data-shift="true"] { transform: translateX(calc(var(--panel-shift) * -1)); }
  #graph { width: 100%; height: 100%; }
  #graph canvas { display: block; }
  .scene-tooltip { display: none !important; }

  /* The reference site ships a vignette layer in CSS but keeps it effectively
     invisible on the light theme - the paper background reads as a flat,
     even tone. We drop the gradient entirely so the canvas sits on clean paper. */
  #vignette { display: none; }

  /* Circular icon buttons (info, sound, etc.) share the same geometry and
     shift right when the panel opens so they never sit on top of it. */
  .fab {
    position: fixed; z-index: 50; width: 2.4rem; height: 2.4rem; border-radius: 50%;
    border: 1px solid var(--line-strong); background: transparent; color: var(--muted);
    cursor: pointer; display: grid; place-items: center; padding: 0;
    transition: color 0.2s, border-color 0.2s, right 0.62s var(--reveal-ease), background 0.2s;
  }
  .fab:hover { color: var(--ink); border-color: rgba(26, 26, 25, 0.6); }
  @media (prefers-color-scheme: dark) { .fab:hover { border-color: rgba(236, 234, 228, 0.6); } }
  .fab[data-shift="true"] { right: calc(var(--panel-w) + 32px) !important; }
  #infoBtn { top: 28px; right: 32px; font: 600 15px/1 var(--mono); }

  /* Search lives as a 2.4rem pill that expands into a full search field on
     focus/typing, then collapses back when cleared and blurred. */
  #searchBar {
    position: fixed; top: 28px; left: 32px; z-index: 50;
    display: flex; align-items: center;
    width: 2.4rem; height: 2.4rem; padding: 0;
    border: 1px solid var(--line-strong); border-radius: 999px;
    background: transparent; overflow: hidden;
    transition: width 0.46s var(--reveal-ease), padding 0.46s var(--reveal-ease),
                background 0.25s, border-color 0.25s, box-shadow 0.3s, color 0.2s;
    color: var(--muted);
  }
  #searchBar:hover { color: var(--ink); border-color: rgba(26, 26, 25, 0.5); }
  #searchBar[data-active="true"] {
    width: min(360px, calc(100vw - 120px)); padding: 0 12px 0 0;
    color: var(--ink); border-color: rgba(26, 26, 25, 0.55);
    background: color-mix(in srgb, var(--paper) 92%, transparent);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 6px 24px rgba(7, 5, 6, 0.12);
  }
  @media (prefers-color-scheme: dark) {
    #searchBar:hover, #searchBar[data-active="true"] { border-color: rgba(236, 234, 228, 0.55); }
    #searchBar[data-active="true"] { background: color-mix(in srgb, var(--paper) 88%, transparent); }
  }
  #searchIcon {
    width: 2.4rem; height: 2.4rem; flex: none; display: grid; place-items: center;
    background: none; border: none; cursor: pointer; color: inherit; padding: 0;
  }
  #searchIcon svg { width: 1.05rem; height: 1.05rem; display: block; }
  #searchInput {
    flex: 1; min-width: 0; border: none; outline: none; background: transparent;
    color: var(--ink); font: 14px/1 var(--sans); letter-spacing: 0.01em;
    opacity: 0; transition: opacity 0.28s 60ms;
  }
  #searchBar[data-active="true"] #searchInput { opacity: 1; }
  #searchInput::placeholder { color: var(--muted-soft); }
  #clearBtn {
    flex: none; border: none; background: none; cursor: pointer;
    color: inherit; opacity: 0.55; padding: 2px; display: none;
    width: 1.4rem; height: 1.4rem; place-items: center;
  }
  #clearBtn:hover { opacity: 1; }
  #searchBar[data-active="true"] #clearBtn.has-value { display: grid; }
  #searchCount {
    position: fixed; top: 84px; left: 44px; z-index: 50;
    color: var(--muted); font: 700 10px/1 var(--mono);
    letter-spacing: 0.2em; text-transform: uppercase;
    opacity: 0; transition: opacity 0.25s; pointer-events: none;
  }
  #searchCount[data-show="true"] { opacity: 1; }

  /* Orbit hint sits at the bottom centre; fades out once the user interacts
     or opens a term, matching the reference's transient hint chip. */
  #orbitHint {
    position: fixed; bottom: clamp(1.4rem, 4vh, 2.4rem); left: 50%; z-index: 40;
    transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 0.95rem; border-radius: 999px;
    background: color-mix(in srgb, var(--paper) 82%, transparent);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    border: 1px solid var(--line);
    color: rgba(26, 26, 25, 0.7);
    font: 12px/1 var(--sans); white-space: nowrap; pointer-events: none;
    /* backwards (not both): once the intro animation ends the element returns
       to the normal cascade so [data-hide] can fade it out. With fill-mode
       both, the final keyframe's opacity:1 would permanently override it. */
    animation: hintIn 0.6s var(--reveal-ease) backwards;
    transition: opacity 0.4s, transform 0.4s;
  }
  #orbitHint .dot { width: 0.28rem; height: 0.28rem; border-radius: 50%; background: rgba(26, 26, 25, 0.4); }
  #orbitHint[data-hide="true"] { opacity: 0; transform: translate(-50%, 6px); }
  @media (prefers-color-scheme: dark) {
    #orbitHint { color: rgba(236, 234, 228, 0.72); }
    #orbitHint .dot { background: rgba(236, 234, 228, 0.4); }
  }
  @keyframes hintIn {
    from { opacity: 0; transform: translate(-50%, 8px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  /* Panel: slides in from the right, 33.33vw wide, own paper/ink palette.
     Hidden by default (translate(100%) + opacity 0) so the root view is
     purely the graph, exactly like the reference. */
  #panel {
    position: fixed; top: 0; right: 0; z-index: 5;
    width: var(--panel-w); height: 100dvh;
    background: var(--paper-panel); color: var(--ink-panel);
    border-left: 1px solid var(--line);
    display: flex; flex-direction: column;
    opacity: 0; pointer-events: none;
    transform: translateX(100%);
    transition: transform 0.62s var(--reveal-ease), opacity 0.4s ease;
    overflow: hidden;
  }
  #panel[data-open="true"] { opacity: 1; pointer-events: auto; transform: translateX(0); }
  #panelScroll { flex: 1; overflow-y: auto; overscroll-behavior: contain; }
  #panelInner { padding: clamp(2rem, 4.5vh, 3rem) clamp(1.8rem, 2.6vw, 2.6rem) 1.4rem; }
  #closePanel {
    position: absolute; top: clamp(1.1rem, 2.6vh, 1.6rem); right: clamp(1.2rem, 2vw, 1.8rem);
    z-index: 6; width: 2.4rem; height: 2.4rem; border-radius: 50%;
    border: 1px solid var(--line-strong); background: transparent; cursor: pointer;
    display: grid; place-items: center; padding: 0;
    transition: border-color 0.2s;
  }
  #closePanel:hover { border-color: rgba(26, 26, 25, 0.6); }
  @media (prefers-color-scheme: dark) { #closePanel:hover { border-color: rgba(236, 234, 228, 0.6); } }
  #closePanel .mark { position: relative; width: 0.8rem; height: 0.8rem; }
  #closePanel .mark::before, #closePanel .mark::after {
    content: ""; position: absolute; top: 50%; left: 0; width: 100%; height: 1px;
    background: rgba(26, 26, 25, 0.62); transition: background 0.2s;
  }
  #closePanel .mark::before { transform: rotate(45deg); }
  #closePanel .mark::after { transform: rotate(-45deg); }
  #closePanel:hover .mark::before, #closePanel:hover .mark::after { background: var(--ink-panel); }
  @media (prefers-color-scheme: dark) {
    #closePanel .mark::before, #closePanel .mark::after { background: rgba(236, 234, 228, 0.62); }
    #closePanel:hover .mark::before, #closePanel:hover .mark::after { background: var(--ink-panel); }
  }

  .kicker {
    font: 700 10px/1 var(--mono); letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--muted-soft);
    margin: 1.6rem 0 0.85rem;
  }
  .kicker:first-child { margin-top: 0; }
  #termTitle {
    margin: 0.4rem 0 0; font: 700 clamp(2rem, 3.4vw, 3rem)/0.98 var(--sans);
    letter-spacing: -0.032em; color: var(--ink-panel); text-wrap: balance;
    padding-right: 3rem;
  }
  #termDesc {
    margin: 0.9rem 0 0; max-width: 34ch;
    font: 400 clamp(0.95rem, 1vw, 1.05rem)/1.5 var(--sans);
    color: rgba(23, 23, 23, 0.86);
  }
  @media (prefers-color-scheme: dark) { #termDesc { color: rgba(242, 240, 234, 0.86); } }

  .rule {
    display: block; width: 100%; height: 1px; background: var(--line);
    margin: 1.6rem 0 0; transform-origin: 0 50%;
    animation: ruleGrow 0.7s var(--reveal-ease) both;
  }
  @keyframes ruleGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  .bubbles { display: flex; flex-direction: column; gap: 0.45rem; margin: 0; padding: 0; }
  .bubble {
    max-width: 88%; padding: 0.6rem 0.85rem; font: 14px/1.4 var(--sans);
    letter-spacing: -0.005em;
  }
  .bubble.q {
    align-self: flex-start; color: rgba(23, 23, 23, 0.9);
    border: 1px solid var(--line); border-radius: 0.85rem 0.85rem 0.85rem 0.1rem;
  }
  .bubble.a {
    align-self: flex-end; color: var(--paper-panel);
    background: var(--ink-panel); border-radius: 0.85rem 0.85rem 0.1rem 0.85rem;
  }
  .bubble p { margin: 0; }
  .bubble a { color: inherit; text-decoration: underline; text-underline-offset: 0.18em; cursor: pointer; }

  .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 0; }
  .chip {
    font: 500 13px/1 var(--sans); letter-spacing: -0.01em;
    color: rgba(23, 23, 23, 0.82);
    border: 1px solid var(--line-strong); background: transparent;
    border-radius: 999px; padding: 0.42em 0.9em; cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .chip:hover { color: var(--ink-panel); border-color: rgba(26, 26, 25, 0.6); }
  @media (prefers-color-scheme: dark) {
    .chip { color: rgba(242, 240, 234, 0.82); }
    .chip:hover { color: var(--ink-panel); border-color: rgba(236, 234, 228, 0.6); }
  }

  .def { font: 15px/1.65 var(--sans); color: rgba(23, 23, 23, 0.86); }
  @media (prefers-color-scheme: dark) { .def { color: rgba(242, 240, 234, 0.86); } }
  .def p { margin: 0.75em 0; }
  .def p:first-child { margin-top: 0; }
  .def a {
    color: inherit; text-decoration: underline; text-underline-offset: 0.18em;
    text-decoration-thickness: 1px; text-decoration-color: rgba(23, 23, 23, 0.38);
    cursor: pointer; transition: text-decoration-color 0.2s;
  }
  .def a:hover { text-decoration-color: var(--ink-panel); }
  @media (prefers-color-scheme: dark) {
    .def a { text-decoration-color: rgba(242, 240, 234, 0.38); }
    .def a:hover { text-decoration-color: var(--ink-panel); }
  }
  .def code {
    background: rgba(23, 23, 23, 0.08); padding: 0.05em 0.32em; border-radius: 0.3rem;
    font: 0.86em/1 var(--mono);
  }
  @media (prefers-color-scheme: dark) { .def code { background: rgba(242, 240, 234, 0.1); } }
  .def table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 13px; }
  .def th, .def td { border-bottom: 1px solid var(--line); padding: 0.5rem 0.7rem; text-align: left; vertical-align: top; }
  .def th {
    font: 700 10.5px/1 var(--mono); letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--muted); white-space: nowrap;
  }
  .def li { margin: 0.3em 0; }
  .def .rest[hidden] { display: none; }

  #readMore {
    background: none; border: none; cursor: pointer; padding: 0;
    color: rgba(23, 23, 23, 0.55);
    font: 700 10px/1 var(--mono); letter-spacing: 0.2em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.6rem;
    transition: color 0.2s;
  }
  #readMore:hover { color: var(--ink-panel); }
  #readMore .icon { display: inline-block; transition: transform 0.3s var(--reveal-ease); }
  #readMore[data-open="true"] .icon { transform: rotate(180deg); }
  @media (prefers-color-scheme: dark) {
    #readMore { color: rgba(242, 240, 234, 0.55); }
    #readMore:hover { color: var(--ink-panel); }
  }

  .actions { display: flex; gap: 0.6rem; margin: 1.4rem 0 0.4rem; flex-wrap: wrap; }
  .btn {
    font: 500 13px/1 var(--sans); letter-spacing: -0.01em;
    border-radius: 999px; padding: 0.55em 1.05em; cursor: pointer;
    display: inline-flex; align-items: center; gap: 0.45rem;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    border: 1px solid var(--line-strong); background: transparent;
    color: rgba(23, 23, 23, 0.82);
  }
  .btn:hover { color: var(--ink-panel); border-color: rgba(26, 26, 25, 0.6); }
  .btn.primary { background: var(--ink-panel); color: var(--paper-panel); border-color: var(--ink-panel); }
  .btn.primary:hover { background: rgba(23, 23, 23, 0.85); border-color: rgba(23, 23, 23, 0.85); }
  @media (prefers-color-scheme: dark) {
    .btn { color: rgba(242, 240, 234, 0.82); }
    .btn:hover { color: var(--ink-panel); border-color: rgba(236, 234, 228, 0.6); }
    .btn.primary { background: var(--ink-panel); color: var(--paper-panel); border-color: var(--ink-panel); }
    .btn.primary:hover { background: rgba(242, 240, 234, 0.88); border-color: rgba(242, 240, 234, 0.88); }
  }

  #prevNext {
    flex: none; display: flex; border-top: 1px solid var(--line);
    background: var(--paper-panel);
  }
  #prevNext button {
    flex: 1; background: none; border: none; cursor: pointer;
    padding: 0.9rem clamp(1.4rem, 2vw, 1.8rem);
    display: inline-flex; align-items: center; gap: 0.7rem;
    color: var(--ink-panel); font: 500 13px/1 var(--sans);
    transition: background 0.2s;
  }
  #prevNext button:hover { background: rgba(23, 23, 23, 0.04); }
  @media (prefers-color-scheme: dark) { #prevNext button:hover { background: rgba(242, 240, 234, 0.05); } }
  #prevNext button[data-dir="next"] { justify-content: flex-end; border-left: 1px solid var(--line); text-align: right; }
  #prevNext .arrow {
    width: 2rem; height: 2rem; border-radius: 50%;
    border: 1px solid var(--line-strong); color: var(--muted);
    display: grid; place-items: center; font-size: 14px; flex-shrink: 0;
    transition: color 0.2s, border-color 0.2s;
  }
  #prevNext button:hover .arrow { color: var(--ink-panel); border-color: rgba(26, 26, 25, 0.6); }
  @media (prefers-color-scheme: dark) { #prevNext button:hover .arrow { border-color: rgba(236, 234, 228, 0.6); } }
  #prevNext .meta { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; flex: 1; }
  #prevNext button[data-dir="next"] .meta { align-items: flex-end; }
  #prevNext .kickerS {
    font: 700 9px/1 var(--mono); letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--muted-soft);
  }
  #prevNext .name {
    font: 500 12.5px/1.3 var(--sans); color: rgba(23, 23, 23, 0.78);
    max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: color 0.2s;
  }
  #prevNext button:hover .name { color: var(--ink-panel); }
  @media (prefers-color-scheme: dark) {
    #prevNext .name { color: rgba(242, 240, 234, 0.78); }
    #prevNext button:hover .name { color: var(--ink-panel); }
  }

  #toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 60;
    background: var(--ink); color: var(--paper);
    padding: 8px 18px; border-radius: 999px; font: 13px/1 var(--sans);
    opacity: 0; transition: opacity 0.25s; pointer-events: none;
  }
  #toast.show { opacity: 1; }

  .overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(17, 17, 17, 0.42);
    backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
    display: none; align-items: center; justify-content: center;
  }
  .overlay.show { display: flex; }
  .sheet {
    width: min(92vw, 30rem); max-height: 88dvh; overflow-y: auto;
    background: var(--paper-panel); color: var(--ink-panel);
    border: 1px solid var(--line); border-radius: 1rem;
    padding: clamp(1.6rem, 3vw, 2.2rem);
    box-shadow: 0 30px 80px -40px rgba(0, 0, 0, 0.6);
    font: 15px/1.55 var(--sans);
  }
  .sheet h2 {
    margin: 0.6rem 0 0; font: 700 clamp(1.4rem, 2.6vw, 1.9rem)/1 var(--sans);
    letter-spacing: -0.03em;
  }
  .sheet .kickerS {
    font: 700 10px/1 var(--mono); letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--muted-soft); margin: 0;
  }
  .sheet p { margin: 0.9rem 0 0; color: rgba(23, 23, 23, 0.84); }
  .sheet code { font: 0.86em/1 var(--mono); background: rgba(23, 23, 23, 0.08); padding: 0.05em 0.32em; border-radius: 0.3rem; }
  @media (prefers-color-scheme: dark) {
    .sheet p { color: rgba(242, 240, 234, 0.84); }
    .sheet code { background: rgba(242, 240, 234, 0.1); }
  }
  .sheet .rule { margin: 1.4rem 0; animation: none; transform: none; }
  .sheet .btn { margin-top: 0.4rem; }

  /* Mobile: canvas stays full, panel becomes a bottom sheet. The reference
     sheet covers ~55% of the viewport so the focused node stays visible above
     it; 68dvh is our compromise that still fits the definition + chips. */
  @media (max-width: 800px) {
    :root { --panel-w: 100vw; --panel-shift: 0vw; }
    #canvasWrap[data-shift="true"] { transform: translateY(-34dvh); }
    #panel {
      top: auto; bottom: 0; left: 0; right: 0;
      width: 100vw; height: 68dvh;
      border-left: none; border-top: 1px solid var(--line);
      border-radius: 1.25rem 1.25rem 0 0;
      transform: translateY(100%);
      box-shadow: 0 -20px 44px -30px rgba(0, 0, 0, 0.55);
    }
    #panel[data-open="true"] { transform: translateY(0); }
    .fab[data-shift="true"] { right: 14px !important; }
    #infoBtn { top: 14px; right: 14px; }
    #searchBar { top: 14px; left: 14px; }
    #searchBar[data-active="true"] { width: calc(100vw - 84px); }
    #searchCount { top: 68px; left: 26px; }
    #orbitHint { font-size: 11px; }
    #panelInner { padding: 3.6rem 1.4rem 1rem; }
    #termTitle { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
</head>
<body>
<div id="canvasWrap">
  <div id="graph"></div>
</div>
<div id="vignette"></div>
<div id="searchBar">
  <button id="searchIcon" type="button" aria-label="搜索">
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="9" cy="9" r="5.5"/><path d="m13.2 13.2 3.6 3.6"/></svg>
  </button>
  <input id="searchInput" type="text" placeholder="搜索词条…" autocomplete="off" spellcheck="false">
  <button id="clearBtn" type="button" aria-label="清除">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m4 4 8 8M12 4l-8 8"/></svg>
  </button>
</div>
<div id="searchCount"></div>
<button id="infoBtn" class="fab" type="button" title="关于" aria-label="关于">i</button>
<div id="orbitHint">
  <span class="dot"></span>
  <span>拖动旋转 · 滚轮缩放 · 点击节点查看详情</span>
</div>
<div id="panel" data-open="false" aria-hidden="true">
  <button id="closePanel" type="button" aria-label="关闭"><span class="mark"></span></button>
  <div id="panelScroll">
    <div id="panelInner"></div>
  </div>
  <div id="prevNext">
    <button id="prevBtn" type="button" data-dir="prev">
      <span class="arrow">←</span>
      <span class="meta">
        <span class="kickerS">Prev</span>
        <span class="name" id="prevName"></span>
      </span>
    </button>
    <button id="nextBtn" type="button" data-dir="next">
      <span class="meta">
        <span class="kickerS">Next</span>
        <span class="name" id="nextName"></span>
      </span>
      <span class="arrow">→</span>
    </button>
  </div>
</div>
<div id="infoOverlay" class="overlay">
  <div class="sheet">
    <p class="kickerS">About</p>
    <h2>AI 编程词典</h2>
    <p>把 AI 编程的词汇翻译成大白话。中文版译自 Matt Pocock 的 <em>AI Coding Dictionary</em>（aihero.dev），词条结构与概念归原作者。</p>
    <span class="rule"></span>
    <p style="font-size:14px;">3D 图中的节点代表词条，连线表示交叉引用，点的大小反映被引用的频次。拖动旋转视角，滚轮缩放，点击节点即可在右侧面板查看详情。数据与 README、词条文件同源，由 <code>npm run site</code> 生成。</p>
    <button class="btn" type="button" onclick="document.getElementById('infoOverlay').classList.remove('show')">关闭</button>
  </div>
</div>
<div id="toast"></div>
<script id="data" type="application/json">${dataJson}</script>
<script src="vendor/graph.iife.min.js"></script>
<script type="module">
(function () {
  // Single-instance bundle (see internal/vendor/entry.mjs): one copy of
  // three.js shared by the app and the graph library.
  var ForceGraph3D = window.AICD.ForceGraph3D;
  var THREE = window.AICD.THREE;
  var DATA = JSON.parse(document.getElementById("data").textContent);
  var TERMS = DATA.terms;
  var GRAPH = DATA.graph;
  var bySlug = {};
  TERMS.forEach(function (t, i) { t.index = i; bySlug[t.slug] = t; });

  var panelInner = document.getElementById("panelInner");
  var current = null;
  var focused = false; // true once clicked / deep-linked / prev-next (graph radiates links)
  var collapsed = true;
  var neighbors = {};
  var hoverNode = null; // transient highlight while the pointer is over a node
  var hoverNb = {};
  var searchFilter = null; // map of visible node ids while searching

  /* ---------- 3D graph ---------- */
  // Full-viewport canvas; the wrap translates left when the panel opens.
  var canvasWrap = document.getElementById("canvasWrap");
  var nodes = GRAPH.nodes.map(function (n) {
    return { id: n.id, name: n.name, degree: n.degree, section: TERMS[n.id].section };
  });
  var links = GRAPH.edges.map(function (e) { return { source: e[0], target: e[1] }; });

  function isHidden(n) {
    return !!searchFilter && !searchFilter[n.id];
  }

  function refreshLinks() {
    // Re-set the accessors so the library recomputes every link's look. Only
    // call this on state changes (select / hover / search); see the pitfall
    // memo for why an engine-driven refresh loop is forbidden.
    try {
      Graph.linkColor(Graph.linkColor());
      Graph.linkWidth(Graph.linkWidth());
      Graph.linkDirectionalParticles(Graph.linkDirectionalParticles());
    } catch (e) {}
  }
  // Debounce hover / search refreshes: each refresh rebuilds the library's
  // link geometry, so a pointer sweep across many nodes collapses into one
  // refresh once the target settles instead of one per node.
  var refreshTimer = null;
  function refreshLinksSoon() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      refreshLinks();
    }, 180);
  }
  function refreshLinksNow() {
    if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null; }
    refreshLinks();
  }

  var labelTexCache = {};
  var darkMode =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-color-scheme: dark)").matches;
  // Labels use the mono stack in uppercase, matching the reference site's
  // node captions; the paper-coloured halo keeps them legible over links.
  var LABEL_COLOR = darkMode ? "rgba(226,224,218,0.92)" : "rgba(40,40,38,0.88)";
  var LABEL_STROKE = darkMode ? "#131311" : "#f2f2f0";
  function labelTexture(text) {
    if (labelTexCache[text]) return labelTexCache[text];
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    // Single-quoted so the inner double quotes survive the TS template
    // string that emits this into the inline <script> verbatim.
    var font = '600 34px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
    ctx.font = font;
    var w = Math.ceil(ctx.measureText(text).width) + 20;
    canvas.width = w;
    canvas.height = 52;
    ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = LABEL_STROKE;
    ctx.strokeText(text, 10, 28);
    ctx.fillStyle = LABEL_COLOR;
    ctx.fillText(text, 10, 28);
    var texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    var entry = { texture: texture, w: w, h: 52 };
    labelTexCache[text] = entry;
    return entry;
  }

  // Nodes are a single sphere mesh + optional label sprite. The earlier build
  // added a backside "stroke shell" to fake an outline ring, which doubled the
  // geometry count and shaded every node twice per frame - dropped for perf.
  // The paper-coloured background + vignette gives enough contrast on its own.
  var sphereGeo = new THREE.SphereGeometry(1, 20, 20);
  var COLOR_BASE = new THREE.Color(darkMode ? "#8f8c85" : "#5c5a55");
  var COLOR_SEL = new THREE.Color(darkMode ? "#eceae4" : "#1a1a19");
  var R_NODE = 1.8; // world units per sqrt(value)
  // sqrt (not cbrt) spreads the size range ~4.7x between degree-0 and degree-9
  // nodes. The absolute scale is tuned so the largest hub spans ~7-8% of the
  // viewport height at the root framing, matching the reference site where
  // hubs read clearly larger but never dominate the frame.
  function baseVal(n) {
    return 0.5 + Math.min(n.degree, 9) * 1.2;
  }
  function nodeRadius(n) {
    return Math.sqrt(baseVal(n)) * R_NODE;
  }
  function buildNodeObject(n) {
    var grp = new THREE.Group();
    var mat = new THREE.MeshBasicMaterial({
      color: COLOR_BASE.clone(),
      transparent: true,
      opacity: 0.9,
    });
    var mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.scale.setScalar(nodeRadius(n));
    var lt = labelTexture(n.name.toUpperCase());
    var lmat = new THREE.SpriteMaterial({
      map: lt.texture,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    });
    var sprite = new THREE.Sprite(lmat);
    // Caption height eases gently with node size (near-uniform, like the
    // reference): ~2 world units on leaves up to ~3.3 on the biggest hub.
    var h0 = 2.0 + nodeRadius(n) * 0.28;
    var S0 = h0 / 52; // 52 = label texture height in px
    sprite.scale.set(lt.w * S0, lt.h * S0, 1);
    sprite.visible = false;
    grp.add(mesh);
    grp.add(sprite);
    n.__obj = grp;
    n.__mesh = mesh;
    n.__mat = mat;
    n.__sprite = sprite;
    n.__lt = lt;
    n.__a = 0.9;
    n.__s = baseVal(n);
    return grp;
  }

  // Ease every node towards its target opacity/scale. The loop reports whether
  // anything is still moving so the sleep timer can retire the frame loop
  // once the scene settles (idle = zero frames rendered, like the reference).
  function animateNodes() {
    if (paused) { loopsRunning = false; return; }
    var act = activeState();
    var moving = false;
    // Ambient spin: ease the camera azimuthally around the cloud centre while
    // the root view is at rest (see the spin state machine below).
    // OrbitControls' rotateLeft helper is absent
    // from the vendored three build, so orbit the position directly; Orbit
    // Controls re-derives its spherical from the live camera on the next
    // user interaction, so handing control back stays seamless.
    if (rotating && spinCenter) {
      var cam = null;
      try { cam = Graph.camera(); } catch (e) {}
      if (cam) {
        var px = cam.position.x - spinCenter.x;
        var pz = cam.position.z - spinCenter.z;
        var ang = SPIN_RATE;
        var ca = Math.cos(ang);
        var sa = Math.sin(ang);
        cam.position.x = spinCenter.x + px * ca + pz * sa;
        cam.position.z = spinCenter.z - px * sa + pz * ca;
        cam.lookAt(spinCenter);
      }
    }
    // Gather tween: exponential approach toward each target. Self-correcting
    // if the d3 engine ticks mid-tween, and free at rest - once converged the
    // scene sleeps as usual. See the gather section below setGatherTargets.
    var gathering = false;
    for (var gid in gatherMap) {
      var g = gatherMap[gid];
      var gn = g.n;
      if (gn.x === undefined) { delete gatherMap[gid]; continue; }
      var gdx = g.tx - gn.x, gdy = g.ty - gn.y, gdz = g.tz - gn.z;
      if (Math.abs(gdx) > 0.05 || Math.abs(gdy) > 0.05 || Math.abs(gdz) > 0.05) {
        gn.x += gdx * 0.07;
        gn.y += gdy * 0.07;
        gn.z += gdz * 0.07;
        gathering = true;
      } else {
        gn.x = g.tx; gn.y = g.ty; gn.z = g.tz;
      }
    }
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      // The library builds node objects lazily on its own first render, which
      // can happen after this loop's first frame - guard against undefined.
      if (!n.__mesh) continue;
      var hidden = isHidden(n);
      var isSel = !!(act && n.id === act.id);
      var isNb = !!(act && act.nb[n.id]);
      var isMatch = !!(searchFilter && searchFilter[n.id]);
      var aTarget = hidden
        ? 0
        : searchFilter
          ? (isMatch ? 1 : 0)
          : act
            ? (isSel ? 1 : isNb ? 0.95 : 0.3)
            : 0.92;
      var sTarget = hidden ? 0.0001 : baseVal(n) * (isSel ? 1.6 : 1);
      var da = aTarget - n.__a;
      var ds = sTarget - n.__s;
      if (da > 0.002 || da < -0.002 || ds > 0.008 || ds < -0.008) moving = true;
      n.__a += da * 0.16;
      if (aTarget === 0 && n.__a < 0.008) n.__a = 0;
      if (aTarget >= 1 && n.__a > 0.992) n.__a = 1;
      n.__s += ds * 0.16;
      var r = Math.sqrt(Math.max(n.__s, 1e-6)) * R_NODE;
      n.__mesh.scale.setScalar(r);
      n.__mat.opacity = n.__a;
      n.__mat.color.lerp(isSel ? COLOR_SEL : COLOR_BASE, 0.18);
      // Every visible node carries its caption, like the reference site;
      // hidden (search-filtered) nodes drop theirs.
      var showLabel = !hidden && n.__a > 0.25;
      if (n.__sprite.visible !== showLabel) moving = true;
      n.__sprite.visible = showLabel;
      if (showLabel) {
        n.__sprite.material.opacity = Math.min(n.__a, 0.95);
        var h = 2.0 + r * 0.28;
        var S = h / 52;
        n.__sprite.scale.set(n.__lt.w * S, n.__lt.h * S, 1);
        n.__sprite.position.y = r + h * 0.8;
      }
    }
    animating = moving || gathering;
    requestAnimationFrame(animateNodes);
  }

  var Graph = ForceGraph3D({ controlType: "orbit" })(document.getElementById("graph"))
    .width(window.innerWidth)
    .height(window.innerHeight)
    .graphData({ nodes: nodes, links: links })
    .backgroundColor("rgba(0,0,0,0)")
    .showNavInfo(false)
    .nodeLabel(function () { return ""; })
    .nodeThreeObject(function (n) { return n.__obj || buildNodeObject(n); })
    .linkColor(function (l) {
      var s = typeof l.source === "object" ? l.source.id : l.source;
      var t = typeof l.target === "object" ? l.target.id : l.target;
      if (searchFilter && (!searchFilter[s] || !searchFilter[t])) return "rgba(0,0,0,0)";
      // Idle links are fully hidden - the reference reads as "no lines" until
      // a node is hovered/focused, then only its own edges pick up the ink.
      // Hiding them also skips drawing 500+ segments in the resting scene.
      return isHot(l)
        ? (darkMode ? "rgba(232,230,224,0.8)" : "rgba(26,26,25,0.65)")
        : "rgba(0,0,0,0)";
    })
    .linkWidth(function (l) { return isHot(l) ? 0.8 : 0; })
    .linkOpacity(0.4)
    // Directional particles only on the focused node's links (a handful), so
    // the cost stays tiny while the reference's "flow" cue is preserved.
    .linkDirectionalParticles(function (l) { return isHot(l) ? 3 : 0; })
    .linkDirectionalParticleSpeed(0.004)
    .linkDirectionalParticleWidth(0.9)
    .onNodeClick(function (n) { select(TERMS[n.id], true); })
    .onNodeHover(function (n) {
      if (n && isHidden(n)) n = null; // don't light up search-filtered nodes
      // Sticky hover: gather slides a neighbour under the stationary pointer,
      // which would otherwise steal the emphasis and flicker the radiating
      // lines. A gathered neighbour only wins after the pointer leaves first.
      if (n && hoverNode && n !== hoverNode && hoverNb[n.id]) return;
      if (n === hoverNode) return;
      // While a selection owns the emphasis, hover is inert (reference
      // behaviour): track it for stickiness but skip the link refresh and
      // gather churn - clicking is what moves the focus.
      var hadFocus = !!(current && focused);
      hoverNode = n || null;
      hoverNb = hoverNode ? computeNeighbors(hoverNode.id) : {};
      if (!hadFocus) {
        refreshLinksSoon();
        // Hover is a first-class focus on the root view: lines radiate and
        // neighbours gather around the hovered node; on hover-out they
        // release back home (or to the selected term if one is focused).
        queueGather(120);
      }
      wake();
    })
    .onBackgroundClick(function () {
      // Like the reference: clicking empty space is what clears a selection
      // and eases the camera back to the root framing.
      if (current || focused) clearSelection();
    })
    .onEngineStop(function () {
      engineSettled = true;
      // Frame the whole graph once the layout settles. Focused views own the
      // camera via fitCluster, so never let this whole-graph framing overwrite
      // them. Never call refreshLinks() here: re-setting accessors restarts the
      // engine and re-fires onEngineStop - the churn-loop pitfall.
      if (!fitted && !(current && focused)) {
        fitted = true;
        frameRoot();
        queueWelcomeSpin();
      } else if (current && focused && nodes[current.index].x !== undefined) {
        // Link refreshes reheat the engine and drift node positions after
        // the camera aimed; re-aim once it re-settles so the selected node
        // stays centred. Camera tweens never restart the engine, so this
        // cannot loop.
        try { fitCluster(current.index); } catch (e) {}
      }
    });

  var fitted = false;
  var engineSettled = false;

  /* ---------- idle sleep: zero frames while nothing is happening ---------- */

  // The library renders every animation frame and our easing loop runs
  // alongside it, so an open page burns CPU/GPU forever even when nothing
  // moves. Drive an explicit sleep/wake cycle instead: activity (pointer,
  // hover, selection, search, engine ticks, camera tweens, easing) keeps the
  // loop alive; once everything converges it pauses completely - like the
  // reference site, whose idle page renders zero frames.
  var paused = false;
  var loopsRunning = false;
  var sleepTimer = null;
  var animating = true; // eased node properties have not converged yet
  var rotating = false;
  var spinResumeTimer = null;
  var SPIN_RATE = 0.0018; // rad/frame at 60fps ≈ 58s per revolution
  function yieldSpin() {
    rotating = false;
    if (spinResumeTimer) { clearTimeout(spinResumeTimer); spinResumeTimer = null; }
  }
  function maybeResumeSpin() {
    spinResumeTimer = null;
    if (current && focused) return; // a selection still owns the camera
    rotating = true;
    wake();
  }
  function pauseSpinTemporarily() {
    yieldSpin();
    spinResumeTimer = setTimeout(maybeResumeSpin, 3000);
  }
  // First framing at boot: start the ambient spin unless a deep link opened
  // straight into a focused view.
  function queueWelcomeSpin() {
    setTimeout(function () {
      if (!(current && focused)) maybeResumeSpin();
    }, 1400);
  }

  function startLoops() {
    if (loopsRunning) return;
    loopsRunning = true;
    requestAnimationFrame(animateNodes);
  }
  function wake() {
    if (sleepTimer) { clearTimeout(sleepTimer); sleepTimer = null; }
    if (paused) {
      paused = false;
      try { Graph.resumeAnimation(); } catch (e) {}
    }
    startLoops();
    scheduleSleep();
  }
  function scheduleSleep() {
    if (sleepTimer) clearTimeout(sleepTimer);
    // 500ms is short enough that a settled scene stops burning frames quickly,
    // but long enough that hover / pointer-move bursts don't thrash wake-sleep.
    sleepTimer = setTimeout(trySleep, 500);
  }
  function trySleep() {
    sleepTimer = null;
    if (paused) return;
    // Still busy? Engine ticks move nodes, camera tweens move the camera, and
    // hover/opacity easing needs a moment after the last interaction - check
    // again shortly instead of sleeping mid-animation.
    if (hoverNode || animating || rotating || engineMoving() || cameraIsMoving()) {
      scheduleSleep();
      return;
    }
    paused = true;
    try { Graph.pauseAnimation(); } catch (e) {}
  }
  // Nodes move while the d3 engine ticks (initial layout, link refreshes) and
  // stand still once it cools down.
  function engineMoving() {
    var moved = false;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.__px === undefined) {
        n.__px = n.x;
        n.__py = n.y;
        n.__pz = n.z;
        continue;
      }
      if (
        Math.abs(n.x - n.__px) > 0.05 ||
        Math.abs(n.y - n.__py) > 0.05 ||
        Math.abs(n.z - n.__pz) > 0.05
      )
        moved = true;
      n.__px = n.x;
      n.__py = n.y;
      n.__pz = n.z;
    }
    return moved;
  }
  var camProbe = null;
  function cameraIsMoving() {
    var cam = null;
    try { cam = Graph.camera(); } catch (e) {}
    if (!cam || !cam.position) return false;
    var c = cam.position;
    if (camProbe === null) {
      camProbe = { x: c.x, y: c.y, z: c.z };
      return true;
    }
    var moved =
      Math.abs(c.x - camProbe.x) > 0.5 ||
      Math.abs(c.y - camProbe.y) > 0.5 ||
      Math.abs(c.z - camProbe.z) > 0.5;
    camProbe.x = c.x;
    camProbe.y = c.y;
    camProbe.z = c.z;
    return moved;
  }

  // The graph emphasises one thing at a time, like the reference: a clicked
  // / deep-linked term owns the emphasis - hovering other nodes does nothing
  // while it is focused - and hover only takes over on the unselected root
  // view. null means everything is idle.
  function activeState() {
    if (current && focused) return { id: current.index, nb: neighbors };
    if (hoverNode) return { id: hoverNode.id, nb: hoverNb };
    return null;
  }
  function isHot(l) {
    var act = activeState();
    if (!act) return false;
    var s = typeof l.source === "object" ? l.source.id : l.source;
    var t = typeof l.target === "object" ? l.target.id : l.target;
    return s === act.id || t === act.id;
  }

  function computeNeighbors(i) {
    var set = {};
    GRAPH.edges.forEach(function (e) {
      if (e[0] === i) set[e[1]] = 1;
      if (e[1] === i) set[e[0]] = 1;
    });
    return set;
  }

  /* ---------- gather: ease a selection's neighbours toward it ---------- */
  // The reference only re-frames the camera; per the user's request we also
  // pull connected nodes ~1/3 of the way toward the hovered / selected node
  // once the layout has cooled, and send them home when the emphasis clears. The
  // tween runs in the shared rAF loop (see animateNodes) and costs nothing
  // at rest - once converged the scene sleeps as usual.
  var gatherMap = {};
  var GATHER_PULL = 0.32;
  function setGatherTargets(selIdx) {
    var next = {};
    var sel = selIdx != null ? nodes[selIdx] : null;
    var i, n, id, g;
    if (sel && sel.x !== undefined && engineSettled) {
      var nb = computeNeighbors(selIdx);
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        if (!nb[n.id] || n.x === undefined) continue;
        // Home = natural position, captured the first time this node is
        // pulled, so releasing always returns it to the same spot.
        var home = gatherMap[n.id] ? gatherMap[n.id].home : { x: n.x, y: n.y, z: n.z };
        next[n.id] = {
          n: n,
          home: home,
          tx: sel.x + (n.x - sel.x) * GATHER_PULL,
          ty: sel.y + (n.y - sel.y) * GATHER_PULL,
          tz: sel.z + (n.z - sel.z) * GATHER_PULL,
        };
      }
    }
    // Nodes gathered for a previous selection (or all of them, on clear)
    // ease back to their captured home positions.
    for (id in gatherMap) {
      g = gatherMap[id];
      if (!next[id]) {
        next[id] = { n: g.n, home: g.home, tx: g.home.x, ty: g.home.y, tz: g.home.z };
      }
    }
    gatherMap = next;
    wake();
  }
  // The gather target is whatever owns the emphasis right now: the hovered
  // node wins, then the focused selection, else everything releases home.
  // Debounce so a pointer sweep across many nodes collapses into one pull,
  // and give click-triggered pulls a beat behind the camera tween.
  var gatherDelay = null;
  function expectedGatherTarget() {
    if (current && focused) return current.index;
    if (hoverNode) return hoverNode.id;
    return null;
  }
  function queueGather(delay) {
    if (gatherDelay) clearTimeout(gatherDelay);
    gatherDelay = setTimeout(function () {
      gatherDelay = null;
      setGatherTargets(expectedGatherTarget());
    }, delay || 120);
  }

  window.addEventListener("resize", function () {
    Graph.width(window.innerWidth).height(window.innerHeight);
    wake();
  });

  // Any pointer activity on the canvas wakes the frame loop (a paused scene
  // still receives pointer events, so hover and dragging resume rendering).
  // The first gesture also hides the orbit hint chip.
  var orbitHint = document.getElementById("orbitHint");
  function hideHint() {
    if (orbitHint && orbitHint.dataset.hide !== "true") {
      orbitHint.dataset.hide = "true";
    }
  }
  ["pointermove", "pointerdown", "wheel", "pointerleave"].forEach(function (ev) {
    document.getElementById("graph").addEventListener(ev, wake, { passive: true });
  });
  ["pointerdown", "wheel"].forEach(function (ev) {
    document.getElementById("graph").addEventListener(ev, hideHint, { once: true, passive: true });
    document.getElementById("graph").addEventListener(ev, pauseSpinTemporarily, { passive: true });
  });

  /* ---------- camera focus ---------- */
  // A selection eases the camera toward its node (biased so the node lands
  // mid-screen next to the open panel); clearing a selection eases back to
  // the root framing. The ambient spin yields to every camera tween here.

  // Root framing: pull the camera in to a close-up of the node cloud so it
  // fills the viewport with outer hubs cropping at the edges, exactly like
  // the reference's root view. We compute the cloud's bounding sphere and
  // place the camera at ~66% of the exact-fit distance. Doing it via
  // cameraPosition (rather than zoomToFit + a zoom multiplier) avoids relying
  // on the library's async zoom getter, which returned a stale pre-fit value
  // and left the cloud a small centred clump.
  var spinCenter = null; // welcome-spin orbit centre (cloud centroid)
  function frameRoot() {
    var cx = 0, cy = 0, cz = 0, i, n;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      cx += n.x || 0; cy += n.y || 0; cz += n.z || 0;
    }
    cx /= nodes.length; cy /= nodes.length; cz /= nodes.length;
    var R = 1;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      var ddx = (n.x || 0) - cx, ddy = (n.y || 0) - cy, ddz = (n.z || 0) - cz;
      var dd = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
      if (dd > R) R = dd;
    }
    spinCenter = { x: cx, y: cy, z: cz };
    var fov = (Graph.camera().fov || 40) * Math.PI / 180;
    var fitDist = (R / Math.tan(fov / 2)) * 1.05;
    var dist = fitDist * 0.9; // node cloud fills the frame, hubs kiss the edges
    var cam = Graph.cameraPosition();
    var vx = cam.x - cx, vy = cam.y - cy, vz = cam.z - cz;
    var vd = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
    Graph.cameraPosition(
      { x: cx + (vx / vd) * dist, y: cy + (vy / vd) * dist, z: cz + (vz / vd) * dist },
      { x: cx, y: cy, z: cz },
      1100
    );
  }

  function fitCluster(selIdx) {
    var selN = nodes[selIdx];
    if (selN.x === undefined) return; // engine has not placed nodes yet
    var R = 100; // framing radius: selected node + its neighbours read clearly
    var cam = Graph.cameraPosition();
    var dx = cam.x - selN.x, dy = cam.y - selN.y, dz = cam.z - selN.z;
    var d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    var fov = (Graph.camera().fov || 40) * Math.PI / 180;
    var dist = (R / Math.tan(fov / 2)) * 1.05;
    // Centre the node in the *visible* area: with the panel open the wrap
    // translates left by half the panel width, so bias the look-at target
    // right by the same fraction of the frustum width to land the node
    // mid-screen instead of mid-canvas (mobile shifts vertically instead,
    // which the default centring already accounts for).
    var look = { x: selN.x, y: selN.y, z: selN.z };
    if (panelOpen && window.innerWidth > 800) {
      var fx = -dx / d, fy = -dy / d, fz = -dz / d; // camera forward
      var rx = -fz, rz = fx; // forward x up(0,1,0), renormalised below
      var rl = Math.sqrt(rx * rx + rz * rz) || 1;
      rx /= rl; rz /= rl;
      var aspect = window.innerWidth / Math.max(window.innerHeight, 1);
      var off = 0.3333 * dist * Math.tan(fov / 2) * aspect;
      look.x = selN.x - rx * off;
      look.z = selN.z - rz * off;
    }
    Graph.cameraPosition(
      { x: selN.x + (dx / d) * dist, y: selN.y + (dy / d) * dist, z: selN.z + (dz / d) * dist },
      look,
      700
    );
  }

  /* ---------- panel (slides in from the right, canvas shifts to make room) ---------- */
  var panelEl = document.getElementById("panel");
  var panelScroll = document.getElementById("panelScroll");
  var infoBtn = document.getElementById("infoBtn");
  var prevNameEl = document.getElementById("prevName");
  var nextNameEl = document.getElementById("nextName");
  var panelOpen = false;

  function setPanelOpen(open) {
    if (panelOpen === open) return;
    panelOpen = open;
    panelEl.dataset.open = open ? "true" : "false";
    panelEl.setAttribute("aria-hidden", open ? "false" : "true");
    // Reference behaviour: canvas slides left by half the panel width, and
    // the top-right icon buttons follow so they never sit on top of the panel.
    canvasWrap.dataset.shift = open ? "true" : "false";
    infoBtn.dataset.shift = open ? "true" : "false";
    if (open) hideHint();
    // Give the browser a frame to apply the new canvas size before the
    // renderer recomputes; the CSS transition runs on the compositor so the
    // canvas keeps drawing smoothly while the wrap translates.
    wake();
  }
  // Closing the panel only hides it - the selection (radiating links,
  // gathered neighbours, camera focus) stays, like the reference's Esc
  // behaviour. Clicking empty canvas is what actually clears the selection.
  function hidePanelOnly() {
    setPanelOpen(false);
    wake();
  }
  function clearSelection() {
    current = null;
    focused = false;
    hoverNode = null;
    hoverNb = {};
    hidePanelOnly();
    setGatherTargets(null);
    refreshLinksSoon();
    // Ease the camera back to the root framing, then let the ambient spin
    // pick up again once the tween has settled.
    try { frameRoot(); } catch (e) {}
    pauseSpinTemporarily();
    // Clean the URL so a reload returns to the root view.
    if (location.search || location.hash) history.replaceState(null, "", location.pathname);
    wake();
  }
  document.getElementById("closePanel").addEventListener("click", hidePanelOnly);

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }
  function renderPanel(t) {
    var sortedLinks = t.links.slice().sort(function (a, b) { return a.localeCompare(b); });
    var chips = sortedLinks.map(function (name) {
      var target = TERMS.find(function (x) { return x.name === name; });
      return '<button class="chip" type="button" data-slug="' + target.slug + '">' + esc(name) + "</button>";
    }).join("");
    var usageHtml = t.usage.map(function (u, i) {
      return '<div class="bubble ' + (i % 2 ? "a" : "q") + '">' + u + "</div>";
    }).join("");
    panelInner.innerHTML =
      '<div class="kicker">' + esc(DATA.sections[t.section]) + "</div>" +
      '<h1 id="termTitle">' + esc(t.name) + "</h1>" +
      '<p id="termDesc">' + esc(t.description) + "</p>" +
      '<span class="rule"></span>' +
      (usageHtml ? '<div class="kicker">Usage</div><div class="bubbles" id="usageBubbles">' + usageHtml + "</div>" : "") +
      (chips ? '<div class="kicker">Connects to</div><div class="chips">' + chips + "</div>" : "") +
      '<div class="kicker">Full definition</div>' +
      '<div class="def"><div>' + t.firstPara + "</div>" +
      '<div class="rest" id="defRest" hidden>' + t.restHtml + "</div></div>" +
      '<button id="readMore" type="button" data-open="false">Read more <span class="icon">⌄</span></button>' +
      '<div class="actions">' +
      '<button class="btn primary" type="button" id="copyMdBtn">Copy Markdown</button>' +
      '<button class="btn" type="button" id="shareBtn">Share</button>' +
      "</div>";
    bindPanel(t);
    // Prev / Next labels preview the neighbouring terms.
    var p = TERMS[(t.index - 1 + TERMS.length) % TERMS.length];
    var nx = TERMS[(t.index + 1) % TERMS.length];
    if (prevNameEl) prevNameEl.textContent = p.name;
    if (nextNameEl) nextNameEl.textContent = nx.name;
  }

  function bindPanel(t) {
    var rm = document.getElementById("readMore");
    rm.addEventListener("click", function () {
      collapsed = !collapsed;
      document.getElementById("defRest").hidden = collapsed;
      rm.dataset.open = collapsed ? "false" : "true";
      rm.firstChild.nodeValue = collapsed ? "Read more " : "Read less ";
    });
    document.getElementById("copyMdBtn").addEventListener("click", function () {
      navigator.clipboard.writeText(t.bodyMd).then(function () { toast("Markdown 已复制"); });
    });
    document.getElementById("shareBtn").addEventListener("click", function () {
      var url = location.origin + location.pathname + "?term=" + t.slug;
      history.replaceState(null, "", "?term=" + t.slug);
      navigator.clipboard.writeText(url).then(function () { toast("链接已复制"); });
    });
    panelInner.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () { select(bySlug[chip.dataset.slug], true); });
    });
    panelInner.querySelectorAll("#panelInner .def a, #usageBubbles a").forEach(function (a) {
      var m = (a.getAttribute("href") || "").match(/^#term=(.+)$/);
      if (!m) return;
      var name = decodeURIComponent(m[1]);
      var target = TERMS.find(function (x) { return x.name === name; });
      if (target) {
        a.addEventListener("click", function (ev) { ev.preventDefault(); select(target, true); });
      }
    });
    collapsed = true;
  }

  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg; el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 1600);
  }

  /* ---------- selection ---------- */
  function select(t, push, focus) {
    current = t;
    focused = focus !== false;
    collapsed = true;
    neighbors = computeNeighbors(t.index);
    renderPanel(t);
    setPanelOpen(true);
    refreshLinksNow();
    wake();
    if (push) history.replaceState(null, "", "?term=" + t.slug);
    if (panelScroll) panelScroll.scrollTop = 0;
    // A focused view owns the camera: the ambient spin yields while the
    // selection is active (Esc keeps it paused; clearing the selection
    // resumes it).
    yieldSpin();
    // Camera eases toward the selected node and its neighbours gather.
    try { fitCluster(t.index); } catch (e) {}
    queueGather(260);
  }
  function step(delta) {
    if (!current) return;
    var i = (current.index + delta + TERMS.length) % TERMS.length;
    select(TERMS[i], true);
  }
  document.getElementById("prevBtn").addEventListener("click", function () { step(-1); });
  document.getElementById("nextBtn").addEventListener("click", function () { step(1); });

  /* ---------- search: pill expands on focus, filters the graph live ---------- */
  var searchBar = document.getElementById("searchBar");
  var searchIcon = document.getElementById("searchIcon");
  var input = document.getElementById("searchInput");
  var clearBtn = document.getElementById("clearBtn");
  var countEl = document.getElementById("searchCount");

  function setSearchActive(active) {
    searchBar.dataset.active = active ? "true" : "false";
  }
  function nameMatches(q) {
    q = q.trim().toLowerCase();
    return TERMS.filter(function (t) {
      return t.name.toLowerCase().indexOf(q) !== -1;
    });
  }
  function updateFilter(q) {
    wake();
    q = (q || "").trim().toLowerCase();
    if (q) clearBtn.classList.add("has-value");
    else clearBtn.classList.remove("has-value");
    if (!q) {
      searchFilter = null;
      countEl.dataset.show = "false";
      refreshLinksSoon();
      return;
    }
    var matches = nameMatches(q);
    var vis = {};
    matches.forEach(function (t) { vis[t.index] = 1; });
    searchFilter = vis;
    countEl.textContent = matches.length + (matches.length === 1 ? " 个词条" : " 个词条");
    countEl.dataset.show = "true";
    refreshLinksSoon();
  }
  searchIcon.addEventListener("click", function () {
    setSearchActive(true);
    input.focus();
  });
  input.addEventListener("focus", function () { setSearchActive(true); });
  input.addEventListener("blur", function () {
    // Collapse back to the icon pill only when empty; otherwise keep it open
    // so the user can see what they searched for while they inspect the graph.
    if (!input.value) setSearchActive(false);
  });
  input.addEventListener("input", function () { updateFilter(input.value); });
  clearBtn.addEventListener("click", function () {
    input.value = ""; updateFilter(""); input.focus();
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      input.value = ""; updateFilter(""); input.blur(); setSearchActive(false);
    }
    if (e.key === "Enter") {
      var first = nameMatches(input.value)[0];
      if (first) select(first, true);
    }
  });

  /* ---------- info modal ---------- */
  infoBtn.addEventListener("click", function () {
    document.getElementById("infoOverlay").classList.add("show");
  });
  document.getElementById("infoOverlay").addEventListener("click", function (e) {
    if (e.target.id === "infoOverlay") e.target.classList.remove("show");
  });

  /* ---------- global keys: / focuses search, Esc closes panel/modal ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault();
      setSearchActive(true);
      input.focus();
      input.select();
      return;
    }
    if (e.key === "Escape") {
      var overlay = document.getElementById("infoOverlay");
      if (overlay.classList.contains("show")) {
        overlay.classList.remove("show");
        return;
      }
      if (document.activeElement === input) return; // input handles its own Esc
      if (panelOpen) hidePanelOnly();
    }
  });

  /* ---------- deep link & boot ---------- */
  function fromUrl() {
    var qs = new URLSearchParams(location.search).get("term");
    var h = (location.hash.match(/^#term=(.+)$/) || [])[1];
    var slug = qs || h;
    if (!slug) return null;
    return bySlug[decodeURIComponent(slug).toLowerCase()] || null;
  }
  window.addEventListener("hashchange", function () {
    var t = fromUrl();
    if (t && t !== current) select(t, false);
  });

  var initial = fromUrl();
  if (initial) {
    // Deep link: open the panel and light up the graph for that term straight
    // away; the camera focus runs once the engine has placed the nodes.
    select(initial, false);
  }
  // else: root view - panel stays closed, no term focused, canvas fills the
  // screen, orbit hint invites the first gesture (matches reference behaviour).

  setTimeout(function () {
    if (!fitted) {
      fitted = true;
      frameRoot();
      queueWelcomeSpin();
    }
    refreshLinks();
  }, 1500);
  // Deep-linked entries may need to wait for the engine to place nodes before
  // the camera can focus; retry once when it settles.
  var focusDeadline = Date.now() + 4000;
  var focusPoll = setInterval(function () {
    if (!current || !focused) { clearInterval(focusPoll); return; }
    if (nodes[current.index] && nodes[current.index].x !== undefined && engineSettled) {
      clearInterval(focusPoll);
      try { fitCluster(current.index); } catch (e) {}
      queueGather(260);
    } else if (Date.now() > focusDeadline) {
      clearInterval(focusPoll);
    }
  }, 400);
  wake();
})();
</script>
</body>
</html>
`;

mkdirSync(OUT_DIR, { recursive: true });
const vendorOut = join(OUT_DIR, "vendor");
mkdirSync(vendorOut, { recursive: true });
for (const f of VENDOR_FILES) {
  const src = join(VENDOR_SRC, f);
  if (!existsSync(src))
    fail(`Missing vendored file ${src} — run \`npm run vendor\` to build it`);
  copyFileSync(src, join(vendorOut, f));
}
writeFileSync(join(OUT_DIR, "index.html"), html);
console.log(
  `site/index.html generated: ${terms.length} terms, ${sections.length} sections, ${graph.edges.length} edges`
);
