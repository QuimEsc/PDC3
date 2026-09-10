import {
  unitSupplements,
  type ScientificText,
  type TheoryImage,
} from "./curriculum-content";

export type Area = string;
export type ActivityKind = "numeric" | "choice" | "order" | "match" | "open" | "decision" | "mission" | "text";

export type TheoryBlock = {
  title: string;
  text: string;
  development?: string;
  example?: string;
  points: string[];
};

export type RubricCriterion = {
  label: string;
  description: string;
  points: number;
};

export type Activity = {
  id: string;
  unitId: string;
  title: string;
  kind: ActivityKind;
  area: Area;
  prompt: string;
  context?: string;
  scientificText?: ScientificText;
  data?: string[];
  options?: string[];
  answer?: string | number;
  tolerance?: number;
  items?: string[];
  groups?: string[];
  mapping?: Record<string, string>;
  modelAnswer: string;
  explanation: string;
  hint: string;
  rubric?: RubricCriterion[];
  maxScore: number;
};

export type Unit = {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  areas: Area[];
  term: 1 | 2 | 3;
  color: string;
  icon: string;
  theory: TheoryBlock[];
  theoryImages?: TheoryImage[];
  scientificText: ScientificText;
  keyVocabulary: string[];
  activities: Activity[];
};

type UnitSeed = Omit<Unit, "activities" | "scientificText" | "theoryImages"> & {
  numeric: { prompt: string; answer: number; tolerance?: number; model: string };
  checkpoint: { prompt: string; options: string[]; answer: string; explanation: string };
  sequence: { prompt: string; items: string[] };
  match: { prompt: string; groups: string[]; mapping: Record<string, string> };
  interpretation: { context: string; prompt: string; data: string[]; model: string; rubric: RubricCriterion[] };
  methodCase: { context: string; prompt: string; model: string; rubric: RubricCriterion[] };
  decision: { context: string; prompt: string; model: string; rubric: RubricCriterion[] };
  mission: { context: string; prompt: string; model: string; rubric: RubricCriterion[] };
};

const commonRubric = (focus: string): RubricCriterion[] => [
  { label: "Coneixement científic", description: `Aplica correctament ${focus}.`, points: 4 },
  { label: "Evidències", description: "Usa dades o fets del cas per justificar la resposta.", points: 3 },
  { label: "Raonament", description: "Relaciona causes, conseqüències i decisió de manera coherent.", points: 2 },
  { label: "Comunicació", description: "Resposta clara, ordenada i amb vocabulari adequat.", points: 1 },
];

const scientificTextRubric: RubricCriterion[] = [
  { label: "Idea principal", description: "Identifica la tesi o el problema científic del text sense deformar-lo.", points: 2 },
  { label: "Evidències", description: "Cita i interpreta dades o afirmacions concretes del text.", points: 3 },
  { label: "Raonament científic", description: "Relaciona l'evidència amb els conceptes de la unitat i diferencia resultats, causes i límits.", points: 3 },
  { label: "Valoració", description: "Formula una conclusió o decisió prudent, clara i ben justificada.", points: 2 },
];

const seeds: UnitSeed[] = [
  {
    id: "u01", order: 1, term: 1, icon: "⌁", color: "#52b69a",
    title: "Investigar el món", shortTitle: "Mètode científic",
    subtitle: "Preguntes, hipòtesis, variables, dades i conclusions fiables.",
    areas: ["Interdisciplinari"], keyVocabulary: ["hipòtesi", "variable", "mostra", "evidència", "conclusió"],
    theory: [
      { title: "Una pregunta investigable", text: "La ciència comença amb una pregunta concreta que es pot respondre observant o mesurant. Una hipòtesi és una explicació provisional que permet fer una predicció comprovable.", points: ["Pregunta precisa i mesurable", "Hipòtesi raonada", "Predicció: si... aleshores..."] },
      { title: "Variables i control", text: "La variable independent és la que canviem, la dependent és la que mesurem i les variables de control es mantenen iguals. Comparar amb un control ajuda a atribuir l'efecte a una sola causa.", points: ["Canviar una variable cada vegada", "Repetir mesures", "Treballar amb unitats"] },
      { title: "De les dades a la conclusió", text: "Una conclusió respon la pregunta inicial, cita les dades i indica si donen suport a la hipòtesi. Un resultat inesperat no és un fracàs: pot revelar un error o una nova pregunta.", points: ["Distingir dada i opinió", "No generalitzar més del que permet la mostra", "Comunicar incerteses"] },
    ],
    numeric: { prompt: "Tres mesures són 12,1 cm, 12,3 cm i 12,2 cm. Calcula la mitjana.", answer: 12.2, tolerance: 0.01, model: "(12,1 + 12,3 + 12,2) / 3 = 12,2 cm" },
    checkpoint: { prompt: "Quina és la variable dependent si estudiem com la llum afecta el creixement d'una planta?", options: ["Les hores de llum", "El creixement de la planta", "El tipus de test", "La hipòtesi"], answer: "El creixement de la planta", explanation: "És el resultat que mesurem." },
    sequence: { prompt: "Ordena una investigació científica.", items: ["Formular la pregunta", "Proposar una hipòtesi", "Planificar la comprovació", "Recollir dades", "Analitzar i concloure"] },
    match: { prompt: "Associa cada element amb el seu paper.", groups: ["Canviem", "Mesurem", "Mantenim"], mapping: { "Hores de llum": "Canviem", "Alçada de la planta": "Mesurem", "Quantitat d'aigua": "Mantenim" } },
    interpretation: { context: "Grup A: 6 h de llum, creixement mitjà 4,1 cm. Grup B: 10 h, 6,8 cm. Grup C: 14 h, 6,7 cm.", prompt: "Quina tendència mostren les dades i quin límit tenen?", data: ["6 h → 4,1 cm", "10 h → 6,8 cm", "14 h → 6,7 cm"], model: "El creixement augmenta de 6 a 10 hores, però no continua augmentant amb 14 hores. Amb només tres grups no podem afirmar quin és l'òptim exacte.", rubric: commonRubric("la lectura de dades i els límits de la mostra") },
    methodCase: { context: "Un anunci afirma que una beguda millora la memòria perquè 8 de 10 persones compradores diuen notar-se millor.", prompt: "Explica dos problemes del disseny i proposa una comprovació millor.", model: "La mostra és menuda i esbiaixada, i la sensació no és una mesura objectiva. Caldria assignar aleatòriament moltes persones a beguda i placebo, aplicar la mateixa prova de memòria i comparar resultats.", rubric: commonRubric("variables, control i qualitat de la mostra") },
    decision: { context: "La classe ha de triar entre repetir una mesura una vegada o cinc.", prompt: "Quina opció triaries i per què?", model: "Triaria cinc repeticions perquè permeten calcular una mitjana, detectar valors anòmals i reduir l'efecte de l'error aleatori.", rubric: commonRubric("repetició, mitjana i error experimental") },
    mission: { context: "Al pati sembla que una zona és sempre més calorosa.", prompt: "Dissenya una investigació sense fer-la: pregunta, hipòtesi, variables, dades i criteri de conclusió.", model: "Pregunta: canvia la temperatura segons la zona? Hipòtesi: l'asfalt al sol és més calent. Mesurar a la mateixa hora i altura diverses vegades en asfalt, ombra i jardí; controlar termòmetre i temps d'espera; comparar mitjanes.", rubric: commonRubric("el disseny complet d'una investigació") },
  },
  {
    id: "u02", order: 2, term: 1, icon: "≈", color: "#f4a261",
    title: "Nombres que expliquen", shortTitle: "Proporcions i unitats",
    subtitle: "Percentatges, raons, notació científica i estimacions en context.",
    areas: ["Matemàtiques", "Interdisciplinari"], keyVocabulary: ["raó", "proporció", "percentatge", "potència", "ordre de magnitud"],
    theory: [
      { title: "Raons i proporcionalitat", text: "Una raó compara dues quantitats. Si totes dues varien mantenint la mateixa raó, hi ha proporcionalitat directa i podem usar un factor de proporcionalitat.", points: ["Taula de valors", "Regla de tres amb sentit", "Comprovar unitats"] },
      { title: "Percentatges", text: "Un percentatge és una fracció de denominador 100. Per calcular p % d'una quantitat multipliquem per p/100; per comparar canvis usem el valor inicial com a referència.", points: ["Part = total · percentatge", "Canvi relatiu ≠ canvi absolut", "Descomptes successius no se sumen"] },
      { title: "Nombres molt grans o menuts", text: "La notació científica escriu un nombre com a·10ⁿ, amb 1 ≤ |a| < 10. Ajuda a comparar escales i evitar zeros.", points: ["Potències de deu", "Ordre de magnitud", "Estimació abans de calcular"] },
    ],
    numeric: { prompt: "Una mostra de 250 g conté un 12 % d'aigua. Quants grams d'aigua hi ha?", answer: 30, model: "250 · 12 / 100 = 30 g" },
    checkpoint: { prompt: "Quina expressió és notació científica correcta?", options: ["45·10³", "4,5·10⁴", "0,45·10⁵", "45000·10⁰"], answer: "4,5·10⁴", explanation: "El coeficient ha d'estar entre 1 i 10." },
    sequence: { prompt: "Ordena els passos per calcular un percentatge.", items: ["Identificar el total", "Convertir el percentatge en decimal", "Multiplicar pel total", "Escriure la unitat", "Comprovar si el resultat és raonable"] },
    match: { prompt: "Associa magnitud i unitat habitual.", groups: ["Longitud", "Massa", "Volum"], mapping: { "2,4 km": "Longitud", "350 g": "Massa", "1,5 L": "Volum" } },
    interpretation: { context: "Consum d'aigua: dilluns 120 L, dimarts 96 L, dimecres 102 L.", prompt: "Calcula mentalment el canvi de dilluns a dimarts i interpreta'l.", data: ["Dl: 120 L", "Dt: 96 L", "Dc: 102 L"], model: "Baixa 24 L. Com que 24/120 = 0,20, és una reducció del 20 %.", rubric: commonRubric("percentatges i interpretació contextual") },
    methodCase: { context: "Una etiqueta diu 18 g de sucre per cada 100 mL. El recipient té 330 mL.", prompt: "Explica com estimaries el sucre total i comprovaries el càlcul.", model: "Multiplique 18 per 3,3: 59,4 g. L'estimació 18·3 ≈ 54 g confirma que l'ordre de magnitud és coherent.", rubric: commonRubric("proporcionalitat, unitats i estimació") },
    decision: { context: "Producte A: 750 g per 3,60 €. Producte B: 1,2 kg per 5,40 €.", prompt: "Quin és més econòmic? Justifica amb preu per kg.", model: "A costa 4,80 €/kg i B costa 4,50 €/kg; B és més econòmic per unitat, encara que el preu total siga major.", rubric: commonRubric("comparació de raons i decisió") },
    mission: { context: "Cal preparar un menú per a 24 persones a partir d'una recepta per a 6.", prompt: "Explica el factor d'escala i com evitaries errors amb les unitats.", model: "El factor és 24/6 = 4; multiplique cada ingredient per 4 i convertisc a una unitat comuna abans de sumar o comprar.", rubric: commonRubric("escala, proporcionalitat i unitats") },
  },
  {
    id: "u03", order: 3, term: 1, icon: "ƒ", color: "#457b9d",
    title: "Fórmules amb sentit", shortTitle: "Àlgebra científica",
    subtitle: "Expressions, equacions i fórmules per relacionar magnituds.",
    areas: ["Matemàtiques", "Física i Química"], keyVocabulary: ["variable", "expressió", "equació", "aïllar", "substituir"],
    theory: [
      { title: "Lletres que representen quantitats", text: "Una variable representa un valor que pot canviar. Una expressió algebraica descriu operacions i una equació afirma que dues expressions són iguals.", points: ["Definir cada lletra", "Respectar les unitats", "Usar parèntesis"] },
      { title: "Aïllar una incògnita", text: "Aïllar és aplicar operacions inverses als dos membres sense trencar la igualtat. En una fórmula podem canviar quina magnitud volem calcular.", points: ["Mateixa operació als dos costats", "Simplificar amb ordre", "Substituir al final"] },
      { title: "Comprovar", text: "Una solució és fiable si satisfà l'equació original, té unitats coherents i és possible en el context.", points: ["Substitució", "Anàlisi d'unitats", "Estimació"] },
    ],
    numeric: { prompt: "La densitat és d = m/V. Calcula d si m = 540 g i V = 200 cm³.", answer: 2.7, tolerance: 0.01, model: "d = 540 / 200 = 2,7 g/cm³" },
    checkpoint: { prompt: "Si v = e/t, quina fórmula calcula el temps?", options: ["t = v/e", "t = e/v", "t = e·v", "t = 1/(e·v)"], answer: "t = e/v", explanation: "Multipliquem per t i dividim per v." },
    sequence: { prompt: "Ordena la resolució d'una fórmula.", items: ["Escriure la fórmula", "Identificar dades i incògnita", "Aïllar si cal", "Substituir amb unitats", "Comprovar el resultat"] },
    match: { prompt: "Associa símbol i magnitud.", groups: ["Massa", "Volum", "Densitat"], mapping: { "m": "Massa", "V": "Volum", "d": "Densitat" } },
    interpretation: { context: "Un mòbil recorre 0, 5, 10 i 15 m en 0, 2, 4 i 6 s.", prompt: "Quina relació algebraica descriu el moviment?", data: ["0 s → 0 m", "2 s → 5 m", "4 s → 10 m", "6 s → 15 m"], model: "La raó e/t és sempre 2,5 m/s, per tant e = 2,5t. És una proporcionalitat directa.", rubric: commonRubric("patró, fórmula i unitats") },
    methodCase: { context: "Un alumne obté 12 kg/m³ per a la densitat d'una peça metàl·lica menuda.", prompt: "Com detectaries si el resultat és sospitós?", model: "Revisaria les conversions de grams a kg i de cm³ a m³, compararia amb densitats conegudes i substituiria les dades en la fórmula.", rubric: commonRubric("comprovació algebraica i dimensional") },
    decision: { context: "Dues tarifes: A = 8 + 0,12x; B = 14 + 0,06x, on x són minuts.", prompt: "Explica com decidir quina convé segons l'ús.", model: "Iguale 8+0,12x = 14+0,06x: x=100. Per menys de 100 min convé A; per més, B; a 100 costen igual.", rubric: commonRubric("equacions i interpretació de solucions") },
    mission: { context: "Una recepta energètica usa E = 17c + 37g, amb carbohidrats c i greixos g en grams.", prompt: "Construeix i resol un exemple que done prop de 500 kJ.", model: "Per exemple c=12 i g=8: E=17·12+37·8=500 kJ. Cal indicar dades, substitució i unitat.", rubric: commonRubric("modelització amb fórmules") },
  },
  {
    id: "u04", order: 4, term: 1, icon: "↗", color: "#6d597a",
    title: "Canvis i gràfiques", shortTitle: "Funcions i models",
    subtitle: "Llegir, construir i criticar relacions entre dues variables.",
    areas: ["Matemàtiques", "Interdisciplinari"], keyVocabulary: ["funció", "pendent", "intersecció", "tendència", "interpolació"],
    theory: [
      { title: "Tres representacions", text: "Una relació entre variables es pot expressar amb una taula, una gràfica o una fórmula. Canviar de representació ajuda a veure patrons diferents.", points: ["Eixos i unitats", "Escala regular", "Punts i tendència"] },
      { title: "Ritme de canvi", text: "La pendent indica quant canvia la variable dependent quan la independent augmenta una unitat. Una pendent positiva creix; una negativa decreix.", points: ["Δy/Δx", "Interpretació amb unitats", "Valor inicial"] },
      { title: "Models i límits", text: "Un model simplifica la realitat. Interpolar dins de les dades sol ser més segur que extrapolar lluny del rang observat.", points: ["Domini útil", "Valors impossibles", "No confondre correlació i causa"] },
    ],
    numeric: { prompt: "En y = 3x + 5, calcula y quan x = 4.", answer: 17, model: "y = 3·4 + 5 = 17" },
    checkpoint: { prompt: "Què representa la pendent en una gràfica distància-temps?", options: ["La posició inicial", "La velocitat", "El temps total", "La massa"], answer: "La velocitat", explanation: "És el canvi de distància per unitat de temps." },
    sequence: { prompt: "Ordena la construcció d'una gràfica.", items: ["Identificar variables", "Triar eixos i escala", "Escriure magnituds i unitats", "Representar punts", "Descriure la tendència"] },
    match: { prompt: "Classifica la tendència.", groups: ["Creix", "Decreix", "Es manté"], mapping: { "Pendent +2": "Creix", "Pendent −0,5": "Decreix", "Pendent 0": "Es manté" } },
    interpretation: { context: "Temperatura d'un líquid: 0 min 20 °C; 2 min 32 °C; 4 min 44 °C; 6 min 56 °C.", prompt: "Descriu la tendència i prediu 5 min sense anar més enllà de les dades.", data: ["0→20", "2→32", "4→44", "6→56"], model: "Augmenta 6 °C per minut de manera lineal. A 5 min el model prediu 50 °C.", rubric: commonRubric("pendent, interpolació i unitats") },
    methodCase: { context: "Una gràfica mostra que quan augmenta el nombre de paraigües també augmenten els accidents de trànsit.", prompt: "Per què no podem dir que els paraigües causen accidents?", model: "És una correlació explicada per una tercera variable: la pluja augmenta alhora l'ús de paraigües i el risc d'accidents.", rubric: commonRubric("correlació, causalitat i variables ocultes") },
    decision: { context: "Model A s'ajusta molt bé entre 10 i 30 °C. Es vol usar a 90 °C.", prompt: "Acceptaries la predicció? Argumenta.", model: "No sense noves dades: 90 °C queda molt fora del rang i és una extrapolació; el comportament pot canviar.", rubric: commonRubric("rang de validesa d'un model") },
    mission: { context: "La classe registra durant una setmana hores de son i nivell d'atenció.", prompt: "Proposa la gràfica i explica quina conclusió sí seria legítima.", model: "Diagrama de dispersió: son a l'eix x i atenció a y. Podem descriure associació, però no assegurar causalitat sense controlar altres variables.", rubric: commonRubric("representació, tendència i prudència causal") },
  },
  {
    id: "u05", order: 5, term: 1, icon: "▥", color: "#e76f51",
    title: "Dades sobre la salut", shortTitle: "Estadística",
    subtitle: "Mostres, mesures de centralització, dispersió i probabilitat.",
    areas: ["Matemàtiques", "Biologia i Geologia"], keyVocabulary: ["població", "mostra", "mitjana", "mediana", "rang"],
    theory: [
      { title: "De qui parlen les dades?", text: "La població és el conjunt d'interés i la mostra és la part observada. Una mostra ha de ser suficient i representativa.", points: ["Evitar selecció voluntària esbiaixada", "Descriure mida i procedència", "Anonimitzar dades personals"] },
      { title: "Resumir sense ocultar", text: "La mitjana usa tots els valors, la mediana ocupa la posició central i el rang mesura la separació entre màxim i mínim.", points: ["Ordenar abans de trobar la mediana", "Valors extrems afecten la mitjana", "Donar també una mesura de dispersió"] },
      { title: "Probabilitat i risc", text: "La probabilitat va de 0 a 1 o de 0 % a 100 %. Un risc relatiu alt pot correspondre a un canvi absolut menut; cal mirar els dos.", points: ["Casos favorables / possibles", "Freqüència observada", "Risc absolut i relatiu"] },
    ],
    numeric: { prompt: "Calcula la mitjana de 7, 8, 6, 9 i 10 hores.", answer: 8, model: "(7+8+6+9+10)/5 = 8 hores" },
    checkpoint: { prompt: "Quina mesura resisteix millor un valor extrem?", options: ["Mitjana", "Mediana", "Rang", "Suma"], answer: "Mediana", explanation: "Depén de la posició, no de la grandària extrema." },
    sequence: { prompt: "Ordena una anàlisi estadística.", items: ["Definir la població", "Seleccionar la mostra", "Recollir dades", "Resumir i representar", "Interpretar amb limitacions"] },
    match: { prompt: "Associa concepte i exemple.", groups: ["Població", "Mostra", "Variable"], mapping: { "Tot l'alumnat de 3r": "Població", "30 alumnes seleccionats": "Mostra", "Hores de son": "Variable" } },
    interpretation: { context: "Grup A: mitjana 7,8 h, rang 2 h. Grup B: mitjana 7,8 h, rang 6 h.", prompt: "Què tenen igual i què és diferent?", data: ["A: mitjana 7,8; rang 2", "B: mitjana 7,8; rang 6"], model: "La tendència central és igual, però B és molt més dispers: les experiències individuals són menys homogènies.", rubric: commonRubric("centralització i dispersió") },
    methodCase: { context: "Per estimar l'activitat física del centre s'enquesta només l'equip esportiu.", prompt: "Identifica el biaix i proposa una mostra millor.", model: "La mostra sobrepresenta persones actives. Cal seleccionar aleatòriament alumnat de cursos i grups diferents.", rubric: commonRubric("mostreig representatiu i biaix") },
    decision: { context: "Tractament A redueix el risc del 2 % a l'1 %. Un anunci diu «redueix el risc un 50 %».", prompt: "És correcte? Quina informació afegiries?", model: "El risc relatiu baixa un 50 %, però el canvi absolut és d'1 punt percentual. Cal donar tots dos i el nombre de persones estudiades.", rubric: commonRubric("risc absolut, relatiu i comunicació") },
    mission: { context: "Vols estudiar la relació entre pantalles nocturnes i descans mantenint l'anonimat.", prompt: "Dissenya variables, mostra i forma de presentar resultats.", model: "Enquesta anònima estratificada; minuts de pantalla i hores/qualitat de son; diagrama de dispersió i resums, sense publicar respostes individuals ni afirmar causalitat.", rubric: commonRubric("estadística, privacitat i interpretació") },
  },
  {
    id: "u06", order: 6, term: 1, icon: "△", color: "#2a9d8f",
    title: "Mesurar l'espai", shortTitle: "Geometria i escala",
    subtitle: "Longituds, àrees, volums, semblança i mapes.",
    areas: ["Matemàtiques", "Biologia i Geologia"], keyVocabulary: ["escala", "semblança", "àrea", "volum", "Pitàgores"],
    theory: [
      { title: "Mesures geomètriques", text: "Perímetre mesura contorn, àrea mesura superfície i volum mesura espai ocupat. Les unitats canvien al quadrat o al cub.", points: ["cm, cm² i cm³ no són intercanviables", "Descompondre figures", "Estimar abans"] },
      { title: "Semblança i escala", text: "Figures semblants tenen la mateixa forma i longituds proporcionals. En una escala 1:n, una unitat al dibuix representa n unitats reals.", points: ["Convertir unitats", "Factor lineal", "Àrees escalen amb el quadrat"] },
      { title: "Distàncies indirectes", text: "El teorema de Pitàgores relaciona els costats d'un triangle rectangle: a²+b²=c². Serveix per calcular diagonals i distàncies.", points: ["Identificar hipotenusa", "Comprovar que és triangle rectangle", "Arrel quadrada final"] },
    ],
    numeric: { prompt: "En un mapa 1:50.000, una ruta mesura 3,2 cm. Quants km són?", answer: 1.6, tolerance: 0.01, model: "3,2·50.000 = 160.000 cm = 1,6 km" },
    checkpoint: { prompt: "Si dupliquem totes les longituds d'un quadrat, l'àrea...", options: ["Es duplica", "Es triplica", "Es quadruplica", "No canvia"], answer: "Es quadruplica", explanation: "L'àrea escala amb 2²." },
    sequence: { prompt: "Ordena un problema d'escala.", items: ["Llegir l'escala", "Mesurar al plànol", "Aplicar el factor", "Convertir unitats", "Comprovar l'ordre de magnitud"] },
    match: { prompt: "Associa magnitud i unitat.", groups: ["Perímetre", "Àrea", "Volum"], mapping: { "24 m": "Perímetre", "36 m²": "Àrea", "18 m³": "Volum" } },
    interpretation: { context: "Parcel·la A: 20×10 m. Parcel·la B: mateix perímetre, 15×15 m.", prompt: "Compara perímetre i àrea i explica què mostra.", data: ["A: 20×10", "B: 15×15"], model: "Totes dues tenen perímetre 60 m. A té 200 m² i B 225 m²: el mateix contorn no determina la mateixa superfície.", rubric: commonRubric("perímetre, àrea i comparació") },
    methodCase: { context: "Un plànol s'ha ampliat al 200 % en una fotocopiadora.", prompt: "Què passa amb longituds i àrees?", model: "Les longituds es dupliquen; les àrees es multipliquen per 2²=4. L'escala numèrica original ja no és vàlida sense ajustar-la.", rubric: commonRubric("factor d'escala lineal i superficial") },
    decision: { context: "Cal situar una zona d'ombra per cobrir més pati amb 40 m de tanca.", prompt: "Quina forma rectangular recomanaries i per què?", model: "Un quadrat de 10×10 m dona 100 m² i maximitza l'àrea entre rectangles de perímetre 40 m.", rubric: commonRubric("optimització geomètrica argumentada") },
    mission: { context: "Dissenya en paper un itinerari segur de 2 km al voltant del centre.", prompt: "Explica com usaries escala, trams i Pitàgores.", model: "Trie escala, mesure trams, convertisc a distàncies reals i use Pitàgores només en diagonals de triangles rectangles; sume i ajuste fins a 2 km.", rubric: commonRubric("escala, distància i comunicació espacial") },
  },
  {
    id: "u07", order: 7, term: 2, icon: "◉", color: "#84a98c",
    title: "La cèl·lula, unitat de vida", shortTitle: "Cèl·lules",
    subtitle: "Organització cel·lular, funcions vitals i nivells d'organització.",
    areas: ["Biologia i Geologia"], keyVocabulary: ["cèl·lula", "membrana", "citoplasma", "nucli", "orgànul"],
    theory: [
      { title: "Teoria cel·lular", text: "Tots els éssers vius estan formats per una o més cèl·lules; la cèl·lula és la unitat bàsica de funció i tota cèl·lula prové d'una altra.", points: ["Unicel·lular i pluricel·lular", "Mida microscòpica", "Informació genètica"] },
      { title: "Estructures i funcions", text: "La membrana regula intercanvis, el citoplasma conté reaccions i el material genètic dirigeix el funcionament. En eucariotes, els orgànuls especialitzen tasques.", points: ["Nucli: ADN", "Mitocondri: energia", "Cloroplast: fotosíntesi"] },
      { title: "Nivells d'organització", text: "En organismes pluricel·lulars, cèl·lules semblants formen teixits; els teixits formen òrgans; els òrgans coordinats formen aparells o sistemes.", points: ["Cèl·lula → teixit", "Teixit → òrgan", "Òrgans → sistema → organisme"] },
    ],
    numeric: { prompt: "Una imatge cel·lular mesura 40 mm i la cèl·lula real 0,02 mm. Calcula l'augment.", answer: 2000, model: "Augment = 40 / 0,02 = 2.000×" },
    checkpoint: { prompt: "Quina estructura regula l'entrada i eixida de substàncies?", options: ["Membrana", "Nucli", "Mitocondri", "Paret òssia"], answer: "Membrana", explanation: "És la frontera selectiva de la cèl·lula." },
    sequence: { prompt: "Ordena de menor a major nivell.", items: ["Cèl·lula", "Teixit", "Òrgan", "Sistema", "Organisme"] },
    match: { prompt: "Associa estructura i funció.", groups: ["Control genètic", "Obtenció d'energia", "Intercanvi"], mapping: { "Nucli": "Control genètic", "Mitocondri": "Obtenció d'energia", "Membrana": "Intercanvi" } },
    interpretation: { context: "Mostra A té paret, cloroplasts i gran vacúol. Mostra B no té paret ni cloroplasts.", prompt: "Identifica els dos tipus cel·lulars i justifica.", data: ["A: paret + cloroplasts", "B: sense paret ni cloroplasts"], model: "A és vegetal pels cloroplasts i la paret; B és animal perquè manca d'aquestes estructures.", rubric: commonRubric("estructures i classificació cel·lular") },
    methodCase: { context: "Un dibuix mostra un bacteri amb nucli delimitat.", prompt: "Detecta l'error del model i corregeix-lo.", model: "Els bacteris són procariotes i no tenen nucli delimitat per membrana; l'ADN es troba al citoplasma, en una regió nucleoide.", rubric: commonRubric("diferències entre procariotes i eucariotes") },
    decision: { context: "Una infografia diu que una cèl·lula «pensa» com un organisme.", prompt: "La consideres una explicació adequada?", model: "És una metàfora enganyosa. La cèl·lula respon mitjançant processos químics regulats; no implica consciència.", rubric: commonRubric("precisió dels models biològics") },
    mission: { context: "Has d'explicar per què una lesió muscular afecta el moviment.", prompt: "Relaciona cèl·lules, teixit, òrgan i sistema.", model: "Les cèl·lules musculars formen teixit muscular; el teixit integra músculs, que amb ossos i nervis formen l'aparell locomotor. El dany redueix la contracció coordinada.", rubric: commonRubric("nivells d'organització i funció") },
  },
  {
    id: "u08", order: 8, term: 2, icon: "🍎", color: "#e9c46a",
    title: "Alimentació i nutrició", shortTitle: "Nutrició",
    subtitle: "Nutrients, dieta, digestió i decisions informades.",
    areas: ["Biologia i Geologia", "Matemàtiques"], keyVocabulary: ["nutrient", "digestió", "absorció", "dieta", "energia"],
    theory: [
      { title: "Aliment no és nutrient", text: "Els aliments contenen nutrients. Glúcids i greixos aporten energia; proteïnes tenen funció estructural; vitamines, minerals, aigua i fibra regulen processos.", points: ["Varietat", "Proporció", "Freqüència"] },
      { title: "De l'aliment a les cèl·lules", text: "La digestió transforma molècules grans; l'absorció passa nutrients a la sang, sobretot a l'intestí prim; les restes s'eliminen.", points: ["Boca i estómac", "Intestí prim: absorció", "Intestí gros: aigua"] },
      { title: "Llegir etiquetes", text: "Cal comparar per 100 g o 100 mL, no només per ració. Una decisió saludable considera el conjunt de la dieta, no un únic nutrient.", points: ["Sucres i sal", "Greixos saturats", "Fibra i mida de ració"] },
    ],
    numeric: { prompt: "Un menú aporta 8.400 kJ. Si el 25 % ve del desdejuni, quants kJ són?", answer: 2100, model: "8.400·0,25 = 2.100 kJ" },
    checkpoint: { prompt: "On s'absorbeix la major part dels nutrients?", options: ["Boca", "Estómac", "Intestí prim", "Intestí gros"], answer: "Intestí prim", explanation: "Les vellositats augmenten molt la superfície d'absorció." },
    sequence: { prompt: "Ordena el recorregut digestiu.", items: ["Boca", "Esòfag", "Estómac", "Intestí prim", "Intestí gros"] },
    match: { prompt: "Classifica funció principal.", groups: ["Energètica", "Estructural", "Reguladora"], mapping: { "Glúcids": "Energètica", "Proteïnes": "Estructural", "Vitamines": "Reguladora" } },
    interpretation: { context: "Cereals A: 18 g sucres i 3 g fibra/100 g. B: 6 g sucres i 9 g fibra/100 g.", prompt: "Compara'ls sense afirmar que un aliment aïllat és «bo» o «roín».", data: ["A: 18 g sucres; 3 g fibra", "B: 6 g sucres; 9 g fibra"], model: "B té menys sucre i més fibra per 100 g, per tant encaixa millor com a opció habitual; també cal considerar ració, ingredients i dieta global.", rubric: commonRubric("etiquetes i decisió alimentària") },
    methodCase: { context: "Una persona elimina tots els greixos perquè aporten molta energia.", prompt: "Explica per què la decisió és massa simple.", model: "Alguns greixos són necessaris per membranes, hormones i absorció de vitamines. Cal limitar excessos i prioritzar greixos insaturats, no eliminar-los.", rubric: commonRubric("funcions dels nutrients i equilibri") },
    decision: { context: "Menú A és barat però molt salat; B costa 0,80 € més i inclou llegums, fruita i aigua.", prompt: "Quin triaries per a ús habitual? Considera salut i cost.", model: "Triaria B habitualment si el pressupost ho permet, per millor varietat, fibra i menor càrrega de sal; es pot reduir cost amb producte de temporada.", rubric: commonRubric("salut, economia i argumentació") },
    mission: { context: "Prepara un dia de menú per a una excursió sense calcular calories exactes.", prompt: "Justifica varietat, conservació i residus.", model: "Inclouria aigua, entrepà integral amb proteïna segura, fruita i fruita seca si no hi ha al·lèrgies; aliments resistents, recipients reutilitzables i racions adequades.", rubric: commonRubric("nutrició, seguretat i sostenibilitat") },
  },
  {
    id: "u09", order: 9, term: 2, icon: "♥", color: "#e63946",
    title: "Transport i intercanvi", shortTitle: "Aparells vitals",
    subtitle: "Respiració, circulació i excreció treballen coordinadament.",
    areas: ["Biologia i Geologia", "Matemàtiques"], keyVocabulary: ["alvèol", "capil·lar", "circulació", "excreció", "homeòstasi"],
    theory: [
      { title: "Intercanvi de gasos", text: "Als alvèols, l'oxigen passa a la sang i el diòxid de carboni ix. La gran superfície, paret fina i xarxa capil·lar faciliten l'intercanvi.", points: ["Ventilació ≠ respiració cel·lular", "Difusió", "Relació estructura-funció"] },
      { title: "Transport intern", text: "El cor impulsa sang pels vasos. Les artèries ixen del cor, les venes hi tornen i els capil·lars permeten intercanvis amb teixits.", points: ["Circuit pulmonar", "Circuit general", "Plasma i cèl·lules sanguínies"] },
      { title: "Eliminar i regular", text: "Els ronyons filtren la sang i formen orina, regulant aigua i sals. Pulmons, pell i fetge també intervenen en l'eliminació de substàncies.", points: ["Excreció no és defecació", "Equilibri intern", "Hidratació"] },
    ],
    numeric: { prompt: "A 72 batecs per minut, quants batecs fa el cor en 10 minuts?", answer: 720, model: "72·10 = 720 batecs" },
    checkpoint: { prompt: "Quins vasos permeten l'intercanvi amb els teixits?", options: ["Artèries grans", "Venes grans", "Capil·lars", "Tràquea"], answer: "Capil·lars", explanation: "Tenen parets molt fines i formen xarxes." },
    sequence: { prompt: "Ordena el recorregut de l'oxigen.", items: ["Alvèol", "Sang pulmonar", "Cor", "Artèria sistèmica", "Cèl·lula"] },
    match: { prompt: "Associa estructura i funció.", groups: ["Impulsar", "Intercanviar", "Filtrar"], mapping: { "Cor": "Impulsar", "Capil·lar": "Intercanviar", "Ronyó": "Filtrar" } },
    interpretation: { context: "Pols en repòs: 68 bpm. Després de córrer: 148 bpm. Als 5 min: 82 bpm.", prompt: "Descriu i explica el canvi.", data: ["Repòs 68", "Exercici 148", "Recuperació 82"], model: "El pols puja per portar més oxigen i nutrients als músculs i després baixa cap al valor de repòs durant la recuperació.", rubric: commonRubric("dades fisiològiques i coordinació") },
    methodCase: { context: "Un esquema pinta sempre les artèries de roig i les venes de blau.", prompt: "Quina simplificació pot provocar error?", model: "El color representa habitualment oxigenació, no el tipus de vas. L'artèria pulmonar porta sang poc oxigenada i les venes pulmonars, oxigenada.", rubric: commonRubric("models del sistema circulatori") },
    decision: { context: "Després d'exercici intens una persona evita beure per no suar.", prompt: "Avalua la decisió.", model: "És inadequada: s'ha perdut aigua i sals; la hidratació ajuda a recuperar volum sanguini i regulació tèrmica. Cal beure de manera segura i progressiva.", rubric: commonRubric("homeòstasi i salut") },
    mission: { context: "Explica a una cèl·lula muscular com rep oxigen i elimina CO₂.", prompt: "Construeix una cadena causal amb tres aparells.", model: "El respiratori incorpora O₂ als alvèols; el circulatori el transporta fins als capil·lars musculars; el CO₂ fa el camí invers i s'expulsa pels pulmons.", rubric: commonRubric("coordinació entre aparells") },
  },
  {
    id: "u10", order: 10, term: 2, icon: "⚡", color: "#577590",
    title: "Coordinació i resposta", shortTitle: "Nerviós i endocrí",
    subtitle: "Estímuls, respostes, hormones i prevenció d'addiccions.",
    areas: ["Biologia i Geologia"], keyVocabulary: ["neurona", "sinapsi", "reflex", "hormona", "addicció"],
    theory: [
      { title: "Informació ràpida", text: "El sistema nerviós rep estímuls, integra informació i coordina respostes mitjançant impulsos nerviosos. Els reflexos són respostes ràpides i involuntàries.", points: ["Receptor", "Centre nerviós", "Efector"] },
      { title: "Regulació hormonal", text: "Les glàndules endocrines alliberen hormones a la sang. Solen actuar més lentament però durant més temps que els impulsos nerviosos.", points: ["Cèl·lules diana", "Retroalimentació", "Coordinació amb sistema nerviós"] },
      { title: "Salut i addiccions", text: "Les substàncies addictives alteren circuits de recompensa i control. El risc depén de substància, dosi, freqüència, edat i context; demanar ajuda és una conducta de salut.", points: ["Dependència i tolerància", "Pressió de grup", "Fonts sanitàries fiables"] },
    ],
    numeric: { prompt: "El temps de reacció baixa de 0,28 s a 0,21 s. Quina és la disminució?", answer: 0.07, tolerance: 0.001, model: "0,28 − 0,21 = 0,07 s" },
    checkpoint: { prompt: "Quin sistema sol donar una resposta més ràpida?", options: ["Endocrí", "Nerviós", "Digestiu", "Excretor"], answer: "Nerviós", explanation: "Els impulsos nerviosos viatgen ràpidament per neurones." },
    sequence: { prompt: "Ordena un arc reflex.", items: ["Estímul", "Receptor", "Neurona sensitiva", "Centre nerviós", "Efector"] },
    match: { prompt: "Associa element i sistema.", groups: ["Nerviós", "Endocrí", "Efector"], mapping: { "Neurona": "Nerviós", "Hormona": "Endocrí", "Múscul": "Efector" } },
    interpretation: { context: "Temps de reacció mitjà: descans 0,22 s; falta de son 0,31 s.", prompt: "Interpreta sense convertir l'associació en una llei universal.", data: ["Descans: 0,22 s", "Poc son: 0,31 s"], model: "En aquesta mostra, la falta de son s'associa amb resposta més lenta en 0,09 s. Cal conéixer mostra i control d'altres variables abans de generalitzar.", rubric: commonRubric("dades, sistema nerviós i prudència") },
    methodCase: { context: "Un vídeo afirma que una substància «natural» no pot crear addicció.", prompt: "Avalua l'argument.", model: "Natural no significa segura. Cal estudiar mecanisme, dosi, evidència clínica, dependència i efectes; l'origen no determina el risc.", rubric: commonRubric("pensament crític i salut") },
    decision: { context: "Un amic et pressiona per provar un vapejador perquè «tothom ho fa».", prompt: "Formula una decisió i una estratègia de resposta.", model: "Rebutjaria l'oferta, qüestionaria la falsa normalització i buscaria suport d'una persona adulta o sanitària si la pressió continua.", rubric: commonRubric("prevenció, autonomia i fonts fiables") },
    mission: { context: "Explica per què retirar la mà d'una superfície calenta ocorre abans de sentir el dolor conscient.", prompt: "Diferencia reflex i percepció.", model: "La medul·la coordina ràpidament el reflex cap al múscul; alhora la informació puja al cervell, on es construeix la percepció conscient del dolor.", rubric: commonRubric("arc reflex i integració nerviosa") },
  },
  {
    id: "u11", order: 11, term: 2, icon: "✚", color: "#43aa8b",
    title: "Defenses i salut", shortTitle: "Immunitat",
    subtitle: "Barreres, resposta immunitària, vacunes i ús responsable d'antibiòtics.",
    areas: ["Biologia i Geologia", "Matemàtiques"], keyVocabulary: ["patogen", "barrera", "anticòs", "vacuna", "antibiòtic"],
    theory: [
      { title: "Prevenir l'entrada", text: "Pell, mucoses, cilis i secrecions són barreres. Si un patogen entra, actuen respostes innates i específiques.", points: ["Inflamació", "Limfòcits", "Memòria immunitària"] },
      { title: "Vacunació", text: "Les vacunes entrenen el sistema immunitari amb antígens segurs perquè desenvolupe memòria sense patir la malaltia greu.", points: ["Protecció individual", "Reducció de transmissió", "Benefici col·lectiu"] },
      { title: "Antibiòtics", text: "Actuen contra bacteris, no contra virus. L'ús innecessari afavoreix la selecció de bacteris resistents.", points: ["Prescripció sanitària", "Completar pauta indicada", "Resistència com a evolució poblacional"] },
    ],
    numeric: { prompt: "En 100 persones hi havia 40 casos i després d'una mesura n'hi ha 16. Quants casos menys hi ha?", answer: 24, model: "40 − 16 = 24 casos menys" },
    checkpoint: { prompt: "Per què un antibiòtic no cura la grip?", options: ["La dosi és baixa", "La grip és vírica", "Els anticossos el bloquegen", "Sempre la cura"], answer: "La grip és vírica", explanation: "Els antibiòtics tenen dianes bacterianes." },
    sequence: { prompt: "Ordena una resposta immune simplificada.", items: ["Entrada del patogen", "Reconeixement", "Activació de defenses", "Eliminació", "Memòria immunitària"] },
    match: { prompt: "Associa acció i categoria.", groups: ["Barrera", "Immunitat específica", "Tractament bacterià"], mapping: { "Pell": "Barrera", "Anticòs": "Immunitat específica", "Antibiòtic": "Tractament bacterià" } },
    interpretation: { context: "Grup vacunat: 8 casos de 200. No vacunat: 32 de 200.", prompt: "Compara freqüències i formula una conclusió prudent.", data: ["Vacunat: 8/200", "No vacunat: 32/200"], model: "Hi ha 4 % de casos en vacunats i 16 % en no vacunats. En aquestes dades la vacunació s'associa amb menor freqüència, però cal conéixer el disseny.", rubric: commonRubric("freqüències i immunitat") },
    methodCase: { context: "Algú deixa l'antibiòtic quan es troba millor, contra la pauta mèdica.", prompt: "Explica el problema biològic.", model: "Poden quedar bacteris supervivents i tornar a multiplicar-se; seguir la pauta prescrita redueix fracàs i selecció de resistències.", rubric: commonRubric("selecció i ús responsable d'antibiòtics") },
    decision: { context: "Una xarxa difon un efecte advers sense indicar quantes dosis s'han administrat.", prompt: "Quina informació necessites per valorar el risc?", model: "Nombre total de dosis, freqüència esperada sense vacuna, gravetat, relació temporal i causal, font i comparació amb el risc de la malaltia.", rubric: commonRubric("risc, denominadors i fonts fiables") },
    mission: { context: "Redacta un missatge breu per explicar a la classe immunitat col·lectiva sense prometre protecció absoluta.", prompt: "Inclou mecanisme, límit i responsabilitat.", model: "Quan moltes persones són immunes, el patogen troba menys cadenes de transmissió i protegeix indirectament persones vulnerables; no elimina tot risc i cal seguir mesures sanitàries.", rubric: commonRubric("comunicació científica sobre vacunes") },
  },
  {
    id: "u12", order: 12, term: 2, icon: "∞", color: "#b56576",
    title: "Reproducció i sexualitat saludable", shortTitle: "Reproducció",
    subtitle: "Canvis, reproducció humana, anticoncepció, ITS i respecte.",
    areas: ["Biologia i Geologia"], keyVocabulary: ["gàmeta", "fecundació", "cicle", "anticoncepció", "consentiment"],
    theory: [
      { title: "Reproducció humana", text: "Els gàmetes contenen informació genètica. La fecundació forma un zigot; el desenvolupament embrionari i fetal ocorre habitualment a l'úter.", points: ["Ovari i testicle", "Fecundació no és implantació", "Variabilitat biològica"] },
      { title: "Salut sexual", text: "La salut sexual inclou informació, respecte, consentiment lliure i reversible, absència de pressió i accés a serveis sanitaris.", points: ["Privacitat", "Diversitat", "Comunicació i límits"] },
      { title: "Prevenció", text: "Els mètodes anticonceptius tenen eficàcies i usos diferents. El preservatiu és l'únic mètode habitual que també redueix el risc de moltes ITS.", points: ["Ús correcte", "Doble protecció", "Fonts sanitàries"] },
    ],
    numeric: { prompt: "En un model de cicle de 28 dies, si l'ovulació s'estima 14 dies abans del final, quin dia seria?", answer: 14, model: "28 − 14 = dia 14; és només un model aproximat." },
    checkpoint: { prompt: "Quin mètode també redueix el risc de moltes ITS?", options: ["Preservatiu", "Calendari", "Píndola", "DIU"], answer: "Preservatiu", explanation: "Actua com a barrera; cal ús correcte." },
    sequence: { prompt: "Ordena el procés inicial.", items: ["Formació de gàmetes", "Fecundació", "Zigot", "Implantació", "Desenvolupament embrionari"] },
    match: { prompt: "Associa terme i funció.", groups: ["Gàmeta", "Òrgan de gestació", "Barrera"], mapping: { "Espermatozoide": "Gàmeta", "Úter": "Òrgan de gestació", "Preservatiu": "Barrera" } },
    interpretation: { context: "Mètode A: 91 % d'eficàcia en ús típic. B: 85 %. Cap protegeix d'ITS.", prompt: "Què podem i què no podem concloure?", data: ["A: 91 %", "B: 85 %", "Sense protecció ITS"], model: "A presenta major eficàcia anticonceptiva típica, però cap redueix ITS; la decisió requereix assessorament, preferències, contraindicacions i possible preservatiu.", rubric: commonRubric("eficàcia, límits i salut sexual") },
    methodCase: { context: "Una aplicació prediu «dies segurs» exactes per a totes les persones.", prompt: "Critica el model.", model: "Els cicles varien entre persones i mesos; una predicció mitjana no garanteix absència d'ovulació ni protegeix d'ITS.", rubric: commonRubric("variabilitat biològica i límits dels models") },
    decision: { context: "Una persona canvia d'opinió després d'haver dit que sí.", prompt: "Què implica el consentiment?", model: "El consentiment es pot retirar en qualsevol moment; cal parar immediatament, respectar la decisió i evitar qualsevol pressió.", rubric: commonRubric("consentiment i presa de decisions") },
    mission: { context: "Una publicació anònima afirma una «cura casolana» per a una ITS.", prompt: "Descriu una resposta segura i basada en evidències.", model: "No seguir-la; consultar un servei sanitari, fer proves si correspon, informar parelles segons indicació i usar fonts oficials. Les ITS requereixen diagnòstic i tractament adequats.", rubric: commonRubric("fonts fiables i conducta de salut") },
  },
  {
    id: "u13", order: 13, term: 3, icon: "⛰", color: "#bc6c25",
    title: "La Terra canvia", shortTitle: "Geologia",
    subtitle: "Relleu, processos interns i externs, mapes i riscos geològics.",
    areas: ["Biologia i Geologia", "Matemàtiques"], keyVocabulary: ["erosió", "sedimentació", "placa", "relleu", "risc"],
    theory: [
      { title: "Modelar el relleu", text: "Meteorització trenca roques; erosió les desgasta i transporta; sedimentació diposita materials. Aigua, vent, gel i gravetat actuen amb velocitats diferents.", points: ["Procés i agent", "Escales de temps", "Acció humana"] },
      { title: "Dinàmica interna", text: "La tectònica de plaques explica terratrémols, vulcanisme i serralades. Els límits poden ser divergents, convergents o transformants.", points: ["Energia interna", "Plaques litosfèriques", "Distribució de riscos"] },
      { title: "Risc i prevenció", text: "Risc combina perillositat, exposició i vulnerabilitat. No podem evitar molts fenòmens, però sí reduir danys amb planificació i preparació.", points: ["Mapes de risc", "Normes de construcció", "Plans d'emergència"] },
    ],
    numeric: { prompt: "En un mapa 1:25.000, 8 cm representen quants km?", answer: 2, model: "8·25.000 = 200.000 cm = 2 km" },
    checkpoint: { prompt: "Quin procés deposita materials transportats?", options: ["Meteorització", "Erosió", "Sedimentació", "Fusió"], answer: "Sedimentació", explanation: "Ocorre quan l'agent perd energia." },
    sequence: { prompt: "Ordena el cicle extern simplificat.", items: ["Meteorització", "Erosió", "Transport", "Sedimentació", "Compactació"] },
    match: { prompt: "Associa fenomen i origen dominant.", groups: ["Intern", "Extern", "Risc combinat"], mapping: { "Terratrémol": "Intern", "Barranc erosionat": "Extern", "Dany urbà": "Risc combinat" } },
    interpretation: { context: "Zona A: alta perillositat, baixa població. Zona B: perillositat mitjana, població densa i edificis vulnerables.", prompt: "On pot ser major el risc i per què?", data: ["A: perill alt, exposició baixa", "B: perill mitjà, exposició/vulnerabilitat altes"], model: "Pot ser major a B perquè risc no és només perillositat: l'alta exposició i vulnerabilitat poden augmentar molt els danys.", rubric: commonRubric("perillositat, exposició i vulnerabilitat") },
    methodCase: { context: "Després d'una tempesta apareix una esquerda i es conclou que la tempesta causarà sempre despreniments.", prompt: "Quina evidència faltaria?", model: "Cal comparar abans/després, pendent, roca, aigua, antecedents i altres zones; un cas no permet una regla universal.", rubric: commonRubric("causalitat i evidència geològica") },
    decision: { context: "Es proposa construir en una zona inundable perquè fa anys que no s'inunda.", prompt: "Avalua la decisió.", model: "Absència recent no elimina el risc. Cal usar sèries llargues, mapes, escenaris climàtics i mesures d'evacuació o evitar l'exposició.", rubric: commonRubric("risc, probabilitat i prevenció") },
    mission: { context: "Prepara una explicació de classe sobre un terratrémol sense alarmisme.", prompt: "Inclou causa, risc i tres mesures.", model: "Moviment sobtat en una falla allibera energia. El dany depén d'exposició i construcció. Mesures: edificis adequats, assegurar objectes i practicar ajupir-se-cobrir-se-agafar-se.", rubric: commonRubric("geologia, risc i comunicació") },
  },
  {
    id: "u14", order: 14, term: 3, icon: "♻", color: "#588157",
    title: "Ecosistemes i sostenibilitat", shortTitle: "Ecologia",
    subtitle: "Relacions, flux d'energia, cicles i decisions ambientals.",
    areas: ["Biologia i Geologia", "Matemàtiques"], keyVocabulary: ["ecosistema", "població", "xarxa tròfica", "biodiversitat", "sostenibilitat"],
    theory: [
      { title: "Sistema viu", text: "Un ecosistema integra comunitat d'éssers vius i factors físics. Les poblacions es relacionen per competència, depredació, mutualisme i altres interaccions.", points: ["Biòtop i biocenosi", "Hàbitat i nínxol", "Canvis en xarxa"] },
      { title: "Matèria i energia", text: "L'energia entra principalment del Sol i disminueix entre nivells tròfics; la matèria es recicla en cicles com els de l'aigua i el carboni.", points: ["Productors", "Consumidors", "Descomponedors"] },
      { title: "Decidir amb criteris", text: "Sostenibilitat combina límits ecològics, benestar social i viabilitat econòmica. Cal comparar impactes durant tot el cicle de vida.", points: ["Reduir abans de reciclar", "Petjada material i energètica", "Justícia ambiental"] },
    ],
    numeric: { prompt: "En una mostra hi ha 18 espècies natives de 24 totals. Quin percentatge són natives?", answer: 75, model: "18/24·100 = 75 %" },
    checkpoint: { prompt: "Quin grup recicla nutrients de restes orgàniques?", options: ["Productors", "Herbívors", "Descomponedors", "Depredadors"], answer: "Descomponedors", explanation: "Transformen matèria orgànica i retornen nutrients." },
    sequence: { prompt: "Ordena un nivell tròfic simple.", items: ["Sol", "Productor", "Herbívor", "Carnívor", "Descomponedor"] },
    match: { prompt: "Associa relació i exemple.", groups: ["Mutualisme", "Depredació", "Competència"], mapping: { "Abella i flor": "Mutualisme", "Mussol i ratolí": "Depredació", "Dues plantes per llum": "Competència" } },
    interpretation: { context: "Després de reduir depredadors: herbívors +60 %, vegetació −35 %, erosió +20 %.", prompt: "Construeix una explicació causal prudent.", data: ["Depredadors ↓", "Herbívors +60 %", "Vegetació −35 %", "Erosió +20 %"], model: "Menys depredació pot afavorir herbívors; més consum redueix vegetació i el sòl queda menys protegit, augmentant erosió. Cal comprovar altres canvis simultanis.", rubric: commonRubric("xarxes ecològiques i causalitat") },
    methodCase: { context: "Per mesurar biodiversitat només es compta el nombre d'arbres.", prompt: "Per què l'indicador és insuficient?", model: "No considera espècies, abundàncies, altres grups ni diversitat d'hàbitats. Cal combinar riquesa i equitat amb mostreig comparable.", rubric: commonRubric("indicadors de biodiversitat") },
    decision: { context: "Opció A: gots compostables d'un sol ús. B: gots reutilitzables rentats.", prompt: "Quina informació demanaries abans de triar?", model: "Nombre d'usos, energia i aigua de rentat, origen de materials, transport, sistema real de compostatge i residus finals.", rubric: commonRubric("cicle de vida i sostenibilitat") },
    mission: { context: "El centre vol reduir residus un 30 %.", prompt: "Proposa tres accions, indicadors i una manera d'avaluar.", model: "Mesurar residu inicial; reduir envasos, reutilitzar i separar; pesar setmanalment per tipus i comparar per alumne amb la línia base.", rubric: commonRubric("objectius, indicadors i acció ambiental") },
  },
  {
    id: "u15", order: 15, term: 3, icon: "◆", color: "#4d908e",
    title: "Matèria que mesurem", shortTitle: "Matèria i gasos",
    subtitle: "Propietats, densitat, model cineticomolecular i gasos.",
    areas: ["Física i Química", "Matemàtiques"], keyVocabulary: ["massa", "volum", "densitat", "partícula", "pressió"],
    theory: [
      { title: "Propietats de la matèria", text: "Massa i volum depenen de la quantitat; la densitat relaciona ambdues i ajuda a identificar materials: d=m/V.", points: ["Unitats coherents", "Propietat característica", "Flotar depén de densitats"] },
      { title: "Model de partícules", text: "La matèria està formada per partícules en moviment. Els estats s'expliquen per distància, ordre, moviment i forces entre partícules.", points: ["Sòlid: posicions fixes", "Líquid: proximitat i mobilitat", "Gas: separació i moviment lliure"] },
      { title: "Gasos", text: "La pressió naix dels xocs de les partícules. Si disminueix el volum a temperatura constant, augmenta la freqüència de xocs i la pressió.", points: ["Temperatura i moviment", "Volum del recipient", "Model qualitatiu"] },
    ],
    numeric: { prompt: "Una mostra té 135 g i ocupa 50 cm³. Calcula la densitat.", answer: 2.7, tolerance: 0.01, model: "d = 135/50 = 2,7 g/cm³" },
    checkpoint: { prompt: "En comprimir un gas a temperatura constant, la pressió...", options: ["Disminueix", "Augmenta", "No canvia", "Es fa zero"], answer: "Augmenta", explanation: "Hi ha més xocs per unitat de superfície i temps." },
    sequence: { prompt: "Ordena un càlcul de densitat.", items: ["Identificar massa i volum", "Convertir unitats", "Escriure d=m/V", "Substituir", "Interpretar i comparar"] },
    match: { prompt: "Associa estat i descripció.", groups: ["Sòlid", "Líquid", "Gas"], mapping: { "Forma i volum fixos": "Sòlid", "Volum fix, forma variable": "Líquid", "Forma i volum variables": "Gas" } },
    interpretation: { context: "Materials: suro 0,24; aigua 1,00; alumini 2,70 g/cm³.", prompt: "Prediu què passa amb suro i alumini en aigua.", data: ["Suro 0,24", "Aigua 1,00", "Alumini 2,70"], model: "El suro, menys dens, tendeix a flotar; l'alumini massís, més dens, tendeix a enfonsar-se.", rubric: commonRubric("densitat i predicció") },
    methodCase: { context: "Un alumne diu que les partícules d'un gas es fan més grans quan s'escalfa.", prompt: "Corregeix el model.", model: "Les partícules no necessàriament canvien de mida; augmenta l'energia cinètica i, si el recipient pot expandir-se, la distància mitjana.", rubric: commonRubric("model cineticomolecular") },
    decision: { context: "Per identificar una peça es proposa mirar només el color.", prompt: "Quines mesures serien millors?", model: "Mesuraria massa i volum per calcular densitat, repetiria i compararia amb valors de referència; el color pot coincidir en materials diferents.", rubric: commonRubric("propietats característiques i mesura") },
    mission: { context: "Una xeringa tancada amb aire es pot comprimir, però una plena d'aigua quasi no.", prompt: "Explica-ho amb partícules sense fer l'experiment.", model: "En el gas hi ha molt espai entre partícules i es pot reduir; en el líquid estan molt pròximes i queda poc espai per disminuir.", rubric: commonRubric("model de partícules i compressibilitat") },
  },
  {
    id: "u16", order: 16, term: 3, icon: "⚛", color: "#277da1",
    title: "Àtoms i substàncies", shortTitle: "Àtoms i fórmules",
    subtitle: "Models atòmics, elements, ions, molècules i llenguatge químic.",
    areas: ["Física i Química"], keyVocabulary: ["àtom", "element", "protó", "ió", "fórmula"],
    theory: [
      { title: "Estructura atòmica", text: "El nucli conté protons positius i neutrons; els electrons negatius ocupen la zona externa. El nombre atòmic Z és el nombre de protons.", points: ["Àtom neutre: protons=electrons", "A=protons+neutrons", "Isòtops: mateix Z"] },
      { title: "Elements i taula periòdica", text: "Cada element es defineix pel nombre de protons i té un símbol. La taula ordena elements i agrupa propietats semblants.", points: ["Símbols amb majúscula/minúscula", "Metalls i no-metalls", "Grups i períodes"] },
      { title: "Fórmules", text: "Una fórmula indica quins elements i quants àtoms formen una substància. Un subíndex afecta només el símbol anterior.", points: ["H₂O: 2 H i 1 O", "CO₂: 1 C i 2 O", "No inventar càrregues"] },
    ],
    numeric: { prompt: "Un àtom té A=23 i Z=11. Quants neutrons té?", answer: 12, model: "Neutrons = A − Z = 23 − 11 = 12" },
    checkpoint: { prompt: "Què identifica un element químic?", options: ["Nombre de neutrons", "Nombre de protons", "Massa de la mostra", "Estat físic"], answer: "Nombre de protons", explanation: "És el nombre atòmic Z." },
    sequence: { prompt: "Ordena de menor a major organització química.", items: ["Partícula subatòmica", "Àtom", "Molècula", "Substància", "Mescla"] },
    match: { prompt: "Associa símbol i recompte en CO₂.", groups: ["1 àtom", "2 àtoms", "No apareix"], mapping: { "Carboni": "1 àtom", "Oxigen": "2 àtoms", "Nitrogen": "No apareix" } },
    interpretation: { context: "X: Z=8, A=16. Y: Z=8, A=18. W: Z=9, A=18.", prompt: "Quins són isòtops i per què?", data: ["X 8/16", "Y 8/18", "W 9/18"], model: "X i Y són isòtops: mateix nombre de protons Z=8 i diferent nombre de neutrons/massa A.", rubric: commonRubric("nombre atòmic, massa i isòtops") },
    methodCase: { context: "Un model dibuixa electrons com planetes en òrbites exactes.", prompt: "Com presentaries el valor i el límit del model?", model: "Ajuda a visualitzar nucli i capes, però no representa trajectòries planetàries exactes; és una simplificació de distribucions de probabilitat.", rubric: commonRubric("ús crític de models atòmics") },
    decision: { context: "Una etiqueta diu «sense químics».", prompt: "És científicament correcta?", model: "No literalment: tota matèria, inclosos aigua i aliments, està formada per substàncies químiques. Pot voler dir sense certs additius, que s'han d'especificar.", rubric: commonRubric("llenguatge químic i comunicació") },
    mission: { context: "Explica H₂O, O₂ i H₂O₂ a una persona que confon subíndexs.", prompt: "Compara composició i substància.", model: "H₂O té 2 H i 1 O; O₂, dos O; H₂O₂, 2 H i 2 O. Canviar la proporció canvia la substància i les propietats.", rubric: commonRubric("fórmules i composició") },
  },
  {
    id: "u17", order: 17, term: 3, icon: "ϟ", color: "#f8961e",
    title: "Energia i electricitat", shortTitle: "Energia elèctrica",
    subtitle: "Transferències, calor, circuits, potència i consum responsable.",
    areas: ["Física i Química", "Matemàtiques"], keyVocabulary: ["energia", "calor", "corrent", "tensió", "potència"],
    theory: [
      { title: "Energia i transferències", text: "L'energia es conserva però es transfereix i es degrada. Calor és transferència d'energia per diferència de temperatura; temperatura no és quantitat de calor.", points: ["Conducció, convecció, radiació", "Sistema i entorn", "Eficiència"] },
      { title: "Circuits", text: "El corrent és moviment ordenat de càrrega. Tensió impulsa, resistència dificulta i la llei d'Ohm relaciona V=I·R en dispositius òhmics.", points: ["Circuit tancat", "Sèrie i paral·lel", "Seguretat"] },
      { title: "Potència i consum", text: "La potència és energia per temps: P=V·I i E=P·t. En factures s'usa kWh. Menys potència o menys temps redueix consum.", points: ["W i kW", "kWh és energia", "Cost = energia·tarifa"] },
    ],
    numeric: { prompt: "Un aparell funciona a 230 V i 2 A. Calcula la potència.", answer: 460, model: "P = V·I = 230·2 = 460 W" },
    checkpoint: { prompt: "Quina unitat de factura representa energia?", options: ["W", "V", "A", "kWh"], answer: "kWh", explanation: "Potència multiplicada pel temps." },
    sequence: { prompt: "Ordena l'anàlisi d'un consum.", items: ["Llegir potència", "Convertir W a kW", "Multiplicar per hores", "Obtenir kWh", "Multiplicar per tarifa"] },
    match: { prompt: "Associa magnitud i unitat.", groups: ["Tensió", "Corrent", "Potència"], mapping: { "Volt": "Tensió", "Ampere": "Corrent", "Watt": "Potència" } },
    interpretation: { context: "A: 1.500 W durant 0,5 h. B: 500 W durant 2 h.", prompt: "Quin consumeix més energia?", data: ["A: 1,5 kW·0,5 h", "B: 0,5 kW·2 h"], model: "A consumeix 0,75 kWh i B 1 kWh; B consumeix més encara que té menys potència perquè funciona més temps.", rubric: commonRubric("potència, temps i energia") },
    methodCase: { context: "Una manta i un termòmetre estan a la mateixa habitació. Algú diu que la manta «té més calor».", prompt: "Corregeix l'explicació.", model: "Poden estar a la mateixa temperatura; la manta redueix la transferència de calor del cos a l'entorn. Calor és energia en trànsit.", rubric: commonRubric("calor, temperatura i aïllament") },
    decision: { context: "Bombeta A: 9 W, 10 €. B: 60 W, 2 €. Mateixa llum i 1.000 h d'ús.", prompt: "Com decidiries amb tarifa 0,20 €/kWh?", model: "A usa 9 kWh i costa 1,80 € d'energia +10=11,80 €. B usa 60 kWh i costa 12+2=14 €. A costa menys i consumeix menys.", rubric: commonRubric("cost total i eficiència") },
    mission: { context: "Analitza una factura domèstica per reduir consum sense perdre benestar.", prompt: "Proposa tres accions quantificables i prioritza-les.", model: "Identificar grans potències i hores; reduir climatització ineficient, temps d'ús i standby; estimar kWh estalviats i prioritzar major estalvi amb seguretat.", rubric: commonRubric("energia, càlcul i decisió responsable") },
  },
  {
    id: "u18", order: 18, term: 3, icon: "◎", color: "#264653",
    title: "Missió PDC: decidir amb ciència", shortTitle: "Projecte final",
    subtitle: "Salut, energia i medi ambient en una decisió interdisciplinària.",
    areas: ["Interdisciplinari"], keyVocabulary: ["criteri", "indicador", "escenari", "impacte", "argument"],
    theory: [
      { title: "Problemes reals", text: "Una decisió sociocientífica combina dades, models, valors i restriccions. Primer definim el problema i les persones afectades.", points: ["Separar fets i prioritats", "Buscar alternatives", "Detectar incertesa"] },
      { title: "Comparar amb criteris", text: "Una matriu de decisió fa explícits criteris com salut, cost, emissions, equitat i viabilitat. Les ponderacions s'han de justificar.", points: ["Indicadors mesurables", "Mateixa escala", "Anàlisi de sensibilitat"] },
      { title: "Argumentar i revisar", text: "Una bona proposta formula una afirmació, aporta evidències i explica el raonament. També reconeix objeccions i diu què faria canviar la decisió.", points: ["Afirmació-evidència-raonament", "Fonts contrastades", "Seguiment amb indicadors"] },
    ],
    numeric: { prompt: "Una proposta baixa les emissions anuals de 420 kg a 275 kg. Quants kg estalvia?", answer: 145, model: "420 − 275 = 145 kg anuals" },
    checkpoint: { prompt: "Quin criteri és un indicador mesurable?", options: ["M'agrada", "Queda bonic", "kWh per alumne i mes", "És el millor"], answer: "kWh per alumne i mes", explanation: "Té magnitud, unitat i període." },
    sequence: { prompt: "Ordena una decisió informada.", items: ["Definir el problema", "Recollir evidències", "Establir criteris", "Comparar alternatives", "Decidir i avaluar"] },
    match: { prompt: "Associa dada i dimensió.", groups: ["Salut", "Economia", "Ambient"], mapping: { "Qualitat de l'aire interior": "Salut", "Cost anual": "Economia", "kg de CO₂": "Ambient" } },
    interpretation: { context: "Pla A: cost 8.000 €, −30 % energia. Pla B: 3.000 €, −12 %. Pressupost 9.000 €.", prompt: "Compara estalvi relatiu i restricció; evita decidir només pel percentatge.", data: ["A: 8.000 €, −30 %", "B: 3.000 €, −12 %"], model: "A dona més estalvi i cap dins del pressupost, però cal calcular kWh i retorn. B deixa pressupost per altres accions; la millor combinació depén de costos i impactes complets.", rubric: commonRubric("comparació multicriteri") },
    methodCase: { context: "Una empresa presenta només l'any amb menor consum per demostrar millora.", prompt: "Quin problema hi ha i quines dades demanaries?", model: "És selecció interessada de dades. Demanaria sèrie de diversos anys, activitat del centre, clima, mètode de mesura i consum per alumne.", rubric: commonRubric("qualitat i selecció de dades") },
    decision: { context: "El centre tria entre més ombra vegetal, aire condicionat o canvi d'horaris davant la calor.", prompt: "Construeix una decisió amb salut, energia, cost i equitat.", model: "Compararia reducció de temperatura, protecció de vulnerables, kWh, cost i temps d'aplicació. Probablement combinaria ombra i horaris, reservant climatització eficient per a episodis i espais crítics.", rubric: commonRubric("decisió sociocientífica multicriteri") },
    mission: { context: "Repte final: proposa una millora mesurable per al centre en salut, energia o ambient.", prompt: "Inclou diagnòstic, càlcul, evidències, pla, indicador i revisió.", model: "Exemple: reduir 20 % el consum d'il·luminació. Mesurar línia base, substituir punts prioritaris i ajustar horaris, estimar kWh/cost/CO₂, controlar mensualment i revisar si no s'assoleix l'objectiu.", rubric: commonRubric("integració completa de ciència i matemàtiques") },
  },
];

function activitiesFor(seed: UnitSeed): Activity[] {
  const base = `${seed.id}-`;
  const area = seed.areas[0];
  const scientificText = unitSupplements[seed.id].scientificText;
  return [
    { id: base + "01", unitId: seed.id, title: "Càlcul amb procediment", kind: "numeric", area, prompt: seed.numeric.prompt, answer: seed.numeric.answer, tolerance: seed.numeric.tolerance ?? 0.001, modelAnswer: seed.numeric.model, explanation: `Procediment model: ${seed.numeric.model}`, hint: "Escriu les dades, la relació que uses i comprova la unitat.", maxScore: 10 },
    { id: base + "02", unitId: seed.id, title: "Idea clau", kind: "choice", area, prompt: seed.checkpoint.prompt, options: seed.checkpoint.options, answer: seed.checkpoint.answer, modelAnswer: `${seed.checkpoint.answer}. ${seed.checkpoint.explanation}`, explanation: seed.checkpoint.explanation, hint: "Descarta opcions que confonguen magnituds o causes.", maxScore: 10 },
    { id: base + "03", unitId: seed.id, title: "Posa ordre", kind: "order", area, prompt: seed.sequence.prompt, items: seed.sequence.items, answer: seed.sequence.items.join("|"), modelAnswer: seed.sequence.items.map((x, i) => `${i + 1}. ${x}`).join(" · "), explanation: "L'ordre mostra el procés complet, no només el resultat.", hint: "Busca què ha d'ocórrer necessàriament abans.", maxScore: 10 },
    { id: base + "04", unitId: seed.id, title: "Classifica i associa", kind: "match", area, prompt: seed.match.prompt, groups: seed.match.groups, mapping: seed.match.mapping, answer: JSON.stringify(seed.match.mapping), modelAnswer: Object.entries(seed.match.mapping).map(([k, v]) => `${k} → ${v}`).join(" · "), explanation: "Cada associació es basa en la definició o funció científica.", hint: "Compara cada terme amb la definició exacta.", maxScore: 10 },
    { id: base + "05", unitId: seed.id, title: "Interpreta les dades", kind: "open", area, prompt: seed.interpretation.prompt, context: seed.interpretation.context, data: seed.interpretation.data, modelAnswer: seed.interpretation.model, explanation: "La IA compara la resposta amb una rúbrica i envia els casos dubtosos a revisió docent.", hint: "Cita almenys una dada i explica què significa.", rubric: seed.interpretation.rubric, maxScore: 10 },
    { id: base + "06", unitId: seed.id, title: "Pensa com la ciència", kind: "open", area, prompt: seed.methodCase.prompt, context: seed.methodCase.context, modelAnswer: seed.methodCase.model, explanation: "No cal fer l'experiment: cal descriure el disseny o analitzar l'evidència.", hint: "Identifica variables, evidències, control o límits segons el cas.", rubric: seed.methodCase.rubric, maxScore: 10 },
    { id: base + "07", unitId: seed.id, title: "Pren una decisió", kind: "decision", area, prompt: seed.decision.prompt, context: seed.decision.context, modelAnswer: seed.decision.model, explanation: "Una decisió científica explicita criteris, proves i límits.", hint: "Tria, justifica amb evidències i reconeix una condició o límit.", rubric: seed.decision.rubric, maxScore: 10 },
    { id: base + "08", unitId: seed.id, title: "Missió interdisciplinària", kind: "mission", area: "Interdisciplinari", prompt: seed.mission.prompt, context: seed.mission.context, modelAnswer: seed.mission.model, explanation: "Integra coneixement científic, procediment matemàtic i comunicació.", hint: "Organitza la resposta en problema, dades, raonament i proposta.", rubric: seed.mission.rubric, maxScore: 10 },
    {
      id: base + "09",
      unitId: seed.id,
      title: "Llig, interpreta i comenta",
      kind: "text",
      area,
      prompt: "Redacta un comentari científic que responga les tres qüestions de lectura. Integra-les en un text coherent: idea principal, evidències, explicació i valoració.",
      context: scientificText.paragraphs.join("\n\n"),
      scientificText,
      modelAnswer: scientificText.modelComment,
      explanation: "Llig el text com una font científica: identifica què afirma, usa les seues evidències i valora'n els límits.",
      hint: "Subratlla la idea principal, tria dues evidències i connecta-les amb un concepte de la unitat abans de concloure.",
      rubric: scientificTextRubric,
      maxScore: 10,
    },
  ];
}

export const curriculum: Unit[] = seeds.map((seed) => ({
  id: seed.id,
  order: seed.order,
  title: seed.title,
  shortTitle: seed.shortTitle,
  subtitle: seed.subtitle,
  areas: seed.areas,
  term: seed.term,
  color: seed.color,
  icon: seed.icon,
  theory: seed.theory.map((block, index) => ({
    ...block,
    ...unitSupplements[seed.id].theory[index],
  })),
  theoryImages: unitSupplements[seed.id].images,
  scientificText: unitSupplements[seed.id].scientificText,
  keyVocabulary: seed.keyVocabulary,
  activities: activitiesFor(seed),
}));

export const allActivities = curriculum.flatMap((unit) => unit.activities);
export const activityById = new Map(allActivities.map((activity) => [activity.id, activity]));
export const unitById = new Map(curriculum.map((unit) => [unit.id, unit]));

export const curriculumStats = {
  units: curriculum.length,
  activities: allActivities.length,
  openActivities: allActivities.filter((activity) => ["open", "decision", "mission", "text"].includes(activity.kind)).length,
  theoryBlocks: curriculum.reduce((sum, unit) => sum + unit.theory.length, 0),
};
