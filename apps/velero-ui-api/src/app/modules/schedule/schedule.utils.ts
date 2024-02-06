export const patchPauseSchedule = (paused: boolean) => [
  {
    op: paused ? 'replace' : 'remove',
    path: '/spec/paused',
    value: true,
  },
];
