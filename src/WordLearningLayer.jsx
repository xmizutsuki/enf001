import { useEffect, useRef, useState } from 'react';
import { Volume2, X } from 'lucide-react';
import { lookupWord } from './data/wordLexicon.js';

const TARGET_SELECTORS = [
  '.lesson-modal .lesson-body h2',
  '.lesson-modal .answer-option',
  '.lesson-modal .feedback-box p',
  '.practice-panel .flashcard strong',
  '.practice-panel .flashcard p',
  '.writing-grid .case-card h2',
  '.writing-grid .case-card > p',
  '.writing-grid .finding-list span',
  '.writing-grid .case-goal p',
  '.writing-grid .note-result p',
  '.writing-grid details p',
  '.mistake-list .wrong-text',
  '.mistake-list .right-text',
  '.speaking-card h2',
  '.speaking-card .heard-box p',
  '.speaking-card .speech-score p',
].join(',');

const WORD_RE = /([A-Za-z][A-Za-z’'\-]*|\d+(?:[./%-]\d+)*)/g;

function speakText(text, lang, rate = 0.82) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function tokenizeTextNode(node) {
  if (!node?.parentElement) return;
  const parent = node.parentElement;
  if (parent.closest('.cs-word, .word-learning-card, input, textarea, script, style')) return;
  const text = node.nodeValue || '';
  if (!/[A-Za-z]/.test(text)) return;

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  text.replace(WORD_RE, (match, _group, index) => {
    if (index > lastIndex) fragment.append(document.createTextNode(text.slice(lastIndex, index)));
    const span = document.createElement('span');
    span.className = 'cs-word';
    span.textContent = match;
    span.dataset.word = match;
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');
    span.setAttribute('aria-label', `Ouvir e aprender ${match}`);
    fragment.append(span);
    lastIndex = index + match.length;
    return match;
  });
  if (lastIndex < text.length) fragment.append(document.createTextNode(text.slice(lastIndex)));
  node.replaceWith(fragment);
}

function enhanceActivityWords(root = document) {
  root.querySelectorAll(TARGET_SELECTORS).forEach((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let current;
    while ((current = walker.nextNode())) nodes.push(current);
    nodes.forEach(tokenizeTextNode);
  });
}

export default function WordLearningLayer({ children }) {
  const [selected, setSelected] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    enhanceActivityWords(document);
    const observer = new MutationObserver((mutations) => {
      const shouldScan = mutations.some((mutation) => mutation.addedNodes.length || mutation.type === 'characterData');
      if (shouldScan) requestAnimationFrame(() => enhanceActivityWords(document));
    });
    observer.observe(document.getElementById('root'), { childList: true, subtree: true, characterData: true });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activate = (event) => {
      const target = event.target.closest?.('.cs-word');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      const word = target.dataset.word || target.textContent || '';
      const info = lookupWord(word);
      setSelected({ word, ...info });
      speakText(word, 'en-US', 0.76);
    };
    const keyActivate = (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.classList?.contains('cs-word')) activate(event);
    };
    document.addEventListener('click', activate, true);
    document.addEventListener('keydown', keyActivate, true);
    return () => {
      document.removeEventListener('click', activate, true);
      document.removeEventListener('keydown', keyActivate, true);
    };
  }, []);

  return (
    <>
      {children}
      {selected && (
        <div className="word-learning-card" role="dialog" aria-live="polite" aria-label={`Vocabulário: ${selected.word}`}>
          <div className="word-learning-head">
            <div>
              <small>TOQUE EM QUALQUER PALAVRA</small>
              <strong>{selected.word}</strong>
            </div>
            <button className="icon-button" onClick={() => setSelected(null)} aria-label="Fechar"><X size={18} /></button>
          </div>

          <div className="word-learning-pronunciation">
            <span>Pronúncia</span>
            <strong>{selected.pronunciation}</strong>
          </div>

          <div className="word-learning-translation">
            <span>Português</span>
            <strong>{selected.translation}</strong>
          </div>

          <div className="word-learning-actions">
            <button onClick={() => speakText(selected.word, 'en-US', 0.72)}><Volume2 size={17} /> Ouvir inglês</button>
            <button onClick={() => speakText(selected.translation.replace(/\/.*$/,'').replace(/\(.*?\)/g,'').trim(), 'pt-BR', 0.86)} disabled={!selected.found}><Volume2 size={17} /> Ouvir tradução</button>
          </div>

          {!selected.found && <p className="word-learning-note">O áudio em inglês continua disponível. Esta tradução ainda não faz parte do léxico offline.</p>}
        </div>
      )}
    </>
  );
}
