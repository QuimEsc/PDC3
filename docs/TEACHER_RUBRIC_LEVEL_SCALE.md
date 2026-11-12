# Escala de rúbriques docents

## Abast i persistència

- **Seguiment docent → Rúbriques → Configuració dels nivells.** L'escala inicial és 10, 7, 4 i 1. El guardat admet decimals entre 0 i 10 en ordre estrictament descendent. «Sense informació suficient» no computa. «Sense valorar» continua sent l'absència de selecció.
- El registre autoritatiu és `rubrics/<grup>/levelScale` en Firebase. Apps Script usa la sessió docent existent, valida el grup i la revisió esperada, i guarda en una sola escriptura els valors i l'historial versionat amb data. Un guardat concurrent obsolet es rebutja. Reprendre el mateix guardat amb resposta perduda recupera la revisió ja confirmada. Els navegadors del mateix grup poden llegir el registre quan tenen rol docent.
- La puntuació efectiva es calcula per `levelId` en el moment de llegir-la. Una plantilla antiga importada, una versió actual i una aplicació començada comparteixen l'escala del grup, tant per alumne com per grup. Descriptors, snapshots, criteris, seleccions i IDs queden preservats. La mitjana de les quatre seleccions antigues passa de 6,25 a 5,5.
- Sheets continua projectant versions, aplicacions i identificadors de nivell en `BibliotecaRubriques`, `RubricaAplicacions` i `RubricaValoracions`. L'escala queda en Firebase. El format de la plantilla XLSX continua basat en descriptors.
- L'únic punt que genera evidència curricular d'aquestes rúbriques és `rubricOperationalEvidence`, llegit pel servei docent. El candidat manté la seua escala curricular de referència fins a una autorització acadèmica separada. Els correctors de les activitats ordinàries, el catàleg, els prompts, els pesos i el motor curricular conserven el codi anterior. L'única incorporació a Apps Script és la ruta docent de guardat d'escala.

## Simulació i procediment de recalculació

`previewTeacherRubricScale` treballa sobre un snapshot del grup i el seu pla de tancament. Retorna el recompte de rúbriques, aplicacions, valoracions identificables, ambigües i aplicacions òrfenes. Per alumne i aplicació mostra el nivell, la nota original, la proposta, la diferència i les mitjanes. La proposta es compara amb l'escala curricular que usa actualment la projecció. `previewTeacherRubricCurricularImpact` executa el motor existent sobre la mateixa entrada abans i després, substituint només la puntuació d'evidències docents ja presents i inequívocament identificades. Conserva els IDs i permet detectar el canvi en cada àmbit.

1. Abans d'una actuació autoritzada, obtenir en lectura un snapshot coherent de catàleg, aplicacions, revisions de valoracions, escala, tancaments, evidències i qualificacions. Guardar una còpia i la seua empremta fora de Git. La xifra actual de registres de producció queda pendent d'eixe inventari. En aquesta intervenció la simulació s'ha provat amb dades sintètiques.
2. Comparar la proposta per IDs i revisions. Separar aplicacions actives, notes consolidades pendents de revisió docent, períodes o aplicacions tancats, files òrfenes i notes només numèriques. Les tancades es mantenen en la projecció de referència. Una rúbrica global també queda protegida en el pla quan hi ha un període o unitat tancats, perquè pot alimentar eixos resums.
3. Presentar la diferència abans/després, l'abast i els conflictes per autorització expressa. La simulació és pura i repetible. El candidat no inclou una ruta de confirmació acadèmica ni un script que escriga les propostes.
4. En una fase posterior autoritzada, publicar la revisió de projecció curricular aprovada amb el mateix ID de cada evidència. Revalidar revisions i tancaments abans de confirmar-la. Registrar originals i proposta, mantindre els casos exclosos en la versió anterior i aturar-se davant un conflicte. L'adopció acadèmica requerix preparar la persistència d'eixa revisió aprovada en una actuació separada. Els nivells, els intents i les notes d'activitats ordinàries queden fora d'eixa actuació.

## Publicació i reversió pendents

Preparar un paquet sanejat des de la base pública i conservar les versions efectives de Rules, Apps Script i Pages. Amb autorització de publicació, aplicar Rules → Apps Script → Pages. Validar la lectura del valor inicial i la compatibilitat de les escriptures existents amb un entorn sintètic. L'aprovació d'una projecció acadèmica té un abast separat de la publicació del formulari.

Per revertir una edició, tornar a guardar els valors de la revisió anterior amb la revisió actual. L'historial conserva ambdós canvis. Per revertir el desplegament, restaurar Pages, després Apps Script. Si ja hi ha una escala registrada, conservar les Rules que protegixen l'historial fins que es puga verificar la protecció equivalent de qualsevol versió anterior. No cal restaurar el llibre o la base de dades.

## Validació local

- 100/100 proves dirigides i 13/13 comprovacions de l'emulador RTDB.
- Navegador amb el component real, emulador i backend local: escala inicial, aplicació anterior, mitjana 5,5, edició decimal, validació, cancel·lació, persistència, reload, ambdós modes, autosave i fallada amb el valor anterior preservat.
- Regressions: rúbrica interna original, correcció oberta amb resposta simulada del model, corrector determinista i registres històrics intactes. El catàleg ordinari i les fórmules curriculars són idèntics a la base de la branca. Cap crida real a OpenAI.
- TypeScript, ESLint i builds normal i GitHub Pages PASS. ESLint conserva tres avisos previs de proves de cua i els builds conserven l'avís de mida dels paquets.

## Revisió en GitHub

La base pública 0654103 és un repositori estàtic de Pages amb un arbre de fonts parcial. Esta PR aporta els mòduls revisables de la funcionalitat, les còpies de backend i Rules, el manifest i el patch exacte de 5588d80 per aplicar i verificar el conjunt de fonts complet. La CI de la PR executa el contracte local de la ruta docent, la projecció de rúbriques i la integritat de l'exportació. Els tests amb emulador, el navegador i els builds documentats corresponen a la validació del candidat complet. L'index i els assets que servix Pages continuen corresponent a la publicació vigent.

En el desplegament autoritzat, després de guardar les versions efectives i les còpies necessàries, publicar Rules i Apps Script abans de promoure els assets del build complet. Comprovar l'accés docent i l'escala inicial en un entorn de prova, una rúbrica antiga i una de nova en els dos modes, i una activitat ordinària representativa. Conservar les revisions de l'escala en qualsevol reversió.
