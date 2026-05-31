import { useRef } from 'react'
import { RESTAURANTS, getCustomLabel } from './data.js'
import { deleteOrder } from './firebase.js'

function formatDate(iso) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const card = {
  background: 'rgba(10, 18, 35, 0.88)',
  borderRadius: 16,
  padding: '16px 18px',
  border: '1px solid rgba(21,101,255,0.3)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

const sectionTitle = {
  fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16,
  color: '#C8F000', textTransform: 'uppercase', letterSpacing: '0.1em',
  marginBottom: 16, paddingBottom: 8,
  borderBottom: '1px solid rgba(200,240,0,0.2)',
}

function printDiv(ref, title) {
  const content = ref.current?.innerHTML
  const win = window.open('', '_blank')
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/><title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'DM Sans', sans-serif; background: #fff; color: #111; padding: 24px; }
      h1,h2,h3 { font-family: 'Syne', sans-serif; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      th { padding: 8px 12px; text-align: left; font-size: 12px; color: #fff; }
      td { padding: 8px 12px; border-bottom: 1px solid #EEE; font-size: 13px; vertical-align: top; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .card { border: 1.5px solid #DDD; border-radius: 10px; padding: 12px 14px; page-break-inside: avoid; background: #fff; }
      .tag { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 6px; }
      .summary { background: #F5F5F5; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 13px; }
    </style>
  </head><body>${content}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 600)
}

function PersonCard({ order }) {
  const rest = RESTAURANTS[order.restaurant]
  return (
    <div style={{ ...card, marginBottom: 0 }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 8 }}>
        👤 {order.name}
      </div>
      <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, background: rest.color + '30', color: rest.color, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
        {rest.emoji} {rest.name}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#E0EEFF', marginBottom: 4 }}>{order.item}</div>
      <div style={{ fontSize: 12, color: '#7A9ABA' }}>{getCustomLabel(order.customs, order.obs)}</div>
      {order.obs && <div style={{ fontSize: 11, marginTop: 4, color: '#506070', fontStyle: 'italic' }}>Obs: {order.obs}</div>}
      <div style={{ fontSize: 11, color: '#304050', marginTop: 8 }}>{formatDate(order.createdAt)}</div>
    </div>
  )
}

export default function Reports({ orders }) {
  const personRef = useRef()
  const restRef = useRef()

  async function handleDelete(fbKey) {
    if (!confirm('Remover este pedido?')) return
    await deleteOrder(fbKey)
  }

  if (!orders.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#4A6080' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
        <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: '#6A8AAA' }}>Nenhum pedido ainda.</p>
        <p style={{ fontSize: 14, marginTop: 4 }}>Seja o primeiro!</p>
      </div>
    )
  }

  const byRestaurant = Object.values(RESTAURANTS).map(r => ({
    ...r, orders: orders.filter(o => o.restaurant === r.id),
  })).filter(r => r.orders.length > 0)

  const btnStyle = (color) => ({
    padding: '9px 18px', borderRadius: 10,
    background: color, color: '#fff',
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
    border: 'none', cursor: 'pointer',
  })

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 16px 60px' }}>

      {/* ── POR PESSOA ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={sectionTitle}>🏷️ Por Pessoa — Etiquetas de Entrega</div>
          <button style={btnStyle('#1565FF')} onClick={() => printDiv(personRef, 'Etiquetas por Pessoa')}>🖨️ Imprimir Etiquetas</button>
        </div>
        <div ref={personRef}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'Syne', fontSize: 18 }}>🎉 Aniversário Davi Cattai — Etiquetas</h2>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{orders.length} pedido(s) • {new Date().toLocaleString('pt-BR')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 12 }} className="grid">
            {orders.map(o => <PersonCard key={o.fbKey || o.id} order={o} />)}
          </div>
        </div>
      </div>

      {/* ── PARA O RESTAURANTE ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={sectionTitle}>📋 Para o Restaurante — Pedido Total</div>
          <button style={btnStyle('#1B4D2E')} onClick={() => printDiv(restRef, 'Pedido para Restaurante')}>🖨️ Imprimir Pedido</button>
        </div>
        <div ref={restRef}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Syne', fontSize: 18 }}>🎉 Aniversário Davi Cattai — Pedidos</h2>
            <p style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{orders.length} pedido(s) • {new Date().toLocaleString('pt-BR')}</p>
          </div>
          {byRestaurant.map(rest => (
            <div key={rest.id} style={{ marginBottom: 28 }}>
              <div style={{
                fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: rest.color,
                borderBottom: `2px solid ${rest.color}55`, paddingBottom: 8, marginBottom: 12,
              }}>
                {rest.emoji} {rest.name} — {rest.orders.length} pedido(s)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(10,18,35,0.85)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(21,101,255,0.25)' }}>
                <thead>
                  <tr>
                    {['Lanche', 'Personalização', 'Nome'].map(h => (
                      <th key={h} style={{ background: rest.color, color: '#fff', padding: '9px 13px', textAlign: 'left', fontFamily: 'Syne', fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rest.orders.map(o => (
                    <tr key={o.fbKey || o.id} style={{ borderBottom: '1px solid rgba(21,101,255,0.15)' }}>
                      <td style={{ padding: '9px 13px', fontWeight: 600, color: '#E0EEFF', fontSize: 13 }}>{o.item}</td>
                      <td style={{ padding: '9px 13px', color: '#7A9ABA', fontSize: 12 }}>{getCustomLabel(o.customs, o.obs)}</td>
                      <td style={{ padding: '9px 13px', color: '#C8F000', fontSize: 13, fontWeight: 600 }}>{o.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 10, background: rest.color + '18', borderRadius: 10, padding: '10px 14px', border: `1px solid ${rest.color}33` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: rest.color }}>Resumo:</span>
                {[...new Set(rest.orders.map(o => o.item))].map(item => {
                  const count = rest.orders.filter(o => o.item === item).length
                  return <div key={item} style={{ fontSize: 13, marginTop: 3, color: '#C0D8F0' }}>• {item}: <strong style={{ color: '#fff' }}>{count}x</strong></div>
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TODOS ── */}
      <div>
        <div style={{ ...sectionTitle, marginBottom: 12 }}>🗂️ Todos os Pedidos ({orders.length})</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(10,18,35,0.85)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(21,101,255,0.25)' }}>
            <thead>
              <tr>
                {['Nome','Restaurante','Lanche','Personalização','Horário',''].map(h => (
                  <th key={h} style={{ background: '#0D1A30', color: '#6A8AAA', padding: '9px 12px', textAlign: 'left', fontFamily: 'Syne', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const rest = RESTAURANTS[o.restaurant]
                return (
                  <tr key={o.fbKey || o.id} style={{ borderBottom: '1px solid rgba(21,101,255,0.12)' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 600, color: '#fff', fontSize: 13 }}>{o.name}</td>
                    <td style={{ padding: '9px 12px', color: rest.color, fontWeight: 700, fontSize: 13 }}>{rest.emoji} {rest.name}</td>
                    <td style={{ padding: '9px 12px', color: '#C0D8F0', fontSize: 13 }}>{o.item}</td>
                    <td style={{ padding: '9px 12px', color: '#6A8AAA', fontSize: 12 }}>{getCustomLabel(o.customs, o.obs)}</td>
                    <td style={{ padding: '9px 12px', color: '#3A5A70', fontSize: 11, whiteSpace: 'nowrap' }}>{formatDate(o.createdAt)}</td>
                    <td style={{ padding: '9px 12px' }}>
                      <button onClick={() => handleDelete(o.fbKey)} style={{ color: '#FF5A5A', background: 'none', fontSize: 17, padding: 0, border: 'none', cursor: 'pointer' }} title="Remover">🗑️</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
