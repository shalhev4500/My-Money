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
    titlePlaceholder: 'e.g. Supermarket, Fuel...',
    amountLabel: 'Amount (₪)',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription / Fixed expense',
    saveButton: 'Save Transaction',
    exportCSV: 'Export Backup (CSV) 📊',
    subscriptionRadar: 'Subscription Radar',
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
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit'
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
    targetDate: 'תאריך הגעה משוער ליעד',
    noTarget: 'חסוך בעקביות כדי לחשב תאריך יעד',
    goalReached: 'היעד הושג בהצלחה! 🎉',
    categoryBreakdown: 'פילוח הוצאות לפי קטגוריות',
    searchPlaceholder: 'חיפוש מהיר...',
    noTransactions: 'אין תנועות להצגה בחודש זה.',
    recurringBadge: 'קבוע 🔄',
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
    cancel: 'ביטול',
    delete: 'מחיקה',
    edit: 'עריכה'
  },
  ar: {
    appName: 'My Money',
    tagline: 'الإدارة المالية الشخصية',
    dashboard: 'نظرة عامة',
    transactions: 'المعاملات',
    budgets: 'الميزانية والأهداف',
    tools: 'الأدوات والتحليلات',
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
    titlePlaceholder: 'مثل: سوبرماركت، وقود...',
    amountLabel: 'المبلغ (₪)',
    categoryLabel: 'الفئة',
    recurringCheckbox: 'اشتراك متكرر / مصروف ثابت',
    saveButton: 'حفظ المعاملة',
    exportCSV: 'تصدير نسخة احتياطية (CSV) 📊',
    subscriptionRadar: 'رادار الاشتراكات',
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
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل'
  },
  es: {
    appName: 'My Money',
    tagline: 'Riqueza Privada y Finanzas',
    dashboard: 'Resumen',
    transactions: 'Transacciones',
    budgets: 'Presupuestos y Metas',
    tools: 'Herramientas',
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
    titlePlaceholder: 'ej. Supermercado...',
    amountLabel: 'Monto (₪)',
    categoryLabel: 'Categoría',
    recurringCheckbox: 'Suscripción recurrente / Gasto fijo',
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
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar'
  },
  fr: {
    appName: 'My Money',
    tagline: 'Finances Personnelles',
    dashboard: 'Aperçu',
    transactions: 'Transactions',
    budgets: 'Budgets & Objectifs',
    tools: 'Outils',
    netBalance: 'Solde Net Mensuel',
    income: 'Revenus',
    expenses: 'Dépenses',
    safeSpend: 'Dépense Sûre Quotidienne',
    daysLeft: 'jours restants',
    targetDate: 'Date estimée',
    noTarget: 'Épargnez régulièrement',
    goalReached: 'Objectif Atteint ! 🎉',
    categoryBreakdown: 'Répartition par Catégorie',
    searchPlaceholder: 'Recherche rapide...',
    noTransactions: 'Aucune transaction ce mois-ci.',
    recurringBadge: 'Récurrent 🔄',
    newTransaction: 'Nouvelle Transaction',
    expenseType: 'Dépense 📉',
    incomeType: 'Revenu 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'ex. Supermarché...',
    amountLabel: 'Montant (₪)',
    categoryLabel: 'Catégorie',
    recurringCheckbox: 'Abonnement récurrent',
    saveButton: 'Enregistrer',
    exportCSV: 'Exporter CSV 📊',
    subscriptionRadar: 'Radar des Abonnements',
    yearlyTotal: 'Engagement annuel total:',
    systemSettings: 'Paramètres',
    themeToggle: 'Mode d’affichage',
    darkMode: 'Mode Sombre 🌙',
    lightMode: 'Mode Clair ☀️',
    language: 'Langue 🌐',
    savingsGoalsTitle: 'Objectifs d’Épargne Personnels',
    addGoal: 'Ajouter un Objectif',
    goalNamePlaceholder: 'Nom de l’objectif...',
    goalAmountPlaceholder: 'Montant cible (₪)',
    smartBudgetTitle: 'Budget Mensuel Intelligent',
    totalMonthlyBudgetLabel: 'Limite Budgétaire Mensuelle (₪)',
    categoryLimitsTitle: 'Limites par Catégorie',
    budgetExceededError: 'Erreur : La somme des limites dépasse le budget total !',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier'
  },
  de: {
    appName: 'My Money',
    tagline: 'Privates Vermögen & Haushaltsfinanzen',
    dashboard: 'Übersicht',
    transactions: 'Transaktionen',
    budgets: 'Budgets & Ziele',
    tools: 'Werkzeuge',
    netBalance: 'Nettosaldo',
    income: 'Einnahmen',
    expenses: 'Ausgaben',
    safeSpend: 'Tägliches Budget',
    daysLeft: 'Tage übrig',
    targetDate: 'Geschätztes Zieldatum',
    noTarget: 'Regelmäßig sparen',
    goalReached: 'Ziel erreicht! 🎉',
    categoryBreakdown: 'Kategorienübersicht',
    searchPlaceholder: 'Schnellsuche...',
    noTransactions: 'Keine Transaktionen diesen Monat.',
    recurringBadge: 'Wiederkehrend 🔄',
    newTransaction: 'Neue Transaktion',
    expenseType: 'Ausgabe 📉',
    incomeType: 'Einnahme 📈',
    titleLabel: 'Beschreibung',
    titlePlaceholder: 'z.B. Supermarkt...',
    amountLabel: 'Betrag (₪)',
    categoryLabel: 'Kategorie',
    recurringCheckbox: 'Wiederkehrendes Abo',
    saveButton: 'Speichern',
    exportCSV: 'CSV Exportieren 📊',
    subscriptionRadar: 'Abo-Radar',
    yearlyTotal: 'Gesamte jährliche Bindung:',
    systemSettings: 'Einstellungen',
    themeToggle: 'Design-Modus',
    darkMode: 'Dunkelmodus 🌙',
    lightMode: 'Hellmodus ☀️',
    language: 'Sprache 🌐',
    savingsGoalsTitle: 'Persönliche Sparziele',
    addGoal: 'Ziel hinzufügen',
    goalNamePlaceholder: 'Zielname...',
    goalAmountPlaceholder: 'Zielbetrag (₪)',
    smartBudgetTitle: 'Intelligentes Monatsbudget',
    totalMonthlyBudgetLabel: 'Monatliches Gesamtbudget (₪)',
    categoryLimitsTitle: 'Kategorienlimits',
    budgetExceededError: 'Fehler: Die Summe der Limits übersteigt das Gesamtbudget!',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten'
  },
  it: {
    appName: 'My Money',
    tagline: 'Finanza Personale',
    dashboard: 'Panoramica',
    transactions: 'Transazioni',
    budgets: 'Budget e Obiettivi',
    tools: 'Strumenti',
    netBalance: 'Bilancio Netto',
    income: 'Entrate',
    expenses: 'Uscite',
    safeSpend: 'Spesa Sicura Giornaliera',
    daysLeft: 'giorni rimanenti',
    targetDate: 'Data stimata',
    noTarget: 'Risparmia costantemente',
    goalReached: 'Obiettivo Raggiunto! 🎉',
    categoryBreakdown: 'Ripartizione per Categoria',
    searchPlaceholder: 'Ricerca rapida...',
    noTransactions: 'Nessuna transazione questo mese.',
    recurringBadge: 'Ricorrente 🔄',
    newTransaction: 'Nuova Transazione',
    expenseType: 'Spesa 📉',
    incomeType: 'Entrata 📈',
    titleLabel: 'Descrizione',
    titlePlaceholder: 'es. Supermercato...',
    amountLabel: 'Importo (₪)',
    categoryLabel: 'Categoria',
    recurringCheckbox: 'Abbonamento ricorrente',
    saveButton: 'Salva',
    exportCSV: 'Esporta CSV 📊',
    subscriptionRadar: 'Radar Abbonamenti',
    yearlyTotal: 'Impegno annuale totale:',
    systemSettings: 'Impostazioni',
    themeToggle: 'Modalità Tema',
    darkMode: 'Modalità Scura 🌙',
    lightMode: 'Modalità Chiara ☀️',
    language: 'Lingua 🌐',
    savingsGoalsTitle: 'Obiettivi di Risparmio Personali',
    addGoal: 'Aggiungi Obiettivo',
    goalNamePlaceholder: 'Nome obiettivo...',
    goalAmountPlaceholder: 'Importo obiettivo (₪)',
    smartBudgetTitle: 'Budget Mensile Intelligente',
    totalMonthlyBudgetLabel: 'Limite Budget Mensile (₪)',
    categoryLimitsTitle: 'Limiti per Categoria',
    budgetExceededError: 'Errore: La somma dei limiti supera il budget totale!',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica'
  },
  ru: {
    appName: 'My Money',
    tagline: 'Личные финансы и богатство',
    dashboard: 'Обзор',
    transactions: 'Транзакции',
    budgets: 'Бюджет и цели',
    tools: 'Инструменты',
    netBalance: 'Чистый месячный баланс',
    income: 'Доходы',
    expenses: 'Расходы',
    safeSpend: 'Дневной лимит трат',
    daysLeft: 'дней осталось',
    targetDate: 'Ориентировочная дата цели',
    noTarget: 'Копите регулярно',
    goalReached: 'Цель достигнута! 🎉',
    categoryBreakdown: 'Расходы по категориям',
    searchPlaceholder: 'Быстрый поиск...',
    noTransactions: 'Нет транзакций за этот месяц.',
    recurringBadge: 'Повторяющийся 🔄',
    newTransaction: 'Новая транзакция',
    expenseType: 'Расход 📉',
    incomeType: 'Доход 📈',
    titleLabel: 'Описание',
    titlePlaceholder: 'напр. Супермаркет...',
    amountLabel: 'Сумма (₪)',
    categoryLabel: 'Категория',
    recurringCheckbox: 'Регулярный платеж / подписка',
    saveButton: 'Сохранить',
    exportCSV: 'Экспорт CSV 📊',
    subscriptionRadar: 'Радар подписок',
    yearlyTotal: 'Итого годовые обязательства:',
    systemSettings: 'Системные настройки',
    themeToggle: 'Режим темы',
    darkMode: 'Темный режим 🌙',
    lightMode: 'Светлый режим ☀️',
    language: 'Язык 🌐',
    savingsGoalsTitle: 'Личные цели накопления',
    addGoal: 'Добавить цель',
    goalNamePlaceholder: 'Название цели (авто, отпуск...)',
    goalAmountPlaceholder: 'Сумма цели (₪)',
    smartBudgetTitle: 'Умный месячный бюджет и лимиты',
    totalMonthlyBudgetLabel: 'Общий месячный лимит бюджета (₪)',
    categoryLimitsTitle: 'Лимиты по категориям',
    budgetExceededError: 'Ошибка: Сумма лимитов категорий превышает общий месячный бюджет!',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Изменить'
  },
  pt: {
    appName: 'My Money',
    tagline: 'Finanças Pessoais',
    dashboard: 'Visão Geral',
    transactions: 'Transações',
    budgets: 'Orçamentos e Metas',
    tools: 'Ferramentas',
    netBalance: 'Saldo Mensal Líquido',
    income: 'Receitas',
    expenses: 'Despesas',
    safeSpend: 'Gasto Diário Seguro',
    daysLeft: 'dias restantes',
    targetDate: 'Data estimada',
    noTarget: 'Poupe consistentemente',
    goalReached: 'Meta Alcançada! 🎉',
    categoryBreakdown: 'Despesas por Categoria',
    searchPlaceholder: 'Busca rápida...',
    noTransactions: 'Sem transações este mês.',
    recurringBadge: 'Recorrente 🔄',
    newTransaction: 'Nova Transação',
    expenseType: 'Despesa 📉',
    incomeType: 'Receita 📈',
    titleLabel: 'Descrição',
    titlePlaceholder: 'ex. Supermercado...',
    amountLabel: 'Montante (₪)',
    categoryLabel: 'Categoria',
    recurringCheckbox: 'Assinatura recorrente',
    saveButton: 'Salvar',
    exportCSV: 'Exportar CSV 📊',
    subscriptionRadar: 'Radar de Assinaturas',
    yearlyTotal: 'Compromisso anual total:',
    systemSettings: 'Configurações',
    themeToggle: 'Modo de Tema',
    darkMode: 'Modo Escuro 🌙',
    lightMode: 'Modo Claro ☀️',
    language: 'Idioma 🌐',
    savingsGoalsTitle: 'Metas de Poupança Pessoais',
    addGoal: 'Adicionar Meta',
    goalNamePlaceholder: 'Nome da meta...',
    goalAmountPlaceholder: 'Montante alvo (₪)',
    smartBudgetTitle: 'Orçamento Mensal Inteligente',
    totalMonthlyBudgetLabel: 'Limite de Orçamento Mensal (₪)',
    categoryLimitsTitle: 'Limites por Categoria',
    budgetExceededError: 'Erro: A soma dos limites excede o orçamento total!',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar'
  },
  ja: {
    appName: 'My Money',
    tagline: 'プライベート家計管理',
    dashboard: '概要',
    transactions: '取引',
    budgets: '予算と目標',
    tools: 'ツール',
    netBalance: '月間純残高',
    income: '収入',
    expenses: '支出',
    safeSpend: '1日の安全な支出',
    daysLeft: '残り日数',
    targetDate: '推定達成日',
    noTarget: '継続して貯金しましょう',
    goalReached: '目標達成！ 🎉',
    categoryBreakdown: 'カテゴリ別支出',
    searchPlaceholder: 'クイック検索...',
    noTransactions: '今月の取引はありません。',
    recurringBadge: '定期 🔄',
    newTransaction: '新しい取引',
    expenseType: '支出 📉',
    incomeType: '収入 📈',
    titleLabel: '説明',
    titlePlaceholder: '例：スーパー、ガソリン...',
    amountLabel: '金額 (₪)',
    categoryLabel: 'カテゴリ',
    recurringCheckbox: '定期サブスクリプション',
    saveButton: '保存',
    exportCSV: 'CSVエクスポート 📊',
    subscriptionRadar: 'サブスクレーダー',
    yearlyTotal: '年間総コミットメント:',
    systemSettings: 'システム設定',
    themeToggle: 'テーマモード',
    darkMode: 'ダークモード 🌙',
    lightMode: 'ライトモード ☀️',
    language: '言語 🌐',
    savingsGoalsTitle: '個人貯蓄目標',
    addGoal: '目標を追加',
    goalNamePlaceholder: '目標名（車、旅行など）',
    goalAmountPlaceholder: '目標金額 (₪)',
    smartBudgetTitle: 'スマート月間予算と制限',
    totalMonthlyBudgetLabel: '月間予算総額上限 (₪)',
    categoryLimitsTitle: 'カテゴリ別予算配分',
    budgetExceededError: 'エラー：カテゴリ上限の合計が月間予算総額を超えています！',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集'
  },
  zh: {
    appName: 'My Money',
    tagline: '私人财富与家庭财务',
    dashboard: '概览',
    transactions: '交易',
    budgets: '预算与目标',
    tools: '工具',
    netBalance: '月度净结余',
    income: '收入',
    expenses: '支出',
    safeSpend: '每日安全支出',
    daysLeft: '剩余天数',
    targetDate: '预计达成日期',
    noTarget: '持续储蓄以计算目标日期',
    goalReached: '达成目标！ 🎉',
    categoryBreakdown: '按类别支出的明细',
    searchPlaceholder: '快速搜索...',
    noTransactions: '本月暂无交易记录。',
    recurringBadge: '周期性 🔄',
    newTransaction: '新交易',
    expenseType: '支出 📉',
    incomeType: '收入 📈',
    titleLabel: '描述',
    titlePlaceholder: '例如：超市、油费...',
    amountLabel: '金额 (₪)',
    categoryLabel: '类别',
    recurringCheckbox: '定期订阅 / 固定支出',
    saveButton: '保存交易',
    exportCSV: '导出备份 (CSV) 📊',
    subscriptionRadar: '订阅雷达',
    yearlyTotal: '年度总承诺：',
    systemSettings: '系统设置',
    themeToggle: '外观模式',
    darkMode: '深色模式 🌙',
    lightMode: '浅色模式 ☀️',
    language: '语言 🌐',
    savingsGoalsTitle: '个人储蓄目标',
    addGoal: '添加新目标',
    goalNamePlaceholder: '目标名称（如：车、度假...）',
    goalAmountPlaceholder: '目标金额 (₪)',
    smartBudgetTitle: '智能月度预算与限制',
    totalMonthlyBudgetLabel: '每月总预算上限 (₪)',
    categoryLimitsTitle: '类别预算分配',
    budgetExceededError: '错误：分类限额之和超出了您的每月总预算上限！',
    cancel: '取消',
    delete: '删除',
    edit: '编辑'
  },
  nl: {
    appName: 'My Money',
    tagline: 'Privé Vermogen & Huishoudfinanciën',
    dashboard: 'Overzicht',
    transactions: 'Transacties',
    budgets: 'Budgets & Doelen',
    tools: 'Hulpmiddelen',
    netBalance: 'Netto Maandbalans',
    income: 'Inkomsten',
    expenses: 'Uitgaven',
    safeSpend: 'Dagelijks Veilig Uit te Geven',
    daysLeft: 'dagen over',
    targetDate: 'Geschatte streefdatum',
    noTarget: 'Spaar consistent',
    goalReached: 'Doel Bereikt! 🎉',
    categoryBreakdown: 'Uitgaven per Categorie',
    searchPlaceholder: 'Snel zoeken...',
    noTransactions: 'Geen transacties voor deze maand.',
    recurringBadge: 'Terugkerend 🔄',
    newTransaction: 'Nieuwe Transactie',
    expenseType: 'Uitgave 📉',
    incomeType: 'Inkomsten 📈',
    titleLabel: 'Beschrijving',
    titlePlaceholder: 'bijv. Supermarkt...',
    amountLabel: 'Bedrag (₪)',
    categoryLabel: 'Categorie',
    recurringCheckbox: 'Terugkerend abonnement',
    saveButton: 'Opslaan',
    exportCSV: 'Exporteer CSV 📊',
    subscriptionRadar: 'Abonnementen Radar',
    yearlyTotal: 'Totale jaarlijkse verplichting:',
    systemSettings: 'Systeeminstellingen',
    themeToggle: 'Weergavemodus',
    darkMode: 'Donkere Modus 🌙',
    lightMode: 'Lichte Modus ☀️',
    language: 'Taal 🌐',
    savingsGoalsTitle: 'Persoonlijke Spaardoelen',
    addGoal: 'Voeg doel toe',
    goalNamePlaceholder: 'Doelnaam (auto, vakantie...)',
    goalAmountPlaceholder: 'Doelbedrag (₪)',
    smartBudgetTitle: 'Slim Maandelijks Budget & Limieten',
    totalMonthlyBudgetLabel: 'Totaal Maandelijks Budgetlimiet (₪)',
    categoryLimitsTitle: 'Categorie Budgettoewijzingen',
    budgetExceededError: 'Fout: Som van categorielimieten overschrijdt je totale maandbudget!',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    edit: 'Bewerken'
  }
}

const LANGUAGES_LIST = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'nl', name: 'Nederlands' }
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
  { id: 2, name: '✈️ חופשה בחו"ל', target: 8000 },
  { id: 3, name: '🏠 דירה / הון עצמי', target: 100000 }
]

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('mymoney_lang') || 'en')
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

  // ניהול יעדי חיסכון
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('mymoney_savings_goals')
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS
  })
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalAmount, setNewGoalAmount] = useState('')
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [editGoalName, setEditGoalName] = useState('')
  const [editGoalAmount, setEditGoalAmount] = useState('')

  // תקציב חודשי חכם ומגבלות
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => {
    const saved = localStorage.getItem('mymoney_monthly_budget')
    return saved !== null ? Number(saved) : 9000
  })
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })
  const [budgetError, setBudgetError] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)

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
    const val = newTotal === '' ? 0 : parseFloat(newTotal)
    const currentSumLimits = Object.values(categories).reduce((acc, c) => acc + c.limit, 0)
    if (currentSumLimits > val) {
      setBudgetError(t.budgetExceededError)
      return
    }
    setBudgetError('')
    setMonthlyBudgetLimit(val)
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
    <div style={{ maxWidth: '480px', margin: '15px auto', minHeight: '94vh', padding: '16px 16px 100px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: `1px solid ${borderColor}`, position: 'relative', boxSizing: 'border-box' }}>
      
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
          style={{ background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}
        />
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: cardBg, padding: '4px', borderRadius: '14px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
        {[
          { id: 'dashboard', label: t.dashboard, icon: '📊' },
          { id: 'transactions', label: t.transactions, icon: '💳' },
          { id: 'budgets', label: t.budgets, icon: '🎯' },
          { id: 'tools', label: t.tools, icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ background: activeTab === tab.id ? (theme === 'dark' ? '#3b82f6' : '#2563eb') : 'transparent', color: activeTab === tab.id ? '#ffffff' : textMuted, border: 'none', padding: '8px 4px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', transition: 'all 0.2s' }}
          >
            <span style={{ fontSize: '14px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', marginBottom: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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

          <div style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #1e3a8a, #1e1b4b)' : 'linear-gradient(135deg, #dbeafe, #eff6ff)', padding: '16px', borderRadius: '16px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
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

          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
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
              style={{ flexGrow: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px 12px', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
            >
              +
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ background: cardBg, padding: '24px', borderRadius: '16px', textAlign: 'center', color: textMuted, fontSize: '13px', border: `1px solid ${borderColor}` }}>
                {t.noTransactions}
              </div>
            ) : (
              filteredTransactions.map(tr => {
                const isInc = Number(tr.amount) > 0
                return (
                  <div key={tr.id} style={{ background: cardBg, padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>{isInc ? '📈' : (categories[tr.category]?.icon || '📉')}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700' }}>{tr.title}</div>
                        <div style={{ fontSize: '11px', color: textMuted, display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span>{tr.created_at ? tr.created_at.slice(0, 10) : ''}</span>
                          {tr.is_recurring && <span style={{ background: '#3b82f622', color: '#3b82f6', padding: '1px 6px', borderRadius: '6px', fontSize: '9px' }}>{t.recurringBadge}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: isInc ? '#10b981' : textMain }}>
                        {isInc ? `+₪${tr.amount}` : `₪${tr.amount}`}
                      </span>
                      <button onClick={() => deleteTransaction(tr.id)} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px' }}>✕</button>
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
          
          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '700' }}>{t.smartBudgetTitle}</h3>
            {budgetError && <div style={{ background: '#ef444422', color: '#ef4444', padding: '8px 10px', borderRadius: '8px', fontSize: '11px', marginBottom: '10px' }}>{budgetError}</div>}
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '4px' }}>{t.totalMonthlyBudgetLabel}</label>
              <input
                type="number"
                value={monthlyBudgetLimit}
                onChange={(e) => handleUpdateTotalBudget(e.target.value)}
                style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box' }}
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
                  <div key={catName} style={{ background: inputBg, padding: '10px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
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
                          style={{ width: '70px', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '2px 6px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', outline: 'none' }}
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

          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>{t.savingsGoalsTitle}</h3>
            
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder={t.goalNamePlaceholder}
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                style={{ background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px 10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder={t.goalAmountPlaceholder}
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  style={{ flexGrow: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '8px 10px', borderRadius: '10px', fontSize: '12px', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0 14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                  {t.addGoal}
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savingsGoals.map(goal => {
                const targetDateFormatted = calculateTargetDate(goal.target)
                return (
                  <div key={goal.id} style={{ background: inputBg, padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
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
          <div style={{ background: cardBg, padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '700' }}>{t.subscriptionRadar} 📡</h3>
            <div style={{ fontSize: '12px', color: textMuted, marginBottom: '12px' }}>
              {t.yearlyTotal} <strong style={{ color: textMain, fontSize: '14px' }}>₪{totalRecurringYearly.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recurringExpenses.length === 0 ? (
                <p style={{ color: textMuted, fontSize: '12px', margin: 0 }}>אין מנויים או הוצאות קבועות החודש.</p>
              ) : (
                recurringExpenses.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', background: inputBg, padding: '8px 10px', borderRadius: '8px' }}>
                    <span>{item.title}</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>₪{item.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={exportToCSV}
            style={{ width: '100%', background: cardBg, color: textMain, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
          >
            {t.exportCSV}
          </button>
        </div>
      )}

      {/* Modal for New Transaction */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: cardBg, width: '100%', maxWidth: '400px', padding: '20px', borderRadius: '24px', border: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800' }}>{t.newTransaction}</h3>
            
            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: inputBg, padding: '4px', borderRadius: '10px' }}>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  style={{ background: type === 'expense' ? '#ef4444' : 'transparent', color: type === 'expense' ? '#ffffff' : textMuted, border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.expenseType}
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  style={{ background: type === 'income' ? '#10b981' : 'transparent', color: type === 'income' ? '#ffffff' : textMuted, border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
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
                  style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
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
                  style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {type === 'expense' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: textMuted, marginBottom: '4px' }}>{t.categoryLabel}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'expense' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }}
                  />
                  <span>{t.recurringCheckbox}</span>
                </label>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, background: inputBg, color: textMain, border: `1px solid ${borderColor}`, padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, background: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
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
