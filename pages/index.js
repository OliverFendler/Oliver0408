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

  // ========== BarChart-Komponente ==========
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

  // ========== UMSCHLAG + VERTRAGSMENGE (Ampel) ==========
  function getKundenEinAusgang(sidx, kunde, typ, qualitaet) {
    let eingang = 0, ausgang = 0;
    const standort = standorte[sidx];
    if (standort.bewegungen && standort.bewegungen.length) {
      standort.bewegungen.forEach((m) => {
        m.details.forEach((b) => {
          if (
            b.kunde === kunde &&
            b.typ === typ &&
            (b.qualitaet || "") === (qualitaet || "")
          ) {
            if (m.art === "Eingang") eingang += Number(b.menge) || 0;
            else if (m.art === "Ausgang") ausgang += Number(b.menge) || 0;
          }
        });
      });
    }
    return { eingang, ausgang };
  }
  function getVertragsAmpel(vertragsmenge, umschlag) {
    if (!vertragsmenge || vertragsmenge === 0) return { color: "gray", info: "" };
    const pct = umschlag / vertragsmenge;
    if (pct < 0.8) return { color: "green", info: t[lang].ampelInfoGruen };
    if (pct < 1.0) return { color: "orange", info: t[lang].ampelInfoGelb };
    return { color: "red", info: t[lang].ampelInfoRot };
  }

  // ========== BERECHNUNGEN GESAMT ==========
  function calculateStandort(s) {
    let stellplaetze = 0;
    let lagerflaeche = 0;
    let lagerkosten = 0;
    let umschlagMonat = 0;
    s.kunden.forEach((kunde) =>
      kunde.ladungstraeger.forEach((lt) => {
        const { eingang, ausgang } = getKundenEinAusgang(standorte.indexOf(s), kunde.name, lt.typ, lt.qualitaet);
        const umschlag = eingang + ausgang;
        umschlagMonat += umschlag;
        const palettenProSlot = lt.palettenProStellplatz || 30;
        const slots = palettenProSlot ? Math.ceil(umschlag / palettenProSlot) : 0;
        stellplaetze += slots;
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
        {/* Grundbestand, Kunden, Gesamtübersicht usw. hier wie gehabt, analog deinem letzten Stand */}

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
    </div>
  );
}
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
                {/* Kunden-Auswahl */}
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
                {/* Typ-Auswahl */}
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
