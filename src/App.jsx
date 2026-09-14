import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [savingsGoal, setSavingsGoal] = useState(5000)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase.from('expenses').select('*').order('id', { ascending: false })
    if (error) console.log('Error fetching:', error)
    else setTransactions(data || [])
  }

  async function addTransaction(e) {
    e.preventDefault()
    if (!title || !amount) return

    const numericAmount = parseFloat(amount)
    const finalAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount)

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ title: title.trim(), amount: finalAmount }])
      .select()

    if (error) {
      console.log('Supabase Error Details:', error)
      alert('שגיאה בסופאבייס: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setTransactions(transactions.filter(item => item.id !== id))
    }
  }

  const totalIncome = transactions.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = transactions.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  const netBalance = totalIncome - totalExpense

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', textAlign: 'right', background: '#f8fafc', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '26px' }}>ניהול פיננסי חכם 🚀</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>עקוב אחר ההכנסות, ההוצאות ויעדי החיסכון שלך בקלות</p>
      </header>

      {/* כרטיסי סיכום */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '14px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>הכנסות</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>₪{totalIncome.toLocaleString()}</span>
        </div>
        <div style={{ background: 'white', padding: '14px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>הוצאות</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>₪{totalExpense.toLocaleString()}</span>
        </div>
        <div style={{ background: 'white', padding: '14px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'center', borderTop: `4px solid ${netBalance >= 0 ? '#3b82f6' : '#f59e0b'}` }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>מאזן נקי</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: netBalance >= 0 ? '#3b82f6' : '#f59e0b' }}>₪{netBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* אזור יעד חיסכון */}
      <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', padding: '18px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>🎯 יעד חיסכון חזוי</span>
          <input
            type="number"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(Number(e.target.value))}
            style={{ width: '90px', padding: '4px 8px', borderRadius: '6px', border: 'none', fontWeight: 'bold', textAlign: 'center' }}
          />
        </div>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
          {netBalance > 0 
            ? `בקצב הנוכחי, אתה בדרך ליעד של ₪${savingsGoal.toLocaleString()}!`
            : 'הגדל את ההכנסות או צמצם הוצאות כדי להתחיל לצבור חיסכון ליעד שלך.'}
        </p>
      </div>

      {/* טופס הוספה */}
      <form onSubmit={addTransaction} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={() => setType('expense')}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: type === 'expense' ? '#ef4444' : '#f1f5f9', color: type === 'expense' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
          >
            הוצאה 📉
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: type === 'income' ? '#10b981' : '#f1f5f9', color: type === 'income' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
          >
            הכנסה 📈
          </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>תיאור:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'expense' ? 'למשל: סופר, דלק, שכירות...' : 'למשל: משכורת, מתנה...'}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>סכום (₪):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', background: type === 'expense' ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
          {type === 'expense' ? 'הוסף הוצאה' : 'הוסף הכנסה'}
        </button>
      </form>

      {/* רשימת תנועות */}
      <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '12px' }}>התנועות האחרונות שלך:</h3>
      {transactions.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>אין עדיין תנועות במערכת. הוסף את הראשונה מעל! 🚀</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {transactions.map((item) => {
            const isIncome = Number(item.amount) > 0
            return (
              <li key={item.id} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', marginBottom: '8px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500', color: '#334155' }}>{item.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: isIncome ? '#10b981' : '#ef4444' }}>
                    {isIncome ? `+₪${item.amount}` : `₪${item.amount}`}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(item.id)}
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}
                    title="מחק"
                  >
                    ×
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
