"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("idly-data/lib");
var primaries = [
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
var statuses = [
    'proposed',
    'construction',
    'disused',
    'abandoned',
    'dismantled',
    'razed',
    'demolished',
    'obliterated'
];
var secondaries = [
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
exports.tagClassesPrimary = function (tags) {
    var classes = '';
    var primary;
    var status;
    var i;
    var key;
    var value;
    // pick at most one primary classification tag..
    for (i = 0; i < primaries.length; i++) {
        key = primaries[i];
        value = tags[key];
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
function tagClasses(tags) {
    var classes = '';
    var primary;
    var status;
    var i;
    var key;
    var value;
    // pick at most one primary classification tag..
    for (i = 0; i < primaries.length; i++) {
        key = primaries[i];
        value = tags[key];
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
            value = tags[key];
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
        value = tags[key];
        if (!value || value === 'no')
            continue;
        classes += ' tag-' + key + ' tag-' + key + '-' + value;
    }
    // For highways, look for surface tagging..
    if (primary === 'highway') {
        var paved = tags.highway !== 'track';
        for (var k in tags) {
            var v = tags[k];
            if (k in lib_1.osmPavedTags) {
                paved = !!lib_1.osmPavedTags[k][v];
                break;
            }
        }
        if (!paved) {
            classes += ' tag-unpaved';
        }
    }
    classes = classes.trim();
    return classes;
}
exports.tagClasses = tagClasses;
