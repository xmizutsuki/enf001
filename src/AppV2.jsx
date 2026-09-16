import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award, BookOpen, Brain, ChevronRight, CircleCheck, Download, Flame, HeartPulse,
  Home, Languages, LockKeyhole, Mic, PenLine, Play, RotateCcw, ShieldCheck,
  Sparkles, Star, Stethoscope, Trophy, Upload, UserRound, Volume2, X,
} from 'lucide-react';
import content from './data/content.js';
import {
  createBackup, downloadBackup, importBackupFile, loadPreferences, loadProgress,
  resetLocalData, savePreferences, saveProgress, today,
} from './lib/localData.js';

const iconMap = { languages: Languages, stethoscope: Stethoscope, penline: PenLine, heartpulse: HeartPulse };
const levelRank = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

function normalize(text = '') {
  return text.toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function evaluateNote(text, clinicalCase) {
  const value = normalize(text);
  const required = (clinicalCase.required || []).map(([label, terms, points]) => ({
    label,
    points,
    ok: terms.some((term) => value.includes(normalize(term))),
  }));
  const objective = { label: 'Objective language', points: 10, ok: !/looks bad|very sick|not good|crazy|lazy|weird|terrible/.test(value) };
  const structure = { label: 'Readable structure', points: 8, ok: text.trim().length >= 90 };
  const checks = [...required, objective, structure];
  const possible = checks.reduce((sum, item) => sum + item.points, 0);
  const earned = checks.reduce((sum, item) => sum + (item.ok ? item.points : 0), 0);
  return {
    score: Math.min(100, Math.round((earned / possible) * 100)),
    checks,
    suggestions: checks.filter((item) => !item.ok).map((item) => item.label),
  };
}

function AppV2() {
  const [tab, setTab] = useState('learn');
  const [progress, setProgress] = useState(null);
  const [preferences, setPreferences] = useState(loadPreferences);
  const [activeLesson, setActiveLesson] = useState(null);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    loadProgress().then((saved) => {
      if (!active) return;
      setProgress(saved);
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (hydrated && progress) saveProgress(progress);
  }, [progress, hydrated]);

  useEffect(() => {
    if (!hydrated || preferences.contentVersion === content.contentVersion) return;
    const next = { ...preferences, contentVersion: content.contentVersion };
    setPreferences(next);
    savePreferences(next);
    if (preferences.contentVersion) {
      setToast(`Curriculum updated · v${content.contentVersion}`);
      setTimeout(() => setToast(''), 3200);
    }
  }, [hydrated]);

  const updatePreferences = (next) => {
    setPreferences(next);
    savePreferences(next);
  };

  const completeLesson = (lesson, correct, total) => {
    const ratio = total ? correct / total : 1;
    const earned = Math.max(5, Math.round(lesson.xp * ratio));
    setProgress((old) => {
      const completedLessons = old.completedLessons.includes(lesson.id) ? old.completedLessons : [...old.completedLessons, lesson.id];
      let streak = old.streak;
      const currentDay = today();
      if (old.lastStudyDate !== currentDay) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        streak = old.lastStudyDate === yesterday.toISOString().slice(0, 10) ? old.streak + 1 : 1;
      }
      const typeToSkill = { vocabulary: 'vocabulary', reading: 'reading', interview: 'clinical', clinical: 'clinical', writing: 'writing', speaking: 'speaking', simulation: 'clinical' };
      const skill = typeToSkill[lesson.type];
      return {
        ...old,
        xp: old.xp + earned,
        streak,
        lastStudyDate: currentDay,
        completedLessons,
        wordsMastered: old.wordsMastered + (lesson.type === 'vocabulary' ? correct : 0),
        skillScores: {
          ...old.skillScores,
          ...(skill ? { [skill]: Math.min(100, old.skillScores[skill] + Math.max(1, Math.round(ratio * 3))) } : {}),
        },
      };
    });
    setToast(`+${earned} XP · ${lesson.level} lesson completed`);
    setTimeout(() => setToast(''), 2800);
  };

  const handleReset = async () => {
    const reset = await resetLocalData();
    setProgress(reset.progress);
    setPreferences(reset.preferences);
    setToast('Local learning data reset');
    setTimeout(() => setToast(''), 2800);
  };

  const handleExport = async () => {
    downloadBackup(await createBackup(content.contentVersion));
    setToast('Backup exported');
    setTimeout(() => setToast(''), 2800);
  };

  const handleImport = async (file) => {
    try {
      const restored = await importBackupFile(file);
      setProgress(restored.progress);
      setPreferences(restored.preferences);
      setToast('Backup restored successfully');
    } catch (error) {
      setToast(error.message || 'Could not import this backup');
    }
    setTimeout(() => setToast(''), 3200);
  };

  if (!progress) {
    return <div className="app-shell"><div className="app-loading"><HeartPulse size={32} /><strong>ClinSpeak</strong><span>Loading your local curriculum…</span></div></div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setTab('learn')} aria-label="ClinSpeak home">
          <span className="brand-mark"><HeartPulse size={21} /></span>
          <span><strong>ClinSpeak</strong><small>Medical English</small></span>
        </button>
        <div className="top-stats">
          <span><Flame size={18} /> {progress.streak}</span>
          <span><Star size={18} /> {progress.xp}</span>
          <span><Trophy size={18} /> {preferences.englishLevel}</span>
        </div>
      </header>

      <main className="main-layout">
        <aside className="desktop-nav">
          <NavButton icon={Home} label="Learn" active={tab === 'learn'} onClick={() => setTab('learn')} />
          <NavButton icon={Brain} label="Practice" active={tab === 'practice'} onClick={() => setTab('practice')} />
          <NavButton icon={Mic} label="Speaking" active={tab === 'speaking'} onClick={() => setTab('speaking')} />
          <NavButton icon={Trophy} label="Progress" active={tab === 'progress'} onClick={() => setTab('progress')} />
          <NavButton icon={UserRound} label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
          <div className="nav-disclaimer"><ShieldCheck size={16} /> Educational language training only.</div>
        </aside>

        <section className="content-area">
          {tab === 'learn' && <LearnView progress={progress} preferences={preferences} onLesson={setActiveLesson} onPractice={() => setTab('practice')} />}
          {tab === 'practice' && <PracticeView progress={progress} setProgress={setProgress} preferences={preferences} />}
          {tab === 'speaking' && <SpeakingView setProgress={setProgress} preferences={preferences} />}
          {tab === 'progress' && <ProgressView progress={progress} preferences={preferences} />}
          {tab === 'profile' && <ProfileView progress={progress} preferences={preferences} onPreferences={updatePreferences} onReset={handleReset} onExport={handleExport} onImport={handleImport} />}
        </section>
      </main>

      <nav className="mobile-nav">
        <NavButton icon={Home} label="Learn" active={tab === 'learn'} onClick={() => setTab('learn')} />
        <NavButton icon={Brain} label="Practice" active={tab === 'practice'} onClick={() => setTab('practice')} />
        <NavButton icon={Mic} label="Speaking" active={tab === 'speaking'} onClick={() => setTab('speaking')} />
        <NavButton icon={Trophy} label="Progress" active={tab === 'progress'} onClick={() => setTab('progress')} />
        <NavButton icon={UserRound} label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </nav>

      <button className="tutor-fab" onClick={() => setTutorOpen(true)}><Sparkles size={20} /><span>Clinical Tutor</span></button>
      {activeLesson && <LessonModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={completeLesson} />}
      {tutorOpen && <TutorPanel onClose={() => setTutorOpen(false)} />}
      {toast && <div className="toast"><CircleCheck size={18} /> {toast}</div>}
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}><Icon size={21} /><span>{label}</span></button>;
}

function LearnView({ progress, preferences, onLesson, onPractice }) {
  const allLessons = content.units.flatMap((unit) => unit.lessons);
  const completedValid = progress.completedLessons.filter((id) => allLessons.some((lesson) => lesson.id === id));
  const nextLesson = allLessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) || allLessons[0];
  const recommendedLevel = preferences.englishLevel;

  return (
    <div className="page page-learn">
      <section className="hero-card">
        <div>
          <span className="eyebrow">A1 → C1 CLINICAL ENGLISH</span>
          <h1>Learn the language.<br />Practice the clinical situation.</h1>
          <p>100 lessons · {content.questionCount}+ exercises · assessment, speaking, handoff, documentation and specialty nursing.</p>
          <button className="primary-button" onClick={() => onLesson(nextLesson)}><Play size={18} /> Continue learning</button>
        </div>
        <div className="daily-ring"><strong>{Math.min(preferences.dailyGoal, progress.xp % Math.max(preferences.dailyGoal, 1))}</strong><span>/ {preferences.dailyGoal} XP</span><small>Daily goal</small></div>
      </section>

      <div className="quick-grid">
        <button className="quick-card" onClick={onPractice}><Brain /><span><strong>Daily review</strong><small>{content.reviewWords.length} medical terms</small></span><ChevronRight /></button>
        <button className="quick-card" onClick={onPractice}><PenLine /><span><strong>Nursing notes</strong><small>{content.nursingCases.length} writing cases</small></span><ChevronRight /></button>
      </div>

      <div className="section-heading"><div><span className="eyebrow">LEARNING PATH</span><h2>Your clinical journey</h2></div><span className="mini-pill">{completedValid.length}/{allLessons.length} lessons</span></div>

      {content.levels.map((level) => {
        const levelUnits = content.units.filter((unit) => unit.level === level.id);
        const levelLessons = levelUnits.flatMap((unit) => unit.lessons);
        const levelCompleted = levelLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
        return (
          <section className="level-section" key={level.id}>
            <div className={`level-banner level-${level.id.toLowerCase()}`}>
              <div><span className="level-badge">{level.id}</span><h2>{level.title.replace(`${level.id} · `, '')}</h2><p>{level.description}</p></div>
              <div className="level-summary"><strong>{levelCompleted}/{levelLessons.length}</strong><span>lessons</span>{level.id === recommendedLevel && <small>YOUR SELECTED LEVEL</small>}</div>
            </div>
            <div className="learning-path">
              {levelUnits.map((unit) => <UnitCard key={unit.id} unit={unit} progress={progress} onLesson={onLesson} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function UnitCard({ unit, progress, onLesson }) {
  const Icon = iconMap[unit.icon] || BookOpen;
  const globalIndex = content.units.findIndex((item) => item.id === unit.id);
  const previousUnit = globalIndex > 0 ? content.units[globalIndex - 1] : null;
  const unlocked = !previousUnit || previousUnit.lessons.every((lesson) => progress.completedLessons.includes(lesson.id));
  const complete = unit.lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;

  return (
    <section className={`unit-card ${!unlocked ? 'locked' : ''}`}>
      <div className="unit-header">
        <div className="unit-icon">{unlocked ? <Icon size={25} /> : <LockKeyhole size={23} />}</div>
        <div><small>{unit.level} · UNIT {globalIndex + 1}</small><h3>{unit.title}</h3><p>{unit.subtitle}</p></div>
        <span className="unit-progress">{complete}/{unit.lessons.length}</span>
      </div>
      <div className="lesson-row">
        {unit.lessons.map((lesson, index) => {
          const done = progress.completedLessons.includes(lesson.id);
          const priorDone = index === 0 || progress.completedLessons.includes(unit.lessons[index - 1].id);
          const canOpen = unlocked && priorDone;
          return (
            <button key={lesson.id} className={`lesson-node ${done ? 'done' : ''} ${!canOpen ? 'disabled' : ''}`} onClick={() => canOpen && onLesson(lesson)} disabled={!canOpen}>
              <span className="node-circle">{done ? <CircleCheck size={23} /> : canOpen ? <Play size={20} /> : <LockKeyhole size={18} />}</span>
              <strong>{lesson.title}</strong><small>{lesson.level} · +{lesson.xp} XP</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LessonModal({ lesson, onClose, onComplete }) {
  const questions = content.lessonQuestions[lesson.id] || [];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  if (!question) return <div className="modal-backdrop"><div className="lesson-modal"><div className="lesson-body"><h2>Lesson content unavailable.</h2><button className="primary-button full" onClick={onClose}>Close</button></div></div></div>;

  const check = () => {
    if (!selected) return;
    if (selected === question.answer) setCorrect((value) => value + 1);
    setChecked(true);
  };

  const next = () => {
    if (index >= questions.length - 1) {
      setFinished(true);
      onComplete(lesson, correct, questions.length);
      return;
    }
    setIndex((value) => value + 1);
    setSelected('');
    setChecked(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="lesson-modal">
        <div className="lesson-top">
          <button className="icon-button" onClick={onClose}><X /></button>
          <div className="lesson-progress-track"><span style={{ width: `${finished ? 100 : ((index + 1) / questions.length) * 100}%` }} /></div>
          <span className="heart-count">{lesson.level}</span>
        </div>
        {!finished ? (
          <div className="lesson-body">
            <span className="eyebrow">{lesson.level} · {lesson.title.toUpperCase()}</span><h2>{question.prompt}</h2>
            <div className="answer-list">{question.options.map((option, i) => {
              const state = checked && option === question.answer ? 'correct' : checked && option === selected ? 'wrong' : selected === option ? 'selected' : '';
              return <button key={`${option}-${i}`} className={`answer-option ${state}`} onClick={() => !checked && setSelected(option)}><span>{String.fromCharCode(65 + i)}</span>{option}</button>;
            })}</div>
            {checked && <div className={`feedback-box ${selected === question.answer ? 'good' : 'needs-work'}`}><strong>{selected === question.answer ? 'Excellent.' : 'Not quite.'}</strong><p>{question.tip}</p></div>}
            <button className="primary-button full" onClick={checked ? next : check} disabled={!selected}>{checked ? (index === questions.length - 1 ? 'Finish lesson' : 'Continue') : 'Check answer'}</button>
          </div>
        ) : (
          <div className="lesson-finish"><div className="success-orb"><Award size={48} /></div><span className="eyebrow">{lesson.level} LESSON COMPLETE</span><h2>Clinical English progress saved</h2><p>You got {correct} of {questions.length} correct.</p><div className="finish-stats"><span><Star /> +{lesson.xp} possible XP</span><span><CircleCheck /> {Math.round((correct / questions.length) * 100)}% accuracy</span></div><button className="primary-button full" onClick={onClose}>Back to learning path</button></div>
        )}
      </div>
    </div>
  );
}

function PracticeView({ progress, setProgress, preferences }) {
  const [mode, setMode] = useState('review');
  return (
    <div className="page">
      <span className="eyebrow">SMART PRACTICE</span><h1>Strengthen what matters</h1><p className="lead">Spaced repetition, nursing documentation and your personal error bank — all stored locally.</p>
      <div className="segmented"><button className={mode === 'review' ? 'active' : ''} onClick={() => setMode('review')}>Daily review</button><button className={mode === 'writing' ? 'active' : ''} onClick={() => setMode('writing')}>Nursing note</button><button className={mode === 'mistakes' ? 'active' : ''} onClick={() => setMode('mistakes')}>My mistakes</button></div>
      {mode === 'review' && <ReviewDeck progress={progress} setProgress={setProgress} preferences={preferences} />}
      {mode === 'writing' && <NursingNoteChallenge setProgress={setProgress} preferences={preferences} />}
      {mode === 'mistakes' && <MistakeNotebook mistakes={progress.mistakes} />}
    </div>
  );
}

function ReviewDeck({ progress, setProgress, preferences }) {
  const allowedRank = levelRank[preferences.englishLevel] || 3;
  const eligible = content.reviewWords.filter((item) => levelRank[item.level] <= allowedRank);
  const due = eligible.filter((item) => !progress.reviewState?.[item.term]?.nextReview || progress.reviewState[item.term].nextReview <= today());
  const deck = due.length ? due : eligible;
  const [card, setCard] = useState(0);
  const [show, setShow] = useState(false);
  const current = deck[card % Math.max(deck.length, 1)];
  if (!current) return <section className="practice-panel"><h2>No review terms available.</h2></section>;

  const rate = (easy) => {
    setProgress((old) => {
      const previous = old.reviewState?.[current.term] || { interval: 0, repetitions: 0 };
      const interval = easy ? Math.min(45, Math.max(3, previous.interval * 2 || 3)) : 1;
      return {
        ...old,
        xp: old.xp + (easy ? 3 : 2),
        wordsMastered: old.wordsMastered + (easy ? 1 : 0),
        reviewState: { ...(old.reviewState || {}), [current.term]: { interval, repetitions: previous.repetitions + 1, lastReviewed: today(), nextReview: addDays(today(), interval) } },
      };
    });
    setCard((value) => value + 1);
    setShow(false);
  };

  return (
    <section className="practice-panel">
      <div className="panel-header"><div><small>SPACED REVIEW · UP TO {preferences.englishLevel}</small><h2>{due.length || deck.length} terms ready</h2></div><span className="mini-pill"><Brain size={15} /> local SRS</span></div>
      <button className={`flashcard ${show ? 'revealed' : ''}`} onClick={() => setShow(true)}><small>{current.level} · {current.topic}</small><strong>{current.term}</strong>{show ? <p>{current.meaning}</p> : <span>Tap to reveal meaning</span>}</button>
      {show && <div className="rating-row"><button onClick={() => rate(false)}>Needs review</button><button onClick={() => rate(true)}>Got it</button></div>}
      <p className="muted">The review schedule stays in IndexedDB on this device.</p>
    </section>
  );
}

function NursingNoteChallenge({ setProgress, preferences }) {
  const available = content.nursingCases.filter((item) => levelRank[item.level] <= Math.max(3, levelRank[preferences.englishLevel] || 3));
  const [caseIndex, setCaseIndex] = useState(0);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const clinicalCase = available[caseIndex % available.length];

  const submit = () => {
    const evaluated = evaluateNote(text, clinicalCase);
    setResult(evaluated);
    setProgress((old) => ({
      ...old,
      xp: old.xp + Math.max(5, Math.round(evaluated.score / 8)),
      noteHistory: [...old.noteHistory, { date: today(), score: evaluated.score, caseId: clinicalCase.id, excerpt: text.slice(0, 180) }].slice(-40),
      skillScores: { ...old.skillScores, writing: Math.min(100, Math.max(old.skillScores.writing, Math.round(evaluated.score * 0.8))) },
    }));
  };

  const nextCase = () => { setCaseIndex((value) => value + 1); setText(''); setResult(null); };

  return (
    <section className="writing-grid">
      <div className="case-card"><span className="eyebrow">{clinicalCase.level} WRITING CASE</span><h2>{clinicalCase.title}</h2><p>{clinicalCase.patient}</p><div className="finding-list">{clinicalCase.findings.map((finding) => <span key={finding}><CircleCheck size={16} /> {finding}</span>)}</div><div className="case-goal"><strong>Your task</strong><p>Write a concise nursing progress note using relevant subjective and objective findings.</p></div><button className="secondary-button" onClick={nextCase}>Next case <ChevronRight size={16} /></button></div>
      <div className="note-card"><div className="panel-header"><div><small>CLINICAL WRITING</small><h2>Progress note</h2></div><span className="mini-pill">{text.length} chars</span></div><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Patient alert and oriented..." /><button className="primary-button full" disabled={text.trim().length < 30} onClick={submit}><Sparkles size={18} /> Evaluate my note</button>{result && <div className="note-result"><div className="score-badge"><strong>{result.score}</strong><span>/100</span></div><div><h3>{result.score >= 80 ? 'Strong clinical documentation' : 'Keep refining it'}</h3><p>{result.suggestions.length ? `Consider adding or improving: ${result.suggestions.join(', ')}.` : 'You captured the key findings with objective language.'}</p></div><details><summary>Show model answer</summary><p>{clinicalCase.model}</p></details></div>}</div>
    </section>
  );
}

function MistakeNotebook({ mistakes }) {
  return <section className="practice-panel"><div className="panel-header"><div><small>PERSONAL ERROR BANK</small><h2>My mistakes</h2></div><span className="mini-pill">{mistakes.length} saved</span></div><div className="mistake-list">{mistakes.map((item, index) => <div className="mistake-item" key={`${item.wrong}-${index}`}><span className="tag">{item.tag}</span><p className="wrong-text">✕ {item.wrong}</p><p className="right-text">✓ {item.right}</p></div>)}</div></section>;
}

function SpeakingView({ setProgress, preferences }) {
  const allowedRank = levelRank[preferences.englishLevel] || 3;
  const phrases = content.speakingPhrases.filter((_, index) => index < Math.max(6, allowedRank * 4));
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [heard, setHeard] = useState('');
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState(null);
  const recognitionRef = useRef(null);
  const phrase = phrases[phraseIndex % phrases.length];

  const speak = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      speechSynthesis.speak(utterance);
    }
  };

  const evaluateSpeech = (transcript) => {
    const targetWords = new Set(normalize(phrase).split(' '));
    const saidWords = new Set(normalize(transcript).split(' '));
    const matches = [...targetWords].filter((word) => saidWords.has(word)).length;
    const value = Math.max(0, Math.min(100, Math.round((matches / targetWords.size) * 100)));
    setScore(value);
    setProgress((old) => ({ ...old, xp: old.xp + Math.max(2, Math.round(value / 20)), skillScores: { ...old.skillScores, speaking: Math.min(100, Math.max(old.skillScores.speaking, Math.round(value * 0.8))) } }));
  };

  const startRecognition = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setHeard('Speech recognition is not available in this browser.'); return; }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => { const transcript = event.results[0][0].transcript; setHeard(transcript); evaluateSpeech(transcript); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const next = () => { setPhraseIndex((value) => (value + 1) % phrases.length); setHeard(''); setScore(null); };
  return (
    <div className="page"><span className="eyebrow">SPEAKING LAB · {preferences.englishLevel}</span><h1>Sound clear in clinical situations</h1><p className="lead">Shadow patient-interview, handoff, SBAR, teaching and escalation phrases.</p><section className="speaking-card"><div className="speaker-visual"><div className={listening ? 'pulse-ring listening' : 'pulse-ring'}><Mic size={44} /></div></div><span className="eyebrow">SHADOW THIS PHRASE</span><h2>“{phrase}”</h2><div className="speak-actions"><button onClick={speak}><Volume2 /> Listen</button><button className="record-button" onClick={startRecognition}><Mic /> {listening ? 'Listening…' : 'Speak now'}</button></div>{heard && <div className="heard-box"><small>WE HEARD</small><p>{heard}</p></div>}{score !== null && <div className="speech-score"><div><strong>{score}%</strong><span>phrase match</span></div><p>{score >= 80 ? 'Strong lexical match. Now focus on rhythm and natural pacing.' : 'Try again slowly and emphasize the key clinical words.'}</p></div>}<button className="text-button" onClick={next}>Next phrase <ChevronRight size={17} /></button></section><div className="info-strip"><ShieldCheck /><p><strong>Privacy:</strong> the app does not upload recordings to an application backend. Browser speech recognition behavior depends on the browser/device.</p></div></div>
  );
}

function ProgressView({ progress, preferences }) {
  const entries = Object.entries(progress.skillScores);
  const avg = Math.round(entries.reduce((sum, [, value]) => sum + value, 0) / entries.length);
  const allLessons = content.units.flatMap((unit) => unit.lessons);
  const completed = progress.completedLessons.filter((id) => allLessons.some((lesson) => lesson.id === id)).length;
  const currentLevel = content.levels.find((level) => content.units.filter((unit) => unit.level === level.id).flatMap((unit) => unit.lessons).some((lesson) => !progress.completedLessons.includes(lesson.id)))?.id || 'C1';
  return (
    <div className="page"><span className="eyebrow">YOUR PERFORMANCE</span><h1>Clinical English Score</h1><div className="progress-hero"><div className="big-score"><strong>{avg}</strong><span>/100</span></div><div><h2>{currentLevel} pathway</h2><p>{completed} of {allLessons.length} lessons completed. Selected practice ceiling: {preferences.englishLevel}.</p></div></div><div className="stats-grid"><StatCard icon={Flame} label="Streak" value={`${progress.streak} days`} /><StatCard icon={Star} label="Total XP" value={progress.xp} /><StatCard icon={BookOpen} label="Terms mastered" value={progress.wordsMastered} /><StatCard icon={PenLine} label="Notes written" value={progress.noteHistory.length} /></div><section className="skill-panel"><div className="panel-header"><div><small>SKILL MAP</small><h2>Competency breakdown</h2></div><span className="mini-pill">A1 → C1</span></div><div className="skill-bars">{entries.map(([label, value]) => <div className="skill-row" key={label}><div><strong>{label}</strong><span>{value}%</span></div><div className="bar"><span style={{ width: `${value}%` }} /></div></div>)}</div></section></div>
  );
}

function StatCard({ icon: Icon, label, value }) { return <div className="stat-card"><Icon /><div><small>{label}</small><strong>{value}</strong></div></div>; }

function ProfileView({ progress, preferences, onPreferences, onReset, onExport, onImport }) {
  const inputRef = useRef(null);
  return (
    <div className="page"><span className="eyebrow">LOCAL PROFILE</span><h1>Your learning setup</h1><section className="profile-card"><div className="avatar"><UserRound size={38} /></div><div><h2>{preferences.name}</h2><p>{preferences.profession} · Medical English pathway</p></div><span className="mini-pill">{preferences.englishLevel}</span></section>
      <section className="settings-card"><h2>Learning preferences</h2><div className="profile-form"><label>Name<input value={preferences.name} onChange={(e) => onPreferences({ ...preferences, name: e.target.value })} /></label><label>Profession<select value={preferences.profession} onChange={(e) => onPreferences({ ...preferences, profession: e.target.value })}><option>Nurse</option><option>Physician</option><option>Physiotherapist</option><option>Pharmacist</option><option>Healthcare Student</option><option>Other Healthcare Professional</option></select></label><label>English level<select value={preferences.englishLevel} onChange={(e) => onPreferences({ ...preferences, englishLevel: e.target.value })}>{content.levels.map((level) => <option key={level.id}>{level.id}</option>)}</select></label><label>Daily XP goal<select value={preferences.dailyGoal} onChange={(e) => onPreferences({ ...preferences, dailyGoal: Number(e.target.value) })}><option value="15">15 XP</option><option value="30">30 XP</option><option value="50">50 XP</option><option value="75">75 XP</option></select></label></div></section>
      <section className="settings-card"><h2>Curriculum installed locally</h2><p>Version {content.contentVersion} · {content.lessonCount} lessons · {content.questionCount}+ exercise items · {content.reviewWords.length} review terms · {content.nursingCases.length} nursing-writing cases.</p><div className="goal-chips">{content.levels.map((level) => <span key={level.id}>{level.id}</span>)}<span>SBAR</span><span>Handoff</span><span>PACU</span><span>Emergency</span><span>Mental Health</span></div></section>
      <section className="settings-card"><h2>Backup & portability</h2><p>Your progress stays on this device. Export a backup before clearing browser data or moving to another device.</p><div className="backup-actions"><button className="secondary-button" onClick={onExport}><Download size={17} /> Export progress</button><button className="secondary-button" onClick={() => inputRef.current?.click()}><Upload size={17} /> Import backup</button><input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} /></div></section>
      <section className="settings-card"><h2>Local data</h2><p>Progress is stored in IndexedDB; preferences are stored in localStorage. No Supabase account is required.</p><button className="secondary-button danger-button" onClick={onReset}><RotateCcw size={17} /> Reset local data</button></section>
      <section className="settings-card legal"><ShieldCheck /><div><h3>Educational scope</h3><p>ClinSpeak teaches professional language and documentation. It does not provide diagnosis or replace local protocols, clinical judgment, supervision or scope-of-practice requirements.</p></div></section>
    </div>
  );
}

function TutorPanel({ onClose }) {
  const [messages, setMessages] = useState([{ role: 'tutor', text: 'Hi! Ask me about medical vocabulary, documentation, SBAR, handoff, wounds, patient education or interview phrasing.' }]);
  const [input, setInput] = useState('');
  const send = () => {
    const question = input.trim();
    if (!question) return;
    const lower = question.toLowerCase();
    const found = content.tutorReplies.find((item) => item.match.some((word) => lower.includes(word)));
    const answer = found?.answer || 'Try expressing it with professional clinical language: identify what the patient reports, what you observed or measured, the relevant context, and what the next clinician needs to know.';
    setMessages((items) => [...items, { role: 'user', text: question }, { role: 'tutor', text: answer }]);
    setInput('');
  };
  return (
    <div className="tutor-panel"><div className="tutor-header"><div><span><Sparkles size={18} /></span><div><strong>Clinical Tutor</strong><small>Offline learning assistant</small></div></div><button className="icon-button" onClick={onClose}><X /></button></div><div className="tutor-messages">{messages.map((message, index) => <div key={index} className={`message ${message.role}`}>{message.text}</div>)}</div><div className="quick-prompts"><button onClick={() => setInput('Explain SBAR')}>SBAR</button><button onClick={() => setInput('Help with handoff')}>Handoff</button><button onClick={() => setInput('Help with documentation')}>Documentation</button></div><div className="tutor-input"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Ask a clinical-English question…" /><button onClick={send}><ChevronRight /></button></div></div>
  );
}

export default AppV2;
