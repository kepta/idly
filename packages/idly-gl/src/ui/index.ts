import { html, render } from 'lit-html/lib/lit-extended';

const styleEl = html`
  <style>

  </style>
`;

export interface UiConfig {}

export class PluginUi {
  private state: {
    uiConfig: UiConfig;
  };
  private container: Element;
  constructor(container: Element, uiConfig = {}) {
    this.container = container;
    this.state = {
      uiConfig,
    };
    this.render();
  }
  public render(data = '') {
    render(
      html`
      <div class="idly-gl">
        ${styleEl}
        <span class="my-span">
          Hello world
          </span>
        <div>
          ${data}
        </div>
      </div>
    `,
      this.container
    );
  }
}
