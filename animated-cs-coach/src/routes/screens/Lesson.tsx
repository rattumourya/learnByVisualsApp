import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AnimationPlayer } from '../../components/AnimationPlayer';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { CodeBlock } from '../../components/CodeBlock';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getLessonMeta, getTrackBySlug } from '../../lib/tracks';
import type { LessonContent } from '../../lib/types';
import { loadLesson } from '../../lib/lesson-loader';

export function Lesson() {
  const { trackSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const track = trackSlug ? getTrackBySlug(trackSlug) : undefined;
  const lessonMeta = trackSlug && lessonSlug ? getLessonMeta(trackSlug, lessonSlug) : undefined;
  const [content, setContent] = useState<LessonContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackSlug || !lessonSlug) return;
    loadLesson(trackSlug, lessonSlug)
      .then((data) => {
        setContent(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [lessonSlug, trackSlug]);

  useEffect(() => {
    if (!track || !lessonMeta) {
      navigate('/');
    }
  }, [lessonMeta, navigate, track]);

  if (!track || !lessonMeta) {
    return null;
  }

  if (error) {
    return <div className="rounded-lg border border-destructive/60 bg-destructive/5 p-6 text-destructive">{error}</div>;
  }

  if (!content) {
    return <div className="animate-pulse rounded-lg border border-border bg-card p-6">Loading lesson…</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: track.title, href: `/tracks/${track.slug}` },
          { label: lessonMeta.title }
        ]}
      />
      <header className="space-y-2">
        <motion.h1 layout className="text-3xl font-bold tracking-tight">
          {lessonMeta.title}
        </motion.h1>
        <p className="max-w-2xl text-muted-foreground">{lessonMeta.summary}</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AnimationPlayer steps={content.steps} />
        <aside className="flex flex-col gap-4">
          <Tabs defaultValue="explanation" className="w-full">
            <TabsList className="flex rounded-lg border border-border bg-muted/40 p-1">
              <TabsTrigger value="explanation" className="flex-1 rounded-md px-3 py-1 text-sm data-[state=active]:bg-background">
                Explanation
              </TabsTrigger>
              <TabsTrigger value="code" className="flex-1 rounded-md px-3 py-1 text-sm data-[state=active]:bg-background">
                Code
              </TabsTrigger>
              <TabsTrigger value="steps" className="flex-1 rounded-md px-3 py-1 text-sm data-[state=active]:bg-background">
                Steps
              </TabsTrigger>
            </TabsList>
            <TabsContent value="explanation" className="mt-3">
              <MarkdownRenderer markdown={`This is a placeholder explanation for ${lessonMeta.title}.`} />
            </TabsContent>
            <TabsContent value="code" className="mt-3 space-y-3">
              {content.steps.map((step) => (
                <CodeBlock key={step.id} code={step.code ?? '// No code for this step yet'} />
              ))}
            </TabsContent>
            <TabsContent value="steps" className="mt-3 space-y-2">
              <ol className="list-decimal space-y-2 pl-4 text-sm">
                {content.steps.map((step) => (
                  <li key={step.id}>
                    <p className="font-medium">{step.label}</p>
                    <p className="text-muted-foreground">{step.description}</p>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}

export default Lesson;
