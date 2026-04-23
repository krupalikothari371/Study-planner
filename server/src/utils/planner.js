const buildAISuggestion = (selectedSubjects, remainingTime, totalTime) => {
  if (!selectedSubjects.length) {
    return "No subject fits in your available time. Increase total time or reduce per-subject time requirements.";
  }

  const hardCount = selectedSubjects.filter((s) => s.difficulty === "Hard").length;
  const heavySubject = selectedSubjects.find((s) => s.timeRequired > totalTime * 0.4);

  if (hardCount >= 2) {
    return "You selected multiple hard subjects. Start with one hard topic first, then switch to medium/easy for retention.";
  }

  if (heavySubject) {
    return `Subject ${heavySubject.name} consumes a large part of your schedule. Break it into Pomodoro blocks and revise key formulas after each block.`;
  }

  if (remainingTime > 0) {
    return "You still have extra time. Use it for revision quizzes and weak-topic practice to increase predicted score stability.";
  }

  return "Your schedule is tightly optimized. Keep 10-15 minutes for recap to improve memory retention before exams.";
};

const generateOptimalPlan = (subjects, totalTime) => {
  const n = subjects.length;

  // dp[i][t] stores max achievable weightage using first i subjects within t hours.
  const dp = Array.from({ length: n + 1 }, () => Array(totalTime + 1).fill(0));

  for (let i = 1; i <= n; i += 1) {
    const current = subjects[i - 1];
    for (let t = 0; t <= totalTime; t += 1) {
      if (current.timeRequired <= t) {
        const includeScore = current.weightage + dp[i - 1][t - current.timeRequired];
        const excludeScore = dp[i - 1][t];
        dp[i][t] = Math.max(includeScore, excludeScore);
      } else {
        dp[i][t] = dp[i - 1][t];
      }
    }
  }

  let t = totalTime;
  const selected = [];
  const explainSteps = [];

  // Backtrack through the DP table to recover which subjects were picked.
  for (let i = n; i > 0; i -= 1) {
    if (dp[i][t] !== dp[i - 1][t]) {
      const picked = subjects[i - 1];
      selected.push(picked);
      explainSteps.push(
        `Picked ${picked.name} (time ${picked.timeRequired}, weight ${picked.weightage}) because dp[${i}][${t}] != dp[${i - 1}][${t}]`
      );
      t -= picked.timeRequired;
    } else {
      const skipped = subjects[i - 1];
      explainSteps.push(
        `Skipped ${skipped.name} at state (i=${i}, t=${t}) because keeping previous value was optimal`
      );
    }
  }

  selected.reverse();
  explainSteps.reverse();

  const usedTime = selected.reduce((sum, subject) => sum + subject.timeRequired, 0);
  const predictedScore = selected.reduce((sum, subject) => sum + subject.weightage, 0);
  const remainingTime = totalTime - usedTime;

  return {
    selectedSubjects: selected,
    predictedScore,
    usedTime,
    remainingTime,
    explainSteps,
    aiSuggestion: buildAISuggestion(selected, remainingTime, totalTime),
  };
};

module.exports = { generateOptimalPlan };
