#!/usr/bin/env -S npx tsx
// Generate a self-contained static site (3D force graph + detail panel) from
// internal/Curriculum.md + dictionary/*.md. Output: site/index.html.
// three.js + 3d-force-graph are vendored in internal/vendor/ and copied to site/vendor/.

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
const VENDOR_FILES = ["three.min.js", "3d-force-graph.min.js"];

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
  :root {
    --bg: #edecea; --panel-bg: #faf9f7; --fg: #1a1a18; --muted: #8a867f;
    --border: #dcd9d3; --accent: #b3541e; --chip-border: #c9c5bd; --bubble-dark: #26241f;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #141311; --panel-bg: #1c1b18; --fg: #e8e5e0; --muted: #96918a;
      --border: #2c2a26; --accent: #e08a4e; --chip-border: #3a3833; --bubble-dark: #e8e5e0;
    }
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--fg); overflow: hidden;
    font: 15.5px/1.75 -apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif;
  }
  #app { display: flex; height: 100vh; }
  #graphWrap { position: relative; flex: 1 1 58%; min-width: 0; background: var(--bg); }
  #graph { width: 100%; height: 100%; }
  #hint {
    position: absolute; bottom: 16px; left: 20px; color: var(--muted);
    font-size: 12px; user-select: none; pointer-events: none;
  }
  .fab {
    position: absolute; z-index: 5; width: 44px; height: 44px; border-radius: 50%;
    border: 1px solid var(--border); background: var(--panel-bg); color: var(--fg);
    font-size: 17px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .fab:hover { border-color: var(--muted); }
  #infoBtn { top: 20px; right: 20px; font-style: italic; font-family: Georgia, serif; }
  #searchBar {
    position: absolute; top: 20px; left: 20px; z-index: 5;
    display: flex; align-items: center; gap: 10px;
    background: var(--panel-bg); border: 1px solid var(--border);
    border-radius: 999px; padding: 9px 18px; width: 400px; max-width: calc(100% - 120px);
  }
  #searchBar .icon { color: var(--muted); font-size: 15px; }
  #searchInput { flex: 1; border: none; outline: none; background: transparent; color: var(--fg); font: inherit; min-width: 0; }
  #clearBtn { border: none; background: none; cursor: pointer; color: var(--muted); font-size: 18px; line-height: 1; padding: 0; display: none; }
  #clearBtn:hover { color: var(--fg); }
  #searchCount {
    position: absolute; top: 78px; left: 32px; color: var(--muted); display: none;
    font: 600 11px ui-monospace, Consolas, monospace; letter-spacing: 0.18em; text-transform: uppercase;
  }

  #panel {
    flex: 0 0 42%; max-width: 560px; min-width: 380px; overflow-y: auto;
    background: var(--panel-bg); border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
  }
  #panelInner { padding: 28px 32px 8px; flex: 1; }
  .kicker {
    font: 600 11px ui-monospace, Consolas, monospace; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--muted); margin: 26px 0 10px;
  }
  #termTitle { margin: 6px 0 4px; font-size: 30px; letter-spacing: -0.4px; }
  #termDesc { color: var(--muted); margin: 0 0 6px; }
  .bubble {
    max-width: 88%; padding: 12px 16px; border-radius: 14px; margin: 6px 0;
    font-size: 15px;
  }
  .bubble.q { background: transparent; border: 1px solid var(--border); }
  .bubble.a { background: var(--bubble-dark); color: var(--panel-bg); margin-left: auto; }
  @media (prefers-color-scheme: dark) { .bubble.a { color: #171614; } }
  .bubble p { margin: 0; }
  .bubble a { color: inherit; text-decoration: underline; cursor: pointer; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip {
    border: 1px solid var(--chip-border); background: transparent; color: var(--fg);
    border-radius: 999px; padding: 5px 14px; font: inherit; font-size: 14px;
    cursor: pointer;
  }
  .chip:hover { border-color: var(--fg); }
  .def p { margin: 0.85em 0; }
  .def a { color: var(--accent); text-decoration: none; cursor: pointer; }
  .def a:hover { text-decoration: underline; }
  .def code {
    background: rgba(128,128,128,0.15); padding: 1px 6px; border-radius: 4px;
    font-size: 0.88em; font-family: ui-monospace, Consolas, monospace;
  }
  .def table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 14px; }
  .def th, .def td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; }
  .def th { background: rgba(128,128,128,0.08); }
  .def li { margin: 0.3em 0; }
  .def .rest[hidden] { display: none; }
  #readMore {
    background: none; border: none; color: var(--muted); cursor: pointer;
    font: 600 11px ui-monospace, Consolas, monospace; letter-spacing: 0.18em;
    text-transform: uppercase; padding: 4px 0;
  }
  #readMore:hover { color: var(--fg); }
  .actions { display: flex; gap: 10px; margin: 22px 0; flex-wrap: wrap; }
  .btn {
    border: 1px solid var(--chip-border); background: transparent; color: var(--fg);
    border-radius: 999px; padding: 9px 18px; font: inherit; font-size: 14px; cursor: pointer;
  }
  .btn.primary { background: var(--fg); color: var(--panel-bg); border-color: var(--fg); }
  .btn:hover { border-color: var(--fg); }
  #prevNext {
    position: sticky; bottom: 0; display: flex; justify-content: space-between;
    background: var(--panel-bg); border-top: 1px solid var(--border); padding: 10px 32px;
  }
  #prevNext button {
    background: none; border: none; color: var(--muted); cursor: pointer;
    font: 600 12px ui-monospace, Consolas, monospace; letter-spacing: 0.18em;
    text-transform: uppercase; padding: 8px 0;
  }
  #prevNext button:hover { color: var(--fg); }
  #toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: var(--fg); color: var(--panel-bg); padding: 8px 18px;
    border-radius: 999px; font-size: 14px; opacity: 0; transition: opacity 0.25s;
    pointer-events: none; z-index: 30;
  }
  #toast.show { opacity: 1; }
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: none;
    align-items: flex-start; justify-content: center; padding-top: 12vh; z-index: 10;
  }
  .overlay.show { display: flex; }
  .sheet {
    background: var(--panel-bg); border: 1px solid var(--border); border-radius: 14px;
    width: min(560px, 90vw); max-height: 70vh; overflow: auto; padding: 18px;
  }
  @media (max-width: 860px) {
    body { overflow: auto; }
    #app { flex-direction: column; height: auto; }
    #graphWrap { flex: none; height: 52vh; }
    #panel { flex: none; max-width: none; min-width: 0; border-left: none; border-top: 1px solid var(--border); overflow: visible; }
  }
</style>
</head>
<body>
<div id="app">
  <div id="graphWrap">
    <div id="graph"></div>
    <div id="searchBar">
      <span class="icon">&#x1F50D;</span>
      <input id="searchInput" type="text" placeholder="Search…" autocomplete="off">
      <button id="clearBtn" title="清除">&#x2715;</button>
    </div>
    <div id="searchCount"></div>
    <button id="infoBtn" class="fab" title="关于">i</button>
    <div id="hint">拖动旋转 · 滚轮缩放 · 拖节点移动 · 点击节点查看 · 搜索时无关节点自动隐藏</div>
  </div>
  <div id="panel">
    <div id="panelInner"></div>
    <div id="prevNext">
      <button id="prevBtn">&#x2190; Prev</button>
      <button id="nextBtn">Next &#x2192;</button>
    </div>
  </div>
</div>
<div id="infoOverlay" class="overlay">
  <div class="sheet">
    <h2 style="margin-top:0;">AI 编程词典</h2>
    <p>把 AI 编程的词汇翻译成大白话。中文版译自 Matt Pocock 的 AI Coding Dictionary(aihero.dev),词条结构与概念归原作者。</p>
    <p style="color:var(--muted);font-size:13.5px;">3D 图中的节点颜色代表所属章节,连线表示词条间的交叉引用,粒子的流动方向即引用方向;点的大小表示被引用的多少。左键拖动旋转视角,滚轮缩放,拖动节点可重新排布;点击节点后其余节点会向它聚拢。数据与 README、词条文件同源,由 <code>npm run site</code> 生成。</p>
    <button class="btn" onclick="document.getElementById('infoOverlay').classList.remove('show')">关闭</button>
  </div>
</div>
<div id="toast"></div>
<script id="data" type="application/json">${dataJson}</script>
<script src="vendor/three.min.js"></script>
<script src="vendor/3d-force-graph.min.js"></script>
<script type="module">
(function () {
  var DATA = JSON.parse(document.getElementById("data").textContent);
  var TERMS = DATA.terms;
  var GRAPH = DATA.graph;
  var bySlug = {};
  TERMS.forEach(function (t, i) { t.index = i; bySlug[t.slug] = t; });

  var panelInner = document.getElementById("panelInner");
  var current = null;
  var collapsed = true;
  var neighbors = {};
  var searchFilter = null; // map of visible node ids while searching

  /* ---------- grey palette (reference-site aesthetic) ---------- */

  /* ---------- 3D graph ---------- */
  var wrap = document.getElementById("graphWrap");
  var nodes = GRAPH.nodes.map(function (n) {
    return { id: n.id, name: n.name, degree: n.degree, section: TERMS[n.id].section };
  });
  var links = GRAPH.edges.map(function (e) { return { source: e[0], target: e[1] }; });

  function isHidden(n) {
    return !!searchFilter && !searchFilter[n.id];
  }

  function refreshChains() {
    Graph.nodeColor(Graph.nodeColor());
    Graph.nodeVal(Graph.nodeVal());
    Graph.linkColor(Graph.linkColor());
    Graph.linkWidth(Graph.linkWidth());
    Graph.linkDirectionalParticles(Graph.linkDirectionalParticles());
    Graph.nodeThreeObject(Graph.nodeThreeObject());
    if (typeof Graph.nodeVisibility === "function") {
      Graph.nodeVisibility(function (n) { return !isHidden(n); });
    }
  }

  var labelCache = {};
  function makeLabel(text) {
    if (typeof THREE === "undefined") return null;
    if (labelCache[text]) return labelCache[text];
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var font = "600 34px ui-monospace, Consolas, monospace";
    ctx.font = font;
    var w = Math.ceil(ctx.measureText(text).width) + 24;
    canvas.width = w; canvas.height = 56;
    ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, w, 56);
    ctx.fillStyle = "rgba(105,101,94,0.95)";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 12, 30);
    var texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    var material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(w / 14, 56 / 14, 1);
    labelCache[text] = sprite;
    return sprite;
  }

  function baseVal(n) { return 2 + Math.min(n.degree, 9) * 1.1; }

  var Graph = ForceGraph3D()(document.getElementById("graph"))
    .width(wrap.clientWidth)
    .height(wrap.clientHeight)
    .graphData({ nodes: nodes, links: links })
    .backgroundColor("rgba(0,0,0,0)")
    .showNavInfo(false)
    .nodeRelSize(3.2)
    .nodeColor(function (n) {
      if (isHidden(n)) return "rgba(0,0,0,0)";
      if (current && n.id === current.index) return "#2f2d29";
      if (current && neighbors[n.id]) return "rgba(74,72,68,0.92)";
      if (searchFilter && searchFilter[n.id]) return "rgba(58,56,51,0.9)";
      return "rgba(74,72,68,0.22)";
    })
    .nodeVal(function (n) {
      if (isHidden(n)) return 0.001;
      var v = baseVal(n);
      return current && n.id === current.index ? v * 2 : v;
    })
    .nodeLabel(function (n) { return isHidden(n) ? null : n.name; })
    .nodeThreeObjectExtend(true)
    .nodeThreeObject(function (n) {
      if (isHidden(n)) return null;
      var on = current && (n.id === current.index || neighbors[n.id]);
      if (searchFilter) on = !!searchFilter[n.id];
      if (!on) return null;
      var sprite = makeLabel(n.name.toUpperCase());
      if (!sprite) return null;
      var s = sprite.clone();
      var r = current && n.id === current.index ? baseVal(n) * 1.6 : baseVal(n);
      s.position.set(0, r * 3.2 + 6, 0);
      return s;
    })
    .linkColor(function (l) {
      var s = typeof l.source === "object" ? l.source.id : l.source;
      var t = typeof l.target === "object" ? l.target.id : l.target;
      if (searchFilter && (!searchFilter[s] || !searchFilter[t])) return "rgba(0,0,0,0)";
      return isHot(l) ? "rgba(90,86,80,0.85)" : "rgba(140,136,128,0.22)";
    })
    .linkWidth(function (l) { return isHot(l) ? 1.2 : 0; })
    .linkCurvature(0)
    .linkOpacity(0.5)
    .linkDirectionalParticles(function (l) {
      var s = typeof l.source === "object" ? l.source.id : l.source;
      var t = typeof l.target === "object" ? l.target.id : l.target;
      if (searchFilter && (!searchFilter[s] || !searchFilter[t])) return 0;
      return isHot(l) ? 4 : 0;
    })
    .linkDirectionalParticleSpeed(0.008)
    .linkDirectionalParticleWidth(2.4)
    .onNodeClick(function (n) { select(TERMS[n.id], true, true); })
    .onEngineStop(function () {
      if (!fitted) { fitted = true; Graph.zoomToFit(600, 60); }
      if (pendingGather && current) {
        pendingGather = false;
        gatherAround(current.index);
      }
    });

  var fitted = false;
  var pendingGather = false;

  function isHot(l) {
    if (!current) return false;
    var s = typeof l.source === "object" ? l.source.id : l.source;
    var t = typeof l.target === "object" ? l.target.id : l.target;
    return s === current.index || t === current.index;
  }

  function computeNeighbors(i) {
    var set = {};
    GRAPH.edges.forEach(function (e) {
      if (e[0] === i) set[e[1]] = 1;
      if (e[1] === i) set[e[0]] = 1;
    });
    return set;
  }

  window.addEventListener("resize", function () {
    Graph.width(wrap.clientWidth).height(wrap.clientHeight);
  });

  /* ---------- auto-rotate & gather tween ---------- */
  var autoRotating = true;
  function stopAutoRotate() {
    if (!autoRotating) return;
    autoRotating = false;
    try { Graph.controls().autoRotate = false; } catch (e) {}
  }
  try {
    Graph.controls().autoRotate = true;
    Graph.controls().autoRotateSpeed = 0.5;
  } catch (e) {}
  ["pointerdown", "wheel"].forEach(function (ev) {
    document.getElementById("graph").addEventListener(ev, stopAutoRotate, { once: true, passive: true });
  });

  var tweenId = null;
  function fitCluster(selIdx) {
    var selN = nodes[selIdx];
    var R = 190;
    var cam = Graph.cameraPosition();
    var dx = cam.x - selN.x, dy = cam.y - selN.y, dz = cam.z - selN.z;
    var d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    var fov = (Graph.camera().fov || 40) * Math.PI / 180;
    var dist = (R / Math.tan(fov / 2)) * 1.05;
    Graph.cameraPosition(
      { x: selN.x + (dx / d) * dist, y: selN.y + (dy / d) * dist, z: selN.z + (dz / d) * dist },
      { x: selN.x, y: selN.y, z: selN.z },
      600
    );
  }
  function gatherAround(selIdx) {
    stopAutoRotate();
    var selN = nodes[selIdx];
    if (selN.x === undefined) { pendingGather = true; return; } // engine has not placed nodes yet
    var sx = selN.x, sy = selN.y, sz = selN.z;
    var starts = nodes.map(function (n) { return [n.x, n.y, n.z]; });
    var targets = nodes.map(function (n, i) {
      if (i === selIdx) return [sx, sy, sz];
      var dx = n.x - sx, dy = n.y - sy, dz = n.z - sz;
      var d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      var r = (neighbors[i] ? 60 : 150) + (Math.random() - 0.5) * 24;
      return [sx + (dx / d) * r, sy + (dy / d) * r, sz + (dz / d) * r];
    });
    // Disable d3 forces so nodes stay where the tween puts them, then reheat
    // the engine: while ticks run, node.x changes sync to the render meshes
    // (vendor 1.73.x has no engineStop; without reheat the sync pipeline is
    // dead once alpha converges and the gather would be invisible).
    try {
      Graph.d3Force("charge", null);
      Graph.d3Force("link", null);
      Graph.d3Force("center", null);
      Graph.d3ReheatSimulation();
    } catch (e) {}
    if (tweenId) cancelAnimationFrame(tweenId);
    var t0 = performance.now(), D = 900;
    (function step() {
      var k = Math.min(1, (performance.now() - t0) / D);
      var e = 1 - Math.pow(1 - k, 3); // easeOutCubic
      nodes.forEach(function (n, i) {
        n.x = starts[i][0] + (targets[i][0] - starts[i][0]) * e;
        n.y = starts[i][1] + (targets[i][1] - starts[i][1]) * e;
        n.z = starts[i][2] + (targets[i][2] - starts[i][2]) * e;
      });
      if (k < 1) { tweenId = requestAnimationFrame(step); }
      else { tweenId = null; fitCluster(selIdx); }
    })();
  }

  /* ---------- panel ---------- */
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }
  function renderPanel(t) {
    var sortedLinks = t.links.slice().sort(function (a, b) { return a.localeCompare(b); });
    var chips = sortedLinks.map(function (name) {
      var target = TERMS.find(function (x) { return x.name === name; });
      return '<button class="chip" data-slug="' + target.slug + '">' + esc(name) + "</button>";
    }).join("");
    var usageHtml = t.usage.map(function (u, i) {
      return '<div class="bubble ' + (i % 2 ? "a" : "q") + '">' + u + "</div>";
    }).join("");
    panelInner.innerHTML =
      '<div class="kicker">' + esc(DATA.sections[t.section]) + "</div>" +
      '<h1 id="termTitle">' + esc(t.name) + "</h1>" +
      '<p id="termDesc">' + esc(t.description) + "</p>" +
      (usageHtml ? '<div class="kicker">Usage</div><div id="usageBubbles">' + usageHtml + "</div>" : "") +
      (chips ? '<div class="kicker">Connects to</div><div class="chips">' + chips + "</div>" : "") +
      '<div class="kicker">Full definition</div>' +
      '<div class="def"><div>' + t.firstPara + "</div>" +
      '<div class="rest" id="defRest" hidden>' + t.restHtml + "</div></div>" +
      '<button id="readMore">Read more &#x2304;</button>' +
      '<div class="actions">' +
      '<button class="btn primary" id="copyMdBtn">Copy Markdown</button>' +
      '<button class="btn" id="shareBtn">Share</button>' +
      "</div>";
    bindPanel(t);
  }

  function bindPanel(t) {
    var rm = document.getElementById("readMore");
    rm.addEventListener("click", function () {
      collapsed = !collapsed;
      document.getElementById("defRest").hidden = collapsed;
      rm.innerHTML = collapsed ? "Read more &#x2304;" : "Read less &#x2303;";
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
      chip.addEventListener("click", function () { select(bySlug[chip.dataset.slug], true, true); });
    });
    panelInner.querySelectorAll("#panelInner .def a, #usageBubbles a").forEach(function (a) {
      var m = (a.getAttribute("href") || "").match(/^#term=(.+)$/);
      if (!m) return;
      var name = decodeURIComponent(m[1]);
      var target = TERMS.find(function (x) { return x.name === name; });
      if (target) {
        a.addEventListener("click", function (ev) { ev.preventDefault(); select(target, true, true); });
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
  function select(t, push, gather) {
    current = t;
    collapsed = true;
    neighbors = computeNeighbors(t.index);
    renderPanel(t);
    refreshChains();
    if (push) history.replaceState(null, "", "?term=" + t.slug);
    document.getElementById("panel").scrollTop = 0;
    if (gather) {
      try { gatherAround(t.index); } catch (e) {}
    }
  }
  function step(delta) {
    if (!current) return;
    var i = (current.index + delta + TERMS.length) % TERMS.length;
    select(TERMS[i], true, true);
  }
  document.getElementById("prevBtn").addEventListener("click", function () { step(-1); });
  document.getElementById("nextBtn").addEventListener("click", function () { step(1); });

  /* ---------- search: inline bar filters the graph live ---------- */
  var input = document.getElementById("searchInput");
  var clearBtn = document.getElementById("clearBtn");
  var countEl = document.getElementById("searchCount");
  function nameMatches(q) {
    q = q.trim().toLowerCase();
    return TERMS.filter(function (t) {
      return t.name.toLowerCase().indexOf(q) !== -1;
    });
  }
  function updateFilter(q) {
    q = (q || "").trim().toLowerCase();
    clearBtn.style.display = q ? "block" : "none";
    if (!q) {
      searchFilter = null;
      countEl.style.display = "none";
      refreshChains();
      return;
    }
    var matches = nameMatches(q);
    var vis = {};
    matches.forEach(function (t) { vis[t.index] = 1; });
    searchFilter = vis;
    countEl.textContent = matches.length + (matches.length === 1 ? " term" : " terms");
    countEl.style.display = "block";
    refreshChains();
  }
  input.addEventListener("input", function () { updateFilter(input.value); });
  clearBtn.addEventListener("click", function () {
    input.value = ""; updateFilter(""); input.focus();
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { input.value = ""; updateFilter(""); input.blur(); }
    if (e.key === "Enter") {
      var first = nameMatches(input.value)[0];
      if (first) select(first, true, true);
    }
  });
  document.getElementById("infoBtn").addEventListener("click", function () {
    document.getElementById("infoOverlay").classList.add("show");
  });
  document.getElementById("infoOverlay").addEventListener("click", function (e) {
    if (e.target.id === "infoOverlay") e.target.classList.remove("show");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault(); input.focus(); input.select();
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
    if (t && t !== current) select(t, false, true);
  });

  var initial = fromUrl();
  if (initial) select(initial, true, true);
  else select(TERMS[0], true, false); // spread view + auto-rotate, like the original site
  setTimeout(function () { Graph.zoomToFit(500, 60); }, 1600);
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
    fail(`Missing vendored file ${src} — see internal/vendor/README`);
  copyFileSync(src, join(vendorOut, f));
}
writeFileSync(join(OUT_DIR, "index.html"), html);
console.log(
  `site/index.html generated: ${terms.length} terms, ${sections.length} sections, ${graph.edges.length} edges`
);
