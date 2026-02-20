import { useState, type FormEvent } from 'react';

interface QuoteFormProps { supabaseUrl: string; supabaseKey: string; }

const propertyTypes = ['Apartment', 'House', 'Townhouse', 'Commercial', 'Mixed-use'];
const services = ['Full management', 'Tenant finding only', 'Rent collection', 'Maintenance coordination', 'Legal & compliance', 'All of the above'];
const areas = ['Town Centre', 'South District', 'Westside', 'Europort', 'Ocean Village', 'Catalan Bay', 'Mid-Town', 'Upper Town', 'Other'];

export default function QuoteCalculator({ supabaseUrl, supabaseKey }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    property_type: '', num_properties: '1', area: '', services_needed: [] as string[],
    estimated_rent: '', current_situation: '', name: '', email: '', phone: '', message: '',
  });

  const toggleService = (s: string) => {
    setForm(prev => ({
      ...prev,
      services_needed: prev.services_needed.includes(s)
        ? prev.services_needed.filter(x => x !== s) : [...prev.services_needed, s],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setStatus('sending');
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/pm_leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Prefer: 'return=minimal' },
        body: JSON.stringify({
          ...form, num_properties: parseInt(form.num_properties) || 1,
          estimated_rent: form.estimated_rent ? parseFloat(form.estimated_rent) : null,
          services_needed: form.services_needed, site: 'propertymanagementgibraltar.com',
        }),
      });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  if (status === 'success') return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 className="font-bold text-2xl text-stone-900 mb-2">Quote Request Received!</h3>
      <p className="text-stone-500 max-w-md mx-auto">We'll review your details and get back to you within 24 hours with a tailored management proposal.</p>
    </div>
  );

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-400'}`}>{s}</div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-stone-900' : 'text-stone-400'}`}>
              {s === 1 ? 'Property' : s === 2 ? 'Services' : 'Contact'}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-emerald-700' : 'bg-stone-200'}`}/>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Property Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Property Type *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {propertyTypes.map(t => (
                  <button key={t} type="button" onClick={() => setForm({...form, property_type: t})}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${form.property_type === t ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Number of Properties</label>
                <input type="number" min="1" max="50" value={form.num_properties} onChange={e => setForm({...form, num_properties: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Area</label>
                <select value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="input-field">
                  <option value="">Select area</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Estimated Monthly Rent (£)</label>
              <input type="number" placeholder="e.g. 1500" value={form.estimated_rent} onChange={e => setForm({...form, estimated_rent: e.target.value})} className="input-field" />
            </div>
            <button type="button" onClick={() => setStep(2)} disabled={!form.property_type}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">Continue →</button>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">What services do you need? *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map(s => (
                  <button key={s} type="button" onClick={() => toggleService(s)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium text-left transition-all ${form.services_needed.includes(s) ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                    {form.services_needed.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Current Situation</label>
              <select value={form.current_situation} onChange={e => setForm({...form, current_situation: e.target.value})} className="input-field">
                <option value="">Select...</option>
                <option value="property-empty">Property is empty</option>
                <option value="tenant-in-place">Tenant already in place</option>
                <option value="switching-agent">Switching from another agent</option>
                <option value="new-purchase">Just purchased / purchasing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
              <button type="button" onClick={() => setStep(3)} disabled={form.services_needed.length === 0}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Your name" /></div>
              <div><label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="you@example.com" /></div>
            </div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+350 200 00000" /></div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1">Additional Notes</label>
              <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field resize-none" placeholder="Anything else we should know..." /></div>
            {status === 'error' && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">Something went wrong. Please try again.</div>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">← Back</button>
              <button type="submit" disabled={status === 'sending'} className="btn-gold flex-1 disabled:opacity-50">
                {status === 'sending' ? 'Submitting...' : 'Get My Free Quote'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
