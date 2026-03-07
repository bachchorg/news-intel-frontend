import { Sidebar } from '@/components/layout/Sidebar';
import { CreateSessionForm } from '@/components/session/CreateSessionForm';

export default function NewSessionPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Session</h1>
        <CreateSessionForm />
      </div>
    </div>
  );
}
