// ==========================================================================
// Horizon App JavaScript logic (app.js) - Stealth & Mobile Edition
// ==========================================================================

// Global Application State
let state = {
  version: "1.0.0",
  settings: {
    theme: "dark",
    activeTheme: "cyan",
    stealthMode: false,
    passcode: "", // 4-digit passcode string, empty means disabled
    visionBoardQuote: "「限界を決めているのは自分自身だ。上を向いて進もう。」",
    visionBoardWhy: "日々に流されず、自分の人生の主導権を握り続け、常に成長を実感するため。",
    visionBoardImageUrl: ""
  },
  visions: [],
  milestones: [],
  habits: [],
  reflections: []
};

// SVG Icon definitions (replaces Lucide CDN completely for robust offline support)
const SVG_ICONS = {
  "layout-dashboard": `<rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect>`,
  "target": `<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>`,
  "refresh-cw": `<path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>`,
  "database": `<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>`,
  "zap": `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>`,
  "eye": `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`,
  "eye-off": `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`,
  "settings": `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`,
  "edit-3": `<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>`,
  "check-square": `<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>`,
  "activity": `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>`,
  "plus": `<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>`,
  "message-square": `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>`,
  "x": `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>`,
  "briefcase": `<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>`,
  "dollar-sign": `<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>`,
  "apple": `<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 6V2"></path>`,
  "users": `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`,
  "plane": `<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>`,
  "heart": `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>`,
  "plus-circle": `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>`,
  "edit-2": `<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>`,
  "trash-2": `<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>`,
  "calendar": `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>`,
  "shield": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>`,
  "file-spreadsheet": `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>`,
  "book-open": `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>`,
  "chevron-down": `<polyline points="6 9 12 15 18 9"></polyline>`,
  "help-circle": `<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>`,
  "check": `<polyline points="20 6 9 17 4 12"></polyline>`
};

// Dynamic Offline Icon Compiler
const renderIcons = () => {
  document.querySelectorAll("[data-lucide]").forEach(el => {
    const iconName = el.getAttribute("data-lucide");
    const paths = SVG_ICONS[iconName];
    if (paths) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const width = el.getAttribute("style")?.match(/width:\s*(\d+)px/)?.[1] || el.getAttribute("width") || "16";
      const height = el.getAttribute("style")?.match(/height:\s*(\d+)px/)?.[1] || el.getAttribute("height") || "16";
      
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.innerHTML = paths;
      
      el.innerHTML = "";
      el.appendChild(svg);
    }
  });
};

// Life Pillars Definitions
const PILLARS = {
  career: { name: "Career & Growth", icon: "briefcase" },
  finance: { name: "Finance", icon: "dollar-sign" },
  health: { name: "Health & Wellness", icon: "apple" },
  relationships: { name: "Relationships", icon: "users" },
  adventure: { name: "Adventure & Leisure", icon: "plane" },
  contribution: { name: "Contribution & Life", icon: "heart" }
};

// Date utilities
const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getRelativeDateStr = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Initial Sample Data Generator
const loadSampleData = () => {
  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  const twoDaysAgo = getRelativeDateStr(2);
  const threeDaysAgo = getRelativeDateStr(3);

  state.visions = [
    {
      id: "v-sample-1",
      title: "身体的パフォーマンスの最適化 (Health Optimization)",
      why: "日々の集中力と幸福度を高め、仕事もプライベートも全力で楽しむため。",
      riskOfFailure: "疲労や無気力によってやりたいことを先延ばしにし、平凡で退屈な日々を繰り返すこと。",
      pillar: "health",
      createdAt: new Date().toISOString()
    },
    {
      id: "v-sample-2",
      title: "海外拠点技術チームとのコラボレーション能力獲得 (Global Integration)",
      why: "世界中の仲間と素晴らしいプロダクトを作り、自分のスキルを試したいから。",
      riskOfFailure: "現状維持に甘んじてしまい、変化の激しい業界で取り残される焦燥感を抱え続けること。",
      pillar: "career",
      createdAt: new Date().toISOString()
    }
  ];

  state.milestones = [
    {
      id: "m-sample-1",
      visionId: "v-sample-1",
      title: "体脂肪率14%以下を達成し、週3回のランニング習慣を継続する",
      targetDate: getRelativeDateStr(-60),
      progress: 40,
      status: "active",
      ifThenPlans: [
        { obstacle: "仕事が夜遅くなり疲れて走る気力が起きない", action: "ウェアを着て外に出て、5分だけ歩く。歩けば達成とする。" },
        { obstacle: "雨や悪天候で外を走ることができない", action: "自宅で15分間、室内HIITトレーニングを行う。" }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "m-sample-2",
      visionId: "v-sample-2",
      title: "英語での技術的なディスカッションとスピーキングを克服する",
      targetDate: getRelativeDateStr(-90),
      progress: 20,
      status: "active",
      ifThenPlans: [
        { obstacle: "シャドーイングの音声を聞くのが面倒くさくなる", action: "スマホのホーム画面にアプリを置き、1クリックで再生できるようにしておく。" }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  state.habits = [
    {
      id: "h-sample-1",
      milestoneId: "m-sample-1",
      title: "5kmランニング または HIIT（15分）",
      type: "habit",
      history: [yesterday, twoDaysAgo, threeDaysAgo],
      createdAt: new Date().toISOString()
    },
    {
      id: "h-sample-2",
      milestoneId: "m-sample-2",
      title: "毎朝15分間、英語のシャドーイングか技術音読",
      type: "habit",
      history: [yesterday, twoDaysAgo],
      createdAt: new Date().toISOString()
    },
    {
      id: "h-sample-3",
      milestoneId: "m-sample-1",
      title: "就寝30分前のスマホオフとストレッチ",
      type: "habit",
      history: [yesterday],
      createdAt: new Date().toISOString()
    }
  ];

  state.reflections = [
    {
      id: "r-sample-1",
      date: yesterday,
      score: 4,
      whatWentWell: "If-Thenプランのおかげで雨の日も自宅でHIITを行い、ランニングのサボりを回避できた。連続達成数が順調に伸びていてモチベーションが高い。",
      whatToImprove: "夜のスマホ使用が多くなり、翌朝少し体が重かった。睡眠の重要性を軽視しがち。",
      adjustments: "来週から『夜11時半以降はスマホオフ』という習慣を追加し、睡眠時間も確保する。"
    }
  ];
  
  saveToLocalStorage();
};

// LocalStorage Drivers
const saveToLocalStorage = () => {
  localStorage.setItem("horizon_app_state", JSON.stringify(state));
};

const loadFromLocalStorage = () => {
  const data = localStorage.getItem("horizon_app_state");
  if (data) {
    try {
      state = JSON.parse(data);
    } catch (e) {
      console.error("Failed to load local storage state, using default sample data", e);
      loadSampleData();
    }
  } else {
    loadSampleData();
  }
};

// Streak Calculation Logic
const calculateHabitStreak = (history) => {
  if (!history || history.length === 0) return 0;
  
  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  const sorted = [...new Set(history)].sort((a, b) => new Date(b) - new Date(a));
  
  let hasToday = sorted[0] === today;
  let hasYesterday = sorted[0] === yesterday || (sorted[0] === today && sorted[1] === yesterday);
  
  if (!hasToday && !hasYesterday) {
    return 0; // Streak broken
  }
  
  let streak = 0;
  let checkDate = hasToday ? new Date() : new Date(yesterday);
  
  while (true) {
    const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (history.includes(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate Global Streak
const calculateGlobalStreak = () => {
  if (state.habits.length === 0) return 0;
  let max = 0;
  state.habits.forEach(h => {
    const s = calculateHabitStreak(h.history);
    if (s > max) max = s;
  });
  return max;
};

// Initialize Toast Message
const showToast = (message, type = "success") => {
  const toast = document.getElementById("toastNotification");
  const toastMsg = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");
  
  toastMsg.textContent = message;
  
  if (type === "success") {
    toast.style.borderLeftColor = "var(--color-cyan)";
    toastIcon.setAttribute("data-lucide", "check-circle-2");
    toastIcon.style.color = "var(--color-cyan)";
  } else {
    toast.style.borderLeftColor = "var(--color-danger)";
    toastIcon.setAttribute("data-lucide", "alert-triangle");
    toastIcon.style.color = "var(--color-danger)";
  }
  
  renderIcons();
  
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 2500);
};

// ==========================================================================
// STEALTH MODE SYSTEM CONTROLLER
// ==========================================================================
const applyStealthMode = () => {
  const appContainer = document.getElementById("appContainer");
  const toggleBtn = document.getElementById("btnStealthToggle");
  const statusLine = document.getElementById("profileStatusLine");
  
  if (state.settings.stealthMode) {
    appContainer.classList.add("stealth-active");
    toggleBtn.classList.add("active");
    toggleBtn.innerHTML = `<span data-lucide="eye-off" style="width: 18px; height: 18px;"></span>`;
    if (statusLine) statusLine.textContent = "STEALTH_MODE: ACTIVE";
  } else {
    appContainer.classList.remove("stealth-active");
    toggleBtn.classList.remove("active");
    toggleBtn.innerHTML = `<span data-lucide="eye" style="width: 18px; height: 18px;"></span>`;
    if (statusLine) statusLine.textContent = "SYSTEM INTEGRITY: SECURED";
  }
  renderIcons();
};

const toggleStealthMode = () => {
  state.settings.stealthMode = !state.settings.stealthMode;
  saveToLocalStorage();
  applyStealthMode();
  showToast(state.settings.stealthMode ? "ステルスモードをONにしました" : "ステルスモードをOFFにしました");
};

// Click-to-reveal temporarily (3 seconds) for mobile touch interfaces
document.addEventListener("click", (e) => {
  if (state.settings.stealthMode) {
    const blurEl = e.target.closest(".stealth-blur");
    if (blurEl) {
      blurEl.classList.add("reveal-temp");
      setTimeout(() => {
        blurEl.classList.remove("reveal-temp");
      }, 3000);
    }
  }
});

// ==========================================================================
// THEME SWITCHER CONTROLLER
// ==========================================================================
const applyTheme = () => {
  // Reset all themes from body
  document.body.className = "";
  
  const activeTheme = state.settings.activeTheme || "cyan";
  if (activeTheme !== "cyan") {
    document.body.classList.add(`theme-${activeTheme}`);
  }
  
  // Highlight active theme button in settings modal
  document.querySelectorAll(".theme-sel-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick").includes(activeTheme)) {
      btn.classList.add("active");
    }
  });
};

const changeTheme = (themeName) => {
  state.settings.activeTheme = themeName;
  saveToLocalStorage();
  applyTheme();
  
  // Re-render components to propagate color shifts
  renderPillarsProgress();
  renderTodayChecklist();
  renderGoalsMatrix();
  renderReflections();
  showToast(`配色テーマを「${themeName}」に変更しました`);
};

// ==========================================================================
// SECURITY PASSCODE LOCK CONTROLLER
// ==========================================================================
let currentPIN = "";

const checkPasscodeOnStart = () => {
  const overlay = document.getElementById("passcodeLockOverlay");
  if (state.settings.passcode && state.settings.passcode.length === 4) {
    overlay.classList.add("active");
    currentPIN = "";
    updatePINDisplay();
  } else {
    overlay.classList.remove("active");
  }
};

const updatePINDisplay = () => {
  const dots = document.querySelectorAll("#passcodeDots .dot");
  dots.forEach((dot, idx) => {
    if (idx < currentPIN.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
};

const pressPIN = (val) => {
  if (val === 'clear') {
    currentPIN = "";
  } else if (val === 'back') {
    currentPIN = currentPIN.slice(0, -1);
  } else {
    if (currentPIN.length < 4) {
      currentPIN += val;
    }
  }
  
  updatePINDisplay();
  
  if (currentPIN.length === 4) {
    // Validate PIN
    if (currentPIN === state.settings.passcode) {
      // Unlock success
      const overlay = document.getElementById("passcodeLockOverlay");
      overlay.style.transition = "opacity 0.25s ease";
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.classList.remove("active");
        overlay.style.opacity = "1";
        overlay.style.transition = "";
      }, 250);
      showToast("ロック解除完了 // 認証成功");
    } else {
      // Failure shake and clear
      const dotsContainer = document.getElementById("passcodeDots");
      dotsContainer.style.transform = "translateX(10px)";
      setTimeout(() => dotsContainer.style.transform = "translateX(-10px)", 70);
      setTimeout(() => dotsContainer.style.transform = "translateX(5px)", 140);
      setTimeout(() => {
        dotsContainer.style.transform = "translateX(0)";
        currentPIN = "";
        updatePINDisplay();
      }, 210);
      showToast("パスコードが間違っています", "error");
    }
  }
};

// Wire up Settings PIN Config
const handleSavePIN = () => {
  const pinInput = document.getElementById("inputSettingsPIN").value.trim();
  if (pinInput.length === 0) {
    state.settings.passcode = "";
    saveToLocalStorage();
    showToast("パスコードロックを解除（無効化）しました");
  } else if (pinInput.length === 4 && /^\d+$/.test(pinInput)) {
    state.settings.passcode = pinInput;
    saveToLocalStorage();
    showToast("4桁のパスコードロックを保存しました");
    closeModal("modalSettings");
  } else {
    showToast("暗証番号は4桁の数字で指定してください", "error");
  }
};

// ==========================================================================
// ANALYTICS & GRAPH RENDER ENGINE (Heatmaps & SVG Lines)
// ==========================================================================

// 1. GitHub-like routines heatmap grid (Last 28 days)
const renderHabitHeatmap = () => {
  const container = document.getElementById("habitHeatmapContainer");
  if (!container) return;
  container.innerHTML = "";
  
  const totalHabits = state.habits.length;
  
  // Render grid boxes for last 28 days chronologically (4 weeks)
  for (let i = 27; i >= 0; i--) {
    const dateStr = getRelativeDateStr(i);
    
    // Count how many routines were checked off on this specific date
    let completedCount = 0;
    if (totalHabits > 0) {
      state.habits.forEach(h => {
        if (h.history.includes(dateStr)) {
          completedCount++;
        }
      });
    }
    
    const cell = document.createElement("div");
    cell.className = "heatmap-cell";
    
    // Calculate cell opacity based on completion rate
    const completionRate = totalHabits > 0 ? (completedCount / totalHabits) : 0;
    if (completionRate > 0) {
      cell.style.backgroundColor = "var(--color-cyan)";
      cell.style.opacity = 0.15 + (completionRate * 0.85);
      cell.style.boxShadow = `0 0 4px rgba(102, 252, 241, ${completionRate * 0.3})`;
    } else {
      cell.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
      cell.style.opacity = 1;
    }
    
    cell.setAttribute("title", `${dateStr}: 達成度 ${Math.round(completionRate * 100)}% (${completedCount}/${totalHabits})`);
    container.appendChild(cell);
  }
};

// 2. SVG Retrospective satisfaction line chart (Last 6 reviews)
const renderSatisfactionTrend = () => {
  const chartWrapper = document.getElementById("satisfactionTrendChart");
  if (!chartWrapper) return;
  chartWrapper.innerHTML = "";
  
  if (state.reflections.length === 0) {
    chartWrapper.innerHTML = `<span style="font-size:0.75rem; color:var(--text-dark);">振り返りデータが不足しています。</span>`;
    return;
  }
  
  // Get last 6 reviews, sorted oldest to newest
  const dataPoints = [...state.reflections]
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(-6);
    
  const svgWidth = 260;
  const svgHeight = 90;
  const paddingX = 20;
  const paddingY = 15;
  
  // Map points to SVG coordinates
  const points = dataPoints.map((item, idx) => {
    // X distributed evenly
    const x = paddingX + (idx / Math.max(1, dataPoints.length - 1)) * (svgWidth - paddingX * 2);
    // Y inverted: 5 score = top (paddingY), 1 score = bottom (svgHeight - paddingY)
    const scoreVal = parseFloat(item.score) || 3;
    const y = svgHeight - paddingY - ((scoreVal - 1) / 4) * (svgHeight - paddingY * 2);
    return { x, y, score: scoreVal, date: item.date };
  });
  
  // Generate Path 'd' attribute
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
  }
  
  // Build SVG nodes string
  let svgContent = `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow:visible;">
      <!-- Grid Lines -->
      <line x1="${paddingX}" y1="${paddingY}" x2="${svgWidth - paddingX}" y2="${paddingY}" stroke="rgba(255,255,255,0.03)" stroke-dasharray="2,2"/>
      <line x1="${paddingX}" y1="${svgHeight/2}" x2="${svgWidth - paddingX}" y2="${svgHeight/2}" stroke="rgba(255,255,255,0.03)" stroke-dasharray="2,2"/>
      <line x1="${paddingX}" y1="${svgHeight - paddingY}" x2="${svgWidth - paddingX}" y2="${svgHeight - paddingY}" stroke="rgba(255,255,255,0.03)" stroke-dasharray="2,2"/>
      
      <!-- Trend Line -->
      ${points.length > 1 ? `<path d="${pathD}" fill="none" stroke="var(--color-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 3px rgba(102, 252, 241, 0.3));"/>` : ''}
      
      <!-- Dots -->
      ${points.map(pt => `
        <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="var(--bg-base)" stroke="var(--color-cyan)" stroke-width="2" title="${pt.date}: ${pt.score}"/>
        <text x="${pt.x}" y="${pt.y - 8}" fill="var(--color-cyan)" font-size="7" font-weight="600" text-anchor="middle">${pt.score}</text>
      `).join('')}
    </svg>
  `;
  
  chartWrapper.innerHTML = svgContent;
};

// ==========================================================================
// RENDERING COMPONENT ENGINES
// ==========================================================================

// Render 1: Pillars Progress bars on Dashboard (Unified Cyan Opacity theme)
const renderPillarsProgress = () => {
  const container = document.getElementById("pillarsProgressList");
  container.innerHTML = "";
  
  Object.keys(PILLARS).forEach(pillarKey => {
    const pillarInfo = PILLARS[pillarKey];
    
    // Find all milestones corresponding to visions in this pillar
    const pillarVisions = state.visions.filter(v => v.pillar === pillarKey);
    const visionIds = pillarVisions.map(v => v.id);
    const pillarMilestones = state.milestones.filter(m => visionIds.includes(m.visionId));
    
    let avgProgress = 0;
    if (pillarMilestones.length > 0) {
      const sum = pillarMilestones.reduce((acc, m) => acc + parseInt(m.progress || 0), 0);
      avgProgress = Math.round(sum / pillarMilestones.length);
    }
    
    const opacityScale = 0.2 + (avgProgress / 100) * 0.8;
    const indicatorOpacity = 0.3 + (avgProgress / 100) * 0.7;
    
    const row = document.createElement("div");
    row.className = "pillar-progress-row";
    row.innerHTML = `
      <div class="pillar-info">
        <div class="pillar-name-container">
          <span class="pillar-color-indicator" style="background-color: var(--color-cyan); opacity: ${indicatorOpacity}; box-shadow: 0 0 4px rgba(102, 252, 241, ${avgProgress / 100});"></span>
          <span style="opacity: ${0.6 + (avgProgress / 100) * 0.4};">${pillarInfo.name}</span>
        </div>
        <span style="color: var(--color-cyan); font-weight: 600; opacity: ${opacityScale};">${avgProgress}%</span>
      </div>
      <div class="pillar-bar-container">
        <div class="pillar-bar" style="background-color: var(--color-cyan); opacity: ${opacityScale}; width: ${avgProgress}%;"></div>
      </div>
    `;
    container.appendChild(row);
  });
};

// Render 2: Today's Action & Habits Checklist (Clean Slate principle applies)
const renderTodayChecklist = () => {
  const container = document.getElementById("todayActionList");
  container.innerHTML = "";
  
  const todayStr = getTodayStr();
  
  if (state.habits.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span data-lucide="calendar" class="empty-icon"></span>
        <p>登録された習慣・アクションはありません。</p>
        <button class="btn btn-secondary btn-sm" id="btnChecklistAddGoal">ビジョンマップへ移動</button>
      </div>
    `;
    
    const btn = document.getElementById("btnChecklistAddGoal");
    if (btn) {
      btn.addEventListener("click", () => {
        switchTab("goals");
      });
    }
    renderIcons();
    return;
  }
  
  let completedCount = 0;
  
  state.habits.forEach(h => {
    const isCompleted = h.history.includes(todayStr);
    if (isCompleted) completedCount++;
    
    const milestone = state.milestones.find(m => m.id === h.milestoneId);
    const vision = milestone ? state.visions.find(v => v.id === milestone.visionId) : null;
    const pillarKey = vision ? vision.pillar : "career";
    const pillarInfo = PILLARS[pillarKey];
    const streak = calculateHabitStreak(h.history);
    
    const ifThens = milestone && milestone.ifThenPlans ? milestone.ifThenPlans : [];
    let ifThenHTML = "";
    if (ifThens.length > 0) {
      ifThenHTML = `
        <div class="action-expanded-details" id="expanded-habit-${h.id}">
          <strong class="ifthen-label"><span data-lucide="help-circle" style="width: 12px; height: 12px;"></span> If-Then Plan：</strong>
          ${ifThens.map(plan => `
            <div style="margin-bottom: 0.4rem; line-height: 1.4;">
              <span style="color: var(--color-danger);">IF:</span> <span class="stealth-blur">${escapeHTML(plan.obstacle)}</span><br>
              <span style="color: var(--color-cyan);">THEN:</span> <span class="stealth-blur">${escapeHTML(plan.action)}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      ifThenHTML = `
        <div class="action-expanded-details" id="expanded-habit-${h.id}">
          <span style="color: var(--text-muted);">障害対策 (If-Then Plan) は設定されていません。</span>
        </div>
      `;
    }
    
    const card = document.createElement("div");
    card.style.display = "contents";
    
    card.innerHTML = `
      <div class="action-item ${isCompleted ? 'completed' : ''}" data-habit-id="${h.id}">
        <div class="action-left">
          <div class="custom-checkbox" onclick="toggleHabit('${h.id}')">
            <span data-lucide="check"></span>
          </div>
          <div class="action-info">
            <span class="action-text stealth-blur">${escapeHTML(h.title)}</span>
            <div class="action-meta">
              <span class="meta-tag pillar-${pillarKey}">${pillarInfo.name}</span>
              ${h.type === 'habit' ? `
                <span class="habit-streak-display" title="連続継続数">
                  <span data-lucide="zap" style="width: 10px; height: 10px; fill: var(--color-danger); stroke: none;"></span>
                  <span>${streak}d</span>
                </span>
              ` : '<span style="color: var(--color-cyan); font-weight:600;">TASK</span>'}
            </div>
          </div>
        </div>
        <div class="action-right">
          <button class="action-details-trigger" onclick="toggleDetails('${h.id}')" title="障害対策を表示">
            <span data-lucide="chevron-down" style="width: 16px; height: 16px;"></span>
          </button>
        </div>
      </div>
      ${ifThenHTML}
    `;
    
    container.appendChild(card);
  });
  
  document.getElementById("completedCountText").textContent = `${completedCount} / ${state.habits.length}`;
  document.getElementById("streakCountText").textContent = calculateGlobalStreak();
  
  renderIcons();
};

const toggleDetails = (habitId) => {
  const details = document.getElementById(`expanded-habit-${habitId}`);
  if (details) {
    details.classList.toggle("active");
  }
};

// Checkbox Toggle logic
const toggleHabit = (habitId) => {
  const habit = state.habits.find(h => h.id === habitId);
  if (!habit) return;
  
  const todayStr = getTodayStr();
  const index = habit.history.indexOf(todayStr);
  
  if (index === -1) {
    habit.history.push(todayStr);
    showToast("ROUTINE COMPLETED");
    
    const card = document.querySelector(`.action-item[data-habit-id="${habitId}"]`);
    if (card) {
      card.classList.add("completed");
      card.style.transform = "scale(0.98)";
      setTimeout(() => card.style.transform = "scale(1)", 150);
    }
  } else {
    habit.history.splice(index, 1);
    showToast("COMPLETED CANCELLED", "info");
  }
  
  saveToLocalStorage();
  renderTodayChecklist();
  renderPillarsProgress();
  renderHabitHeatmap(); // update heatmap dynamically when habits are checked!
};

// Render 3: Goal Matrix View
const renderGoalsMatrix = () => {
  const container = document.getElementById("goalsMatrixContainer");
  container.innerHTML = "";
  
  if (state.visions.length === 0) {
    container.innerHTML = `
      <div class="card empty-state">
        <span data-lucide="target" class="empty-icon"></span>
        <h3>目標が登録されていません</h3>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1rem 0;">
          まず「長期ビジョン(VISION)」を設定し、そこに「目標(GOAL)」と「習慣(ROUTINE)」を紐付けてマッピングします。
        </p>
        <button class="btn btn-primary" onclick="openModal('modalAddVision')">
          <span data-lucide="plus"></span>ビジョンを追加
        </button>
      </div>
    `;
    renderIcons();
    return;
  }
  
  state.visions.forEach(v => {
    const pillarInfo = PILLARS[v.pillar];
    const node = document.createElement("div");
    node.className = "tree-node";
    node.innerHTML = `
      <div class="tree-node-header">
        <div class="tree-node-title">
          <span style="color: var(--color-cyan); display: flex; align-items: center;">
            <span data-lucide="${pillarInfo.icon}"></span>
          </span>
          <div>
            <div style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight:700;">
              Vision (${pillarInfo.name})
            </div>
            <div class="stealth-blur" style="font-weight: 600; font-size: 0.9rem;">${escapeHTML(v.title)}</div>
          </div>
        </div>
        <div style="display: flex; gap: 0.25rem;">
          <button class="btn btn-secondary btn-sm" onclick="editVision('${v.id}')" title="編集"><span data-lucide="edit-2" style="width: 12px; height:12px;"></span></button>
          <button class="btn btn-danger btn-sm" onclick="deleteVision('${v.id}')" title="削除"><span data-lucide="trash-2" style="width: 12px; height:12px;"></span></button>
        </div>
      </div>
      
      <div style="background: rgba(0, 0, 0, 0.2); border-left: 2px solid var(--color-cyan); padding: 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.2rem;">
        <div><strong>Why / Intent:</strong> <span class="stealth-blur">${escapeHTML(v.why || "未設定")}</span></div>
        <div><strong>Risk of Failure:</strong> <span class="stealth-blur">${escapeHTML(v.riskOfFailure || "未設定")}</span></div>
      </div>

      <div class="tree-children" id="children-vision-${v.id}">
        <!-- Milestones inserted here -->
      </div>
    `;
    
    container.appendChild(node);
    
    const milestonesList = state.milestones.filter(m => m.visionId === v.id);
    const childrenContainer = document.getElementById(`children-vision-${v.id}`);
    
    if (milestonesList.length === 0) {
      childrenContainer.innerHTML = `
        <div style="color: var(--text-muted); font-size: 0.75rem; padding: 0.5rem 0;">
          目標(KR)が紐付けられていません。
          <br>
          <button class="btn btn-secondary btn-sm" onclick="openAddMilestoneForVision('${v.id}')" style="margin-top: 0.4rem; padding: 0.25rem 0.5rem; font-size: 0.7rem;">
            <span data-lucide="plus"></span>目標(KR)を追加
          </button>
        </div>
      `;
    } else {
      milestonesList.forEach(m => {
        const milestoneCard = document.createElement("div");
        milestoneCard.className = "milestone-card";
        
        const habitsList = state.habits.filter(h => h.milestoneId === m.id);
        
        let ifThenText = "";
        if (m.ifThenPlans && m.ifThenPlans.length > 0) {
          ifThenText = m.ifThenPlans.map(plan => `
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-light); padding: 0.35rem 0.5rem; border-radius: 4px; font-size: 0.7rem; margin-top: 0.25rem; line-height:1.3;">
              <strong>If-Then:</strong> <span class="stealth-blur">${escapeHTML(plan.obstacle)}</span> ➔ <span class="stealth-blur">${escapeHTML(plan.action)}</span>
            </div>
          `).join('');
        }
        
        milestoneCard.innerHTML = `
          <div class="milestone-meta">
            <div>
              <span style="font-size: 0.6rem; color: var(--text-muted); font-weight:700; text-transform: uppercase;">Goal / Key Result</span>
              <h4 class="stealth-blur" style="font-size: 0.85rem; font-weight: 600;">${escapeHTML(m.title)}</h4>
            </div>
            <div style="display: flex; gap: 0.2px; flex-shrink: 0;">
              <button class="btn btn-secondary btn-sm" style="padding:0.2rem;" onclick="openAddHabitForMilestone('${m.id}')" title="習慣を追加"><span data-lucide="plus-circle" style="width: 12px; height:12px;"></span></button>
              <button class="btn btn-secondary btn-sm" style="padding:0.2rem;" onclick="editMilestone('${m.id}')" title="編集"><span data-lucide="edit-2" style="width: 12px; height:12px;"></span></button>
              <button class="btn btn-danger btn-sm" style="padding:0.2rem;" onclick="deleteMilestone('${m.id}')" title="削除"><span data-lucide="trash-2" style="width: 12px; height:12px;"></span></button>
            </div>
          </div>
          
          <div class="progress-container">
            <div class="progress-bar-outer">
              <div class="progress-bar-inner" style="width: ${m.progress || 0}%;"></div>
            </div>
            <span style="font-size: 0.75rem; font-weight: 600; min-width: 30px; text-align: right; color: var(--color-cyan);">${m.progress || 0}%</span>
          </div>
          
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            期限: ${m.targetDate || "未設定"}
          </div>

          ${ifThenText}

          <div class="child-actions">
            ${habitsList.length === 0 ? `
              <span style="font-size: 0.7rem; color: var(--text-muted);">習慣(RTN)が未登録です。</span>
            ` : habitsList.map(h => `
              <div class="child-action-row">
                <span class="stealth-blur" style="display: flex; align-items: center; gap: 0.3rem;">
                  ${h.type === 'habit' ? '🔁' : '✅'} ${escapeHTML(h.title)}
                </span>
                <div style="display: flex; align-items: center; gap: 0.3rem;">
                  ${h.type === 'habit' ? `<span style="font-size:0.65rem; color: var(--color-danger); font-weight:600;"><span data-lucide="zap" style="width:8px; height:8px; display:inline-block; fill:var(--color-danger); stroke:none;"></span> ${calculateHabitStreak(h.history)}d</span>` : ''}
                  <button class="action-details-trigger" onclick="deleteHabit('${h.id}')" title="削除" style="color:var(--color-danger); padding:0 0.1rem;"><span data-lucide="trash-2" style="width:10px; height:10px;"></span></button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        childrenContainer.appendChild(milestoneCard);
      });
    }
  });
  renderIcons();
};

// Render 4: Reflections Timeline
const renderReflections = () => {
  const timeline = document.getElementById("reflectionTimeline");
  timeline.innerHTML = "";
  
  // Trigger analytic renders
  renderHabitHeatmap();
  renderSatisfactionTrend();
  
  if (state.reflections.length === 0) {
    timeline.innerHTML = `
      <div class="card empty-state" style="width: 100%;">
        <span data-lucide="refresh-cw" class="empty-icon"></span>
        <h3>振り返りログがありません</h3>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1rem 0;">
          定期的な内省によって目標プランを微調整し、着実な前進を図ります。
        </p>
        <button class="btn btn-primary" onclick="openModal('modalReflection')">
          <span data-lucide="message-square"></span>最初の記録を作成
        </button>
      </div>
    `;
    
    document.getElementById("statTotalReflections").textContent = "0";
    document.getElementById("statAverageScore").textContent = "0.0";
    renderIcons();
    return;
  }
  
  const sorted = [...state.reflections].sort((a,b) => new Date(b.date) - new Date(a.date));
  
  sorted.forEach(r => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    
    item.innerHTML = `
      <div class="timeline-badge">
        ${r.score}
      </div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span style="font-weight: 600;"><span data-lucide="calendar" style="width:12px; height:12px; vertical-align: middle; margin-right: 0.25rem;"></span>${r.date}</span>
          <span class="score-badge" style="color: var(--color-cyan); font-weight: 600;">SCORE: ${r.score}/5</span>
        </div>
        <div class="timeline-qa">
          <div class="qa-block">
            <strong>👍 うまくいったこと (Success factors)</strong>
            <p class="stealth-blur">${escapeHTML(r.whatWentWell)}</p>
          </div>
          <div class="qa-block">
            <strong>⚠️ 発生した障害 (Obstacles)</strong>
            <p class="stealth-blur">${escapeHTML(r.whatToImprove)}</p>
          </div>
          <div class="qa-block">
            <strong>調整・次週の If-Then 対策 (Adjustments)</strong>
            <p class="stealth-blur">${escapeHTML(r.adjustments)}</p>
          </div>
        </div>
        <div style="display:flex; justify-content: flex-end; margin-top: 0.75rem;">
          <button class="btn btn-danger btn-sm" style="padding: 0.25rem 0.5rem; font-size:0.7rem;" onclick="deleteReflection('${r.id}')"><span data-lucide="trash-2" style="width:10px; height:10px;"></span> 削除</button>
        </div>
      </div>
    `;
    timeline.appendChild(item);
  });
  
  const total = state.reflections.length;
  const avg = state.reflections.reduce((acc, r) => acc + parseFloat(r.score), 0) / total;
  
  document.getElementById("statTotalReflections").textContent = total;
  document.getElementById("statAverageScore").textContent = avg.toFixed(1);
  
  renderIcons();
};

// Update Vision board on Dashboard
const renderVisionBoard = () => {
  const board = document.getElementById("dashboardVisionBoard");
  const quote = document.getElementById("visionBoardQuote");
  const whyText = document.getElementById("visionBoardWhyText");
  
  if (state.settings.visionBoardImageUrl) {
    board.style.backgroundImage = `url('${state.settings.visionBoardImageUrl}')`;
  } else {
    board.style.backgroundImage = "none";
    board.style.backgroundColor = "var(--bg-surface)";
  }
  
  quote.textContent = state.settings.visionBoardQuote || "「限界を決めているのは自分自身だ。上を向いて進もう。」";
  whyText.textContent = state.settings.visionBoardWhy || "日々に流されず、自分の人生の主導権を握り続け、常に成長を実感するため。";
  
  const hr = new Date().getHours();
  let greet = "SYS_STATUS // ONLINE // NIGHT_MODE";
  if (hr >= 5 && hr < 12) greet = "SYS_STATUS // ONLINE // MORNING_MODE";
  else if (hr >= 12 && hr < 18) greet = "SYS_STATUS // ONLINE // DAYTIME_MODE";
  document.getElementById("greetingText").textContent = greet;
};

// ==========================================================================
// TABS NAVIGATION & VIEW CONTROLLERS
// ==========================================================================
const switchTab = (tabName) => {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });
  
  const targetPage = document.getElementById(`page-${tabName}`);
  if (targetPage) {
    targetPage.classList.add("active");
  }
  
  document.querySelectorAll(".bottom-nav-item").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-tab") === tabName) {
      link.classList.add("active");
    }
  });
  
  if (tabName === "dashboard") {
    renderVisionBoard();
    renderPillarsProgress();
    renderTodayChecklist();
  } else if (tabName === "goals") {
    renderGoalsMatrix();
  } else if (tabName === "reflections") {
    renderReflections();
  }
  
  window.scrollTo(0, 0);
};

// ==========================================================================
// MODAL WORKFLOW & DYNAMIC FORM FIELDS
// ==========================================================================
const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
};

const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
};

// Helper to close active modals when clicking outside
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".modal-overlay").classList.remove("active");
  });
});

// Dropdown populator
const populateVisionsDropdown = (selectId, selectedId = "") => {
  const select = document.getElementById(selectId);
  select.innerHTML = "";
  
  if (state.visions.length === 0) {
    select.innerHTML = `<option value="">-- 先にビジョンを作成してください --</option>`;
    return;
  }
  
  state.visions.forEach(v => {
    const pillarName = PILLARS[v.pillar]?.name || v.pillar;
    const option = document.createElement("option");
    option.value = v.id;
    option.textContent = `[${pillarName}] ${v.title.substring(0, 20)}...`;
    if (v.id === selectedId) option.selected = true;
    select.appendChild(option);
  });
};

const populateMilestonesDropdown = (selectId, selectedId = "") => {
  const select = document.getElementById(selectId);
  select.innerHTML = "";
  
  if (state.milestones.length === 0) {
    select.innerHTML = `<option value="">-- 先に目標を作成してください --</option>`;
    return;
  }
  
  state.milestones.forEach(m => {
    const option = document.createElement("option");
    option.value = m.id;
    option.textContent = m.title.substring(0, 25) + "...";
    if (m.id === selectedId) option.selected = true;
    select.appendChild(option);
  });
};

// Dynamic If-Then rows
const createIfThenRow = (obstacle = "", action = "") => {
  const container = document.getElementById("ifthenPlansContainer");
  const div = document.createElement("div");
  div.className = "ifthen-field-pair";
  div.innerHTML = `
    <input type="text" class="ifthen-obstacle" placeholder="障害: 例: 疲れた" value="${escapeHTML(obstacle)}" required>
    <input type="text" class="ifthen-action" placeholder="対策: 例: 5分やる" value="${escapeHTML(action)}" required>
    <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.ifthen-field-pair').remove()" style="padding:0.5rem; display:flex; align-items:center; justify-content:center;">
      <span data-lucide="trash-2" style="width:12px; height:12px;"></span>
    </button>
  `;
  container.appendChild(div);
  renderIcons();
};

const openAddMilestoneForVision = (visionId) => {
  populateVisionsDropdown("milestoneVisionSelect", visionId);
  
  document.getElementById("milestoneIdInput").value = "";
  document.getElementById("milestoneTitleInput").value = "";
  document.getElementById("milestoneDateInput").value = getRelativeDateStr(-180);
  document.getElementById("milestoneProgressInput").value = "0";
  document.getElementById("ifthenPlansContainer").innerHTML = "";
  document.getElementById("commitmentSignature").value = "";
  
  createIfThenRow();
  document.getElementById("commitmentBoxArea").style.display = "block";
  
  openModal("modalAddMilestone");
};

const openAddHabitForMilestone = (milestoneId) => {
  populateMilestonesDropdown("habitMilestoneSelect", milestoneId);
  document.getElementById("habitIdInput").value = "";
  document.getElementById("habitTitleInput").value = "";
  openModal("modalAddHabit");
};

// ==========================================================================
// FORM SUBMIT HANDLERS
// ==========================================================================

// Settings triggers
document.getElementById("btnSettings").addEventListener("click", () => {
  // Populate current PIN in settings field
  document.getElementById("inputSettingsPIN").value = state.settings.passcode || "";
  openModal("modalSettings");
});

document.getElementById("btnSavePIN").addEventListener("click", () => {
  handleSavePIN();
});

document.getElementById("btnOpenSystemManual").addEventListener("click", () => {
  closeModal("modalSettings");
  openModal("modalSystemManual");
});

document.getElementById("btnCloseSystemManual").addEventListener("click", () => {
  closeModal("modalSystemManual");
});

document.getElementById("btnConfirmManual").addEventListener("click", () => {
  closeModal("modalSystemManual");
});

// Vision Board Customization
document.getElementById("btnEditVisionBoard").addEventListener("click", () => {
  document.getElementById("visionInputQuote").value = state.settings.visionBoardQuote;
  document.getElementById("visionInputWhy").value = state.settings.visionBoardWhy;
  document.getElementById("visionInputImageUrl").value = state.settings.visionBoardImageUrl;
  openModal("modalEditVisionBoard");
});

document.getElementById("btnSaveVisionBoard").addEventListener("click", () => {
  state.settings.visionBoardQuote = document.getElementById("visionInputQuote").value;
  state.settings.visionBoardWhy = document.getElementById("visionInputWhy").value;
  state.settings.visionBoardImageUrl = document.getElementById("visionInputImageUrl").value;
  saveToLocalStorage();
  renderVisionBoard();
  closeModal("modalEditVisionBoard");
  showToast("ビジョンボードを更新しました");
});

// Vision Submit
document.getElementById("btnSubmitVision").addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.getElementById("visionTitleInput").value.trim();
  const why = document.getElementById("visionWhyInput").value.trim();
  const risk = document.getElementById("visionRiskInput").value.trim();
  const pillar = document.getElementById("visionPillarSelect").value;
  const idInput = document.getElementById("visionIdInput").value;
  
  if (!title) {
    showToast("タイトルは必須です", "error");
    return;
  }
  
  if (idInput) {
    const v = state.visions.find(v => v.id === idInput);
    if (v) {
      v.title = title;
      v.why = why;
      v.riskOfFailure = risk;
      v.pillar = pillar;
      showToast("ビジョンを更新しました");
    }
  } else {
    const newVision = {
      id: "v-" + Date.now(),
      title,
      why,
      riskOfFailure: risk,
      pillar,
      createdAt: new Date().toISOString()
    };
    state.visions.push(newVision);
    showToast("ビジョンを追加しました");
  }
  
  saveToLocalStorage();
  renderGoalsMatrix();
  closeModal("modalAddVision");
});

const editVision = (id) => {
  const v = state.visions.find(v => v.id === id);
  if (!v) return;
  
  document.getElementById("visionModalTitle").textContent = "ビジョン(VISION)の編集";
  document.getElementById("visionIdInput").value = v.id;
  document.getElementById("visionTitleInput").value = v.title;
  document.getElementById("visionWhyInput").value = v.why || "";
  document.getElementById("visionRiskInput").value = v.riskOfFailure || "";
  document.getElementById("visionPillarSelect").value = v.pillar;
  
  openModal("modalAddVision");
};

const deleteVision = (id) => {
  if (confirm("このビジョンを削除しますか？紐付けられている目標や習慣も同時に削除されます。")) {
    const milestonesToDelete = state.milestones.filter(m => m.visionId === id).map(m => m.id);
    state.habits = state.habits.filter(h => !milestonesToDelete.includes(h.milestoneId));
    state.milestones = state.milestones.filter(m => m.visionId !== id);
    state.visions = state.visions.filter(v => v.id !== id);
    
    saveToLocalStorage();
    renderGoalsMatrix();
    renderPillarsProgress();
    renderTodayChecklist();
    showToast("ビジョンとその配下データを削除しました");
  }
};

// Milestone Submit
document.getElementById("btnSubmitMilestone").addEventListener("click", (e) => {
  e.preventDefault();
  const visionId = document.getElementById("milestoneVisionSelect").value;
  const title = document.getElementById("milestoneTitleInput").value.trim();
  const date = document.getElementById("milestoneDateInput").value;
  const progress = Math.min(Math.max(parseInt(document.getElementById("milestoneProgressInput").value) || 0, 0), 100);
  const idInput = document.getElementById("milestoneIdInput").value;
  
  if (!visionId) {
    showToast("紐付けるビジョンを選択してください", "error");
    return;
  }
  if (!title) {
    showToast("目標タイトルを入力してください", "error");
    return;
  }
  if (!date) {
    showToast("期限日を入力してください", "error");
    return;
  }
  
  if (!idInput) {
    const signature = document.getElementById("commitmentSignature").value.trim();
    if (!signature) {
      showToast("目標確定には誓約書への署名が必要です", "error");
      return;
    }
  }
  
  const ifThens = [];
  document.querySelectorAll(".ifthen-field-pair").forEach(pair => {
    const obs = pair.querySelector(".ifthen-obstacle").value.trim();
    const act = pair.querySelector(".ifthen-action").value.trim();
    if (obs && act) {
      ifThens.push({ obstacle: obs, action: act });
    }
  });
  
  if (idInput) {
    const m = state.milestones.find(m => m.id === idInput);
    if (m) {
      m.visionId = visionId;
      m.title = title;
      m.targetDate = date;
      m.progress = progress;
      m.ifThenPlans = ifThens;
      showToast("目標を更新しました");
    }
  } else {
    const newMilestone = {
      id: "m-" + Date.now(),
      visionId,
      title,
      targetDate: date,
      progress,
      status: "active",
      ifThenPlans: ifThens,
      commitmentSignature: document.getElementById("commitmentSignature").value.trim(),
      createdAt: new Date().toISOString()
    };
    state.milestones.push(newMilestone);
    showToast("目標をコミットしました");
  }
  
  saveToLocalStorage();
  renderGoalsMatrix();
  renderPillarsProgress();
  renderTodayChecklist();
  closeModal("modalAddMilestone");
});

const editMilestone = (id) => {
  const m = state.milestones.find(m => m.id === id);
  if (!m) return;
  
  populateVisionsDropdown("milestoneVisionSelect", m.visionId);
  
  document.getElementById("milestoneModalTitle").textContent = "目標の編集";
  document.getElementById("milestoneIdInput").value = m.id;
  document.getElementById("milestoneTitleInput").value = m.title;
  document.getElementById("milestoneDateInput").value = m.targetDate;
  document.getElementById("milestoneProgressInput").value = m.progress;
  
  document.getElementById("commitmentBoxArea").style.display = "none";
  
  const container = document.getElementById("ifthenPlansContainer");
  container.innerHTML = "";
  if (m.ifThenPlans && m.ifThenPlans.length > 0) {
    m.ifThenPlans.forEach(plan => {
      createIfThenRow(plan.obstacle, plan.action);
    });
  } else {
    createIfThenRow();
  }
  
  openModal("modalAddMilestone");
};

const deleteMilestone = (id) => {
  if (confirm("この目標を削除しますか？習慣も同時に削除されます。")) {
    state.habits = state.habits.filter(h => h.milestoneId !== id);
    state.milestones = state.milestones.filter(m => m.id !== id);
    
    saveToLocalStorage();
    renderGoalsMatrix();
    renderPillarsProgress();
    renderTodayChecklist();
    showToast("目標と関連習慣を削除しました");
  }
};

// Habit Submit
document.getElementById("btnSubmitHabit").addEventListener("click", (e) => {
  e.preventDefault();
  const milestoneId = document.getElementById("habitMilestoneSelect").value;
  const title = document.getElementById("habitTitleInput").value.trim();
  const type = document.getElementById("habitTypeSelect").value;
  const idInput = document.getElementById("habitIdInput").value;
  
  if (!milestoneId) {
    showToast("紐付ける目標を選択してください", "error");
    return;
  }
  if (!title) {
    showToast("アクション内容を入力してください", "error");
    return;
  }
  
  if (idInput) {
    const h = state.habits.find(h => h.id === idInput);
    if (h) {
      h.milestoneId = milestoneId;
      h.title = title;
      h.type = type;
      showToast("習慣を更新しました");
    }
  } else {
    const newHabit = {
      id: "h-" + Date.now(),
      milestoneId,
      title,
      type,
      history: [],
      createdAt: new Date().toISOString()
    };
    state.habits.push(newHabit);
    showToast("新しい習慣・アクションを登録しました");
  }
  
  saveToLocalStorage();
  renderGoalsMatrix();
  renderTodayChecklist();
  closeModal("modalAddHabit");
});

const deleteHabit = (id) => {
  if (confirm("このアクションを削除しますか？これまでの達成履歴も失われます。")) {
    state.habits = state.habits.filter(h => h.id !== id);
    saveToLocalStorage();
    renderGoalsMatrix();
    renderTodayChecklist();
    showToast("アクションを削除しました");
  }
};

// Reflection Submit (Standard Write)
document.getElementById("btnSubmitReflection").addEventListener("click", (e) => {
  e.preventDefault();
  const score = parseInt(document.getElementById("reflectInputScore").value);
  const wentWell = document.getElementById("reflectInputWentWell").value.trim();
  const toImprove = document.getElementById("reflectInputToImprove").value.trim();
  const adjustments = document.getElementById("reflectInputAdjustments").value.trim();
  
  if (!wentWell || !toImprove || !adjustments) {
    showToast("簡易保存をご利用いただくか、すべての質問にご回答ください", "error");
    return;
  }
  
  const newReflection = {
    id: "r-" + Date.now(),
    date: getTodayStr(),
    score,
    whatWentWell: wentWell,
    whatToImprove: toImprove,
    adjustments
  };
  
  state.reflections.push(newReflection);
  saveToLocalStorage();
  renderReflections();
  closeModal("modalReflection");
  showToast("振り返りを記録しました");
  switchTab("reflections");
});

// Reflection Quick Submit (1-Tap bypass text inputs)
document.getElementById("btnQuickSubmitReflection").addEventListener("click", (e) => {
  e.preventDefault();
  const score = parseInt(document.getElementById("reflectInputScore").value);
  
  const newReflection = {
    id: "r-" + Date.now(),
    date: getTodayStr(),
    score,
    whatWentWell: "[簡易記録: 詳細ログの記入をスキップしました]",
    whatToImprove: "[簡易記録: 詳細ログの記入をスキップしました]",
    adjustments: "[簡易記録: 詳細ログの記入をスキップしました]"
  };
  
  state.reflections.push(newReflection);
  saveToLocalStorage();
  renderReflections();
  closeModal("modalReflection");
  showToast("簡易振り返りを保存しました");
  switchTab("reflections");
});

const deleteReflection = (id) => {
  if (confirm("この振り返りログを削除しますか？")) {
    state.reflections = state.reflections.filter(r => r.id !== id);
    saveToLocalStorage();
    renderReflections();
    showToast("振り返りログを削除しました");
  }
};

// Dynamic listeners and footer actions
document.getElementById("btnAddIfThenRow").addEventListener("click", () => {
  createIfThenRow();
});

document.querySelectorAll(".bottom-nav-item").forEach(link => {
  link.addEventListener("click", () => {
    switchTab(link.getAttribute("data-tab"));
  });
});

document.getElementById("btnQuickAddGoal").addEventListener("click", () => {
  if (state.visions.length === 0) {
    showToast("先に『ビジョン』を追加してください", "error");
    openModal("modalAddVision");
  } else {
    openAddMilestoneForVision(state.visions[0].id);
  }
});

document.getElementById("btnQuickReflect").addEventListener("click", () => {
  document.getElementById("reflectInputScore").value = "5";
  document.getElementById("reflectInputWentWell").value = "";
  document.getElementById("reflectInputToImprove").value = "";
  document.getElementById("reflectInputAdjustments").value = "";
  openModal("modalReflection");
});

document.getElementById("btnNewReflection").addEventListener("click", () => {
  document.getElementById("btnQuickReflect").click();
});

document.getElementById("btnAddNewVision").addEventListener("click", () => {
  document.getElementById("visionModalTitle").textContent = "長期ビジョンの作成";
  document.getElementById("visionIdInput").value = "";
  document.getElementById("visionTitleInput").value = "";
  document.getElementById("visionWhyInput").value = "";
  document.getElementById("visionRiskInput").value = "";
  document.getElementById("visionPillarSelect").value = "career";
  openModal("modalAddVision");
});

document.getElementById("btnAddNewMilestone").addEventListener("click", () => {
  if (state.visions.length === 0) {
    showToast("先にビジョンを作成してください", "error");
    document.getElementById("btnAddNewVision").click();
  } else {
    openAddMilestoneForVision(state.visions[0].id);
  }
});

// Stealth button toggle listener
document.getElementById("btnStealthToggle").addEventListener("click", () => {
  toggleStealthMode();
});

// HTML escaping helper
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================================================
// IMPORT & EXPORT ENGINE (JSON & CSV processing)
// ==========================================================================
const downloadFile = (content, fileName, contentType) => {
  const a = document.createElement("a");
  const file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

// JSON
document.getElementById("btnExportJSON").addEventListener("click", () => {
  const exportedString = JSON.stringify(state, null, 2);
  const dateStr = getTodayStr();
  downloadFile(exportedString, `horizon_stealth_backup_${dateStr}.json`, "application/json");
  showToast("JSONデータを出力しました");
});

document.getElementById("importJSONFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (!parsed.visions || !parsed.milestones || !parsed.habits || !parsed.settings) {
        throw new Error("必要なデータキーが見つかりません。");
      }
      state = parsed;
      saveToLocalStorage();
      
      applyTheme();
      checkPasscodeOnStart();
      applyStealthMode();
      renderVisionBoard();
      renderPillarsProgress();
      renderTodayChecklist();
      showToast("データを完全復元しました！");
      switchTab("dashboard");
    } catch (err) {
      showToast("復元に失敗しました: " + err.message, "error");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

// CSV
document.getElementById("btnExportCSV").addEventListener("click", () => {
  let csvContent = "\uFEFF"; // BOM
  csvContent += "VisionTitle,Pillar,MilestoneTitle,TargetDate,Progress%,Status,IfThenPlans\n";
  
  state.milestones.forEach(m => {
    const vision = state.visions.find(v => v.id === m.visionId);
    const visionTitle = vision ? vision.title : "個別目標";
    const pillarName = vision ? PILLARS[vision.pillar]?.name || vision.pillar : "その他";
    const ifThens = m.ifThenPlans ? m.ifThenPlans.map(plan => `[障害: ${plan.obstacle} -> 対策: ${plan.action}]`).join(" | ") : "";
    
    const escapeCsvCell = (val) => {
      const strVal = String(val || "");
      return `"${strVal.replace(/"/g, '""')}"`;
    };
    
    csvContent += [
      escapeCsvCell(visionTitle),
      escapeCsvCell(pillarName),
      escapeCsvCell(m.title),
      escapeCsvCell(m.targetDate),
      m.progress || 0,
      escapeCsvCell(m.status),
      escapeCsvCell(ifThens)
    ].join(",") + "\n";
  });
  
  const dateStr = getTodayStr();
  downloadFile(csvContent, `horizon_goals_${dateStr}.csv`, "text/csv;charset=utf-8;");
  showToast("CSVデータを出力しました");
});

document.getElementById("importCSVFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const text = evt.target.result;
      const rows = parseCSV(text);
      if (rows.length === 0) throw new Error("CSVファイルが空です。");
      
      let importedCount = 0;
      rows.forEach(cells => {
        if (cells.length < 3) return;
        
        const visionTitle = cells[0] ? cells[0].trim() : "CSVビジョン";
        const pillarNameInput = cells[1] ? cells[1].trim().toLowerCase() : "career";
        const milestoneTitle = cells[2] ? cells[2].trim() : "";
        const targetDate = cells[3] ? cells[3].trim() : getRelativeDateStr(-90);
        const progress = Math.min(Math.max(parseInt(cells[4]) || 0, 0), 100);
        const status = cells[5] ? cells[5].trim() : "active";
        const ifThenRaw = cells[6] ? cells[6].trim() : "";
        
        if (!milestoneTitle) return;
        
        let pillarKey = "career";
        Object.keys(PILLARS).forEach(key => {
          if (pillarNameInput.includes(key) || PILLARS[key].name.toLowerCase().includes(pillarNameInput)) {
            pillarKey = key;
          }
        });
        
        let vision = state.visions.find(v => v.title === visionTitle);
        if (!vision) {
          vision = {
            id: "v-" + Date.now() + Math.random().toString(36).substr(2, 5),
            title: visionTitle,
            why: "CSVインポートで自動生成",
            riskOfFailure: "未設定",
            pillar: pillarKey,
            createdAt: new Date().toISOString()
          };
          state.visions.push(vision);
        }
        
        const ifThenPlans = [];
        if (ifThenRaw) {
          const planBlocks = ifThenRaw.split(/\s*\|\s*/);
          planBlocks.forEach(block => {
            const match = block.match(/\[障害:\s*(.*?)\s*->\s*対策:\s*(.*?)\]/);
            if (match && match[1] && match[2]) {
              ifThenPlans.push({ obstacle: match[1], action: match[2] });
            }
          });
        }
        
        const newMilestone = {
          id: "m-" + Date.now() + Math.random().toString(36).substr(2, 5),
          visionId: vision.id,
          title: milestoneTitle,
          targetDate,
          progress,
          status,
          ifThenPlans,
          commitmentSignature: "CSV IMPORT",
          createdAt: new Date().toISOString()
        };
        state.milestones.push(newMilestone);
        importedCount++;
      });
      
      saveToLocalStorage();
      renderGoalsMatrix();
      renderPillarsProgress();
      renderTodayChecklist();
      showToast(`${importedCount}個の目標をインポートしました！`);
      switchTab("goals");
    } catch (err) {
      showToast("CSVインポート失敗: " + err.message, "error");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let row = [];
    let insideQuote = false;
    let entry = '';
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') insideQuote = !insideQuote;
      else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else entry += char;
    }
    row.push(entry.trim());
    row = row.map(cell => cell.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
    result.push(row);
  }
  return result;
}

// Global scope bindings for inline HTML onClick handlers
window.toggleHabit = toggleHabit;
window.toggleDetails = toggleDetails;
window.editVision = editVision;
window.deleteVision = deleteVision;
window.editMilestone = editMilestone;
window.deleteMilestone = deleteMilestone;
window.deleteHabit = deleteHabit;
window.deleteReflection = deleteReflection;
window.openAddMilestoneForVision = openAddMilestoneForVision;
window.openAddHabitForMilestone = openAddHabitForMilestone;
window.changeTheme = changeTheme;
window.pressPIN = pressPIN;

// ==========================================================================
// APPLICATION LIFECYCLE INITIALIZER
// ==========================================================================
const initApp = () => {
  loadFromLocalStorage();
  
  applyTheme();
  checkPasscodeOnStart();
  applyStealthMode();
  renderVisionBoard();
  renderPillarsProgress();
  renderTodayChecklist();
  
  renderIcons(); // Compile offline SVGs on launch
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
