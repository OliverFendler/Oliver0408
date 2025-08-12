import React, { useState, useEffect, useRef } from "react";

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
    // Auth
    login: "Login",
    register: "Registrieren",
    haveAccount: "Schon einen Account?",
    noAccount: "Noch keinen Account?",
    switchToLogin: "Zum Login",
    switchToRegister: "Jetzt registrieren",
    nowRegister: "Jetzt registrieren",
    vorname: "Vorname",
    nachname: "Nachname",
    email: "E‑Mail",
    passwort: "Passwort",
    passwortWdh: "Passwort wiederholen",
    anmelden: "Anmelden",
    abmelden: "Abmelden",
    userLabel: "Angemeldet als:",
    regSuccess: "Registrierung erfolgreich. Bitte jetzt einloggen.",
    regExists: "Diese E‑Mail ist bereits registriert.",
    regInvalid: "Bitte alle Felder korrekt ausfüllen (Passwort min. 4 Zeichen).",
    regPwMismatch: "Passwörter stimmen nicht überein.",
    loginInvalid: "E‑Mail oder Passwort falsch.",
    passwortVergessen: "Passwort vergessen?",
    sicherheitsfrage: "Sicherheitsfrage",
    sicherheitsfrageWahl: "Bitte Frage wählen…",
    sicherheitsantwort: "Sicherheitsantwort",
    frage1: "Wie lautet der Geburtsort Ihrer Mutter?",
    frage2: "Wie hieß Ihr erstes Haustier?",
    frage3: "In welcher Stadt haben Sie Abitur gemacht?",
    resetStart: "Passwort zurücksetzen",
    resetWeiter: "Weiter",
    resetPruefen: "Antwort prüfen",
    neuesPasswort: "Neues Passwort",
    neuesPasswortWdh: "Neues Passwort wiederholen",
    resetSpeichern: "Passwort speichern",
    resetMailNichtGefunden: "E‑Mail nicht gefunden.",
    resetAntwortFalsch: "Sicherheitsantwort ist falsch.",
    resetPwKurz: "Neues Passwort zu kurz (min. 4 Zeichen).",
    resetPwMismatch: "Neue Passwörter stimmen nicht überein.",
    resetErfolg: "Passwort wurde aktualisiert. Bitte einloggen.",
    // Admin
    adminListeBtn: "Admin: Benutzerliste",
    adminTitle: "Registrierte Benutzer",
    registriertAm: "Registriert am",
    admin: "Admin",
    loeschen: "Löschen",
    wirklichLoeschen: "Benutzer wirklich löschen?",
    nichtSelbstLoeschen: "Eigenes Konto kann hier nicht gelöscht werden.",
    // App UI/Daten
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
    falsch: "Falsche Eingabe",
    grundbestandHinzufuegen: "Grundbestand hinzufügen",
    keineAenderungen: "Noch keine Änderungen erfasst.",
    summe: "Summe",
    entfernenStandort: "Standort entfernen",
    warnungBestand:
      "Warnung: Der tatsächliche Bestand ist nicht ausreichend für die geplanten Umschläge im nächsten Monat. Bitte rechtzeitig nachbestellen!",
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
    bewegungArt: "Art der Bewegung",
    protokollTitle: "Protokoll",
    schliessen: "Schließen",
    abbrechen: "Abbrechen",
    protokollPwReset: "Passwort zurückgesetzt",
    protokollUserGeloescht: "Benutzer gelöscht",

    // NEU: Bestandsprüfung + Quick‑Link
    bestandspruefung: "Bestandsprüfung",
    keinGrundbestandPassend: "Kein Grundbestand für {typ} / Qualität {qual} am Standort.",
    grundbestandAndereQualitaetVorhanden: "Nur andere Qualität vorhanden.",
    verfuegbarerBestand: "Verfügbarer Bestand",
    bestandFuerMonatFehlt: "Zu wenig Bestand für Monatsbedarf. Fehlmenge",
    bestandFuerVertragFehlt: "Zu wenig Bestand für Vertragsmenge. Fehlmenge",
    bewegungBestandFehlt:
      "Kein passender Bestand (Typ/Qualität) vorhanden – bitte zuerst Grundbestand anlegen bzw. beschaffen.",
    bewegungOhneGrundbestand:
      "Bitte zuerst Grundbestand/Inventur für diesen Standort anlegen.",
    quicklinkGrundbestand: "Grundbestand anlegen",
  },
  en: {
    // Auth
    login: "Login",
    register: "Register",
    haveAccount: "Already have an account?",
    noAccount: "No account yet?",
    switchToLogin: "Go to login",
    switchToRegister: "Register now",
    nowRegister: "Register now",
    vorname: "First name",
    nachname: "Last name",
    email: "Email",
    passwort: "Password",
    passwortWdh: "Repeat password",
    anmelden: "Sign in",
    abmelden: "Logout",
    userLabel: "Logged in as:",
    regSuccess: "Registration successful. Please log in.",
    regExists: "This email is already registered.",
    regInvalid: "Please fill all fields correctly (password min. 4 chars).",
    regPwMismatch: "Passwords do not match.",
    loginInvalid: "Invalid email or password.",
    passwortVergessen: "Forgot password?",
    sicherheitsfrage: "Security question",
    sicherheitsfrageWahl: "Pick a question…",
    sicherheitsantwort: "Security answer",
    frage1: "What is your mother's birthplace?",
    frage2: "What was the name of your first pet?",
    frage3: "In which city did you graduate high school?",
    resetStart: "Reset password",
    resetWeiter: "Next",
    resetPruefen: "Check answer",
    neuesPasswort: "New password",
    neuesPasswortWdh: "Repeat new password",
    resetSpeichern: "Save password",
    resetMailNichtGefunden: "Email not found.",
    resetAntwortFalsch: "Security answer is incorrect.",
    resetPwKurz: "New password too short (min. 4 chars).",
    resetPwMismatch: "New passwords do not match.",
    resetErfolg: "Password updated. Please log in.",
    // Admin
    adminListeBtn: "Admin: Users",
    adminTitle: "Registered users",
    registriertAm: "Registered at",
    admin: "Admin",
    loeschen: "Delete",
    wirklichLoeschen: "Delete user?",
    nichtSelbstLoeschen: "You cannot delete your own account here.",
    // App UI/Daten
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
    falsch: "Wrong input",
    grundbestandHinzufuegen: "Add initial stock",
    keineAenderungen: "No changes yet.",
    summe: "Sum",
    entfernenStandort: "Remove location",
    warnungBestand:
      "Warning: Actual stock is not sufficient for planned turnover next month. Please reorder in time!",
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
    bewegungArt: "Movement type",
    protokollTitle: "Audit Log",
    schliessen: "Close",
    abbrechen: "Cancel",
    protokollPwReset: "Password reset",
    protokollUserGeloescht: "User deleted",

    // NEW: stock checks + quick link
    bestandspruefung: "Stock check",
    keinGrundbestandPassend: "No initial stock for {typ} / quality {qual} at this location.",
    grundbestandAndereQualitaetVorhanden: "Only different quality available.",
    verfuegbarerBestand: "Available stock",
    bestandFuerMonatFehlt: "Insufficient stock for monthly demand. Shortfall",
    bestandFuerVertragFehlt: "Insufficient stock for contract volume. Shortfall",
    bewegungBestandFehlt:
      "No matching stock (type/quality) available – please create initial stock or procure first.",
    bewegungOhneGrundbestand:
      "Please create initial/inventory stock for this location first.",
    quicklinkGrundbestand: "Create initial stock",
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

/* =========================
    LocalStorage Keys
========================= */
const LS_USERS = "lager_users_v1";
const LS_STANDORTE = "lager_standorte_v2";
const LS_PROTOKOLL = "lager_protokoll_v2";

// =================== HAUPTKOMPONENTE ===================
export default function Home() {
  // State
  const [lang, setLang] = useState("de");
  const [user, setUser] = useState(null); // {firstName,lastName,email}
  const [protokoll, setProtokoll] = useState([]);
  const [showProtokoll, setShowProtokoll] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [standorte, setStandorte] = useState(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem(LS_STANDORTE);
      if (s) return JSON.parse(s);
    }
    return initialStandorte;
  });

  // Auth UI
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pw: "",
    pw2: "",
    q: "",
    a: "",
  });
  const [authMsg, setAuthMsg] = useState("");

  // Forgot Password Modal
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [fpUser, setFpUser] = useState(null);
  const [fpAnswer, setFpAnswer] = useState("");
  const [fpNewPw, setFpNewPw] = useState("");
  const [fpNewPw2, setFpNewPw2] = useState("");
  const [fpMsg, setFpMsg] = useState("");

  // Bewegungen
  const [tab, setTab] = useState(0);
  const [showBewegung, setShowBewegung] = useState(false);
  const [bewegungKunden, setBewegungKunden] = useState([
    { kunde: "", typ: "", qualitaet: "", menge: "" },
  ]);
  const [bewegungArt, setBewegungArt] = useState("Eingang");
  // bewegungMsg kann String oder Objekt {text, ok?, cta?} sein
  const [bewegungMsg, setBewegungMsg] = useState("");

  // Grundbestand‑Fokus (Quick‑Link)
  const gbRef = useRef(null);
  const [gbHighlight, setGbHighlight] = useState(false);

  // Laden/Speichern
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem(LS_PROTOKOLL);
      if (p) setProtokoll(JSON.parse(p));
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_STANDORTE, JSON.stringify(standorte));
    }
  }, [standorte]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_PROTOKOLL, JSON.stringify(protokoll));
    }
  }, [protokoll]);

  // Users laden/speichern
  function loadUsers() {
    const raw = localStorage.getItem(LS_USERS);
    return raw ? JSON.parse(raw) : [];
  }
  function saveUsers(users) {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  }

  // Admin Logik
  function isAdmin(u) {
    if (!u) return false;
    const users = loadUsers();
    return (users.length > 0 && users[0].email === u.email) || u.email.toLowerCase().startsWith("admin");
    }

  // Protokoll
  function addProtokoll(aktion, details) {
    setProtokoll((prev) => [
      ...prev,
      {
        zeit: new Date().toLocaleString(),
        user: user ? `${user.firstName} ${user.lastName} <${user.email}>` : "",
        aktion,
        details,
      },
    ]);
  }

  // Registration / Login
  function handleRegister() {
    setAuthMsg("");
    const fn = reg.firstName.trim();
    const ln = reg.lastName.trim();
    const em = reg.email.trim().toLowerCase();
    const pw = reg.pw;
    const pw2 = reg.pw2;
    const q = reg.q;
    const a = (reg.a || "").trim().toLowerCase();
    if (!fn || !ln || !em || pw.length < 4 || !q || !a) {
      setAuthMsg(t[lang].regInvalid);
      return;
    }
    if (pw !== pw2) {
      setAuthMsg(t[lang].regPwMismatch);
      return;
    }
    const users = loadUsers();
    if (users.some((u) => u.email === em)) {
      setAuthMsg(t[lang].regExists);
      return;
    }
    users.push({
      firstName: fn,
      lastName: ln,
      email: em,
      password: pw,
      question: q,
      answer: a,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    setAuthMsg(t[lang].regSuccess);
    setAuthMode("login");
    setLoginEmail(em);
    setLoginPw("");
    setReg({ firstName: "", lastName: "", email: "", pw: "", pw2: "", q: "", a: "" });
  }

  function handleLogin() {
    setAuthMsg("");
    const em = (loginEmail || "").trim().toLowerCase();
    const pw = loginPw;
    const users = loadUsers();
    const found = users.find((u) => u.email === em && u.password === pw);
    if (!found) {
      setAuthMsg(t[lang].loginInvalid);
      return;
    }
    setUser({ firstName: found.firstName, lastName: found.lastName, email: found.email });
    addProtokoll(t[lang].protokollLogin, found.email);
    setLoginPw("");
  }

  function handleLogout() {
    addProtokoll(t[lang].protokollLogout, user ? user.email : "");
    setUser(null);
  }

  // Quick‑Link: Grundbestand fokussieren
  function focusGrundbestand() {
    if (gbRef.current) {
      gbRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setGbHighlight(true);
      setTimeout(() => setGbHighlight(false), 1600);
    }
  }

  // Passwort vergessen – Steps
  function startForgot() {
    setFpStep(1);
    setFpEmail("");
    setFpUser(null);
    setFpAnswer("");
    setFpNewPw("");
    setFpNewPw2("");
    setFpMsg("");
    setShowForgot(true);
  }
  function fpNext() {
    setFpMsg("");
    const users = loadUsers();
    const em = (fpEmail || "").trim().toLowerCase();
    const u = users.find((x) => x.email === em);
    if (!u) {
      setFpMsg(t[lang].resetMailNichtGefunden);
      return;
    }
    setFpUser(u);
    setFpStep(2);
  }
  function fpCheckAnswer() {
    setFpMsg("");
    const ans = (fpAnswer || "").trim().toLowerCase();
    if (!fpUser || ans !== (fpUser.answer || "")) {
      setFpMsg(t[lang].resetAntwortFalsch);
      return;
    }
    setFpStep(3);
  }
  function fpSaveNew() {
    setFpMsg("");
    if (fpNewPw.length < 4) {
      setFpMsg(t[lang].resetPwKurz);
      return;
    }
    if (fpNewPw !== fpNewPw2) {
      setFpMsg(t[lang].resetPwMismatch);
      return;
    }
    const users = loadUsers();
    const idx = users.findIndex((x) => x.email === fpUser.email);
    if (idx >= 0) {
      users[idx].password = fpNewPw;
      saveUsers(users);
      addProtokoll(t[lang].protokollPwReset, fpUser.email);
      setFpMsg(t[lang].resetErfolg);
      setTimeout(() => {
        setShowForgot(false);
        setAuthMode("login");
        setLoginEmail(fpUser.email);
      }, 900);
    }
  }

  // ===== Helpers: Grundbestand & Validierung =====
  function getGbFor(sidx, typ, qualitaet) {
    const s = standorte[sidx];
    if (!s || !s.grundbestaende) return null;
    return (
      s.grundbestaende.find(
        (g) => g.typ === typ && (g.qualitaet || "") === (qualitaet || "")
      ) || null
    );
  }
  function getGbByTyp(sidx, typ) {
    const s = standorte[sidx];
    if (!s || !s.grundbestaende) return [];
    return s.grundbestaende.filter((g) => g.typ === typ);
  }
  function formatQual(q) {
    return q || (lang === "de" ? "–" : "–");
  }

  // Voll-Validierung eines Ladungsträgers
  function validateLt(sidx, lt) {
    const typ = lt.typ;
    const qual = lt.qualitaet || "";
    const gb = getGbFor(sidx, typ, qual);
    const gbListSameTyp = getGbByTyp(sidx, typ);

    const stock = gb ? Number(gb.inventur ?? gb.bestand ?? 0) : 0;
    const demandMonth = (Number(lt.mengeTag) || 0) * (Number(lt.arbeitstage) || 0);
    const contract = Number(lt.vertragsmenge) || 0;

    const okTypeQuali = !!gb;
    const okMonth = !gb ? false : stock >= demandMonth;
    const fehlmengeMonth = Math.max(0, demandMonth - stock);

    // Vertragsmenge nur prüfen, wenn gesetzt (>0)
    const okContract = !gb ? false : (contract > 0 ? stock >= contract : true);
    const fehlmengeContract = contract > 0 ? Math.max(0, contract - stock) : 0;

    const hasSameTypOtherQual = !gb && gbListSameTyp.length > 0;

    return {
      okTypeQuali,
      hasSameTypOtherQual,
      stock,
      demandMonth,
      fehlmengeMonth,
      okMonth,
      contract,
      fehlmengeContract,
      okContract,
    };
  }

  // Standortfunktionen
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
    const neuerName = `${t[lang].standort} ${standorte.length + 1}`;
    setStandorte([
      ...standorte,
      {
        name: neuerName,
        lagerflaecheProStellplatz: 1.8,
        lagerkostenProStellplatz: 7,
        grundbestaende: [],
        kunden: [],
        bewegungen: [],
      },
    ]);
    setTab(standorte.length);
    addProtokoll(t[lang].protokollStandortHinzu, neuerName);
  }
  function removeStandort(idx) {
    const removed = standorte[idx].name;
    const neu = [...standorte];
    neu.splice(idx, 1);
    setStandorte(neu);
    setTab(0);
    addProtokoll(t[lang].protokollStandortEntf, removed);
  }

  // Kunden/Ladungsträger/Grundbestand
  function addKunde(idx) {
    const neu = [...standorte];
    const neuerName = `${t[lang].name} ${neu[idx].kunden.length + 1}`;
    neu[idx].kunden.push({ name: neuerName, ladungstraeger: [], notizen: "" });
    setStandorte(neu);
    addProtokoll(t[lang].protokollKundeHinzu, `${neuerName} @${standorte[idx].name}`);
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

  function addLadungstraeger(sidx, kidx) {
    const gbList = standorte[sidx].grundbestaende || [];
    if (gbList.length === 0) {
      alert(t[lang].warnungLadungstraegerImGrundbestand);
      return;
    }
    // Neu: beim Anlegen automatisch den ersten verfügbaren Grundbestand (Typ+Qualität) vorbelegen
    const first = gbList[0];
    const neu = [...standorte];
    neu[sidx].kunden[kidx].ladungstraeger.push({
      typ: first?.typ || ladungstraegerTypen[0].label,
      qualitaet: first?.qualitaet || "",
      mengeTag: 0,
      arbeitstage: 20,
      tageClearingLadestelle: 10,
      tageClearingEntladestelle: 5,
      palettenProStellplatz: 30,
      vertragsmenge: "",
    });
    setStandorte(neu);
    addProtokoll(
      t[lang].protokollLadungsträgerHinzu,
      `Kunde: ${standorte[sidx].kunden[kidx].name}`
    );
  }

  function removeLadungstraeger(sidx, kidx, lidx) {
    const neu = [...standorte];
    const kName = neu[sidx].kunden[kidx].name;
    neu[sidx].kunden[kidx].ladungstraeger.splice(lidx, 1);
    setStandorte(neu);
    addProtokoll(t[lang].protokollLadungsträgerEntf, `Kunde: ${kName}`);
  }

  function updateLadungstraeger(sidx, kidx, lidx, feld, val) {
    const neu = [...standorte];
    if (
      feld === "mengeTag" ||
      feld === "arbeitstage" ||
      feld === "tageClearingLadestelle" ||
      feld === "tageClearingEntladestelle" ||
      feld === "palettenProStellplatz" ||
      feld === "vertragsmenge"
    ) {
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
    const gb = standorte[sidx].grundbestaende[gidx];
    if (!gb.inventur && gb.inventur !== 0) {
      alert(t[lang].inventurPflicht);
      return;
    }
    addProtokoll(
      t[lang].protokollInventur,
      `Standort: ${standorte[sidx].name}, Typ: ${gb.typ}, Qualität: ${gb.qualitaet}, Wert: ${gb.inventur}`
    );
  }

  // Berechnungen
  function getUmschlagMonatProTypQuali(sidx, typ, qualitaet) {
    let sum = 0;
    standorte[sidx].kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        if (lt.typ === typ && (lt.qualitaet || "") === (qualitaet || "")) {
          sum += (lt.mengeTag || 0) * (lt.arbeitstage || 0);
        }
      })
    );
    return sum;
  }
  function nextMonthBedarf(sidx, typ, qualitaet) {
    return getUmschlagMonatProTypQuali(sidx, typ, qualitaet);
  }
  function warnungBestandZuNiedrig(sidx, gidx) {
    const gb = standorte[sidx].grundbestaende[gidx];
    const inventur = Number(gb.inventur) || 0;
    const bedarf = nextMonthBedarf(sidx, gb.typ, gb.qualitaet);
    return inventur < bedarf;
  }
  function getVertragsAmpel(vertragsmenge, istmenge) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", info: "" };
    const pct = istmenge / vertragsmenge;
    if (pct < 0.8) return { color: "green", info: t[lang].ampelInfoGruen };
    if (pct < 1.0) return { color: "orange", info: t[lang].ampelInfoGelb };
    return { color: "red", info: t[lang].ampelInfoRot };
  }

  // Bewegungen
  function handleOpenBewegung(vorbelegterKunde = "") {
    const gb = standorte[tab].grundbestaende || [];
    if (!gb.length) {
      alert(t[lang].bewegungOhneGrundbestand);
      focusGrundbestand();
      return;
    }
    setBewegungKunden([{ kunde: vorbelegterKunde || "", typ: "", qualitaet: "", menge: "" }]);
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

    const grundbestaende = standorte[tab].grundbestaende || [];

    // Muss passenden Grundbestand (Typ/Qualität) geben
    for (const b of bewegungKunden) {
      const match = grundbestaende.find(
        (g) => g.typ === b.typ && (g.qualitaet || "") === (b.qualitaet || "")
      );
      if (!match) {
        setBewegungMsg({
          text: t[lang].bewegungBestandFehlt,
          cta: "grundbestand",
        });
        return;
      }
    }

    // Bei Ausgang muss der Bestand reichen
    if (bewegungArt === "Ausgang") {
      for (const b of bewegungKunden) {
        const gb = grundbestaende.find(
          (g) => g.typ === b.typ && (g.qualitaet || "") === (b.qualitaet || "")
        );
        if (!gb || gb.bestand < Number(b.menge)) {
          setBewegungMsg({
            text: t[lang].bewegungNichtGenugBestand,
            cta: "grundbestand",
          });
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
      user: user ? `${user.firstName} ${user.lastName} <${user.email}>` : "",
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

  function getKundenEinAusgang(sidx, kName, typ, qualitaet) {
    const standort = standorte[sidx];
    let eingang = 0,
      ausgang = 0;
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

  // Übersicht
  function calculateStandort(standort) {
    let stellplaetze = 0,
      lagerflaeche = 0,
      lagerkosten = 0,
      umschlagMonat = 0;
    standort.kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        const palettenMonat = (lt.mengeTag || 0) * (lt.arbeitstage || 0);
        umschlagMonat += palettenMonat;
        const divisor = lt.palettenProStellplatz || 1;
        const slots = Math.ceil(palettenMonat / divisor);
        stellplaetze += slots;
      })
    );
    lagerflaeche = +(stellplaetze * standort.lagerflaecheProStellplatz).toFixed(2);
    lagerkosten = +(stellplaetze * standort.lagerkostenProStellplatz).toFixed(2);
    return { stellplaetze, lagerflaeche, lagerkosten, umschlagMonat };
  }
  function calculateGesamt(standorteArr) {
    let lagerflaeche = 0,
      lagerkosten = 0,
      stellplaetze = 0;
    standorteArr.forEach((s) => {
      const r = calculateStandort(s);
      lagerflaeche += r.lagerflaeche;
      lagerkosten += r.lagerkosten;
      stellplaetze += r.stellplaetze;
    });
    return { lagerflaeche, lagerkosten, stellplaetze };
  }

  // === Login/Registration (mit Forgot)
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
          padding: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 4px 22px #0094cb44",
            padding: "30px 28px 24px 28px",
            textAlign: "center",
            width: 520,
            maxWidth: "96vw",
          }}
        >
          <img src="/LOGO_LCX_NEXUS.png" alt="LCX NEXUS" style={{ height: 96, marginBottom: 10 }} />
          {/* Toggle */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "8px 0 16px 0" }}>
            <button
              onClick={() => {
                setAuthMode("login");
                setAuthMsg("");
              }}
              style={{
                background: authMode === "login" ? "#0094cb" : "#fff",
                color: authMode === "login" ? "#fff" : "#083d95",
                border: "1.5px solid #0094cb",
                fontWeight: 800,
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 15,
                cursor: "pointer",
                width: 160,
              }}
            >
              {t[lang].login}
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setAuthMsg("");
              }}
              style={{
                background: authMode === "register" ? "#083d95" : "#fff",
                color: authMode === "register" ? "#fff" : "#083d95",
                border: "1.5px solid #083d95",
                fontWeight: 800,
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 15,
                cursor: "pointer",
                width: 160,
              }}
            >
              {t[lang].register}
            </button>
          </div>

          {authMode === "login" ? (
            <>
              <h2 style={{ color: "#0094cb", fontWeight: 900, margin: "0 0 10px 0" }}>
                {t[lang].login}
              </h2>
              <div style={{ display: "grid", gap: 10, marginBottom: 8 }}>
                <input
                  type="email"
                  placeholder={t[lang].email}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={inputStyle()}
                />
                <input
                  type="password"
                  placeholder={t[lang].passwort}
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  style={inputStyle()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </div>
              <div style={{ textAlign: "right", marginBottom: 12 }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    startForgot();
                  }}
                  style={{ color: "#0094cb", fontWeight: 700, fontSize: 14 }}
                >
                  {t[lang].passwortVergessen}
                </a>
              </div>
              {authMsg && <Msg text={authMsg} ok={authMsg === t[lang].regSuccess} />}
              <button onClick={handleLogin} style={primaryBtn()}>
                {t[lang].anmelden}
              </button>
              <div style={{ marginTop: 12, color: "#4a6079" }}>
                {t[lang].noAccount}{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAuthMode("register");
                    setAuthMsg("");
                  }}
                  style={{ color: "#0094cb", fontWeight: 800 }}
                >
                  {t[lang].switchToRegister}
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ color: "#083d95", fontWeight: 900, margin: "0 0 10px 0" }}>
                {t[lang].register}
              </h2>
              <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder={t[lang].vorname}
                  value={reg.firstName}
                  onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                  style={inputStyle()}
                />
                <input
                  type="text"
                  placeholder={t[lang].nachname}
                  value={reg.lastName}
                  onChange={(e) => setReg({ ...reg, lastName: e.target.value })}
                  style={inputStyle()}
                />
                <input
                  type="email"
                  placeholder={t[lang].email}
                  value={reg.email}
                  onChange={(e) => setReg({ ...reg, email: e.target.value })}
                  style={inputStyle()}
                />
                <select
                  value={reg.q}
                  onChange={(e) => setReg({ ...reg, q: e.target.value })}
                  style={{ ...inputStyle(), background: "#fff" }}
                >
                  <option value="">{t[lang].sicherheitsfrageWahl}</option>
                  <option value="q1">{t[lang].frage1}</option>
                  <option value="q2">{t[lang].frage2}</option>
                  <option value="q3">{t[lang].frage3}</option>
                </select>
                <input
                  type="text"
                  placeholder={t[lang].sicherheitsantwort}
                  value={reg.a}
                  onChange={(e) => setReg({ ...reg, a: e.target.value })}
                  style={inputStyle()}
                />
                <input
                  type="password"
                  placeholder={t[lang].passwort}
                  value={reg.pw}
                  onChange={(e) => setReg({ ...reg, pw: e.target.value })}
                  style={inputStyle()}
                />
                <input
                  type="password"
                  placeholder={t[lang].passwortWdh}
                  value={reg.pw2}
                  onChange={(e) => setReg({ ...reg, pw2: e.target.value })}
                  style={inputStyle()}
                />
              </div>
              {authMsg && <Msg text={authMsg} ok={authMsg === t[lang].regSuccess} />}
              <button onClick={handleRegister} style={secondaryBtn()}>
                {t[lang].nowRegister}
              </button>
              <div style={{ marginTop: 12, color: "#4a6079" }}>
                {t[lang].haveAccount}{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAuthMode("login");
                    setAuthMsg("");
                  }}
                  style={{ color: "#0094cb", fontWeight: 800 }}
                >
                  {t[lang].switchToLogin}
                </a>
              </div>
            </>
          )}
        </div>

        {/* ===== Forgot-Password Modal ===== */}
        {showForgot && (
          <Modal onClose={() => setShowForgot(false)}>
            <h2 style={{ color: "#0094cb", fontWeight: 900, marginTop: 0 }}>
              {t[lang].resetStart}
            </h2>

            {fpStep === 1 && (
              <>
                <input
                  type="email"
                  placeholder={t[lang].email}
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  style={{ ...inputStyle(), width: "100%", margin: "6px 0 10px" }}
                />
                {fpMsg && <Msg text={fpMsg} ok={false} />}
                <div style={{ textAlign: "right" }}>
                  <button onClick={fpNext} style={primaryBtn()}>
                    {t[lang].resetWeiter}
                  </button>
                </div>
              </>
            )}

            {fpStep === 2 && fpUser && (
              <>
                <div style={{ fontWeight: 700, color: "#083d95", marginBottom: 6 }}>
                  {t[lang].sicherheitsfrage}
                </div>
                <div
                  style={{
                    background: "#f6fcff",
                    border: "1px solid #b1dbef",
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  {fpUser.question === "q1"
                    ? t[lang].frage1
                    : fpUser.question === "q2"
                    ? t[lang].frage2
                    : t[lang].frage3}
                </div>
                <input
                  type="text"
                  placeholder={t[lang].sicherheitsantwort}
                  value={fpAnswer}
                  onChange={(e) => setFpAnswer(e.target.value)}
                  style={{ ...inputStyle(), width: "100%", marginBottom: 10 }}
                />
                {fpMsg && <Msg text={fpMsg} ok={false} />}
                <div style={{ textAlign: "right" }}>
                  <button onClick={fpCheckAnswer} style={primaryBtn()}>
                    {t[lang].resetPruefen}
                  </button>
                </div>
              </>
            )}

            {fpStep === 3 && (
              <>
                <input
                  type="password"
                  placeholder={t[lang].neuesPasswort}
                  value={fpNewPw}
                  onChange={(e) => setFpNewPw(e.target.value)}
                  style={{ ...inputStyle(), width: "100%", marginBottom: 8 }}
                />
                <input
                  type="password"
                  placeholder={t[lang].neuesPasswortWdh}
                  value={fpNewPw2}
                  onChange={(e) => setFpNewPw2(e.target.value)}
                  style={{ ...inputStyle(), width: "100%", marginBottom: 8 }}
                />
                {fpMsg && <Msg text={fpMsg} ok={fpMsg === t[lang].resetErfolg} />}
                <div style={{ textAlign: "right" }}>
                  <button onClick={fpSaveNew} style={primaryBtn()}>
                    {t[lang].resetSpeichern}
                  </button>
                </div>
              </>
            )}
          </Modal>
        )}
      </div>
    );

  // ==== App UI ====
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
      {/* Header */}
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
          style={{ height: 140, display: "block", margin: "0 auto 8px auto" }}
        />
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 54,
            display: "flex",
            alignItems: "center",
            gap: 8,
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
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            {lang === "de" ? "EN" : "DE"}
          </button>

          {/* Admin Button */}
          {isAdmin(user) && (
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                background: "#fff",
                border: "1px solid #083d95",
                color: "#083d95",
                padding: "6px 16px",
                fontWeight: 700,
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 15,
              }}
              title={t[lang].adminTitle}
            >
              {t[lang].adminListeBtn}
            </button>
          )}

          <span style={{ fontWeight: 800, color: "#0094cb", fontSize: 17, marginLeft: 4 }}>
            {user ? `${t[lang].userLabel} ${user.firstName} ${user.lastName}` : ""}
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

        {/* --------- Grundbestand/Inventur (mit Fokus/Highlight) --------- */}
        <div
          ref={gbRef}
          style={{
            background: gbHighlight ? "#fffbea" : "#f8fafc",
            borderRadius: 15,
            padding: "18px 22px",
            margin: "18px 0 16px 0",
            boxShadow: gbHighlight ? "0 0 0 3px #ffb902 inset, 0 2px 14px #ffdf9e" : "0 1px 8px #b9e6fa22",
            transition: "box-shadow 0.25s, background 0.25s",
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
                {lang === "de" ? "Noch kein Grundbestand erfasst." : "No initial stock recorded yet."}
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
                    border: `2.1px solid ${inventurWarnung ? "#e53454" : "#b3e6fa"}`,
                    borderRadius: 10,
                    padding: "7px 9px",
                  }}
                >
                  {/* Typ */}
                  <select
                    value={gb.typ}
                    onChange={(e) => updateGrundbestand(tab, gidx, "typ", e.target.value)}
                    style={selectStyle()}
                  >
                    {ladungstraegerTypen.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {/* Qualität, falls nötig */}
                  {ladungstraegerTypen.find((t0) => t0.label === gb.typ)?.qualitaeten.length ? (
                    <select
                      value={gb.qualitaet}
                      onChange={(e) => updateGrundbestand(tab, gidx, "qualitaet", e.target.value)}
                      style={{ ...selectStyle(), minWidth: 65 }}
                    >
                      <option value="">{lang === "de" ? "Qualität…" : "Quality…"}</option>
                      {ladungstraegerTypen
                        .find((t0) => t0.label === gb.typ)
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
                      onChange={(e) => updateGrundbestand(tab, gidx, "bestand", e.target.value)}
                      style={numberInput()}
                    />
                  </label>
                  {/* Inventur-Bestand */}
                  <label>
                    {t[lang].inventur}
                    <input
                      type="number"
                      value={gb.inventur}
                      onChange={(e) => updateGrundbestand(tab, gidx, "inventur", e.target.value)}
                      style={numberInput()}
                    />
                    <button style={smallBtn("#3194cb")} onClick={() => saveInventur(tab, gidx)}>
                      {t[lang].inventurSpeichern}
                    </button>
                  </label>
                  {/* Abweichung */}
                  <div
                    style={{
                      fontWeight: 800,
                      color: (gb.inventur || 0) - (gb.bestand || 0) < 0 ? "#e53454" : "#093",
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
                  {/* Entfernen */}
                  <button style={smallBtn("#e53454")} onClick={() => removeGrundbestand(tab, gidx)}>
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
                onChange={(e) => updateStandortFeld(tab, "lagerflaecheProStellplatz", e.target.value)}
                style={topNumber()}
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 16 }}>
              {t[lang].lagerkostenProStellplatz}
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={standorte[tab].lagerkostenProStellplatz}
                onChange={(e) => updateStandortFeld(tab, "lagerkostenProStellplatz", e.target.value)}
                style={{ ...topNumber(), width: 60 }}
              />
            </label>
          </div>

          <div>
            <h3 style={{ margin: "15px 0 10px 0", color: "#083d95", fontWeight: 900 }}>
              {t[lang].kunden}
            </h3>
            <button onClick={() => addKunde(tab)} style={addBtn()}>
              + {t[lang].kundeHinzufuegen}
            </button>
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
                    {/* Name + Entfernen */}
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
                      <button style={smallBtn("#e53454")} onClick={() => removeKunde(tab, kidx)}>
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
                          const istmenge = (lt.mengeTag || 0) * (lt.arbeitstage || 0);
                          const ampel = getVertragsAmpel(lt.vertragsmenge, istmenge);
                          const einAus = getKundenEinAusgang(tab, kunde.name, lt.typ, lt.qualitaet);

                          // NEU: Validierung bestandsseitig
                          const v = validateLt(tab, lt);

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
                                flexWrap: "wrap",
                              }}
                            >
                              {/* Typ */}
                              <select
                                value={lt.typ}
                                style={selectStyle()}
                                onChange={(e) => updateLadungstraeger(tab, kidx, lidx, "typ", e.target.value)}
                              >
                                {ladungstraegerTypen.map((opt) => (
                                  <option key={opt.label} value={opt.label}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {/* Qualität */}
                              {ladungstraegerTypen.find((t0) => t0.label === lt.typ)?.qualitaeten.length ? (
                                <select
                                  value={lt.qualitaet}
                                  style={{ ...selectStyle(), minWidth: 65 }}
                                  onChange={(e) => updateLadungstraeger(tab, kidx, lidx, "qualitaet", e.target.value)}
                                >
                                  <option value="">{lang === "de" ? "Qualität…" : "Quality…"}</option>
                                  {ladungstraegerTypen
                                    .find((t0) => t0.label === lt.typ)
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
                                  onChange={(e) => updateLadungstraeger(tab, kidx, lidx, "mengeTag", e.target.value)}
                                  style={numberInput()}
                                />
                              </label>
                              {/* Arbeitstage */}
                              <label>
                                {t[lang].arbeitstage}
                                <input
                                  type="number"
                                  value={lt.arbeitstage}
                                  onChange={(e) => updateLadungstraeger(tab, kidx, lidx, "arbeitstage", e.target.value)}
                                  style={{ ...numberInput(), width: 58 }}
                                />
                              </label>
                              {/* Tage Clearing Ladestelle */}
                              <label>
                                {t[lang].tageClearingLadestelle}
                                <input
                                  type="number"
                                  value={lt.tageClearingLadestelle}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "tageClearingLadestelle", e.target.value)
                                  }
                                  style={{ ...numberInput(), width: 65 }}
                                />
                              </label>
                              {/* Tage Clearing Entladestelle */}
                              <label>
                                {t[lang].tageClearingEntladestelle}
                                <input
                                  type="number"
                                  value={lt.tageClearingEntladestelle}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "tageClearingEntladestelle", e.target.value)
                                  }
                                  style={{ ...numberInput(), width: 65 }}
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
                                  style={{ ...numberInput(), width: 65 }}
                                />
                              </label>
                              {/* Vertragsmenge */}
                              <label>
                                {t[lang].vertragsmenge}
                                <input
                                  type="number"
                                  value={lt.vertragsmenge || ""}
                                  onChange={(e) =>
                                    updateLadungstraeger(tab, kidx, lidx, "vertragsmenge", e.target.value)
                                  }
                                  style={{ ...numberInput(), width: 95 }}
                                />
                              </label>

                              {/* Istmenge/Ampel */}
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
                                  {ampel.color === "red" ? "!" : ampel.color === "orange" ? "•" : ampel.color === "green" ? "✔" : ""}
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

                              {/* NEU: Bestandsprüfung / Fehlmengenanzeige */}
                              <div
                                style={{
                                  flexBasis: "100%",
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                  marginTop: 6,
                                  padding: "6px 8px",
                                  borderRadius: 8,
                                  background: v.okTypeQuali && v.okMonth && v.okContract ? "#e7faee" : "#ffe3e3",
                                  color: v.okTypeQuali && v.okMonth && v.okContract ? "#0a6e2b" : "#a3122a",
                                  fontWeight: 700,
                                  fontSize: 13.5,
                                }}
                                title={t[lang].bestandspruefung}
                              >
                                {!v.okTypeQuali && (
                                  <>
                                    <span>
                                      {t[lang].keinGrundbestandPassend
                                        .replace("{typ}", lt.typ)
                                        .replace("{qual}", formatQual(lt.qualitaet))}
                                    </span>
                                    {v.hasSameTypOtherQual && (
                                      <span style={{ color: "#b35a00" }}>
                                        — {t[lang].grundbestandAndereQualitaetVorhanden}
                                      </span>
                                    )}
                                  </>
                                )}

                                {v.okTypeQuali && (
                                  <>
                                    <span>
                                      {t[lang].verfuegbarerBestand}: <b>{v.stock}</b>
                                    </span>
                                    {v.demandMonth > 0 && !v.okMonth && (
                                      <span>
                                        — {t[lang].bestandFuerMonatFehlt}: <b>{v.fehlmengeMonth}</b>
                                      </span>
                                    )}
                                    {v.contract > 0 && !v.okContract && (
                                      <span>
                                        — {t[lang].bestandFuerVertragFehlt}: <b>{v.fehlmengeContract}</b>
                                      </span>
                                    )}
                                    {(v.okMonth && (v.contract === 0 || v.okContract)) && (
                                      <span>— OK</span>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Entfernen */}
                              <button style={smallBtn("#e53454")} onClick={() => removeLadungstraeger(tab, kidx, lidx)}>
                                {t[lang].entfernen}
                              </button>
                            </div>
                          );
                        })
                      )}

                      {/* Aktionen unter der Ladungsträgerliste */}
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 7 }}>
                        <button onClick={() => addLadungstraeger(tab, kidx)} style={smallBtn("#083d95")}>
                          + {t[lang].ladungstraegerHinzufuegen}
                        </button>
                        {/* „Bewegung buchen“ direkt daneben */}
                        <button
                          onClick={() => handleOpenBewegung(standorte[tab].kunden[kidx].name)}
                          style={{
                            background: "#fff",
                            color: "#083d95",
                            border: "1.5px solid #083d95",
                            fontWeight: 700,
                            borderRadius: 7,
                            padding: "6px 14px",
                            fontSize: 15,
                            cursor: "pointer",
                          }}
                          title={t[lang].bewegungBuchen}
                        >
                          {t[lang].bewegungBuchen}
                        </button>
                      </div>
                    </div>

                    {/* Notizen */}
                    <div style={{ marginTop: 10 }}>
                      <label style={{ fontWeight: 700 }}>{t[lang].notizen}</label>
                      <textarea
                        value={kunde.notizen}
                        onChange={(e) => updateKunde(tab, kidx, "notizen", e.target.value)}
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
        <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 27, marginBottom: 11 }}>
          {t[lang].gesamtuebersicht}
        </h2>
        <div style={{ fontSize: 17, marginBottom: 7, marginTop: 7 }}>
          {t[lang].lagerflaeche}: <b>{g.lagerflaeche} m²</b> | {t[lang].stellplaetze}: <b>{g.stellplaetze}</b> | {t[lang].lagerkosten}:{" "}
          <b>{g.lagerkosten.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</b>
        </div>
        <div style={{ display: "flex", gap: 52, marginTop: 22 }}>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0a1b3f", fontSize: 16 }}>{t[lang].chartsUmschlag}</b>
            <BarChart
              labels={standorte.map((s) => s.name)}
              values={standorte.map((s) => calculateStandort(s).umschlagMonat)}
              color="#0094cb"
              suffix=" Pal."
              max={Math.max(100, ...standorte.map((s) => calculateStandort(s).umschlagMonat))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0a1b3f", fontSize: 16 }}>{t[lang].chartsKosten}</b>
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

      {/* Bewegungsbuchung Modal */}
      {showBewegung && (
        <Modal onClose={() => setShowBewegung(false)}>
          <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 22, marginTop: 0, marginBottom: 14 }}>
            {t[lang].bewegungBuchen}
          </h2>
          <div style={{ marginBottom: 12 }}>
            <b>{t[lang].bewegungArt}</b>{" "}
            <select
              value={bewegungArt}
              onChange={(e) => setBewegungArt(e.target.value)}
              style={{ ...selectStyle(), background: "#e5f1fa" }}
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
                onChange={(e) => handleChangeBewegungKunde(idx, "kunde", e.target.value)}
                style={{ ...selectStyle(), minWidth: 110 }}
              >
                <option value="">{lang === "de" ? "Kunde wählen…" : "Select customer…"}</option>
                {standorte[tab].kunden.map((kc) => (
                  <option key={kc.name} value={kc.name}>
                    {kc.name}
                  </option>
                ))}
              </select>
              {/* Typ */}
              <select
                value={k.typ}
                onChange={(e) => handleChangeBewegungKunde(idx, "typ", e.target.value)}
                style={{ ...selectStyle(), minWidth: 120 }}
              >
                <option value="">{lang === "de" ? "Ladungsträgertyp…" : "Carrier type…"}</option>
                {ladungstraegerTypen.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Qualität (wenn nötig) */}
              {ladungstraegerTypen.find((t0) => t0.label === k.typ)?.qualitaeten.length ? (
                <select
                  value={k.qualitaet}
                  onChange={(e) => handleChangeBewegungKunde(idx, "qualitaet", e.target.value)}
                  style={{ ...selectStyle(), minWidth: 65 }}
                >
                  <option value="">{lang === "de" ? "Qualität…" : "Quality…"}</option>
                  {ladungstraegerTypen
                    .find((t0) => t0.label === k.typ)
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
                onChange={(e) => handleChangeBewegungKunde(idx, "menge", e.target.value)}
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
              {/* + / - */}
              {bewegungKunden.length > 1 && (
                <button style={smallBtn("#e53454")} onClick={() => handleRemoveBewegungKunde(idx)}>
                  −
                </button>
              )}
              {idx === bewegungKunden.length - 1 && (
                <button style={smallBtn("#0094cb")} onClick={handleAddBewegungKunde}>
                  +
                </button>
              )}
            </div>
          ))}

          {/* Meldung mit Quick‑Link */}
          {bewegungMsg && (
            <MsgAction
              text={typeof bewegungMsg === "string" ? bewegungMsg : bewegungMsg.text}
              ok={typeof bewegungMsg === "string" && bewegungMsg === t[lang].bewegungErfasst}
              ctaLabel={
                typeof bewegungMsg === "object" && bewegungMsg.cta === "grundbestand"
                  ? t[lang].quicklinkGrundbestand
                  : null
              }
              onCta={() => {
                setShowBewegung(false);
                setTimeout(() => focusGrundbestand(), 60);
              }}
            />
          )}

          <div style={{ textAlign: "center", marginTop: 11 }}>
            <button onClick={handleBuchenBewegung} style={primaryBtn()}>
              {t[lang].bewegungBuchen}
            </button>
            <button onClick={() => setShowBewegung(false)} style={outlineBtn()}>
              {t[lang].abbrechen}
            </button>
          </div>
        </Modal>
      )}

      {/* Protokoll Modal */}
      {showProtokoll && (
        <Modal onClose={() => setShowProtokoll(false)}>
          <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 24, marginTop: 0, marginBottom: 12 }}>
            {t[lang].protokollTitle}
          </h2>
          {protokoll.length === 0 ? (
            <div style={{ color: "#aaa", fontWeight: 600, marginTop: 22 }}>
              {t[lang].keineAenderungen}
            </div>
          ) : (
            <ul style={{ fontSize: 15, listStyle: "none", padding: 0 }}>
              {protokoll
                .slice()
                .reverse()
                .map((p, i) => (
                  <li key={i} style={{ marginBottom: 7 }}>
                    <span style={{ fontWeight: 600 }}>{p.zeit}</span>
                    {" – "}
                    <span style={{ fontWeight: 700 }}>{p.user}</span>
                    {": "}
                    <span>{p.aktion}</span>
                    <span style={{ color: "#555" }}>{p.details ? " (" + p.details + ")" : ""}</span>
                  </li>
                ))}
            </ul>
          )}
          <button style={primaryBtn()} onClick={() => setShowProtokoll(false)}>
            {t[lang].schliessen}
          </button>
        </Modal>
      )}

      {/* Admin: Benutzerliste */}
      {showAdmin && (
        <AdminUsersModal
          lang={lang}
          onClose={() => setShowAdmin(false)}
          t={t}
          currentUser={user}
          loadUsers={loadUsers}
          saveUsers={(u) => saveUsers(u)}
          onDelete={(deletedEmail) => addProtokoll(t[lang].protokollUserGeloescht, deletedEmail)}
        />
      )}
    </div>
  );
}

/* ===== Reusable UI Helpers ===== */
function Modal({ children, onClose }) {
  return (
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
      onClick={onClose}
    >
      <div
        style={{
          width: 620,
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
        {children}
        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button onClick={onClose} style={outlineBtn()}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminUsersModal({ lang, onClose, t, currentUser, loadUsers, saveUsers, onDelete }) {
  const [users, setUsers] = useState(loadUsers());
  function handleDelete(email) {
    if (currentUser && currentUser.email === email) {
      alert(t[lang].nichtSelbstLoeschen);
      return;
    }
    if (!confirm(t[lang].wirklichLoeschen)) return;
    const neu = users.filter((u) => u.email !== email);
    setUsers(neu);
    saveUsers(neu);
    onDelete(email);
  }
  return (
    <Modal onClose={onClose}>
      <h2 style={{ color: "#0094cb", fontWeight: 900, fontSize: 22, marginTop: 0, marginBottom: 12 }}>
        {t[lang].adminTitle}
      </h2>
      {users.length === 0 ? (
        <div style={{ color: "#aaa" }}>–</div>
      ) : (
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e3f1fb" }}>
                <th style={{ padding: "6px 4px" }}>{t[lang].vorname}</th>
                <th style={{ padding: "6px 4px" }}>{t[lang].nachname}</th>
                <th style={{ padding: "6px 4px" }}>{t[lang].email}</th>
                <th style={{ padding: "6px 4px" }}>{t[lang].sicherheitsfrage}</th>
                <th style={{ padding: "6px 4px" }}>{t[lang].registriertAm}</th>
                <th style={{ padding: "6px 4px" }}>{t[lang].admin}</th>
                <th style={{ padding: "6px 4px" }} />
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.email} style={{ borderBottom: "1px solid #f0f7fd" }}>
                  <td style={{ padding: "6px 4px" }}>{u.firstName}</td>
                  <td style={{ padding: "6px 4px" }}>{u.lastName}</td>
                  <td style={{ padding: "6px 4px" }}>{u.email}</td>
                  <td style={{ padding: "6px 4px" }}>
                    {u.question === "q1" ? t[lang].frage1 : u.question === "q2" ? t[lang].frage2 : t[lang].frage3}
                  </td>
                  <td style={{ padding: "6px 4px" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : "–"}
                  </td>
                  <td style={{ padding: "6px 4px" }}>
                    {i === 0 || (u.email || "").toLowerCase().startsWith("admin") ? "✔" : "–"}
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    <button onClick={() => handleDelete(u.email)} style={{ ...smallBtn("#e53454"), padding: "4px 10px" }}>
                      {t[lang].loeschen}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ color: "#5787b9", fontSize: 12, marginTop: 6 }}>
            Hinweis: Admin = erster registrierter Benutzer oder E‑Mail beginnt mit „admin“.
          </div>
        </div>
      )}
    </Modal>
  );
}

function Msg({ text, ok }) {
  return (
    <div
      style={{
        color: ok ? "#0a6e2b" : "#e53454",
        background: ok ? "#e7faee" : "#ffe3e3",
        borderRadius: 7,
        fontWeight: 700,
        fontSize: 15,
        padding: "8px 10px",
        margin: "0 0 9px 0",
      }}
    >
      {text}
    </div>
  );
}

// Meldungsleiste mit optionalem Quick‑Link‑Button
function MsgAction({ text, ok, ctaLabel, onCta }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        color: ok ? "#0a6e2b" : "#e53454",
        background: ok ? "#e7faee" : "#ffe3e3",
        borderRadius: 7,
        fontWeight: 700,
        fontSize: 15,
        padding: "8px 10px",
        margin: "0 0 9px 0",
      }}
    >
      <span style={{ flex: 1 }}>{text}</span>
      {ctaLabel && (
        <button
          onClick={onCta}
          style={{
            background: "#fff",
            color: "#083d95",
            border: "1.2px solid #083d95",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

function inputStyle() {
  return {
    fontSize: 16,
    border: "1.5px solid #0094cb",
    borderRadius: 10,
    padding: "10px 14px",
    background: "#f4fbfd",
    color: "#083d95",
    width: "100%",
  };
}
function primaryBtn() {
  return {
    background: "#0094cb",
    color: "#fff",
    fontWeight: 800,
    border: "none",
    borderRadius: 11,
    padding: "10px 40px",
    fontSize: 16,
    cursor: "pointer",
  };
}
function secondaryBtn() {
  return {
    background: "#083d95",
    color: "#fff",
    fontWeight: 800,
    border: "none",
    borderRadius: 11,
    padding: "10px 40px",
    fontSize: 16,
    cursor: "pointer",
  };
}
function outlineBtn() {
  return {
    background: "#fff",
    color: "#0094cb",
    fontWeight: 800,
    border: "1.2px solid #0094cb",
    borderRadius: 11,
    padding: "10px 34px",
    fontSize: 16,
    cursor: "pointer",
  };
}
function selectStyle() {
  return {
    fontWeight: 700,
    fontSize: 16,
    border: "1.2px solid #0094cb",
    borderRadius: 6,
    padding: "4px 13px",
    color: "#083d95",
    background: "#fff",
  };
}
function numberInput() {
  return {
    width: 80,
    marginLeft: 9,
    borderRadius: 5,
    border: "1.2px solid #0094cb",
    background: "#fff",
    padding: "2px 7px",
    fontWeight: 700,
    fontSize: 15,
    color: "#083d95",
  };
}
function smallBtn(bg) {
  return {
    background: bg,
    color: "#fff",
    fontWeight: 700,
    border: "none",
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: 15,
    marginLeft: 8,
    cursor: "pointer",
  };
}
function addBtn() {
  return {
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
  };
}
function topNumber() {
  return {
    width: 65,
    marginLeft: 11,
    borderRadius: 6,
    border: "1.2px solid #0094cb",
    background: "#e5f1fa",
    padding: "3px 8px",
    fontWeight: 700,
    fontSize: 15,
    color: "#083d95",
  };
}

// ===== BAR CHART =====
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
            title={(values[i] || 0) + suffix}
          />
          <div style={{ fontWeight: 700, fontSize: 16, color: "#083d95" }}>{lbl}</div>
          <div style={{ fontWeight: 500, color: "#3194cb", fontSize: 14 }}>
            {(values[i] || 0) + suffix}
          </div>
        </div>
      ))}
    </div>
  );
}
