// tests/email.spec.ts
import { test, expect } from '@playwright/test'
import { clearMailbox, waitForEmail, getMessages, extractTokenFromLink } from './helpers/mailhog'

const BASE_URL = 'http://localhost:4321'

test.beforeAll(async ({ request }) => {
  await request.post(`${BASE_URL}/api/auth/register`, {
    data: {
      prenom: 'Test',
      nom: 'User',
      email: 'testuser@example.com',
      password: 'Test1234!',
    },
  })
})

test.describe('Envoi de mails', () => {
  test.beforeEach(async () => {
  //  await clearMailbox()
  })

  test('forgot-password envoie un mail de reset', async ({ request }) => {
    const email = 'testuser@example.com'

    const res = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: { email },
    })
    expect(res.ok()).toBeTruthy()

    const message = await waitForEmail(email, 'Réinitialisation')

    expect(message.subject).toContain('Réinitialisation du mot de passe')
    expect(message.html).toContain('reset-password?token=')
  })

  test('forgot-password sur email inconnu n\'envoie pas de mail', async ({ request }) => {
    const email = 'inconnu-' + Date.now() + '@example.com'

    const res = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: { email },
    })
    expect(res.ok()).toBeTruthy()

    await new Promise(r => setTimeout(r, 500))
    const messages = await getMessages()
    const found = messages.find(m =>
      m.To.some(t => `${t.Mailbox}@${t.Domain}`.toLowerCase() === email.toLowerCase())
    )
    expect(found).toBeUndefined()
  })

  // 👇 NOUVEAU : reset complet → vérifie le mail de confirmation
  test('reset-password réussi envoie un mail de confirmation', async ({ request }) => {
    const email = 'testuser@example.com'
    const newPassword = `NouveauMdp${Date.now()}!`
  
    // 1. Déclenche le forgot-password pour obtenir un vrai token
    const forgotRes = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: { email },
    })
    expect(forgotRes.ok()).toBeTruthy()
  
    const resetEmail = await waitForEmail(email, 'Réinitialisation')
    const token = extractTokenFromLink(resetEmail.html, 'token')
  
   // await clearMailbox()
  
    // 2. Effectue le reset avec le vrai token et un mot de passe garanti différent
    const resetRes = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: { token, password: newPassword },
    })
    expect(resetRes.ok()).toBeTruthy()
  
    // 3. Vérifie le mail de confirmation
    const confirmation = await waitForEmail(email, 'Mot de passe modifié')
    expect(confirmation.subject).toContain('Mot de passe modifié')
  })

  test('création invitation envoie un mail d\'invitation', async ({ request }) => {
    const email = `invite-${Date.now()}@example.com`

    const res = await request.post(`${BASE_URL}/api/invitations/create`, {
      data: { email },
      headers: {
        cookie: `token=${process.env.TEST_OWNER_TOKEN}`,
      },
    })
    expect(res.ok()).toBeTruthy()

    const message = await waitForEmail(email, 'Invitation')

    expect(message.subject).toContain('Invitation Genealogia')
    expect(message.html).toContain('/invite?token=')
  })

  test('inscription envoie un mail de bienvenue', async ({ request }) => {
    const email = `newuser-${Date.now()}@example.com`

    const res = await request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        prenom: 'Jean',
        nom: 'Dupont',
        email,
        password: 'Test1234!',
      },
    })
    expect(res.ok()).toBeTruthy()

    const message = await waitForEmail(email, 'Bienvenue')

    expect(message.subject).toContain('Bienvenue sur Genealogia')
    expect(message.html).toContain('Jean')
  })

  // 👇 NOUVEAU : GUEST qui crée une change-request → mail au OWNER
  test('création change-request par un GUEST notifie le OWNER par mail', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/change-requests/create`, {
      data: {
        type: 'CREATE_PERSON',
        proposedData: { prenom: 'Test', nom: 'Person' },
      },
      headers: {
        cookie: `token=${process.env.TEST_GUEST_TOKEN}`,
      },
    })
    expect(res.ok()).toBeTruthy()

    const ownerEmail = process.env.TEST_OWNER_EMAIL!
    const message = await waitForEmail(ownerEmail, 'modération')

    expect(message.subject).toContain('Nouvelle demande de modération')
    expect(message.html).toContain('Marie Curie')
  })

  // 👇 NOUVEAU : OWNER qui crée sa propre change-request → pas de mail
  test('création change-request par le OWNER lui-même n\'envoie pas de mail', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/change-requests/create`, {
      data: {
        type: 'CREATE_PERSON',
        proposedData: { prenom: 'Test', nom: 'Person' },
      },
      headers: {
        cookie: `token=${process.env.TEST_OWNER_TOKEN}`,
      },
    })
    expect(res.ok()).toBeTruthy()

    await new Promise(r => setTimeout(r, 500))
    const messages = await getMessages()
    expect(messages.length).toBe(0)
  })

  test('acceptation d\'invitation envoie bienvenue au guest et notification au owner', async ({ request }) => {
    const guestEmail = `guest-accept-${Date.now()}@example.com`
  
    // 1. Le OWNER de test crée une invitation
    const createRes = await request.post(`${BASE_URL}/api/invitations/create`, {
      data: { email: guestEmail },
      headers: {
        cookie: `token=${process.env.TEST_OWNER_TOKEN}`,
      },
    })
    expect(createRes.ok()).toBeTruthy()
  
    // 2. Récupère le vrai token d'invitation depuis le mail
    const invitationEmail = await waitForEmail(guestEmail, 'Invitation')
    const invitationToken = extractTokenFromLink(invitationEmail.html, 'token')
  
    //await clearMailbox() // isole les mails déclenchés par l'acceptation
  
    // 3. Accepte l'invitation → crée le compte GUEST
    const acceptRes = await request.post(`${BASE_URL}/api/invitations/accept`, {
      data: {
        token: invitationToken,
        prenom: 'Marie',
        nom: 'Curie',
        password: 'Test1234!',
      },
    })
    expect(acceptRes.ok()).toBeTruthy()
  
    // 4. Vérifie le mail de bienvenue envoyé au nouveau guest
    const welcomeMessage = await waitForEmail(guestEmail, 'Bienvenue')
    expect(welcomeMessage.subject).toContain('Bienvenue sur Genealogia')
    expect(welcomeMessage.html).toContain('Marie')
  
    // 5. Vérifie la notification envoyée au OWNER qui a invité
    const ownerEmail = process.env.TEST_OWNER_EMAIL!
    const notificationMessage = await waitForEmail(ownerEmail, 'Invitation acceptée')
    expect(notificationMessage.subject).toContain('Invitation acceptée')
    expect(notificationMessage.html).toContain('Marie Curie')
  })
})