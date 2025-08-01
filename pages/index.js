import React, { useState, useEffect } from "react";

// =============== LADUNGSTRÄGER & SPRACHEN ===============
const LADUNGSTRAEGER_TYPEN = [
  { label: "EPAL 1 Europalette", qualitaeten: ["A", "B", "C"] },
  { label: "EPAL 6 Halbpalette", qualitaeten: [] },
  { label: "EPAL 7 Halbpalette", qualitaeten: [] },
  { label: "EPAL Gitterbox", qualitaeten: [] },
  { label: "EPAL Europalette QR", qualitaeten: ["A", "B", "C"] },
];

const LANG = {
  de: {
    login: "Anmelden",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    password_repeat: "Passwort (wiederholen)",
    firstName: "Vorname",
    lastName: "Nachname",
    welcome: "Willkommen",
    logout: "Abmelden",
    showLog: "Protokoll anzeigen",
    close: "Schließen",
    location: "Standort",
    addLocation: "Standort hinzufügen",
    remove: "Entfernen",
    areaPerSlot: "Lagerfläche pro Stellplatz (m²)",
    costPerSlot: "Lagerkosten pro Stellplatz (€)",
    kundeHinzufuegen: "Kunde hinzufügen",
    entfernen: "Entfernen",
    kunden: "Kunden",
    keinKunde: "Noch kein Kunde angelegt.",
    ladungstraegerHinzufuegen: "Ladungsträger hinzufügen",
    keinLadungstraeger: "Noch kein Ladungsträger angelegt.",
    notizen: "Notizen",
    mengeTag: "Menge/Tag",
    arbeitstage: "Arbeitstage/Monat",
    tageClearingLadestelle: "Tage bis Clearing Ladestelle",
    tageClearingEntladestelle: "Tage bis Clearing Entladestelle",
    palettenProStellplatz: "Pal./Stellplatz",
    inventory: "Grundbestand / Inventur je Standort",
    type: "Typ",
    quality: "Qualität",
    inventoryQty: "Soll-Bestand",
    inventoryActual: "Inventur-Bestand",
    inventoryDiff: "Abweichung",
    inventorySave: "Inventur speichern",
    add: "Hinzufügen",
    remove_inventory: "Entfernen",
    bookMovement: "Bewegung buchen",
    entry: "Eingang",
    exit: "Ausgang",
    customer: "Kunde",
    book: "Buchen",
    chartsUmschlag: "Umschlag je Standort (Paletten/Monat)",
    chartsKosten: "Lagerkosten je Standort (€)",
    gesamtuebersicht: "Gesamtübersicht",
    lagerflaeche: "Lagerfläche",
    stellplaetze: "Stellplätze",
    lagerkosten: "Lagerkosten",
    footer: "LCX NEXUS © 2025 – Lager- & Bestandsplanungstool",
    ampelfarben: "Ampelfarben:",
    mustAssignCustomer: "Mindestens ein Kunde mit Menge wählen.",
    missingInventory: "Kein Grundbestand für diesen Ladungsträgertyp/Qualität angelegt! Bitte zuerst anlegen.",
    needRestock: "Warnung: Der tatsächliche Bestand reicht für die geplanten Umschläge im nächsten Monat nicht aus! Bitte rechtzeitig nachbestellen.",
    contractQty: "Vertragsmenge/Monat",
    actualTurnover: "Tatsächlicher Umschlag",
    ampelGreen: "Alles im grünen Bereich",
    ampelYellow: "Vorsicht: Menge bald erreicht",
    ampelRed: "Vertragsmenge überschritten!",
    protocol: "Änderungsprotokoll",
    save: "Speichern",
    login_success: "Anmeldung erfolgreich",
    register_success: "Registrierung erfolgreich. Sie können sich jetzt einloggen.",
    field_required: "Pflichtfeld",
    password_mismatch: "Passwörter stimmen nicht überein",
    user_exists: "Benutzer existiert bereits",
    wrong_pw: "Falsches Passwort oder Benutzer nicht gefunden",
  },
  en: {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    password_repeat: "Password (repeat)",
    firstName: "First name",
    lastName: "Last name",
    welcome: "Welcome",
    logout: "Logout",
    showLog: "Show protocol",
    close: "Close",
    location: "Location",
    addLocation: "Add location",
    remove: "Remove",
    areaPerSlot: "Storage area per slot (m²)",
    costPerSlot: "Storage cost per slot (€)",
    kundeHinzufuegen: "Add customer",
    entfernen: "Remove",
    kunden: "Customers",
    keinKunde: "No customer added yet.",
    ladungstraegerHinzufuegen: "Add load carrier",
    keinLadungstraeger: "No load carrier added yet.",
    notizen: "Notes",
    mengeTag: "Qty/day",
    arbeitstage: "Workdays/month",
    tageClearingLadestelle: "Days to clearing (load)",
    tageClearingEntladestelle: "Days to clearing (unload)",
    palettenProStellplatz: "Pal./slot",
    inventory: "Base stock / Inventory per location",
    type: "Type",
    quality: "Quality",
    inventoryQty: "Target stock",
    inventoryActual: "Inventory count",
    inventoryDiff: "Difference",
    inventorySave: "Save inventory",
    add: "Add",
    remove_inventory: "Remove",
    bookMovement: "Book movement",
    entry: "Entry",
    exit: "Exit",
    customer: "Customer",
    book: "Book",
    chartsUmschlag: "Turnover per location (pallets/month)",
    chartsKosten: "Storage cost per location (€)",
    gesamtuebersicht: "Total overview",
    lagerflaeche: "Storage area",
    stellplaetze: "Slots",
    lagerkosten: "Storage cost",
    footer: "LCX NEXUS © 2025 – Warehouse & Inventory Planning Tool",
    ampelfarben: "Traffic lights:",
    mustAssignCustomer: "At least one customer with quantity required.",
    missingInventory: "No base stock for this type/quality yet! Please add first.",
    needRestock: "Warning: Actual stock is not sufficient for planned turnover next month! Please reorder in time.",
    contractQty: "Contract quantity/month",
    actualTurnover: "Actual turnover",
    ampelGreen: "All in green area",
    ampelYellow: "Caution: quantity nearly reached",
    ampelRed: "Contract quantity exceeded!",
    protocol: "Audit protocol",
    save: "Save",
    login_success: "Login successful",
    register_success: "Registration successful. You can now log in.",
    field_required: "Required field",
    password_mismatch: "Passwords do not match",
    user_exists: "User already exists",
    wrong_pw: "Wrong password or user not found",
  }
};
// =============== HELPERFUNKTIONEN & INIT =================

function getInitialData() {
  return [
    {
      name: "Mettmann",
      areaPerSlot: 1.8,
      costPerSlot: 7,
      grundbestaende: [
        // { typ: "EPAL 1 Europalette", qualitaet: "B", qty: 10000, actual: 10000 }
      ],
      kunden: [
        {
          name: "Zalando",
          notizen: "",
          ladungstraeger: [
            {
              typ: "EPAL 1 Europalette",
              qualitaet: "B",
              mengeTag: 500,
              arbeitstage: 20,
              tageClearingLadestelle: 10,
              tageClearingEntladestelle: 5,
              palettenProStellplatz: 30,
              contractQty: 10000,
            },
          ],
        },
      ],
    },
  ];
}

function getLadungstraegerKey(typ, qualitaet) {
  return typ + "|" + (qualitaet || "-");
}

function getNextMonthNeed(kunde) {
  let ret = {};
  kunde.ladungstraeger.forEach((lt) => {
    const key = getLadungstraegerKey(lt.typ, lt.qualitaet);
    const qty =
      lt.mengeTag * lt.arbeitstage +
      lt.tageClearingLadestelle * lt.mengeTag +
      lt.tageClearingEntladestelle * lt.mengeTag;
    ret[key] = (ret[key] || 0) + qty;
  });
  return ret;
}

function getAllNextMonthNeed(standort) {
  let result = {};
  standort.kunden.forEach((kunde) => {
    const need = getNextMonthNeed(kunde);
    for (let k in need) result[k] = (result[k] || 0) + need[k];
  });
  return result;
}

function loadProtocol() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("lcx_protocol") || "[]");
  } catch {
    return [];
  }
}
function saveProtocol(arr) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lcx_protocol", JSON.stringify(arr));
}

function loadUsers() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("lcx_users") || "[]");
  } catch {
    return [];
  }
}
function saveUsers(arr) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lcx_users", JSON.stringify(arr));
}

// ==================== HAUPTKOMPONENTE ====================
export default function Home() {
  const [lang, setLang] = useState("de");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [protocol, setProtocol] = useState([]);
  const [standorte, setStandorte] = useState(getInitialData());
  const [tab, setTab] = useState(0);

  const [loginMode, setLoginMode] = useState("login");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
  });
  const [loginError, setLoginError] = useState("");

  const [showProtokoll, setShowProtokoll] = useState(false);

  // Init: Load User, Protocol
  useEffect(() => {
    setUsers(loadUsers());
    setProtocol(loadProtocol());
  }, []);
  useEffect(() => {
    saveProtocol(protocol);
  }, [protocol]);
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  function t(key) {
    return LANG[lang][key] || key;
  }
  function userName(u) {
    return u?.firstName && u?.lastName
      ? u.firstName + " " + u.lastName
      : u?.email || "-";
  }
  function logEvent(aktion, details) {
    const now = new Date();
    setProtocol((pr) => [
      ...pr,
      {
        zeit: now.toLocaleString(),
        user: user,
        aktion,
        details,
      },
    ]);
  }

  // ============= LOGIN/REGISTRIERUNG =============
  function handleLoginRegister() {
    if (!loginForm.email || !loginForm.password) {
      setLoginError(t("field_required"));
      return;
    }
    if (loginMode === "register") {
      if (!loginForm.firstName || !loginForm.lastName) {
        setLoginError(t("field_required"));
        return;
      }
      if (loginForm.password.length < 4) {
        setLoginError("Passwort mind. 4 Zeichen");
        return;
      }
      if (loginForm.password !== loginForm.password2) {
        setLoginError(t("password_mismatch"));
        return;
      }
      if (users.find((u) => u.email === loginForm.email)) {
        setLoginError(t("user_exists"));
        return;
      }
      // Registrierung
      const newUser = {
        email: loginForm.email,
        password: loginForm.password,
        firstName: loginForm.firstName,
        lastName: loginForm.lastName,
      };
      setUsers((us) => [...us, newUser]);
      setLoginMode("login");
      setLoginError(t("register_success"));
      setLoginForm({
        email: loginForm.email,
        password: "",
        password2: "",
        firstName: "",
        lastName: "",
      });
      logEvent("Registrierung", `${userName(newUser)} hat sich registriert`);
      return;
    }
    // Login
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === loginForm.email.toLowerCase() &&
        u.password === loginForm.password
    );
    if (found) {
      setUser(found);
      setLoginError("");
      logEvent("Login", `${userName(found)} hat sich angemeldet`);
    } else {
      setLoginError(t("wrong_pw"));
    }
  }

  function handleLogout() {
    logEvent("Logout", `${userName(user)} hat sich abgemeldet`);
    setUser(null);
  }
  // ============= STANDORTE, KUNDEN, GRUNDBESTAND, BUCHUNGEN =============

  function updateGrundbestand(sidx, typ, qualitaet, feld, val) {
    const neu = [...standorte];
    let gbs = neu[sidx].grundbestaende;
    let idx = gbs.findIndex(
      (gb) => gb.typ === typ && (gb.qualitaet || "-") === (qualitaet || "-")
    );
    if (idx === -1) {
      gbs.push({
        typ,
        qualitaet,
        qty: feld === "qty" ? Number(val) : 0,
        actual: feld === "actual" ? Number(val) : 0,
      });
      idx = gbs.length - 1;
    } else {
      gbs[idx][feld] = Number(val);
    }
    setStandorte(neu);
    logEvent(
      "Grundbestand geändert",
      `${neu[sidx].name}: ${typ} ${qualitaet || ""} – ${feld}: ${val}`
    );
  }
  function removeGrundbestand(sidx, typ, qualitaet) {
    const neu = [...standorte];
    neu[sidx].grundbestaende = neu[sidx].grundbestaende.filter(
      (gb) => !(gb.typ === typ && (gb.qualitaet || "-") === (qualitaet || "-"))
    );
    setStandorte(neu);
    logEvent(
      "Grundbestand entfernt",
      `${neu[sidx].name}: ${typ} ${qualitaet || ""}`
    );
  }

  function saveInventur(sidx, typ, qualitaet) {
    const neu = [...standorte];
    const gb = neu[sidx].grundbestaende.find(
      (g) => g.typ === typ && (g.qualitaet || "-") === (qualitaet || "-")
    );
    if (!gb) return;
    logEvent(
      "Inventur gespeichert",
      `${neu[sidx].name}: ${typ} ${qualitaet || ""} → Inventur: ${gb.actual}`
    );
    // Prüfung: Ausreichender Bestand für kommenden Monat?
    const key = getLadungstraegerKey(typ, qualitaet);
    const needed = getAllNextMonthNeed(neu[sidx])[key] || 0;
    if (gb.actual < needed) {
      alert(t("needRestock"));
    }
    setStandorte(neu);
  }

  // ---------- Standortverwaltung ----------
  function addStandort() {
    setStandorte([
      ...standorte,
      {
        name: t("location") + " " + (standorte.length + 1),
        areaPerSlot: 1.8,
        costPerSlot: 7,
        grundbestaende: [],
        kunden: [],
      },
    ]);
    setTab(standorte.length);
    logEvent("Standort hinzugefügt", `${t("location")} ${standorte.length + 1}`);
  }
  function removeStandort(idx) {
    logEvent("Standort entfernt", standorte[idx].name);
    const neu = [...standorte];
    neu.splice(idx, 1);
    setStandorte(neu);
    setTab(Math.max(0, tab - 1));
  }
  function updateStandortName(idx, val) {
    const neu = [...standorte];
    neu[idx].name = val;
    setStandorte(neu);
    logEvent("Standortname geändert", val);
  }
  function updateStandortFeld(idx, feld, val) {
    const neu = [...standorte];
    neu[idx][feld] = Number(val);
    setStandorte(neu);
  }

  // ---------- Kundenverwaltung ----------
  function addKunde(idx) {
    const neu = [...standorte];
    neu[idx].kunden.push({
      name: "Neuer Kunde",
      notizen: "",
      ladungstraeger: [],
    });
    setStandorte(neu);
    logEvent("Neuer Kunde", neu[idx].name + ": Neuer Kunde");
  }
  function removeKunde(sidx, kidx) {
    logEvent("Kunde gelöscht", `${standorte[sidx].name}: ${standorte[sidx].kunden[kidx].name}`);
    const neu = [...standorte];
    neu[sidx].kunden.splice(kidx, 1);
    setStandorte(neu);
  }
  function updateKunde(sidx, kidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx][feld] = val;
    setStandorte(neu);
  }

  // ---------- Ladungsträger pro Kunde ----------
  function addLadungstraeger(sidx, kidx) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.push({
      typ: LADUNGSTRAEGER_TYPEN[0].label,
      qualitaet: "",
      mengeTag: 0,
      arbeitstage: 20,
      tageClearingLadestelle: 10,
      tageClearingEntladestelle: 5,
      palettenProStellplatz: 30,
      contractQty: 10000,
    });
    setStandorte(neu);
  }
  function removeLadungstraeger(sidx, kidx, lidx) {
    logEvent("Ladungsträger entfernt", `${standorte[sidx].name}: ${standorte[sidx].kunden[kidx].name}`);
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.splice(lidx, 1);
    setStandorte(neu);
  }
  function updateLadungstraeger(sidx, kidx, lidx, feld, val) {
    const neu = [...standorte];
    let lt = neu[sidx].kunden[kidx].ladungstraeger[lidx];
    if (
      ["mengeTag", "arbeitstage", "tageClearingLadestelle", "tageClearingEntladestelle", "palettenProStellplatz", "contractQty"].includes(feld)
    ) {
      lt[feld] = Number(val);
    } else {
      lt[feld] = val;
    }
    setStandorte(neu);
  }

  // ---------- Bewegungsbuchung ----------
  const [buchung, setBuchung] = useState({
    typ: "",
    qualitaet: "",
    art: "entry",
    menge: "",
    kunden: [{ idx: null, menge: "" }],
  });
  function handleBuchungChange(feld, val) {
    setBuchung((b) => ({ ...b, [feld]: val }));
  }
  function handleBuchungKunde(idx, val) {
    setBuchung((b) => {
      let arr = b.kunden.slice();
      arr[idx].idx = val;
      return { ...b, kunden: arr };
    });
  }
  function handleBuchungKundeMenge(idx, val) {
    setBuchung((b) => {
      let arr = b.kunden.slice();
      arr[idx].menge = val;
      return { ...b, kunden: arr };
    });
  }
  function addBuchungKunde() {
    setBuchung((b) => ({ ...b, kunden: [...b.kunden, { idx: null, menge: "" }] }));
  }
  function removeBuchungKunde(idx) {
    setBuchung((b) => {
      let arr = b.kunden.slice();
      arr.splice(idx, 1);
      return { ...b, kunden: arr };
    });
  }
  function buchen(sidx) {
    let total = 0;
    let names = [];
    buchung.kunden.forEach((k) => {
      if (k.idx == null || !standorte[sidx].kunden[k.idx]) return;
      let name = standorte[sidx].kunden[k.idx].name;
      let menge = Number(k.menge);
      total += menge;
      names.push(`${name}: ${menge}`);
    });
    if (!total) {
      alert(t("mustAssignCustomer"));
      return;
    }
    // Ladungsträger in Grundbestand suchen
    const gbs = standorte[sidx].grundbestaende;
    let idx = gbs.findIndex(
      (gb) =>
        gb.typ === buchung.typ &&
        (gb.qualitaet || "-") === (buchung.qualitaet || "-")
    );
    if (idx === -1) {
      alert(t("missingInventory"));
      return;
    }
    const neu = [...standorte];
    let gb = neu[sidx].grundbestaende[idx];
    if (buchung.art === "entry") {
      gb.qty += total;
      gb.actual += total;
      logEvent(
        "Eingang gebucht",
        `+${total} ${buchung.typ} ${buchung.qualitaet || ""} auf ${names.join(", ")}`
      );
    } else {
      if (gb.qty < total) {
        alert("Nicht genügend Bestand!");
        return;
      }
      gb.qty -= total;
      gb.actual -= total;
      logEvent(
        "Ausgang gebucht",
        `-${total} ${buchung.typ} ${buchung.qualitaet || ""} von ${names.join(", ")}`
      );
    }
    setStandorte(neu);
    setBuchung({
      typ: "",
      qualitaet: "",
      art: "entry",
      menge: "",
      kunden: [{ idx: null, menge: "" }],
    });
  }
  // ---------- UI-Berechnung ----------
  function calculateStandort(standort) {
    let stellplaetze = 0;
    let lagerflaeche = 0;
    let lagerkosten = 0;
    let umschlagMonat = 0;
    standort.kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        const palettenMonat = lt.mengeTag * lt.arbeitstage;
        umschlagMonat += palettenMonat;
        const slots = Math.ceil(palettenMonat / lt.palettenProStellplatz);
        stellplaetze += slots;
      })
    );
    lagerflaeche = +(stellplaetze * standort.areaPerSlot).toFixed(2);
    lagerkosten = +(stellplaetze * standort.costPerSlot).toFixed(2);
    return { stellplaetze, lagerflaeche, lagerkosten, umschlagMonat };
  }
  function calculateGesamt(standorte) {
    let lagerflaeche = 0;
    let lagerkosten = 0;
    let stellplaetze = 0;
    standorte.forEach((s) => {
      const r = calculateStandort(s);
      lagerflaeche += r.lagerflaeche;
      lagerkosten += r.lagerkosten;
      stellplaetze += r.stellplaetze;
    });
    return { lagerflaeche, lagerkosten, stellplaetze };
  }

  // ---------- Chart-Komponente ----------
  function BarChart({ labels, values, color, suffix = "", max = 100 }) {
    const h = 140;
    const _max = Math.max(max, ...values, 1);
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "end", marginTop: 17 }}>
        {labels.map((lbl, i) => (
          <div key={lbl} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                background: color,
                height: (values[i] / _max) * h,
                borderRadius: 7,
                marginBottom: 7,
                transition: "height 0.3s",
              }}
              title={values[i] + suffix}
            />
            <div style={{ fontWeight: 700, fontSize: 16, color: "#083d95" }}>{lbl}</div>
            <div style={{ fontWeight: 500, color: "#3194cb", fontSize: 14 }}>
              {values[i] || 0}
              {suffix}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // =============== RENDER ===============
  // Login/Register
  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4fbfd"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 6px 36px #0094cb33",
          padding: "46px 38px",
          width: 420,
          textAlign: "center"
        }}>
          <img src="/LOGO_LCX_NEXUS.png" alt="LCX NEXUS" style={{ width: 220, marginBottom: 32, marginTop: -20, display: "block", marginLeft: "auto", marginRight: "auto" }} />
          <h2 style={{ color: "#083d95", fontWeight: 800, fontSize: 27, marginBottom: 7 }}>
            {loginMode === "register" ? t("register") : t("login")}
          </h2>
          <form
            onSubmit={e => { e.preventDefault(); handleLoginRegister(); }}
            style={{ display: "flex", flexDirection: "column", gap: 15, marginTop: 18 }}>
            {loginMode === "register" && (
              <>
                <input
                  required
                  placeholder={t("firstName")}
                  value={loginForm.firstName}
                  onChange={e => setLoginForm(f => ({ ...f, firstName: e.target.value }))}
                  style={{ padding: 8, fontSize: 16, borderRadius: 9, border: "1.2px solid #0094cb" }}
                />
                <input
                  required
                  placeholder={t("lastName")}
                  value={loginForm.lastName}
                  onChange={e => setLoginForm(f => ({ ...f, lastName: e.target.value }))}
                  style={{ padding: 8, fontSize: 16, borderRadius: 9, border: "1.2px solid #0094cb" }}
                />
              </>
            )}
            <input
              required
              type="email"
              placeholder={t("email")}
              value={loginForm.email}
              onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
              style={{ padding: 8, fontSize: 16, borderRadius: 9, border: "1.2px solid #0094cb" }}
            />
            <input
              required
              type="password"
              placeholder={t("password")}
              value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
              style={{ padding: 8, fontSize: 16, borderRadius: 9, border: "1.2px solid #0094cb" }}
            />
            {loginMode === "register" && (
              <input
                required
                type="password"
                placeholder={t("password_repeat")}
                value={loginForm.password2}
                onChange={e => setLoginForm(f => ({ ...f, password2: e.target.value }))}
                style={{ padding: 8, fontSize: 16, borderRadius: 9, border: "1.2px solid #0094cb" }}
              />
            )}
            {loginError && <div style={{ color: "#e53454", marginTop: 2 }}>{loginError}</div>}
            <button
              type="submit"
              style={{
                background: "#0094cb",
                color: "#fff",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                borderRadius: 9,
                padding: "12px 0",
                marginTop: 8,
                cursor: "pointer",
              }}>
              {loginMode === "register" ? t("register") : t("login")}
            </button>
          </form>
          <div style={{ marginTop: 20 }}>
            <span>
              {loginMode === "register"
                ? <>
                  {t("login")}?{" "}
                  <a href="#" style={{ color: "#083d95", fontWeight: 700 }} onClick={() => { setLoginMode("login"); setLoginError(""); }}>Hier</a>
                </>
                : <>
                  {t("register")}?{" "}
                  <a href="#" style={{ color: "#083d95", fontWeight: 700 }} onClick={() => { setLoginMode("register"); setLoginError(""); }}>Hier</a>
                </>
              }
            </span>
          </div>
          <div style={{ marginTop: 35, textAlign: "center", color: "#94b2cd", fontSize: 13 }}>
            {t("footer")}
          </div>
        </div>
      </div>
    );
  }
  // ——— Haupt-App-UI ———
  const g = calculateGesamt(standorte);

  return (
    <div
      style={{
        fontFamily: "Inter,sans-serif",
        background: "#f4fbfd",
        minHeight: "100vh",
        color: "#0a1b3f",
        paddingBottom: 80,
      }}
    >
      {/* LOGO zentriert, doppelte Größe */}
      <div style={{ textAlign: "center", marginTop: 30, marginBottom: 12 }}>
        <img
          src="/LOGO_LCX_NEXUS.png"
          alt="LCX NEXUS"
          style={{ height: 108, margin: "0 auto", display: "block" }}
        />
      </div>

      {/* Nutzer rechts oben */}
      <div style={{ position: "absolute", right: 42, top: 32, fontWeight: 700, color: "#083d95" }}>
        {user && (
          <>
            {t("welcome")}: {user.firstName} {user.lastName} &nbsp;
            <a href="#" style={{ color: "#e53454" }} onClick={() => { setUser(null); logEvent("Logout", ""); }}>{t("logout")}</a>
          </>
        )}
      </div>

      {/* Standort-Tabs */}
      <div style={{ margin: "0 26px 0 26px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {standorte.map((s, i) => (
            <div
              key={i}
              onClick={() => setTab(i)}
              style={{
                background: tab === i ? "#fff" : "#e5f1fa",
                color: tab === i ? "#083d95" : "#4a6079",
                fontWeight: tab === i ? 900 : 500,
                padding: "7px 20px",
                borderRadius: 13,
                border: tab === i ? "2px solid #083d95" : "1px solid #b6ccea",
                boxShadow: tab === i ? "0 2px 12px #0094cb33" : "",
                cursor: "pointer",
                fontSize: 16,
                transition: "all 0.2s",
              }}
            >
              {s.name}
            </div>
          ))}
          <button
            style={{
              background: "#0094cb",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              padding: "7px 17px",
              borderRadius: 13,
              marginLeft: 18,
              cursor: "pointer",
              fontSize: 16,
              transition: "all 0.2s",
            }}
            onClick={addStandort}
          >
            + {t("location_add")}
          </button>
          {/* Standort entfernen */}
          {standorte.length > 1 && (
            <button
              style={{
                background: "#e53454",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                padding: "7px 17px",
                borderRadius: 13,
                marginLeft: 18,
                cursor: "pointer",
                fontSize: 16,
                transition: "all 0.2s",
              }}
              onClick={() => removeStandort(tab)}
            >
              {t("location_remove")}
            </button>
          )}
        </div>
        {/* --- Standortdaten --- */}
        <div
          style={{
            background: "#fff",
            borderRadius: 15,
            padding: "30px 32px",
            boxShadow: "0 1px 14px #8ed6fb22",
            marginBottom: 34,
            marginTop: 6,
          }}
        >
          {/* Name, Standort-Eingaben */}
          <div style={{ display: "flex", gap: 30, alignItems: "center", marginBottom: 14 }}>
            <input
              value={standorte[tab].name}
              onChange={(e) => updateStandortName(tab, e.target.value)}
              style={{
                fontSize: 23,
                fontWeight: 800,
                border: "1.5px solid #0094cb",
                borderRadius: 8,
                background: "#f4fbfd",
                padding: "7px 22px",
                color: "#083d95",
                minWidth: 180,
              }}
            />
            <div style={{ flex: 1 }} />
            <label style={{ fontWeight: 700, fontSize: 16, marginRight: 10 }}>
              {t("area_per_slot")}
              <input
                type="number"
                min={0.5}
                step={0.1}
                value={standorte[tab].areaPerSlot}
                onChange={(e) => updateStandortFeld(tab, "areaPerSlot", e.target.value)}
                style={{
                  width: 65,
                  marginLeft: 11,
                  borderRadius: 6,
                  border: "1.2px solid #0094cb",
                  background: "#e5f1fa",
                  padding: "3px 8px",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#083d95",
                }}
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 16 }}>
              {t("cost_per_slot")}
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={standorte[tab].costPerSlot}
                onChange={(e) => updateStandortFeld(tab, "costPerSlot", e.target.value)}
                style={{
                  width: 60,
                  marginLeft: 11,
                  borderRadius: 6,
                  border: "1.2px solid #0094cb",
                  background: "#e5f1fa",
                  padding: "3px 8px",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#083d95",
                }}
              />
            </label>
          </div>
          {/* GRUNDBESTAND/INVENTUR je Standort */}
          <h3 style={{ margin: "30px 0 10px 0", color: "#083d95", fontWeight: 900 }}>
            {t("inventory")}
          </h3>
          <table style={{ width: "100%", background: "#f8fbff", borderRadius: 10, padding: 12 }}>
            <thead>
              <tr style={{ color: "#0094cb" }}>
                <th>{t("loadCarrier")}</th>
                <th>{t("quality")}</th>
                <th>{t("baseQty")}</th>
                <th>{t("actualQty")}</th>
                <th>{t("diff")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {standorte[tab].grundbestaende.map((gb, i) => (
                <tr key={i}>
                  <td>
                    <select
                      value={gb.typ}
                      onChange={e =>
                        updateGrundbestand(tab, e.target.value, gb.qualitaet, "typ", e.target.value)
                      }
                    >
                      {LADUNGSTRAEGER_TYPEN.map(opt => (
                        <option key={opt.label} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {LADUNGSTRAEGER_TYPEN.find(t => t.label === gb.typ).qualitaeten.length ? (
                      <select
                        value={gb.qualitaet}
                        onChange={e =>
                          updateGrundbestand(tab, gb.typ, e.target.value, "qualitaet", e.target.value)
                        }
                      >
                        <option value="">-</option>
                        {LADUNGSTRAEGER_TYPEN.find(t => t.label === gb.typ).qualitaeten.map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={gb.qty}
                      onChange={e => updateGrundbestand(tab, gb.typ, gb.qualitaet, "qty", e.target.value)}
                      style={{ width: 80 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={gb.actual}
                      onChange={e => updateGrundbestand(tab, gb.typ, gb.qualitaet, "actual", e.target.value)}
                      style={{ width: 80 }}
                    />
                    <button
                      style={{
                        background: "#0094cb",
                        color: "#fff",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 6,
                        padding: "5px 15px",
                        fontSize: 14,
                        marginLeft: 8,
                        cursor: "pointer",
                      }}
                      onClick={() => saveInventur(tab, gb.typ, gb.qualitaet)}
                    >
                      {t("inventory_save")}
                    </button>
                  </td>
                  <td style={{ color: Math.abs(gb.actual - gb.qty) > 0 ? "#e53454" : "#009942" }}>
                    {gb.actual - gb.qty}
                  </td>
                  <td>
                    <button
                      onClick={() => removeGrundbestand(tab, gb.typ, gb.qualitaet)}
                      style={{
                        background: "#e53454",
                        color: "#fff",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 7,
                        padding: "6px 16px",
                        fontSize: 15,
                        cursor: "pointer",
                      }}
                    >
                      {t("remove_inventory")}
                    </button>
                  </td>
                </tr>
              ))}
              {/* + Neue Grundbestandszeile hinzufügen */}
              <tr>
                <td>
                  <select
                    value={buchung.typ}
                    onChange={e => handleBuchungChange("typ", e.target.value)}
                  >
                    <option value="">{t("selectLoadCarrier")}</option>
                    {LADUNGSTRAEGER_TYPEN.map(opt => (
                      <option key={opt.label} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {LADUNGSTRAEGER_TYPEN.find(t => t.label === buchung.typ)?.qualitaeten.length ? (
                    <select
                      value={buchung.qualitaet}
                      onChange={e => handleBuchungChange("qualitaet", e.target.value)}
                    >
                      <option value="">-</option>
                      {LADUNGSTRAEGER_TYPEN.find(t => t.label === buchung.typ).qualitaeten.map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td colSpan={4}>
                  <button
                    onClick={() => updateGrundbestand(tab, buchung.typ, buchung.qualitaet, "qty", 0)}
                    style={{
                      background: "#0094cb",
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: 7,
                      padding: "6px 16px",
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    + {t("add_inventory")}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bewegungsbuchung */}
          <h3 style={{ margin: "30px 0 10px 0", color: "#083d95", fontWeight: 900 }}>
            {t("movements")}
          </h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <select value={buchung.art} onChange={e => handleBuchungChange("art", e.target.value)}>
              <option value="entry">{t("entry")}</option>
              <option value="exit">{t("exit")}</option>
            </select>
            <select
              value={buchung.typ}
              onChange={e => handleBuchungChange("typ", e.target.value)}
              style={{ minWidth: 140 }}
            >
              <option value="">{t("selectLoadCarrier")}</option>
              {LADUNGSTRAEGER_TYPEN.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
            {LADUNGSTRAEGER_TYPEN.find(t => t.label === buchung.typ)?.qualitaeten.length ? (
              <select
                value={buchung.qualitaet}
                onChange={e => handleBuchungChange("qualitaet", e.target.value)}
              >
                <option value="">-</option>
                {LADUNGSTRAEGER_TYPEN.find(t => t.label === buchung.typ).qualitaeten.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            ) : (
              <span>-</span>
            )}
            {/* Kunden-Auswahl, mehrere */}
            {buchung.kunden.map((k, i) => (
              <span key={i} style={{ display: "flex", gap: 2, alignItems: "center" }}>
                <select
                  value={k.idx ?? ""}
                  onChange={e => handleBuchungKunde(i, Number(e.target.value))}
                >
                  <option value="">{t("selectCustomer")}</option>
                  {standorte[tab].kunden.map((ku, idx) => (
                    <option key={idx} value={idx}>{ku.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={k.menge || ""}
                  onChange={e => handleBuchungKundeMenge(i, e.target.value)}
                  style={{ width: 70 }}
                  placeholder={t("qty")}
                />
                {buchung.kunden.length > 1 && (
                  <button
                    onClick={() => removeBuchungKunde(i)}
                    style={{ color: "#e53454", background: "none", border: "none", fontSize: 19, cursor: "pointer" }}
                  >×</button>
                )}
              </span>
            ))}
            <button
              onClick={addBuchungKunde}
              style={{
                background: "#0094cb",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 7,
                padding: "5px 13px",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              + {t("customer")}
            </button>
            <button
              onClick={() => buchen(tab)}
              style={{
                background: "#083d95",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 7,
                padding: "7px 16px",
                fontSize: 16,
                marginLeft: 18,
                cursor: "pointer",
              }}
            >
              {t("book")}
            </button>
          </div>
        </div>
      </div>

      {/* --- Gesamtübersicht (Summe & Charts) --- */}
      <div
        style={{
          margin: "34px 26px 0 26px",
          background: "#fff",
          borderRadius: 17,
          boxShadow: "0 2px 14px #0094cb22",
          padding: "28px 30px 35px 30px",
        }}
      >
        <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 27, marginBottom: 11 }}>
          {t("overview")}
        </h2>
        <div style={{ fontSize: 17, marginBottom: 7, marginTop: 7 }}>
          {t("storageArea")}: <b>{g.lagerflaeche} m²</b> | {t("slots")}: <b>{g.stellplaetze}</b> | {t("cost")}: <b>{g.lagerkosten.toLocaleString(lang === "de" ? "de-DE" : "en-US", { minimumFractionDigits: 2 })} €</b>
        </div>
        <div style={{ display: "flex", gap: 52, marginTop: 22 }}>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0a1b3f", fontSize: 16 }}>{t("chartTurnover")}</b>
            <BarChart
              labels={standorte.map((s) => s.name)}
              values={standorte.map((s) => calculateStandort(s).umschlagMonat)}
              color="#0094cb"
              suffix=" Pal."
              max={Math.max(100, ...standorte.map((s) => calculateStandort(s).umschlagMonat))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0a1b3f", fontSize: 16 }}>{t("chartCost")}</b>
            <BarChart
              labels={standorte.map((s) => s.name)}
              values={standorte.map((s) => calculateStandort(s).lagerkosten)}
              color="#083d95"
              suffix=" €"
              max={Math.max(100, ...standorte.map((s) => calculateStandort(s).lagerkosten))}
            />
          </div>
        </div>
      </div>

      {/* --- Protokoll-Link --- */}
      <div style={{ position: "fixed", right: 18, bottom: 20, zIndex: 999 }}>
        <button
          style={{
            background: "#083d95",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 10,
            padding: "8px 19px",
            fontSize: 15,
            cursor: "pointer",
            opacity: 0.77,
          }}
          onClick={() => setShowProtocoll(true)}
        >
          {t("showLog")}
        </button>
      </div>

      {/* --- Footer --- */}
      <div
        style={{
          width: "100%",
          background: "#0094cb",
          color: "#fff",
          fontWeight: 700,
          textAlign: "center",
          padding: "17px 0 17px 0",
          letterSpacing: 0.4,
          fontSize: 17,
          marginTop: 44,
          position: "relative",
          bottom: 0,
          left: 0,
        }}
      >
        {t("footer")}
      </div>

      {/* --- Protokoll-Modal --- */}
      {showProtocoll && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "#0008",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            minWidth: 380,
            maxWidth: 520,
            maxHeight: "90vh",
            overflow: "auto",
            padding: 28,
            boxShadow: "0 2px 28px #0094cb44",
          }}>
            <h2 style={{ color: "#083d95", fontWeight: 900, marginTop: 0 }}>{t("protocol")}</h2>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>{t("protocol_hint")}</div>
            <ol>
              {protocol.length === 0 ? (
                <div style={{ color: "#bbb", margin: 12 }}>{t("noData")}</div>
              ) : (
                protocol.map((p, idx) => (
                  <li key={idx} style={{ fontSize: 15, marginBottom: 7 }}>
                    <b>[{p.ts}] {p.user}:</b> {p.action} <br /><span style={{ color: "#0094cb" }}>{p.details}</span>
                  </li>
                ))
              )}
            </ol>
            <button
              style={{
                background: "#083d95",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 9,
                padding: "9px 26px",
                fontSize: 16,
                marginTop: 19,
                cursor: "pointer",
              }}
              onClick={() => setShowProtocoll(false)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
