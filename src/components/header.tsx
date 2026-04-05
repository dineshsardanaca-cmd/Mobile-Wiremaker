import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-4 border-b bg-card shrink-0">
      <Link href="/">
        <h1 className="text-2xl font-headline font-bold text-primary text-center">
          MenuMorph
        </h1>
      </Link>
    </header>
  );
}
