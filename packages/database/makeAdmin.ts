import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Update the first user found (or all users for dev purposes) to ADMIN
  const res = await prisma.user.updateMany({
    data: {
      role: "ADMIN"
    }
  });
  console.log(`Updated ${res.count} users to ADMIN role.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
