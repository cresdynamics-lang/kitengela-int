import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const result = await (prisma as any).$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'programs'`
  console.log('PROGRAMS COLUMNS:', result)
  const resultsermons = await (prisma as any).$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'sermons'`
  console.log('SERMONS COLUMNS:', resultsermons)
}
main()
