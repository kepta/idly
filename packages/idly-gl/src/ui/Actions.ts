import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { bindThis } from '../helpers/helper';
import { LayerOpacity, layerOpacity } from '../helpers/layerOpacity';
import { State } from './State';

// TODO lets move to redux
export class Actions {
  private subject: BehaviorSubject<State>;

  constructor(subject: BehaviorSubject<State>) {
    this.subject = subject;
  }

  get store(): State {
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
  public modifyQuadkeys(d: State['map']['quadkeys']) {
    if (d.every(q => this.store.map.quadkeys.indexOf(q) > -1)) {
      return;
    }
    this.subject.next({
      ...this.store,
      map: { ...this.store.map, quadkeys: d, loading: true },
    });
  }

  @bindThis
  public modifyFC(d: State['map']['featureCollection']) {
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
      l => (l.layer.id.includes(id) ? { ...l, hide: !l.hide } : l)
    );

    this.subject.next({
      ...this.store,
      map: { ...this.store.map, layers },
    });
  }

  /**
   * BUG: When doing modifyLayeropacity
   * the placeholder layers are removed and added again
   * hence all the stuff (hover, select..) in between these layers moves out (goes under)
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
