import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6', limit: 900 },
  'שונות': { icon: '📦', color: '#64748b', limit: 500 }
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)
  const [savingsGoal, setSavingsGoal] = useState(150000)
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(9000)
  const [searchTerm, setSearchTerm] = useState('')
  
  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

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
        category: type === 'expense' ? category : 'הכנסה',
        is_recurring: type === 'expense' ? isRecurring : false
      }])
      .select()

    if (error) {
      console.log('Supabase Error Details:', error)
      alert('שגיאה בסופאבייס: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
      setIsRecurring(false)
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setTransactions(transactions.filter(item => item.id !== id))
    }
  }

  const monthTransactions = transactions.filter(t => {
    const tDate = t.created_at ? t.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  const totalIncome = monthTransactions.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = monthTransactions.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  const netBalance = totalIncome - totalExpense

  const budgetPercentage = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100)
  let budgetColor = '#10b981' 
  if (budgetPercentage > 75) budgetColor = '#f59e0b' 
  if (budgetPercentage >= 100) budgetColor = '#ef4444' 

  function getSmartAdvisorMessage() {
    if (totalExpense === 0 && totalIncome === 0) return 'ברוך הבא למערכת הפיננסית שלך! התחל להזין תנועות כדי לקבל ניתוח עומק.'
    if (budgetPercentage >= 100) return '🚨 חריגה חמורה מהתקציב הכללי! נדרשת עצירה מיידית של הוצאות לא חיוניות.'
    if (budgetPercentage > 75) return '⚠️ שים לב: ניצלת מעל 75% מסגרת התקציב שלך החודש. שמור על ערנות.'
    if (netBalance > 0) return '🌟 התנהלות מצוינת! אתה מייצר תזרים חיובי ובונה את העתיד הכלכלי שלך.'
    return '💡 טיפ מקצועי: בדוק איפה אפשר לקצץ השבוע כדי לאזן את המאזן.'
  }

  function calculateGoalDate() {
    if (netBalance <= 0) return 'אין חיסכון חיובי החודש לחישוב תחזית'
    const monthsNeeded = Math.ceil(savingsGoal / netBalance)
    const targetDate = new Date()
    targetDate.setMonth(targetDate.getMonth() + monthsNeeded)
    return targetDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
  }

  const expensesByCategory = Object.keys(CATEGORIES).map(cat => {
    const total = monthTransactions
      .filter(t => t.category === cat && Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    return { name: cat, total, ...CATEGORIES[cat] }
  })

  function exportToCSV() {
    const headers = "כותרת,סכום,קטגוריה,הוראת קבע,תאריך\n"
    const rows = monthTransactions.map(t => `"${t.title}",${t.amount},"${t.category || 'כללי'}","${t.is_recurring ? 'כן' : 'לא'}","${new Date(t.created_at || Date.now()).toLocaleDateString()}"`).join("\n")
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `finances_${selectedMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredTransactions = monthTransactions.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.category && t.category.includes(searchTerm)))

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '32px', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', textAlign: 'right', background: '#0f172a', color: '#f8fafc', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
      
      {/* כותרת ראשית ובורר חודשים */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#f8fafc', margin: '0 0 6px 0', fontSize: '26px', letterSpacing: '-0.5px' }}>Nexus Finance 💎</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>מערכת ניהול הון מתקדמת ואנליטיקת הוצאות בזמן אמת</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', fontWeight: 'bold', background: '#1e293b', color: 'white', outline: 'none' }}
          />
          <button 
            onClick={exportToCSV}
            style={{ background: '#334155', border: 'none', padding: '9px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#f8fafc', fontSize: '13px', transition: 'background 0.2s' }}
            title="ייצא חודש נוכחי לאקסל"
          >
            📥 ייצוא CSV
          </button>
        </div>
      </header>

      {/* יועץ פיננסי חכם */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #3b82f6', padding: '16px 20px', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)' }}>
        <span style={{ fontSize: '28px', background: '#1e293b', padding: '8px', borderRadius: '12px', border: '1px solid #334155' }}>🤖</span>
        <div>
          <span style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '3px' }}>אנליזה חכמה לחודש {selectedMonth}:</span>
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{getSmartAdvisorMessage()}</p>
        </div>
      </div>

      {/* כרטיסי סיכום */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: '#1e293b', padding: '18px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>הכנסות בחודש</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>₪{totalIncome.toLocaleString()}</span>
        </div>
        <div style={{ background: '#1e293b', padding: '18px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>הוצאות בחודש</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>₪{totalExpense.toLocaleString()}</span>
        </div>
        <div style={{ background: '#1e293b', padding: '18px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>מאזן נקי</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: netBalance >= 0 ? '#3b82f6' : '#f59e0b' }}>₪{netBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* מד תקציב חודשי */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#f8fafc' }}>📊 מסגרת תקציב כללית (₪{monthlyBudgetLimit.toLocaleString()})</span>
          <input 
            type="number" 
            value={monthlyBudgetLimit} 
            onChange={(e) => setMonthlyBudgetLimit(Number(e.target.value))} 
            style={{ width: '90px', padding: '4px 8px', fontSize: '13px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: 'white', textAlign: 'center' }}
          />
        </div>
        <div style={{ background: '#0f172a', borderRadius: '10px', height: '12px', width: '100%', overflow: 'hidden', marginBottom: '10px', border: '1px solid #334155' }}>
          <div style={{ background: budgetColor, width: `${budgetPercentage}%`, height: '100%', transition: 'width 0.5s ease' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
          <span>נוצלו: ₪{totalExpense.toLocaleString()} ({budgetPercentage}%)</span>
          <span>נותר למסגרת: ₪{Math.max(monthlyBudgetLimit - totalExpense, 0).toLocaleString()}</span>
        </div>
      </div>

      {/* תחזית יעד חיסכון */}
      <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', padding: '22px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>🎯 יעד חיסכון עתידי</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>₪</span>
            <input
              type="number"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(Number(e.target.value))}
              style={{ width: '100px', padding: '6px 10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', textAlign: 'center', background: '#1e3a8a', color: 'white', outline: 'none' }}
            />
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#e0f2fe', lineHeight: '1.4' }}>
          🚀 <b>תחזית אלגוריתמית:</b> בקצב החסכון הנוכחי לחודש זה, תגיע ליעד סביב: <b>{calculateGoalDate()}</b>.
        </p>
      </div>

      {/* פילוח הוצאות לפי קטגוריות מתקדם (ויזואלי לחלוטין) */}
      <div style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #334155' }}>
        <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 16px 0' }}>🏷️ פילוח הוצאות לפי קטגוריות ותקציב אישי:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {expensesByCategory.map(cat => {
            const catPercentage = cat.limit ? Math.min(Math.round((cat.total / cat.limit) * 100), 100) : 0
            return (
              <div key={cat.name} style={{ background: '#0f172a', padding: '12px 16px', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>{cat.icon} {cat.name}</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: cat.total > 0 ? '#ef4444' : '#94a3b8' }}>
                    ₪{cat.total.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>/ יעד ₪{cat.limit}</span>
                  </span>
                </div>
                <div style={{ background: '#1e293b', borderRadius: '6px', height: '8px', width: '100%', overflow: 'hidden' }}>
                  <div style={{ background: cat.color, width: `${catPercentage}%`, height: '100%', transition: 'width 0.4s ease' }}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* טופס הוספת תנועה מודרני */}
      <form onSubmit={addTransaction} style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setType('expense')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'expense' ? '#ef4444' : '#0f172a', color: type === 'expense' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            הוצאה 📉
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'income' ? '#10b981' : '#0f172a', color: type === 'income' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            הכנסה 📈
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: type === 'expense' ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>תיאור:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'expense' ? 'למשל: סופרמרקט, דלק...' : 'למשל: משכורת, פרילנס...'}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#0f172a', color: 'white', outline: 'none' }}
            />
          </div>

          {type === 'expense' && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>קטגוריה:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#0f172a', color: 'white', outline: 'none' }}
              >
                {Object.keys(CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{CATEGORIES[cat].icon} {cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>סכום (₪):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#0f172a', color: 'white', outline: 'none' }}
          />
        </div>

        {type === 'expense' && (
          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="recurringCheck"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#3b82f6' }}
            />
            <label htmlFor="recurringCheck" style={{ fontSize: '13px', color: '#cbd5e1', cursor: 'pointer' }}>
              🔄 זוהי הוצאה קבועה / הוראת קבע חודשית
            </label>
          </div>
        )}

        <button type="submit" style={{ width: '100%', background: type === 'expense' ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'opacity 0.2s' }}>
          {type === 'expense' ? 'הוסף הוצאה למערכת' : 'הוסף הכנסה למערכת'}
        </button>
      </form>

      {/* רשימת תנועות וחיפוש */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>התנועות בחודש {selectedMonth}:</h3>
        <input 
          type="text" 
          placeholder="🔍 חיפוש לפי שם או קטגוריה..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #334155', fontSize: '12px', width: '200px', background: '#1e293b', color: 'white', outline: 'none' }}
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>אין תנועות בחודש הנבחר. הוסף תנועה חדשה למעלה או בחר חודש אחר! 🚀</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTransactions.map((item) => {
            const isIncome = Number(item.amount) > 0
            const catInfo = CATEGORIES[item.category] || { icon: '📦', color: '#64748b' }
            return (
              <li key={item.id} style={{ background: '#1e293b', border: '1px solid #334155', padding: '14px 18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '22px', background: '#0f172a', padding: '8px', borderRadius: '12px', border: '1px solid #334155' }}>{isIncome ? '💰' : catInfo.icon}</span>
                  <div>
                    <span style={{ fontWeight: '600', color: '#f8fafc', display: 'block', fontSize: '14px' }}>
                      {item.title} {item.is_recurring && <span style={{ fontSize: '11px', background: '#1e3a8a', color: '#60a5fa', padding: '2px 8px', borderRadius: '6px', marginRight: '8px', border: '1px solid #3b82f6' }}>קבוע 🔄</span>}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.category || 'כללי'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px', color: isIncome ? '#10b981' : '#ef4444' }}>
                    {isIncome ? `+₪${Number(item.amount).toLocaleString()}` : `₪${Number(item.amount).toLocaleString()}`}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(item.id)}
                    style={{ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
