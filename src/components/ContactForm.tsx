import { useState, type FormEvent } from 'react';

export default function ContactForm({ supabaseUrl, supabaseKey }: { supabaseUrl: string; supabaseKey: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', enquiry_type: 'Property management enquiry', message: '' });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setStatus('sending');
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Prefer: 'return=minimal' },
        body: JSON.stringify({ ...form, site: 'propertymanagementgibraltar.com', source: 'contact-form' }),
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', phone: '', enquiry_type: 'Property management enquiry', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };
  if (status === 'success') return (
    <div className="text-center py-10">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">✓</div>
      <h3 className="font-bold text-xl mb-1">Message Sent!</h3>
      <p className="text-stone-500">We'll be in touch within 24 hours.</p>
      <button onClick={() => setStatus('idle')} className="btn-secondary mt-4 text-sm">Send another</button>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
        <div><label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" /></div>
      </div>
      <div><label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
        <select value={form.enquiry_type} onChange={e => setForm({...form, enquiry_type: e.target.value})} className="input-field">
          <option>Property management enquiry</option><option>Tenant finding</option><option>Maintenance issue</option><option>General question</option>
        </select></div>
      <div><label className="block text-sm font-medium text-stone-700 mb-1">Message *</label>
        <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field resize-none" /></div>
      {status === 'error' && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">Error. Please try again.</div>}
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-50">{status === 'sending' ? 'Sending...' : 'Send Message'}</button>
    </form>
  );
}
