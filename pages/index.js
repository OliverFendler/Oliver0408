import React, { useState, useEffect } from "react";

/* Ladungsträger-Konfig */
const ladungstraegerTypen = [
  { label: "EPAL 1 Europalette", qualitaeten: ["A", "B", "C"] },
  { label: "EPAL 6 Halbpalette", qualitaeten: [] },
  { label: "EPAL 7 Halbpalette", qualitaeten: [] },
  { label: "EPAL Gitterbox", qualitaeten: [] },
  { label: "EPAL Europalette QR", qualitaeten: ["A", "B", "C"] },
];

/* Übersetzungen */
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
    palettenProStellplatz: "Paletten pro Stellplatz",
    eingangGesamt: "Gesamt Eingang",
    ausgangGesamt: "Gesamt Ausgang",
    umschlagGesamt: "Umschlag gesamt",
    ampelGruen: "Im Rahmen",
    ampelGelb: "Bald erreicht",
    ampelRot: "Vertragsmenge überschritten!",
    entfernen: "Entfernen",
    grundbestand: "Grundbestand",
    inventur: "Inventur-Bestand",
    bedarfNextMonth: "Bedarf nächster Monat",
    warnung: "Warnung: Bestand reicht nicht!",
    gesamtuebersicht: "Gesamtübersicht",
    lagerflaeche: "Lagerfläche (m²)",
    stellplaetze: "Benötigte Stellplätze",
    lagerkosten: "Monatliche Lagerkosten (€)",
    footer: "LCX NEXUS © 2025  –  Lager- & Bestandsplanungstool",
    summe: "Summe",
    keinKunde: "Noch kein Kunde angelegt.",
    keinLadungstraeger: "Noch kein Ladungsträger angelegt.",
    bewegungBuchen: "Bewegung buchen",
    bewegungEingang: "Eingang",
    bewegungAusgang: "Ausgang",
    bewegungKunde: "Kunde",
    bewegungTyp: "Ladungsträgertyp",
    bewegungQualitaet: "Qualität",
    bewegungMenge: "Menge",
    bewegungBuchenBtn: "Buchen",
    bewegungErfasst: "Bewegung erfolgreich gebucht!",
    bewegungNichtGenugBestand: "Nicht genügend Bestand für Ausgang!",
    bewegungKundePflicht: "Mindestens ein Kunde muss ausgewählt werden.",
    bewegungTypPflicht: "Typ und Qualität müssen gewählt sein.",
    bewegungMengePflicht: "Menge muss > 0 sein.",
    protokollAnzeigen: "Protokoll anzeigen",
    protokollTitle: "Änderungsprotokoll",
    keineAenderungen: "Noch keine Änderungen erfasst.",
    schliessen: "Schließen"
  }
};

/* Initialstandort */
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

/* PIN-User (Demo) */
const pinMap = { "1111": "Oliver" };

/* ============= HAUPTKOMPONENTE ============== */
export default function Home() {
  // State
  const [lang] = useState("de");
  const [user] = useState("Oliver"); // Login optional
  const [standorte, setStandorte] = useState(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lager_standorte_v5");
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
  const [protokoll, setProtokoll] = useState([]);
  const [showProtokoll, setShowProtokoll] = useState(false);

  // Load/Save localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lager_standorte_v5", JSON.stringify(standorte));
    }
  }, [standorte]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("lager_protokoll_v5");
      if (p) setProtokoll(JSON.parse(p));
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lager_protokoll_v5", JSON.stringify(protokoll));
    }
  }, [protokoll]);

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

  // Grundbestand
  function addGrundbestand(sidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.push({
      typ: ladungstraegerTypen[0].label,
      qualitaet: "",
      bestand: 0,
      inventur: "",
    });
    setStandorte(neu);
    addProtokoll("Grundbestand hinzugefügt", `@${standorte[sidx].name}`);
  }
  function removeGrundbestand(sidx, gidx) {
    const neu = [...standorte];
    neu[sidx].grundbestaende.splice(gidx, 1);
    setStandorte(neu);
    addProtokoll("Grundbestand entfernt", `@${standorte[sidx].name}`);
  }
  function updateGrundbestand(sidx, gidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].grundbestaende[gidx][feld] = feld === "bestand" || feld === "inventur" ? Number(val) : val;
    setStandorte(neu);
    addProtokoll("Grundbestand geändert", `@${standorte[sidx].name}`);
  }

  // Bedarf nächster Monat
  function getBedarfNaechsterMonat(sidx, typ, qualitaet) {
    let sum = 0;
    standorte[sidx].kunden.forEach((kunde) => {
      kunde.ladungstraeger.forEach((lt) => {
        if (lt.typ === typ && (lt.qualitaet || "") === (qualitaet || "")) {
          sum += Number(lt.vertragsmenge) || 0;
        }
      });
    });
    return sum;
  }
  function warnungBestandZuNiedrig(sidx, gidx) {
    const gb = standorte[sidx].grundbestaende[gidx];
    const inventur = Number(gb.inventur) || 0;
    const bedarf = getBedarfNaechsterMonat(sidx, gb.typ, gb.qualitaet);
    return inventur < bedarf;
  }

  // Kunden/Ladungsträger
  function addKunde(sidx) {
    const neu = [...standorte];
    neu[sidx].kunden.push({ name: t[lang].name + " " + (neu[sidx].kunden.length + 1), ladungstraeger: [] });
    setStandorte(neu);
    addProtokoll("Kunde hinzugefügt", `@${standorte[sidx].name}`);
  }
  function removeKunde(sidx, kidx) {
    const neu = [...standorte];
    neu[sidx].kunden.splice(kidx, 1);
    setStandorte(neu);
    addProtokoll("Kunde entfernt", `@${standorte[sidx].name}`);
  }
  function updateKunde(sidx, kidx, feld, val) {
    const neu = [...standorte];
    neu[sidx].kunden[kidx][feld] = val;
    setStandorte(neu);
  }
  function addLadungstraeger(sidx, kidx) {
    const gb = standorte[sidx].grundbestaende;
    if (!gb.length) {
      alert("Erst Grundbestand für diese Art/Qualität anlegen!");
      return;
    }
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.push({
      typ: gb[0].typ,
      qualitaet: gb[0].qualitaet,
      vertragsmenge: 0,
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
    neu[sidx].kunden[kidx].ladungstraeger[lidx][feld] = feld === "vertragsmenge" || feld === "palettenProStellplatz" ? Number(val) : val;
    setStandorte(neu);
  }

  // Bewegungen (Eingang/Ausgang)
  function getBewegungenKundeTypQuali(sidx, kName, typ, qualitaet) {
    const standort = standorte[sidx];
    let eingang = 0, ausgang = 0;
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        m.details.forEach((b) => {
          if (b.kunde === kName && b.typ === typ && (b.qualitaet || "") === (qualitaet || "")) {
            if (m.art === "Eingang") eingang += Number(b.menge) || 0;
            if (m.art === "Ausgang") ausgang += Number(b.menge) || 0;
          }
        });
      });
    }
    return { eingang, ausgang };
  }
  // Umschlag gesamt
  function getUmschlagGesamt(sidx, kName, typ, qualitaet) {
    const b = getBewegungenKundeTypQuali(sidx, kName, typ, qualitaet);
    return (b.eingang || 0) + (b.ausgang || 0);
  }
  // Ampel
  function getVertragsAmpel(vertragsmenge, umschlag) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", text: "" };
    const pct = umschlag / vertragsmenge;
    if (pct < 0.8) return { color: "green", text: t[lang].ampelGruen };
    if (pct < 1.0) return { color: "orange", text: t[lang].ampelGelb };
    return { color: "red", text: t[lang].ampelRot };
  }

  // Stellplätze/Gesamt
  function calcStellplaetze(standort) {
    let stellplaetze = 0;
    standort.kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        const umschlag = getUmschlagGesamt(standorte.indexOf(standort), kunde.name, lt.typ, lt.qualitaet);
        const slots = lt.palettenProStellplatz ? Math.ceil(umschlag / lt.palettenProStellplatz) : 0;
        stellplaetze += slots;
      })
    );
    return stellplaetze;
  }
  function calcGesamt(standorte) {
    let lagerflaeche = 0, lagerkosten = 0, stellplaetze = 0;
    standorte.forEach((s) => {
      const sStell = calcStellplaetze(s);
      stellplaetze += sStell;
      lagerflaeche += +(sStell * s.lagerflaecheProStellplatz);
      lagerkosten += +(sStell * s.lagerkostenProStellplatz);
    });
    return { lagerflaeche, lagerkosten, stellplaetze };
  }

  // ======= Bewegungsbuchung ===============
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
    setBewegungMsg(t[lang].bewegungErfasst);
    setTimeout(() => {
      setShowBewegung(false);
      setBewegungMsg("");
    }, 1200);
  }

  // ===
  const g = calcGesamt(standorte);

  return (
    <div
      style={{
        fontFamily: "Inter,sans-serif",
        background: "#f4fbfd",
        minHeight: "100vh",
        color: "#0a1b3f",
        paddingBottom: 110,
      }}
    >
      {/* Standorte-Tabs */}
      <div style={{ margin: "0 26px" }}>
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
        </div>

        {/* Grundbestand */}
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
                      <option value="">Qualität…</option>
                      {ladungstraegerTypen
                        .find((t) => t.label === gb.typ)
                        .qualitaeten.map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                    </select>
                  ) : null}
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
                  <div
                    style={{
                      fontWeight: 800,
                      color:
                        gb.inventur - gb.bestand < 0 ? "#e53454" : "#093",
                      marginLeft: 12,
                    }}
                  >
                    Abweichung: {(gb.inventur || 0) - (gb.bestand || 0)}
                  </div>
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
                      {t[lang].warnung}
                    </div>
                  )}
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

        {/* Kunden */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
            <h3 style={{ margin: 0, color: "#083d95", fontWeight: 900 }}>{t[lang].kunden}</h3>
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
          <div>
            {standorte[tab].kunden.length === 0 ? (
              <div style={{ color: "#aaa", margin: 18 }}>{t[lang].keinKunde}</div>
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
                  {/* Ladungsträger-Liste */}
                  <div>
                    {kunde.ladungstraeger.length === 0 ? (
                      <div style={{ color: "#bbb", margin: "10px 0 12px 20px" }}>
                        {t[lang].keinLadungstraeger}
                      </div>
                    ) : (
                      kunde.ladungstraeger.map((lt, lidx) => {
                        const beweg = getBewegungenKundeTypQuali(tab, kunde.name, lt.typ, lt.qualitaet);
                        const umschlag = (beweg.eingang || 0) + (beweg.ausgang || 0);
                        const ampel = getVertragsAmpel(lt.vertragsmenge, umschlag);
                        return (
                          <div
                            key={lidx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 13,
                              marginBottom: 7,
                              background: "#eaf7ff",
                              borderRadius: 8,
                              padding: "7px 8px",
                            }}
                          >
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
                                  updateLadungstraeger(tab, kidx, lidx, "vertragsmenge", e.target.value)
                                }
                                style={{
                                  width: 90,
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
                                value={lt.palettenProStellplatz || ""}
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
                            <div>
                              {t[lang].eingangGesamt}: <b style={{ color: "#138d30" }}>{beweg.eingang}</b>
                            </div>
                            {/* Gesamt Ausgang */}
                            <div>
                              {t[lang].ausgangGesamt}: <b style={{ color: "#e53454" }}>{beweg.ausgang}</b>
                            </div>
                            {/* Umschlag gesamt */}
                            <div>
                              {t[lang].umschlagGesamt}: <b>{umschlag}</b>
                            </div>
                            {/* Ampel & Meldung */}
                            <div style={{ marginLeft: 5, display: "flex", alignItems: "center" }}>
                              <span
                                title={ampel.text}
                                style={{
                                  display: "inline-block",
                                  marginRight: 5,
                                  width: 17,
                                  height: 17,
                                  borderRadius: "50%",
                                  background:
                                    ampel.color === "green"
                                      ? "#1ebc38"
                                      : ampel.color === "orange"
                                      ? "#ffb902"
                                      : ampel.color === "red"
                                      ? "#e53454"
                                      : "#cfcfcf",
                                  border: "1.5px solid #aaa",
                                  boxShadow: "0 1px 3px #0002",
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
                                  marginLeft: 3,
                                  fontSize: 13,
                                }}
                                title={ampel.text}
                              >
                                {ampel.text}
                              </span>
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

      {/* Bewegungsbuchung-Button */}
      <div
        style={{
          position: "fixed",
          right: 25,
          bottom: 100,
          zIndex: 999,
        }}
      >
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
        <button
          style={{
            background: "#fff",
            color: "#083d95",
            border: "1.5px solid #083d95",
            fontWeight: 700,
            borderRadius: 12,
            padding: "6px 16px",
            fontSize: 14,
            marginTop: 6,
            cursor: "pointer",
            marginLeft: 10,
            boxShadow: "0 1px 8px #b9e6fa22",
          }}
          onClick={() => setShowProtokoll(true)}
        >
          {t[lang].protokollAnzeigen}
        </button>
      </div>

      {/* Gesamtübersicht */}
      <div
        style={{
          margin: "34px 26px 0 26px",
          background: "#fff",
          borderRadius: 17,
          boxShadow: "0 2px 14px #0094cb22",
          padding: "28px 30px 35px 30px",
          position: "fixed",
          left: 0,
          width: "100vw",
          bottom: 40,
          zIndex: 99,
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
          {t[lang].lagerflaeche}: <b>{g.lagerflaeche} m²</b> | {t[lang].stellplaetze}: <b>{g.stellplaetze}</b> | {t[lang].lagerkosten}: <b>{g.lagerkosten.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</b>
        </div>
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
          position: "fixed",
          left: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        {t[lang].footer}
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
              <b>Art</b>{" "}
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
                  <option value="">Kunde wählen…</option>
                  {standorte[tab].kunden
                    .slice()
                    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
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
                  <option value="">Ladungsträgertyp…</option>
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
                    <option value="">Qualität…</option>
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
                  color: bewegungMsg === t[lang].bewegungErfasst ? "#0a6e2b" : "#e53454",
                  background: bewegungMsg === t[lang].bewegungErfasst ? "#e7faee" : "#ffe3e3",
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
                {t[lang].schliessen}
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
              {t[lang].protokollTitle}
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
              {t[lang].schliessen}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
