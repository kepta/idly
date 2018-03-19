export abstract class Component<Props, State, Render> {
  protected abstract state: State;
  protected props: Props;
  protected componentDidUpdate?: any;
  constructor(props: Props) {
    this.props = props;
  }

  public componentWillUnMount(): void {
    return;
  }

  public setProps(nextProps: Props) {
    if (this.shouldComponentUpdate(nextProps, this.state)) {
      this.props = nextProps;
      this.render();
    }
  }

  protected abstract shouldComponentUpdate(_: Props, __: State): boolean;

  protected setState(newState: Partial<State>) {
    const newS = Object.assign({}, this.state, newState);
    if (this.shouldComponentUpdate(this.props, newS)) {
      this.state = newS;
      this.render();
    }
  }

  protected abstract render(): Render;
}
