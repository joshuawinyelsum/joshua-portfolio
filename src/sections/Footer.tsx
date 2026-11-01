export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-14 section-padding bg-[#111111] text-gray-500">
      <div className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight mb-2">
              Joshua Winyelsum
            </h3>
            <p className="text-[11px] tracking-wider text-gray-500 mb-2">
              Software & Systems Engineer · Backend Architecture · Database Design · Data Systems
            </p>
            <p className="text-[11px] text-gray-600 italic">
              Building reliable systems. Modeling relational data. Verifying through automated tests.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <button
              onClick={scrollToTop}
              className="group text-[11px] font-medium text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5"
              aria-label="Back to top"
            >
              Back to top
              <svg
                className="w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7" />
              </svg>
            </button>
            <p className="text-[11px] text-gray-600">
              © {new Date().getFullYear()} Joshua Winyelsum
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
