
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3500); // 3.5 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-primary-800 p-4 overflow-hidden">

        {/* Main Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-white text-center animate-fade-in-scale">
          <div className="w-32 h-32 md:w-40 md:h-40">
            <ICONS.logo className="w-full h-full text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4">KIA Digital</h1>
          <p className="text-lg md:text-xl font-medium mt-2 text-primary-100 animate-slide-in-up">
            Kesehatan Ibu & Anak dalam Genggaman
          </p>
        </div>
        
        {/* Footer Text */}
        <div className="absolute bottom-10 text-center text-primary-200/80 font-semibold animate-slide-in-up-late">
            <p className="text-sm">Dipersembahkan oleh</p>
            <p className="text-lg text-white font-bold tracking-wide">Pemerintah Desa Palangsari</p>
        </div>

      </div>
      <style>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-out forwards;
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 1s ease-out 0.5s forwards;
          opacity: 0; /* Start hidden */
        }
        
        @keyframes slide-in-up-late {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up-late {
          animation: slide-in-up-late 1s ease-out 1s forwards;
          opacity: 0; /* Start hidden */
        }
      `}</style>
    </>
  );
};

export default LandingPage;
