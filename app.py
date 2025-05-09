from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Khởi tạo OpenAI client
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')

        # Gọi OpenAI API
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Bạn là một trợ lý AI thân thiện và hữu ích. Hãy trả lời bằng tiếng Việt."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7,
            max_tokens=500
        )

        # Trả về phản hồi
        return jsonify({
            "response": completion.choices[0].message.content
        })

    except Exception as e:
        print('Error:', str(e))
        return jsonify({
            "error": "Có lỗi xảy ra khi xử lý yêu cầu của bạn"
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(debug=True, port=port) 