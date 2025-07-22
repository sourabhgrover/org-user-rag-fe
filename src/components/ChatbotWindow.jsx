import { useState } from 'react';
import { useSelector } from 'react-redux';
//import apiClient from '../utils/apiConfig';
import axios from 'axios';

export default function ChatbotWindow() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [responseLoading, setReponseLoading] = useState(false);
    const { organizationId } = useSelector(state => state.auth?.user);
    const sendMessage = async () => {
        if (input.trim()) {

            // if (!query) return alert("Please enter a query");
            const formData = new FormData();
            formData.append("query", input);
            formData.append("orgId", organizationId);
            setMessages(prev => [...prev, { text: input, sender: 'user' }]);
            try {
                setReponseLoading(true);
                const response = await axios.post("http://localhost:8000/query", formData);
                setMessages(prev => [...prev, { text: response.data.answer, sender: 'response' }]);
                setInput('');
            } catch (error) {
                console.error("Query failed", error);
                alert("Failed to get answer");
            } finally {
                setReponseLoading(false);
            }




            // setMessages([...messages, { text: input, sender: 'user' }]);
            // You can integrate bot response here
        }
    };

    return (
        <div className="fixed bottom-24 right-6 w-[30%] bg-white rounded-xl shadow-lg flex flex-col">
            {/* <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
                <span>Ziva Chatbot</span>
                <button onClick={onClose}>✖</button>
            </div> */}

            <div className="m-8 text-[2rem] font-semibold mx-auto">Your Chatbot</div>
            <div className="flex-1 p-2 max-h-[35rem] mb-4">
                <div className='border-2 rounded-lg p-4 mx-16'>Hi, this is our virtual assistant!
                    Tell us how we can help.
                    GoDaddy does not accept or ask for payment data over chat.  Do not include any payment card information or payment details in this chat.</div>
                <div className="overflow-y-auto max-h-[15rem]  ">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} my-6`}
                        >
                            <div
                                className={`p-2 rounded-lg max-w-[70%] ${msg.sender === 'user'
                                        ? 'bg-blue-200 text-right'
                                        : 'bg-gray-100 text-left'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col p-2 border-t mx-4">
                {responseLoading && <div className='text-[0.6rem] pb-2 text-gray-500 italic'>Typing...</div>}
                <div className='flex'>
                    <input
                        className="flex-1 border border-gray-300 rounded px-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
