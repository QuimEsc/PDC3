# Candidats locals A i B — 04-11-2026

Branca `feature/teacher-recovery-explicit-blank-local`, base b07140b. No desplegat. PR #1, Pages e23c7b9 i Apps Script v28 intactes. Cap dada real usada per generar notes de prova.

## Candidat A — gestió de pendents i recuperació docent

Secció «Gestió de qualificacions pendents» en Revisions i sistema. Diferencia primera nota pendent, candidat recuperable, resultat pendent de sincronització, substituït, buit, decisió docent, resolució administrativa i contingut no recuperable. La classificació del navegador és orientativa; «Recuperable» requerix sempre el preflight del servidor.

Mostra alumne autoritzat, activitat, resposta/data/intent/variant originals, enunciat/rúbrica congelats si existixen, presència d'ANSWER/GRADE/backendGrade, posteriors i historial administratiu. El botó de rúbrica actual es diferencia del context original. Els resultats confirmats ja sincronitzats no apareixen com a primera qualificació pendent.

### Contracte de servidor

- `teacher_pending_preview`: token docent ordinari, grup configurat i alumne present en el dashboard del grup. Llig l'original i valida hash canònic, context obligatori, versió/rúbrica, política, intent, unitat, absència de germans posteriors i resultats equivalents/partials/revisions/override. Retorna ticket de 15 minuts vinculat al docent/ID/hash. No crida el model ni crea una nota. Les activitats automàtiques ordinàries sense resultat canònic no es recalculen amb una implementació improvisada: requerixen decisió; una entrega explícita en blanc vàlida sí que té ruta determinista.
- `teacher_recover_pending`: exigeix confirmRecovery=true i el ticket coincident. Revalida els guards i crida la funció acadèmica compartida amb opcions internes no aportables pel payload. No utilitza sessió d'alumne ni flag de bypass. Aplica els claims existents i el mateix patch backendGrade/GRADE/pendingEvent. Un resultat existent es reutilitza; parcial/incompatible para. Score/grade/answer aportats pel client es rebutgen.
- `teacher_resolve_pending`: confirmació individual, ID d'operació i hash esperat; disposicions SUBSTITUTED, EMPTY, UNRECOVERABLE, PENDING_DECISION, TECHNICAL_RESOLVED. Les resolucions substituïda/buida/tècnica requerixen evidència congruent. Només escriu metadades de gestió, mai ANSWER/GRADE/notes. El docent ha de valorar les disposicions acadèmiques, no s'executen automàticament.

Metadades a `academic/<group>/pendingAnswerManagement/<student>/<submission>`: historial per operació i última resolució separada. Rules locals: lectura docent del mateix grup, escriptura del browser prohibida; només backend admin escriu. Este metadada no retira evidències del motor de notes ni altera la política de tancament. No es promet que una resolució administrativa elimine tots els bloquejos acadèmics de tancament.

La recuperació usa el codi/política actual només si concorda amb el context congelat; no reconstrueix una rúbrica desapareguda. Els 12 elegibles de l'auditoria privada no s'han executat. Els 3 manuals, 4 buits i 26 històrics no canvien de classificació per existir una funció nova.

Auditoria tècnica de recuperació REQUESTED/COMPLETED/STOPPED, amb actor docent i hash, sense guardar tokens. Si el procés mor després del model però abans del patch, no hi ha factura única garantida; no reintentar a cegues. Si es perd només l'ACK, el mateix ID reutilitza el resultat confirmat. El ticket és una autorització curta; si caduca cal tornar a preparar/revalidar, no ampliar-lo des del browser.

## Candidat B — entrega voluntària en blanc

Els tipus reals són numeric, choice, order, match, open, decision, mission i text. El nou botó mostra «No sé la resposta (0 punts)», amb confirmació expressa i cancel·lació sense enviament. Els camps textuals/associacions parcials s'han de buidar abans d'usar-lo; una ordenació inicial no enviada pot abandonar-se expressament. Un ANSWER pendent normal no pot convertir-se en una entrega en blanc. Un blanc pendent congela l'editor fins que es confirme el mateix enviament.

El navegador confirma primer un ANSWER amb answer="", submissionMode=EXPLICIT_NO_ANSWER, explicitConfirmation=true i context original complet. `submit_no_answer` valida la lease vigent i el canònic, tipus autoritzat, identitat, intent/variant, context/política, accés i bloquejos. Rebutja text no buit, declaració absent i notes aportades pel client. Retorna un 0 determinista i feedback «No has presentat cap resposta. Qualificació: 0/10.»; mai crida model, reparació o correcció oberta associada a eixe blanc.

La nota autoritzada s'escriu amb el mateix mecanisme atòmic del backend; el navegador no envia un GRADE per esta via. backendGrade/grade.cause identifiquen EXPLICIT_NO_ANSWER i model DETERMINISTIC_NO_ANSWER. El feedback i causa viatgen amb gradeJson al worker i al docent. Les activitats automàtiques ordinaries mantenen el corrector existent. S’enriquix el catàleg canònic existent de 162 activitats amb els snapshots complets de les 72 automàtiques, contrastats amb el currículum; les 90 entrades obertes es preserven; no canvia contingut, criteris o pesos.

Un blanc és un intent legítim: un primer 0 conserva el segon quan està habilitat; un segon 0 s'aplica segons SECOND_ATTEMPT o BEST_ATTEMPT congelats. Les variants que no compten conserven la política de reforç. Els buits antics sense declaració continuen sense nota: no es migren ni es reclasifiquen com a entrega voluntària.

## Proves i límits

Proves locals amb dades sintètiques i xarxa bloquejada: sessions docents reals simulades en Properties/Cache, elegibilitat, guards, concurrència, ACK perdut, parcial, històric sense context, nou zero existent, resolució sense nota, tipus, segon intent/polítiques, reload, frontend real i cancel·lació. El worker real es prova amb adapter Sheets en memòria: la projecció/recompensa final està simulada; no és una escriptura real en Google Sheets ni un smoke de producció.

Els tests antics que buscaven literalment la signatura submit sense paràmetres, la crida única grade_open, el timeout de dos noms o l'editor sense el bloqueig addicional s'han adaptat al contracte ampliat; es conserva l'assert de confirmació duradora abans de completar la UI. La suite funcional prèvia continua executant-se perquè hi ha canvis de source.

No s'ha executat navegador amb dades reals ni emulador de Rules/Functions nou. La comprovació de Rules és estructural local i les còpies són idèntiques; el desplegament i l'autorització real estan pendents. La superfície legacy de correcció automàtica al client continua sent un límit preexistent, no queda substituïda per este treball.

## Ordre d'una publicació futura — necessita autorització

1. Revisar els candidats A/B i el contracte/abast; preparar snapshot privat de versions/Rules/configuració i rollback. No pujar l'historial source local, que conté una credencial antiga; exportar només el patch sanejat a una branca pública neta si s'autoritza.
2. Publicar el canvi de Rules que permet llegir metadades docents, en prohibix l'escriptura al client i impedix GRADE/pendingEvent del browser per a entregues explícites en blanc. Sense ampliar permisos acadèmics de l'alumnat.
3. Publicar backend amb configuració privada/endpoint/model conservats; verificar health i un pilot exclusivament sintètic amb autorització de consum. No recuperar casos reals per provar.
4. Publicar frontend corresponent i verificar cancel·lació, blanc 0, recuperació docent d'un cas sintètic, reload i projecció worker/Sheets/docent; contrastar integritat. Revertir coordinadament si falla, sense esborrar evidències.
5. Autorització acadèmica **separada** per a qualsevol recuperació real: preflight per ID i revisió del pla privat dels 12, amb parada davant qualsevol divergència. Cap lot massiu activat.

La decisió sobre Functions i la rotació de credencial són treballs separats; no es fusionen amb esta publicació.

## Gate final executat

54/54 proves noves PASS. Suite: 359 totals, 358 PASS, 0 FAIL, 1 SKIP (emulador Arena no iniciat). TypeScript, ESLint (0 errors, 3 avisos previs), build normal i build:github PASS. Worker i save core reals provats amb adapters de Sheets en memòria; causa, zero, variant i no ponderació coherents. Rules estructurals i expressions aïllades, sense declarar emulador ni desplegament. Cap dada real ni producció modificades.
