const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function seedPython() {
  const subject = await db.subject.upsert({
    where: { slug: "python-foundations" },
    update: {
      title: "Python Foundations",
      description:
        "A curated YouTube-powered path to learn Python fundamentals, from syntax basics to control flow and functions.",
      difficulty: "MEDIUM",
      isPublished: true,
      priceCents: 750,
      thumbnailKey: "python"
    },
    create: {
      title: "Python Foundations",
      slug: "python-foundations",
      description:
        "A curated YouTube-powered path to learn Python fundamentals, from syntax basics to control flow and functions.",
      difficulty: "MEDIUM",
      isPublished: true,
      priceCents: 750,
      thumbnailKey: "python"
    }
  });

  const introSection = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Getting started",
      orderIndex: 1
    }
  });

  const basicsSection = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Core Python concepts",
      orderIndex: 2
    }
  });

  // YouTube video IDs are public learn-Python videos
  await db.video.createMany({
    data: [
      {
        sectionId: introSection.id,
        title: "Introduction to Python",
        description:
          "Why Python is popular, what you can build with it, and how this course is organized.",
        youtubeVideoId: "rfscVS0vtbw", // freeCodeCamp - Python full course
        orderIndex: 1,
        durationSeconds: 900 // ~15 min segment
      },
      {
        sectionId: introSection.id,
        title: "Setting up your environment",
        description:
          "Install Python on your machine and get a code editor ready so you can follow along.",
        youtubeVideoId: "YYXdXT2l-Gg", // Setup / basics
        orderIndex: 2,
        durationSeconds: 780 // ~13 min
      },
      {
        sectionId: basicsSection.id,
        title: "Variables and data types",
        description:
          "Learn about numbers, strings, booleans, and how to work with variables in Python.",
        youtubeVideoId: "kqtD5dpn9C8", // Python for beginners
        orderIndex: 1,
        durationSeconds: 1020 // ~17 min
      },
      {
        sectionId: basicsSection.id,
        title: "Control flow: if, for, while",
        description:
          "Write real logic using if statements, for loops, and while loops to control your programs.",
        youtubeVideoId: "f79MRyMsjrQ",
        orderIndex: 2,
        durationSeconds: 1260 // ~21 min
      }
    ]
  });

  console.log("Seeded Python Foundations subject with sections and videos.");
  return subject;
}

async function seedJavascript() {
  const subject = await db.subject.upsert({
    where: { slug: "javascript-essentials" },
    update: {
      title: "JavaScript Essentials",
      description:
        "Go from zero to productive in modern JavaScript with hands-on examples powered by YouTube content.",
      difficulty: "EASY",
      isPublished: true,
      priceCents: 500,
      thumbnailKey: "javascript"
    },
    create: {
      title: "JavaScript Essentials",
      slug: "javascript-essentials",
      description:
        "Go from zero to productive in modern JavaScript with hands-on examples powered by YouTube content.",
      difficulty: "EASY",
      isPublished: true,
      priceCents: 500,
      thumbnailKey: "javascript"
    }
  });

  const intro = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Getting started with JavaScript",
      orderIndex: 1
    }
  });

  const core = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Core language features",
      orderIndex: 2
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: intro.id,
        title: "JavaScript in 100 seconds",
        description:
          "High-level overview of what JavaScript is and how it fits into the web.",
        youtubeVideoId: "DHjqpvDnNGE",
        orderIndex: 1,
        durationSeconds: 120
      },
      {
        sectionId: intro.id,
        title: "JavaScript basics crash course",
        description:
          "Variables, types, and basic operators explained from scratch.",
        youtubeVideoId: "W6NZfCO5SIk",
        orderIndex: 2,
        durationSeconds: 1100
      },
      {
        sectionId: core.id,
        title: "Functions and scope",
        description:
          "Learn how functions work, how scope behaves, and how to structure code.",
        youtubeVideoId: "PkZNo7MFNFg",
        orderIndex: 1,
        durationSeconds: 1500
      },
      {
        sectionId: core.id,
        title: "Arrays and objects",
        description:
          "Work with arrays and objects to represent more complex data structures.",
        youtubeVideoId: "R8rmfD9Y5-c",
        orderIndex: 2,
        durationSeconds: 1300
      }
    ]
  });

  console.log("Seeded JavaScript Essentials subject with sections and videos.");
  return subject;
}

async function seedWebDev() {
  const subject = await db.subject.upsert({
    where: { slug: "fullstack-web-overview" },
    update: {
      title: "Full-Stack Web Overview",
      description:
        "A high-level guided tour of modern full-stack web development using free YouTube content.",
      difficulty: "MEDIUM",
      isPublished: true,
      priceCents: 750,
      thumbnailKey: "web"
    },
    create: {
      title: "Full-Stack Web Overview",
      slug: "fullstack-web-overview",
      description:
        "A high-level guided tour of modern full-stack web development using free YouTube content.",
      difficulty: "MEDIUM",
      isPublished: true,
      priceCents: 750,
      thumbnailKey: "web"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "From frontend to backend",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "How the web works",
        description:
          "Understand requests, responses, servers, and browsers with animations.",
        youtubeVideoId: "VfGW0Qiy2I0",
        orderIndex: 1,
        durationSeconds: 900
      },
      {
        sectionId: section.id,
        title: "Frontend vs backend",
        description:
          "See how UI, APIs, and databases fit together in a typical web app.",
        youtubeVideoId: "l9AzO1FMgM8",
        orderIndex: 2,
        durationSeconds: 900
      },
      {
        sectionId: section.id,
        title: "Deploying a full-stack app",
        description:
          "A conceptual look at how code moves from your machine to production.",
        youtubeVideoId: "VfiGmg1lT0I",
        orderIndex: 3,
        durationSeconds: 780
      }
    ]
  });

  console.log("Seeded Full-Stack Web Overview subject with sections and videos.");
  return subject;
}

async function seedC() {
  const subject = await db.subject.upsert({
    where: { slug: "c-programming" },
    update: {
      title: "C Programming Fundamentals",
      description:
        "Learn the C language from the ground up: syntax, pointers, memory, and more using curated YouTube content.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "c"
    },
    create: {
      title: "C Programming Fundamentals",
      slug: "c-programming",
      description:
        "Learn the C language from the ground up: syntax, pointers, memory, and more using curated YouTube content.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "c"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Getting started with C",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "C language introduction",
        description: "What is C and why it matters.",
        youtubeVideoId: "KJgsSFOSQv0",
        orderIndex: 1,
        durationSeconds: 900
      },
      {
        sectionId: section.id,
        title: "Your first C program",
        description: "Write and compile your first C program.",
        youtubeVideoId: "ZSPZob_1TOk",
        orderIndex: 2,
        durationSeconds: 800
      }
    ]
  });

  console.log("Seeded C Programming subject.");
  return subject;
}

async function seedCpp() {
  const existing = await db.subject.findFirst({
    where: { slug: "cpp-programming" }
  });
  if (existing) return existing;

  const subject = await db.subject.create({
    data: {
      title: "C++ Programming",
      slug: "cpp-programming",
      description:
        "Object-oriented programming, STL, and modern C++ concepts powered by long-form YouTube tutorials.",
      isPublished: true,
      priceCents: 2299,
      thumbnailKey: "cpp"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "C++ basics",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "C++ full course",
        description: "Learn modern C++ programming in one course.",
        youtubeVideoId: "8jLOx1hD3_o",
        orderIndex: 1,
        durationSeconds: 1800
      },
      {
        sectionId: section.id,
        title: "C++ STL overview",
        description: "Introduction to the Standard Template Library.",
        youtubeVideoId: "0G2X8gE68gA",
        orderIndex: 2,
        durationSeconds: 1000
      }
    ]
  });

  console.log("Seeded C++ Programming subject.");
  return subject;
}

async function seedJava() {
  const subject = await db.subject.upsert({
    where: { slug: "java-programming" },
    update: {
      title: "Java Programming",
      description:
        "Java syntax, OOP, collections, and more using curated YouTube lectures.",
      difficulty: "MEDIUM",
      isPublished: true,
      priceCents: 750,
      thumbnailKey: "java"
    },
    create: {
      title: "Java Programming",
      slug: "java-programming",
      description:
        "Java syntax, OOP, collections, and more using curated YouTube lectures.",
      difficulty: "MEDIUM",
      isPublished: true,
      priceCents: 750,
      thumbnailKey: "java"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Java basics",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "Java tutorial for beginners",
        description: "Start coding in Java from scratch.",
        youtubeVideoId: "grEKMHGYyns",
        orderIndex: 1,
        durationSeconds: 1800
      },
      {
        sectionId: section.id,
        title: "Java OOP concepts",
        description: "Classes, objects, inheritance, and polymorphism.",
        youtubeVideoId: "m9oO1lvFOqI",
        orderIndex: 2,
        durationSeconds: 1200
      }
    ]
  });

  console.log("Seeded Java Programming subject.");
  return subject;
}

async function seedDSA() {
  const subject = await db.subject.upsert({
    where: { slug: "data-structures-algorithms" },
    update: {
      title: "Data Structures & Algorithms",
      description:
        "Master essential data structures and algorithms with visual YouTube explanations.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "dsa"
    },
    create: {
      title: "Data Structures & Algorithms",
      slug: "data-structures-algorithms",
      description:
        "Master essential data structures and algorithms with visual YouTube explanations.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "dsa"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Core concepts",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "Big-O notation",
        description: "Time and space complexity explained.",
        youtubeVideoId: "__vX2sjlpXU",
        orderIndex: 1,
        durationSeconds: 900
      },
      {
        sectionId: section.id,
        title: "Arrays and linked lists",
        description: "Foundational linear data structures.",
        youtubeVideoId: "c1Kj8S_gkz4",
        orderIndex: 2,
        durationSeconds: 1200
      }
    ]
  });

  console.log("Seeded DSA subject.");
  return subject;
}

async function seedDAA() {
  const subject = await db.subject.upsert({
    where: { slug: "design-analysis-algorithms" },
    update: {
      title: "Design & Analysis of Algorithms",
      description:
        "Algorithm design paradigms and complexity analysis, backed by academic-style YouTube lectures.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "daa"
    },
    create: {
      title: "Design & Analysis of Algorithms",
      slug: "design-analysis-algorithms",
      description:
        "Algorithm design paradigms and complexity analysis, backed by academic-style YouTube lectures.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "daa"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Algorithm paradigms",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "Divide and conquer",
        description: "Concepts and classic examples like merge sort.",
        youtubeVideoId: "2Rr2tW9zvRg",
        orderIndex: 1,
        durationSeconds: 1000
      },
      {
        sectionId: section.id,
        title: "Dynamic programming introduction",
        description: "Overlapping subproblems and optimal substructure.",
        youtubeVideoId: "tyB0ztf0DNY",
        orderIndex: 2,
        durationSeconds: 1200
      }
    ]
  });

  console.log("Seeded DAA subject.");
  return subject;
}

async function seedML() {
  const subject = await db.subject.upsert({
    where: { slug: "machine-learning" },
    update: {
      title: "Machine Learning Basics",
      slug: "machine-learning",
      description:
        "Fundamentals of machine learning, from linear regression to classification, using popular YouTube series.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "ml"
    },
    create: {
      title: "Machine Learning Basics",
      slug: "machine-learning",
      description:
        "Fundamentals of machine learning, from linear regression to classification, using popular YouTube series.",
      difficulty: "HARD",
      isPublished: true,
      priceCents: 1000,
      thumbnailKey: "ml"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "ML foundations",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "What is machine learning?",
        description: "High-level introduction to ML.",
        youtubeVideoId: "Gv9_4yMHFhI",
        orderIndex: 1,
        durationSeconds: 900
      },
      {
        sectionId: section.id,
        title: "Linear regression",
        description: "Intro to supervised learning with regression.",
        youtubeVideoId: "v64KOxKVLVg",
        orderIndex: 2,
        durationSeconds: 1100
      }
    ]
  });

  console.log("Seeded ML subject.");
  return subject;
}

async function seedDL() {
  const existing = await db.subject.findFirst({
    where: { slug: "deep-learning" }
  });
  if (existing) return existing;

  const subject = await db.subject.create({
    data: {
      title: "Deep Learning Essentials",
      slug: "deep-learning",
      description:
        "Neural networks, backpropagation, and deep architectures using visual YouTube explanations.",
      isPublished: true,
      priceCents: 3299,
      thumbnailKey: "dl"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Neural networks",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "Neural networks overview",
        description: "What neural networks are and how they learn.",
        youtubeVideoId: "aircAruvnKk",
        orderIndex: 1,
        durationSeconds: 1200
      },
      {
        sectionId: section.id,
        title: "Backpropagation",
        description: "The algorithm behind training neural networks.",
        youtubeVideoId: "Ilg3gGewQ5U",
        orderIndex: 2,
        durationSeconds: 1300
      }
    ]
  });

  console.log("Seeded DL subject.");
  return subject;
}

async function seedRL() {
  const existing = await db.subject.findFirst({
    where: { slug: "reinforcement-learning" }
  });
  if (existing) return existing;

  const subject = await db.subject.create({
    data: {
      title: "Reinforcement Learning",
      slug: "reinforcement-learning",
      description:
        "Agents, environments, rewards, and classic RL algorithms via curated YouTube playlists.",
      isPublished: true,
      priceCents: 2799,
      thumbnailKey: "rl"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "RL foundations",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "What is reinforcement learning?",
        description: "Core intuition behind RL.",
        youtubeVideoId: "JgvyzIkgxF0",
        orderIndex: 1,
        durationSeconds: 900
      },
      {
        sectionId: section.id,
        title: "Q-learning basics",
        description: "A simple but powerful RL algorithm.",
        youtubeVideoId: "q2ZOEFAaaI0",
        orderIndex: 2,
        durationSeconds: 1100
      }
    ]
  });

  console.log("Seeded RL subject.");
  return subject;
}

async function seedDataScience() {
  const existing = await db.subject.findFirst({
    where: { slug: "data-science" }
  });
  if (existing) return existing;

  const subject = await db.subject.create({
    data: {
      title: "Data Science Track",
      slug: "data-science",
      description:
        "From data wrangling and visualization to simple models, using Python data science content on YouTube.",
      isPublished: true,
      priceCents: 3199,
      thumbnailKey: "datascience"
    }
  });

  const section = await db.section.create({
    data: {
      subjectId: subject.id,
      title: "Data science foundations",
      orderIndex: 1
    }
  });

  await db.video.createMany({
    data: [
      {
        sectionId: section.id,
        title: "What is data science?",
        description: "Overview of the data science workflow.",
        youtubeVideoId: "ua-CiDNNj30",
        orderIndex: 1,
        durationSeconds: 900
      },
      {
        sectionId: section.id,
        title: "Pandas crash course",
        description: "Working with tabular data in Python.",
        youtubeVideoId: "vmEHCJofslg",
        orderIndex: 2,
        durationSeconds: 1500
      }
    ]
  });

  console.log("Seeded Data Science subject.");
  return subject;
}

async function main() {
  // Seed a test user
  await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // hash for 'test'
      name: "Test User"
    }
  });

  await seedPython();
  await seedJavascript();
  await seedWebDev();
  await seedC();
  await seedJava();
  await seedDSA();
  await seedDAA();
  await seedML();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

