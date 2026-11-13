const translations = {
  es: {
    language: "Idioma",
    intro: "Pequeños hábitos, grandes cambios. Descubre tu impacto ambiental semanal.",
    habits: "Cuéntanos tus hábitos",
    transport: "Transporte al colegio",
    bus: "Bus",
    car: "Carro privado",
    shared: "Carro compartido",
    active: "Bicicleta / Caminando",
    paper: "Hojas de papel usadas al día",
    recycling: "Nivel de reciclaje",
    never: "Nada",
    sometimes: "A veces",
    always: "Siempre",
    calculate: "Calcular mi impacto",
    certificate: "Certificado de impacto ecológico semanal",
    co2: "CO2 estimado",
    weekly: "kg por semana",
    outOf: "de 100 puntos",
    print: "Imprimir / Guardar Reporte PDF",
    how: "¿Cómo se calcula?",
    educational: "Modelo educativo con factores supuestos; no es una medición real. Se consideran 5 días de colegio por semana.",
    factors: "Transporte por día: bus 2 kg, carro privado 5 kg, compartido 2.5 kg y bicicleta/caminando 0 kg. Cada hoja equivale a 0.005 kg.",
    reduction: "Reciclar a veces reduce el impacto del papel un 25%; reciclar siempre lo reduce un 50%.",
    scoring: "Eco-Points: transporte (bus 20, carro privado 0, compartido 30, bicicleta/caminando 50), más ahorro de papel (30 menos las hojas diarias, mínimo 0), más reciclaje (nada 0, a veces 10, siempre 20).",
    date: "Fecha",
    footer: "Colegio Bolívar · Cada acción cuenta"
  },
  en: {
    language: "Language",
    intro: "Small habits, big changes. Discover your weekly environmental impact.",
    habits: "Tell us about your habits",
    transport: "Transport to school",
    bus: "Bus",
    car: "Private car",
    shared: "Shared car",
    active: "Cycling / Walking",
    paper: "Sheets of paper used per day",
    recycling: "Recycling level",
    never: "Never",
    sometimes: "Sometimes",
    always: "Always",
    calculate: "Calculate my impact",
    certificate: "Weekly ecological impact certificate",
    co2: "Estimated CO2",
    weekly: "kg per week",
    outOf: "out of 100 points",
    print: "Print / Save PDF Report",
    how: "How is it calculated?",
    educational: "Educational model using assumed factors; this is not an actual measurement. Calculations cover 5 school days per week.",
    factors: "Daily transport: bus 2 kg, private car 5 kg, shared car 2.5 kg and cycling/walking 0 kg. Each sheet represents 0.005 kg.",
    reduction: "Recycling sometimes reduces paper impact by 25%; always recycling reduces it by 50%.",
    scoring: "Eco-Points: transport (bus 20, private car 0, shared car 30, cycling/walking 50), plus paper savings (30 minus daily sheets, minimum 0), plus recycling (never 0, sometimes 10, always 20).",
    date: "Date",
    footer: "Colegio Bolívar · Every action counts"
  }
};

const form = document.getElementById("eco-form");
const transport = document.getElementById("transport");
const paper = document.getElementById("paper");
const recycling = document.getElementById("recycling");
const language = document.getElementById("language");
const results = document.getElementById("results");

const transportFactors = {
  bus: 2,
  car: 5,
  shared: 2.5,
  active: 0
};

const transportPoints = {
  bus: 20,
  car: 0,
  shared: 30,
  active: 50
};

const recyclingKeys = {
  "0": "never",
  "0.5": "sometimes",
  "1": "always"
};

let report = null;

function renderReport() {
  if (!report) return;

  const t = translations[language.value];
  const locale = language.value === "es" ? "es-CO" : "en-US";

  document.getElementById("co2").textContent =
    report.co2.toFixed(2);

  document.getElementById("points").textContent =
    report.points;

  document.getElementById("report-summary").textContent =
    `${t.date}: ${report.date.toLocaleDateString(locale)} · ` +
    `${t.transport}: ${t[report.transport]} · ` +
    `${t.paper}: ${report.sheets} · ` +
    `${t.recycling}: ${t[recyclingKeys[report.recycling]]}`;
}

function applyLanguage() {
  const t = translations[language.value];
  document.documentElement.lang = language.value;

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    element.textContent = t[element.dataset.i18n];
  });

  renderReport();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const sheets = Number(paper.value);
  const recyclingLevel = Number(recycling.value);

  if (
    !Number.isFinite(sheets) ||
    !Number.isInteger(sheets) ||
    sheets < 0 ||
    sheets > 10000
  ) {
    return;
  }

  const co2 =
    transportFactors[transport.value] * 5 +
    sheets * 5 * 0.005 * (1 - recyclingLevel * 0.5);

  const points =
    transportPoints[transport.value] +
    Math.max(0, 30 - sheets) +
    recyclingLevel * 20;

  report = {
    transport: transport.value,
    sheets: sheets,
    recycling: recycling.value,
    co2: co2,
    points: Math.max(0, Math.min(100, points)),
    date: new Date()
  };

  renderReport();
  results.hidden = false;
});

form.addEventListener("input", function () {
  report = null;
  results.hidden = true;
});

language.addEventListener("change", applyLanguage);

document.getElementById("print-button").addEventListener("click", function () {
  if (report) window.print();
});

applyLanguage();