(function () {
  const META_ID = "__meta__";
  const SAFE_FONTS = ["Arial", "Georgia", "Verdana", "Trebuchet MS", "Times New Roman", "Courier New"];
  const MIN_WIDTH = 15;
  const SNAP_POINTS = [0, 25, 50, 75, 100];
  const SNAP_DISTANCE = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeColor(value, fallback) {
    const color = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(color)) return color;
    if (/^#[0-9a-f]{3}$/i.test(color)) return "#" + color.slice(1).split("").map((c) => c + c).join("");
    return fallback;
  }

  function snapNear(value, points = SNAP_POINTS, distance = SNAP_DISTANCE) {
    const n = Number(value);
    let best = n;
    let gap = Infinity;
    points.forEach((point) => {
      const d = Math.abs(point - n);
      if (d <= distance && d < gap) {
        best = point;
        gap = d;
      }
    });
    return best;
  }

  function metaOf(blocks) {
    if (!Array.isArray(blocks)) return { id: META_ID, type: "meta", logo: "", editors: [] };
    let meta = blocks.find((block) => block && block.id === META_ID);
    if (!meta) {
      meta = { id: META_ID, type: "meta", logo: "", editors: [] };
      blocks.unshift(meta);
    }
    if (!Array.isArray(meta.editors)) meta.editors = [];
    if (typeof meta.logo !== "string") meta.logo = "";
    return meta;
  }

  function visibleBlocks(blocks) {
    return Array.isArray(blocks) ? blocks.filter((block) => block && block.id !== META_ID) : [];
  }

  function legacyWidth(block) {
    const direct = Number(block.width);
    if (Number.isFinite(direct)) return clamp(Math.round(direct), MIN_WIDTH, 100);
    const old = Number(block.w);
    if (!Number.isFinite(old)) return 100;
    return clamp(Math.round(old), MIN_WIDTH, 100);
  }

  function legacyBorder(block) {
    const raw = String(block.border || "");
    const widthMatch = raw.match(/(\d+(?:\.\d+)?)px/);
    const colorMatch = raw.match(/#[0-9a-f]{3,6}/i);
    return {
      enabled: block.borderEnabled !== undefined ? block.borderEnabled !== false : !/^(none|0)/i.test(raw || "solid"),
      width: block.borderWidth !== undefined ? Number(block.borderWidth) : (widthMatch ? Number(widthMatch[1]) : 1),
      color: block.borderColor || (colorMatch ? colorMatch[0] : "#d9dee7")
    };
  }

  function normalizeBlock(block = {}) {
    const border = legacyBorder(block);
    const width = legacyWidth(block);
    const rawOffset = Number(block.offsetX ?? block.xOffset ?? block.x ?? 0);
    const offsetX = clamp(Number.isFinite(rawOffset) ? Math.round(rawOffset) : 0, 0, Math.max(0, 100 - width));
    return {
      id: block.id || `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: block.type || "text",
      title: block.title || "",
      content: block.content || "",
      imageUrl: block.imageUrl || "",
      linkUrl: block.linkUrl || "",
      linkLabel: block.linkLabel || "Sign up",
      width,
      offsetX,
      minHeight: clamp(Number(block.minHeight) || 180, 80, 800),
      bg: normalizeColor(block.bg, "#ffffff"),
      text: normalizeColor(block.text, "#172e5c"),
      fontFamily: SAFE_FONTS.includes(block.fontFamily) ? block.fontFamily : "Arial",
      fontSize: clamp(Number(block.fontSize) || 16, 12, 72),
      align: ["left", "center", "right"].includes(block.align) ? block.align : "left",
      borderEnabled: border.enabled,
      borderColor: normalizeColor(border.color, "#d9dee7"),
      borderWidth: clamp(Number(border.width) || 1, 0, 8),
      backgroundImage: block.backgroundImage || ""
    };
  }

  function mountStyles() {
    if (document.getElementById("sl-renderer-styles")) return;
    const style = document.createElement("style");
    style.id = "sl-renderer-styles";
    style.textContent = `
      .sl-layout{display:grid;grid-template-columns:repeat(100,minmax(0,1fr));grid-auto-flow:row;column-gap:0;row-gap:18px;align-items:start;min-width:0}
      .sl-block{position:relative;padding:24px;border-radius:10px;background:#fff;background-size:cover;background-position:center;overflow:hidden;min-width:0;margin-inline:6px}
      .sl-block>*{position:relative;z-index:1}
      .sl-block h3{margin:0 0 10px;font-size:1.25em;line-height:1.2;color:inherit}
      .sl-block p{margin:0;white-space:pre-wrap;color:inherit}
      .sl-block img{display:block;max-width:100%;max-height:520px;margin:auto;object-fit:contain;border-radius:8px}
      .sl-block .sl-link{display:inline-flex;margin-top:16px;padding:10px 16px;border-radius:999px;background:#123e8f;color:white;text-decoration:none;font-weight:700}
      @media(max-width:760px){.sl-layout{grid-template-columns:1fr;gap:14px}.sl-block{grid-column:1/-1!important;margin-inline:0;padding:20px;min-height:0!important}}
    `;
    document.head.appendChild(style);
  }

  function renderBlock(block, options = {}) {
    const normalized = normalizeBlock(block);
    const el = document.createElement("article");
    el.className = "sl-block";
    el.dataset.blockId = normalized.id;
    el.dataset.width = String(normalized.width);
    el.dataset.offsetX = String(normalized.offsetX);
    el.style.gridColumn = `${normalized.offsetX + 1} / span ${normalized.width}`;
    el.style.minHeight = `${normalized.minHeight}px`;
    el.style.backgroundColor = normalized.bg;
    el.style.color = normalized.text;
    el.style.fontFamily = normalized.fontFamily;
    el.style.fontSize = `${normalized.fontSize}px`;
    el.style.textAlign = normalized.align;
    el.style.border = normalized.borderEnabled ? `${normalized.borderWidth}px solid ${normalized.borderColor}` : "0 solid transparent";
    if (normalized.backgroundImage) el.style.backgroundImage = `url("${normalized.backgroundImage.replace(/"/g, "%22")}")`;

    if (normalized.type === "image") {
      if (normalized.title) {
        const heading = document.createElement("h3");
        heading.textContent = normalized.title;
        el.appendChild(heading);
      }
      if (normalized.imageUrl) {
        const image = document.createElement("img");
        image.src = normalized.imageUrl;
        image.alt = normalized.title || "Service Learning image";
        el.appendChild(image);
      } else {
        const placeholder = document.createElement("p");
        placeholder.textContent = "Add an image in the editor.";
        el.appendChild(placeholder);
      }
    } else {
      if (normalized.title) {
        const heading = document.createElement("h3");
        heading.textContent = normalized.title;
        el.appendChild(heading);
      }
      if (normalized.content) {
        const paragraph = document.createElement("p");
        paragraph.textContent = normalized.content;
        el.appendChild(paragraph);
      }
      if (normalized.type === "signup" && normalized.linkUrl) {
        const link = document.createElement("a");
        link.className = "sl-link";
        link.href = normalized.linkUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = normalized.linkLabel || "Sign up";
        el.appendChild(link);
      }
    }

    if (options.editor && !normalized.borderEnabled) el.classList.add("sl-editor-borderless");
    return el;
  }

  function renderLayout(container, blocks, options = {}) {
    mountStyles();
    container.innerHTML = "";
    container.classList.add("sl-layout");
    const elements = [];
    visibleBlocks(blocks).forEach((block) => {
      const el = renderBlock(block, options);
      container.appendChild(el);
      elements.push(el);
    });
    return elements;
  }

  window.SLRenderer = {
    META_ID,
    SAFE_FONTS,
    MIN_WIDTH,
    SNAP_POINTS,
    SNAP_DISTANCE,
    clamp,
    snapNear,
    metaOf,
    visibleBlocks,
    normalizeBlock,
    renderBlock,
    renderLayout,
    mountStyles
  };
})();
