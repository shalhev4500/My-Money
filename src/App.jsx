import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

// קטגוריות מוגדרות מראש עם אייקונים וצבעים
const CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981' },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6' },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b' },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899' },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6' },
  'שונות': { icon: '📦', color: '#64748b' }
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [savingsGoal, setSavingsGoal] = useState(150000)
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(8000)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false })
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
      .insert([{ 
        title: title.trim(), 
        amount: finalAmount, 
        category: type === 'expense' ? category : 'הכנסה' 
      }])
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

  // חישובים פיננסיים
  const totalIncome = transactions.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = transactions.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  const netBalance = totalIncome - totalExpense

  // תקציב חודשי והתקדמות
  const budgetPercentage = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100)
  let budgetColor = '#10b981' // ירוק
  if (budgetPercentage > 75) budgetColor = '#f59e0b' // כתום
  if (budgetPercentage >= 100) budgetColor = '#ef4444' // אדום

  // תחזית מתמטית ליעד החיסכון
  function calculateGoalDate() {
    if (netBalance <= 0) return 'אין חיסכון חיובי כרגע לצורך תחזית'
    const monthsNeeded = Math.ceil(savingsGoal / netBalance)
    const targetDate = new Date()
    targetDate.setMonth(targetDate.getMonth() + monthsNeeded)
    return targetDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
  }

  // פילוח הוצאות לפי קטגוריות
  const expensesByCategory = Object.keys(CATEGORIES).map(cat => {
    const total = transactions
      .filter(t => t.category === cat && Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    return { name: cat, total, ...CATEGORIES[cat] }
  }).filter(cat => cat.total > 0)

  // ייצוא לאקסל (CSV)
  function exportToCSV() {
    const headers = "שתיקה/כותרת,סכום,קטגוריה,תאריך\n"
    const rows = transactions.map(t => `"${t.title}",${t.amount},"${t.category || 'כללי'}","${new Date(t.created_at || Date.now()).toLocaleDateString()}"`).join("\n")
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'my_finances.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // סינון תנועות לפי חיפוש
  const filteredTransactions = transactions.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.category && t.category.includes(searchTerm)))

  return (
    <div style={{ maxWidth: '680px', margin: '30px auto', padding: '28px', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', textAlign: 'right', background: '#f8fafc', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
      
      {/* כותרת ראשית */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '24px' }}>ניהול פיננסי חכם 🚀</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>שלוט בהוצאות שלך, צפה קדימה והשג את היעדים שלך</p>
        </div>
        <button 
          onClick={exportToCSV}
          style={{ background: '#e2e8f0', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#334155', fontSize: '12px' }}
        >
          📥 ייצוא לאקסל
        </button>
      </header>

      {/* כרטיסי סיכום */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>הכנסות</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>₪{totalIncome.toLocaleString()}</span>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>הוצאות</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>₪{totalExpense.toLocaleString()}</span>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', textAlign: 'center', borderTop: `4px solid ${netBalance >= 0 ? '#3b82f6' : '#f59e0b'}` }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>מאזן נקי</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: netBalance >= 0 ? '#3b82f6' : '#f59e0b' }}>₪{netBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* מד תקציב חודשי */}
      <div style={{ background: 'white', padding: '18px', borderRadius: '14px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>📊 מעקב תקציב חודשי (מסגרת: ₪{monthlyBudgetLimit.toLocaleString()})</span>
          <input 
            type="number" 
            value={monthlyBudgetLimit} 
            onChange={(e) => setMonthlyBudgetLimit(Number(e.target.value))} 
            style={{ width: '80px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            title="שנה מסגרת תקציב"
          />
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: '10px', height: '12px', width: '100%', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ background: budgetColor, width: `${budgetPercentage}%`, height: '100%', transition: 'width 0.4s ease' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
          <span>נוצלו: ₪{totalExpense.toLocaleString()} ({budgetPercentage}%)</span>
          <span>נותר: ₪{Math.max(monthlyBudgetLimit - totalExpense, 0).toLocaleString()}</span>
        </div>
      </div>

      {/* אזור יעד חיסכון ותחזית */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '20px', borderRadius: '14px', marginBottom: '24px', boxShadow: '0 6px 15px rgba(15, 23, 42, 0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>🎯 יעד חיסכון מוגדר</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px' }}>₪</span>
            <input
              type="number"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(Number(e.target.value))}
              style={{ width: '90px', padding: '4px 8px', borderRadius: '6px', border: 'none', fontWeight: 'bold', textAlign: 'center', background: '#334155', color: 'white' }}
            />
          </div>
        </div>
        <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#cbd5e1' }}>
          💡 <b>תחזית חכמה:</b> בהתאם למאזן הנוכחי שלך, תגיע ליעד בסביבות החודש/שנה: <b>{calculateGoalDate()}</b>.
        </p>
      </div>

      {/* פילוח הוצאות לפי קטגוריות */}
      {expensesByCategory.length > 0 && (
        <div style={{ background: 'white', padding: '18px', borderRadius: '14px', marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '14px', color: '#334155', margin: '0 0 12px 0' }}>🏷️ פילוח הוצאות לפי קטגוריות:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {expensesByCategory.map(cat => (
              <div key={cat.name} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: `4px solid ${cat.color}` }}>
                <span style={{ fontSize: '13px', color: '#334155' }}>{cat.icon} {cat.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ef4444' }}>₪{cat.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* טופס הוספת תנועה */}
      <form onSubmit={addTransaction} style={{ background: 'white', padding: '20px', borderRadius: '14px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={() => setType('expense')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: type === 'expense' ? '#ef4444' : '#f1f5f9', color: type === 'expense' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
          >
            הוצאה 📉
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: type === 'income' ? '#10b981' : '#f1f5f9', color: type === 'income' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
          >
            הכנסה 📈
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: type === 'expense' ? '1fr 1fr' : '1fr', gap: '10px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>תיאור:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'expense' ? 'למשל: סופרמרקט, דלק...' : 'למשל: משכורת, מתנה...'}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
          </div>

          {type === 'expense' && (
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>קטגוריה:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
              >
                {Object.keys(CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{CATEGORIES[cat].icon} {cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>סכום (₪):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', background: type === 'expense' ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: '0.2s' }}>
          {type === 'expense' ? 'הוסף הוצאה חדשה' : 'הוסף הכנסה חדשה'}
        </button>
      </form>

      {/* רשימת תנועות וחיפוש */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '15px', color: '#1e293b', margin: 0 }}>התנועות האחרונות שלך:</h3>
        <input 
          type="text" 
          placeholder="🔍 חיפוש תנועה..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', width: '160px' }}
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px', background: 'white', borderRadius: '14px' }}>אין תנועות תואמות כרגע. הוסף תנועה חדשה מעלה! 🚀</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredTransactions.map((item) => {
            const isIncome = Number(item.amount) > 0
            const catInfo = CATEGORIES[item.category] || { icon: '📦', color: '#64748b' }
            return (
              <li key={item.id} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', marginBottom: '8px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px', background: '#f8fafc', padding: '6px', borderRadius: '8px' }}>{isIncome ? '💰' : catInfo.icon}</span>
                  <div>
                    <span style={{ fontWeight: '600', color: '#334155', display: 'block', fontSize: '14px' }}>{item.title}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{item.category || 'כללי'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '15px', color: isIncome ? '#10b981' : '#ef4444' }}>
                    {isIncome ? `+₪${Number(item.amount).toLocaleString()}` : `₪${Number(item.amount).toLocaleString()}`}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(item.id)}
                    style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
