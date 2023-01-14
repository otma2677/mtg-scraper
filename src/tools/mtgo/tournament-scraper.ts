/**
 *
 */
import { JSDOM } from 'jsdom';
import { superFetch } from '../../core/utils';

/**
 *
 */
export const tournamentScraper = async (month: number, year: number) => {
  const url = `https://www.mtgo.com/en/mtgo/decklists/${year}/${month}`;
  const data = await superFetch(url);

  const document = new JSDOM(data).window.document;
  const listOfElements = Array.from(document.querySelectorAll('.decklists-item'));

  return listOfElements.map(element => 'https://www.mtgo.com/en/'+element.firstElementChild?.getAttribute('href'));
};
