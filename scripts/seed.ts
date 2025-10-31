
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Create default test admin user (required for testing)
  const testAdminEmail = "john@doe.com";
  const testAdminPassword = "johndoe123";

  const existingTestAdmin = await prisma.user.findUnique({
    where: { email: testAdminEmail },
  });

  if (!existingTestAdmin) {
    const hashedTestPassword = await bcrypt.hash(testAdminPassword, 10);
    await prisma.user.create({
      data: {
        email: testAdminEmail,
        password: hashedTestPassword,
        name: "Test Admin",
        role: "admin",
      },
    });
    console.log("✅ Test admin user created");
  } else {
    console.log("✓ Test admin user already exists");
  }

  // Create custom admin user
  const adminEmail = "support@kreativewebagency.com";
  const adminPassword = "Godislove8187.";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });
    console.log("✅ Admin user created: support@kreativewebagency.com");
  } else {
    console.log("✓ Admin user already exists");
  }

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
