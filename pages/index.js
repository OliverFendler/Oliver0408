import React, { useState, useEffect } from "react";

/* ====== KONSTANTEN UND HILFSFUNKTIONEN ====== */
// Helper: Werktage zwischen 2 Daten berechnen
function getWerktage(start, ende) {
  let count = 0;
  let cur = new Date(start);
  const end = new Date(ende);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}
// Alphabetisch sortieren
const alphaSort = (arr) => arr.slice().sort((a, b) => (a.name > b.name ? 1 : -1));

/* ====== LADUNGSTRÄGER-TYPEN ====== */
const ladungstraegerTypen = [
  { label: "EPAL 1 Europalette", qualitaeten: ["A", "B", "C"] },
  { label: "EPAL 6 Halbpalette", qualitaeten: [] },
  { label: "EPAL 7 Halbpalette", qualitaeten: [] },
  { label: "EPAL Gitterbox", qualitaeten: [] },
  { label: "EPAL Europalette QR", qualitaeten: ["A", "B", "C"] },
];

/* ====== ÜBERSETZUNGEN (DE/EN) ====== */
const t = {
  de: {
    standort: "Standort",
    lagerflaecheProStellplatz: "Lagerfläche pro Stellplatz (m²)",
    lagerkostenProStellplatz: "Lagerkosten pro Stellplatz (€)",
    kunden: "Kunden",
    kundeHinzufuegen: "Kunde hinzufügen",
    name: "Name",
    ladungstraegertyp: "Ladungsträgertyp",
    qualitaet: "Qualität",
    vertragsmenge: "Vertragsmenge (Monat)",
    istmenge: "Umschlag gesamt (Monat)",
    clearingTageL: "Clearing Ladestelle (Werktage)",
    clearingTageE: "Clearing Entladestelle (Werktage)",
    clearingStart: "Startdatum",
    clearingCountdown: "Tage bis Clearing",
    clearingStartBtn: "Countdown starten",
    hinweis: "Hinweis",
    entfernen: "Entfernen",
    gesamtuebersicht: "Gesamtübersicht",
    lagerflaeche: "Lagerfläche (m²)",
    stellplaetze: "Benötigte Stellplätze",
    lagerkosten: "Monatliche Lagerkosten (€)",
    chartsUmschlag: "Umschlag je Standort (Monat)",
    chartsKosten: "Lagerkosten je Standort (€)",
    neuerStandort: "Standort hinzufügen",
    grundbestand: "Grundbestand",
    inventur: "Inventur",
    abweichung: "Abweichung",
    warnungLadungstraegerImGrundbestand: "Für diesen Ladungsträger/Qualität existiert kein Grundbestand am Standort. Bitte zuerst Grundbestand anlegen.",
    bewegungBuchen: "Bewegung buchen",
    bewegungEingang: "Eingang",
    bewegungAusgang: "Ausgang",
    bewegungKunde: "Kunde",
    bewegungTyp: "Ladungsträgertyp",
    bewegungQualitaet: "Qualität",
    bewegungMenge: "Menge",
    bewegungBuchenBtn: "Buchen",
    bewegungMehrKunde: "Weiteren Kunden hinzufügen",
    bewegungErfasst: "Bewegung erfolgreich gebucht!",
    bewegungNichtGenugBestand: "Nicht genügend Bestand für Ausgang!",
    bewegungKundePflicht: "Mindestens ein Kunde muss ausgewählt werden.",
    bewegungTypPflicht: "Typ und Qualität müssen gewählt sein.",
    bewegungMengePflicht: "Menge muss > 0 sein.",
    ampelInfoGruen: "Vertragsmenge im grünen Bereich.",
    ampelInfoGelb: "Achtung: Vertragsmenge bald überschritten.",
    ampelInfoRot: "Warnung: Vertragsmenge überschritten!",
    keinKunde: "Noch kein Kunde angelegt.",
    keinLadungstraeger: "Noch kein Ladungsträger angelegt.",
    keineBewegung: "Keine Bewegungen vorhanden.",
    protokollAnzeigen: "Protokoll anzeigen",
    abmelden: "Abmelden",
    login: "Login",
    pinEingeben: "Bitte PIN eingeben",
    anmelden: "Anmelden",
    falsch: "Falsche PIN",
    userLabel: "Angemeldet als:",
    grundbestandHinzufuegen: "Grundbestand hinzufügen",
    summe: "Summe",
    entfernenStandort: "Standort entfernen",
    footer: "LCX NEXUS © 2025  –  Lager- & Bestandsplanungstool",
    protokollLogin: "Login",
    protokollLogout: "Logout",
    protokollStandortHinzu: "Standort hinzugefügt",
    protokollStandortEntf: "Standort entfernt",
    protokollGrundbestand: "Grundbestand geändert",
    protokollInventur: "Inventur gespeichert",
    protokollKundeHinzu: "Kunde hinzugefügt",
    protokollKundeEntf: "Kunde entfernt",
    protokollLadungsträgerHinzu: "Ladungsträger hinzugefügt",
    protokollLadungsträgerEntf: "Ladungsträger entfernt",
    protokollBewegung: "Bewegung gebucht",
    keineAenderungen: "Noch keine Änderungen erfasst.",
    schliessen: "Schließen",
    clearingHinweis: "Clearing spätestens am",
    heute: "heute",
    tage: "Tage",
    clearingCountdownAktiv: "Clearing-Countdown läuft:",
    clearingFaellig: "Clearing fällig!",
  },
  en: {
    standort: "Location",
    lagerflaecheProStellplatz: "Storage area per slot (m²)",
    lagerkostenProStellplatz: "Storage cost per slot (€)",
    kunden: "Customers",
    kundeHinzufuegen: "Add customer",
    name: "Name",
    ladungstraegertyp: "Load carrier type",
    qualitaet: "Quality",
    vertragsmenge: "Contract volume (month)",
    istmenge: "Total turnover (month)",
    clearingTageL: "Clearing loading site (workdays)",
    clearingTageE: "Clearing unloading site (workdays)",
    clearingStart: "Start date",
    clearingCountdown: "Days until clearing",
    clearingStartBtn: "Start countdown",
    hinweis: "Note",
    entfernen: "Remove",
    gesamtuebersicht: "Total overview",
    lagerflaeche: "Storage area (m²)",
    stellplaetze: "Required slots",
    lagerkosten: "Monthly storage cost (€)",
    chartsUmschlag: "Turnover per location (month)",
    chartsKosten: "Storage cost per location (€)",
    neuerStandort: "Add location",
    grundbestand: "Initial stock",
    inventur: "Inventory",
    abweichung: "Deviation",
    warnungLadungstraegerImGrundbestand: "No initial stock for this carrier/quality at this location. Please add initial stock first.",
    bewegungBuchen: "Book movement",
    bewegungEingang: "Inbound",
    bewegungAusgang: "Outbound",
    bewegungKunde: "Customer",
    bewegungTyp: "Load carrier type",
    bewegungQualitaet: "Quality",
    bewegungMenge: "Quantity",
    bewegungBuchenBtn: "Book",
    bewegungMehrKunde: "Add another customer",
    bewegungErfasst: "Movement booked successfully!",
    bewegungNichtGenugBestand: "Not enough stock for outbound!",
    bewegungKundePflicht: "At least one customer must be selected.",
    bewegungTypPflicht: "Type and quality must be selected.",
    bewegungMengePflicht: "Quantity must be > 0.",
    ampelInfoGruen: "Contract volume OK.",
    ampelInfoGelb: "Attention: Contract volume nearly reached.",
    ampelInfoRot: "Warning: Contract volume exceeded!",
    keinKunde: "No customer added yet.",
    keinLadungstraeger: "No load carrier added yet.",
    keineBewegung: "No movements recorded.",
    protokollAnzeigen: "Show audit log",
    abmelden: "Logout",
    login: "Login",
    pinEingeben: "Please enter PIN",
    anmelden: "Sign in",
    falsch: "Wrong PIN",
    userLabel: "Logged in as:",
    grundbestandHinzufuegen: "Add initial stock",
    summe: "Sum",
    entfernenStandort: "Remove location",
    footer: "LCX NEXUS © 2025  –  Warehouse & Inventory Planning Tool",
    protokollLogin: "Login",
    protokollLogout: "Logout",
    protokollStandortHinzu: "Location added",
    protokollStandortEntf: "Location removed",
    protokollGrundbestand: "Initial stock changed",
    protokollInventur: "Inventory saved",
    protokollKundeHinzu: "Customer added",
    protokollKundeEntf: "Customer removed",
    protokollLadungsträgerHinzu: "Load carrier added",
    protokollLadungsträgerEntf: "Load carrier removed",
    protokollBewegung: "Movement booked",
    keineAenderungen: "No changes yet.",
    schliessen: "Close",
    clearingHinweis: "Clearing due by",
    heute: "today",
    tage: "days",
    clearingCountdownAktiv: "Clearing countdown active:",
    clearingFaellig: "Clearing due!",
  },
};

/* ====== INITIAL-STANDORTE ====== */
const initialStandorte = [
  {
    name: "Mettmann",
    lagerflaecheProStellplatz: 1.8,
    lagerkostenProStellplatz: 7,
    grundbestaende: [],
    kunden: [],
    bewegungen: [],
  },
];

/* ====== PIN-USER-KONFIG ====== */
const pinMap = {
  "1111": "Oliver",
  "2222": "Thomas",
  "3333": "Martin",
  "4444": "Sebastian",
};

/* ===== HAUPTKOMPONENTE ===== */
export default function Home() {
  // === State
  const [lang, setLang] = useState("de");
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState("");
  const [protokoll, setProtokoll] = useState([]);
  const [showProtokoll, setShowProtokoll] = useState(false);
  const [standorte, setStandorte] = useState(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lager_standorte_v3");
      if (s) return JSON.parse(s);
    }
    return initialStandorte;
  });
  const [tab, setTab] = useState(0);
  const [showBewegung, setShowBewegung] = useState(false);
  const [bewegungKunden, setBewegungKunden] = useState([
    { kunde: "", typ: "", qualitaet: "", menge: "" },
  ]);
  const [bewegungArt, setBewegungArt] = useState("Eingang");
  const [bewegungMsg, setBewegungMsg] = useState("");

  // Pro Ladungsträger/Clearing Countdown
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000 * 60 * 15); // Alle 15 Min aktualisieren
    return () => clearInterval(i);
  }, []);

  // ==== Protokoll laden/speichern
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("lager_protokoll_v3");
      if (p) setProtokoll(JSON.parse(p));
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lager_standorte_v3", JSON.stringify(standorte));
    }
  }, [standorte]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lager_protokoll_v3", JSON.stringify(protokoll));
    }
  }, [protokoll]);

  // ==== Protokoll-Eintrag NUR für wichtige Aktionen
  function addProtokoll(aktion, details) {
    setProtokoll((prev) => [
      ...prev,
      {
        zeit: new Date().toLocaleString(),
        user,
        aktion,
        details,
      },
    ]);
  }

  // ==== Login-Flow
  function handleLogin() {
    if (pinMap[pin]) {
      setUser(pinMap[pin]);
      setPin("");
      addProtokoll(t[lang].protokollLogin, pinMap[pin]);
    } else {
      alert(t[lang].falsch);
    }
  }
  function handleLogout() {
    addProtokoll(t[lang].protokollLogout, user);
    setUser(null);
  }

  // ==== Standortfunktionen
  function updateStandortName(idx, val) {
    const neu = [...standorte];
    neu[idx].name = val;
    setStandorte(neu);
  }
  function updateStandortFeld(idx, feld, val) {
    const neu = [...standorte];
    neu[idx][feld] = Number(val);
    setStandorte(neu);
  }
  function addStandort() {
    setStandorte([
      ...standorte,
      {
        name: t[lang].standort + " " + (standorte.length + 1),
        lagerflaecheProStellplatz: 1.8,
        lagerkostenProStellplatz: 7,
        grundbestaende: [],
        kunden: [],
        bewegungen: [],
      },
    ]);
    setTab(standorte.length);
    addProtokoll(t[lang].protokollStandortHinzu, t[lang].standort + " " + (standorte.length + 1));
  }
  function removeStandort(idx) {
    const removed = standorte[idx].name;
    const neu = [...standorte];
    neu.splice(idx, 1);
    setStandorte(neu);
    setTab(0);
    addProtokoll(t[lang].protokollStandortEntf, removed);
  }

  // ==== Kundenfunktionen
  function addKunde(idx) {
    const neu = [...standorte];
    neu[idx].kunden.push({
      name: t[lang].name + " " + (neu[idx].kunden.length + 1),
      ladungstraeger: [],
      notizen: "",
    });
    setStandorte(neu);
    addProtokoll(t[lang].protokollKundeHinzu, `${standorte[idx].name}`);
  }
  function removeKunde(sidx, kidx) {
    const removed = standorte[sidx].kunden[kidx].name;
    const neu = [...standorte];
    neu[sidx].kunden.splice(kidx, 1);
    setStandorte(neu);
    addProtokoll(t[lang].protokollKundeEntf, `${removed} @${standorte[sidx].name}`);
  }
  function updateKunde(sidx, kidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx][feld] = val;
    setStandorte(neu);
  }

  // ==== Grundbestand / Inventur
  function addGrundbestand(sidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.push({
      typ: ladungstraegerTypen[0].label,
      qualitaet: "",
      bestand: 0,
      inventur: 0,
    });
    setStandorte(neu);
    addProtokoll(t[lang].protokollGrundbestand, `Standort: ${standorte[sidx].name}`);
  }
  function removeGrundbestand(sidx, gidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.splice(gidx, 1);
    setStandorte(neu);
    addProtokoll(t[lang].protokollGrundbestand, `Standort: ${standorte[sidx].name}`);
  }
  function updateGrundbestand(sidx, gidx, feld, val) {
    const neu = [...standorte];
    if (feld === "bestand" || feld === "inventur") {
      neu[sidx].grundbestaende[gidx][feld] = Number(val);
    } else {
      neu[sidx].grundbestaende[gidx][feld] = val;
    }
    setStandorte(neu);
    addProtokoll(t[lang].protokollGrundbestand, `Standort: ${standorte[sidx].name}`);
  }

  // ==== Ladungsträgerfunktionen (strikte Grundbestand-Validierung)
  function addLadungstraeger(sidx, kidx) {
    const grundbestaende = standorte[sidx].grundbestaende;
    if (!grundbestaende.length) {
      alert(t[lang].warnungLadungstraegerImGrundbestand);
      return;
    }
    // Standard: Erster vorhandener Grundbestand
    const gb = grundbestaende[0];
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.push({
      typ: gb.typ,
      qualitaet: gb.qualitaet,
      vertragsmenge: "",
      startdatumL: "",
      startdatumE: "",
      clearingTageL: "",
      clearingTageE: "",
      hinweisL: "",
      hinweisE: "",
    });
    setStandorte(neu);
    addProtokoll(t[lang].protokollLadungsträgerHinzu, `Kunde: ${standorte[sidx].kunden[kidx].name}`);
  }
  function removeLadungstraeger(sidx, kidx, lidx) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.splice(lidx, 1);
    setStandorte(neu);
    addProtokoll(t[lang].protokollLadungsträgerEntf, `Kunde: ${standorte[sidx].kunden[kidx].name}`);
  }
  function updateLadungstraeger(sidx, kidx, lidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger[lidx][feld] = val;
    setStandorte(neu);
  }

  // ==== Vertragsmenge-Monitoring (Ampel-Logik & IST-Menge)
  function getKundenEinAusgang(sidx, kName, typ, qualitaet) {
    // Alle Bewegungen dieses Standorts und Kunden, Typ, Qualität aufsummieren (nur aktueller Monat)
    const standort = standorte[sidx];
    let eingang = 0, ausgang = 0;
    const nowD = new Date();
    const monat = nowD.getMonth();
    const jahr = nowD.getFullYear();
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        const md = new Date(m.zeit);
        if (md.getMonth() !== monat || md.getFullYear() !== jahr) return;
        m.details.forEach((b) => {
          if (b.kunde === kName && b.typ === typ && (b.qualitaet || "") === (qualitaet || "")) {
            if (m.art === "Eingang") eingang += Number(b.menge) || 0;
            if (m.art === "Ausgang") ausgang += Number(b.menge) || 0;
          }
        });
      });
    }
    return { eingang, ausgang, istmenge: eingang + ausgang };
  }
  function getVertragsAmpel(vertragsmenge, istmenge) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", info: "" };
    const pct = istmenge / vertragsmenge;
    if (pct < 0.8) return { color: "green", info: t[lang].ampelInfoGruen };
    if (pct < 1.0) return { color: "orange", info: t[lang].ampelInfoGelb };
    return { color: "red", info: t[lang].ampelInfoRot };
  }

  // ==== Bewegungsbuchung (Eingang/Ausgang)
  function handleOpenBewegung() {
    setBewegungKunden([{ kunde: "", typ: "", qualitaet: "", menge: "" }]);
    setBewegungArt("Eingang");
    setShowBewegung(true);
    setBewegungMsg("");
  }
  function handleChangeBewegungKunde(idx, feld, val) {
    const arr = [...bewegungKunden];
    arr[idx][feld] = val;
    if (feld === "typ") arr[idx].qualitaet = "";
    setBewegungKunden(arr);
  }
  function handleAddBewegungKunde() {
    setBewegungKunden([...bewegungKunden, { kunde: "", typ: "", qualitaet: "", menge: "" }]);
  }
  function handleRemoveBewegungKunde(idx) {
    const arr = [...bewegungKunden];
    arr.splice(idx, 1);
    setBewegungKunden(arr);
  }
  function handleBuchenBewegung() {
    let valid = true;
    if (!bewegungKunden.length || bewegungKunden.some((b) => !b.kunde)) {
      setBewegungMsg(t[lang].bewegungKundePflicht);
      valid = false;
    } else if (bewegungKunden.some((b) => !b.typ)) {
      setBewegungMsg(t[lang].bewegungTypPflicht);
      valid = false;
    } else if (bewegungKunden.some((b) => !b.menge || Number(b.menge) <= 0)) {
      setBewegungMsg(t[lang].bewegungMengePflicht);
      valid = false;
    }
    if (!valid) return;

    // Bestand prüfen für jede Buchung (bei Ausgang)
    const grundbestaende = standorte[tab].grundbestaende;
    if (bewegungArt === "Ausgang") {
      for (const b of bewegungKunden) {
        const gb = grundbestaende.find(
          (g) => g.typ === b.typ && (g.qualitaet || "") === (b.qualitaet || "")
        );
        if (!gb || gb.bestand < Number(b.menge)) {
          setBewegungMsg(t[lang].bewegungNichtGenugBestand);
          return;
        }
      }
    }
    // Buchen (Bestand anpassen)
    const neu = [...standorte];
    bewegungKunden.forEach((b) => {
      const gb = neu[tab].grundbestaende.find(
        (g) => g.typ === b.typ && (g.qualitaet || "") === (b.qualitaet || "")
      );
      if (!gb) return;
      if (bewegungArt === "Eingang") {
        gb.bestand += Number(b.menge);
        gb.inventur += Number(b.menge);
      } else {
        gb.bestand -= Number(b.menge);
        gb.inventur -= Number(b.menge);
      }
    });
    // Bewegungsdatensatz erfassen (mit Zeit, Art, Details, User)
    if (!neu[tab].bewegungen) neu[tab].bewegungen = [];
    neu[tab].bewegungen.push({
      zeit: new Date().toLocaleString(),
      art: bewegungArt,
      details: [...bewegungKunden],
      user,
    });
    setStandorte(neu);
    addProtokoll(
      t[lang].protokollBewegung,
      `${bewegungArt}: ${bewegungKunden
        .map(
          (b) =>
            `Kunde: ${b.kunde}, Typ: ${b.typ}, Quali: ${b.qualitaet}, Menge: ${b.menge}`
        )
        .join(" | ")}`
    );
    setBewegungMsg(t[lang].bewegungErfasst);
    setTimeout(() => {
      setShowBewegung(false);
      setBewegungMsg("");
    }, 1100);
  }

  // ==== Clearing-Countdown: Werktage berechnen
  function getClearingResttage(startdatum, tage) {
    if (!startdatum || !tage) return null;
    const start = new Date(startdatum);
    let t = 0;
    let cur = new Date(start);
    while (t < tage) {
      cur.setDate(cur.getDate() + 1);
      if (cur.getDay() !== 0 && cur.getDay() !== 6) t++;
    }
    const diff = Math.ceil((cur - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  // === Login-Modal
  if (!user)
    return (
      <div style={{
        minHeight: "100vh", background: "#f4fbfd", display: "flex",
        justifyContent: "center", alignItems: "center", fontFamily: "Inter,sans-serif"
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, boxShadow: "0 4px 22px #0094cb44",
          padding: "36px 45px", textAlign: "center"
        }}>
          <img src="/LOGO_LCX_NEXUS.png" alt="LCX NEXUS" style={{ height: 96, marginBottom: 16 }} />
          <h2 style={{ color: "#0094cb", fontWeight: 900, marginBottom: 10 }}>
            {t[lang].login}
          </h2>
          <div style={{ fontWeight: 600, color: "#083d95", marginBottom: 16 }}>
            {t[lang].pinEingeben}
          </div>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{
              fontSize: 19, border: "1.5px solid #0094cb", borderRadius: 10,
              padding: "8px 28px", marginBottom: 20, width: 180, textAlign: "center"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <br />
          <button
            onClick={handleLogin}
            style={{
              background: "#0094cb", color: "#fff", fontWeight: 800,
              border: "none", borderRadius: 10, padding: "10px 42px", fontSize: 18, cursor: "pointer"
            }}>
            {t[lang].anmelden}
          </button>
        </div>
      </div>
    );

  /* ==== UI ==== */

  const g = { lagerflaeche: 0, lagerkosten: 0, stellplaetze: 0 };
  standorte.forEach((s) => {
    // Stellplätze und Kosten werden nicht mehr benötigt, Felder aber gelassen für spätere Erweiterung
    g.lagerflaeche += s.lagerflaecheProStellplatz || 0;
    g.lagerkosten += s.lagerkostenProStellplatz || 0;
    g.stellplaetze += 1;
  });

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
      {/* Header - Logo */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px 0 20px 0",
          position: "relative",
          marginBottom: 6,
        }}
      >
        <img
          src="/LOGO_LCX_NEXUS.png"
          alt="LCX NEXUS"
          style={{
            height: 140,
            display: "block",
            margin: "0 auto 8px auto",
          }}
        />
        {/* Bedien-Buttons rechts oben */}
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 54,
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            style={{
              background: "#fff",
              border: "1px solid #083d95",
              color: "#083d95",
              padding: "6px 16px",
              fontWeight: 700,
              borderRadius: 12,
              marginRight: 8,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            {lang === "de" ? "EN" : "DE"}
          </button>
          <span
            style={{
              fontWeight: 800,
              color: "#0094cb",
              fontSize: 17,
              marginRight: 12,
            }}
          >
            {user ? `${t[lang].userLabel} ${user}` : ""}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "#e53454",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              borderRadius: 8,
              padding: "6px 17px",
              fontSize: 15,
              marginLeft: 8,
              cursor: "pointer",
            }}
          >
            {t[lang].abmelden}
          </button>
        </div>
      </div>

      {/* Standorte-Tabs */}
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
            + {t[lang].neuerStandort}
          </button>
          {standorte.length > 1 && (
            <button
              style={{
                background: "#e53454",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                padding: "7px 15px",
                borderRadius: 13,
                marginLeft: 8,
                cursor: "pointer",
                fontSize: 16,
              }}
              onClick={() => removeStandort(tab)}
            >
              {t[lang].entfernenStandort}
            </button>
          )}
        </div>

        {/* --------- Grundbestand --------- */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 15,
            padding: "18px 22px",
            margin: "18px 0 16px 0",
            boxShadow: "0 1px 8px #b9e6fa22",
          }}
        >
          <div
            style={{
              fontWeight: 900,
              color: "#083d95",
              fontSize: 18,
              marginBottom: 7,
            }}
          >
            {t[lang].grundbestand}
          </div>
          <button
            style={{
              background: "#0094cb",
              color: "#fff",
              fontWeight: 800,
              border: "none",
              borderRadius: 7,
              padding: "6px 15px",
              fontSize: 15,
              marginBottom: 7,
              cursor: "pointer",
            }}
            onClick={() => addGrundbestand(tab)}
          >
            + {t[lang].grundbestandHinzufuegen}
          </button>
          <div>
            {standorte[tab].grundbestaende.length === 0 && (
              <div style={{ color: "#aaa", margin: "13px 0 16px 0" }}>
                {lang === "de"
                  ? "Noch kein Grundbestand erfasst."
                  : "No initial stock recorded yet."}
              </div>
            )}
            {standorte[tab].grundbestaende.map((gb, gidx) => (
              <div
                key={gidx}
                style={{
                  display: "flex",
                  gap: 11,
                  alignItems: "center",
                  marginBottom: 9,
                  background: "#f3faff",
                  border: `2.1px solid #b3e6fa`,
                  borderRadius: 10,
                  padding: "7px 9px",
                }}
              >
                {/* Typ */}
                <select
                  value={gb.typ}
                  onChange={(e) =>
                    updateGrundbestand(tab, gidx, "typ", e.target.value)
                  }
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    border: "1.2px solid #0094cb",
                    borderRadius: 6,
                    padding: "4px 13px",
                    color: "#083d95",
                    background: "#fff",
                  }}
                >
                  {ladungstraegerTypen.map((opt) => (
                    <option key={opt.label} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Qualität, falls nötig */}
                {ladungstraegerTypen.find((t) => t.label === gb.typ)
                  ?.qualitaeten.length ? (
                  <select
                    value={gb.qualitaet}
                    onChange={(e) =>
                      updateGrundbestand(tab, gidx, "qualitaet", e.target.value)
                    }
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      border: "1.2px solid #0094cb",
                      borderRadius: 6,
                      padding: "4px 13px",
                      color: "#083d95",
                      background: "#fff",
                      minWidth: 65,
                    }}
                  >
                    <option value="">
                      {lang === "de" ? "Qualität…" : "Quality…"}
                    </option>
                    {ladungstraegerTypen
                      .find((t) => t.label === gb.typ)
                      .qualitaeten.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                  </select>
                ) : null}
                {/* Grundbestand */}
                <label>
                  {t[lang].grundbestand}
                  <input
                    type="number"
                    value={gb.bestand}
                    onChange={(e) =>
                      updateGrundbestand(tab, gidx, "bestand", e.target.value)
                    }
                    style={{
                      width: 80,
                      marginLeft: 9,
                      borderRadius: 5,
                      border: "1.2px solid #0094cb",
                      background: "#fff",
                      padding: "2px 7px",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#083d95",
                    }}
                  />
                </label>
                {/* Inventur-Bestand */}
                <label>
                  {t[lang].inventur}
                  <input
                    type="number"
                    value={gb.inventur}
                    onChange={(e) =>
                      updateGrundbestand(tab, gidx, "inventur", e.target.value)
                    }
                    style={{
                      width: 80,
                      marginLeft: 9,
                      borderRadius: 5,
                      border: "1.2px solid #0094cb",
                      background: "#fff",
                      padding: "2px 7px",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#083d95",
                    }}
                  />
                </label>
                {/* Abweichung */}
                <div
                  style={{
                    fontWeight: 800,
                    color:
                      gb.inventur - gb.bestand < 0 ? "#e53454" : "#093",
                    marginLeft: 12,
                  }}
                >
                  {t[lang].abweichung}: {(gb.inventur || 0) - (gb.bestand || 0)}
                </div>
                {/* Entfernen-Button */}
                <button
                  style={{
                    background: "#e53454",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 13px",
                    fontSize: 14,
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                  onClick={() => removeGrundbestand(tab, gidx)}
                >
                  {t[lang].entfernen}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kundenverwaltung */}
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
          <div
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
              marginBottom: 14,
            }}
          >
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
              {t[lang].lagerflaecheProStellplatz}
              <input
                type="number"
                min={0.5}
                step={0.1}
                value={standorte[tab].lagerflaecheProStellplatz}
                onChange={(e) =>
                  updateStandortFeld(tab, "lagerflaecheProStellplatz", e.target.value)
                }
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
              {t[lang].lagerkostenProStellplatz}
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={standorte[tab].lagerkostenProStellplatz}
                onChange={(e) =>
                  updateStandortFeld(tab, "lagerkostenProStellplatz", e.target.value)
                }
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
          {/* Kundenverwaltung */}
          <div>
            <h3
              style={{
                margin: "15px 0 10px 0",
                color: "#083d95",
                fontWeight: 900,
              }}
            >
              {t[lang].kunden}
            </h3>
            <button
              onClick={() => addKunde(tab)}
              style={{
                background: "#0094cb",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                border: "none",
                borderRadius: 9,
                padding: "7px 19px",
                marginBottom: 8,
                cursor: "pointer",
                marginRight: 9,
              }}
            >
              + {t[lang].kundeHinzufuegen}
            </button>
            <div>
              {standorte[tab].kunden.length === 0 ? (
                <div style={{ color: "#aaa", margin: 18 }}>
                  {t[lang].keinKunde}
                </div>
              ) : (
                alphaSort(standorte[tab].kunden).map((kunde, kidx) => (
                  <div
                    key={kidx}
                    style={{
                      margin: "18px 0",
                      border: "1px solid #d5e7fa",
                      borderRadius: 11,
                      background: "#f6fcff",
                      boxShadow: "0 1px 7px #b7d6fa22",
                      padding: "16px 12px",
                    }}
                  >
                    {/* Name, Button Entfernen */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        marginBottom: 10,
                      }}
                    >
                      <input
                        value={kunde.name}
                        onChange={(e) =>
                          updateKunde(tab, kidx, "name", e.target.value)
                        }
                        style={{
                          fontWeight: 800,
                          fontSize: 19,
                          padding: "5px 15px",
                          background: "#fff",
                          border: "1px solid #b1dbef",
                          borderRadius: 7,
                          color: "#083d95",
                          marginRight: 15,
                          minWidth: 120,
                        }}
                      />
                      <button
                        style={{
                          background: "#e53454",
                          color: "#fff",
                          fontWeight: 800,
                          border: "none",
                          borderRadius: 7,
                          padding: "6px 16px",
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                        onClick={() => removeKunde(tab, kidx)}
                      >
                        {t[lang].entfernen}
                      </button>
                    </div>
                    {/* Ladungsträger-Liste */}
                    <div>
                      {kunde.ladungstraeger.length === 0 ? (
                        <div
                          style={{
                            color: "#bbb",
                            margin: "10px 0 12px 20px",
                          }}
                        >
                          {t[lang].keinLadungstraeger}
                        </div>
                      ) : (
                        kunde.ladungstraeger.map((lt, lidx) => {
                          // Ampel/Umschlag berechnen
                          const einAus = getKundenEinAusgang(tab, kunde.name, lt.typ, lt.qualitaet);
                          const istmenge = einAus.istmenge;
                          const ampel = getVertragsAmpel(lt.vertragsmenge, istmenge);

                          // Countdown-Logik
                          const resttageL = getClearingResttage(lt.startdatumL, Number(lt.clearingTageL));
                          const resttageE = getClearingResttage(lt.startdatumE, Number(lt.clearingTageE));
                          const clearingFälligL = resttageL !== null && resttageL <= 0;
                          const clearingFälligE = resttageE !== null && resttageE <= 0;

                          // Prüfen: Grundbestand vorhanden?
                          const gbExists = standorte[tab].grundbestaende.some(
                            (gb) => gb.typ === lt.typ && (gb.qualitaet || "") === (lt.qualitaet || "")
                          );

                          return (
                            <div
                              key={lidx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                marginBottom: 8,
                                background: "#eaf7ff",
                                borderRadius: 8,
                                padding: "7px 8px",
                              }}
                            >
                              {/* Auswahl Ladungsträgertyp */}
                              <select
                                value={lt.typ}
                                style={{
                                  fontWeight: 700,
                                  fontSize: 16,
                                  border: "1px solid #0094cb",
                                  borderRadius: 6,
                                  padding: "4px 13px",
                                  color: "#083d95",
                                  background: "#fff",
                                }}
                                onChange={(e) =>
                                  updateLadungstraeger(tab, kidx, lidx, "typ", e.target.value)
                                }
                              >
                                {ladungstraegerTypen.map((opt) => (
                                  <option key={opt.label} value={opt.label}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {/* Qualität */}
                              {ladungstraegerTypen.find((t) => t.label === lt.typ)
                                ?.qualitaeten.length ? (
                                  <select
                                    value={lt.qualitaet}
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 16,
                                      border: "1px solid #0094cb",
                                      borderRadius: 6,
                                      padding: "4px 13px",
                                      color: "#083d95",
                                      background: "#fff",
                                      minWidth: 65,
                                    }}
                                    onChange={(e) =>
                                      updateLadungstraeger(tab, kidx, lidx, "qualitaet", e.target.value)
                                    }
                                  >
                                    <option value="">
                                      {lang === "de"
                                        ? "Qualität…"
                                        : "Quality…"}
                                    </option>
                                    {ladungstraegerTypen
                                      .find((t) => t.label === lt.typ)
                                      .qualitaeten.map((q) => (
                                        <option key={q} value={q}>
                                          {q}
                                        </option>
                                      ))}
                                  </select>
                                ) : null}
                              {/* Warnung Grundbestand fehlt */}
                              {!gbExists && (
                                <span style={{ color: "#e53454", fontWeight: 800, marginLeft: 4, marginRight: 4 }}>
                                  {t[lang].warnungLadungstraegerImGrundbestand}
                                </span>
                              )}
                              {/* Vertragsmenge */}
                              <label style={{ fontWeight: 700, marginLeft: 5 }}>
                                {t[lang].vertragsmenge}
                                <input
                                  type="number"
                                  value={lt.vertragsmenge || ""}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "vertragsmenge", e.target.value)
                                  }
                                  style={{
                                    width: 80,
                                    marginLeft: 6,
                                    borderRadius: 5,
                                    border: "1.2px solid #0094cb",
                                    background: "#fff",
                                    padding: "2px 7px",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#083d95",
                                  }}
                                />
                              </label>
                              {/* IST-Menge */}
                              <div style={{ fontWeight: 800, marginLeft: 8 }}>
                                {t[lang].istmenge}: {istmenge}
                                {/* Ampel */}
                                <span
                                  title={ampel.info}
                                  style={{
                                    display: "inline-block",
                                    marginLeft: 7,
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    background:
                                      ampel.color === "green"
                                        ? "#1ebc38"
                                        : ampel.color === "orange"
                                        ? "#ffb902"
                                        : ampel.color === "red"
                                        ? "#e53454"
                                        : "#cfcfcf",
                                    border: "1.7px solid #aaa",
                                    boxShadow: "0 1px 3px #0002",
                                    position: "relative",
                                    cursor: "pointer",
                                  }}
                                />
                                <span
                                  style={{
                                    color:
                                      ampel.color === "red"
                                        ? "#e53454"
                                        : ampel.color === "orange"
                                        ? "#ffb902"
                                        : ampel.color === "green"
                                        ? "#1ebc38"
                                        : "#aaa",
                                    fontWeight: 700,
                                    marginLeft: 5,
                                    fontSize: 14,
                                  }}
                                  title={ampel.info}
                                >
                                  {ampel.color === "red"
                                    ? "!"
                                    : ampel.color === "orange"
                                      ? "•"
                                      : ampel.color === "green"
                                        ? "✔"
                                        : ""}
                                </span>
                              </div>
                              {/* Clearing-Tage/Startdatum L */}
                              <div style={{ marginLeft: 9, fontSize: 14 }}>
                                <b>{t[lang].clearingTageL}:</b>
                                <input
                                  type="number"
                                  min={1}
                                  value={lt.clearingTageL || ""}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "clearingTageL", e.target.value)
                                  }
                                  style={{
                                    width: 38,
                                    marginLeft: 6,
                                    borderRadius: 5,
                                    border: "1.2px solid #0094cb",
                                    background: "#fff",
                                    padding: "2px 7px",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    color: "#083d95",
                                  }}
                                />
                                <span style={{ marginLeft: 7 }}>
                                  {t[lang].clearingStart}
                                </span>
                                <input
                                  type="date"
                                  value={lt.startdatumL || ""}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "startdatumL", e.target.value)
                                  }
                                  style={{
                                    marginLeft: 5,
                                    borderRadius: 5,
                                    border: "1.2px solid #0094cb",
                                    background: "#fff",
                                    padding: "2px 7px",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    color: "#083d95",
                                  }}
                                />
                                {resttageL !== null && lt.clearingTageL && lt.startdatumL && (
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: clearingFälligL ? "#e53454" : "#093",
                                      marginLeft: 7,
                                    }}
                                  >
                                    {clearingFälligL
                                      ? t[lang].clearingFaellig
                                      : t[lang].clearingCountdown + ": " + resttageL + " " + t[lang].tage}
                                  </span>
                                )}
                              </div>
                              {/* Clearing-Tage/Startdatum E */}
                              <div style={{ marginLeft: 9, fontSize: 14 }}>
                                <b>{t[lang].clearingTageE}:</b>
                                <input
                                  type="number"
                                  min={1}
                                  value={lt.clearingTageE || ""}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "clearingTageE", e.target.value)
                                  }
                                  style={{
                                    width: 38,
                                    marginLeft: 6,
                                    borderRadius: 5,
                                    border: "1.2px solid #0094cb",
                                    background: "#fff",
                                    padding: "2px 7px",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    color: "#083d95",
                                  }}
                                />
                                <span style={{ marginLeft: 7 }}>
                                  {t[lang].clearingStart}
                                </span>
                                <input
                                  type="date"
                                  value={lt.startdatumE || ""}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "startdatumE", e.target.value)
                                  }
                                  style={{
                                    marginLeft: 5,
                                    borderRadius: 5,
                                    border: "1.2px solid #0094cb",
                                    background: "#fff",
                                    padding: "2px 7px",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    color: "#083d95",
                                  }}
                                />
                                {resttageE !== null && lt.clearingTageE && lt.startdatumE && (
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: clearingFälligE ? "#e53454" : "#093",
                                      marginLeft: 7,
                                    }}
                                  >
                                    {clearingFälligE
                                      ? t[lang].clearingFaellig
                                      : t[lang].clearingCountdown + ": " + resttageE + " " + t[lang].tage}
                                  </span>
                                )}
                              </div>
                              {/* Hinweise */}
                              <div style={{ marginLeft: 11, maxWidth: 120 }}>
                                <label>
                                  <b>{t[lang].hinweis}:</b>
                                  <input
                                    value={lt.hinweisL || ""}
                                    placeholder={t[lang].clearingTageL}
                                    onChange={(e) =>
                                      updateLadungstraeger(tab, kidx, lidx, "hinweisL", e.target.value)
                                    }
                                    style={{
                                      width: 55,
                                      marginLeft: 5,
                                      borderRadius: 5,
                                      border: "1.2px solid #0094cb",
                                      background: "#fff",
                                      padding: "2px 5px",
                                      fontWeight: 700,
                                      fontSize: 12,
                                      color: "#083d95",
                                    }}
                                  />
                                </label>
                                <label>
                                  <input
                                    value={lt.hinweisE || ""}
                                    placeholder={t[lang].clearingTageE}
                                    onChange={(e) =>
                                      updateLadungstraeger(tab, kidx, lidx, "hinweisE", e.target.value)
                                    }
                                    style={{
                                      width: 55,
                                      marginLeft: 4,
                                      borderRadius: 5,
                                      border: "1.2px solid #0094cb",
                                      background: "#fff",
                                      padding: "2px 5px",
                                      fontWeight: 700,
                                      fontSize: 12,
                                      color: "#083d95",
                                    }}
                                  />
                                </label>
                              </div>
                              {/* Entfernen-Button */}
                              <button
                                style={{
                                  background: "#e53454",
                                  color: "#fff",
                                  fontWeight: 700,
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "5px 11px",
                                  fontSize: 14,
                                  marginLeft: 12,
                                  cursor: "pointer",
                                }}
                                onClick={() => removeLadungstraeger(tab, kidx, lidx)}
                              >
                                {t[lang].entfernen}
                              </button>
                            </div>
                          );
                        })
                      )}
                      {/* + Ladungsträger hinzufügen */}
                      <button
                        style={{
                          background: "#0094cb",
                          color: "#fff",
                          fontWeight: 700,
                          border: "none",
                          borderRadius: 7,
                          padding: "5px 14px",
                          fontSize: 14,
                          marginTop: 8,
                          cursor: "pointer",
                        }}
                        onClick={() => addLadungstraeger(tab, kidx)}
                      >
                        + {t[lang].ladungstraegertyp} {t[lang].hinzufuegen || "hinzufügen"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bewegungen buchen */}
        <button
          style={{
            background: "#083d95",
            color: "#fff",
            fontWeight: 900,
            border: "none",
            borderRadius: 9,
            padding: "10px 25px",
            fontSize: 18,
            cursor: "pointer",
            marginTop: 6,
            marginBottom: 36,
            marginLeft: 8,
            boxShadow: "0 2px 12px #0094cb24",
          }}
          onClick={handleOpenBewegung}
        >
          {t[lang].bewegungBuchen}
        </button>
        {/* Protokoll anzeigen */}
        <button
          style={{
            background: "#fff",
            color: "#0094cb",
            fontWeight: 900,
            border: "1.2px solid #0094cb",
            borderRadius: 9,
            padding: "7px 25px",
            fontSize: 16,
            cursor: "pointer",
            marginLeft: 12,
            marginTop: 7,
          }}
          onClick={() => setShowProtokoll(true)}
        >
          {t[lang].protokollAnzeigen}
        </button>
      </div>

      {/* --------- Bewegungen Modal --------- */}
      {showBewegung && (
        <div
          style={{
            position: "fixed",
            zIndex: 99,
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "#00336677",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowBewegung(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "38px 38px",
              borderRadius: 17,
              minWidth: 410,
              boxShadow: "0 7px 22px #00336644",
              fontSize: 18,
            }}
          >
            <h3 style={{ color: "#083d95", fontWeight: 800 }}>
              {t[lang].bewegungBuchen}
            </h3>
            {/* Eingang/Ausgang */}
            <div style={{ margin: "11px 0 12px 0" }}>
              <label style={{ marginRight: 23, fontWeight: 700 }}>
                <input
                  type="radio"
                  name="bArt"
                  value="Eingang"
                  checked={bewegungArt === "Eingang"}
                  onChange={() => setBewegungArt("Eingang")}
                />{" "}
                {t[lang].bewegungEingang}
              </label>
              <label style={{ fontWeight: 700 }}>
                <input
                  type="radio"
                  name="bArt"
                  value="Ausgang"
                  checked={bewegungArt === "Ausgang"}
                  onChange={() => setBewegungArt("Ausgang")}
                />{" "}
                {t[lang].bewegungAusgang}
              </label>
            </div>
            {/* Kunden-Eingaben */}
            {bewegungKunden.map((b, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: "9px 0",
                  background: "#eaf7ff",
                  borderRadius: 8,
                  padding: "7px 7px",
                }}
              >
                {/* Kunde */}
                <select
                  value={b.kunde}
                  onChange={(e) =>
                    handleChangeBewegungKunde(idx, "kunde", e.target.value)
                  }
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    border: "1px solid #0094cb",
                    borderRadius: 6,
                    padding: "4px 13px",
                    color: "#083d95",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    {lang === "de" ? "Kunde wählen…" : "Select customer…"}
                  </option>
                  {alphaSort(standorte[tab].kunden).map((k) => (
                    <option key={k.name} value={k.name}>
                      {k.name}
                    </option>
                  ))}
                </select>
                {/* Typ */}
                <select
                  value={b.typ}
                  onChange={(e) =>
                    handleChangeBewegungKunde(idx, "typ", e.target.value)
                  }
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    border: "1px solid #0094cb",
                    borderRadius: 6,
                    padding: "4px 13px",
                    color: "#083d95",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    {lang === "de"
                      ? "Ladungsträgertyp wählen…"
                      : "Select type…"}
                  </option>
                  {ladungstraegerTypen.map((lt) => (
                    <option key={lt.label} value={lt.label}>
                      {lt.label}
                    </option>
                  ))}
                </select>
                {/* Qualität */}
                {ladungstraegerTypen.find((t) => t.label === b.typ)?.qualitaeten.length ? (
                  <select
                    value={b.qualitaet}
                    onChange={(e) =>
                      handleChangeBewegungKunde(idx, "qualitaet", e.target.value)
                    }
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      border: "1px solid #0094cb",
                      borderRadius: 6,
                      padding: "4px 13px",
                      color: "#083d95",
                      background: "#fff",
                      minWidth: 65,
                    }}
                  >
                    <option value="">
                      {lang === "de" ? "Qualität…" : "Quality…"}
                    </option>
                    {ladungstraegerTypen
                      .find((t) => t.label === b.typ)
                      .qualitaeten.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                  </select>
                ) : null}
                {/* Menge */}
                <input
                  type="number"
                  value={b.menge}
                  onChange={(e) =>
                    handleChangeBewegungKunde(idx, "menge", e.target.value)
                  }
                  placeholder={t[lang].bewegungMenge}
                  style={{
                    width: 80,
                    marginLeft: 4,
                    borderRadius: 5,
                    border: "1.2px solid #0094cb",
                    background: "#fff",
                    padding: "2px 7px",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#083d95",
                  }}
                />
                {/* Entfernen-Kunde (außer erster) */}
                {bewegungKunden.length > 1 && (
                  <button
                    style={{
                      background: "#e53454",
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 9px",
                      fontSize: 14,
                      marginLeft: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveBewegungKunde(idx)}
                  >
                    {t[lang].entfernen}
                  </button>
                )}
              </div>
            ))}
            {/* + Kunde */}
            <button
              style={{
                background: "#0094cb",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 7,
                padding: "5px 14px",
                fontSize: 14,
                marginTop: 8,
                cursor: "pointer",
              }}
              onClick={handleAddBewegungKunde}
            >
              + {t[lang].bewegungMehrKunde}
            </button>
            <div style={{ color: "#e53454", marginTop: 7, fontWeight: 800 }}>
              {bewegungMsg}
            </div>
            {/* Buchen-Button */}
            <div>
              <button
                onClick={handleBuchenBewegung}
                style={{
                  background: "#083d95",
                  color: "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 36px",
                  fontSize: 17,
                  marginTop: 19,
                  cursor: "pointer",
                }}
              >
                {t[lang].bewegungBuchenBtn}
              </button>
              <button
                onClick={() => setShowBewegung(false)}
                style={{
                  background: "#fff",
                  color: "#0094cb",
                  fontWeight: 700,
                  border: "1.2px solid #0094cb",
                  borderRadius: 8,
                  padding: "9px 36px",
                  fontSize: 17,
                  marginLeft: 18,
                  marginTop: 19,
                  cursor: "pointer",
                }}
              >
                {t[lang].schliessen}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------- Protokoll Modal --------- */}
      {showProtokoll && (
        <div
          style={{
            position: "fixed",
            zIndex: 99,
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "#00336688",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowProtokoll(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "42px 48px",
              borderRadius: 17,
              minWidth: 440,
              boxShadow: "0 7px 22px #00336644",
              fontSize: 17,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "#083d95", fontWeight: 900, fontSize: 21 }}>
              {t[lang].protokollAnzeigen}
            </h3>
            {protokoll.length === 0 ? (
              <div style={{ color: "#aaa", fontWeight: 800, marginTop: 12 }}>
                {t[lang].keineAenderungen}
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                {protokoll.slice().reverse().map((p, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom: "1px solid #e9f0fc",
                      padding: "7px 0",
                      fontSize: 16,
                      color: "#0a1b3f",
                    }}
                  >
                    <span style={{ color: "#0a1b3f", fontWeight: 800, marginRight: 11 }}>
                      {p.zeit}
                    </span>
                    <span style={{ color: "#0094cb", fontWeight: 700, marginRight: 9 }}>
                      {p.user}
                    </span>
                    <span style={{ fontWeight: 600 }}>{p.aktion}</span>
                    <span style={{ color: "#555", marginLeft: 12 }}>
                      {p.details}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 29 }}>
              <button
                onClick={() => setShowProtokoll(false)}
                style={{
                  background: "#0094cb",
                  color: "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 39px",
                  fontSize: 18,
                  marginTop: 13,
                  cursor: "pointer",
                }}
              >
                {t[lang].schliessen}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100vw",
          padding: "18px 0",
          background: "#003366",
          color: "#fff",
          textAlign: "center",
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: "0.06em",
        }}
      >
        {t[lang].footer}
      </div>
    </div>
  );
}
