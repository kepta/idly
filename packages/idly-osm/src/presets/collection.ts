import * as _ from 'lodash';

import { utilEditDistance } from '../helpers/editDistance';

export function presetCollection(collection) {
  const maxSearchResults = 50;
  const maxSuggestionResults = 10;

  const presets = {
    collection,

    item(id) {
      return _.find(this.collection, function(d: {}) {
        return d.id === id;
      });
    },

    matchGeometry(geometry) {
      return presetCollection(
        this.collection.filter(function(d) {
          return d.matchGeometry(geometry);
        })
      );
    },

    search(value, geometry) {
      if (!value) return this;

      function leading(a) {
        const index = a.indexOf(value);
        return index === 0 || a[index - 1] === ' ';
      }

      function suggestionName(name) {
        const nameArray = name.split(' - ');
        if (nameArray.length > 1) {
          name = nameArray.slice(0, nameArray.length - 1).join(' - ');
        }
        return name.toLowerCase();
      }

      value = value.toLowerCase();

      const searchable = _.filter(this.collection, function(a: {}) {
        return a.searchable !== false && a.suggestion !== true;
      });

      const suggestions = _.filter(this.collection, function(a: {}) {
        return a.suggestion === true;
      });

      // matches value to preset.name
      const leadingName = _.filter(searchable, function(a) {
        return leading(a.name().toLowerCase());
      }).sort(function(a, b) {
        let i;
        i = b.originalScore - a.originalScore;
        if (i !== 0) return i;

        i =
          a.name().toLowerCase().indexOf(value) -
          b.name().toLowerCase().indexOf(value);
        if (i !== 0) return i;

        return a.name().length - b.name().length;
      });

      // matches value to preset.terms values
      const leadingTerms = _.filter(searchable, function(a) {
        return _.some(a.terms() || [], leading);
      });

      // matches value to preset.tags values
      const leadingTagValues = _.filter(searchable, function(a) {
        return _.some(_.without(_.values(a.tags || {}), '*'), leading);
      });

      // finds close matches to value in preset.name
      const similarName = searchable
        .map(function(a) {
          return {
            preset: a,
            dist: utilEditDistance(value, a.name())
          };
        })
        .filter(function(a) {
          return (
            a.dist + Math.min(value.length - a.preset.name().length, 0) < 3
          );
        })
        .sort(function(a, b) {
          return a.dist - b.dist;
        })
        .map(function(a) {
          return a.preset;
        });

      // finds close matches to value in preset.terms
      const similarTerms = _.filter(searchable, function(a) {
        return _.some(a.terms() || [], function(b: {}) {
          return (
            utilEditDistance(value, b) + Math.min(value.length - b.length, 0) <
            3
          );
        });
      });

      const leadingSuggestions = _.filter(suggestions, function(a) {
        return leading(suggestionName(a.name()));
      }).sort(function(a, b) {
        a = suggestionName(a.name());
        b = suggestionName(b.name());
        const i = a.indexOf(value) - b.indexOf(value);
        if (i === 0) return a.length - b.length;
        else return i;
      });

      const similarSuggestions = suggestions
        .map(function(a) {
          return {
            preset: a,
            dist: utilEditDistance(value, suggestionName(a.name()))
          };
        })
        .filter(function(a) {
          return (
            a.dist +
              Math.min(
                value.length - suggestionName(a.preset.name()).length,
                0
              ) <
            1
          );
        })
        .sort(function(a, b) {
          return a.dist - b.dist;
        })
        .map(function(a) {
          return a.preset;
        });

      const other = presets.item(geometry);

      const results = leadingName
        .concat(
          leadingTerms,
          leadingTagValues,
          leadingSuggestions.slice(0, maxSuggestionResults + 5),
          similarName,
          similarTerms,
          similarSuggestions.slice(0, maxSuggestionResults)
        )
        .slice(0, maxSearchResults - 1);

      return presetCollection(_.uniq(results.concat(other)));
    }
  };

  return presets;
}
