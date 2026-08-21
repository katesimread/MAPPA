export const locales = [
  { code: 'en', label: 'English', rtl: false },
  { code: 'ar', label: 'العربية', rtl: true },
  { code: 'fa', label: 'فارسی', rtl: true },
  { code: 'ps', label: 'پښتو', rtl: true },
  { code: 'ku', label: 'کوردی', rtl: true },
  { code: 'ur', label: 'اردو', rtl: true },
  { code: 'ti', label: 'ትግርኛ', rtl: false },
  { code: 'sq', label: 'Shqip', rtl: false },
  { code: 'ro', label: 'Română', rtl: false },
  { code: 'bn', label: 'বাংলা', rtl: false },
  { code: 'so', label: 'Soomaali', rtl: false }
];

export const rtlLocales = new Set(
  locales.filter((l) => l.rtl).map((l) => l.code)
);

/** @type {Record<string, any>} */
export const t = {
  en: {
    info_button: 'Information',
    side_panel_title: 'Choose a Category',
    info_paragraphs: [
      'MAPPA is a project that helps refugees and asylum seekers find services in the UK.',
      'You can use the interactive map to search for charities and other organisations in your area, as well as to leave suggestions for other people.',
      'You can use the filter buttons below to look for help with housing, English lessons, supplies (clothes, toiletries etc.), skills, legal support, or anything else.',
      'The aim is to create a community map where people can share knowledge to make accessing help easier.'
    ],
    search_placeholder: 'Search for a place, street, or shop...',
    search_button: 'Search',
    add_section_title: 'Do you have a service that you would like to share?',
    add_steps: [
      'Click the map to place your pin.',
      'Write a little about what it is that they do. Select a category and share the website link if you can.',
      'Click the Add button.'
    ],
    title_placeholder: 'Title',
    info_placeholder: 'Info',
    category_placeholder: 'Category',
    link_placeholder: 'Website link (optional)',
    website_link: 'Website',
    add_button: 'Add',
    toast_success:
      'Thank you for placing a pin on the map! Once approved by the admin team, everyone will be able to see the service that you’ve added.'
  },
  ar: {
    info_button: 'معلومات',
    side_panel_title: 'اختر فئة',
    info_paragraphs: [
      'يعدّ MAPPA مشروعًا يساعد اللاجئين وطالبي اللجوء على إيجاد الخدمات المتوفرة في المملكة المتحدة.',
      'يمكنك استخدام الخريطة التفاعلية للبحث عن الجمعيات الخيرية والمؤسسات الأخرى في منطقتك، وكذلك لإضافة اقتراحات يستفيد منها الآخرون.',
      'يمكنك أيضًا استخدام أزرار التصفية في الأسفل للبحث عن مساعدة في السكن، أو دروس اللغة الإنجليزية، أو المستلزمات (كالملابس ومستلزمات النظافة وغيرها)، أو تطوير المهارات، أو الدعم القانوني، أو أي نوع آخر من المساعدة.',
      'الهدف هو إنشاء خريطة مجتمعية يتشارك فيها الناس المعرفة، لتسهيل حصول النازحين على المساعدة.'
    ],
    search_placeholder: 'ابحث عن مكان أو شارع أو متجر',
    search_button: 'بحث',
    add_section_title: 'هل لديك خدمة تريد مشاركتها؟',
    add_steps: [
      'اضغط على الخريطة لتحديد موقعك.',
      'اكتب اسم الجمعية أو المؤسسة، مع نبذة موجزة عن الخدمات التي تقدمها. اختر الفئة المناسبة، وأضف رابط الموقع الإلكتروني إن توفر.',
      'اضغط على زر "إضافة".'
    ],
    title_placeholder: 'العنوان',
    info_placeholder: 'معلومات',
    category_placeholder: 'الفئة',
    link_placeholder: 'أضف رابط الموقع الإلكتروني (اختياري)',
    website_link: 'الموقع الإلكتروني',
    add_button: 'إضافة',
    toast_success:
      'شكراً لك على وضع علامة على الخريطة! بمجرد موافقة فريق الإدارة، سيتمكن الجميع من رؤية الخدمة التي أضفتها.'
  },
  fa: {
    info_button: 'اطلاعات',
    side_panel_title: 'یک دسته انتخاب کنید',
    info_paragraphs: [
      'مپا (MAPPA) پروژه‌ای است که به پناهندگان و پناهجویان کمک می‌کند خدمات موجود در بریتانیا را پیدا کنند.',
      'می‌توانید از نقشه تعاملی برای جستجوی خیریه‌ها و سازمان‌های دیگر در منطقه خود استفاده کنید، و همچنین پیشنهادهایی برای دیگران ثبت کنید.',
      'همچنین می‌توانید از دکمه‌های فیلتر در پایین برای یافتن کمک در زمینه‌ی مسکن، کلاس‌های زبان انگلیسی، لوازم ضروری (مانند لباس، لوازم بهداشتی و غیره)، مهارت‌ها، حمایت حقوقی، یا هر نوع کمک دیگری استفاده کنید.',
      'هدف ایجاد نقشه‌ای اجتماعی است که در آن افراد بتوانند دانش خود را به اشتراک بگذارند تا دسترسی به کمک برای افراد آواره آسان‌تر شود.'
    ],
    search_placeholder: 'دنبال یک مکان، خیابان یا مغازه بگردید...',
    search_button: 'جستجو',
    add_section_title: 'آیا خدمتی دارید که می‌خواهید به اشتراک بگذارید؟',
    add_steps: [
      'روی نقشه کلیک کنید تا سنجاق خود را قرار دهید.',
      'نام خیریه یا شرکت را بنویسید و کمی درباره‌ی کاری که انجام می‌دهند توضیح دهید. یک دسته را انتخاب کنید و در صورت امکان لینک وب‌سایت را وارد کنید.',
      'روی دکمه‌ی «افزودن» کلیک کنید.'
    ],
    title_placeholder: 'عنوان',
    info_placeholder: 'اطلاعات',
    category_placeholder: 'دسته',
    link_placeholder: 'لینک وب‌سایت را وارد کنید (اختیاری)',
    website_link: 'وب‌سایت',
    add_button: 'افزودن',
    toast_success:
      'از اینکه یک سنجاق روی نقشه قرار دادید متشکریم! پس از تأیید توسط تیم مدیریت، همه می‌توانند خدمتی را که اضافه کرده‌اید ببینند.'
  },
  ps: {
    info_button: 'معلومات',
    side_panel_title: 'یوه ورشو وټاکئ',
    info_paragraphs: [
      'MAPPA یو پروژه ده چې کډوالو او پناه غوښتونکو سره مرسته کوي چې په بریتانیا کې خدمات ومومي.',
      'تاسو کولی شئ له متقابل نقشې څخه کار واخلئ ترڅو په خپل سیمه کې خیریه ادارې او نور سازمانونه ولټوئ، او همدارنګه نورو کسانو ته وړاندیزونه هم پریږدئ.',
      'تاسو کولی شئ لاندې د فلټر تڼۍ هم وکاروئ ترڅو د کور، انګلیسي ژبې زده‌کړو، اړینو توکو (لکه کالي، د پاکوالي توکي او نور)، مهارتونو، قانوني ملاتړ، یا هر بل ډول مرستې لپاره پلټنه وکړئ.',
      'موخه دا ده چې یوه ټولنیزه نقشه جوړه شي چیرې چې خلک خپل پوهه شریکه کړي ترڅو د بې ځایه شویو خلکو لپاره مرستې ترلاسه کول اسانه شي.'
    ],
    search_placeholder: 'د ځای، سړک، یا پلورنځي لپاره لټون وکړئ...',
    search_button: 'لټون',
    add_section_title: 'ایا تاسو کومه خدمت لرئ چې غواړئ یې شریک کړئ؟',
    add_steps: [
      'خپل پن ځای پرځای کولو لپاره پر نقشه کلیک وکړئ.',
      'د خیریه ادارې یا شرکت نوم ولیکئ او لږ څه دا چې دوی څه کوي یې بیان کړئ. یوه ورشو (کټګورۍ) وټاکئ او که امکان ولري د ویب‌پاڼې لینک هم شریک کړئ.',
      'د "اضافه کول" تڼۍ کلیک کړئ.'
    ],
    title_placeholder: 'سرلیک',
    info_placeholder: 'معلومات',
    category_placeholder: 'ورشو',
    link_placeholder: 'د ویب‌پاڼې لینک شریک کړئ (اختیاري)',
    website_link: 'ویب پاڼه',
    add_button: 'اضافه کول',
    toast_success:
      'ستاسو د نقشې پر مخ د پن ایښودو لپاره مننه! کله چې د اداری ټیم لخوا تصویب شي، هرڅوک به هغه خدمت وویني چې تاسو اضافه کړی دی.'
  },
  ku: {
    info_button: 'زانیاری',
    side_panel_title: 'جۆرێک هەڵبژێرە',
    info_paragraphs: [
      'MAPPA پڕۆژەیەکە یارمەتی پەنابەران و داواکارانی پەناگە دەدات بۆ دۆزینەوەی خزمەتگوزارییەکان لە بەریتانیا.',
      'دەتوانیت نەخشەی کارلێکەر بەکاربهێنیت بۆ گەڕان بەدوای دامەزراوە ئێخراوییەکان و ڕێکخراوەکانی دیکە لە ناوچەکەت، هەروەها بۆ زیادکردنی پێشنیار بۆ کەسانی دیکە.',
      'دەشتوانیت دوگمەکانی پاڵاوتن لە خوارەوە بەکاربهێنیت بۆ گەڕان بەدوای یارمەتی نیشتەجێبوون، وانەکانی زمانی ئینگلیزی، پێداویستییەکان (وەک جلوبەرگ و کەلوپەلی خاوێنکارییەوە)، لێهاتووی، پشتیوانی یاسایی، یان هەر جۆرێکی دیکەی یارمەتی.',
      'ئامانج دروستکردنی نەخشەیەکی کۆمەڵگایییە کە خەڵک بتوانن زانیاری هاوبەش بکەن بۆ ئاسانکردنی دەستگەیشتن بە یارمەتی بۆ کەسانی دەربەدەر.'
    ],
    search_placeholder: 'گەڕان بەدوای شوێن، شەقام، یان دوکان...',
    search_button: 'گەڕان',
    add_section_title: 'ئایا خزمەتگوزارییەکت هەیە دەتەوێت هاوبەشی پێبکەیت؟',
    add_steps: [
      'کلیک لەسەر نەخشەکە بکە بۆ دانانی نیشانەکەت.',
      'ناوی دامەزراوە ئێخراوییەکە یان کۆمپانیاکە بنووسە و کەمێک دەربارەی ئەوەی چی دەکەن. جۆرێک هەڵبژێرە و ئەگەر توانیت لینکی ماڵپەڕ هاوبەش بکە.',
      'کلیک لەسەر دوگمەی "زیادکردن" بکە.'
    ],
    title_placeholder: 'ناونیشان',
    info_placeholder: 'زانیاری',
    category_placeholder: 'جۆر',
    link_placeholder: 'لینکی ماڵپەڕ هاوبەش بکە (هەڵبژاردەیی)',
    website_link: 'ماڵپەڕ',
    add_button: 'زیادکردن',
    toast_success:
      'سوپاس بۆ دانانی نیشانەیەک لەسەر نەخشەکە! کاتێک لەلایەن تیمی بەڕێوەبردنەوە پەسەند بکرێت، هەموو کەس دەتوانێت ئەو خزمەتگوزارییە ببینێت کە تۆ زیادت کردووە.'
  },
  ur: {
    info_button: 'معلومات',
    side_panel_title: 'ایک زمرہ منتخب کریں',
    info_paragraphs: [
      'MAPPA ایک پروجیکٹ ہے جو پناہ گزینوں اور پناہ کے متلاشی افراد کو برطانیہ میں دستیاب خدمات تلاش کرنے میں مدد کرتا ہے۔',
      'آپ اپنے علاقے میں فلاحی اداروں اور دیگر تنظیموں کو تلاش کرنے کے لیے انٹرایکٹو نقشہ استعمال کر سکتے ہیں، اور دوسرے لوگوں کے لیے تجاویز بھی چھوڑ سکتے ہیں۔',
      'آپ نیچے دیے گئے فلٹر بٹن استعمال کر کے رہائش، انگریزی زبان کے اسباق، ضروری اشیاء (کپڑے، صفائی کا سامان وغیرہ)، ہنر، قانونی مدد، یا کسی بھی دوسری قسم کی مدد کے بارے میں تلاش کر سکتے ہیں۔',
      'مقصد ایک کمیونٹی نقشہ بنانا ہے جہاں لوگ معلومات بانٹ سکیں تاکہ بے گھر افراد کے لیے مدد تک رسائی آسان ہو سکے۔'
    ],
    search_placeholder: 'کسی جگہ، سڑک، یا دکان کو تلاش کریں...',
    search_button: 'تلاش کریں',
    add_section_title: 'کیا آپ کے پاس کوئی خدمت ہے جسے آپ شیئر کرنا چاہتے ہیں؟',
    add_steps: [
      'اپنا پن لگانے کے لیے نقشے پر کلک کریں۔',
      'فلاحی ادارے یا کمپنی کا نام لکھیں اور اس کے بارے میں مختصر معلومات دیں کہ وہ کیا کام کرتے ہیں۔ ایک زمرہ منتخب کریں اور اگر ممکن ہو تو ویب سائٹ کا لنک شیئر کریں۔',
      '"شامل کریں" بٹن پر کلک کریں۔'
    ],
    title_placeholder: 'عنوان',
    info_placeholder: 'معلومات',
    category_placeholder: 'زمرہ',
    link_placeholder: 'ویب سائٹ لنک شیئر کریں (اختیاری)',
    website_link: 'ویب سائٹ',
    add_button: 'شامل کریں',
    toast_success:
      'نقشے پر پن لگانے کا شکریہ! ایڈمن ٹیم کی منظوری کے بعد، ہر کوئی وہ خدمت دیکھ سکے گا جو آپ نے شامل کی ہے۔'
  },
  ti: {
    info_button: 'ሓበሬታ',
    side_panel_title: 'ምድብ ምረጽ',
    info_paragraphs: [
      'MAPPA ስደተኛታትን ሓተትቲ ዑቕባን ኣብ ዓባይ ብሪጣንያ ኣገልግሎት ንኽረኽቡ ዝሕግዝ ፕሮጀክት እዩ።',
      "ነቲ ንጡፍ ካርታ ተጠቒምካ ኣብ ከባቢኻ ዝርከቡ ግብረሰናይ ትካላትን ካልኦት ውድባትን ክትደሊ ትኽእል ኢኻ፡ ከምኡ'ውን ንኻልኦት ሰባት ዝጠቅም ርእይቶ ክትገድፍ ትኽእል።",
      'ንሓገዝ ኣብ መንበሪ ገዛ፡ ትምህርቲ ቋንቋ እንግሊዝ፡ ኣቅሑት (ክዳውንቲ፡ ናይ ጽሬት ኣቅሑት ወዘተ)፡ ክእለታት፡ ናይ ሕጊ ደገፍ፡ ወይ ካልእ ዝኾነ ዓይነት ሓገዝ ንምድላይ ኣብ ታሕቲ ዘሎ መጻረዪ ጠውቕታት ክትጥቀም ትኽእል።',
      'ዕላማ ናይዚ ፕሮጀክት ሰባት ፍልጠቶም ዝካፈልሉ ናይ ማሕበረሰብ ካርታ ምፍጣር እዩ፡ ንደረቕቲ ሰባት ናብ ሓገዝ ምብጻሕ ንምቅላል።'
    ],
    search_placeholder: 'ቦታ፡ ጎደና፡ ወይ ድኳን ድለ...',
    search_button: 'ድለ',
    add_section_title: 'ክትካፈልዎ እትደልዩ ኣገልግሎት ኣለኩም ድዩ?',
    add_steps: [
      'ነቲ ካርታ ጠውቕ ኢልካ ነቲ ምልክትካ ኣቐምጥ።',
      "ስም እታ ግብረሰናይ ትካል ወይ ኩባንያ ጽሓፍ፡ ከምኡ'ውን ብዛዕባ እቲ ዝገብርዎ ንእሽቶ መግለጺ ጻሓፍ። ግቡእ ምድብ ምረጽ፡ እንተኽኢልካ ድማ ሊንክ ናይ ወብሳይት ኣካፍል።",
      'ነቲ "ወስኽ" ዝብል ጠውቕታ ጠውቕ።'
    ],
    title_placeholder: 'ኣርእስቲ',
    info_placeholder: 'ሓበሬታ',
    category_placeholder: 'ምድብ',
    link_placeholder: 'ሊንክ ወብሳይት ኣካፍል (ኣማራጺ)',
    website_link: 'ወብሳይት',
    add_button: 'ወስኽ',
    toast_success:
      'ኣብ ካርታ ምልክት ስለ ዘቐመጥካ ነመስግነካ! ብጋንታ ምሕደራ ምስ ጸደቐ፡ ኩሉ ሰብ እቲ ዝወሰኽካዮ ኣገልግሎት ክርኢ ይኽእል።'
  },
  sq: {
    info_button: 'Informacion',
    side_panel_title: 'Zgjidh një kategori',
    info_paragraphs: [
      'MAPPA është një projekt që ndihmon refugjatët dhe azilkërkuesit të gjejnë shërbime në Mbretërinë e Bashkuar.',
      'Mund të përdorni hartën interaktive për të kërkuar organizata bamirësie dhe organizata të tjera në zonën tuaj, si dhe për të lënë sugjerime për njerëz të tjerë.',
      'Mund të përdorni butonat e filtrit më poshtë për të kërkuar ndihmë për strehim, mësime të gjuhës angleze, artikuj të nevojshëm (rroba, artikuj higjienikë etj.), aftësi, mbështetje ligjore, ose çdo lloj ndihme tjetër.',
      'Qëllimi është të krijohet një hartë komunitare ku njerëzit mund të ndajnë njohuri për ta bërë më të lehtë aksesin në ndihmë.'
    ],
    search_placeholder: 'Kërko një vend, rrugë, ose dyqan...',
    search_button: 'Kërko',
    add_section_title: 'A keni një shërbim që dëshironi ta ndani?',
    add_steps: [
      'Kliko mbi hartë për të vendosur shenjuesin tënd.',
      'Shkruaj emrin e organizatës bamirëse ose kompanisë dhe pak informacion se çfarë bëjnë. Zgjidh një kategori dhe ndaj lidhjen e faqes së internetit nëse mundesh.',
      'Kliko butonin "Shto".'
    ],
    title_placeholder: 'Titulli',
    info_placeholder: 'Info',
    category_placeholder: 'Kategoria',
    link_placeholder: 'Lidhje faqe interneti (opsionale)',
    website_link: 'Faqja e internetit',
    add_button: 'Shto',
    toast_success:
      'Faleminderit që vendose një shenjues në hartë! Sapo të miratohet nga ekipi administrativ, të gjithë do të mund ta shohin shërbimin që shtove.'
  },
  ro: {
    info_button: 'Informații',
    side_panel_title: 'Selectați o categorie',
    info_paragraphs: [
      'MAPPA este un proiect care ajută refugiații și solicitanții de azil să găsească servicii în Regatul Unit.',
      'Puteți folosi harta interactivă pentru a căuta organizații caritabile și alte organizații din zona dumneavoastră, precum și pentru a lăsa sugestii pentru alte persoane.',
      'Puteți folosi butoanele de filtrare de mai jos pentru a căuta ajutor privind locuința, cursurile de limba engleză, produsele necesare (haine, articole de igienă etc.), competențe, sprijin juridic sau orice alt tip de ajutor.',
      'Scopul este de a crea o hartă comunitară în care oamenii pot împărtăși cunoștințe pentru a facilita accesul la ajutor.'
    ],
    search_placeholder: 'Căutați un loc, o stradă sau un magazin...',
    search_button: 'Căutare',
    add_section_title: 'Aveți un serviciu pe care ați dori să îl distribuiți?',
    add_steps: [
      'Faceți clic pe hartă pentru a plasa marcajul.',
      'Scrieți numele organizației caritabile sau al companiei și câteva informații despre ceea ce fac. Selectați o categorie și distribuiți linkul site-ului web, dacă este posibil.',
      'Faceți clic pe butonul „Adaugă”.'
    ],
    title_placeholder: 'Titlu',
    info_placeholder: 'Informații',
    category_placeholder: 'Categorie',
    link_placeholder: 'Link site web (opțional)',
    website_link: 'Site web',
    add_button: 'Adaugă',
    toast_success:
      'Vă mulțumim că ați plasat un marcaj pe hartă! Odată aprobat de echipa de administrare, toată lumea va putea vedea serviciul pe care l-ați adăugat.'
  },
  bn: {
    info_button: 'তথ্য',
    side_panel_title: 'একটি বিভাগ নির্বাচন করুন',
    info_paragraphs: [
      'MAPPA একটি প্রকল্প যা শরণার্থী ও আশ্রয়প্রার্থীদের যুক্তরাজ্যে পরিষেবা খুঁজে পেতে সাহায্য করে।',
      'আপনি আপনার এলাকার দাতব্য সংস্থা এবং অন্যান্য প্রতিষ্ঠান খুঁজতে ইন্টারঅ্যাকটিভ মানচিত্র ব্যবহার করতে পারেন, পাশাপাশি অন্যদের জন্য পরামর্শও রেখে যেতে পারেন।',
      'আপনি নিচের ফিল্টার বোতামগুলো ব্যবহার করে আবাসন, ইংরেজি ভাষার পাঠ, প্রয়োজনীয় জিনিসপত্র (পোশাক, স্বাস্থ্যবিধি সামগ্রী ইত্যাদি), দক্ষতা, আইনি সহায়তা, অথবা অন্য যেকোনো ধরনের সাহায্যের জন্য অনুসন্ধান করতে পারেন।',
      'লক্ষ্য হলো এমন একটি কমিউনিটি মানচিত্র তৈরি করা যেখানে মানুষ জ্ঞান ভাগ করে নিতে পারে, যাতে সাহায্য পাওয়া সহজ হয়।'
    ],
    search_placeholder: 'একটি স্থান, রাস্তা, বা দোকান খুঁজুন...',
    search_button: 'অনুসন্ধান',
    add_section_title: 'আপনার কি এমন কোনো পরিষেবা আছে যা আপনি শেয়ার করতে চান?',
    add_steps: [
      'আপনার পিন স্থাপন করতে মানচিত্রে ক্লিক করুন।',
      'দাতব্য সংস্থা বা কোম্পানির নাম লিখুন এবং তারা কী করে সে সম্পর্কে একটু তথ্য দিন। একটি বিভাগ নির্বাচন করুন এবং সম্ভব হলে ওয়েবসাইট লিঙ্ক শেয়ার করুন।',
      '"যোগ করুন" বোতামে ক্লিক করুন।'
    ],
    title_placeholder: 'শিরোনাম',
    info_placeholder: 'তথ্য',
    category_placeholder: 'বিভাগ',
    link_placeholder: 'একটি ওয়েবসাইট লিঙ্ক শেয়ার করুন (ঐচ্ছিক)',
    website_link: 'ওয়েবসাইট',
    add_button: 'যোগ করুন',
    toast_success:
      'মানচিত্রে পিন স্থাপন করার জন্য ধন্যবাদ! প্রশাসনিক দল অনুমোদন করার পর, আপনি যে পরিষেবা যোগ করেছেন তা সবাই দেখতে পাবে।'
  },
  so: {
    info_button: 'Macluumaad',
    side_panel_title: 'Dooro qayb',
    info_paragraphs: [
      'MAPPA waa mashruuc ka caawiya qaxootiga iyo dadka magangelyo doonka ah inay ka helaan adeegyada Boqortooyada Midowday.',
      "Waxaad isticmaali kartaa khariidadda isdhaqdhaqaaqda si aad u raadiso hay'adaha samafalka iyo ururo kale oo ku yaal aagaaga, iyo sidoo kale si aad u dhigto talooyin ay dadka kale ka faa'iidaystaan.",
      'Waxaad sidoo kale isticmaali kartaa badhamada shaandhaynta ee hoose si aad u raadiso caawimaad ku saabsan guryeynta, casharrada af-Ingiriisiga, alaabta loo baahan yahay (dharka, alaabta nadaafadda iwm.), xirfadaha, taageerada sharciga, ama nooc kasta oo kale oo caawimaad ah.',
      'Ujeeddadu waa in la abuuro khariidad bulsheed oo dadku ay ku wadaagi karaan aqoonta, si loo fududeeyo helitaanka caawimaad.'
    ],
    search_placeholder: 'Raadi meel, waddo, ama dukaan...',
    search_button: 'Raadi',
    add_section_title: 'Ma haysataa adeeg aad rabto inaad wadaagto?',
    add_steps: [
      'Guji khariidadda si aad u dhigto summaddaada.',
      "Qor magaca hay'adda samafalka ama shirkadda iyo wax yar oo ku saabsan waxa ay sameeyaan. Dooro qaybta ku habboon oo haddii aad awoodid ka wadaag linkiga websaydka.",
      'Guji badhanka "Ku dar".'
    ],
    title_placeholder: 'Cinwaan',
    info_placeholder: 'Macluumaad',
    category_placeholder: 'Qaybta',
    link_placeholder: 'Ka wadaag link websayd (ikhtiyaari)',
    website_link: 'Websaydka',
    add_button: 'Ku dar',
    toast_success:
      'Waad ku mahadsan tahay inaad summad ku dhigtay khariidadda! Marka uu ansixiyo kooxda maamulka, qof kastaa wuu arki doonaa adeegga aad ku dartay.'
  }
};
