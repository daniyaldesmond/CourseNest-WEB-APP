/**
 * Client-side list filtering helpers for admin / my-learning views.
 */
export const filterBySearch = (items, search, fields) => {
  const q = search.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(q))
  );
};

export const normalizeCourse = (c) => ({
  ...c,
  id: c._id ?? c.id,
  lessons: (c.lessons || []).map((l) => ({ ...l, id: l._id ?? l.id })),
  quiz: (c.quiz || []).map((q) => ({ ...q, id: q._id ?? q.id })),
});
