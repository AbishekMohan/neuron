// Translated course content, keyed by module id. See localizeModule.ts for
// the merge semantics (index-matched arrays, safe fallback to English for
// anything not yet present here). Being populated module by module — see
// the comment at the bottom of this file for what's done and what's left.
import type { Language } from '../lib/i18n';
import type { ModuleTranslations } from '../lib/localizeModule';

const ES: ModuleTranslations = {
  fundamentals: {
    title: 'Fundamentos de la IA',
    tagline: 'Lo que la IA realmente es, y lo que no es',
    description:
      'Empieza aquí. Aprende cómo funciona la inteligencia artificial por dentro, desde sistemas simples basados en reglas hasta las redes neuronales que impulsan los chatbots y generadores de imágenes actuales.',
    article: {
      sections: [
        {
          heading: '¿Qué es la inteligencia artificial?',
          paragraphs: [
            'La inteligencia artificial es un término amplio para el software que realiza tareas que normalmente requieren juicio humano: reconocer un rostro en una foto, traducir una oración o recomendar una canción que podría gustarte. No es una sola tecnología; es una categoría que incluye desde simples reglas de decisión hasta redes neuronales profundas.',
            'La mayoría de la IA con la que interactúas es "IA estrecha" (narrow AI), diseñada para hacer bien un solo trabajo, como filtrar spam o sugerir un video. No tiene conciencia de nada fuera de ese trabajo. La idea de ciencia ficción de una máquina que puede razonar sobre cualquier cosa, como lo hace una persona, se llama "IA general", y todavía no existe. Tener esta distinción en mente te ayudará a evitar mucha exageración mediática.',
            'Ya usas IA más a menudo de lo que crees: el autocompletado de tu teléfono, el orden de las publicaciones en una red social, los filtros de spam, las predicciones de rutas GPS y los asistentes de voz son todos sistemas de IA entrenados para optimizar un resultado específico.',
          ],
          checkpoint: {
            prompt: '¿Cuál de estos es el mejor ejemplo de "IA estrecha"?',
            choices: [
              'Un filtro de spam que solo clasifica el correo como spam o no spam',
              'Una máquina que puede razonar sobre cualquier tema como lo haría un humano',
              'Un robot que decide sus propios objetivos sin programación',
            ],
            explanation:
              'Un filtro de spam hace exactamente un trabajo y no tiene conciencia de nada fuera de él: eso es IA estrecha. La IA general, una máquina con razonamiento amplio a nivel humano en cualquier tarea, todavía no existe.',
          },
        },
        {
          heading: 'Aprendizaje automático y redes neuronales',
          paragraphs: [
            'El software más antiguo seguía reglas escritas a mano por un programador: "si X, entonces Y". El aprendizaje automático invierte esto: en lugar de escribir las reglas, le muestras al sistema miles (o millones) de ejemplos, y este descubre los patrones por sí mismo. A un filtro de spam no se le dice cómo es el spam; aprende de ejemplos de correos que los humanos ya etiquetaron como spam o no spam.',
            'Una red neuronal es una forma popular de hacer esto. Está vagamente inspirada en las neuronas de un cerebro: unidades simples, conectadas en capas, cada una pasando una pequeña señal a la siguiente. Ninguna unidad individual "entiende" nada; el reconocimiento de patrones surge de millones de estas pequeñas conexiones ajustando su fuerza durante el entrenamiento, según cuán lejos estuvieran las conjeturas de la red de la respuesta correcta.',
            'Por eso los sistemas de IA necesitan enormes cantidades de datos de entrenamiento y poder de cómputo, y por eso su comportamiento puede ser difícil de explicar por completo. Incluso los ingenieros que los construyen no pueden señalar una línea exacta de "razonamiento" como podrías rastrear un programa de computadora normal.',
          ],
        },
        {
          heading: 'IA generativa y grandes modelos de lenguaje',
          paragraphs: [
            'La IA generativa produce contenido nuevo (texto, imágenes, audio, código) en lugar de solo clasificar u ordenar cosas. Un gran modelo de lenguaje (LLM), el tipo de sistema detrás de la mayoría de los chatbots de IA, se entrena con enormes cantidades de texto y aprende a predecir la palabra más probable dado todo lo escrito hasta ese momento. Repite esa predicción una y otra vez para generar una respuesta completa.',
            'Ese único hecho importa mucho: un LLM es un predictor de la siguiente palabra muy sofisticado, no una base de datos de hechos verificados ni un motor de razonamiento que "sabe" que tiene razón. Puede producir texto fluido y de sonido confiado que sea completamente incorrecto. Esto se suele llamar "alucinación". El modelo no miente a propósito; no tiene concepto de la verdad, solo de qué palabra es estadísticamente probable que venga después.',
            'Entender esto cambia cómo deberías usar estas herramientas: son excelentes para redactar borradores, hacer lluvia de ideas y explicar un concepto de otra manera, pero arriesgadas como única fuente de hechos, fechas, citas o cualquier cosa que planees entregar sin verificar.',
          ],
          checkpoint: {
            prompt: 'Un LLM afirma con confianza una fecha histórica incorrecta. ¿Qué está pasando en realidad?',
            choices: [
              'Te está mintiendo deliberadamente',
              'Predijo las palabras siguientes estadísticamente probables, sin verificación de hechos incorporada',
              'Está roto y necesita reiniciarse',
            ],
            explanation:
              'Los LLM generan texto prediciendo palabras probables, no buscando hechos verificados. Un tono confiado no es evidencia: el modelo suena igual de seguro tenga razón o no.',
          },
        },
        {
          heading: 'Una breve historia de la IA',
          paragraphs: [
            'La IA como campo se remonta a 1950, cuando Alan Turing publicó "Computing Machinery and Intelligence", proponiendo un experimento mental, más tarde llamado la Prueba de Turing, para juzgar si la conversación de una máquina era indistinguible de la de un humano. En 1955, John McCarthy, Marvin Minsky, Nathaniel Rochester y Claude Shannon propusieron el Proyecto de Investigación de Verano de Dartmouth, el taller donde se acuñó el término "inteligencia artificial". Los primeros investigadores eran optimistas de que la inteligencia de máquina a nivel humano estaba a solo años de distancia.',
            'Ese optimismo chocó con límites duros. En 1973, una revisión encargada por el gobierno del Reino Unido conocida como el Informe Lighthill concluyó que la investigación en IA no había cumplido sus grandes promesas, y siguieron recortes de financiación a ambos lados del Atlántico: el primero de dos períodos de menor financiación e interés conocidos como "inviernos de la IA", aproximadamente a mediados de los años 70 y de nuevo a finales de los 80 y principios de los 90, cuando los primeros enfoques no lograron escalar a problemas del mundo real.',
            'El campo resurgió a través del aprendizaje automático. En 2012, una red neuronal llamada AlexNet, entrenada con el conjunto de datos ImageNet, ganó un concurso de reconocimiento de imágenes con una tasa de error del 15.3% frente al 26.2% del siguiente mejor competidor, un resultado ampliamente reconocido como el detonante del auge actual, posible gracias a más datos, procesadores gráficos más potentes y mejores algoritmos. Un artículo de investigación de 2017, "Attention Is All You Need", introdujo entonces la arquitectura "transformer", que hizo práctico entrenar los grandes modelos de lenguaje que impulsan los chatbots y herramientas de escritura de IA actuales.',
          ],
        },
        {
          heading: 'Las cinco grandes ideas de la IA',
          paragraphs: [
            'Los investigadores en educación de IA agrupan casi todo lo que la IA puede hacer en cinco categorías amplias, conocidas como las "Cinco Grandes Ideas de la IA", un marco desarrollado por la Iniciativa AI4K12, un grupo nacional de investigadores de IA y educación respaldado por AAAI y CSTA con financiación de la National Science Foundation. Percepción es la idea de que las computadoras pueden percibir el mundo a través de cámaras, micrófonos y otros sensores. Representación y Razonamiento es la idea de que un sistema almacena lo que "sabe" en alguna forma interna y lo usa para sacar conclusiones.',
            'Aprendizaje es la idea vista antes: las computadoras pueden mejorar en una tarea a partir de datos en lugar de ser programadas explícitamente para cada caso. Interacción Natural es la idea de que, para que la IA funcione bien con las personas, necesita más que inteligencia pura; necesita manejar el lenguaje, la emoción y el contexto como lo hacen naturalmente los humanos. Impacto Social, la quinta idea, es el recordatorio de que todo sistema de IA tiene efectos reales sobre personas reales, para bien o para mal, que es el enfoque del módulo de ética de este curso.',
            'Tener presentes estas cinco ideas te da un mapa mental para casi cualquier herramienta o titular de IA que encuentres. Por lo general, puedes preguntarte a cuál de las cinco se refiere realmente, y eso por sí solo te ayudará a evaluarla con más claridad que la mayoría de la gente.',
          ],
          checkpoint: {
            prompt: 'Un asistente de voz que entiende tu tono y responde de forma conversacional es principalmente un ejemplo de qué "gran idea"?',
            choices: ['Percepción', 'Interacción Natural', 'Impacto Social'],
            explanation:
              'La Interacción Natural trata específicamente de que la IA maneje el lenguaje, la emoción y el contexto como lo hacen los humanos: lo que hace que un asistente se sienta conversacional en lugar de robótico.',
          },
        },
      ],
    },
    flashcards: {
      cards: [
        { term: 'IA estrecha', definition: 'IA diseñada para hacer bien un solo trabajo específico, sin conciencia de nada fuera de esa tarea: casi toda la IA en uso hoy en día.' },
        { term: 'IA general (AGI)', definition: 'Una IA hipotética con razonamiento amplio a nivel humano en cualquier tarea. Todavía no existe; si algún día existirá es un tema genuinamente debatido.' },
        { term: 'Aprendizaje automático', definition: 'Un enfoque en el que un sistema aprende patrones a partir de datos de ejemplo en lugar de seguir reglas escritas a mano por un programador.' },
        { term: 'Red neuronal', definition: 'Un modelo de aprendizaje automático vagamente inspirado en las neuronas del cerebro: capas de unidades simples conectadas cuya señal combinada produce el resultado.' },
        { term: 'Gran modelo de lenguaje (LLM)', definition: 'Una red neuronal entrenada con enormes cantidades de texto para predecir la palabra más probable, repitiéndolo para generar respuestas completas.' },
        { term: 'Alucinación', definition: 'Cuando un modelo de IA genera texto fluido y de sonido confiado que es factualmente incorrecto, porque predice texto plausible en lugar de hechos verificados.' },
        { term: 'Prueba de Turing', definition: 'Un experimento mental propuesto por Alan Turing en 1950: si la conversación de una máquina es indistinguible de la de un humano, la supera.' },
        { term: 'Transformer', definition: 'Una arquitectura de red neuronal de 2017 ("Attention Is All You Need") que hizo práctico entrenar los grandes modelos de lenguaje actuales.' },
      ],
    },
    video: {
      title: 'Fundamentos de la IA',
      description: 'Una breve explicación sobre la IA estrecha frente a la general, el aprendizaje automático y cómo aprenden las redes neuronales.',
    },
    game: {
      prompt: 'Clasifica cada ejemplo según la "Gran Idea" que demuestra.',
      buckets: ['Percepción', 'Representación y Razonamiento', 'Aprendizaje', 'Interacción Natural', 'Impacto Social'],
      blastTargetIndex: 2,
      cards: [
        { text: 'La cámara de un teléfono detecta y enfoca un rostro', bucketIndex: 0, why: 'Percibir el mundo a través de una cámara es Percepción.' },
        { text: 'Un motor de ajedrez almacena el estado del tablero y planea movimientos futuros', bucketIndex: 1, why: 'Almacenar conocimiento interno y sacar conclusiones de él es Representación y Razonamiento.' },
        { text: 'Un filtro de spam mejora tras ver más ejemplos etiquetados', bucketIndex: 2, why: 'Mejorar en una tarea a partir de datos, en lugar de reglas fijas, es Aprendizaje.' },
        { text: 'Un asistente de voz ajusta su respuesta según la emoción en tu voz', bucketIndex: 3, why: 'Manejar el lenguaje, el tono y el contexto como lo hacen los humanos es Interacción Natural.' },
        { text: 'Se descubre que un algoritmo de contratación favorece injustamente a algunos candidatos', bucketIndex: 4, why: 'Tener efectos reales sobre personas reales, para bien o para mal, es Impacto Social.' },
        { text: 'El lidar de un auto autónomo detecta a un peatón en la carretera', bucketIndex: 0, why: 'Percibir el mundo a través de sensores como el lidar es Percepción.' },
        { text: 'Una IA médica cruza los síntomas con una base de conocimiento almacenada', bucketIndex: 1, why: 'Usar conocimiento almacenado para sacar una conclusión es Representación y Razonamiento.' },
        { text: 'Un sistema de recomendación mejora con el tiempo al predecir lo que verás', bucketIndex: 2, why: 'Mejorar a partir de la experiencia/datos es Aprendizaje.' },
      ],
    },
    quiz: {
      questions: [
        {
          prompt: '¿Cuál es la diferencia clave entre la IA estrecha y la IA general (AGI)?',
          choices: [
            'La IA estrecha es tecnología más antigua; la IA general es más nueva',
            'La IA estrecha hace una tarea específica; la IA general razonaría ampliamente en cualquier tarea, y no existe todavía',
            'No hay una diferencia real, son términos de marketing',
          ],
          explanation: 'Casi toda la IA en uso hoy es estrecha. La AGI es una meta hipotética y debatida, no un producto actual.',
        },
        {
          prompt: '¿En qué se diferencia el aprendizaje automático del software tradicional basado en reglas?',
          choices: [
            'El ML siempre es más rápido que el código basado en reglas',
            'El ML aprende patrones de ejemplos etiquetados en lugar de seguir reglas escritas a mano',
            'El ML solo funciona con imágenes, no con texto',
          ],
          explanation: 'El software tradicional sigue reglas explícitas "si X entonces Y"; el ML infiere patrones a partir de datos.',
        },
        {
          prompt: '¿Qué hace realmente un LLM cuando genera una respuesta?',
          choices: [
            'Busca la respuesta en una base de datos verificada',
            'Predice repetidamente la siguiente palabra estadísticamente más probable',
            'Razona paso a paso como lo haría una calculadora',
          ],
          explanation: 'Los LLM son predictores de la siguiente palabra entrenados con enormes cantidades de texto: precisamente por eso ocurren las alucinaciones.',
        },
        {
          prompt: 'Un chatbot afirma con confianza una estadística completamente falsa. ¿Qué deberías concluir?',
          choices: [
            'Debe ser cierto ya que el tono es confiado',
            'El modelo alucinó: un tono confiado no es evidencia de precisión',
            'El chatbot está intentando engañarte a propósito',
          ],
          explanation: 'Las alucinaciones ocurren porque el modelo no tiene un concepto incorporado de verdad, solo de las palabras probables siguientes.',
        },
        {
          prompt: '¿Qué provocó las desaceleraciones en la investigación de IA conocidas como "inviernos de la IA"?',
          choices: [
            'Los gobiernos prohibieron por completo la investigación en IA',
            'Los primeros enfoques no lograron escalar a problemas del mundo real, y se recortó la financiación tras informes como el Informe Lighthill de 1973',
            'Todos los investigadores de IA se cambiaron permanentemente a otros campos',
          ],
          explanation: 'La crítica del Informe Lighthill precedió a importantes recortes de financiación en el Reino Unido y EE. UU.: el primero de dos inviernos de la IA.',
        },
        {
          prompt: '¿Qué hizo de 2012 un punto de inflexión para la IA, según el resultado de AlexNet?',
          choices: [
            'AlexNet logró un 15.3% de error frente al 26.2% del siguiente mejor participante en un concurso de reconocimiento de imágenes',
            'AlexNet fue el primer chatbot jamás creado',
            'AlexNet demostró que se había logrado la IA general',
          ],
          explanation: 'Esa brecha de aproximadamente 11 puntos es la razón por la que 2012 se considera el punto de inflexión para el aprendizaje profundo.',
        },
        {
          prompt: '¿Qué introdujo el artículo de 2017 "Attention Is All You Need"?',
          choices: [
            'La primera red neuronal jamás construida',
            'La arquitectura transformer, que hizo práctico entrenar los grandes modelos de lenguaje actuales',
            'El concepto mismo de aprendizaje automático',
          ],
          explanation: 'La arquitectura transformer es el fundamento técnico detrás de los LLM modernos.',
        },
        {
          prompt: '¿Cuál es el nombre correcto y oficial de la segunda "Gran Idea" de AI4K12?',
          choices: ['Representación y Razonamiento', 'Representación y Lógica', 'Almacenamiento de Datos'],
          explanation: 'Los propios materiales de AI4K12 usan "Representación y Razonamiento" como el nombre oficial.',
        },
      ],
    },
  },
};

const ZH: ModuleTranslations = {
  fundamentals: {
    title: '人工智能基础',
    tagline: '人工智能到底是什么,又不是什么',
    description: '从这里开始。了解人工智能底层的工作原理,从简单的基于规则的系统,到驱动当今聊天机器人和图像生成器的神经网络。',
    article: {
      sections: [
        {
          heading: '什么是人工智能?',
          paragraphs: [
            '人工智能是一个广义术语,指能够执行通常需要人类判断力的任务的软件:识别照片中的人脸、翻译句子,或推荐你可能喜欢的歌曲。它不是单一的技术,而是一个类别,涵盖从简单的决策规则到深度神经网络的一切。',
            '你接触到的大多数人工智能都是"窄人工智能"(narrow AI),专门用来把一件事做好,比如过滤垃圾邮件或推荐视频。它对这项工作之外的任何事情都没有意识。科幻小说中那种能像人一样对任何事情进行推理的机器,被称为"通用人工智能",目前尚不存在。记住这个区别,能帮你识破很多夸大其词的说法。',
            '你使用人工智能的频率可能比你想象的更高:手机上的自动补全、社交媒体动态中帖子的排序、垃圾邮件过滤器、GPS 路线预测和语音助手,都是为优化特定结果而训练的人工智能系统。',
          ],
          checkpoint: {
            prompt: '以下哪一项是"窄人工智能"的最佳例子?',
            choices: [
              '一个只把邮件分类为垃圾邮件或非垃圾邮件的过滤器',
              '一台能像人类一样对任何话题进行推理的机器',
              '一个自行决定目标、不受任何编程约束的机器人',
            ],
            explanation:
              '垃圾邮件过滤器只做一件事,对此之外的任何事情都没有意识:这就是窄人工智能。通用人工智能——一台在任何任务上都具备广泛人类水平推理能力的机器——目前还不存在。',
          },
        },
        {
          heading: '机器学习与神经网络',
          paragraphs: [
            '早期的软件遵循程序员手写的规则:"如果 X,那么 Y"。机器学习则反其道而行之:不是编写规则,而是给系统展示成千上万(甚至数百万)个例子,让它自己找出规律。垃圾邮件过滤器并不是被告知垃圾邮件长什么样,而是从人类已经标注为垃圾邮件或非垃圾邮件的邮件样本中学习。',
            '神经网络是实现这一点的一种常见方式。它大致受到大脑神经元的启发:简单的单元分层连接,每一层将微小的信号传递给下一层。没有任何一个单元能"理解"任何东西;模式识别能力来自数百万个这样的微小连接在训练过程中根据网络猜测与正确答案的差距不断调整其强度。',
            '这就是为什么人工智能系统需要海量的训练数据和计算能力,也是为什么它们的行为往往难以完全解释。就连构建它们的工程师也无法像追踪普通计算机程序那样,指出某一行精确的"推理"过程。',
          ],
        },
        {
          heading: '生成式人工智能与大语言模型',
          paragraphs: [
            '生成式人工智能生成全新的内容(文本、图像、音频、代码),而不仅仅是对事物进行分类或排序。大语言模型(LLM)是大多数人工智能聊天机器人背后的系统类型,它通过海量文本训练,学会根据目前为止写下的所有内容预测最可能出现的下一个词。它反复进行这种预测,从而生成一段完整的回答。',
            '这一点非常重要:大语言模型是一个非常精密的"下一个词"预测器,而不是一个经过验证的事实数据库,也不是一个"知道"自己正确的推理引擎。它可能生成流畅、语气自信但完全错误的文本,这通常被称为"幻觉"。模型并非故意撒谎;它没有真相的概念,只有对下一个词在统计上出现概率的判断。',
            '理解这一点会改变你使用这些工具的方式:它们非常适合起草初稿、头脑风暴,以及换一种方式解释某个概念,但如果作为事实、日期、引文或任何你打算不经核实就提交的内容的唯一来源,则存在风险。',
          ],
          checkpoint: {
            prompt: '一个大语言模型自信地给出了一个错误的历史日期。实际发生了什么?',
            choices: [
              '它在故意对你撒谎',
              '它预测了统计上可能出现的下一个词,没有内置的事实核查机制',
              '它出故障了,需要重置',
            ],
            explanation: '大语言模型通过预测可能的下一个词来生成文本,而不是查阅经过验证的事实。语气自信并不代表证据:无论对错,模型听起来都同样自信。',
          },
        },
        {
          heading: '人工智能简史',
          paragraphs: [
            '人工智能作为一个领域可以追溯到 1950 年,当时艾伦·图灵发表了《计算机器与智能》,提出了一个思想实验,后来被称为图灵测试,用来判断一台机器的对话是否与人类的对话无法区分。1955 年,约翰·麦卡锡、马文·明斯基、纳撒尼尔·罗切斯特和克劳德·香农提出了达特茅斯夏季研究计划,"人工智能"一词正是在这次研讨会上被创造出来的。早期研究者曾乐观地认为,达到人类水平的机器智能只需再过几年就能实现。',
            '这种乐观情绪遭遇了现实的严峻限制。1973 年,英国政府委托进行的一项审查(即"莱特希尔报告")得出结论,认为人工智能研究未能兑现其宏大承诺,随后大西洋两岸的资助纷纷被削减:这是所谓"人工智能寒冬"两个阶段中的第一个,大致发生在 1970 年代中期,以及后来的 1980 年代末到 1990 年代初,原因是早期方法未能扩展到现实世界的问题。',
            '该领域通过机器学习重新崛起。2012 年,一个名为 AlexNet 的神经网络在 ImageNet 数据集上训练后,在一场图像识别竞赛中以 15.3% 的错误率击败了排名第二的 26.2%,这一结果被广泛认为是当前这波热潮的起点,得益于更多的数据、更强大的图形处理器以及更好的算法。随后,2017 年的一篇研究论文《Attention Is All You Need》提出了"transformer"架构,使得训练如今支撑各类人工智能聊天机器人和写作工具的超大语言模型成为可能。',
          ],
        },
        {
          heading: '人工智能的五大理念',
          paragraphs: [
            '人工智能教育研究者将人工智能几乎所有的能力归纳为五大类,称为"人工智能五大理念",这一框架由 AI4K12 倡议提出——这是一个由美国人工智能协会(AAAI)和计算机科学教师协会(CSTA)支持、并获得美国国家科学基金会资助的全国性人工智能与教育研究团体。"感知"是指计算机可以通过摄像头、麦克风和其他传感器感知世界。"表示与推理"是指系统以某种内部形式存储它所"知道"的内容,并用它得出结论。',
            '"学习"就是前面提到的理念:计算机可以通过数据在某项任务上不断进步,而不是针对每种情况都被明确编程。"自然交互"是指,人工智能要想与人良好协作,仅有原始智能是不够的;它还需要像人类一样自然地处理语言、情感和情境。"社会影响"是第五个理念,提醒我们每一个人工智能系统都会对真实的人产生真实的影响,无论好坏,这也是本课程伦理模块的重点。',
            '牢记这五个理念,会为你提供一张几乎适用于任何人工智能工具或新闻标题的思维地图。你通常可以问自己,它真正涉及这五者中的哪一个,仅凭这一点,就能帮你比大多数人更清晰地评估它。',
          ],
          checkpoint: {
            prompt: '一个语音助手能理解你的语气并做出对话式的回应,这主要是哪个"大理念"的例子?',
            choices: ['感知', '自然交互', '社会影响'],
            explanation: '"自然交互"专门指人工智能像人类一样处理语言、情感和情境:这正是让助手感觉像在对话而不是机械死板的原因。',
          },
        },
      ],
    },
    flashcards: {
      cards: [
        { term: '窄人工智能', definition: '专门用来把某一项具体工作做好的人工智能,对该任务之外的事情没有任何意识:如今使用的几乎所有人工智能都是如此。' },
        { term: '通用人工智能(AGI)', definition: '一种假想中的人工智能,在任何任务上都具备广泛的、人类水平的推理能力。目前尚不存在;它是否以及何时会出现仍存在真正的争议。' },
        { term: '机器学习', definition: '一种让系统从示例数据中学习规律,而不是遵循程序员手写规则的方法。' },
        { term: '神经网络', definition: '一种大致受大脑神经元启发的机器学习模型:由简单单元分层连接而成,其综合信号产生输出结果。' },
        { term: '大语言模型(LLM)', definition: '一种通过海量文本训练、用于预测最可能出现的下一个词的神经网络,通过反复预测生成完整回答。' },
        { term: '幻觉', definition: '指人工智能模型生成流畅、语气自信但事实错误的文本,因为它预测的是看似合理的文本,而非经过验证的事实。' },
        { term: '图灵测试', definition: '艾伦·图灵于 1950 年提出的一个思想实验:如果一台机器的对话让人无法与人类对话区分开来,它就通过了测试。' },
        { term: 'Transformer(变换器)', definition: '2017 年提出的一种神经网络架构(出自论文《Attention Is All You Need》),使训练如今的大语言模型成为可能。' },
      ],
    },
    video: {
      title: '人工智能基础',
      description: '一段简短的讲解,介绍窄人工智能与通用人工智能的区别、机器学习,以及神经网络的学习方式。',
    },
    game: {
      prompt: '将每个例子归类到它所展示的"大理念"中。',
      buckets: ['感知', '表示与推理', '学习', '自然交互', '社会影响'],
      blastTargetIndex: 2,
      cards: [
        { text: '手机摄像头检测并对焦一张人脸', bucketIndex: 0, why: '通过摄像头感知世界属于感知。' },
        { text: '一个国际象棋引擎存储棋盘状态并规划未来的走法', bucketIndex: 1, why: '存储内部知识并据此得出结论属于表示与推理。' },
        { text: '一个垃圾邮件过滤器在看到更多标注样本后表现有所提升', bucketIndex: 2, why: '通过数据而非固定规则在某项任务上不断进步属于学习。' },
        { text: '一个语音助手根据你说话的情绪调整它的回应', bucketIndex: 3, why: '像人类一样处理语言、语气和情境属于自然交互。' },
        { text: '人们发现某个招聘算法不公平地偏向部分求职者', bucketIndex: 4, why: '对真实的人产生真实影响,无论好坏,属于社会影响。' },
        { text: '一辆自动驾驶汽车的激光雷达检测到路上的行人', bucketIndex: 0, why: '通过激光雷达等传感器感知世界属于感知。' },
        { text: '一个医疗人工智能将症状与存储的知识库进行比对', bucketIndex: 1, why: '利用存储的知识得出结论属于表示与推理。' },
        { text: '一个推荐系统随着时间推移,预测你会观看的内容越来越准确', bucketIndex: 2, why: '从经验/数据中不断改进属于学习。' },
      ],
    },
    quiz: {
      questions: [
        {
          prompt: '窄人工智能和通用人工智能(AGI)之间的关键区别是什么?',
          choices: [
            '窄人工智能是较旧的技术;通用人工智能是较新的技术',
            '窄人工智能只做一项具体任务;通用人工智能将能在任何任务上广泛推理,而且目前尚不存在',
            '两者之间没有真正的区别,只是营销术语',
          ],
          explanation: '如今使用的几乎所有人工智能都是窄人工智能。AGI 是一个假想的、存在争议的目标,而不是当前的产品。',
        },
        {
          prompt: '机器学习与传统的基于规则的软件有何不同?',
          choices: [
            '机器学习总是比基于规则的代码更快',
            '机器学习从带标签的示例中学习规律,而不是遵循手写规则',
            '机器学习只能处理图像,不能处理文本',
          ],
          explanation: '传统软件遵循明确的"如果 X 那么 Y"规则;机器学习则从数据中推断规律。',
        },
        {
          prompt: '大语言模型在生成回答时实际在做什么?',
          choices: [
            '在经过验证的数据库中查找答案',
            '反复预测统计上最可能出现的下一个词',
            '像计算器一样逐步推理',
          ],
          explanation: '大语言模型是基于海量文本训练的下一个词预测器:这正是幻觉产生的原因。',
        },
        {
          prompt: '一个聊天机器人自信地给出了一个完全错误的统计数据。你应该得出什么结论?',
          choices: [
            '既然语气自信,那一定是真的',
            '模型产生了幻觉:自信的语气并不能证明其准确性',
            '聊天机器人是在故意欺骗你',
          ],
          explanation: '幻觉之所以发生,是因为模型没有内置的真相概念,只有对可能出现的下一个词的判断。',
        },
        {
          prompt: '是什么导致了被称为"人工智能寒冬"的研究放缓?',
          choices: [
            '各国政府彻底禁止了人工智能研究',
            '早期方法未能扩展到现实世界的问题,且在 1973 年莱特希尔报告等报告发布后资助被削减',
            '所有人工智能研究者都永久转向了其他领域',
          ],
          explanation: '莱特希尔报告的批评先于英美两国的重大资助削减:这是两次人工智能寒冬中的第一次。',
        },
        {
          prompt: '根据 AlexNet 的结果,是什么让 2012 年成为人工智能的转折点?',
          choices: [
            '在一场图像识别竞赛中,AlexNet 的错误率为 15.3%,而排名第二的选手为 26.2%',
            'AlexNet 是有史以来第一个聊天机器人',
            'AlexNet 证明了通用人工智能已经实现',
          ],
          explanation: '这大约 11 个百分点的差距,正是 2012 年被视为深度学习转折点的原因。',
        },
        {
          prompt: '2017 年发表的论文《Attention Is All You Need》提出了什么?',
          choices: [
            '有史以来第一个神经网络',
            'transformer 架构,它使训练如今的大语言模型成为可能',
            '机器学习这一概念本身',
          ],
          explanation: 'transformer 架构是现代大语言模型背后的技术基础。',
        },
        {
          prompt: 'AI4K12 第二个"大理念"的正确官方名称是什么?',
          choices: ['表示与推理', '表示与逻辑', '数据存储'],
          explanation: 'AI4K12 官方材料使用"表示与推理"作为正式名称。',
        },
      ],
    },
  },
};

const HI: ModuleTranslations = {
  fundamentals: {
    title: 'एआई की बुनियादी बातें',
    tagline: 'एआई वास्तव में क्या है, और क्या नहीं है',
    description:
      'यहाँ से शुरू करें। जानें कि कृत्रिम बुद्धिमत्ता (आर्टिफिशियल इंटेलिजेंस) अंदर से कैसे काम करती है — सरल नियम-आधारित प्रणालियों से लेकर आज के चैटबॉट और इमेज जनरेटर को शक्ति देने वाले न्यूरल नेटवर्क तक।',
    article: {
      sections: [
        {
          heading: 'आर्टिफिशियल इंटेलिजेंस क्या है?',
          paragraphs: [
            'आर्टिफिशियल इंटेलिजेंस एक व्यापक शब्द है, उस सॉफ़्टवेयर के लिए जो ऐसे काम करता है जिनके लिए आमतौर पर मानवीय समझ-बूझ चाहिए होती है: किसी फोटो में चेहरा पहचानना, किसी वाक्य का अनुवाद करना, या ऐसा गाना सुझाना जो आपको पसंद आ सकता है। यह कोई एक तकनीक नहीं है; यह एक पूरी श्रेणी है, जिसमें साधारण निर्णय-नियमों से लेकर डीप न्यूरल नेटवर्क तक सब कुछ शामिल है।',
            'आप जिस अधिकांश एआई से जुड़ते हैं, वह "नैरो एआई" है — जो एक ही काम अच्छी तरह करने के लिए बनाई गई है, जैसे स्पैम फ़िल्टर करना या कोई वीडियो सुझाना। उसे उस काम के अलावा किसी भी चीज़ का कोई भान नहीं होता। किसी मशीन के इंसान की तरह किसी भी विषय पर तर्क कर पाने वाले साइंस-फिक्शन विचार को "जनरल एआई" कहा जाता है, और यह अभी तक अस्तित्व में नहीं है। इस अंतर को ध्यान में रखने से आपको बहुत सारे बढ़ा-चढ़ाकर किए गए दावों को समझने में मदद मिलेगी।',
            'आप सोचते हैं उससे कहीं अधिक बार एआई का उपयोग करते हैं: आपके फ़ोन पर ऑटोकम्प्लीट, सोशल फ़ीड में पोस्ट का क्रम, स्पैम फ़िल्टर, जीपीएस रूट अनुमान, और वॉइस असिस्टेंट — ये सभी किसी खास नतीजे को बेहतर बनाने के लिए प्रशिक्षित एआई प्रणालियाँ हैं।',
          ],
          checkpoint: {
            prompt: 'इनमें से "नैरो एआई" का सबसे अच्छा उदाहरण कौन सा है?',
            choices: [
              'एक स्पैम फ़िल्टर जो ईमेल को केवल स्पैम या नॉट-स्पैम में छाँटता है',
              'एक मशीन जो किसी भी विषय पर उतना ही तर्क कर सके जितना एक इंसान कर सकता है',
              'एक रोबोट जो बिना किसी प्रोग्रामिंग के अपने खुद के लक्ष्य तय करता है',
            ],
            explanation:
              'एक स्पैम फ़िल्टर बिल्कुल एक ही काम करता है और उसके बाहर की किसी भी चीज़ का उसे भान नहीं होता: यही नैरो एआई है। जनरल एआई — किसी भी काम में इंसानों जैसी व्यापक समझ वाली मशीन — अभी तक अस्तित्व में नहीं है।',
          },
        },
        {
          heading: 'मशीन लर्निंग और न्यूरल नेटवर्क',
          paragraphs: [
            'पुराना सॉफ़्टवेयर किसी प्रोग्रामर द्वारा हाथ से लिखे गए नियमों का पालन करता था: "अगर X, तो Y"। मशीन लर्निंग इसे उल्टा कर देती है: नियम लिखने के बजाय, आप सिस्टम को हज़ारों (या लाखों) उदाहरण दिखाते हैं, और वह खुद पैटर्न समझ लेता है। एक स्पैम फ़िल्टर को यह नहीं बताया जाता कि स्पैम कैसा दिखता है; वह उन ईमेल के उदाहरणों से सीखता है जिन्हें इंसानों ने पहले ही स्पैम या नॉट-स्पैम के रूप में चिह्नित किया है।',
            'न्यूरल नेटवर्क इसे करने का एक लोकप्रिय तरीका है। यह दिमाग के न्यूरॉन्स से थोड़ा प्रेरित है: सरल इकाइयाँ, परतों में जुड़ी हुई, जिनमें से हर एक अगली को एक छोटा-सा संकेत भेजती है। कोई भी अकेली इकाई कुछ भी "समझती" नहीं है; पैटर्न पहचानने की क्षमता इन लाखों छोटे-छोटे कनेक्शनों से उभरती है, जो प्रशिक्षण के दौरान — नेटवर्क के अनुमान सही जवाब से कितने दूर थे, इसके आधार पर — अपनी ताकत समायोजित करते रहते हैं।',
            'यही कारण है कि एआई प्रणालियों को भारी मात्रा में प्रशिक्षण डेटा और कंप्यूटिंग शक्ति की ज़रूरत होती है, और यही कारण है कि उनके व्यवहार को पूरी तरह समझाना मुश्किल हो सकता है। उन्हें बनाने वाले इंजीनियर भी किसी एक सटीक "तर्क" की पंक्ति की ओर इशारा नहीं कर सकते, जैसे आप किसी सामान्य कंप्यूटर प्रोग्राम में कर सकते हैं।',
          ],
        },
        {
          heading: 'जेनरेटिव एआई और बड़े भाषा मॉडल',
          paragraphs: [
            'जेनरेटिव एआई नई सामग्री (टेक्स्ट, इमेज, ऑडियो, कोड) बनाती है, न कि केवल चीज़ों को वर्गीकृत या क्रमबद्ध करती है। एक बड़ा भाषा मॉडल (एलएलएम) — जो ज़्यादातर एआई चैटबॉट के पीछे की तकनीक है — भारी मात्रा में टेक्स्ट पर प्रशिक्षित होता है और अब तक लिखी गई हर चीज़ को देखते हुए अगला सबसे संभावित शब्द अनुमानित करना सीखता है। पूरा जवाब तैयार करने के लिए वह इस अनुमान को बार-बार दोहराता है।',
            'यह एक बात बहुत मायने रखती है: एलएलएम एक बेहद परिष्कृत "अगला-शब्द अनुमानक" है, न कि सत्यापित तथ्यों का डेटाबेस और न ही कोई तर्क-इंजन जो "जानता" हो कि वह सही है। यह धाराप्रवाह, आत्मविश्वास से भरा लेकिन पूरी तरह गलत टेक्स्ट बना सकता है। इसे आमतौर पर "हैलुसिनेशन" (भ्रम) कहा जाता है। मॉडल जानबूझकर झूठ नहीं बोलता; उसे सच का कोई कॉन्सेप्ट नहीं होता, बस यह अंदाज़ा होता है कि आगे कौन-सा शब्द आँकड़ों के हिसाब से संभावित है।',
            'इसे समझना बदल देता है कि आपको इन उपकरणों का उपयोग कैसे करना चाहिए: ये मसौदा तैयार करने, विचार-मंथन करने, और किसी अवधारणा को अलग तरीके से समझाने के लिए बेहतरीन हैं, लेकिन तथ्यों, तारीखों, उद्धरणों, या ऐसी किसी भी चीज़ के इकलौते स्रोत के रूप में जोखिम भरे हैं जिसे आप बिना जाँचे जमा करने की योजना बना रहे हों।',
          ],
          checkpoint: {
            prompt: 'एक एलएलएम पूरे आत्मविश्वास से एक गलत ऐतिहासिक तारीख बताता है। असल में हो क्या रहा है?',
            choices: [
              'यह जानबूझकर आपसे झूठ बोल रहा है',
              'इसने बिना किसी अंतर्निहित तथ्य-जाँच के आँकड़ों के हिसाब से संभावित अगले शब्दों का अनुमान लगाया',
              'यह खराब हो गया है और इसे रीसेट करने की ज़रूरत है',
            ],
            explanation:
              'एलएलएम संभावित अगले शब्दों का अनुमान लगाकर टेक्स्ट बनाते हैं, सत्यापित तथ्य खोजकर नहीं। आत्मविश्वास भरा लहजा सबूत नहीं है: मॉडल सही या गलत — दोनों ही स्थितियों में उतना ही आश्वस्त सुनाई देता है।',
          },
        },
        {
          heading: 'एआई का संक्षिप्त इतिहास',
          paragraphs: [
            'एक क्षेत्र के रूप में एआई की शुरुआत 1950 से मानी जाती है, जब एलन ट्यूरिंग ने "कंप्यूटिंग मशीनरी एंड इंटेलिजेंस" प्रकाशित किया, जिसमें उन्होंने एक विचार-प्रयोग प्रस्तावित किया — जिसे बाद में ट्यूरिंग टेस्ट कहा गया — यह जाँचने के लिए कि क्या किसी मशीन की बातचीत इंसान की बातचीत से अलग पहचानी जा सकती है या नहीं। 1955 में, जॉन मैकार्थी, मार्विन मिंस्की, नथानिएल रोचेस्टर और क्लॉड शैनन ने डार्टमाउथ समर रिसर्च प्रोजेक्ट प्रस्तावित किया — वह कार्यशाला जहाँ "आर्टिफिशियल इंटेलिजेंस" शब्द गढ़ा गया। शुरुआती शोधकर्ता आशावादी थे कि इंसानों जैसी मशीन बुद्धिमत्ता बस कुछ ही वर्षों में हासिल हो जाएगी।',
            'वह आशावाद कठोर सीमाओं से टकरा गया। 1973 में, ब्रिटेन सरकार द्वारा करवाई गई एक समीक्षा — जिसे लाइटहिल रिपोर्ट के नाम से जाना जाता है — ने निष्कर्ष निकाला कि एआई शोध अपने बड़े वादे पूरे नहीं कर पाया, और इसके बाद अटलांटिक के दोनों ओर फंडिंग में कटौती हुई: यह उन दो दौर में से पहला था जिन्हें "एआई विंटर" कहा जाता है — मोटे तौर पर 1970 के दशक के मध्य में, और फिर 1980 के दशक के अंत से 1990 के दशक की शुरुआत तक — क्योंकि शुरुआती तरीके वास्तविक दुनिया की समस्याओं तक बड़े पैमाने पर काम नहीं कर पाए।',
            'यह क्षेत्र मशीन लर्निंग के ज़रिए फिर से उभरा। 2012 में, ImageNet डेटासेट पर प्रशिक्षित AlexNet नामक एक न्यूरल नेटवर्क ने एक इमेज-पहचान प्रतियोगिता में 15.3% त्रुटि दर के साथ जीत हासिल की, जबकि अगला सबसे अच्छा परिणाम 26.2% था — इस नतीजे को व्यापक रूप से मौजूदा उछाल की शुरुआत माना जाता है, जो अधिक डेटा, अधिक शक्तिशाली ग्राफ़िक्स प्रोसेसर, और बेहतर एल्गोरिदम की वजह से संभव हुआ। इसके बाद 2017 के एक शोध पत्र, "Attention Is All You Need" ने "ट्रांसफ़ॉर्मर" आर्किटेक्चर पेश किया, जिसने आज के एआई चैटबॉट और लेखन उपकरणों को शक्ति देने वाले बहुत बड़े भाषा मॉडलों को प्रशिक्षित करना व्यावहारिक बना दिया।',
          ],
        },
        {
          heading: 'एआई के पाँच बड़े विचार',
          paragraphs: [
            'एआई शिक्षा के शोधकर्ता एआई की लगभग हर क्षमता को पाँच व्यापक श्रेणियों में बाँटते हैं, जिन्हें "एआई के पाँच बड़े विचार" कहा जाता है — यह ढाँचा AI4K12 इनिशिएटिव द्वारा विकसित किया गया है, जो AAAI और CSTA द्वारा समर्थित और नेशनल साइंस फाउंडेशन की फंडिंग वाला एआई व पढ़ाई से जुड़े शोधकर्ताओं का एक राष्ट्रीय समूह है। "परसेप्शन" (अनुभूति) यह विचार है कि कंप्यूटर कैमरों, माइक्रोफ़ोन और अन्य सेंसर के ज़रिए दुनिया को महसूस कर सकते हैं। "रिप्रेज़ेंटेशन एंड रीज़निंग" (निरूपण व तर्क) यह विचार है कि एक सिस्टम जो कुछ "जानता" है उसे किसी आंतरिक रूप में संग्रहीत करता है और उसका उपयोग निष्कर्ष निकालने के लिए करता है।',
            '"लर्निंग" (सीखना) वही विचार है जो पहले बताया गया: कंप्यूटर हर मामले के लिए स्पष्ट रूप से प्रोग्राम किए जाने के बजाय डेटा से किसी काम में बेहतर हो सकते हैं। "नैचुरल इंटरैक्शन" (स्वाभाविक बातचीत) यह विचार है कि एआई को लोगों के साथ अच्छी तरह काम करने के लिए सिर्फ कच्ची बुद्धिमत्ता से ज़्यादा कुछ चाहिए; उसे भाषा, भावना और संदर्भ को उसी तरह संभालना होगा जैसे इंसान स्वाभाविक रूप से करते हैं। "सोसाइटल इम्पैक्ट" (सामाजिक प्रभाव), पाँचवाँ विचार, यह याद दिलाता है कि हर एआई प्रणाली का असली लोगों पर असली असर पड़ता है, चाहे अच्छा हो या बुरा — यही इस कोर्स के नैतिकता मॉड्यूल का मुख्य फोकस है।',
            'इन पाँच विचारों को ध्यान में रखने से आपको लगभग किसी भी एआई उपकरण या सुर्खी को समझने के लिए एक मानसिक नक्शा मिल जाता है। आप आमतौर पर खुद से पूछ सकते हैं कि यह असल में इन पाँच में से किसके बारे में है, और सिर्फ इतना करने से ही आप इसे अधिकतर लोगों से बेहतर ढंग से परख पाएँगे।',
          ],
          checkpoint: {
            prompt: 'एक वॉइस असिस्टेंट का आपके लहजे को समझना और बातचीत की तरह जवाब देना मुख्य रूप से किस "बड़े विचार" का उदाहरण है?',
            choices: ['परसेप्शन (अनुभूति)', 'नैचुरल इंटरैक्शन (स्वाभाविक बातचीत)', 'सोसाइटल इम्पैक्ट (सामाजिक प्रभाव)'],
            explanation:
              'नैचुरल इंटरैक्शन खासतौर पर इस बारे में है कि एआई भाषा, भावना और संदर्भ को इंसानों जैसे तरीके से कैसे संभालता है: यही किसी असिस्टेंट को रोबोटिक की बजाय बातचीत जैसा महसूस कराता है।',
          },
        },
      ],
    },
    flashcards: {
      cards: [
        { term: 'नैरो एआई', definition: 'एक ही खास काम अच्छी तरह करने के लिए बनी एआई, जिसे उस काम के अलावा किसी चीज़ का भान नहीं होता: आज इस्तेमाल होने वाली लगभग सारी एआई इसी तरह की है।' },
        { term: 'जनरल एआई (एजीआई)', definition: 'एक काल्पनिक एआई जिसमें किसी भी काम में इंसानों जैसी व्यापक तर्कशक्ति हो। यह अभी तक अस्तित्व में नहीं है; यह कब या क्या कभी होगी भी, इस पर सच में बहस है।' },
        { term: 'मशीन लर्निंग', definition: 'एक तरीका जिसमें कोई सिस्टम किसी प्रोग्रामर द्वारा हाथ से लिखे नियमों का पालन करने के बजाय उदाहरण डेटा से पैटर्न सीखता है।' },
        { term: 'न्यूरल नेटवर्क', definition: 'दिमाग के न्यूरॉन्स से हल्के तौर पर प्रेरित एक मशीन लर्निंग मॉडल: परतों में जुड़ी सरल इकाइयाँ, जिनका मिला-जुला संकेत परिणाम बनाता है।' },
        { term: 'बड़ा भाषा मॉडल (एलएलएम)', definition: 'भारी मात्रा में टेक्स्ट पर प्रशिक्षित एक न्यूरल नेटवर्क, जो अगला सबसे संभावित शब्द अनुमानित करता है, और पूरे जवाब बनाने के लिए इसे बार-बार दोहराता है।' },
        { term: 'हैलुसिनेशन (भ्रम)', definition: 'जब कोई एआई मॉडल धाराप्रवाह, आत्मविश्वास से भरा लेकिन तथ्यात्मक रूप से गलत टेक्स्ट बनाता है, क्योंकि वह सत्यापित तथ्यों के बजाय प्रशंसनीय टेक्स्ट का अनुमान लगाता है।' },
        { term: 'ट्यूरिंग टेस्ट', definition: 'एलन ट्यूरिंग द्वारा 1950 में प्रस्तावित एक विचार-प्रयोग: अगर किसी मशीन की बातचीत इंसान की बातचीत से अलग नहीं पहचानी जा सके, तो वह इसे पास कर लेती है।' },
        { term: 'ट्रांसफ़ॉर्मर', definition: '2017 का एक न्यूरल नेटवर्क आर्किटेक्चर ("Attention Is All You Need"), जिसने आज के बड़े भाषा मॉडलों को प्रशिक्षित करना व्यावहारिक बना दिया।' },
      ],
    },
    video: {
      title: 'एआई की बुनियादी बातें',
      description: 'नैरो बनाम जनरल एआई, मशीन लर्निंग, और न्यूरल नेटवर्क कैसे सीखते हैं — इस पर एक संक्षिप्त व्याख्या।',
    },
    game: {
      prompt: 'हर उदाहरण को उस "बड़े विचार" में छाँटें जो वह दिखाता है।',
      buckets: ['परसेप्शन', 'रिप्रेज़ेंटेशन एंड रीज़निंग', 'लर्निंग', 'नैचुरल इंटरैक्शन', 'सोसाइटल इम्पैक्ट'],
      blastTargetIndex: 2,
      cards: [
        { text: 'फ़ोन का कैमरा एक चेहरे को पहचानकर उस पर फ़ोकस करता है', bucketIndex: 0, why: 'कैमरे के ज़रिए दुनिया को महसूस करना परसेप्शन है।' },
        { text: 'एक शतरंज इंजन बोर्ड की स्थिति संग्रहीत करता है और आगे की चालों की योजना बनाता है', bucketIndex: 1, why: 'आंतरिक ज्ञान संग्रहीत करना और उससे निष्कर्ष निकालना रिप्रेज़ेंटेशन एंड रीज़निंग है।' },
        { text: 'ज़्यादा लेबल किए उदाहरण देखने के बाद एक स्पैम फ़िल्टर बेहतर हो जाता है', bucketIndex: 2, why: 'तय नियमों की बजाय डेटा से किसी काम में बेहतर होना लर्निंग है।' },
        { text: 'एक वॉइस असिस्टेंट आपकी आवाज़ की भावना के आधार पर अपना जवाब बदलता है', bucketIndex: 3, why: 'भाषा, लहजे और संदर्भ को इंसानों जैसे तरीके से संभालना नैचुरल इंटरैक्शन है।' },
        { text: 'पता चलता है कि एक हायरिंग एल्गोरिदम कुछ आवेदकों के पक्ष में अनुचित तरीके से झुका हुआ है', bucketIndex: 4, why: 'असली लोगों पर असली असर पड़ना, चाहे अच्छा हो या बुरा, सोसाइटल इम्पैक्ट है।' },
        { text: 'एक सेल्फ़-ड्राइविंग कार का लिडार सड़क पर एक पैदल यात्री का पता लगाता है', bucketIndex: 0, why: 'लिडार जैसे सेंसर के ज़रिए दुनिया को महसूस करना परसेप्शन है।' },
        { text: 'एक मेडिकल एआई लक्षणों की तुलना संग्रहीत ज्ञान-आधार से करती है', bucketIndex: 1, why: 'संग्रहीत ज्ञान का उपयोग करके निष्कर्ष निकालना रिप्रेज़ेंटेशन एंड रीज़निंग है।' },
        { text: 'एक रिकमेंडेशन सिस्टम समय के साथ यह अनुमान लगाने में बेहतर होता जाता है कि आप क्या देखेंगे', bucketIndex: 2, why: 'अनुभव/डेटा से बेहतर होते जाना लर्निंग है।' },
      ],
    },
    quiz: {
      questions: [
        {
          prompt: 'नैरो एआई और जनरल एआई (एजीआई) के बीच मुख्य अंतर क्या है?',
          choices: [
            'नैरो एआई पुरानी तकनीक है; जनरल एआई नई है',
            'नैरो एआई एक खास काम करती है; जनरल एआई किसी भी काम में व्यापक रूप से तर्क कर पाएगी, और अभी तक अस्तित्व में नहीं है',
            'कोई असली अंतर नहीं है, ये सिर्फ मार्केटिंग शब्द हैं',
          ],
          explanation: 'आज इस्तेमाल होने वाली लगभग सारी एआई नैरो है। एजीआई एक काल्पनिक, विवादित लक्ष्य है, कोई मौजूदा प्रोडक्ट नहीं।',
        },
        {
          prompt: 'मशीन लर्निंग पारंपरिक नियम-आधारित सॉफ़्टवेयर से कैसे अलग है?',
          choices: [
            'एमएल हमेशा नियम-आधारित कोड से तेज़ होती है',
            'एमएल हाथ से लिखे नियमों का पालन करने के बजाय लेबल किए उदाहरणों से पैटर्न सीखती है',
            'एमएल केवल इमेज पर काम करती है, टेक्स्ट पर नहीं',
          ],
          explanation: 'पारंपरिक सॉफ़्टवेयर स्पष्ट "अगर X तो Y" नियमों का पालन करता है; एमएल डेटा से पैटर्न निकालती है।',
        },
        {
          prompt: 'जवाब बनाते समय एक एलएलएम असल में क्या करता है?',
          choices: [
            'सत्यापित डेटाबेस में जवाब खोजता है',
            'बार-बार आँकड़ों के हिसाब से सबसे संभावित अगले शब्द का अनुमान लगाता है',
            'कैलकुलेटर की तरह चरण-दर-चरण तर्क करता है',
          ],
          explanation: 'एलएलएम भारी मात्रा में टेक्स्ट पर प्रशिक्षित अगला-शब्द अनुमानक हैं: यही वजह है कि हैलुसिनेशन होते हैं।',
        },
        {
          prompt: 'एक चैटबॉट पूरे आत्मविश्वास से एक पूरी तरह गलत आँकड़ा बताता है। आपको क्या निष्कर्ष निकालना चाहिए?',
          choices: [
            'लहजा आत्मविश्वासी है तो यह सच ही होगा',
            'मॉडल ने हैलुसिनेट किया: आत्मविश्वासी लहजा सटीकता का सबूत नहीं है',
            'चैटबॉट जानबूझकर आपको धोखा देने की कोशिश कर रहा है',
          ],
          explanation: 'हैलुसिनेशन इसलिए होते हैं क्योंकि मॉडल में सच का कोई अंतर्निहित कॉन्सेप्ट नहीं होता, बस संभावित अगले शब्दों का अंदाज़ा होता है।',
        },
        {
          prompt: '"एआई विंटर" के नाम से जानी जाने वाली शोध मंदी का कारण क्या था?',
          choices: [
            'सरकारों ने एआई शोध पर पूरी तरह प्रतिबंध लगा दिया',
            'शुरुआती तरीके वास्तविक दुनिया की समस्याओं तक बड़े पैमाने पर काम नहीं कर पाए, और 1973 की लाइटहिल रिपोर्ट जैसी रिपोर्टों के बाद फंडिंग में कटौती हुई',
            'सभी एआई शोधकर्ता स्थायी रूप से दूसरे क्षेत्रों में चले गए',
          ],
          explanation: 'लाइटहिल रिपोर्ट की आलोचना ब्रिटेन और अमेरिका में बड़ी फंडिंग कटौती से पहले आई: यह दो एआई विंटर में से पहला था।',
        },
        {
          prompt: 'AlexNet के नतीजे के अनुसार, 2012 को एआई के लिए एक मोड़ किस वजह से माना जाता है?',
          choices: [
            'एक इमेज-पहचान प्रतियोगिता में AlexNet ने 15.3% त्रुटि दर हासिल की, जबकि अगले सबसे अच्छे प्रतिभागी की दर 26.2% थी',
            'AlexNet अब तक बनाया गया पहला चैटबॉट था',
            'AlexNet ने साबित कर दिया कि जनरल एआई हासिल हो चुकी है',
          ],
          explanation: 'यह लगभग 11 अंकों का अंतर ही वजह है कि 2012 को डीप लर्निंग के लिए मोड़ बिंदु माना जाता है।',
        },
        {
          prompt: '2017 के "Attention Is All You Need" शोध पत्र ने क्या पेश किया?',
          choices: [
            'अब तक बनाया गया पहला न्यूरल नेटवर्क',
            'ट्रांसफ़ॉर्मर आर्किटेक्चर, जिसने आज के बड़े भाषा मॉडलों को प्रशिक्षित करना व्यावहारिक बना दिया',
            'मशीन लर्निंग की अवधारणा खुद',
          ],
          explanation: 'ट्रांसफ़ॉर्मर आर्किटेक्चर आधुनिक एलएलएम के पीछे की तकनीकी नींव है।',
        },
        {
          prompt: 'AI4K12 के दूसरे "बड़े विचार" का सही, आधिकारिक नाम क्या है?',
          choices: ['रिप्रेज़ेंटेशन एंड रीज़निंग', 'रिप्रेज़ेंटेशन एंड लॉजिक', 'डेटा स्टोरेज'],
          explanation: 'AI4K12 की अपनी सामग्री में आधिकारिक नाम के रूप में "रिप्रेज़ेंटेशन एंड रीज़निंग" का इस्तेमाल किया गया है।',
        },
      ],
    },
  },
};

export const MODULE_TRANSLATIONS: Record<Exclude<Language, 'en'>, ModuleTranslations> = {
  es: ES,
  zh: ZH,
  hi: HI,
};

// Status: 'fundamentals' is fully translated (es/zh/hi). The remaining six
// modules — tools, ethics, real-world, creativity, future, sustainable —
// aren't in this file yet, so they render in English regardless of the
// selected language until they're added here (see localizeModule.ts's
// English-fallback behavior). Same structure, same three languages, one
// module at a time.
