export type Language = "en" | "gu";
export type DayCount = 1 | 2 | 3;
export type PersonKey = "meet" | "pooja";
export type EventKey =
  | "ganesh"
  | "mehendi"
  | "ring"
  | "haldi"
  | "mameru"
  | "sangeet"
  | "wedding"
  | "vidai";
export type WeekdayKey = "friday" | "saturday" | "sunday";
export type VenueKey = "tremont" | "narayani";

const ENGLISH_DAYS = {
  1: {
    dateLine: "20 September 2026",
    placeLine: "Narayani Heights",
    openingNote: "One day of love · One beautiful beginning",
    eventCopy: "One beautiful day of celebration, laughter, and love.",
    invitationCopy: "You are warmly invited to celebrate with us on Sunday, 20 September.",
    countdownLabel: "Sunday · 20 September",
  },
  2: {
    dateLine: "19 — 20 September 2026",
    placeLine: "Narayani Heights",
    openingNote: "Two days of love · One beautiful beginning",
    eventCopy: "Two days of tradition, music, laughter, and love.",
    invitationCopy: "You are warmly invited for Saturday and Sunday, 19–20 September.",
    countdownLabel: "Saturday · 19 September · 09:30 AM",
  },
  3: {
    dateLine: "18 — 20 September 2026",
    placeLine: "Tremont · Narayani Heights",
    openingNote: "Three days of love · One beautiful beginning",
    eventCopy: "Three days of tradition, music, laughter, and love.",
    invitationCopy: "You are warmly invited for the complete celebration, 18–20 September.",
    countdownLabel: "Friday · 18 September",
  },
} as const;

const GUJARATI_DAYS = {
  1: {
    dateLine: "20 સપ્ટેમ્બર 2026",
    placeLine: "નારાયણી હાઇટ્સ",
    openingNote: "પ્રેમનો એક દિવસ · એક સુંદર શરૂઆત",
    eventCopy: "ઉજવણી, હાસ્ય અને પ્રેમથી ભરેલો એક સુંદર દિવસ.",
    invitationCopy: "રવિવાર, 20 સપ્ટેમ્બરના રોજ અમારી સાથે ઉજવણી કરવા આપને હાર્દિક આમંત્રણ.",
    countdownLabel: "રવિવાર · 20 સપ્ટેમ્બર",
  },
  2: {
    dateLine: "19 — 20 સપ્ટેમ્બર 2026",
    placeLine: "નારાયણી હાઇટ્સ",
    openingNote: "પ્રેમના બે દિવસ · એક સુંદર શરૂઆત",
    eventCopy: "પરંપરા, સંગીત, હાસ્ય અને પ્રેમથી ભરેલા બે દિવસ.",
    invitationCopy: "શનિવાર અને રવિવાર, 19–20 સપ્ટેમ્બરની ઉજવણીમાં આપને હાર્દિક આમંત્રણ.",
    countdownLabel: "શનિવાર · 19 સપ્ટેમ્બર · સવારે 09:30",
  },
  3: {
    dateLine: "18 — 20 સપ્ટેમ્બર 2026",
    placeLine: "ટ્રેમોન્ટ · નારાયણી હાઇટ્સ",
    openingNote: "પ્રેમના ત્રણ દિવસ · એક સુંદર શરૂઆત",
    eventCopy: "પરંપરા, સંગીત, હાસ્ય અને પ્રેમથી ભરેલા ત્રણ દિવસ.",
    invitationCopy: "18–20 સપ્ટેમ્બરની સંપૂર્ણ ઉજવણીમાં આપને હાર્દિક આમંત્રણ.",
    countdownLabel: "શુક્રવાર · 18 સપ્ટેમ્બર",
  },
} as const;

export const COPY = {
  en: {
    names: { meet: "Meet", pooja: "Pooja" },
    days: ENGLISH_DAYS,
    targetLanguage: "ગુજરાતી",
    switchLanguage: "Switch language to Gujarati",
    celebrationAwaits: "A celebration awaits",
    omShantiAlt: "OM SHANTI blessing symbol",
    ganeshBlessingAlt: "Ganeshji blessing symbol",
    ganeshInvocation: "॥ श्री गणेशाय नमः ॥",
    familyLine: "Together with their families",
    month: "September",
    tapPull: "Tap to pull the ribbon",
    pullingRibbon: "Pulling the satin ribbon",
    openingInvitation: "Opening your invitation",
    tapContinue: "Tap or swipe to continue",
    openInvitation: (first: string, second: string) =>
      `Pull the satin ribbon and open ${first} and ${second}'s wedding invitation`,
    explore: "Explore our celebration",
    exploreAria: "Explore the invitation",
    chapter: "A new chapter",
    storyLineOne: "Two hearts,",
    storyLineTwo: "one beautiful forever.",
    storyPooja:
      "Mrs. Dharmishtha and Mr. Ketan Modi request the pleasure of your gracious presence as their beloved daughter Pooja celebrates her wedding with Meet.",
    storyMeet:
      "Together with their families, Meet and Pooja request the pleasure of your gracious presence as they celebrate their wedding.",
    presence: "Your presence will make our joy complete.",
    personalAria: "Your invitation details",
    especially: "Especially for you",
    guestOne: "This invitation is lovingly reserved for one guest.",
    guestMany: (count: number) =>
      `This invitation is lovingly reserved for ${count} guests.`,
    venueAria: "Narayani Heights wedding venue",
    venueKicker: "The celebration venue",
    narayani: "Narayani",
    heights: "Heights",
    venueDescription:
      "Lush green lawns, grand gathering spaces, and an evening made for celebration.",
    countdownAria: "Wedding countdown",
    countdownKicker: "Counting every moment",
    countdownHeading: "Until we celebrate",
    countdownUnits: ["Days", "Hours", "Minutes", "Seconds"],
    weekend: "The wedding weekend",
    celebrate: "Celebrate with us",
    meetEventCopy:
      "On the auspicious day of Bhadarva Nom, Vikram Samvat 2082 — Sunday, 20 September 2026.",
    meetGaneshTitleLines: ["Arrival of Vighnaharta", "and Grah Shanti"],
    meetGaneshTime: "08:00 AM",
    weekdays: { friday: "Friday", saturday: "Saturday", sunday: "Sunday" },
    eventTitles: {
      ganesh: "Ganesh Sthapan · Mandap Muhurat · Grah Shanti",
      mehendi: "Mehendi",
      ring: "Ring Ceremony",
      haldi: "Haldi",
      mameru: "Mameru",
      sangeet: "Sangeet",
      wedding: "Wedding Ceremony",
      vidai: "Vidai",
    },
    ganeshTitleLines: ["Ganesh Sthapan", "Mandap Muhurat", "Grah Shanti"],
    eventTimes: {
      ganesh: "08:00 AM",
      mehendi: "An afternoon of henna & happiness",
      ring: "09:30 AM",
      haldi: "11:00 AM",
      mameru: "03:00 PM",
      sangeet: "07:30 PM",
      wedding: "",
      vidai: "03:00 PM",
    },
    lunchTitle: "Lunch",
    lunchTime: "12:30 PM",
    dinnerTitle: "Dinner",
    dinnerTime: "08:00 PM",
    hastaMelapTitle: "Hast Melap",
    hastaMelapTime: "11:00 AM",
    venues: {
      tremont: "B.1302, Tremont, Vaishnodevi Circle, Ahmedabad, Gujarat 382421",
      narayani: "Narayani Heights, Airport-Gandhinagar Road, Bhat, Ahmedabad, Gujarat 382428",
    },
    weds: (first: string, second: string) => `${first} weds ${second}`,
    directions: "Open directions",
    withLove: "With love",
    closingLineOne: "We cannot wait",
    closingLineTwo: "to celebrate with you.",
    shareInvitation: "Share the invitation",
    share: "Share",
    shareAria: "Share this invitation",
    invitationShared: "Invitation shared",
    linkCopied: "Link copied",
    shareFromBrowser: "Share this page from your browser",
    complimentsAria: "Best compliments from Pooja's family",
    complimentsKicker: "Our family",
    complimentsHeading: "With Best Compliments From",
    youngerFamilyAria: "With love from Devyanshi, Naisha, Dhruv, Roohani, and Radhika",
    shareTitle: (first: string, second: string) =>
      `${first} & ${second} — Wedding Invitation`,
    shareText: (first: string, second: string, date: string) =>
      `Join us as ${first} and ${second} begin their forever, ${date}.`,
  },
  gu: {
    names: { meet: "મીત", pooja: "પૂજા" },
    days: GUJARATI_DAYS,
    targetLanguage: "English",
    switchLanguage: "ભાષા English પર બદલો",
    celebrationAwaits: "ઉત્સવ તમારી રાહ જુએ છે",
    omShantiAlt: "OM SHANTI નું શુભ પ્રતીક",
    ganeshBlessingAlt: "ગણેશજીનું શુભ પ્રતીક",
    ganeshInvocation: "॥ श्री गणेशाय नमः ॥",
    familyLine: "બંને પરિવારોના આશીર્વાદ સાથે",
    month: "સપ્ટેમ્બર",
    tapPull: "રિબન ખોલવા માટે ટૅપ કરો",
    pullingRibbon: "સાટિન રિબન ખૂલી રહી છે",
    openingInvitation: "આમંત્રણ ખૂલી રહ્યું છે",
    tapContinue: "આગળ વધવા ટૅપ અથવા સ્વાઇપ કરો",
    openInvitation: (first: string, second: string) =>
      `${first} અને ${second}નું લગ્ન આમંત્રણ ખોલવા સાટિન રિબન પર ટૅપ કરો`,
    explore: "અમારી ઉજવણી નિહાળો",
    exploreAria: "આમંત્રણ નિહાળો",
    chapter: "એક નવી શરૂઆત",
    storyLineOne: "બે હૃદય,",
    storyLineTwo: "એક સુંદર સદાકાળ.",
    storyPooja:
      "શ્રીમતી ધર્મિષ્ઠા અને શ્રી કેતન મોદી તેમની લાડકી પુત્રી પૂજાના મીત સાથેના શુભ લગ્ન પ્રસંગે આપની સ્નેહસભર ઉપસ્થિતિની અભિલાષા રાખે છે.",
    storyMeet:
      "બંને પરિવારો સાથે, મીત અને પૂજા તેમના શુભ લગ્ન પ્રસંગે આપની સ્નેહસભર ઉપસ્થિતિની અભિલાષા રાખે છે.",
    presence: "આપની ઉપસ્થિતિ અમારા આનંદને પૂર્ણ કરશે.",
    personalAria: "આપના આમંત્રણની વિગતો",
    especially: "ખાસ આપના માટે",
    guestOne: "આપનું સહર્ષ સ્વાગત છે.",
    guestMany: (count: number) =>
      `આપ સહિત કુલ ${count} મહેમાનોનું સહર્ષ સ્વાગત છે.`,
    venueAria: "નારાયણી હાઇટ્સ લગ્ન સ્થળ",
    venueKicker: "ઉજવણીનું સ્થળ",
    narayani: "નારાયણી",
    heights: "હાઇટ્સ",
    venueDescription:
      "હરિયાળી લૉન, ભવ્ય સમારંભ સ્થળો અને યાદગાર ઉજવણી માટેનું સુંદર વાતાવરણ.",
    countdownAria: "લગ્નની ઊલટી ગણતરી",
    countdownKicker: "દરેક પળની ગણતરી",
    countdownHeading: "ઉજવણી સુધી",
    countdownUnits: ["દિવસ", "કલાક", "મિનિટ", "સેકન્ડ"],
    weekend: "લગ્નોત્સવ",
    celebrate: "અમારી સાથે ઉજવો",
    meetEventCopy:
      "વિક્રમ સંવત 2082ના ભાદરવાના નોમ, રવિવાર, 20/09/2026ના શુભ દિવસે શુભ મુહૂર્ત.",
    meetGaneshTitleLines: ["વિઘ્નહર્તાનું આગમન", "તથા ગ્રહ શાંતિ"],
    meetGaneshTime: "સવારે 08:00 કલાકે",
    weekdays: { friday: "શુક્રવાર", saturday: "શનિવાર", sunday: "રવિવાર" },
    eventTitles: {
      ganesh: "ગણેશ સ્થાપન · મંડપ મુહૂર્ત · ગ્રહ શાંતિ",
      mehendi: "મહેંદી",
      ring: "સગાઈ",
      haldi: "હલ્દી",
      mameru: "મામેરું",
      sangeet: "સંગીત સંધ્યા",
      wedding: "લગ્નવિધિ",
      vidai: "વિદાય",
    },
    ganeshTitleLines: ["ગણેશ સ્થાપન", "મંડપ મુહૂર્ત", "ગ્રહ શાંતિ"],
    eventTimes: {
      ganesh: "સવારે 08:00",
      mehendi: "મહેંદી",
      ring: "સવારે 09:30",
      haldi: "સવારે 11:00",
      mameru: "બપોરે 03:00",
      sangeet: "સાંજે 07:30",
      wedding: "",
      vidai: "બપોરે 03:00",
    },
    lunchTitle: "બપોરનું ભોજન",
    lunchTime: "બપોરે 12:30",
    dinnerTitle: "રાત્રિભોજન",
    dinnerTime: "રાત્રે 08:00",
    hastaMelapTitle: "હસ્ત મેળાપ",
    hastaMelapTime: "સવારે 11:00",
    venues: {
      tremont: "બી-1302, ટ્રેમોન્ટ, વૈષ્ણોદેવી સર્કલ, અમદાવાદ, ગુજરાત 382421",
      narayani: "નારાયણી હાઇટ્સ, એરપોર્ટ-ગાંધીનગર રોડ, ભાટ, અમદાવાદ, ગુજરાત 382428",
    },
    weds: (first: string, second: string) =>
      `${first} અને ${second}ના શુભ લગ્ન`,
    directions: "માર્ગદર્શન ખોલો",
    withLove: "સ્નેહ સાથે",
    closingLineOne: "તમારી સાથે ઉજવણી કરવા",
    closingLineTwo: "અમે આતુર છીએ.",
    shareInvitation: "આમંત્રણ શેર કરો",
    share: "શેર",
    shareAria: "આ આમંત્રણ શેર કરો",
    invitationShared: "આમંત્રણ શેર થયું",
    linkCopied: "લિંક કૉપી થઈ",
    shareFromBrowser: "કૃપા કરીને બ્રાઉઝરમાંથી આ પેજ શેર કરો",
    complimentsAria: "પૂજાના પરિવાર તરફથી શુભેચ્છાઓ",
    complimentsKicker: "અમારો પરિવાર",
    complimentsHeading: "શુભેચ્છા સહ",
    youngerFamilyAria: "દેવ્યાંશી, નાયશા, ધ્રુવ, રૂહાની અને રાધિકા તરફથી સ્નેહ સહ",
    shareTitle: (first: string, second: string) =>
      `${first} & ${second} — લગ્ન આમંત્રણ`,
    shareText: (first: string, second: string, date: string) =>
      `${first} અને ${second}ના શુભ લગ્ન પ્રસંગે અમારી સાથે જોડાઓ, ${date}.`,
  },
} as const;
