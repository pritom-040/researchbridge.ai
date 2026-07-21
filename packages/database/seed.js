const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  
  // Clear existing data (optional, but good for idempotency)
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.university.deleteMany();

  // Create Universities
  const u = await Promise.all([
    prisma.university.create({ data: { name: "Stanford University", country: "USA", globalRank: 3, acceptanceRate: 0.04 } }),
    prisma.university.create({ data: { name: "Massachusetts Institute of Technology (MIT)", country: "USA", globalRank: 1, acceptanceRate: 0.04 } }),
    prisma.university.create({ data: { name: "University of Oxford", country: "UK", globalRank: 4, acceptanceRate: 0.17 } }),
    prisma.university.create({ data: { name: "University of Cambridge", country: "UK", globalRank: 2, acceptanceRate: 0.21 } }),
    prisma.university.create({ data: { name: "ETH Zurich", country: "Switzerland", globalRank: 9, acceptanceRate: 0.27 } }),
    prisma.university.create({ data: { name: "National University of Singapore (NUS)", country: "Singapore", globalRank: 11, acceptanceRate: 0.05 } }),
    prisma.university.create({ data: { name: "University of Toronto", country: "Canada", globalRank: 34, acceptanceRate: 0.43 } }),
    prisma.university.create({ data: { name: "University of Tokyo", country: "Japan", globalRank: 23, acceptanceRate: 0.1 } })
  ]);
  const [stanford, mit, oxford, cambridge, eth, nus, toronto, tokyo] = u;

  // Common majors mapping for easy reference
  const csMajors = ["Computer Science (Machine Learning / AI)", "Computer Science (Systems & Security)"];
  const bioMajors = ["Biology & Bioinformatics"];
  const physicsMajors = ["Physics & Mathematics"];
  const eeMajors = ["Electrical Engineering"];
  const stemMajors = [...csMajors, ...bioMajors, ...physicsMajors, ...eeMajors];

  const scholarshipsData = [
    // --- STANFORD ---
    {
      universityId: stanford.id,
      name: "Knight-Hennessy Scholars",
      description: "Fully-funded graduate scholarship across all disciplines at Stanford. Develops a community of future global leaders.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "Master's, PhD",
      deadline: new Date("2026-10-10"),
      eligibilityCriteria: { minCgpa: 3.7, minIelts: 7.5, majors: stemMajors }
    },
    {
      universityId: stanford.id,
      name: "Stanford AI Innovation Fellowship",
      description: "Supports exceptional students pursuing cutting-edge research in Artificial Intelligence.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PhD",
      deadline: new Date("2026-11-15"),
      eligibilityCriteria: { minCgpa: 3.8, minIelts: 7.0, majors: ["Computer Science (Machine Learning / AI)"] }
    },
    // --- MIT ---
    {
      universityId: mit.id,
      name: "MIT Presidential Fellowship",
      description: "Awarded to the most outstanding students worldwide to pursue research at MIT.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PhD",
      deadline: new Date("2026-12-01"),
      eligibilityCriteria: { minCgpa: 3.9, minIelts: 7.5, majors: stemMajors }
    },
    {
      universityId: mit.id,
      name: "EECS Research Excellence Award",
      description: "Partial funding for top electrical engineering and computer science master's students.",
      fundingType: "PARTIAL",
      degreeLevel: "Master's",
      deadline: new Date("2027-01-15"),
      eligibilityCriteria: { minCgpa: 3.5, majors: [...csMajors, ...eeMajors] }
    },
    // --- OXFORD ---
    {
      universityId: oxford.id,
      name: "Rhodes Scholarship",
      description: "The oldest (first awarded in 1902) international scholarship programme in the world.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "Master's, PhD",
      deadline: new Date("2026-08-01"),
      eligibilityCriteria: { minCgpa: 3.7, minIelts: 8.0, majors: stemMajors }
    },
    {
      universityId: oxford.id,
      name: "Clarendon Fund",
      description: "Highly competitive, fully-funded graduate scholarships at the University of Oxford.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "Master's, PhD",
      deadline: new Date("2027-01-20"),
      eligibilityCriteria: { minCgpa: 3.8, minIelts: 7.5, majors: stemMajors }
    },
    // --- CAMBRIDGE ---
    {
      universityId: cambridge.id,
      name: "Gates Cambridge Scholarship",
      description: "Outstanding applicants from outside the UK to pursue a full-time postgraduate degree in any subject.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "Master's, PhD",
      deadline: new Date("2026-10-15"),
      eligibilityCriteria: { minCgpa: 3.8, majors: stemMajors }
    },
    {
      universityId: cambridge.id,
      name: "Cambridge Bioinformatics Trust",
      description: "Dedicated scholarship for computational biology and bioinformatics research.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PhD",
      deadline: new Date("2026-12-05"),
      eligibilityCriteria: { minCgpa: 3.6, majors: bioMajors }
    },
    // --- ETH ZURICH ---
    {
      universityId: eth.id,
      name: "ETH Excellence Scholarship & Opportunity Programme",
      description: "Mentorship, networking, and financial support for outstanding master's students.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "Master's",
      deadline: new Date("2026-12-15"),
      eligibilityCriteria: { minCgpa: 3.6, majors: stemMajors }
    },
    {
      universityId: eth.id,
      name: "Quantum Physics Research Grant",
      description: "Specialized funding for theoretical and experimental quantum physics.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PhD",
      deadline: new Date("2027-02-01"),
      eligibilityCriteria: { minCgpa: 3.5, majors: physicsMajors }
    },
    // --- NUS ---
    {
      universityId: nus.id,
      name: "SINGA (Singapore International Graduate Award)",
      description: "For international students with excellent academic undergraduate and/or master's results.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PhD",
      deadline: new Date("2026-12-01"),
      eligibilityCriteria: { minCgpa: 3.5, minIelts: 6.5, majors: stemMajors }
    },
    {
      universityId: nus.id,
      name: "NUS Computing Merit Scholarship",
      description: "For outstanding computing students pursuing advanced systems and security research.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PhD",
      deadline: new Date("2027-01-10"),
      eligibilityCriteria: { minCgpa: 3.6, majors: ["Computer Science (Systems & Security)"] }
    },
    // --- TORONTO ---
    {
      universityId: toronto.id,
      name: "Vanier Canada Graduate Scholarships",
      description: "To attract and retain world-class doctoral students and establish Canada as a global centre of excellence.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PhD",
      deadline: new Date("2026-11-01"),
      eligibilityCriteria: { minCgpa: 3.8, majors: stemMajors }
    },
    {
      universityId: toronto.id,
      name: "Vector Institute AI Scholarship",
      description: "Recognizes top tier students entering AI-related master's programs in Ontario.",
      fundingType: "PARTIAL",
      degreeLevel: "Master's",
      deadline: new Date("2027-03-21"),
      eligibilityCriteria: { minCgpa: 3.3, majors: ["Computer Science (Machine Learning / AI)"] }
    },
    // --- TOKYO ---
    {
      universityId: tokyo.id,
      name: "MEXT Scholarship (University Recommendation)",
      description: "Full scholarship funded by the Japanese Ministry of Education, Culture, Sports, Science, and Technology.",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "Master's, PhD",
      deadline: new Date("2027-01-30"),
      eligibilityCriteria: { minCgpa: 3.2, minIelts: 6.0, majors: stemMajors }
    }
  ];

  await prisma.scholarship.createMany({ data: scholarshipsData });

  console.log("Database seeded successfully with 15 global scholarships!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
