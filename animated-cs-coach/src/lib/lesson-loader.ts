import type { LessonContent } from './types';

const loaders: Record<string, () => Promise<{ default: LessonContent } | LessonContent>> = {
  'dsa/linked-list-intro': () => import('../../content/dsa/linked-list-intro'),
  'system-design/load-balancer-basics': () => import('../../content/system-design/load-balancer-basics'),
  'oop/solid-single-responsibility': () => import('../../content/oop/solid-single-responsibility')
};

export async function loadLesson(trackSlug: string, lessonSlug: string) {
  const key = `${trackSlug}/${lessonSlug}`;
  const loader = loaders[key];
  if (!loader) {
    throw new Error(`Lesson not found for key: ${key}`);
  }
  const module = await loader();
  return 'default' in module ? module.default : module;
}
