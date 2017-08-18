/**
 *
 * @REVISIT
 * @TOFIX
 */
import { AreaKeys } from 'presets/areaKeys';
import { Entity } from 'structs';
import { Geometry } from 'structs/geometry';
import { Tags } from 'structs/tags';
export declare function isOnAddressLine(entity?: Entity): boolean;
export declare function presetsMatch(all: any, index: {}, areaKeys: AreaKeys, geometry: Geometry, tags: Tags): any;
