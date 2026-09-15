import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const TRANSLATIONS = {
  en: {
    appName: 'My Money',
    tagline: 'Private Wealth & Household Finance',
    dashboard: 'Overview',
    transactions: 'Transactions',
    budgets: 'Budgets & Goals',
    tools: 'Tools & Analytics',
    netBalance: 'Net Monthly Balance',
    income: 'Income',
    expenses: 'Expenses',
    safeSpend: 'Daily Safe-to-Spend',
    daysLeft: 'days left',
    savingsGoal: 'Savings Goal',
    targetDate: 'Estimated Target Date',
    noTarget: 'Save consistently to calculate target date',
    goalReached: 'Goal Reached! 🎉',
    budgetLimit: 'General Budget Limit',
    categoryBreakdown: 'Expense Breakdown by Category',
    searchPlaceholder: 'Quick search...',
    noTransactions: 'No transactions recorded for this month.',
    recurringBadge: 'Recurring 🔄',
    workHours: 'work hours',
    newTransaction: 'New Transaction',
    expenseType: 'Expense 📉',
    incomeType: 'Income 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'e.g. Supermarket, Fuel...',
    amountLabel: 'Amount (₪)',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription / Fixed expense',
    saveButton: 'Save Transaction',
    exportCSV: 'Export Backup (CSV) 📊',
    subscriptionRadar: 'Subscription Radar',
    yearlyTotal: 'Total yearly commitment:',
    noSubscriptions: 'No active subscriptions this month.',
    systemSettings: 'System Settings',
    hourlyWage: 'Hourly Wage (₪)',
    categoryLimits: 'Category Limits',
    themeToggle: 'Appearance',
    darkMode: 'Dark Mode 🌙',
    lightMode: 'Light Mode ☀️',
    language: 'Language 🌐'
  },
  he: {
    appName: 'My Money',
    tagline: 'ניהול הון אישי וכלכלת בית',
    dashboard: 'סקירה כללית',
    transactions: 'תנועות',
    budgets: 'יעדים ותקציב',
    tools: 'כלים וניתוחים',
    netBalance: 'מאזן חודשי נקי',
    income: 'הכנסות',
    expenses: 'הוצאות',
    safeSpend: 'תקציב יומי מומלץ',
    daysLeft: 'ימים שנותרו',
    savingsGoal: 'יעד חיסכון',
    targetDate: 'תאריך הגעה משוער ליעד',
    noTarget: 'חסוך בעקביות כדי לחשב תאריך יעד',
    goalReached: 'היעד הושג בהצלחה! 🎉',
    budgetLimit: 'מסגרת תקציב כללית',
    categoryBreakdown: 'פילוח הוצאות לפי קטגוריות',
    searchPlaceholder: 'חיפוש מהיר...',
    noTransactions: 'אין תנועות להצגה בחודש זה.',
    recurringBadge: 'קבוע 🔄',
    workHours: 'שעות עבודה',
    newTransaction: 'הוספת תנועה חדשה',
    expenseType: 'הוצאה 📉',
    incomeType: 'הכנסה 📈',
    titleLabel: 'תיאור',
    titlePlaceholder: 'למשל: סופרמרקט, דלק...',
    amountLabel: 'סכום (₪)',
    categoryLabel: 'קטגוריה',
    recurringCheckbox: 'הוצאה קבועה / מנוי חודשי ברדאר',
    saveButton: 'שמור תנועה',
    exportCSV: 'הורד קובץ גיבוי (CSV) 📊',
    subscriptionRadar: 'רדאר מנויים והוצאות קבועות',
    yearlyTotal: 'עלות שנתית מצטברת:',
    noSubscriptions: 'אין מנויים פעילים החודש.',
    systemSettings: 'הגדרות מערכת',
    hourlyWage: 'שכר שעתי (₪)',
    categoryLimits: 'תקרת קטגוריות',
    themeToggle: 'תצוגה',
    darkMode: 'מצב לילה 🌙',
    lightMode: 'מצב יום ☀️',
    language: 'שפה 🌐'
  },
  ar: {
    appName: 'My Money',
    tagline: 'إدارة الثروة الشخصية والمنزلية',
    dashboard: 'نظرة عامة',
    transactions: 'المعاملات',
    budgets: 'الأهداف والميزانية',
    tools: 'الأدوات والتحليلات',
    netBalance: 'الرصيد الشهري الصافي',
    income: 'الدخل',
    expenses: 'المصروفات',
    safeSpend: 'الميزانية اليومية الآمنة',
    daysLeft: 'أيام متبقية',
    savingsGoal: 'هدف التوفير',
    targetDate: 'تاريخ الوصول المتوقع',
    noTarget: 'وفر باستمرار لحساب التاريخ المستهدف',
    goalReached: 'تم تحقيق الهدف! 🎉',
    budgetLimit: 'حد الميزانية العام',
    categoryBreakdown: 'تفصيل المصروفات حسب الفئة',
    searchPlaceholder: 'بحث سريع...',
    noTransactions: 'لا توجد معاملات لهذا الشهر.',
    recurringBadge: 'متكرر 🔄',
    workHours: 'ساعات العمل',
    newTransaction: 'إضافة معاملة جديدة',
    expenseType: 'مصروف 📉',
    incomeType: 'دخل 📈',
    titleLabel: 'الوصف',
    titlePlaceholder: 'مثال: سوبرماركت، وقود...',
    amountLabel: 'المبلغ',
    categoryLabel: 'الفئة',
    recurringCheckbox: 'اشتراك شهري / مصروف ثابت',
    saveButton: 'حفظ المعاملة',
    exportCSV: 'تصدير نسخة احتياطية (CSV) 📊',
    subscriptionRadar: 'رادار الاشتراكات',
    yearlyTotal: 'التكلفة السنوية الإجمالية:',
    noSubscriptions: 'لا توجد اشتراكات نشطة هذا الشهر.',
    systemSettings: 'إعدادات النظام',
    hourlyWage: 'الأجر بالساعة',
    categoryLimits: 'حدود الفئات',
    themeToggle: 'المظهر',
    darkMode: 'الوضع الليلي 🌙',
    lightMode: 'الوضع النهاري ☀️',
    language: 'اللغة 🌐'
  },
  ru: {
    appName: 'My Money',
    tagline: 'Управление личными и домашними финансами',
    dashboard: 'Обзор',
    transactions: 'Транзакции',
    budgets: 'Бюджет и цели',
    tools: 'Инструменты',
    netBalance: 'Чистый баланс за месяц',
    income: 'Доходы',
    expenses: 'Расходы',
    safeSpend: 'Лимит на сегодня',
    daysLeft: 'дней осталось',
    savingsGoal: 'Цель накопления',
    targetDate: 'Ожидаемая дата достижения цели',
    noTarget: 'Копите регулярно для расчета даты',
    goalReached: 'Цель достигнута! 🎉',
    budgetLimit: 'Общий лимит бюджета',
    categoryBreakdown: 'Расходы по категориям',
    searchPlaceholder: 'Быстрый поиск...',
    noTransactions: 'Нет транзакций за этот месяц.',
    recurringBadge: 'Регулярный 🔄',
    workHours: 'часов работы',
    newTransaction: 'Новая транзакция',
    expenseType: 'Расход 📉',
    incomeType: 'Доход 📈',
    titleLabel: 'Описание',
    titlePlaceholder: 'например: Супермаркет, Топливо...',
    amountLabel: 'Сумма',
    categoryLabel: 'Категория',
    recurringCheckbox: 'Постоянный платеж / Подписка',
    saveButton: 'Сохранить',
    exportCSV: 'Экспорт бэкапа (CSV) 📊',
    subscriptionRadar: 'Радар подписок',
    yearlyTotal: 'Годовые обязательства:',
    noSubscriptions: 'Нет активных подписок в этом месяце.',
    systemSettings: 'Системные настройки',
    hourlyWage: 'Почасовая ставка',
    categoryLimits: 'Лимиты категорий',
    themeToggle: 'Тема',
    darkMode: 'Темная 🌙',
    lightMode: 'Светлая ☀️',
    language: 'Язык 🌐'
  },
  es: {
    appName: 'My Money',
    tagline: 'Gestión de Riqueza Personal',
    dashboard: 'Resumen',
    transactions: 'Transacciones',
    budgets: 'Presupuestos',
    tools: 'Herramientas',
    netBalance: 'Balance Neto Mensual',
    income: 'Ingresos',
    expenses: 'Gastos',
    safeSpend: 'Gasto Diario Recomendado',
    daysLeft: 'días restantes',
    savingsGoal: 'Meta de Ahorro',
    targetDate: 'Fecha estimada para la meta',
    noTarget: 'Ahorra consistentemente para calcular la fecha',
    goalReached: '¡Meta alcanzada! 🎉',
    budgetLimit: 'Límite de Presupuesto',
    categoryBreakdown: 'Desglose de Gastos',
    searchPlaceholder: 'Búsqueda rápida...',
    noTransactions: 'Sin transacciones este mes.',
    recurringBadge: 'Recurrente 🔄',
    workHours: 'horas de trabajo',
    newTransaction: 'Nueva Transacción',
    expenseType: 'Gasto 📉',
    incomeType: 'Ingreso 📈',
    titleLabel: 'Descripción',
    titlePlaceholder: 'ej. Supermercado...',
    amountLabel: 'Monto',
    categoryLabel: 'Categoría',
    recurringCheckbox: 'Suscripción / Gasto fijo',
    saveButton: 'Guardar',
    exportCSV: 'Exportar CSV 📊',
    subscriptionRadar: 'Radar de Suscripciones',
    yearlyTotal: 'Compromiso anual total:',
    noSubscriptions: 'Sin suscripciones activas.',
    systemSettings: 'Configuración',
    hourlyWage: 'Salario por hora',
    categoryLimits: 'Límites por categoría',
    themeToggle: 'Tema',
    darkMode: 'Oscuro 🌙',
    lightMode: 'Claro ☀️',
    language: 'Idioma 🌐'
  },
  fr: {
    appName: 'My Money',
    tagline: 'Gestion de Patrimoine Personnel',
    dashboard: 'Aperçu',
    transactions: 'Transactions',
    budgets: 'Budgets & Objectifs',
    tools: 'Outils',
    netBalance: 'Solde Mensuel Net',
    income: 'Revenus',
    expenses: 'Dépenses',
    safeSpend: 'Dépense Quotidienne Conseillée',
    daysLeft: 'jours restants',
    savingsGoal: 'Objectif d\'épargne',
    targetDate: 'Date cible estimée',
    noTarget: 'Épargnez régulièrement pour calculer la date',
    goalReached: 'Objectif atteint ! 🎉',
    budgetLimit: 'Limite de Budget Général',
    categoryBreakdown: 'Répartition par Catégorie',
    searchPlaceholder: 'Recherche...',
    noTransactions: 'Aucune transaction ce mois-ci.',
    recurringBadge: 'Récurrent 🔄',
    workHours: 'heures de travail',
    newTransaction: 'Nouvelle Transaction',
    expenseType: 'Dépense 📉',
    incomeType: 'Revenu 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'ex. Supermarché...',
    amountLabel: 'Montant',
    categoryLabel: 'Catégorie',
    recurringCheckbox: 'Abonnement / Dépense fixe',
    saveButton: 'Enregistrer',
    exportCSV: 'Exporter CSV 📊',
    subscriptionRadar: 'Radar des Abonnements',
    yearlyTotal: 'Engagement annuel total:',
    noSubscriptions: 'Aucun abonnement actif.',
    systemSettings: 'Paramètres',
    hourlyWage: 'Taux horaire',
    categoryLimits: 'Limites de catégories',
    themeToggle: 'Thème',
    darkMode: 'Sombre 🌙',
    lightMode: 'Clair ☀️',
    language: 'Langue 🌐'
  },
  de: {
    appName: 'My Money',
    tagline: 'Persönliches Finanzmanagement',
    dashboard: 'Übersicht',
    transactions: 'Transaktionen',
    budgets: 'Budgets & Ziele',
    tools: 'Werkzeuge',
    netBalance: 'Nettomonatsbilanz',
    income: 'Einnahmen',
    expenses: 'Ausgaben',
    safeSpend: 'Empfohlenes Tagesbudget',
    daysLeft: 'verbleibende Tage',
    savingsGoal: 'Sparziel',
    targetDate: 'Voraussichtliches Zieldatum',
    noTarget: 'Sparen Sie regelmäßig, um das Datum zu berechnen',
    goalReached: 'Ziel erreicht! 🎉',
    budgetLimit: 'Gesamtbudgetlimit',
    categoryBreakdown: 'Ausgaben nach Kategorien',
    searchPlaceholder: 'Schnellsuche...',
    noTransactions: 'Keine Transaktionen diesen Monat.',
    recurringBadge: 'Wiederkehrend 🔄',
    workHours: 'Arbeitsstunden',
    newTransaction: 'Neue Transaktion',
    expenseType: 'Ausgabe 📉',
    incomeType: 'Einnahme 📈',
    titleLabel: 'Beschreibung',
    titlePlaceholder: 'z.B. Supermarkt...',
    amountLabel: 'Betrag',
    categoryLabel: 'Kategorie',
    recurringCheckbox: 'Abo / Fixkosten',
    saveButton: 'Speichern',
    exportCSV: 'CSV Export 📊',
    subscriptionRadar: 'Abo-Radar',
    yearlyTotal: 'Gesamtverpflichtung pro Jahr:',
    noSubscriptions: 'Keine aktiven Abos.',
    systemSettings: 'Systemeinstellungen',
    hourlyWage: 'Stundenlohn',
    categoryLimits: 'Kategorielimits',
    themeToggle: 'Design',
    darkMode: 'Dunkel 🌙',
    lightMode: 'Hell ☀️',
    language: 'Sprache 🌐'
  },
  it: {
    appName: 'My Money',
    tagline: 'Gestione Finanziaria Personale',
    dashboard: 'Panoramica',
    transactions: 'Transazioni',
    budgets: 'Budget e Obiettivi',
    tools: 'Strumenti',
    netBalance: 'Bilancio Netto Mensile',
    income: 'Entrate',
    expenses: 'Uscite',
    safeSpend: 'Spesa Giornaliera Consigliata',
    daysLeft: 'giorni rimanenti',
    savingsGoal: 'Obiettivo di Risparmio',
    targetDate: 'Data stimata di raggiungimento',
    noTarget: 'Risparmia regolarmente per calcolare la data',
    goalReached: 'Obiettivo raggiunto! 🎉',
    budgetLimit: 'Limite Budget Generale',
    categoryBreakdown: 'Ripartizione Spese',
    searchPlaceholder: 'Ricerca rapida...',
    noTransactions: 'Nessuna transazione questo mese.',
    recurringBadge: 'Ricorrente 🔄',
    workHours: 'ore di lavoro',
    newTransaction: 'Nuova Transazione',
    expenseType: 'Spesa 📉',
    incomeType: 'Entrata 📈',
    titleLabel: 'Descrizione',
    titlePlaceholder: 'es. Supermercato...',
    amountLabel: 'Importo',
    categoryLabel: 'Categoria',
    recurringCheckbox: 'Abbonamento / Spesa fissa',
    saveButton: 'Salva',
    exportCSV: 'Esporta CSV 📊',
    subscriptionRadar: 'Radar Abbonamenti',
    yearlyTotal: 'Impegno annuale totale:',
    noSubscriptions: 'Nessun abbonamento attivo.',
    systemSettings: 'Impostazioni',
    hourlyWage: 'Tariffa oraria',
    categoryLimits: 'Limiti categorie',
    themeToggle: 'Tema',
    darkMode: 'Scuro 🌙',
    lightMode: 'Chiaro ☀️',
    language: 'Lingua 🌐'
  },
  zh: {
    appName: 'My Money',
    tagline: '个人财富与家庭财务管理',
    dashboard: '概览',
    transactions: '交易记录',
    budgets: '预算与目标',
    tools: '工具与分析',
    netBalance: '本月净结余',
    income: '收入',
    expenses: '支出',
    safeSpend: '每日安全支出额',
    daysLeft: '剩余天数',
    savingsGoal: '储蓄目标',
    targetDate: '预计达成日期',
    noTarget: '持续储蓄以计算目标日期',
    goalReached: '目标达成！ 🎉',
    budgetLimit: '总预算限额',
    categoryBreakdown: '按类别支出的明细',
    searchPlaceholder: '快速搜索...',
    noTransactions: '本月暂无交易记录。',
    recurringBadge: '定期 🔄',
    workHours: '工作小时',
    newTransaction: '新增交易',
    expenseType: '支出 📉',
    incomeType: '收入 📈',
    titleLabel: '描述',
    titlePlaceholder: '例如：超市、燃油...',
    amountLabel: '金额',
    categoryLabel: '类别',
    recurringCheckbox: '定期订阅 / 固定支出',
    saveButton: '保存交易',
    exportCSV: '导出备份 (CSV) 📊',
    subscriptionRadar: '订阅雷达',
    yearlyTotal: '年度总承诺：',
    noSubscriptions: '本月没有活跃订阅。',
    systemSettings: '系统设置',
    hourlyWage: '时薪',
    categoryLimits: '类别限额',
    themeToggle: '外观',
    darkMode: '深色模式 🌙',
    lightMode: '浅色模式 ☀️',
    language: '语言 🌐'
  },
  ja: {
    appName: 'My Money',
    tagline: 'パーソナル資産管理',
    dashboard: '概要',
    transactions: '取引履歴',
    budgets: '予算と目標',
    tools: 'ツール',
    netBalance: '今月の純残高',
    income: '収入',
    expenses: '支出',
    safeSpend: '本日の推奨支出',
    daysLeft: '残り日数',
    savingsGoal: '貯蓄目標',
    targetDate: '目標達成予定日',
    noTarget: '継続して貯蓄して目標日を計算',
    goalReached: '目標達成！ 🎉',
    budgetLimit: '全体予算限度額',
    categoryBreakdown: 'カテゴリ別支出',
    searchPlaceholder: 'クイック検索...',
    noTransactions: '今月の取引はありません。',
    recurringBadge: '定期 🔄',
    workHours: '労働時間',
    newTransaction: '新規取引',
    expenseType: '支出 📉',
    incomeType: '収入 📈',
    titleLabel: '説明',
    titlePlaceholder: '例: スーパー、ガソリン...',
    amountLabel: '金額',
    categoryLabel: 'カテゴリ',
    recurringCheckbox: '定期的なサブスク / 固定費',
    saveButton: '保存する',
    exportCSV: 'CSVエクスポート 📊',
    subscriptionRadar: 'サブスクレーダー',
    yearlyTotal: '年間合計負担:',
    noSubscriptions: '今月の有効なサブスクはありません。',
    systemSettings: 'システム設定',
    hourlyWage: '時給',
    categoryLimits: 'カテゴリ制限',
    themeToggle: '外観',
    darkMode: 'ダークモード 🌙',
    lightMode: 'ライトモード ☀️',
    language: '言語 🌐'
  },
  pt: {
    appName: 'My Money',
    tagline: 'Gestão de Patrimônio Pessoal',
    dashboard: 'Visão Geral',
    transactions: 'Transações',
    budgets: 'Orçamentos e Metas',
    tools: 'Ferramentas',
    netBalance: 'Saldo Mensal Líquido',
    income: 'Receitas',
    expenses: 'Despesas',
    safeSpend: 'Gasto Diário Recomendado',
    daysLeft: 'dias restantes',
    savingsGoal: 'Meta de Poupança',
    targetDate: 'Data estimada para a meta',
    noTarget: 'Poupe consistentemente para calcular a data',
    goalReached: 'Meta alcançada! 🎉',
    budgetLimit: 'Limite de Orçamento Geral',
    categoryBreakdown: 'Detalhamento por Categoria',
    searchPlaceholder: 'Busca rápida...',
    noTransactions: 'Nenhuma transação neste mês.',
    recurringBadge: 'Recorrente 🔄',
    workHours: 'horas de trabalho',
    newTransaction: 'Nova Transação',
    expenseType: 'Despesa 📉',
    incomeType: 'Receita 📈',
    titleLabel: 'Descrição',
    titlePlaceholder: 'ex. Supermercado, Combustível...',
    amountLabel: 'Valor',
    categoryLabel: 'Categoria',
    recurringCheckbox: 'Assinatura / Despesa fixa',
    saveButton: 'Salvar',
    exportCSV: 'Exportar Backup (CSV) 📊',
    subscriptionRadar: 'Radar de Assinaturas',
    yearlyTotal: 'Compromisso anual total:',
    noSubscriptions: 'Sem assinaturas ativas este mês.',
    systemSettings: 'Configurações',
    hourlyWage: 'Salário por Hora',
    categoryLimits: 'Limites de Categorias',
    themeToggle: 'Aparência',
    darkMode: 'Modo Escuro 🌙',
    lightMode: 'Modo Claro ☀️',
    language: 'Idioma 🌐'
  }
}

const INITIAL_CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#059669', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#2563eb', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#d97706', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#db2777', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#7c3aed', limit: 900 },
  'שונות': { icon: '📦', color: '#475569', limit: 500 }
}

export default function App() {
  const [lang, setLang] = useState('en') // ברירת מחדל אנגלית לפי דרישתך
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

  const [savingsGoalAmount, setSavingsGoalAmount] = useState(() => Number(localStorage.getItem('mymoney_savings_amount')) || 50000)
  const [savingsGoalName, setSavingsGoalName] = useState(() => localStorage.getItem('mymoney_savings_name') || 'Dream Vacation / Wealth Growth ✈️')
  const [hourlyWage, setHourlyWage] = useState(() => Number(localStorage.getItem('mymoney_hourly_wage')) || 60)
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => Number(localStorage.getItem('mymoney_monthly_budget')) || 9000)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => { localStorage.setItem('mymoney_theme', theme) }, [theme])
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
        category: type === 'expense' ? category : 'Income',
        is_recurring: type === 'expense' ? isRecurring : false
      }])
      .select()

    if (error) {
      alert('Error: ' + error.message)
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

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en
  const isRTL = lang === 'he' || lang === 'ar'

  const monthTransactions = transactions.filter(tr => {
    const tDate = tr.created_at ? tr.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  const totalIncome = monthTransactions.filter(tr => Number(tr.amount) > 0).reduce((sum, tr) => sum + Number(tr.amount), 0)
  const totalExpense = monthTransactions.filter(tr => Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const netBalance = totalIncome - totalExpense

  // חישוב תאריך הגעה משוער ליעד החיסכון
  let targetDateString = ''
  if (netBalance > 0) {
    const remainingToSave = Math.max(savingsGoalAmount - netBalance, 0) // הנחה גסה לפי חסכון חודשי נוכחי
    const monthsNeeded = Math.ceil(remainingToSave / netBalance)
    if (monthsNeeded <= 0) {
      targetDateString = t.goalReached
    } else {
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + monthsNeeded)
      targetDateString = futureDate.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { month: 'long', year: 'numeric' })
    }
  } else {
    targetDateString = t.noTarget
  }

  const budgetPercentage = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100)
  let budgetColor = theme === 'dark' ? '#059669' : '#10b981'
  if (budgetPercentage > 75) budgetColor = '#d97706'
  if (budgetPercentage >= 100) budgetColor = '#dc2626'

  const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate()
  const currentDay = new Date().getDate()
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

  // עיצוב לפי מצב יום/לילה פרימיום
  const bgApp = theme === 'dark' ? '#0f172a' : '#f8fafc'
  const cardBg = theme === 'dark' ? '#1e293b' : '#ffffff'
  const textMain = theme === 'dark' ? '#f8fafc' : '#0f172a'
  const textMuted = theme === 'dark' ? '#94a3b8' : '#64748b'
  const borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'
  const inputBg = theme === 'dark' ? '#0b0f19' : '#f1f5f9'

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', minHeight: '92vh', padding: '20px 16px 90px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${borderColor}`, position: 'top', boxSizing: 'border-box', transition: 'all 0.3s ease' }}>
      
      {/* כותרת עליונה */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ color: textMain, margin: '0 0 2px 0', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>{t.appName} 💼</h1>
          <span style={{ color: textMuted, fontSize: '11px', fontWeight: '500' }}>{t.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* בורר שפות */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '11px', fontWeight: 'bold', background: inputBg, color: textMain, outline: 'none' }}
          >
            <option value="en">English</option>
            <option value="he">עברית</option>
            <option value="ar">العربية</option>
            <option value="ru">Русский</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="pt">Português</option>
          </select>

          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '11px', fontWeight: 'bold', background: inputBg, color: textMain, outline: 'none' }}
          />
        </div>
      </header>

      {/* ================= 1. סקירה וגרפים (Dashboard) ================= */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* כרטיס יתרה מרכזי בסגנון בנקאי יוקרתי */}
          <div style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', border: `1px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            <span style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '4px', fontWeight: '600' }}>{t.netBalance}</span>
            <span style={{ fontSize: '32px', fontWeight: '900', color: netBalance >= 0 ? (theme === 'dark' ? '#38bdf8' : '#0284c7') : '#dc2626', letterSpacing: '-1px' }}>
              ₪{netBalance.toLocaleString()}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${borderColor}` }}>
              <div>
                <span style={{ fontSize: '11px', color: textMuted, display: 'block' }}>{t.income}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#059669' }}>+₪{totalIncome.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: textMuted, display: 'block' }}>{t.expenses}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#dc2626' }}>-₪{totalExpense.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ווידג'ט תקציב יומי חכם */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11px', color: theme === 'dark' ? '#38bdf8' : '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>💡 {t.safeSpend}</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: textMain }}>₪{dailySafeSpend.toLocaleString()} <span style={{ fontSize: '11px', color: textMuted, fontWeight: 'normal' }}>/ day</span></span>
            </div>
            <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
              <span style={{ fontSize: '10px', color: textMuted, display: 'block' }}>{t.daysLeft}</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: textMain }}>{daysRemaining}</span>
            </div>
          </div>

          {/* יעד חיסכון ותאריך יעד מדויק */}
          <div style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #2563eb 100%, #1d4ed8 0%)', padding: '16px 18px', borderRadius: '16px', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>🎯 {savingsGoalName}</span>
              <span style={{ fontSize: '13px', fontWeight: '800' }}>₪{savingsGoalAmount.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#bfdbfe', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📅 {t.targetDate}:</span>
              <strong style={{ color: '#ffffff' }}>{targetDateString}</strong>
            </div>
          </div>

          {/* גרף השוואת הכנסות מול הוצאות (ויזואליזציה פיננסית) */}
          <div style={{ background: cardBg, padding: '16px 18px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', color: textMain, margin: '0 0 10px 0', fontWeight: '700' }}>📊 הכנסות מול הוצאות בפועל</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px', color: textMuted }}>
                  <span>{t.income}</span>
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>₪{totalIncome}</span>
                </div>
                <div style={{ background: inputBg, borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#059669', width: `${totalIncome > 0 ? Math.min(Math.round((totalIncome / (totalIncome + totalExpense || 1)) * 100), 100) : 0}%`, height: '100%' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px', color: textMuted }}>
                  <span>{t.expenses}</span>
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>₪{totalExpense}</span>
                </div>
                <div style={{ background: inputBg, borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#dc2626', width: `${totalIncome + totalExpense > 0 ? Math.min(Math.round((totalExpense / (totalIncome + totalExpense || 1)) * 100), 100) : 0}%`, height: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* מד תקציב כללי */}
          <div style={{ background: cardBg, padding: '16px 18px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '12px', color: textMain }}>📊 {t.budgetLimit}</span>
              <span style={{ fontSize: '11px', color: textMuted }}>₪{totalExpense} / ₪{monthlyBudgetLimit}</span>
            </div>
            <div style={{ background: inputBg, borderRadius: '6px', height: '8px', width: '100%', overflow: 'hidden' }}>
              <div style={{ background: budgetColor, width: `${budgetPercentage}%`, height: '100%', transition: 'width 0.4s ease' }}></div>
            </div>
          </div>

          {/* פילוח לפי קטגוריות */}
          <div style={{ background: cardBg, padding: '16px 18px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', color: textMain, margin: '0 0 10px 0', fontWeight: '700' }}>📈 {t.categoryBreakdown}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {expensesByCategory.map(cat => {
                const catPercentage = cat.limit > 0 ? Math.min(Math.round((cat.total / cat.limit) * 100), 100) : 0
                return (
                  <div key={cat.name} style={{ background: inputBg, padding: '8px 10px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: textMain }}>
                        {cat.icon} {cat.name}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: cat.total > 0 ? '#dc2626' : textMuted }}>
                        ₪{cat.total.toLocaleString()} <span style={{ fontSize: '10px', color: textMuted, fontWeight: 'normal' }}>/ ₪{cat.limit}</span>
                      </span>
                    </div>
                    <div style={{ background: cardBg, borderRadius: '4px', height: '5px', width: '100%', overflow: 'hidden' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', color: textMain, margin: 0 }}>{t.transactions}</h3>
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '11px', width: '130px', background: inputBg, color: textMain, outline: 'none' }}
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <p style={{ color: textMuted, textAlign: 'center', padding: '40px', background: cardBg, borderRadius: '14px', border: `1px solid ${borderColor}`, fontSize: '12px' }}>{t.noTransactions}</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredTransactions.map((item) => {
                const isIncome = Number(item.amount) > 0
                const catInfo = categories[item.category] || { icon: '📦', color: '#475569' }
                const costInHours = !isIncome && hourlyWage > 0 ? (Math.abs(Number(item.amount)) / hourlyWage).toFixed(1) : null

                return (
                  <li key={item.id} style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '10px 12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', background: inputBg, padding: '6px', borderRadius: '8px', border: `1px solid ${borderColor}` }}>{isIncome ? '💰' : catInfo.icon}</span>
                      <div>
                        <span style={{ fontWeight: '600', color: textMain, display: 'block', fontSize: '12px' }}>
                          {item.title} {item.is_recurring && <span style={{ fontSize: '9px', background: '#1d4ed8', color: '#ffffff', padding: '1px 5px', borderRadius: '4px', marginInlineStart: '4px' }}>{t.recurringBadge}</span>}
                        </span>
                        <span style={{ fontSize: '10px', color: textMuted }}>
                          {item.category || 'General'} {costInHours && `• ⏳ ${costInHours} ${t.workHours}`}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: isIncome ? '#059669' : '#dc2626' }}>
                        {isIncome ? `+₪${Number(item.amount).toLocaleString()}` : `₪${Number(item.amount).toLocaleString()}`}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(item.id)}
                        style={{ background: inputBg, border: `1px solid ${borderColor}`, color: textMuted, cursor: 'pointer', fontSize: '12px', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', color: textMain, margin: '0 0 8px 0', fontWeight: '700' }}>🎯 {t.savingsGoal}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                value={savingsGoalName} 
                onChange={(e) => setSavingsGoalName(e.target.value)} 
                placeholder="Goal Name..."
                style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, boxSizing: 'border-box', outline: 'none' }}
              />
              <input 
                type="number" 
                value={savingsGoalAmount} 
                onChange={(e) => setSavingsGoalAmount(Number(e.target.value))} 
                placeholder="Amount..."
                style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          {/* הגדרות עיצוב ומערכת */}
          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', color: textMain, margin: '0 0 10px 0', fontWeight: '700' }}>⚙️ {t.systemSettings}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: `1px solid ${borderColor}` }}>
              <span style={{ fontSize: '12px', color: textMain }}>{t.themeToggle}</span>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{ background: inputBg, border: `1px solid ${borderColor}`, color: textMain, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
              >
                {theme === 'dark' ? t.lightMode : t.darkMode}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px' }}>{t.budgetLimit} (₪)</label>
                <input 
                  type="number" 
                  value={monthlyBudgetLimit} 
                  onChange={(e) => setMonthlyBudgetLimit(Number(e.target.value))} 
                  style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px' }}>{t.hourlyWage} (₪)</label>
                <input 
                  type="number" 
                  value={hourlyWage} 
                  onChange={(e) => setHourlyWage(Number(e.target.value))} 
                  style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', color: textMain, margin: '0 0 8px 0', fontWeight: '700' }}>{t.categoryLimits}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.keys(categories).map(catName => (
                <div key={catName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: inputBg, padding: '6px 10px', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: '12px', color: textMain }}>{categories[catName].icon} {catName}</span>
                  <input
                    type="number"
                    value={categories[catName].limit}
                    onChange={(e) => {
                      const val = e.target.value
                      setCategories(prev => ({ ...prev, [catName]: { ...prev[catName], limit: Number(val) || 0 } }))
                    }}
                    style={{ width: '65px', padding: '4px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: cardBg, color: textMain, fontSize: '12px', textAlign: 'center', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. כלים מתקדמים (Tools) ================= */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', color: textMain, margin: '0 0 4px 0', fontWeight: '700' }}>📡 {t.subscriptionRadar}</h3>
            <p style={{ fontSize: '11px', color: textMuted, margin: '0 0 10px 0' }}>{t.yearlyTotal} <b style={{ color: '#dc2626' }}>₪{totalRecurringYearly.toLocaleString()}</b></p>
            {recurringExpenses.length === 0 ? (
              <p style={{ fontSize: '11px', color: textMuted, margin: 0 }}>{t.noSubscriptions}</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recurringExpenses.map(item => (
                  <li key={item.id} style={{ background: inputBg, padding: '8px 10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', border: `1px solid ${borderColor}` }}>
                    <span style={{ color: textMain }}>{item.title}</span>
                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>₪{Math.abs(Number(item.amount))} / mo</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}`, textAlign: 'center' }}>
            <button 
              onClick={exportToCSV}
              style={{ width: '100%', background: '#2563eb', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
            >
              {t.exportCSV}
            </button>
          </div>

        </div>
      )}

      {/* ================= כפתור הוספה מהירה צף (FAB) ================= */}
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ position: 'fixed', bottom: '75px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#ffffff', border: 'none', width: '52px', height: '52px', borderRadius: '50%', fontSize: '26px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      >
        +
      </button>

      {/* ================= מודל הוספת תנועה ================= */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, padding: 0 }}>
          <div style={{ background: cardBg, width: '100%', maxWidth: '480px', padding: '20px 18px 30px 18px', borderRadius: '24px 24px 0 0', borderTop: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', color: textMain, margin: 0, fontWeight: '700' }}>{t.newTransaction}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: textMuted, fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={addTransaction}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: type === 'expense' ? '#dc2626' : inputBg, color: type === 'expense' ? '#ffffff' : textMuted, fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.expenseType}
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: type === 'income' ? '#059669' : inputBg, color: type === 'income' ? '#ffffff' : textMuted, fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.incomeType}
                </button>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: textMuted }}>{t.titleLabel}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.titlePlaceholder}
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '12px', background: inputBg, color: textMain, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: textMuted }}>{t.amountLabel}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '12px', background: inputBg, color: textMain, outline: 'none' }}
                />
              </div>

              {type === 'expense' && (
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: textMuted }}>{t.categoryLabel}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '12px', background: inputBg, color: textMain, outline: 'none' }}
                  >
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'expense' && (
                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="recurringModal"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                  <label htmlFor="recurringModal" style={{ fontSize: '11px', color: textMain, cursor: 'pointer' }}>
                    {t.recurringCheckbox}
                  </label>
                </div>
              )}

              <button type="submit" style={{ width: '100%', background: type === 'expense' ? '#dc2626' : '#059669', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                {t.saveButton}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ================= סרגל ניווט תחתון ================= */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: cardBg, borderTop: `1px solid ${borderColor}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '8px 0 14px 0', zIndex: 90 }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#2563eb' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
        >
          <span style={{ fontSize: '16px' }}>📊</span>
          {t.dashboard}
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{ background: 'none', border: 'none', color: activeTab === 'transactions' ? '#2563eb' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
        >
          <span style={{ fontSize: '16px' }}>💳</span>
          {t.transactions}
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          style={{ background: 'none', border: 'none', color: activeTab === 'budgets' ? '#2563eb' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
        >
          <span style={{ fontSize: '16px'}}}}
        >
          <span style={{ fontSize: '16px' }}>🎯</span>
          {t.budgets}
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          style={{ background: 'none', border: 'none', color: activeTab === 'tools' ? '#2563eb' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
        >
          <span style={{ fontSize: '16px' }}>⚡</span>
          {t.tools}
        </button>
      </nav>

    </div>
  )
}
