# Example

An example which get tournaments and data, save it in JSON locally in a Node.js long-running process.

```typescript
import { setTimeout as sleep, setInterval as every } from 'node:timers/promises';
import { join } from 'node:path';
import { access, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { MTGOTournamentParser, MTGOTournamentScraper, checkURLFormat } from 'mtg-scraper2';

(async () => {
  // Create necessary folders if they don't already exists
  try {
    await initFolders();
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
  
  const day = (60*60*24) *1000;
  
  for await (const _ of every(day)) {
    try {
      const today = new Date();
      const availableTournaments = await MTGOTournamentScraper(today.getMonth(), today.getFullYear());

      for (const tournament of availableTournaments) {
        const name = tournament.split('/').at(-1);
        const format = checkURLFormat(tournament);
        if (!name || format === 'unknown')
          continue;

        const fileName = `${name}.json`;
        const filePath = join(homedir(), 'mtg_scraper_data', format, fileName);

        if (await checkPathValidity(filePath))
          continue;

        try {
          const data = await MTGOTournamentParser(tournament);
          await writeFile(filePath, JSON.stringify(data));
          
        } catch(err) {
          if (err instanceof Error) {
            const pathToErrorFile = await saveErr(name, err);
            console.error(`An error while scraping ${ name } has occurred. Details at ${ pathToErrorFile }.`);
          }
        }

        // Wait 30 seconds between tournament scraps
        await sleep(30 * 1000);
      }
    } catch (err) {
      console.error('Error occurred while reaching for tournaments.\n' + err);
    }
  }
})();

/**
 * Save errors into .txt files
 */
async function saveErr(name: string, err: Error) {
  const date = Date.now();
  const fileName = `error_${date}_${name}.txt`;
  const filePath = join(homedir(), 'mtg_scraper_data', fileName);
  
  const formattedError = `
    ERROR - ${new Date(date).toLocaleDateString()}
    Tournament concerned: ${ name }
    
    Message (${err.name}): ${err.message}
    
    Stack: ${err.stack}
  `;
  
  await writeFile(filePath, formattedError);
  
  return filePath;
}

/**
 * Create a path in the user windows/linux folder to later save all the tournament data in there
 */
async function initFolders() {
  const pathToDataStorageFolder = join(homedir(), 'mtg_scraper_data');
  if (!await checkPathValidity(pathToDataStorageFolder))
    await mkdir(pathToDataStorageFolder);

  const formats = [ 'standard', 'pioneer', 'modern', 'pauper', 'legacy', 'vintage' ];
  for (const format of formats)
    if (!await checkPathValidity(join(pathToDataStorageFolder, format)))
      await mkdir(join(pathToDataStorageFolder, format))
}

/**
 * Check if path does exist
 */
async function checkPathValidity(path: string) {
  try {
    await access(path);
    return true;
  } catch(err) {
    return false;
  }
}

```
