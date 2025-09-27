import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">We couldn\'t find what you were looking for.</p>
      <Link to="/" className="text-primary underline">
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
