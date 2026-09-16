import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Flame,
  HeartPulse,
  Home,
  Languages,
  LockKeyhole,
  MessageCircle,
  Mic,
  PenLine,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Trophy,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'clinspeak-progress-v1';
const TODAY = () => new Date().toISOString().slice(0, 10);

const initialProgress = {
  xp: 120,
  streak: 1,
  hearts: 5,
  lastStudyDate: TODAY(),
  completedLessons: ['basics-1'],
  wordsMastered: 18,
  skillScores: {
    vocabulary: 58,
    reading: 51,
    listening: 44,
    speaking: 38,
    writing: 42,
    clinical: 46,
  },
  mistakes: [
    { wrong: 'difficulty to breathe', right: 'difficulty breathing', tag: 'Grammar' },
    { wrong: 'patient refers pain', right: 'patient reports pain', tag: 'Documentation' },
    { wrong: 'make an examination', right: 'perform an examination', tag: 'Vocabulary' },
  ],
  noteHistory: [],
};

const units = [
  {
    id: 'basics',
    title: 'Medical English Foundations',
    subtitle: 'Build your clinical vocabulary',
    icon: Languages,
    lessons: [
      { id: 'basics-1', title: 'Body & symptoms', xp: 10, type: 'vocabulary' },
      { id: 'basics-2', title: 'Pain vocabulary', xp: 12, type: 'vocabulary' },
      { id: 'basics-3', title: 'Vital signs', xp: 12, type: 'reading' },
    ],
  },
  {
    id: 'assessment',
    title: 'Patient Assessment',
    subtitle: 'History + physical examination',
    icon: Stethoscope,
    lessons: [
      { id: 'assessment-1', title: 'Chief complaint', xp: 15, type: 'interview' },
      { id: 'assessment-2', title: 'OPQRST interview', xp: 15, type: 'interview' },
      { id: 'assessment-3', title: 'Respiratory exam', xp: 18, type: 'clinical' },
      { id: 'assessment-4', title: 'Cardiovascular exam', xp: 18, type: 'clinical' },
    ],
  },
  {
    id: 'documentation',
    title: 'Clinical Documentation',
    subtitle: 'Turn findings into professional notes',
    icon: PenLine,
    lessons: [
      { id: 'documentation-1', title: 'Objective charting', xp: 20, type: 'writing' },
      { id: 'documentation-2', title: 'Nursing progress note', xp: 25, type: 'writing' },
      { id: 'documentation-3', title: 'SBAR essentials', xp: 20, type: 'speaking' },
    ],
  },
  {
    id: 'simulation',
    title: 'Clinical Simulation',
    subtitle: 'Integrate communication and documentation',
    icon: HeartPulse,
    lessons: [
      { id: 'simulation-1', title: 'Post-op patient', xp: 30, type: 'simulation' },
      { id: 'simulation-2', title: 'Respiratory deterioration', xp: 35, type: 'simulation' },
    ],
  },
];

const lessonBank = {
  vocabulary: [
    {
      prompt: 'The patient has visible enlargement of the left ankle. Which term is most appropriate?',
      options: ['Swelling', 'Wheezing', 'Dizziness', 'Bleeding'],
      answer: 'Swelling',
      tip: 'Swelling describes enlargement caused by fluid accumulation, inflammation, or injury.',
    },
    {
      prompt: 'Choose the most professional sentence.',
      options: [
        'The patient says he is bad.',
        'The patient reports severe abdominal pain.',
        'The patient has a bad belly.',
        'The patient is very not good.',
      ],
      answer: 'The patient reports severe abdominal pain.',
      tip: 'Clinical English favors specific, objective and measurable descriptions.',
    },
    {
      prompt: '“Lightheadedness” most closely means:',
      options: ['Feeling faint', 'Chest tightness', 'Joint swelling', 'Productive cough'],
      answer: 'Feeling faint',
      tip: 'Lightheadedness is a feeling of faintness; vertigo usually implies a spinning sensation.',
    },
  ],
  reading: [
    {
      prompt: 'Read: “Surgical dressing clean, dry and intact. Patient ambulating with assistance.” What is being described?',
      options: ['The incision dressing and mobility', 'The patient’s diet', 'The medication list', 'The laboratory values'],
      answer: 'The incision dressing and mobility',
      tip: '“Clean, dry and intact” is commonly used to describe a dressing or incision status.',
    },
    {
      prompt: 'Read: “Patient denies chest pain but reports dyspnea on exertion.” Which statement is correct?',
      options: ['Chest pain is present', 'Dyspnea occurs with activity', 'The patient is unconscious', 'The patient has no symptoms'],
      answer: 'Dyspnea occurs with activity',
      tip: '“Denies” means the symptom is not reported; “on exertion” means during activity.',
    },
  ],
  interview: [
    {
      prompt: 'A patient says, “My chest started hurting this morning.” What is the best next OPQRST question?',
      options: ['What were you doing when it started?', 'What is your favorite food?', 'Are you married?', 'Can you walk home?'],
      answer: 'What were you doing when it started?',
      tip: 'This explores onset and context while staying focused on the chief complaint.',
    },
    {
      prompt: 'Which question best explores pain quality?',
      options: ['How would you describe the pain?', 'Where do you live?', 'When did you last eat?', 'Do you need a blanket?'],
      answer: 'How would you describe the pain?',
      tip: 'Quality describes the character of pain: sharp, dull, burning, pressure-like, etc.',
    },
  ],
  clinical: [
    {
      prompt: 'Which sentence is the clearest respiratory assessment documentation?',
      options: [
        'Breathing is bad.',
        'Bilateral expiratory wheezing noted on auscultation.',
        'Lungs not normal.',
        'Patient breathing weird.',
      ],
      answer: 'Bilateral expiratory wheezing noted on auscultation.',
      tip: 'Document what you observed or measured, not vague impressions.',
    },
    {
      prompt: 'A patient is using accessory muscles and speaking in short sentences. Which phrase best communicates the finding?',
      options: ['Increased work of breathing', 'Normal appetite', 'Stable gait', 'Intact skin'],
      answer: 'Increased work of breathing',
      tip: 'Use concrete findings alongside this phrase whenever possible.',
    },
  ],
  writing: [
    {
      prompt: 'Which rewrite is most objective? “The wound looks infected.”',
      options: [
        'The wound is horrible.',
        'Incision with surrounding erythema, warmth and purulent drainage.',
        'The wound seems bad.',
        'The wound probably has bacteria.',
      ],
      answer: 'Incision with surrounding erythema, warmth and purulent drainage.',
      tip: 'Objective documentation records observable findings and avoids unsupported conclusions.',
    },
    {
      prompt: 'Choose the preferred charting verb: “The patient ___ nausea.”',
      options: ['reports', 'does', 'makes', 'tells'],
      answer: 'reports',
      tip: '“Reports” is concise and commonly used for subjective symptoms.',
    },
  ],
  speaking: [
    {
      prompt: 'Which opening is most appropriate for SBAR?',
      options: [
        'I am calling about Mr. Lee because his blood pressure has dropped to 86/54 mmHg.',
        'Hey, something is wrong.',
        'This patient is bad.',
        'I do not know what to do with him.',
      ],
      answer: 'I am calling about Mr. Lee because his blood pressure has dropped to 86/54 mmHg.',
      tip: 'SBAR begins with a concise statement of the current situation and why you are communicating.',
    },
  ],
  simulation: [
    {
      prompt: 'Post-op day 1: patient reports increasing shortness of breath. Which documentation is most useful?',
      options: [
        'Patient looks bad.',
        'Patient reports new shortness of breath; RR 28/min and SpO₂ 90% on room air.',
        'Maybe pulmonary problem.',
        'Patient does not feel good.',
      ],
      answer: 'Patient reports new shortness of breath; RR 28/min and SpO₂ 90% on room air.',
      tip: 'Use the patient’s report plus objective measurements. Clinical management should follow local policy and qualified assessment.',
    },
  ],
};

const speakingPhrases = [
  'Can you describe the pain for me?',
  'When did the shortness of breath start?',
  'The patient is alert and oriented and reports mild incisional pain.',
  'Bilateral breath sounds are diminished at the bases.',
  'I am calling because the patient has developed new hypotension.',
];

const nursingCase = {
  title: 'Respiratory Assessment',
  patient: '67-year-old male admitted with community-acquired pneumonia',
  findings: [
    'Alert and oriented ×4',
    'BP 128/76 mmHg · HR 88 bpm · RR 20/min',
    'SpO₂ 94% on 2 L/min via nasal cannula',
    'Reports dyspnea on exertion and productive cough',
    'Crackles at the right lung base',
    'Denies chest pain',
  ],
  model:
    'Patient alert and oriented ×4. Vital signs stable. SpO₂ 94% on 2 L/min via nasal cannula. Patient reports dyspnea on exertion and productive cough. Crackles noted at the right lung base. Denies chest pain. Patient resting in bed with no signs of acute distress.',
};

const tutorReplies = [
  {
    match: ['dizziness', 'lightheaded'],
    answer:
      'Dizziness is a broad term. Lightheadedness usually means feeling faint or as if you might pass out, while vertigo usually describes a spinning sensation. In clinical communication, ask the patient to describe exactly what they feel.',
  },
  {
    match: ['note', 'documentation', 'chart'],
    answer:
      'For stronger clinical documentation, prioritize objective findings, measurements, patient-reported symptoms, interventions performed, and the patient response. Avoid vague phrases such as “looks bad” when you can describe the actual finding.',
  },
  {
    match: ['sbar'],
    answer:
      'SBAR = Situation, Background, Assessment, Recommendation. Keep the Situation very concise, give only relevant background, report current findings in Assessment, and state what you need or recommend according to your role and local policy.',
  },
  {
    match: ['opqrst', 'pain'],
    answer:
      'OPQRST helps structure symptom assessment: Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, and Time. The goal is a focused history, not a scripted interrogation.',
  },
];

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialProgress, ...JSON.parse(saved) } : initialProgress;
  } catch {
    return initialProgress;
  }
}

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
  const suggestions = checks.filter((item) => !item.ok).map((item) => item.label);
  return { score, checks, suggestions };
}

function App() {
  const [tab, setTab] = useState('learn');
  const [progress, setProgress] = useState(loadProgress);
  const [activeLesson, setActiveLesson] = useState(null);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeLesson = (lesson, correct, total) => {
    const ratio = total ? correct / total : 1;
    const earned = Math.max(5, Math.round(lesson.xp * ratio));
    setProgress((old) => {
      const completed = old.completedLessons.includes(lesson.id)
        ? old.completedLessons
        : [...old.completedLessons, lesson.id];
      const today = TODAY();
      let streak = old.streak;
      if (old.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        streak = old.lastStudyDate === yesterday.toISOString().slice(0, 10) ? old.streak + 1 : 1;
      }
      return {
        ...old,
        xp: old.xp + earned,
        streak,
        lastStudyDate: today,
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
          <span><Trophy size={18} /> B1</span>
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
          {tab === 'learn' && <LearnView progress={progress} onLesson={setActiveLesson} onPractice={() => setTab('practice')} />}
          {tab === 'practice' && <PracticeView progress={progress} setProgress={setProgress} />}
          {tab === 'speaking' && <SpeakingView progress={progress} setProgress={setProgress} />}
          {tab === 'progress' && <ProgressView progress={progress} />}
          {tab === 'profile' && <ProfileView progress={progress} onReset={() => setProgress(initialProgress)} />}
        </section>
      </main>

      <nav className="mobile-nav">
        <NavButton icon={Home} label="Learn" active={tab === 'learn'} onClick={() => setTab('learn')} />
        <NavButton icon={Brain} label="Practice" active={tab === 'practice'} onClick={() => setTab('practice')} />
        <NavButton icon={Mic} label="Speaking" active={tab === 'speaking'} onClick={() => setTab('speaking')} />
        <NavButton icon={Trophy} label="Progress" active={tab === 'progress'} onClick={() => setTab('progress')} />
        <NavButton icon={UserRound} label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </nav>

      <button className="tutor-fab" onClick={() => setTutorOpen(true)}>
        <Sparkles size={20} /> <span>Clinical Tutor</span>
      </button>

      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onComplete={completeLesson}
        />
      )}
      {tutorOpen && <TutorPanel onClose={() => setTutorOpen(false)} />}
      {toast && <div className="toast"><CircleCheck size={18} /> {toast}</div>}
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon size={21} /> <span>{label}</span>
    </button>
  );
}

function LearnView({ progress, onLesson, onPractice }) {
  const completedCount = progress.completedLessons.length;
  const allLessons = units.flatMap((u) => u.lessons);
  const nextLesson = allLessons.find((l) => !progress.completedLessons.includes(l.id)) || allLessons[0];

  return (
    <div className="page page-learn">
      <section className="hero-card">
        <div>
          <span className="eyebrow">TODAY'S CLINICAL ENGLISH</span>
          <h1>Learn the language.<br />Practice the clinical situation.</h1>
          <p>Vocabulary → patient interview → assessment → communication → documentation.</p>
          <button className="primary-button" onClick={() => onLesson(nextLesson)}><Play size={18} /> Continue learning</button>
        </div>
        <div className="daily-ring">
          <strong>{Math.min(30, (progress.xp % 30) || 18)}</strong><span>/ 30 XP</span><small>Daily goal</small>
        </div>
      </section>

      <div className="quick-grid">
        <button className="quick-card" onClick={onPractice}><Brain /><span><strong>Daily review</strong><small>12 terms ready</small></span><ChevronRight /></button>
        <button className="quick-card" onClick={onPractice}><PenLine /><span><strong>Nursing note</strong><small>Clinical writing challenge</small></span><ChevronRight /></button>
      </div>

      <div className="section-heading">
        <div><span className="eyebrow">LEARNING PATH</span><h2>Your clinical journey</h2></div>
        <span className="mini-pill">{completedCount}/{allLessons.length} lessons</span>
      </div>

      <div className="learning-path">
        {units.map((unit, unitIndex) => (
          <UnitCard key={unit.id} unit={unit} unitIndex={unitIndex} progress={progress} onLesson={onLesson} />
        ))}
      </div>
    </div>
  );
}

function UnitCard({ unit, unitIndex, progress, onLesson }) {
  const Icon = unit.icon;
  const previousLessons = units.slice(0, unitIndex).flatMap((u) => u.lessons);
  const unlocked = unitIndex === 0 || previousLessons.every((l) => progress.completedLessons.includes(l.id));
  const complete = unit.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;

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
            <button
              key={lesson.id}
              className={`lesson-node ${done ? 'done' : ''} ${!canOpen ? 'disabled' : ''}`}
              onClick={() => canOpen && onLesson(lesson)}
              disabled={!canOpen}
            >
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
    const isCorrect = selected === question.answer;
    if (isCorrect) setCorrect((x) => x + 1);
    setChecked(true);
  };

  const next = () => {
    if (index >= questions.length - 1) {
      const finalCorrect = correct + (selected === question.answer && !checked ? 1 : 0);
      setCorrect(finalCorrect);
      setFinished(true);
      onComplete(lesson, finalCorrect, questions.length);
      return;
    }
    setIndex((x) => x + 1);
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
            <span className="eyebrow">{lesson.title.toUpperCase()}</span>
            <h2>{question.prompt}</h2>
            <div className="answer-list">
              {question.options.map((option, i) => {
                const state = checked && option === question.answer ? 'correct' : checked && option === selected ? 'wrong' : selected === option ? 'selected' : '';
                return <button key={option} className={`answer-option ${state}`} onClick={() => !checked && setSelected(option)}><span>{String.fromCharCode(65 + i)}</span>{option}</button>;
              })}
            </div>
            {checked && (
              <div className={`feedback-box ${selected === question.answer ? 'good' : 'needs-work'}`}>
                <strong>{selected === question.answer ? 'Excellent.' : 'Not quite.'}</strong>
                <p>{question.tip}</p>
              </div>
            )}
            <button className="primary-button full" onClick={checked ? next : check} disabled={!selected}>
              {checked ? (index === questions.length - 1 ? 'Finish lesson' : 'Continue') : 'Check answer'}
            </button>
          </div>
        ) : (
          <div className="lesson-finish">
            <div className="success-orb"><Award size={48} /></div>
            <span className="eyebrow">LESSON COMPLETE</span>
            <h2>Nice clinical work!</h2>
            <p>You got {correct} of {questions.length} correct and earned XP.</p>
            <div className="finish-stats"><span><Star /> +{lesson.xp} possible XP</span><span><CircleCheck /> {Math.round((correct / questions.length) * 100)}% accuracy</span></div>
            <button className="primary-button full" onClick={onClose}>Back to learning path</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeView({ progress, setProgress }) {
  const [mode, setMode] = useState('review');
  return (
    <div className="page">
      <span className="eyebrow">SMART PRACTICE</span>
      <h1>Strengthen what matters</h1>
      <p className="lead">Short adaptive activities built around medical communication, not isolated translation.</p>
      <div className="segmented">
        <button className={mode === 'review' ? 'active' : ''} onClick={() => setMode('review')}>Daily review</button>
        <button className={mode === 'writing' ? 'active' : ''} onClick={() => setMode('writing')}>Nursing note</button>
        <button className={mode === 'mistakes' ? 'active' : ''} onClick={() => setMode('mistakes')}>My mistakes</button>
      </div>
      {mode === 'review' && <ReviewDeck progress={progress} setProgress={setProgress} />}
      {mode === 'writing' && <NursingNoteChallenge setProgress={setProgress} />}
      {mode === 'mistakes' && <MistakeNotebook mistakes={progress.mistakes} />}
    </div>
  );
}

function ReviewDeck({ progress, setProgress }) {
  const words = [
    ['dyspnea', 'difficulty breathing'], ['wheezing', 'high-pitched musical breath sound'], ['drowsiness', 'abnormal sleepiness'],
    ['tenderness', 'pain on palpation'], ['drainage', 'fluid leaving a wound or tube'], ['swelling', 'enlargement of a body part'],
  ];
  const [card, setCard] = useState(0);
  const [show, setShow] = useState(false);
  const current = words[card % words.length];
  const rate = (easy) => {
    setProgress((old) => ({
      ...old,
      xp: old.xp + (easy ? 3 : 2),
      wordsMastered: old.wordsMastered + (easy ? 1 : 0),
    }));
    setCard((x) => x + 1);
    setShow(false);
  };
  return (
    <section className="practice-panel">
      <div className="panel-header"><div><small>SPACED REVIEW</small><h2>{card + 1} of {words.length} today</h2></div><span className="mini-pill"><Brain size={15} /> adaptive</span></div>
      <button className={`flashcard ${show ? 'revealed' : ''}`} onClick={() => setShow(true)}>
        <small>MEDICAL TERM</small><strong>{current[0]}</strong>{show ? <p>{current[1]}</p> : <span>Tap to reveal meaning</span>}
      </button>
      {show && <div className="rating-row"><button onClick={() => rate(false)}>Needs review</button><button onClick={() => rate(true)}>Got it</button></div>}
      <p className="muted">Words you struggle with can be surfaced more often in future reviews.</p>
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
      noteHistory: [...old.noteHistory, { date: TODAY(), score: evaluated.score }].slice(-10),
      skillScores: { ...old.skillScores, writing: Math.min(100, Math.max(old.skillScores.writing, Math.round(evaluated.score * 0.8))) },
    }));
  };
  return (
    <section className="writing-grid">
      <div className="case-card">
        <span className="eyebrow">CASE</span><h2>{nursingCase.title}</h2><p>{nursingCase.patient}</p>
        <div className="finding-list">{nursingCase.findings.map((f) => <span key={f}><CircleCheck size={16} /> {f}</span>)}</div>
        <div className="case-goal"><strong>Your task</strong><p>Write a concise nursing progress note in professional English using the relevant subjective and objective findings.</p></div>
      </div>
      <div className="note-card">
        <div className="panel-header"><div><small>CLINICAL WRITING</small><h2>Progress note</h2></div><span className="mini-pill">{text.length} chars</span></div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Patient alert and oriented..." />
        <button className="primary-button full" disabled={text.trim().length < 30} onClick={submit}><Sparkles size={18} /> Evaluate my note</button>
        {result && (
          <div className="note-result">
            <div className="score-badge"><strong>{result.score}</strong><span>/100</span></div>
            <div><h3>{result.score >= 80 ? 'Strong clinical documentation' : 'Keep refining it'}</h3><p>{result.suggestions.length ? `Consider adding or improving: ${result.suggestions.join(', ')}.` : 'You captured the key findings with objective language.'}</p></div>
            <details><summary>Show model answer</summary><p>{nursingCase.model}</p></details>
          </div>
        )}
      </div>
    </section>
  );
}

function MistakeNotebook({ mistakes }) {
  return (
    <section className="practice-panel">
      <div className="panel-header"><div><small>PERSONAL ERROR BANK</small><h2>My mistakes</h2></div><span className="mini-pill">{mistakes.length} saved</span></div>
      <div className="mistake-list">{mistakes.map((item) => <div className="mistake-item" key={item.wrong}><span className="tag">{item.tag}</span><p className="wrong-text">✕ {item.wrong}</p><p className="right-text">✓ {item.right}</p></div>)}</div>
    </section>
  );
}

function SpeakingView({ progress, setProgress }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [heard, setHeard] = useState('');
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState(null);
  const recognitionRef = useRef(null);
  const phrase = speakingPhrases[phraseIndex % speakingPhrases.length];

  const speak = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.lang = 'en-US';
      u.rate = 0.88;
      speechSynthesis.speak(u);
    }
  };

  const evaluateSpeech = (transcript) => {
    const targetWords = new Set(normalize(phrase).split(' '));
    const saidWords = new Set(normalize(transcript).split(' '));
    const matches = [...targetWords].filter((w) => saidWords.has(w)).length;
    const value = Math.max(0, Math.min(100, Math.round((matches / targetWords.size) * 100)));
    setScore(value);
    setProgress((old) => ({ ...old, xp: old.xp + Math.max(2, Math.round(value / 20)), skillScores: { ...old.skillScores, speaking: Math.min(100, Math.max(old.skillScores.speaking, Math.round(value * 0.8))) } }));
  };

  const startRecognition = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setHeard('Speech recognition is not available in this browser. Type what you said below to self-check.');
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

  const next = () => { setPhraseIndex((x) => (x + 1) % speakingPhrases.length); setHeard(''); setScore(null); };

  return (
    <div className="page">
      <span className="eyebrow">SPEAKING LAB</span><h1>Sound clear in clinical situations</h1>
      <p className="lead">Listen, repeat and compare your speech with professional clinical phrasing.</p>
      <section className="speaking-card">
        <div className="speaker-visual"><div className={listening ? 'pulse-ring listening' : 'pulse-ring'}><Mic size={44} /></div></div>
        <span className="eyebrow">SHADOW THIS PHRASE</span><h2>“{phrase}”</h2>
        <div className="speak-actions"><button onClick={speak}><Volume2 /> Listen</button><button className="record-button" onClick={startRecognition}><Mic /> {listening ? 'Listening…' : 'Speak now'}</button></div>
        {heard && <div className="heard-box"><small>WE HEARD</small><p>{heard}</p></div>}
        {score !== null && <div className="speech-score"><div><strong>{score}%</strong><span>phrase match</span></div><p>{score >= 80 ? 'Strong match. Focus next on rhythm and natural pacing.' : 'Try again slowly and emphasize the key clinical words.'}</p></div>}
        <button className="text-button" onClick={next}>Next phrase <ChevronRight size={17} /></button>
      </section>
      <div className="info-strip"><ShieldCheck /><p><strong>Privacy note:</strong> browser speech recognition availability depends on the device/browser. This prototype does not upload recordings to an app backend.</p></div>
    </div>
  );
}

function ProgressView({ progress }) {
  const entries = Object.entries(progress.skillScores);
  const avg = Math.round(entries.reduce((s, [, v]) => s + v, 0) / entries.length);
  return (
    <div className="page">
      <span className="eyebrow">YOUR PERFORMANCE</span><h1>Clinical English Score</h1>
      <div className="progress-hero"><div className="big-score"><strong>{avg}</strong><span>/100</span></div><div><h2>Developing communicator</h2><p>Your strongest area is {entries.sort((a,b)=>b[1]-a[1])[0][0]}. Keep balancing language accuracy with clinical clarity.</p></div></div>
      <div className="stats-grid">
        <StatCard icon={Flame} label="Streak" value={`${progress.streak} days`} />
        <StatCard icon={Star} label="Total XP" value={progress.xp} />
        <StatCard icon={BookOpen} label="Words mastered" value={progress.wordsMastered} />
        <StatCard icon={PenLine} label="Notes written" value={progress.noteHistory.length} />
      </div>
      <section className="skill-panel"><div className="panel-header"><div><small>SKILL MAP</small><h2>Competency breakdown</h2></div><span className="mini-pill">CEFR-inspired</span></div>
        <div className="skill-bars">{entries.map(([label, value]) => <div className="skill-row" key={label}><div><strong>{label}</strong><span>{value}%</span></div><div className="bar"><span style={{ width: `${value}%` }} /></div></div>)}</div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return <div className="stat-card"><Icon /><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function ProfileView({ progress, onReset }) {
  return (
    <div className="page">
      <span className="eyebrow">PROFILE</span><h1>Your learning setup</h1>
      <section className="profile-card"><div className="avatar"><UserRound size={38} /></div><div><h2>Healthcare Professional</h2><p>General Medical English · Nursing track enabled</p></div><span className="mini-pill">B1 pathway</span></section>
      <section className="settings-card"><h2>Current learning goals</h2><div className="goal-chips"><span>Medical vocabulary</span><span>Speaking</span><span>Reading</span><span>Clinical writing</span><span>Patient assessment</span><span>Nursing documentation</span></div></section>
      <section className="settings-card"><h2>Prototype data</h2><p>Your progress is currently saved locally in this browser. Account sync and cloud profiles can be connected to Supabase later without changing the learning design.</p><button className="secondary-button" onClick={onReset}><RotateCcw size={17} /> Reset local demo progress</button></section>
      <section className="settings-card legal"><ShieldCheck /><div><h3>Educational scope</h3><p>ClinSpeak teaches professional language and documentation skills. It does not replace institutional protocols, clinical judgment, supervision, diagnosis, or treatment guidance.</p></div></section>
    </div>
  );
}

function TutorPanel({ onClose }) {
  const [messages, setMessages] = useState([{ role: 'tutor', text: 'Hi! I’m your Clinical English Tutor. Ask me about medical vocabulary, documentation, SBAR or patient-interview phrasing.' }]);
  const [input, setInput] = useState('');
  const send = () => {
    const question = input.trim();
    if (!question) return;
    const lower = question.toLowerCase();
    const found = tutorReplies.find((item) => item.match.some((word) => lower.includes(word)));
    const answer = found?.answer || 'Try converting that into objective clinical language: identify what the patient reports, what you observed or measured, and what information another clinician would need to understand the situation clearly.';
    setMessages((m) => [...m, { role: 'user', text: question }, { role: 'tutor', text: answer }]);
    setInput('');
  };
  return (
    <div className="tutor-panel">
      <div className="tutor-header"><div><span><Sparkles size={18} /></span><div><strong>Clinical Tutor</strong><small>Offline learning assistant</small></div></div><button className="icon-button" onClick={onClose}><X /></button></div>
      <div className="tutor-messages">{messages.map((m, i) => <div key={i} className={`message ${m.role}`}>{m.text}</div>)}</div>
      <div className="quick-prompts"><button onClick={() => setInput('Explain SBAR')}>Explain SBAR</button><button onClick={() => setInput('Help with documentation')}>Documentation</button></div>
      <div className="tutor-input"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask a clinical-English question…" /><button onClick={send}><ChevronRight /></button></div>
    </div>
  );
}

export default App;
