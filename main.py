# main.py

import traceback
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import ChatBot


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

chatbot = ChatBot()


@app.route("/")
def home():
    return render_template("index.html")




@app.route("/chat", methods=["POST"])
def chat():
    if request.method == "POST":
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "Invalid JSON data"}), 400

            message = data.get("message")
            if not message:
                return jsonify({"error": "Message cannot be empty"}), 400

            response_data = chatbot.generate_chat(message)
            response ={"responses": response_data}
            return jsonify(response)
        except Exception:
            return jsonify({"error": "Something went wrong: "}), 500
    else:

        return jsonify({"error": "Method not allowed"}), 405


if __name__ == "__main__":
    app.run(debug=True)
