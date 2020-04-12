const template = document.createElement("template");
template.innerHTML = `<h1>Hello World</h1>`;

class HelloComponent extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    
  }

  // lifecycle of web component
  connectedCallback() {
   console.log("connected!");
  }

  disconnectedCallback() {
    console.log("disconnected!");
  }
}

window.customElements.define("hello-world", HelloComponent);
