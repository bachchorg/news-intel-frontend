'use client';

import { use } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { EditSessionForm } from '@/components/session/EditSessionForm';

export default function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Session</h1>
        <EditSessionForm sessionId={id} />
      </div>
    </div>
  );
}
