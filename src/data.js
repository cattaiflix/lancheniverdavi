// ── MENUS ─────────────────────────────────────────────────────────────────────

export const RESTAURANTS = {
  mcdonalds: {
    id: 'mcdonalds',
    name: "McDonald's",
    color: '#DA291C',
    accent: '#FFC72C',
    emoji: '🍔',
    categories: [
      {
        label: '🥩 Carne Bovina — Clássicos',
        items: [
          'Big Mac',
          'Cheddar McMelt',
          'Duplo Cheddar McMelt',
          'Quarterão com Queijo',
          'Duplo Quarterão',
          'McNífico Bacon',
          'Duplo Burger Bacon',
          'Triplo Burger',
          'Duplo Cheeseburger',
          'Cheeseburger',
          'Hamburguer',
        ],
      },
      {
        label: '🌍 Seleções do Méqui — Duplo (Copa 2026)',
        items: [
          'Brasil (duplo)',
          'Espanha (duplo)',
          'Argentina (duplo)',
          'Alemanha (duplo)',
          'EUA (duplo)',
          'Itália (polpettone)',
        ],
      },
      {
        label: '🌍 Seleções do Méqui — Simples (Copa 2026)',
        items: [
          'Brasil - 01 Carne',
          'Espanha - 01 Carne',
          'Argentina - 01 Carne',
          'Alemanha - 01 Carne',
          'EUA - 01 Carne',
        ],
      },
      {
        label: '🍗 Frango',
        items: [
          'McChicken',
          'McChicken Bacon',
          'McChicken Duplo',
          'McCrispy Chicken Legend',
          'McCrispy Chicken Bacon Ranch',
          'McCrispy Chicken Deluxe',
          'Chicken Jr.',
          'México (frango, nacho, molho jalapeño) — Seleções do Méqui',
        ],
      },
    ],
  },
  madero: {
    id: 'madero',
    name: 'Madero',
    color: '#1B4D2E',
    accent: '#C8A951',
    emoji: '🥩',
    categories: [
      {
        label: '🍔 Madero (180g)',
        items: [
          'Madero',
          'Madero Bacon',
          'Madero Super',
          'Madero Bacon Super',
        ],
      },
      {
        label: '🍔 Junior (130g)',
        items: [
          'Junior',
          'Junior Bacon',
          'Junior Super',
          'Junior Bacon Super',
        ],
      },
      {
        label: '🍔 Cordeiro (180g)',
        items: [
          'Cordeiro',
          'Cordeiro Bacon',
          'Cordeiro Super',
        ],
      },
    ],
  },
}

// Achata todas as categorias em lista plana (para compatibilidade)
export function getItemsByRestaurant(restaurantId) {
  const rest = RESTAURANTS[restaurantId]
  if (!rest) return []
  return rest.categories.flatMap(cat => cat.items)
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
  { id: 'sem_bacon', label: 'Sem bacon' },
  { id: 'pao_carne_queijo', label: 'Só pão, carne e queijo' },
  { id: 'personalizado', label: 'Personalizado (ver obs.)' },
]

// ── STORAGE / UTILS ────────────────────────────────────────────────────────────

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function getCustomLabel(customIds = [], obs = '') {
  if (!customIds.length) return 'Original'
  const labels = customIds.map(id => CUSTOMIZATIONS.find(c => c.id === id)?.label || id)
  if (obs && customIds.includes('personalizado')) return labels.join(', ') + `: ${obs}`
  return labels.join(', ')
}
