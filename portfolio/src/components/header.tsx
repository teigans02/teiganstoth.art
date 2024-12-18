import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-black py-6 px-8 bg-[#F8F8EF] md:sticky md:top-0 z-10">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-4xl font-['StyreneA-Regular'] hover:opacity-80">
          Teigan Stothart
        </Link>
        <nav className="space-x-6">
          <Link 
            href="/about" 
            className="text-lg hover:underline"
          >
            About
          </Link>
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
