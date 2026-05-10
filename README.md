# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

## Flux complet
```
── Invitation ───────────────────────────────────────
A entre l'email de B → crée une Invitation avec token
B reçoit un email avec un lien /invite?token=xxx
B clique → crée son compte (ou connecte) → status ACCEPTED
B est maintenant GUEST lié à A (invitedBy = A._id)

── Visibilité ───────────────────────────────────────
OWNER : voit tout, peut tout modifier directement
GUEST : voit tout l'arbre de son owner (invitedBy)
        en lecture seule

── Demande de modification/ajout ────────────────────
B voit une personne → clique "Proposer une modification"
  → crée un ChangeRequest type EDIT avec proposedData
B veut ajouter → clique "Proposer une personne"
  → crée un ChangeRequest type ADD avec proposedData

── Modération (côté A) ──────────────────────────────
A voit une liste de ChangeRequests PENDING
A compare currentData vs proposedData
A accepte → la Person est créée/modifiée directement
A refuse  → status REJECTED + note optionnelle
```