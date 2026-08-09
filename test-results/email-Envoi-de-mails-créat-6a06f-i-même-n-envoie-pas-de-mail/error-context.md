# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: email.spec.ts >> Envoi de mails >> création change-request par le OWNER lui-même n'envoie pas de mail
- Location: tests\email.spec.ts:137:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 6
```

# Test source

```ts
  51  |   })
  52  | 
  53  |   // 👇 NOUVEAU : reset complet → vérifie le mail de confirmation
  54  |   test('reset-password réussi envoie un mail de confirmation', async ({ request }) => {
  55  |     const email = 'testuser@example.com'
  56  |     const newPassword = `NouveauMdp${Date.now()}!`
  57  |   
  58  |     // 1. Déclenche le forgot-password pour obtenir un vrai token
  59  |     const forgotRes = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
  60  |       data: { email },
  61  |     })
  62  |     expect(forgotRes.ok()).toBeTruthy()
  63  |   
  64  |     const resetEmail = await waitForEmail(email, 'Réinitialisation')
  65  |     const token = extractTokenFromLink(resetEmail.html, 'token')
  66  |   
  67  |    // await clearMailbox()
  68  |   
  69  |     // 2. Effectue le reset avec le vrai token et un mot de passe garanti différent
  70  |     const resetRes = await request.post(`${BASE_URL}/api/auth/reset-password`, {
  71  |       data: { token, password: newPassword },
  72  |     })
  73  |     expect(resetRes.ok()).toBeTruthy()
  74  |   
  75  |     // 3. Vérifie le mail de confirmation
  76  |     const confirmation = await waitForEmail(email, 'Mot de passe modifié')
  77  |     expect(confirmation.subject).toContain('Mot de passe modifié')
  78  |   })
  79  | 
  80  |   test('création invitation envoie un mail d\'invitation', async ({ request }) => {
  81  |     const email = `invite-${Date.now()}@example.com`
  82  | 
  83  |     const res = await request.post(`${BASE_URL}/api/invitations/create`, {
  84  |       data: { email },
  85  |       headers: {
  86  |         cookie: `token=${process.env.TEST_OWNER_TOKEN}`,
  87  |       },
  88  |     })
  89  |     expect(res.ok()).toBeTruthy()
  90  | 
  91  |     const message = await waitForEmail(email, 'Invitation')
  92  | 
  93  |     expect(message.subject).toContain('Invitation Genealogia')
  94  |     expect(message.html).toContain('/invite?token=')
  95  |   })
  96  | 
  97  |   test('inscription envoie un mail de bienvenue', async ({ request }) => {
  98  |     const email = `newuser-${Date.now()}@example.com`
  99  | 
  100 |     const res = await request.post(`${BASE_URL}/api/auth/register`, {
  101 |       data: {
  102 |         prenom: 'Jean',
  103 |         nom: 'Dupont',
  104 |         email,
  105 |         password: 'Test1234!',
  106 |       },
  107 |     })
  108 |     expect(res.ok()).toBeTruthy()
  109 | 
  110 |     const message = await waitForEmail(email, 'Bienvenue')
  111 | 
  112 |     expect(message.subject).toContain('Bienvenue sur Genealogia')
  113 |     expect(message.html).toContain('Jean')
  114 |   })
  115 | 
  116 |   // 👇 NOUVEAU : GUEST qui crée une change-request → mail au OWNER
  117 |   test('création change-request par un GUEST notifie le OWNER par mail', async ({ request }) => {
  118 |     const res = await request.post(`${BASE_URL}/api/change-requests/create`, {
  119 |       data: {
  120 |         type: 'CREATE_PERSON',
  121 |         proposedData: { prenom: 'Test', nom: 'Person' },
  122 |       },
  123 |       headers: {
  124 |         cookie: `token=${process.env.TEST_GUEST_TOKEN}`,
  125 |       },
  126 |     })
  127 |     expect(res.ok()).toBeTruthy()
  128 | 
  129 |     const ownerEmail = process.env.TEST_OWNER_EMAIL!
  130 |     const message = await waitForEmail(ownerEmail, 'modération')
  131 | 
  132 |     expect(message.subject).toContain('Nouvelle demande de modération')
  133 |     expect(message.html).toContain('Marie Curie')
  134 |   })
  135 | 
  136 |   // 👇 NOUVEAU : OWNER qui crée sa propre change-request → pas de mail
  137 |   test('création change-request par le OWNER lui-même n\'envoie pas de mail', async ({ request }) => {
  138 |     const res = await request.post(`${BASE_URL}/api/change-requests/create`, {
  139 |       data: {
  140 |         type: 'CREATE_PERSON',
  141 |         proposedData: { prenom: 'Test', nom: 'Person' },
  142 |       },
  143 |       headers: {
  144 |         cookie: `token=${process.env.TEST_OWNER_TOKEN}`,
  145 |       },
  146 |     })
  147 |     expect(res.ok()).toBeTruthy()
  148 | 
  149 |     await new Promise(r => setTimeout(r, 500))
  150 |     const messages = await getMessages()
> 151 |     expect(messages.length).toBe(0)
      |                             ^ Error: expect(received).toBe(expected) // Object.is equality
  152 |   })
  153 | 
  154 |   test('acceptation d\'invitation envoie bienvenue au guest et notification au owner', async ({ request }) => {
  155 |     const guestEmail = `guest-accept-${Date.now()}@example.com`
  156 |   
  157 |     // 1. Le OWNER de test crée une invitation
  158 |     const createRes = await request.post(`${BASE_URL}/api/invitations/create`, {
  159 |       data: { email: guestEmail },
  160 |       headers: {
  161 |         cookie: `token=${process.env.TEST_OWNER_TOKEN}`,
  162 |       },
  163 |     })
  164 |     expect(createRes.ok()).toBeTruthy()
  165 |   
  166 |     // 2. Récupère le vrai token d'invitation depuis le mail
  167 |     const invitationEmail = await waitForEmail(guestEmail, 'Invitation')
  168 |     const invitationToken = extractTokenFromLink(invitationEmail.html, 'token')
  169 |   
  170 |     //await clearMailbox() // isole les mails déclenchés par l'acceptation
  171 |   
  172 |     // 3. Accepte l'invitation → crée le compte GUEST
  173 |     const acceptRes = await request.post(`${BASE_URL}/api/invitations/accept`, {
  174 |       data: {
  175 |         token: invitationToken,
  176 |         prenom: 'Marie',
  177 |         nom: 'Curie',
  178 |         password: 'Test1234!',
  179 |       },
  180 |     })
  181 |     expect(acceptRes.ok()).toBeTruthy()
  182 |   
  183 |     // 4. Vérifie le mail de bienvenue envoyé au nouveau guest
  184 |     const welcomeMessage = await waitForEmail(guestEmail, 'Bienvenue')
  185 |     expect(welcomeMessage.subject).toContain('Bienvenue sur Genealogia')
  186 |     expect(welcomeMessage.html).toContain('Marie')
  187 |   
  188 |     // 5. Vérifie la notification envoyée au OWNER qui a invité
  189 |     const ownerEmail = process.env.TEST_OWNER_EMAIL!
  190 |     const notificationMessage = await waitForEmail(ownerEmail, 'Invitation acceptée')
  191 |     expect(notificationMessage.subject).toContain('Invitation acceptée')
  192 |     expect(notificationMessage.html).toContain('Marie Curie')
  193 |   })
  194 | })
```