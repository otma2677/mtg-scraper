/**
 *
 */
import { JSDOM } from 'jsdom';
import { superFetch } from '../../core/utils';

/**
 *
 */
export const MTGOTournamentScraper = async (month: number, year: number) => {
  const url = `https://www.mtgo.com/en/mtgo/decklists/${year}/${month}`;
  const data = await superFetch(url);

  const document = new JSDOM(data).window.document;
  const listOfElements = Array.from(document.querySelectorAll('.decklists-item'));

  return listOfElements.map(element => 'https://www.mtgo.com'+element.firstElementChild?.getAttribute('href'));
};
