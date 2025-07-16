import React from "react";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-[80vh] px-4 flex items-center justify-center lg:ml-[25%] lg:w-[75%] w-full">
      <div className="text-white text-center max-w-4xl mx-auto">
        {/* Date + Category */}
        <p className="text-sm text-gray-600 dark:text-white/60 mb-2">
          June 30, 2025 &nbsp;
          <span className="text-gray-400 dark:text-white/40">Aldrill</span>
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-black dark:text-white">
          Introducing AI Models
        </h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href="/chatgpt"
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            Try AI models
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="text-black/80 dark:text-white/80 text-sm flex items-center gap-1 hover:underline hover:bg-gray-100 dark:hover:bg-gray-800 transition px-3 py-2 rounded"
          >
            Try ChatGPT for Work
          </a>
        </div>

        {/* Listen & Share */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-black/80 dark:text-white/80 text-sm">
          <button className="flex items-center gap-2 hover:text-black dark:hover:text-white transition">
            <span className="w-8 h-8 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-full">
              ▶
            </span>
            Developed by Jesutofunmi Enoch
          </button>
          <span>4:54</span>
          <button className="flex items-center gap-1 hover:text-black dark:hover:text-white transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Share
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
