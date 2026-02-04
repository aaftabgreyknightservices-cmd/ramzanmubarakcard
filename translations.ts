
export type Language = 'en' | 'ur' | 'ru' | 'ar' | 'hi';

export const translations = {
  en: {
    hero: {
      badge: "Spreading Goodness Worldwide",
      titlePre: "Ramzan is",
      titleHighlight: "Coming Soon 🌙",
      subtitle: "Create a Personalized Dua Card. One Tap to Share. Infinite Blessings.",
      cta: "Create My Gift Card"
    },
    countdown: {
      dates: "Evening of Tue, 17 Feb – Thu, 19 Mar, 2026",
      label: "The Sacred Month Approaches",
      days: "Days",
      hours: "Hours",
      mins: "Mins",
      secs: "Secs",
      cards: [
        { title: "The Warm-Up", desc: "Approaching Sha’ban. The warm-up month before the marathon." },
        { title: "Build Habits", desc: "Start fasting voluntarily and setting your Quran goals today." },
        { title: "Quick Takeaway", desc: "Ramzan 2026 expected Feb 17. Prepare your heart now." }
      ],
      dua: "\"O Allah, let us reach Ramzan.\""
    },
    builder: {
      title: "Manifest Your Blessing 🌙",
      subtitle: "\"Words are the wings of the soul.\"",
      inputs: {
        fromLabel: "Sign Your Masterpiece",
        fromPlaceholder: "Type Name Here...",
        fromHelp: "This will appear as the sender on the golden card",
        wishLabel: "Your Heartfelt Wish",
        wishPlaceholder: "May this Ramzan bring you peace...",
        browse: "Browse Wishes",
        themeLabel: "Visual Theme",
        blessingTitle: "Soul-Touch Blessing",
        blessingDesc: "Add a curated spiritual Dua",
        findBlessing: "Find Blessing"
      },
      action: {
        generate: "Create Universal Link",
        generating: "Crafting Magic...",
        ready: "Universal Card Ready! 🎁",
        quote: "\"Goodness shared is goodness multiplied.\"",
        whatsapp: "Share on WhatsApp",
        download: "Download Card"
      },
      card: {
        season: "Holy Ramzan 2026",
        greeting: "Ramzan Mubarak",
        specialFor: "A Special Dua For",
        you: "You",
        withLove: "With Pure Heart,"
      }
    },
    receiver: {
      arrived: "Blessing Arrived",
      wait: "A soul message waits for you",
      unlocked: "Holy Gift Unlocked",
      open: "Tap Seal to Open",
      soundOn: "Sound On",
      playMusic: "Play Music",
      sayAmeen: "Say Ameen",
      ameenSaid: "Ameen Said",
      createMine: "Create Mine"
    },
    // IMPORTANT: These must match types.ts PRESET_WISHES exactly for compression to work.
    wishes: [
      "May this Ramzan bring you peace, joy, and endless blessings, keeping you in my duas.",
      "May this Ramzan shine the light of guidance in your home and your heart forever.",
      "May this Ramzan fill your month with mercy and your heart with profound gratitude.",
      "May this Ramzan be the month Allah accepts your fasts and answers your secret prayers.",
      "May this Ramzan turn your heart into a vessel of Noor and fill your days with Barakah.",
      "May this Ramzan heal what is broken within you and strengthen what is weak.",
      "May this Ramzan bring you strength in every suhoor and peace in every iftar.",
      "May this Ramzan become the beautiful turning point you have been waiting for.",
      "May this Ramzan open the gates of Heaven for you and ensure the gates of Mercy never close.",
      "May this Ramzan grant you 30 days of clemency, 720 hours of enlightenment, and 43,200 minutes of joy."
    ],
    blessings: [
        "May the light of this month find the cracks in your heart and fill them with unshakeable peace.",
        "I pray that every silent struggle you carry is answered with a mercy so vast it brings you to tears of joy.",
        "May your home be a sanctuary where angels love to visit and where love is the only language spoken.",
        "I asked Allah today to protect your smile and grant you the kind of serenity that the world can't take away.",
        "May your fasts be a shield for your soul and your prayers a bridge to everything your heart desires."
    ]
  },
  ur: {
    hero: {
      badge: "دنیا بھر میں خیر پھیلا رہے ہیں",
      titlePre: "رمضان",
      titleHighlight: "کی آمد ہے 🌙",
      subtitle: "اپنی ذاتی دعا کارڈ بنائیں۔ ایک کلک میں شیئر کریں۔ بے انتہا برکتیں۔",
      cta: "اپنا تحفہ کارڈ بنائیں"
    },
    countdown: {
      dates: "شام منگل، 17 فروری – جمعرات، 19 مارچ، 2026",
      label: "مقدس مہینہ قریب ہے",
      days: "دن",
      hours: "گھنٹے",
      mins: "منٹ",
      secs: "سیکنڈ",
      cards: [
        { title: "تیاری کا وقت", desc: "شعبان قریب ہے۔ رمضان کی میراتھن سے پہلے کا وارم اپ مہینہ۔" },
        { title: "عادات بنائیں", desc: "آج ہی سے نفل روزے اور قرآن کے اہداف مقرر کریں۔" },
        { title: "مختصر پیغام", desc: "رمضان 2026 متوقع 17 فروری۔ ابھی سے اپنے دل کو تیار کریں۔" }
      ],
      dua: "\"اے اللہ، ہمیں رمضان تک پہنچا دے۔\""
    },
    builder: {
      title: "اپنی برکتوں کو حقیقت بنائیں 🌙",
      subtitle: "\"الفاظ روح کے پر ہوتے ہیں۔\"",
      inputs: {
        fromLabel: "اپنا نام لکھیں",
        fromPlaceholder: "نام یہاں ٹائپ کریں...",
        fromHelp: "یہ نام سنہری کارڈ پر بھیجنے والے کے طور پر ظاہر ہوگا",
        wishLabel: "آپ کی دلی دعا",
        wishPlaceholder: "خدا کرے یہ رمضان آپ کے لیے سکون لائے...",
        browse: "دعائیں دیکھیں",
        themeLabel: "بصری تھیم",
        blessingTitle: "روحانی دعا",
        blessingDesc: "ایک منتخب روحانی دعا شامل کریں",
        findBlessing: "دعا تلاش کریں"
      },
      action: {
        generate: "یونیورسل لنک بنائیں",
        generating: "جادو تیار ہو رہا ہے...",
        ready: "آپ کا کارڈ تیار ہے! 🎁",
        quote: "\"خیر بانٹنا، خیر کو ضرب دینا ہے۔\"",
        whatsapp: "واٹس ایپ پر بھیجیں",
        download: "کارڈ ڈاؤن لوڈ کریں"
      },
      card: {
        season: "ماہِ رمضان 2026",
        greeting: "رمضان مبارک",
        specialFor: "ایک خاص دعا برائے",
        you: "آپ",
        withLove: "خلوصِ دل کے ساتھ،"
      }
    },
    receiver: {
      arrived: "برکت آپ تک پہنچی ہے",
      wait: "ایک روحانی پیغام آپ کا منتظر ہے",
      unlocked: "مقدس تحفہ کھل گیا",
      open: "مہر توڑنے کے لیے ٹیپ کریں",
      soundOn: "آواز آن",
      playMusic: "میوزک چلائیں",
      sayAmeen: "آمین کہیں",
      ameenSaid: "آمین کہا گیا",
      createMine: "اپنا کارڈ بنائیں"
    },
    wishes: [
       "اللہ کرے یہ رمضان آپ کی زندگی میں وہ سکون لائے جس کی آپ کو تلاش ہے۔",
       "میری دعا ہے کہ اس رمضان آپ کے گھر پر اللہ کی رحمتوں کی بارش ہو۔",
       "اللہ اس رمضان آپ کی تمام پوشیدہ دعائیں قبول فرمائے۔",
       "یہ رمضان آپ کے لیے مغفرت کا ذریعہ اور جنت کی کنجی بنے۔",
       "اللہ آپ کو ہر سحری میں قوت اور ہر افطار میں سکون عطا فرمائے۔",
       "خدا کرے یہ مہینہ آپ کی زندگی کا بہترین رمضان ثابت ہو۔",
       "اللہ آپ کے رزق میں برکت اور جان و مال میں حفاظت عطا کرے۔",
       "اس رمضان آپ کے گناہ مٹ جائیں اور نیکیاں بڑھ جائیں۔",
       "اللہ آپ کو شب قدر کی سعادتیں نصیب فرمائے۔",
       "میری دعا ہے کہ عید کے چاند تک آپ کا دامن خوشیوں سے بھر جائے۔"
    ],
    blessings: [
        "اللہ آپ کے دل کے ہر غم کو خوشی میں بدل دے۔",
        "میں دعا کرتا ہوں کہ آپ کو ایسی خوشی ملے جو کبھی ختم نہ ہو۔",
        "اللہ آپ کو ان لوگوں میں شامل کرے جن سے وہ محبت کرتا ہے۔",
        "آپ کی زندگی قرآن کے نور سے منور ہو جائے۔",
        "اللہ آپ کو دنیا اور آخرت کی تمام بھلائیاں عطا فرمائے۔"
    ]
  },
  ru: {
    hero: {
      badge: "Duniya Bhar Mein Khair Phelayein",
      titlePre: "Ramzan Ki",
      titleHighlight: "Aamad Hai 🌙",
      subtitle: "Apna Zaati Dua Card Banayein. Ek Tap Mein Share Karein. Be-inteha Barkatein.",
      cta: "Apna Gift Card Banayein"
    },
    countdown: {
      dates: "Shaam Mangal, 17 Feb – Jumeraat, 19 Mar, 2026",
      label: "Muqaddas Mahina Qareeb Hai",
      days: "Din",
      hours: "Ghantay",
      mins: "Mins",
      secs: "Secs",
      cards: [
        { title: "Tayari Ka Waqt", desc: "Shaban qareeb hai. Ramzan ki marathon se pehle ka warm-up." },
        { title: "Aadatein Banayein", desc: "Aaj hi se nafal rozay aur Quran ke goals set karein." },
        { title: "Mukhtasir Paigham", desc: "Ramzan 2026 InshaAllah 17 Feb. Abhi se dil tayar karein." }
      ],
      dua: "\"Aye Allah, humein Ramzan tak pohancha de.\""
    },
    builder: {
      title: "Apni Duaaon Ko Haqeeqat Banayein 🌙",
      subtitle: "\"Alfaaz rooh ke par hotay hain.\"",
      inputs: {
        fromLabel: "Apna Naam Likhein",
        fromPlaceholder: "Naam yahan type karein...",
        fromHelp: "Yeh naam golden card par bhejnay walay ke tor par ayega",
        wishLabel: "Aap Ki Dilli Dua",
        wishPlaceholder: "Allah karay yeh Ramzan aap ke liye sukoon laye...",
        browse: "Duaein Dekhein",
        themeLabel: "Visual Theme",
        blessingTitle: "Roohani Dua",
        blessingDesc: "Ek muntakhib roohani dua shamil karein",
        findBlessing: "Dua Talash Karein"
      },
      action: {
        generate: "Universal Link Banayein",
        generating: "Jadoo Tayar Ho Raha Hai...",
        ready: "Aapka Card Tayar Hai! 🎁",
        quote: "\"Khair baantna, khair ko barhana hai.\"",
        whatsapp: "WhatsApp Par Bhejein",
        download: "Card Download Karein"
      },
      card: {
        season: "Mah-e-Ramzan 2026",
        greeting: "Ramzan Mubarak",
        specialFor: "Ek Khaas Dua For",
        you: "Aap",
        withLove: "Khuloos-e-Dil Se,"
      }
    },
    receiver: {
      arrived: "Barkat Aap Tak Pohanchi Hai",
      wait: "Ek roohani paigham aapka muntazir hai",
      unlocked: "Muqaddas Tohfa Khul Gaya",
      open: "Seal Torne Ke Liye Tap Karein",
      soundOn: "Sound On",
      playMusic: "Music Chalayein",
      sayAmeen: "Ameen Kahein",
      ameenSaid: "Ameen Kaha Gaya",
      createMine: "Apna Card Banayein"
    },
    wishes: [
       "Allah karay yeh Ramzan aap ki zindagi mein woh sukoon laye jis ki aap ko talash hai.",
       "Meri dua hai ke is Ramzan aap ke ghar par Allah ki rehmaton ki barish ho.",
       "Allah is Ramzan aap ki tamam posheeda duaein qabool farmaye.",
       "Yeh Ramzan aap ke liye maghfirat ka zariya aur Jannat ki kunji banay.",
       "Allah aap ko har suhoor mein quwwat aur har iftar mein sukoon ata farmaye.",
       "Khuda karay yeh mahina aap ki zindagi ka behtareen Ramzan sabit ho.",
       "Allah aap ke rizq mein barkat aur jaan o maal mein hifazat ata karay.",
       "Is Ramzan aap ke gunah mit jayein aur nekiyan barh jayein.",
       "Allah aap ko Shab-e-Qadr ki sa'adatein naseeb farmaye.",
       "Meri dua hai ke Eid ke chand tak aap ka daman khushiyon se بھر jaye."
    ],
    blessings: [
        "Allah aap ke dil ke har gham ko khushi mein badal day.",
        "Main dua karta hoon ke aap ko aisi khushi milay jo kabhi khatam na ho.",
        "Allah aap ko un logon mein shamil karay jin se Woh mohabbat karta hai.",
        "Aap ki zindagi Quran ke noor se munawwar ho jaye.",
        "Allah aap ko duniya aur akhirat ki tamam bhalaiyan ata farmaye."
    ]
  },
  ar: {
    hero: {
      badge: "نشر الخير حول العالم",
      titlePre: "رمضان",
      titleHighlight: "قادم قريباً 🌙",
      subtitle: "اصنع بطاقة دعاء مخصصة. بضغطة واحدة للمشاركة. بركات لا حصر لها.",
      cta: "اصنع بطاقة هديتي"
    },
    countdown: {
      dates: "مساء الثلاثاء 17 فبراير – الخميس 19 مارس 2026",
      label: "الشهر الكريم يقترب",
      days: "يوم",
      hours: "ساعة",
      mins: "دقيقة",
      secs: "ثانية",
      cards: [
        { title: "وقت الاستعداد", desc: "شعبان يقترب. شهر الإحماء قبل ماراثون رمضان." },
        { title: "بناء العادات", desc: "ابدأ بصيام النوافل وتحديد أهدافك مع القرآن اليوم." },
        { title: "رسالة سريعة", desc: "رمضان 2026 المتوقع 17 فبراير. جهز قلبك الآن." }
      ],
      dua: "\"اللهم بلغنا رمضان.\""
    },
    builder: {
      title: "حقق بركاتك 🌙",
      subtitle: "\"الكلمات هي أجنحة الروح.\"",
      inputs: {
        fromLabel: "وقع تحفتك الفنية",
        fromPlaceholder: "اكتب الاسم هنا...",
        fromHelp: "سيظهر هذا كمرسل على البطاقة الذهبية",
        wishLabel: "أمنيتك القلبية",
        wishPlaceholder: "عسى أن يجلب لك هذا الرمضان السلام...",
        browse: "تصفح الأدعية",
        themeLabel: "السمة البصرية",
        blessingTitle: "دعاء الروح",
        blessingDesc: "أضف دعاءً روحياً مختاراً",
        findBlessing: "ابحث عن دعاء"
      },
      action: {
        generate: "إنشاء رابط عالمي",
        generating: "جاري صنع السحر...",
        ready: "بطاقتك جاهزة! 🎁",
        quote: "\"الخير المشترك هو خير مضاعف.\"",
        whatsapp: "مشاركة عبر واتساب",
        download: "تحميل البطاقة"
      },
      card: {
        season: "رمضان الكريم 2026",
        greeting: "رمضان مبارك",
        specialFor: "دعاء خاص لـ",
        you: "أنت",
        withLove: "بقلب نقي،"
      }
    },
    receiver: {
      arrived: "وصلت البركة",
      wait: "رسالة روحية في انتظارك",
      unlocked: "تم فتح الهدية المقدسة",
      open: "اضغط لفتح الختم",
      soundOn: "تشغيل الصوت",
      playMusic: "شغل الموسيقى",
      sayAmeen: "قل آمين",
      ameenSaid: "تم قول آمين",
      createMine: "اصنع خاصتي"
    },
    wishes: [
       "عسى أن يجلب لك هذا الرمضان السلام والفرح والبركات التي لا تنتهي.",
       "أسأل الله أن يملأ بيتك بنور الهداية وقلبك بالإيمان.",
       "عسى أن يكون هذا الشهر شهر الرحمة والمغفرة لك ولعائلتك.",
       "اللهم اجعل هذا الرمضان نقطة تحول جميلة في حياتك.",
       "أسأل الله أن يتقبل صيامك ويستجيب لصلواتك السرية.",
       "عسى أن يمحو هذا الرمضان همومك ويمنحك بداية جديدة.",
       "اللهم اجعل اسمك من المعتوقين من النار في هذا الشهر الفضيل.",
       "أتمنى لك ولعائلتك رمضان مليئاً بالحب والدعوات المستجابة.",
       "عسى أن يقربك هذا الرمضان إلى الله أكثر من أي وقت مضى.",
       "اللهم ارزقك ليلة القدر وخيرها الذي يعادل ألف شهر."
    ],
    blessings: [
        "أسأل الله أن يملأ قلبك بنور لا ينطفئ أبداً.",
        "عسى أن تكون كل دمعة ذرفتها في الدعاء سبباً في سعادتك.",
        "اللهم احفظك من كل سوء وارزقك السكينة.",
        "أسأل الله أن يرزقك صحبة الصالحين في الدنيا والآخرة.",
        "عسى أن يفتح الله لك أبواب الرحمة التي لا تغلق."
    ]
  },
  hi: {
    hero: {
      badge: "दुनिया भर में खैर फैला रहे हैं",
      titlePre: "रमज़ान",
      titleHighlight: "आ रहा है 🌙",
      subtitle: "अपना ज़ाती दुआ कार्ड बनाएं। एक टैप में शेयर करें। बेइंतहा बरकतें।",
      cta: "अपना गिफ्ट कार्ड बनाएं"
    },
    countdown: {
      dates: "शाम मंगल, 17 फर – जुमेरात, 19 मार्च, 2026",
      label: "मुकद्दस महीना करीब है",
      days: "दिन",
      hours: "घंटे",
      mins: "मिनट",
      secs: "सेकंड",
      cards: [
        { title: "तैयारी का वक़्त", desc: "शाबान करीब है। रमज़ान की मैराथन से पहले का वार्म-अप।" },
        { title: "आदतें बनाएं", desc: "आज ही से नफिल रोज़े और क़ुरान के अहदाफ मुक़र्रर करें।" },
        { title: "मुख़्तसर पैगाम", desc: "रमज़ान 2026 इंशाअल्लाह 17 फरवरी। अभी से अपने दिल को तैयार करें।" }
      ],
      dua: "\"ऐ अल्लाह, हमें रमज़ान तक पहुँचा दे।\""
    },
    builder: {
      title: "अपनी दुआओं को हकीकत बनाएं 🌙",
      subtitle: "\"अल्फ़ाज़ रूह के पर होते हैं।\"",
      inputs: {
        fromLabel: "अपना नाम लिखें",
        fromPlaceholder: "नाम यहाँ टाइप करें...",
        fromHelp: "ये नाम सुनहरी कार्ड पर भेजने वाले के तौर पर आएगा",
        wishLabel: "आपकी दिली दुआ",
        wishPlaceholder: "खुदा करे ये रमज़ान आपके लिए सुकून लाए...",
        browse: "दुआएं देखें",
        themeLabel: "विजुअल थीम",
        blessingTitle: "रूहानी दुआ",
        blessingDesc: "एक मुंतखिब रूहानी दुआ शामिल करें",
        findBlessing: "दुआ तलाश करें"
      },
      action: {
        generate: "यूनिवर्सल लिंक बनाएं",
        generating: "जादू तैयार हो रहा है...",
        ready: "आपका कार्ड तैयार है! 🎁",
        quote: "\"खैर बांटना, खैर को बढ़ाना है।\"",
        whatsapp: "व्हाट्सऐप पर भेजें",
        download: "कार्ड डाउनलोड करें"
      },
      card: {
        season: "माह-ए-रमज़ान 2026",
        greeting: "रमज़ान मुबारक",
        specialFor: "एक ख़ास दुआ",
        you: "आप",
        withLove: "खुलूस-ए-दिल से,"
      }
    },
    receiver: {
      arrived: "बरकत आप तक पहुँची है",
      wait: "एक रूहानी पैगाम आपका मुंतज़िर है",
      unlocked: "मुकद्दस तोहफा खुल गया",
      open: "सील तोड़ने के लिए टैप करें",
      soundOn: "साउंड ऑन",
      playMusic: "म्यूज़िक चलाएं",
      sayAmeen: "आमीन कहें",
      ameenSaid: "आमीन कहा गया",
      createMine: "अपना कार्ड बनाएं"
    },
    wishes: [
       "अल्लाह करे ये रमज़ान आपकी ज़िंदगी में वो सुकून लाए जिसकी आपको तलाश है।",
       "मेरी दुआ है कि इस रमज़ान आपके घर पर अल्लाह की रहमतों की बारिश हो।",
       "अल्लाह इस रमज़ान आपकी तमाम पोशीदा दुआएं कुबूल फरमाए।",
       "ये रमज़ान आपके लिए मग़फिरत का ज़रिया और जन्नत की कुंजी बने।",
       "अल्लाह आपको हर सहरी में कुwwत और हर इफ्तार में सुकून अता फरमाए।",
       "खुदा करे ये महीना आपकी ज़िंदगी का बेहतरीन रमज़ान साबित हो।",
       "अल्लाह आपके रिज़्क़ में बरकत और जान ओ माल में हिफाज़त अता करे।",
       "इस रमज़ान आपके गुनाह मिट जाएं और नेकियां बढ़ जाएं।",
       "अल्लाह आपको शब-ए-क़द्र की सआदतें नसीब फरमाए।",
       "मेरी दुआ है कि ईद के चाँद तक आपका दामन खुशियों से भर जाए।"
    ],
    blessings: [
        "अल्लाह आपके दिल के हर ग़म को ख़ुशी में बदल दे।",
        "मैं दुआ करता हूँ कि आपको ऐसी ख़ुशी मिले जो कभी ख़त्म न हो।",
        "अल्लाह आपको उन लोगों में शामिल करे जिनसे वो मोहब्बत करता है।",
        "आपकी ज़िंदगी क़ुरान के नूर से मुनव्वर हो जाए।",
        "अल्लाह आपको दुनिया और आख़िरत की तमाम भलाईयां अता फरमाए।"
    ]
  }
};
