// tests/global-teardown.ts
import { db } from '../src/lib/mongo'

export default async function globalTeardown() {
  const usersCol = db.collection('users')

  // Tous les users de test, y compris owner-test/guest-test et les emails dynamiques
  const testUsers = await usersCol
    .find({ email: { $regex: /@example\.com$/i } })
    .toArray()

  const testUserIds = testUsers.map(u => u._id)

  if (testUserIds.length > 0) {
    await db.collection('changeRequests').deleteMany({
      $or: [
        { requestedByUserId: { $in: testUserIds } },
        { ownerId: { $in: testUserIds } },
      ],
    })

    await db.collection('notifications').deleteMany({
      userId: { $in: testUserIds },
    })

    await db.collection('invitations').deleteMany({
      $or: [
        { email: { $regex: /@example\.com$/i } },
        { invitedBy: { $in: testUserIds } },
      ],
    })

    await db.collection('user_persons').deleteMany({
      userId: { $in: testUserIds },
    })

    await usersCol.deleteMany({ _id: { $in: testUserIds } })
  }

  console.log(`🧹 Nettoyage e2e : ${testUserIds.length} user(s) de test supprimé(s)`)
}