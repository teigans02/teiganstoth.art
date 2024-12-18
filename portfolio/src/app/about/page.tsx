import Header from "@/components/header";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F8EF]">
      <Header />
      <main className="max-w-3xl mx-auto py-8 md:py-12 px-6 md:px-8">
        <h2 className="text-2xl md:text-3xl mb-4 md:mb-6 font-['StyreneA-Regular']">About Me</h2>
        <p className="text-base md:text-lg leading-relaxed mb-6 md:mb-8">
          Aspiring Brand Strategist with a passion for creating meaningful and impactful campaigns.<br /><br />
          Recent MSc Marketing and Consumer Behaviour Graduate from Goldsmiths, University of London.
        </p>
        
        <div className="md:hidden space-y-3">
          <a 
            href="https://www.linkedin.com/in/teigan-stothart-40a8b323a/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-base md:text-lg hover:underline"
          >
            LinkedIn
          </a>
          <div className="block text-base md:text-lg">
            <a 
              href="mailto:teigans02@icloud.com?subject=Reaching%20Out"
              className="hover:underline"
            >
              Contact
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 