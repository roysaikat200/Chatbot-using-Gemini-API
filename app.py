from flask import Flask, render_template, request, jsonify, Response
from chatbot import Gemini

app = Flask(__name__)

# Initialize the Gemini chatbot
chatbot = Gemini()

@app.route("/")
def index():
    """Serve the chat UI."""
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    """Handle chat requests and return AI responses."""
    user_message = request.json.get("message", "")
    if not user_message:
        return jsonify({"response": "⚠️ Please enter a valid message."})
    
    ai_response = chatbot.generate(user_message)
    return jsonify({"response": ai_response})

if __name__ == "__main__":
    app.run(debug=True)
