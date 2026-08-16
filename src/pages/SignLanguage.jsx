import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useProgress } from '../context/ProgressContext';
import { getSignContent } from '../services/contentService';
import CategoryCard from '../components/CategoryCard';
import { BookOpen, PenTool, TrendingUp, ArrowLeft, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SignMenu = () => {
  const { t } = useLocale();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginTop: 32 }}>
      <CategoryCard to="/sign-language/learning" title={t('learning')} icon={BookOpen} />
      <CategoryCard to="/sign-language/practice" title={t('practice')} icon={PenTool} />
    </div>
  );
};

const SignImageCard = ({ item, locale }) => {
  const [error, setError] = useState(false);

  return (
    <div className="glass-card p-6 flex flex-col items-center gap-6 hover:scale-[1.02] transition-transform">
      <div className="w-full max-w-2xl aspect-video bg-black/50 rounded-lg flex items-center justify-center overflow-hidden relative group shadow-lg">
        {!error ? (
          <img 
            src={`/${item.sign_text_en.toLowerCase()}.jpg`} 
            alt={`${item.sign_text_en} sign`} 
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="text-6xl text-white">{locale === 'en' ? item.sign_text_en : item.sign_text_gu}</div>
        )}
      </div>
      <div className="text-center">
        <p className="font-bold text-3xl text-primary-sign mb-2">{locale === 'en' ? item.sign_text_en : item.sign_text_gu}</p>
        <p className="text-lg text-gray-300">{locale === 'en' ? item.description_en : item.description_gu}</p>
      </div>
    </div>
  );
};

// Inner image renderer for carousel (shows image or large letter fallback)
const SignImageInner = ({ item, locale }) => {
  const [error, setError] = useState(false);
  return !error ? (
    <img
      src={`/${item.sign_text_en?.toLowerCase()}.jpg`}
      alt={`${item.sign_text_en} sign`}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  ) : (
    <div style={{ fontSize: 120, fontWeight: 900, color: '#06b6d4', fontFamily: 'Noto Sans Gujarati, sans-serif', lineHeight: 1 }}>
      {locale === 'en' ? item.sign_text_en : item.sign_text_gu}
    </div>
  );
};



const SignLearning = () => {
  const { locale } = useLocale();
  const [content, setContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getSignContent('alphabet').then(setContent).catch(console.error);
  }, []);

  const filteredContent = content.filter(item => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.sign_text_en && item.sign_text_en.toLowerCase().includes(q)) ||
      (item.sign_text_gu && item.sign_text_gu.includes(searchTerm.trim())) ||
      (item.description_en && item.description_en.toLowerCase().includes(q)) ||
      (item.description_gu && item.description_gu.includes(searchTerm.trim()))
    );
  });

  const activeIndex = Math.min(index, Math.max(0, filteredContent.length - 1));

  if (content.length === 0) {
    return (
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "32px 48px", background: "#141414", border: "1px solid #262626", borderRadius: 20, color: "#666" }}>Loading signs...</div>
      </div>
    );
  }

  const item = filteredContent[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === filteredContent.length - 1;

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Search Input */}
      <div style={{ width: "100%", maxWidth: 680, position: "relative" }}>
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#666" }}>
          <Search size={18} />
        </div>
        <input
          type="text"
          lang="gu"
          placeholder="Search signs / સંકેતો શોધો..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIndex(0);
          }}
          className="input-field"
          style={{ paddingLeft: 46, paddingRight: 16, height: 48, borderRadius: 14, fontSize: 15 }}
        />
      </div>

      {filteredContent.length === 0 ? (
        <div style={{ padding: "40px 24px", background: "#141414", border: "1px solid #262626", borderRadius: 20, textAlign: "center", color: "#666", width: "100%", maxWidth: 680 }}>
          No signs found matching "{searchTerm}"
        </div>
      ) : (
        <>
          {/* Counter */}
          <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, margin: 0 }}>
            {activeIndex + 1} / {filteredContent.length}
          </p>

          {/* Main card */}
          <div style={{ width: "100%", maxWidth: 680, background: "#141414", border: "1px solid #262626", borderRadius: 20, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 32, position: "relative", overflow: "hidden" }}>
            {/* Subtle glow */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(106,76,245,0.04), transparent)", pointerEvents: "none" }} />

            {/* Sign image */}
            <div style={{ width: "100%", aspectRatio: "16/9", background: "#0d0d0d", borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #1c1c1c", position: "relative" }}>
              <SignImageInner item={item} locale={locale} />
            </div>
            {/* Label */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 800, fontSize: 56, color: "#6a4cf5", letterSpacing: "-2px", lineHeight: 1, margin: 0 }}>
                {locale === 'en' ? item.sign_text_en : item.sign_text_gu}
              </p>
              <p style={{ fontSize: 16, color: "#999", marginTop: 12, letterSpacing: "-0.1px" }}>
                {locale === 'en' ? item.description_en : item.description_gu}
              </p>
            </div>
          </div>

          {/* Arrow Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 8 }}>
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={isFirst}
              style={{
                width: 60, height: 60, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: isFirst ? "#333" : "#fff",
                border: isFirst ? "2px solid #1c1c1c" : "2px solid rgba(106,76,245,0.5)",
                background: isFirst ? "#0f0f0f" : "rgba(106,76,245,0.12)",
                cursor: isFirst ? "not-allowed" : "pointer",
                transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => { if (!isFirst) { e.currentTarget.style.background="rgba(106,76,245,0.25)"; e.currentTarget.style.transform="scale(1.1)"; }}}
              onMouseLeave={e => { e.currentTarget.style.background=isFirst?"#0f0f0f":"rgba(106,76,245,0.12)"; e.currentTarget.style.transform="scale(1)"; }}
              aria-label="Previous sign"
            >←</button>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {filteredContent.slice(Math.max(0, activeIndex-4), Math.min(filteredContent.length, activeIndex+5)).map((_, i) => {
                const ri = Math.max(0, activeIndex-4) + i;
                return (
                  <button key={ri} onClick={() => setIndex(ri)} style={{
                    borderRadius: 100, border: "none", cursor: "pointer", transition: "all 0.2s",
                    width: ri === activeIndex ? 24 : 8, height: ri === activeIndex ? 10 : 8,
                    background: ri === activeIndex ? "#6a4cf5" : "rgba(255,255,255,0.15)",
                  }} />
                );
              })}
            </div>

            <button
              onClick={() => setIndex(i => Math.min(filteredContent.length - 1, i + 1))}
              disabled={isLast}
              style={{
                width: 60, height: 60, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: isLast ? "#333" : "#fff",
                border: isLast ? "2px solid #1c1c1c" : "2px solid rgba(106,76,245,0.5)",
                background: isLast ? "#0f0f0f" : "rgba(106,76,245,0.12)",
                cursor: isLast ? "not-allowed" : "pointer",
                transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => { if (!isLast) { e.currentTarget.style.background="rgba(106,76,245,0.25)"; e.currentTarget.style.transform="scale(1.1)"; }}}
              onMouseLeave={e => { e.currentTarget.style.background=isLast?"#0f0f0f":"rgba(106,76,245,0.12)"; e.currentTarget.style.transform="scale(1)"; }}
              aria-label="Next sign"
            >→</button>
          </div>
          <p style={{ fontSize: 12, color: "#444", marginTop: 4, letterSpacing: "-0.1px" }}>
            Use search, arrows or dots to navigate · {filteredContent.length} signs
          </p>
        </>
      )}
    </div>
  );
};


const SignPractice = () => {
  return (
    <div className="mt-8 max-w-2xl mx-auto text-center">
      <div className="glass-card p-10 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-300">Practice Coming Soon!</h2>
        <p className="text-gray-400">This section is currently empty.</p>
      </div>
    </div>
  );
};



const SignLanguage = () => {
  const { t } = useLocale();
  const location = useLocation();
  const isRoot = location.pathname === '/sign-language';

  return (
    <div className="page-wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <Link
          to={isRoot ? "/" : "/sign-language"}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "#141414", border: "1px solid #262626",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#6a4cf5", transition: "all 0.15s ease", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background="#1c1c1c"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#141414"; }}
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-1px" }}>
          {t('category_sign')}
        </h1>
      </div>

      <Routes>
        <Route path="/" element={<SignMenu />} />
        <Route path="learning" element={<SignLearning />} />
        <Route path="practice" element={<SignPractice />} />
      </Routes>
    </div>
  );
};

export default SignLanguage;
