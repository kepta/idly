const win: any = window;
export function attachToWindow(name, obj: any) {
  win[name] = obj;
}
