import React, { useState, useEffect } from "react";

/* ==== KONSTANTEN ==== */
const ladungstraegerTypen = [
  { label: "EPAL 1 Europalette", qualitaeten: ["A", "B", "C"] },
  { label: "EPAL 6 Halbpalette", qualitaeten: [] },
  { label: "EPAL 7 Halbpalette", qualitaeten: [] },
  { label: "EPAL Gitterbox", qualitaeten: [] },
  { label: "EPAL Europalette QR", qualitaeten: ["A", "B", "C"] },
];

const t = {
  de: {
    registrieren: "Registrieren",
    vorname: "Vorname",
    nachname: "Nachname",
    email: "E-Mail",
    passwort: "Passwort",
    passwortWiederholen: "Passwort wiederholen",
    registrierenBtn: "Konto anlegen",
    login: "Login",
    anmelden: "Anmelden",
    passwortVergessen: "Passwort vergessen?",
    logout: "Abmelden",
    protokollAnzeigen: "Protokoll anzeigen",
    pinEingeben: "E-Mail und Passwort eingeben",
    falsch: "Login oder Passwort falsch!",
    bestaetigungRegistrierung: "Registrierung erfolgreich! Bitte jetzt einloggen.",
    protokollTitle: "Aktivitätsprotokoll",
    keineAenderungen: "Noch keine Änderungen erfasst.",
    schliessen: "Schließen",
    userLabel: "Angemeldet als:",
    // Features
    standort: "Standort",
    neuerStandort: "Standort hinzufügen",
    entfernenStandort: "Standort entfernen",
    lagerflaecheProStellplatz: "Lagerfläche pro Stellplatz (m²)",
    lagerkostenProStellplatz: "Lagerkosten pro Stellplatz (€)",
    grundbestand: "Grundbestand",
    grundbestandHinzufuegen: "Grundbestand hinzufügen",
    inventur: "Inventur-Bestand",
    abweichung: "Fehlmenge",
    entfernen: "Entfernen",
    kunden: "Kunden",
    kundeHinzufuegen: "Kunde hinzufügen",
    name: "Name",
    ladungstraegertyp: "Ladungsträgertyp",
    qualitaet: "Qualität",
    vertragsmenge: "Vertragsmenge",
    palettenProStellplatz: "Paletten/Stellplatz",
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
    keinKunde: "Noch kein Kunde angelegt.",
    keinLadungstraeger: "Noch kein Ladungsträger angelegt.",
    keineBewegung: "Keine Bewegungen vorhanden.",
    einAusgangHistorie: "Ein-/Ausgang (gesamt)",
    einGesamt: "Gesamt Eingang",
    ausGesamt: "Gesamt Ausgang",
    umschlagGesamt: "Umschlag gesamt",
    ampelInfoGruen: "Vertragsmenge im grünen Bereich.",
    ampelInfoGelb: "Achtung: Vertragsmenge bald überschritten.",
    ampelInfoRot: "Warnung: Vertragsmenge überschritten!",
    footer: "LCX NEXUS © 2025  –  Lager- & Bestandsplanungstool",
    // Gesamtübersicht
    gesamtuebersicht: "Gesamtübersicht",
    lagerflaeche: "Lagerfläche (m²)",
    stellplaetze: "Benötigte Stellplätze",
    lagerkosten: "Monatliche Lagerkosten (€)",
    chartsUmschlag: "Umschlag je Standort (Paletten/Monat)",
    chartsKosten: "Lagerkosten je Standort (€)",
    // Grundbestand/Inventur
    bedarfNextMonth: "Bedarf nächster Monat",
    warnungBestand: "Warnung: Bestand reicht nicht!",
    inventurSpeichern: "Inventur speichern",
    inventurPflicht: "Bitte Inventur-Bestand eintragen und speichern!",
    warnungLadungstraegerImGrundbestand: "Es gibt für diesen Ladungsträger keinen Grundbestand/Inventur an diesem Standort. Bitte zuerst Grundbestand anlegen.",
    // Clearing
    clearingLadestelle: "Clearing Ladestelle (Werktage)",
    clearingEntladestelle: "Clearing Entladestelle (Werktage)",
    startdatum: "Startdatum",
    tageBisClearing: "Tage bis Clearing",
    hinweis: "Hinweis",
  },
  // (EN für später ggf. ergänzen, DE reicht für MVP)
};

// ===== Helper Functions =====
function onlyWeekdaysBetween(startDate, days) {
  // Zählt NUR Werktage ab Startdatum (Mo-Fr, excl. Sa/So)
  let date = new Date(startDate);
  let count = 0;
  while (count < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) count++;
  }
  return date;
}
function diffWeekdays(from, to) {
  // Gibt Differenz in Werktagen zwischen zwei Daten (inkl. from, exkl. to)
  let days = 0, d = new Date(from);
  to = new Date(to);
  while (d < to) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days++;
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// ================
// USER MGMT LOCAL
// ================
function loadUserList() {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem("lager_users_v2");
  if (users) return JSON.parse(users);
  return [];
}
function saveUserList(users) {
  localStorage.setItem("lager_users_v2", JSON.stringify(users));
}
function hash(str) {
  // Kein echtes Hashen! Für MVP, production: bcrypt!
  return btoa(str.split("").reverse().join(""));
}

// ======= START KOMPONENTE ========
export default function Home() {
  // STATES
  const [lang] = useState("de");
  // User, Auth
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", pw: "" });
  const [register, setRegister] = useState(false);
  const [regData, setRegData] = useState({ vorname: "", nachname: "", email: "", pw: "", pw2: "" });
  const [regMsg, setRegMsg] = useState("");
  // Protokoll
  const [protokoll, setProtokoll] = useState([]);
  const [showProtokoll, setShowProtokoll] = useState(false);
  // Hauptdaten
  const [standorte, setStandorte] = useState(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lager_standorte_v3");
      if (s) return JSON.parse(s);
    }
    return [];
  });
  const [tab, setTab] = useState(0);
  // Buchung
  const [showBewegung, setShowBewegung] = useState(false);
  const [bewegungKunden, setBewegungKunden] = useState([{ kunde: "", typ: "", qualitaet: "", menge: "" }]);
  const [bewegungArt, setBewegungArt] = useState("Eingang");
  const [bewegungMsg, setBewegungMsg] = useState("");
  // Refresh trigger (z.B. für Countdown)
  const [refresh, setRefresh] = useState(0);

  // PROTOKOLL Laden/Speichern
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

  // Heartbeat für Clearing-Countdowns (1x/min)
  useEffect(() => {
    const iv = setInterval(() => setRefresh((v) => v + 1), 30000);
    return () => clearInterval(iv);
  }, []);

  // === PROTOKOLL
  function addProtokoll(aktion, details) {
    setProtokoll((prev) => [
      ...prev,
      {
        zeit: new Date().toLocaleString(),
        user: user?.email || "-",
        aktion,
        details,
      },
    ]);
  }

  // ========== REGISTRIERUNG & LOGIN ==========
  function handleRegister() {
    if (
      !regData.vorname ||
      !regData.nachname ||
      !regData.email ||
      !regData.pw ||
      !regData.pw2
    ) {
      setRegMsg("Alle Felder sind Pflicht!");
      return;
    }
    if (regData.pw !== regData.pw2) {
      setRegMsg("Passwörter stimmen nicht überein!");
      return;
    }
    let users = loadUserList();
    if (users.find((u) => u.email === regData.email)) {
      setRegMsg("E-Mail ist bereits registriert.");
      return;
    }
    users.push({
      email: regData.email,
      vorname: regData.vorname,
      nachname: regData.nachname,
      pw: hash(regData.pw),
    });
    saveUserList(users);
    setRegMsg(t[lang].bestaetigungRegistrierung);
    setRegister(false);
  }

  function handleLogin() {
    let users = loadUserList();
    const u = users.find((u) => u.email === loginData.email && u.pw === hash(loginData.pw));
    if (u) {
      setUser(u);
      setLoginData({ email: "", pw: "" });
      addProtokoll("Login", u.email);
      // If keine Standorte: direkt Standort-Dialog öffnen
      if (!standorte.length) setTab(0);
    } else {
      alert(t[lang].falsch);
    }
  }
  function handleLogout() {
    addProtokoll("Logout", user?.email || "-");
    setUser(null);
  }

  // ========== STANDORT ==========
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
    addProtokoll("Standort hinzugefügt", t[lang].standort + " " + (standorte.length + 1));
  }
  function removeStandort(idx) {
    const removed = standorte[idx].name;
    const neu = [...standorte];
    neu.splice(idx, 1);
    setStandorte(neu);
    setTab(0);
    addProtokoll("Standort entfernt", removed);
  }
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

  // ========== GRUNDBESTAND & INVENTUR ==========
  function addGrundbestand(sidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.push({
      typ: ladungstraegerTypen[0].label,
      qualitaet: "",
      bestand: 0,
      inventur: 0,
    });
    setStandorte(neu);
    addProtokoll("Grundbestand hinzugefügt", standorte[sidx].name);
  }
  function removeGrundbestand(sidx, gidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.splice(gidx, 1);
    setStandorte(neu);
    addProtokoll("Grundbestand entfernt", standorte[sidx].name);
  }
  function updateGrundbestand(sidx, gidx, feld, val) {
    const neu = [...standorte];
    if (feld === "bestand" || feld === "inventur") {
      neu[sidx].grundbestaende[gidx][feld] = Number(val);
    } else {
      neu[sidx].grundbestaende[gidx][feld] = val;
    }
    setStandorte(neu);
    addProtokoll("Grundbestand geändert", standorte[sidx].name);
  }
  function saveInventur(sidx, gidx) {
    // Pflichtfeld
    const gb = standorte[sidx].grundbestaende[gidx];
    if (gb.inventur === "" || gb.inventur == null) {
      alert(t[lang].inventurPflicht);
      return;
    }
    addProtokoll("Inventur gespeichert", `Standort: ${standorte[sidx].name}, Typ: ${gb.typ}, Quali: ${gb.qualitaet}, Wert: ${gb.inventur}`);
  }

  // ========== KUNDEN ==========
  function addKunde(idx) {
    const neu = [...standorte];
    neu[idx].kunden.push({
      name: t[lang].name + " " + (neu[idx].kunden.length + 1),
      ladungstraeger: [],
      notizen: "",
    });
    setStandorte(neu);
    addProtokoll("Kunde hinzugefügt", standorte[idx].name);
  }
  function removeKunde(sidx, kidx) {
    const neu = [...standorte];
    const removed = neu[sidx].kunden[kidx].name;
    neu[sidx].kunden.splice(kidx, 1);
    setStandorte(neu);
    addProtokoll("Kunde entfernt", removed + " @" + standorte[sidx].name);
  }
  function updateKunde(sidx, kidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx][feld] = val;
    setStandorte(neu);
  }

  // ========== LADUNGSTRÄGER pro KUNDE ==========
  function addLadungstraeger(sidx, kidx) {
    // Nur, wenn es diesen Grundbestand wirklich gibt!
    if (!standorte[sidx].grundbestaende.length) {
      alert(t[lang].warnungLadungstraegerImGrundbestand);
      return;
    }
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.push({
      typ: ladungstraegerTypen[0].label,
      qualitaet: "",
      vertragsmenge: "",
      palettenProStellplatz: 30,
      clearingLadestelleTage: 10,
      clearingLadestelleStart: "",
      clearingEntladestelleTage: 5,
      clearingEntladestelleStart: "",
    });
    setStandorte(neu);
    addProtokoll("Ladungsträger hinzugefügt", standorte[sidx].kunden[kidx].name);
  }
  function removeLadungstraeger(sidx, kidx, lidx) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.splice(lidx, 1);
    setStandorte(neu);
    addProtokoll("Ladungsträger entfernt", standorte[sidx].kunden[kidx].name);
  }
  function updateLadungstraeger(sidx, kidx, lidx, feld, val) {
    const neu = [...standorte];
    if (
      feld === "vertragsmenge" ||
      feld === "palettenProStellplatz" ||
      feld === "clearingLadestelleTage" ||
      feld === "clearingEntladestelleTage"
    ) {
      neu[sidx].kunden[kidx].ladungstraeger[lidx][feld] = Number(val);
    } else {
      neu[sidx].kunden[kidx].ladungstraeger[lidx][feld] = val;
    }
    setStandorte(neu);
  }

  // ======== CLEARING-DATUM ========
  function setClearingStart(sidx, kidx, lidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger[lidx][feld] = val;
    setStandorte(neu);
  }
  function daysToClearing(startDate, tage) {
    if (!startDate || !tage) return "";
    const target = onlyWeekdaysBetween(startDate, tage);
    const today = new Date();
    const diff = diffWeekdays(today, target);
    return diff;
  }

  // ========== BEWEGUNGSBUCHUNG ==========
  function handleOpenBewegung() {
    setBewegungKunden([{ kunde: "", typ: "", qualitaet: "", menge: "" }]);
    setBewegungArt("Eingang");
    setShowBewegung(true);
    setBewegungMsg("");
  }
  function handleChangeBewegungKunde(idx, feld, val) {
    const arr = [...bewegungKunden];
    arr[idx][feld] = val;
    // Typ/Quali synchronisieren, falls Typ geändert
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
      if (!gb) return; // Validierung oben!
      if (bewegungArt === "Eingang") {
        gb.bestand += Number(b.menge);
        gb.inventur += Number(b.menge);
      } else {
        gb.bestand -= Number(b.menge);
        gb.inventur -= Number(b.menge);
      }
    });
    if (!neu[tab].bewegungen) neu[tab].bewegungen = [];
    neu[tab].bewegungen.push({
      zeit: new Date().toLocaleString(),
      art: bewegungArt,
      details: [...bewegungKunden],
      user: user?.email,
    });
    setStandorte(neu);
    addProtokoll(
      "Bewegung gebucht",
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

  // ========== UMSCHLAG + VERTRAGSMENGE (AMPel)
  function getGesamtEingang(sidx, kunde, typ, qualitaet) {
    let ein = 0;
    const standort = standorte[sidx];
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        if (m.art === "Eingang") {
          m.details.forEach((b) => {
            if (b.kunde === kunde && b.typ === typ && (b.qualitaet || "") === (qualitaet || "")) {
              ein += Number(b.menge) || 0;
            }
          });
        }
      });
    }
    return ein;
  }
  function getGesamtAusgang(sidx, kunde, typ, qualitaet) {
    let aus = 0;
    const standort = standorte[sidx];
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        if (m.art === "Ausgang") {
          m.details.forEach((b) => {
            if (b.kunde === kunde && b.typ === typ && (b.qualitaet || "") === (qualitaet || "")) {
              aus += Number(b.menge) || 0;
            }
          });
        }
      });
    }
    return aus;
  }
  function getGesamtEingangAlleTypen(sidx, kunde) {
    let ein = 0;
    const standort = standorte[sidx];
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        if (m.art === "Eingang") {
          m.details.forEach((b) => {
            if (b.kunde === kunde) ein += Number(b.menge) || 0;
          });
        }
      });
    }
    return ein;
  }
  function getGesamtAusgangAlleTypen(sidx, kunde) {
    let aus = 0;
    const standort = standorte[sidx];
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        if (m.art === "Ausgang") {
          m.details.forEach((b) => {
            if (b.kunde === kunde) aus += Number(b.menge) || 0;
          });
        }
      });
    }
    return aus;
  }
  function getAmpel(vertragsmenge, umschlag) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", info: "" };
    const pct = umschlag / vertragsmenge;
    if (pct < 0.8) return { color: "green", info: t[lang].ampelInfoGruen };
    if (pct < 1.0) return { color: "orange", info: t[lang].ampelInfoGelb };
    return { color: "red", info: t[lang].ampelInfoRot };
  }

  // ========== BERECHNUNGEN GESAMT
  function calculateStandort(standort) {
    let stellplaetze = 0;
    let lagerflaeche = 0;
    let lagerkosten = 0;
    // NEU: aus allen Kunden/Ladungsträgern
    standort.kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        // Hier jetzt Gesamtumschlag/Monat = Summe aller tatsächlichen Ein-/Ausgänge (im Zeitraum)
        const umschlag = getGesamtEingang(standorte.indexOf(standort), kunde.name, lt.typ, lt.qualitaet) +
          getGesamtAusgang(standorte.indexOf(standort), kunde.name, lt.typ, lt.qualitaet);
        const palettenProSlot = lt.palettenProStellplatz || 30;
        const slots = palettenProSlot ? Math.ceil(umschlag / palettenProSlot) : 0;
        stellplaetze += slots;
      })
    );
    lagerflaeche = +(stellplaetze * standort.lagerflaecheProStellplatz).toFixed(2);
    lagerkosten = +(stellplaetze * standort.lagerkostenProStellplatz).toFixed(2);
    return { stellplaetze, lagerflaeche, lagerkosten };
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

  // ========== GRUNDBESTAND: Bedarf nächster Monat
  function bedarfNaechsterMonat(sidx, typ, qualitaet) {
    // Summe aller Vertragsmengen (aller Kunden für diesen Typ/Qualität am Standort)
    let sum = 0;
    standorte[sidx]?.kunden?.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        if (lt.typ === typ && (lt.qualitaet || "") === (qualitaet || "")) {
          sum += Number(lt.vertragsmenge) || 0;
        }
      })
    );
    return sum;
  }
  function warnungBestandZuNiedrig(sidx, gidx) {
    const gb = standorte[sidx].grundbestaende[gidx];
    const inventur = Number(gb.inventur) || 0;
    const bedarf = bedarfNaechsterMonat(sidx, gb.typ, gb.qualitaet);
    return inventur < bedarf;
  }

  // ========== UI START ==========

  // Login & Registration-UI
  if (!user)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f4fbfd",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Inter,sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 4px 22px #0094cb44",
            padding: "36px 45px",
            textAlign: "center",
          }}
        >
          <img src="/LOGO_LCX_NEXUS.png" alt="LCX NEXUS" style={{ height: 96, marginBottom: 16 }} />
          <h2 style={{ color: "#0094cb", fontWeight: 900, marginBottom: 10 }}>
            {register ? t[lang].registrieren : t[lang].login}
          </h2>
          {!register ? (
            <>
              <div style={{ fontWeight: 600, color: "#083d95", marginBottom: 16 }}>
                {t[lang].pinEingeben}
              </div>
              <input
                type="email"
                value={loginData.email}
                placeholder="E-Mail"
                onChange={(e) => setLoginData((v) => ({ ...v, email: e.target.value }))}
                style={{
                  fontSize: 19,
                  border: "1.5px solid #0094cb",
                  borderRadius: 10,
                  padding: "8px 28px",
                  marginBottom: 12,
                  width: 180,
                  textAlign: "center",
                }}
              /><br />
              <input
                type="password"
                value={loginData.pw}
                placeholder={t[lang].passwort}
                onChange={(e) => setLoginData((v) => ({ ...v, pw: e.target.value }))}
                style={{
                  fontSize: 19,
                  border: "1.5px solid #0094cb",
                  borderRadius: 10,
                  padding: "8px 28px",
                  marginBottom: 20,
                  width: 180,
                  textAlign: "center",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              /><br />
              <button
                onClick={handleLogin}
                style={{
                  background: "#0094cb",
                  color: "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 42px",
                  fontSize: 18,
                  cursor: "pointer",
                  marginBottom: 10,
                }}
              >
                {t[lang].anmelden}
              </button>
              <div style={{ marginTop: 13 }}>
                <button
                  style={{
                    background: "#fff",
                    color: "#0094cb",
                    fontWeight: 700,
                    border: "1.2px solid #0094cb",
                    borderRadius: 8,
                    padding: "6px 23px",
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                  onClick={() => setRegister(true)}
                >
                  {t[lang].registrieren}
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                value={regData.vorname}
                placeholder={t[lang].vorname}
                onChange={(e) => setRegData((v) => ({ ...v, vorname: e.target.value }))}
                style={{
                  ...inputStyle,
                  marginBottom: 9,
                }}
              /><br />
              <input
                type="text"
                value={regData.nachname}
                placeholder={t[lang].nachname}
                onChange={(e) => setRegData((v) => ({ ...v, nachname: e.target.value }))}
                style={inputStyle}
              /><br />
              <input
                type="email"
                value={regData.email}
                placeholder="E-Mail"
                onChange={(e) => setRegData((v) => ({ ...v, email: e.target.value }))}
                style={inputStyle}
              /><br />
              <input
                type="password"
                value={regData.pw}
                placeholder={t[lang].passwort}
                onChange={(e) => setRegData((v) => ({ ...v, pw: e.target.value }))}
                style={inputStyle}
              /><br />
              <input
                type="password"
                value={regData.pw2}
                placeholder={t[lang].passwortWiederholen}
                onChange={(e) => setRegData((v) => ({ ...v, pw2: e.target.value }))}
                style={inputStyle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRegister();
                }}
              /><br />
              <button
                onClick={handleRegister}
                style={buttonStyleBlue}
              >
                {t[lang].registrierenBtn}
              </button>
              {regMsg && (
                <div style={{ marginTop: 10, color: "#0094cb", fontWeight: 600 }}>{regMsg}</div>
              )}
              <div style={{ marginTop: 8 }}>
                <button
                  style={{
                    ...buttonStyle,
                    border: "1.2px solid #0094cb",
                    color: "#0094cb",
                  }}
                  onClick={() => setRegister(false)}
                >
                  {t[lang].anmelden}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );

  // === STYLE SHORTCUTS ===
  const inputStyle = {
    fontSize: 17,
    border: "1.4px solid #0094cb",
    borderRadius: 8,
    padding: "7px 21px",
    marginBottom: 7,
    width: 170,
    textAlign: "center",
  };
  const buttonStyle = {
    background: "#fff",
    fontWeight: 700,
    borderRadius: 9,
    padding: "8px 26px",
    fontSize: 16,
    cursor: "pointer",
  };
  const buttonStyleBlue = {
    background: "#0094cb",
    color: "#fff",
    fontWeight: 800,
    border: "none",
    borderRadius: 9,
    padding: "9px 32px",
    fontSize: 16,
    cursor: "pointer",
  };

  // === HAUPT-UI: App Oberfläche ===
  const g = calculateGesamt(standorte);

  return (
    <div
      style={{
        fontFamily: "Inter,sans-serif",
        background: "#f4fbfd",
        minHeight: "100vh",
        color: "#0a1b3f",
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px 0 18px 0",
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
            {user ? `${user.vorname} ${user.nachname} (${user.email})` : ""}
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

        {/* --------- Grundbestand/Inventur --------- */}
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
            {t[lang].grundbestand} / {t[lang].inventur} {t[lang].standort}
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
            {standorte[tab].grundbestaende.map((gb, gidx) => {
              const bedarfNextMonth = bedarfNaechsterMonat(tab, gb.typ, gb.qualitaet);
              const inventurWarnung = warnungBestandZuNiedrig(tab, gidx);
              return (
                <div
                  key={gidx}
                  style={{
                    display: "flex",
                    gap: 11,
                    alignItems: "center",
                    marginBottom: 9,
                    background: inventurWarnung ? "#fdd" : "#f3faff",
                    border: `2.1px solid ${inventurWarnung ? "#e53454" : "#b3e6fa"}`,
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
                    <button
                      style={{
                        background: "#3194cb",
                        color: "#fff",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 12px",
                        fontSize: 15,
                        marginLeft: 8,
                        cursor: "pointer",
                      }}
                      onClick={() => saveInventur(tab, gidx)}
                    >
                      {t[lang].inventurSpeichern}
                    </button>
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
                  {/* Bedarf nächster Monat */}
                  <div
                    style={{
                      marginLeft: 18,
                      color: "#0094cb",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {t[lang].bedarfNextMonth}: {bedarfNextMonth}
                  </div>
                  {/* Warnung */}
                  {inventurWarnung && (
                    <div
                      style={{
                        color: "#e53454",
                        fontWeight: 900,
                        marginLeft: 18,
                        background: "#ffdada",
                        borderRadius: 7,
                        padding: "2px 8px",
                      }}
                    >
                      {t[lang].warnungBestand}
                    </div>
                  )}
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
              );
            })}
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
            <div style={{ color: "#5787b9", fontSize: 15, marginLeft: 6 }}>
              {t[lang].standortEdit}
            </div>
            <div style={{ flex: 1 }} />
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
          </div>
          {/* Kundenliste */}
          <div>
            {standorte[tab].kunden.length === 0 ? (
              <div style={{ color: "#aaa", margin: 18 }}>
                {t[lang].keinKunde}
              </div>
            ) : (
              standorte[tab].kunden.map((kunde, kidx) => (
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
                  {/* Name und Entfernen */}
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
                  {/* Ladungsträger-Liste pro Kunde */}
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
                        // Grundbestand für Typ/Quali prüfen
                        const grundBest = standorte[tab].grundbestaende.find(
                          (g) =>
                            g.typ === lt.typ &&
                            (g.qualitaet || "") === (lt.qualitaet || "")
                        );
                        // Ampel für Vertragsmenge
                        const umschlagGesamt = getKundenEinAusgang(tab, kunde.name, lt.typ, lt.qualitaet).eingang +
                          getKundenEinAusgang(tab, kunde.name, lt.typ, lt.qualitaet).ausgang;
                        const ampel = getVertragsAmpel(
                          lt.vertragsmenge,
                          umschlagGesamt
                        );
                        return (
                          <div
                            key={lidx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 16,
                              marginBottom: 7,
                              background: "#eaf7ff",
                              borderRadius: 8,
                              padding: "7px 8px",
                            }}
                          >
                            {/* Typ */}
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
                                updateLadungstraeger(
                                  tab,
                                  kidx,
                                  lidx,
                                  "typ",
                                  e.target.value
                                )
                              }
                            >
                              {ladungstraegerTypen.map((opt) => (
                                <option key={opt.label} value={opt.label}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {/* Qualität */}
                            {ladungstraegerTypen.find(
                              (t) => t.label === lt.typ
                            )?.qualitaeten.length ? (
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
                                  updateLadungstraeger(
                                    tab,
                                    kidx,
                                    lidx,
                                    "qualitaet",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">
                                  {lang === "de" ? "Qualität…" : "Quality…"}
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
                            {/* Vertragsmenge */}
                            <label>
                              {t[lang].vertragsmenge}
                              <input
                                type="number"
                                value={lt.vertragsmenge || ""}
                                onChange={(e) =>
                                  updateLadungstraeger(
                                    tab,
                                    kidx,
                                    lidx,
                                    "vertragsmenge",
                                    e.target.value
                                  )
                                }
                                style={{
                                  width: 95,
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
                            {/* Paletten pro Stellplatz */}
                            <label>
                              {t[lang].palettenProStellplatz}
                              <input
                                type="number"
                                value={lt.palettenProStellplatz || 30}
                                onChange={(e) =>
                                  updateLadungstraeger(
                                    tab,
                                    kidx,
                                    lidx,
                                    "palettenProStellplatz",
                                    e.target.value
                                  )
                                }
                                style={{
                                  width: 65,
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
                            {/* Gesamt Eingang */}
                            <div style={{ minWidth: 96 }}>
                              <b>Eingang:</b>{" "}
                              {getKundenEinAusgang(tab, kunde.name, lt.typ, lt.qualitaet).eingang}
                            </div>
                            {/* Gesamt Ausgang */}
                            <div style={{ minWidth: 96 }}>
                              <b>Ausgang:</b>{" "}
                              {getKundenEinAusgang(tab, kunde.name, lt.typ, lt.qualitaet).ausgang}
                            </div>
                            {/* Umschlag gesamt */}
                            <div style={{ minWidth: 110 }}>
                              <b>Umschlag gesamt:</b> {umschlagGesamt}
                            </div>
                            {/* Ampel & Meldung */}
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
                            {/* Bewegungsbuchung Button */}
                            <button
                              onClick={handleOpenBewegung}
                              style={{
                                background: "#083d95",
                                color: "#fff",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 7,
                                padding: "7px 17px",
                                marginLeft: 14,
                                fontSize: 15,
                                cursor: "pointer",
                              }}
                            >
                              {t[lang].bewegungBuchen}
                            </button>
                            {/* Entfernen-Button */}
                            <button
                              style={{
                                background: "#e53454",
                                color: "#fff",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 6,
                                padding: "5px 15px",
                                fontSize: 14,
                                marginLeft: 8,
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                removeLadungstraeger(tab, kidx, lidx)
                              }
                            >
                              {t[lang].entfernen}
                            </button>
                          </div>
                        );
                      })
                    )}
                    {/* Ladungsträger hinzufügen */}
                    <button
                      onClick={() => addLadungstraeger(tab, kidx)}
                      style={{
                        background: "#0094cb",
                        color: "#fff",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 7,
                        padding: "7px 17px",
                        marginTop: 8,
                        fontSize: 15,
                        cursor: "pointer",
                      }}
                    >
                      + {t[lang].ladungstraegerHinzufuegen}
                    </button>
                  </div>
                  {/* Notizen */}
                  <div style={{ marginTop: 10 }}>
                    <label style={{ fontWeight: 700 }}>
                      {t[lang].notizen}
                    </label>
                    <textarea
                      value={kunde.notizen}
                      onChange={(e) =>
                        updateKunde(tab, kidx, "notizen", e.target.value)
                      }
                      style={{
                        width: "96%",
                        minHeight: 40,
                        borderRadius: 7,
                        border: "1px solid #a9c9ea",
                        marginLeft: 11,
                        padding: "7px",
                        fontSize: 15,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      {/* ==== Bewegungsbuchungs-Modal ==== */}
      {showBewegung && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "#000a",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowBewegung(false)}
        >
          <div
            style={{
              width: 560,
              maxWidth: "96vw",
              background: "#fff",
              borderRadius: 19,
              boxShadow: "0 5px 30px #0094cb44",
              padding: "32px 30px 24px 30px",
              fontFamily: "Inter,sans-serif",
              color: "#083d95",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                color: "#0094cb",
                fontWeight: 900,
                fontSize: 22,
                marginTop: 0,
                marginBottom: 14,
              }}
            >
              {t[lang].bewegungBuchen}
            </h2>
            <div style={{ marginBottom: 12 }}>
              <b>{t[lang].bewegungArt}</b>{" "}
              <select
                value={bewegungArt}
                onChange={(e) => setBewegungArt(e.target.value)}
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  border: "1.2px solid #0094cb",
                  borderRadius: 8,
                  padding: "4px 18px",
                  marginLeft: 9,
                  background: "#e5f1fa",
                  color: "#083d95",
                }}
              >
                <option value="Eingang">{t[lang].bewegungEingang}</option>
                <option value="Ausgang">{t[lang].bewegungAusgang}</option>
              </select>
            </div>
            {bewegungKunden.map((k, idx) => (
              <div
                key={idx}
                style={{
                  background: "#f6fcff",
                  border: "1px solid #b1dbef",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 12,
                  display: "flex",
                  gap: 9,
                  alignItems: "center",
                }}
              >
                <select
                  value={k.kunde}
                  onChange={(e) =>
                    handleChangeBewegungKunde(idx, "kunde", e.target.value)
                  }
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    border: "1.2px solid #0094cb",
                    borderRadius: 7,
                    padding: "4px 13px",
                    color: "#083d95",
                    background: "#fff",
                    minWidth: 110,
                  }}
                >
                  <option value="">
                    {lang === "de" ? "Kunde wählen…" : "Select customer…"}
                  </option>
                  {standorte[tab].kunden
                    .slice()
                    .sort((a, b) =>
                      a.name.localeCompare(b.name, lang === "de" ? "de" : "en")
                    )
                    .map((k) => (
                      <option key={k.name} value={k.name}>
                        {k.name}
                      </option>
                    ))}
                </select>
                {/* Typ */}
                <select
                  value={k.typ}
                  onChange={(e) =>
                    handleChangeBewegungKunde(idx, "typ", e.target.value)
                  }
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    border: "1.2px solid #0094cb",
                    borderRadius: 7,
                    padding: "4px 13px",
                    color: "#083d95",
                    background: "#fff",
                    minWidth: 120,
                  }}
                >
                  <option value="">
                    {lang === "de" ? "Ladungsträgertyp…" : "Carrier type…"}
                  </option>
                  {ladungstraegerTypen.map((opt) => (
                    <option key={opt.label} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Qualität (wenn nötig) */}
                {ladungstraegerTypen.find((t) => t.label === k.typ)
                  ?.qualitaeten.length ? (
                  <select
                    value={k.qualitaet}
                    onChange={(e) =>
                      handleChangeBewegungKunde(idx, "qualitaet", e.target.value)
                    }
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      border: "1.2px solid #0094cb",
                      borderRadius: 7,
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
                      .find((t) => t.label === k.typ)
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
                  value={k.menge}
                  onChange={(e) =>
                    handleChangeBewegungKunde(idx, "menge", e.target.value)
                  }
                  min={1}
                  placeholder={t[lang].bewegungMenge}
                  style={{
                    width: 85,
                    border: "1.2px solid #0094cb",
                    borderRadius: 7,
                    fontWeight: 700,
                    padding: "3px 12px",
                    fontSize: 15,
                    background: "#fff",
                    color: "#083d95",
                  }}
                />
                {/* + / - Button */}
                {bewegungKunden.length > 1 && (
                  <button
                    style={{
                      background: "#e53454",
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: 8,
                      padding: "5px 10px",
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                    onClick={() => handleRemoveBewegungKunde(idx)}
                  >
                    −
                  </button>
                )}
                {idx === bewegungKunden.length - 1 && (
                  <button
                    style={{
                      background: "#0094cb",
                      color: "#fff",
                      fontWeight: 800,
                      border: "none",
                      borderRadius: 8,
                      padding: "5px 10px",
                      marginLeft: 7,
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                    onClick={handleAddBewegungKunde}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
            {bewegungMsg && (
              <div
                style={{
                  color:
                    bewegungMsg === t[lang].bewegungErfasst
                      ? "#0a6e2b"
                      : "#e53454",
                  background:
                    bewegungMsg === t[lang].bewegungErfasst
                      ? "#e7faee"
                      : "#ffe3e3",
                  borderRadius: 7,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "8px 10px",
                  margin: "0 0 9px 0",
                }}
              >
                {bewegungMsg}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 11 }}>
              <button
                onClick={handleBuchenBewegung}
                style={{
                  background: "#0094cb",
                  color: "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 11,
                  padding: "10px 40px",
                  fontSize: 16,
                  cursor: "pointer",
                  marginRight: 11,
                }}
              >
                {t[lang].bewegungBuchen}
              </button>
              <button
                onClick={() => setShowBewegung(false)}
                style={{
                  background: "#fff",
                  color: "#0094cb",
                  fontWeight: 800,
                  border: "1.2px solid #0094cb",
                  borderRadius: 11,
                  padding: "10px 34px",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {t[lang].abbrechen || "Abbrechen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==== Protokoll-Modal ==== */}
      {showProtokoll && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "#000a",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowProtokoll(false)}
        >
          <div
            style={{
              width: "620px",
              maxHeight: "86vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 19,
              boxShadow: "0 5px 30px #0094cb44",
              padding: "36px 36px 25px 36px",
              fontFamily: "Inter,sans-serif",
              color: "#083d95",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                color: "#0094cb",
                fontWeight: 900,
                fontSize: 24,
                marginTop: 0,
                marginBottom: 12,
              }}
            >
              {t[lang].protokollAnzeigen}
            </h2>
            {protokoll.length === 0 ? (
              <div
                style={{
                  color: "#aaa",
                  fontWeight: 600,
                  marginTop: 22,
                }}
              >
                {t[lang].keineAenderungen}
              </div>
            ) : (
              <ul style={{ fontSize: 15, listStyle: "none", padding: 0 }}>
                {protokoll.slice().reverse().map((p, i) => (
                  <li key={i} style={{ marginBottom: 7 }}>
                    <span style={{ fontWeight: 600 }}>{p.zeit}</span>
                    {" – "}
                    <span style={{ fontWeight: 700 }}>{p.user}</span>
                    {": "}
                    <span>{p.aktion}</span>
                    <span style={{ color: "#555" }}>
                      {p.details ? " (" + p.details + ")" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              style={{
                marginTop: 20,
                background: "#0094cb",
                color: "#fff",
                fontWeight: 800,
                border: "none",
                borderRadius: 10,
                padding: "10px 32px",
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => setShowProtokoll(false)}
            >
              {t[lang].schliessen || "Schließen"}
            </button>
          </div>
        </div>
      )}

      {/* ==== Gesamtübersicht & Charts ==== */}
      <div
        style={{
          margin: "34px 26px 0 26px",
          background: "#fff",
          borderRadius: 17,
          boxShadow: "0 2px 14px #0094cb22",
          padding: "28px 30px 35px 30px",
        }}
      >
        <h2
          style={{
            color: "#0094cb",
            fontWeight: 900,
            fontSize: 27,
            marginBottom: 11,
          }}
        >
          {t[lang].gesamtuebersicht}
        </h2>
        <div style={{ fontSize: 17, marginBottom: 7, marginTop: 7 }}>
          {t[lang].lagerflaeche}: <b>{g.lagerflaeche} m²</b> |{" "}
          {t[lang].stellplaetze}: <b>{g.stellplaetze}</b> |{" "}
          {t[lang].lagerkosten}:{" "}
          <b>
            {g.lagerkosten.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
            })}{" "}
            €
          </b>
        </div>
        <div style={{ display: "flex", gap: 52, marginTop: 22 }}>
          {/* Umschlag Chart */}
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0a1b3f", fontSize: 16 }}>
              {t[lang].chartsUmschlag}
            </b>
            <BarChart
              labels={standorte.map((s) => s.name)}
              values={standorte.map((s) => calculateStandort(s).umschlagMonat)}
              color="#0094cb"
              suffix=" Pal."
              max={Math.max(
                100,
                ...standorte.map((s) => calculateStandort(s).umschlagMonat)
              )}
            />
          </div>
          {/* Kosten Chart */}
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0a1b3f", fontSize: 16 }}>
              {t[lang].chartsKosten}
            </b>
            <BarChart
              labels={standorte.map((s) => s.name)}
              values={standorte.map((s) => calculateStandort(s).lagerkosten)}
              color="#083d95"
              suffix=" €"
              max={Math.max(
                100,
                ...standorte.map((s) => calculateStandort(s).lagerkosten)
              )}
            />
          </div>
        </div>
      </div>

      {/* Protokoll-Link + Footer */}
      <div style={{ position: "fixed", right: 25, bottom: 32, zIndex: 999 }}>
        <button
          style={{
            background: "#fff",
            color: "#083d95",
            border: "1.5px solid #083d95",
            fontWeight: 700,
            borderRadius: 12,
            padding: "6px 16px",
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 1px 8px #b9e6fa22",
          }}
          onClick={() => setShowProtokoll(true)}
        >
          {t[lang].protokollAnzeigen}
        </button>
      </div>
      {/* Footer */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          background: "#0094cb",
          color: "#fff",
          fontWeight: 800,
          padding: "13px 0 10px 0",
          fontSize: 16,
          letterSpacing: 1.2,
          marginTop: 80,
          position: "fixed",
          left: 0,
          bottom: 0,
        }}
      >
        {t[lang].footer}
      </div>
    </div>
  );
}

// ===== BAR CHART KOMPONENTE =====
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
          <div style={{ fontWeight: 700, fontSize: 16, color: "#083d95" }}>
            {lbl}
          </div>
          <div
            style={{
              fontWeight: 500,
              color: "#3194cb",
              fontSize: 14,
            }}
          >
            {values[i] || 0}
            {suffix}
          </div>
        </div>
      ))}
    </div>
  );
}
