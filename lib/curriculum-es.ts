import {
  unitSupplements,
  type ScientificText,
  type TheoryImage,
} from "./curriculum-content-es";

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
  { label: "Conocimiento científico", description: `Aplica correctamente ${focus}.`, points: 4 },
  { label: "Evidencias", description: "Usa datos o hechos del caso para justificar la respuesta.", points: 3 },
  { label: "Razonamiento", description: "Relaciona causas, consecuencias y decisión de forma coherente.", points: 2 },
  { label: "Comunicación", description: "Respuesta clara, ordenada y con vocabulario adecuado.", points: 1 },
];

const scientificTextRubric: RubricCriterion[] = [
  { label: "Idea principal", description: "Identifica la tesis o problema científico del texto sin deformarlo.", points: 2 },
  { label: "Evidencias", description: "Cita e interpreta datos o afirmaciones concretas del texto.", points: 3 },
  { label: "Razonamiento científico", description: "Relaciona la evidencia con los conceptos de la unidad y diferencia resultados, causas y límites.", points: 3 },
  { label: "Valoración", description: "Formula una conclusión o decisión prudente, clara y justificada.", points: 2 },
];

const seeds: UnitSeed[] = [
  {
    id: "u01", order: 1, term: 1, icon: "⌁", color: "#52b69a",
    title: "Investigar el mundo", shortTitle: "Método científico",
    subtitle: "Preguntas, hipótesis, variables, datos y conclusiones fiables.",
    areas: ["Interdisciplinario"], keyVocabulary: ["hipótesis", "variable", "muestra", "evidencia", "conclusión"],
    theory: [
      { title: "Una pregunta investigable", text: "La ciencia comienza con una pregunta concreta que se puede responder observando o midiendo. Una hipótesis es una explicación provisional que permite realizar una predicción comprobable.", points: ["Pregunta precisa y medible", "Hipótesis razonada", "Predicción: si... entonces..."] },
      { title: "Variables y control", text: "La variable independiente es la que cambiamos, la dependiente es la que midemos y las variables de control se mantienen iguales. Comparar con un control ayuda a atribuir el efecto a una sola causa.", points: ["Cambiar una variable cada vez", "Repetir medidas", "Trabajar con unidades"] },
      { title: "De los datos a la conclusión", text: "Una conclusión responde a la pregunta inicial, cita los datos e indica si apoyan la hipótesis. Un resultado inesperado no es un fracaso: puede desvelar un error o una nueva pregunta.", points: ["Distinguir dato y opinión", "No generalizar más de lo que permite la muestra", "Comunicar incertidumbres"] },
    ],
    numeric: { prompt: "Tres medidas son 12,1 cm, 12,3 cm y 12,2 cm. Calcula la media.", answer: 12.2, tolerance: 0.01, model: "(12,1 + 12,3 + 12,2) / 3 = 12,2 cm" },
    checkpoint: { prompt: "¿Cuál es la variable dependiente si estudiamos cómo la luz afecta al crecimiento de una planta?", options: ["Las horas de luz", "El crecimiento de la planta", "El tipo de maceta", "La hipótesis"], answer: "El crecimiento de la planta", explanation: "Es el resultado que medimos." },
    sequence: { prompt: "Ordena una investigación científica.", items: ["Formular la pregunta", "Proponer una hipótesis", "Planificar la comprobación", "Recoger datos", "Analizar y concluir"] },
    match: { prompt: "Asocia cada elemento con su papel.", groups: ["Cambiamos", "Medimos", "Mantenemos"], mapping: { "Horas de luz": "Cambiamos", "Altura de la planta": "Medimos", "Cantidad de agua": "Mantenemos" } },
    interpretation: { context: "Grupo A: 6 h de luz, crecimiento medio 4,1 cm. Grupo B: 10 h, 6,8 cm. Grupo C: 14 h, 6,7 cm.", prompt: "¿Qué tendencia muestran los datos y qué límite tienen?", data: ["6 h → 4,1 cm", "10 h → 6,8 cm", "14 h → 6,7 cm"], model: "El crecimiento aumenta de 6 a 10 horas, pero no sigue aumentando con 14 horas. Con sólo tres grupos no podemos afirmar cuál es el óptimo exacto.", rubric: commonRubric("la lectura de datos y los límites de la muestra") },
    methodCase: { context: "Un anuncio afirma que una bebida mejora la memoria porque 8 de 10 personas compradoras dicen notarse mejor.", prompt: "Explica dos problemas del diseño y propone una mejor comprobación.", model: "La muestra es pequeña y sesgada, y la sensación no es una medida objetiva. Habría que asignar aleatoriamente a muchas personas a bebida y placebo, aplicar la misma prueba de memoria y comparar resultados.", rubric: commonRubric("variables, control y calidad de la muestra") },
    decision: { context: "La clase debe elegir entre repetir una medida una vez o cinco.", prompt: "¿Qué opción elegirías y por qué?", model: "Escogería cinco repeticiones porque permiten calcular una media, detectar valores anómalos y reducir el efecto del error aleatorio.", rubric: commonRubric("repetición, media y error experimental") },
    mission: { context: "En el patio parece que una zona es siempre más calurosa.", prompt: "Diseña una investigación sin realizarla: pregunta, hipótesis, variables, datos y criterio de conclusión.", model: "Pregunta: ¿cambia la temperatura según la zona? Hipótesis: el asfalto al sol es más caliente. Medir a la misma hora y altura varias veces en asfalto, sombra y jardín; controlar termómetro y tiempo de espera; comparar medias.", rubric: commonRubric("el diseño completo de una investigación") },
  },
  {
    id: "u02", order: 2, term: 1, icon: "≈", color: "#f4a261",
    title: "Números que explican", shortTitle: "Proporciones y unidades",
    subtitle: "Porcentajes, razones, notación científica y estimaciones en contexto.",
    areas: ["Matemáticas", "Interdisciplinario"], keyVocabulary: ["razón", "proporción", "porcentaje", "potencia", "orden de magnitud"],
    theory: [
      { title: "Razones y proporcionalidad", text: "Una razón compara dos cantidades. Si ambas varían manteniendo la misma razón, existe proporcionalidad directa y podemos usar un factor de proporcionalidad.", points: ["Tabla de valores", "Regla de tres con sentido", "Comprobar unidades"] },
      { title: "Porcentajes", text: "Un porcentaje es una fracción de denominador 100. Para calcular p % de una cantidad multiplicamos por p/100; para comparar cambios utilizamos el valor inicial como referencia.", points: ["Parte = total · porcentaje", "Cambio relativo ≠ cambio absoluto", "Descuentos sucesivos no se suman"] },
      { title: "Números muy grandes o pequeños", text: "La notación científica escribe un número como 10ⁿ, con 1 ≤ |a| < 10. Ayuda a comparar escaleras y evitar ceros.", points: ["Potencias de diez", "Orden de magnitud", "Estimación antes de calcular"] },
    ],
    numeric: { prompt: "Una muestra de 250 g contiene un 12% de agua. ¿Cuántos gramos de agua existen?", answer: 30, model: "250 · 12 / 100 = 30 g" },
    checkpoint: { prompt: "¿Qué expresión es notación científica correcta?", options: ["45·10³", "4,5·10⁴", "0,45·10⁵", "45000·10⁰"], answer: "4,5·10⁴", explanation: "El coeficiente debe estar entre 1 y 10." },
    sequence: { prompt: "Ordena los pasos para calcular un porcentaje.", items: ["Identificar el total", "Convertir el porcentaje en decimal", "Multiplicar por el total", "Escribir la unidad", "Comprobar si el resultado es razonable"] },
    match: { prompt: "Asocia magnitud y unidad habitual.", groups: ["Longitud", "Demasiado", "Volumen"], mapping: { "2,4 km": "Longitud", "350 g": "Demasiado", "1,5 L": "Volumen" } },
    interpretation: { context: "Consumo de agua: lunes 120 L, martes 96 L, miércoles 102 L.", prompt: "Calcula mentalmente el cambio de lunes a martes e interprétalo.", data: ["Lun: 120 L", "Ma: 96 L", "Mi: 102 L"], model: "Baja 24 L. Dado que 24/120 = 0,20, es una reducción del 20 %.", rubric: commonRubric("porcentajes e interpretación contextual") },
    methodCase: { context: "Una etiqueta llama 18 g de azúcar por cada 100 mL. El recipiente tiene 330 mL.", prompt: "Explica cómo estimarías el azúcar total y comprobarías el cálculo.", model: "Multiplique 18 por 3,3: 59,4 g. La estimación 18·3 ≈ 54 g confirma que el orden de magnitud es coherente.", rubric: commonRubric("proporcionalidad, unidades y estimación") },
    decision: { context: "Producto A: 750 g por 3,60€. Producto B: 1,2 kg por 5,40€.", prompt: "¿Cuál es más económico? Justifica con precio por kg.", model: "A cuesta 4,80 €/kg y B cuesta 4,50 €/kg; B es más económico por unidad, aunque el precio total sea mayor.", rubric: commonRubric("comparación de razones y decisión") },
    mission: { context: "Es necesario preparar un menú para 24 personas a partir de una receta para 6.", prompt: "Explica el factor de escala y cómo evitarías errores con las unidades.", model: "El factor es 24/6 = 4; multiplique cada ingrediente por 4 y convierto a una unidad común antes de sumar o comprar.", rubric: commonRubric("escala, proporcionalidad y unidades") },
  },
  {
    id: "u03", order: 3, term: 1, icon: "ƒ", color: "#457b9d",
    title: "Fórmulas con sentido", shortTitle: "Álgebra científica",
    subtitle: "Expresiones, ecuaciones y fórmulas para relacionar magnitudes.",
    areas: ["Matemáticas", "Física y Química"], keyVocabulary: ["variable", "expresión", "ecuación", "aislar", "sustituir"],
    theory: [
      { title: "Letras que representan cantidades", text: "Una variable representa un valor que puede cambiar. Una expresión algebraica describe operaciones y una ecuación sostiene que dos expresiones son iguales.", points: ["Definir cada letra", "Respetar las unidades", "Usar paréntesis"] },
      { title: "Aislar una incógnita", text: "Aislar es aplicar operaciones inversas a ambos miembros sin romper la igualdad. En una fórmula podemos cambiar qué magnitud queremos calcular.", points: ["Misma operación a ambos lados", "Simplificar con orden", "Sustituir al final"] },
      { title: "Comprobar", text: "Una solución es fiable si satisface la ecuación original, posee unidades coherentes y es posible en el contexto.", points: ["Sustitución", "Análisis de unidades", "Estimación"] },
    ],
    numeric: { prompt: "La densidad es d = m/V. Calcula de si m = 540 g y V = 200 cm³.", answer: 2.7, tolerance: 0.01, model: "d = 540 / 200 = 2,7 g/cm³" },
    checkpoint: { prompt: "Si v = e/t, ¿qué fórmula calcula el tiempo?", options: ["t = v/e", "t = e/v", "t = e·v", "t = 1/(e·v)"], answer: "t = e/v", explanation: "Multiplicamos por t y dividimos por v." },
    sequence: { prompt: "Ordena la resolución de una fórmula.", items: ["Escribir la fórmula", "Identificar datos e incógnita", "Aislar si es necesario", "Sustituir con unidades", "Comprobar el resultado"] },
    match: { prompt: "Asocia símbolo y magnitud.", groups: ["Demasiado", "Volumen", "Densidad"], mapping: { "m": "Demasiado", "V": "Volumen", "d": "Densidad" } },
    interpretation: { context: "Un móvil recorre 0, 5, 10 y 15 m en 0, 2, 4 y 6 s.", prompt: "¿Qué relación algebraica describe el movimiento?", data: ["0 s → 0 m", "2 s → 5 m", "4 s → 10 m", "6 s → 15 m"], model: "La razón e/t es siempre 2,5 m/s, por tanto e = 2,5t. Es una proporcionalidad directa.", rubric: commonRubric("patrón, fórmula y unidades") },
    methodCase: { context: "Un alumno obtiene 12 kg/m³ para la densidad de una pieza metálica pequeña.", prompt: "¿Cómo detectarías si el resultado es sospechoso?", model: "Revisaría las conversiones de gramos a kg y de cm³ a m³, compararía con densidades conocidas y sustituiría a los datos en la fórmula.", rubric: commonRubric("comprobación algebraica y dimensional") },
    decision: { context: "Dos tarifas: A = 8 + 0,12x; B = 14 + 0,06x, donde x son minutos.", prompt: "Explica cómo decidir cuál conviene según su uso.", model: "Igual 8+0,12x = 14+0,06x: x=100. Por menos de 100 min conviene A; por más, B; a 100 cuestan igual.", rubric: commonRubric("ecuaciones e interpretación de soluciones") },
    mission: { context: "Una receta energética usa E = 17c + 37g, con carbohidratos c y grasas g en gramos.", prompt: "Construye y resuelve un ejemplo que dé cerca de 500 kJ.", model: "Por ejemplo c=12 y g=8: E=17·12+37·8=500 kJ. Es necesario indicar datos, sustitución y unidad.", rubric: commonRubric("modelización con fórmulas") },
  },
  {
    id: "u04", order: 4, term: 1, icon: "↗", color: "#6d597a",
    title: "Cambios y gráficas", shortTitle: "Funciones y modelos",
    subtitle: "Leer, construir y criticar relaciones entre dos variables.",
    areas: ["Matemáticas", "Interdisciplinario"], keyVocabulary: ["función", "pendiente", "intersección", "tendencia", "interpolación"],
    theory: [
      { title: "Tres representaciones", text: "Una relación entre variables puede expresarse con una tabla, una gráfica o una fórmula. Cambiar de representación ayuda a ver distintos patrones.", points: ["Ejes y unidades", "Escalera regular", "Puntos y tendencia"] },
      { title: "Ritmo de cambio", text: "La pendiente indica cuánto cambia la variable dependiente cuando la independiente aumenta una unidad. Una pendiente positiva crece; una negativa decrece.", points: ["Δy/Δx", "Interpretación con unidades", "Valor inicial"] },
      { title: "Modelos y límites", text: "Un modelo simplifica la realidad. Interpolar dentro de los datos suele ser más seguro que extrapolar lejos del rango observado.", points: ["Dominio útil", "Valores imposibles", "No confundir correlación y causa"] },
    ],
    numeric: { prompt: "En y = 3x + 5, calcula y cuándo x = 4.", answer: 17, model: "y = 3·4 + 5 = 17" },
    checkpoint: { prompt: "¿Qué representa la pendiente en una gráfica distancia-tiempo?", options: ["La posición inicial", "La velocidad", "El tiempo total", "La masa"], answer: "La velocidad", explanation: "Es el cambio de distancia por unidad de tiempo." },
    sequence: { prompt: "Ordena la construcción de una gráfica.", items: ["Identificar variables", "Elegir ejes y escalera", "Escribir magnitudes y unidades", "Representar puntos", "Describir la tendencia"] },
    match: { prompt: "Clasifica la tendencia.", groups: ["Crece", "Decrece", "Se mantiene"], mapping: { "Pendiente +2": "Crece", "Pendiente −0,5": "Decrece", "Pendiente 0": "Se mantiene" } },
    interpretation: { context: "Temperatura de un líquido: 0 min. 20 °C; 2 min 32 °C; 4 min 44 °C; 6 min 56 °C.", prompt: "Describe la tendencia y predice 5 min sin ir más allá de los datos.", data: ["0→20", "2→32", "4→44", "6→56"], model: "Aumenta 6 °C por minuto de forma lineal. A 5 min el modelo predice 50 °C.", rubric: commonRubric("pendiente, interpolación y unidades") },
    methodCase: { context: "Una gráfica muestra que al aumentar el número de paraguas también aumentan los accidentes de tráfico.", prompt: "¿Por qué no podemos decir que los paraguas causan accidentes?", model: "Es una correlación explicada por una tercera variable: la lluvia aumenta al mismo tiempo el uso de paraguas y el riesgo de accidentes.", rubric: commonRubric("correlación, causalidad y variables ocultas") },
    decision: { context: "Modelo A se ajusta muy bien entre 10 y 30 °C. Se desea usar a 90 °C.", prompt: "¿Aceptarías la predicción? Argumenta.", model: "No sin nuevos datos: 90 °C queda muy fuera del rango y es una extrapolación; el comportamiento puede cambiar.", rubric: commonRubric("rango de validez de un modelo") },
    mission: { context: "La clase registra durante una semana horas de sueño y nivel de atención.", prompt: "Propone la gráfica y explica qué conclusión sería legítima.", model: "Diagrama de dispersión: sueño en el eje x y atención a y. Podemos describir asociación pero no asegurar causalidad sin controlar otras variables.", rubric: commonRubric("representación, tendencia y prudencia causal") },
  },
  {
    id: "u05", order: 5, term: 1, icon: "▥", color: "#e76f51",
    title: "Datos sobre la salud", shortTitle: "Estadística",
    subtitle: "Muestras, medidas de centralización, dispersión y probabilidad.",
    areas: ["Matemáticas", "Biología y Geología"], keyVocabulary: ["población", "muestra", "media", "mediana", "rango"],
    theory: [
      { title: "¿De quién hablan los datos?", text: "La población es el conjunto de interés y la muestra es la parte observada. Una muestra debe ser suficiente y representativa.", points: ["Evitar selección voluntaria sesgada", "Describir tamaño y procedencia", "Anonimizar datos personales"] },
      { title: "Resumir sin ocultar", text: "La media usa todos los valores, la mediana ocupa la posición central y el rango mide la separación entre máximo y mínimo.", points: ["Ordenar antes de encontrar la mediana", "Valores extremos afectan a la media", "Dar también una medida de dispersión"] },
      { title: "Probabilidad y riesgo", text: "La probabilidad va de 0 a 1 o de 0% a 100%. Un riesgo relativo alto puede corresponder a un cambio absoluto pequeño; hay que mirar a los dos.", points: ["Casos favorables/posibles", "Frecuencia observada", "Riesgo absoluto y relativo"] },
    ],
    numeric: { prompt: "Calcula la media de 7, 8, 6, 9 y 10 horas.", answer: 8, model: "(7+8+6+9+10)/5 = 8 horas" },
    checkpoint: { prompt: "¿Qué medida resiste mejor un valor extremo?", options: ["Media", "Mediana", "Rango", "Suma"], answer: "Mediana", explanation: "Depende de la posición, no del tamaño extremo." },
    sequence: { prompt: "Ordena un análisis estadístico.", items: ["Definir la población", "Seleccionar la muestra", "Recoger datos", "Resumir y representar", "Interpretar con limitaciones"] },
    match: { prompt: "Asocia concepto y ejemplo.", groups: ["Población", "Muestra", "Variable"], mapping: { "Todo el alumnado de 3r": "Población", "30 alumnos seleccionados": "Muestra", "Horas de sueño": "Variable" } },
    interpretation: { context: "Grupo A: media 7,8 h, rango 2 h. Grupo B: media 7,8 h, rango 6 h.", prompt: "¿Qué tienen igual y qué es distinto?", data: ["A: media 7,8; rango 2", "B: media 7,8; rango 6"], model: "La tendencia central es igual, pero B es mucho más disperso: las experiencias individuales son menos homogéneas.", rubric: commonRubric("centralización y dispersión") },
    methodCase: { context: "Para estimar la actividad física del centro se encuesta sólo al equipo deportivo.", prompt: "Identifica el sesgo y propone una mejor muestra.", model: "La muestra sobrepresenta a personas activas. Es necesario seleccionar aleatoriamente alumnado de cursos y grupos diferentes.", rubric: commonRubric("muestreo representativo y sesgo") },
    decision: { context: "Tratamiento A reduce el riesgo del 2% al 1%. Un anuncio dice «reduce el riesgo un 50%».", prompt: "¿Es correcto? ¿Qué información añadirías?", model: "El riesgo relativo desciende un 50%, pero el cambio absoluto es de 1 punto porcentual. Es necesario dar ambos y el número de personas estudiadas.", rubric: commonRubric("riesgo absoluto, relativo y comunicación") },
    mission: { context: "¿Quieres estudiar la relación entre pantallas nocturnas y descanso manteniendo el anonimato.", prompt: "Diseña variables, muestra y forma de presentar resultados.", model: "Encuesta anónima estratificada; minutos de pantalla y horas/calidad de sueño; diagrama de dispersión y resúmenes, sin publicar respuestas individuales ni afirmar causalidad.", rubric: commonRubric("estadística, privacidad e interpretación") },
  },
  {
    id: "u06", order: 6, term: 1, icon: "△", color: "#2a9d8f",
    title: "Medir el espacio", shortTitle: "Geometría y escala",
    subtitle: "Longitudes, áreas, volúmenes, semejanza y mapas.",
    areas: ["Matemáticas", "Biología y Geología"], keyVocabulary: ["escala", "semejanza", "área", "volumen", "Pitágoras"],
    theory: [
      { title: "Medidas geométricas", text: "Perímetro mide contorno, área mide superficie y volumen mide espacio ocupado. Las unidades cambian al cuadrado o al cubo.", points: ["cm, cm² y cm³ no son intercambiables", "Descomponer figuras", "Estimar antes"] },
      { title: "Semejanza y escala", text: "Figuras similares tienen la misma forma y longitudes proporcionales. En una escala 1:n, una unidad en el dibujo representa n unidades reales.", points: ["Convertir unidades", "Factor lineal", "Áreas escalan con el cuadrado"] },
      { title: "Distancias indirectas", text: "El teorema de Pitágoras relaciona los lados de un triángulo rectángulo: a²+b²=c². Sirve para calcular diagonales y distancias.", points: ["Identificar hipotenusa", "Comprobar que es triángulo rectángulo", "Raíz cuadrada final"] },
    ],
    numeric: { prompt: "En un mapa 1:50.000, una ruta mide 3,2 cm. ¿Cuántos km son?", answer: 1.6, tolerance: 0.01, model: "3,2·50.000 = 160.000 cm = 1,6 km" },
    checkpoint: { prompt: "Si duplicamos todas las longitudes de un cuadrado, el área...", options: ["Se duplica", "Se triplica", "Se cuadruplica", "No cambia"], answer: "Se cuadruplica", explanation: "El área escala con 2²." },
    sequence: { prompt: "Ordena un problema de escalera.", items: ["Leer la escalera", "Medir en el plano", "Aplicar el factor", "Convertir unidades", "Comprobar el orden de magnitud"] },
    match: { prompt: "Asocia magnitud y unidad.", groups: ["Perímetro", "Área", "Volumen"], mapping: { "24 m": "Perímetro", "36 m²": "Área", "18 m³": "Volumen" } },
    interpretation: { context: "Parcela A: 20×10 m. Parcela B: mismo perímetro, 15×15 m.", prompt: "Compara perímetro y área y explica lo que muestra.", data: ["A: 20×10", "B: 15×15"], model: "Ambas tienen perímetro 60 m. A tiene 200 m2 y B 225 m2: el mismo contorno no determina la misma superficie.", rubric: commonRubric("perímetro, área y comparación") },
    methodCase: { context: "Un plano se ha ampliado al 200% en una fotocopiadora.", prompt: "¿Qué ocurre con longitudes y áreas?", model: "Las longitudes se duplican; las áreas se multiplican por 2²=4. La escalera numérica original ya no es válida sin ajustarla.", rubric: commonRubric("factor de escala lineal y superficial") },
    decision: { context: "Hay que ubicar una zona de sombra para cubrir más patio con 40 m de valla.", prompt: "¿Qué forma rectangular recomendarías y por qué?", model: "Un cuadrado de 10×10 m da 100 m² y maximiza el área entre rectángulos de perímetro 40 m.", rubric: commonRubric("optimización geométrica argumentada") },
    mission: { context: "Diseña en papel un itinerario seguro de 2 km en torno al centro.", prompt: "Explica cómo usarías escalera, tramos y Pitágoras.", model: "Elija escala, mida tramos, convierto a distancias reales y use Pitágoras sólo en diagonales de triángulos rectángulos; sumo y ajuste hasta 2 km.", rubric: commonRubric("escala, distancia y comunicación espacial") },
  },
  {
    id: "u07", order: 7, term: 2, icon: "◉", color: "#84a98c",
    title: "La célula, unidad de vida", shortTitle: "Células",
    subtitle: "Organización celular, funciones vitales y niveles de organización.",
    areas: ["Biología y Geología"], keyVocabulary: ["célula", "membrana", "citoplasma", "núcleo", "orgánulo"],
    theory: [
      { title: "Teoría celular", text: "Todos los seres vivos están formados por una o más células; la célula es la unidad básica de función y toda célula proviene de otra.", points: ["Unicelular y pluricelular", "Tamaño microscópico", "Información genética"] },
      { title: "Estructuras y funciones", text: "La membrana regula intercambios, el citoplasma contiene reacciones y el material genético dirige su funcionamiento. En eucariotas, los orgánulos especializan tareas.", points: ["Núcleo: ADN", "Mitocondria: energía", "Cloroplasto: fotosíntesis"] },
      { title: "Niveles de organización", text: "En organismos pluricelulares, células similares forman tejidos; los tejidos forman órganos; los órganos coordinados forman aparatos o sistemas.", points: ["Célula → tejido", "Tejido → órgano", "Órganos → sistema → organismo"] },
    ],
    numeric: { prompt: "Una imagen celular mide 40 mm y la célula real 0,02 mm. Calcula el aumento.", answer: 2000, model: "Aumento = 40/0,02 = 2.000×" },
    checkpoint: { prompt: "¿Qué estructura regula la entrada y salida de sustancias?", options: ["Membrana", "Núcleo", "Mitocondria", "Pared ósea"], answer: "Membrana", explanation: "Es la frontera selectiva de la célula." },
    sequence: { prompt: "Ordena de menor a mayor nivel.", items: ["Célula", "Tejido", "Órgano", "Sistema", "Organismo"] },
    match: { prompt: "Asocia estructura y función.", groups: ["Control genético", "Obtención de energía", "Intercambio"], mapping: { "Núcleo": "Control genético", "Mitocondria": "Obtención de energía", "Membrana": "Intercambio" } },
    interpretation: { context: "Muestra A tiene pared, cloroplastos y gran vacuola. Muestra B no tiene pared ni cloroplastos.", prompt: "Identifica ambos tipos celulares y justifica.", data: ["A: pared + cloroplastos", "B: sin pared ni cloroplastos"], model: "A es vegetal por los cloroplastos y la pared; B es animal porque carece de estas estructuras.", rubric: commonRubric("estructuras y clasificación celular") },
    methodCase: { context: "Un dibujo muestra una bacteria con núcleo delimitado.", prompt: "Detecta el error del modelo y corrígelo.", model: "Las bacterias son procariotas y carecen de núcleo delimitado por membrana; el ADN se encuentra en el citoplasma, en una región nucleoide.", rubric: commonRubric("diferencias entre procariotas y eucariotas") },
    decision: { context: "Una infografía dice que una célula «piensa» como un organismo.", prompt: "¿La consideras una explicación adecuada?", model: "Es una metáfora engañosa. La célula responde mediante procesos químicos regulados; no implica conciencia.", rubric: commonRubric("precisión de los modelos biológicos") },
    mission: { context: "Tienes que explicar por qué una lesión muscular afecta al movimiento.", prompt: "Relaciona células, tejido, órgano y sistema.", model: "Las células musculares forman tejido muscular; el tejido integra músculos, que con huesos y nervios forman el aparato locomotor. El daño reduce la contracción coordinada.", rubric: commonRubric("niveles de organización y función") },
  },
  {
    id: "u08", order: 8, term: 2, icon: "🍎", color: "#e9c46a",
    title: "Alimentación y nutrición", shortTitle: "Nutrición",
    subtitle: "Nutrientes, dieta, digestión y decisiones informadas.",
    areas: ["Biología y Geología", "Matemáticas"], keyVocabulary: ["nutriente", "digestión", "absorción", "dieta", "energía"],
    theory: [
      { title: "Alimento no es nutriente", text: "Los alimentos contienen nutrientes. Glúcidos y grasas aportan energía; proteínas tienen función estructural; vitaminas, minerales, agua y fibra regulan procesos.", points: ["Variedad", "Proporción", "Frecuencia"] },
      { title: "Del alimento a las células", text: "La digestión transforma moléculas grandes; la absorción pasa nutrientes en la sangre, sobre todo en el intestino delgado; los restos se eliminan.", points: ["Boca y estómago", "Intestino delgado: absorción", "Intestino grueso: agua"] },
      { title: "Leer etiquetas", text: "Es necesario comparar por 100 g o 100 mL, no sólo por ración. Una decisión saludable considera al conjunto de la dieta, no un único nutriente.", points: ["Azúcares y sal", "Grasas saturadas", "Fibra y tamaño de ración"] },
    ],
    numeric: { prompt: "Un menú aporta 8.400 kJ. Si el 25% viene del desayuno, ¿cuántos kJ son?", answer: 2100, model: "8.400·0,25 = 2.100 kJ" },
    checkpoint: { prompt: "¿Dónde se absorbe la mayor parte de los nutrientes?", options: ["Boca", "Estómago", "Intestino delgado", "Intestino grueso"], answer: "Intestino delgado", explanation: "Las vellosidades aumentan mucho la superficie de absorción." },
    sequence: { prompt: "Ordena el recorrido digestivo.", items: ["Boca", "Esófago", "Estómago", "Intestino delgado", "Intestino grueso"] },
    match: { prompt: "Clasifica función principal.", groups: ["Energética", "Estructural", "Reguladora"], mapping: { "Glúcidos": "Energética", "Proteínas": "Estructural", "Vitaminas": "Reguladora" } },
    interpretation: { context: "Cereales A: 18 g azúcares y 3 g fibra/100 g. B: 6 g azúcares y 9 g fibra/100 g.", prompt: "Compáralos sin afirmar que un alimento aislado es «bueno» o «roín».", data: ["A: 18 g azúcares; 3 g fibra", "B: 6 g azúcares; 9 g fibra"], model: "B tiene menos azúcar y más fibra por 100 g, por tanto encaja mejor como opción habitual; también es necesario considerar ración, ingredientes y dieta global.", rubric: commonRubric("etiquetas y decisión alimentaria") },
    methodCase: { context: "Una persona elimina todas las grasas porque aportan mucha energía.", prompt: "Explica por qué la decisión es demasiado simple.", model: "Algunas grasas son necesarias para membranas, hormonas y absorción de vitaminas. Hay que limitar excesos y priorizar grasas insaturadas, no eliminarlas.", rubric: commonRubric("funciones de los nutrientes y equilibrio") },
    decision: { context: "Menú A es barato pero muy salado; B cuesta 0,80 € más e incluye legumbres, fruta y agua.", prompt: "¿Cuál elegirías para uso habitual? Considera salud y coste.", model: "Escogería B habitualmente si el presupuesto lo permite, por mejor variedad, fibra y menor carga de sal; se puede reducir coste con producto de temporada.", rubric: commonRubric("salud, economía y argumentación") },
    mission: { context: "Prepara un día de menú para una excursión sin calcular calorías exactas.", prompt: "Justifica variedad, conservación y residuos.", model: "Incluiría agua, bocadillo integral con proteína segura, frutos y frutos secos si no hay alergias; alimentos resistentes, recipientes reutilizables y raciones adecuadas.", rubric: commonRubric("nutrición, seguridad y sostenibilidad") },
  },
  {
    id: "u09", order: 9, term: 2, icon: "♥", color: "#e63946",
    title: "Transporte e intercambio", shortTitle: "Aparatos vitales",
    subtitle: "Respiración, circulación y excreción trabajan coordinadamente.",
    areas: ["Biología y Geología", "Matemáticas"], keyVocabulary: ["alvéolo", "capilar", "circulación", "excreción", "homeostasis"],
    theory: [
      { title: "Intercambio de gases", text: "En los alvéolos, el oxígeno pasa a la sangre y el dióxido de carbono sale. La gran superficie, pared fina y red capilar facilitan el intercambio.", points: ["Ventilación ≠ respiración celular", "Difusión", "Relación estructura-función"] },
      { title: "Transporte interno", text: "El corazón impulsa sangre por los vasos. Las arterias salen del corazón, las venas vuelven y los capilares permiten intercambios con tejidos.", points: ["Circuito pulmonar", "Circuito general", "Plasma y células sanguíneas"] },
      { title: "Eliminar y regular", text: "Los riñones filtran la sangre y forman orina, regulando agua y sales. Pulmones, piel e hígado también intervienen en la eliminación de sustancias.", points: ["Excreción no es defecación", "Equilibrio interno", "Hidratación"] },
    ],
    numeric: { prompt: "A 72 latidos por minuto, ¿cuántos latidos hace el corazón en 10 minutos?", answer: 720, model: "72·10 = 720 latidos" },
    checkpoint: { prompt: "¿Qué vasos permiten el intercambio con los tejidos?", options: ["Arterias grandes", "Venas grandes", "Capilares", "Tráquea"], answer: "Capilares", explanation: "Tienen paredes muy finas y forman redes." },
    sequence: { prompt: "Ordena el recorrido del oxígeno.", items: ["Alvéolo", "Sangre pulmonar", "Corazón", "Arteria sistémica", "Célula"] },
    match: { prompt: "Asocia estructura y función.", groups: ["Impulsar", "Intercambiar", "Filtrar"], mapping: { "Corazón": "Impulsar", "Capilar": "Intercambiar", "Riñón": "Filtrar" } },
    interpretation: { context: "Pulso en reposo: 68 bpm. Después de correr: 148 bpm. A los 5 min: 82 bpm.", prompt: "Describe y explica el cambio.", data: ["Reposo 68", "Ejercicio 148", "Recuperación 82"], model: "El pulso sube para llevar más oxígeno y nutrientes a los músculos y después desciende hacia el valor de reposo durante la recuperación.", rubric: commonRubric("datos fisiológicos y coordinación") },
    methodCase: { context: "Un esquema pinta siempre las arterias de rojo y las venas de azul.", prompt: "¿Qué simplificación puede provocar error?", model: "El color representa habitualmente oxigenación, no el tipo de vaso. La arteria pulmonar lleva sangre poco oxigenada y las venas pulmonares, oxigenada.", rubric: commonRubric("modelos del sistema circulatorio") },
    decision: { context: "Después de ejercicio intenso una persona evita beber por no sudar.", prompt: "Evalúa la decisión.", model: "Es inadecuada: se ha perdido agua y sales; la hidratación ayuda a recuperar volumen sanguíneo y regulación térmica. Hay que beber de forma segura y progresiva.", rubric: commonRubric("homeostasis y salud") },
    mission: { context: "Explica a una célula muscular cómo recibe oxígeno y elimina CO₂.", prompt: "Construye una cadena causal con tres aparatos.", model: "El respiratorio incorpora O₂ a los alvéolos; el circulatorio lo transporta hasta los capilares musculares; el CO₂ hace el camino inverso y se expulsa por los pulmones.", rubric: commonRubric("coordinación entre aparatos") },
  },
  {
    id: "u10", order: 10, term: 2, icon: "⚡", color: "#577590",
    title: "Coordinación y respuesta", shortTitle: "Nervioso y endocrino",
    subtitle: "Estímulos, respuestas, hormonas y prevención de adicciones.",
    areas: ["Biología y Geología"], keyVocabulary: ["neurona", "sinapsis", "reflejo", "hormona", "adicción"],
    theory: [
      { title: "Información rápida", text: "El sistema nervioso recibe estímulos, integra información y coordina respuestas mediante impulsos nerviosos. Los reflejos son respuestas rápidas e involuntarias.", points: ["Receptor", "Centro nervioso", "Efector"] },
      { title: "Regulación hormonal", text: "Las glándulas endocrinas liberan hormonas en la sangre. Suelen actuar más lentamente pero durante más tiempo que los impulsos nerviosos.", points: ["Células diana", "Retroalimentación", "Coordinación con sistema nervioso"] },
      { title: "Salud y adicciones", text: "Las sustancias adictivas alteran circuitos de recompensa y control. El riesgo depende de substancia, dosis, frecuencia, edad y contexto; pedir ayuda es una conducta de salud.", points: ["Dependencia y tolerancia", "Presión de grupo", "Fuentes sanitarias fiables"] },
    ],
    numeric: { prompt: "El tiempo de reacción baja de 0,28 s a 0,21 s. ¿Cuál es la disminución?", answer: 0.07, tolerance: 0.001, model: "0,28 − 0,21 = 0,07 s" },
    checkpoint: { prompt: "¿Qué sistema suele dar una respuesta más rápida?", options: ["Endocrino", "Nervioso", "Digestivo", "Excretor"], answer: "Nervioso", explanation: "Los impulsos nerviosos viajan rápidamente por neuronas." },
    sequence: { prompt: "Ordena un arco reflejo.", items: ["Estímulo", "Receptor", "Neurona sensitiva", "Centro nervioso", "Efector"] },
    match: { prompt: "Asocia elemento y sistema.", groups: ["Nervioso", "Endocrino", "Efector"], mapping: { "Neurona": "Nervioso", "Hormona": "Endocrino", "Músculo": "Efector" } },
    interpretation: { context: "Tiempo de reacción medio: descanso 0,22 s; falta de sueño 0,31 s.", prompt: "Interpreta sin convertir a la asociación en una ley universal.", data: ["Descanso: 0,22 s", "Poco sueño: 0,31 s"], model: "En esta muestra, la falta de sueño se asocia con respuesta más lenta en 0,09 s. Es necesario conocer muestra y control de otras variables antes de generalizar.", rubric: commonRubric("datos, sistema nervioso y prudencia") },
    methodCase: { context: "Un vídeo afirma que una sustancia \"natural\" no puede crear adicción.", prompt: "Evalúa el argumento.", model: "Natural no significa segura. Es necesario estudiar mecanismo, dosis, evidencia clínica, dependencia y efectos; su origen no determina el riesgo.", rubric: commonRubric("pensamiento crítico y salud") },
    decision: { context: "Un amigo te presiona para probar a un vapeador porque «todo el mundo lo hace».", prompt: "Formula una decisión y una estrategia de respuesta.", model: "Rechazaría la oferta, cuestionaría la falsa normalización y buscaría apoyo de una persona adulta o sanitaria si la presión sigue.", rubric: commonRubric("prevención, autonomía y fuentes fiables") },
    mission: { context: "Explica por qué retirar la mano de una superficie caliente ocurre antes de sentir el dolor consciente.", prompt: "Diferencia reflejo y percepción.", model: "La médula coordina rápidamente el reflejo hacia el músculo; al mismo tiempo, la información sube al cerebro, donde se construye la percepción consciente del dolor.", rubric: commonRubric("arco reflejo e integración nerviosa") },
  },
  {
    id: "u11", order: 11, term: 2, icon: "✚", color: "#43aa8b",
    title: "Defensas y salud", shortTitle: "Inmunidad",
    subtitle: "Barreras, respuesta inmunitaria, vacunas y uso responsable de antibióticos.",
    areas: ["Biología y Geología", "Matemáticas"], keyVocabulary: ["patógeno", "barrera", "anticuerpo", "vacuna", "antibiótico"],
    theory: [
      { title: "Prevenir la entrada", text: "Piel, mucosas, cilios y secreciones son barreras. Si un patógeno entra, actúan respuestas innatas y específicas.", points: ["Inflamación", "Linfocitos", "Memoria inmunitaria"] },
      { title: "Vacunación", text: "Las vacunas entrenan al sistema inmunitario con antígenos seguros para que desarrolle memoria sin sufrir la enfermedad grave.", points: ["Protección individual", "Reducción de transmisión", "Beneficio colectivo"] },
      { title: "Antibióticos", text: "Actúan contra bacterias, no contra virus. El uso innecesario favorece la selección de bacterias resistentes.", points: ["Prescripción sanitaria", "Completar pauta indicada", "Resistencia como evolución poblacional"] },
    ],
    numeric: { prompt: "En 100 personas había 40 casos y después de una medida hay 16. ¿Cuántos casos menos hay?", answer: 24, model: "40 − 16 = 24 casos menos" },
    checkpoint: { prompt: "¿Por qué un antibiótico no cura la gripe?", options: ["La dosis es baja", "La gripe es vírica", "Los anticuerpos lo bloquean", "Siempre el cuidado"], answer: "La gripe es vírica", explanation: "Los antibióticos tienen dianas bacterianas." },
    sequence: { prompt: "Ordena una respuesta inmune simplificada.", items: ["Entrada del patógeno", "Reconocimiento", "Activación de defensas", "Eliminación", "Memoria inmunitaria"] },
    match: { prompt: "Asocia acción y categoría.", groups: ["Barrera", "Inmunidad específica", "Tratamiento bacteriano"], mapping: { "Piel": "Barrera", "Anticuerpo": "Inmunidad específica", "Antibiótico": "Tratamiento bacteriano" } },
    interpretation: { context: "Grupo vacunado: 8 casos de 200. No vacunado: 32 de 200.", prompt: "Compara frecuencias y formula una prudente conclusión.", data: ["Vacunado: 8/200", "No vacunado: 32/200"], model: "Hay 4% de casos en vacunados y 16% en no vacunados. En estos datos la vacunación se asocia con menor frecuencia, pero es necesario conocer el diseño.", rubric: commonRubric("frecuencias e inmunidad") },
    methodCase: { context: "Alguien deja el antibiótico cuando se encuentra mejor, contra la pauta médica.", prompt: "Explica el problema biológico.", model: "Pueden quedar bacterias supervivientes y volver a multiplicarse; seguir la pauta prescrita reduce fracaso y selección de resistencias.", rubric: commonRubric("selección y uso responsable de antibióticos") },
    decision: { context: "Una red difunde un efecto adverso sin indicar cuántas dosis se han administrado.", prompt: "¿Qué información necesitas para valorar el riesgo?", model: "Número total de dosis, frecuencia esperada sin vacuna, gravedad, relación temporal y causal, fuente y comparación con riesgo de la enfermedad.", rubric: commonRubric("riesgo, denominadores y fuentes fiables") },
    mission: { context: "Redacta un breve mensaje para explicar a la clase inmunidad colectiva sin prometer protección absoluta.", prompt: "Incluye mecanismo, límite y responsabilidad.", model: "Cuando muchas personas son inmunes, el patógeno encuentra menos cadenas de transmisión y protege indirectamente a personas vulnerables; no elimina todo riesgo y es necesario seguir medidas sanitarias.", rubric: commonRubric("comunicación científica sobre vacunas") },
  },
  {
    id: "u12", order: 12, term: 2, icon: "∞", color: "#b56576",
    title: "Reproducción y sexualidad saludable", shortTitle: "Reproducción",
    subtitle: "Cambios, reproducción humana, anticoncepción, ITS y respeto.",
    areas: ["Biología y Geología"], keyVocabulary: ["gameto", "fecundación", "ciclo", "anticoncepción", "consentimiento"],
    theory: [
      { title: "Reproducción humana", text: "Los gametos contienen información genética. La fecundación forma un cigoto; el desarrollo embrionario y fetal ocurre habitualmente en el útero.", points: ["Ovario y testículo", "Fecundación no es implantación", "Variabilidad biológica"] },
      { title: "Salud sexual", text: "La salud sexual incluye información, respeto, consentimiento libre y reversible, ausencia de presión y acceso a servicios sanitarios.", points: ["Privacidad", "Diversidad", "Comunicación y límites"] },
      { title: "Prevención", text: "Los métodos anticonceptivos tienen eficacias y usos distintos. El preservativo es el único método habitual que también reduce el riesgo de muchas ITS.", points: ["Uso correcto", "Doble protección", "Fuentes sanitarias"] },
    ],
    numeric: { prompt: "En un modelo de ciclo de 28 días, si la ovulación se estima 14 días antes del final, ¿qué día sería?", answer: 14, model: "28 − 14 = día 14; es sólo un modelo aproximado." },
    checkpoint: { prompt: "¿Qué método también reduce el riesgo de muchas ITS?", options: ["Preservativo", "Calendario", "Píldora", "DICE"], answer: "Preservativo", explanation: "Actúa como barrera; es necesario uso correcto." },
    sequence: { prompt: "Ordena el proceso inicial.", items: ["Formación de gametos", "Fecundación", "Zigoto", "Implantación", "Desarrollo embrionario"] },
    match: { prompt: "Asocia término y función.", groups: ["gameto", "Órgano de gestación", "Barrera"], mapping: { "Espermatozoide": "gameto", "Útero": "Órgano de gestación", "Preservativo": "Barrera" } },
    interpretation: { context: "Método A: 91% de eficacia en uso típico. B: 85%. Ninguna protege de ITS.", prompt: "¿Qué podemos y qué no podemos concluir?", data: ["A: 91 %", "B: 85%", "Sin protección ITS"], model: "A presenta mayor eficacia anticonceptiva típica, pero ninguna reduce ITS; la decisión requiere asesoramiento, preferencias, contraindicaciones y posible preservativo.", rubric: commonRubric("eficacia, límites y salud sexual") },
    methodCase: { context: "Una aplicación predice «días seguros» exactos para todas las personas.", prompt: "Critica el modelo.", model: "Los ciclos varían entre personas y meses; una predicción media no garantiza ausencia de ovulación ni protege de ITS.", rubric: commonRubric("variabilidad biológica y límites de los modelos") },
    decision: { context: "Una persona cambia de opinión después de haber dicho que sí.", prompt: "¿Qué implica el consentimiento?", model: "El consentimiento puede retirarse en cualquier momento; hay que parar de inmediato, respetar la decisión y evitar cualquier presión.", rubric: commonRubric("consentimiento y toma de decisiones") },
    mission: { context: "Una publicación anónima afirma un «cuidado casero» para una ITS.", prompt: "Describe una respuesta segura y basada en evidencias.", model: "No seguirla; consultar un servicio sanitario, realizar pruebas si corresponde, informar parejas según indicación y usar fuentes oficiales. Las ITS requieren diagnóstico y tratamiento adecuados.", rubric: commonRubric("fuentes fiables y conducta de salud") },
  },
  {
    id: "u13", order: 13, term: 3, icon: "⛰", color: "#bc6c25",
    title: "La Tierra cambia", shortTitle: "Geología",
    subtitle: "Relieve, procesos internos y externos, mapas y riesgos geológicos.",
    areas: ["Biología y Geología", "Matemáticas"], keyVocabulary: ["erosión", "sedimentación", "placa", "relieve", "riesgo"],
    theory: [
      { title: "Modelar el relevo", text: "Meteorización rompe rocas; erosión las desgasta y transporta; sedimentación deposita materiales. Agua, viento, hielo y gravedad actúan con velocidades distintas.", points: ["Proceso y agente", "Escalas de tiempo", "Acción humana"] },
      { title: "Dinámica interna", text: "La tectónica de placas explica terremotos, vulcanismo y cordilleras. Los límites pueden ser divergentes, convergentes o transformantes.", points: ["Energía interna", "Placas litosféricas", "Distribución de riesgos"] },
      { title: "Riesgo y prevención", text: "Riesgo combina peligrosidad, exposición y vulnerabilidad. No podemos evitar muchos fenómenos pero sí reducir daños con planificación y preparación.", points: ["Mapas de riesgo", "Normas de construcción", "Planes de emergencia"] },
    ],
    numeric: { prompt: "¿En un mapa 1:25.000, 8 cm representan cuántos km?", answer: 2, model: "8·25.000 = 200.000 cm = 2 km" },
    checkpoint: { prompt: "¿Qué proceso deposita materiales transportados?", options: ["Meteorización", "Erosión", "Sedimentación", "Fusión"], answer: "Sedimentación", explanation: "Ocurre cuando el agente pierde energía." },
    sequence: { prompt: "Ordena el ciclo externo simplificado.", items: ["Meteorización", "Erosión", "Transporte", "Sedimentación", "Compactación"] },
    match: { prompt: "Asocia fenómeno y origen dominante.", groups: ["Interno", "Externo", "Riesgo combinado"], mapping: { "Terremoto": "Interno", "Barranco erosionado": "Externo", "Daño urbano": "Riesgo combinado" } },
    interpretation: { context: "Zona A: alta peligrosidad, baja población. Zona B: Peligrosidad media, población densa y edificios vulnerables.", prompt: "¿Dónde puede ser mayor el riesgo y por qué?", data: ["A: peligro alto, exposición baja", "B: peligro medio, exposición/vulnerabilidad altas"], model: "Puede ser mayor en B porque riesgo no es sólo peligrosidad: la alta exposición y vulnerabilidad pueden aumentar mucho los daños.", rubric: commonRubric("peligrosidad, exposición y vulnerabilidad") },
    methodCase: { context: "Después de una tormenta aparece una grieta y se concluye que la tormenta causará siempre desprendimientos.", prompt: "¿Qué evidencia faltaría?", model: "Es necesario comparar antes/después, pendiente, roca, agua, antecedentes y otras zonas; un caso no permite una regla universal.", rubric: commonRubric("causalidad y evidencia geológica") },
    decision: { context: "Se propone construir en una zona inundable porque hace años que no se inunda.", prompt: "Evalúa la decisión.", model: "Ausencia reciente no elimina el riesgo. Es necesario usar series largas, mapas, escenarios climáticos y medidas de evacuación o evitar la exposición.", rubric: commonRubric("riesgo, probabilidad y prevención") },
    mission: { context: "Prepara una explicación de clase sobre un terremoto sin alarmismo.", prompt: "Incluye causa, riesgo y tres medidas.", model: "Movimiento repentino en una falla libera energía. El daño depende de exposición y construcción. Medidas: edificios adecuados, asegurar objetos y practicar agacharse-cubrirse-cogerse.", rubric: commonRubric("geología, riesgo y comunicación") },
  },
  {
    id: "u14", order: 14, term: 3, icon: "♻", color: "#588157",
    title: "Ecosistemas y sostenibilidad", shortTitle: "Ecología",
    subtitle: "Relaciones, flujo de energía, ciclos y decisiones ambientales.",
    areas: ["Biología y Geología", "Matemáticas"], keyVocabulary: ["ecosistema", "población", "red trófica", "biodiversidad", "sostenibilidad"],
    theory: [
      { title: "Sistema vivo", text: "Un ecosistema integra comunidad de seres vivos y factores físicos. Las poblaciones se relacionan por competencia, depredación, mutualismo y otras interacciones.", points: ["Biotopo y biocenosis", "Hábitat y nicho", "Cambios en red"] },
      { title: "Materia y energía", text: "La energía entra principalmente del Sol y disminuye entre niveles tróficos; la materia se recicla en ciclos como los del agua y el carbono.", points: ["Productores", "Consumidores", "Descomponedores"] },
      { title: "Decidir con criterios", text: "Sostenibilidad combina límites ecológicos, bienestar social y viabilidad económica. Es necesario comparar impactos durante todo el ciclo de vida.", points: ["Reducir antes de reciclar", "Huella material y energética", "Justicia ambiental"] },
    ],
    numeric: { prompt: "En una muestra existen 18 especies nativas de 24 totales. ¿Qué porcentaje son nativas?", answer: 75, model: "18/24·100 = 75 %" },
    checkpoint: { prompt: "¿Qué grupo recicla nutrientes de restos orgánicos?", options: ["Productores", "Herbívoros", "Descomponedores", "Depredadores"], answer: "Descomponedores", explanation: "Transforman materia orgánica y devuelven nutrientes." },
    sequence: { prompt: "Ordena un nivel trófico simple.", items: ["Sol", "Productor", "Herbívor", "Carnívor", "Descomponedor"] },
    match: { prompt: "Asocia relación y ejemplo.", groups: ["Mutualismo", "Depredación", "Competencia"], mapping: { "Abeja y flor": "Mutualismo", "Búho y ratón": "Depredación", "Dos plantas por luz": "Competencia" } },
    interpretation: { context: "Después de reducir depredadores: herbívoros +60%, vegetación −35%, erosión +20%.", prompt: "Construye una prudente explicación causal.", data: ["Depredadores ↓", "Herbívoros +60%", "Vegetación −35 %", "Erosión +20%"], model: "Menos depredación puede favorecer a herbívoros; mayor consumo reduce vegetación y el suelo queda menos protegido, aumentando erosión. Es necesario comprobar otros cambios simultáneos.", rubric: commonRubric("redes ecológicas y causalidad") },
    methodCase: { context: "Para medir biodiversidad sólo se cuenta el número de árboles.", prompt: "¿Por qué el indicador es insuficiente?", model: "No considera especias, abundancias, otros grupos ni diversidad de hábitats. Es necesario combinar riqueza y equidad con muestreo comparable.", rubric: commonRubric("indicadores de biodiversidad") },
    decision: { context: "Opción A: vasos compostables desechables. B: vasos reutilizables lavados.", prompt: "¿Qué información pedirías antes de elegir?", model: "Número de usos, energía y agua de lavado, origen de materiales, transporte, sistema real de compostaje y residuos finales.", rubric: commonRubric("ciclo de vida y sostenibilidad") },
    mission: { context: "El centro quiere reducir residuos un 30%.", prompt: "Propone tres acciones, indicadores y una forma de evaluar.", model: "Medir residuo inicial; reducir envases, reutilizar y separar; pesar semanalmente por tipos y comparar por alumno con la línea base.", rubric: commonRubric("objetivos, indicadores y acción ambiental") },
  },
  {
    id: "u15", order: 15, term: 3, icon: "◆", color: "#4d908e",
    title: "Materia que medimos", shortTitle: "Materia y gases",
    subtitle: "Propiedades, densidad, modelo cinético-molecular y gases.",
    areas: ["Física y Química", "Matemáticas"], keyVocabulary: ["demasiado", "volumen", "densidad", "partícula", "presión"],
    theory: [
      { title: "Propiedades de la materia", text: "Demasiado y volumen dependen de la cantidad; la densidad relaciona ambas y ayuda a identificar materiales: d=m/V.", points: ["Unidades coherentes", "Propiedad característica", "Flotar depende de densidades"] },
      { title: "Modelo de partículas", text: "La materia está formada por partículas en movimiento. Los estados se explican por distancia, orden, movimiento y fuerzas entre partículas.", points: ["Sólido: posiciones fijas", "Líquido: proximidad y movilidad", "Gas: separación y movimiento libre"] },
      { title: "Gases", text: "La presión nace de los choques de las partículas. Si disminuye el volumen a temperatura constante, aumenta la frecuencia de choques y la presión.", points: ["Temperatura y movimiento", "Volumen del recipiente", "Modelo cualitativo"] },
    ],
    numeric: { prompt: "Una muestra tiene 135 gr. y ocupa 50 cm³. Calcula la densidad.", answer: 2.7, tolerance: 0.01, model: "d = 135/50 = 2,7 g/cm³" },
    checkpoint: { prompt: "Al comprimir un gas a temperatura constante, la...", options: ["Disminuye", "Aumenta", "No cambia", "Se hace cero"], answer: "Aumenta", explanation: "Hay más choques por unidad de superficie y tiempo." },
    sequence: { prompt: "Ordena un cálculo de densidad.", items: ["Identificar masa y volumen", "Convertir unidades", "Escribir d=m/V", "Sustituir", "Interpretar y comparar"] },
    match: { prompt: "Asocia estado y descripción.", groups: ["Sólido", "Líquido", "Gas"], mapping: { "Forma y volumen fijos": "Sólido", "Volumen fijo, forma variable": "Líquido", "Forma y volumen variables": "Gas" } },
    interpretation: { context: "Materiales: corcho 0,24; agua 1,00; aluminio 2,70 g/cm³.", prompt: "Predice qué ocurre con corcho y aluminio en agua.", data: ["Corcho 0,24", "Agua 1,00", "Aluminio 2,70"], model: "El corcho, menos denso, tiende a flotar; el aluminio macizo, más denso, tiende a desmoronarse.", rubric: commonRubric("densidad y predicción") },
    methodCase: { context: "Un alumno dice que las partículas de un gas se hacen mayores cuando se calienta.", prompt: "Corrige el modelo.", model: "Las partículas no necesariamente cambian de tamaño; aumenta la energía cinética y, si el recipiente puede expandirse, la distancia media.", rubric: commonRubric("modelo cinético-molecular") },
    decision: { context: "Para identificar una prenda se propone mirar sólo el color.", prompt: "¿Qué medidas serían mejores?", model: "Mediría demasiado y volumen para calcular densidad, repetiría y compararía con valores de referencia; el color puede coincidir en materiales distintos.", rubric: commonRubric("propiedades características y medida") },
    mission: { context: "Una jeringa cerrada con aire puede comprimirse, pero una llena de agua casi no.", prompt: "Explícalo con partículas sin realizar el experimento.", model: "En el gas hay mucho espacio entre partículas y se puede reducir; en el líquido están muy cercanas y queda poco espacio por disminuir.", rubric: commonRubric("modelo de partículas y compresibilidad") },
  },
  {
    id: "u16", order: 16, term: 3, icon: "⚛", color: "#277da1",
    title: "Átomos y sustancias", shortTitle: "Átomos y fórmulas",
    subtitle: "Modelos atómicos, elementos, iones, moléculas y lenguaje químico.",
    areas: ["Física y Química"], keyVocabulary: ["átomo", "elemento", "protón", "ion", "fórmula"],
    theory: [
      { title: "Estructura atómica", text: "El núcleo contiene protones positivos y neutrones; los electrones negativos ocupan la zona externa. El número atómico Z es el número de protones.", points: ["Átomo neutro: protones=electrones", "A=protones+neutrones", "Isótopos: mismo Z"] },
      { title: "Elementos y tabla periódica", text: "Cada elemento se define por el número de protones y tiene un símbolo. La tabla ordena elementos y agrupa propiedades similares.", points: ["Símbolos con mayúscula/minúscula", "Metales y no metales", "Grupos y períodos"] },
      { title: "Fórmulas", text: "Una fórmula indica qué elementos y cuántos átomos forman una substancia. Un subíndice afecta sólo al símbolo anterior.", points: ["H₂O: 2 H y 1 O", "CO₂: 1 C y 2 O", "No inventar cargas"] },
    ],
    numeric: { prompt: "Un átomo tiene A=23 y Z=11. ¿Cuántos neutrones tiene?", answer: 12, model: "Neutrones = A − Z = 23 − 11 = 12" },
    checkpoint: { prompt: "¿Qué identifica un elemento químico?", options: ["Número de neutrones", "Número de protones", "Demasiado de la muestra", "Estado físico"], answer: "Número de protones", explanation: "Es el número atómico Z." },
    sequence: { prompt: "Ordena de menor a mayor organización química.", items: ["Partícula subatómica", "Átomo", "Molécula", "Sustancia", "Mezcla"] },
    match: { prompt: "Asocia símbolo y recuento en CO₂.", groups: ["1 átomo", "2 átomos", "No aparece"], mapping: { "Carbono": "1 átomo", "Oxígeno": "2 átomos", "Nitrógeno": "No aparece" } },
    interpretation: { context: "X: Z=8, A=16. Y: Z=8, A=18. W: Z=9, A=18.", prompt: "¿Cuáles son isótopos y por qué?", data: ["X 8/16", "Y 8/18", "W 9/18"], model: "X e Y son isótopos: mismo número de protones Z=8 y distinto número de neutrones/masa A.", rubric: commonRubric("número atómico, masa e isótopos") },
    methodCase: { context: "Un modelo dibuja electrones como planetas en órbitas exactas.", prompt: "¿Cómo presentarías el valor y el límite del modelo?", model: "Ayuda a visualizar núcleo y capas, pero no representa trayectorias planetarias exactas; es una simplificación de distribuciones de probabilidad.", rubric: commonRubric("uso crítico de modelos atómicos") },
    decision: { context: "Una etiqueta dice \"sin químicos\".", prompt: "¿Es científicamente correcta?", model: "No literalmente: toda materia, incluido agua y alimentos, está formada por sustancias químicas. Puede querer decir sin ciertos aditivos, que deben especificarse.", rubric: commonRubric("lenguaje químico y comunicación") },
    mission: { context: "Explica H₂O, O₂ y H₂O₂ a una persona que confunde subíndices.", prompt: "Compara composición y sustancia.", model: "H₂O tiene 2 H y 1 O; O₂, dos O; H₂O₂, 2 H y 2 O. Cambiar la proporción cambia la sustancia y las propiedades.", rubric: commonRubric("fórmulas y composición") },
  },
  {
    id: "u17", order: 17, term: 3, icon: "ϟ", color: "#f8961e",
    title: "Energía y electricidad", shortTitle: "Energía eléctrica",
    subtitle: "Transferencias, calor, circuitos, potencia y consumo responsable.",
    areas: ["Física y Química", "Matemáticas"], keyVocabulary: ["energía", "calor", "corriente", "tensión", "potencia"],
    theory: [
      { title: "Energía y transferencias", text: "La energía se conserva pero se transfiere y se degrada. Calor es transferencia de energía por diferencia de temperatura; temperatura no es cantidad de calor.", points: ["Conducción, convección, radiación", "Sistema y entorno", "Eficiencia"] },
      { title: "Circuitos", text: "La corriente es movimiento ordenado de carga. Tensión impulsa, resistencia dificulta y la ley de Ohm relaciona V=I·R en dispositivos óhmicos.", points: ["Circuito cerrado", "Serie y paralelo", "Seguridad"] },
      { title: "Potencia y consumo", text: "La potencia es energía por tiempo: P=V·I y E=P·t. En facturas se usa kWh. Menos potencia o menos tiempo reduce consumo.", points: ["W y kW", "kWh es energía", "Coste = energía·tarifa"] },
    ],
    numeric: { prompt: "Un aparato funciona a 230 V y 2 A. Calcula la potencia.", answer: 460, model: "P = V·I = 230·2 = 460 W" },
    checkpoint: { prompt: "¿Qué unidad de factura representa energía?", options: ["W", "V", "En", "kWh"], answer: "kWh", explanation: "Potencia multiplicada por el tiempo." },
    sequence: { prompt: "Ordena el análisis de un consumo.", items: ["Leer potencia", "Convertir W a kW", "Multiplicar por horas", "Obtener kWh", "Multiplicar por tarifa"] },
    match: { prompt: "Asocia magnitud y unidad.", groups: ["Tensión", "Corriente", "Potencia"], mapping: { "Volt": "Tensión", "Ampere": "Corriente", "Watt": "Potencia" } },
    interpretation: { context: "En: 1.500 W durante 0,5 h. B: 500 W durante 2h.", prompt: "¿Cuál consume más energía?", data: ["A: 1,5 kW·0,5 h", "B: 0,5 kW·2 h"], model: "A consume 0,75 kWh y B 1 kWh; B consume más aunque tiene menor potencia porque funciona más tiempo.", rubric: commonRubric("potencia, tiempo y energía") },
    methodCase: { context: "Una manta y un termómetro están en la misma habitación. Alguien dice que la manta \"tiene más calor\".", prompt: "Corrige la explicación.", model: "Pueden estar a la misma temperatura; la manta reduce la transferencia de calor del cuerpo al entorno. Calor es energía en tránsito.", rubric: commonRubric("calor, temperatura y aislamiento") },
    decision: { context: "Bombilla A: 9 W, 10€. B: 60 W, 2€. Misma luz y 1.000 h de uso.", prompt: "¿Cómo decidirías con tarifa 0,20€/kWh?", model: "En usa 9 kWh y cuesta 1,80 € de energía +10=11,80 €. B usa 60 kWh y cuesta 12+2=14€. A cuesta menos y consume menos.", rubric: commonRubric("coste total y eficiencia") },
    mission: { context: "Analiza una factura doméstica para reducir consumo sin perder bienestar.", prompt: "Propone tres acciones cuantificables y priorizalas.", model: "Identificar grandes potencias y horas; reducir climatización ineficiente, tiempo de uso y standby; estimar kWh ahorrados y priorizar mayor ahorro con seguridad.", rubric: commonRubric("energía, cálculo y decisión responsable") },
  },
  {
    id: "u18", order: 18, term: 3, icon: "◎", color: "#264653",
    title: "Misión PDC: decidir con ciencia", shortTitle: "Proyecto final",
    subtitle: "Salud, energía y medio ambiente en una decisión interdisciplinar.",
    areas: ["Interdisciplinario"], keyVocabulary: ["criterio", "indicador", "escenario", "impacto", "argumento"],
    theory: [
      { title: "Problemas reales", text: "Una decisión sociocientífica combina datos, modelos, valores y restricciones. Primero definimos el problema y las personas afectadas.", points: ["Separar hechos y prioridades", "Buscar alternativas", "Detectar incertidumbre"] },
      { title: "Comparar con criterios", text: "Una matriz de decisión hace explícitos criterios como salud, coste, emisiones, equidad y viabilidad. Las ponderaciones deben justificarse.", points: ["Indicadores medibles", "Misma escala", "Análisis de sensibilidad"] },
      { title: "Argumentar y revisar", text: "Una buena propuesta formula una afirmación, aporta evidencias y explica el razonamiento. También reconoce reparos y dice qué haría cambiar la decisión.", points: ["Afirmación-evidencia-razonamiento", "Fuentes contrastadas", "Seguimiento con indicadores"] },
    ],
    numeric: { prompt: "Una propuesta desciende las emisiones anuales de 420 kg a 275 kg. ¿Cuántos kg ahorra?", answer: 145, model: "420 − 275 = 145 kg anuales" },
    checkpoint: { prompt: "¿Qué criterio es un indicador medible?", options: ["Me gusta", "Queda hermoso", "kWh por alumno y mes", "Es lo mejor"], answer: "kWh por alumno y mes", explanation: "Tiene magnitud, unidad y período." },
    sequence: { prompt: "Ordena una decisión informada.", items: ["Definir el problema", "Recoger evidencias", "Establecer criterios", "Comparar alternativas", "Decidir y evaluar"] },
    match: { prompt: "Asocia dato y dimensión.", groups: ["Salud", "Economía", "Ambiente"], mapping: { "Calidad del aire interior": "Salud", "Coste anual": "Economía", "kg de CO₂": "Ambiente" } },
    interpretation: { context: "Plan A: coste 8.000 €, −30% energía. Plan B: 3.000 €, −12%. Presupuesto 9.000€.", prompt: "Compara ahorro relativo y restricción; evita decidir sólo por el porcentaje.", data: ["En: 8.000 €, −30 %", "B: 3.000 €, −12 %"], model: "A mujer más ahorro y ninguna dentro del presupuesto, pero hay que calcular kWh y retorno. B deja presupuesto por otras acciones; la mejor combinación depende de costes e impactos completos.", rubric: commonRubric("comparación multicriterio") },
    methodCase: { context: "Una empresa presenta sólo el año con menor consumo para demostrar mejoría.", prompt: "¿Qué problema hay y qué datos pedirías?", model: "Es selección interesada de datos. Pediría serie de varios años, actividad del centro, clima, método de medida y consumo por alumno.", rubric: commonRubric("calidad y selección de datos") },
    decision: { context: "El centro elige entre más sombra vegetal, aire acondicionado o cambio de horarios frente al calor.", prompt: "Construye una decisión con salud, energía, coste y equidad.", model: "Comparía reducción de temperatura, protección de vulnerables, kWh, coste y tiempo de aplicación. Probablemente combinaría sombra y horarios, reservando climatización eficiente para episodios y espacios críticos.", rubric: commonRubric("decisión sociocientífica multicriterio") },
    mission: { context: "Reto final: propone una mejora mensurable para el centro en salud, energía o ambiente.", prompt: "Incluye diagnóstico, cálculo, evidencias, plano, indicador y revisión.", model: "Ejemplo: reducir 20% el consumo de iluminación. Medir línea base, sustituir puntos prioritarios y ajustar horarios, estimar kWh/cost/CO₂, controlar mensualmente y revisar si no se alcanza el objetivo.", rubric: commonRubric("integración completa de ciencia y matemáticas") },
  },
];

function activitiesFor(seed: UnitSeed): Activity[] {
  const base = `${seed.id}-`;
  const area = seed.areas[0];
  const scientificText = unitSupplements[seed.id].scientificText;
  return [
    { id: base + "01", unitId: seed.id, title: "Cálculo con procedimiento", kind: "numeric", area, prompt: seed.numeric.prompt, answer: seed.numeric.answer, tolerance: seed.numeric.tolerance ?? 0.001, modelAnswer: seed.numeric.model, explanation: `Procedimiento modelo: ${seed.numeric.model}`, hint: "Escribe los datos, la relación que usas y comprueba la unidad.", maxScore: 10 },
    { id: base + "02", unitId: seed.id, title: "Idea clave", kind: "choice", area, prompt: seed.checkpoint.prompt, options: seed.checkpoint.options, answer: seed.checkpoint.answer, modelAnswer: `${seed.checkpoint.answer}. ${seed.checkpoint.explanation}`, explanation: seed.checkpoint.explanation, hint: "Descarta opciones que confundan magnitudes o causas.", maxScore: 10 },
    { id: base + "03", unitId: seed.id, title: "Pon orden", kind: "order", area, prompt: seed.sequence.prompt, items: seed.sequence.items, answer: seed.sequence.items.join("|"), modelAnswer: seed.sequence.items.map((x, i) => `${i + 1}. ${x}`).join(" · "), explanation: "El orden muestra el proceso completo, no solo el resultado.", hint: "Busca qué debe ocurrir necesariamente antes.", maxScore: 10 },
    { id: base + "04", unitId: seed.id, title: "Clasifica y asocia", kind: "match", area, prompt: seed.match.prompt, groups: seed.match.groups, mapping: seed.match.mapping, answer: JSON.stringify(seed.match.mapping), modelAnswer: Object.entries(seed.match.mapping).map(([k, v]) => `${k} → ${v}`).join(" · "), explanation: "Cada asociación se basa en la definición o función científica.", hint: "Compara cada término con la definición exacta.", maxScore: 10 },
    { id: base + "05", unitId: seed.id, title: "Interpreta los datos", kind: "open", area, prompt: seed.interpretation.prompt, context: seed.interpretation.context, data: seed.interpretation.data, modelAnswer: seed.interpretation.model, explanation: "La IA compara la respuesta con una rúbrica y envía los casos dudosos a revisión docente.", hint: "Cita al menos un dato y explica lo que significa.", rubric: seed.interpretation.rubric, maxScore: 10 },
    { id: base + "06", unitId: seed.id, title: "Piensa como la ciencia", kind: "open", area, prompt: seed.methodCase.prompt, context: seed.methodCase.context, modelAnswer: seed.methodCase.model, explanation: "No es necesario realizar el experimento: es necesario describir el diseño o analizar la evidencia.", hint: "Identifica variables, evidencias, control o límites según sea el caso.", rubric: seed.methodCase.rubric, maxScore: 10 },
    { id: base + "07", unitId: seed.id, title: "Toma una decisión", kind: "decision", area, prompt: seed.decision.prompt, context: seed.decision.context, modelAnswer: seed.decision.model, explanation: "Una decisión científica explicita criterios, pruebas y límites.", hint: "Elige, justifica con evidencias y reconoce una condición o límite.", rubric: seed.decision.rubric, maxScore: 10 },
    { id: base + "08", unitId: seed.id, title: "Misión interdisciplinar", kind: "mission", area: "Interdisciplinario", prompt: seed.mission.prompt, context: seed.mission.context, modelAnswer: seed.mission.model, explanation: "Integra conocimiento científico, procedimiento matemático y comunicación.", hint: "Organiza la respuesta en problema, datos, razonamiento y propuesta.", rubric: seed.mission.rubric, maxScore: 10 },
    {
      id: base + "09",
      unitId: seed.id,
      title: "Lee, interpreta y comenta",
      kind: "text",
      area,
      prompt: "Redacta un comentario científico que responda a las tres cuestiones de lectura. Intégralas en un texto coherente: idea principal, evidencias, explicación y valoración.",
      context: scientificText.paragraphs.join("\n\n"),
      scientificText,
      modelAnswer: scientificText.modelComment,
      explanation: "Lee el texto como una fuente científica: identifica qué afirma, usa sus evidencias y valora sus límites.",
      hint: "Subraya la idea principal, elige dos evidencias y conéctalas con un concepto de la unidad antes de concluir.",
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
