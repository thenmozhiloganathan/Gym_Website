// ===== Helpers & data =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
// If a photo fails to load, hide it so the dark placeholder behind it shows
document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.style.visibility = "hidden"; }, true);

const programs = [
  ["🏋️", "Strength Training", "Barbell and machine lifting to build raw strength safely.", "12 weeks"],
  ["🔥", "Weight Loss", "Calorie-smart training and nutrition to drop fat and keep it off.", "16 weeks"],
  ["💪", "Muscle Building", "Hypertrophy splits with progressive overload.", "20 weeks"],
  ["⚡", "CrossFit", "Fast, varied group workouts that test every muscle.", "Ongoing"],
  ["🏃", "Cardio Training", "Treadmill, rower and bike plans for stamina and heart health.", "8 weeks"],
  ["🎯", "Personal Training", "One coach, one plan, built around you.", "Flexible"]
];
const trainers = [
  ["Arjun Kumar", "Strength Coach", "9 yrs", "1567013127542-490d757e51fc"],
  ["Priya Sharma", "Fitness Trainer", "6 yrs", "1594381898411-846e7d193883"],
  ["Rahul Raj", "CrossFit Coach", "7 yrs", "1583454110551-21f2fa2afe61"],
  ["Ananya", "Yoga & Mobility Coach", "5 yrs", "1518611012118-696072aa579a"]
];
const classes = ["Strength Training", "HIIT", "Yoga", "CrossFit", "Cardio", "Zumba", "Personal Training"];
const times = ["6:00 AM", "8:00 AM", "5:00 PM", "7:00 PM"];
const testimonials = [
  ["I joined FITZONE six months ago and completely changed my lifestyle. The trainers are extremely supportive.", "Karthik"],
  ["The Pro plan's diet guidance finally made weight loss stick. I'm down 11 kg.", "Meena R."],
  ["CrossFit classes here are tough, fun and full of people who cheer you on.", "Vignesh"],
  ["Clean equipment, early opening hours and coaches who correct your form. Perfect.", "Divya S."]
];
const gallery = [
  ["1571019613454-1cb2f99b2d8b", "Before"], ["1581009146145-b5ef050c2e1e", "After"],
  ["1599058917212-d750089bc07e", "Before"], ["1605296867304-46d5465a13f1", "After"]
];

// ===== Render sections from data =====
$("#programGrid").innerHTML = programs.map(([ico, name, desc, dur]) => `
  <article class="program reveal"><div class="ico" aria-hidden="true">${ico}</div><h3>${name}</h3>
  <p>${desc}</p><span class="meta">Duration: ${dur}</span>
  <button class="btn btn-ghost" data-program="${name}">Learn More</button></article>`).join("");

$("#trainerGrid").innerHTML = trainers.map(([name, role, exp, id]) => `
  <article class="trainer reveal"><div class="photo"><img src="${img(id, 600)}" alt="${name}, ${role}" loading="lazy"></div>
  <div class="body"><h3>${name}</h3><p>${role} · ${exp} experience</p>
  <p class="social"><a href="#" aria-label="${name} on Instagram">IG</a><a href="#" aria-label="${name} on Facebook">FB</a><a href="#" aria-label="${name} on X">X</a></p></div></article>`).join("");

// Schedule: rotate the class list so every cell is filled
$("#scheduleTable").innerHTML = `<thead><tr><th>Time</th>${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => `<th>${d}</th>`).join("")}</tr></thead>
<tbody>${times.map((t, r) => `<tr><td>${t}</td>${[0, 1, 2, 3, 4, 5].map(c => `<td>${classes[(r * 2 + c) % classes.length]}</td>`).join("")}</tr>`).join("")}</tbody>`;

$("#galleryGrid").innerHTML = gallery.map(([id, label], i) => `
  <button class="shot reveal" data-full="${img(id, 1400)}" aria-label="Open transformation photo ${i + 1}">
  <img src="${img(id, 600)}" alt="Member transformation, ${label.toLowerCase()} photo" loading="lazy"><span>${label}</span></button>`).join("");

// ===== Navbar: sticky style, mobile menu, active link =====
const navbar = $("#navbar"), burger = $("#burger"), menu = $("#menu"), toTop = $("#toTop");
const setMenu = open => { menu.classList.toggle("open", open); burger.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));

const sections = $$("main section[id]"), links = $$(".menu a:not(.btn)");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", scrollY > 40);
  toTop.classList.toggle("show", scrollY > 600);
  const current = sections.filter(s => s.getBoundingClientRect().top < 120).pop();
  links.forEach(a => a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id));
}, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

// ===== Toast + button interactions =====
const toast = $("#toast");
const showToast = msg => { toast.textContent = msg; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2600); };
$$("[data-go]").forEach(b => b.addEventListener("click", () => $(b.dataset.go).scrollIntoView({ behavior: "smooth" })));
$$("[data-program]").forEach(b => b.addEventListener("click", () => { $("#cSubject").value = "Enquiry: " + b.dataset.program; $("#contact").scrollIntoView({ behavior: "smooth" }); }));
$$(".join").forEach(b => b.addEventListener("click", () => {
  $("#cSubject").value = b.dataset.plan + " membership";
  showToast(b.dataset.plan + " plan selected. Fill in the form and we'll call you.");
  setTimeout(() => $("#contact").scrollIntoView({ behavior: "smooth" }), 700);
}));

// ===== Scroll reveal + animated counters =====
const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); observer.unobserve(e.target); }
}), { threshold: .15 });
$$(".reveal").forEach(el => observer.observe(el));

const counters = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  counters.unobserve(e.target);
  $$("[data-count]", e.target).forEach(el => {
    const target = +el.dataset.count, start = performance.now();
    const tick = now => { const p = Math.min((now - start) / 1400, 1); el.textContent = Math.round(target * p); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}), { threshold: .5 });
counters.observe($(".stats"));

// ===== BMI calculator =====
const readNumber = (id, min, max) => { const v = parseFloat($(id).value); return v >= min && v <= max ? v : null; };
$("#bmiForm").addEventListener("submit", e => {
  e.preventDefault();
  const h = readNumber("#bmiHeight", 100, 250), w = readNumber("#bmiWeight", 25, 300), out = $("#bmiResult");
  if (!h || !w) { out.textContent = "Enter height 100–250 cm and weight 25–300 kg."; return; }
  const bmi = w / ((h / 100) ** 2);
  const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  out.textContent = `BMI ${bmi.toFixed(1)} — ${cat}`;
});

// ===== Calorie calculator (Mifflin-St Jeor) =====
$("#calForm").addEventListener("submit", e => {
  e.preventDefault();
  const age = readNumber("#calAge", 15, 90), h = readNumber("#calHeight", 100, 250), w = readNumber("#calWeight", 25, 300), out = $("#calResult");
  if (!age || !h || !w) { out.textContent = "Enter a valid age (15–90), height and weight."; return; }
  const bmr = 10 * w + 6.25 * h - 5 * age + ($("#calGender").value === "male" ? 5 : -161);
  const maintain = Math.round(bmr * parseFloat($("#calActivity").value));
  out.textContent = `Maintain: ${maintain} kcal/day · Lose weight: ${maintain - 500} · Gain: ${maintain + 300}`;
});

// ===== Testimonial slider =====
const slidesEl = $("#slides"), dotsEl = $("#dots");
slidesEl.innerHTML = testimonials.map(([q, n]) => `<figure class="slide"><div class="stars" aria-label="5 stars">★★★★★</div><blockquote>“${q}”</blockquote><figcaption>— ${n}</figcaption></figure>`).join("");
dotsEl.innerHTML = testimonials.map((_, i) => `<button aria-label="Show testimonial ${i + 1}" data-i="${i}"></button>`).join("");
let slideIndex = 0, timer;
const showSlide = i => {
  slideIndex = (i + testimonials.length) % testimonials.length;
  $$(".slide").forEach((s, n) => s.classList.toggle("on", n === slideIndex));
  $$("button", dotsEl).forEach((d, n) => d.classList.toggle("on", n === slideIndex));
};
const autoPlay = () => { clearInterval(timer); timer = setInterval(() => showSlide(slideIndex + 1), 5500); };
$("#prevBtn").addEventListener("click", () => { showSlide(slideIndex - 1); autoPlay(); });
$("#nextBtn").addEventListener("click", () => { showSlide(slideIndex + 1); autoPlay(); });
dotsEl.addEventListener("click", e => { if (e.target.dataset.i) { showSlide(+e.target.dataset.i); autoPlay(); } });
showSlide(0); autoPlay();

// ===== Lightbox (X button, outside click, ESC) =====
const lightbox = $("#lightbox"), lbImg = $("#lbImg");
const closeLightbox = () => { lightbox.hidden = true; };
$("#galleryGrid").addEventListener("click", e => {
  const shot = e.target.closest(".shot"); if (!shot) return;
  lbImg.src = shot.dataset.full; lbImg.alt = $("img", shot).alt; lightbox.hidden = false;
});
$("#closeLb").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

// ===== Contact form validation =====
const rules = {
  cName: v => v.trim().length >= 2 || "Enter your name.",
  cEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
  cPhone: v => /^[+\d][\d\s-]{8,14}$/.test(v.trim()) || "Enter a valid phone number.",
  cSubject: v => v.trim().length >= 3 || "Enter a subject.",
  cMessage: v => v.trim().length >= 10 || "Message must be at least 10 characters."
};
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  let valid = true;
  Object.entries(rules).forEach(([id, check]) => {
    const field = $("#" + id), result = check(field.value);
    $(".err", field.parentElement).textContent = result === true ? "" : result;
    if (result !== true) valid = false;
  });
  if (valid) { e.target.reset(); $("#formSuccess").hidden = false; showToast("Message sent!"); }
});
