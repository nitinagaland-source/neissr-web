import {
  FacultyMember,
  NewsItem,
  EventItem,
  DocumentItem,
  ClubItem,
  ForumItem,
  AchievementItem,
  PlacementStudent,
  StudentCouncilMember
} from '../types/neissr';

export const SEED_FACULTY: FacultyMember[] = [
  {
    id: 'f1',
    slug: 'rev-fr-gl-khing',
    fullName: 'Rev. Fr. G.L. Khing',
    designation: 'Vice Principal & Administrator',
    department: 'Management',
    qualifications: ['BA', 'B.Ed', 'MA', 'MSW', 'UGC-NET', 'PhD Pursuing'],
    email: 'contact.neissr@gmail.com',
    photoUrl: '',
    order: 1,
    status: 'published',
    type: 'management'
  },
  {
    id: 'f2',
    slug: 'dr-fr-cp-anto',
    fullName: 'Dr. Fr. C.P. Anto',
    designation: 'Principal & Founder',
    department: 'Management',
    qualifications: ['B.Th', 'BA', 'MSW', 'PhD'],
    email: 'principal@neissr.ac.in',
    photoUrl: '',
    order: 2,
    status: 'published',
    type: 'management'
  },
  {
    id: 'f3',
    slug: 'sr-resmy',
    fullName: 'Sr. Resmy',
    designation: 'Academic Program Coordinator',
    department: 'Management',
    qualifications: ['MSW'],
    email: 'contact.neissr@gmail.com',
    photoUrl: '',
    order: 3,
    status: 'published',
    type: 'management'
  },
  {
    id: 'f4',
    slug: 'dr-toli-h-kiba',
    fullName: 'Dr. Toli H. Kiba',
    designation: 'Assistant Professor (MSW-CD Coordinator)',
    department: 'MSW-CD',
    qualifications: ['BA', 'BD', 'MSW', 'UGC-NET', 'PhD (TISS Mumbai)'],
    email: 'tolikiba@neissr.ac.in',
    photoUrl: '',
    order: 4,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f5',
    slug: 'dr-abel-ariina',
    fullName: 'Dr. Abel Ariina',
    designation: 'Assistant Professor (MSW-YD Coordinator)',
    department: 'MSW-YD',
    qualifications: ['BA', 'MSW', 'UGC-NET', 'PhD'],
    email: 'abelariina@neissr.ac.in',
    photoUrl: '',
    order: 5,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f6',
    slug: 'fr-dr-robin-thomas',
    fullName: 'Fr. Dr. Robin Thomas',
    designation: 'Assistant Professor (MSW-SED Coordinator)',
    department: 'MSW-SED',
    qualifications: ['BA', 'MSW', 'PhD'],
    email: 'robinthomas@neissr.ac.in',
    photoUrl: '',
    order: 6,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f7',
    slug: 'ms-elizabeth-pojar',
    fullName: 'Ms. Elizabeth Pojar',
    designation: 'Assistant Professor (MSW-PCTS Coordinator)',
    department: 'MSW-PCTS',
    qualifications: ['BA', 'MSW', 'UGC-NET'],
    email: 'elizabethpojar@neissr.ac.in',
    photoUrl: '',
    order: 7,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f8',
    slug: 'dr-lily-sangpui',
    fullName: 'Dr. Lily Sangpui',
    designation: 'Assistant Professor (BSW Coordinator)',
    department: 'BSW',
    qualifications: ['BA', 'MSW', 'PhD'],
    email: 'lilysangpui@neissr.ac.in',
    photoUrl: '',
    order: 8,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f9',
    slug: 'mr-vizosu-kikhi',
    fullName: 'Mr. Vizosü Kikhi',
    designation: 'Assistant Professor',
    department: 'MSW-CD',
    qualifications: ['BA', 'MSW', 'UGC-NET'],
    email: 'vizosukikhi@neissr.ac.in',
    photoUrl: '',
    order: 9,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f10',
    slug: 'mrs-bokatoli-kinimi-z',
    fullName: 'Mrs. Bokatoli Kinimi Z',
    designation: 'Assistant Professor',
    department: 'BSW',
    qualifications: ['BSc', 'MBA', 'MSW', 'UGC-NET'],
    email: 'bokatoli@neissr.ac.in',
    photoUrl: '',
    order: 10,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f11',
    slug: 'mr-benjamin',
    fullName: 'Mr. Benjamin',
    designation: 'Assistant Professor',
    department: 'MSW',
    qualifications: ['BA', 'MSW', 'UGC-NET'],
    email: 'benjamin@neissr.ac.in',
    photoUrl: '',
    order: 11,
    status: 'published',
    type: 'teaching'
  },
  {
    id: 'f12',
    slug: 'mr-zephery-lugun',
    fullName: 'Mr. Zephery Lugun (Jablen)',
    designation: 'Office Administrator',
    department: 'Non-Teaching',
    qualifications: ['Graduate'],
    photoUrl: '',
    order: 12,
    status: 'published',
    type: 'non-teaching'
  },
  {
    id: 'f13',
    slug: 'ms-marian-panmei',
    fullName: 'Ms. Marian Panmei',
    designation: 'Administrative Office Assistant',
    department: 'Non-Teaching',
    qualifications: ['Graduate'],
    photoUrl: '',
    order: 13,
    status: 'published',
    type: 'non-teaching'
  },
  {
    id: 'f14',
    slug: 'mr-n-francis-maringmei',
    fullName: 'Mr. N Francis Maringmei',
    designation: 'IT Coordinator',
    department: 'Non-Teaching',
    qualifications: ['BCA / IT Specialist'],
    photoUrl: '',
    order: 14,
    status: 'published',
    type: 'non-teaching'
  },
  {
    id: 'f15',
    slug: 'ms-reshma-elizabeth-babu',
    fullName: 'Ms. Reshma Elizabeth Babu',
    designation: 'Asst Accountant cum Documentation',
    department: 'Non-Teaching',
    qualifications: ['B.Com'],
    photoUrl: '',
    order: 15,
    status: 'published',
    type: 'non-teaching'
  },
  {
    id: 'f16',
    slug: 'medhi-hussain',
    fullName: 'Medhi Hussain',
    designation: 'Accountant',
    department: 'Non-Teaching',
    qualifications: ['B.Com'],
    photoUrl: '',
    order: 16,
    status: 'published',
    type: 'non-teaching'
  },
  {
    id: 'f17',
    slug: 'ms-nechuli-jemu',
    fullName: 'Ms. Nechuli Jemu',
    designation: 'Assistant Librarian',
    department: 'Non-Teaching',
    qualifications: ['M.Lib'],
    photoUrl: '',
    order: 17,
    status: 'published',
    type: 'non-teaching'
  },
  {
    id: 'f18',
    slug: 'joseph',
    fullName: 'Joseph',
    designation: 'Driver',
    department: 'Non-Teaching',
    qualifications: ['Staff'],
    photoUrl: '',
    order: 18,
    status: 'published',
    type: 'non-teaching'
  }
];

export const SEED_NEWS: NewsItem[] = [
  {
    id: 'n1',
    slug: 'neissr-10th-graduation-foundation-day',
    title: 'NEISSR celebrates 10th graduation-cum-foundation day',
    category: 'Academics',
    excerpt: 'The North East Institute of Social Sciences and Research (NEISSR) commemorated its 10th graduation-cum-foundation day at Peace Centre, Chümoukedima.',
    bodyHtml: '<p>The North East Institute of Social Sciences and Research (NEISSR) commemorated its 10th graduation-cum-foundation day at the Bishop Abraham Memorial Hall, Peace Centre, Chümoukedima. Dr. Kevezai Tureng, Director, College Development Council (CDC), Nagaland University attended as special guest alongside Most Rev. Dr. James Thoppil, Bishop of Kohima and Chairman of NEISSR. Dr. Fr. C.P. Anto, Principal, welcomed all guests and highlighted NEISSR\'s commitment to transforming social work in North East India.</p>',
    publishedAt: '2025-10-02',
    status: 'published'
  },
  {
    id: 'n2',
    slug: 'peace-centre-inaugurated-chumoukedima',
    title: 'Peace Centre inaugurated at 7th Mile Chümoukedima',
    category: 'Peace Building',
    excerpt: 'Inaugural programme for Peace Centre (NEISSR & Peace Channel) held with blessing by Most Rev. Dr. James Thoppil, Bishop of Kohima.',
    bodyHtml: '<p>An Inaugural Programme for Peace Centre (NEISSR & Peace Channel) was held at Peace Centre, Chümoukedima. The Centre serves as a premier hub for social work education, peace studies, and research in Nagaland and the region.</p>',
    publishedAt: '2022-08-05',
    status: 'published'
  },
  {
    id: 'n3',
    slug: 'neissr-equips-trainees-with-disaster-preparedness-skills',
    title: 'NEISSR equips trainees with disaster preparedness skills',
    category: 'Training',
    excerpt: 'NEISSR in partnership with Home Guards, Civil Defence and SDRF conducted a capacity building and training programme on disaster preparedness.',
    bodyHtml: '<p>NEISSR in partnership with SDRF and Civil Defence conducted a comprehensive emergency response workshop covering CPR, first aid, fire safety, and evacuation drills for social work trainees.</p>',
    publishedAt: '2025-04-07',
    status: 'published'
  }
];

export const SEED_EVENTS: EventItem[] = [
  {
    id: 'e1',
    slug: 'peace-knit-fest-2026',
    title: 'Peace Knit Fest & National Youth Convention',
    startAt: '2026-09-21',
    endAt: '2026-09-22',
    venue: 'Peace Centre Hall, NEISSR, Chümoukedima',
    category: 'Peace & Youth',
    descriptionHtml: '<p>Annual Peace Knit Fest featuring inter-cultural performances, peace awards, youth dialogues, and community harmony initiatives.</p>',
    status: 'published'
  },
  {
    id: 'e2',
    slug: 'annual-sports-meet-2026',
    title: 'NEISSR Annual Sports Meet 2026',
    startAt: '2026-10-26',
    endAt: '2026-10-28',
    venue: 'St. Joseph Ground / Campus Sports Arena',
    category: 'Sports',
    descriptionHtml: '<p>Three-day competitive sports meet under the theme "Winning the Winnables", promoting team spirit and physical wellness.</p>',
    status: 'published'
  },
  {
    id: 'e3',
    slug: 'international-conference-social-scientists',
    title: 'International Conference of Social Scientists & Peace Activists',
    startAt: '2026-04-13',
    endAt: '2026-04-14',
    venue: 'Bishop Abraham Memorial Hall, NEISSR',
    category: 'Conference',
    descriptionHtml: '<p>Bringing together international researchers, peacebuilders, and academic scholars to discuss sustainable development in the North East region.</p>',
    status: 'published'
  }
];

export const SEED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc1',
    title: 'NEISSR Prospectus 2022-23',
    slug: 'prospectus-2022-23',
    category: 'prospectus',
    fileSize: '4.2 MB',
    publishedAt: '2022-08-01',
    description: 'Official prospectus containing course details, eligibility, regulations, and core values.',
    status: 'published'
  },
  {
    id: 'doc2',
    title: 'NEISSR Academic Calendar 2026',
    slug: 'academic-calendar-2026',
    category: 'academic-calendar',
    fileSize: '1.8 MB',
    publishedAt: '2026-01-01',
    description: 'Complete academic routine, examination dates, rural camps, and institutional holidays.',
    status: 'published'
  },
  {
    id: 'doc3',
    title: 'NEISSR Examination Manual',
    slug: 'examination-manual',
    category: 'examination-manual',
    fileSize: '2.5 MB',
    publishedAt: '2022-04-16',
    description: 'Guidelines and procedures for internal assessment tests and Nagaland University term-end examinations.',
    status: 'published'
  },
  {
    id: 'doc4',
    title: 'NIRF 2026 DCS College Report',
    slug: 'nirf-2026-dcs-report',
    category: 'nirf',
    fileSize: '1.1 MB',
    publishedAt: '2026-02-10',
    description: 'Data Capturing System report submitted for National Institutional Ranking Framework 2026.',
    status: 'published'
  },
  {
    id: 'doc5',
    title: 'NAAC Accreditation Certificate B++',
    slug: 'naac-accreditation-certificate',
    category: 'naac',
    fileSize: '850 KB',
    publishedAt: '2024-11-14',
    description: 'NAAC Accredited with Grade B++ (CGPA 2.98), valid through November 2029.',
    status: 'published'
  },
  {
    id: 'doc6',
    title: 'Nagaland University BSW Affiliation & Extension Letter 2026',
    slug: 'nu-bsw-affiliation-2026',
    category: 'affiliations',
    fileSize: '920 KB',
    publishedAt: '2026-05-19',
    description: 'Grant of extension of 5th Year Provisional Affiliation for BSW Programme (50 seats) by Nagaland University.',
    status: 'published'
  },
  {
    id: 'doc7',
    title: 'UGC Section 2(f) Recognition Letter',
    slug: 'ugc-2f-recognition-letter',
    category: 'affiliations',
    fileSize: '650 KB',
    publishedAt: '2021-11-18',
    description: 'UGC recognition letter under Section 2(f) of the UGC Act, 1956.',
    status: 'published'
  },
  {
    id: 'doc8',
    title: 'Societies Registration Renewal Certificate 2024-26',
    slug: 'societies-registration-renewal-2024-26',
    category: 'mandatory-disclosures',
    fileSize: '1.2 MB',
    publishedAt: '2024-10-07',
    description: 'Government of Nagaland Home Department Societies Registration Renewal Certificate.',
    status: 'published'
  },
  {
    id: 'doc9',
    title: 'Eureka Magazine 2023-24 (New Awakening)',
    slug: 'eureka-magazine-2023-24',
    category: 'magazines',
    fileSize: '8.5 MB',
    publishedAt: '2024-05-01',
    description: '4th Edition of Eureka College Annual Magazine featuring student reports, articles, poems, and photo gallery.',
    status: 'published'
  }
];

export const SEED_CLUBS: ClubItem[] = [
  {
    slug: 'green-club',
    name: 'Green Club',
    tagline: 'Environment | Tree plantation, cleanliness drives, eco-awareness',
    descriptionHtml: '<p>Dedicated to ecological restoration, clean campus drives, and environmental sustainability in Nagaland.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Chipai Konyak' },
      { role: 'Co-Convenor', name: 'Livino Sumi' }
    ]
  },
  {
    slug: 'disaster-risk-reduction',
    name: 'Disaster Risk Reduction Club',
    tagline: 'Disaster awareness and preparedness',
    descriptionHtml: '<p>Trains students in emergency management, SDRF rescue techniques, and community risk mitigation.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Student Leader' }
    ]
  },
  {
    slug: 'gender-champions',
    name: 'Gender Champions',
    tagline: 'Gender equality and women empowerment',
    descriptionHtml: '<p>Promotes gender equality, awareness against domestic violence, and advocacy for women rights.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Student Leader' }
    ]
  },
  {
    slug: 'red-ribbon',
    name: 'Red Ribbon Club',
    tagline: 'Health awareness | Blood donation, HIV/AIDS awareness, first aid',
    descriptionHtml: '<p>Collaborates with NSACS and CIHSR to organise blood donation camps and health education.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Limeka P Wotsa' },
      { role: 'Co-Convenor', name: 'Kevingol Toso' }
    ]
  },
  {
    slug: 'fitness',
    name: 'Fitness Club',
    tagline: 'Sports and physical wellness',
    descriptionHtml: '<p>Encourages athletics, yoga sessions, indoor games, and healthy living for social work trainees.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Student Leader' }
    ]
  },
  {
    slug: 'mental-health',
    name: 'Mental Health & Well-being Club',
    tagline: 'Mental health awareness and peer support',
    descriptionHtml: '<p>Fosters emotional resilience, stress management workshops, and psychological peer counseling.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Student Leader' }
    ]
  },
  {
    slug: 'electoral',
    name: 'Electoral Club',
    tagline: 'Democracy, civic awareness, electoral literacy',
    descriptionHtml: '<p>Spreads voter education, civic responsibility, and democratic participation in community settings.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Yantsumong J Yimchunger' },
      { role: 'Co-Convenor', name: 'Filoka' }
    ]
  },
  {
    slug: 'music-cultural',
    name: 'Music & Cultural Club',
    tagline: 'Naga culture, music, heritage preservation',
    descriptionHtml: '<p>Celebrates Naga folk heritage, musical auditions, tribal dances, and cultural exchange programs.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Mantick Phom' },
      { role: 'Co-Convenor', name: 'Justin' }
    ]
  },
  {
    slug: 'media',
    name: 'Media Club',
    tagline: 'Debate, quiz, media literacy, photography',
    descriptionHtml: '<p>Develops journalism, digital story telling, photojournalism, and media communication skills.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Aketo Aye' },
      { role: 'Co-Convenor', name: 'Akashe Sangtam' }
    ]
  },
  {
    slug: 'literary',
    name: 'Literary Club',
    tagline: 'Reading, writing, extempore speech, literary competitions',
    descriptionHtml: '<p>Enhances public speaking, creative writing, debates, and publication of articles and poems.</p>',
    officeBearers: [
      { role: 'Convenor', name: 'Lunsi Yimchunger' },
      { role: 'Co-Convenor', name: 'Liliba Sangtam' }
    ]
  }
];

export const SEED_FORUMS: ForumItem[] = [
  {
    slug: 'peace-forum',
    name: 'Peace Forum',
    tagline: 'Peacebuilding, conflict resolution, reconciliation',
    descriptionHtml: '<p>Drives peer mediation, inter-faith dialogues, peace rallies, and conflict transformation studies.</p>'
  },
  {
    slug: 'social-entrepreneurship',
    name: 'Social Entrepreneurship Forum',
    tagline: 'Social innovation, sustainable enterprise',
    descriptionHtml: '<p>Empowers youth to create self-sustaining enterprises, SHG product marketing, and rural livelihood models.</p>'
  },
  {
    slug: 'youth',
    name: 'Youth Forum',
    tagline: 'Youth empowerment, leadership, advocacy',
    descriptionHtml: '<p>Addresses youth unemployment, skill development workshops, and youth leadership in North East India.</p>'
  },
  {
    slug: 'community-development',
    name: 'Community Development Forum',
    tagline: 'WeKnit programme, SHG strengthening, community adoption',
    descriptionHtml: '<p>Coordinates village adoption, PRA exercises, rural camps, and grassroots community organizing.</p>'
  }
];

export const SEED_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'a1',
    title: 'Miss Chümoukedima & Miss Nagaland 2023',
    achieverName: 'Miss Neiketouno Sechü',
    category: 'Excellence & Leadership',
    year: '2023',
    descriptionHtml: '<p>Student of BSW at NEISSR crowned Miss Chümoukedima and Miss Nagaland 2023, bringing immense honor to the institution.</p>'
  },
  {
    id: 'a2',
    title: 'Miss Niuland 1st Runner-up 2023',
    achieverName: 'Miss Julie Zhimomi',
    category: 'Cultural & Pageantry',
    year: '2023',
    descriptionHtml: '<p>Awarded 1st Runner-up at the Miss Niuland 2023 beauty pageant.</p>'
  },
  {
    id: 'a3',
    title: 'Nagaland Olympic & Paralympic Games 2024 Basketball Bronze',
    achieverName: 'Kezevituo Suokhrie',
    category: 'Sports',
    year: '2024',
    descriptionHtml: '<p>Won Bronze Medal in Basketball at the Nagaland Olympic & Paralympic Games 2024.</p>'
  }
];

export const SEED_PLACED_STUDENTS: PlacementStudent[] = [
  { name: 'Mr. Ajunlo Kent' }, { name: 'Ms. Akila Khiungmong' }, { name: 'Ms. Aningmei Pamei' },
  { name: 'Ms. Bilu Lohe' }, { name: 'Ms. Atheli Hollohon' }, { name: 'Mr. Awa Khing' },
  { name: 'Ms. Dolunla S' }, { name: 'Ms. Epetgomle Martha' }, { name: 'Mr. Hoiwang Konyak' },
  { name: 'Ms. Huvelu Puro' }, { name: 'Mr. Ihansibe Mpom' }, { name: 'Mr. Kambuigai Malangmei' },
  { name: 'Ms. Kelhoulenuo Kire' }, { name: 'Ms. Kerekogwamle' }, { name: 'Ms. Lemrila R' },
  { name: 'Ms. Lilo P Chishi' }, { name: 'Ms. Longtsubeni B Odyuo' }, { name: 'Ms. Lungongailiu Gongmei' },
  { name: 'Ms. Mhashelenu Kin' }, { name: 'Ms. N. Noksensangla Chang' }, { name: 'Ms. Nilotoli Sheqi' },
  { name: 'Mr. Noknyam N Konyak' }, { name: 'Ms. Liddy S Sangtam' }, { name: 'Mr. Panoto Asumi' },
  { name: 'Ms. Poangnyu Konyak' }, { name: 'Ms. Roselyn Maria Reji' }, { name: 'Ms. Sani Koshia' },
  { name: 'Ms. Savino Thakro' }, { name: 'Ms. Sensile Magh' }, { name: 'Mr. Shome' },
  { name: 'Mr. TH Jacob Khongsai' }, { name: 'Ms. Vishili Sakhamo' }, { name: 'Ms. Yupongkokla C Sangtam' },
  { name: 'Ms. Kisuigaule Teila' }, { name: 'Mr. Lemkai Konyak' }, { name: 'Ms. Totivi Jimo' },
  { name: 'Ms. Aviye U Rame' }, { name: 'Ms. Visavonuo Rhetso' }, { name: 'Mr. Solomon V' },
  { name: 'Ms. Vikhamshe Y' }, { name: 'Ms. Kuvukali K Zhimo' }, { name: 'Ms. Ashela M Kips' },
  { name: 'Mr. Pito Aye' }, { name: 'Mr. Melanjungba Jamir' }, { name: 'Ms. Pavirhu Krocha' }
];

export const SEED_STUDENT_COUNCIL: StudentCouncilMember[] = [
  { role: 'President', name: 'Medemwati Longkumer' },
  { role: 'Vice President', name: 'Langkhang S' },
  { role: 'General Secretary', name: 'Asela K Sangtam' },
  { role: 'Assistant General Secretary', name: 'A. Alumla' },
  { role: 'Finance Secretary', name: 'Torunkhum' },
  { role: 'Cultural Secretary', name: 'Melda' },
  { role: 'Assistant Cultural Secretary', name: 'Geganli Rufina' },
  { role: 'Literary Secretary', name: 'Kharele Victoria' },
  { role: 'Assistant Literary Secretary', name: 'Alunsangla K Yimchunger' },
  { role: 'Statistical Secretary', name: 'Suliri C. Sangtam' },
  { role: 'Assistant Statistical Secretary', name: 'Ruokuophrenuo' },
  { role: 'Games & Sports Secretary', name: 'Keneisetuo Aron Rutsa' },
  { role: 'Assistant Games & Sports Secretary', name: 'Yangten C. Phom' },
  { role: 'Information & Publicity Secretary', name: 'Khekavi Zhimo' },
  { role: 'Environmental Secretary', name: 'Lijingla Sangtam' }
];
