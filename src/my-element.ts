import styles from './my-element.scss';
import { LitElement, html, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';

var gateway = `ws://192.168.4.1/ws`;
var websocket;
@customElement('my-element')
export class MyElement extends LitElement {
  static styles = styles;


  @property({ type: Number })
  count = 0;
  @property({ type: WebSocket })
  websocket;

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.initWebSocket();
  }

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <slot></slot>
      <div class="topnav">
        <h1>ESP WebSocket Server</h1>
      </div>
      <div class="content">
        <div class="card">
          <div class="runSpeed">
            <label> Speed </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              class="slider"
              id="moveRighh"
              value="0"
              @change=${this.servo}
            />
          </div>
        </div>
        <div class="card">
          <div class="wing">
            <label class=""> LeftWing </label>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              class="slider"
              id="moveLeft"
              value="0"
              @change=${this.servo}
            />
          </div>
        </div>
        <div class="card">
          <div class="wing">
            <label> RightWing </label>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              class="slider"
              id="moveRight"
              value="0"
              @change=${this.servo}
            />
          </div>
        </div>
      </div>
    `;
  }
  initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    this.websocket = new WebSocket(gateway);
    this.websocket.onopen = this.onOpen;
    this.websocket.onclose = this.onClose;
    this.websocket.onmessage = this.onMessage; // <-- add this line
  }
  onOpen(event) {
    console.log('Connection opened');
  }
  onClose(event) {
    console.log('Connection closed');
    setTimeout(this.initWebSocket, 2000);
  }
  onMessage(event) {
    console.log('event: ', event);
  }

  servo(e: Event) {
    let val = e.currentTarget.value as HTMLInputElement;
    // console.log('val: ', `${e.currentTarget.id}=${val}`);
    this.websocket.send(`${e.currentTarget.id}=${val}`);
  }
  private _onClick() {
    this.websocket.send('toggle');
  }

  foo(): string {
    return 'foo';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
