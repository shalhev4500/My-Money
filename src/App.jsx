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
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'transactions' | 'budgets' | 'tools'
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // שדות טופס הוספה מהירה
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)

  // הגדרות מתקדמות ב-LocalStorage
  const [savingsGoalAmount, setSavingsGoalAmount] = useState(() => Number(localStorage.getItem('mymoney_savings_amount')) || 50000)
  const [savingsGoalName, setSavingsGoalName] = useState(() => localStorage.getItem('mymoney_savings_name') || 'חופשת חלום ביעד אקזוטי ✈️')
  const [hourlyWage, setHourlyWage] = useState(() => Number(localStorage.getItem('mymoney_hourly_wage')) || 60)
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => Number(localStorage.getItem('mymoney_monthly_budget')) || 9000)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => { localStorage.setItem('mymoney_savings_amount', savingsGoalAmount) }, [savingsGoalAmount])
  useEffect(() => { localStorage.setItem('mymoney_savings_name', savingsGoalName) }, [savingsGoalName])
  useEffect(() => { localStorage.setItem('mymoney_hourly_wage', hourlyWage) }, [hourlyWage])
  useEffect(() => { localStorage.setItem('mymoney_monthly_budget', monthlyBudgetLimit) }, [monthlyBudgetLimit])
  useEffect(() => { localStorage.setItem('mymoney_categories', JSON.stringify(categories)) }, [categories])

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
      alert('שגיאה בשמירה: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
      setIsRecurring(false)
      setIsModalOpen(false)
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

  // חישוב תקציב יומי שנותר להיום
  const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate()
  const currentDay = new Date().getDate()
  const daysRemaining = Math.max(daysInMonth - currentDay + 1, 1)
  const remainingBudgetMoney = Math.max(monthlyBudgetLimit - totalExpense, 0)
  const dailySafeSpend = Math.round(remainingBudgetMoney / daysRemaining)

  const recurringExpenses = monthTransactions.filter(t => t.is_recurring && Number(t.amount) < 0)
  const totalRecurringMonthly = recurringExpenses.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  const totalRecurringYearly = totalRecurringMonthly * 12

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

  // ייצוא נתונים ל-CSV
  function exportToCSV() {
    const headers = "ID,Title,Amount,Category,Date,Recurring\n"
    const rows = transactions.map(t => `${t.id},"${t.title}",${t.amount},"${t.category || ''}",${t.created_at || ''},${t.is_recurring || false}`).join("\n")
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mymoney_export_${selectedMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredTransactions = monthTransactions.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.category && t.category.includes(searchTerm)))

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', minHeight: '92vh', padding: '20px 16px 90px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', textAlign: 'right', background: '#090d16', color: '#f8fafc', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)', border: '1px solid #1e293b', position: 'relative', boxSizing: 'border-box' }}>
      
      {/* כותרת עליונה */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #1e293b' }}>
        <div>
          <h1 style={{ color: '#ffffff', margin: '0 0 2px 0', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>My Money 💎</h1>
          <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '500' }}>ניהול הון אישי פרימיום</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid #334155', fontSize: '12px', fontWeight: 'bold', background: '#131b2e', color: 'white', outline: 'none' }}
          />
        </div>
      </header>

      {/* ================= 1. סקירה וגרפים (Dashboard) ================= */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* כרטיס יתרה מרכזי בסגנון פרימיום */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155', padding: '20px', borderRadius: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>מאזן חודשי נקי</span>
            <span style={{ fontSize: '32px', fontWeight: '900', color: netBalance >= 0 ? '#38bdf8' : '#f87171', letterSpacing: '-1px' }}>
              ₪{netBalance.toLocaleString()}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #1e293b' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>הכנסות</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#34d399' }}>+₪{totalIncome.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>הוצאות</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#f87171' }}>-₪{totalExpense.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ווידג'ט תקציב יומי חכם (Safe-to-Spend) */}
          <div style={{ background: '#131b2e', border: '1px solid #1e293b', padding: '16px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>💡 תקציב מומלץ להיום</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>₪{dailySafeSpend.toLocaleString()} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>/ ליום</span></span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>ימים שנותרו</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1' }}>{daysRemaining} ימים</span>
            </div>
          </div>

          {/* יעד חיסכון אישי */}
          <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', padding: '16px 18px', borderRadius: '18px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>🎯 יעד: {savingsGoalName}</span>
              <span style={{ fontSize: '13px', fontWeight: '800' }}>₪{savingsGoalAmount.toLocaleString()}</span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#bfdbfe' }}>
              הגדר מטרות חדשות ומסגרות בלשונית <b>"יעדים ותקציבים"</b>.
            </p>
          </div>

          {/* מד תקציב כללי */}
          <div style={{ background: '#131b2e', padding: '18px', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#f8fafc' }}>📊 מסגרת תקציב כללית</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>₪{totalExpense} / ₪{monthlyBudgetLimit}</span>
            </div>
            <div style={{ background: '#090d16', borderRadius: '8px', height: '10px', width: '100%', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <div style={{ background: budgetColor, width: `${budgetPercentage}%`, height: '100%', transition: 'width 0.4s ease' }}></div>
            </div>
          </div>

          {/* פילוח לפי קטגוריות */}
          <div style={{ background: '#131b2e', padding: '18px', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 12px 0' }}>📈 פילוח הוצאות לפי קטגוריות</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {expensesByCategory.map(cat => {
                const catPercentage = cat.limit > 0 ? Math.min(Math.round((cat.total / cat.limit) * 100), 100) : 0
                return (
                  <div key={cat.name} style={{ background: '#090d16', padding: '10px 12px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#f8fafc' }}>
                        {cat.icon} {cat.name}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: cat.total > 0 ? '#f87171' : '#64748b' }}>
                        ₪{cat.total.toLocaleString()} <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal' }}>/ ₪{cat.limit}</span>
                      </span>
                    </div>
                    <div style={{ background: '#131b2e', borderRadius: '4px', height: '6px', width: '100%', overflow: 'hidden' }}>
                      <div style={{ background: cat.color, width: `${catPercentage}%`, height: '100%' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* ================= 2. ניהול תנועות (Transactions) ================= */}
      {activeTab === 'transactions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0 }}>תנועות בחודש {selectedMonth}</h3>
            <input 
              type="text" 
              placeholder="🔍 חיפוש מהיר..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid #334155', fontSize: '11px', width: '140px', background: '#131b2e', color: 'white', outline: 'none' }}
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#131b2e', borderRadius: '16px', border: '1px solid #1e293b', fontSize: '13px' }}>אין תנועות להצגה בחודש זה.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredTransactions.map((item) => {
                const isIncome = Number(item.amount) > 0
                const catInfo = categories[item.category] || { icon: '📦', color: '#64748b' }
                const costInHours = !isIncome && hourlyWage > 0 ? (Math.abs(Number(item.amount)) / hourlyWage).toFixed(1) : null

                return (
                  <li key={item.id} style={{ background: '#131b2e', border: '1px solid #1e293b', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px', background: '#090d16', padding: '6px', borderRadius: '10px', border: '1px solid #1e293b' }}>{isIncome ? '💰' : catInfo.icon}</span>
                      <div>
                        <span style={{ fontWeight: '600', color: '#f8fafc', display: 'block', fontSize: '13px' }}>
                          {item.title} {item.is_recurring && <span style={{ fontSize: '10px', background: '#1e3a8a', color: '#60a5fa', padding: '1px 6px', borderRadius: '4px', marginRight: '6px' }}>קבוע 🔄</span>}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {item.category || 'כללי'} {costInHours && `• ⏳ ${costInHours} שעות עבודה`}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: isIncome ? '#34d399' : '#f87171' }}>
                        {isIncome ? `+₪${Number(item.amount).toLocaleString()}` : `₪${Number(item.amount).toLocaleString()}`}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(item.id)}
                        style={{ background: '#090d16', border: '1px solid #1e293b', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

      {/* ================= 3. יעדים ותקציבים (Budgets & Goals) ================= */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#131b2e', padding: '18px', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 10px 0' }}>🎯 יעד חיסכון אישי</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                value={savingsGoalName} 
                onChange={(e) => setSavingsGoalName(e.target.value)} 
                placeholder="שם היעד..."
                style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '10px', border: '1px solid #334155', background: '#090d16', color: 'white', boxSizing: 'border-box', outline: 'none' }}
              />
              <input 
                type="number" 
                value={savingsGoalAmount} 
                onChange={(e) => setSavingsGoalAmount(Number(e.target.value))} 
                placeholder="סכום בשקלים..."
                style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '10px', border: '1px solid #334155', background: '#090d16', color: 'white', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ background: '#131b2e', padding: '18px', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 10px 0' }}>⚙️ הגדרות מערכת</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>תקציב חודשי (₪)</label>
                <input 
                  type="number" 
                  value={monthlyBudgetLimit} 
                  onChange={(e) => setMonthlyBudgetLimit(Number(e.target.value))} 
                  style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#090d16', color: 'white', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>שכר שעתי (₪)</label>
                <input 
                  type="number" 
                  value={hourlyWage} 
                  onChange={(e) => setHourlyWage(Number(e.target.value))} 
                  style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#090d16', color: 'white', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#131b2e', padding: '18px', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 10px 0' }}>תקרת קטגוריות</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(categories).map(catName => (
                <div key={catName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16', padding: '8px 12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '12px', color: '#f8fafc' }}>{categories[catName].icon} {catName}</span>
                  <input
                    type="number"
                    value={categories[catName].limit}
                    onChange={(e) => updateCategoryLimit(catName, e.target.value)}
                    style={{ width: '70px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #334155', background: '#131b2e', color: 'white', fontSize: '12px', textAlign: 'center', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. כלים מתקדמים (Tools) ================= */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ background: '#131b2e', padding: '18px', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 6px 0' }}>📡 רדאר מנויים והוצאות קבועות</h3>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 12px 0' }}>עלות שנתית מצטברת: <b style={{ color: '#f87171' }}>₪{totalRecurringYearly.toLocaleString()}</b></p>
            {recurringExpenses.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>אין מנויים פעילים החודש.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recurringExpenses.map(item => (
                  <li key={item.id} style={{ background: '#090d16', padding: '8px 12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', border: '1px solid #1e293b' }}>
                    <span style={{ color: '#f8fafc' }}>{item.title}</span>
                    <span style={{ color: '#f87171', fontWeight: 'bold' }}>₪{Math.abs(Number(item.amount))} / חודש</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ background: '#131b2e', padding: '18px', borderRadius: '18px', border: '1px solid #1e293b', textAlign: 'center' }}>
            <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 6px 0' }}>📥 ייצוא נתונים מקצועי</h3>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 14px 0' }}>הורד את כל נתוני ההוצאות וההכנסות לקובץ CSV לגיבוי מלא.</p>
            <button 
              onClick={exportToCSV}
              style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              הורד קובץ גיבוי (CSV) 📊
            </button>
          </div>

        </div>
      )}

      {/* ================= כפתור הוספה מהירה צף (FAB) ================= */}
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ position: 'fixed', bottom: '85px', left: '50%', transform: 'translateX(-50%)', background: '#38bdf8', color: '#090d16', border: 'none', width: '56px', height: '56px', borderRadius: '50%', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      >
        +
      </button>

      {/* ================= מודל הוספת תנועה (Popup Modal) ================= */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, padding: '0' }}>
          <div style={{ background: '#131b2e', width: '100%', maxWidth: '480px', padding: '24px 20px 36px 20px', borderRadius: '28px 28px 0 0', borderTop: '1px solid #334155', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>הוספת תנועה חדשה</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={addTransaction}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: type === 'expense' ? '#f87171' : '#090d16', color: type === 'expense' ? 'white' : '#94a3b8', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  הוצאה 📉
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: type === 'income' ? '#34d399' : '#090d16', color: type === 'income' ? 'white' : '#94a3b8', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  הכנסה 📈
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#94a3b8' }}>תיאור</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="למשל: סופרמרקט, דלק..."
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#090d16', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#94a3b8' }}>סכום (₪)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#090d16', color: 'white', outline: 'none' }}
                />
              </div>

              {type === 'expense' && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#94a3b8' }}>קטגוריה</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid #334155', fontSize: '13px', background: '#090d16', color: 'white', outline: 'none' }}
                  >
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'expense' && (
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="recurringModal"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#38bdf8' }}
                  />
                  <label htmlFor="recurringModal" style={{ fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                    🔄 הוצאה קבועה / מנוי חודשי ברדאר
                  </label>
                </div>
              )}

              <button type="submit" style={{ width: '100%', background: type === 'expense' ? '#f87171' : '#34d399', color: '#090d16', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                שמור תנועה
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ================= סרגל ניווט תחתון (Bottom Bar) ================= */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#131b2e', borderTop: '1px solid #1e293b', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '10px 0 18px 0', zIndex: 90 }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#38bdf8' : '#64748b', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>📊</span>
          סקירה
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{ background: 'none', border: 'none', color: activeTab === 'transactions' ? '#38bdf8' : '#64748b', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>💳</span>
          תנועות
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          style={{ background: 'none', border: 'none', color: activeTab === 'budgets' ? '#38bdf8' : '#64748b', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>🎯</span>
          יעדים
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          style={{ background: 'none', border: 'none', color: activeTab === 'tools' ? '#38bdf8' : '#64748b', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>⚡</span>
          כלים
        </button>
      </nav>

    </div>
  )
}
