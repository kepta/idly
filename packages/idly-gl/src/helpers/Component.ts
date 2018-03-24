import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

export interface ComponentUpdateType<Props, State> {
  next: { props: Props; state: State };
  prev: { props: Props; state: State };
}

export abstract class Component<
  Props,
  State,
  C extends Record<string, Component<any, any, any, any>>,
  Render
> {
  protected unmounted = false;
  protected props$: BehaviorSubject<Props>;
  protected state$: BehaviorSubject<State>;

  protected render$!: Subscription;
  protected children?: C;
  private mounted?: boolean;

  constructor(props: Props, state: State) {
    this.props$ = new BehaviorSubject<Props>(props);
    this.state$ = new BehaviorSubject<State>(state);
  }

  protected get state(): State {
    return this.state$.getValue();
  }

  public get props(): Props {
    return this.props$.getValue();
  }

  public componentWillUnMount(): void {
    if (!this.mounted) {
      return;
    }

    this.render$.unsubscribe();
    this.state$.complete();
    this.props$.complete();

    const children = this.children;
    if (children) {
      Object.keys(children).forEach(key => {
        children[key].componentWillUnMount();
      });
    }

    this.mounted = false;
  }

  public setProps(nextProps: Props) {
    if (
      this.shouldComponentUpdate({
        prev: {
          state: this.state$.getValue(),
          props: this.props$.getValue(),
        },
        next: {
          state: this.state$.getValue(),
          props: nextProps,
        },
      })
    ) {
      this.props$.next(nextProps);
    }
  }

  protected mount() {
    if (this.mounted === false || this.mounted === true) {
      return;
    }

    this.mounted = true;
    this.render$ = combineLatest(this.props$, this.state$).subscribe(
      ([p, s]) => {
        const rendered = this.render(p, s);
        if (this.processRender) {
          if (rendered instanceof Promise) {
            rendered.then(
              r => this.processRender && this.processRender(p, s, r)
            );
          } else {
            this.processRender(p, s, rendered);
          }
        }
        if (this.componentDidUpdate) {
          if (rendered instanceof Promise) {
            rendered.then(
              () => this.componentDidUpdate && this.componentDidUpdate(p, s)
            );
          } else {
            this.componentDidUpdate(p, s);
          }
        }
      }
    );
  }

  protected shouldComponentUpdate({
    next,
    prev,
  }: ComponentUpdateType<Props, State>): boolean {
    return next.props !== prev.props || next.state !== prev.state;
  }

  protected setState(newState: Partial<State>) {
    const nextState = Object.assign({}, this.state$.getValue(), newState);
    if (
      this.shouldComponentUpdate({
        prev: {
          state: this.state$.getValue(),
          props: this.props$.getValue(),
        },
        next: {
          state: nextState,
          props: this.props$.getValue(),
        },
      })
    ) {
      this.state$.next(nextState);
    }
  }

  protected abstract render(
    props: Props,
    state: State
  ): Render | Promise<Render>;

  // doing setState / setProps in one of these will result inconsistent state!
  protected componentDidUpdate?(p: Props, s: State): void;

  protected processRender?(p: Props, s: State, r: Render): void;

  protected componentWillMount?(p: Props, s: State): void;
}
