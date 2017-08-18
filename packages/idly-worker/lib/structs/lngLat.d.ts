export interface LngLat {
    readonly lat: number;
    readonly lon: number;
}
export declare function genLngLat(obj: {
    lon: number;
    lat: number;
} | [number, number]): LngLat;
