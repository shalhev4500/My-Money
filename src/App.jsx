import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')

  // טעינת ההוצאות הראשונית מהמסד נתונים
  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    const { data, error } = await supabase.from('expenses').select('*').order('id', { ascending: false })
    if (error) console.log('Error fetching:', error)
    else setExpenses(data || [])
  }

  async function addExpense(e) {
    e.preventDefault()
    if (!title || !amount) return

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ title, amount: parseFloat(amount) }])
      .select()

    if (error) {
      console.log('Error adding expense:', error)
    } else {
      setExpenses([data[0], ...expenses])
      setTitle('')
      setAmount('')
    }
  }

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0)

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl', textAlign: 'right' }}>
      <h1 style={{ color: '#2563eb', textAlign: 'center' }}>ניהול הוצאות אישי</h1>

      {/* טופס הוספת הוצאה */}
      <form onSubmit={addExpense} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>שם ההוצאה:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="למשל: סופרמרקט, דלק..."
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>סכום (₪):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          הוסף הוצאה
        </button>
      </form>

      {/* סיכום הוצאות */}
      <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0369a1' }}>
        סך הכל הוצאות: ₪{totalAmount.toFixed(2)}
      </div>

      {/* רשימת ההוצאות */}
      <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>ההוצאות שלי:</h3>
      {expenses.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center' }}>אין עדיין הוצאות, זה הזמן להוסיף את הראשונה! 🚀</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {expenses.map((item) => (
            <li key={item.id} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px', marginBottom: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.title}</span>
              <span style={{ fontWeight: 'bold', color: '#dc2626' }}>₪{item.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
