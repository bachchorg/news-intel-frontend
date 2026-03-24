import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';

export const metadata = {
  title: 'Trợ lý Viết Báo AI | DashboardCuaSepTy',
  description: 'AI chatbot hỗ trợ viết báo chuyên nghiệp',
};

export default function ChatPage() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
