import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display?: boolean;
  order?: number;
};

const AdminFaqs = () => {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<FaqItem>>({ question: '', answer: '', category: '', order: 0, display: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const apiBase = useMemo(() => import.meta.env.VITE_API_URL || '', []);

  const list = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${apiBase}/api/faqs`);
      if (!resp.ok) throw new Error('목록 조회 실패');
      const json = await resp.json();
      setItems(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류 발생');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { list(); }, []);

  const resetForm = () => {
    setForm({ question: '', answer: '', category: '', order: 0, display: true });
    setEditingId(null);
  };

  const submit = async () => {
    try {
      if (!form.question || !form.answer) return alert('질문/답변을 입력하세요');
      const payload = { ...form, order: Number(form.order) || 0 };
      const url = editingId ? `${apiBase}/api/faqs/${editingId}` : `${apiBase}/api/faqs`;
      const method = editingId ? 'PUT' : 'POST';
      const headers = { 'Content-Type': 'application/json' };
      let resp = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (!resp.ok && (resp.status === 403 || resp.status === 415 || resp.status === 405)) {
        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([k, v]) => formData.set(k, String(v ?? '')));
        resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() });
      }
      if (!resp.ok) throw new Error('저장 실패');
      await list();
      resetForm();
    } catch (e) {
      alert(e instanceof Error ? e.message : '오류 발생');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      const url = `${apiBase}/api/faqs/${id}`;
      let resp = await fetch(url, { method: 'DELETE' });
      if (!resp.ok && (resp.status === 403 || resp.status === 405)) {
        // fallback via POST if server blocks DELETE
        resp = await fetch(url, { method: 'POST' });
      }
      if (!resp.ok) throw new Error('삭제 실패');
      await list();
    } catch (e) {
      alert(e instanceof Error ? e.message : '오류 발생');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">FAQ 관리</h1>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>질문</Label>
              <Input value={form.question || ''} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} placeholder="질문 입력" />
            </div>
            <div>
              <Label>카테고리(선택)</Label>
              <Input value={form.category || ''} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="예: 결제, 예약" />
            </div>
            <div className="md:col-span-2">
              <Label>답변</Label>
              <Textarea value={form.answer || ''} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} rows={4} placeholder="답변 입력" />
            </div>
            <div>
              <Label>표시 순서</Label>
              <Input type="number" value={form.order ?? 0} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-2">
              <input id="display" type="checkbox" checked={form.display ?? true} onChange={(e) => setForm((p) => ({ ...p, display: e.target.checked }))} />
              <Label htmlFor="display">노출</Label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={submit}>{editingId ? '수정하기' : '등록하기'}</Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>취소</Button>
            )}
          </div>
        </Card>

        <Card className="p-6">
          {loading ? (
            <div>불러오는 중…</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : items.length === 0 ? (
            <div>등록된 항목이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">순서</th>
                    <th className="py-2">질문</th>
                    <th className="py-2">카테고리</th>
                    <th className="py-2">노출</th>
                    <th className="py-2 w-40">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b hover:bg-muted/30">
                      <td className="py-2">{it.order ?? 0}</td>
                      <td className="py-2 max-w-xl truncate" title={it.question}>{it.question}</td>
                      <td className="py-2">{it.category || '-'}</td>
                      <td className="py-2">{it.display === false ? '숨김' : '노출'}</td>
                      <td className="py-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(it.id); setForm({ question: it.question, answer: it.answer, category: it.category, order: it.order, display: it.display !== false }); }}>수정</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(it.id)}>삭제</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminFaqs;

