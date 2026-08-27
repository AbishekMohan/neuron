// Deliberately scoped translation: the main nav labels and the homepage's
// headline, the things a visitor sees before they've picked a module, not
// the full course. Accurately translating every lesson would need a real
// translation pipeline and review, not a hand-authored dictionary; this
// covers "navigation and key headings" honestly instead of overclaiming
// full localization.

export type Language = 'en' | 'es' | 'zh' | 'hi';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export type TranslationKey =
  | 'nav.home'
  | 'nav.modules'
  | 'nav.companion'
  | 'nav.challenges'
  | 'nav.leaderboard'
  | 'nav.dashboard'
  | 'nav.reference'
  | 'nav.myProfile'
  | 'hero.line1'
  | 'hero.line2'
  | 'hero.line3'
  | 'hero.subtitle'
  | 'hero.startLearning'
  | 'hero.seeSources'
  | 'settings.accessibility'
  | 'settings.lightMode'
  | 'settings.lightModeHint'
  | 'settings.highContrast'
  | 'settings.highContrastHint'
  | 'settings.dyslexiaFont'
  | 'settings.dyslexiaFontHint'
  | 'settings.language'
  | 'settings.languageHint'
  | 'settings.screenReader'
  | 'settings.screenReaderGuideLink';

const DICT: Record<TranslationKey, Record<Language, string>> = {
  'nav.home': { en: 'Home', es: 'Inicio', zh: '首页', hi: 'होम' },
  'nav.modules': { en: 'Modules', es: 'Módulos', zh: '模块', hi: 'मॉड्यूल' },
  'nav.companion': { en: 'Companion', es: 'Compañero', zh: 'AI 伙伴', hi: 'साथी' },
  'nav.challenges': { en: 'Challenges', es: 'Desafíos', zh: '挑战', hi: 'चुनौतियाँ' },
  'nav.leaderboard': { en: 'Leaderboard', es: 'Clasificación', zh: '排行榜', hi: 'लीडरबोर्ड' },
  'nav.dashboard': { en: 'Dashboard', es: 'Panel', zh: '仪表盘', hi: 'डैशबोर्ड' },
  'nav.reference': { en: 'Reference', es: 'Referencia', zh: '参考资料', hi: 'संदर्भ' },
  'nav.myProfile': { en: 'My Profile', es: 'Mi perfil', zh: '我的资料', hi: 'मेरी प्रोफ़ाइल' },

  'hero.line1': { en: 'Understand AI.', es: 'Comprende la IA.', zh: '理解人工智能。', hi: 'एआई को समझें।' },
  'hero.line2': { en: 'Use it wisely.', es: 'Úsala con sabiduría.', zh: '明智地使用它。', hi: 'इसका समझदारी से उपयोग करें।' },
  'hero.line3': { en: 'Think critically.', es: 'Piensa críticamente.', zh: '批判性思考。', hi: 'आलोचनात्मक रूप से सोचें।' },
  'hero.subtitle': {
    en: 'A free, interactive AI literacy course for high school students, covering the fundamentals, practical tools, and ethical use. No coding or prior experience required.',
    es: 'Un curso gratuito e interactivo de alfabetización en IA para estudiantes de secundaria, que cubre los fundamentos, herramientas prácticas y el uso ético. No se requiere programación ni experiencia previa.',
    zh: '一门面向高中生的免费互动式人工智能素养课程,涵盖基础知识、实用工具和道德使用。无需编程或事先经验。',
    hi: 'हाई स्कूल के छात्रों के लिए एक मुफ़्त, इंटरैक्टिव एआई साक्षरता कोर्स, जिसमें बुनियादी बातें, व्यावहारिक उपकरण और नैतिक उपयोग शामिल हैं। किसी कोडिंग या पूर्व अनुभव की आवश्यकता नहीं है।',
  },
  'hero.startLearning': { en: 'Start Learning', es: 'Empezar a aprender', zh: '开始学习', hi: 'सीखना शुरू करें' },
  'hero.seeSources': { en: 'See our sources', es: 'Ver nuestras fuentes', zh: '查看我们的资料来源', hi: 'हमारे स्रोत देखें' },

  'settings.accessibility': { en: 'Accessibility', es: 'Accesibilidad', zh: '无障碍功能', hi: 'सुगम्यता' },
  'settings.lightMode': { en: 'Light Mode', es: 'Modo claro', zh: '浅色模式', hi: 'लाइट मोड' },
  'settings.lightModeHint': {
    en: 'A light background instead of the default dark theme.',
    es: 'Un fondo claro en lugar del tema oscuro predeterminado.',
    zh: '使用浅色背景,而不是默认的深色主题。',
    hi: 'डिफ़ॉल्ट डार्क थीम की जगह हल्की पृष्ठभूमि।',
  },
  'settings.highContrast': { en: 'High Contrast Mode', es: 'Modo de alto contraste', zh: '高对比度模式', hi: 'हाई कॉन्ट्रास्ट मोड' },
  'settings.highContrastHint': {
    en: 'Brightens dim text and faint borders across the site.',
    es: 'Aclara el texto tenue y los bordes débiles en todo el sitio.',
    zh: '让全站的暗淡文字和边框更清晰。',
    hi: 'साइट भर में हल्के टेक्स्ट और बॉर्डर को उज्जवल करता है।',
  },
  'settings.dyslexiaFont': { en: 'Dyslexia-Friendly Font', es: 'Fuente apta para dislexia', zh: '阅读障碍友好字体', hi: 'डिस्लेक्सिया-अनुकूल फ़ॉन्ट' },
  'settings.dyslexiaFontHint': {
    en: 'Switches body text to Lexend, a typeface studied for reading proficiency.',
    es: 'Cambia el texto a Lexend, una tipografía estudiada por mejorar la lectura.',
    zh: '将正文字体切换为 Lexend,一种经过阅读能力研究的字体。',
    hi: 'मुख्य टेक्स्ट को Lexend में बदलता है, जो पठन दक्षता के लिए अध्ययन किया गया फ़ॉन्ट है।',
  },
  'settings.language': { en: 'Language', es: 'Idioma', zh: '语言', hi: 'भाषा' },
  'settings.languageHint': {
    en: 'Choose the language for navigation and key headings.',
    es: 'Elige el idioma para la navegación y los títulos principales.',
    zh: '选择导航和主要标题使用的语言。',
    hi: 'नेविगेशन और मुख्य शीर्षकों के लिए भाषा चुनें।',
  },
  'settings.screenReader': { en: 'Screen Reader Instructions', es: 'Instrucciones para lectores de pantalla', zh: '屏幕阅读器使用说明', hi: 'स्क्रीन रीडर निर्देश' },
  'settings.screenReaderGuideLink': {
    en: 'Full screen reader & keyboard guide →',
    es: 'Guía completa de lector de pantalla y teclado →',
    zh: '完整的屏幕阅读器与键盘指南 →',
    hi: 'पूरी स्क्रीन रीडर और कीबोर्ड गाइड →',
  },
};

export function translate(key: TranslationKey, language: Language): string {
  return DICT[key][language] ?? DICT[key].en;
}
