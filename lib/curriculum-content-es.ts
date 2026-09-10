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
        development: "Para que una pregunta sea investigable debe indicar qué se observará, en qué condiciones y, si es posible, cómo se medirá. «¿Las plantas crecen mejor?» es demasiado general; «¿cómo varía la altura media de plantas iguales cuando cambian las horas de luz diarias?» concreta una variable y permite recopilar datos. La hipótesis no es una adivinanza ni una verdad a demostrar, sino una explicación provisional basada en conocimientos previos. De ella se deduce una predicción: si la hipótesis es adecuada y hacemos el cambio previsto, deberíamos observar un resultado determinado.",
        example: "Pregunta: ¿cómo afecta la luz al crecimiento? Hipótesis: mayor luz aumentará el crecimiento hasta un límite porque facilita la fotosíntesis.",
      },
      {
        development: "Una comparación sólo resulta útil si los grupos se diferencian en la variable que queremos estudiar. Si cambiamos a la vez luz, agua y tipos de tierra, no sabremos qué causa explica el resultado. También es necesario definir el procedimiento: instrumento, unidad, momento de medida, número de repeticiones y tamaño de la muestra. Las repeticiones no eliminan todos los errores, pero reducen el efecto de variaciones accidentales y permiten calcular una media. El grupo de control ofrece una referencia; no siempre es un grupo \"sin nada\", sino el que mantiene la situación habitual.",
        example: "Tres macetas reciben 6 h de luz y tres reciben 10 h; todos tienen la misma especie, suelo, agua, temperatura y tiempo de crecimiento.",
      },
      {
        development: "Los datos son registros: números, categorías, observaciones o imágenes obtenidas con un procedimiento. Antes de concluir, se organizan en tablas o gráficas, se calculan medidas adecuadas y se buscan patrones. Una conclusión científica debe responder a la pregunta, citar resultados concretos y explicar si son compatibles con la predicción. No es correcto afirmar que una causa está demostrada sólo porque dos fenómenos coinciden. También hay que declarar limitaciones —muestra pequeña, medida poco precisa o variable no controlada— y proponer cómo mejoraría una nueva investigación.",
        example: "«Con 10 h la media fue 6,8 cm y con 6 h, 4,1 cm; los datos apoyan la hipótesis en este intervalo, pero no indican lo óptimo.»",
      },
    ],
    scientificText: {
      title: "Cuando una coincidencia no demuestra una causa",
      lead: "Texto didáctico sobre evidencia, control de variables y límites de una investigación.",
      paragraphs: [
        "Un grupo observó que las plantas situadas junto a la ventana medían, de media, 4 cm más que las del fondo del aula. Concluyó que la luz era la causa de la diferencia. Sin embargo, las plantas de la ventana también recibían más calor, eran de una variedad distinta y las regaba otra persona. El dato muestra una asociación, pero el diseño no permite separar el efecto de cada factor.",
        "Para comprobar mejor la hipótesis, se podrían repartir aleatoriamente plantas similares en dos grupos, variar sólo las horas de luz y mantener constantes el riego, sustrato y temperatura. Medir varias plantas durante semanas daría una estimación más estable. Aun así, la conclusión debería limitarse a la especie ya las condiciones estudiadas.",
      ],
      questions: [
        "¿Cuál es la idea principal del texto y qué conclusión inicial se pone en duda?",
        "¿Qué datos y variables explican que no pueda afirmarse una relación causal?",
        "¿Cómo mejorarías el estudio y qué límite conservaría la nueva conclusión?",
      ],
      modelComment: "El texto advierte que una asociación no basta para demostrar causalidad. Las plantas de la ventana eran 4 cm más altas, pero también cambiaban la temperatura, la variedad y el riego, por lo que existen variables de confusión. Habría que formar grupos comparables, variar sólo la luz, repetir medidas y calcular medias. La nueva evidencia sería más fiable, aunque sólo permitiría hablar de la especie y las condiciones analizadas.",
    },
  },
  u02: {
    theory: [
      {
        development: "Una razón se escribe como un cociente y siempre debe conservar el significado de las magnitudes comparadas: euros por kilogramo, gramos por litro o kilómetros por hora. En una relación directamente proporcional, multiplicar una cantidad por un factor obliga a multiplicar a la otra por el mismo factor; el cociente entre ellas es constante y la gráfica pasa por su origen. La regla de tres es una forma de organizar este razonamiento, pero no debe aplicarse si existe una cuota fija, un límite o una relación que no es proporcional.",
        example: "Si 3 L contienen 18 g de sal, la concentración es 6 g/L y 5 L, con la misma mezcla, contendrán 30 g.",
      },
      {
        development: "Para interpretar un porcentaje es necesario identificar con claridad el total de referencia. Una subida de 20 a 25 no es un 5%, sino un aumento de 5 sobre 20, es decir, un 25%. Los puntos porcentuales comparan directamente dos porcentajes: pasar del 10% al 15% son 5 puntos porcentuales, pero un aumento relativo del 50%. En contextos de salud, economía o medio ambiente conviene dar también las cantidades absolutas, porque un porcentaje llamativo puede corresponder a muy pocos casos.",
        example: "Bajar de 8 casos por cada 1.000 a 4 es una reducción relativa del 50%, pero una reducción absoluta de 4 casos por cada 1.000.",
      },
      {
        development: "La notación científica permite trabajar con escalas muy distintas sin perder la posición de la coma. En multiplicaciones se multiplican los coeficientes y se suman los exponentes; en divisiones, se dividen los coeficientes y se restan. El orden de magnitud es la potencia de diez que describe aproximadamente el tamaño del número y ayuda a detectar resultados imposibles. Antes de usar la calculadora conviene realizar una estimación: si una masa es de cientos de gramos, un resultado de millones de kilogramos indica casi seguro una conversión incorrecta.",
        example: "45.000 = 4,5·10⁴ y 0,00032 = 3,2·10⁻⁴; el segundo número es del orden de las diezmilésimas.",
      },
    ],
    scientificText: {
      title: "Lo que cuenta una etiqueta de agua",
      lead: "Texto didáctico sobre concentraciones, unidades y comparaciones proporcionales.",
      paragraphs: [
        "Una etiqueta indica 42 mg de calcio por litro. Una persona afirma que beber una botella de 500 mL aporta 42 mg porque es el número impreso. Pero 500 mL son 0,5 L: si la concentración es uniforme, la cantidad de calcio de la botella es 42·0,5 = 21 mg. La unidad \"mg/L\" expresa una razón, no la cantidad total del recipiente.",
        "Otra marca contiene 68 mg/l y se vende en botellas de 330 mL. Para comparar el aporte real es necesario usar la misma cantidad de bebida o calcular los miligramos de cada envase. También se debe evitar concluir que un agua es globalmente «mejor» mirando un único mineral: la decisión depende de la dieta, las necesidades personales y el resto de la composición.",
      ],
      questions: [
        "¿Qué error comete la persona al interpretar 42 mg/l?",
        "Calcula el calcio de la botella de 330 mL de la segunda marca y compáralo con 21 mg.",
        "¿Por qué el cálculo no basta para decidir qué agua es mejor?",
      ],
      modelComment: "La etiqueta da una concentración y no el contenido de cualquier envase. En 0,5 L hay 21 mg de calcio. La segunda botella tiene 68·0,330 = 22,44 mg, una cantidad ligeramente mayor aunque el envase es menor. Esta comparación responde sólo al calcio; no permite declarar una mejor marca sin considerar el resto de minerales, la dieta y las necesidades de la persona.",
    },
  },
  u03: {
    theory: [
      {
        development: "En ciencia, las letras representan magnitudes definidas y no objetos vagos. Por eso, antes de calcular, se anota qué significa cada símbolo y en qué unidad se expresa. Una expresión como m/V no afirma nada hasta que se indica que relaciona demasiado y volumen; d=m/V ya establece una ecuación. Sustituir valores con unidades ayuda a entender la operación y evita sumar o comparar magnitudes incompatibles. Los paréntesis son esenciales cuando una magnitud completa ocupa el numerador o denominador.",
        example: "En d=m/V, m=540 g y V=200 cm³; la división mujer 2,7 g/cm³, no 2,7 g ni 2,7 cm³.",
      },
      {
        development: "Aislar una incógnita significa transformar una igualdad en otra equivalente. No se trata de «pasar» términos cambiando el signo de forma mecánica, sino de aplicar la operación inversa a ambos miembros. Si d=m/V y queremos V, multiplicamos por V: d·V=m; después dividimos por d: V=m/d. Realizar primero el aislamiento simbólico permite reutilizar la fórmula y reduce errores. Cuando existen potencias o raíces, también se aplican operaciones inversas respetando posibles restricciones del contexto.",
        example: "De v=e/t obtenemos e=v·t y t=e/v; cada forma calcula una magnitud distinta con las mismas relaciones físicas.",
      },
      {
        development: "Una calculadora puede ejecutar una operación incorrecta con total precisión. Por eso la verificación forma parte de la resolución: se sustituye el resultado en la fórmula original, se analizan las unidades y se compara el orden de magnitud con valores conocidos. También deben revisarse las condiciones del problema; una longitud negativa o una concentración superior al 100% suelen ser imposibles. Si los datos tienen precisión limitada, no está justificado presentar muchas cifras decimales como si todas fueran significativas.",
        example: "Si una pieza de 540 g ocupa 200 cm³, una densidad de 0,0027 g/cm³ es sospechosa: revela que la coma o una conversión se han aplicado mal.",
      },
    ],
    scientificText: {
      title: "Densidad y separación de residuos",
      lead: "Texto didáctico sobre fórmulas, unidades y uso de un modelo físico.",
      paragraphs: [
        "En una planta de reciclaje se utilizan baños de densidad para separar algunos plásticos. Un fragmento de 36 g ocupa 40 cm³, por lo que la densidad calculada es 0,90 g/cm³. En un líquido de densidad 1,00 g/cm³ el fragmento tiende a flotar; otro plástico de densidad 1,35 g/cm³ tiende a hundirse. El procedimiento no identifica por sí solo la composición exacta, pero ayuda a formar grupos.",
        "La predicción depende de comparar densidades en unidades compatibles y evitar bolsas de aire o impurezas que alteran el volumen efectivo. Además, objetos con forma vacía pueden flotar aunque el material sea denso. El modelo d=m/V es útil, pero la decisión industrial necesita medidas repetidas y otras pruebas de identificación.",
      ],
      questions: [
        "Explica con la fórmula por qué el primer fragmento tiende a flotar.",
        "¿Qué condiciones pueden hacer que la predicción de la densidad falle?",
        "¿Qué conclusión es legítima y cuál sería una excesiva generalización?",
      ],
      modelComment: "El fragmento tiene d=36/40=0,90 g/cm³, menor que la del líquido, por lo que tiende a flotar. La comparación exige unidades compatibles y puede alterarse por aire, impurezas o formas vacías. La densidad permite separar provisionalmente materiales con comportamientos distintos, pero no demuestra la composición química exacta. Se necesitarían repeticiones y pruebas complementarias antes de clasificar definitivamente el residuo.",
    },
  },
  u04: {
    theory: [
      {
        development: "La tabla conserva los valores exactos, el gráfico hace visible la forma del cambio y la fórmula permite calcular y generalizar dentro de un modelo. En una gráfica, la variable independiente se sitúa habitualmente en el eje horizontal y la dependiente en el eje vertical. Cada eje debe incluir magnitud, unidad y una escalera regular. Unir puntos sólo tiene sentido si la variable puede tomar valores intermedios; en categorías, las barras separadas son más adecuadas. Una escalera recortada puede exagerar diferencias y cambiar la impresión visual sin cambiar los datos.",
        example: "Temperatura (°C) frente a tiempo (min) es una gráfica continua; tipos de alimento frente a frecuencia necesita categorías, no una línea.",
      },
      {
        development: "La pendiente es una tasa de cambio: divide el cambio vertical por el cambio horizontal. Sus unidades explican qué mide, tales como grados por minuto o metros por segundo. En una recta y=mx+b, m es la pendiente y b el valor inicial cuando x=0. Una pendiente constante describe un ritmo uniforme; si la gráfica es curva, la tasa varía y podemos comparar pendientes en intervalos. Una línea horizontal no significa que no pase nada, sino que la variable representada no cambia en ese tramo.",
        example: "Pasar de 20 °C a 44 °C en 4 min mujer (44-20)/4=6 °C/min; el líquido se calienta a ritmo constante en ese intervalo.",
      },
      {
        development: "Un modelo selecciona los aspectos esenciales de un sistema e ignora otros. Puede ajustar muy bien los datos disponibles y fallar fuera del rango estudiado. Interpolar es amar entre observaciones cercanas; extrapolar es prolongar el patrón más allá y suele tener mayor incertidumbre. Además, un gráfico conjunto no establece automáticamente una causa: dos variables pueden cambiar por un tercer factor. Es necesario combinar el patrón matemático con conocimiento científico, calidad de la muestra y mecanismos plausibles.",
        example: "Que aumentan a la vez helados vendidos y quemaduras solares no significa que los helados causan quemaduras; la temperatura y la exposición solar influyen en ambas.",
      },
    ],
    scientificText: {
      title: "Una isla de calor en el patio",
      lead: "Texto didáctico sobre gráficas de temperatura, comparaciones y límites.",
      paragraphs: [
        "Durante cinco días soleados se midió la temperatura a las 13 h en tres zonas del centro. La media fue 36,2 °C sobre asfalto, 32,8 °C bajo una pérgola y 30,9 °C en el jardín. Los datos sugieren que la sombra y la vegetación se asocian a temperaturas más bajas. Sin embargo, sólo se midió una hora del día y cada zona tenía un instrumento distinto.",
        "Para estudiar el fenómeno habría que calibrar los termómetros, alternarlos entre zonas y repetir medidas por la mañana, al mediodía y por la tarde. Una gráfica tiempo-temperatura mostraría si la diferencia es constante o aparece sólo después de horas de radiación. Los datos pueden orientar una actuación, pero no predicen sin más qué ocurrirá en invierno o durante una ola de calor excepcional.",
      ],
      questions: [
        "¿Qué tendencia muestran las tres medias y qué explicación científica es plausible?",
        "Identifica dos límites del procedimiento y explica cómo los corregirías.",
        "¿Qué decisión preliminar podría tomarse sin extrapolar más de lo que permiten los datos?",
      ],
      modelComment: "El asfalto presenta la media más alta y el jardín, la más baja; la sombra, la evapotranspiración y las propiedades de los materiales pueden explicar el patrón. La comparación es limitada porque sólo se ha medido a las 13 hy se han usado instrumentos diferentes. Es necesario calibrar e intercambiar termómetros y registrar todo el día. Los datos justifican estudiar más sombra o vegetación, pero no permiten predecir cualquier estación o episodio extremo.",
    },
  },
  u05: {
    theory: [
      {
        development: "Una muestra representativa se asemeja a la población en los aspectos relevantes. Preguntar sólo a quien responde voluntariamente, a un equipo deportivo oa una única clase puede introducir sesgo de selección. El tamaño importa, pero una muestra enorme y sesgada sigue siendo poco fiable. Es necesario describir quién ha participado, cómo se ha seleccionado y cuántos datos faltan. Cuando se trabaja con salud o hábitos, se recogen sólo los datos necesarios, se usan identificadores anónimos y se evitan resultados que permiten reconocer a personas.",
        example: "Para estudiar el descanso del nivel, se selecciona al alumnado al azar de todos los grupos, no sólo quien participa en una actividad concreta.",
      },
      {
        development: "La media reparte el total de forma equilibrada, pero puede desplazarse mucho por valores extremos. La mediana divide los datos ordenados en dos mitades y describe mejor algunos conjuntos asimétricos. El rango es fácil de calcular, aunque sólo utiliza máximo y mínimo; por eso conviene observar también la forma de la distribución. Dos clases pueden tener la misma media y experiencias muy distintas. Presentar una medida central junto a dispersión y tamaño de la muestra evita resúmenes engañosos.",
        example: "En 7, 7, 8, 8 y 20, la media es 10 pero la mediana es 8; el valor 20 altera mucho la primera.",
      },
      {
        development: "La probabilidad teórica describe un modelo de resultados posibles y la frecuencia relativa resume lo que ha ocurrido en una muestra. Con muchas repeticiones, la frecuencia suele estabilizarse cerca de la probabilidad, pero no garantiza el resultado individual. En salud, “duplicar el riesgo” puede sonar enorme: pasar de 1 caso a 2 por cada 10.000 duplica el riesgo relativo, pero el aumento absoluto es de 1 caso. Para informar bien, es necesario dar denominadores, período, grupo comparador e incertidumbre.",
        example: "Un riesgo del 2% significa aproximadamente 2 casos de cada 100 en condiciones similares, no que una persona concreta tenga un 2% del problema.",
      },
    ],
    scientificText: {
      title: "Pantallas, sueño y una encuesta escolar",
      lead: "Texto didáctico sobre muestras, asociaciones y comunicación del riesgo.",
      paragraphs: [
        "Una encuesta anónima a 48 alumnos encontró que quien declaraba más de tres horas de pantalla después de cenar dormía una media de 6,7 horas; el resto declaraba 7,6 horas. El titular \"las pantallas quitan casi una hora de sueño\" simplifica demasiado el resultado. El estudio observa una asociación pero no controla deberes, actividad física, horario familiar ni la precisión del recuerdo.",
        "La muestra procede de un único centro y las horas son autodeclaradas. Sería útil ampliarla, registrar varios días y diferenciar uso académico, social y de entretenimiento. A pesar de las limitaciones, el patrón puede justificar revisar rutinas de descanso, siempre que no se presente como prueba definitiva de que cualquier pantalla causa exactamente la misma pérdida de sueño.",
      ],
      questions: [
        "¿Qué diferencia de medias aparece y por qué el titular es demasiado causal?",
        "¿Qué variables o problemas de muestra pueden influir en el resultado?",
        "Redacta una prudente conclusión y una recomendación proporcionada a la evidencia.",
      ],
      modelComment: "La diferencia observada es de 0,9 horas, pero la encuesta no demuestra que la pantalla sea la única causa. Pueden influir deberes, actividad, horarios familiares y errores de recuerdo; además sólo hay 48 alumnos de un centro. Una conclusión prudente es que el uso nocturno intenso se asocia con menos sueño en esta muestra. Pueden revisarse rutinas y ampliar el estudio antes de generalizar.",
    },
  },
  u06: {
    theory: [
      {
        development: "Perímetro, área y volumen responden a preguntas diferentes y, por tanto, utilizan unidades diferentes. Si una longitud se multiplica por 10, el área de una figura similar se multiplica por 10 ² y el volumen por 10 ³. Muchas figuras reales pueden descomponerse en rectángulos, triángulos, prismas o cilindros; después se suman o restan las partes. Un dibujo y una estimación previa ayudan a elegir la fórmula adecuada y detectar si se ha calculado el contorno cuando se pedía superficie.",
        example: "Un patio rectangular de 20 m por 12 m tiene 64 m de perímetro y 240 m² de área: los números y unidades expresan propiedades distintas.",
      },
      {
        development: "En una escala 1:n, todas las longitudes del dibujo se han reducido por el mismo factor n. Antes de aplicarlo es necesario convertir dibujo y realidad a unidades compatibles. Si el mapa es 1:25.000, 1 cm representa 25.000 cm, es decir, 250 m. En figuras similares, los ángulos correspondientes son iguales y las longitudes correspondientes mantienen la misma razón. Las áreas no se multiplican por n, sino por n², un error frecuente en planos y maquetas.",
        example: "En escala 1:200, una pared de 4,5 cm en el plano representa 900 cm = 9 m; una superficie se escalaría con 200 ².",
      },
      {
        development: "El teorema de Pitágoras sólo se aplica a triángulos rectángulos. La hipotenusa es el lado opuesto al ángulo recto y siempre es el más largo. Si conocemos los catetos, c=√(a²+b²); si falta un cateto, a=√(c²−b²). En mapas, rampas, edificios y trayectos puede calcular una distancia que no se mide directamente. Después hay que comprobar que el resultado es mayor que cada cateto y menor que la suma de ambos, condiciones geométricas básicas.",
        example: "Una rampa avanza 4 my sube 1,5 m: la longitud es √(4²+1,5²)≈4,27 m, algo mayor que el avance horizontal.",
      },
    ],
    images: [
      {
        src: "/theory/u06-escala-grafica.png",
        alt: "Ejemplo de escala gráfica con segmentos graduados.",
        caption: "La escala gráfica sigue siendo útil si el documento se amplía o se reduce proporcionalmente.",
      },
    ],
    scientificText: {
      title: "Un plano para una ruta segura",
      lead: "Texto didáctico sobre escala, distancias y decisiones frente a un riesgo.",
      paragraphs: [
        "Un plano de escalera 1:10.000 muestra dos itinerarios hasta una zona elevada. La ruta A mide 8,4 cm y atraviesa un puente estrecho; la ruta B mide 10,1 cm y evita el barranco. En esta escalera, cada centímetro representa 100 m: A tiene 840 m y B, 1.010 m. La ruta más corta no es necesariamente la más segura.",
        "La distancia es un criterio, pero también importa pendiente, anchura, estado del firme, accesibilidad y peligrosidad durante una inundación. El plano simplifica el terreno y puede no mostrar obstáculos recientes. Una decisión responsable combina el cálculo de escala con inspecciones actualizadas y las necesidades de personas con diversa movilidad.",
      ],
      questions: [
        "Explica la conversión de las dos longitudes del plan a distancias reales.",
        "¿Por qué no elegir automáticamente la ruta A?",
        "¿Qué datos adicionales pedirías antes de aprobar un itinerario de evacuación?",
      ],
      modelComment: "A escala 1:10.000, 1 cm equivale a 100 m; por eso A mide 840 m y B 1.010 m. En es 170 m más corta, pero el puente y el barranco pueden aumentar el riesgo. Es necesario considerar pendiente, anchura, firme, accesibilidad, estado actual y comportamiento del agua. El plano orienta, pero la decisión necesita una inspección y criterios de seguridad, no sólo distancia.",
    },
  },
  u07: {
    theory: [
      {
        development: "La teoría celular unifica organismos muy distintos: bacterias, plantas, hongos y animales. Todos ellos realizan funciones vitales mediante células, aunque éstas varían en forma, tamaño y especialización. Las células no aparecen espontáneamente; provienen de la división de células anteriores y transmiten información genética. Los virus no tienen estructura celular ni metabolismo propio y necesitan una célula huésped para reproducirse, por eso no encajan de la misma manera en la definición de ser vivo.",
        example: "Una bacteria es una sola célula que realiza todas las funciones; una neurona es una célula especializada dentro de un organismo pluricelular.",
      },
      {
        development: "La membrana plasmática separa el medio interno y regula selectivamente la entrada y salida de sustancias. En el citoplasma tienen lugar muchas reacciones y, en células eucariotas, los orgánulos reparten funciones. El núcleo protege a gran parte del ADN; los ribosomas fabrican proteínas; las mitocondrias participan en la obtención de energía utilizable. Las células vegetales también tienen pared celular, gran vacuola y cloroplastos en tejidos fotosintéticos. Relacionar estructura y función resulta más útil que memorizar una lista.",
        example: "Una célula muscular necesita muchas mitocondrias porque la contracción exige un aporte continuo de energía.",
      },
      {
        development: "La especialización permite que distintas células asuman tareas complementarias. Las células epiteliales forman barreras, las musculares se contraen y las nerviosas transmiten información. Un tejido reúne células y material intercelular con una función; varios tejidos forman un órgano, y los órganos coordinados forman aparatos o sistemas. El funcionamiento del cuerpo depende de la cooperación entre niveles: una alteración celular puede afectar a un tejido, un órgano y finalmente a todo el organismo.",
        example: "Células musculares → tejido muscular → corazón → aparato circulatorio → organismo.",
      },
    ],
    scientificText: {
      title: "¿Por qué una célula muscular tiene tantas mitocondrias?",
      lead: "Texto didáctico sobre especialización celular y relación entre estructura y función.",
      paragraphs: [
        "Al observar tejido muscular y tejido adiposo con técnicas de laboratorio, se encuentran diferencias en la cantidad y distribución de orgánulos. Las fibras musculares que trabajan de manera sostenida suelen presentar numerosas mitocondrias. Estos orgánulos participan en la respiración celular, proceso que transforma la energía química de los nutrientes en formas utilizables para la contracción.",
        "Esto no significa que la mitocondria «fabrique energía de la nada» ni que todas las células musculares sean idénticas. El número de orgánulos depende de la función, del tipo de fibra y de la actividad. La comparación ilustra una idea general: la estructura de una célula está relacionada con la labor que realiza dentro del tejido.",
      ],
      questions: [
        "¿Qué relación establece el texto entre mitocondrias y función muscular?",
        "Corrige la expresión «las mitocondrias crean energía».",
        "¿Qué límite impide afirmar que todas las células musculares tienen la misma estructura?",
      ],
      modelComment: "Las fibras de trabajo sostenido suelen tener más mitocondrias porque necesitan transformar continuamente la energía química de los nutrientes para la contracción. No crean energía: intervienen en transformaciones energéticas de la respiración celular. El texto también señala variabilidad entre tipos de fibra y según la actividad, por lo que la relación estructura-función es general pero no convierte todas las células musculares en copias idénticas.",
    },
  },
  u08: {
    theory: [
      {
        development: "Los nutrientes cumplen funciones energéticas, plásticas y reguladoras, y muchos de ellos participan en más de una. Los glúcidos son una fuente habitual de energía; los lípidos también forman membranas y reservas; las proteínas aportan aminoácidos para construir y reparar estructuras. Vitaminas y minerales son necesarios en pequeñas cantidades, pero no aportan energía. El agua es el medio de muchas reacciones y la fibra favorece el funcionamiento intestinal. Una dieta equilibrada se valora por el patrón global, la variedad y la frecuencia, no por alimentos «milagro».",
        example: "El aceite aporta lípidos, las legumbres combinan glúcidos, proteínas y fibra, y una fruta aporta agua, fibra, vitaminas y azúcares naturales.",
      },
      {
        development: "La digestión mecánica fragmenta y mezcla; la digestión química, mediante enzimas, transforma moléculas grandes en unidades absorbibles. Empieza en la boca, continúa en el estómago y se completa principalmente en el intestino delgado con secreciones digestivas. Las vellosidades intestinales aumentan mucho la superficie de absorción y permiten que nutrientes pasan a la sangre oa la linfa. El intestino grueso recupera agua y sales y aloja microbiota. El aparato digestivo trabaja coordinado con circulatorio, respiratorio y excretor para abastecer a las células y mantener el equilibrio interno.",
        example: "El almidón se rompe en azúcares más simples; después de la absorción, la sangre los transporta hasta las células.",
      },
      {
        development: "La tabla nutricional normaliza datos por 100 g o 100 mL y facilita comparar productos, mientras que la ración informa del consumo real si su tamaño es realista. La lista de ingredientes se ordena de mayor a menor cantidad y puede revelar azúcares, grasas o sal con distintos nombres. Expresiones publicitarias como \"natural\" o \"fuente de\" no sustituyen a la composición completa. También importan el grado de procesamiento, la frecuencia de consumo, las alergias, el coste y el contexto de la dieta.",
        example: "Un producto con 12 g de azúcar por 100 g aporta 30 g si se consumen 250 g, aunque la etiqueta destaque una ración menor.",
      },
    ],
    scientificText: {
      title: "La ración pequeña que cambia la etiqueta",
      lead: "Texto didáctico sobre información nutricional, proporcionalidad y publicidad.",
      paragraphs: [
        "Un cereal anuncia «sólo 6 g de azúcar por ración». La ración definida por la marca es de 30 g, pero un cuenco habitual medido en clase contiene 55 g. La etiqueta indica 20 g de azúcar por 100 g: una ración de 30 g aporta 6, mientras que 55 g aportan 11. La frase publicitaria es matemáticamente correcta, pero puede no describir el consumo real.",
        "Comparar cereales exige usar la misma base, revisar fibra, sal, grasas y lista de ingredientes, considerando con qué frecuencia se consumen. Tampoco puede clasificarse un alimento como saludable o perjudicial a partir de un único nutriente. La decisión debe encajar en el conjunto de la dieta y en las necesidades de cada persona.",
      ],
      questions: [
        "¿Cómo se calculan los 11 g de azúcar del cuenco habitual?",
        "¿Por qué la frase publicitaria puede ser cierta y al mismo tiempo poco informativa?",
        "¿Qué criterios añadirías para realizar una comparación responsable?",
      ],
      modelComment: "Si hay 20 g por 100 g, en 55 g hay 20·55/100=11 g. Los 6 g anunciados corresponden a una ración de 30 g elegida por la marca, menor que el cuenco observado, por lo que pueden dar una impresión incompleta. Es necesario comparar por 100 g y revisar fibra, sal, grasas, ingredientes, frecuencia y dieta global. Un solo nutriente no determina todo el valor de un alimento.",
    },
  },
  u09: {
    theory: [
      {
        development: "La ventilación mueve aire hasta los alvéolos; el intercambio gaseoso hace que O₂ y CO₂ atraviesen membranas por difusión; la respiración celular es el conjunto de reacciones con las que las células obtienen energía utilizable. Son procesos relacionados pero no sinónimos. Los alvéolos tienen pared muy fina, gran superficie y una red de capilares que mantiene diferencias de concentración. Si disminuye la superficie o aumenta el grosor de la barrera, el intercambio se hace menos eficiente.",
        example: "El oxígeno pasa del aire alveolar a la sangre y se une mayoritariamente a la hemoglobina de los glóbulos rojos.",
      },
      {
        development: "El corazón funciona como dos bombas coordinadas. La circulación pulmonar envía sangre a los pulmones para intercambiar gases; la circulación general reparte oxígeno y nutrientes y recoge productos de desecho. Arterias y venas se definen por la dirección respecto al corazón, no por la cantidad de oxígeno: la arteria pulmonar lleva sangre pobre en oxígeno y las venas pulmonares, rica. En los capilares, la pared fina permite intercambios entre sangre y tejidos.",
        example: "Ventrículo derecho → arteria pulmonar → capilares pulmonares → venas pulmonares → aurícula izquierda.",
      },
      {
        development: "Los riñones no son simples filtros que dejan pasar residuos: filtran una parte del plasma y después reabsorben selectivamente agua y sustancias útiles, mientras secretan otros compuestos. Así regulan volumen de agua, sales y pH, además de eliminar urea. Los pulmones eliminan CO₂ y vapor de agua; la piel participa en termoregulación, y el hígado transforma sustancias. La excreción mantiene la homeostasis y no debe confundirse con la expulsión de restos no digeridos en la defecación.",
        example: "Beber más agua puede producir una orina más diluida, porque el cuerpo ajusta la reabsorción según las necesidades.",
      },
    ],
    scientificText: {
      title: "Respirar a mayor altitud",
      lead: "Texto didáctico sobre intercambio gaseoso, transporte y adaptación del cuerpo.",
      paragraphs: [
        "A gran altitud, el porcentaje de oxígeno del aire sigue cerca del 21%, pero la presión atmosférica es menor. Esto reduce la presión parcial de oxígeno y dificulta su paso hacia la sangre. Al principio aumentan la frecuencia respiratoria y cardíaca, y una persona puede cansarse antes durante el ejercicio.",
        "Con días o semanas pueden aparecer ajustes como cambios en la producción de glóbulos rojos. Estas respuestas no convierten de inmediato a cualquier persona en deportista de alto rendimiento y dependen de la altitud, el tiempo y la salud. Ante síntomas intensos, seguir ascendiendo puede arriesgarse: la aclimatación es un proceso fisiológico, no una garantía absoluta.",
      ],
      questions: [
        "¿Por qué existe menos disponibilidad de oxígeno si el porcentaje del aire es similar?",
        "Relaciona dos respuestas del cuerpo con la necesidad de llevar oxígeno a los tejidos.",
        "¿Qué decisión de salud sugiere el texto y con qué limitación?",
      ],
      modelComment: "A la altitud baja la presión atmosférica y, por tanto, la presión parcial de oxígeno, reduciendo el gradiente de entrada a la sangre. Aumentar ventilación y frecuencia cardíaca ayuda a captar y transportar más oxígeno; a más largo plazo pueden cambiar los glóbulos rojos. La aclimatación varía entre personas y no elimina todo el riesgo, por lo que debe detenerse el ascenso si aparecen síntomas importantes.",
    },
  },
  u10: {
    theory: [
      {
        development: "Los receptores detectan cambios internos o externos y los transforman en señales. Las neuronas transmiten información mediante impulsos eléctricos a lo largo de la membrana y señales químicas en muchas sinapsis. El sistema nervioso central —encéfalo y médula espinal— integra información; el periférico conecta receptores y efectores con el centro. En un acto voluntario existe percepción y decisión consciente. En un arco reflejo, la médula puede coordinar una respuesta rápida antes de que la información llegue a las áreas cerebrales de percepción.",
        example: "Al retirar la mano de una superficie muy caliente intervienen receptor, neurona sensitiva, médula, neurona motora y músculo efector.",
      },
      {
        development: "El sistema endocrino coordina procesos mediante hormonas liberadas por glándulas en sangre. Sólo responden a las células que tienen receptores adecuados. La hipófisis, tiroides, páncreas, suprarrenales, ovarios y testículos producen hormonas con funciones diversas, pero trabajan en redes reguladas. La retroalimentación negativa mantiene muchas variables cerca de un intervalo: cuando el resultado aumenta disminuye el estímulo que lo producía. Una alteración puede deberse a exceso o déficit hormonal, fallo de la glándula o respuesta inadecuada de los tejidos.",
        example: "Después de una comida, la insulina ayuda a reducir la glucosa sanguínea; cuando baja, disminuye también el estímulo para secretarlos.",
      },
      {
        development: "Una adicción implica cambios en motivación, recompensa y control de la conducta; no es simplemente falta de voluntad. La tolerancia hace necesaria una dosis mayor para obtener efectos similares y la dependencia puede producir malestar cuando se interrumpe el consumo. Alcohol, nicotina y otras drogas afectan a un cerebro adolescente todavía en desarrollo y pueden alterar coordinación, memoria y decisión. También existen conductas problemáticas sin sustancia. La prevención combina información fiable, habilidades para resistir presiones, entornos protectores y acceso a ayuda sanitaria sin estigma.",
        example: "Pedir ayuda a una persona adulta o profesional frente a pérdida de control es una respuesta de salud, no un fracaso personal.",
      },
    ],
    images: [
      {
        src: "/theory/u10-sistema-nervios.jpg",
        alt: "Esquema del sistema nervioso central y periférico.",
        caption: "El sistema nervioso central integra información y el periférico conecta receptores, músculos y glándulas.",
      },
      {
        src: "/theory/u10-acte-reflex.jpg",
        alt: "Comparación esquemática de un acto reflejo y acto voluntario.",
        caption: "El arco reflejo da una respuesta rápida; la percepción consciente llega después al encéfalo.",
      },
    ],
    scientificText: {
      title: "Pantallas, recompensa y titulares demasiado simples",
      lead: "Texto didáctico sobre sistema nervioso, conducta e interpretación prudente de evidencias.",
      paragraphs: [
        "Algunas aplicaciones presentan notificaciones y recompensas variables que pueden mantener su atención. Un estudio observa que adolescentes con uso nocturno más prolongado informan de mayor cansancio y dificultad para desconectar. Esto es compatible con mecanismos de recompensa y con la interrupción del sueño, pero no prueba que todas las personas desarrollen una adicción.",
        "El término adicción exige valorar pérdida de control, interferencia con la vida diaria y persistencia a pesar de sus consecuencias, no sólo contar horas. La asociación también puede estar influida por estrés, estado de ánimo o rutinas familiares. Una intervención razonable puede reducir notificaciones nocturnas y observar el descanso, evitando diagnósticos improvisados ​​y buscando ayuda si existe sufrimiento o deterioro.",
      ],
      questions: [
        "¿Qué diferencia establece el texto entre uso intenso y adicción?",
        "¿Qué evidencias y variables obligan a ser prudentes con la causa?",
        "Propone una decisión proporcionada e indica cuándo sería necesaria ayuda profesional.",
      ],
      modelComment: "Su uso prolongado puede asociarse con cansancio y dificultad para desconectar, pero la adicción requiere pérdida de control e interferencia persistente, no sólo muchas horas. El estudio es compatible con recompensa y alteración del sueño, aunque estrés, estado de ánimo y familia también pueden influir. Se pueden limitar notificaciones y uso nocturno y revisar si mejora el descanso; si hay sufrimiento o deterioro, es necesaria ayuda profesional.",
    },
  },
  u11: {
    theory: [
      {
        development: "La piel y las mucosas dificultan la entrada de patógenos con barreras físicas, sustancias antimicrobianas, cilios y microbiota. Si se superan, la respuesta innata actúa rápidamente: inflamación, fagocitosis y otros mecanismos reconocen señales generales de peligro. La respuesta adaptativa es más específica; linfocitos reconocen antígenos, coordinan defensas y pueden formar células de memoria. Los síntomas no siempre son causados ​​directamente por el microorganismo: parte de la fiebre, dolor o inflamación proviene de la respuesta defensiva.",
        example: "Una herida enrojecida muestra aumento del flujo sanguíneo y actividad inflamatoria; esto no identifica por sí solo el patógeno.",
      },
      {
        development: "Una vacuna presenta en el sistema inmunitario un antígeno, o instrucciones seguras para producirlo, sin causar la enfermedad grave que se quiere prevenir. La respuesta genera anticuerpos y células de memoria; algunas vacunas necesitan varias dosis o recordatorios. Ninguna intervención es absoluta, pero reducir la probabilidad de infección o complicaciones en muchas personas disminuye también oportunidades de transmisión. La eficacia se calcula comparando grupos y debe interpretarse junto con riesgo inicial, duración de la protección y posibles efectos adversos.",
        example: "Si en grupos comparables hay 20 casos sin vacuna y 5 con vacuna, el riesgo observado es menor, pero es necesario conocer el tamaño de cada grupo.",
      },
      {
        development: "Los antibióticos atacan estructuras o procesos bacterianos; no funcionan contra virus como los del resfriado común. En una población bacteriana puede haber variantes resistentes. El antibiótico elimina sobre todo las sensibles y deja más oportunidades a las resistentes para reproducirse: es selección natural, no una decisión consciente de la bacteria. El uso innecesario o inadecuado aumenta esa presión. La pauta concreta debe determinarla personal sanitario; no deben compartirse restos ni automedicarse.",
        example: "Tomar un antibiótico por una infección viral no acelera la curación y puede seleccionar bacterias resistentes presentes en el cuerpo.",
      },
    ],
    scientificText: {
      title: "Cómo se hace visible la resistencia a los antibióticos",
      lead: "Texto didáctico sobre selección natural, datos de salud y uso responsable.",
      paragraphs: [
        "Un hospital compara muestras de una misma bacteria durante cinco años. La proporción resistente a un antibiótico pasa del 8% al 23%. El aumento no significa que cada bacteria haya aprendido a defenderse después de tomar el fármaco. Las variantes resistentes ya existían o aparecieron por cambios genéticos, y el uso del antibiótico favoreció la supervivencia y reproducción de estas variantes.",
        "El dato es preocupante, pero es necesario conocer el número de muestras, los criterios de selección y si han cambiado los protocolos de laboratorio. La respuesta no es abandonar antibióticos cuando son necesarios, sino utilizarlos con diagnóstico y pauta profesional, prevenir infecciones y vigilar la evolución de las resistencias.",
      ],
      questions: [
        "Explica el aumento del 8% al 23% mediante selección natural.",
        "¿Qué información falta por valorar la solidez de la comparación?",
        "¿Qué decisión responsable propone el texto y qué decisión rechaza?",
      ],
      modelComment: "El antibiótico selecciona variantes resistentes: las sensibles mueren con mayor frecuencia y las resistentes dejan más descendencia, de modo que su proporción puede pasar del 8% al 23%. Para interpretar la tendencia es necesario saber tamaño y selección de muestras y si el método ha cambiado. No deben abandonarse tratamientos necesarios; es necesario prescribirlos bien, seguir la pauta, prevenir infecciones y vigilar resistencias.",
    },
  },
  u12: {
    theory: [
      {
        development: "Los ovarios producen óvulos y hormonas; los testículos producen espermatozoides y hormonas. La fecundación suele ocurrir en una trompa uterina cuando se fusiona material genético de los dos gametos y se forma el cigoto. Tras divisiones sucesivas, el embrión llega al útero y se implanta en el endometrio. Durante el embarazo, la placenta permite intercambios de gases, nutrientes y residuos entre sangre materna y fetal sin que ambas sangres se mezclen directamente. Embrión y feto describen etapas distintas del desarrollo.",
        example: "Fecundación → divisiones del cigoto → desplazamiento hasta el útero → implantación → desarrollo embrionario y fetal → parto.",
      },
      {
        development: "La salud sexual es el bienestar físico, emocional y social relacionado con la sexualidad. Cualquier relación requiere el consentimiento libre, informado, específico y reversible; El silencio, la presión o la incapacidad de decidir no es consentimiento. La información debe incluir cambios corporales, diversidad, prevención, emociones y recursos de salud. Respetar la privacidad es importante, pero ante la violencia, la coacción o el riesgo, se debe buscar ayuda de un adulto o profesional. Las decisiones responsables se basan en la comunicación y el cuidado mutuo, no en estereotipos.",
        example: "Una persona puede cambiar de opinión en cualquier momento; respetar ese límite es parte del consentimiento.",
      },
      {
        development: "Los métodos de barrera impiden el contacto entre gametos; las hormonas modifican la ovulación y el moco cervical; Los dispositivos intrauterinos dificultan la fecundación y, según el tipo, también actúan hormonalmente. La eficacia de uso teórica y real puede diferir debido a olvidos o uso incorrecto. El condón externo o interno reduce el riesgo de muchas infecciones de transmisión sexual, mientras que otros anticonceptivos no lo hacen. La doble protección combina un preservativo con un método anticonceptivo eficaz. El asesoramiento sanitario permite adaptar opciones y resolver incidencias.",
        example: "Una pastilla puede prevenir el embarazo si se usa correctamente, pero no protege contra las ITS; el condón proporciona esa barrera.",
      },
    ],
    images: [
      {
        src: "/theory/u12-fecundacio.jpg",
        alt: "Diagrama de las etapas de fertilización y formación del cigoto.",
        caption: "La fertilización forma el cigoto; La implantación es un proceso posterior que ocurre en el útero.",
      },
      {
        src: "/theory/u12-aparell-femeni.jpg",
        alt: "Esquema general del aparato reproductor femenino.",
        caption: "Los órganos reproductores tienen diferentes funciones en la producción de gametos, la fertilización y la gestación.",
      },
    ],
    scientificText: {
      title: "Tres afirmaciones sobre anticoncepción e ITS",
      lead: "Texto didáctico sobre salud sexual, evidencia y toma de decisiones.",
      paragraphs: [
        "En una red social aparecen tres mensajes: \"la pastilla protege contra las ITS\", \"dos condones brindan doble protección\" y \"si no hay síntomas, no hay infección\". Ninguno de los tres es correcto. Los anticonceptivos hormonales no forman una barrera contra los microorganismos; usar dos condones al mismo tiempo puede aumentar la fricción y el riesgo de rotura; y muchas ITS pueden ser asintomáticas.",
        "La prevención combina el uso correcto de un solo preservativo, la realización de pruebas cuando esté indicado, la vacunación disponible, la comunicación y la consulta de salud. Ante un incidente la respuesta depende del momento y del tipo de riesgo, por lo que es recomendable acudir a un servicio de salud. La información fiable no sustituye al consentimiento ni permite juzgar a las personas por su estado de salud.",
      ],
      questions: [
        "Corrija científicamente las tres afirmaciones del primer párrafo.",
        "¿Qué medidas de prevención propone el texto y por qué son complementarias?",
        "¿Comunicarías esta información sin estigma y respetando el consentimiento?",
      ],
      modelComment: "La píldora previene embarazos pero no ITS; dos preservativos pueden frotarse y romperse, y la ausencia de síntomas no descarta una infección. La prevención combina un preservativo bien utilizado, vacunación, pruebas y asesoramiento según riesgo. Es necesario comunicarlo sin culpabilizar, respetar privacidad y consentimiento y recomendar servicios sanitarios ante una incidencia, porque el tiempo puede influir en las opciones disponibles.",
    },
  },
  u13: {
    theory: [
      {
        development: "La meteorización modifica la roca en el mismo sitio por cambios físicos, reacciones químicas o actividad biológica. La erosión arranca materiales, el transporte los desplaza y la sedimentación los deposita cuando el agente pierde energía. Un río puede erosionar en tramos de pendiente fuerte y sedimentar en zonas lentas; el viento transporta partículas finas y el hielo fragmenta y arrastra. Son procesos lentos a nivel humano, pero episodios intensos pueden producir cambios rápidos. La vegetación y usos del suelo modifican la velocidad de erosión.",
        example: "Tras un incendio, la falta de cubierta vegetal puede aumentar el arrastre de suelo durante lluvias torrenciales.",
      },
      {
        development: "La litosfera está fragmentada en placas que se mueven unos centímetros al año sobre materiales más deformables. En los límites divergentes se crea nueva litosfera; en los convergentes puede haber subducción o colisión, y en los transformantes las placas se deslizan lateralmente. La acumulación y liberación repentina de esfuerzo origina muchos terremotos. El vulcanismo se concentra en ciertos límites y puntos calientes. La distribución mundial de seísmos y volcanes constituye una evidencia del modelo, aunque no permite predecir la fecha exacta de un seísmo.",
        example: "Una alineación de terremotos y volcanes al margen de un océano puede indicar una zona de subducción.",
      },
      {
        development: "La peligrosidad describe la probabilidad e intensidad de un fenómeno; la exposición indica personas y bienes situados en la zona, y la vulnerabilidad, lo fácilmente que pueden sufrir daño. Por eso un fenómeno similar tiene consecuencias distintas según construcción, planificación y capacidad de respuesta. Los mapas de riesgo combinan datos históricos, relieve y modelos, pero tienen incertidumbre. Reducir riesgo implica evitar construir en zonas peligrosas, aplicar normas, preparar alertas y planes de evacuación y proteger especialmente a las personas vulnerables.",
        example: "Una inundación intensa en una llanura deshabitada puede tener alta peligrosidad y bajo riesgo humano; si se urbaniza, aumenta la exposición.",
      },
    ],
    scientificText: {
      title: "Lluvia intensa no significa el mismo riesgo en todas partes",
      lead: "Texto didáctico sobre peligrosidad, exposición, vulnerabilidad y prevención.",
      paragraphs: [
        "Dos localidades reciben 180 mm de lluvia en pocas horas. En la primera, el río conserva una llanura de inundación sin viviendas y hay avisos tempranos. En la segunda parte de la cama se ha ocupado, muchas superficies están asfaltadas y algunos sótanos no tienen salida segura. La peligrosidad meteorológica es similar, pero el riesgo para personas y bienes es mayor a la segunda.",
        "La diferencia se explica por exposición y vulnerabilidad, así como porque la impermeabilización acelera la escorrentía. Una obra puntual puede reducir algunos daños pero trasladar el problema aguas abajo. La gestión necesita mapas actualizados, mantenimiento, ordenación del territorio, alerta y educación, asumiendo que ninguna medida elimina toda la incertidumbre.",
      ],
      questions: [
        "Distingue peligrosidad, exposición y vulnerabilidad en ambas localidades.",
        "¿Cómo influye el asfalto en la escorrentía y por qué una obra puede trasladar el riesgo?",
        "Prioriza dos medidas preventivas y justifícalas.",
      ],
      modelComment: "La intensa lluvia representa una peligrosidad similar, pero la segunda localidad expone más personas y bienes y tiene sótanos vulnerables. El asfalto reduce infiltración y acelera el agua superficial; canalizarla sin visión de cuenca puede aumentar caudales aguas abajo. Priorizaría evitar nuevas ocupaciones de zonas inundables y establecer alerta y evacuación, complementadas con superficies permeables y mapas revisados.",
    },
  },
  u14: {
    theory: [
      {
        development: "Un ecosistema incluye organismos, medio físico y todas las interacciones entre sí. El hábitat es el lugar en el que vive una especie; el nicho incluye recursos, condiciones y papel ecológico. Las poblaciones están limitadas por alimento, espacio, depredadores, enfermedades y factores climáticos. Una red de interacciones es más realista que una cadena lineal: si disminuye una especie, el efecto puede propagarse por varias rutas. Las especies clave tienen una influencia desproporcionada, pero ningún organismo está completamente aislado.",
        example: "Si desciende un depredador, pueden aumentar algunos herbívoros y reducirse la vegetación, con efectos sobre otras especies.",
      },
      {
        development: "Los productores transforman energía luminosa en energía química; los consumidores lo obtienen alimentándose y los descomponedores aprovechan materia orgánica muerta. En cada transferencia, parte de la energía se disipa como calor y queda menos disponible para el siguiente nivel, por lo que la energía fluye y no se recicla. Sin embargo, los átomos de agua, carbono o nitrógeno circulan entre atmósfera, suelo, agua y seres vivos. Alterar un ciclo puede afectar a clima, fertilidad y biodiversidad.",
        example: "Una pirámide trófica suele tener mucha más energía en productores que en depredadores superiores.",
      },
      {
        development: "La sostenibilidad no consiste sólo en reciclar. Primero conviene evitar consumo innecesario, alargar la vida útil, reparar y reutilizar; después se recuperan materiales cuando es viable. Un análisis de ciclo de vida considera extracción, fabricación, transporte, uso y fin del producto. También incorpora salud, trabajo, coste y reparto de los impactos. Una opción puede reducir emisiones y aumentar uso de agua o materiales, por eso las decisiones necesitan indicadores diversos y una justificación explícita de prioridades.",
        example: "Una botella reutilizable necesita materiales para fabricarse, pero puede reducir residuos si se usa bastantes veces y se lava eficientemente.",
      },
    ],
    scientificText: {
      title: "Restaurar una zona húmeda es más que plantar árboles",
      lead: "Texto didáctico sobre redes ecológicas, indicadores y restauración.",
      paragraphs: [
        "Una zona húmeda degradada presenta menos vegetación acuática, agua más turbia y disminución de anfibios. Plantar árboles cerca puede aportar sombra y refugio, pero no resuelve por sí sola la entrada de fertilizantes ni la modificación del caudal. Si siguen llegando exceso de nutrientes, pueden proliferar algas y reducirse el oxígeno disuelto.",
        "Un plan de restauración debería reducir las fuentes de contaminación, recuperar franjas de vegetación, mantener un régimen de agua adecuado y seguir indicadores como transparencia, nutrientes, oxígeno y diversidad. El número de árboles plantados mide una acción, no necesariamente la recuperación del ecosistema. Los resultados pueden tardar y deben compararse con una situación inicial.",
      ],
      questions: [
        "¿Qué cadena de causas relaciona fertilizantes, algas y oxígeno?",
        "¿Por qué contar árboles no basta para medir la recuperación?",
        "Elige tres indicadores y explica qué aportaría cada uno al seguimiento.",
      ],
      modelComment: "El exceso de nutrientes favorece algas; su proliferación y descomposición pueden consumir oxígeno y perjudicar a organismos. Plantar árboles es una actuación pero no demuestra que mejoran agua y biodiversidad. Seguiría nutrientes para controlar la causa, oxígeno y transparencia para valorar la calidad del agua y diversidad de anfibios o macroinvertebrados para observar la respuesta biológica, comparando siempre con la línea base.",
    },
  },
  u15: {
    theory: [
      {
        development: "Demasiado es cantidad de materia y volumen es espacio ocupado; ambas son propiedades extensivas para que cambien con la cantidad de muestra. La densidad es el cociente de = m/V y, en determinadas condiciones, ayuda a caracterizar una sustancia. Medirla exige unidades compatibles y volumen fiable: en sólidos irregulares puede usarse desplazamiento de agua si el material no se disuelve ni reacciona. La flotación depende de la densidad media del objeto y del fluido, pero también de cavidades y del empuje.",
        example: "Una bola maciza y un barco de acero tienen el mismo material, pero el barco incluye aire y tiene una menor densidad media.",
      },
      {
        development: "En un sólido, las partículas vibran en torno a posiciones próximas; en un líquido siguen juntas pero pueden desplazarse; en un gas están muy separadas y ocupan todo el recipiente. El modelo explica compresibilidad, difusión y cambios de estado sin imaginar que las partículas «se hinchan» o cambian de sustancia. Al fundir, evaporar o condensar, varía la organización y la energía del movimiento, no el tipo de partícula. La temperatura está relacionada con la energía cinética media, no con el tamaño de cada partícula.",
        example: "El olor se extiende por una habitación porque las partículas gaseosas se mueven y se mezclan, no porque el aire las atraiga.",
      },
      {
        development: "La presión de un gas es el efecto de los choques continuos de las partículas contra las paredes. Si el volumen disminuye a temperatura constante, existen más choques por unidad de área y la presión aumenta. Si se calienta un gas en un recipiente rígido, las partículas se mueven más rápido y los choques son más intensos. Este modelo cualitativo ayuda a predecir comportamientos, pero las leyes simples suponen cantidad de gas constante y condiciones controladas. Un recipiente cerrado calentado puede ser peligroso.",
        example: "Al pulsar lentamente una jeringa tapada, el mismo aire ocupa menos volumen y ofrece mayor resistencia por el aumento de presión.",
      },
    ],
    scientificText: {
      title: "Partículas invisibles y calidad del aire",
      lead: "Texto didáctico sobre materia, concentración e interpretación de medidas ambientales.",
      paragraphs: [
        "Un sensor registra 18 µg/m³ de partículas finas por la mañana y 47 µg/m³ durante la entrada de vehículos. La unidad expresa demasiado de partículas por volumen de aire. El aumento es coherente con una fuente cercana, pero una única jornada no prueba que todo el material proceda de los coches: viento, obras o calefacción también pueden influir.",
        "Para identificar patrones debería medirse muchos días, comparar puntos, registrar meteorología y revisar el sensor. Ventilar puede reducir contaminantes generados dentro de un aula, pero si el aire exterior está muy contaminado el momento de ventilación importa. La decisión combina medidas locales, fuentes probables y protección de la salud.",
      ],
      questions: [
        "Interpreta qué significa 47 µg/m³ y compáralo con 18 µg/m³.",
        "¿Por qué el dato de un día no identifica una única causa?",
        "Propone un plan de medida y decisión provisional para el centro.",
      ],
      modelComment: "47 µg/m³ significa 47 microgramos de partículas en cada metro cúbico de aire y es 29 µg/m³ superior a la mañana. El cambio coincide con vehículos, pero también puede influir viento, obras, calefacción o error del sensor. Mediría varios días dentro y fuera, en distintas horas, con datos meteorológicos. Provisionalmente reduciría vehículos junto a la entrada y ventilaria en momentos con menor concentración.",
    },
  },
  u16: {
    theory: [
      {
        development: "El número atómico Z identifica el elemento porque indica el número de protones del kernel. En un átomo neutro coincide con el número de electrones; si gana o pierde electrones se forma un ion, pero el elemento no cambia. El número másico A suma protones y neutrones. Los isótopos de un elemento tienen el mismo Z y distinto número de neutrones; comparten gran parte del comportamiento químico, aunque difieren en masa y estabilidad nuclear. Un modelo atómico es una representación basada en evidencias, no una fotografía literal.",
        example: "Carbono-12 y carbono-14 tienen 6 protones; el primero tiene 6 neutrones y el segundo, 8.",
      },
      {
        development: "La tabla periódica ordena elementos por creciente número atómico. Las filas son períodos y reflejan niveles electrónicos; las columnas o grupos reúnen elementos con propiedades químicas similares. A grandes rasgos, los metales ocupan izquierda y centro, y los no metales, la zona superior derecha, pero existen transiciones graduales. El símbolo es internacional y sensible a mayúsculas: Co es cobalto y CO representa una fórmula con carbono y oxígeno. La posición ayuda a predecir comportamientos, no a memorizarlos sin explicación.",
        example: "Na y K son del mismo grupo y comparten tendencias, pero no son la misma substancia ni reaccionan con exacta intensidad.",
      },
      {
        development: "Una fórmula química describe proporciones de átomos o iones. El subíndice afecta al elemento inmediatamente anterior; un coeficiente multiplica toda la fórmula. Así, 2H₂O representa dos unidades de agua con cuatro H y dos O en total. Cambiar subíndices cambia la sustancia: H₂O y H₂O₂ tienen propiedades muy distintas. En una ecuación química se conservan los átomos, por eso se ajustan coeficientes y no se alteran fórmulas para forzar la igualdad.",
        example: "3CO₂ contiene 3 átomos de carbono y 6 de oxígeno; el 3 inicial multiplica todos los subíndices implícitos o escritos.",
      },
    ],
    scientificText: {
      title: "Sin química: una expresión imposible",
      lead: "Texto didáctico sobre sustancias, fórmulas y lectura crítica de publicidad.",
      paragraphs: [
        "Un producto de limpieza se anuncia como «100% natural y sin química». Sin embargo, el agua es H₂O, el oxígeno del aire es O₂ y los aromas naturales también están formados por sustancias químicas. \"Natural\" informa sobre un origen o proceso según el contexto, pero no garantiza inocuidad; \"sintético\" tampoco significa automáticamente peligroso.",
        "El riesgo depende de la substancia, la dosis, la vía de exposición y el tiempo. Para valorar el producto es necesario leer composición, instrucciones, pictogramas y medidas de seguridad. La fórmula aporta información sobre elementos y proporciones, pero no es suficiente para deducir todas las propiedades sin conocer estructura y condiciones.",
      ],
      questions: [
        "¿Por qué \"sin química\" es científicamente incorrecto?",
        "¿Qué diferencia existe entre origen natural y nivel de riesgo?",
        "¿Qué evidencias consultarías para decidir un uso seguro del producto?",
      ],
      modelComment: "Todo material está formado por sustancias químicas, incluidos H₂O y O₂, por lo que «sin química» es imposible. Natural describe un origen y no asegura seguridad; el riesgo depende de sustancia, dosis, vía y exposición. Para decidir, revisar composición, etiqueta, pictogramas e instrucciones y usar la cantidad indicada con ventilación o protección si corresponde. Una fórmula sola no describe todas las propiedades.",
    },
  },
  u17: {
    theory: [
      {
        development: "La energía mide la capacidad de un sistema para producir cambios y se expresa en julios, aunque en electricidad doméstica se utilice también el kWh. Puede transferirse por trabajo, calor o radiación y transformarse entre formas cinética, potencial, química, térmica o eléctrica. En un sistema aislado se conserva la cantidad total, pero en cada transformación parte queda dispersa como energía térmica menos aprovechable: es degradación. El calor fluye espontáneamente de mayor a menor temperatura por conducción, convección o radiación.",
        example: "En una tostadora, energía eléctrica se transforma sobre todo en térmica; la energía total se conserva, pero no toda es útil para tostar.",
      },
      {
        development: "Para que haya corriente continua es necesaria una diferencia de potencial y un camino conductor cerrado. La intensidad mide carga por tiempo, la tensión es energía transferida por carga y la resistencia describe oposición a la corriente. En componentes óhmicos, V=I·R. En serie circula la misma intensidad y las tensiones se reparten; en paralelo las ramas comparten tensión y funcionan de forma más independiente. Fusibles, magnetotérmicos, diferenciales y toma de tierra reducen riesgos, pero no sustituyen a un uso correcto.",
        example: "Con 6 V y 3 Ω, I=V/R=2 A; aumentar la resistencia con la misma tensión reduce la intensidad.",
      },
      {
        development: "La potencia indica la rapidez de transferencia de energía: P=E/t y, en muchos dispositivos eléctricos, P=V·I. Un vatio es un joule por segundo. El consumo depende de potencia y tiempo: E=P·t; para la factura, potencia en kW por horas mujer kWh. El efecto Joule transforma energía eléctrica en térmica y resulta útil en calefactores, pero representa pérdidas en cables. Reducir consumo exige priorizar aparatos potentes, muchas horas de uso y baja eficiencia sin confundir potencia con energía.",
        example: "Un aparato de 500 W durante 2 h consume 1 kWh; uno de 1.500 W durante 20 min consume 0,5 kWh.",
      },
    ],
    images: [
      {
        src: "/theory/u17-potencia-temps.png",
        alt: "Gráfica escalonada de potencia en función del tiempo.",
        caption: "El área bajo una gráfica potencia-tiempo representa la energía consumida en cada intervalo.",
      },
    ],
    scientificText: {
      title: "La potencia más alta no siempre consume más",
      lead: "Texto didáctico sobre potencia, tiempo, energía y coste doméstico.",
      paragraphs: [
        "Una familia compara un horno de 2,0 kW que funciona 45 minutos con un ordenador de 0,20 kW que funciona 8 horas. El horno consume 2,0·0,75=1,5 kWh; el ordenador, 0,20·8=1,6 kWh. Aunque el horno tiene diez veces más potencia, el ordenador consume un poco más en los períodos indicados porque está encendido mucho más tiempo.",
        "La factura también puede incluir término de potencia, impuestos y tarifas horarias, por lo que el coste no siempre es energía por un único precio. Para reducir el consumo conviene medir hábitos reales y actuar sobre potencia, duración y eficiencia. Apagar un aparato muy potente durante pocos segundos puede ahorrar menos que reducir horas de uso moderado.",
      ],
      questions: [
        "Comprueba ambos consumos y explica por qué el resultado no es contradictorio.",
        "¿Qué diferencia conceptual existe entre kW y kWh?",
        "¿Qué datos de la factura y de los hábitos necesitas para priorizar un ahorro?",
      ],
      modelComment: "El horno usa 1,5 kWh y el ordenador 1,6 kWh: la potencia es energía por tiempo y el consumo resulta de multiplicarla por su duración. El kW mide potencia; el kWh, energía. Para priorizar es necesario conocer potencia real, horas, tarifa horaria, eficiencia y otros términos de factura. Actuaría primero sobre los usos que acumulan más kWh sin reducir seguridad o bienestar.",
    },
  },
  u18: {
    theory: [
      {
        development: "Los problemas socio-científicos no tienen una respuesta obtenida con una sola fórmula. Combinan hechos mensurables, consecuencias probables, intereses y valores. El primer paso es acotar el problema, la escala temporal y las personas afectadas; después se distingue qué sabemos, qué es incierto y qué datos faltan. También se generan distintas alternativas, incluida la combinación de acciones o mantener temporalmente la situación. Hacer explícitas las restricciones evita propuestas atractivas pero inviables.",
        example: "Ante calor en las aulas, el problema incluye temperatura, salud, horarios, energía, coste y desigualdad entre espacios, no sólo comprar aparatos.",
      },
      {
        development: "Una matriz de decisión transforma criterios en indicadores comparables: °C reducidos, kWh, coste anual, tiempo de aplicación o porcentaje de espacios accesibles. Asignar pesos expresa prioridades y debe justificarse; no es una operación neutral. Los datos pueden normalizarse a una misma escala, pero el resultado debe revisarse con sentido. El análisis de sensibilidad modifica pesos o estimaciones para comprobar si la propuesta ganadora es robusta o depende de una suposición muy concreta.",
        example: "Si una opción sólo gana cuando el coste pesa diez veces más que la salud, la decisión es sensible y necesita debate.",
      },
      {
        development: "El esquema afirmación-evidencia-razonamiento convierte a una opinión en un argumento revisable. La afirmación dice lo que se propone; la evidencia aporta datos relevantes y fiables; el razonamiento explica el mecanismo o criterio que las conecta. Una argumentación completa considera reparos y efectos no deseados e indica qué haría cambiar la decisión. Tras actuar, los indicadores comparan la situación con una línea base y un objetivo. Si el resultado no llega, se revisa el plan en lugar de ocultar los datos.",
        example: "«Plantaremos sombra porque las zonas vegetadas registraron 5,3 °C menos; mediremos temperatura y uso del patio durante el trimestre.»",
      },
    ],
    scientificText: {
      title: "Cómo proteger el centro frente al calor",
      lead: "Texto didáctico para integrar salud, energía, datos y una decisión multicriterio.",
      paragraphs: [
        "El centro baraja tres medidas. En: plantar sombra y sustituir parte del asfalto, coste 18.000 €, efecto progresivo y bajo consumo. B: instalar climatización en todas las aulas, coste 42.000€ más energía anual y efecto inmediato. C: adaptar horarios y habilitar dos espacios refugio, coste 6.000€, aplicación rápida pero cobertura limitada. Ninguna opción resuelve sola todas las situaciones.",
        "La decisión debe proteger primero la salud, especialmente de personas vulnerables, al tiempo que considerar temperatura reducida, tiempo, coste, kWh, emisiones, mantenimiento y equidad. Una combinación puede aplicar C enseguida, priorizar climatización eficiente en espacios críticos y desarrollar A como medida duradera. Habría que medir temperaturas e incidencias antes y después para revisar el plan.",
      ],
      questions: [
        "Compara las tres opciones con al menos cuatro criterios, no sólo el coste.",
        "Justifica una propuesta combinada con datos del texto y conocimiento científico.",
        "¿Qué indicadores usarás para saber si funciona y qué cambiaría la decisión?",
      ],
      modelComment: "A es lenta pero duradera y de bajo consumo; B actúa rápidamente pero cuesta más y aumenta energía; C es barata e inmediata, pero cubre menos. Propondría C como respuesta inicial, B eficiente sólo en espacios y personas prioritarias y A como transformación estructural. Mediría temperaturas, horas por encima del umbral, incidencias de salud, uso de los refugios, kWh y cobertura. Revisaría la combinación si no baja la exposición o aparecen desigualdades.",
    },
  },
};
