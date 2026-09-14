import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const INITIAL_CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6', limit: 900 },
  'שונות': { icon: '📦', color: '#64748b', limit: 500 }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'transactions' | 'budgets'
  const [transactions, setTransactions] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // שמירה וטעינה של הגדרות מה-localStorage כדי שרענון לא יאפס כלום
  const [savingsGoal, setSavingsGoal] = useState(() => {
    return Number(localStorage.getItem('nexus_savings_goal')) || 150000
  })
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => {
    return Number(localStorage.getItem('nexus_monthly_budget')) || 9000
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('nexus_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => {
    localStorage.setItem('nexus_savings_goal', savingsGoal)
  }, [savingsGoal])

  useEffect(() => {
    localStorage.setItem('nexus_monthly_budget', monthlyBudgetLimit)
  }, [monthlyBudgetLimit])

  useEffect(() => {
    localStorage.setItem('nexus_categories', JSON.stringify(categories))
  }, [categories])

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
    if (totalExpense === 0 && totalIncome === 0) return 'ברוך הבא למערכת הפיננסית שלך! התחל להזין תנועות כדי לקבל אנליטיקה מלאה.'
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

  const expensesByCategory = Object.keys(categories).map(cat => {
    const total = monthTransactions
      .filter(t => t.category === cat && Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    return { name: cat, total, ...categories[cat] }
  })

  function updateCategoryLimit(catName, newLimit) {
    setCategories(prev => ({
      ...prev,
      [catName]: { ...prev[catName], limit: Number(newLimit) || 0 }
    }))
  }

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
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '32px', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', textAlign: 'right', background: '#0f172a', color: '#f8fafc', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
      
      {/* כותרת ראשית ובורר חודשים */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
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
            style={{ background: '#334155', border: 'none', padding: '9px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#f8fafc', fontSize: '13px' }}
            title="ייצא חודש נוכחי לאקסל"
          >
            📥 ייצוא CSV
          </button>
        </div>
      </header>

      {/* פאנל לשוניות (Tabs) ניווט ראשי */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: '#1e293b', padding: '6px', borderRadius: '14px', border: '1px solid #334155' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === 'dashboard' ? '#3b82f6' : 'transparent', color: activeTab === 'dashboard' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
        >
          📊 סקירה וגרפים
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === 'transactions' ? '#3b82f6' : 'transparent', color: activeTab === 'transactions' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
        >
          💳 ניהול תנועות
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: activeTab === 'budgets' ? '#3b82f6' : 'transparent', color: activeTab === 'budgets' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
        >
          🎯 יעדים ותקציבים
        </button>
      </div>

      {/* ================= לוח הבקרה והגרפים (Dashboard) ================= */}
      {activeTab === 'dashboard' && (
        <div>
          {/* יועץ פיננסי חכם */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #3b82f6', padding: '16px 20px', borderRadius: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '28px', background: '#1e293b', padding: '8px', borderRadius: '12px', border: '1px solid #334155' }}>🤖</span>
            <div>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '3px' }}>אנליזה חכמה לחודש {selectedMonth}:</span>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{getSmartAdvisorMessage()}</p>
            </div>
          </div>

          {/* כרטיסי סיכום */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
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

          {/* מד תקציב חודשי כללי */}
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#f8fafc' }}>📊 מסגרת תקציב כללית (₪{monthlyBudgetLimit.toLocaleString()})</span>
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
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>🎯 יעד חיסכון עתידי (₪{savingsGoal.toLocaleString()})</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#e0f2fe', lineHeight: '1.4' }}>
              🚀 <b>תחזית אלגוריתמית:</b> בקצב החסכון הנוכחי לחודש זה, תגיע ליעד סביב: <b>{calculateGoalDate()}</b>.
            </p>
          </div>

          {/* פילוח הוצאות חזותי מלא (גרפים לפי קטגוריות והתקדמות מול יעד אישי) */}
          <div style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 16px 0' }}>📈 פילוח התפלגות הוצאות חזותי לפי קטגוריות:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {expensesByCategory.map(cat => {
                const catPercentage = cat.limit > 0 ? Math.min(Math.round((cat.total / cat.limit) * 100), 100) : 0
                const shareOfTotal = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
                return (
                  <div key={cat.name} style={{ background: '#0f172a', padding: '14px 16px', borderRadius: '12px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>
                        {cat.icon} {cat.name} <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '6px' }}>({shareOfTotal}% מההוצאות)</span>
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: cat.total > 0 ? '#ef4444' : '#94a3b8' }}>
                        ₪{cat.total.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>/ יעד אישי ₪{cat.limit.toLocaleString()}</span>
                      </span>
                    </div>
                    {/* פס התקדמות יעד אישי */}
                    <div style={{ background: '#1e293b', borderRadius: '6px', height: '8px', width: '100%', overflow: 'hidden' }}>
                      <div style={{ background: cat.color, width: `${catPercentage}%`, height: '100%', transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= ניהול תנועות והוספה (Transactions) ================= */}
      {activeTab === 'transactions' && (
        <div>
          {/* טופס הוספת תנועה */}
          <form onSubmit={addTransaction} style={{ background: '#1e293b', padding: '22px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 16px 0' }}>➕ הוספת תנועה חדשה</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setType('expense')}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'expense' ? '#ef4444' : '#0f172a', color: type === 'expense' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}
              >
                הוצאה 📉
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'income' ? '#10b981' : '#0f172a', color: type === 'income' ? 'white' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}
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
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
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

            <button type="submit" style={{ width: '100%', background: type === 'expense' ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              {type === 'expense' ? 'הוסף הוצאה למערכת' : 'הוסף הכנסה למערכת'}
            </button>
          </form>

          {/* רשימת תנועות וחיפוש */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>התנועות בחודש {selectedMonth}:</h3>
            <input 
              type="text" 
              placeholder="🔍 חיפוש..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #334155', fontSize: '12px', width: '200px', background: '#1e293b', color: 'white', outline: 'none' }}
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>אין תנועות בחודש הנבחר. הוסף תנועה חדשה בלשונית זו או בחר חודש אחר! 🚀</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTransactions.map((item) => {
                const isIncome = Number(item.amount) > 0
                const catInfo = categories[item.category] || { icon: '📦', color: '#64748b' }
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
      )}

      {/* ================= הגדרת יעדים ותקציבים אישיים (Budgets) ================= */}
      {activeTab === 'budgets' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 8px 0' }}>🎯 הגדרת תקציבי קטגוריות ויעדים אישיים</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px 0' }}>כאן תוכל לקבוע בעצמך את היעדים והמסגרות לכל קטגוריה וליעד החיסכון הכללי. השינויים נשמרים אוטומטית!</p>

          {/* הגדרת מסגרת כללית ויעד חיסכון */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}>מסגרת תקציב כללית (₪):</label>
              <input 
                type="number" 
                value={monthlyBudgetLimit} 
                onChange={(e) => setMonthlyBudgetLimit(Number(e.target.value))} 
                style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}>יעד חיסכון עתידי (₪):</label>
              <input 
                type="number" 
                value={savingsGoal} 
                onChange={(e) => setSavingsGoal(Number(e.target.value))} 
                style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 12px 0' }}>יעדי הוצאה לפי קטגוריה:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.keys(categories).map(catName => {
              const cat = categories[catName]
              return (
                <div key={catName} style={{ background: '#0f172a', padding: '12px 16px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>
                    {cat.icon} {catName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>יעד חודשי (₪):</span>
                    <input
                      type="number"
                      value={cat.limit}
                      onChange={(e) => updateCategoryLimit(catName, e.target.value)}
                      style={{ width: '100px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', fontWeight: 'bold', textAlign: 'center', outline: 'none' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
