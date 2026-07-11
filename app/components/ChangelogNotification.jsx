'use client';

import { useState, useEffect } from "react";
import { X, Sparkles, RefreshCw } from "lucide-react";

const CURRENT_APP_VERSION = "2.2.0";

const CHANGELOG_DATA = {
    version: CURRENT_APP_VERSION,
    date: "July 2026",
    features: [
        "VidFast (Server 4) and Aoen-Watch (Server 2) were added.",
        "The episode slider now resizes independent of the player.",
        "Spoiler mode has been added for TV series.",
    ]
};

export default function ChangelogNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const localKey = "aeonwatch_last_version";
        const viewedVersion = localStorage.getItem(localKey);

        if (viewedVersion !== CURRENT_APP_VERSION) {
            setShouldRender(true);
            const openTimeout = setTimeout(() => setIsVisible(true), 1500);

            const closeTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 9500);

            localStorage.setItem(localKey, CURRENT_APP_VERSION);

            return () => {
                clearTimeout(openTimeout);
                clearTimeout(closeTimeout);
            };
        }
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-[300] w-[320px] rounded-xl border border-emerald-500/10 bg-[#060c06]/95 p-4 backdrop-blur-md shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_0_1px_rgba(45,155,78,0.05)] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isVisible
                ? "translate-x-0 opacity-100 scale-100"
                : "translate-x-[380px] opacity-0 scale-95"
                }`}
        >
            {/* Header Context */}
            <div className="mb-3 flex items-center justify-between border-b border-emerald-500/5 pb-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-[#2d9b4e]">
                        <Sparkles size={13} />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[rgba(232,221,208,0.8)]">
                            What's New
                        </h4>
                        <p className="text-[9px] font-medium font-sans text-emerald-500/60 tracking-wider">
                            v{CHANGELOG_DATA.version} • {CHANGELOG_DATA.date}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex h-5 w-5 items-center justify-center rounded border border-transparent text-[rgba(232,221,208,0.3)] transition-all duration-200 hover:border-emerald-500/10 hover:bg-emerald-500/5 hover:text-emerald-500/60"
                >
                    <X size={14} />
                </button>
            </div>

            <ul className="space-y-2 max-h-[180px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                {CHANGELOG_DATA.features.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[10px] leading-relaxed text-[rgba(232,221,208,0.55)]">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#2d9b4e]" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}