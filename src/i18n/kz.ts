import type { Messages } from './en'
import { assessmentKz } from './assessmentKz'
import { careersKz } from './careersKz'
import { exploreKz } from './exploreKz'
import { mentorKz } from './mentorKz'
import { profileKz } from './profileKz'

export const kz: Messages = {
  common: {
    skip: 'Мазмұнға өту',
    startJourney: 'Жолыңды баста',
    exploreCareers: 'Мамандықтарды зертте',
    language: 'Тіл',
    openMenu: 'Мәзірді ашу',
    closeMenu: 'Мәзірді жабу',
    logoHome: 'NEXORA — басты бет',
    laterStage: 'Келесі кезеңде пайда болады',
    skills: 'Дағдылар',
  },
  nav: {
    home: 'Басты бет',
    discover: 'Өзіңді таны',
    assessment: 'Бағалау',
    profile: 'Профилім',
    explore: 'Мамандықтар',
    path: 'Жолым',
    mentor: 'AI кеңесші',
    projects: 'Жобалар',
  },
  footer: {
    tagline: 'Дағдыларың. Болашағың. Келесі қадамың.',
    note: 'AI зерттеуге көмектеседі. Шешім өзіңде қалады.',
    home: 'Басты бет',
    assessment: 'Бағалау',
    explore: 'Мамандықтар',
    profile: 'Профилім',
    path: 'Жолым',
    mentor: 'AI кеңесші',
    projects: 'Жобалар',
  },
  meta: {
    homeTitle: 'NEXORA — Дағдыларың. Болашағың. Келесі қадамың.',
    pageTitle: '{page} — NEXORA',
  },
  pages: {
    home: { title: 'Басты бет' },
    assessment: {
      title: 'Бағалау',
      kicker: 'Өзіңді таны',
      heading: 'Бағалау',
      description:
        'Мұнда қызығушылықтар мен мықты жақтарың жиналады. Бағалау процесі әзірге іске қосылмаған.',
    },
    profile: {
      title: 'Профилім',
      kicker: 'Профиль',
      heading: 'Профилім',
      description: 'NEXORA бағалауына негізделген жеке үзінді.',
    },
    explore: {
      title: 'Мамандықтар',
      kicker: exploreKz.kicker,
      heading: exploreKz.heading,
      description: exploreKz.lede,
    },
    skillGap: {
      title: 'Дағдылар',
      kicker: 'Дағдылар',
      heading: 'Дағды олқылықтары',
      description: 'Кейін мұнда не үйрену керегі көрінеді. Есептеу әзірге жоқ.',
    },
    roadmap: {
      title: 'Жол картасы',
      kicker: 'Жолым',
      heading: 'Жол картасы',
      description: 'Бүгіннен келесі қадамға дейінгі жоспар кейінірек пайда болады.',
    },
    mentor: {
      title: 'AI кеңесші',
      kicker: mentorKz.kicker,
      heading: mentorKz.heading,
      description: mentorKz.lede,
    },
    projects: {
      title: 'Жобалар',
      kicker: 'Жобалар',
      heading: 'Жобалар',
      description: 'Практикалық жұмыстар кейінірек шығады. Қазір тек құрылым.',
    },
  },
  home: {
    hero: {
      eyebrow: 'Мансап интеллекті',
      wordmark: 'NEXORA',
      heading: 'Дағдыларың. Болашағың. Келесі қадамың.',
      lede: 'Мықты жақтарыңды таны, мүмкіндіктерді көр және алға жылжытатын дағдыларды тап.',
      ctaPrimary: 'Жолыңды баста',
    },
    viz: {
      skills: 'Шығармашылық',
      creativity: 'Шығармашылық',
      communication: 'Коммуникация',
      communicationValue: 'Айқын',
      analytical: 'Талдау',
      profile: 'Профиль сигналы',
      persona: 'Креативті стратег',
      personaHint: 'Үлгі фрагмент',
      direction: 'AI және бизнес',
      directionValue: 'AI және бизнес',
      alignment: 'Сәйкестік үлгісі',
      growth: 'Дағды өсімі',
      growthHint: 'Үлгі көрсеткіш',
      caption: 'Интерфейс үлгісі — нақты дерек емес',
    },
    trust: {
      heading: 'Мансапты зерттеу өзгеруде.',
      support:
        'AI нұсқаларды көруге көмектеседі. NEXORA сол түсінікті әрекетке айналдырады.',
    },
    journey: {
      kicker: 'Жол',
      title: 'Белгісіздіктен айқындыққа.',
      lede: 'NEXORA болашақ туралы бұлдыр сұрақты нақты келесі қадамға айналдырады.',
      stages: [
        {
          title: 'Қызығушылық',
          copy: 'Не тартатынын ата — сұрақ, сала және назарыңды ұстайтын жұмыс.',
        },
        {
          title: 'Мықты жақтар',
          copy: 'Қалай ойлайтының, жасайтының және бірге жұмыс істейтініңдегі тақырыптарды көр.',
        },
        {
          title: 'Зерттеу',
          copy: 'Қазіргі NEXORA профиліңмен байланысатын мансап салаларын салыстыр.',
        },
        {
          title: 'Келесі қадам',
          copy: 'Профильді кеңесшімен әңгімеге айналдыр — түпкілікті үкім емес.',
        },
      ],
    },
    careers: {
      kicker: 'Бағыттар',
      title: 'Мүмкіндікті зертте.',
      lede: 'Мансап енді бір ғана лауазыммен шектелмейді. Салаларды, дағдыларды және мүмкіндіктерді қара.',
      skillsLabel: 'Дағдылар',
      impactLabel: 'AI әсері',
      impactNote: 'Үлгі белгі',
      cards: {
        business: {
          field: 'Бизнес',
          line: 'Құр. Басқар. Өсір.',
          skills: 'Стратегия · Көшбасшылық · Қаржы',
          impact: 'Жоғары',
        },
        tech: {
          field: 'AI + технология',
          line: 'Келесіні құр.',
          skills: 'AI · Дерек · Технология',
          impact: 'Өте жоғары',
        },
        marketing: {
          field: 'Маркетинг',
          line: 'Түсін. Құра. Әсер ет.',
          skills: 'Коммуникация · Шығармашылық · Талдау',
          impact: 'Жоғары',
        },
        creative: {
          field: 'Креатив',
          line: 'Идеяны тәжірибеге айналдыр.',
          skills: 'Дизайн · Әңгімелеу · Шығармашылық',
          impact: 'Жоғары',
        },
        finance: {
          field: 'Қаржы',
          line: 'Құн қалай қозғалатынын түсін.',
          skills: 'Талдау · Экономика · Шешім',
          impact: 'Жоғары',
        },
      },
    },
    skills: {
      kicker: 'Қабілет',
      title: 'Бастау нүктесі — дағдылар.',
      lede: 'Болашақ тек мамандық таңдау емес. Бұл мүмкіндіктер арасында қозғалуға көмектесетін дағдыларды да жинау.',
      caption: 'Дағды картасының үлгісі — жеке нәтиже емес',
      items: {
        communication: 'Коммуникация',
        creativity: 'Шығармашылық',
        leadership: 'Көшбасшылық',
        analytical: 'Аналитикалық ойлау',
        adaptability: 'Бейімделгіштік',
        digital: 'Цифрлық дағдылар',
      },
    },
    roadmap: {
      kicker: 'Жол картасы',
      title: 'Бағытты әрекетке айналдыр.',
      lede: 'Не зерттейтінің анық болғанда, NEXORA оны 30 күндік нақты жоспарға жинауға көмектеседі.',
      caption: 'Визуалды үлгі — жоспар әзірге жасалмайды.',
      days: {
        d01: { day: '01-күн', title: 'Түсін' },
        d07: { day: '07-күн', title: 'Жаттығу' },
        d14: { day: '14-күн', title: 'Құрастыр' },
        d30: { day: '30-күн', title: 'Қолдан' },
      },
    },
    mentor: {
      kicker: 'Бағыт-бағдар',
      title: 'AI кеңесшіңмен таныс.',
      lede: 'Сұрақ қой, идеяларыңды тексер және қызығушылығың, дағдыларың мен мақсатың бойынша бағдар ал.',
      idea: 'Профиль — тек нәтиже емес. Оны кеңесшімен зерттеуге болады.',
      prompts: [
        'Мықты жақтарыма қандай мамандық жақын?',
        'Келесі не зерттеуге болады?',
        'Қандай дағдыны дамытуға болады?',
      ],
      open: 'AI кеңесшіні аш',
      context: 'Контекст',
      profileLabel: 'Профиль',
      profileValue: 'Креативті стратег',
      exploringLabel: 'Зерттеп жүр',
      exploringValue: 'Бизнес + AI',
      focusLabel: 'Фокус',
      focusValue: 'Аналитикалық ойлау',
      exchange: 'Үлгі әңгіме',
      you: 'Сен',
      mentor: 'Кеңесші',
      userMessage: 'Маған бизнес пен технология ұнайды. Нені зерттеуге болады?',
      mentorMessage:
        'Стратегия мен технология түйісетін жерден баста — өнім менеджменті, бизнес-аналитика немесе AI төңірегіндегі кәсіпкерлік.',
    },
    projects: {
      kicker: 'Практика',
      title: 'Тек зерттеме. Құрастыр.',
      lede: 'Қызығушылығыңды нақты нәрсеге айналдыр.',
      caption: 'Үлгі брифтер — дайын жұмыс емес.',
      skillsLabel: 'Дағдылар',
      items: {
        p01: {
          field: 'AI + бизнес',
          title: 'Студенттер кездесетін мәселеге AI шешімін ойластыр.',
          skills: 'Зерттеу · Стратегия · AI',
        },
        p02: {
          field: 'Маркетинг',
          title: 'Сенетін өнімге науқан құрастыр.',
          skills: 'Шығармашылық · Коммуникация · Талдау',
        },
        p03: {
          field: 'Дерек',
          title: 'Нақты сұрақ алып, деректен қорытынды шығар.',
          skills: 'Талдау · Зерттеу · Визуализация',
        },
      },
    },
    cta: {
      kicker: 'Бастау',
      title: 'Келесі қадамың осы жерден басталады.',
      lede: 'Бүкіл болашақты қазір білудің қажеті жоқ. Бастайтын жер болса жеткілікті.',
    },
  },
  assessment: assessmentKz,
  profile: profileKz,
  explore: exploreKz,
  careers: careersKz,
  mentor: mentorKz,
}
