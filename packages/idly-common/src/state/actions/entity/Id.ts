export class Id {
  private readonly id: number;
  constructor(id: number) {
    /* tslint:disable */
    this.id = id;
    /* tslint:enable */
  }
  public getId(): number {
    return this.id;
  }
  public next(): Id {
    return new Id(this.id + 1);
  }
}
