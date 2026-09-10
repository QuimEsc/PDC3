"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element, react-hooks/exhaustive-deps, react-hooks/purity, react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { activityById as activityByIdVa, curriculum as curriculumVa, curriculumStats, type Activity, type Unit } from "../lib/curriculum";
import { activityById as activityByIdEs, curriculum as curriculumEs } from "../lib/curriculum-es";
import { gradeLocally, type LocalGrade } from "../lib/checker";
import {
  apiCall, clearStudentSession, clearTeacherToken, createStudentSession, hasTeacherToken,
  isConfigured, isDemo, publishActivity, publishLive, readStudentSession, sendTeacherComment,
  startLive, stopLive, subscribeComment, subscribeLive, teacherLogin, type AiGrade, type Student,
  type StudentSession,
} from "../lib/services";

type View = "login" | "map" | "unit" | "activity" | "teacher";
type TeacherTab = "live" | "guide" | "reviews";
type GradeState = LocalGrade | (AiGrade & { status: AiGrade["status"] }) | null;
type Locale = "va" | "es";

type LocaleContextValue = {
  locale: Locale;
  curriculum: Unit[];
  activityById: Map<string, Activity>;
  tr: (valencian: string, spanish: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "va",
  curriculum: curriculumVa,
  activityById: activityByIdVa,
  tr: (valencian) => valencian,
});

const useLocale = () => useContext(LocaleContext);

const kindLabels = (locale: Locale): Record<Activity["kind"], string> => locale === "va" ? {
  numeric: "Càlcul", choice: "Tria", order: "Ordena", match: "Associa",
  open: "Resposta oberta", decision: "Decisió", mission: "Missió", text: "Text científic",
} : {
  numeric: "Cálculo", choice: "Elige", order: "Ordena", match: "Asocia",
  open: "Respuesta abierta", decision: "Decisión", mission: "Misión", text: "Texto científico",
};

const statusLabel = (status: string | undefined, locale: Locale) => (locale === "va" ? {
  WORKING: "Treballant", SUBMITTED: "Enviada", correct: "Superada",
  partial: "Parcial", incorrect: "A revisar", review: "Revisió docent",
} : {
  WORKING: "Trabajando", SUBMITTED: "Enviada", correct: "Superada",
  partial: "Parcial", incorrect: "A revisar", review: "Revisión docente",
})[status || ""] || (locale === "va" ? "Connectat" : "Conectado");

function LanguageToggle({ locale, onChange }: { locale: Locale; onChange: (locale: Locale) => void }) {
  const label = locale === "va" ? "Selecciona l’idioma" : "Selecciona el idioma";
  return <div className="language-toggle" role="group" aria-label={label}>
    <span aria-hidden="true">🌐</span>
    <button type="button" className={locale === "va" ? "active" : ""} aria-pressed={locale === "va"} onClick={() => onChange("va")}>VAL</button>
    <button type="button" className={locale === "es" ? "active" : ""} aria-pressed={locale === "es"} onClick={() => onChange("es")}>ES</button>
  </div>;
}

function Theory({ unit, compact = false }: { unit: Unit; compact?: boolean }) {
  const { tr } = useLocale();
  return (
    <section className={`theory ${compact ? "theory-compact" : ""}`} aria-labelledby="theory-title">
      <div className="section-heading">
        <div><span className="kicker">{tr("BASE TEÒRICA", "BASE TEÓRICA")}</span><h2 id="theory-title">{tr("Abans d’actuar, entén el sistema", "Antes de actuar, entiende el sistema")}</h2></div>
        <div className="vocabulary">{unit.keyVocabulary.map((word) => <span key={word}>{word}</span>)}</div>
      </div>
      <div className="theory-grid">
        {unit.theory.map((block, index) => (
          <article className="theory-card" key={block.title}>
            <span className="theory-number">{String(index + 1).padStart(2, "0")}</span>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
            {!compact && block.development && <p>{block.development}</p>}
            {!compact && block.example && <aside className="theory-example"><strong>{tr("Exemple aplicat", "Ejemplo aplicado")}</strong><span>{block.example}</span></aside>}
            {!compact && <ul>{block.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          </article>
        ))}
      </div>
      {!compact && unit.theoryImages && unit.theoryImages.length > 0 && (
        <div className="theory-figures">
          {unit.theoryImages.map((figure) => (
            <figure key={figure.src}>
              <img src={figure.src} alt={figure.alt} loading="lazy" />
              <figcaption>{figure.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function ScientificReading({ activity }: { activity: Activity }) {
  const { tr } = useLocale();
  if (!activity.scientificText) return null;
  return (
    <article className="scientific-reading">
      <header><span className="kicker">{tr("TEXT CIENTÍFIC PER COMENTAR", "TEXTO CIENTÍFICO PARA COMENTAR")}</span><h2>{activity.scientificText.title}</h2><p>{activity.scientificText.lead}</p></header>
      <div className="scientific-reading-body">
        {activity.scientificText.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <section className="reading-questions">
        <strong>{tr("Guia del comentari", "Guía del comentario")}</strong>
        <ol>{activity.scientificText.questions.map((question) => <li key={question}>{question}</li>)}</ol>
      </section>
    </article>
  );
}

function AnswerEditor({
  activity, answer, setAnswer, procedure, setProcedure, ordered, setOrdered, mapping, setMapping, disabled = false,
}: {
  activity: Activity; answer: string; setAnswer: (value: string) => void;
  procedure: string; setProcedure: (value: string) => void;
  ordered: string[]; setOrdered: (items: string[]) => void;
  mapping: Record<string, string>; setMapping: (map: Record<string, string>) => void; disabled?: boolean;
}) {
  const { tr } = useLocale();
  if (activity.kind === "choice") {
    return <div className="option-grid">{activity.options?.map((option) => (
      <button disabled={disabled} className={`option-button ${answer === option ? "selected" : ""}`} key={option} type="button" onClick={() => setAnswer(option)}>{option}</button>
    ))}</div>;
  }
  if (activity.kind === "order") {
    const move = (index: number, direction: -1 | 1) => {
      const next = [...ordered]; const target = index + direction;
      if (target < 0 || target >= next.length) return;
      [next[index], next[target]] = [next[target], next[index]]; setOrdered(next);
    };
    return <ol className="order-list">{ordered.map((item, index) => (
      <li key={item}><span>{item}</span><div>
        <button disabled={disabled || index === 0} type="button" onClick={() => move(index, -1)} aria-label={`${tr("Pujar", "Subir")} ${item}`}>↑</button>
        <button disabled={disabled || index === ordered.length - 1} type="button" onClick={() => move(index, 1)} aria-label={`${tr("Baixar", "Bajar")} ${item}`}>↓</button>
      </div></li>
    ))}</ol>;
  }
  if (activity.kind === "match") {
    return <div className="match-list">{Object.keys(activity.mapping || {}).map((item) => (
      <label key={item}><span>{item}</span><select disabled={disabled} value={mapping[item] || ""} onChange={(event) => setMapping({ ...mapping, [item]: event.target.value })}>
        <option value="">{tr("Tria una categoria", "Elige una categoría")}</option>
        {activity.groups?.map((group) => <option key={group}>{group}</option>)}
      </select></label>
    ))}</div>;
  }
  if (activity.kind === "numeric") {
    return <div className="numeric-editor">
      <label>{tr("Resultat", "Resultado")} <input disabled={disabled} inputMode="decimal" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={tr("Nombre", "Número")} /></label>
      <label>{tr("Operacions i procediment", "Operaciones y procedimiento")} <textarea disabled={disabled} value={procedure} onChange={(e) => setProcedure(e.target.value)} placeholder={tr("Escriu les dades, la fórmula, la substitució i la unitat…", "Escribe los datos, la fórmula, la sustitución y la unidad…")} rows={5} /></label>
    </div>;
  }
  return <label className="open-editor">{tr("La teua explicació", "Tu explicación")}
    <textarea disabled={disabled} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={tr("Escriu una afirmació, usa les dades i explica el raonament…", "Escribe una afirmación, usa los datos y explica el razonamiento…")} rows={9} maxLength={6000} />
    <span>{answer.length}/6000</span>
  </label>;
}

function ActivityViewer({
  activity, unit, onBack, preview = false, onComplete,
}: { activity: Activity; unit: Unit; onBack: () => void; preview?: boolean; onComplete?: (score: number) => void }) {
  const { locale, tr } = useLocale();
  const [answer, setAnswer] = useState("");
  const [procedure, setProcedure] = useState("");
  const [ordered, setOrdered] = useState<string[]>(() => [...(activity.items || [])].reverse());
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [grade, setGrade] = useState<GradeState>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAnswer(""); setProcedure(""); setMapping({}); setOrdered([...(activity.items || [])].reverse());
    setGrade(null); setAttempts(0); setShowHint(false);
    if (!preview) publishActivity(activity, unit);
  }, [activity, unit, preview]);

  const serialised = activity.kind === "order" ? ordered : activity.kind === "match" ? mapping : activity.kind === "numeric" ? { result: answer, procedure } : answer;
  useEffect(() => {
    if (preview) return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => publishLive({ answer: typeof serialised === "string" ? serialised : JSON.stringify(serialised), state: "WORKING" }), 450);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [answer, procedure, ordered, mapping, preview]);

  const submit = async () => {
    setLoading(true); setAttempts((value) => value + 1);
    try {
      let nextGrade: Exclude<GradeState, null>;
      if (["open", "decision", "mission", "text"].includes(activity.kind)) {
        if (answer.trim().length < 35) {
          nextGrade = { status: "incorrect", score: 1, feedback: tr("La resposta és massa breu per poder valorar el raonament.", "La respuesta es demasiado breve para valorar el razonamiento."), strengths: [], improvements: [tr("Desenvolupa una afirmació amb dades i explicació.", "Desarrolla una afirmación con datos y explicación.")], teacherReview: false };
        } else {
          const result = await apiCall("grade_open", { studentId: readStudentSession()?.studentId, activity, answer, unitTitle: unit.title, locale });
          nextGrade = result.grade;
        }
      } else {
        nextGrade = gradeLocally(activity, activity.kind === "order" ? ordered : activity.kind === "match" ? mapping : answer, locale);
      }
      setGrade(nextGrade);
      if (!preview) {
        await publishLive({ answer: typeof serialised === "string" ? serialised : JSON.stringify(serialised), state: "SUBMITTED", attempts: attempts + 1, score: nextGrade.score, correctionStatus: nextGrade.status, feedback: nextGrade.feedback });
        await apiCall("save_progress", {
          studentId: readStudentSession()?.studentId, activityId: activity.id, unitId: unit.id,
          answer: typeof serialised === "string" ? serialised : JSON.stringify(serialised),
          score: nextGrade.score, status: nextGrade.status, attempts: attempts + 1, feedback: nextGrade.feedback,
        });
        if (nextGrade.score >= 5) onComplete?.(nextGrade.score);
      }
    } catch (error) {
      setGrade({ status: "incorrect", score: 0, feedback: error instanceof Error ? error.message : tr("No s'ha pogut corregir.", "No se ha podido corregir.") });
    } finally { setLoading(false); }
  };

  const improvements = grade && "improvements" in grade ? grade.improvements : [];
  return (
    <main className="activity-page">
      <button className="text-button" type="button" onClick={onBack}>← {preview ? tr("Tornar a la guia", "Volver a la guía") : tr("Tornar a la unitat", "Volver a la unidad")}</button>
      <header className="activity-hero" style={{ "--unit": unit.color } as React.CSSProperties}>
        <div><span className="kicker">{unit.shortTitle} · {kindLabels(locale)[activity.kind]}</span><h1>{activity.title}</h1><p>{activity.explanation}</p></div>
        <div className="activity-code">{activity.id.toUpperCase()}</div>
      </header>
      <Theory unit={unit} compact />
      <section className="challenge-card">
        <div className="challenge-main">
          <span className="kicker">{tr("ACTIVITAT", "ACTIVIDAD")}</span>
          <ScientificReading activity={activity} />
          {activity.context && !activity.scientificText && <p className="context-box">{activity.context}</p>}
          {activity.data && <div className="data-strip">{activity.data.map((datum) => <span key={datum}>{datum}</span>)}</div>}
          <h2>{activity.prompt}</h2>
          <AnswerEditor activity={activity} answer={answer} setAnswer={setAnswer} procedure={procedure} setProcedure={setProcedure} ordered={ordered} setOrdered={setOrdered} mapping={mapping} setMapping={setMapping} disabled={preview && false} />
          {!preview && <div className="answer-actions">
            <button className="secondary-button" type="button" onClick={() => { setShowHint(true); publishLive({ helpCount: 1 }); }}>{tr("Necessite una pista", "Necesito una pista")}</button>
            <button className="primary-button" type="button" onClick={submit} disabled={loading}>{loading ? tr("Revisant…", "Revisando…") : tr("Comprovar resposta", "Comprobar respuesta")}</button>
          </div>}
          {preview && <p className="preview-notice">{tr("Vista de projecció: les respostes no s’envien ni alteren el progrés de l’alumnat.", "Vista de proyección: las respuestas no se envían ni alteran el progreso del alumnado.")}</p>}
          {showHint && <div className="hint"><strong>{tr("Pista", "Pista")}</strong><p>{activity.hint}</p></div>}
          {grade && <div className={`feedback feedback-${grade.status}`}>
            <div><span>{statusLabel(grade.status, locale)}</span><strong>{grade.score}/10</strong></div>
            <p>{grade.feedback}</p>
            {improvements.length > 0 && <ul>{improvements.map((item) => <li key={item}>{item}</li>)}</ul>}
          </div>}
        </div>
        <aside className="activity-aside">
          <span className="kicker">{tr("COM ES VALORA", "CÓMO SE VALORA")}</span>
          {activity.rubric ? <ul className="rubric">{activity.rubric.map((criterion) => <li key={criterion.label}><strong>{criterion.label} · {criterion.points} p</strong><span>{criterion.description}</span></li>)}</ul> :
            <ul className="rubric"><li><strong>{tr("Resultat", "Resultado")}</strong><span>{tr("Coincidència exacta o dins de la tolerància.", "Coincidencia exacta o dentro de la tolerancia.")}</span></li><li><strong>{tr("Procediment", "Procedimiento")}</strong><span>{tr("Dades, fórmula, operacions i unitat visibles.", "Datos, fórmula, operaciones y unidad visibles.")}</span></li></ul>}
        </aside>
      </section>
    </main>
  );
}

function StudentApp({ initialSession, onTeacher }: { initialSession: StudentSession | null; onTeacher: () => void }) {
  const { locale, curriculum, tr } = useLocale();
  const [view, setView] = useState<View>(initialSession ? "map" : "login");
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [, setSession] = useState<StudentSession | null>(initialSession);
  const [unit, setUnit] = useState<Unit>(curriculum[0]);
  const [activity, setActivity] = useState<Activity>(curriculum[0].activities[0]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [energy, setEnergy] = useState(0);
  const [streak, setStreak] = useState(0);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUnit((current) => curriculum.find((item) => item.id === current.id) || curriculum[0]);
    setActivity((current) => curriculum.flatMap((item) => item.activities).find((item) => item.id === current.id) || curriculum[0].activities[0]);
  }, [curriculum]);

  useEffect(() => {
    apiCall("list_students").then((data) => setStudents(data.students || [])).catch((e) => setNotice(e.message)).finally(() => setLoading(false));
  }, []);

  const connect = useCallback(async (nextSession: StudentSession) => {
    await startLive(nextSession, () => { setNotice(tr("La teua sessió s'ha obert en un altre dispositiu.", "Tu sesión se ha abierto en otro dispositivo.")); clearStudentSession(); setView("login"); });
    return subscribeComment(nextSession.studentId, (text) => setNotice(`${tr("Missatge del professorat", "Mensaje del profesorado")}: ${text}`));
  }, [tr]);

  useEffect(() => {
    if (!initialSession) return;
    const found = students.find((item) => item.id === initialSession.studentId);
    if (found) setStudent(found);
    let unsubscribe = () => {};
    connect(initialSession).then((fn) => { unsubscribe = fn; });
    return () => unsubscribe();
  }, [initialSession, students, connect]);

  const login = async (selected: Student) => {
    setLoading(true);
    try {
      const data = await apiCall("bootstrap", { studentId: selected.id });
      const nextSession = createStudentSession(selected);
      setStudent(data.student || selected); setEnergy(Number(data.student?.energy || 0)); setStreak(Number(data.student?.streak || 0));
      setCompleted(new Set((data.progress || []).filter((item: any) => Number(item.score) >= 5).map((item: any) => item.activityId)));
      setSession(nextSession); await connect(nextSession); setView("map");
      await apiCall("start_session", { studentId: selected.id, sessionId: nextSession.sessionId });
    } catch (error) { setNotice(error instanceof Error ? error.message : tr("No s'ha pogut entrar.", "No se ha podido entrar.")); }
    finally { setLoading(false); }
  };

  const openUnit = (nextUnit: Unit) => { setUnit(nextUnit); setView("unit"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openActivity = (nextActivity: Activity) => { setActivity(nextActivity); setView("activity"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const complete = (score: number) => { setCompleted((current) => new Set(current).add(activity.id)); setEnergy((value) => value + score); setStreak((value) => value + 1); };
  const logout = () => { stopLive(); clearStudentSession(); setStudent(null); setSession(null); setView("login"); };

  if (view === "login") return <main className="login-page">
    <section className="login-copy"><div className="brand-orbit">PDC<span>3</span></div><span className="kicker">{tr("ÀMBIT CIENTÍFIC · 3r ESO", "ÁMBITO CIENTÍFICO · 3.º ESO")}</span><h1>{tr("Entendre.", "Entender.")}<br />{tr("Provar.", "Probar.")}<br /><em>{tr("Decidir.", "Decidir.")}</em></h1><p>{tr("Un recorregut de ciència i matemàtiques fet per pensar, argumentar i avançar al teu ritme.", "Un recorrido de ciencia y matemáticas creado para pensar, argumentar y avanzar a tu ritmo.")}</p><div className="curriculum-numbers"><span><strong>{curriculumStats.units}</strong> {tr("unitats", "unidades")}</span><span><strong>{curriculumStats.activities}</strong> {tr("activitats base", "actividades base")}</span><span><strong>{curriculumStats.openActivities}</strong> {tr("respostes amb rúbrica", "respuestas con rúbrica")}</span></div></section>
    <section className="login-panel">
      <div className="login-panel-head"><span className="signal-dot" /><span>{isDemo() ? tr("Mode demostració", "Modo demostración") : tr("Grup connectat", "Grupo conectado")}</span></div>
      <h2>{tr("Tria el teu nom", "Elige tu nombre")}</h2><p>{tr("No necessites correu ni contrasenya.", "No necesitas correo ni contraseña.")}</p>
      {!isConfigured() && <div className="setup-banner">{tr("Encara no hi ha connexió configurada. Estàs veient dades de demostració.", "Todavía no hay ninguna conexión configurada. Estás viendo datos de demostración.")}</div>}
      <div className="student-list">{loading ? <p>{tr("Carregant noms…", "Cargando nombres…")}</p> : students.map((item) => <button key={item.id} type="button" onClick={() => login(item)}><span>{item.name.slice(0, 1)}</span>{item.name}<b>→</b></button>)}</div>
      <button className="teacher-entry" type="button" onClick={onTeacher}>{tr("Accés al seguiment docent", "Acceso al seguimiento docente")}</button>
    </section>
    {notice && <div className="toast">{notice}<button onClick={() => setNotice("")}>×</button></div>}
  </main>;

  if (view === "activity") return <><AppHeader student={student} energy={energy} streak={streak} onHome={() => setView("map")} onTeacher={onTeacher} onLogout={logout} /><ActivityViewer activity={activity} unit={unit} onBack={() => setView("unit")} onComplete={complete} />{notice && <div className="toast">{notice}<button onClick={() => setNotice("")}>×</button></div>}</>;

  return <><AppHeader student={student} energy={energy} streak={streak} onHome={() => setView("map")} onTeacher={onTeacher} onLogout={logout} />
    {view === "map" ? <main className="map-page">
      <header className="map-hero"><div><span className="kicker">{tr("RUTA D’APRENENTATGE", "RUTA DE APRENDIZAJE")}</span><h1>{tr("Laboratori de decisions", "Laboratorio de decisiones")}</h1><p>{tr("18 unitats connecten matemàtiques, biologia, geologia, física i química amb problemes que importen.", "18 unidades conectan matemáticas, biología, geología, física y química con problemas que importan.")}</p></div><div className="progress-ring"><strong>{completed.size}</strong><span>{tr("de", "de")} {curriculumStats.activities}</span></div></header>
      {[1, 2, 3].map((term) => <section className="term-section" key={term}><div className="term-title"><span>{tr("TRIMESTRE", "TRIMESTRE")} {term}</span><i /></div><div className="unit-grid">
        {curriculum.filter((item) => item.term === term).map((item) => {
          const done = item.activities.filter((entry) => completed.has(entry.id)).length;
          return <button className="unit-card" style={{ "--unit": item.color } as React.CSSProperties} key={item.id} onClick={() => openUnit(item)}>
            <span className="unit-index">{String(item.order).padStart(2, "0")}</span><span className="unit-icon">{item.icon}</span><h2>{item.shortTitle}</h2><p>{item.subtitle}</p><div><span>{done}/{item.activities.length}</span><i><b style={{ width: `${done / item.activities.length * 100}%` }} /></i></div>
          </button>;
        })}
      </div></section>)}
    </main> : <main className="unit-page">
      <button className="text-button" type="button" onClick={() => setView("map")}>← {tr("Tornar a la ruta", "Volver a la ruta")}</button>
      <header className="unit-hero" style={{ "--unit": unit.color } as React.CSSProperties}><div className="unit-big-icon">{unit.icon}</div><div><span className="kicker">{tr("UNITAT", "UNIDAD")} {String(unit.order).padStart(2, "0")} · {tr("TRIMESTRE", "TRIMESTRE")} {unit.term}</span><h1>{unit.title}</h1><p>{unit.subtitle}</p><div className="area-tags">{unit.areas.map((area) => <span key={area}>{area}</span>)}</div></div></header>
      <Theory unit={unit} />
      <section className="activities-section"><div className="section-heading"><div><span className="kicker">{tr("POSA-HO EN JOC", "PONLO EN JUEGO")}</span><h2>{tr("Activitats de la unitat", "Actividades de la unidad")}</h2></div><p>{tr("Objectius, dades, models, arguments i decisions. Cada format avalua una destresa diferent.", "Objetivos, datos, modelos, argumentos y decisiones. Cada formato evalúa una destreza diferente.")}</p></div>
        <div className="activity-list">{unit.activities.map((item, index) => <button key={item.id} className="activity-row" onClick={() => openActivity(item)}>
          <span className={`kind-icon kind-${item.kind}`}>{index + 1}</span><span><small>{kindLabels(locale)[item.kind]} · {item.area}</small><strong>{item.title}</strong><em>{item.prompt}</em></span>{completed.has(item.id) ? <b className="done-mark">✓</b> : <b>→</b>}
        </button>)}</div>
      </section>
    </main>}
    {notice && <div className="toast">{notice}<button onClick={() => setNotice("")}>×</button></div>}
  </>;
}

function AppHeader({ student, energy, streak, onHome, onTeacher, onLogout }: { student: Student | null; energy: number; streak: number; onHome: () => void; onTeacher: () => void; onLogout: () => void }) {
  const { tr } = useLocale();
  return <header className="app-header"><button className="brand" onClick={onHome}><span>PDC</span><b>{tr("Laboratori científic", "Laboratorio científico")}</b></button><nav><span>⚡ {energy}</span><span>↗ {streak}</span><button onClick={onTeacher}>{tr("Seguiment", "Seguimiento")}</button><button onClick={onLogout}>{student?.name} · {tr("Eixir", "Salir")}</button></nav></header>;
}

function TeacherApp({ onExit }: { onExit: () => void }) {
  const { locale, curriculum, activityById, tr } = useLocale();
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TeacherTab>("live");
  const [live, setLive] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(curriculum[0]);
  const [drawer, setDrawer] = useState<Activity | null>(null);
  const [projecting, setProjecting] = useState<Activity | null>(null);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    setSelectedUnit((current) => curriculum.find((item) => item.id === current.id) || curriculum[0]);
    setDrawer((current) => current ? activityById.get(current.id) || null : null);
    setProjecting((current) => current ? activityById.get(current.id) || null : null);
  }, [curriculum, activityById]);

  useEffect(() => { setAuthorized(hasTeacherToken()); }, []);
  useEffect(() => {
    if (!authorized) return;
    const unsubscribe = subscribeLive((items) => setLive(items.sort((a, b) => String(a.studentName).localeCompare(String(b.studentName)))));
    apiCall("teacher_dashboard").then((data) => setReviews(data.reviews || [])).catch(() => {});
    const timer = setInterval(() => setClock(Date.now()), 10000);
    return () => { unsubscribe(); clearInterval(timer); };
  }, [authorized]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    try { await teacherLogin(password, locale); setAuthorized(true); }
    catch (e) { setError(e instanceof Error ? e.message : tr("Accés denegat.", "Acceso denegado.")); }
  };
  const demoLive = isDemo() && live.length === 0 ? [
    { studentId: "A01", studentName: "Aina", unitTitle: tr("Dades sobre la salut", "Datos sobre la salud"), activityTitle: tr("Interpreta les dades", "Interpreta los datos"), question: tr("Què tenen igual i què és diferent?", "¿Qué tienen igual y qué es diferente?"), answer: tr("La mitjana és igual però el grup B varia més perquè el rang és 6.", "La media es igual, pero el grupo B varía más porque el rango es 6."), state: "WORKING", attempts: 1, helpCount: 0, updatedAt: Date.now() - 18000, activityId: "u05-05" },
    { studentId: "A02", studentName: "Biel", unitTitle: tr("Energia i electricitat", "Energía y electricidad"), activityTitle: tr("Càlcul amb procediment", "Cálculo con procedimiento"), question: tr("Un aparell funciona a 230 V i 2 A. Calcula la potència.", "Un aparato funciona a 230 V y 2 A. Calcula la potencia."), answer: "{\"result\":\"460\",\"procedure\":\"P=V·I=230·2=460 W\"}", state: "SUBMITTED", score: 10, attempts: 1, helpCount: 0, updatedAt: Date.now() - 42000, activityId: "u17-01" },
    { studentId: "A03", studentName: "Carla", unitTitle: tr("Investigar el món", "Investigar el mundo"), activityTitle: tr("Pensa com la ciència", "Piensa como la ciencia"), question: tr("Explica dos problemes del disseny.", "Explica dos problemas del diseño."), answer: tr("Hi ha poques persones i totes ja compren la beguda.", "Hay pocas personas y todas compran ya la bebida."), state: "WORKING", attempts: 2, helpCount: 1, updatedAt: Date.now() - 9000, activityId: "u01-06" },
  ] : live;

  if (!authorized) return <main className="teacher-login"><button className="text-button" onClick={onExit}>← {tr("Tornar a l’alumnat", "Volver al alumnado")}</button><form onSubmit={login}><div className="teacher-lock">⌁</div><span className="kicker">{tr("ESPAI DOCENT", "ESPACIO DOCENTE")}</span><h1>{tr("Seguiment i guia de classe", "Seguimiento y guía de clase")}</h1><p>{tr("La contrasenya és la que has definit a la pestanya «Contrasenya» de Google Sheets.", "La contraseña es la que has definido en la pestaña «Contraseña» de Google Sheets.")}</p><label>{tr("Contrasenya", "Contraseña")}<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" type="submit">{tr("Entrar al seguiment", "Entrar al seguimiento")}</button>{isDemo() && <small>{tr("En demostració, qualsevol contrasenya no buida permet entrar.", "En demostración, cualquier contraseña no vacía permite entrar.")}</small>}</form></main>;

  if (projecting) {
    const projectionUnit = curriculum.find((item) => item.id === projecting.unitId)!;
    return <div className="projection-shell"><div className="projection-bar"><strong>{tr("Vista alumne · projecció", "Vista del alumno · proyección")}</strong><button onClick={() => setProjecting(null)}>{tr("Tancar projecció", "Cerrar proyección")} ×</button></div><ActivityViewer activity={projecting} unit={projectionUnit} preview onBack={() => setProjecting(null)} /></div>;
  }

  const openFromLive = (item: any) => {
    const found = activityById.get(item.activityId);
    if (found) { setSelectedUnit(curriculum.find((entry) => entry.id === found.unitId)!); setDrawer(found); }
  };
  const send = async (studentId: string) => { if (!comment.trim()) return; await sendTeacherComment(studentId, comment.trim()); setComment(""); };

  return <div className="teacher-shell">
    <aside className="teacher-sidebar">
      <div className="teacher-brand"><span>PDC</span><div><strong>{tr("Taula docent", "Panel docente")}</strong><small>{tr("Àmbit científic", "Ámbito científico")}</small></div></div>
      <nav>
        <button className={tab === "live" ? "active" : ""} onClick={() => setTab("live")}><span>●</span> {tr("En directe", "En directo")} <b>{demoLive.length}</b></button>
        <button className={tab === "guide" ? "active" : ""} onClick={() => setTab("guide")}><span>▤</span> {tr("Guia de classe", "Guía de clase")}</button>
        <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}><span>◇</span> {tr("Revisions IA", "Revisiones IA")} <b>{reviews.length}</b></button>
      </nav>
      <div className="sidebar-stats"><span><strong>{curriculumStats.units}</strong> {tr("unitats", "unidades")}</span><span><strong>{curriculumStats.activities}</strong> {tr("activitats", "actividades")}</span><span><strong>{curriculumStats.openActivities}</strong> {tr("amb IA", "con IA")}</span></div>
      <button className="logout-teacher" onClick={() => { clearTeacherToken(); onExit(); }}>{tr("Tancar sessió docent", "Cerrar sesión docente")}</button>
    </aside>
    <main className="teacher-main">
      {tab === "live" && <><header className="teacher-header"><div><span className="kicker">{tr("SEGUIMENT EN TEMPS REAL", "SEGUIMIENTO EN TIEMPO REAL")}</span><h1>{tr("Què està fent cada alumne", "Qué está haciendo cada alumno")}</h1><p>{tr("Només es mostra activitat, resposta i estat; la teoria queda fora de les targetes.", "Solo se muestra actividad, respuesta y estado; la teoría queda fuera de las tarjetas.")}</p></div><div className="live-legend"><span><i className="fresh" />{tr("Ara", "Ahora")}</span><span><i className="warm" />{tr("Fa poc", "Hace poco")}</span><span><i className="cold" />{tr("Sense activitat", "Sin actividad")}</span></div></header>
        <div className="live-grid">{demoLive.length === 0 ? <div className="empty-live"><span>⌁</span><h2>{tr("Encara no hi ha alumnat connectat", "Todavía no hay alumnado conectado")}</h2><p>{tr("Les targetes apareixeran quan entren amb el seu nom.", "Las tarjetas aparecerán cuando entren con su nombre.")}</p></div> : demoLive.map((item) => {
          const age = clock - Number(item.updatedAt || 0); const freshness = age < 35000 ? "fresh" : age < 180000 ? "warm" : "cold";
          return <article className={`live-card ${freshness}`} key={item.studentId} onClick={() => openFromLive(item)}>
            <header><div className="student-avatar">{String(item.studentName || "?").slice(0, 1)}</div><div><h2>{item.studentName}</h2><span><i /> {statusLabel(item.state, locale)} · {Math.max(0, Math.round(age / 1000))} s</span></div><b>{item.score !== undefined ? `${item.score}/10` : "→"}</b></header>
            <div className="live-unit"><small>{item.unitTitle}</small><strong>{item.activityTitle}</strong></div>
            <div className="live-question"><span>{tr("Pregunta", "Pregunta")}</span><p>{item.question || tr("Carregant activitat…", "Cargando actividad…")}</p></div>
            <div className="live-answer"><span>{tr("Resposta / solució proposada", "Respuesta / solución propuesta")}</span><p>{item.answer || tr("Encara no ha escrit res.", "Todavía no ha escrito nada.")}</p></div>
            <footer><span>{item.attempts || 0} {tr("intents", "intentos")}</span><span>{item.helpCount || 0} {tr("ajudes", "ayudas")}</span><button type="button">{tr("Obrir guia", "Abrir guía")} →</button></footer>
          </article>;
        })}</div></>}
      {tab === "guide" && <><header className="teacher-header"><div><span className="kicker">{tr("GUIA COMPLETA", "GUÍA COMPLETA")}</span><h1>{tr("Prepara, explica i projecta", "Prepara, explica y proyecta")}</h1><p>{tr("La mateixa teoria i activitats que veu l’alumnat, amb solucions i rúbriques docents.", "La misma teoría y actividades que ve el alumnado, con soluciones y rúbricas docentes.")}</p></div></header>
        <div className="guide-layout"><div className="guide-units">{curriculum.map((item) => <button className={selectedUnit.id === item.id ? "active" : ""} key={item.id} onClick={() => setSelectedUnit(item)}><span style={{ background: item.color }}>{item.icon}</span><div><small>U{String(item.order).padStart(2, "0")} · T{item.term}</small><strong>{item.shortTitle}</strong></div><b>›</b></button>)}</div>
          <div className="guide-content"><header style={{ "--unit": selectedUnit.color } as React.CSSProperties}><span className="kicker">{tr("UNITAT", "UNIDAD")} {String(selectedUnit.order).padStart(2, "0")}</span><h2>{selectedUnit.title}</h2><p>{selectedUnit.subtitle}</p></header><Theory unit={selectedUnit} />
            <section className="guide-activities"><div className="section-heading"><div><span className="kicker">{tr("PREGUNTES I SOLUCIONS", "PREGUNTAS Y SOLUCIONES")}</span><h2>{tr("Banc de la unitat", "Banco de la unidad")}</h2></div></div>{selectedUnit.activities.map((item) => <article key={item.id}><button onClick={() => setDrawer(item)}><span>{kindLabels(locale)[item.kind]}</span><strong>{item.title}</strong><p>{item.prompt}</p><b>{tr("Veure fitxa", "Ver ficha")} →</b></button><div className="model-answer"><small>{tr("RESPOSTA MODEL", "RESPUESTA MODELO")}</small><p>{item.modelAnswer}</p></div></article>)}</section>
          </div></div></>}
      {tab === "reviews" && <><header className="teacher-header"><div><span className="kicker">{tr("CONTROL HUMÀ", "CONTROL HUMANO")}</span><h1>{tr("Respostes que demanen revisió", "Respuestas que requieren revisión")}</h1><p>{tr("La IA proposa; tu tens l’última paraula en casos amb baixa confiança o resposta sensible.", "La IA propone; tú tienes la última palabra en casos con baja confianza o respuesta sensible.")}</p></div></header>{reviews.length === 0 ? <div className="empty-live"><span>◇</span><h2>{tr("No hi ha revisions pendents", "No hay revisiones pendientes")}</h2><p>{tr("Les respostes dubtoses apareixeran ací automàticament.", "Las respuestas dudosas aparecerán aquí automáticamente.")}</p></div> : <div className="review-list">{reviews.map((item) => <article key={item.reviewId}><strong>{item.studentName} · {item.activityId}</strong><p>{item.answer}</p><span>{item.feedback}</span></article>)}</div>}</>}
    </main>
    {drawer && <div className="drawer-backdrop" onClick={() => setDrawer(null)}><aside className="teacher-drawer" onClick={(event) => event.stopPropagation()}><header><div><span className="kicker">{tr("FITXA DOCENT", "FICHA DOCENTE")}</span><h2>{drawer.title}</h2></div><button onClick={() => setDrawer(null)}>×</button></header><span className="drawer-kind">{kindLabels(locale)[drawer.kind]} · {drawer.area}</span><ScientificReading activity={drawer} />{drawer.context && !drawer.scientificText && <p className="context-box">{drawer.context}</p>}<h3>{drawer.prompt}</h3><section><small>{tr("RESPOSTA EXACTA / MODEL", "RESPUESTA EXACTA / MODELO")}</small><p>{drawer.modelAnswer}</p></section><section><small>{tr("GUIA DE CORRECCIÓ", "GUÍA DE CORRECCIÓN")}</small>{drawer.rubric ? <ul className="rubric">{drawer.rubric.map((item) => <li key={item.label}><strong>{item.label} · {item.points} p</strong><span>{item.description}</span></li>)}</ul> : <p>{drawer.explanation}</p>}</section><section><small>{tr("PISTA PER A GUIAR", "PISTA PARA GUIAR")}</small><p>{drawer.hint}</p></section><div className="drawer-comment"><label>{tr("Missatge a l’alumne seleccionat", "Mensaje al alumno seleccionado")}<input value={comment} onChange={(e) => setComment(e.target.value)} placeholder={tr("Una orientació breu…", "Una orientación breve…")} /></label><button onClick={() => { const liveItem = demoLive.find((item) => item.activityId === drawer.id); if (liveItem) send(liveItem.studentId); }}>{tr("Enviar", "Enviar")}</button></div><button className="primary-button full" onClick={() => setProjecting(drawer)}>{tr("Projectar com ho veu l’alumne", "Proyectar como lo ve el alumno")}</button></aside></div>}
  </div>;
}

export default function PdcApp() {
  const [locale, setLocale] = useState<Locale>("va");
  const [teacherMode, setTeacherMode] = useState(false);
  const [initialSession] = useState<StudentSession | null>(() => typeof window === "undefined" ? null : readStudentSession());
  useEffect(() => { if (new URLSearchParams(window.location.search).get("mode") === "teacher") setTeacherMode(true); }, []);
  useEffect(() => {
    document.documentElement.lang = locale === "va" ? "ca-valencia" : "es";
    document.title = locale === "va" ? "Laboratori PDC · Àmbit científic" : "Laboratorio PDC · Ámbito científico";
  }, [locale]);
  const tr = useCallback((valencian: string, spanish: string) => locale === "va" ? valencian : spanish, [locale]);
  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    curriculum: locale === "va" ? curriculumVa : curriculumEs,
    activityById: locale === "va" ? activityByIdVa : activityByIdEs,
    tr,
  }), [locale, tr]);

  return <LocaleContext.Provider value={value}>
    <LanguageToggle locale={locale} onChange={setLocale} />
    {teacherMode ? <TeacherApp onExit={() => setTeacherMode(false)} /> : <StudentApp initialSession={initialSession} onTeacher={() => setTeacherMode(true)} />}
  </LocaleContext.Provider>;
}
