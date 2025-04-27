import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-12 bg-white md:sticky md:top-0 z-20">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg">
          Teigan Stothart
        </Link>
        <nav className="flex space-x-6">
          <a 
            href="https://www.linkedin.com/in/teigan-stothart-40a8b323a/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path></svg>
          </a>
          <a 
            href="mailto:teigans02@icloud.com?subject=Portfolio%20Contact"
            className="text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path></svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
