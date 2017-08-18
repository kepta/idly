var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as SphericalMercator from '@mapbox/sphericalmercator';
import { handleErrors } from 'helpers/promise';
import { stubXML } from 'parsing/fixtures';
const DOMParser = require('xmldom').DOMParser;
const merc = new SphericalMercator({
    size: 256
});
const fetchStub = () => {
    return Promise.resolve(stubXML);
};
const debug = false;
export function fetchTile(x, y, zoom) {
    return __awaiter(this, void 0, void 0, function* () {
        const xyz = [x, y, zoom].join(',');
        const bboxStr = merc.bbox(x, y, zoom).join(',');
        try {
            if (debug) {
                return new DOMParser().parseFromString(yield fetchStub(), 'text/xml');
            }
            let response = yield fetch(`https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`);
            response = handleErrors(response);
            const text = yield response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            return xml;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    });
}
//# sourceMappingURL=fetch.js.map