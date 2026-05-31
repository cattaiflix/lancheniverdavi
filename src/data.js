// ── MENUS ─────────────────────────────────────────────────────────────────────

export const RESTAURANTS = {
  mcdonalds: {
    id: 'mcdonalds',
    name: "McDonald's",
    color: '#DA291C',
    accent: '#FFC72C',
    emoji: '🍔',
    items: [
      'Big Mac',
      'Quarter Pounder com Queijo',
      'McDouble',
      'McChicken',
      'Filet-O-Fish',
      'McCrispy',
      'Chicken McBistro',
      'Combo Big Mac',
      'Combo Quarter Pounder',
      'Combo McChicken',
    ],
  },
  madero: {
    id: 'madero',
    name: 'Madero',
    color: '#1B4D2E',
    accent: '#C8A951',
    emoji: '🥩',
    items: [
      'Madero Burger',
      'Prime Burger',
      'Bacon Burger',
      'Egg Burger',
      'Mushroom Burger',
      'Double Madero',
      'Chicken Burger',
      'Veggie Burger',
      'Costela na Chapa',
      'Combo Madero Burger',
    ],
  },
}

export const CUSTOMIZATIONS = [
  { id: 'original', label: 'Original (sem alterações)' },
  { id: 'sem_molho', label: 'Sem molho' },
  { id: 'sem_cebola', label: 'Sem cebola' },
  { id: 'sem_ketchup', label: 'Sem ketchup' },
  { id: 'sem_pickles', label: 'Sem pickles' },
  { id: 'sem_alface', label: 'Sem alface' },
  { id: 'sem_tomate', label: 'Sem tomate' },
  { id: 'sem_maionese', label: 'Sem maionese' },
  { id: 'pao_carne_queijo', label: 'Só pão, carne e queijo' },
  { id: 'personalizado', label: 'Personalizado (ver obs.)' },
]

// ── STORAGE ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'aniversario_pedidos_v1'

export function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  // Notify other tabs
  try {
    const bc = new BroadcastChannel('pedidos_sync')
    bc.postMessage({ type: 'update', orders })
    bc.close()
  } catch {}
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function getCustomLabel(customIds = [], obs = '') {
  if (!customIds.length) return 'Original'
  const labels = customIds.map(id => CUSTOMIZATIONS.find(c => c.id === id)?.label || id)
  if (obs && customIds.includes('personalizado')) return labels.join(', ') + `: ${obs}`
  return labels.join(', ')
}
