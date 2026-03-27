import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:4321'

const visited = new Set<string>()
const broken: { page: string; href: string; status: number }[] = []

async function crawl(page: any, url: string) {
  if (visited.has(url)) return
  visited.add(url)

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle' })
    if (!response || !response.ok()) {
      broken.push({ page: 'entry', href: url, status: response?.status() ?? 0 })
      return
    }
  } catch {
    broken.push({ page: 'entry', href: url, status: 0 })
    return
  }

  const links = await page.$$eval('a[href]', (els: HTMLAnchorElement[]) =>
    els.map(el => el.href).filter(Boolean)
  )

  for (const href of links) {
    // Ignorer les liens externes, mailto, tel, ancres pures
    if (!href.startsWith(BASE_URL)) continue
    const clean = href.split('#')[0]
    if (!clean || visited.has(clean)) continue

    try {
      const response = await page.request.get(clean)
      if (!response.ok()) {
        broken.push({ page: url, href: clean, status: response.status() })
      } else {
        await crawl(page, clean)
      }
    } catch {
      broken.push({ page: url, href: clean, status: 0 })
    }
  }
}

test('aucun lien interne cassé', async ({ page }) => {
  await crawl(page, BASE_URL)

  if (broken.length > 0) {
    console.log('\n❌ Liens cassés détectés :')
    console.table(broken)
  } else {
    console.log(`\n✅ ${visited.size} page(s) crawlée(s), aucun lien cassé.`)
  }

  expect(
    broken,
    `${broken.length} lien(s) cassé(s) trouvé(s):\n${broken.map(b => `  [${b.status}] ${b.href} (trouvé sur ${b.page})`).join('\n')}`
  ).toHaveLength(0)
})