import { PrismaClient } from "./coreDb/prismaClient/index.js"

const prisma = new PrismaClient()
async function main() {
  const adminRole = await prisma.rolePermissions.upsert({
    where: { name: 'admin role' },
    update: {},
    create: {
      name: 'admin role',
      userAccounts: 15,
      rolePermissions: 1,
      customers: 1,
    },
  })
  const visitorRole = await prisma.rolePermissions.upsert({
    where: { name: 'visitor role' },
    update: {},
    create: {
      name: 'visitor role',
      userAccounts: 1,
      rolePermissions: 12,
      customers: 1,
    },
  })

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'demo@fake.fk',
      name: 'adminDemo',
      password: '',
      createdBy: 1,
      updatedBy: 1,
      roleId: adminRole.id,
    },
  })

  const bob = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: 'visitor@fake.fk',
      name: 'visitorDemo',
      password: '',
      createdBy: 1,
      updatedBy: 1,
      roleId: visitorRole.id,
    },
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })