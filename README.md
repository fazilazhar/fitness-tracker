# Lift Log

A dependency-free mobile workout notebook. The hosted static app stores sessions and drafts in IndexedDB on each device, with no workout API, analytics, or external assets. The default plan is the four-day, 48-working-set upper/lower split, with two sets each of curls and pushdowns on both upper days.

Run `npm run dev` and open http://localhost:4173. Run `npm test` for data and program checks.

## iPhone

Open the deployed HTTPS URL in Safari, then Share → Add to Home Screen. Open the installed app online once to cache its files. Settings reports whether the offline files have downloaded. Offline use depends on the browser retaining that cache; real-device iOS verification is still needed.

Settings → Export backup opens the share sheet on supported devices, or downloads a JSON file. Choose Save to Files. Import merges new session IDs while keeping existing sessions and the current draft. To move changes to an existing session between devices, use an export as a manual reference; merge does not overwrite existing IDs.

Browser storage is not a normal user-visible Files document and can be cleared. Export regular backups. A Home Screen app and a Safari tab may have different storage. The app requests persistent storage only when you press the corresponding Settings button.

## Existing notes

`.private/workout-history.json` contains the user's seven November sessions, inferred as 2026 from the conversation date. It is excluded from Git and the deployment. Import it on the phone through Settings. Missing reps, ambiguous carry entries, warmups, and conflicting headings are preserved in notes rather than invented as completed sets.

## Deployment

`.openai/hosting.json` identifies the private Sites deployment; `dist/` is the complete static output. No build or package installation is needed. Change the service-worker cache version when updating app assets; a new service worker activates once existing app windows are closed.
