import * as R from 'ramda';
import { connect } from 'react-redux';

// import K from 'idly-osm';
// console.log(K);
const PLUGINS = [
  import(/* webpackChunkName: "idly-osm" */
  /* webpackMode: "lazy" */
  'idly-osm/lib/index')
    // Promise.resolve()
    .then(r => r.default)
    .then(r => {
      console.log('plugin', r);
      return r;
    })
    .catch(e => {
      console.error(e);
      return Promise.reject('couldnt load idly-osm');
    })
];

export interface Plugin {
  name: string;
  description: string;
  uiComponents: any[];
  workers: any[];
  actions: any[];
}

export interface PluginUiComponent {
  pluginName: string;
  component: any;
}

export interface PluginWorker {
  pluginName: string;
  worker: any;
}

export interface PluginAction {
  pluginName: string;
  action: any;
}

function bindComponents(
  uiComponents: any[],
  pluginName: string
): PluginUiComponent[] {
  if (!Array.isArray(uiComponents)) uiComponents = [uiComponents];
  return uiComponents
    .map(c =>
      connect<any, any, any>((idlyState, props) => ({ idlyState }))(c as any)
    )
    .map(c => ({
      pluginName,
      component: c
    }));
}

function bindActions(actions: any[], pluginName): PluginAction[] {
  if (!Array.isArray(actions)) actions = [actions];
  return actions.map(c => c).map(c => ({
    pluginName,
    action: c
  }));
}

function bindWorkers(workers: any[], pluginName): PluginWorker[] {
  if (!Array.isArray(workers)) workers = [workers];
  return workers.map(c => ({
    pluginName,
    worker: c
  }));
}

async function importUiPlugin(
  pluginProm: Promise<Plugin>
): Promise<{
  components: PluginUiComponent[];
  actions: PluginAction[];
  workers: PluginWorker[];
}> {
  const plugin = await pluginProm;

  if (!plugin.actions || !plugin.workers || !plugin.uiComponents) {
    throw new Error('not found workers or actions or ui' + plugin);
  }

  return {
    components: bindComponents(plugin.uiComponents, plugin.name),
    actions: bindActions(plugin.actions, plugin.name),
    workers: bindWorkers(plugin.workers, plugin.name)
  };
}

export async function provideUiComponents(
  pluginProm: Array<Promise<Plugin | undefined>>
) {
  const loadedPlugins = await Promise.all(
    pluginProm.map(plugin => importUiPlugin(plugin))
  );
  const components = loadedPlugins
    .map(p => p.components)
    .reduce((a, b) => a.concat(b), []);
  const actions = R.flatten(loadedPlugins.map(p => p.actions)).reduce(
    (a, b) => a.concat(b),
    []
  );
  const workers = R.flatten(loadedPlugins.map(p => p.workers)).reduce(
    (a, b) => a.concat(b),
    []
  );
  return { components, actions, workers };
}

export const plugins = provideUiComponents(PLUGINS).catch(e =>
  console.error(e)
);
