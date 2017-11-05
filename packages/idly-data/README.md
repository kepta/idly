[iD](https://github.com/openstreetmap/iD/tree/master/modules/presets)'s preset + data module copy.

Note differences
- `all.match` params are different from the iD's `all.match`.

To get the original API use the following code

```Javascript
 presets = presetIndex(t);

    var presetsMatch = presets.match;

    presets.match = function (entity, resolver) {
        var geometry = entity.geometry(resolver);
        if (geometry === 'vertex' && entity.isOnAddressLine(resolver)) {
            geometry = 'point';
        }
        return presetsMatch.call(this, entity.tags, geometry);
    };
```

Better docs coming soon :P.