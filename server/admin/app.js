/* Editor for the Raksha Bandhan site. Vanilla JS — no build step. */

const api = (path, options = {}) =>
  fetch(`../api/${path}`, {
    credentials: "same-origin",
    ...options,
    headers: {
      "X-Requested-With": "rb-admin", // the server rejects mutations without this
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

const $ = (id) => document.getElementById(id);
let content = null;
let dirty = false;

/* ---------- small helpers ---------- */

function toast(message, kind = "ok") {
  const el = $("toast");
  el.textContent = message;
  el.className = `toast show ${kind}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (el.className = "toast"), 2800);
}

function markDirty() {
  dirty = true;
  $("dirty").textContent = "unsaved changes";
}

const get = (path) => path.split(".").reduce((o, k) => o?.[k], content);

function set(path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  keys.reduce((o, k) => o[k], content)[last] = value;
  markDirty();
}

function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

/* ---------- field builders ---------- */

function textField(path, label, { area = false, rows = 3 } = {}) {
  const input = area
    ? el("textarea", { value: get(path) ?? "", rows })
    : el("input", { type: "text", value: get(path) ?? "" });
  input.addEventListener("input", () => set(path, input.value));
  return el("div", { className: "field" }, [el("label", { textContent: label }), input]);
}

/** A reorderable list of plain strings (paragraphs, thank-you lines...). */
function stringList(path, label, { rows = 2 } = {}) {
  const box = el("div", { className: "field" }, [el("label", { textContent: label })]);
  const list = el("div");

  const render = () => {
    list.replaceChildren();
    const items = get(path);
    items.forEach((value, i) => {
      const area = el("textarea", { value, rows });
      area.addEventListener("input", () => {
        get(path)[i] = area.value;
        markDirty();
      });
      const move = (delta) => {
        const arr = get(path);
        const target = i + delta;
        if (target < 0 || target >= arr.length) return;
        [arr[i], arr[target]] = [arr[target], arr[i]];
        markDirty();
        render();
      };
      list.append(
        el("div", { className: "list-item" }, [
          area,
          el("div", { style: "display:flex;flex-direction:column;gap:.25rem" }, [
            btn("↑", () => move(-1)),
            btn("↓", () => move(1)),
            btn("✕", () => {
              get(path).splice(i, 1);
              markDirty();
              render();
            }, "danger"),
          ]),
        ])
      );
    });
  };

  const add = btn("+ Add line", () => {
    get(path).push("");
    markDirty();
    render();
  });

  render();
  box.append(list, add);
  return box;
}

function btn(text, onClick, extra = "") {
  const b = el("button", { type: "button", textContent: text, className: `tiny ${extra}` });
  b.addEventListener("click", onClick);
  return b;
}

/** A list of objects with a fixed set of text fields (the "still us" cards). */
function objectList(path, label, fields) {
  const box = el("div", { className: "field" }, [el("label", { textContent: label })]);
  const list = el("div");

  const render = () => {
    list.replaceChildren();
    get(path).forEach((item, i) => {
      const card = el("div", { className: "card" });
      for (const [key, fieldLabel] of fields) {
        const input = el("input", { type: "text", value: item[key] ?? "" });
        input.addEventListener("input", () => {
          get(path)[i][key] = input.value;
          markDirty();
        });
        card.append(
          el("div", { className: "field" }, [el("label", { textContent: fieldLabel }), input])
        );
      }
      card.append(
        btn("Remove", () => {
          get(path).splice(i, 1);
          markDirty();
          render();
        }, "danger")
      );
      list.append(card);
    });
  };

  const add = btn("+ Add card", () => {
    const blank = Object.fromEntries(fields.map(([k]) => [k, ""]));
    get(path).push(blank);
    markDirty();
    render();
  });

  render();
  box.append(list, add);
  return box;
}

/* ---------- photo picker ---------- */

let pickTarget = null;

async function loadImages() {
  const res = await api("images");
  if (!res.ok) return [];
  return res.json();
}

async function openPicker(onPick) {
  pickTarget = onPick;
  await refreshPicker();
  $("picker").showModal();
}

async function refreshPicker() {
  const grid = $("pickerGrid");
  const images = await loadImages();
  grid.replaceChildren();

  if (!images.length) {
    grid.append(el("p", { className: "muted", textContent: "No photos uploaded yet." }));
  }

  for (const image of images) {
    const cell = el("div", { className: "thumb" }, [
      el("img", { src: `../${image.url}`, alt: "", loading: "lazy" }),
      el("span", { className: "x", textContent: "✕", title: "Delete" }),
    ]);
    cell.querySelector("img").addEventListener("click", () => {
      pickTarget?.(image.url);
      $("picker").close();
    });
    cell.querySelector(".x").addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("Delete this photo? Anywhere it is used will fall back to a placeholder."))
        return;
      const res = await api(`images/${encodeURIComponent(image.name)}`, { method: "DELETE" });
      if (res.ok) {
        toast("Photo deleted");
        refreshPicker();
      } else {
        toast("Could not delete", "err");
      }
    });
    grid.append(cell);
  }
}

$("closePicker").addEventListener("click", () => $("picker").close());

$("uploadInput").addEventListener("change", async (e) => {
  const files = [...e.target.files];
  if (!files.length) return;
  const form = new FormData();
  for (const file of files) form.append("images", file);

  $("pickerHint").textContent = `Uploading ${files.length} file(s)…`;
  const res = await api("images", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  $("pickerHint").textContent = "JPG, PNG, WebP or GIF · up to 8MB each";
  e.target.value = "";

  if (!res.ok) {
    toast(data.error || "Upload failed", "err");
    return;
  }
  toast(`Uploaded ${data.uploaded.length} photo(s)`);
  refreshPicker();
});

/* ---------- the memories editor ---------- */

function memoryList() {
  const box = el("div", { className: "field" });
  const list = el("div");

  const render = () => {
    list.replaceChildren();
    content.memories.forEach((memory, i) => {
      const pic = el("div", { className: "pic" });
      const paint = () => {
        pic.replaceChildren(
          memory.image
            ? el("img", { src: `../${memory.image}`, alt: "", loading: "lazy" })
            : el("span", { textContent: "Choose photo" })
        );
      };
      paint();
      pic.addEventListener("click", () =>
        openPicker((url) => {
          content.memories[i].image = url;
          markDirty();
          memory.image = url;
          paint();
        })
      );

      const field = (key, label) => {
        const input = el("input", { type: "text", value: memory[key] ?? "" });
        input.addEventListener("input", () => {
          content.memories[i][key] = input.value;
          markDirty();
        });
        return el("div", { className: "field" }, [
          el("label", { textContent: label }),
          input,
        ]);
      };

      const span = el("select");
      for (const value of ["regular", "tall", "wide"]) {
        span.append(el("option", { value, textContent: value, selected: memory.span === value }));
      }
      span.addEventListener("change", () => {
        content.memories[i].span = span.value;
        markDirty();
      });

      const move = (delta) => {
        const target = i + delta;
        if (target < 0 || target >= content.memories.length) return;
        [content.memories[i], content.memories[target]] =
          [content.memories[target], content.memories[i]];
        markDirty();
        render();
      };

      list.append(
        el("div", { className: "card" }, [
          el("div", { className: "mem" }, [
            pic,
            el("div", {}, [
              field("title", "Title"),
              field("caption", "Caption"),
              el("div", { className: "field" }, [
                el("label", { textContent: "Tile size" }),
                span,
              ]),
              el("div", { className: "grp", style: "display:flex;gap:.4rem" }, [
                btn("↑", () => move(-1)),
                btn("↓", () => move(1)),
                btn("Remove", () => {
                  content.memories.splice(i, 1);
                  markDirty();
                  render();
                }, "danger"),
              ]),
            ]),
          ]),
        ])
      );
    });
  };

  const add = btn("+ Add photo", () => {
    content.memories.push({ image: "", title: "", caption: "", span: "regular" });
    markDirty();
    render();
  });

  render();
  box.append(list, add);
  return box;
}

/** The closing montage — just a list of image paths. */
function montageList() {
  const box = el("div", { className: "field" }, [
    el("label", { textContent: "Closing montage photos" }),
  ]);
  const grid = el("div", { className: "thumbs" });

  const render = () => {
    grid.replaceChildren();
    content.finalSurprise.montage.forEach((url, i) => {
      const cell = el("div", { className: "thumb" }, [
        el("img", { src: `../${url}`, alt: "", loading: "lazy" }),
        el("span", { className: "x", textContent: "✕" }),
      ]);
      cell.querySelector(".x").addEventListener("click", () => {
        content.finalSurprise.montage.splice(i, 1);
        markDirty();
        render();
      });
      grid.append(cell);
    });
    const add = el("div", {
      className: "thumb",
      style: "display:grid;place-items:center;font-size:.75rem;color:rgba(246,234,218,.5)",
      textContent: "+ Add",
    });
    add.addEventListener("click", () =>
      openPicker((url) => {
        content.finalSurprise.montage.push(url);
        markDirty();
        render();
      })
    );
    grid.append(add);
  };

  render();
  box.append(grid);
  return box;
}

/* ---------- form assembly ---------- */

function section(title, ...nodes) {
  return el("section", {}, [el("h2", { textContent: title }), ...nodes.flat()]);
}

function buildEditor() {
  const form = $("editor");
  form.replaceChildren(
    section("Names",
      el("div", { className: "row two" }, [
        textField("sisterName", "Your sister's name"),
        textField("brotherName", "Your name"),
      ])),

    section("Opening screen",
      textField("hero.eyebrow", "Small label above"),
      textField("hero.line1", "Main heading"),
      textField("hero.line2", "Line underneath"),
      textField("hero.line3", "Gold line"),
      el("div", { className: "row two" }, [
        textField("hero.cta", "Button text"),
        textField("hero.scrollHint", "Scroll hint"),
      ])),

    section("Our bond",
      textField("bond.eyebrow", "Small label"),
      textField("bond.heading", "Heading"),
      stringList("bond.paragraphs", "Paragraphs", { rows: 3 })),

    section("Memories", memoryList()),

    section("Things I don't say enough",
      textField("appreciation.eyebrow", "Small label"),
      textField("appreciation.heading", "Heading"),
      stringList("appreciation.lines", "Lines, revealed one at a time"),
      textField("appreciation.finale", "Final line")),

    section("Because we're still us",
      textField("siblingMoments.eyebrow", "Small label"),
      textField("siblingMoments.heading", "Heading"),
      objectList("siblingMoments.cards", "Cards", [
        ["label", "Label"],
        ["text", "Text"],
        ["glyph", "Symbol (✕ ◕ ✧ ✺ ❤)"],
      ])),

    section("If I could give you one thing",
      textField("oneThing.intro", "Opening line", { area: true, rows: 2 }),
      textField("oneThing.reveal", "The reveal", { area: true, rows: 2 }),
      textField("oneThing.outro", "Closing line", { area: true, rows: 2 })),

    section("The rakhi",
      textField("rakhi.eyebrow", "Small label"),
      textField("rakhi.heading", "Heading"),
      textField("rakhi.subheading", "Subheading"),
      el("div", { className: "row two" }, [
        textField("rakhi.button", "Button text"),
        textField("rakhi.replay", "Button after tying"),
      ]),
      stringList("rakhi.messages", "Messages, shown in order"),
      textField("rakhi.finale", "Final message")),

    section("The letter",
      textField("letter.eyebrow", "Small label"),
      textField("letter.heading", "Heading"),
      textField("letter.salutation", "Greeting"),
      stringList("letter.body", "Paragraphs", { rows: 3 }),
      el("div", { className: "row two" }, [
        textField("letter.closing", "Closing line"),
        textField("letter.signature", "Signature"),
      ])),

    section("The final surprise",
      textField("finalSurprise.eyebrow", "Small label"),
      textField("finalSurprise.teaser", "Teaser line"),
      textField("finalSurprise.button", "Button text"),
      textField("finalSurprise.finalMessage", "Big final message"),
      el("div", { className: "row two" }, [
        textField("finalSurprise.loveLine", "Love line"),
        textField("finalSurprise.signOff", "Sign-off"),
      ]),
      montageList()),

    section("Music",
      el("div", { className: "row two" }, [
        textField("music.path", "Path to the mp3"),
        textField("music.label", "Button description"),
      ]),
      el("p", {
        className: "muted",
        textContent:
          "Leave as-is unless you added your own file. No file means no music button.",
      }))
  );
}

/* ---------- save / session ---------- */

async function save() {
  const button = $("save");
  button.disabled = true;
  button.textContent = "Saving…";
  try {
    const res = await api("content", { method: "PUT", body: JSON.stringify(content) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed");
    content = await res.json();
    dirty = false;
    $("dirty").textContent = "";
    toast("Saved — refresh the site to see it");
    buildEditor();
  } catch (err) {
    toast(err.message, "err");
  } finally {
    button.disabled = false;
    button.textContent = "Save changes";
  }
}

$("save").addEventListener("click", save);

$("logout").addEventListener("click", async () => {
  if (dirty && !confirm("You have unsaved changes. Sign out anyway?")) return;
  await api("logout", { method: "POST" });
  location.reload();
});

window.addEventListener("beforeunload", (e) => {
  if (dirty) e.preventDefault();
});

$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("loginError").textContent = "";
  const res = await api("login", {
    method: "POST",
    body: JSON.stringify({ password: $("password").value }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    $("loginError").textContent = data.error || "Could not sign in.";
    return;
  }
  $("password").value = "";
  start();
});

async function start() {
  const session = await api("session").then((r) => r.json()).catch(() => ({}));
  if (!session.authenticated) {
    $("login").classList.remove("hide");
    $("app").classList.add("hide");
    return;
  }
  content = await api("content").then((r) => r.json());
  $("login").classList.add("hide");
  $("app").classList.remove("hide");
  buildEditor();
}

start();
