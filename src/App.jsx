import { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Brain,
  ChevronRight,
  CircleCheck,
  Download,
  Flame,
  HeartPulse,
  Home,
  Languages,
  LockKeyhole,
  Mic,
  PenLine,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Trophy,
  Upload,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';
import content from './data/content.json';
import {
  createBackup,
  defaultProgress,
  downloadBackup,
  importBackupFile,
  loadPreferences,
  loadProgress,
  resetLocalData,
  savePreferences,
  saveProgress,
  today,
} from './lib/localData.js';

const units = content.units;
const lessonBank = content.lessonBank;
const speakingPhrases = content.speakingPhrases;
const nursingCase = content.nursingCase;
const tutorReplies = content.tutorReplies;

const iconMap = {
  languages: Languages,
  stethoscope: Stethoscope,
  penline: PenLine,
  heartpulse: HeartPulse,
};

function normalize(text = '') {
  return text
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function evaluateNote(text) {
  const value = normalize(text);
  const checks = [
    { label: 'Patient status', ok: /alert|oriented/.test(value), points: 14 },
    { label: 'Oxygenation', ok: /spo2|94%|oxygen|nasal cannula|2 l/.test(value), points: 16 },
    { label: 'Respiratory symptom', ok: /dyspnea|shortness of breath|productive cough/.test(value), points: 16 },
    { label: 'Lung finding', ok: /crackle|right lung base|auscult/.test(value), points: 16 },
    { label: 'Chest pain status', ok: /denies chest pain|no chest pain/.test(value), points: 12 },
    { label: 'Objective language', ok: !/looks bad|very sick|not good|seems bad/.test(value), points: 14 },
    { label: 'Readable structure', ok: text.trim().length >= 100, points: 12 },
  ];
  const score = checks.reduce((sum, item) => sum + (item.ok ? item.points : 0), 0);
  return { score, checks, suggestions: checks.filter((item) => !item.ok).map((item) => item.label) };
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function App() {
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
    if (!hydrated || !progress) return;
    saveProgress(progress);
  }, [progress, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (preferences.contentVersion !== content.contentVersion) {
      const next = { ...preferences, contentVersion: content.contentVersion };
      setPreferences(next);
      savePreferences(next);
      if (preferences.contentVersion) {
        setToast(`New learning content installed · v${content.contentVersion}`);
        setTimeout(() => setToast(''), 3200);
      }
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
      const completed = old.completedLessons.includes(lesson.id)
        ? old.completedLessons
        : [...old.completedLessons, lesson.id];
      const currentDay = today();
      let streak = old.streak;
      if (old.lastStudyDate !== currentDay) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        streak = old.lastStudyDate === yesterday.toISOString().slice(0, 10) ? old.streak + 1 : 1;
      }
      return {
        ...old,
        xp: old.xp + earned,
        streak,
        lastStudyDate: currentDay,
        completedLessons: completed,
        wordsMastered: old.wordsMastered + Math.max(1, correct),
        skillScores: {
          ...old.skillScores,
          vocabulary: Math.min(100, old.skillScores.vocabulary + (lesson.type === 'vocabulary' ? 2 : 0)),
          reading: Math.min(100, old.skillScores.reading + (lesson.type === 'reading' ? 2 : 0)),
          speaking: Math.min(100, old.skillScores.speaking + (lesson.type === 'speaking' ? 2 : 0)),
          writing: Math.min(100, old.skillScores.writing + (lesson.type === 'writing' ? 2 : 0)),
          clinical: Math.min(100, old.skillScores.clinical + (['clinical', 'simulation', 'interview'].includes(lesson.type) ? 2 : 0)),
        },
      };
    });
    setToast(`+${earned} XP · Lesson completed`);
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
    const backup = await createBackup(content.contentVersion);
    downloadBackup(backup);
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
    return (
      <div className="app-shell">
        <div className="app-loading"><HeartPulse size={32} /><strong>ClinSpeak</strong><span>Loading your local learning data…</span></div>
      </div>
    );
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
          <div className="nav-disclaimer"><ShieldCheck size={16} /> Educational use only. Not a clinical decision-support tool.</div>
        </aside>

        <section className="content-area">
          {tab === 'learn' && <LearnView progress={progress} preferences={preferences} onLesson={setActiveLesson} onPractice={() => setTab('practice')} />}
          {tab === 'practice' && <PracticeView progress={progress} setProgress={setProgress} />}
          {tab === 'speaking' && <SpeakingView setProgress={setProgress} />}
          {tab === 'progress' && <ProgressView progress={progress} />}
          {tab === 'profile' && (
            <ProfileView
              progress={progress}
              preferences={preferences}
              onPreferences={updatePreferences}
              onReset={handleReset}
              onExport={handleExport}
              onImport={handleImport}
            />
          )}
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
  const completedCount = progress.completedLessons.length;
  const allLessons = units.flatMap((unit) => unit.lessons);
  const nextLesson = allLessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) || allLessons[0];
  return (
    <div className="page page-learn">
      <section className="hero-card">
        <div>
          <span className="eyebrow">TODAY'S CLINICAL ENGLISH</span>
          <h1>Learn the language.<br />Practice the clinical situation.</h1>
          <p>Vocabulary → patient interview → assessment → communication → documentation.</p>
          <button className="primary-button" onClick={() => onLesson(nextLesson)}><Play size={18} /> Continue learning</button>
        </div>
        <div className="daily-ring"><strong>{Math.min(preferences.dailyGoal, (progress.xp % preferences.dailyGoal) || Math.min(18, preferences.dailyGoal))}</strong><span>/ {preferences.dailyGoal} XP</span><small>Daily goal</small></div>
      </section>

      <div className="quick-grid">
        <button className="quick-card" onClick={onPractice}><Brain /><span><strong>Daily review</strong><small>Spaced repetition</small></span><ChevronRight /></button>
        <button className="quick-card" onClick={onPractice}><PenLine /><span><strong>Nursing note</strong><small>Clinical writing challenge</small></span><ChevronRight /></button>
      </div>

      <div className="section-heading"><div><span className="eyebrow">LEARNING PATH</span><h2>Your clinical journey</h2></div><span className="mini-pill">{completedCount}/{allLessons.length} lessons</span></div>
      <div className="learning-path">{units.map((unit, unitIndex) => <UnitCard key={unit.id} unit={unit} unitIndex={unitIndex} progress={progress} onLesson={onLesson} />)}</div>
    </div>
  );
}

function UnitCard({ unit, unitIndex, progress, onLesson }) {
  const Icon = iconMap[unit.icon] || BookOpen;
  const previousLessons = units.slice(0, unitIndex).flatMap((item) => item.lessons);
  const unlocked = unitIndex === 0 || previousLessons.every((lesson) => progress.completedLessons.includes(lesson.id));
  const complete = unit.lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
  return (
    <section className={`unit-card ${!unlocked ? 'locked' : ''}`}>
      <div className="unit-header">
        <div className="unit-icon">{unlocked ? <Icon size={25} /> : <LockKeyhole size={23} />}</div>
        <div><small>UNIT {unitIndex + 1}</small><h3>{unit.title}</h3><p>{unit.subtitle}</p></div>
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
              <strong>{lesson.title}</strong><small>+{lesson.xp} XP</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LessonModal({ lesson, onClose, onComplete }) {
  const questions = lessonBank[lesson.type] || lessonBank.vocabulary;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index % questions.length];

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
          <span className="heart-count">♥ 5</span>
        </div>
        {!finished ? (
          <div className="lesson-body">
            <span className="eyebrow">{lesson.title.toUpperCase()}</span><h2>{question.prompt}</h2>
            <div className="answer-list">{question.options.map((option, i) => {
              const state = checked && option === question.answer ? 'correct' : checked && option === selected ? 'wrong' : selected === option ? 'selected' : '';
              return <button key={option} className={`answer-option ${state}`} onClick={() => !checked && setSelected(option)}><span>{String.fromCharCode(65 + i)}</span>{option}</button>;
            })}</div>
            {checked && <div className={`feedback-box ${selected === question.answer ? 'good' : 'needs-work'}`}><strong>{selected === question.answer ? 'Excellent.' : 'Not quite.'}</strong><p>{question.tip}</p></div>}
            <button className="primary-button full" onClick={checked ? next : check} disabled={!selected}>{checked ? (index === questions.length - 1 ? 'Finish lesson' : 'Continue') : 'Check answer'}</button>
          </div>
        ) : (
          <div className="lesson-finish"><div className="success-orb"><Award size={48} /></div><span className="eyebrow">LESSON COMPLETE</span><h2>Nice clinical work!</h2><p>You got {correct} of {questions.length} correct.</p><div className="finish-stats"><span><Star /> +{lesson.xp} possible XP</span><span><CircleCheck /> {Math.round((correct / questions.length) * 100)}% accuracy</span></div><button className="primary-button full" onClick={onClose}>Back to learning path</button></div>
        )}
      </div>
    </div>
  );
}

function PracticeView({ progress, setProgress }) {
  const [mode, setMode] = useState('review');
  return (
    <div className="page">
      <span className="eyebrow">SMART PRACTICE</span><h1>Strengthen what matters</h1><p className="lead">Short adaptive activities built around medical communication, not isolated translation.</p>
      <div className="segmented"><button className={mode === 'review' ? 'active' : ''} onClick={() => setMode('review')}>Daily review</button><button className={mode === 'writing' ? 'active' : ''} onClick={() => setMode('writing')}>Nursing note</button><button className={mode === 'mistakes' ? 'active' : ''} onClick={() => setMode('mistakes')}>My mistakes</button></div>
      {mode === 'review' && <ReviewDeck progress={progress} setProgress={setProgress} />}
      {mode === 'writing' && <NursingNoteChallenge setProgress={setProgress} />}
      {mode === 'mistakes' && <MistakeNotebook mistakes={progress.mistakes} />}
    </div>
  );
}

function ReviewDeck({ progress, setProgress }) {
  const dueWords = content.reviewWords.filter((item) => {
    const schedule = progress.reviewState?.[item.term];
    return !schedule?.nextReview || schedule.nextReview <= today();
  });
  const deck = dueWords.length ? dueWords : content.reviewWords;
  const [card, setCard] = useState(0);
  const [show, setShow] = useState(false);
  const current = deck[card % deck.length];

  const rate = (easy) => {
    setProgress((old) => {
      const previous = old.reviewState?.[current.term] || { interval: 0, repetitions: 0 };
      const interval = easy ? Math.min(30, Math.max(3, previous.interval * 2 || 3)) : 1;
      return {
        ...old,
        xp: old.xp + (easy ? 3 : 2),
        wordsMastered: old.wordsMastered + (easy ? 1 : 0),
        reviewState: {
          ...(old.reviewState || {}),
          [current.term]: {
            interval,
            repetitions: previous.repetitions + 1,
            lastReviewed: today(),
            nextReview: addDays(today(), interval),
          },
        },
      };
    });
    setCard((value) => value + 1);
    setShow(false);
  };

  return (
    <section className="practice-panel">
      <div className="panel-header"><div><small>SPACED REVIEW</small><h2>{dueWords.length || deck.length} terms ready</h2></div><span className="mini-pill"><Brain size={15} /> local SRS</span></div>
      <button className={`flashcard ${show ? 'revealed' : ''}`} onClick={() => setShow(true)}><small>MEDICAL TERM</small><strong>{current.term}</strong>{show ? <p>{current.meaning}</p> : <span>Tap to reveal meaning</span>}</button>
      {show && <div className="rating-row"><button onClick={() => rate(false)}>Needs review</button><button onClick={() => rate(true)}>Got it</button></div>}
      <p className="muted">Your review schedule is stored only on this device in IndexedDB.</p>
    </section>
  );
}

function NursingNoteChallenge({ setProgress }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const submit = () => {
    const evaluated = evaluateNote(text);
    setResult(evaluated);
    setProgress((old) => ({
      ...old,
      xp: old.xp + Math.max(5, Math.round(evaluated.score / 10)),
      noteHistory: [...old.noteHistory, { date: today(), score: evaluated.score, excerpt: text.slice(0, 180) }].slice(-25),
      skillScores: { ...old.skillScores, writing: Math.min(100, Math.max(old.skillScores.writing, Math.round(evaluated.score * 0.8))) },
    }));
  };
  return (
    <section className="writing-grid">
      <div className="case-card"><span className="eyebrow">CASE</span><h2>{nursingCase.title}</h2><p>{nursingCase.patient}</p><div className="finding-list">{nursingCase.findings.map((finding) => <span key={finding}><CircleCheck size={16} /> {finding}</span>)}</div><div className="case-goal"><strong>Your task</strong><p>Write a concise nursing progress note in professional English using the relevant subjective and objective findings.</p></div></div>
      <div className="note-card"><div className="panel-header"><div><small>CLINICAL WRITING</small><h2>Progress note</h2></div><span className="mini-pill">{text.length} chars</span></div><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Patient alert and oriented..." /><button className="primary-button full" disabled={text.trim().length < 30} onClick={submit}><Sparkles size={18} /> Evaluate my note</button>{result && <div className="note-result"><div className="score-badge"><strong>{result.score}</strong><span>/100</span></div><div><h3>{result.score >= 80 ? 'Strong clinical documentation' : 'Keep refining it'}</h3><p>{result.suggestions.length ? `Consider adding or improving: ${result.suggestions.join(', ')}.` : 'You captured the key findings with objective language.'}</p></div><details><summary>Show model answer</summary><p>{nursingCase.model}</p></details></div>}</div>
    </section>
  );
}

function MistakeNotebook({ mistakes }) {
  return <section className="practice-panel"><div className="panel-header"><div><small>PERSONAL ERROR BANK</small><h2>My mistakes</h2></div><span className="mini-pill">{mistakes.length} saved</span></div><div className="mistake-list">{mistakes.map((item) => <div className="mistake-item" key={item.wrong}><span className="tag">{item.tag}</span><p className="wrong-text">✕ {item.wrong}</p><p className="right-text">✓ {item.right}</p></div>)}</div></section>;
}

function SpeakingView({ setProgress }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [heard, setHeard] = useState('');
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState(null);
  const recognitionRef = useRef(null);
  const phrase = speakingPhrases[phraseIndex % speakingPhrases.length];

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
    if (!Recognition) {
      setHeard('Speech recognition is not available in this browser.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setHeard(transcript);
      evaluateSpeech(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const next = () => { setPhraseIndex((value) => (value + 1) % speakingPhrases.length); setHeard(''); setScore(null); };
  return (
    <div className="page"><span className="eyebrow">SPEAKING LAB</span><h1>Sound clear in clinical situations</h1><p className="lead">Listen, repeat and compare your speech with professional clinical phrasing.</p><section className="speaking-card"><div className="speaker-visual"><div className={listening ? 'pulse-ring listening' : 'pulse-ring'}><Mic size={44} /></div></div><span className="eyebrow">SHADOW THIS PHRASE</span><h2>“{phrase}”</h2><div className="speak-actions"><button onClick={speak}><Volume2 /> Listen</button><button className="record-button" onClick={startRecognition}><Mic /> {listening ? 'Listening…' : 'Speak now'}</button></div>{heard && <div className="heard-box"><small>WE HEARD</small><p>{heard}</p></div>}{score !== null && <div className="speech-score"><div><strong>{score}%</strong><span>phrase match</span></div><p>{score >= 80 ? 'Strong match. Focus next on rhythm and natural pacing.' : 'Try again slowly and emphasize the key clinical words.'}</p></div>}<button className="text-button" onClick={next}>Next phrase <ChevronRight size={17} /></button></section><div className="info-strip"><ShieldCheck /><p><strong>Privacy note:</strong> ClinSpeak has no app backend for recordings. Browser speech recognition behavior may depend on the browser/device provider.</p></div></div>
  );
}

function ProgressView({ progress }) {
  const entries = Object.entries(progress.skillScores);
  const avg = Math.round(entries.reduce((sum, [, value]) => sum + value, 0) / entries.length);
  const strongest = [...entries].sort((a, b) => b[1] - a[1])[0][0];
  return (
    <div className="page"><span className="eyebrow">YOUR PERFORMANCE</span><h1>Clinical English Score</h1><div className="progress-hero"><div className="big-score"><strong>{avg}</strong><span>/100</span></div><div><h2>Developing communicator</h2><p>Your strongest area is {strongest}. Keep balancing language accuracy with clinical clarity.</p></div></div><div className="stats-grid"><StatCard icon={Flame} label="Streak" value={`${progress.streak} days`} /><StatCard icon={Star} label="Total XP" value={progress.xp} /><StatCard icon={BookOpen} label="Words mastered" value={progress.wordsMastered} /><StatCard icon={PenLine} label="Notes written" value={progress.noteHistory.length} /></div><section className="skill-panel"><div className="panel-header"><div><small>SKILL MAP</small><h2>Competency breakdown</h2></div><span className="mini-pill">CEFR-inspired</span></div><div className="skill-bars">{entries.map(([label, value]) => <div className="skill-row" key={label}><div><strong>{label}</strong><span>{value}%</span></div><div className="bar"><span style={{ width: `${value}%` }} /></div></div>)}</div></section></div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return <div className="stat-card"><Icon /><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function ProfileView({ progress, preferences, onPreferences, onReset, onExport, onImport }) {
  const inputRef = useRef(null);
  return (
    <div className="page">
      <span className="eyebrow">LOCAL PROFILE</span><h1>Your learning setup</h1>
      <section className="profile-card"><div className="avatar"><UserRound size={38} /></div><div><h2>{preferences.name || 'Healthcare Professional'}</h2><p>{preferences.profession} · Nursing track enabled</p></div><span className="mini-pill">{preferences.englishLevel} pathway</span></section>

      <section className="settings-card">
        <h2>Profile saved on this device</h2>
        <div className="local-settings-grid">
          <label><span>Name</span><input value={preferences.name} onChange={(event) => onPreferences({ ...preferences, name: event.target.value })} /></label>
          <label><span>Profession</span><select value={preferences.profession} onChange={(event) => onPreferences({ ...preferences, profession: event.target.value })}><option>Nurse</option><option>Physician</option><option>Physical Therapist</option><option>Pharmacist</option><option>Healthcare Student</option><option>Other</option></select></label>
          <label><span>English level</span><select value={preferences.englishLevel} onChange={(event) => onPreferences({ ...preferences, englishLevel: event.target.value })}><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option></select></label>
          <label><span>Daily XP goal</span><select value={preferences.dailyGoal} onChange={(event) => onPreferences({ ...preferences, dailyGoal: Number(event.target.value) })}><option value="10">10 XP</option><option value="20">20 XP</option><option value="30">30 XP</option><option value="50">50 XP</option></select></label>
        </div>
      </section>

      <section className="settings-card"><h2>Current learning goals</h2><div className="goal-chips"><span>Medical vocabulary</span><span>Speaking</span><span>Reading</span><span>Clinical writing</span><span>Patient assessment</span><span>Nursing documentation</span></div></section>

      <section className="settings-card">
        <div className="panel-header"><div><small>DEVICE STORAGE</small><h2>Backup & restore</h2></div><span className="mini-pill">Content v{content.contentVersion}</span></div>
        <p>Your lessons are shipped with the app. Progress, review scheduling, nursing-note history and performance are stored locally. No account or Supabase database is required.</p>
        <div className="backup-actions">
          <button className="secondary-button" onClick={onExport}><Download size={17} /> Export progress</button>
          <button className="secondary-button" onClick={() => inputRef.current?.click()}><Upload size={17} /> Import backup</button>
          <input ref={inputRef} className="hidden-file-input" type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) onImport(file); event.target.value = ''; }} />
        </div>
        <p className="muted">Backup includes your {progress.xp} XP, completed lessons, spaced-repetition schedule, scores, mistakes and local profile settings.</p>
      </section>

      <section className="settings-card"><h2>Reset this device</h2><p>This removes ClinSpeak learning progress stored on this browser and restores the local demo profile.</p><button className="secondary-button" onClick={onReset}><RotateCcw size={17} /> Reset local data</button></section>
      <section className="settings-card legal"><ShieldCheck /><div><h3>Educational scope</h3><p>ClinSpeak teaches professional language and documentation skills. It does not replace institutional protocols, clinical judgment, supervision, diagnosis, or treatment guidance.</p></div></section>
    </div>
  );
}

function TutorPanel({ onClose }) {
  const [messages, setMessages] = useState([{ role: 'tutor', text: 'Hi! I’m your offline Clinical English Tutor. Ask me about medical vocabulary, documentation, SBAR or patient-interview phrasing.' }]);
  const [input, setInput] = useState('');
  const send = () => {
    const question = input.trim();
    if (!question) return;
    const lower = question.toLowerCase();
    const found = tutorReplies.find((item) => item.match.some((word) => lower.includes(word)));
    const answer = found?.answer || 'Try converting that into objective clinical language: identify what the patient reports, what you observed or measured, and what information another clinician would need to understand the situation clearly.';
    setMessages((items) => [...items, { role: 'user', text: question }, { role: 'tutor', text: answer }]);
    setInput('');
  };
  return (
    <div className="tutor-panel"><div className="tutor-header"><div><span><Sparkles size={18} /></span><div><strong>Clinical Tutor</strong><small>Offline learning assistant</small></div></div><button className="icon-button" onClick={onClose}><X /></button></div><div className="tutor-messages">{messages.map((message, index) => <div key={index} className={`message ${message.role}`}>{message.text}</div>)}</div><div className="quick-prompts"><button onClick={() => setInput('Explain SBAR')}>Explain SBAR</button><button onClick={() => setInput('Help with documentation')}>Documentation</button></div><div className="tutor-input"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Ask a clinical-English question…" /><button onClick={send}><ChevronRight /></button></div></div>
  );
}

export default App;
