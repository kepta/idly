// @NOTE only testing on T=string, K=string
//  note sure if immutability persists if
//  used with deepprops
export class Tags {
  private map: Map<string, string>;
  constructor(arr: Array<[string, string]>) {
    this.map = new Map(arr);
  }
  public get(id: string): string | undefined {
    return this.map.get(id);
  }
  public toJSON() {
    return JSON.stringify([...this.map]);
  }
  public forEach(cb: (v: string, k: string) => void) {
    this.map.forEach(cb);
  }
  public toArray() {
    return [...this.map];
  }
  public delete(id: string): Tags {
    const arr: Array<[string, string]> = [];
    for (const [k, v] of this.map) {
      if (k !== id) {
        arr.push([k, v]);
      }
    }
    return new Tags(arr);
  }
  public set(id: string, modify: string): Tags {
    // const arr: Array<[string, string]> = [];
    // for (const [k, v] of this.map) {
    //   if (k === id) {
    //     arr.push([k, modify]);
    //   } else {
    //     arr.push([k, v]);
    //   }
    // }
    return new Tags([...this.map, [id, modify]]);
  }
  public has(id: string) {
    return this.map.has(id);
  }
}
