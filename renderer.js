(function () {
  const META_ID = "__meta__";
  const SAFE_FONTS = ["Arial", "Georgia", "Verdana", "Trebuchet MS", "Times New Roman", "Courier New"];

  function metaOf(blocks) {
    const meta = Array.isArray(blocks) ? blocks.find((block) => block && block.id === META_ID) : null;
    return meta || { id: META_ID, type: "meta", logo: "", editors: [] };
  }

  function visibleBlocks(blocks) {
    return Array.isArray(blocks) ? blocks.filter((block) => block && block.id !== META_ID) : [];
  }

  function normalizeBlock(block = {}) {
    return {
      id: block.id || `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: block.type || "text",
      title: block.title || "",
      content: block.content || "",
      imageUrl: block.imageUrl || "",
      linkUrl: block.linkUrl || "",
      linkLabel: block.linkLabel || "Sign up",
      width: [25, 50, 75, 100].includes(Number(block.width)) ? Number(block.width) : 100,
      minHeight: Math.max(80, Math.min(800, Number(block.minHeight) || 180)),
      bg: block.bg || "#ffffff",
      text: block.text || "#172e5c",
      fontFamily: SAFE_FONTS.includes(block.fontFamily) ? block.fontFamily : "Arial",
      fontSize: Math.max(12, Math.min(72, Number(block.fontSize) || 16)),
      align: ["left", "center", "right"].includes(block.align) ? block.align : "left",
      borderEnabled: block.borderEnabled !== false,
      borderColor: block.borderColor || "#d9dee7",
      borderWidth: Math.max(0, Math.min(8, Number(block.borderWidth) || 1)),
      backgroundImage: block.backgroundImage || ""
    };
  }

  function mountStyles() {
    if (document.getElementById("sl-renderer-styles")) return;
    const style = document.createElement("style");
    style.id = "sl-renderer-styles";
    style.textContent = `
      .sl-layout{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:18px;align-items:start}
      .sl-block{position:relative;padding:24px;border-radius:10px;background:#fff;background-size:cover;background-position:center;overflow:hidden;min-width:0}
      .sl-block::before{content:"";position:absolute;inset:0;background:rgba(255,255,255,.00);pointer-events:none}
      .sl-block>*{position:relative;z-index:1}
      .sl-block h3{margin:0 0 10px;font-size:1.25em;line-height:1.2;color:inherit}
      .sl-block p{margin:0;white-space:pre-wrap;color:inherit}
      .sl-block img{display:block;max-width:100%;max-height:520px;margin:auto;object-fit:contain;border-radius:8px}
      .sl-block .sl-link{display:inline-flex;margin-top:16px;padding:10px 16px;border-radius:999px;background:#123e8f;color:white;text-decoration:none;font-weight:700}
      .sl-block[data-width="25"]{grid-column:span 3}.sl-block[data-width="50"]{grid-column:span 6}.sl-block[data-width="75"]{grid-column:span 9}.sl-block[data-width="100"]{grid-column:span 12}
      @media(max-width:760px){.sl-layout{grid-template-columns:1fr;gap:14px}.sl-block[data-width]{grid-column:1/-1}.sl-block{padding:20px;min-height:0!important}}
    `;
    document.head.appendChild(style);
  }

  function renderBlock(block, options = {}) {
    const normalized = normalizeBlock(block);
    const el = document.createElement("article");
    el.className = "sl-block";
    el.dataset.blockId = normalized.id;
    el.dataset.width = String(normalized.width);
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

  window.SLRenderer = { META_ID, SAFE_FONTS, metaOf, visibleBlocks, normalizeBlock, renderBlock, renderLayout, mountStyles };
})();
