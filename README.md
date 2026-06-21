# 🤖 Bot Discord di Moderazione

Bot di moderazione con comandi slash e anti-spam automatico.

## Cosa fa

- `/ban` `/kick` `/mute` `/unmute` `/warn` `/clear` — comandi di moderazione
- **Anti-spam automatico**: se un utente scrive troppi messaggi in pochi secondi, il bot cancella i messaggi e lo silenzia in automatico (i moderatori non vengono mai toccati)
- **Sistema di verifica con bottone**: i nuovi membri vedono solo un canale isolato finché non premono "Verificami"
- **Log opzionali** delle azioni in un canale dedicato

---

## PARTE 0 — Configura il sistema di verifica (PRIMA di invitare il bot)

1. Su Discord, vai in **Impostazioni server → Ruoli** → crea un nuovo ruolo chiamato **"Verificato"** (nessun permesso speciale necessario, serve solo come "tag")
2. Clicca sul ruolo "Verificato" → **Copia ID** (serve attivare prima la "Modalità sviluppatore" in Impostazioni → Avanzate, se non l'hai già fatto)
3. Salva quell'ID, lo metterai in `.env` come `VERIFIED_ROLE_ID`
4. Crea un canale testo chiamato es. **#verifica**
5. Vai nei **permessi di quel canale**: assicurati che `@everyone` possa vederlo e scrivere (o solo vederlo, a tua scelta)
6. Vai nei **permessi di TUTTI gli altri canali** del server: togli il permesso "Visualizza canale" a `@everyone`, poi aggiungi un'eccezione che dia "Visualizza canale" al ruolo **"Verificato"**

In questo modo: chi entra nel server vede solo #verifica. Dopo aver premuto il bottone, ottiene il ruolo "Verificato" e gli altri canali si sbloccano automaticamente.

⚠️ Quando inviti il bot (Parte 1, OAuth2), aggiungi anche il permesso **"Gestire i ruoli"** nella checklist dei permessi del bot. E assicurati che il ruolo del bot, in **Impostazioni server → Ruoli**, sia posizionato **più in alto** del ruolo "Verificato" nella lista, altrimenti non potrà assegnarlo.

Una volta che il bot è online (dopo la Parte 3), usa il comando **`/setup-verifica`** dentro al canale #verifica: pubblicherà il messaggio con il bottone "Verificami".

---

## PARTE 1 — Crea il bot su Discord (10 minuti)

1. Vai su https://discord.com/developers/applications e fai login.
2. Clicca **New Application**, dai un nome (es. "ModBot") e crea.
3. Nel menu a sinistra vai su **Bot**.
4. Clicca **Reset Token** → **Copy** per copiare il token. **Tienilo segreto**, è come una password.
5. Più in basso, attiva questi tre interruttori sotto "Privileged Gateway Intents":
   - `PRESENCE INTENT`
   - `SERVER MEMBERS INTENT`
   - `MESSAGE CONTENT INTENT`
6. Vai su **General Information** e copia anche l'**Application ID** (ti servirà come CLIENT_ID).
7. Vai su **OAuth2 → URL Generator**:
   - In "Scopes" seleziona `bot` e `applications.commands`
   - In "Bot Permissions" seleziona: `Ban Members`, `Kick Members`, `Moderate Members`, `Manage Messages`, `Read Messages/View Channels`, `Send Messages`
   - Copia il link generato in basso e aprilo nel browser: ti permette di invitare il bot su un tuo server (devi avere permessi di amministratore lì).

⚠️ Importante: nel server, il ruolo del bot deve stare **più in alto** nella lista ruoli rispetto agli utenti che vuoi poter bannare/mutare, altrimenti Discord non glielo permette.

---

## PARTE 2 — Configura il progetto

1. Scarica/estrai questa cartella sul tuo PC (o caricala direttamente su Railway, vedi Parte 3).
2. Rinomina il file `.env.example` in `.env`.
3. Apri `.env` e inserisci:
   - `DISCORD_TOKEN` → il token copiato al punto 4 sopra
   - `CLIENT_ID` → l'Application ID copiato al punto 6 sopra
   - `GUILD_ID` → l'ID del tuo server (clic destro sul nome del server in Discord → "Copia ID server"; se non vedi questa opzione, attiva la "Modalità sviluppatore" in Discord → Impostazioni → Avanzate)
   - `LOG_CHANNEL_ID` → (opzionale) ID di un canale testo dove vuoi i log delle azioni

---

## PARTE 3 — Pubblica gratis su Railway

1. Vai su https://railway.app e registrati (puoi usare l'account GitHub).
2. Crea un nuovo progetto → **Deploy from GitHub repo** (carica prima questa cartella su un tuo repository GitHub) oppure usa **Empty Project** e collega Railway CLI.
   - Modo più semplice: crea un repository GitHub nuovo, carica tutti i file di questa cartella (tranne `.env`, che non va mai pubblicato), poi su Railway scegli "Deploy from GitHub repo" e seleziona quel repository.
3. Una volta creato il progetto su Railway, vai su **Variables** e aggiungi le stesse variabili che hai messo nel tuo `.env`:
   `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `LOG_CHANNEL_ID`, `ANTISPAM_MAX_MESSAGES`, `ANTISPAM_WINDOW_MS`, `ANTISPAM_TIMEOUT_MINUTES`.
4. Vai su **Settings** e assicurati che il comando di start sia `npm start`.
5. Apri il terminale/Shell di Railway (o esegui in locale una volta) per registrare i comandi slash:
   ```
   npm run deploy
   ```
   Questo comando va eseguito **una sola volta** (e ogni volta che aggiungi un nuovo comando).
6. Railway avvierà automaticamente `npm start`, che esegue `index.js` e mette online il bot.

Se preferisci testarlo prima in locale:
```
npm install
npm run deploy
npm start
```
(richiede Node.js 18+ installato sul PC)

---

## Personalizzazione rapida

- **Quanto è sensibile l'anti-spam**: modifica `ANTISPAM_MAX_MESSAGES` (numero messaggi) e `ANTISPAM_WINDOW_MS` (millisecondi) nelle variabili d'ambiente.
- **Durata del mute automatico**: `ANTISPAM_TIMEOUT_MINUTES`.
- **Aggiungere nuovi comandi**: crea un nuovo file in `commands/` seguendo lo schema degli altri (esporta `data` e `execute`), poi esegui di nuovo `npm run deploy`.
- **Colori e testi degli embed**: sono dentro ogni file in `commands/` e in `events/messageCreate.js`, puoi modificarli liberamente.

---

## Struttura del progetto

```
discord-mod-bot/
├── index.js              ← avvia il bot
├── deploy-commands.js    ← registra i comandi slash su Discord
├── package.json
├── .env.example
├── commands/
│   ├── ban.js
│   ├── kick.js
│   ├── mute.js
│   ├── unmute.js
│   ├── warn.js
│   └── clear.js
├── events/
│   ├── ready.js
│   ├── interactionCreate.js
│   └── messageCreate.js  ← qui vive l'anti-spam
└── utils/
    └── logger.js
```

---

## Problemi comuni

- **"Non posso bannare/mutare questo utente"** → il ruolo del bot è più basso di quello dell'utente target. Sposta il ruolo del bot più in alto in Impostazioni server → Ruoli.
- **I comandi slash non compaiono** → esegui `npm run deploy`, e se hai usato `GUILD_ID` compaiono subito, altrimenti senza `GUILD_ID` (registrazione globale) possono richiedere fino a un'ora.
- **Il bot va offline su Railway** → controlla i log nella dashboard di Railway, spesso è un token sbagliato o una variabile d'ambiente mancante.
