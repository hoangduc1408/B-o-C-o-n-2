// Đóng cửa sổ chat
document.getElementById('closeBtn').onclick = function() {
  document.getElementById('chatbot').style.display = 'none';
};

// Gửi tin nhắn
const userInput = document.getElementById('userInput');
const chatBody = document.getElementById('chatBody');
const sendBtn = document.getElementById('sendBtn');

// Lấy các phần tử DOM
const closeBtn = document.getElementById('closeBtn');
const emojiBtn = document.getElementById('emojiBtn');
const attachBtn = document.getElementById('attachBtn');

// Mảng chứa các câu trả lời mẫu
const responses = {
    'hello': 'Xin chào! Tôi có thể giúp gì cho bạn?',
    'hi': 'Chào bạn! Bạn cần tôi giúp đỡ gì không?',
    'help': 'Tôi có thể giúp bạn tìm kiếm thông tin, trả lời câu hỏi hoặc hỗ trợ các vấn đề khác.',
    'bye': 'Tạm biệt bạn! Hẹn gặp lại!',
    'cảm ơn': 'Không có gì đâu bạn! Nếu cần gì thêm cứ hỏi nhé!',
    'tạm biệt': 'Tạm biệt bạn! Chúc bạn một ngày tốt lành!',
    'chào': 'Chào bạn! Rất vui được gặp bạn!',
    'xin chào': 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
    'giúp': 'Tôi có thể giúp bạn:\n- Tìm kiếm thông tin\n- Trả lời câu hỏi\n- Hỗ trợ kỹ thuật\n- Tư vấn sản phẩm',
    'default': 'Để tôi suy nghĩ một chút...'
};

// Hàm thêm tin nhắn vào khung chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-msg ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = message;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Hàm gọi API OpenAI thông qua backend
async function getAIResponse(message) {
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Lỗi kết nối đến server');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return 'Xin lỗi, tôi đang gặp một số vấn đề kỹ thuật. Bạn có thể thử lại sau không?';
    }
}

// Hàm xử lý phản hồi
async function getResponse(message) {
    message = message.toLowerCase().trim();
    
    // Kiểm tra các câu trả lời đơn giản trước
    for (let key in responses) {
        if (message.includes(key)) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(responses[key]);
                }, Math.random() * 1000 + 500);
            });
        }
    }
    
    // Nếu không có câu trả lời đơn giản, sử dụng OpenAI
    return await getAIResponse(message);
}

// Hàm xử lý gửi tin nhắn
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (message) {
        // Hiển thị tin nhắn của người dùng
        addMessage(message, true);
        userInput.value = '';
        
        // Hiển thị dấu "đang nhập..."
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-msg bot typing';
        typingDiv.textContent = 'Đang nhập...';
        chatBody.appendChild(typingDiv);
        
        try {
            // Lấy và hiển thị phản hồi
            const response = await getResponse(message);
            chatBody.removeChild(typingDiv);
            addMessage(response);
        } catch (error) {
            chatBody.removeChild(typingDiv);
            addMessage('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    }
}

// Xử lý sự kiện gửi tin nhắn
sendBtn.addEventListener('click', handleSendMessage);

// Xử lý sự kiện nhấn Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

// Xử lý nút đóng chat
closeBtn.addEventListener('click', () => {
    document.getElementById('chatbot').style.display = 'none';
});

// Chèn emoji
emojiBtn.addEventListener('click', () => {
    userInput.value += '😊';
    userInput.focus();
});

// Đính kèm tệp (demo)
attachBtn.addEventListener('click', () => {
    alert('Tính năng đính kèm tệp đang được phát triển!');
});