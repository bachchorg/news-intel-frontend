'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { sessionsApi } from '@/lib/api/sessions';
import { CrawlSession } from '@/types/session';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Plus, Trash2, ExternalLink, Pencil } from 'lucide-react';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<CrawlSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionsApi.list().then(setSessions).finally(() => setLoading(false));
  }, []);

  async function deleteSession(id: string) {
    if (!confirm('Delete this session and all its articles?')) return;
    await sessionsApi.delete(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  const STATE_COLORS: Record<string, string> = {
    Idle: 'bg-gray-100 text-gray-600',
    Live: 'bg-green-100 text-green-700',
    Backfilling: 'bg-blue-100 text-blue-700',
    Paused: 'bg-yellow-100 text-yellow-700',
    Stopped: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
            <Link href="/sessions/new">
              <Button><Plus size={16} className="mr-2" /> New Session</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Spinner className="w-8 h-8" /></div>
          ) : sessions.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-gray-500 mb-4">No sessions yet.</p>
                <Link href="/sessions/new">
                  <Button>Create your first session</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardBody className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{session.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATE_COLORS[session.state] ?? ''}`}>
                          {session.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>Created {formatDate(session.createdAt)}</span>
                        <span>{session.keywords.map((k) => k.term).join(', ')}</span>
                        <span>{session.sources.map((s) => s.sourceName).join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard?session=${session.id}`}>
                        <Button size="sm" variant="secondary">
                          <ExternalLink size={14} className="mr-1" /> Open
                        </Button>
                      </Link>
                      <Link href={`/sessions/${session.id}/edit`}>
                        <Button size="sm" variant="secondary">
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                      </Link>
                      <Button size="sm" variant="danger" onClick={() => deleteSession(session.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
