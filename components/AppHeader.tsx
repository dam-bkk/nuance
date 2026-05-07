import Link from "next/link";

const BackArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const Logo = ({ size = "h-6" }: { size?: string }) => (
  <img src="/nuance-logo.svg" alt="Nuance" style={{ height: "1.5rem", width: "auto" }} />
);

interface AppHeaderProps {
  back?: { href: string; label: string };
  section?: string;
  item?: string;
}

export default function AppHeader({ back, section, item }: AppHeaderProps) {
  return (
    <header className="bg-surface border-b border-edge transition-colors duration-300">
      <div className="h-[3px] bg-gradient-to-r from-[#0028FF] to-[#FF0000]" />
      <div className="max-w-[1250px] mx-auto px-6 py-3 flex items-center gap-2 min-w-0">
        {back ? (
          <Link
            href={back.href}
            className="flex items-center gap-2 flex-shrink-0 group text-dim hover:text-cobalt transition-colors"
            aria-label={`Retour — ${back.label}`}
          >
            <BackArrow />
            <Logo />
          </Link>
        ) : (
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>
        )}
        {section && (
          <>
            <div className="h-5 w-px bg-edge flex-shrink-0 mx-1" />
            <span className="text-xs font-extrabold text-cobalt uppercase tracking-widest flex-shrink-0">
              {section}
            </span>
          </>
        )}
        {item && (
          <>
            <svg className="text-edge flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="text-xs font-bold text-dim truncate">{item}</span>
          </>
        )}
      </div>
    </header>
  );
}
