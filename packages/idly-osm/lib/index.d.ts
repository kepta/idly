export declare const PLUGIN_NAME = "osm_basic";
export interface Plugin {
    name: string;
    description: string;
    uiComponents: any[];
    workers: any[];
    actions: any[];
}
export declare var plugin: Plugin;
export default plugin;
