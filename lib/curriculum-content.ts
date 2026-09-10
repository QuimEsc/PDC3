export type TheoryExpansion = {
  development: string;
  example: string;
};

export type TheoryImage = {
  src: string;
  alt: string;
  caption: string;
};

export type ScientificText = {
  title: string;
  lead: string;
  paragraphs: string[];
  questions: string[];
  modelComment: string;
};

export type UnitSupplement = {
  theory: [TheoryExpansion, TheoryExpansion, TheoryExpansion];
  images?: TheoryImage[];
  scientificText: ScientificText;
};

export const unitSupplements: Record<string, UnitSupplement> = {
  u01: {
    theory: [
      {
        development: "Perquè una pregunta siga investigable ha d'indicar què s'observarà, en quines condicions i, si és possible, com es mesurarà. «Les plantes creixen millor?» és massa general; «com varia l'alçada mitjana de plantes iguals quan canvien les hores de llum diàries?» concreta una variable i permet recollir dades. La hipòtesi no és una endevinalla ni una veritat que cal demostrar, sinó una explicació provisional basada en coneixements previs. D'ella es dedueix una predicció: si la hipòtesi és adequada i fem el canvi previst, hauríem d'observar un resultat determinat.",
        example: "Pregunta: com afecta la llum al creixement? Hipòtesi: més llum augmentarà el creixement fins a un límit perquè facilita la fotosíntesi.",
      },
      {
        development: "Una comparació només és útil si els grups es diferencien en la variable que volem estudiar. Si canviem alhora llum, aigua i tipus de terra, no sabrem quina causa explica el resultat. També cal definir el procediment: instrument, unitat, moment de mesura, nombre de repeticions i mida de la mostra. Les repeticions no eliminen tots els errors, però redueixen l'efecte de variacions accidentals i permeten calcular una mitjana. El grup de control ofereix una referència; no sempre és un grup «sense res», sinó el que manté la situació habitual.",
        example: "Tres tests reben 6 h de llum i tres en reben 10 h; tots tenen la mateixa espècie, terra, aigua, temperatura i temps de creixement.",
      },
      {
        development: "Les dades són registres: nombres, categories, observacions o imatges obtingudes amb un procediment. Abans de concloure, s'organitzen en taules o gràfiques, es calculen mesures adequades i es busquen patrons. Una conclusió científica ha de respondre la pregunta, citar resultats concrets i explicar si són compatibles amb la predicció. No és correcte afirmar que una causa està demostrada només perquè dos fenòmens coincideixen. També cal declarar limitacions —mostra menuda, mesura poc precisa o variable no controlada— i proposar com milloraria una nova investigació.",
        example: "«Amb 10 h la mitjana va ser 6,8 cm i amb 6 h, 4,1 cm; les dades donen suport a la hipòtesi en aquest interval, però no indiquen l'òptim.»",
      },
    ],
    scientificText: {
      title: "Quan una coincidència no demostra una causa",
      lead: "Text didàctic sobre evidència, control de variables i límits d'una investigació.",
      paragraphs: [
        "Un grup va observar que les plantes situades al costat de la finestra mesuraven, de mitjana, 4 cm més que les del fons de l'aula. Va concloure que la llum era la causa de la diferència. Tanmateix, les plantes de la finestra també rebien més calor, eren d'una varietat distinta i les regava una altra persona. La dada mostra una associació, però el disseny no permet separar l'efecte de cada factor.",
        "Per comprovar millor la hipòtesi, es podrien repartir aleatòriament plantes semblants en dos grups, variar només les hores de llum i mantindre constants el reg, el substrat i la temperatura. Mesurar diverses plantes durant setmanes donaria una estimació més estable. Fins i tot així, la conclusió s'hauria de limitar a l'espècie i a les condicions estudiades.",
      ],
      questions: [
        "Quina és la idea principal del text i quina conclusió inicial es posa en dubte?",
        "Quines dades i variables expliquen que no es puga afirmar una relació causal?",
        "Com milloraries l'estudi i quin límit conservaria la nova conclusió?",
      ],
      modelComment: "El text adverteix que una associació no basta per demostrar causalitat. Les plantes de la finestra eren 4 cm més altes, però també canviaven la temperatura, la varietat i el reg, de manera que hi ha variables de confusió. Caldria formar grups comparables, variar només la llum, repetir mesures i calcular mitjanes. La nova evidència seria més fiable, encara que només permetria parlar de l'espècie i de les condicions analitzades.",
    },
  },
  u02: {
    theory: [
      {
        development: "Una raó s'escriu com un quocient i sempre ha de conservar el significat de les magnituds comparades: euros per quilogram, grams per litre o quilòmetres per hora. En una relació directament proporcional, multiplicar una quantitat per un factor obliga a multiplicar l'altra pel mateix factor; el quocient entre elles és constant i la gràfica passa per l'origen. La regla de tres és una manera d'organitzar aquest raonament, però no s'ha d'aplicar si hi ha una quota fixa, un límit o una relació que no és proporcional.",
        example: "Si 3 L contenen 18 g de sal, la concentració és 6 g/L i 5 L, amb la mateixa mescla, contindran 30 g.",
      },
      {
        development: "Per interpretar un percentatge cal identificar amb claredat el total de referència. Una pujada de 20 a 25 no és un 5 %, sinó un augment de 5 sobre 20, és a dir, un 25 %. Els punts percentuals comparen directament dos percentatges: passar del 10 % al 15 % són 5 punts percentuals, però un augment relatiu del 50 %. En contextos de salut, economia o medi ambient convé donar també les quantitats absolutes, perquè un percentatge cridaner pot correspondre a molt pocs casos.",
        example: "Baixar de 8 casos per cada 1.000 a 4 és una reducció relativa del 50 %, però una reducció absoluta de 4 casos per cada 1.000.",
      },
      {
        development: "La notació científica permet treballar amb escales molt diferents sense perdre la posició de la coma. En multiplicacions es multipliquen els coeficients i se sumen els exponents; en divisions, es divideixen els coeficients i es resten. L'ordre de magnitud és la potència de deu que descriu aproximadament la grandària del nombre i ajuda a detectar resultats impossibles. Abans d'usar la calculadora convé fer una estimació: si una massa és de centenars de grams, un resultat de milions de quilograms indica quasi segur una conversió incorrecta.",
        example: "45.000 = 4,5·10⁴ i 0,00032 = 3,2·10⁻⁴; el segon nombre és de l'ordre de les deumil·lèsimes.",
      },
    ],
    scientificText: {
      title: "El que conta una etiqueta d'aigua",
      lead: "Text didàctic sobre concentracions, unitats i comparacions proporcionals.",
      paragraphs: [
        "Una etiqueta indica 42 mg de calci per litre. Una persona afirma que beure una botella de 500 mL aporta 42 mg, perquè és el nombre imprés. Però 500 mL són 0,5 L: si la concentració és uniforme, la quantitat de calci de la botella és 42·0,5 = 21 mg. La unitat «mg/L» expressa una raó, no la quantitat total del recipient.",
        "Una altra marca conté 68 mg/L i es ven en botelles de 330 mL. Per comparar l'aportació real cal usar la mateixa quantitat de beguda o calcular els mil·ligrams de cada envàs. També cal evitar concloure que una aigua és globalment «millor» mirant un únic mineral: la decisió depén de la dieta, les necessitats personals i la resta de la composició.",
      ],
      questions: [
        "Quin error comet la persona en interpretar 42 mg/L?",
        "Calcula el calci de la botella de 330 mL de la segona marca i compara'l amb 21 mg.",
        "Per què el càlcul no és suficient per decidir quina aigua és millor?",
      ],
      modelComment: "L'etiqueta dona una concentració i no el contingut de qualsevol envàs. En 0,5 L hi ha 21 mg de calci. La segona botella té 68·0,330 = 22,44 mg, una quantitat lleugerament major encara que l'envàs és més menut. Aquesta comparació respon només al calci; no permet declarar una marca millor sense considerar la resta de minerals, la dieta i les necessitats de la persona.",
    },
  },
  u03: {
    theory: [
      {
        development: "En ciència, les lletres representen magnituds definides i no objectes vagues. Per això, abans de calcular, s'anota què significa cada símbol i en quina unitat s'expressa. Una expressió com m/V no afirma res fins que s'indica que relaciona massa i volum; d=m/V ja estableix una equació. Substituir valors amb unitats ajuda a entendre l'operació i evita sumar o comparar magnituds incompatibles. Els parèntesis són essencials quan una magnitud completa ocupa el numerador o el denominador.",
        example: "En d=m/V, m=540 g i V=200 cm³; la divisió dona 2,7 g/cm³, no 2,7 g ni 2,7 cm³.",
      },
      {
        development: "Aïllar una incògnita significa transformar una igualtat en una altra equivalent. No es tracta de «passar» termes canviant el signe de manera mecànica, sinó d'aplicar l'operació inversa als dos membres. Si d=m/V i volem V, multipliquem per V: d·V=m; després dividim per d: V=m/d. Fer primer l'aïllament simbòlic permet reutilitzar la fórmula i redueix errors. Quan hi ha potències o arrels, també s'apliquen operacions inverses respectant possibles restriccions del context.",
        example: "De v=e/t obtenim e=v·t i t=e/v; cada forma calcula una magnitud diferent amb les mateixes relacions físiques.",
      },
      {
        development: "Una calculadora pot executar una operació incorrecta amb total precisió. Per això la verificació forma part de la resolució: se substitueix el resultat en la fórmula original, s'analitzen les unitats i es compara l'ordre de magnitud amb valors coneguts. També s'han de revisar les condicions del problema; una longitud negativa o una concentració superior al 100 % solen ser impossibles. Si les dades tenen precisió limitada, no és justificat presentar moltes xifres decimals com si totes foren significatives.",
        example: "Si una peça de 540 g ocupa 200 cm³, una densitat de 0,0027 g/cm³ és sospitosa: revela que la coma o una conversió s'han aplicat malament.",
      },
    ],
    scientificText: {
      title: "Densitat i separació de residus",
      lead: "Text didàctic sobre fórmules, unitats i ús d'un model físic.",
      paragraphs: [
        "En una planta de reciclatge s'usen banys de densitat per separar alguns plàstics. Un fragment de 36 g ocupa 40 cm³, de manera que la densitat calculada és 0,90 g/cm³. En un líquid de densitat 1,00 g/cm³ el fragment tendeix a flotar; un altre plàstic de densitat 1,35 g/cm³ tendeix a enfonsar-se. El procediment no identifica per si sol la composició exacta, però ajuda a formar grups.",
        "La predicció depén de comparar densitats en unitats compatibles i d'evitar bosses d'aire o impureses que alteren el volum efectiu. A més, objectes amb forma buida poden flotar encara que el material siga dens. El model d=m/V és útil, però la decisió industrial necessita mesures repetides i altres proves d'identificació.",
      ],
      questions: [
        "Explica amb la fórmula per què el primer fragment tendeix a flotar.",
        "Quines condicions poden fer que la predicció de la densitat falle?",
        "Quina conclusió és legítima i quina seria una generalització excessiva?",
      ],
      modelComment: "El fragment té d=36/40=0,90 g/cm³, menor que la del líquid, i per això tendeix a flotar. La comparació exigeix unitats compatibles i pot alterar-se per aire, impureses o formes buides. La densitat permet separar provisionalment materials amb comportaments diferents, però no demostra la composició química exacta. Caldrien repeticions i proves complementàries abans de classificar definitivament el residu.",
    },
  },
  u04: {
    theory: [
      {
        development: "La taula conserva els valors exactes, la gràfica fa visible la forma del canvi i la fórmula permet calcular i generalitzar dins d'un model. En una gràfica, la variable independent se situa habitualment a l'eix horitzontal i la dependent a l'eix vertical. Cada eix ha d'incloure magnitud, unitat i una escala regular. Unir punts només té sentit si la variable pot prendre valors intermedis; en categories, les barres separades són més adequades. Una escala retallada pot exagerar diferències i canviar la impressió visual sense canviar les dades.",
        example: "Temperatura (°C) davant temps (min) és una gràfica contínua; tipus d'aliment davant freqüència necessita categories, no una línia.",
      },
      {
        development: "La pendent és una taxa de canvi: divideix el canvi vertical pel canvi horitzontal. Les seues unitats expliquen què mesura, com ara graus per minut o metres per segon. En una recta y=mx+b, m és la pendent i b el valor inicial quan x=0. Una pendent constant descriu un ritme uniforme; si la gràfica és corba, la taxa varia i podem comparar pendents en intervals. Una línia horitzontal no significa que no passe res, sinó que la variable representada no canvia en aquell tram.",
        example: "Passar de 20 °C a 44 °C en 4 min dona (44−20)/4=6 °C/min; el líquid s'escalfa a ritme constant en eixe interval.",
      },
      {
        development: "Un model selecciona els aspectes essencials d'un sistema i n'ignora d'altres. Pot ajustar molt bé les dades disponibles i fallar fora del rang estudiat. Interpolar és estimar entre observacions pròximes; extrapolar és prolongar el patró més enllà i sol tindre més incertesa. A més, una gràfica conjunta no estableix automàticament una causa: dues variables poden canviar per un tercer factor. Cal combinar el patró matemàtic amb coneixement científic, qualitat de la mostra i mecanismes plausibles.",
        example: "Que augmenten alhora gelats venuts i cremades solars no significa que els gelats causen cremades; la temperatura i l'exposició solar influeixen en totes dues.",
      },
    ],
    scientificText: {
      title: "Una illa de calor al pati",
      lead: "Text didàctic sobre gràfiques de temperatura, comparacions i límits.",
      paragraphs: [
        "Durant cinc dies assolellats es va mesurar la temperatura a les 13 h en tres zones del centre. La mitjana va ser 36,2 °C sobre asfalt, 32,8 °C sota una pèrgola i 30,9 °C al jardí. Les dades suggereixen que l'ombra i la vegetació s'associen amb temperatures més baixes. No obstant això, només es va mesurar una hora del dia i cada zona tenia un instrument diferent.",
        "Per estudiar el fenomen caldria calibrar els termòmetres, alternar-los entre zones i repetir mesures al matí, al migdia i a la vesprada. Una gràfica temps-temperatura mostraria si la diferència és constant o apareix només després d'hores de radiació. Les dades poden orientar una actuació, però no prediuen sense més què passarà a l'hivern o durant una onada de calor excepcional.",
      ],
      questions: [
        "Quina tendència mostren les tres mitjanes i quina explicació científica és plausible?",
        "Identifica dos límits del procediment i explica com els corregiries.",
        "Quina decisió preliminar es podria prendre sense extrapolar més del que permeten les dades?",
      ],
      modelComment: "L'asfalt presenta la mitjana més alta i el jardí, la més baixa; l'ombra, l'evapotranspiració i les propietats dels materials poden explicar el patró. La comparació és limitada perquè només s'ha mesurat a les 13 h i s'han usat instruments diferents. Cal calibrar i intercanviar termòmetres i registrar tot el dia. Les dades justifiquen estudiar més ombra o vegetació, però no permeten predir qualsevol estació o episodi extrem.",
    },
  },
  u05: {
    theory: [
      {
        development: "Una mostra representativa s'assembla a la població en els aspectes rellevants. Preguntar només a qui respon voluntàriament, a un equip esportiu o a una única classe pot introduir biaix de selecció. La mida importa, però una mostra enorme i esbiaixada continua sent poc fiable. Cal descriure qui ha participat, com s'ha seleccionat i quantes dades falten. Quan es treballa amb salut o hàbits, s'arrepleguen només les dades necessàries, s'usen identificadors anònims i s'eviten resultats que permeten reconéixer persones.",
        example: "Per estudiar el descans del nivell, se selecciona alumnat a l'atzar de tots els grups, no sols qui participa en una activitat concreta.",
      },
      {
        development: "La mitjana reparteix el total de manera equilibrada, però pot desplaçar-se molt per valors extrems. La mediana divideix les dades ordenades en dues meitats i descriu millor alguns conjunts asimètrics. El rang és fàcil de calcular, encara que només usa màxim i mínim; per això convé observar també la forma de la distribució. Dues classes poden tindre la mateixa mitjana i experiències molt diferents. Presentar una mesura central junt amb dispersió i grandària de la mostra evita resums enganyosos.",
        example: "En 7, 7, 8, 8 i 20, la mitjana és 10 però la mediana és 8; el valor 20 altera molt la primera.",
      },
      {
        development: "La probabilitat teòrica descriu un model de resultats possibles i la freqüència relativa resumeix què ha ocorregut en una mostra. Amb moltes repeticions, la freqüència sol estabilitzar-se prop de la probabilitat, però no garanteix el resultat individual. En salut, «duplicar el risc» pot sonar enorme: passar d'1 cas a 2 per cada 10.000 duplica el risc relatiu, però l'augment absolut és d'1 cas. Per informar bé, cal donar denominadors, període, grup comparador i incertesa.",
        example: "Un risc del 2 % significa aproximadament 2 casos de cada 100 en condicions semblants, no que una persona concreta tinga un 2 % del problema.",
      },
    ],
    scientificText: {
      title: "Pantalles, son i una enquesta escolar",
      lead: "Text didàctic sobre mostres, associacions i comunicació del risc.",
      paragraphs: [
        "Una enquesta anònima a 48 alumnes va trobar que qui declarava més de tres hores de pantalla després de sopar dormia una mitjana de 6,7 hores; la resta declarava 7,6 hores. El titular «les pantalles lleven quasi una hora de son» simplifica massa el resultat. L'estudi observa una associació, però no controla deures, activitat física, horari familiar ni la precisió del record.",
        "La mostra procedeix d'un únic centre i les hores són autodeclarades. Seria útil ampliar-la, registrar diversos dies i diferenciar ús acadèmic, social i d'entreteniment. Tot i les limitacions, el patró pot justificar revisar rutines de descans, sempre que no es presente com una prova definitiva que qualsevol pantalla causa exactament la mateixa pèrdua de son.",
      ],
      questions: [
        "Quina diferència de mitjanes apareix i per què el titular és massa causal?",
        "Quines variables o problemes de mostra poden influir en el resultat?",
        "Redacta una conclusió prudent i una recomanació proporcionada a l'evidència.",
      ],
      modelComment: "La diferència observada és de 0,9 hores, però l'enquesta no demostra que la pantalla siga l'única causa. Poden influir deures, activitat, horaris familiars i errors de record; a més, només hi ha 48 alumnes d'un centre. Una conclusió prudent és que l'ús nocturn intens s'associa amb menys son en aquesta mostra. Es poden revisar rutines i ampliar l'estudi abans de generalitzar.",
    },
  },
  u06: {
    theory: [
      {
        development: "Perímetre, àrea i volum responen preguntes diferents i, per tant, utilitzen unitats diferents. Si una longitud es multiplica per 10, l'àrea d'una figura semblant es multiplica per 10² i el volum per 10³. Moltes figures reals es poden descompondre en rectangles, triangles, prismes o cilindres; després se sumen o resten les parts. Un dibuix i una estimació prèvia ajuden a triar la fórmula adequada i a detectar si s'ha calculat el contorn quan es demanava superfície.",
        example: "Un pati rectangular de 20 m per 12 m té 64 m de perímetre i 240 m² d'àrea: els nombres i les unitats expressen propietats distintes.",
      },
      {
        development: "En una escala 1:n, totes les longituds del dibuix s'han reduït pel mateix factor n. Abans d'aplicar-lo cal convertir dibuix i realitat a unitats compatibles. Si el mapa és 1:25.000, 1 cm representa 25.000 cm, és a dir, 250 m. En figures semblants, els angles corresponents són iguals i les longituds corresponents mantenen la mateixa raó. Les àrees no es multipliquen per n, sinó per n², un error freqüent en plànols i maquetes.",
        example: "En escala 1:200, una paret de 4,5 cm al plànol representa 900 cm = 9 m; una superfície s'escalaria amb 200².",
      },
      {
        development: "El teorema de Pitàgores només s'aplica a triangles rectangles. La hipotenusa és el costat oposat a l'angle recte i sempre és el més llarg. Si coneixem els catets, c=√(a²+b²); si falta un catet, a=√(c²−b²). En mapes, rampes, edificis i trajectes pot calcular una distància que no es mesura directament. Després cal comprovar que el resultat és major que cada catet i menor que la suma dels dos, condicions geomètriques bàsiques.",
        example: "Una rampa avança 4 m i puja 1,5 m: la longitud és √(4²+1,5²)≈4,27 m, una mica major que l'avanç horitzontal.",
      },
    ],
    images: [
      {
        src: "/theory/u06-escala-grafica.png",
        alt: "Exemple d'escala gràfica amb segments graduats.",
        caption: "L'escala gràfica continua sent útil si el document s'amplia o es redueix proporcionalment.",
      },
    ],
    scientificText: {
      title: "Un plànol per a una ruta segura",
      lead: "Text didàctic sobre escala, distàncies i decisions davant d'un risc.",
      paragraphs: [
        "Un plànol d'escala 1:10.000 mostra dos itineraris fins a una zona elevada. La ruta A mesura 8,4 cm i travessa un pont estret; la ruta B mesura 10,1 cm i evita el barranc. En aquesta escala, cada centímetre representa 100 m: A té 840 m i B, 1.010 m. La ruta més curta no és necessàriament la més segura.",
        "La distància és un criteri, però també importen pendent, amplària, estat del ferm, accessibilitat i perillositat durant una inundació. El plànol simplifica el terreny i pot no mostrar obstacles recents. Una decisió responsable combina el càlcul d'escala amb inspeccions actualitzades i les necessitats de persones amb mobilitat diversa.",
      ],
      questions: [
        "Explica la conversió de les dues longituds del plànol a distàncies reals.",
        "Per què no s'ha de triar automàticament la ruta A?",
        "Quines dades addicionals demanaries abans d'aprovar un itinerari d'evacuació?",
      ],
      modelComment: "A escala 1:10.000, 1 cm equival a 100 m; per això A mesura 840 m i B 1.010 m. A és 170 m més curta, però el pont i el barranc poden augmentar el risc. Cal considerar pendent, amplària, ferm, accessibilitat, estat actual i comportament de l'aigua. El plànol orienta, però la decisió necessita una inspecció i criteris de seguretat, no només distància.",
    },
  },
  u07: {
    theory: [
      {
        development: "La teoria cel·lular unifica organismes molt diferents: bacteris, plantes, fongs i animals. Tots fan funcions vitals mitjançant cèl·lules, encara que aquestes varien en forma, mida i especialització. Les cèl·lules no apareixen espontàniament; provenen de la divisió de cèl·lules anteriors i transmeten informació genètica. Els virus no tenen estructura cel·lular ni metabolisme propi i necessiten una cèl·lula hoste per reproduir-se, per això no encaixen de la mateixa manera en la definició d'ésser viu.",
        example: "Un bacteri és una sola cèl·lula que realitza totes les funcions; una neurona és una cèl·lula especialitzada dins d'un organisme pluricel·lular.",
      },
      {
        development: "La membrana plasmàtica separa el medi intern i regula selectivament l'entrada i l'eixida de substàncies. Al citoplasma tenen lloc moltes reaccions i, en cèl·lules eucariotes, els orgànuls reparteixen funcions. El nucli protegeix gran part de l'ADN; els ribosomes fabriquen proteïnes; els mitocondris participen en l'obtenció d'energia utilitzable. Les cèl·lules vegetals també tenen paret cel·lular, gran vacúol i cloroplasts en teixits fotosintètics. Relacionar estructura i funció és més útil que memoritzar una llista.",
        example: "Una cèl·lula muscular necessita molts mitocondris perquè la contracció exigeix una aportació contínua d'energia.",
      },
      {
        development: "L'especialització permet que diferents cèl·lules assumisquen tasques complementàries. Les cèl·lules epitelials formen barreres, les musculars es contrauen i les nervioses transmeten informació. Un teixit reuneix cèl·lules i material intercel·lular amb una funció; diversos teixits formen un òrgan, i els òrgans coordinats formen aparells o sistemes. El funcionament del cos depén de la cooperació entre nivells: una alteració cel·lular pot afectar un teixit, un òrgan i finalment tot l'organisme.",
        example: "Cèl·lules musculars → teixit muscular → cor → aparell circulatori → organisme.",
      },
    ],
    scientificText: {
      title: "Per què una cèl·lula muscular té tants mitocondris?",
      lead: "Text didàctic sobre especialització cel·lular i relació entre estructura i funció.",
      paragraphs: [
        "En observar teixit muscular i teixit adipós amb tècniques de laboratori, es troben diferències en la quantitat i distribució d'orgànuls. Les fibres musculars que treballen de manera sostinguda solen presentar nombrosos mitocondris. Aquests orgànuls participen en la respiració cel·lular, procés que transforma l'energia química dels nutrients en formes utilitzables per a la contracció.",
        "Això no significa que el mitocondri «fabrique energia del no-res» ni que totes les cèl·lules musculars siguen idèntiques. El nombre d'orgànuls depén de la funció, del tipus de fibra i de l'activitat. La comparació il·lustra una idea general: l'estructura d'una cèl·lula està relacionada amb la tasca que realitza dins del teixit.",
      ],
      questions: [
        "Quina relació estableix el text entre mitocondris i funció muscular?",
        "Corregeix l'expressió «els mitocondris creen energia».",
        "Quin límit impedeix afirmar que totes les cèl·lules musculars tenen la mateixa estructura?",
      ],
      modelComment: "Les fibres de treball sostingut solen tindre més mitocondris perquè necessiten transformar contínuament l'energia química dels nutrients per a la contracció. No creen energia: intervenen en transformacions energètiques de la respiració cel·lular. El text també assenyala variabilitat entre tipus de fibra i segons l'activitat, de manera que la relació estructura-funció és general però no converteix totes les cèl·lules musculars en còpies idèntiques.",
    },
  },
  u08: {
    theory: [
      {
        development: "Els nutrients compleixen funcions energètiques, plàstiques i reguladores, i molts participen en més d'una. Els glúcids són una font habitual d'energia; els lípids també formen membranes i reserves; les proteïnes aporten aminoàcids per construir i reparar estructures. Vitamines i minerals són necessaris en quantitats menudes, però no aporten energia. L'aigua és el medi de moltes reaccions i la fibra afavoreix el funcionament intestinal. Una dieta equilibrada es valora pel patró global, la varietat i la freqüència, no per aliments «miracle».",
        example: "L'oli aporta lípids, les llegums combinen glúcids, proteïnes i fibra, i una fruita aporta aigua, fibra, vitamines i sucres naturals.",
      },
      {
        development: "La digestió mecànica fragmenta i mescla; la digestió química, mitjançant enzims, transforma molècules grans en unitats absorbibles. Comença a la boca, continua a l'estómac i es completa principalment a l'intestí prim amb secrecions digestives. Les vellositats intestinals augmenten molt la superfície d'absorció i permeten que nutrients passen a la sang o a la limfa. L'intestí gros recupera aigua i sals i allotja microbiota. L'aparell digestiu treballa coordinat amb circulatori, respiratori i excretor per abastir les cèl·lules i mantindre l'equilibri intern.",
        example: "El midó es trenca en sucres més simples; després de l'absorció, la sang els transporta fins a les cèl·lules.",
      },
      {
        development: "La taula nutricional normalitza dades per 100 g o 100 mL i facilita comparar productes, mentre que la ració informa del consum real si la seua mida és realista. La llista d'ingredients s'ordena de major a menor quantitat i pot revelar sucres, greixos o sal amb noms diferents. Expressions publicitàries com «natural» o «font de» no substitueixen la composició completa. També importen el grau de processament, la freqüència de consum, les al·lèrgies, el cost i el context de la dieta.",
        example: "Un producte amb 12 g de sucre per 100 g aporta 30 g si es consumeixen 250 g, encara que l'etiqueta destaque una ració menor.",
      },
    ],
    scientificText: {
      title: "La ració menuda que canvia l'etiqueta",
      lead: "Text didàctic sobre informació nutricional, proporcionalitat i publicitat.",
      paragraphs: [
        "Un cereal anuncia «només 6 g de sucre per ració». La ració definida per la marca és de 30 g, però un bol habitual mesurat a classe conté 55 g. L'etiqueta indica 20 g de sucre per 100 g: una ració de 30 g n'aporta 6, mentre que 55 g n'aporten 11. La frase publicitària és matemàticament correcta, però pot no descriure el consum real.",
        "Comparar cereals exigeix usar la mateixa base, revisar fibra, sal, greixos i llista d'ingredients, i considerar amb quina freqüència es consumeixen. Tampoc es pot classificar un aliment com a saludable o perjudicial a partir d'un únic nutrient. La decisió ha d'encaixar en el conjunt de la dieta i en les necessitats de cada persona.",
      ],
      questions: [
        "Com es calculen els 11 g de sucre del bol habitual?",
        "Per què la frase publicitària pot ser certa i alhora poc informativa?",
        "Quins criteris afegiries per fer una comparació responsable?",
      ],
      modelComment: "Si hi ha 20 g per 100 g, en 55 g hi ha 20·55/100=11 g. Els 6 g anunciats corresponen a una ració de 30 g triada per la marca, menor que el bol observat, i per això poden donar una impressió incompleta. Cal comparar per 100 g i revisar fibra, sal, greixos, ingredients, freqüència i dieta global. Un sol nutrient no determina tot el valor d'un aliment.",
    },
  },
  u09: {
    theory: [
      {
        development: "La ventilació mou aire fins als alvèols; l'intercanvi gasós fa que O₂ i CO₂ travessen membranes per difusió; la respiració cel·lular és el conjunt de reaccions amb què les cèl·lules obtenen energia utilitzable. Són processos relacionats però no sinònims. Els alvèols tenen paret molt fina, gran superfície i una xarxa de capil·lars que manté diferències de concentració. Si disminueix la superfície o augmenta el gruix de la barrera, l'intercanvi es fa menys eficient.",
        example: "L'oxigen passa de l'aire alveolar a la sang i s'uneix majoritàriament a l'hemoglobina dels glòbuls rojos.",
      },
      {
        development: "El cor funciona com dues bombes coordinades. La circulació pulmonar envia sang als pulmons per intercanviar gasos; la circulació general reparteix oxigen i nutrients i recull productes de rebuig. Artèries i venes es defineixen per la direcció respecte del cor, no per la quantitat d'oxigen: l'artèria pulmonar porta sang pobra en oxigen i les venes pulmonars, rica. Als capil·lars, la paret fina permet intercanvis entre la sang i els teixits.",
        example: "Ventricle dret → artèria pulmonar → capil·lars pulmonars → venes pulmonars → aurícula esquerra.",
      },
      {
        development: "Els ronyons no són simples filtres que deixen passar residus: filtren una part del plasma i després reabsorbeixen selectivament aigua i substàncies útils, mentre secreten altres compostos. Així regulen volum d'aigua, sals i pH, a més d'eliminar urea. Els pulmons eliminen CO₂ i vapor d'aigua; la pell participa en termoregulació, i el fetge transforma substàncies. L'excreció manté l'homeòstasi i no s'ha de confondre amb l'expulsió de restes no digerides en la defecació.",
        example: "Beure més aigua pot produir una orina més diluïda perquè el cos ajusta la reabsorció segons les necessitats.",
      },
    ],
    scientificText: {
      title: "Respirar a més altitud",
      lead: "Text didàctic sobre intercanvi gasós, transport i adaptació del cos.",
      paragraphs: [
        "A gran altitud, el percentatge d'oxigen de l'aire continua prop del 21 %, però la pressió atmosfèrica és menor. Això redueix la pressió parcial d'oxigen i dificulta el seu pas cap a la sang. Al principi augmenten la freqüència respiratòria i cardíaca, i una persona pot cansar-se abans durant l'exercici.",
        "Amb dies o setmanes poden aparéixer ajustos com canvis en la producció de glòbuls rojos. Aquestes respostes no converteixen immediatament qualsevol persona en esportista d'alt rendiment i depenen de l'altitud, el temps i la salut. Davant símptomes intensos, continuar ascendint pot ser arriscat: l'aclimatació és un procés fisiològic, no una garantia absoluta.",
      ],
      questions: [
        "Per què hi ha menys disponibilitat d'oxigen si el percentatge de l'aire és semblant?",
        "Relaciona dues respostes del cos amb la necessitat de portar oxigen als teixits.",
        "Quina decisió de salut suggereix el text i amb quina limitació?",
      ],
      modelComment: "A l'altitud baixa la pressió atmosfèrica i, per tant, la pressió parcial d'oxigen, cosa que redueix el gradient d'entrada a la sang. Augmentar ventilació i freqüència cardíaca ajuda a captar i transportar més oxigen; a més llarg termini poden canviar els glòbuls rojos. L'aclimatació varia entre persones i no elimina tot el risc, de manera que s'ha d'aturar l'ascens si apareixen símptomes importants.",
    },
  },
  u10: {
    theory: [
      {
        development: "Els receptors detecten canvis interns o externs i els transformen en senyals. Les neurones transmeten informació mitjançant impulsos elèctrics al llarg de la membrana i senyals químics en moltes sinapsis. El sistema nerviós central —encèfal i medul·la espinal— integra informació; el perifèric connecta receptors i efectors amb el centre. En un acte voluntari hi ha percepció i decisió conscient. En un arc reflex, la medul·la pot coordinar una resposta ràpida abans que la informació arribe a les àrees cerebrals de percepció.",
        example: "En retirar la mà d'una superfície molt calenta intervenen receptor, neurona sensitiva, medul·la, neurona motora i múscul efector.",
      },
      {
        development: "El sistema endocrí coordina processos mitjançant hormones alliberades per glàndules a la sang. Només responen les cèl·lules que tenen receptors adequats. La hipòfisi, tiroide, pàncrees, suprarenals, ovaris i testicles produeixen hormones amb funcions diverses, però treballen en xarxes regulades. La retroalimentació negativa manté moltes variables prop d'un interval: quan el resultat augmenta, disminueix l'estímul que el produïa. Una alteració pot deure's a excés o dèficit hormonal, fallada de la glàndula o resposta inadequada dels teixits.",
        example: "Després d'un àpat, la insulina ajuda a reduir la glucosa sanguínia; quan baixa, disminueix també l'estímul per secretar-ne.",
      },
      {
        development: "Una addicció implica canvis en motivació, recompensa i control de la conducta; no és simplement falta de voluntat. La tolerància fa necessària una dosi major per obtindre efectes semblants i la dependència pot produir malestar quan s'interromp el consum. Alcohol, nicotina i altres drogues afecten un cervell adolescent encara en desenvolupament i poden alterar coordinació, memòria i decisió. També hi ha conductes problemàtiques sense substància. La prevenció combina informació fiable, habilitats per resistir pressions, entorns protectors i accés a ajuda sanitària sense estigma.",
        example: "Demanar ajuda a una persona adulta o professional davant pèrdua de control és una resposta de salut, no un fracàs personal.",
      },
    ],
    images: [
      {
        src: "/theory/u10-sistema-nervios.jpg",
        alt: "Esquema del sistema nerviós central i perifèric.",
        caption: "El sistema nerviós central integra informació i el perifèric connecta receptors, músculs i glàndules.",
      },
      {
        src: "/theory/u10-acte-reflex.jpg",
        alt: "Comparació esquemàtica d'un acte reflex i un acte voluntari.",
        caption: "L'arc reflex dona una resposta ràpida; la percepció conscient arriba després a l'encèfal.",
      },
    ],
    scientificText: {
      title: "Pantalles, recompensa i titulars massa simples",
      lead: "Text didàctic sobre sistema nerviós, conducta i interpretació prudent d'evidències.",
      paragraphs: [
        "Algunes aplicacions presenten notificacions i recompenses variables que poden mantindre l'atenció. Un estudi observa que adolescents amb ús nocturn més prolongat informen de més cansament i dificultat per desconnectar. Això és compatible amb mecanismes de recompensa i amb la interrupció del son, però no prova que totes les persones desenvolupen una addicció.",
        "El terme addicció exigeix valorar pèrdua de control, interferència amb la vida diària i persistència malgrat conseqüències, no només comptar hores. L'associació també pot estar influïda per estrés, estat d'ànim o rutines familiars. Una intervenció raonable pot reduir notificacions nocturnes i observar el descans, evitant diagnòstics improvisats i buscant ajuda si hi ha patiment o deteriorament.",
      ],
      questions: [
        "Quina diferència estableix el text entre ús intens i addicció?",
        "Quines evidències i variables obliguen a ser prudents amb la causa?",
        "Proposa una decisió proporcionada i indica quan seria necessària ajuda professional.",
      ],
      modelComment: "L'ús prolongat pot associar-se amb cansament i dificultat per desconnectar, però l'addicció requereix pèrdua de control i interferència persistent, no només moltes hores. L'estudi és compatible amb recompensa i alteració del son, encara que estrés, estat d'ànim i família també poden influir. Es poden limitar notificacions i ús nocturn i revisar si millora el descans; si hi ha patiment o deteriorament, cal ajuda professional.",
    },
  },
  u11: {
    theory: [
      {
        development: "La pell i les mucoses dificulten l'entrada de patògens amb barreres físiques, substàncies antimicrobianes, cilis i microbiota. Si se superen, la resposta innata actua ràpidament: inflamació, fagocitosi i altres mecanismes reconeixen senyals generals de perill. La resposta adaptativa és més específica; limfòcits reconeixen antígens, coordinen defenses i poden formar cèl·lules de memòria. Els símptomes no sempre són causats directament pel microorganisme: part de la febra, dolor o inflamació prové de la resposta defensiva.",
        example: "Una ferida enrogida mostra augment del flux sanguini i activitat inflamatòria; això no identifica per si sol el patogen.",
      },
      {
        development: "Una vacuna presenta al sistema immunitari un antigen, o instruccions segures per produir-lo, sense causar la malaltia greu que es vol prevenir. La resposta genera anticossos i cèl·lules de memòria; algunes vacunes necessiten diverses dosis o recordatoris. Cap intervenció és absoluta, però reduir la probabilitat d'infecció o de complicacions en moltes persones disminueix també oportunitats de transmissió. L'eficàcia es calcula comparant grups i ha d'interpretar-se junt amb risc inicial, duració de la protecció i possibles efectes adversos.",
        example: "Si en grups comparables hi ha 20 casos sense vacuna i 5 amb vacuna, el risc observat és menor, però cal conéixer la mida de cada grup.",
      },
      {
        development: "Els antibiòtics ataquen estructures o processos bacterians; no funcionen contra virus com els del refredat comú. En una població bacteriana pot haver-hi variants resistents. L'antibiòtic elimina sobretot les sensibles i deixa més oportunitats a les resistents per reproduir-se: és selecció natural, no una decisió conscient del bacteri. L'ús innecessari o inadequat augmenta aquesta pressió. La pauta concreta l'ha de determinar personal sanitari; no s'han de compartir restes ni automedicar-se.",
        example: "Prendre un antibiòtic per una infecció viral no accelera la curació i pot seleccionar bacteris resistents presents al cos.",
      },
    ],
    scientificText: {
      title: "Com es fa visible la resistència als antibiòtics",
      lead: "Text didàctic sobre selecció natural, dades de salut i ús responsable.",
      paragraphs: [
        "Un hospital compara mostres d'un mateix bacteri durant cinc anys. La proporció resistent a un antibiòtic passa del 8 % al 23 %. L'augment no significa que cada bacteri haja aprés a defensar-se després de prendre el fàrmac. Les variants resistents ja existien o van aparéixer per canvis genètics, i l'ús de l'antibiòtic va afavorir la supervivència i reproducció d'aquestes variants.",
        "La dada és preocupant, però cal conéixer el nombre de mostres, els criteris de selecció i si han canviat els protocols de laboratori. La resposta no és abandonar antibiòtics quan són necessaris, sinó usar-los amb diagnòstic i pauta professional, previndre infeccions i vigilar l'evolució de les resistències.",
      ],
      questions: [
        "Explica l'augment del 8 % al 23 % mitjançant selecció natural.",
        "Quina informació falta per valorar la solidesa de la comparació?",
        "Quina decisió responsable proposa el text i quina decisió rebutja?",
      ],
      modelComment: "L'antibiòtic selecciona variants resistents: les sensibles moren amb més freqüència i les resistents deixen més descendència, de manera que la seua proporció pot passar del 8 % al 23 %. Per interpretar la tendència cal saber mida i selecció de mostres i si el mètode ha canviat. No s'han d'abandonar tractaments necessaris; cal prescriure'ls bé, seguir la pauta, previndre infeccions i vigilar resistències.",
    },
  },
  u12: {
    theory: [
      {
        development: "Els ovaris produeixen òvuls i hormones; els testicles produeixen espermatozoides i hormones. La fecundació sol ocórrer en una trompa uterina quan es fusiona material genètic dels dos gàmetes i es forma el zigot. Després de divisions successives, l'embrió arriba a l'úter i s'implanta en l'endometri. Durant l'embaràs, la placenta permet intercanvis de gasos, nutrients i residus entre sang materna i fetal sense que totes dues sangs es mesclen directament. Embrió i fetus descriuen etapes diferents del desenvolupament.",
        example: "Fecundació → divisions del zigot → desplaçament fins a l'úter → implantació → desenvolupament embrionari i fetal → part.",
      },
      {
        development: "La salut sexual és benestar físic, emocional i social relacionat amb la sexualitat. Qualsevol relació exigeix consentiment lliure, informat, específic i reversible; el silenci, la pressió o la incapacitat per decidir no són consentiment. La informació ha d'incloure canvis corporals, diversitat, prevenció, emocions i recursos sanitaris. Respectar la privacitat és important, però davant violència, coacció o risc cal buscar ajuda adulta o professional. Les decisions responsables es basen en comunicació i cura mútua, no en estereotips.",
        example: "Una persona pot canviar d'opinió en qualsevol moment; respectar eixe límit forma part del consentiment.",
      },
      {
        development: "Els mètodes de barrera impedeixen el contacte entre gàmetes; els hormonals modifiquen ovulació i moc cervical; els dispositius intrauterins dificulten la fecundació i, segons el tipus, actuen també hormonalment. L'eficàcia teòrica i la d'ús habitual poden diferir per oblits o ús incorrecte. El preservatiu extern o intern redueix el risc de moltes infeccions de transmissió sexual, mentre que altres anticonceptius no ho fan. La doble protecció combina preservatiu amb un mètode anticonceptiu eficaç. L'assessorament sanitari permet adaptar opcions i resoldre incidències.",
        example: "Una píndola pot previndre embarassos si s'usa bé, però no protegeix d'ITS; el preservatiu aporta eixa barrera.",
      },
    ],
    images: [
      {
        src: "/theory/u12-fecundacio.jpg",
        alt: "Esquema de les etapes de la fecundació i formació del zigot.",
        caption: "La fecundació forma el zigot; la implantació és un procés posterior que ocorre a l'úter.",
      },
      {
        src: "/theory/u12-aparell-femeni.jpg",
        alt: "Esquema general de l'aparell reproductor femení.",
        caption: "Els òrgans reproductors tenen funcions diferenciades en producció de gàmetes, fecundació i gestació.",
      },
    ],
    scientificText: {
      title: "Tres afirmacions sobre anticoncepció i ITS",
      lead: "Text didàctic sobre salut sexual, evidència i presa de decisions.",
      paragraphs: [
        "En una xarxa social apareixen tres missatges: «la píndola protegeix de les ITS», «dos preservatius protegeixen el doble» i «si no hi ha símptomes, no hi ha infecció». Cap dels tres és correcte. Els anticonceptius hormonals no formen una barrera contra microorganismes; usar dos preservatius alhora pot augmentar la fricció i el risc de ruptura; i moltes ITS poden ser asimptomàtiques.",
        "La prevenció combina ús correcte d'un únic preservatiu, proves quan estan indicades, vacunació disponible, comunicació i consulta sanitària. Davant una incidència, la resposta depén del temps i del tipus de risc, per això convé acudir a un servei de salut. La informació fiable no substitueix el consentiment ni permet jutjar persones pel seu estat de salut.",
      ],
      questions: [
        "Corregeix científicament les tres afirmacions del primer paràgraf.",
        "Quines mesures de prevenció proposa el text i per què es complementen?",
        "Comunicaries aquesta informació sense estigma i amb respecte al consentiment?",
      ],
      modelComment: "La píndola prevé embarassos però no ITS; dos preservatius poden fregar-se i trencar-se, i l'absència de símptomes no descarta una infecció. La prevenció combina un preservatiu ben utilitzat, vacunació, proves i assessorament segons el risc. Cal comunicar-ho sense culpabilitzar, respectar privacitat i consentiment i recomanar serveis sanitaris davant una incidència, perquè el temps pot influir en les opcions disponibles.",
    },
  },
  u13: {
    theory: [
      {
        development: "La meteorització modifica la roca al mateix lloc per canvis físics, reaccions químiques o activitat biològica. L'erosió arranca materials, el transport els desplaça i la sedimentació els deposita quan l'agent perd energia. Un riu pot erosionar en trams de pendent forta i sedimentar en zones lentes; el vent transporta partícules fines i el gel fragmenta i arrossega. Són processos lents a escala humana, però episodis intensos poden produir canvis ràpids. La vegetació i els usos del sòl modifiquen la velocitat d'erosió.",
        example: "Després d'un incendi, la falta de coberta vegetal pot augmentar l'arrossegament de sòl durant pluges torrencials.",
      },
      {
        development: "La litosfera està fragmentada en plaques que es mouen uns centímetres per any sobre materials més deformables. Als límits divergents es crea nova litosfera; als convergents pot haver-hi subducció o col·lisió, i als transformants les plaques llisquen lateralment. L'acumulació i alliberament sobtat d'esforç origina molts terratrémols. El vulcanisme es concentra en certs límits i punts calents. La distribució mundial de sismes i volcans constitueix una evidència del model, encara que no permet predir la data exacta d'un sisme.",
        example: "Una alineació de terratrémols i volcans al marge d'un oceà pot indicar una zona de subducció.",
      },
      {
        development: "La perillositat descriu la probabilitat i intensitat d'un fenomen; l'exposició indica persones i béns situats en la zona, i la vulnerabilitat, com de fàcilment poden patir dany. Per això un fenomen semblant té conseqüències distintes segons construcció, planificació i capacitat de resposta. Els mapes de risc combinen dades històriques, relleu i models, però tenen incertesa. Reduir risc implica evitar construir en zones perilloses, aplicar normes, preparar alertes i plans d'evacuació i protegir especialment les persones vulnerables.",
        example: "Una inundació intensa en una plana deshabitada pot tindre alta perillositat i baix risc humà; si s'urbanitza, augmenta l'exposició.",
      },
    ],
    scientificText: {
      title: "Pluja intensa no significa el mateix risc a tot arreu",
      lead: "Text didàctic sobre perillositat, exposició, vulnerabilitat i prevenció.",
      paragraphs: [
        "Dues localitats reben 180 mm de pluja en poques hores. A la primera, el riu conserva una plana d'inundació sense habitatges i hi ha avisos primerencs. A la segona, part del llit s'ha ocupat, moltes superfícies estan asfaltades i alguns soterranis no tenen eixida segura. La perillositat meteorològica és semblant, però el risc per a persones i béns és major a la segona.",
        "La diferència s'explica per exposició i vulnerabilitat, i també perquè la impermeabilització accelera l'escorrentia. Una obra puntual pot reduir alguns danys però traslladar el problema aigües avall. La gestió necessita mapes actualitzats, manteniment, ordenació del territori, alerta i educació, assumint que cap mesura elimina tota la incertesa.",
      ],
      questions: [
        "Distingeix perillositat, exposició i vulnerabilitat en les dues localitats.",
        "Com influeix l'asfalt en l'escorrentia i per què una obra pot traslladar el risc?",
        "Prioritza dues mesures preventives i justifica-les.",
      ],
      modelComment: "La pluja intensa representa una perillositat semblant, però la segona localitat exposa més persones i béns i té soterranis vulnerables. L'asfalt redueix infiltració i accelera l'aigua superficial; canalitzar-la sense visió de conca pot augmentar cabals aigües avall. Prioritzaria evitar noves ocupacions de zones inundables i establir alerta i evacuació, complementades amb superfícies permeables i mapes revisats.",
    },
  },
  u14: {
    theory: [
      {
        development: "Un ecosistema inclou organismes, medi físic i totes les interaccions entre ells. L'hàbitat és el lloc on viu una espècie; el nínxol inclou recursos, condicions i paper ecològic. Les poblacions estan limitades per aliment, espai, depredadors, malalties i factors climàtics. Una xarxa d'interaccions és més realista que una cadena lineal: si disminueix una espècie, l'efecte pot propagar-se per diverses rutes. Les espècies clau tenen una influència desproporcionada, però cap organisme està completament aïllat.",
        example: "Si baixa un depredador, poden augmentar alguns herbívors i reduir-se la vegetació, amb efectes sobre altres espècies.",
      },
      {
        development: "Els productors transformen energia lluminosa en energia química; els consumidors l'obtenen alimentant-se i els descomponedors aprofiten matèria orgànica morta. En cada transferència, part de l'energia es dissipa com a calor i queda menys disponible per al nivell següent, de manera que l'energia flueix i no es recicla. En canvi, els àtoms d'aigua, carboni o nitrogen circulen entre atmosfera, sòl, aigua i éssers vius. Alterar un cicle pot afectar clima, fertilitat i biodiversitat.",
        example: "Una piràmide tròfica sol tindre molta més energia en productors que en depredadors superiors.",
      },
      {
        development: "La sostenibilitat no consisteix només a reciclar. Primer convé evitar consum innecessari, allargar la vida útil, reparar i reutilitzar; després es recuperen materials quan és viable. Una anàlisi de cicle de vida considera extracció, fabricació, transport, ús i final del producte. També incorpora salut, treball, cost i repartiment dels impactes. Una opció pot reduir emissions i augmentar ús d'aigua o materials, per això les decisions necessiten indicadors diversos i una justificació explícita de prioritats.",
        example: "Una botella reutilitzable necessita materials per fabricar-se, però pot reduir residus si s'usa prou vegades i es llava eficientment.",
      },
    ],
    scientificText: {
      title: "Restaurar una zona humida és més que plantar arbres",
      lead: "Text didàctic sobre xarxes ecològiques, indicadors i restauració.",
      paragraphs: [
        "Una zona humida degradada presenta menys vegetació aquàtica, aigua més tèrbola i disminució d'amfibis. Plantar arbres a la vora pot aportar ombra i refugi, però no resol per si sola l'entrada de fertilitzants ni la modificació del cabal. Si continuen arribant excés de nutrients, poden proliferar algues i reduir-se l'oxigen dissolt.",
        "Un pla de restauració hauria de reduir les fonts de contaminació, recuperar franges de vegetació, mantindre un règim d'aigua adequat i seguir indicadors com transparència, nutrients, oxigen i diversitat. El nombre d'arbres plantats mesura una acció, no necessàriament la recuperació de l'ecosistema. Els resultats poden tardar i han de comparar-se amb una situació inicial.",
      ],
      questions: [
        "Quina cadena de causes relaciona fertilitzants, algues i oxigen?",
        "Per què comptar arbres no és suficient per mesurar la recuperació?",
        "Tria tres indicadors i explica què aportaria cadascun al seguiment.",
      ],
      modelComment: "L'excés de nutrients afavoreix algues; la seua proliferació i descomposició poden consumir oxigen i perjudicar organismes. Plantar arbres és una actuació, però no demostra que milloren aigua i biodiversitat. Seguiria nutrients per controlar la causa, oxigen i transparència per valorar la qualitat de l'aigua, i diversitat d'amfibis o macroinvertebrats per observar la resposta biològica, comparant sempre amb la línia base.",
    },
  },
  u15: {
    theory: [
      {
        development: "Massa és quantitat de matèria i volum és espai ocupat; totes dues són propietats extensives perquè canvien amb la quantitat de mostra. La densitat és el quocient d=m/V i, en condicions determinades, ajuda a caracteritzar una substància. Mesurar-la exigeix unitats compatibles i volum fiable: en sòlids irregulars es pot usar desplaçament d'aigua si el material no es dissol ni reacciona. La flotació depén de la densitat mitjana de l'objecte i del fluid, però també de cavitats i de l'empenta.",
        example: "Una bola massissa i un vaixell d'acer tenen el mateix material, però el vaixell inclou aire i té una densitat mitjana menor.",
      },
      {
        development: "En un sòlid, les partícules vibren al voltant de posicions pròximes; en un líquid continuen juntes però poden desplaçar-se; en un gas estan molt separades i ocupen tot el recipient. El model explica compressibilitat, difusió i canvis d'estat sense imaginar que les partícules «s'inflen» o canvien de substància. En fondre, evaporar o condensar, varia l'organització i l'energia del moviment, no el tipus de partícula. La temperatura està relacionada amb l'energia cinètica mitjana, no amb la mida de cada partícula.",
        example: "L'olor s'estén per una habitació perquè les partícules gasoses es mouen i es mesclen, no perquè l'aire les atraga.",
      },
      {
        development: "La pressió d'un gas és l'efecte dels xocs continus de les partícules contra les parets. Si el volum disminueix a temperatura constant, hi ha més xocs per unitat d'àrea i la pressió augmenta. Si s'escalfa un gas en un recipient rígid, les partícules es mouen més ràpid i els xocs són més intensos. Aquest model qualitatiu ajuda a predir comportaments, però les lleis simples suposen quantitat de gas constant i condicions controlades. Un recipient tancat escalfat pot ser perillós.",
        example: "En prémer lentament una xeringa tapada, el mateix aire ocupa menys volum i ofereix més resistència per l'augment de pressió.",
      },
    ],
    scientificText: {
      title: "Partícules invisibles i qualitat de l'aire",
      lead: "Text didàctic sobre matèria, concentració i interpretació de mesures ambientals.",
      paragraphs: [
        "Un sensor registra 18 µg/m³ de partícules fines al matí i 47 µg/m³ durant l'entrada de vehicles. La unitat expressa massa de partícules per volum d'aire. L'augment és coherent amb una font pròxima, però una única jornada no prova que tot el material procedisca dels cotxes: vent, obres o calefacció també poden influir.",
        "Per identificar patrons caldria mesurar molts dies, comparar punts, registrar meteorologia i revisar el sensor. Ventilar pot reduir contaminants generats dins d'una aula, però si l'aire exterior està molt contaminat el moment de ventilació importa. La decisió combina mesures locals, fonts probables i protecció de la salut.",
      ],
      questions: [
        "Interpreta què significa 47 µg/m³ i compara'l amb 18 µg/m³.",
        "Per què la dada d'un dia no identifica una causa única?",
        "Proposa un pla de mesura i una decisió provisional per al centre.",
      ],
      modelComment: "47 µg/m³ significa 47 micrograms de partícules en cada metre cúbic d'aire i és 29 µg/m³ superior al matí. El canvi coincideix amb vehicles, però també poden influir vent, obres, calefacció o error del sensor. Mesuraria diversos dies dins i fora, en diferents hores, amb dades meteorològiques. Provisionalment reduiria vehicles al costat de l'entrada i ventilària en moments amb menor concentració.",
    },
  },
  u16: {
    theory: [
      {
        development: "El nombre atòmic Z identifica l'element perquè indica el nombre de protons del nucli. En un àtom neutre coincideix amb el nombre d'electrons; si guanya o perd electrons es forma un ió, però l'element no canvia. El nombre màssic A suma protons i neutrons. Els isòtops d'un element tenen el mateix Z i diferent nombre de neutrons; comparteixen gran part del comportament químic, encara que difereixen en massa i estabilitat nuclear. Un model atòmic és una representació basada en evidències, no una fotografia literal.",
        example: "Carboni-12 i carboni-14 tenen 6 protons; el primer té 6 neutrons i el segon, 8.",
      },
      {
        development: "La taula periòdica ordena elements per nombre atòmic creixent. Les files són períodes i reflecteixen nivells electrònics; les columnes o grups reuneixen elements amb propietats químiques semblants. A grans trets, els metalls ocupen esquerra i centre, i els no-metalls, la zona superior dreta, però hi ha transicions graduals. El símbol és internacional i sensible a majúscules: Co és cobalt i CO representa una fórmula amb carboni i oxigen. La posició ajuda a predir comportaments, no a memoritzar-los sense explicació.",
        example: "Na i K són del mateix grup i comparteixen tendències, però no són la mateixa substància ni reaccionen amb exacta intensitat.",
      },
      {
        development: "Una fórmula química descriu proporcions d'àtoms o ions. El subíndex afecta l'element immediatament anterior; un coeficient multiplica tota la fórmula. Així, 2H₂O representa dues unitats d'aigua amb quatre H i dos O en total. Canviar subíndexs canvia la substància: H₂O i H₂O₂ tenen propietats molt diferents. En una equació química es conserven els àtoms, per això s'ajusten coeficients i no s'alteren fórmules per forçar la igualtat.",
        example: "3CO₂ conté 3 àtoms de carboni i 6 d'oxigen; el 3 inicial multiplica tots els subíndexs implícits o escrits.",
      },
    ],
    scientificText: {
      title: "«Sense química»: una expressió impossible",
      lead: "Text didàctic sobre substàncies, fórmules i lectura crítica de publicitat.",
      paragraphs: [
        "Un producte de neteja s'anuncia com a «100 % natural i sense química». Tanmateix, l'aigua és H₂O, l'oxigen de l'aire és O₂ i les aromes naturals també estan formades per substàncies químiques. «Natural» informa sobre un origen o procés segons el context, però no garanteix innocuïtat; «sintètic» tampoc significa automàticament perillós.",
        "El risc depén de la substància, la dosi, la via d'exposició i el temps. Per valorar el producte cal llegir composició, instruccions, pictogrames i mesures de seguretat. La fórmula aporta informació sobre elements i proporcions, però no basta per deduir totes les propietats sense conéixer estructura i condicions.",
      ],
      questions: [
        "Per què «sense química» és científicament incorrecte?",
        "Quina diferència hi ha entre origen natural i nivell de risc?",
        "Quines evidències consultaries per decidir un ús segur del producte?",
      ],
      modelComment: "Tot material està format per substàncies químiques, inclosos H₂O i O₂, de manera que «sense química» és impossible. Natural descriu un origen i no assegura seguretat; el risc depén de substància, dosi, via i exposició. Per decidir, cal revisar composició, etiqueta, pictogrames i instruccions i usar la quantitat indicada amb ventilació o protecció si correspon. Una fórmula sola no descriu totes les propietats.",
    },
  },
  u17: {
    theory: [
      {
        development: "L'energia mesura la capacitat d'un sistema per produir canvis i s'expressa en joules, encara que en electricitat domèstica s'use també el kWh. Pot transferir-se per treball, calor o radiació i transformar-se entre formes cinètica, potencial, química, tèrmica o elèctrica. En un sistema aïllat es conserva la quantitat total, però en cada transformació part queda dispersa com energia tèrmica menys aprofitable: és degradació. La calor flueix espontàniament de major a menor temperatura per conducció, convecció o radiació.",
        example: "En una torradora, energia elèctrica es transforma sobretot en tèrmica; l'energia total es conserva, però no tota és útil per torrar.",
      },
      {
        development: "Perquè hi haja corrent continuat cal una diferència de potencial i un camí conductor tancat. La intensitat mesura càrrega per temps, la tensió és energia transferida per càrrega i la resistència descriu oposició al corrent. En components òhmics, V=I·R. En sèrie circula la mateixa intensitat i les tensions es reparteixen; en paral·lel les branques comparteixen tensió i funcionen de manera més independent. Fusibles, magnetotèrmics, diferencials i presa de terra redueixen riscos, però no substitueixen un ús correcte.",
        example: "Amb 6 V i 3 Ω, I=V/R=2 A; augmentar la resistència amb la mateixa tensió redueix la intensitat.",
      },
      {
        development: "La potència indica la rapidesa de transferència d'energia: P=E/t i, en molts dispositius elèctrics, P=V·I. Un watt és un joule per segon. El consum depén de potència i temps: E=P·t; per a la factura, potència en kW per hores dona kWh. L'efecte Joule transforma energia elèctrica en tèrmica i és útil en calefactors, però representa pèrdues en cables. Reduir consum exigeix prioritzar aparells potents, moltes hores d'ús i baixa eficiència, sense confondre potència amb energia.",
        example: "Un aparell de 500 W durant 2 h consumeix 1 kWh; un de 1.500 W durant 20 min consumeix 0,5 kWh.",
      },
    ],
    images: [
      {
        src: "/theory/u17-potencia-temps.png",
        alt: "Gràfica escalonada de potència en funció del temps.",
        caption: "L'àrea sota una gràfica potència-temps representa l'energia consumida en cada interval.",
      },
    ],
    scientificText: {
      title: "La potència més alta no sempre consumeix més",
      lead: "Text didàctic sobre potència, temps, energia i cost domèstic.",
      paragraphs: [
        "Una família compara un forn de 2,0 kW que funciona 45 minuts amb un ordinador de 0,20 kW que funciona 8 hores. El forn consumeix 2,0·0,75=1,5 kWh; l'ordinador, 0,20·8=1,6 kWh. Encara que el forn té deu vegades més potència, l'ordinador consumeix una mica més en els períodes indicats perquè està encés molt més temps.",
        "La factura també pot incloure terme de potència, impostos i tarifes horàries, de manera que el cost no sempre és energia per un únic preu. Per reduir consum convé mesurar hàbits reals i actuar sobre potència, duració i eficiència. Apagar un aparell molt potent durant pocs segons pot estalviar menys que reduir hores d'un ús moderat.",
      ],
      questions: [
        "Comprova els dos consums i explica per què el resultat no és contradictori.",
        "Quina diferència conceptual hi ha entre kW i kWh?",
        "Quines dades de la factura i dels hàbits necessites per prioritzar un estalvi?",
      ],
      modelComment: "El forn usa 1,5 kWh i l'ordinador 1,6 kWh: la potència és energia per temps i el consum resulta de multiplicar-la per la duració. El kW mesura potència; el kWh, energia. Per prioritzar cal conéixer potència real, hores, tarifa horària, eficiència i altres termes de factura. Actuaria primer sobre els usos que acumulen més kWh sense reduir seguretat o benestar.",
    },
  },
  u18: {
    theory: [
      {
        development: "Els problemes sociocientífics no tenen una resposta obtinguda amb una sola fórmula. Combinen fets mesurables, conseqüències probables, interessos i valors. El primer pas és delimitar el problema, l'escala temporal i les persones afectades; després es distingeix què sabem, què és incert i quines dades falten. També es generen diverses alternatives, inclosa la combinació d'accions o mantindre temporalment la situació. Fer explícites les restriccions evita propostes atractives però inviables.",
        example: "Davant calor a les aules, el problema inclou temperatura, salut, horaris, energia, cost i desigualtat entre espais, no només comprar aparells.",
      },
      {
        development: "Una matriu de decisió transforma criteris en indicadors comparables: °C reduïts, kWh, cost anual, temps d'aplicació o percentatge d'espais accessibles. Assignar pesos expressa prioritats i s'ha de justificar; no és una operació neutral. Les dades poden normalitzar-se a una mateixa escala, però el resultat s'ha de revisar amb sentit. L'anàlisi de sensibilitat modifica pesos o estimacions per comprovar si la proposta guanyadora és robusta o depén d'una suposició molt concreta.",
        example: "Si una opció només guanya quan el cost pesa deu vegades més que la salut, la decisió és sensible i necessita debat.",
      },
      {
        development: "L'esquema afirmació-evidència-raonament converteix una opinió en un argument revisable. L'afirmació diu què es proposa; l'evidència aporta dades rellevants i fiables; el raonament explica el mecanisme o criteri que les connecta. Una argumentació completa considera objeccions i efectes no desitjats i indica què faria canviar la decisió. Després d'actuar, els indicadors comparen la situació amb una línia base i un objectiu. Si el resultat no arriba, es revisa el pla en lloc d'ocultar les dades.",
        example: "«Plantarem ombra perquè les zones vegetades van registrar 5,3 °C menys; mesurarem temperatura i ús del pati durant el trimestre.»",
      },
    ],
    scientificText: {
      title: "Com protegir el centre davant la calor",
      lead: "Text didàctic per integrar salut, energia, dades i una decisió multicriteri.",
      paragraphs: [
        "El centre estudia tres mesures. A: plantar ombra i substituir part de l'asfalt, cost 18.000 €, efecte progressiu i baix consum. B: instal·lar climatització en totes les aules, cost 42.000 € més energia anual i efecte immediat. C: adaptar horaris i habilitar dos espais refugi, cost 6.000 €, aplicació ràpida però cobertura limitada. Cap opció resol sola totes les situacions.",
        "La decisió ha de protegir primer la salut, especialment de persones vulnerables, i alhora considerar temperatura reduïda, temps, cost, kWh, emissions, manteniment i equitat. Una combinació pot aplicar C de seguida, prioritzar climatització eficient en espais crítics i desenvolupar A com a mesura duradora. Caldria mesurar temperatures i incidències abans i després per revisar el pla.",
      ],
      questions: [
        "Compara les tres opcions amb almenys quatre criteris, no només el cost.",
        "Justifica una proposta combinada amb dades del text i coneixement científic.",
        "Quins indicadors usaràs per saber si funciona i què faria canviar la decisió?",
      ],
      modelComment: "A és lenta però duradora i de baix consum; B actua ràpidament però costa més i augmenta energia; C és barata i immediata, però cobreix menys. Proposaria C com a resposta inicial, B eficient només en espais i persones prioritàries i A com a transformació estructural. Mesuraria temperatures, hores per damunt del llindar, incidències de salut, ús dels refugis, kWh i cobertura. Revisaria la combinació si no baixa l'exposició o apareixen desigualtats.",
    },
  },
};
