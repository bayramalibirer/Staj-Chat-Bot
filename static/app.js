class Chatbox {
    constructor() {
        this.args = {
            sendButton: document.querySelector('.send__button'),
            chatBox: document.querySelector('.chatbox__support')
        };
        this.state = false;
        this.messages = [];
        this.display();
    }

    display() {
        const { chatBox, sendButton } = this.args;
        sendButton.addEventListener('click', () => this.get_text_input(chatBox));
        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.get_text_input(chatBox);
            }
        });
    }

    async get_text_input(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        await this.onSendButton(text1, chatbox);
        textField.value = '';
    }

    async onSendButton(text1, chatbox) {
        if (text1 === "") {
            return;
        }
        let msg1 = { name: "", message: text1 };
        this.messages.push(msg1);

        try {
            let response = await fetch('/chat', {
                method: 'POST',
                body: JSON.stringify({ message: text1 }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            let data = await response.json();
            console.log(data);
            let msg2 = { name: "AI", message: data.responses.query };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
        } catch (error) {
            console.error('Error:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            this.updateChatText(chatbox);
        }
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "AI") {
                html += '<div class="messages__item messages__item--visitor">' + item.name+ " : "+ item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.name+ "  "+ item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;

        var element = document.querySelector('.chatbox__messages');
        element.scrollTop = element.scrollHeight;
    }
}

const chatbox = new Chatbox();
