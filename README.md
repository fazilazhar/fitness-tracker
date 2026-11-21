# Workout Log

A dependency-free mobile workout notebook. The hosted static app stores sessions and drafts in IndexedDB on each device, with no workout API, analytics, or external assets. The default plan is the four-day, 70-working-set upper/lower split, with two sets each of curls and pushdowns on both upper days.

Run `npm run dev` and open http://localhost:4173. Run `npm test` for data and program checks.

## iPhone

Open the deployed HTTPS URL in Safari, then Share → Add to Home Screen. Open the installed app online once to cache its files. Settings reports whether the offline files have downloaded. Offline use depends on the browser retaining that cache; real-device iOS verification is still needed.

Settings → Export backup opens the share sheet on supported devices, or downloads a JSON file. Choose Save to Files. Import merges new session IDs while keeping existing sessions and the current draft. To move changes to an existing session between devices, use an export as a manual reference; merge does not overwrite existing IDs.

Browser storage is not a normal user-visible Files document and can be cleared. Export regular backups. A Home Screen app and a Safari tab may have different storage. The app requests persistent storage only when you press the corresponding Settings button.

## Existing notes

`.private/workout-history.json` contains the user's seven November sessions, inferred as 2026 from the conversation date. It is excluded from Git and the deployment. Import it on the phone through Settings. Missing reps, ambiguous carry entries, warmups, and conflicting headings are preserved in notes rather than invented as completed sets.

## GitHub Pages deployment

The primary host is https://fazilazhar.github.io/fitness-tracker/ with no sign-in requirement. The app uses relative asset paths and a scoped service worker, so it also works from a GitHub Pages project subdirectory.

Push source changes to the `github` remote's `main` branch. Publish the static output using `git subtree push --prefix dist github gh-pages`. GitHub Pages serves the root of `gh-pages`. `.nojekyll` disables Jekyll processing. Keep `.private/` excluded from Git and the published output.

The previous Sites deployment is identified by `.openai/hosting.json`; its `origin` remote is preserved separately. Changing hosts does not transfer browser storage: export from the previous host, then import on the GitHub Pages host.

No build or package installation is needed. Change the service-worker cache version when updating app assets; the app checks for updates on return to the foreground, reconnect, and every five minutes while visible. Settings → Update app checks immediately. New app assets activate only after a complete download. Reload waits for pending notebook writes; failed writes prevent reload.

The plain horizontal barbell icon in `dist/barbell.svg` is dedicated to the public domain under CC0-1.0.
