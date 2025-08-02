import React, { useState, useEffect } from "react";

/* ======= Konfiguration Ladungsträgertypen ======= */
const ladungstraegerTypen = [
  { label: "EPAL 1 Europalette", qualitaeten: ["A", "B", "C"] },
  { label: "EPAL 6 Halbpalette", qualitaeten: [] },
  { label: "EPAL 7 Halbpalette", qualitaeten: [] },
  { label: "EPAL Gitterbox", qualitaeten: [] },
  { label: "EPAL Europalette QR", qualitaeten: ["A", "B", "C"] },
];

/* ======= Übersetzungen (DE/EN) ======= */
const t = {
  de: {
    standort: "Standort",
    lagerflaeche: "Lagerfläche (m²)",
    stellplaetze: "Benötigte Stellplätze",
    lagerkosten: "Monatliche Lagerkosten (€)",
    gesamtuebersicht: "Gesamtübersicht",
    grundbestand: "Grundbestand",
    inventur: "Inventur-Bestand",
    bedarfNextMonth: "Bedarf nächster Monat",
    abweichung: "Abweichung",
    warnung: "Warnung: Bestand reicht nicht!",
    entfernen: "Entfernen",
    kunden: "Kunden",
    kundeHinzufuegen: "Kunde hinzufügen",
    name: "Name",
    ladungstraegertyp: "Ladungsträgertyp",
    qualitaet: "Qualität",
    vertragsmenge: "Vertragsmenge (Monat)",
    palettenProStellplatz: "Paletten/Stellplatz",
    eingangGesamt: "Gesamt Eingang",
    ausgangGesamt: "Gesamt Ausgang",
    umschlagGesamt: "Umschlag gesamt",
    ampelGruen: "im grünen Bereich",
    ampelGelb: "Achtung: Vertragsmenge fast erreicht",
    ampelRot: "Vertragsmenge überschritten!",
    keinKunde: "Noch kein Kunde angelegt.",
    keinLadungstraeger: "Noch kein Ladungsträger angelegt.",
    bewegungBuchen: "Bewegung buchen",
    bewegungEingang: "Eingang",
    bewegungAusgang: "Ausgang",
    bewegungMenge: "Menge",
    protokollAnzeigen: "Protokoll anzeigen",
    footer: "LCX NEXUS © 2025  –  Lager- & Bestandsplanungstool",
    schliessen: "Schließen",
    keineAenderungen: "Noch keine Änderungen erfasst.",
    protokollTitle: "Protokoll",
    abmelden: "Abmelden",
    login: "Login",
    pinEingeben: "Bitte PIN eingeben",
    anmelden: "Anmelden",
    falsch: "Falsche PIN",
    userLabel: "Angemeldet als:",
  },
  en: {
    // Englisch kannst du selbst ergänzen, falls gewünscht
  },
};

/* ======= Initialdaten ======= */
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

/* ======= PIN User ======= */
const pinMap = {
  "1111": "Oliver",
  "2222": "Thomas",
};

/* ======= HAUPTKOMPONENTE ======= */
export default function Home() {
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

  // Protokoll laden/speichern
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

  function addProtokoll(aktion, details) {
    setProtokoll((prev) => [
      ...prev,
      { zeit: new Date().toLocaleString(), user, aktion, details },
    ]);
  }

  function handleLogin() {
    if (pinMap[pin]) {
      setUser(pinMap[pin]);
      setPin("");
      addProtokoll(t[lang].login, pinMap[pin]);
    } else {
      alert(t[lang].falsch);
    }
  }
  function handleLogout() {
    addProtokoll("Logout", user);
    setUser(null);
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

  function addKunde(idx) {
    const neu = [...standorte];
    neu[idx].kunden.push({
      name: t[lang].name + " " + (neu[idx].kunden.length + 1),
      ladungstraeger: [],
    });
    setStandorte(neu);
    addProtokoll("Kunde hinzugefügt", standorte[idx].name);
  }
  function removeKunde(sidx, kidx) {
    const removed = standorte[sidx].kunden[kidx].name;
    const neu = [...standorte];
    neu[sidx].kunden.splice(kidx, 1);
    setStandorte(neu);
    addProtokoll("Kunde entfernt", removed);
  }
  function updateKunde(sidx, kidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx][feld] = val;
    setStandorte(neu);
  }

  function addLadungstraeger(sidx, kidx) {
    // Nur wenn Grundbestand existiert
    if (standorte[sidx].grundbestaende.length === 0) {
      alert("Erst Grundbestand anlegen!");
      return;
    }
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.push({
      typ: ladungstraegerTypen[0].label,
      qualitaet: "",
      vertragsmenge: "",
      palettenProStellplatz: 30,
    });
    setStandorte(neu);
    addProtokoll("Ladungsträger hinzugefügt", `Kunde: ${standorte[sidx].kunden[kidx].name}`);
  }
  function removeLadungstraeger(sidx, kidx, lidx) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.splice(lidx, 1);
    setStandorte(neu);
    addProtokoll("Ladungsträger entfernt", `Kunde: ${standorte[sidx].kunden[kidx].name}`);
  }
  function updateLadungstraeger(sidx, kidx, lidx, feld, val) {
    const neu = [...standorte];
    if (feld === "vertragsmenge" || feld === "palettenProStellplatz") {
      neu[sidx].kunden[kidx].ladungstraeger[lidx][feld] = Number(val);
    } else {
      neu[sidx].kunden[kidx].ladungstraeger[lidx][feld] = val;
    }
    setStandorte(neu);
  }

  function addGrundbestand(sidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.push({
      typ: ladungstraegerTypen[0].label,
      qualitaet: "",
      bestand: 0,
      inventur: "",
    });
    setStandorte(neu);
    addProtokoll("Grundbestand geändert", standorte[sidx].name);
  }
  function removeGrundbestand(sidx, gidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.splice(gidx, 1);
    setStandorte(neu);
    addProtokoll("Grundbestand geändert", standorte[sidx].name);
  }
  function updateGrundbestand(sidx, gidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].grundbestaende[gidx][feld] = Number(val);
    setStandorte(neu);
    addProtokoll("Grundbestand geändert", standorte[sidx].name);
  }

  // ==== Hilfsfunktionen ====
  function getBedarfNaechsterMonat(sidx, typ, qualitaet) {
    // Summe aller Vertragsmengen für diesen Typ/Qualität im Standort
    let sum = 0;
    standorte[sidx].kunden.forEach((kunde) =>
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
    const bedarf = getBedarfNaechsterMonat(sidx, gb.typ, gb.qualitaet);
    return inventur < bedarf;
  }

  function getBewegungenKundeTypQuali(sidx, kName, typ, qualitaet) {
    // Summiere alle Bewegungen für diesen Kunden, Typ, Quali
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
  function getVertragsAmpel(vertragsmenge, umschlag) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", text: "" };
    const pct = umschlag / vertragsmenge;
    if (pct < 0.9) return { color: "green", text: t[lang].ampelGruen };
    if (pct < 1.0) return { color: "orange", text: t[lang].ampelGelb };
    return { color: "red", text: t[lang].ampelRot };
  }

  // Bewegungsbuchung
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
      setBewegungMsg("Kunde wählen!");
      valid = false;
    } else if (bewegungKunden.some((b) => !b.typ)) {
      setBewegungMsg("Typ wählen!");
      valid = false;
    } else if (bewegungKunden.some((b) => !b.menge || Number(b.menge) <= 0)) {
      setBewegungMsg("Menge > 0!");
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
          setBewegungMsg("Nicht genügend Bestand!");
          return;
        }
      }
    }

    // Buchen
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
      user,
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
    setBewegungMsg("Bewegung gebucht!");
    setTimeout(() => {
      setShowBewegung(false);
      setBewegungMsg("");
    }, 1100);
  }

  function calculateStandort(standort) {
    let stellplaetze = 0;
    let lagerflaeche = 0;
    let lagerkosten = 0;
    standort.kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        // Anzahl Slots: Summe aller Vertragsmengen, geteilt durch Paletten/Stellplatz
        const slots = Math.ceil((lt.vertragsmenge || 0) / (lt.palettenProStellplatz || 1));
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

  // ==== Login-Modal ====
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
          />
          <br />
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
            }}
          >
            {t[lang].anmelden}
          </button>
        </div>
      </div>
    );

  // ==== UI BEGIN ====
  const g = calculateGesamt(standorte);

  return (
    <div style={{ fontFamily: "Inter,sans-serif", background: "#f4fbfd", minHeight: "100vh", color: "#0a1b3f", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0 20px 0", position: "relative", marginBottom: 6 }}>
        <img src="/LOGO_LCX_NEXUS.png" alt="LCX NEXUS" style={{ height: 140, display: "block", margin: "0 auto 8px auto" }} />
        <div style={{ position: "absolute", right: 38, top: 54, display: "flex", alignItems: "center" }}>
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
          <span style={{ fontWeight: 800, color: "#0094cb", fontSize: 17, marginRight: 12 }}>
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
            + Standort hinzufügen
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
              Standort entfernen
            </button>
          )}
        </div>
        {/* Grundbestand / Inventur */}
        <div style={{ background: "#f8fafc", borderRadius: 15, padding: "18px 22px", margin: "18px 0 16px 0", boxShadow: "0 1px 8px #b9e6fa22" }}>
          <div style={{ fontWeight: 900, color: "#083d95", fontSize: 18, marginBottom: 7 }}>
            Grundbestand / Inventur {t[lang].standort}
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
            + Grundbestand hinzufügen
          </button>
          <div>
            {standorte[tab].grundbestaende.length === 0 && (
              <div style={{ color: "#aaa", margin: "13px 0 16px 0" }}>
                Noch kein Grundbestand erfasst.
              </div>
            )}
            {standorte[tab].grundbestaende.map((gb, gidx) => {
              const bedarfNextMonth = getBedarfNaechsterMonat(tab, gb.typ, gb.qualitaet);
              const inventurWarnung = warnungBestandZuNiedrig(tab, gidx);
              return (
                <div key={gidx} style={{ display: "flex", gap: 11, alignItems: "center", marginBottom: 9, background: inventurWarnung ? "#fdd" : "#f3faff", border: `2.1px solid ${inventurWarnung ? "#e53454" : "#b3e6fa"}`, borderRadius: 10, padding: "7px 9px" }}>
                  {/* Typ */}
                  <select
                    value={gb.typ}
                    onChange={(e) => updateGrundbestand(tab, gidx, "typ", e.target.value)}
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
                  {/* Qualität */}
                  {ladungstraegerTypen.find((t) => t.label === gb.typ)?.qualitaeten.length ? (
                    <select
                      value={gb.qualitaet}
                      onChange={(e) => updateGrundbestand(tab, gidx, "qualitaet", e.target.value)}
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
                      <option value="">Qualität…</option>
                      {ladungstraegerTypen.find((t) => t.label === gb.typ).qualitaeten.map((q) => (
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
                      onChange={(e) => updateGrundbestand(tab, gidx, "bestand", e.target.value)}
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
                  {/* Inventur */}
                  <label>
                    {t[lang].inventur}
                    <input
                      type="number"
                      value={gb.inventur}
                      onChange={(e) => updateGrundbestand(tab, gidx, "inventur", e.target.value)}
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
                  {/* Bedarf nächster Monat */}
                  <div style={{ marginLeft: 18, color: "#0094cb", fontWeight: 700, fontSize: 16 }}>
                    {t[lang].bedarfNextMonth}: {bedarfNextMonth}
                  </div>
                  {/* Warnung */}
                  {inventurWarnung && (
                    <div style={{ color: "#e53454", fontWeight: 900, marginLeft: 18, background: "#ffdada", borderRadius: 7, padding: "2px 8px" }}>
                      {t[lang].warnung}
                    </div>
                  )}
                  {/* Entfernen */}
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
        <div style={{ background: "#fff", borderRadius: 15, padding: "30px 32px", boxShadow: "0 1px 14px #8ed6fb22", marginBottom: 34, marginTop: 6 }}>
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
              Lagerfläche pro Stellplatz (m²)
              <input
                type="number"
                min={0.5}
                step={0.1}
                value={standorte[tab].lagerflaecheProStellplatz}
                onChange={(e) => updateStandortFeld(tab, "lagerflaecheProStellplatz", e.target.value)}
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
              Lagerkosten pro Stellplatz (€)
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={standorte[tab].lagerkostenProStellplatz}
                onChange={(e) => updateStandortFeld(tab, "lagerkostenProStellplatz", e.target.value)}
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
            <h3 style={{ margin: "15px 0 10px 0", color: "#083d95", fontWeight: 900 }}>
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
                    {/* Name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 10 }}>
                      <input
                        value={kunde.name}
                        onChange={(e) => updateKunde(tab, kidx, "name", e.target.value)}
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
                    {/* Ladungsträger */}
                    <div>
                      {kunde.ladungstraeger.length === 0 ? (
                        <div style={{ color: "#bbb", margin: "10px 0 12px 20px" }}>
                          {t[lang].keinLadungstraeger}
                        </div>
                      ) : (
                        kunde.ladungstraeger.map((lt, lidx) => {
                          // Bewegungen für diesen Kunden/Ladungsträger
                          const bews = getBewegungenKundeTypQuali(tab, kunde.name, lt.typ, lt.qualitaet);
                          const umschlag = bews.eingang + bews.ausgang;
                          const ampel = getVertragsAmpel(lt.vertragsmenge, umschlag);

                          return (
                            <div
                              key={lidx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 18,
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
                              {ladungstraegerTypen.find((t) => t.label === lt.typ)?.qualitaeten.length ? (
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
                                  <option value="">Qualität…</option>
                                  {ladungstraegerTypen.find((t) => t.label === lt.typ).qualitaeten.map((q) => (
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
                                    updateLadungstraeger(tab, kidx, lidx, "vertragsmenge", e.target.value)
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
                                  value={lt.palettenProStellplatz}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "palettenProStellplatz", e.target.value)
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
                              <div style={{ marginLeft: 12, color: "#3194cb", fontWeight: 700 }}>
                                {t[lang].eingangGesamt}: {bews.eingang}
                              </div>
                              {/* Gesamt Ausgang */}
                              <div style={{ color: "#e53454", fontWeight: 700 }}>
                                {t[lang].ausgangGesamt}: {bews.ausgang}
                              </div>
                              {/* Umschlag gesamt */}
                              <div style={{ color: "#0094cb", fontWeight: 700 }}>
                                {t[lang].umschlagGesamt}: {umschlag}
                              </div>
                              {/* Ampel + Hinweis */}
                              <div style={{ marginLeft: 14, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center" }}>
                                <span
                                  title={ampel.text}
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
                                  title={ampel.text}
                                >
                                  {ampel.color === "red"
                                    ? "!"
                                    : ampel.color === "orange"
                                    ? "•"
                                    : ampel.color === "green"
                                    ? "✔"
                                    : ""}
                                </span>
                                <span style={{ marginLeft: 7, fontWeight: 600, fontSize: 14 }}>{ampel.text}</span>
                              </div>
                              {/* Entfernen */}
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
                                onClick={() => removeLadungstraeger(tab, kidx, lidx)}
                              >
                                {t[lang].entfernen}
                              </button>
                            </div>
                          );
                        })
                      )}
                      <button
                        onClick={() => addLadungstraeger(tab, kidx)}
                        style={{
                          background: "#083d95",
                          color: "#fff",
                          fontWeight: 700,
                          border: "none",
                          borderRadius: 7,
                          padding: "6px 14px",
                          fontSize: 15,
                          marginTop: 7,
                          cursor: "pointer",
                        }}
                      >
                        + Ladungsträger hinzufügen
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gesamtübersicht über Footer */}
      <div style={{ margin: "34px 26px 0 26px", background: "#fff", borderRadius: 17, boxShadow: "0 2px 14px #0094cb22", padding: "28px 30px 35px 30px" }}>
        <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 27, marginBottom: 11 }}>
          {t[lang].gesamtuebersicht}
        </h2>
        <div style={{ fontSize: 17, marginBottom: 7, marginTop: 7 }}>
          {t[lang].lagerflaeche}: <b>{g.lagerflaeche} m²</b> | {t[lang].stellplaetze}: <b>{g.stellplaetze}</b> | {t[lang].lagerkosten}: <b>{g.lagerkosten.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</b>
        </div>
      </div>

      {/* Bewegungsbuchung-Button */}
      <div style={{ position: "fixed", right: 25, bottom: 92, zIndex: 999 }}>
        <button
          style={{
            background: "#fff",
            color: "#083d95",
            border: "1.5px solid #083d95",
            fontWeight: 700,
            borderRadius: 12,
            padding: "8px 21px",
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 1px 8px #b9e6fa22",
          }}
          onClick={handleOpenBewegung}
        >
          {t[lang].bewegungBuchen}
        </button>
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
      <div style={{
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
      }}>
        {t[lang].footer}
      </div>
      {/* ==== Bewegungsbuchungs-Modal ==== */}
      {showBewegung && (
        <div style={{
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
          <div style={{
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
            <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 22, marginTop: 0, marginBottom: 14 }}>
              {t[lang].bewegungBuchen}
            </h2>
            <div style={{ marginBottom: 12 }}>
              <b>Art:</b>{" "}
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
              <div key={idx} style={{
                background: "#f6fcff",
                border: "1px solid #b1dbef",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 12,
                display: "flex",
                gap: 9,
                alignItems: "center",
              }}>
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
                    Kunde wählen…
                  </option>
                  {standorte[tab].kunden
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
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
                    Ladungsträgertyp…
                  </option>
                  {ladungstraegerTypen.map((opt) => (
                    <option key={opt.label} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Qualität */}
                {ladungstraegerTypen.find((t) => t.label === k.typ)?.qualitaeten.length ? (
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
                      Qualität…
                    </option>
                    {ladungstraegerTypen.find((t) => t.label === k.typ).qualitaeten.map((q) => (
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
              <div style={{
                color: bewegungMsg === "Bewegung gebucht!" ? "#0a6e2b" : "#e53454",
                background: bewegungMsg === "Bewegung gebucht!" ? "#e7faee" : "#ffe3e3",
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 15,
                padding: "8px 10px",
                margin: "0 0 9px 0",
              }}>
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
                {t[lang].schliessen}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==== Protokoll-Modal ==== */}
      {showProtokoll && (
        <div style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          background: "#0008",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
          onClick={() => setShowProtokoll(false)}
        >
          <div style={{
            width: 590,
            maxWidth: "97vw",
            background: "#fff",
            borderRadius: 17,
            boxShadow: "0 5px 30px #0094cb44",
            padding: "32px 30px 24px 30px",
            fontFamily: "Inter,sans-serif",
            color: "#083d95",
            position: "relative",
          }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 21, marginTop: 0, marginBottom: 15 }}>
              {t[lang].protokollTitle}
            </h2>
            <div style={{ maxHeight: "51vh", overflowY: "auto", marginBottom: 12 }}>
              {protokoll.length === 0 && (
                <div style={{ color: "#bbb", margin: 18 }}>
                  {t[lang].keineAenderungen}
                </div>
              )}
              {protokoll.slice().reverse().map((p, idx) => (
                <div key={idx} style={{
                  padding: "6px 0",
                  borderBottom: "1px solid #e5f1fa",
                  fontSize: 15,
                }}>
                  <b style={{ color: "#0094cb" }}>{p.zeit}</b> — <b>{p.user}</b>: <span style={{ color: "#2e4b5a" }}>{p.aktion}</span> — <span style={{ color: "#555" }}>{p.details}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={() => setShowProtokoll(false)}
                style={{
                  background: "#0094cb",
                  color: "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 11,
                  padding: "10px 44px",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {t[lang].schliessen}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
