const DB_NAME = 'clinspeak-local';
const DB_VERSION = 1;
const STATE_STORE = 'state';
const LEGACY_PROGRESS_KEY = 'clinspeak-progress-v1';
const PREFERENCES_KEY = 'clinspeak-preferences-v1';

export const today = () => new Date().toISOString().slice(0, 10);

const LEGACY_LESSON_MAP = {
  'basics-1': 'a1-foundations-1',
  'basics-2': 'a2-pain-1',
  'basics-3': 'a1-vitals-2',
  'assessment-1': 'a1-patient-2',
  'assessment-2': 'a2-pain-4',
  'assessment-3': 'b1-respiratory-3',
  'assessment-4': 'b1-cardio-3',
  'documentation-1': 'a2-documentation-1',
  'documentation-2': 'a2-documentation-4',
  'documentation-3': 'b1-communication-1',
  'simulation-1': 'b2-periop-4',
  'simulation-2': 'b2-acute-1',
};

export const defaultProgress = {
  xp: 0,
  streak: 1,
  hearts: 5,
  lastStudyDate: today(),
  completedLessons: [],
  wordsMastered: 0,
  skillScores: {
    vocabulary: 0,
    reading: 0,
    listening: 0,
    speaking: 0,
    writing: 0,
    clinical: 0,
  },
  mistakes: [
    { wrong: 'difficulty to breathe', right: 'difficulty breathing', tag: 'Grammar' },
    { wrong: 'patient refers pain', right: 'patient reports pain', tag: 'Documentation' },
    { wrong: 'make an examination', right: 'perform an examination', tag: 'Vocabulary' },
  ],
  noteHistory: [],
  reviewState: {},
};

export const defaultPreferences = {
  name: 'Healthcare Professional',
  profession: 'Nurse',
  englishLevel: 'B1',
  dailyGoal: 30,
  contentVersion: null,
};

function migrateLessonIds(items = []) {
  return [...new Set(items.map((id) => LEGACY_LESSON_MAP[id] || id))];
}

function mergeProgress(value = {}) {
  return {
    ...defaultProgress,
    ...value,
    completedLessons: migrateLessonIds(Array.isArray(value.completedLessons) ? value.completedLessons : []),
    skillScores: { ...defaultProgress.skillScores, ...(value.skillScores || {}) },
    mistakes: Array.isArray(value.mistakes) ? value.mistakes : defaultProgress.mistakes,
    noteHistory: Array.isArray(value.noteHistory) ? value.noteHistory : [],
    reviewState: value.reviewState && typeof value.reviewState === 'object' ? value.reviewState : {},
  };
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STATE_STORE)) db.createObjectStore(STATE_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open local database.'));
  });
}

async function readState(key) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STATE_STORE, 'readonly');
    const request = tx.objectStore(STATE_STORE).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function writeState(key, value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STATE_STORE, 'readwrite');
    tx.objectStore(STATE_STORE).put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function loadProgress() {
  try {
    const saved = await readState('progress');
    if (saved) {
      const migrated = mergeProgress(saved);
      await writeState('progress', migrated);
      return migrated;
    }
    const legacy = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (legacy) {
      const migrated = mergeProgress(JSON.parse(legacy));
      await writeState('progress', migrated);
      localStorage.removeItem(LEGACY_PROGRESS_KEY);
      return migrated;
    }
    await writeState('progress', defaultProgress);
    return mergeProgress(defaultProgress);
  } catch (error) {
    console.warn('ClinSpeak local database fallback:', error);
    try {
      const fallback = localStorage.getItem(LEGACY_PROGRESS_KEY);
      return fallback ? mergeProgress(JSON.parse(fallback)) : mergeProgress(defaultProgress);
    } catch {
      return mergeProgress(defaultProgress);
    }
  }
}

export async function saveProgress(progress) {
  const normalized = mergeProgress(progress);
  try {
    await writeState('progress', normalized);
  } catch (error) {
    console.warn('IndexedDB save failed; using localStorage fallback.', error);
    localStorage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify(normalized));
  }
}

export function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    return { ...defaultPreferences, ...saved };
  } catch {
    return { ...defaultPreferences };
  }
}

export function savePreferences(preferences) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...defaultPreferences, ...preferences }));
}

export async function resetLocalData() {
  await saveProgress(defaultProgress);
  savePreferences(defaultPreferences);
  return { progress: mergeProgress(defaultProgress), preferences: { ...defaultPreferences } };
}

export async function createBackup(contentVersion) {
  const progress = await loadProgress();
  const preferences = loadPreferences();
  return {
    format: 'clinspeak-backup',
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    contentVersion,
    progress,
    preferences,
  };
}

export function downloadBackup(backup) {
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `clinspeak-backup-${date}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function importBackupFile(file) {
  const raw = await file.text();
  const backup = JSON.parse(raw);
  if (backup?.format !== 'clinspeak-backup' || !backup.progress) throw new Error('This file is not a valid ClinSpeak backup.');
  const progress = mergeProgress(backup.progress);
  const preferences = { ...defaultPreferences, ...(backup.preferences || {}) };
  await saveProgress(progress);
  savePreferences(preferences);
  return { progress, preferences, sourceVersion: backup.contentVersion || null };
}
