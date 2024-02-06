/**
 *
 */
import { JSDOM } from 'jsdom';
import { superFetch } from '../core/utils';

/**
 *
 */
export const MTGOTournamentScraper = async (month: number, year: number, isWWW = true) => {
  const base = isWWW ? 'www.mtgo' : 'mtgo';
  const m = (month +1).toString();
  const goodMonth = m.length === 1 ? `0${m}`: m;


  const url = `https://${base}.com/decklists/${year}/${goodMonth}`;
  const data = await superFetch(url);

  const document = new JSDOM(data).window.document;
  const listOfElements = Array.from(document.querySelectorAll('.decklists-item'));

  return listOfElements.map(element => `https://${base}.com${element.firstElementChild?.getAttribute('href')}`);
};
