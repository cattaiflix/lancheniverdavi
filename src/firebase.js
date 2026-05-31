// ─── CONFIGURAÇÃO FIREBASE ───────────────────────────────────────────────────
// Substitua os valores abaixo com os do seu projeto Firebase
// (veja o README para o passo a passo de como obter esses valores)

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, remove } from 'firebase/database'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FB_API_KEY,
  authDomain:        import.meta.env.VITE_FB_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FB_DATABASE_URL,
  projectId:         import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FB_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db  = getDatabase(app)
const pedidosRef = ref(db, 'pedidos')

// Adiciona um pedido ao Firebase
export function addOrder(order) {
  return push(pedidosRef, order)
}

// Escuta em tempo real — chama callback toda vez que algo mudar
export function listenOrders(callback) {
  return onValue(pedidosRef, snapshot => {
    const data = snapshot.val()
    if (!data) { callback([]); return }
    const list = Object.entries(data).map(([fbKey, val]) => ({ ...val, fbKey }))
    list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    callback(list)
  })
}

// Remove um pedido pelo fbKey
export function deleteOrder(fbKey) {
  return remove(ref(db, `pedidos/${fbKey}`))
}
