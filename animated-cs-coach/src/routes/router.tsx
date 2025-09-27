import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

const HomePage = () => import('./screens/Home');
const TrackPage = () => import('./screens/Track');
const LessonPage = () => import('./screens/Lesson');
const NotFoundPage = () => import('./screens/NotFound');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className="p-8">Something went wrong.</div>,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await HomePage()).Home })
      },
      {
        path: 'tracks/:trackSlug',
        lazy: async () => ({ Component: (await TrackPage()).Track }),
      },
      {
        path: 'tracks/:trackSlug/:lessonSlug',
        lazy: async () => ({ Component: (await LessonPage()).Lesson }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await NotFoundPage()).NotFound })
      }
    ]
  }
]);
