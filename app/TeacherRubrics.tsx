"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiCall } from "../lib/services";
import { publicAsset } from "../lib/public-asset";
import { evaluationCriteria } from "../lib/curricular-alignment";
import { applyRubric, deleteRubricApplication, listRubrics, readRubricData, saveRubric, saveRubricRating, saveTeacherRubricScale, subscribeRubrics, updateRubricApplication, type RubricData } from "../lib/rubric-service";
import { createRubric, effectiveTeacherRubricScale, nextRubricLevel, parseRubricCsv, rubricRows, rubricScore, rubricTopicLabel,
  RUBRIC_EVIDENCE_TYPES, RUBRIC_LABELS, RUBRIC_LEVELS, RUBRIC_TOPICS, SCORED_RUBRIC_LEVELS, teacherRubricLevelScore,
  type RatingLevel, type RubricAssessment, type RubricImportRow, type RubricLevel, type RubricLevelScores, type RubricTemplate } from "../lib/rubrics";

const blankDescriptors = () => Object.fromEntries(RUBRIC_LEVELS.map((level) => [level, ""])) as Record<RubricLevel, string>;
const blankRow = (): RubricImportRow => ({ indicator: "", criterion: "", descriptors: blankDescriptors() });
const initialData = (): RubricData => ({ catalog: {}, assessments: {}, ratings: {} });
type ScaleDraft = { revision: number; fields: Record<string, string> };
type Student = { id: string; name: string };
const key = (assessmentId: string, studentId: string, indicatorId: string) => `${assessmentId}:${studentId}:${indicatorId}`;
const groupId = () => window.PDC_CONFIG?.groupId || "PDC3";

export function TeacherRubrics({ students }: { students: Student[] }) {
  const [data, setData] = useState<RubricData>(initialData);
  const [dataReady, setDataReady] = useState(false);
  const [scaleDraft, setScaleDraft] = useState<ScaleDraft | null>(null);
  const [scaleSaving, setScaleSaving] = useState(false);
  const scaleInFlight = useRef(false);
  const [scaleNotice, setScaleNotice] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<RubricTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState<string>("GLOBAL");
  const [evidenceType, setEvidenceType] = useState<string>("ORAL_PRESENTATION");
  const [rows, setRows] = useState<RubricImportRow[]>([blankRow()]);
  const [assessment, setAssessment] = useState<RubricAssessment | null>(null);
  const [applying, setApplying] = useState<RubricTemplate | null>(null);
  const [editingApplication, setEditingApplication] = useState(false);
  const [applicationName, setApplicationName] = useState("");
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().slice(0, 10));
  const [applicationContext, setApplicationContext] = useState("");
  const [mode, setMode] = useState<"student" | "group">("student");
  const [studentId, setStudentId] = useState("");
  const [activeIndicator, setActiveIndicator] = useState("");
  const [overrides, setOverrides] = useState<Record<string, RubricLevel>>({});
  const [saving, setSaving] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    const accept = (next: RubricData) => {
      if (!active) return;
      setData(previous => (previous.levelScale?.revision ?? 0) > (next.levelScale?.revision ?? 0)
        ? { ...next, levelScale: previous.levelScale } : next);
      setDataReady(true);
    };
    const unsubscribe = subscribeRubrics(accept);
    void readRubricData().then(accept).catch(() => { if (active) setMessage("No s’ha pogut carregar la biblioteca."); });
    return () => { active = false; unsubscribe(); };
  }, []);
  const scale = effectiveTeacherRubricScale(data.levelScale);
  const scoreLabel = (level: RatingLevel) => {
    const value = teacherRubricLevelScore(level, scale.scores);
    return value === null ? "" : ` · ${String(value).replace(".", ",")}/10`;
  };
  const saveScale = async () => {
    if (!scaleDraft || scaleInFlight.current) return;
    scaleInFlight.current = true;
    setScaleSaving(true);
    setScaleNotice("");
    try {
      const scores = Object.fromEntries(SCORED_RUBRIC_LEVELS.map(level => {
        const value = scaleDraft.fields[level].trim();
        return [level, value === "" ? NaN : Number(value)];
      })) as RubricLevelScores;
      const saved = await saveTeacherRubricScale(scores, scaleDraft.revision);
      setData(previous => (previous.levelScale?.revision ?? 0) > saved.revision ? previous : { ...previous, levelScale: saved });
      setScaleDraft(null);
      setScaleNotice("Escala guardada.");
    } catch (error) {
      setScaleNotice(error instanceof Error ? error.message : "No s’ha pogut confirmar el guardat.");
    } finally {
      scaleInFlight.current = false;
      setScaleSaving(false);
    }
  };
  const templates = useMemo(() => listRubrics(data).filter((item) =>
    (filter === "ALL" || item.topic === filter) && item.name.toLocaleLowerCase("ca").includes(search.toLocaleLowerCase("ca"))), [data, filter, search]);
  const current = assessment && (data.assessments[assessment.assessmentId] || assessment);
  const levelFor = (student: string, indicator: string): RatingLevel => {
    if (!current) return "UNRATED";
    return overrides[key(current.assessmentId, student, indicator)]
      || data.ratings?.[current.assessmentId]?.[student]?.[indicator]?.levelId || "UNRATED";
  };
  const ratingsFor = (student: string) => Object.fromEntries((current?.snapshot.indicators || []).map((indicator) => {
    const level = levelFor(student, indicator.indicatorId);
    return [indicator.indicatorId, level === "UNRATED" ? undefined : { levelId: level }];
  }));
  const choose = (student: string, indicator: string, level: RubricLevel) => {
    if (!current) return;
    const id = key(current.assessmentId, student, indicator);
    setOverrides((old) => ({ ...old, [id]: level }));
    setSaving((old) => ({ ...old, [id]: "Pendent" }));
    saveRubricRating(current.assessmentId, student, indicator, level, (status) => {
      setSaving((old) => ({ ...old, [id]: status === "saved" ? "Guardat" : status === "error" ? "Pendent de connexió" : "Pendent" }));
    });
  };
  const loadForm = (template?: RubricTemplate, duplicate = false) => {
    setShowEditor(true);
    setEditing(template && !duplicate ? template : null);
    setName(template ? duplicate ? `${template.name} (còpia)` : template.name : "");
    setTopic(template?.topic || "GLOBAL"); setEvidenceType(template?.evidenceType || "ORAL_PRESENTATION");
    setRows(template ? rubricRows(template) : [blankRow()]); setAssessment(null); setMessage("");
  };
  const save = async () => {
    try {
      const template = createRubric({ name, topic, evidenceType: evidenceType as RubricTemplate["evidenceType"], rows }, editing || undefined);
      await saveRubric(template); setData(await readRubricData()); setMessage(`Rúbrica guardada · versió ${template.version}.`); setEditing(null); setName(""); setShowEditor(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No s’ha pogut guardar."); }
  };
  const prepareApplication = (template: RubricTemplate) => {
    const count = Object.values(data.assessments || {}).filter((item) => item.rubricId === template.rubricId).length + 1;
    setApplying(template); setApplicationName(`${count}a revisió — ${template.name}`);
    setApplicationDate(new Date().toISOString().slice(0, 10)); setApplicationContext(""); setMessage("");
  };
  const start = async () => {
    if (!applying) return;
    try {
      const created = await applyRubric(applying, groupId(), { applicationName, date: applicationDate, context: applicationContext });
      setData(await readRubricData()); setAssessment(created); setApplying(null); setActiveIndicator(created.snapshot.indicators[0]?.indicatorId || "");
      setStudentId(students[0]?.id || ""); setMessage("Aplicació creada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No s’ha pogut aplicar."); }
  };
  const editApplication = async () => {
    if (!current) return;
    try {
      const updated = await updateRubricApplication(current.assessmentId, { applicationName, date: applicationDate, context: applicationContext });
      setAssessment(updated); setEditingApplication(false); setMessage("Aplicació actualitzada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No s’ha pogut actualitzar."); }
  };
  const removeApplication = async () => {
    if (!current || !window.confirm(`Eliminar l’aplicació «${current.applicationName || current.snapshot.name}» i totes les seues valoracions?`)) return;
    try {
      await deleteRubricApplication(current.assessmentId); setAssessment(null); setEditingApplication(false);
      setData(await readRubricData()); setMessage("Aplicació eliminada. Les valoracions deixen de computar.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No s’ha pogut eliminar."); }
  };
  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      let parsed;
      if (/\.csv$/i.test(file.name)) parsed = parseRubricCsv(await file.text());
      else {
        const { parseRubricWorkbook } = await import("../lib/rubric-workbook");
        parsed = parseRubricWorkbook(await file.arrayBuffer());
      }
      // Validate the complete file before the user can save anything.
      createRubric({ name: parsed.name, topic: parsed.topic, evidenceType: parsed.evidenceType as RubricTemplate["evidenceType"], rows: parsed.rows });
      setEditing(null); setShowEditor(true); setName(parsed.name); setTopic(parsed.topic); setEvidenceType(parsed.evidenceType); setRows(parsed.rows);
      setMessage("Importació validada. Revisa i guarda la rúbrica.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Fitxer invàlid."); }
  };
  const setRow = (index: number, patch: Partial<RubricImportRow>) => setRows((old) => old.map((row, i) => i === index ? { ...row, ...patch } : row));

  return <section className="rubric-panel">
    <header className="teacher-header"><div><span className="kicker">AVALUACIÓ DOCENT</span><h1>Rúbriques</h1><p>Valora indicadors vinculats als criteris curriculars.</p></div></header>
    {message && <p className="teacher-notice" role="status">{message}</p>}
    <div className="rubric-toolbar">
      <button onClick={() => loadForm()}>+ Crear rúbrica</button>
      <label className="rubric-import">Importar rúbrica <input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => void importFile(event.target.files?.[0])} /></label>
      <a className="rubric-template-link" href={publicAsset("/plantilla-rubrica-pdc3.xlsx")} download="plantilla-rubrica-pdc3.xlsx">↓ Descarregar plantilla .xlsx</a>
      <button onClick={() => void apiCall("teacher_sync_rubrics").then(() => readRubricData().then(setData)).then(() => setMessage("Biblioteca actualitzada en Firebase.")).catch(() => setMessage("No s’ha pogut sincronitzar la biblioteca."))}>Actualitzar rúbriques en Firebase</button>
    </div>
    <section className="rubric-editor">
      <h2>Configuració dels nivells</h2>
      <p>L’escala s’aplica a totes les rúbriques del grup i a les valoracions existents. Les qualificacions curriculars vigents requerixen una revisió separada.</p>
      <form onSubmit={event => { event.preventDefault(); void saveScale(); }}>
        <table>
          <thead><tr><th scope="col">Nivell</th><th scope="col">Puntuació sobre 10</th></tr></thead>
          <tbody>{SCORED_RUBRIC_LEVELS.map(level => <tr key={level}>
            <th scope="row">{RUBRIC_LABELS[level]}</th>
            <td>{scaleDraft ? <input type="number" aria-label={RUBRIC_LABELS[level]} required min={0} max={10} step="any"
              value={scaleDraft.fields[level]} disabled={scaleSaving}
              onChange={event => { const value = event.target.value; setScaleDraft(draft => draft &&
                { ...draft, fields: { ...draft.fields, [level]: value } }); }} /> : String(scale.scores[level]).replace(".", ",")}</td>
          </tr>)}</tbody>
        </table>
        <p>Sense informació suficient · No computa</p>
        <div className="rubric-toolbar">{scaleDraft ? <>
          <button type="submit" className="primary-button" disabled={scaleSaving}>Guardar canvis</button>
          <button type="button" disabled={scaleSaving} onClick={() => { setScaleDraft(null); setScaleNotice(""); }}>Cancel·lar</button>
        </> : <button type="button" disabled={!dataReady} onClick={event => {
          event.preventDefault();
          setScaleNotice("");
          setScaleDraft({ revision: scale.revision, fields: Object.fromEntries(SCORED_RUBRIC_LEVELS.map(level => [level, String(scale.scores[level])])) });
        }}>Editar puntuacions</button>}</div>
      </form>
      {scaleNotice && <p role="status">{scaleNotice}</p>}
    </section>
    {current ? <div className="rubric-capture">
      <div className="rubric-toolbar"><button onClick={() => setAssessment(null)}>← Biblioteca</button><h2>{current.applicationName || current.snapshot.name}</h2><span>{current.rubricNameSnapshot || current.snapshot.name} · {new Date(current.date).toLocaleDateString("ca-ES")} · v{current.rubricVersion}</span>
        <button onClick={() => { setApplicationName(current.applicationName || current.snapshot.name); setApplicationDate(current.date.slice(0, 10)); setApplicationContext(current.context || ""); setEditingApplication(true); }}>Editar aplicació</button>
        <button onClick={() => void removeApplication()}>Eliminar aplicació</button>
        <button className={mode === "student" ? "active" : ""} onClick={() => setMode("student")}>Per alumne</button>
        <button className={mode === "group" ? "active" : ""} onClick={() => setMode("group")}>Per grup</button></div>
      {editingApplication && <div className="rubric-toolbar"><label>Nom de l’aplicació <input value={applicationName} onChange={(event) => setApplicationName(event.target.value)} /></label>
        <label>Data <input type="date" value={applicationDate} onChange={(event) => setApplicationDate(event.target.value)} /></label>
        <label>Context/observació <input value={applicationContext} onChange={(event) => setApplicationContext(event.target.value)} /></label>
        <button onClick={() => void editApplication()}>Guardar canvis</button><button onClick={() => setEditingApplication(false)}>Cancel·lar</button></div>}
      {mode === "student" ? <><label>Alumne <select value={studentId} onChange={(event) => setStudentId(event.target.value)}>{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></label>
        <p>Nota de la rúbrica: {rubricScore(current.snapshot.indicators, ratingsFor(studentId), scale.scores)?.toFixed(1) ?? "Sense informació"}</p>
        {current.snapshot.indicators.map((indicator) => <article className="rubric-indicator" key={indicator.indicatorId}>
          <h3>{indicator.name}</h3><small>{indicator.criteria.join(" · ")}</small>
          <div className="rubric-descriptors">{RUBRIC_LEVELS.map((level) => <button key={level} className={levelFor(studentId, indicator.indicatorId) === level ? `selected rubric-${level}` : ""}
            onClick={() => choose(studentId, indicator.indicatorId, level)}><strong>{RUBRIC_LABELS[level]}{scoreLabel(level)}</strong><span>{indicator.descriptors[level]}</span></button>)}</div>
          <small>{saving[key(current.assessmentId, studentId, indicator.indicatorId)] || ""}</small>
        </article>)}</> : <>
        <label>Indicador actiu <select value={activeIndicator} onChange={(event) => setActiveIndicator(event.target.value)}>{current.snapshot.indicators.map((indicator) => <option key={indicator.indicatorId} value={indicator.indicatorId}>{indicator.name}</option>)}</select></label>
        <div className="rubric-group-grid">{students.map((student) => {
          const level = levelFor(student.id, activeIndicator);
          return <button key={student.id} className={`rubric-student-card rubric-${level}`} onClick={() => choose(student.id, activeIndicator, nextRubricLevel(level))}>
            <strong>{student.name}</strong><span>{RUBRIC_LABELS[level]}{scoreLabel(level)}</span>
            <span className="rubric-mini">{current.snapshot.indicators.map((indicator) => <i title={`${indicator.name}: ${RUBRIC_LABELS[levelFor(student.id, indicator.indicatorId)]}${scoreLabel(levelFor(student.id, indicator.indicatorId))}`} key={indicator.indicatorId}
              className={`rubric-${levelFor(student.id, indicator.indicatorId)} ${activeIndicator === indicator.indicatorId ? "active" : ""}`} />)}</span>
            <small>{saving[key(current.assessmentId, student.id, activeIndicator)] || ""}</small>
          </button>;
        })}</div></>}
    </div> : <>
      {applying && <section className="rubric-editor"><h2>Aplicar · {applying.name}</h2><div className="rubric-toolbar">
        <label>Nom de l’aplicació <input value={applicationName} onChange={(event) => setApplicationName(event.target.value)} /></label>
        <label>Data <input type="date" value={applicationDate} onChange={(event) => setApplicationDate(event.target.value)} /></label>
        <label>Context/observació <input value={applicationContext} onChange={(event) => setApplicationContext(event.target.value)} /></label>
        <button className="primary-button" onClick={() => void start()}>Crear aplicació</button><button onClick={() => setApplying(null)}>Cancel·lar</button>
      </div></section>}
      {showEditor ? <section className="rubric-editor"><h2>{editing ? `Editar · versió ${editing.version + 1}` : "Nova rúbrica"}</h2>
        <div className="rubric-toolbar"><label>Nom <input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Tema <select value={topic} onChange={(event) => setTopic(event.target.value)}>{RUBRIC_TOPICS.map((value) => <option key={value} value={value}>{rubricTopicLabel(value)}</option>)}</select></label>
          <label>Tipus d’evidència <select value={evidenceType} onChange={(event) => setEvidenceType(event.target.value)}>{RUBRIC_EVIDENCE_TYPES.map((value) => <option key={value} value={value}>{value}</option>)}</select></label></div>
        <p>Una fila per subcriteri. Repeteix exactament el nom i els descriptors per vincular-los a un mateix indicador.</p>
        {rows.map((row, index) => <div className="rubric-edit-row" key={index}>
          <label>Indicador <input value={row.indicator} onChange={(event) => setRow(index, { indicator: event.target.value })} /></label>
          <label>Criteri <select value={row.criterion} onChange={(event) => setRow(index, { criterion: event.target.value })}><option value="">Tria el criteri</option>{Object.values(evaluationCriteria).map((criterion) => <option key={criterion.id} value={criterion.id}>{criterion.id} · {criterion.short}</option>)}</select></label>
          {RUBRIC_LEVELS.map((level) => <label key={level}>{RUBRIC_LABELS[level]}{scoreLabel(level)} <textarea value={row.descriptors[level]} onChange={(event) => setRow(index, { descriptors: { ...row.descriptors, [level]: event.target.value } })} /></label>)}
          <button onClick={() => setRows((old) => [...old.slice(0, index + 1), { ...row, criterion: "", descriptors: { ...row.descriptors } }, ...old.slice(index + 1)])}>Duplicar indicador per a un altre criteri</button>
          <button onClick={() => setRows((old) => old.filter((_, i) => i !== index))}>Lleva fila</button>
        </div>)}
        <div className="rubric-toolbar"><button onClick={() => setRows((old) => [...old, blankRow()])}>+ Afegir fila</button><button className="primary-button" onClick={() => void save()}>Guardar rúbrica</button><button onClick={() => { setName(""); setEditing(null); setShowEditor(false); }}>Cancel·lar</button></div>
      </section> : null}
      <div className="rubric-toolbar"><label>Filtra per tema <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="ALL">Totes</option>{RUBRIC_TOPICS.map((value) => <option value={value} key={value}>{rubricTopicLabel(value)}</option>)}</select></label>
        <label>Busca <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom de la rúbrica" /></label></div>
      <div className="rubric-library">{templates.map((template) => <article key={template.rubricId}>
        <h3>{template.name}</h3><small>{rubricTopicLabel(template.topic)} · {template.evidenceType} · v{template.version} · {template.indicators.length} indicadors</small>
        <div className="rubric-toolbar"><button onClick={() => prepareApplication(template)}>Aplicar</button><button onClick={() => loadForm(template)}>Editar</button><button onClick={() => loadForm(template, true)}>Duplicar</button></div>
      </article>)}</div>
      <h2>Aplicacions recents</h2><div className="rubric-library">{Object.values(data.assessments || {}).reverse().map((item) => <button key={item.assessmentId} onClick={() => { setAssessment(item); setActiveIndicator(item.snapshot.indicators[0]?.indicatorId || ""); setStudentId(students[0]?.id || ""); }}>
        {item.applicationName || item.snapshot.name}<br /><small>{item.rubricNameSnapshot || item.snapshot.name} · {new Date(item.date).toLocaleDateString("ca-ES")}</small>
      </button>)}</div>
    </>}
  </section>;
}
