export const PROGRAMMES = ['B.Tech', 'M.Tech'];
export const BATCHES = ["'24 & earlier", "'25 & '26"];

export const NAMES: Record<string, string> = {
  SCOPE: 'Computer Science & Engineering',
  SCORE: 'Computer Sci. Engg. & Information Systems',
  MIS: 'Computer Sci. Engg. & Information Systems',
  SENSE: 'Electronics Engineering',
  SELECT: 'Electrical Engineering',
  SMEC: 'Mechanical Engineering',
  SBST: 'Bio Sciences & Technology',
  SCHEME: 'Chemical Engineering',
  SCE: 'Civil Engineering',
  SHINE: 'Healthcare Science & Engineering',
};

// School keys in `data` look like "SCOPE", "SCOPE ('25 Batch)", "MTech" or "MIS ('25 Batch)"
export function schoolInfo(key: string) {
  const code = key.startsWith('MTech') ? 'SCOPE' : key.split(' ')[0];
  return {
    code,
    name: NAMES[code],
    programme: /^(MTech|MIS)/.test(key) ? PROGRAMMES[1] : PROGRAMMES[0],
    batch: key.includes("'25") ? BATCHES[1] : BATCHES[0],
  };
}
