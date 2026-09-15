// name=elite-finance-pro.js
import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const CURRENCIES = [
  { symbol: '₪', code: 'ILS', rate: 1 },
  { symbol: '$', code: 'USD', rate: 0.27 },
  { symbol: '€', code: 'EUR', rate: 0.25 }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currency, setCurrency] = useState('₪')
  
  // Data States
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'חשבון עו"ש בנק הפועלים', type: 'checking', balance: 14250, icon: '🏦' },
    { id: 2, name: 'כרטיס אשראי ויזה כאל', type: 'credit', balance: -4320, icon: '💳' },
    { id: 3, name: 'קרן השתלמות', type: 'investment', balance: 89000, icon: '📈' },
    { id: 4, name: 'רכב פרטי (מחירון)', type: 'asset', balance: 65000, icon: '🚗' }
  ])
  const [goals, setGoals] = useState([
    { id: 1, title: 'חופשה באירופה', target: 12000, current: 7500 },
    { id: 2, title: 'קרן חירום 3 חודשים', target: 30000, current: 18000 }
  ])
  const [isSyncing, setIsSyncing] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      if (data.length === 0) {
        // Mock data initial if empty for immediate rich experience
        setTransactions([
          { id: 1, title: 'משכורת חודשית', amount: 14500, category: 'הכנסה', is_recurring: true, created_at: '2026-09-01' },
          { id: 2, title: 'סופרמרקט שופרסל', amount: -650, category: 'מזון וסופר', is_recurring: false, created_at: '2026-09-10' },
          { id: 3, title: 'נטפליקס מנוי חודשי', amount: -65, category: 'מנויים', is_recurring: true, created_at: '2026-09-05' },
          { id: 4, title: 'תחנת דלק פז', amount: -350, category: 'תחבורה', is_recurring: false, created_at: '2026-09-12' },
          { id: 5, title: 'דירה שכורה', amount: -4200, category: 'דיור', is_recurring: true, created_at: '2026-09-02' }
        ])
      } else {
        setTransactions(data)
      }
    }
  }

  // Simulate Open Banking Sync
  const handleBankSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      const newTx = {
        id: Date.now(),
        title: 'קפה ארומה (סונכרן אוטומטית)',
        amount: -28,
        category: 'בילויים',
        is_recurring: false,
        created_at: new Date().toISOString().slice(0, 10)
      }
      setTransactions([newTx, ...transactions])
      alert('הסנכרון הבנקאי הושלם בהצלחה! התנועות האחרונות עודכנו.')
    }, 1500)
  }

  const currObj = CURRENCIES.find(c => c.symbol === currency) || CURRENCIES[0]
  const formatMoney = (val) => `${currency}${Math.round(val * currObj.rate).toLocaleString()}`

  // Calculations
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const netMonthly = totalIncome - totalExpense

  // Net Worth calculation
  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0))
  const netWorth = totalAssets - totalLiabilities

  // Subscriptions Radar
  const subscriptions = transactions.filter(t => t.is_recurring && t.amount < 0)
  const yearlySubsTotal = subscriptions.reduce((sum, t) => sum + Math.abs(t.amount), 0) * 12

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#090d16', color: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', textAlign: 'right', paddingBottom: '100px', boxSizing: 'border-box' }}>
      
      {/* Top Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 16px 12px 16px', borderBottom: '1px solid #1e293b' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>Elite Finance ⚡</h1>
          <span style={{ fontSize: '11px', color: '#64748b' }}>מודיעין פיננסי אוטומטי</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleBankSync}
            disabled={isSyncing}
            style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isSyncing ? 'סורק בנקים...' : '🔄 סנכרן בנק'}
          </button>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155', padding: '8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', outline: 'none' }}
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.symbol}>{c.symbol}</option>)}
          </select>
        </div>
      </header>

      {/* Main Content Container */}
      <main style={{ padding: '16px' }}>

        {/* TAB 1: OVERVIEW & CASH FLOW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Net Worth Hero Card */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '22px', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>הון עצמי כולל (Net Worth)</span>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#38bdf8', margin: '6px 0 14px 0' }}>
                {formatMoney(netWorth)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>נכסים וחסכונות</span>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#10b981' }}>{formatMoney(totalAssets)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>התחייבויות ואשראי</span>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#ef4444' }}>-{formatMoney(totalLiabilities)}</div>
                </div>
              </div>
            </div>

            {/* Monthly Flow Card */}
            <div style={{ background: '#111827', padding: '18px', borderRadius: '20px', border: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>תזרים חודשי נוכחי</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: netMonthly >= 0 ? '#10b981' : '#ef4444' }}>{formatMoney(netMonthly)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#1f2937', padding: '10px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>הכנסות</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>+{formatMoney(totalIncome)}</div>
                </div>
                <div style={{ background: '#1f2937', padding: '10px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>הוצאות</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444' }}>-{formatMoney(totalExpense)}</div>
                </div>
              </div>
            </div>

            {/* Subscription Radar Widget */}
            <div style={{ background: '#111827', padding: '18px', borderRadius: '20px', border: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>📡 רדאר מנויים והוראות קבע</span>
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold' }}>{formatMoney(yearlySubsTotal)} / שנה</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {subscriptions.map(sub => (
                  <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#1f2937', padding: '10px 12px', borderRadius: '12px', fontSize: '12px' }}>
                    <span>{sub.title}</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{formatMoney(sub.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ACCOUNTS & ASSETS */}
        {activeTab === 'accounts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>חשבונות ונכסים מחוברים</h3>
            {accounts.map(acc => (
              <div key={acc.id} style={{ background: '#111827', padding: '16px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1f2937' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{acc.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{acc.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>סונכרן אוטומטית לפני דקות ספורות</div>
                  </div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '950', color: acc.balance >= 0 ? '#10b981' : '#ef4444' }}>
                  {formatMoney(acc.balance)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: GOALS */}
        {activeTab === 'goals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>🎯 יעדי חיסכון חכמים</h3>
            {goals.map(goal => {
              const pct = Math.round((goal.current / goal.target) * 100)
              const monthsLeft = Math.ceil((goal.target - goal.current) / (netMonthly > 0 ? netMonthly : 1000))
              return (
                <div key={goal.id} style={{ background: '#111827', padding: '16px', borderRadius: '18px', border: '1px solid #1f2937' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{goal.title}</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>{pct}%</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    {formatMoney(goal.current)} מתוך {formatMoney(goal.target)}
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#1f2937', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#38bdf8' }}></div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', background: '#1f2937', padding: '6px 10px', borderRadius: '8px' }}>
                    קצב חיסכון נוכחי צפוי להשלים את היעד עוד <strong>{monthsLeft} חודשים</strong>.
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* TAB 4: TRANSACTIONS FEED */}
        {activeTab === 'transactions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>פיד תנועות בנקאיות</h3>
            {transactions.map(tx => (
              <div key={tx.id} style={{ background: '#111827', padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1f2937' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tx.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{tx.category} • {tx.created_at}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '900', color: tx.amount > 0 ? '#10b981' : '#f1f5f9' }}>
                  {tx.amount > 0 ? `+${formatMoney(tx.amount)}` : formatMoney(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b0f19', borderTop: '1px solid #1e293b', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '12px 0 24px 0', zIndex: 100 }}>
        {[
          { id: 'overview', label: 'סקירה', icon: '📊' },
          { id: 'accounts', label: 'חשבונות', icon: '🏦' },
          { id: 'goals', label: 'יעדים', icon: '🎯' },
          { id: 'transactions', label: 'פיד', icon: '💳' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ background: 'transparent', color: activeTab === tab.id ? '#38bdf8' : '#64748b', border: 'none', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  )
}
