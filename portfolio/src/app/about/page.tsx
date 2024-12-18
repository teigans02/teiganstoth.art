import Header from "@/components/header";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F8EF]">
      <Header />
      <main className="max-w-3xl mx-auto py-12 px-8">
        <h2 className="text-3xl mb-6 font-['StyreneA-Regular']">About Me</h2>
        <p className="text-lg leading-relaxed">
          Aspiring Brand Strategist with a passion for creating meaningful and impactful campaigns.<br /><br />
          Recent MSc Marketing and Consumer Behaviour Graduate from Goldsmiths, University of London.
         
        </p>
      </main>
    </div>
  );
} 