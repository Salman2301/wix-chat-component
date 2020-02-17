// time ago 
import("https://unpkg.com/timeago.js@4.0.2/dist/timeago.min.js")



const defaultImage = "https://static.wixstatic.com/media/46e3aa_0fe6d740591a4f589692d326953b7bde~mv2.png";

const template = document.createElement('template');
template.innerHTML = `
<div class="container" id="msg-box">
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
    }
    .message:hover .timeAgo {
        visibility: visible;
    }
    .message-head {
        text-align: center;
        width: 15%;
        margin: 10px;
    }
    .message-body {
        padding: 0px 10px;
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
        font-size: 1.2em;
    }

    .timeAgo {
        color: #ccc;
        margin: 0px;
        visibility: hidden;
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
        padding:0.2rem;
    }

    .avatar {
        border-radius: 50%;
        /* position: relative; */
        width: 35px;
        height: 35px;
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
`
class MessagesComponent extends HTMLElement {
	constructor() {
		super();

        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._messages = [];
        this.$container = this._shadowRoot.getElementById("msg-box");

    }

    _renderMessage() {
        this.$container.innerHTML = "";
        this._messages.forEach(msg=>{
            let msgItem = this._formatMsgHTML(msg)
            this.$container.innerHTML += msgItem;
        });
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
    
    _updateTimeAgo() {
        this.interval = setInterval(() => {
            Array.prototype.slice.call(this.$container.children).forEach(el=>{
                let timeAgoEl = el.children[1].children[0];
                let datetime = timeAgoEl.getAttribute("datetime");
                timeAgoEl.textContent = timeago.format(datetime);
            });
            
        }, 2*60*1000); // 2 mins
    }
    
    scrollToBottom() {
        this.$container.scrollTop = this.$container.scrollHeight;
    }

	connectedCallback() {
        this._renderMessage();
        this._updateTimeAgo();
    }
    
    disconnectedCallback() {
        console.log('disconnected!');
        clearInterval(this.interval);
    }

	attributeChangedCallback(name, oldValue, newValue) {
		this._renderMessage();
	}
}

window.customElements.define('msg-component', MessagesComponent);