// time ago 
import("./timeago.js");
// wix public location
// import * as timeago from "public/custom-elements/timeago.js";


const defaultImage = "https://static.wixstatic.com/media/46e3aa_0fe6d740591a4f589692d326953b7bde~mv2.png";

const template = document.createElement('template');
template.innerHTML = `
<div class="container">
 <div id="msg-box"></div>
 <div class="typing">
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    <p>Typing...</p>
 </div>
</div>
<style>
        
    .container {
        height: 400px;
        background-color: rgba(0,0,0,0);
        overflow: overlay;
        display: block;
    }
    .message {
        width: 90%;
        display: inline-flex;
        margin: 0px 10px;
        bottom: 0;
    }
    .message:hover .timeAgo {
        /* visibility: visible; */
    }
    .message-head {
        text-align: center;
        width: 15%;
        margin: 10px;
    }
    .message-body {
        padding: 0px 10px 5px 10px;
        width: 85%;
        min-height: 60px;
        background: #ebe7e7;
        margin: 10px 0px;
        border: 1px solid #ccc;
        border-radius: 15px;
    }
    .username {
        margin: 0px;
        font-weight: bold;
        font-size: 17px;
        word-break: break-all;
    }
    .timeAgo {
        color: #ccc;
        margin: 0px;
        /* visibility: hidden; */
    }
    .alter > .message-body {
        background-color: #1a73e8;
        color: white;
        direction: ltr;
    }
    .alter {
        direction: rtl;
        float: right;
    }
    .text-msg{
        margin: 0px;
        padding: 4;
    }
    .avatar {
        border-radius: 50%;
        /* position: relative; */
        width: 35px;
        height: 35px;
    }
    p {
        font-size: 14px;
        font-family: sans-serif;
    }

    /* loading animation*/
    .typing {
        display: none;
    }
    .typing>p {
        line-height: 3.5;
    }
    .lds-ellipsis {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }
      .lds-ellipsis div {
        position: absolute;
        top: 33px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #eee;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
      }
      .lds-ellipsis div:nth-child(1) {
        left: 8px;
        animation: lds-ellipsis1 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(2) {
        left: 8px;
        animation: lds-ellipsis2 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(3) {
        left: 32px;
        animation: lds-ellipsis2 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(4) {
        left: 56px;
        animation: lds-ellipsis3 0.6s infinite;
      }
      @keyframes lds-ellipsis1 {
        0% {
          transform: scale(0);
        }
        100% {
          transform: scale(1);
        }
      }
      @keyframes lds-ellipsis3 {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(0);
        }
      }
      @keyframes lds-ellipsis2 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(24px, 0);
        }
      }
      
</style>
`;

const getMsgItem = (data)=>`
<div class="message ${data.isOwner ? "alter" : ""}">
<div class="message-head">
    <img class="avatar" src=${data.user.image} alt="Avatar">
    <p class=username>${data.isOwner ? "You" : data.user.name}</p>
    
</div>
<div class="message-body">
    <p class="timeAgo" datetime=${data.date}>${data.timeAgoStr}</p>
    <p class="text-msg">${data.msg}</p>
</div>
</div>
`;

// Shadow dom
class MessagesComponent extends HTMLElement {
	constructor() {
		super();

        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._messages = [];
        this.$container = this._shadowRoot.getElementById("msg-box");
        this.$typing = this._shadowRoot.querySelector(".typing");
        
    }

    _renderMessage() {
        this.$container.innerHTML = "";
        this._messages.forEach(msg=>{
            let msgItem = this._formatMsgHTML(msg)
            this.$container.innerHTML += msgItem;
        });
        this.scrollToBottom();
    }

    _formatMsgHTML(msg) {
        if(!msg.user.image) msg.user.image = defaultImage;
        msg.timeAgoStr = timeago.format(msg.date);
        return getMsgItem(msg);
    }

    
    set messages(value) {
        this._messages = value;
        this._renderMessage();
    }

    get messages() {
        return this._messages;
    }

    set appendMsg(msg) {
        this._messages.push(msg);
        let msgItem = this._formatMsgHTML(msg)
        this.$container.innerHTML += msgItem;
        this.scrollToBottom();
    }

    set appendMsgs(msg) {
        this._messages.push(...msg);
        let msgItem = msg.map(_=>this._formatMsgHTML(_)).join("\n");
        this.$container.innerHTML += msgItem;
        this.scrollToBottom();
    }

    set prependMsg(msg) {
        this._messages.unshift(msg);
        let msgItem = this._formatMsgHTML(msg)
        this.$container.innerHTML = msgItem + this.$container.innerHTML ;
        this.scrollToTop();
    }

    set prependMsgs(msg) {
        this._messages.unshift(...msg);

        let msgItems = msg.map(_ => this._formatMsgHTML(_)).join("\n");
        this.$container.innerHTML = msgItems + this.$container.innerHTML ;
        this.scrollToTop();
    }
    
    _updateTimeAgo() {
        this.interval = setInterval(() => {
            Array.prototype.slice.call(this.$container.children).forEach(el=>{
                let timeAgoEl = el.children[1].children[0];
                let datetime = timeAgoEl.getAttribute("datetime");
                timeAgoEl.textContent = timeago.format(datetime);
            });
            
        }, 40*1000); // 40 secs
    }
    
    scrollToBottom() {
        this.$container.scrollIntoView(false);
    }

    scrollToTop() {
        this.$container.scrollIntoView(true);
    }

    showTyping(show=true) {
        this.$typing.style.display = show ? "inline-flex" : "none";
        if(show) {
            this.scrollToBottom();
        }
    }

	connectedCallback() {
        this._renderMessage();
        this._updateTimeAgo();
    }
    
    disconnectedCallback() {
        console.log('disconnected!');
        clearInterval(this.interval);
    }
    static get observedAttributes() {return ['append-msg', 'append-msgs', 'prepend-msg', 'prepend-msgs', "messages", "typing"]; }


	attributeChangedCallback(attr, oldValue, newValue) {
        if(attr === "append-msg") {
            let msg = JSON.parse(newValue);
            this.appendMsg = msg;
        }
        else if(attr === "append-msgs") {
            let msg = JSON.parse(newValue);
            this.appendMsgs = msg;
        }
        else if(attr === "messages"){
            let msg = JSON.parse(newValue);
            this.messages = msg;
        }
        else if(attr === "scroll-bottom") {
            this.scrollToBottom();
        }
        else if(attr === "prepend-msg") {
            let msg = JSON.parse(newValue);
            this.prependMsg = msg;
        }
        else if(attr === "prepend-msgs") {
            let msg = JSON.parse(newValue);
            this.prependMsgs = msg;
        }
        else if(attr === "typing") {
            let show = newValue === "true";
            this.showTyping(show);
        }
		this._renderMessage();
    }
    
}

window.customElements.define('msg-component', MessagesComponent);