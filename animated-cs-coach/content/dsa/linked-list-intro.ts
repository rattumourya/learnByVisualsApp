import type { LessonContent } from '../../src/lib/types';

const content: LessonContent = {
  meta: {
    id: 'linked-list-intro',
    slug: 'linked-list-intro',
    title: 'Linked List Fundamentals',
    trackId: 'dsa',
    durationMs: 180000,
    level: 'Beginner',
    summary: 'Understand how nodes connect in a singly linked list.'
  },
  steps: [
    {
      id: 'nodes-appear',
      label: 'Nodes appear',
      description: 'Three nodes emerge representing values in the list.',
      durationMs: 4000,
      motion: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6 }
      },
      code: 'class Node {\n  constructor(public value: number, public next: Node | null = null) {}\n}'
    },
    {
      id: 'pointers-connect',
      label: 'Pointers connect',
      description: 'Arrows animate to show the next references.',
      durationMs: 5000,
      motion: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, delay: 0.2 }
      },
      code: 'head.next = second;\nsecond.next = third;'
    },
    {
      id: 'head-highlight',
      label: 'Head node',
      description: 'Highlight the head node as the entry point.',
      durationMs: 4000,
      motion: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.1, 1], transition: { repeat: 1, duration: 1.2 } }
      },
      code: 'const head = new Node(4);'
    },
    {
      id: 'append',
      label: 'Appending',
      description: 'Show how a new node is appended at the tail.',
      durationMs: 5000,
      motion: {
        initial: { x: -40, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { duration: 0.6 }
      },
      code: 'tail.next = new Node(7);'
    },
    {
      id: 'traverse',
      label: 'Traverse',
      description: 'A cursor moves from head to tail following next pointers.',
      durationMs: 6000,
      motion: {
        initial: { x: 0 },
        animate: { x: [0, 60, 120], transition: { duration: 2 } }
      },
      code: 'let current = head;\nwhile (current) {\n  current = current.next;\n}'
    }
  ]
};

export default content;
