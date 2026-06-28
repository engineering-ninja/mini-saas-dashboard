import "dotenv/config";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PROJECT_STATUSES, DEMO_USER } from "../src/lib/constants";
import { pgPoolConfig } from "../src/lib/pg-ssl";

const prisma = new PrismaClient({
  adapter: new PrismaPg(pgPoolConfig(process.env.DATABASE_URL ?? "")),
});

const PROJECT_COUNT = 24;

faker.seed(20260626);

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: { name: DEMO_USER.name, passwordHash },
    create: { email: DEMO_USER.email, name: DEMO_USER.name, passwordHash },
  });

  // Replace existing projects so reseeding stays idempotent.
  await prisma.project.deleteMany({ where: { ownerId: user.id } });

  const projects = Array.from({ length: PROJECT_COUNT }, () => ({
    name: faker.company.catchPhrase(),
    status: faker.helpers.arrayElement(PROJECT_STATUSES),
    deadline: faker.date.between({
      from: faker.date.recent({ days: 90 }),
      to: faker.date.future({ years: 1 }),
    }),
    assignee: faker.person.fullName(),
    budget: faker.number.float({ min: 2_000, max: 250_000, fractionDigits: 2 }),
    ownerId: user.id,
  }));

  await prisma.project.createMany({ data: projects });

  console.log(
    `Seeded ${PROJECT_COUNT} projects for ${DEMO_USER.email} (password: ${DEMO_USER.password}).`,
  );
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
