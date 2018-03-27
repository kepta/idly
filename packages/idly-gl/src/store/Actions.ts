import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { bindThis } from '../helpers/helpers';
import { LayerOpacity, layerOpacity } from '../helpers/layerOpacity';
import { Store } from './index';

export class Actions {
  private subject: BehaviorSubject<Store>;

  constructor(subject: BehaviorSubject<Store>) {
    this.subject = subject;
  }

  get store(): Store {
    return this.subject.getValue();
  }

  @bindThis
  public modifySelectedId(id?: string) {
    this.subject.next({
      ...this.store,
      selectEntity: {
        ...this.store.selectEntity,
        selectedId: id || this.store.selectEntity.hoverId,
      },
    });
  }

  @bindThis
  public modifyHoverId(id?: string) {
    this.subject.next({
      ...this.store,
      selectEntity: { ...this.store.selectEntity, hoverId: id },
    });
  }

  @bindThis
  public modifyMainTab(mainTab: any) {
    this.subject.next({
      ...this.store,
      mainTab: { ...this.store.mainTab, active: mainTab },
    });
  }

  @bindThis
  public modifyQuadkeys(d: Store['map']['quadkeys']) {
    if (d.every(q => this.store.map.quadkeys.indexOf(q) > -1)) {
      return;
    }
    this.subject.next({
      ...this.store,
      map: { ...this.store.map, quadkeys: d, loading: true },
    });
  }

  @bindThis
  public modifyFC(d: Store['map']['featureCollection']) {
    this.subject.next({
      ...this.store,
      map: { ...this.store.map, featureCollection: d, loading: false },
    });
  }

  @bindThis
  public modifyLayerHide(id: any) {
    if (!id) {
      return;
    }
    const layers = this.store.map.layers.map(
      // this includes the *-casing layers
      l => (l.layer.id.includes(id) ? { ...l, hide: !l.hide } : l)
    );

    this.subject.next({
      ...this.store,
      selectEntity: {
        ...this.store.selectEntity,
        hoverId: undefined,
        selectedId: undefined,
      },
      map: { ...this.store.map, layers },
    });
  }

  /**
   * BUG: When doing modifyLayeropacity & layerhide
   * the placeholder layers are removed and added again
   * hence all the stuff (hover, select..) in between these layers moves out (goes under)
   *
   * dirty fix remove any select ? hover
   */

  @bindThis
  public modifyLayerOpacity() {
    let next: LayerOpacity;
    const current = this.store.map.layerOpacity;

    if (current === LayerOpacity.High) {
      next = LayerOpacity.Medium;
    } else if (current === LayerOpacity.Medium) {
      next = LayerOpacity.Low;
    } else {
      next = LayerOpacity.High;
    }

    this.subject.next({
      ...this.store,
      selectEntity: {
        ...this.store.selectEntity,
        hoverId: undefined,
        selectedId: undefined,
      },
      map: {
        ...this.store.map,
        layerOpacity: next,
        layers: layerOpacity(
          next,
          this.store.map.layerOpacity,
          this.store.map.layers
        ),
      },
    });
  }
}
