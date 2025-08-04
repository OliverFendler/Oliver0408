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
    mengeTag: "Menge pro Tag",
    arbeitstage: "Arbeitstage/Monat",
    tageClearingLadestelle: "Tage Clearing Ladestelle",
    tageClearingEntladestelle: "Tage Clearing Entladestelle",
    palettenProStellplatz: "Paletten pro Stellplatz",
    vertragsmenge: "Vertragsmenge (Monat)",
    istmenge: "Tatsächlicher Umschlag (Monat)",
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
    bedarfNextMonth: "Bedarf nächster Monat",
    warnung: "Warnung: Bestand reicht nicht!",
    inventurSpeichern: "Inventur speichern",
    beschaffung: "Beschaffung",
    protokollAnzeigen: "Protokoll anzeigen",
    abmelden: "Abmelden",
    login: "Login",
    anmelden: "Anmelden",
    falsch: "Falsche Zugangsdaten",
    userLabel: "Angemeldet als:",
    grundbestandHinzufuegen: "Grundbestand hinzufügen",
    keineAenderungen: "Noch keine Änderungen erfasst.",
    summe: "Summe",
    entfernenStandort: "Standort entfernen",
    warnungBestand: "Warnung: Der tatsächliche Bestand ist nicht ausreichend für die geplanten Umschläge im nächsten Monat. Bitte rechtzeitig nachbestellen!",
    footer: "LCX NEXUS © 2025  –  Lager- & Bestandsplanungstool",
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
    einAusgangHistorie: "Ein-/Ausgang (gesamt, kumuliert)",
    ampelInfoGruen: "Vertragsmenge im grünen Bereich.",
    ampelInfoGelb: "Achtung: Vertragsmenge bald überschritten.",
    ampelInfoRot: "Warnung: Vertragsmenge überschritten!",
    warnungLadungstraegerImGrundbestand: "Es gibt für diesen Ladungsträger keinen Grundbestand/Inventur an diesem Standort. Bitte zuerst Grundbestand anlegen.",
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
    schliessen: "Schließen",
    bewegungArt: "Art",
    abbrechen: "Abbrechen",
    protokollTitle: "Protokoll",
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
    mengeTag: "Quantity per day",
    arbeitstage: "Workdays/month",
    tageClearingLadestelle: "Days to clearing (loading point)",
    tageClearingEntladestelle: "Days to clearing (unloading point)",
    palettenProStellplatz: "Pallets per slot",
    vertragsmenge: "Contract volume (month)",
    istmenge: "Actual turnover (month)",
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
    bedarfNextMonth: "Demand next month",
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
    summe: "Sum",
    entfernenStandort: "Remove location",
    warnungBestand: "Warning: Actual stock is not sufficient for planned turnover next month. Please reorder in time!",
    footer: "LCX NEXUS © 2025  –  Warehouse & Inventory Planning Tool",
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
    einAusgangHistorie: "In-/Outbound (total, cumulated)",
    ampelInfoGruen: "Contract volume OK.",
    ampelInfoGelb: "Attention: Contract volume nearly reached.",
    ampelInfoRot: "Warning: Contract volume exceeded!",
    warnungLadungstraegerImGrundbestand: "There is no initial/inventory stock for this load carrier at this location. Please create initial stock first.",
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
},

/* =========================
    INITIALSTANDORTE
========================= */
const initialStandorte = [
  {
    name: "Mettmann",
    lagerflaecheProStellplatz: 1.8,
    lagerkostenProStellplatz: 7,
    grundbestaende: [],
    kunden: [
      {
        name: "Musterkunde 1",
        ladungstraeger: [
          {
            typ: "EPAL 1 Europalette",
            qualitaet: "B",
            mengeTag: 500,
            arbeitstage: 20,
            tageClearingLadestelle: 10,
            tageClearingEntladestelle: 5,
            palettenProStellplatz: 30,
            vertragsmenge: 10000,
          },
        ],
        notizen: "",
      },
    ],
    bewegungen: [],
  },
];

export default function Home() {
  // Login State
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    vorname: "",
    nachname: "",
    email: "",
    pw: "",
    pw2: "",
  });
  const [registerMsg, setRegisterMsg] = useState("");

  // App State wie gehabt
  const [lang, setLang] = useState("de");
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

  // LocalStorage für Users und Protokoll laden/speichern
  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("lager_users_v2");
      if (u) setUsers(JSON.parse(u));
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lager_users_v2", JSON.stringify(users));
    }
  }, [users]);
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
      {
        zeit: new Date().toLocaleString(),
        user: user ? user.vorname + " " + user.nachname : "",
        aktion,
        details,
      },
    ]);
  }

  // Registrierung
  function handleRegister() {
    if (
      !registerData.vorname ||
      !registerData.nachname ||
      !registerData.email ||
      !registerData.pw ||
      !registerData.pw2
    ) {
      setRegisterMsg("Bitte alle Felder ausfüllen.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(registerData.email)) {
      setRegisterMsg("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    if (registerData.pw.length < 5) {
      setRegisterMsg("Passwort zu kurz (mind. 5 Zeichen).");
      return;
    }
    if (registerData.pw !== registerData.pw2) {
      setRegisterMsg("Passwörter stimmen nicht überein.");
      return;
    }
    if (users.some((u) => u.email === registerData.email.toLowerCase())) {
      setRegisterMsg("E-Mail ist bereits registriert.");
      return;
    }
    const newUser = {
      vorname: registerData.vorname.trim(),
      nachname: registerData.nachname.trim(),
      email: registerData.email.toLowerCase(),
      password: registerData.pw,
    };
    setUsers([...users, newUser]);
    setRegisterMsg("Registrierung erfolgreich! Bitte jetzt einloggen.");
    setRegisterData({
      vorname: "",
      nachname: "",
      email: "",
      pw: "",
      pw2: "",
    });
    setTimeout(() => {
      setRegistering(false);
      setRegisterMsg("");
    }, 1700);
  }

  // Login
  function handleLogin() {
    const found = users.find(
      (u) =>
        u.email === loginEmail.toLowerCase() && u.password === loginPassword
    );
    if (found) {
      setUser(found);
      setLoginEmail("");
      setLoginPassword("");
      addProtokoll(t[lang].protokollLogin, found.vorname + " " + found.nachname);
    } else {
      alert("Falsche Zugangsdaten.");
    }
  }
  function handleLogout() {
    addProtokoll(t[lang].protokollLogout, user ? user.vorname + " " + user.nachname : "");
    setUser(null);
  }

  // === Login/Register-Modal
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
            width: 360,
          }}
        >
          <img src="/LOGO_LCX_NEXUS.png" alt="LCX NEXUS" style={{ height: 96, marginBottom: 16 }} />
          {!registering ? (
            <>
              <h2 style={{ color: "#0094cb", fontWeight: 900, marginBottom: 10 }}>
                Login
              </h2>
              <div style={{ fontWeight: 600, color: "#083d95", marginBottom: 16 }}>
                Bitte E-Mail und Passwort eingeben
              </div>
              <input
                type="email"
                placeholder="E-Mail"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                style={{
                  fontSize: 19,
                  border: "1.5px solid #0094cb",
                  borderRadius: 10,
                  padding: "8px 28px",
                  marginBottom: 16,
                  width: 220,
                  textAlign: "center",
                  outline: "none",
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
              <br />
              <input
                type="password"
                placeholder="Passwort"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                style={{
                  fontSize: 19,
                  border: "1.5px solid #0094cb",
                  borderRadius: 10,
                  padding: "8px 28px",
                  marginBottom: 20,
                  width: 220,
                  textAlign: "center",
                  outline: "none",
                }}
                onKeyDown={e => {
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
                Login
              </button>
              <br />
              <button
                onClick={() => setRegistering(true)}
                style={{
                  background: "#083d95",
                  color: "#fff",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 24px",
                  fontSize: 15,
                  cursor: "pointer",
                  marginTop: 16,
                }}
              >
                Noch kein Account? Jetzt registrieren
              </button>
            </>
          ) : (
            <>
              <h2 style={{ color: "#0094cb", fontWeight: 900, marginBottom: 10 }}>
                Jetzt registrieren
              </h2>
              <div style={{ fontWeight: 600, color: "#083d95", marginBottom: 15 }}>
                Zugang anlegen
              </div>
              <input
                type="text"
                placeholder="Vorname"
                value={registerData.vorname}
                onChange={e =>
                  setRegisterData({ ...registerData, vorname: e.target.value })
                }
                style={{
                  fontSize: 18,
                  border: "1.3px solid #0094cb",
                  borderRadius: 9,
                  padding: "8px 21px",
                  marginBottom: 12,
                  width: 220,
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <br />
              <input
                type="text"
                placeholder="Nachname"
                value={registerData.nachname}
                onChange={e =>
                  setRegisterData({ ...registerData, nachname: e.target.value })
                }
                style={{
                  fontSize: 18,
                  border: "1.3px solid #0094cb",
                  borderRadius: 9,
                  padding: "8px 21px",
                  marginBottom: 12,
                  width: 220,
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <br />
              <input
                type="email"
                placeholder="E-Mail"
                value={registerData.email}
                onChange={e =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                style={{
                  fontSize: 18,
                  border: "1.3px solid #0094cb",
                  borderRadius: 9,
                  padding: "8px 21px",
                  marginBottom: 12,
                  width: 220,
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <br />
              <input
                type="password"
                placeholder="Passwort"
                value={registerData.pw}
                onChange={e =>
                  setRegisterData({ ...registerData, pw: e.target.value })
                }
                style={{
                  fontSize: 18,
                  border: "1.3px solid #0094cb",
                  borderRadius: 9,
                  padding: "8px 21px",
                  marginBottom: 12,
                  width: 220,
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <br />
              <input
                type="password"
                placeholder="Passwort wiederholen"
                value={registerData.pw2}
                onChange={e =>
                  setRegisterData({ ...registerData, pw2: e.target.value })
                }
                style={{
                  fontSize: 18,
                  border: "1.3px solid #0094cb",
                  borderRadius: 9,
                  padding: "8px 21px",
                  marginBottom: 12,
                  width: 220,
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <br />
              <button
                onClick={handleRegister}
                style={{
                  background: "#0094cb",
                  color: "#fff",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 42px",
                  fontSize: 17,
                  cursor: "pointer",
                  marginBottom: 6,
                  marginTop: 6,
                }}
              >
                Jetzt registrieren
              </button>
              <br />
              <button
                onClick={() => {
                  setRegistering(false);
                  setRegisterMsg("");
                  setRegisterData({
                    vorname: "",
                    nachname: "",
                    email: "",
                    pw: "",
                    pw2: "",
                  });
                }}
                style={{
                  background: "#fff",
                  color: "#0094cb",
                  fontWeight: 800,
                  border: "1.2px solid #0094cb",
                  borderRadius: 10,
                  padding: "8px 32px",
                  fontSize: 15,
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                Abbrechen
              </button>
              {registerMsg && (
                <div
                  style={{
                    marginTop: 16,
                    color: registerMsg.startsWith("Registrierung")
                      ? "#0a6e2b"
                      : "#e53454",
                    fontWeight: 700,
                    background: registerMsg.startsWith("Registrierung")
                      ? "#e7faee"
                      : "#ffe3e3",
                    padding: "10px",
                    borderRadius: 8,
                  }}
                >
                  {registerMsg}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );

   // ==== UI ================

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
      {/* Header - Logo doppelt so groß und zentriert */}
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
            {user ? ${t[lang].userLabel} ${user} : ""}
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
              const bedarfNextMonth = nextMonthBedarf(tab, gb.typ, gb.qualitaet);
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
                    border: 2.1px solid ${inventurWarnung ? "#e53454" : "#b3e6fa"},
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
                  {/* Bedarf */}
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
                          // Istmenge/Umschlag berechnen
                          const istmenge =
                            (lt.mengeTag || 0) * (lt.arbeitstage || 0);
                          const ampel = getVertragsAmpel(
                            lt.vertragsmenge,
                            istmenge
                          );
                          // Ein-/Ausgang gesamt
                          const einAus = getKundenEinAusgang(
                            tab,
                            kunde.name,
                            lt.typ,
                            lt.qualitaet
                          );
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
                              {/* Menge pro Tag */}
                              <label>
                                {t[lang].mengeTag}
                                <input
                                  type="number"
                                  value={lt.mengeTag}
                                  onChange={(e) =>
                                    updateLadungstraeger(
                                      tab,
                                      kidx,
                                      lidx,
                                      "mengeTag",
                                      e.target.value
                                    )
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
                              {/* Arbeitstage */}
                              <label>
                                {t[lang].arbeitstage}
                                <input
                                  type="number"
                                  value={lt.arbeitstage}
                                  onChange={(e) =>
                                    updateLadungstraeger(
                                      tab,
                                      kidx,
                                      lidx,
                                      "arbeitstage",
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    width: 58,
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
                              {/* Tage Clearing Ladestelle */}
                              <label>
                                {t[lang].tageClearingLadestelle}
                                <input
                                  type="number"
                                  value={lt.tageClearingLadestelle}
                                  onChange={(e) =>
                                    updateLadungstraeger(
                                      tab,
                                      kidx,
                                      lidx,
                                      "tageClearingLadestelle",
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
                              {/* Tage Clearing Entladestelle */}
                              <label>
                                {t[lang].tageClearingEntladestelle}
                                <input
                                  type="number"
                                  value={lt.tageClearingEntladestelle}
                                  onChange={(e) =>
                                    updateLadungstraeger(
                                      tab,
                                      kidx,
                                      lidx,
                                      "tageClearingEntladestelle",
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
                              {/* Paletten pro Stellplatz */}
                              <label>
                                {t[lang].palettenProStellplatz}
                                <input
                                  type="number"
                                  value={lt.palettenProStellplatz}
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
                              {/* Istmenge/Umschlag */}
                              <div
                                style={{
                                  marginLeft: 14,
                                  fontWeight: 800,
                                  fontSize: 15,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {t[lang].istmenge}: {istmenge}
                                {/* Ampel & Tooltip */}
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
                              {/* Ein-/Ausgang kumuliert */}
                              <div style={{ marginLeft: 13, fontSize: 13 }}>
                                <b>{t[lang].einAusgangHistorie}:</b>{" "}
                                <span style={{ color: "#3194cb" }}>
                                  {t[lang].bewegungEingang}: {einAus.eingang}
                                </span>{" "}
                                |{" "}
                                <span style={{ color: "#e53454" }}>
                                  {t[lang].bewegungAusgang}: {einAus.ausgang}
                                </span>
                              </div>
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
        </div>
      </div>

      {/* Gesamtübersicht & Charts */}
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
          {t[lang].lagerflaeche}: <b>{g.lagerflaeche} m²</b> | {t[lang].stellplaetze}: <b>{g.stellplaetze}</b> | {t[lang].lagerkosten}: <b>{g.lagerkosten.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</b>
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

      {/* Bewegungsbuchung-Button (unten rechts) */}
      <div
        style={{
          position: "fixed",
          right: 25,
          bottom: 92,
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
                  {standorte[tab].kunden.map((k) => (
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
              {t[lang].schliessen || "Schließen"}
            </button>
          </div>
        </div>
      )}
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
