# Contributing Guide (Excerpt)

## Adding a New Lesson

1. **Copy the template**
   - Duplicate [`content/lesson-template.example.ts`](./content/lesson-template.example.ts) into the appropriate topic folder (`content/dsa`, `content/system-design`, or `content/oop`).
   - Rename the file following the pattern `<slug>.ts` (e.g., `binary-tree-traversal.ts`).

2. **Fill out metadata**
   - Update `meta` fields: `id`, `slug`, `title`, `trackId`, `durationMs`, `level`, and `summary`.
   - Keep `slug` kebab-cased and unique within the track.

3. **Define animation steps**
   - Provide 5–8 `steps` with clear `label`, `description`, `durationMs`, and optional `code` snippet.
   - Add Framer Motion configs under `motion`. Use SVG-friendly props to integrate with the shared `<AnimationPlayer />`.
   - Aim for ~4–6 seconds per step; total duration drives the progress bar.

4. **Register lesson metadata**
   - Edit [`src/lib/tracks.ts`](./src/lib/tracks.ts) to append the lesson entry inside `lessonsByTrack[trackId]`.
   - Add a loader mapping in [`src/lib/lesson-loader.ts`](./src/lib/lesson-loader.ts) so the route can lazy-load your file.

5. **Author supporting copy**
   - Update route explanations (Markdown strings, code tabs) in [`src/routes/screens/Lesson.tsx`](./src/routes/screens/Lesson.tsx) if lesson-specific copy is needed.
   - Consider adding items to the optional `resources` array for further reading.

6. **Run checks**
   - `npm run lint`
   - `npm run test`
   - `npm run build`

7. **Submit your PR**
   - Include screenshots or screen recordings if the animation changed materially.
   - Document keyboard interactions or accessibility notes in the PR description.
