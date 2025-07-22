export default function ChatbotButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
      >
        💬
      </button>
    );
  }
  