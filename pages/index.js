import React, { useState } from "react";

// ======== Sprach-Objekt ========
const t = {
  de: {
    abmelden: "Abmelden",
    abbrechen: "Abbrechen",
    name: "Kunde",
    standort: "Standort",
    neuerStandort: "Neuer Standort",
    entfernenStandort: "Standort entfernen",
    grundbestand: "Grundbestand",
    grundbestandHinzufuegen: "Grundbestand hinzufügen",
    grundbestandEntfernen: "Entfernen",
    inventur: "Inventur",
    inventurPflicht: "Bitte Inventurwert eingeben.",
    warnungLadungstraegerImGrundbestand: "Zuerst Grundbestand anlegen!",
    bewegungBuchen: "Bewegung buchen",
    bewegungEingang: "Eingang",
    bewegungAusgang: "Ausgang",
    bewegungMenge: "Menge",
    bewegungKundePflicht: "Kunde wählen!",
    bewegungTypPflicht: "Typ wählen!",
    bewegungMengePflicht: "Menge angeben!",
    bewegungNichtGenugBestand: "Nicht genug Bestand!",
    bewegungErfasst: "Bewegung erfasst!",
    protokollAnzeigen: "Protokoll anzeigen",
    keineAenderungen: "Keine Änderungen",
    schliessen: "Schließen",
    gesamtuebersicht: "Gesamtübersicht",
    lagerflaeche: "Lagerfläche",
    lagerkosten: "Lagerkosten",
    stellplaetze: "Stellplätze",
    chartsUmschlag: "Palettenumschlag",
    chartsKosten: "Lagerkosten",
    footer: "© LCX NEXUS Lager- und Bestandsplanung",
    ampelInfoGruen: "Vertragsmenge ausreichend.",
    ampelInfoGelb: "Vertragsmenge bald erreicht.",
    ampelInfoRot: "Vertragsmenge überschritten!",
  },
  en: {
    abmelden: "Logout",
    abbrechen: "Cancel",
    name: "Customer",
    standort: "Location",
    neuerStandort: "New location",
    entfernenStandort: "Remove location",
    grundbestand: "Stock",
    grundbestandHinzufuegen: "Add stock",
    grundbestandEntfernen: "Remove",
    inventur: "Inventory",
    inventurPflicht: "Please enter inventory value.",
    warnungLadungstraegerImGrundbestand: "Please create base stock first!",
    bewegungBuchen: "Book movement",
    bewegungEingang: "Inbound",
    bewegungAusgang: "Outbound",
    bewegungMenge: "Quantity",
    bewegungKundePflicht: "Choose customer!",
    bewegungTypPflicht: "Choose type!",
    bewegungMengePflicht: "Enter quantity!",
    bewegungNichtGenugBestand: "Not enough stock!",
    bewegungErfasst: "Movement booked!",
    protokollAnzeigen: "Show protocol",
    keineAenderungen: "No changes",
    schliessen: "Close",
    gesamtuebersicht: "Overview",
    lagerflaeche: "Warehouse area",
    lagerkosten: "Storage costs",
    stellplaetze: "Slots",
    chartsUmschlag: "Pallet turnover",
    chartsKosten: "Storage costs",
    footer: "© LCX NEXUS Warehouse and Inventory Planning",
    ampelInfoGruen: "Contract volume sufficient.",
    ampelInfoGelb: "Contract volume almost reached.",
    ampelInfoRot: "Contract volume exceeded!",
  }
};

const ladungstraegerTypen = [
  { label: "Europalette", qualitaeten: ["A", "B", "C"] },
  { label: "Industriepalette", qualitaeten: ["A", "B"] },
  { label: "Gitterbox", qualitaeten: [] },
];

// ======= Hilfsfunktionen für Wochentage und Datumslogik =======
function onlyWeekdaysBetween(start, tage) {
  const startDate = new Date(start);
  let count = 0, date = new Date(startDate);
  while (count < tage) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) count++;
  }
  return date;
}
function diffWeekdays(from, to) {
  let count = 0, d = new Date(from);
  while (d < to) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) count++;
  }
  return count;
}

// ======= Haupt-Komponente =======
export default function LagerTool() {
  // ======= States =======
  const [lang, setLang] = useState("de");
  const [user, setUser] = useState({ vorname: "Max", nachname: "Mustermann", email: "max@nexus.de" }); // DUMMY
  const [standorte, setStandorte] = useState([
    {
      name: "Zentrallager",
      lagerflaecheProStellplatz: 1.8,
      lagerkostenProStellplatz: 7,
      grundbestaende: [
        { typ: "Europalette", qualitaet: "B", bestand: 10000, inventur: 10000 }
      ],
      kunden: [],
      bewegungen: [],
    },
  ]);
  const [tab, setTab] = useState(0);
  const [showBewegung, setShowBewegung] = useState(false);
  const [bewegungKunden, setBewegungKunden] = useState([{ kunde: "", typ: "", qualitaet: "", menge: "" }]);
  const [bewegungArt, setBewegungArt] = useState("Eingang");
  const [bewegungMsg, setBewegungMsg] = useState("");
  const [showProtokoll, setShowProtokoll] = useState(false);
  const [protokoll, setProtokoll] = useState([]);
  // ========== Protokoll ==========
  function addProtokoll(aktion, details) {
    setProtokoll((p) => [
      ...p,
      {
        zeit: new Date().toLocaleString(),
        user: user?.email || "-",
        aktion,
        details,
      },
    ]);
  }

  // ========== Logout ==========
  function handleLogout() {
    setUser(null);
    setTab(0);
    setStandorte([
      {
        name: "Zentrallager",
        lagerflaecheProStellplatz: 1.8,
        lagerkostenProStellplatz: 7,
        grundbestaende: [],
        kunden: [],
        bewegungen: [],
      },
    ]);
    setProtokoll([]);
  }

  // ====== CLEARING LOGIK ======
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

  // ====== BEWEGUNGSBUCHUNG ======
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
    // Bestand anpassen
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

  // === UMSCHLAG/VERTRAGSMENGE/AMPEL
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
  function getKundenEinAusgang(sidx, kunde, typ, qualitaet) {
    return {
      eingang: getGesamtEingang(sidx, kunde, typ, qualitaet),
      ausgang: getGesamtAusgang(sidx, kunde, typ, qualitaet),
    };
  }
  function getVertragsAmpel(vertragsmenge, umschlag) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", info: "" };
    const pct = umschlag / vertragsmenge;
    if (pct < 0.8) return { color: "green", info: t[lang].ampelInfoGruen };
    if (pct < 1.0) return { color: "orange", info: t[lang].ampelInfoGelb };
    return { color: "red", info: t[lang].ampelInfoRot };
  }

  // ========== BERECHNUNGEN GESAMTÜBERSICHT
  function calculateStandort(s) {
    let stellplaetze = 0;
    let lagerflaeche = 0;
    let lagerkosten = 0;
    let umschlagMonat = 0;
    s.kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        const ein = getGesamtEingang(standorte.indexOf(s), kunde.name, lt.typ, lt.qualitaet);
        const aus = getGesamtAusgang(standorte.indexOf(s), kunde.name, lt.typ, lt.qualitaet);
        const umschlag = ein + aus;
        const palettenProSlot = lt.palettenProStellplatz || 30;
        const slots = palettenProSlot ? Math.ceil(umschlag / palettenProSlot) : 0;
        stellplaetze += slots;
        umschlagMonat += umschlag;
      })
    );
    lagerflaeche = +(stellplaetze * s.lagerflaecheProStellplatz).toFixed(2);
    lagerkosten = +(stellplaetze * s.lagerkostenProStellplatz).toFixed(2);
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

  // ========== STANDORTE ==========
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

  // ========== GRUNDBESTAND ==========
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

  // ========== GRUNDBESTAND: Bedarf nächster Monat ==========
  function bedarfNaechsterMonat(sidx, typ, qualitaet) {
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

  // ========== HAUPT-UI / RENDER ==========
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
        {/* LOGIN & REGISTRIERUNG */}
        {/* ... wie gehabt ... */}
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
        {/* Hier folgen Grundbestand, Kunden, Gesamtübersicht usw., analog deinem letzten Stand */}
        {/* Füge hier alle UI-Komponenten ein:
            - Grundbestand
            - Inventur
            - Kunden/Ladungsträger
            - Bewegung buchen
            - Clearing 
            - Protokoll
            - Gesamtübersicht 
            - Charts 
            - Footer 
        */}
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
          {/* Modal-Inhalt */}
          {/* ... wie gehabt ... */}
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
          {/* Modal-Inhalt */}
          {/* ... wie gehabt ... */}
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
              values={standorte.map((s) =>
                s.kunden.reduce(
                  (sum, k) =>
                    sum +
                    k.ladungstraeger.reduce(
                      (ltSum, lt) =>
                        ltSum +
                        getGesamtEingang(standorte.indexOf(s), k.name, lt.typ, lt.qualitaet) +
                        getGesamtAusgang(standorte.indexOf(s), k.name, lt.typ, lt.qualitaet),
                      0
                    ),
                  0
                )
              )}
              color="#0094cb"
              suffix=" Pal."
              max={Math.max(
                100,
                ...standorte.map((s) =>
                  s.kunden.reduce(
                    (sum, k) =>
                      sum +
                      k.ladungstraeger.reduce(
                        (ltSum, lt) =>
                          ltSum +
                          getGesamtEingang(standorte.indexOf(s), k.name, lt.typ, lt.qualitaet) +
                          getGesamtAusgang(standorte.indexOf(s), k.name, lt.typ, lt.qualitaet),
                        0
                      ),
                    0
                  )
                )
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
// ===== BarChart-Komponente =====
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

// ===== Helper-Funktionen =====

// Zähle Werktage zwischen zwei Daten
function diffWeekdays(start, end) {
  let count = 0;
  let current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

// Liefert ein Datum, das N Werktage nach einem Startdatum liegt
function onlyWeekdaysBetween(startDate, tage) {
  let count = 0;
  let current = new Date(startDate);
  while (count < tage) {
    current.setDate(current.getDate() + 1);
    if (current.getDay() !== 0 && current.getDay() !== 6) count++;
  }
  return current;
}

// ====== Export der Komponente ======
export default LagerTool;
