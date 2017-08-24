"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("idly-data/lib");
const primaries = [
    'building',
    'highway',
    'railway',
    'waterway',
    'aeroway',
    'motorway',
    'boundary',
    'power',
    'amenity',
    'natural',
    'landuse',
    'leisure',
    'military',
    'place'
];
const statuses = [
    'proposed',
    'construction',
    'disused',
    'abandoned',
    'dismantled',
    'razed',
    'demolished',
    'obliterated'
];
const secondaries = [
    'oneway',
    'bridge',
    'tunnel',
    'embankment',
    'cutting',
    'barrier',
    'surface',
    'tracktype',
    'crossing',
    'service',
    'sport'
];
exports.tagClassesPrimary = (t) => {
    let classes = '';
    let primary;
    let status;
    let i;
    let key;
    let value;
    // pick at most one primary classification tag..
    for (i = 0; i < primaries.length; i++) {
        key = primaries[i];
        value = t.get(key);
        if (!value || value === 'no')
            continue;
        primary = key;
        if (statuses.indexOf(value) !== -1) {
            // e.g. `railway=abandoned`
            status = value;
            classes += ' tag-' + key;
        }
        else {
            classes += ' tag-' + key + ' tag-' + key + '-' + value;
        }
        break;
    }
    return classes.trim().split(' ');
};
function tagClasses(t) {
    let classes = '';
    let primary;
    let status;
    let i;
    let key;
    let value;
    // pick at most one primary classification tag..
    for (i = 0; i < primaries.length; i++) {
        key = primaries[i];
        value = t.get(key);
        if (!value || value === 'no')
            continue;
        primary = key;
        if (statuses.indexOf(value) !== -1) {
            // e.g. `railway=abandoned`
            status = value;
            classes += ' tag-' + key;
        }
        else {
            classes += ' tag-' + key + ' tag-' + key + '-' + value;
        }
        break;
    }
    // add at most one status tag, only if relates to primary tag..
    if (!status) {
        for (i = 0; i < statuses.length; i++) {
            key = statuses[i];
            value = t.get(key);
            if (!value || value === 'no')
                continue;
            if (value === 'yes') {
                // e.g. `railway=rail + abandoned=yes`
                status = key;
            }
            else if (primary && primary === value) {
                // e.g. `railway=rail + abandoned=railway`
                status = key;
            }
            else if (!primary && primaries.indexOf(value) !== -1) {
                // e.g. `abandoned=railway`
                status = key;
                primary = value;
                classes += ' tag-' + value;
            } // else ignore e.g.  `highway=path + abandoned=railway`
            if (status)
                break;
        }
    }
    if (status) {
        classes += ' tag-status tag-status-' + status;
    }
    // add any secondary (structure) tags
    for (i = 0; i < secondaries.length; i++) {
        key = secondaries[i];
        value = t.get(key);
        if (!value || value === 'no')
            continue;
        classes += ' tag-' + key + ' tag-' + key + '-' + value;
    }
    // For highways, look for surface tagging..
    if (primary === 'highway') {
        let paved = t.get('highway') !== 'track';
        t.forEach((v, k) => {
            if (k in lib_1.osmPavedTags) {
                paved = !!lib_1.osmPavedTags[k][v];
                return false;
            }
        });
        if (!paved) {
            classes += ' tag-unpaved';
        }
    }
    classes = classes.trim();
    return classes;
}
exports.tagClasses = tagClasses;
// function i
//# sourceMappingURL=tagClasses.js.map