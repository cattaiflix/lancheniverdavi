import { useState, useEffect } from 'react'
import OrderForm from './OrderForm.jsx'
import Reports from './Reports.jsx'
import { listenOrders } from './firebase.js'

export default function App() {
  const [tab, setTab] = useState('pedido')
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const unsubscribe = listenOrders((list) => setOrders(list))
    return () => unsubscribe()
  }, [])

  const navItems = [
    { id: 'pedido', label: '🍔 Fazer Pedido' },
    { id: 'relatorios', label: `📋 Relatórios${orders.length ? ` (${orders.length})` : ''}` },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── HEADER ── */}
      <header style={{
        background: 'rgba(4, 8, 20, 0.90)',
        borderBottom: '1px solid rgba(21,101,255,0.4)',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Title */}
          <div style={{ padding: '14px 0 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: '#C8F000', textTransform: 'uppercase', marginBottom: 2 }}>
              🎉 11 anos do Davi Cattai
            </div>
            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}>
              Pedidos de Lanche
            </h1>
          </div>

          {/* Tabs */}
          <nav style={{ display: 'flex', gap: 4, borderTop: '1px solid rgba(21,101,255,0.25)', marginTop: 6 }}>
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                style={{
                  padding: '11px 20px',
                  borderRadius: 0,
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === n.id ? '2.5px solid #C8F000' : '2.5px solid transparent',
                  color: tab === n.id ? '#C8F000' : '#6A8AAA',
                  fontWeight: tab === n.id ? 600 : 400,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  cursor: 'pointer',
                  marginBottom: -1,
                  transition: 'all 0.15s',
                }}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{ paddingTop: 28 }}>
        {tab === 'pedido'
          ? <OrderForm orders={orders} />
          : <Reports orders={orders} />
        }
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: 'rgba(100,140,180,0.7)',
        fontSize: 12,
        borderTop: '1px solid rgba(21,101,255,0.2)',
        background: 'rgba(4,8,20,0.6)',
        backdropFilter: 'blur(8px)',
      }}>
        🟢 Sincronizado em tempo real • Firebase
      </footer>
    </div>
  )
}
