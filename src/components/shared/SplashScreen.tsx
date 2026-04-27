export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-red-800"
      style={{ animation: 'fadeIn 0.5s ease-in' }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .app-title {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .app-subtitle {
          animation: fadeIn 0.6s ease-out 0.3s both;
        }
        .loading-dots span {
          animation: pulse 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="text-center">
        <p className="text-6xl mb-4" style={{ animation: 'fadeIn 1s ease-out' }}>
          ⭐
        </p>
        <h1 className="app-title text-4xl font-bold text-white tracking-tight">
          Habit Tracker
        </h1>
        <p className="app-subtitle mt-2 text-indigo-200 text-sm">
          Building better days
        </p>
        <div className="loading-dots mt-8 flex gap-2 justify-center">
          <span className="w-2 h-2 bg-indigo-300 rounded-full inline-block"></span>
          <span className="w-2 h-2 bg-indigo-300 rounded-full inline-block"></span>
          <span className="w-2 h-2 bg-indigo-300 rounded-full inline-block"></span>
        </div>
      </div>
    </div>
  )
}