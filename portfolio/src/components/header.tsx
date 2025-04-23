import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-12 bg-white md:sticky md:top-0 z-20">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg hover:underline">
          Teigan Stothart
        </Link>
        <nav className="space-x-6">
          <a 
            href="https://www.linkedin.com/in/teigan-stothart-40a8b323a/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:inline text-lg hover:underline"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:teigans02@icloud.com?subject=Portfolio%20Contact"
            className="hidden md:inline text-lg hover:underline"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
