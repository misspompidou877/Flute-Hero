/*
 * OnboardingPage — first-use flow controller (Workstream B).
 *
 * A single-screen step machine (one step at a time). It renders the shared
 * OnboardingShell, a single Piper (FluteCharacter) instance whose mood/speech it
 * drives, and the current step component. It owns navigation between steps,
 * on-device persistence of the child's profile, all analytics instrumentation,
 * and the final hand-off into the real Practice screen.
 *
 * Targets (orchestration §3): first flute SOUND within ~90s, first SONG within
 * ~5 min, ZERO signup/email/paywall before the first success. The final step
 * offers an OPTIONAL email that unlocks the free-song tier (2 songs at every
 * level) — skipping it is fine (soft gate).
 *
 * Intended route: /onboarding
 * First-run gate (wired by the orchestrator in App.jsx, NOT here): redirect to
 * /onboarding whenever localStorage['onboarding.complete'] !== 'true'.
 *
 * Completion writes localStorage 'onboarding.complete' = 'true', unlocks the
 * free songs if an email was given, then navigates to
 * /practice?song=hot-cross-buns (the first song).
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import OnboardingShell from '../components/onboarding/OnboardingShell';
import SplashStep from '../components/onboarding/SplashStep';
import HelloStep from '../components/onboarding/HelloStep';
import NameStep from '../components/onboarding/NameStep';
import AgeStep from '../components/onboarding/AgeStep';
import FluteStep from '../components/onboarding/FluteStep';
import QuestStep from '../components/onboarding/QuestStep';
import FirstSoundStep from '../components/onboarding/FirstSoundStep';
import FirstSongStep from '../components/onboarding/FirstSongStep';
import JourneyStep from '../components/onboarding/JourneyStep';
import SaveStep from '../components/onboarding/SaveStep';

import FluteCharacter from '../components/FluteCharacter';
import { logEvent, markTiming } from '../utils/analytics';
import { useProgress } from '../context/ProgressContext';

// Step order + the default Piper state shown when each step is viewed.
// (A step may override Piper mid-step via the setPiper prop, e.g. FirstSound.)
const STEPS = [
  { id: 'splash',      Comp: SplashStep,     piper: { mood: 'wave',      speech: 'Hi there! 👋' } },
  { id: 'hello',       Comp: HelloStep,      piper: { mood: 'wave',      speech: null } },
  { id: 'name',        Comp: NameStep,       piper: { mood: 'idle',      speech: 'What should I call you? 🎵' } },
  { id: 'age',         Comp: AgeStep,        piper: { mood: 'idle',      speech: null } },
  { id: 'flute',       Comp: FluteStep,      piper: { mood: 'idle',      speech: null } },
  { id: 'quest',       Comp: QuestStep,      piper: { mood: 'wave',      speech: 'Help me! 🌬️' } },
  { id: 'first-sound', Comp: FirstSoundStep, piper: { mood: 'listening', speech: 'Blow soft, like cooling soup 🌬️' } },
  { id: 'first-song',  Comp: FirstSongStep,  piper: { mood: 'celebrate', speech: 'I found one! 🎉' } },
  { id: 'journey',     Comp: JourneyStep,    piper: { mood: 'celebrate', speech: 'Look at the sky! 🌤️' } },
  { id: 'save',        Comp: SaveStep,       piper: { mood: 'wave',      speech: null } },
];

// Raw string writes (HomePage reads profile.firstName as a plain string; the
// first-run gate checks the plain string 'true'). Always try/catch (CLAUDE.md).
function rawSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode / quota — degrade gracefully, flow continues.
  }
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { unlockFreeSongs } = useProgress();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({});
  const [piper, setPiperState] = useState(STEPS[0].piper);

  const updatePiper = useCallback((mood, speech = null) => {
    setPiperState({ mood, speech });
  }, []);

  // Start-of-flow: baseline timing + started event (before the first step view).
  useEffect(() => {
    markTiming('onboarding_started');
    logEvent('onboarding_started');
  }, []);

  // On each step view: log it and reset Piper to the step's default state.
  useEffect(() => {
    const step = STEPS[stepIndex];
    if (!step) return;
    logEvent('onboarding_step_viewed', { step: step.id });
    setPiperState(step.piper);
  }, [stepIndex]);

  // Advance one step, persisting any captured profile fields + capture events.
  const next = useCallback((payload = {}) => {
    const step = STEPS[stepIndex];

    if ('firstName' in payload) {
      rawSet('profile.firstName', String(payload.firstName));
      logEvent('name_captured');
    }
    if ('age' in payload) {
      rawSet('profile.age', String(payload.age));
      logEvent('age_selected', { age: payload.age });
    }
    if ('hasFlute' in payload) {
      rawSet('profile.hasFlute', payload.hasFlute ? 'true' : 'false');
      logEvent('flute_status', { hasFlute: payload.hasFlute });
    }

    setData((d) => ({ ...d, ...payload }));
    if (step) logEvent('onboarding_step_completed', { step: step.id });
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }, [stepIndex]);

  // Final step: mark complete, and — if a grown-up added an email — unlock the
  // free-song tier (2 songs at every level). No email is fine (soft gate): the
  // guest can still play the first "taste" song we hand off into below.
  const finish = useCallback((payload = {}) => {
    const step = STEPS[stepIndex];

    if (payload.email) {
      logEvent('email_captured');
      unlockFreeSongs(String(payload.email)); // stores profile.saveEmail + flips entitlement
    }
    if (step) logEvent('onboarding_step_completed', { step: step.id });

    rawSet('onboarding.complete', 'true');
    logEvent('onboarding_completed');

    navigate('/practice?song=hot-cross-buns');
  }, [stepIndex, navigate, unlockFreeSongs]);

  const step = STEPS[stepIndex] ?? STEPS[0];
  const StepComp = step.Comp;

  return (
    <OnboardingShell
      stepIndex={stepIndex}
      totalSteps={STEPS.length}
      showProgress={step.id !== 'splash'}
    >
      <StepComp
        data={data}
        onNext={next}
        onDone={finish}
        setPiper={updatePiper}
      />

      {/* Single Piper instance (renders fixed bottom-right by design). */}
      <FluteCharacter mood={piper.mood} speech={piper.speech ?? undefined} animKey={stepIndex} />
    </OnboardingShell>
  );
}
