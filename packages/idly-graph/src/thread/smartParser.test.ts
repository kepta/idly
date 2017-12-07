import { xmlToEntities } from './xmlToEntities';
import {
  NODE_XML1,
  WAY_XML1,
  XML1,
  XML2,
  XML3,
  BIG_XML1,
  XML5,
  XML6,
  XML7,
  XML8,
  XML9,
  BIG_XML3,
} from '../misc/fixtures';
import { smartParser } from './smartParser';

describe('smart parser', () => {
  test('case 1', () => {
    const parser = new DOMParser();
    let xml = parser.parseFromString(XML2, 'text/xml');
    var en = smartParser(XML2);
    const entities = xmlToEntities(xml).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    expect(en).toEqual(entities);
  });
  test('case 2', () => {
    const parser = new DOMParser();
    let xml = parser.parseFromString(XML1, 'text/xml');
    const entities = xmlToEntities(xml).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    var en = smartParser(XML1).sort((a, b) => a.id.localeCompare(b.id));
    expect(en).toEqual(entities);
  });
  test('case 3', () => {
    const parser = new DOMParser();
    var saneXML = XML5.split('\n')
      .slice(1)
      .join('\n');
    let xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    var en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('case 4', () => {
    const parser = new DOMParser();
    var saneXML = XML7.split('\n')
      .slice(1)
      .join('\n');
    let xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    var en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('case 5', () => {
    const parser = new DOMParser();
    var saneXML = XML8.split('\n')
      .slice(1)
      .join('\n');
    let xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    var en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('case 6', () => {
    const parser = new DOMParser();
    var saneXML = XML9.split('\n')
      .slice(1)
      .join('\n');
    let xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    var en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('big case 2', () => {
    const parser = new DOMParser();
    var saneXML = BIG_XML1.split('\n')
      .slice(1)
      .join('\n');
    let xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    var en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('big case 3', () => {
    const parser = new DOMParser();
    var saneXML = BIG_XML3.split('\n')
      .slice(1)
      .join('\n');
    let xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    var en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
});
