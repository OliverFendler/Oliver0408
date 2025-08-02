import React, { useState, useEffect } from "react";

/* =========================
    LADUNGSTRÄGER KONFIG
========================= */
const ladungstraegerTypen = [
  { label: "EPAL 1 Europalette", qualitaeten: ["A", "B", "C"] },
  { label: "EPAL 6 Halbpalette", qualitaeten: [] },
  { label: "EPAL 7 Halbpalette", qualitaeten: [] },
  { label: "EPAL Gitterbox", qualitaeten: [] },
  { label: "EPAL Europalette QR", qualitaeten: ["A", "B", "C"] },
];

/* =========================
    ÜBERSETZUNGEN (DE/EN)
========================= */
const t = {
  de: {
    standort: "Standort",
    standortEdit: "Standortnamen bearbeiten",
    lagerflaecheProStellplatz: "Lagerfläche pro Stellplatz (m²)",
    lagerkostenProStellplatz: "Lagerkosten pro Stellplatz (€)",
    kunden: "Kunden",
    kundeHinzufuegen: "Kunde hinzufügen",
    name: "Name",
    ladungstraegertyp: "Ladungsträgertyp",
    qualitaet: "Qualität",
    vertragsmenge: "Vertragsmenge (Monat)",
    istmenge: "Umschlag (Monat)",
    ladungstraegerHinzufuegen: "Ladungsträger hinzufügen",
    notizen: "Notizen",
    entfernen: "Entfernen",
    gesamtuebersicht: "Gesamtübersicht",
    lagerflaeche: "Lagerfläche (m²)",
    stellplaetze: "Benötigte Stellplätze",
    lagerkosten: "Monatliche Lagerkosten (€)",
    chartsUmschlag: "Umschlag je Standort (Paletten/Monat)",
    chartsKosten: "Lagerkosten je Standort (€)",
    neuerStandort: "Standort hinzufügen",
    grundbestand: "Grundbestand",
    inventur: "Inventur-Bestand",
    abweichung: "Abweichung",
    warnung: "Warnung: Bestand reicht nicht!",
    inventurSpeichern: "Inventur speichern",
    beschaffung: "Beschaffung",
    protokollAnzeigen: "Protokoll anzeigen",
    abmelden: "Abmelden",
    login: "Login",
    pinEingeben: "Bitte PIN eingeben",
    anmelden: "Anmelden",
    falsch: "Falsche PIN",
    userLabel: "Angemeldet als:",
    grundbestandHinzufuegen: "Grundbestand hinzufügen",
    keineAenderungen: "Noch keine Änderungen erfasst.",
    entfernenStandort: "Standort entfernen",
    keinKunde: "Noch kein Kunde angelegt.",
    keinLadungstraeger: "Noch kein Ladungsträger angelegt.",
    keineBewegung: "Keine Bewegungen vorhanden.",
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
    einAusgangHistorie: "Ein-/Ausgang (kumuliert)",
    ampelInfoGruen: "Vertragsmenge im grünen Bereich.",
    ampelInfoGelb: "Achtung: Vertragsmenge bald überschritten.",
    ampelInfoRot: "Warnung: Vertragsmenge überschritten!",
    warnungLadungstraegerImGrundbestand:
      "Es gibt für diesen Ladungsträger keinen Grundbestand/Inventur an diesem Standort. Bitte zuerst Grundbestand anlegen.",
    inventurPflicht: "Bitte Inventur-Bestand eintragen und speichern!",
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
    clearingLadestelle: "Clearing Ladestelle (WT)",
    clearingEntladestelle: "Clearing Entladestelle (WT)",
    clearingStart: "Countdown starten",
    clearingCountdownZiel: "Ziel:",
    clearingNoch: "Noch",
    clearingWerktage: "WT",
    clearingKeinDatum: "Nicht gestartet",
    startdatum: "Startdatum",
    abbruch: "Abbrechen",
    schliessen: "Schließen",
    footer: "LCX NEXUS © 2025  –  Lager- & Bestandsplanungstool",
  },
  en: {
    standort: "Location",
    standortEdit: "Edit location name",
    lagerflaecheProStellplatz: "Storage area per slot (m²)",
    lagerkostenProStellplatz: "Storage cost per slot (€)",
    kunden: "Customers",
    kundeHinzufuegen: "Add customer",
    name: "Name",
    ladungstraegertyp: "Load carrier type",
    qualitaet: "Quality",
    vertragsmenge: "Contract volume (month)",
    istmenge: "Turnover (month)",
    ladungstraegerHinzufuegen: "Add load carrier",
    notizen: "Notes",
    entfernen: "Remove",
    gesamtuebersicht: "Total overview",
    lagerflaeche: "Storage area (m²)",
    stellplaetze: "Required slots",
    lagerkosten: "Monthly storage cost (€)",
    chartsUmschlag: "Turnover per location (pallets/month)",
    chartsKosten: "Storage cost per location (€)",
    neuerStandort: "Add location",
    grundbestand: "Initial stock",
    inventur: "Inventory stock",
    abweichung: "Deviation",
    warnung: "Warning: Inventory not sufficient!",
    inventurSpeichern: "Save inventory",
    beschaffung: "Procurement",
    protokollAnzeigen: "Show audit log",
    abmelden: "Logout",
    login: "Login",
    pinEingeben: "Please enter PIN",
    anmelden: "Sign in",
    falsch: "Wrong PIN",
    userLabel: "Logged in as:",
    grundbestandHinzufuegen: "Add initial stock",
    keineAenderungen: "No changes yet.",
    entfernenStandort: "Remove location",
    keinKunde: "No customer added yet.",
    keinLadungstraeger: "No load carrier added yet.",
    keineBewegung: "No movements recorded.",
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
    einAusgangHistorie: "In-/Outbound (cumulated)",
    ampelInfoGruen: "Contract volume OK.",
    ampelInfoGelb: "Attention: Contract volume nearly reached.",
    ampelInfoRot: "Warning: Contract volume exceeded!",
    warnungLadungstraegerImGrundbestand:
      "There is no initial/inventory stock for this load carrier at this location. Please create initial stock first.",
    inventurPflicht: "Please enter and save inventory stock!",
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
    clearingLadestelle: "Clearing loading point (WD)",
    clearingEntladestelle: "Clearing unloading point (WD)",
    clearingStart: "Start countdown",
    clearingCountdownZiel: "Target:",
    clearingNoch: "Remaining",
    clearingWerktage: "WD",
    clearingKeinDatum: "Not started",
    startdatum: "Start date",
    abbruch: "Cancel",
    schliessen: "Close",
    footer: "LCX NEXUS © 2025  –  Warehouse & Inventory Planning Tool",
  },
};
/* =========================
    INITIALSTANDORTE
========================= */
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

/* =========================
    PIN-USER-KONFIG
========================= */
const pinMap = {
  "1111": "Oliver",
  "2222": "Thomas",
  "3333": "Martin",
  "4444": "Sebastian",
};

// =================== HAUPTKOMPONENTE ===================
export default function Home() {
  // === State
  const [lang, setLang] = useState("de");
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState("");
  const [protokoll, setProtokoll] = useState([]);
  const [showProtokoll, setShowProtokoll] = useState(false);
  const [standorte, setStandorte] = useState(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lager_standorte_v2");
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

  // ==== Protokoll laden/speichern
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("lager_protokoll_v2");
      if (p) setProtokoll(JSON.parse(p));
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lager_standorte_v2", JSON.stringify(standorte));
    }
  }, [standorte]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lager_protokoll_v2", JSON.stringify(protokoll));
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
      inventur: "",
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
  function saveInventur(sidx, gidx) {
    // Inventur-Bestand MUSS Pflichtfeld sein
    const gb = standorte[sidx].grundbestaende[gidx];
    if (!gb.inventur || gb.inventur === "") {
      alert(t[lang].inventurPflicht);
      return;
    }
    addProtokoll(
      t[lang].protokollInventur,
      `Standort: ${standorte[sidx].name}, Typ: ${gb.typ}, Qualität: ${gb.qualitaet}, Wert: ${gb.inventur}`
    );
  }

  // ==== Hilfsfunktionen für Monitoring & Vertragsmenge
  function getKundenEinAusgang(sidx, kName, typ, qualitaet) {
    // Alle Bewegungen dieses Standorts und Kunden, Typ, Qualität aufsummieren
    const standort = standorte[sidx];
    let eingang = 0,
      ausgang = 0;
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        m.details.forEach((b) => {
          if (
            b.kunde === kName &&
            b.typ === typ &&
            (b.qualitaet || "") === (qualitaet || "")
          ) {
            if (m.art === "Eingang") eingang += Number(b.menge) || 0;
            if (m.art === "Ausgang") ausgang += Number(b.menge) || 0;
          }
        });
      });
    }
    return { eingang, ausgang };
  }
  function getVertragsAmpel(vertragsmenge, istmenge) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", info: "" };
    const pct = istmenge / vertragsmenge;
    if (pct < 0.9) return { color: "green", info: t[lang].ampelInfoGruen };
    if (pct < 1.0) return { color: "orange", info: t[lang].ampelInfoGelb };
    return { color: "red", info: t[lang].ampelInfoRot };
  }
  // ==== Ladungsträgerfunktionen
  function addLadungstraeger(sidx, kidx) {
    // Nur erlauben, wenn im Grundbestand die Kombi Typ+Qualität vorhanden ist!
    const gbArr = standorte[sidx].grundbestaende;
    if (gbArr.length === 0) {
      alert(t[lang].warnungLadungstraegerImGrundbestand);
      return;
    }
    // Default auf ersten Eintrag
    const typ = gbArr[0]?.typ || "";
    const qualitaet = gbArr[0]?.qualitaet || "";
    const already = standorte[sidx].kunden[kidx].ladungstraeger.find(
      (lt) => lt.typ === typ && lt.qualitaet === qualitaet
    );
    if (already) {
      alert(
        lang === "de"
          ? "Dieser Ladungsträger/Qualität ist schon angelegt."
          : "This carrier/quality is already added."
      );
      return;
    }
    // Startdatum, Clearingtage, Hinweis
    setStandorte((alt) => {
      const kopie = [...alt];
      kopie[sidx].kunden[kidx].ladungstraeger.push({
        typ,
        qualitaet,
        vertragsmenge: "",
        einAusgaenge: [],
        clearingTageLadestelle: "",
        clearingTageEntladestelle: "",
        startdatum: "",
        clearingHinweis: "",
      });
      return kopie;
    });
    addProtokoll(t[lang].protokollLadungsträgerHinzu, `Kunde: ${standorte[sidx].kunden[kidx].name}`);
  }

  function removeLadungstraeger(sidx, kidx, lidx) {
    setStandorte((alt) => {
      const kopie = [...alt];
      kopie[sidx].kunden[kidx].ladungstraeger.splice(lidx, 1);
      return kopie;
    });
    addProtokoll(t[lang].protokollLadungsträgerEntf, `Kunde: ${standorte[sidx].kunden[kidx].name}`);
  }

  function updateLadungstraeger(sidx, kidx, lidx, feld, val) {
    setStandorte((alt) => {
      const kopie = [...alt];
      if (
        feld === "vertragsmenge" ||
        feld === "clearingTageLadestelle" ||
        feld === "clearingTageEntladestelle"
      ) {
        kopie[sidx].kunden[kidx].ladungstraeger[lidx][feld] = Number(val);
      } else {
        kopie[sidx].kunden[kidx].ladungstraeger[lidx][feld] = val;
      }
      return kopie;
    });
  }

  // ==== Ein-/Ausgangsbuchung
  function handleOpenBewegung() {
    setBewegungKunden([
      { kunde: "", typ: "", qualitaet: "", menge: "", art: "Eingang" },
    ]);
    setShowBewegung(true);
    setBewegungMsg("");
  }

  function handleChangeBewegungKunde(idx, feld, val) {
    setBewegungKunden((arr) => {
      const k = [...arr];
      k[idx][feld] = val;
      if (feld === "typ") k[idx].qualitaet = ""; // Reset Quali bei Typwechsel
      return k;
    });
  }
  function handleAddBewegungKunde() {
    setBewegungKunden((arr) => [
      ...arr,
      { kunde: "", typ: "", qualitaet: "", menge: "", art: bewegungArt },
    ]);
  }
  function handleRemoveBewegungKunde(idx) {
    setBewegungKunden((arr) => {
      const a = [...arr];
      a.splice(idx, 1);
      return a;
    });
  }

  function handleBuchenBewegung() {
    // Check: Kunde, Typ, Qualität, Menge alles Pflicht und >0
    let valid = true;
    if (
      !bewegungKunden.length ||
      bewegungKunden.some((b) => !b.kunde || !b.typ || !b.menge || Number(b.menge) <= 0)
    ) {
      setBewegungMsg(t[lang].bewegungKundePflicht);
      valid = false;
    }
    if (!valid) return;

    // Für Ausgang: Prüfe Bestand (im Grundbestand!)
    const gbArr = standorte[tab].grundbestaende;
    for (const b of bewegungKunden) {
      const gb = gbArr.find(
        (g) => g.typ === b.typ && (g.qualitaet || "") === (b.qualitaet || "")
      );
      if (!gb) {
        setBewegungMsg(t[lang].warnungLadungstraegerImGrundbestand);
        return;
      }
      if (b.art === "Ausgang" && gb.bestand < Number(b.menge)) {
        setBewegungMsg(t[lang].bewegungNichtGenugBestand);
        return;
      }
    }

    // Buchung vornehmen
    setStandorte((standorteAlt) => {
      const s = JSON.parse(JSON.stringify(standorteAlt)); // Deep Clone!
      bewegungKunden.forEach((b) => {
        const gb = s[tab].grundbestaende.find(
          (g) => g.typ === b.typ && (g.qualitaet || "") === (b.qualitaet || "")
        );
        if (!gb) return;
        if (b.art === "Eingang") {
          gb.bestand += Number(b.menge);
          gb.inventur += Number(b.menge);
        } else {
          gb.bestand -= Number(b.menge);
          gb.inventur -= Number(b.menge);
        }

        // Kunde & Typ finden, in Ladungsträger die Bewegung buchen
        const k = s[tab].kunden.find((k) => k.name === b.kunde);
        if (k) {
          const lt = k.ladungstraeger.find(
            (l) => l.typ === b.typ && (l.qualitaet || "") === (b.qualitaet || "")
          );
          if (lt) {
            if (!lt.einAusgaenge) lt.einAusgaenge = [];
            lt.einAusgaenge.push({
              art: b.art,
              menge: Number(b.menge),
              zeit: new Date().toISOString(),
            });
          }
        }
      });
      // Bewegungsprotokoll speichern
      if (!s[tab].bewegungen) s[tab].bewegungen = [];
      s[tab].bewegungen.push({
        zeit: new Date().toLocaleString(),
        details: bewegungKunden.map((b) => ({
          ...b,
          user,
        })),
      });
      return s;
    });

    addProtokoll(
      t[lang].protokollBewegung,
      bewegungKunden
        .map(
          (b) =>
            `Kunde: ${b.kunde}, Typ: ${b.typ}, Quali: ${b.qualitaet}, Menge: ${b.menge}, Art: ${b.art}`
        )
        .join(" | ")
    );
    setBewegungMsg(t[lang].bewegungErfasst);
    setTimeout(() => {
      setShowBewegung(false);
      setBewegungMsg("");
    }, 1000);
  }
  // ==== Clearing-Countdown berechnen (nur Werktage)
  function calcClearingCountdown(start, tage) {
    if (!start || !tage) return "";
    let d = new Date(start);
    let left = Number(tage);
    while (left > 0) {
      d.setDate(d.getDate() + 1);
      // Werktage: Mo-Fr
      if (d.getDay() !== 0 && d.getDay() !== 6) left--;
    }
    return d.toLocaleDateString();
  }

  // ==== Vertragsmengen-Monitoring
  function summeEinAusgaenge(lt) {
    if (!lt.einAusgaenge) return { ein: 0, aus: 0 };
    let ein = 0,
      aus = 0;
    lt.einAusgaenge.forEach((ea) => {
      if (ea.art === "Eingang") ein += ea.menge || 0;
      else if (ea.art === "Ausgang") aus += ea.menge || 0;
    });
    return { ein, aus };
  }
  function vertragAmpel(lt) {
    const { ein, aus } = summeEinAusgaenge(lt);
    const istmenge = ein - aus;
    if (!lt.vertragsmenge || !istmenge) return { color: "gray", info: "" };
    const pct = istmenge / lt.vertragsmenge;
    if (pct < 0.8) return { color: "green", info: t[lang].ampelInfoGruen };
    if (pct < 1) return { color: "orange", info: t[lang].ampelInfoGelb };
    return { color: "red", info: t[lang].ampelInfoRot };
  }

  // ==== UI Rendering ====
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
      {/* ...HEADER UND TABS... */}

      {/* Kundenverwaltung (nur relevante Auszüge für Ladungsträger-Liste): */}
      {/* ... */}
      {standorte[tab].kunden.map((kunde, kidx) => (
        <div key={kidx} style={{ marginBottom: 32, background: "#f6fcff", borderRadius: 13, padding: 16 }}>
          {/* ...Name, Notizen, Entfernen... */}
          <div style={{ marginLeft: 16, marginTop: 10, marginBottom: 6 }}>
            <b>{t[lang].ladungstraegerHinzufuegen}</b>
            <button onClick={() => addLadungstraeger(tab, kidx)} style={{
              background: "#0094cb", color: "#fff", border: "none", borderRadius: 7, padding: "6px 14px",
              fontWeight: 800, fontSize: 15, marginLeft: 10, cursor: "pointer"
            }}>
              + {t[lang].ladungstraegerHinzufuegen}
            </button>
          </div>
          {kunde.ladungstraeger.map((lt, lidx) => {
            const ampel = vertragAmpel(lt);
            const { ein, aus } = summeEinAusgaenge(lt);
            return (
              <div key={lidx} style={{
                background: "#eaf7ff", borderRadius: 8, padding: "9px 14px", marginBottom: 9,
                display: "flex", alignItems: "center", gap: 15
              }}>
                {/* Typ */}
                <select value={lt.typ} style={{ fontWeight: 700, fontSize: 15, borderRadius: 7, border: "1.2px solid #0094cb", minWidth: 130 }}
                  onChange={e => updateLadungstraeger(tab, kidx, lidx, "typ", e.target.value)}>
                  {ladungstraegerTypen.map(opt =>
                    <option key={opt.label} value={opt.label}>{opt.label}</option>
                  )}
                </select>
                {/* Qualität */}
                {ladungstraegerTypen.find(t => t.label === lt.typ)?.qualitaeten.length ? (
                  <select value={lt.qualitaet}
                    style={{ fontWeight: 700, fontSize: 15, borderRadius: 7, border: "1.2px solid #0094cb", minWidth: 60 }}
                    onChange={e => updateLadungstraeger(tab, kidx, lidx, "qualitaet", e.target.value)}>
                    <option value="">{lang === "de" ? "Qualität…" : "Quality…"}</option>
                    {ladungstraegerTypen.find(t => t.label === lt.typ).qualitaeten.map(q =>
                      <option key={q} value={q}>{q}</option>
                    )}
                  </select>
                ) : null}
                {/* Vertragsmenge */}
                <label style={{ fontWeight: 700 }}>
                  {t[lang].vertragsmenge}
                  <input type="number" value={lt.vertragsmenge || ""}
                    onChange={e => updateLadungstraeger(tab, kidx, lidx, "vertragsmenge", e.target.value)}
                    style={{ width: 90, marginLeft: 7, borderRadius: 5, border: "1.2px solid #0094cb", padding: "2px 8px", fontWeight: 700, fontSize: 15 }} />
                </label>
                {/* Ampel-Icon */}
                <span title={ampel.info} style={{
                  display: "inline-block", width: 19, height: 19, borderRadius: "50%", marginLeft: 8,
                  background:
                    ampel.color === "green"
                      ? "#1ebc38"
                      : ampel.color === "orange"
                        ? "#ffb902"
                        : ampel.color === "red"
                          ? "#e53454"
                          : "#cfcfcf",
                  border: "1.7px solid #aaa",
                }} />
                {/* Summen Ein/Ausgang */}
                <span style={{ marginLeft: 10 }}>
                  <b style={{ color: "#3194cb" }}>{t[lang].bewegungEingang}:</b> {ein}{" "}
                  <b style={{ color: "#e53454", marginLeft: 10 }}>{t[lang].bewegungAusgang}:</b> {aus}
                </span>
                {/* Clearingtage, Startdatum, Hinweis */}
                <input type="number" min={1} placeholder={t[lang].tageClearingLadestelle}
                  value={lt.clearingTageLadestelle || ""} style={{ width: 45, marginLeft: 13 }}
                  onChange={e => updateLadungstraeger(tab, kidx, lidx, "clearingTageLadestelle", e.target.value)} />
                <input type="number" min={1} placeholder={t[lang].tageClearingEntladestelle}
                  value={lt.clearingTageEntladestelle || ""} style={{ width: 45, marginLeft: 6 }}
                  onChange={e => updateLadungstraeger(tab, kidx, lidx, "clearingTageEntladestelle", e.target.value)} />
                <input type="date"
                  value={lt.startdatum ? lt.startdatum.substr(0, 10) : ""}
                  style={{ marginLeft: 9, borderRadius: 5, border: "1px solid #bbb" }}
                  onChange={e => updateLadungstraeger(tab, kidx, lidx, "startdatum", e.target.value)} />
                <input type="text" placeholder={lang === "de" ? "Hinweis..." : "Note..."}
                  value={lt.clearingHinweis || ""}
                  style={{ marginLeft: 9, borderRadius: 5, border: "1px solid #bbb", width: 120 }}
                  onChange={e => updateLadungstraeger(tab, kidx, lidx, "clearingHinweis", e.target.value)} />
                {/* Countdown anzeigen */}
                <span style={{ color: "#0094cb", fontWeight: 700, marginLeft: 10 }}>
                  {lt.startdatum && lt.clearingTageLadestelle
                    ? `Ladestelle bis: ${calcClearingCountdown(lt.startdatum, lt.clearingTageLadestelle)}`
                    : ""}
                  {lt.startdatum && lt.clearingTageEntladestelle
                    ? ` | Entladestelle bis: ${calcClearingCountdown(lt.startdatum, lt.clearingTageEntladestelle)}`
                    : ""}
                </span>
                {/* Entfernen */}
                <button style={{
                  background: "#e53454", color: "#fff", fontWeight: 700, border: "none",
                  borderRadius: 6, padding: "5px 13px", marginLeft: 12, cursor: "pointer",
                }}
                  onClick={() => removeLadungstraeger(tab, kidx, lidx)}>{t[lang].entfernen}</button>
              </div>
            );
          })}
        </div>
      ))}

      {/* Bewegungsbuchung-Modal */}
      {showBewegung && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "#000a",
          zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center",
        }}
          onClick={() => setShowBewegung(false)}>
          <div style={{
            width: 560, maxWidth: "96vw", background: "#fff", borderRadius: 19, boxShadow: "0 5px 30px #0094cb44",
            padding: "32px 30px 24px 30px", fontFamily: "Inter,sans-serif", color: "#083d95", position: "relative"
          }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 22, marginTop: 0, marginBottom: 14 }}>
              {t[lang].bewegungBuchen}
            </h2>
            {bewegungKunden.map((k, idx) => (
              <div key={idx}
                style={{
                  background: "#f6fcff", border: "1px solid #b1dbef", borderRadius: 10,
                  padding: "10px 14px", marginBottom: 12, display: "flex", gap: 9, alignItems: "center",
                }}>
                <select value={k.kunde}
                  onChange={e => handleChangeBewegungKunde(idx, "kunde", e.target.value)}
                  style={{
                    fontWeight: 700, fontSize: 15, border: "1.2px solid #0094cb", borderRadius: 7,
                    padding: "4px 13px", color: "#083d95", background: "#fff", minWidth: 110,
                  }}>
                  <option value="">{lang === "de" ? "Kunde wählen…" : "Select customer…"}</option>
                  {standorte[tab].kunden
                    .map(k => k.name)
                    .sort((a, b) => a.localeCompare(b))
                    .map(name =>
                      <option key={name} value={name}>{name}</option>
                    )}
                </select>
                <select value={k.typ}
                  onChange={e => handleChangeBewegungKunde(idx, "typ", e.target.value)}
                  style={{
                    fontWeight: 700, fontSize: 15, border: "1.2px solid #0094cb", borderRadius: 7,
                    padding: "4px 13px", color: "#083d95", background: "#fff", minWidth: 120,
                  }}>
                  <option value="">{lang === "de" ? "Ladungsträgertyp…" : "Carrier type…"}</option>
                  {ladungstraegerTypen.map(opt =>
                    <option key={opt.label} value={opt.label}>{opt.label}</option>
                  )}
                </select>
                {ladungstraegerTypen.find(t => t.label === k.typ)?.qualitaeten.length ? (
                  <select value={k.qualitaet}
                    onChange={e => handleChangeBewegungKunde(idx, "qualitaet", e.target.value)}
                    style={{
                      fontWeight: 700, fontSize: 15, border: "1.2px solid #0094cb", borderRadius: 7,
                      padding: "4px 13px", color: "#083d95", background: "#fff", minWidth: 65,
                    }}>
                    <option value="">{lang === "de" ? "Qualität…" : "Quality…"}</option>
                    {ladungstraegerTypen
                      .find(t => t.label === k.typ)
                      .qualitaeten.map(q =>
                        <option key={q} value={q}>{q}</option>
                      )}
                  </select>
                ) : null}
                <input type="number" value={k.menge}
                  onChange={e => handleChangeBewegungKunde(idx, "menge", e.target.value)}
                  min={1} placeholder={t[lang].bewegungMenge}
                  style={{
                    width: 85, border: "1.2px solid #0094cb", borderRadius: 7, fontWeight: 700,
                    padding: "3px 12px", fontSize: 15, background: "#fff", color: "#083d95",
                  }} />
                <select value={k.art || "Eingang"}
                  onChange={e => handleChangeBewegungKunde(idx, "art", e.target.value)}
                  style={{ fontWeight: 700, fontSize: 15, borderRadius: 7, marginLeft: 7 }}>
                  <option value="Eingang">{t[lang].bewegungEingang}</option>
                  <option value="Ausgang">{t[lang].bewegungAusgang}</option>
                </select>
                {bewegungKunden.length > 1 && (
                  <button
                    style={{
                      background: "#e53454", color: "#fff", fontWeight: 700, border: "none",
                      borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 15,
                    }}
                    onClick={() => handleRemoveBewegungKunde(idx)}
                  >−</button>
                )}
                {idx === bewegungKunden.length - 1 && (
                  <button
                    style={{
                      background: "#0094cb", color: "#fff", fontWeight: 800, border: "none",
                      borderRadius: 8, padding: "5px 10px", marginLeft: 7, cursor: "pointer", fontSize: 15,
                    }}
                    onClick={handleAddBewegungKunde}
                  >+</button>
                )}
              </div>
            ))}
            {bewegungMsg && (
              <div style={{
                color: bewegungMsg === t[lang].bewegungErfasst ? "#0a6e2b" : "#e53454",
                background: bewegungMsg === t[lang].bewegungErfasst ? "#e7faee" : "#ffe3e3",
                borderRadius: 7, fontWeight: 700, fontSize: 15, padding: "8px 10px", margin: "0 0 9px 0",
              }}>{bewegungMsg}</div>
            )}
            <div style={{ textAlign: "center", marginTop: 11 }}>
              <button
                onClick={handleBuchenBewegung}
                style={{
                  background: "#0094cb", color: "#fff", fontWeight: 800, border: "none", borderRadius: 11,
                  padding: "10px 40px", fontSize: 16, cursor: "pointer", marginRight: 11,
                }}>{t[lang].bewegungBuchen}</button>
              <button
                onClick={() => setShowBewegung(false)}
                style={{
                  background: "#fff", color: "#0094cb", fontWeight: 800, border: "1.2px solid #0094cb",
                  borderRadius: 11, padding: "10px 34px", fontSize: 16, cursor: "pointer",
                }}>{t[lang].abbrechen || "Abbrechen"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ==== Protokoll-Modal ==== */}
      {showProtokoll && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "#000a",
          zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center",
        }}
          onClick={() => setShowProtokoll(false)}>
          <div style={{
            width: "620px", maxHeight: "86vh", overflowY: "auto", background: "#fff", borderRadius: 19,
            boxShadow: "0 5px 30px #0094cb44", padding: "36px 36px 25px 36px", fontFamily: "Inter,sans-serif", color: "#083d95",
          }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{
              color: "#0094cb", fontWeight: 900, fontSize: 24, marginTop: 0, marginBottom: 12,
            }}>{t[lang].protokollTitle || "Protokoll"}</h2>
            {protokoll.length === 0 ? (
              <div style={{ color: "#aaa", fontWeight: 600, marginTop: 22 }}>
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
                marginTop: 20, background: "#0094cb", color: "#fff", fontWeight: 800,
                border: "none", borderRadius: 10, padding: "10px 32px", fontSize: 16, cursor: "pointer",
              }}
              onClick={() => setShowProtokoll(false)}
            >{t[lang].schliessen || "Schließen"}</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        width: "100%", textAlign: "center", background: "#0094cb", color: "#fff", fontWeight: 800,
        padding: "13px 0 10px 0", fontSize: 16, letterSpacing: 1.2, marginTop: 80, position: "fixed", left: 0, bottom: 0,
      }}>
        {t[lang].footer}
      </div>
    </div>
  );
}
