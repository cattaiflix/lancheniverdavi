import { useState } from 'react'
import { RESTAURANTS, CUSTOMIZATIONS, generateId } from './data.js'
import { addOrder } from './firebase.js'

const card = {
  background: 'rgba(10, 18, 35, 0.88)',
  borderRadius: 18,
  padding: '24px 20px',
  border: '1px solid rgba(21,101,255,0.35)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  marginBottom: 16,
}

const label = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: '#C8F000', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.12em',
}

const errStyle = { color: '#FF5A5A', fontSize: 12, marginTop: 4 }

export default function OrderForm({ orders }) {
  const [name, setName] = useState('')
  const [restaurant, setRestaurant] = useState('')
  const [item, setItem] = useState('')
  const [customs, setCustoms] = useState([])
  const [obs, setObs] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const rest = RESTAURANTS[restaurant]

  const alreadyOrdered = name.trim().length > 2
    ? orders.find(o => o.name.toLowerCase() === name.trim().toLowerCase())
    : null

  function toggleCustom(id) {
    if (id === 'original') { setCustoms(['original']); return }
    setCustoms(prev => {
      const without = prev.filter(c => c !== 'original')
      return without.includes(id) ? without.filter(c => c !== id) : [...without, id]
    })
  }

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Informe seu nome'
    if (!restaurant) e.restaurant = 'Escolha o restaurante'
    if (!item) e.item = 'Escolha o lanche'
    if (!customs.length) e.customs = 'Escolha pelo menos uma opção'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await addOrder({ id: generateId(), name: name.trim(), restaurant, item, customs, obs: obs.trim(), createdAt: new Date().toISOString() })
      setName(''); setRestaurant(''); setItem(''); setCustoms([]); setObs(''); setErrors({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3500)
    } catch (err) {
      alert('Erro ao salvar. Verifique sua conexão.')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 16px 60px' }}>
      <form onSubmit={submit}>

        {/* Nome + Restaurante */}
        <div style={card}>
          <div style={{ marginBottom: 18 }}>
            <label style={label}>Seu nome *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Como quer que apareça na etiqueta?"
              style={errors.name ? { borderColor: '#FF5A5A' } : {}} />
            {errors.name && <p style={errStyle}>{errors.name}</p>}
            {alreadyOrdered && (
              <p style={{ fontSize: 13, color: '#FFC72C', marginTop: 6 }}>
                ⚠️ {alreadyOrdered.name} já pediu: <strong>{alreadyOrdered.item}</strong>
              </p>
            )}
          </div>

          <label style={label}>Restaurante *</label>
          {errors.restaurant && <p style={{ ...errStyle, marginBottom: 6 }}>{errors.restaurant}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Object.values(RESTAURANTS).map(r => (
              <button key={r.id} type="button"
                onClick={() => { setRestaurant(r.id); setItem('') }}
                style={{
                  padding: '16px 10px',
                  borderRadius: 14,
                  border: restaurant === r.id ? `2px solid ${r.color}` : '1.5px solid rgba(21,101,255,0.3)',
                  background: restaurant === r.id ? `${r.color}22` : 'rgba(255,255,255,0.04)',
                  color: restaurant === r.id ? r.color : '#6A8AAA',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700, fontSize: 15,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                <span style={{ fontSize: 30 }}>{r.emoji}</span>
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lanche + Personalização */}
        {restaurant && (
          <div style={card}>
            <div style={{ marginBottom: 18 }}>
              <label style={label}>Lanche *</label>
              <select value={item} onChange={e => setItem(e.target.value)}
                style={errors.item ? { borderColor: '#FF5A5A' } : {}}>
                <option value="">Selecione...</option>
                {rest.items.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              {errors.item && <p style={errStyle}>{errors.item}</p>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={label}>Como quer o lanche? *</label>
              {errors.customs && <p style={{ ...errStyle, marginBottom: 6 }}>{errors.customs}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {CUSTOMIZATIONS.map(c => {
                  const checked = customs.includes(c.id)
                  return (
                    <div key={c.id} onClick={() => toggleCustom(c.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                        border: checked ? '1.5px solid #C8F000' : '1.5px solid rgba(21,101,255,0.25)',
                        background: checked ? 'rgba(200,240,0,0.08)' : 'rgba(255,255,255,0.03)',
                        fontSize: 13, color: checked ? '#C8F000' : '#9BB0CC',
                        transition: 'all 0.12s',
                      }}>
                      <span style={{
                        width: 15, height: 15, borderRadius: 4, flexShrink: 0,
                        border: checked ? '2px solid #C8F000' : '2px solid #3A5070',
                        background: checked ? '#C8F000' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {checked && <span style={{ color: '#060A10', fontSize: 10, fontWeight: 900 }}>✓</span>}
                      </span>
                      {c.label}
                    </div>
                  )
                })}
              </div>
            </div>

            {(customs.includes('personalizado') || customs.includes('sem_alface') || customs.includes('sem_tomate') || customs.includes('sem_maionese')) && (
              <div>
                <label style={label}>Observações</label>
                <textarea value={obs} onChange={e => setObs(e.target.value)}
                  placeholder="Ex: sem sal, pão bem tostado..." rows={2}
                  style={{ resize: 'vertical' }} />
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '15px',
          borderRadius: 14,
          background: rest ? rest.color : 'rgba(21,101,255,0.5)',
          color: '#fff',
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16,
          letterSpacing: '0.03em',
          border: 'none',
          boxShadow: rest ? `0 0 24px ${rest.color}55` : 'none',
          transition: 'all 0.2s',
        }}>
          {loading ? 'Salvando...' : '🎉 Confirmar Pedido'}
        </button>

        {success && (
          <div style={{
            marginTop: 14, padding: '14px 18px', borderRadius: 12,
            background: 'rgba(200,240,0,0.1)', border: '1.5px solid rgba(200,240,0,0.4)',
            color: '#C8F000', fontWeight: 600, fontSize: 15, textAlign: 'center',
          }}>
            ✅ Pedido registrado! Todos já podem ver.
          </div>
        )}
      </form>
    </div>
  )
}
