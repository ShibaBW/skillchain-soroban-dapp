type SkillListProps = {
  skills: string[];
};

export function SkillList({ skills }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-night/30 px-4 py-6 text-sm text-slate-300">
        No on-chain skills found for this wallet yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {skills.map((skill, index) => (
        <div
          key={`${skill}-${index}`}
          className="rounded-2xl border border-ember-400/20 bg-ember-500/10 px-4 py-4"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ember-200">
            Certified Skill
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{skill}</p>
        </div>
      ))}
    </div>
  );
}
