/**
 *
 */
import { JSDOM } from 'jsdom';

/**
 *
 */
export async function MTGOTournamentScraper(moment: Date, isW = true) {
  const base = isW ? 'www.mtgo' : 'mtgo';
  const m = (moment.getMonth() +1).toString();
  const gM = m.length === 1 ? `0${m}` : m;

  const url = `https://${ base }.com/decklists/${moment.getFullYear()}/${gM}`;
  const response = await fetch(url);
  const data = await response.text();

  const document = new JSDOM(data).window.document;
  const listOfElements = Array.from(document.querySelectorAll('.decklists-item'));

  return listOfElements
    .map(e => `https://${base}.com${e.firstElementChild?.getAttribute('href')}`);
}
