// server/prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash("password", 12);

  const [alice, bob, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: { name: "Alice", email: "alice@example.com", password: pw, role: "user" }
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: { name: "Bob", email: "bob@example.com", password: pw, role: "user" }
    }),
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: { name: "Admin", email: "admin@example.com", password: pw, role: "admin" }
    }),
  ]);

  await prisma.task.createMany({
    data: [
      { title: "Design database schema", description: "Define tables, enums, relations",
        status: "pending", createdById: admin.id, assignedUserId: alice.id,
        dueDate: new Date(Date.now() + 2*24*60*60*1000) },
      { title: "Implement /tasks endpoint", description: "GET with optional status filter",
        status: "pending", createdById: admin.id, assignedUserId: bob.id },
      { title: "Hook up React client", description: "Fetch and render list",
        status: "completed", createdById: alice.id, assignedUserId: alice.id }
    ]
  });
}

main().then(async () => {
  console.log("Seed complete ✅ (password for all: 'password')");
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e); await prisma.$disconnect(); process.exit(1);
});
