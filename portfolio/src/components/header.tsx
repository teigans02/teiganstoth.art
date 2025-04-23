import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-12 bg-white md:sticky md:top-0 z-20">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg hover:underline">
          Teigan Stothart
        </Link>
        <nav className="flex space-x-6">
          <a 
            href="https://www.linkedin.com/in/teigan-stothart-40a8b323a/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lg hover:underline text-gray-300"
          >
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>
          </a>
          <a 
            href="mailto:teigans02@icloud.com?subject=Portfolio%20Contact"
            className="text-lg hover:underline text-gray-300"
          >
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
