import type { Grade, Subject } from './constants';

// NCERT curriculum data organized by subject, grade, and chapters
export const SECTION_HEADERS: {
  [G in Grade]?: {
    [S in Subject]?: readonly string[];
  };
} = {
  '6th': {
    'Arts': [
      'VISUAL ARTS',
      'MUSIC',
      'DANCE',
      'THEATRE'
    ],
    'English': [
      'Unit 1: Fables and Folk Tales',
      'Unit 2: Friendship',
      'Unit 3: Nurturing Nature',
      'Unit 4: Sports and Wellness',
      'Unit 5: Culture and Tradition'
    ],
    'Social Science': [
      'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE',
      'THEME B — TAPESTRY OF THE PAST',
      'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS',
      'THEME D — GOVERNANCE AND DEMOCRACY',
      'THEME E — ECONOMIC LIFE AROUND US'
    ]
  },
  '7th': {
    'English': [
      'Honeycomb',
      'An Alien Hand'
    ],
    'Social Science': [
      'Our Pasts II',
      'Our Environment',
      'Social and Political Life II'
    ]
  },
  '8th': {
    'English': [
      'Honeydew',
      'It So Happened'
    ],
    'Social Science': [
      'Our Pasts III',
      'Resources and Development',
      'Social and Political Life III'
    ]
  },
  '11th': {
    'Biology': [
      'DIVERSITY IN THE LIVING WORLD',
      'STRUCTURAL ORGANISATION IN PLANTS AND ANIMALS',
      'CELL: STRUCTURE AND FUNCTIONS',
      'PLANT PHYSIOLOGY',
      'HUMAN PHYSIOLOGY'
    ],
    'Biotechnology': [
      'Unit I: An Introduction to Biotechnology',
      'Unit II: Cell Organelles and Biomolecules',
      'Unit III: Genetic Principles and Molecular Processes',
      'Unit IV: Quantitative Biology and Bioinformatics',
      'Unit V: Tools and Technologies: Basic Concepts'
    ],
    'Chemistry': [
      'PART I: BASIC CONCEPTS',
      'PART II: ADVANCED CONCEPTS'
    ],
    'Computer Science': [
      'FUNDAMENTALS OF COMPUTER SCIENCE',
      'PROGRAMMING WITH PYTHON'
    ],
    'English': [
      'READING SKILLS',
      'WRITING SKILLS',
      'SHORT STORIES',
      'POETRY',
      'ESSAYS'
    ]
  },
  '12th': {
    'Biology': [
      'REPRODUCTION',
      'GENETICS AND EVOLUTION',
      'BIOLOGY IN HUMAN WELFARE',
      'BIOTECHNOLOGY',
      'ECOLOGY'
    ],
    'Biotechnology': [
      'Unit I: Recombinant DNA Technology',
      'Unit II: Genome Engineering',
      'Unit III: Microbial, Plant, Animal Cell, Organ Culture and Bioprocessing',
      'Unit IV: Bioremediation',
      'Unit V: Recent Innovations in Biotechnology and Entrepreneurship'
    ]
  }
} as const;

export type SectionHeader = typeof SECTION_HEADERS[keyof typeof SECTION_HEADERS][keyof typeof SECTION_HEADERS[keyof typeof SECTION_HEADERS]][number];

type ChemistryGrade = {
  [G in Grade]?: G extends '11th' | '12th'
    ? { 'Part I': readonly string[]; 'Part II': readonly string[] }
    : readonly string[];
};

type PhysicsGrade = {
  [G in Grade]?: G extends '11th' | '12th'
    ? { 'Part I': readonly string[]; 'Part II': readonly string[] }
    : readonly string[];
};

type MathematicsGrade = {
  [G in Grade]?: G extends '12th'
    ? { 'Part I': readonly string[]; 'Part II': readonly string[] }
    : readonly string[];
};

export const NCERT_CURRICULUM: {
  [S in Subject]?: S extends 'Chemistry' 
    ? ChemistryGrade 
    : S extends 'Physics'
    ? PhysicsGrade
    : S extends 'Mathematics'
    ? MathematicsGrade
    : {
      [G in Grade]?: readonly string[];
    } & (S extends 'Social Science' 
      ? {
        'Contemporary India I'?: readonly string[];
        'Democratic Politics I'?: readonly string[];
        'India and the Contemporary World I'?: readonly string[];
        'Economics'?: readonly string[];
        'Contemporary India II'?: readonly string[];
        'Democratic Politics II'?: readonly string[];
        'India and the Contemporary World II'?: readonly string[];
        'Understanding Economic Development'?: readonly string[];
      }
      : {});
} = {
  Arts: {
    '6th': [
      'VISUAL ARTS',
      'Objects and Still Life',
      'Changing the Typical Picture',
      'Portraying People',
      'Paper Crafts',
      'Seals to Prints',
      'MUSIC',
      'Music and your Emotions',
      'Musical Instruments',
      'Tal or Talam and Raga or Ragam in Indian Music',
      'Melodies of Diversity',
      'Songwriting',
      'Music and Society',
      'DANCE',
      'My Body in Motion',
      'Breaking Barriers with Dance',
      'Harmony in Motion',
      'Dances of Our Land',
      'THEATRE',
      'Emotions Unveiled',
      'Let\'s Design',
      'In the Company of Theatre',
      'Stories of Shadows and Strings — Puppetry',
      'The Grand Finale',
      'Integration of All Art Forms',
      'Assessment'
    ]
  },
  English: {
    '6th': [
      'Unit 1: Fables and Folk Tales',
      'A Bottle of Dew',
      'The Raven and the Fox',
      'Rama to the Rescue',
      'Unit 2: Friendship',
      'The Unlikely Best Friends',
      'A Friend\'s Prayer',
      'The Chair',
      'Unit 3: Nurturing Nature',
      'Neem Baba',
      'What a Bird Thought',
      'Spices that Heal Us',
      'Unit 4: Sports and Wellness',
      'Change of Heart',
      'The Winner',
      'Yoga—A Way of Life',
      'Unit 5: Culture and Tradition',
      'Hamara Bharat—Incredible India!',
      'The Kites',
      'Ila Sachani: Embroidering Dreams with her Feat',
      'National War Memorial'
    ],
    '7th': [
      'Honeycomb',
      'Three Questions',
      '_The Squirrel_',
      'A Gift of Chappals',
      '_The Rebel_',
      'Gopal and the Hilsa Fish',
      '_The Shed_',
      'The Ashes That Made Trees Bloom',
      '_Chivvy_',
      'Quality',
      '_Trees_',
      'Expert Detectives',
      '_Mystery of the Talking Fan_',
      'The Invention of Vita-Wonk',
      '_Dad and the Cat and the Tree_',
      '_Garden Snake_',
      'A Homage to Our Brave Soldiers',
      '_Meadow Surprises_'
    ],
    '8th': [
      'The Best Christmas Present in the World',
      '_The Ant and the Cricket_',
      'The Tsunami',
      '_Geography Lesson_',
      'Glimpses of the Past',
      '_Macavity: The Mystery Cat_',
      'Bepin Choudhury\'s Lapse of Memory',
      '_The Last Bargain_',
      'The Summit Within',
      '_The School Boy_',
      'This is Jody\'s Fawn',
      '_The Duck and the Kangaroo_',
      'A Visit to Cambridge',
      '_When I Set Out for Lyonnesse_',
      'A Short Monsoon Diary',
      '_On the Grasshopper and Cricket_',
      'The Great Stone Face–I',
      'The Great Stone Face–II'
    ],
    '9th': [
      'Beehive',
      'The Fun They Had',
      '_The Road Not Taken_',
      'The Sound of Music',
      '_Wind_',
      'The Little Girl',
      '_Rain on the Roof_',
      'A Truly Beautiful Mind',
      '_The Lake Isle of Innisfree_',
      'The Snake and the Mirror',
      '_A Legend of the Northland_',
      'My Childhood',
      '_No Men Are Foreign_',
      'Reach for the Top',
      '_On Killing a Tree_',
      'Kathmandu',
      '_A Slumber Did My Spirit Seal_',
      'If I Were You',
      'Moments',
      'The Lost Child',
      'The Adventure of Toto',
      'Iswaran the Storyteller',
      'In the Kingdom of Fools',
      'The Happy Prince',
      'Weathering the Storm in Ersama',
      'The Last Leaf',
      'A House Is Not a Home',
      'The Beggar'
    ],
    '11th': [
      'READING SKILLS',
      'The Portrait of a Lady',
      'A Photograph',
      'We\'re Not Afraid to Die... if We Can All Be Together',
      'Discovering Tut: The Saga Continues',
      'The Laburnum Top',
      'The Voice of the Rain',
      'The Ailing Planet: the Green Movement\'s Role',
      'Childhood',
      'The Adventure',
      'Silk Road',
      'Father to Son',
      'WRITING SKILLS',
      'Note-making',
      'Summarising',
      'Sub-titling',
      'Essay-writing',
      'Letter-writing',
      'Creative Writing'
    ]
  },
  Mathematics: {
    '6th': [
      'Patterns in Mathematics',
      'Lines and Angles',
      'Number Play',
      'Data Handling and Presentation',
      'Prime Time',
      'Perimeter and Area',
      'Fractions',
      'Playing with Constructions',
      'Symmetry',
      'The Other Side of Zero'
    ],
    '7th': [
      'Integers',
      'Fractions and Decimals',
      'Data Handling',
      'Simple Equations',
      'Lines and Angles',
      'Triangle and its Properties',
      'Congruence of Triangles',
      'Comparing Quantities',
      'Rational Numbers',
      'Practical Geometry',
      'Perimeter and Area',
      'Algebraic Expressions',
      'Exponents and Powers',
      'Symmetry',
      'Visualising Solid Shapes'
    ],
    '8th': [
      'Rational Numbers',
      'Linear Equations in One Variable',
      'Understanding Quadrilaterals',
      'Data Handling',
      'Squares and Square Roots',
      'Cubes and Cube Roots',
      'Comparing Quantities',
      'Algebraic Expressions and Identities',
      'Mensuration',
      'Exponents and Powers',
      'Direct and Inverse Proportions',
      'Factorization',
      'Introduction to Graphs'
    ],
    '9th': [
      'Number Systems',
      'Polynomials',
      'Coordinate Geometry',
      'Linear Equations in Two Variables',
      'Introduction to Euclid`s Geometry',
      'Lines and Angles',
      'Triangles',
      'Quadrilaterals',
      'Areas of Parallelograms and Triangles',
      'Circles',
      'Constructions',
      'Heron`s Formula',
      'Surface Areas and Volumes',
      'Statistics',
      'Probability'
    ],
    '10th': [
      'Real Numbers',
      'Polynomials',
      'Pair of Linear Equations in Two Variables',
      'Quadratic Equations',
      'Arithmetic Progressions',
      'Triangles',
      'Coordinate Geometry',
      'Introduction to Trigonometry',
      'Applications of Trigonometry',
      'Circles',
      'Areas Related to Circles',
      'Surface Areas and Volumes',
      'Statistics',
      'Probability'
    ],
    '11th': [
      'Sets',
      'Relations and Functions',
      'Trigonometric Functions',
      'Complex Numbers and Quadratic Equations',
      'Linear Inequalities',
      'Permutations and Combinations',
      'Binomial Theorem',
      'Sequences and Series',
      'Straight Lines',
      'Conic Sections',
      'Introduction to Three Dimensional Geometry',
      'Limits and Derivatives',
      'Statistics',
      'Probability'
    ],
    '12th': {
      'Part I': [
        'Relations and Functions',
        'Inverse Trigonometric Functions',
        'Matrices',
        'Determinants',
        'Continuity and Differentiability',
        'Application of Derivatives'
      ],
      'Part II': [
        'Integrals',
        'Application of Integrals',
        'Differential Equations',
        'Vector Algebra',
        'Three-Dimensional Geometry',
        'Linear Programming',
        'Probability'
      ]
    }
  },
  Science: {
    '6th': [
      'The Wonderful World of Science',
      'Diversity in the Living World',
      'Mindful Eating: A Path to a Healthy Body',
      'Exploring Magnets',
      'Measurement of Length and Motion',
      'Materials Around Us',
      'Temperature and its Measurement',
      'A Journey through States of Water',
      'Methods of Separation in Everyday Life',
      'Living Creatures: Exploring their Characteristics',
      'Nature\'s Treasures',
      'Beyond Earth'
    ],
    '7th': [
      'Nutrition in Plants',
      'Nutrition in Animals',
      'Fibre to Fabric',
      'Heat',
      'Acids, Bases and Salts',
      'Physical and Chemical Changes',
      'Weather, Climate and Adaptations of Animals to Climate',
      'Winds, Storms and Cyclones',
      'Soil',
      'Respiration in Organisms',
      'Transportation in Animals and Plants',
      'Reproduction in Plants',
      'Motion and Time',
      'Electric Current and its Effects',
      'Light',
      'Water: A Precious Resource',
      'Forests: Our Lifeline',
      'Wastewater Story'
    ],
    '8th': [
      'Crop Production and Management',
      'Microorganisms: Friend and Foe',
      'Coal and Petroleum',
      'Combustion and Flame',
      'Conservation of Plants and Animals',
      'Reproduction in Animals',
      'Reaching the Age of Adolescence',
      'Force and Pressure',
      'Friction',
      'Sound',
      'Chemical Effects of Electric Current',
      'Some Natural Phenomena',
      'Light'
    ],
    '9th': [
      'Matter in Our Surroundings',
      'Is Matter Around Us Pure',
      'Atoms and Molecules',
      'Structure of the Atom',
      'The Fundamental Unit of Life',
      'Tissues',
      'Diversity in Living Organisms',
      'Motion',
      'Force and Laws of Motion',
      'Gravitation',
      'Work and Energy',
      'Sound',
      'Why Do We Fall Ill',
      'Natural Resources',
      'Improvement in Food Resources'
    ],
    '10th': [
      'Chemical Reactions and Equations',
      'Acids, Bases, and Salts',
      'Metals and Non-Metals',
      'Carbon and Its Compounds',
      'Life Processes',
      'Control and Coordination',
      'How Do Organisms Reproduce?',
      'Heredity',
      'Light – Reflection and Refraction',
      'Human Eye and the Colourful World',
      'Electricity',
      'Magnetic Effects of Electric Current',
      'Our Environment'
    ]
  },
  'Social Science': {
    '6th': [
      'THEME A — INDIA AND THE WORLD: LAND AND THE PEOPLE',
      'Locating Places on the Earth',
      'Oceans and Continents',
      'Landforms and Life',
      'THEME B — TAPESTRY OF THE PAST',
      'Timeline and Sources of History',
      'India, That Is Bharat',
      'The Beginnings of Indian Civilisation',
      'THEME C — OUR CULTURAL HERITAGE AND KNOWLEDGE TRADITIONS',
      'India\'s Cultural Roots',
      'Unity in Diversity, or \'Many in the One\'',
      'THEME D — GOVERNANCE AND DEMOCRACY',
      'Family and Community',
      'Grassroots Democracy — Part 1: Governance',
      'Grassroots Democracy — Part 2: Local Government in Rural Areas',
      'Grassroots Democracy — Part 3: Local Government in Urban Areas',
      'THEME E — ECONOMIC LIFE AROUND US',
      'The Value of Work',
      'Economic Activities Around Us'
    ],
    '7th': [
      'Our Pasts II',
      'Introduction: Tracing Changes Through A Thousand Years',
      'Kings and Kingdoms',
      'Delhi: 12th to 15th Century',
      'The Mughals (16th to 17th Century)',
      'Tribes, Nomads and Settled Communities',
      'Devotional Paths to the Divine',
      'The Making of Regional Cultures',
      'Eighteenth-Century Political Formations',
      'Our Environment',
      'Environment',
      'Inside Our Earth',
      'Our Changing Earth',
      'Air',
      'Water',
      'Human Environment Interactions: The Tropical and Subtropical Regions',
      'Life in the Deserts',
      'Social and Political Life II',
      'On Equality',
      'Role of the Government in Health',
      'How the State Government Works',
      'Growing up as Boys and Girls',
      'Women Change the World',
      'Understanding Media',
      'Markets Around Us',
      'A Shirt in the Market'
    ],
    '8th': [
      'Our Pasts III',
      'How, When and Where',
      'From Trade to Territory',
      'Ruling the Countryside',
      'Tribals, Dikus and the Vision of a Golden Age',
      'When People Revolt 1857 and After',
      'Weavers, Iron Smelters and Factory Owners',
      'Civilising the "Native", Educating the Nation',
      'Women, Caste and Reform',
      'The Making of the National Movement: 1870s-1947',
      'India After Independence',
      'Resources and Development',
      'Resources',
      'Land, Soil, Water, Natural Vegetation and Wildlife Resources',
      'Agriculture',
      'Industries',
      'Human Resources',
      'Social and Political Life III',
      'The Indian Constitution',
      'Understanding Secularism',
      'Why Do We Need a Parliament?',
      'Understanding Laws',
      'Judiciary',
      'Understanding Our Criminal Justice System',
      'Understanding Marginalisation',
      'Confronting Marginalisation',
      'Public Facilities',
      'Law and Social Justice'
    ],
    'Contemporary India I': [
      'India - Size and Location',
      'Physical Features of India',
      'Drainage',
      'Climate',
      'Natural Vegetation and Wildlife',
      'Population'
    ],
    'Democratic Politics I': [
      'What is democracy? Why democracy?',
      'Constitutional design',
      'Electoral politics',
      'Working of Institutions',
      'Democratic rights'
    ],
    'India and the Contemporary World I': [
      'The French Revolution',
      'Socialism in Europe and the Russian Revolution',
      'Nazism and the Rise of Hitler',
      'Forest Society and Colonialism',
      'Pastoralists in the Modern World'
    ],
    'Economics': [
      'The Story of Village Palampur',
      'People as Resource',
      'Poverty as a Challenge',
      'Food Security in India'
    ],
    'Contemporary India II': [
      'Resources and Development',
      'Forest and Wildlife Resources',
      'Water Resources',
      'Agriculture',
      'Minerals and Energy Resources',
      'Manufacturing Industries',
      'Lifelines of National Economy'
    ],
    'Democratic Politics II': [
      'Power-sharing',
      'Federalism',
      'Gender, Religion, and Caste',
      'Political Parties',
      'Outcomes of Democracy'
    ],
    'India and the Contemporary World II': [
      'The Rise of Nationalism in Europe',
      'Nationalism in India',
      'The Making of a Global World',
      'The Age of Industrialization',
      'Print Culture and the Modern World'
    ],
    'Understanding Economic Development': [
      'Development',
      'Sectors of the Indian Economy',
      'Money and Credit',
      'Globalisation and the Indian Economy',
      'Consumer Rights'
    ]
  },
  'Health and Physical Education': {
    '9th': [
      'Health and Diseases',
      'Growing up with Confidence',
      'Physical Education',
      'Physical Fitness',
      'Sports Training',
      'Individual Sports',
      'Team Games',
      'Ethics in Sports',
      'Personality Development through Yoga',
      'Waste Management',
      'Diet for Healthy Living',
      'First Aid and Safety',
      'Social Health',
      'Adolescent Friendly Health Services'
    ],
    '10th': [
      'Physical Education: Relation with other Subjects',
      'Effects of Physical Activities on Human Body',
      'Growth and Development during Adolescence',
      'Individual Games and Sports I',
      'Individual Games and Sports II',
      'Team Games and Sports I',
      'Team Games and Sports II',
      'Yoga for Healthy Living',
      'Dietary Considerations and Food Quality',
      'Safety Measures for Healthy Living',
      'Healthy Community Living',
      'Social Health',
      'Agencies and Awards Promoting Health, Sports and Yoga'
    ],
    '11th': [
      'Physical Education',
      'Understanding Health',
      'Physical and Physiological Aspects of Physical Education and Sports',
      'Individual Games',
      'Team Games',
      'Yoga and its Relevance in the Modern Times',
      'Safety and Security',
      'Health Related Physical Fitness',
      'Measurement and Evaluation',
      'Tournaments and Competitions',
      'Adventure Sports'
    ]
  },
  'ICT': {
    '9th': [
      'Introduction to ICT',
      'Creating Textual Communication',
      'Creating Visual Communication',
      'Creating Audio-Video Communication',
      'Presenting Ideas',
      'Getting Connected: Internet',
      'Safety and Security in the Cyber World',
      'Fun with Logic'
    ]
  },
  'Biology': {
    '11th': [
      'DIVERSITY IN THE LIVING WORLD',
      'The Living World',
      'Biological Classification',
      'Plant Kingdom',
      'Animal Kingdom',
      'STRUCTURAL ORGANISATION IN PLANTS AND ANIMALS',
      'Morphology of Flowering Plants',
      'Anatomy of Flowering Plants',
      'Structural Organisation in Animals',
      'CELL: STRUCTURE AND FUNCTIONS',
      'Cell: The Unit of Life',
      'Biomolecules',
      'Cell Cycle and Cell Division',
      'PLANT PHYSIOLOGY',
      'Photosynthesis in Higher Plants',
      'Respiration in Plants',
      'Plant Growth and Development',
      'HUMAN PHYSIOLOGY',
      'Breathing and Exchange of Gases',
      'Body Fluids and Circulation',
      'Excretory Products and their Elimination',
      'Locomotion and Movement',
      'Neural Control and Coordination',
      'Chemical Coordination and Integration'
    ],
    '12th': [
      'REPRODUCTION',
      'Sexual Reproduction in Flowering Plants',
      'Human Reproduction',
      'Reproductive Health',
      'GENETICS AND EVOLUTION',
      'Principles of Inheritance and Variation',
      'Molecular Basis of Inheritance',
      'Evolution',
      'BIOLOGY IN HUMAN WELFARE',
      'Human Health and Disease',
      'Microbes in Human Welfare',
      'BIOTECHNOLOGY',
      'Biotechnology – Principles and Processes',
      'Biotechnology and Its Applications',
      'ECOLOGY',
      'Organisms and Populations',
      'Ecosystem',
      'Biodiversity and Conservation'
    ]
  },
  'Biotechnology': {
    '11th': [
      'Unit I: An Introduction to Biotechnology',
      'Introduction',
      'Unit II: Cell Organelles and Biomolecules',
      'Cellular Organelles',
      'Biomolecules',
      'Enzymes and Bioenergetics',
      'Cellular Processes',
      'Unit III: Genetic Principles and Molecular Processes',
      'Basic Principles of Inheritance',
      'Basic Processes',
      'Genetic Disorder',
      'Unit IV: Quantitative Biology and Bioinformatics',
      'Introduction to Bioinformatics',
      'Protein Informatics and Cheminformatics',
      'Programming and Systems Biology',
      'Unit V: Tools and Technologies: Basic Concepts',
      'Tools and Technologies'
    ],
    '12th': [
      'Unit I: Recombinant DNA Technology',
      'An Overview of Recombinant DNA Technology',
      'Host-Vector System',
      'Gene Cloning',
      'Applications of Recombinant DNA Technology',
      'Unit II: Genome Engineering',
      'Genome Technology and Engineering',
      'Unit III: Microbial, Plant, Animal Cell, Organ Culture and Bioprocessing',
      'Microbial Culture',
      'Plant Tissue Culture',
      'Animal Cell Culture',
      'Stem Cell Culture and Organ Culture',
      'Bioprocessing and Biomanufacturing',
      'Unit IV: Bioremediation',
      'Bioremediation',
      'Unit V: Recent Innovations in Biotechnology and Entrepreneurship',
      'Recent Innovations in Biotechnology',
      'Entrepreneurship'
    ]
  },
  'Chemistry': {
    '11th': {
      'Part I': [
        'Some Basic Concepts of Chemistry',
        'Structure of Atom',
        'Classification of Elements and Periodicity in Properties',
        'Chemical Bonding and Molecular Structure',
        'Thermodynamics',
        'Equilibrium'
      ],
      'Part II': [
        'Redox Reactions',
        'General Introduction',
        'Hydrocarbons'
      ]
    },
    '12th': {
      'Part I': [
        'Solutions',
        'Electrochemistry',
        'Chemical Kinetics',
        'The d- and f-Block Elements',
        'Coordination Compounds'
      ],
      'Part II': [
        'Haloalkanes and Haloarenes',
        'Alcohols, Phenols, and Ethers',
        'Aldehydes, Ketones, and Carboxylic Acids',
        'Amines',
        'Biomolecules'
      ]
    }
  },
  'Computer Science': {
    '11th': [
      'Computer System',
      'Encoding Schemes and Number System',
      'Emerging Trends',
      'Introduction to Problem Solving',
      'Getting Started with Python',
      'Flow of Control',
      'Functions',
      'Strings',
      'Lists',
      'Tuples and Dictionaries',
      'Societal Impact'
    ],
    '12th': [
      'Exception Handling in Python',
      'File Handling in Python',
      'Stack',
      'Queue',
      'Sorting',
      'Searching',
      'Understanding Data',
      'Database Concepts',
      'Structured Query Language (SQL)',
      'Computer Networks',
      'Data Communication',
      'Security Aspects',
      'Project Based Learning'
    ]
  },
  'Informatics Practices': {
    '11th': [
      'Computer System',
      'Emerging Trends',
      'Brief Overview of Python',
      'Working with Lists and Dictionaries',
      'Understanding Data',
      'Introduction to NumPy',
      'Database Concepts',
      'Introduction to Structured Query Language (SQL)'
    ],
    '12th': [
      'Querying and SQL Functions',
      'Data Handling using Pandas - I',
      'Data Handling using Pandas - II',
      'Plotting Data using Matplotlib',
      'Internet and Web',
      'Societal Impacts',
      'Project Based Learning'
    ]
  },
  'Physics': {
    '11th': {
      'Part I': [
        'Units and Measurements',
        'Motion in a Straight Line',
        'Motion in a Plane',
        'Laws of Motion',
        'Work, Energy and Power',
        'System of Particles and Rotational Motion',
        'Gravitation'
      ],
      'Part II': [
        'Mechanical Properties of Solids',
        'Mechanical Properties of Fluids',
        'Thermal Properties of Matter',
        'Thermodynamics',
        'Kinetic Theory',
        'Oscillations',
        'Waves'
      ]
    }
  }
} as const;

export type MultiBookGrade = Extract<Grade, '7th' | '8th' | '9th' | '10th' | '11th' | '12th'>;
export type MultiBookSubject = Extract<Subject, 'English' | 'Social Science' | 'Chemistry' | 'Physics' | 'Mathematics'>;

export const isMultiBookGrade = (grade: Grade): grade is MultiBookGrade => {
  return grade === '7th' || grade === '8th' || grade === '9th' || grade === '10th' || grade === '11th' || grade === '12th';
};

export const hasMultipleTextbooks = (grade: Grade, subject: Subject): boolean => {
  if ((grade === '11th' || grade === '12th') && (subject === 'Chemistry' || subject === 'English' || subject === 'Physics')) return true;
  if (grade === '12th' && subject === 'Mathematics') return true;
  return isMultiBookGrade(grade) && (subject === 'English' || subject === 'Social Science');
};

export interface Chapter {
  title: string;
  number: number;
  textbook?: string;
}

type SocialScienceTextbook9th = 
  | 'Contemporary India I'
  | 'Democratic Politics I'
  | 'India and the Contemporary World I'
  | 'Economics';

type SocialScienceTextbook10th = 
  | 'Contemporary India II'
  | 'Democratic Politics II'
  | 'India and the Contemporary World II'
  | 'Understanding Economic Development';

type ChapterRecord = Record<string, readonly string[]>;

export type GradeChapters = {
  '7th': {
    English: ChapterRecord;
    'Social Science': ChapterRecord;
  };
  '8th': {
    English: ChapterRecord;
    'Social Science': ChapterRecord;
  };
  '9th': {
    English: ChapterRecord;
    'Social Science': Record<SocialScienceTextbook9th, readonly string[]>;
  };
  '10th': {
    English: ChapterRecord;
    'Social Science': Record<SocialScienceTextbook10th, readonly string[]>;
  };
  '11th': {
    Chemistry: {
      'Part I': readonly string[];
      'Part II': readonly string[];
    };
    Physics: {
      'Part I': readonly string[];
      'Part II': readonly string[];
    };
    English: {
      'Hornbill': readonly string[];
      'Snapshots': readonly string[];
      'The Woven Words': readonly string[];
    };
  };
  '12th': {
    Chemistry: {
      'Part I': readonly string[];
      'Part II': readonly string[];
    };
    Physics: {
      'Part I': readonly string[];
      'Part II': readonly string[];
    };
    Mathematics: {
      'Part I': readonly string[];
      'Part II': readonly string[];
    };
    English: {
      'Kaleidoscope': readonly string[];
      'Flamingo': readonly string[];
      'Vistas': readonly string[];
    };
  };
};

export const MULTI_GRADE_CHAPTERS: GradeChapters = {
  '7th': {
    'English': {
      'Honeycomb': [
        'Three Questions',
        '_The Squirrel_',
        'A Gift of Chappals',
        '_The Rebel_',
        'Gopal and the Hilsa Fish',
        '_The Shed_',
        'The Ashes That Made Trees Bloom',
        '_Chivvy_',
        'Quality',
        '_Trees_',
        'Expert Detectives',
        '_Mystery of the Talking Fan_',
        'The Invention of Vita-Wonk',
        '_Dad and the Cat and the Tree_',
        '_Garden Snake_',
        'A Homage to Our Brave Soldiers',
        '_Meadow Surprises_'
      ],
      'An Alien Hand': [
        'The Tiny Teacher',
        'Bringing Up Kari',
        'Golu Grows a Nose',
        'Chandni',
        'The Bear Story',
        'A Tiger in the House',
        'An Alien Hand'
      ]
    },
    'Social Science': {
      'Our Pasts II': [
        'Introduction: Tracing Changes Through A Thousand Years',
        'Kings and Kingdoms',
        'Delhi: 12th to 15th Century',
        'The Mughals (16th to 17th Century)',
        'Tribes, Nomads and Settled Communities',
        'Devotional Paths to the Divine',
        'The Making of Regional Cultures',
        'Eighteenth-Century Political Formations'
      ],
      'Our Environment': [
        'Environment',
        'Inside Our Earth',
        'Our Changing Earth',
        'Air',
        'Water',
        'Human Environment Interactions: The Tropical and Subtropical Regions',
        'Life in the Deserts'
      ],
      'Social and Political Life II': [
        'On Equality',
        'Role of the Government in Health',
        'How the State Government Works',
        'Growing up as Boys and Girls',
        'Women Change the World',
        'Understanding Media',
        'Markets Around Us',
        'A Shirt in the Market'
      ]
    }
  },
  '8th': {
    'English': {
      'Honeydew': [
        'The Best Christmas Present in the World',
        '_The Ant and the Cricket_',
        'The Tsunami',
        '_Geography Lesson_',
        'Glimpses of the Past',
        'Bepin Choudhury\'s Lapse of Memory',
        '_The Last Bargain_',
        'The Summit Within',
        '_The School Boy_',
        'This is Jody\'s Fawn',
        'A Visit to Cambridge',
        'A Short Monsoon Diary',
        '_On the Grasshopper and Cricket_'
      ],
      'It So Happened': [
        'How the Camel got his hump',
        'Children at work',
        'The Selfish Giant',
        'The treasure within',
        'Princess September',
        'The fight',
        'Jalebis',
        'Ancient Education System of India'
      ]
    },
    'Social Science': {
      'Our Pasts III Part 1': [
        'Introduction: How, When and Where',
        'From Trade to Territory The Company Establishes Power'
      ],
      'Our Pasts III Part 2': [
        'Ruling the Countryside',
        'Tribals, Dikus and the Vision of a Golden Age',
        'When People Revolt 1857 and After'
      ],
      'Resources and Development': [
        'Resources',
        'Land, Soil, Water, Natural Vegetation and Wildlife Resources',
        'Agriculture',
        'Industries',
        'Human Resources'
      ],
      'Social and Political Life III': [
        'The Indian Constitution',
        'Understanding Secularism',
        'Parliament and the Making of Laws',
        'Judiciary',
        'Understanding Marginalization',
        'Confronting Marginalization',
        'Public Facilities',
        'Law and Social Justice'
      ]
    }
  },
  '9th': {
    'English': {
      'Beehive': [
        'The Fun They Had',
        '_The Road Not Taken_',
        'The Sound of Music',
        '_Wind_',
        'The Little Girl',
        '_Rain on the Roof_',
        'A Truly Beautiful Mind',
        '_The Lake Isle of Innisfree_',
        'The Snake and the Mirror',
        '_A Legend of the Northland_',
        'My Childhood',
        '_No Men Are Foreign_',
        'Reach for the Top',
        '_On Killing a Tree_',
        'Kathmandu',
        '_A Slumber Did My Spirit Seal_',
        'If I Were You'
      ],
      'Moments': [
        'The Lost Child',
        'The Adventure of Toto',
        'Iswaran the Storyteller',
        'In the Kingdom of Fools',
        'The Happy Prince',
        'Weathering the Storm in Ersama',
        'The Last Leaf',
        'A House Is Not a Home',
        'The Beggar'
      ]
    },
    'Social Science': {
      'Contemporary India I': [
        'India - Size and Location',
        'Physical Features of India',
        'Drainage',
        'Climate',
        'Natural Vegetation and Wildlife',
        'Population'
      ],
      'Democratic Politics I': [
        'What is democracy? Why democracy?',
        'Constitutional design',
        'Electoral politics',
        'Working of Institutions',
        'Democratic rights'
      ],
      'India and the Contemporary World I': [
        'The French Revolution',
        'Socialism in Europe and the Russian Revolution',
        'Nazism and the Rise of Hitler',
        'Forest Society and Colonialism',
        'Pastoralists in the Modern World'
      ],
      'Economics': [
        'The Story of Village Palampur',
        'People as Resource',
        'Poverty as a Challenge',
        'Food Security in India'
      ]
    }
  },
  '10th': {
    'English': {
      'First Flight': [
        'A Letter to God',
        '_Dust of Snow_',
        '_Fire and Ice_',
        'Nelson Mandela: Long Walk to Freedom',
        '_A Tiger in the Zoo_',
        'Two Stories About Flying',
        '_How to Tell Wild Animals_',
        '_The Ball Poem_',
        'From the Diary of Anne Frank',
        '_Amanda!_',
        'Glimpses of India',
        '_The Trees_',
        'Mijbil the Otter',
        '_Fog_',
        'Madam Rides the Bus',
        '_The Tale of Custard the Dragon_',
        'The Sermon at Benares',
        '_For Anne Gregory_',
        'The Proposal'
      ],
      'Footprints Without Feet': [
        'A Triumph of Surgery',
        'The Thief\'s Story',
        'The Midnight Visitor',
        'A Question of Trust',
        'Footprints Without Feet',
        'The Making of a Scientist',
        'The Necklace',
        'The Hack Driver',
        'Bholi',
        'The Book That Saved the Earth'
      ]
    },
    'Social Science': {
      'Contemporary India II': [
        'Resources and Development',
        'Forest and Wildlife Resources',
        'Water Resources',
        'Agriculture',
        'Minerals and Energy Resources',
        'Manufacturing Industries',
        'Lifelines of National Economy'
      ],
      'Democratic Politics II': [
        'Power-sharing',
        'Federalism',
        'Gender, Religion, and Caste',
        'Political Parties',
        'Outcomes of Democracy'
      ],
      'India and the Contemporary World II': [
        'The Rise of Nationalism in Europe',
        'Nationalism in India',
        'The Making of a Global World',
        'The Age of Industrialization',
        'Print Culture and the Modern World'
      ],
      'Understanding Economic Development': [
        'Development',
        'Sectors of the Indian Economy',
        'Money and Credit',
        'Globalisation and the Indian Economy',
        'Consumer Rights'
      ]
    }
  },
  '11th': {
    'Chemistry': {
      'Part I': [
        'Some Basic Concepts of Chemistry',
        'Structure of Atom',
        'Classification of Elements and Periodicity in Properties',
        'Chemical Bonding and Molecular Structure',
        'Thermodynamics',
        'Equilibrium'
      ],
      'Part II': [
        'Redox Reactions',
        'General Introduction',
        'Hydrocarbons'
      ]
    },
    'Physics': {
      'Part I': [
        'Units and Measurements',
        'Motion in a Straight Line',
        'Motion in a Plane',
        'Laws of Motion',
        'Work, Energy and Power',
        'System of Particles and Rotational Motion',
        'Gravitation'
      ],
      'Part II': [
        'Mechanical Properties of Solids',
        'Mechanical Properties of Fluids',
        'Thermal Properties of Matter',
        'Thermodynamics',
        'Kinetic Theory',
        'Oscillations',
        'Waves'
      ]
    },
    'English': {
      'Hornbill': [
        'READING SKILLS',
        'The Portrait of a Lady',
        'A Photograph',
        'We\'re Not Afraid to Die... if We Can All Be Together',
        'Discovering Tut: The Saga Continues',
        'The Laburnum Top',
        'The Voice of the Rain',
        'The Ailing Planet: the Green Movement\'s Role',
        'Childhood',
        'The Adventure',
        'Silk Road',
        'Father to Son',
        'WRITING SKILLS',
        'Note-making',
        'Summarising',
        'Sub-titling',
        'Essay-writing',
        'Letter-writing',
        'Creative Writing'
      ],
      'Snapshots': [
        'The Summer of the Beautiful White Horse',
        'The Address',
        'Ranga\'s Marriage',
        'Albert Einstein at School',
        'Mother\'s Day',
        'The Ghat of the Only World',
        'Birth',
        'The Tale of Melon City'
      ],
      'The Woven Words': [
        'SHORT STORIES',
        'The Lament',
        'A Pair of Mustachios Mulk',
        'The Rocking-horse Winner',
        'The Adventure of the Three Garrideb',
        'Pappachi\'s Moth',
        'The Third and Final Continent',
        'Glory at Twilight',
        'The Luncheon',
        'POETRY',
        'The Peacock',
        'Let me Not to the Marriage of True Minds',
        'Coming',
        'Telephone Conversation',
        'The World is too Much With Us',
        'Mother Tongue',
        'Hawk Roosting',
        'For Elkana (The Limerick)',
        'Refugee Blues',
        'Felling of the Banyan Tree',
        'Ode to a Nightingale',
        'Ajamil and the Tigers Arun',
        'ESSAYS',
        'My Watch',
        'My Three Passions',
        'Patterns of Creativity',
        'Tribal Verse',
        'What is a Good Book?',
        'The Story',
        'Bridges'
      ]
    }
  },
  '12th': {
    Chemistry: {
      'Part I': [
        'Solutions',
        'Electrochemistry',
        'Chemical Kinetics',
        'Surface Chemistry',
        'd and f Block Elements',
        'Coordination Compounds'
      ],
      'Part II': [
        'Haloalkanes and Haloarenes',
        'Alcohols, Phenols, and Ethers',
        'Aldehydes, Ketones, and Carboxylic Acids',
        'Amines',
        'Biomolecules'
      ]
    },
    Physics: {
      'Part I': [
        'Electric Charges and Fields',
        'Electrostatic Potential and Capacitance',
        'Current Electricity',
        'Moving Charges and Magnetism',
        'Magnetism and Matter',
        'Electromagnetic Induction',
        'Alternating Current',
        'Electromagnetic Waves'
      ],
      'Part II': [
        'Ray Optics and Optical Instruments',
        'Wave Optics',
        'Atoms',
        'Nuclei',
        'Semiconductor Electronics: Materials, Devices, and Simple Circuits'
      ]
    },
    Mathematics: {
      'Part I': [
        'Relations and Functions',
        'Inverse Trigonometric Functions',
        'Matrices',
        'Determinants',
        'Continuity and Differentiability',
        'Application of Derivatives'
      ],
      'Part II': [
        'Integrals',
        'Application of Integrals',
        'Differential Equations',
        'Vector Algebra',
        'Three-Dimensional Geometry',
        'Linear Programming',
        'Probability'
      ]
    },
    English: {
      'Kaleidoscope': [
        'SHORT STORIES - INTRODUCTION',
        'I Sell My Dreams',
        'Eveline',
        'A Wedding in Brownsville',
        'Tomorrow',
        'One Centimetre',
        'POETRY - INTRODUCTION',
        'A Lecture Upon the Shadow',
        'Poems by Milton',
        'Poems by Blake',
        'Kabla Khan',
        'Trees',
        'The Wild Swans at Coole',
        'Time and Time Again',
        'Blood',
        'NON-FICTION - INTRODUCTION',
        'Freedom',
        'The Mark on the Wall',
        'Film-making',
        'Why the Novel Matters',
        'The Argumentative Indian',
        'On Science Fiction',
        'DRAMA - INTRODUCTION',
        'Chandalika',
        'Broken Images'
      ],
      'Flamingo': [
        'PROSE',
        'The Last Lesson',
        'Lost Spring',
        'Deep Water',
        'The Rattrap',
        'Indigo',
        'Poets and Pancakes',
        'The Interview',
        'Going Places',
        'POETRY',
        'My Mother at Sixty-Six',
        'Keeping Quiet',
        'A Thing of Beauty',
        'A Roadside Stand',
        "Aunt Jennifer's Tigers"
      ],
      'Vistas': [
        'The Third Level',
        'The Tiger King',
        'Journey to the End of the Earth',
        'The Enemy',
        'Should Wizard Hit Mommy?',
        'On the Face of It',
        'Memories of Childhood'
      ]
    }
  }
} as const;