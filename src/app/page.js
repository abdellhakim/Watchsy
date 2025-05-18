'use client';
import Image from "next/image";
import Navbar from "./components/NavBar";
import { SparkleIcon } from "lucide-react";
import { useState } from "react";

const FeatureCard = ({ icon, title, text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shortText = text.length > 120 ? text.slice(0, 120) + "..." : text;

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="cursor-pointer p-4 rounded-lg  border border-transparent transition-all duration-300 hover:border-[#E50000] hover:shadow-[0_50px_180px_-30px_rgba(229,0,0,0.5)] hover:-translate-y-1"
    >
      <h3 className="font-bold flex text-white items-center gap-3 mb-2">
        <img src={icon} alt={`${title} icon`} className="h-6 w-6" />
        {title}
      </h3>
      <p className="text-[#e0e0e0] text-base text-left">
        {isOpen ? text : shortText}
      </p>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <section className="hero-sec relative  h-screen">
    
        <div className="absolute inset-0 opacity-50 bg-cover bg-center" style={{ backgroundImage: `url('/hero-sec.png')` }}>
          <div className="absolute inset-0  opacity-50"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-4xl font-bold mt-7 mb-4">Your Personal Guide to Movies & Shows</h1>
          <p className="text-xl w-2/3 mb-8">
            Explore movies and shows with ease—latest releases, timeless classics, and trending hits. Build watchlists, rate what you’ve seen, and track what’s next. With Watchsy, entertainment discovery is simple, smart, and personal.
          </p>
          <a  href="/signup" className="bg-[#E50000] text-white cursor-pointer px-6 py-4 rounded-lg font-bold hover:bg-[#411616] transition duration-300">
            Get Started Now
          </a>
        </div>
      </section>



      

      <section className="text-center my-16 px-8 " >
        <span className="text-md bg-[#d0170d] px-4 py-2 rounded-full inline-flex items-center space-x-2 border shadow-md">
          <span className="text-[#ffffff] font-semibold">Our Approach</span>
        </span>

        <div data-aos="fade-up">
          <h2 className="text-4xl text-[#ffffff] font-bold mt-5">Revolutionizing Movie Discovery<br />with Smart Tracking</h2>
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <p className="text-[#e0e0e0] max-w-3xl mx-auto mt-4">
            Watchsy helps you discover movies and TV shows effortlessly, organize your watchlists, and get personalized recommendations. All in one sleek, intuitive platform.
          </p>
        </div>

        <div className="mt-8 space-x-4">
          <button
            style={{ backgroundColor: "#E50000" }}
            className="cursor-pointer inline-flex items-center text-white font-bold text-md px-7 py-3 rounded-lg transition-transform duration-300 hover:scale-105"
          >
            Try Watchsy
          </button>
          <button className="cursor-pointer border border-gray-300 px-7 py-3 rounded-lg transition-transform duration-300 hover:scale-105">
            <span className="text-[#e7e7e7] font-semibold">Learn More</span>
          </button>
        </div>

       
        <div className="grid md:grid-cols-3 gap-6 mt-21 mb-26 max-w-6xl mx-auto w-full px-4">
          <FeatureCard
            icon="/icon1.png"
            title="Personalized Recommendations"
            text="Get movie and show suggestions based on your taste. Watchsy uses intelligent filtering to deliver content tailored to your preferences."
          />
          <FeatureCard
            icon="/icon2.png"
            title="Create & Manage Watchlists"
            text="Track what you want to watch and what you've already seen. Build multiple lists to organize your entertainment journey."
          />
          <FeatureCard
            icon="/icon3.png"
            title="Detailed Insights & Ratings"
            text="Access reviews, ratings, trailers, and key details about any title. Make informed viewing decisions without switching platforms."
          />
        </div>
      </section>

      <section className="callto-action-sec relative mx-10 rounded-xl overflow-hidden bg-[#131111] text-white my-10">
        <div className="absolute inset-0">
          <img
            src="/Container.png"
            alt="Background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 p-6 md:p-12 lg:p-16">
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            Discover your next favorite show with Watchsy!
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-xl mb-4">
            Track, rate, and organize the movies and series you love. Join Watchsy and make entertainment discovery smarter.
          </p>
          <a
            href="/signup"
            className="inline-block bg-[#E50000] hover:[#411616] text-white font-medium py-3 px-4 rounded-md transition"
          >
            Join Watchsy Now
          </a>
        </div>
      </section>



      <section id="faq" className="my-24 px-4 max-w-4xl mx-auto ">
        <div className="flex items-center space-x-5 mb-10">
          <SparkleIcon className="h-8 w-8 text-red-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-left">
          <details className="group rounded-lg p-4 hover:shadow-md transition bg-[#1f1f1f]">
            <summary className="cursor-pointer font-semibold text-lg text-white group-open:text-[#E50000]">
              What is Watchsy?
            </summary>
            <p className="text-white mt-2">
              Watchsy is your personal entertainment guide. It helps you explore, track, and rate movies and TV shows without streaming them.
            </p>
          </details>

          <details className="group rounded-lg p-4 hover:shadow-md transition bg-[#1f1f1f]">
            <summary className="cursor-pointer font-semibold text-lg text-white group-open:text-[#E50000]">
              Can I watch movies or shows on Watchsy?
            </summary>
            <p className="text-white mt-2">
              No, Watchsy doesn’t provide streaming. Instead, it offers detailed information, ratings, and discovery features to help you decide what to watch.
            </p>
          </details>

          <details className="group rounded-lg p-4 hover:shadow-md transition bg-[#1f1f1f]">
            <summary className="cursor-pointer font-semibold text-lg text-white group-open:text-[#E50000]">
              How do I keep track of what I want to watch?
            </summary>
            <p className="text-white mt-2">
              You can create and manage custom watchlists on Watchsy to organize movies and shows you plan to watch.
            </p>
          </details>

          <details className="group rounded-lg p-4 hover:shadow-md transition bg-[#1f1f1f]">
            <summary className="cursor-pointer font-semibold text-lg text-white group-open:text-[#E50000]">
              Is Watchsy free to use?
            </summary>
            <p className="text-white mt-2">
              Yes! Watchsy is completely free to use. Sign up to unlock features like ratings, watchlists, and personalized recommendations.
            </p>
          </details>
        </div>
      </section>



    </div>
  );
}
