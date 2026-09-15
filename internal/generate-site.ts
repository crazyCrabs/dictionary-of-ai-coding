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
  #graphWrap {
    position: relative; flex: 1 1 58%; min-width: 0;
    background-color: var(--bg);
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  }
  #graph { width: 100%; height: 100%; }
  .scene-tooltip { display: none !important; }
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
    <div id="hint">拖动旋转 · 滚轮缩放 · 悬停查看关联 · 点击聚焦 · 搜索时无关节点自动隐藏</div>
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
  var focused = false; // true once clicked / deep-linked / prev-next (graph radiates links)
  var collapsed = true;
  var neighbors = {};
  var hoverNode = null; // transient highlight while the pointer is over a node
  var hoverNb = {};
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

  function refreshLinks() {
    // Re-set the accessors so the library recomputes every link's look. Guard
    // with try/catch: during boot the library internals may not exist yet and
    // an early call can throw; the one-shot boot refresh retries later.
    // Only call this on state changes (select / hover / search) - see the
    // onEngineStop comment for why an engine-driven refresh loop is forbidden.
    try {
      Graph.linkColor(Graph.linkColor());
      Graph.linkWidth(Graph.linkWidth());
      Graph.linkDirectionalParticles(Graph.linkDirectionalParticles());
    } catch (e) {}
  }
  // Every refresh re-sets the link accessors: the library rebuilds the links
  // and restarts its engine (a multi-second churn of ~4MB/frame that lingers
  // until a major GC). Hover and search fire far faster than that, so debounce
  // them: a pointer sweep across many nodes collapses into one refresh once
  // the target settles instead of one per node.
  var refreshTimer = null;
  function refreshLinksSoon() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      refreshLinks();
    }, 200);
  }
  function refreshLinksNow() {
    if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null; }
    refreshLinks();
  }

  var labelTexCache = {};
  var darkMode =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-color-scheme: dark)").matches;
  // Label tone follows the reference site: ink on light, light grey on dark.
  var LABEL_COLOR = darkMode ? "rgba(210,205,195,0.95)" : "rgba(26,26,25,0.92)";
  var LABEL_STROKE = darkMode ? "#141311" : "#f2f2f0";
  function labelTexture(text) {
    if (labelTexCache[text]) return labelTexCache[text];
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var font = "700 52px ui-monospace, Consolas, monospace";
    ctx.font = font;
    var w = Math.ceil(ctx.measureText(text).width) + 28;
    canvas.width = w;
    canvas.height = 84;
    ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.textBaseline = "middle";
    // Paper-coloured outline keeps the ink text legible over the noise
    // background, like the reference site.
    ctx.lineJoin = "round";
    ctx.lineWidth = 7;
    ctx.strokeStyle = LABEL_STROKE;
    ctx.strokeText(text, 14, 44);
    ctx.fillStyle = LABEL_COLOR;
    ctx.fillText(text, 14, 44);
    var texture = new THREE.CanvasTexture(canvas);
    // Keep the default mipmapped minification filter: the texture is usually
    // downscaled several times when projected, and LinearFilter alone would
    // alias the thin strokes into grey smudges.
    texture.anisotropy = 4;
    var entry = { texture: texture, w: w, h: 84 };
    labelTexCache[text] = entry;
    return entry;
  }

  // Nodes are drawn as a sphere mesh + label sprite we fully own, so opacity
  // and size can be eased every frame (search fades, selection growth).
  var sphereGeo = new THREE.SphereGeometry(1, 24, 24);
  var COLOR_BASE = new THREE.Color("#55534e");
  var COLOR_SEL = new THREE.Color("#2f2d29");
  var R_NODE = 6; // world units per cbrt(value); sized to read clearly on screen
  function nodeRadius(n) {
    return Math.cbrt(baseVal(n)) * R_NODE;
  }
  function buildNodeObject(n) {
    var grp = new THREE.Group();
    // Backside shell slightly larger than the sphere draws the thin outline
    // ring seen on the reference site (light stroke on light bg, dark on dark).
    var strokeMat = new THREE.MeshBasicMaterial({
      color: darkMode ? "#1d1c19" : "#f7f6f3",
      side: THREE.BackSide,
      transparent: true,
      opacity: 0,
    });
    var stroke = new THREE.Mesh(sphereGeo, strokeMat);
    stroke.scale.setScalar(nodeRadius(n) * 1.22);
    var mat = new THREE.MeshBasicMaterial({
      color: COLOR_BASE.clone(),
      transparent: true,
      opacity: 0,
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
    // Label size scales with the node (glyph height ~1/3 of the sphere
    // diameter): dense spread views stay uncluttered while focused views stay
    // legible, matching how the reference site sizes labels with their node.
    var S0 = nodeRadius(n) / 80;
    sprite.scale.set(lt.w * S0, lt.h * S0, 1);
    sprite.visible = false;
    grp.add(stroke);
    grp.add(mesh);
    grp.add(sprite);
    n.__obj = grp;
    n.__stroke = stroke;
    n.__strokeMat = strokeMat;
    n.__mesh = mesh;
    n.__mat = mat;
    n.__sprite = sprite;
    n.__lt = lt;
    n.__a = 0.9; // start visible so nodes never begin invisible
    n.__s = baseVal(n);
    // Sync materials right away: opacity:0 defaults would leave the node
    // invisible until the first animateNodes pass reaches it.
    mat.opacity = n.__a;
    strokeMat.opacity = n.__a * 0.9;
    lmat.opacity = n.__a;
    return grp;
  }

  // Ease every node towards its target opacity/scale each frame: search
  // filtering fades nodes in/out instead of popping them, and hover/selection
  // emphasis is smooth as well.
  function animateNodes() {
    var act = activeState();
    nodes.forEach(function (n) {
      // The graph library builds node objects during its own first render,
      // which can happen after this loop's first frame - guard against it so
      // the loop never dies before every node has its meshes.
      if (!n.__mesh) return;
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
            : 0.95;
      var sTarget = hidden ? 0.0001 : baseVal(n) * (isSel ? 2 : 1);
      n.__a += (aTarget - n.__a) * 0.13;
      if (aTarget === 0 && n.__a < 0.008) n.__a = 0;
      if (aTarget >= 1 && n.__a > 0.992) n.__a = 1;
      n.__s += (sTarget - n.__s) * 0.13;
      var r = Math.cbrt(Math.max(n.__s, 1e-6)) * R_NODE;
      n.__mesh.scale.setScalar(r);
      n.__mat.opacity = n.__a;
      n.__mat.color.lerp(isSel ? COLOR_SEL : COLOR_BASE, 0.15);
      n.__stroke.scale.setScalar(r * 1.22);
      n.__strokeMat.opacity = n.__a * 0.9;
      var showLabel =
        !hidden && n.__a > 0.5 && (isSel || isNb || !!(searchFilter && isMatch));
      n.__sprite.visible = showLabel;
      n.__sprite.material.opacity = n.__a;
      // Keep the label glued right above the sphere, sized with the node.
      var S = r / 80;
      n.__sprite.scale.set(n.__lt.w * S, n.__lt.h * S, 1);
      n.__sprite.position.y = r * 1.6;
    });
    requestAnimationFrame(animateNodes);
  }

  function baseVal(n) {
    return 2 + Math.min(n.degree, 9) * 1.1;
  }

  var Graph = ForceGraph3D()(document.getElementById("graph"))
    .width(wrap.clientWidth)
    .height(wrap.clientHeight)
    .graphData({ nodes: nodes, links: links })
    .backgroundColor("rgba(0,0,0,0)")
    .showNavInfo(false)
    .nodeLabel(function () { return ""; })
    .nodeThreeObject(function (n) { return n.__obj || buildNodeObject(n); })
    .linkColor(function (l) {
      var s = typeof l.source === "object" ? l.source.id : l.source;
      var t = typeof l.target === "object" ? l.target.id : l.target;
      if (searchFilter && (!searchFilter[s] || !searchFilter[t])) return "rgba(0,0,0,0)";
      // Idle links are nearly invisible (about 1/8 of the hot tone, like the
      // reference site); only the hovered/selected node's links light up.
      return isHot(l) ? "rgba(90,86,80,0.85)" : "rgba(140,136,128,0.05)";
    })
    .linkWidth(function (l) { return isHot(l) ? 1.2 : 0.5; })
    .linkCurvature(0.2)
    .linkOpacity(0.5)
    .linkDirectionalParticles(function (l) {
      var s = typeof l.source === "object" ? l.source.id : l.source;
      var t = typeof l.target === "object" ? l.target.id : l.target;
      if (searchFilter && (!searchFilter[s] || !searchFilter[t])) return 0;
      return isHot(l) ? 4 : 0;
    })
    .linkDirectionalParticleSpeed(0.0035)
    .linkDirectionalParticleWidth(2.4)
    .onNodeClick(function (n) { select(TERMS[n.id], true, true); })
    .onNodeHover(function (n) {
      if (n && isHidden(n)) n = null; // don't light up search-filtered nodes
      if (n === hoverNode) return;
      hoverNode = n || null;
      hoverNb = hoverNode ? computeNeighbors(hoverNode.id) : {};
      refreshLinksSoon();
    })
    .onEngineStop(function () {
      engineSettled = true;
      // Idle root view: frame the whole graph once the layout settles. Focused
      // views own the camera via their own fitCluster tween, so never let this
      // whole-graph framing overwrite them.
      if (!fitted && !(current && focused)) {
        fitted = true;
        Graph.zoomToFit(600, 60);
      }
      // Never call refreshLinks() here: re-setting the link accessors restarts
      // the engine, which fires onEngineStop again - an endless stop-refresh-
      // restart loop that churns ~4MB/frame forever and grows the heap without
      // bound. The one-shot boot refresh below covers the same race.
      if (pendingGather && current) {
        pendingGather = false;
        gatherAround(current.index);
      }
    });

  var fitted = false;
  var engineSettled = false;
  var pendingGather = false;

  // The graph emphasises one node at a time: the hovered node wins, otherwise
  // the focused (clicked / deep-linked) one; null means everything is idle.
  function activeState() {
    if (hoverNode) return { id: hoverNode.id, nb: hoverNb };
    if (current && focused) return { id: current.index, nb: neighbors };
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

  window.addEventListener("resize", function () {
    Graph.width(wrap.clientWidth).height(wrap.clientHeight);
  });

  /* ---------- auto-rotate & gather tween ---------- */
  var autoRotating = true;
  function stopAutoRotate() {
    if (!autoRotating) return;
    autoRotating = false;
  }
  // The vendored renderer only calls controls.update() during interaction or
  // camera tweens, so OrbitControls.autoRotate never advances on its own.
  // Drive the idle orbit ourselves: nudge the controls and apply one update
  // per frame until the first user gesture takes over.
  (function spin() {
    if (autoRotating) {
      try {
        var c = Graph.controls();
        if (c) { c.rotateLeft(0.0012); c.update(); }
      } catch (e) {}
    }
    requestAnimationFrame(spin);
  })();
  ["pointerdown", "wheel"].forEach(function (ev) {
    document.getElementById("graph").addEventListener(ev, stopAutoRotate, { once: true, passive: true });
  });

  var tweenId = null;
  function fitCluster(selIdx) {
    var selN = nodes[selIdx];
    var R = 150; // tighter framing so the focused cluster and its labels read large
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
      var r = (neighbors[i] ? 75 : 130) + (Math.random() - 0.5) * 20;
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
  function select(t, push, gather, focus) {
    current = t;
    focused = focus !== false;
    collapsed = true;
    neighbors = computeNeighbors(t.index);
    renderPanel(t);
    refreshLinksNow();
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
      refreshLinksSoon();
      return;
    }
    var matches = nameMatches(q);
    var vis = {};
    matches.forEach(function (t) { vis[t.index] = 1; });
    searchFilter = vis;
    countEl.textContent = matches.length + (matches.length === 1 ? " term" : " terms");
    countEl.style.display = "block";
    refreshLinksSoon();
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
  if (initial) {
    // Focus the deep-linked entry immediately, but defer the gather until the
    // library has finished booting: calling the d3/gather APIs this early
    // races with its own initialisation and can silently do nothing.
    select(initial, true, false);
    pendingGather = true;
  } else {
    // No deep link: show the first entry in the panel but keep the graph idle
    // (no radiating links, no labels, slow auto-rotation) like the reference
    // root view, and leave the URL clean.
    select(TERMS[0], false, false, false);
  }
  setTimeout(function () { Graph.zoomToFit(500, 60); refreshLinks(); }, 1600);
  // onEngineStop is a single-shot callback and may fire before nodes are laid
  // out; poll as a fallback (with a time-based deadline) so a deep-linked
  // entry always gathers.
  var gatherDeadline = Date.now() + 4000;
  setInterval(function () {
    if (!pendingGather || !current) return;
    // Wait for the engine to settle so the post-gather camera fit is not later
    // overwritten by onEngineStop's whole-graph framing; the deadline keeps
    // the gather from being postponed forever.
    if (engineSettled || Date.now() > gatherDeadline) {
      pendingGather = false;
      try { gatherAround(current.index); } catch (e) {}
    }
  }, 600);
  requestAnimationFrame(animateNodes);
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
