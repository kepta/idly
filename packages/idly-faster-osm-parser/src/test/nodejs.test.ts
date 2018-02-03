import * as fs from 'fs';
import equal from 'lodash-es/isEqual';
import { iDParser } from '../iDParser';
import { nodejsParser } from '../nodejsParser';
import { parser } from '../parser';
import * as xmls from './fixtures';

function writeFile(path: string, data: string) {
  fs.writeFileSync(path, data, 'utf-8');
}

function deleteFile(path: string) {
  fs.unlinkSync(path);
}

describe('node and regular parity', () => {
  Object.keys(xmls)
    .map(k => [k, (xmls as any)[k]])
    .forEach(([k, xml]) => {
      it(`should work for ${k}`, () => {
        const path = `./xml.osm`;
        writeFile(path, xml);

        const nodeOutput = Array.from(nodejsParser(path));
        const regularOutput = parser(xml);
        const parsedXML = new DOMParser().parseFromString(
          xml
            .split('\n')
            .slice(1)
            .join('\n'),
          'text/xml'
        );
        const legacyOutput = iDParser(parsedXML);
        deleteFile(path);
        expect(equal(nodeOutput, regularOutput)).toBe(true);
        expect(equal(regularOutput, legacyOutput)).toBe(true);
        expect(nodeOutput.length).toMatchSnapshot();
      });
    });
});
