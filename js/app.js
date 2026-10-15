/* Fixora shared behaviour: header, footer, cart drawer, helpers. */

function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function inr(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function param(name) { return new URLSearchParams(location.search).get(name); }
function icon(app) { return '<svg class="line" viewBox="0 0 24 24">' + app.icon + "</svg>"; }
function getApp(id) { return APPLIANCES.filter(function (a) { return a.id === id; })[0]; }
function getPart(id) { return PARTS.filter(function (p) { return p.id === id; })[0]; }
function getIssue(app, id) { return app ? app.issues.filter(function (i) { return i.id === id; })[0] : null; }

// Price breakdown for a repair: Fixora total vs a typical local-shop quote.
function quote(issue) {
  var parts = issue.parts.map(getPart);
  var partsTotal = parts.reduce(function (s, p) { return s + p.price; }, 0);
  var localParts = parts.reduce(function (s, p) { return s + p.local; }, 0);
  var localLabour = Math.round(issue.labour * LOCAL_LABOUR_MARKUP / 10) * 10;
  var total = issue.labour + partsTotal;
  var local = localLabour + localParts;
  return { parts: parts, partsTotal: partsTotal, total: total, local: local, save: local - total };
}

function store(key, value) {
  try {
    if (value === undefined) return JSON.parse(localStorage.getItem(key) || "null");
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { /* storage unavailable: the site still works for this page view */ }
  return value;
}

/* ---------- Cart ---------- */
var Cart = {
  items: store("fixora_cart") || {},
  add: function (id, n) {
    this.items[id] = (this.items[id] || 0) + (n || 1);
    if (this.items[id] <= 0) delete this.items[id];
    this.save();
  },
  clear: function () { this.items = {}; this.save(); },
  count: function () {
    var items = this.items;
    return Object.keys(items).reduce(function (s, k) { return s + items[k]; }, 0);
  },
  save: function () { store("fixora_cart", this.items); renderCart(); }
};

function toast(msg) {
  var t = $(".toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(function () { t.classList.remove("show"); }, 2400);
}

function openCart(open) {
  $(".drawer").classList.toggle("open", open);
  $(".overlay").classList.toggle("open", open);
}

function renderCart() {
  var count = Cart.count();
  var badge = $(".cart-count");
  badge.textContent = count;
  badge.hidden = count === 0;

  var ids = Object.keys(Cart.items).filter(getPart);
  var body = $(".drawer-body");
  var foot = $(".drawer-foot");
  if (!ids.length) {
    body.innerHTML = '<div class="empty"><b>Your cart is empty</b><p class="small">Genuine spare parts at transparent prices.</p><p style="margin-top:16px"><a class="btn sm" href="parts.html">Browse spare parts</a></p></div>';
    foot.innerHTML = "";
    return;
  }
  var total = 0, local = 0;
  body.innerHTML = ids.map(function (id) {
    var p = getPart(id), q = Cart.items[id];
    total += p.price * q; local += p.local * q;
    return '<div class="cart-item">' + partThumb(p, "ico cart-thumb") +
      '<div class="info"><b>' + p.name + '</b><span class="small muted">' + inr(p.price) + ' each</span></div>' +
      '<div class="qty"><button data-cart="' + id + '" data-n="-1" aria-label="Decrease">−</button><span>' + q + '</span><button data-cart="' + id + '" data-n="1" aria-label="Increase">+</button></div></div>';
  }).join("");
  var delivery = total >= 499 ? 0 : 49;
  foot.innerHTML = '<ul class="rows">' +
    '<li><span>Parts</span><span>' + inr(total) + '</span></li>' +
    '<li><span>Delivery</span><span>' + (delivery ? inr(delivery) : "Free") + '</span></li>' +
    '<li class="total"><span>Total</span><span>' + inr(total + delivery) + '</span></li></ul>' +
    '<p style="margin:8px 0 14px"><span class="save-pill">You save ' + inr(local - total) + ' vs local shops</span></p>' +
    '<button class="btn block" id="placeOrder">Place order · Pay on delivery</button>' +
    '<p class="small muted" style="margin-top:10px;text-align:center">Demo checkout. No real order is placed.</p>';
}

/* ---------- Layout ---------- */
// Hex-nut "F" mark; the green dot reads as "fixed". Same artwork as assets/logo.svg.
var LOGO_MARK = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 1.5 28.6 8.75v14.5L16 30.5 3.4 23.25V8.75z" fill="#101418" stroke="#101418" stroke-width="2" stroke-linejoin="round"/><path d="M11.5 9.5h9.5v3.4h-5.6v2.6h4.6v3.3h-4.6v4.7h-3.9z" fill="#fff"/><circle cx="21" cy="21" r="2" fill="#2bd49a"/></svg>';

var NAV = [
  ["services.html", "Repairs & prices"],
  ["diagnose.html", "Ask an expert"],
  ["parts.html", "Spare parts"],
  ["book.html", "Book a technician"]
];

function renderLayout() {
  var page = location.pathname.split("/").pop() || "index.html";
  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = '<div class="wrap">' +
    '<a class="logo" href="index.html"><span class="logo-mark">' + LOGO_MARK + '</span>Fixora</a>' +
    '<span class="loc"><svg class="line" viewBox="0 0 24 24"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>Jammu</span>' +
    '<nav class="nav">' + NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (page === n[0] ? ' class="active"' : "") + ">" + n[1] + "</a>";
    }).join("") + "</nav>" +
    '<button class="cart-btn" aria-label="Open cart"><svg class="line" viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg><span class="cart-count" hidden>0</span></button>' +
    '<button class="menu-btn" aria-label="Menu"><svg class="line" viewBox="0 0 24 24" width="20" height="20"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
    "</div>";
  document.body.insertBefore(header, document.body.firstChild);

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = '<div class="wrap"><div class="foot-grid">' +
    '<div><a class="logo" href="index.html" style="margin-bottom:12px"><span class="logo-mark">' + LOGO_MARK + '</span>Fixora</a><p>Honest appliance repair. Talk to a trained expert, see every price up front, and pay less than the local shop.</p></div>' +
    '<div><h4>Services</h4>' + NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + "</a>"; }).join("") + "</div>" +
    '<div><h4>Appliances</h4>' + APPLIANCES.slice(0, 5).map(function (a) { return '<a href="services.html?appliance=' + a.id + '">' + a.name + "</a>"; }).join("") + "</div>" +
    '<div><h4>Contact</h4><p>help@fixora.example</p><p>1800-000-0000 (sample)</p><p>8 AM – 9 PM, all days</p></div>' +
    '</div><div class="foot-bottom">© 2026 Fixora. Student venture prototype. All prices, parts and people shown are sample data. <a href="credits.html" style="display:inline">Photo credits</a></div></div>';
  document.body.appendChild(footer);

  var extras = document.createElement("div");
  extras.innerHTML = '<div class="overlay"></div>' +
    '<aside class="drawer" aria-label="Cart"><div class="drawer-head"><h3>Your cart</h3><button class="x" aria-label="Close cart">✕</button></div>' +
    '<div class="drawer-body"></div><div class="drawer-foot"></div></aside><div class="toast" role="status"></div>';
  document.body.appendChild(extras);

  $(".cart-btn").onclick = function () { openCart(true); };
  $(".overlay").onclick = $(".drawer .x").onclick = function () { openCart(false); };
  $(".menu-btn").onclick = function () { $(".nav").classList.toggle("open"); };

  // One listener handles every "add to cart" and quantity button on the page.
  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]");
    if (add) {
      Cart.add(add.getAttribute("data-add"));
      toast(getPart(add.getAttribute("data-add")).name + " added to cart");
      return;
    }
    var q = e.target.closest("[data-cart]");
    if (q) { Cart.add(q.getAttribute("data-cart"), Number(q.getAttribute("data-n"))); return; }
    if (e.target.id === "placeOrder") {
      var id = "FX-P" + Math.floor(10000 + Math.random() * 90000);
      Cart.clear();
      $(".drawer-body").innerHTML = '<div class="empty"><div class="success" style="text-align:left"><h3>Order placed</h3><p>Order <b>' + id + '</b> is confirmed. Parts are delivered in 24 to 48 hours, and you pay on delivery.</p></div><p style="margin-top:16px"><a class="btn sm ghost" href="book.html">Need it fitted? Book a technician</a></p></div>';
    }
  });
  renderCart();
  if (location.hash === "#cart") openCart(true);
}

// Photo of an appliance (see js/photos.js), falling back to its icon.
function appPhoto(a, cls) {
  var ph = typeof APPLIANCE_PHOTOS !== "undefined" && APPLIANCE_PHOTOS[a.id];
  if (ph) return '<span class="' + cls + '"><img src="assets/appliances/' + ph.file + '" alt="' + a.name + '" loading="lazy"></span>';
  return '<span class="ico">' + icon(a) + '</span>';
}

// Photo of a part (see js/photos.js), falling back to the appliance icon.
function partThumb(p, cls) {
  var ph = typeof PART_PHOTOS !== "undefined" && PART_PHOTOS[p.id];
  if (ph) return '<div class="' + cls + '"><img src="assets/parts/' + ph.file + '" alt="' + p.name + '" loading="lazy"></div>';
  return '<div class="' + cls + ' no-photo">' + icon(getApp(p.app)) + '</div>';
}

function partCard(p) {
  var off = Math.round((1 - p.price / p.local) * 100);
  return '<article class="part"><div class="part-media">' + partThumb(p, "part-img") + '<span class="save-pill">' + off + '% less</span></div>' +
    '<div><h3>' + p.name + '</h3><div class="meta">' + p.brand + '</div></div>' +
    '<div class="price"><b>' + inr(p.price) + '</b><s>' + inr(p.local) + '</s><span class="small muted">local shop</span></div>' +
    '<div class="meta">' + (p.warranty ? p.warranty + "-month warranty" : "Genuine part") + ' · Delivery in 24–48 h</div>' +
    '<button class="btn sm ghost" data-add="' + p.id + '">Add to cart</button></article>';
}

document.addEventListener("DOMContentLoaded", renderLayout);
