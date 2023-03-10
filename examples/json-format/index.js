/**
 * IMPORTS
 */
const { join } = require('node:path');
const { access, mkdir, readFile, writeFile } = require('node:fs/promises');
const { homedir } = require('node:os');

const { MTGOTournamentParser, MTGOTournamentScraper } = require('mtg-scraper2');

/**
 * INIT
 */
const sleepUntil = async (time) => new Promise(resolve => setTimeout(() => resolve(), time));

/**
 * RUN
 */
(async () => {
  try {
    await createDefaultFolders();
    const settings = await getSetting();

    if (settings.tournaments.length >= 5000) {
      const length = settings.tournaments.length;
      settings.tournaments = settings.tournaments.slice(Math.floor(length-length*0.8), length);
    }

    const tournaments = await MTGOTournamentScraper();
    await addTournaments(settings, tournaments);
    await scrapeLastTournaments(settings, 200);
    await setSetting(settings);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();

/**
 * FUNCTIONS
 */

/**
 * @param setting {object}
 * @param sleepTime {number?}
 * @returns {Promise<void>}
 */
async function scrapeLastTournaments(setting, sleepTime) {
  const unScrapedTournaments = setting.tournaments.filter(tournament => tournament.scraped === false);

  for (const tournament of unScrapedTournaments) {
    await sleepUntil(sleepTime);

    try {
      const result = await MTGOTournamentParser(tournament);
      await createMetadata(result);
      tournament.scraped = true;
    } catch(err) {
      await writeError(err);
    }
  }
}

/**
 * @param err {any}
 * @param path {string?}
 * @returns {Promise<void>}
 */
async function writeError(err, path) {
  const folderPath = join(path ?? homedir(), 'data', 'errors');
  const currentDatetime = (new Date()).toISOString().slice(0, 19);
  const randomNumber = Math.floor(Math.random() *10000);
  const filePath = join(folderPath, `error.${randomNumber + currentDatetime}.txt`);

  await writeFile(filePath, JSON.stringify(err ?? { message: 'unknown error' }));
}

/**
 * @param data {IFullResults}
 * @param path {string?}
 * @returns {Promise<void>}
 */
async function createMetadata(data, path) {
  const folderPath = join(path ?? homedir(), 'data', 'results', data.tournament.format);
  const filePath = join(folderPath, `${data.tournament.name}.json`);

  await writeFile(filePath, JSON.stringify(data));
}

/**
 * @param setting {object}
 * @param tournaments {Array<string>}
 * @returns {Promise<void>}
 */
function addTournaments(setting, tournaments) {
  for (const tournament of tournaments) {
    const doesExist = setting.tournaments.find(item => item.name === tournament);

    if (!doesExist)
      setting.tournaments.push({ name: tournament, scraped: false });
  }
}

/**
 * @param setting {object}
 * @param path {string?}
 * @returns {Promise<void>}
 */
async function setSetting(setting, path) {
  const settingPath = join(path ?? homedir(), 'data', 'settings', 'setting.json');
  await writeFile(settingPath, JSON.stringify(setting));
}

/**
 * @param path {string?}
 * @returns {Promise<{tournaments: Array<{ name: string, scraped: boolean }>}>}
 */
async function getSetting(path) {
  const settingPath = join(path ?? homedir(), 'data', 'settings', 'setting.json');

  try {
    const rawData = (await readFile(settingPath)).toString('utf8');
    return JSON.parse(rawData);
  } catch (err) {
    return { tournaments: [] };
  }
}

/**
 * @param path {string?}
 * @returns {Promise<void>}
 */
async function createDefaultFolders(path) {
  const realPath = path ?? join(homedir(), 'data');
  const realExist = await checkPath(realPath);
  if (!realExist)
    await mkdir(realPath);

  const resultsPath = join(realPath, 'results');
  const resultsExist = await checkPath(resultsPath);
  if (!resultsExist)
    await mkdir(resultsPath);

  const settingsPath = join(realPath, 'settings');
  const settingsExist = await checkPath(settingsPath);
  if (!settingsExist)
    await mkdir(settingsPath);

  const errPath = join(realPath, 'errors');
  const errExist = await checkPath(errPath);
  if (!errExist)
    await mkdir(errPath);

  const formats = [ 'vintage', 'pauper', 'legacy', 'modern', 'pioneer', 'standard' ];
  for (const format of formats) {
    const formatPath = join(resultsPath, format);
    const formatExist = await checkPath(formatPath);
    if (!formatExist)
      await mkdir(formatPath);
  }
}

/**
 * @param path {string}
 * @returns {Promise<boolean>}
 */
async function checkPath(path) {
  try {
    await access(path);
    return true;
  } catch (err) {
    return false;
  }
}
