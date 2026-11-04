# Validació final prèvia al desplegament — 04-11-2026

**Aturada segura per quota. Validació local funcional i de seguretat PASS; publicació NO executada.**
Branca: feature/teacher-recovery-explicit-blank-local. Punt inicial 84644f5. Producció intacta: Apps Script v28, Pages e23c7b9, Luna medium / 1600. Cap dada real, recuperació dels 12 o modificació dels 7 exclosos/26 històrics.

## A. Firebase Rules Emulator

Java 21 i Database Emulator 4.11.2, escoltant únicament 127.0.0.1:9005, projecte/namespace demo-pdc3. Rules carregades directament de public/firebase-rules.json; no imitació d'expressions. Execució dirigida: **12/12 PASS**, 0 FAIL, 0 SKIP.

Comprovats claims ficticis d'alumne legítim, altre alumne, altre grup, docent del grup, docent alié i accés invàlid. L'alumne pot crear l'ANSWER declarat; no pot modificar/eliminar originals ni escriure backendGrades. Ni el docent browser pot escriure backendGrades/metadades administratives. Només admin backend crea resultats; docent llig exclusivament el seu grup. GRADE/pendingEvent forjats per al blanc explícit es rebutgen tant en obertes com en automàtiques, també retirant el flag del GRADE. Resolució administrativa independent i zero existent preservats. Flux ordinari automàtic manté els permisos originals.

Límits: s'ha provat l'emulador RTDB real amb JWTs ficticis, no el servei Auth de producció. La ruta automàtica ordinària que ja confiava en correcció client continua com a deute legacy; no s'afirma haver convertit totes les activitats antigues en correctors servidor.

## B. Validació visual de l'entrega en blanc

Navegador automatitzat en http://127.0.0.1:5187/, sense visitar producció. Render dels components reals ActivityViewer i PendingQualificationPanel amb CSS candidat. Vite injecta adaptadors exclusivament locals; mai carrega config/SDK/credencials de producció. Firebase és l'emulador real; GAS usa les funcions reals en VM amb grader simulat i transport extern bloquejat. No és un smoke d'Apps Script real ni una prova completa del login de producció.

Botó, confirmació, cancel·lació, primer 0, feedback exacte, opció de passar/millorar, reload, segon 0 i següent activitat: **PASS**. Confirmació corregida visualment; cap tercer intent oferit després del segon.

Editor completament buit + enviament normal: **PASS**, sense assignar submissionId/ANSWER/GRADE ni cridar model. La prova funcional dirigida va reproduir RED en numeric abans del fix mínim. S'ha afegit un guard abans de getPendingSubmission per a numeric, choice, match, open, decision, mission i text; un ordre que ja conté elements no es considera un editor buit. El guard també s'ha comprovat al navegador en u03-02 i en l'emulador no hi ha cap event d'eixa activitat. Una resposta real incorrecta pot continuar obtenint 0 amb el corrector habitual; la confirmació especial s'exigix quan no es presenta resposta.

## C. Validació visual docent

**PASS**: càrrega, notes zero projectades, diferenciació de revisió pedagògica/primera nota, originals/rúbrica congelada, substituïdes, buides, absència de text, casos amb context ambigu, recuperació individual preparada amb ticket i confirmació expressa, i controls de recuperació desactivats per als no elegibles.

Un únic cas fictici recoverable-fixture s'ha recuperat amb grader simulat; l'original es conserva i el resultat es projecta. Resolució EMPTY d'un altre cas exclusivament fictici sense generar GRADE. Reload conserva resultat, historial i resolució. Historial de recuperació es manté visible quan el GRADE ja està sincronitzat, amb etiqueta correcta, no fals pendent. Comprovació DOM de targetes: 0 desbordaments horitzontals.

## D. Cobertura visual dels huit tipus

| Tipus | Activitat sintètica | Primer / reload / segon / continuar |
|---|---|---|
| numeric | u04-01 | PASS |
| choice | u04-02 | PASS |
| order | u04-03 | PASS |
| match | u04-04 | PASS |
| open | u04-05 | PASS |
| decision | u04-07 | PASS |
| mission | u04-08 | PASS |
| text | u04-09 | PASS |

## E. Model

**0 crides HTTP a OpenAI.** Cap credencial carregada. Grader simulat: 0 per a les entregues en blanc; 1 per a la recuperació docent fictícia. No confondre eixa invocació d'un stub amb una petició real. Es manté el model de producció sense consultar-lo ni modificar-lo.

## F. Persistència, idempotència i sincronització

Prova real de navegador→GAS VM candidat→RTDB emulator→worker i save core reals→adapter de Sheets en memòria→docent. **17 ANSWER explícits, 17 GRADE zero**, cadascun amb un ID canònic i una fila de projecció; 16 entregues són els dos intents dels huit tipus i una correspon a la prova d'ACK perdut. 18 files de projecció totals incloent la recuperació docent fictícia.

ACK perdut després de persistir: el mateix ID recupera el zero, sense altre GRADE o intent. Error abans de qualificar u04-06: text i únic ANSWER conservats després de reload; GRADE/backendGrade absents, cap zero fabricat. 7 originals inicials ficticis íntegres, zero preexistent preservat, resolució administrativa sense nota, replay docent reutilitza resultat sense altre grader, 3 operacions negatives backend rebutjades abans de qualificar, 0 recompenses duplicades i 0 pendingEvents. Una fixture inicial amb GRADE existent pendent de projecció és intencional per validar la classificació; no s'ha presentat com un resultat nou sincronitzat.

## G. Incidències corregides localment

1. Confirmació en blanc: accions juntes i fila desbordada. Estil propi amb espai i salt de línia.
2. Targetes docents: heretaven la graella d'incidències i estrenyien original/rúbrica. Estils delimitats al nou panell; cap redisseny del dashboard.
3. Resultat recuperat SYNCED amb historial: apareixia falsament pendent de sincronització. Ara GRADE_CONFIRMED, mantenint historial i bloquejant requalificació. Test dirigit nou.
4. Enviament normal amb editor buit: podia arribar a crear un enviament i, en automàtiques, acabar amb zero sense confirmació especial. Guard mínim anterior a qualsevol assignació/encua. RED→GREEN i comprovació visual/emulador.

## H. Compatibilitat amb v28

Backend candidat no ha canviat des de 84644f5; les correccions d'esta validació són frontend/classificació/tests. Codi candidat SHA-256 LF: a4911962be416ef9be5b079d5074bc992f00739374dd60f9b6b7292a847fda2d. v28 de producció manté 26b015d7679d5eae138948c8d59ecec45ae142fc960beb302fb981756322446f segons el checkpoint acreditat; no s'ha tornat a desplegar ni inspeccionat secrets.

Rules noves + frontend antic: contractes ordinaris preservats; el flag nou encara no s'emet. Backend nou + frontend antic: accions existents preservades, noves rutes inactives fins que es mostren. Frontend nou + v28: **NO compatible** per a les accions noves; no publicar-lo primer.

A/B compartixen grader, context/identitat i Rules. El candidat provat és conjunt. Una publicació només A o només B exigiria preparar/gatejar un altre artefacte; no partir el commit a cegues. Es poden publicar Rules/backend abans i comprovar compatibilitat mantenint encara el frontend antic.

## I. Publicació i rollback — només pla, no executat

1. Completar exportació sanejada en release/teacher-recovery-blank-predeploy-export, worktree C:\ProjectesMates_Documentacio\PDC3\predeploy-export-worktree. **Ara només conté el main públic e23c7b9: NO és encara el candidat exportat.** No importar ancestria local ni fer cherry-pick de la història contaminada. No push/merge en esta sessió.
2. Verificar i registrar hashes de Code/Rules/index/assets, arbre net, absència de secrets i configuracions públiques conservades. Hashes locals ja guardats en local-candidate-hashes.json dins dels artefactes; manifest final de l'exportació encara pendent.
3. Amb autorització de publicació: punt de retorn a Pages e23c7b9, backend v28 mateix deployment/endpoint i Rules anteriors. Preservar Configuracio/propietats privades existents; obtenir lectura/backup privat de Rules vigents i confirmar contingut v28 abans de substituir. No restaurar tot Sheets/Firebase sobre treball més recent; assessmentConfig, notes i triggers no necessiten canvis.
4. Publicar Rules→backend→frontend, comprovant cada component. Frontend pel mecanisme de Pages existent (main/arrel); qualsevol promoció de Git requerix autorització explícita, no merge rutinari. Smoke exclusivament sintètic autoritzat després, mai recuperar alumnes reals per provar.
5. Rollback: retirar primer frontend nou. Mantindre Rules més restrictives si continuen compatibles. Abans de retornar backend a v28, identificar/drenar entregues EXPLICIT_NO_ANSWER encara sense GRADE amb el backend compatible o deixar-les preservades i parar per decisió: v28 no pot reprendre eixe buit com una resposta ordinària. GRADE zero ja confirmats continuen llegibles. No esborrar ANSWER/GRADE ni fingir zeros per resoldre cues.

## J. Riscos i pendents

Cap fallada crítica local oberta de permisos, nota o persistència en els casos provats. Pendents **operatius**: acabar exportació sanejada, manifest final i revisió d'artefactes; autorització de publicació/backup vigent/smoke remot. No s'ha validat Auth ni Apps Script reals per a estes funcionalitats noves perquè no s'han publicat. Deute legacy de correcció client documentat, sense migració fora d'abast. Recuperacions reals, 7 exclosos/26 històrics i rotació de credencial continuen sense autoritzar/executar.

## K. Estat final

**NO APTE encara per a proposar la publicació concreta: exportació sanejada i manifest de release pendents.** Les comprovacions locals crítiques han passat; no és un FAIL de producció. Aturar ací per instrucció de quota, amb candidat conservat i pròxim pas delimitat.

## Proves i evidències

- Nous tests funcionals dirigits: **56/56 PASS** després de l'últim fix.
- Rules Emulator: **12/12 PASS** en execució separada, sense skips.
- Gate general per canvis source: **362 totals / 360 PASS / 0 FAIL / 2 SKIP**. Un skip Arena no requerit; el runner global omet la prova Rules si no té flag, però s'ha executat separadament amb èxit.
- TSC PASS; ESLint PASS, 0 errors / 3 avisos preexistents; build normal i build GitHub PASS. Sense repetir-los després de simples canvis documentals.
- Captures i receipts locals sintètics: C:\ProjectesMates_Documentacio\PDC3\predeploy-validation-artifacts-20261104. Inclou visual-results.json, session-evidence.json, rules-emulator.txt, directed-tests.txt, local-candidate-hashes.json, confirmació corregida, huit tipus, error de xarxa, ACK, docent i editor-buit-no-qualificat.png. No incorporar-los com a dades acadèmiques reals.
- Per reprendre tests locals, firebase emulators:start --only database --project demo-pdc3 --config firebase.predeploy.json; prova dirigida amb PDC_PREDEPLOY_EMULATOR=1; UI amb npx vite --config tests/support/predeploy/vite.config.mjs. **Arrancar el harness reinicialitza només les dades fictícies demo**, mai producció. No repetir tota la validació si no canvia source.
