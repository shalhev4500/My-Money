import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const TRANSLATIONS = {
  en: {
    appName: 'My Money',
    tagline: 'Elite Wealth & Household Finance',
    dashboard: 'Overview',
    transactions: 'Transactions',
    budgets: 'Budgets',
    tools: 'Analytics',
    netBalance: 'Net Monthly Balance',
    income: 'Income',
    expenses: 'Expenses',
    safeSpend: 'Daily Safe-to-Spend',
    daysLeft: 'days left',
    targetDate: 'Estimated Target Date',
    noTarget: 'Save consistently to calculate target date',
    goalReached: 'Goal Reached! 🎉',
    categoryBreakdown: 'Expense Breakdown by Category',
    searchPlaceholder: 'Quick search...',
    noTransactions: 'No transactions recorded for this month.',
    recurringBadge: 'Recurring 🔄',
    newTransaction: 'New Transaction',
    expenseType: 'Expense 📉',
    incomeType: 'Income 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'e.g. Supermarket, Netflix...',
    amountLabel: 'Amount (₪)',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription / Standing order',
    endDateLabel: 'End Month for Recurring (Optional)',
    saveButton: 'Save Transaction',
    exportCSV: 'Export Backup (CSV) 📊',
    subscriptionRadar: 'Subscription & Standing Orders Radar',
    yearlyTotal: 'Total yearly commitment:',
    systemSettings: 'System Settings',
    themeToggle: 'Appearance Mode',
    darkMode: 'Dark Mode 🌙',
    lightMode: 'Light Mode ☀️',
    language: 'Language 🌐',
    savingsGoalsTitle: 'Personal Savings Goals',
    addGoal: 'Add New Goal',
    goalNamePlaceholder: 'Goal name (e.g. Car, Vacation...)',
    goalAmountPlaceholder: 'Target Amount (₪)',
    smartBudgetTitle: 'Smart Monthly Budget & Limits',
    totalMonthlyBudgetLabel: 'Total Monthly Budget Limit (₪)',
    categoryLimitsTitle: 'Category Budget Allocations',
    budgetExceededError: 'Error: Sum of category limits exceeds your total monthly budget limit!',
    scanReceiptBtn: '📸 Scan Receipt with AI',
    scanningReceipt: 'Analyzing receipt with AI...',
    scanSuccess: 'Receipt successfully analyzed!',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit'
  },
  he: {
    appName: 'My Money',
    tagline: 'ניהול הון אישי ברמה הגבוהה ביותר',
    dashboard: 'סקירה כללית',
    transactions: 'תנועות',
    budgets: 'יעדים ותקציב',
    tools: 'ניתוחים ודוחות',
    netBalance: 'מאזן חודשי נקי',
    income: 'הכנסות',
    expenses: 'הוצאות',
    safeSpend: 'תקציב יומי מומלץ',
    daysLeft: 'ימים שנותרו',
    targetDate: 'תאריך הגעה משוער ליעד',
    noTarget: 'חסוך בעקביות כדי לחשב תאריך יעד',
    goalReached: 'היעד הושג בהצלחה! 🎉',
    categoryBreakdown: 'פילוח הוצאות לפי קטגוריות',
    searchPlaceholder: 'חיפוש מהיר...',
    noTransactions: 'אין תנועות להצגה בחודש זה.',
    recurringBadge: 'הוראת קבע/מנוי 🔄',
    newTransaction: 'הוספת תנועה חדשה',
    expenseType: 'הוצאה 📉',
    incomeType: 'הכנסה 📈',
    titleLabel: 'תיאור',
    titlePlaceholder: 'למשל: סופרמרקט, נטפליקס...',
    amountLabel: 'סכום (₪)',
    categoryLabel: 'קטגוריה',
    recurringCheckbox: 'מנוי או הוראת קבע מתמשכת',
    endDateLabel: 'חודש סיום להוראת הקבע (אופציונלי)',
    saveButton: 'שמור תנועה',
    exportCSV: 'הורד קובץ גיבוי (CSV) 📊',
    subscriptionRadar: 'רדאר מנויים והוראות קבע',
    yearlyTotal: 'עלות שנתית מצטברת:',
    systemSettings: 'הגדרות מערכת',
    themeToggle: 'מצב תצוגה',
    darkMode: 'מצב לילה 🌙',
    lightMode: 'מצב יום ☀️',
    language: 'שפה 🌐',
    savingsGoalsTitle: 'יעדי חיסכון אישיים',
    addGoal: 'הוסף יעד חדש',
    goalNamePlaceholder: 'שם היעד (למשל: רכב, חופשה...)',
    goalAmountPlaceholder: 'סכום יעד (₪)',
    smartBudgetTitle: 'תקציב חודשי חכם ומגבלות',
    totalMonthlyBudgetLabel: 'מסגרת תקציב חודשית כוללת (₪)',
    categoryLimitsTitle: 'הקצאות תקציב לקטגוריות',
    budgetExceededError: 'שגיאה: סכום ההקצאות לקטגוריות עובר את מסגרת התקציב החודשית הכוללת שהגדרת!',
    scanReceiptBtn: '📸 סרוק חשבונית עם AI',
    scanningReceipt: 'מנתח חשבונית באמצעות בינה מלאכותית...',
    scanSuccess: 'החשבונית פוענחה בהצלחה!',
    cancel: 'ביטול',
    delete: 'מחיקה',
    edit: 'עריכה'
  },
  ar: {
    appName: 'My Money',
    tagline: 'الإدارة المالية الشخصية المتقدمة',
    dashboard: 'نظرة عامة',
    transactions: 'المعاملات',
    budgets: 'الميزانية والأهداف',
    tools: 'التحليلات',
    netBalance: 'الرصيد الشهري الصافي',
    income: 'الدخل',
    expenses: 'المصروفات',
    safeSpend: 'الإنفاق اليومي الآمن',
    daysLeft: 'أيام متبقية',
    targetDate: 'تاريخ الهدف المقدر',
    noTarget: 'وفر باستمرار لحساب تاريخ الهدف',
    goalReached: 'تم تحقيق الهدف! 🎉',
    categoryBreakdown: 'توزيع المصروفات حسب الفئة',
    searchPlaceholder: 'بحث سريع...',
    noTransactions: 'لا توجد معاملات مسجلة لهذا الشهر.',
    recurringBadge: 'متكرر 🔄',
    newTransaction: 'معاملة جديدة',
    expenseType: 'مصروف 📉',
    incomeType: 'دخل 📈',
    titleLabel: 'الوصف',
    titlePlaceholder: 'مثل: سوبرماركت، نتفليكس...',
    amountLabel: 'المبلغ (₪)',
    categoryLabel: 'الفئة',
    recurringCheckbox: 'اشتراك متكرر / أمر ثابت',
    endDateLabel: 'شهر النهاية للمتكرر (اختياري)',
    saveButton: 'حفظ المعاملة',
    exportCSV: 'تصدير نسخة احتياطية (CSV) 📊',
    subscriptionRadar: 'رادار الاشتراكات والأوامر الثابتة',
    yearlyTotal: 'إجمالي الالتزام السنوي:',
    systemSettings: 'إعدادات النظام',
    themeToggle: 'وضع العرض',
    darkMode: 'الوضع الليلي 🌙',
    lightMode: 'الوضع النهاري ☀️',
    language: 'اللغة 🌐',
    savingsGoalsTitle: 'أهداف الادخار الشخصية',
    addGoal: 'إضافة هدف جديد',
    goalNamePlaceholder: 'اسم الهدف (سيارة، إجازة...)',
    goalAmountPlaceholder: 'المبلغ المستهدف (₪)',
    smartBudgetTitle: 'الميزانية الشهرية الذكية والحدود',
    totalMonthlyBudgetLabel: 'إجمالي حد الميزانية الشهرية (₪)',
    categoryLimitsTitle: 'تخصيص ميزانية الفئات',
    budgetExceededError: 'خطأ: مجموع حدود الفئات يتجاوز إجمالي الميزانية الشهرية!',
    scanReceiptBtn: '📸 مسح الفاتورة بالذكاء الاصطناعي',
    scanningReceipt: 'جاري تحليل الفاتورة...',
    scanSuccess: 'تم تحليل الفاتورة بنجاح!',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل'
  },
  es: {
    appName: 'My Money',
    tagline: 'Finanzas Personales de Élite',
    dashboard: 'Resumen',
    transactions: 'Transacciones',
    budgets: 'Presupuestos',
    tools: 'Analítica',
    netBalance: 'Balance Neto Mensual',
    income: 'Ingresos',
    expenses: 'Gastos',
    safeSpend: 'Gasto Diario Seguro',
    daysLeft: 'días restantes',
    targetDate: 'Fecha estimada',
    noTarget: 'Ahorra constantemente',
    goalReached: '¡Meta alcanzada! 🎉',
    categoryBreakdown: 'Desglose por Categoría',
    searchPlaceholder: 'Búsqueda rápida...',
    noTransactions: 'No hay transacciones este mes.',
    recurringBadge: 'Recurrente 🔄',
    newTransaction: 'Nueva Transacción',
    expenseType: 'Gasto 📉',
    incomeType: 'Ingreso 📈',
    titleLabel: 'Descripción',
    titlePlaceholder: 'ej. Supermercado, Netflix...',
    amountLabel: 'Monto (₪)',
    categoryLabel: 'Categoría',
    recurringCheckbox: 'Suscripción o orden permanente',
    endDateLabel: 'Mes de finalización (Opcional)',
    saveButton: 'Guardar',
    exportCSV: 'Exportar CSV 📊',
    subscriptionRadar: 'Radar de Suscripciones',
    yearlyTotal: 'Compromiso anual total:',
    systemSettings: 'Configuración',
    themeToggle: 'Modo de Tema',
    darkMode: 'Modo Oscuro 🌙',
    lightMode: 'Modo Claro ☀️',
    language: 'Idioma 🌐',
    savingsGoalsTitle: 'Metas de Ahorro Personales',
    addGoal: 'Agregar Meta',
    goalNamePlaceholder: 'Nombre de la meta...',
    goalAmountPlaceholder: 'Monto objetivo (₪)',
    smartBudgetTitle: 'Presupuesto Mensual Inteligente',
    totalMonthlyBudgetLabel: 'Límite Presupuestario Mensual (₪)',
    categoryLimitsTitle: 'Asignaciones por Categoría',
    budgetExceededError: 'Error: ¡La suma de los límites supera el presupuesto total!',
    scanReceiptBtn: '📸 Escanear recibo con IA',
    scanningReceipt: 'Analizando recibo...',
    scanSuccess: '¡Recibo analizado con éxito!',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar'
  }
}

const LANGUAGES_LIST = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' }
]

const INITIAL_CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6', limit: 900 },
  'שונות': { icon: '📦', color: '#64748b', limit: 500 }
}

const INITIAL_SAVINGS_GOALS = [
  { id: 1, name: '🚗 רכב חדש', target: 40000 },
  { id: 2, name: '✈️ חופשה בחו"ל', target: 8000 }
]

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('mymoney_lang') || 'he')
  const [theme, setTheme] = useState(() => localStorage.getItem('mymoney_theme') || 'dark')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringEndDate, setRecurringEndDate] = useState('')

  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef(null)

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('mymoney_savings_goals')
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS
  })
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalAmount, setNewGoalAmount] = useState('')

  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => {
    const saved = localStorage.getItem('mymoney_monthly_budget')
    return saved !== null ? Number(saved) : 9000
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })
  const [budgetError, setBudgetError] = useState('')

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => { localStorage.setItem('mymoney_lang', lang) }, [lang])
  useEffect(() => { localStorage.setItem('mymoney_theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('mymoney_savings_goals', JSON.stringify(savingsGoals)) }, [savingsGoals])
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
        category: type === 'expense' ? category : 'Income',
        is_recurring: type === 'expense' ? isRecurring : false,
        recurring_end_date: (type === 'expense' && isRecurring) ? recurringEndDate : null
      }])
      .select()

    if (error) {
      alert('Error: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
      setIsRecurring(false)
      setRecurringEndDate('')
      setIsModalOpen(false)
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setTransactions(transactions.filter(item => item.id !== id))
    }
  }

  // AI Receipt Scanner Simulation
  function handleReceiptScan(e) {
    const file = e.target.files[0]
    if (!file) return
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setTitle('סופר-פארם / קניה מרוכזת')
      setAmount('184.90')
      setCategory('מזון וסופר')
      alert(t.scanSuccess)
    }, 2000)
  }

  function handleAddGoal(e) {
    e.preventDefault()
    if (!newGoalName || !newGoalAmount) return
    const newItem = { id: Date.now(), name: newGoalName.trim(), target: parseFloat(newGoalAmount) }
    setSavingsGoals([...savingsGoals, newItem])
    setNewGoalName('')
    setNewGoalAmount('')
  }

  function deleteGoal(id) {
    setSavingsGoals(savingsGoals.filter(g => g.id !== id))
  }

  function handleUpdateTotalBudget(newTotal) {
    if (newTotal === '') {
      setMonthlyBudgetLimit(0)
      setBudgetError('')
      return
    }
    const val = parseFloat(newTotal)
    const currentSumLimits = Object.values(categories).reduce((acc, c) => acc + c.limit, 0)
    setMonthlyBudgetLimit(val)
    if (currentSumLimits > val) {
      setBudgetError(t.budgetExceededError)
    } else {
      setBudgetError('')
    }
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en
  const isRTL = lang === 'he' || lang === 'ar'

  // Virtualized expansion for recurring transactions across future months (like October, November, etc.)
  const expandedTransactions = []
  transactions.forEach(tr => {
    expandedTransactions.push(tr)
    // If it's a recurring expense, project it to subsequent months up to recurring_end_date
    if (tr.is_recurring && Number(tr.amount) < 0 && tr.created_at) {
      const startMonth = tr.created_at.slice(0, 7)
      const endMonth = tr.recurring_end_date || '2030-12' // Default far future if unbounded
      
      let curr = new Date(startMonth + '-01')
      const targetEnd = new Date(endMonth + '-01')
      curr.setMonth(curr.getMonth() + 1)

      while (curr <= targetEnd) {
        const mStr = curr.toISOString().slice(0, 7)
        expandedTransactions.push({
          ...tr,
          id: `${tr.id}_proj_${mStr}`,
          created_at: mStr + '-15T00:00:00.000Z',
          isProjected: true
        })
        curr.setMonth(curr.getMonth() + 1)
      }
    }
  })

  const monthTransactions = expandedTransactions.filter(tr => {
    const tDate = tr.created_at ? tr.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  const totalIncome = monthTransactions.filter(tr => Number(tr.amount) > 0).reduce((sum, tr) => sum + Number(tr.amount), 0)
  const totalExpense = monthTransactions.filter(tr => Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const netBalance = totalIncome - totalExpense

  const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate()
  const currentDay = selectedMonth === getCurrentMonthString() ? new Date().getDate() : 1
  const daysRemaining = Math.max(daysInMonth - currentDay + 1, 1)
  const remainingBudgetMoney = Math.max(monthlyBudgetLimit - totalExpense, 0)
  const dailySafeSpend = Math.round(remainingBudgetMoney / daysRemaining)

  const recurringExpenses = monthTransactions.filter(tr => tr.is_recurring && Number(tr.amount) < 0)
  const totalRecurringMonthly = recurringExpenses.reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const totalRecurringYearly = totalRecurringMonthly * 12

  const expensesByCategory = Object.keys(categories).map(catName => {
    const total = monthTransactions
      .filter(tr => tr.category === catName && Number(tr.amount) < 0)
      .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
    return { name: catName, total, ...categories[catName] }
  }).filter(cat => cat.total > 0)

  function calculateTargetDate(targetAmount) {
    if (netBalance <= 0) return t.noTarget
    const monthsNeeded = targetAmount / netBalance
    if (monthsNeeded > 120) return '10+ שנים'
    const targetDateObj = new Date()
    targetDateObj.setMonth(targetDateObj.getMonth() + Math.ceil(monthsNeeded))
    return targetDateObj.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { year: 'numeric', month: 'short' })
  }

  let cumulativePercent = 0
  const svgSlices = expensesByCategory.map((cat, index) => {
    const percentage = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0
    const startAngle = (cumulativePercent / 100) * 360
    cumulativePercent += percentage
    const endAngle = (cumulativePercent / 100) * 360

    const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180)
    const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180)
    const x2 = 50 + 40 * Math.cos((Math.PI * (endAngle - 90)) / 180)
    const y2 = 50 + 40 * Math.sin((Math.PI * (endAngle - 90)) / 180)
    const largeArcFlag = percentage > 50 ? 1 : 0
    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    return <path key={index} d={pathData} fill={cat.color} stroke={theme === 'dark' ? '#1e293b' : '#ffffff'} strokeWidth="1.5" />
  })

  function exportToCSV() {
    const headers = "ID,Title,Amount,Category,Date,Recurring\n"
    const rows = transactions.map(tr => `${tr.id},"${tr.title}",${tr.amount},"${tr.category || ''}",${tr.created_at || ''},${tr.is_recurring || false}`).join("\n")
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mymoney_export_${selectedMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredTransactions = monthTransactions.filter(tr => tr.title.toLowerCase().includes(searchTerm.toLowerCase()) || (tr.category && tr.category.includes(searchTerm)))

  const bgApp = theme === 'dark' ? '#0b0f19' : '#f8fafc'
  const cardBg = theme === 'dark' ? '#131c31' : '#ffffff'
  const textMain = theme === 'dark' ? '#f1f5f9' : '#0f172a'
  const textMuted = theme === 'dark' ? '#94a3b8' : '#64748b'
  const borderColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const inputBg = theme === 'dark' ? '#090d16' : '#f1f5f9'

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', padding: '16px 16px 110px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, boxSizing: 'border-box', position: 'relative' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ color: textMain, margin: '0 0 2px 0', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>{t.appName} 💼</h1>
          <span style={{ color: textMuted, fontSize: '11px', fontWeight: '500' }}>{t.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 4px', borderRadius: '10px', border: `1px solid ${borderColor}`, fontSize: '11px', fontWeight: 'bold', background: cardBg, color: textMain, outline: 'none', cursor: 'pointer' }}
            title={t.language}
          >
            {LANGUAGES_LIST.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}
            title={t.themeToggle}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Month Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        />
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ background: cardBg, padding: '16px', borderRadius: '18px', marginBottom: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <span style={{ color: textMuted, fontSize: '12px', fontWeight: '600' }}>{t.netBalance}</span>
            <div style={{ fontSize: '28px', fontWeight: '900', color: netBalance >= 0 ? '#10b981' : '#ef4444', margin: '4px 0 12px 0' }}>
              ₪{netBalance.toLocaleString()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: `1px solid ${borderColor}` }}>
              <div>
                <span style={{ color: textMuted, fontSize: '11px' }}>{t.income}</span>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#10b981' }}>+₪{totalIncome.toLocaleString()}</div>
              </div>
              <div>
                <span style={{ color: textMuted, fontSize: '11px' }}>{t.expenses}</span>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>-₪{totalExpense.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #1e3a8a, #1e1b4b)' : 'linear-gradient(135deg, #dbeafe, #eff6ff)', padding: '16px', borderRadius: '18px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: theme === 'dark' ? '#93c5fd' : '#1d4ed8', fontSize: '12px', fontWeight: '700' }}>{t.safeSpend}</span>
                <div style={{ fontSize: '24px', fontWeight: '900', color: theme === 'dark' ? '#ffffff' : '#1e40af', marginTop: '2px' }}>
                  ₪{dailySafeSpend.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>/ יום</span>
                </div>
              </div>
              <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                <span style={{ color: textMuted, fontSize: '11px' }}>{daysRemaining} {t.daysLeft}</span>
              </div>
            </div>
          </div>

          <div style={{ background: cardBg, padding: '16px', borderRadius: '18px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>{t.categoryBreakdown}</h3>
            {expensesByCategory.length === 0 ? (
              <p style={{ color: textMuted, fontSize: '12px', textAlign: 'center', margin: '20px 0' }}>{t.noTransactions}</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '90px', height: '90px', flexShrink: '0' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {svgSlices}
                  </svg>
                </div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {expensesByCategory.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                        <span>{cat.icon} {cat.name}</span>
                      </div>
                      <span style={{ fontWeight: 'bold' }}>₪{cat.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flexGrow: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px 14px', borderRadius: '14px', fontSize: '12px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ background: cardBg, padding: '24px', borderRadius: '18px', textAlign: 'center', color: textMuted, fontSize: '13px', border: `1px solid ${borderColor}` }}>
                {t.noTransactions}
              </div>
            ) : (
              filteredTransactions.map(tr => {
                const isInc = Number(tr.amount) > 0
                return (
                  <div key={tr.id} style={{ background: cardBg, padding: '12px 14px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>{isInc ? '📈' : (categories[tr.category]?.icon || '📉')}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700' }}>{tr.title}</div>
                        <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span>{tr.created_at ? tr.created_at.slice(0, 10) : ''}</span>
                          {tr.is_recurring && <span style={{ background: '#3b82f622', color: '#3b82f6', padding: '1px 6px', borderRadius: '6px', fontSize: '9px' }}>{t.recurringBadge}</span>}
                          {tr.isProjected && <span style={{ background: '#10b98122', color: '#10b981', padding: '1px 6px', borderRadius: '6px', fontSize: '9px' }}>חזוי 🔄</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: isInc ? '#10b981' : textMain }}>
                        {isInc ? `+₪${tr.amount}` : `₪${tr.amount}`}
                      </span>
                      {!tr.isProjected && (
                        <button onClick={() => deleteTransaction(tr.id)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px' }}>✕</button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BUDGETS & GOALS */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: cardBg, padding: '16px', borderRadius: '18px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '700' }}>{t.smartBudgetTitle}</h3>
            {budgetError && <div style={{ background: '#ef444422', color: '#ef4444', padding: '8px 10px', borderRadius: '8px', fontSize: '11px', marginBottom: '10px' }}>{budgetError}</div>}
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '4px' }}>{t.totalMonthlyBudgetLabel}</label>
              <input
                type="number"
                value={monthlyBudgetLimit === 0 ? '' : monthlyBudgetLimit}
                onChange={(e) => handleUpdateTotalBudget(e.target.value)}
                placeholder="5000"
                style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <h4 style={{ margin: '14px 0 8px 0', fontSize: '12px', color: textMuted }}>{t.categoryLimitsTitle}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(categories).map(catName => {
                const cat = categories[catName]
                const spent = monthTransactions
                  .filter(tr => tr.category === catName && Number(tr.amount) < 0)
                  .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
                const pct = cat.limit > 0 ? Math.min(Math.round((spent / cat.limit) * 100), 100) : 0

                return (
                  <div key={catName} style={{ background: inputBg, padding: '10px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 'bold' }}>{cat.icon} {catName}</span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ color: textMuted }}>₪{spent} /</span>
                        <input
                          type="number"
                          value={cat.limit}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value)
                            setCategories({
                              ...categories,
                              [catName]: { ...cat, limit: val }
                            })
                          }}
                          style={{ width: '70px', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '2px 6px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', outline: 'none' }}
                        />
                      </div>
                    </div>
                    <div style={{ width: '100%', background: borderColor, height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : cat.color, height: '100%', borderRadius: '3px', transition: 'width 0.3s' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: cardBg, padding: '16px', borderRadius: '18px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>{t.savingsGoalsTitle}</h3>
            
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder={t.goalNamePlaceholder}
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                style={{ background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder={t.goalAmountPlaceholder}
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  style={{ flexGrow: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                  {t.addGoal}
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savingsGoals.map(goal => {
                const targetDateFormatted = calculateTargetDate(goal.target)
                return (
                  <div key={goal.id} style={{ background: inputBg, padding: '12px', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{goal.name}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>₪{goal.target.toLocaleString()}</span>
                        <button onClick={() => deleteGoal(goal.id)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px' }}>✕</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: textMuted, paddingTop: '6px', borderTop: `1px solid ${borderColor}` }}>
                      <span>{t.targetDate}:</span>
                      <span style={{ fontWeight: 'bold', color: textMain }}>{targetDateFormatted}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TOOLS & ANALYTICS */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, padding: '16px', borderRadius: '18px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '700' }}>{t.subscriptionRadar} 📡</h3>
            <div style={{ fontSize: '12px', color: textMuted, marginBottom: '12px' }}>
              {t.yearlyTotal} <strong style={{ color: textMain, fontSize: '14px' }}>₪{totalRecurringYearly.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recurringExpenses.length === 0 ? (
                <p style={{ color: textMuted, fontSize: '12px', margin: 0 }}>אין מנויים או הוראות קבע פעילים החודש.</p>
              ) : (
                recurringExpenses.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', background: inputBg, padding: '10px', borderRadius: '10px' }}>
                    <span>{item.title}</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>₪{item.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={exportToCSV}
            style={{ width: '100%', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            {t.exportCSV}
          </button>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (+) */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ position: 'fixed', bottom: '80px', left: isRTL ? '24px' : 'auto', right: isRTL ? 'auto' : '24px', width: '60px', height: '60px', borderRadius: '30px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', fontSize: '28px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)', cursor: 'pointer', zIndex: 99, transition: 'transform 0.2s' }}
        title={t.newTransaction}
      >
        +
      </button>

      {/* BOTTOM NAVIGATION BAR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: cardBg, borderTop: `1px solid ${borderColor}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '8px 12px 18px 12px', zIndex: 98, boxShadow: '0 -10px 25px rgba(0,0,0,0.05)' }}>
        {[
          { id: 'dashboard', label: t.dashboard, icon: '📊' },
          { id: 'transactions', label: t.transactions, icon: '💳' },
          { id: 'budgets', label: t.budgets, icon: '🎯' },
          { id: 'tools', label: t.tools, icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ background: 'transparent', color: activeTab === tab.id ? '#3b82f6' : textMuted, border: 'none', padding: '6px 0', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal for New Transaction */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: cardBg, width: '100%', maxWidth: '400px', padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}`, boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '800' }}>{t.newTransaction}</h3>
            
            {/* AI Receipt Upload Section */}
            <div style={{ marginBottom: '14px' }}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleReceiptScan} 
                style={{ display: 'none' }} 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={isScanning}
                style={{ width: '100%', background: theme === 'dark' ? '#1e293b' : '#eff6ff', color: '#3b82f6', border: '1px dashed #3b82f6', padding: '10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                {isScanning ? t.scanningReceipt : t.scanReceiptBtn}
              </button>
            </div>

            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: inputBg, padding: '4px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  style={{ background: type === 'expense' ? '#ef4444' : 'transparent', color: type === 'expense' ? '#ffffff' : textMuted, border: 'none', padding: '8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.expenseType}
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  style={{ background: type === 'income' ? '#10b981' : 'transparent', color: type === 'income' ? '#ffffff' : textMuted, border: 'none', padding: '8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.incomeType}
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.titleLabel}</label>
                <input
                  type="text"
                  placeholder={t.titlePlaceholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.amountLabel}</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {type === 'expense' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.categoryLabel}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'expense' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: inputBg, padding: '10px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }}
                    />
                    <span>{t.recurringCheckbox}</span>
                  </label>

                  {isRecurring && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.endDateLabel}</label>
                      <input
                        type="month"
                        value={recurringEndDate}
                        onChange={(e) => setRecurringEndDate(e.target.value)}
                        style={{ width: '100%', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px', borderRadius: '10px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, background: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.saveButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
