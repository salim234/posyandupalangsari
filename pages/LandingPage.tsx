
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 overflow-hidden">
        
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse-slow animation-delay-4000"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl">

          <div className="animate-fade-in-up">
            <ICONS.logo className="w-24 h-24 mx-auto text-primary-500" />
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary-800 mt-4">
              KIA Digital
            </h1>
            <p className="text-slate-600 text-lg mt-2">Desa Palangsari</p>
          </div>
          
          <Card className="mt-8 w-full animate-fade-in-up-delay bg-white/70 backdrop-blur-lg border border-white/50 shadow-2xl shadow-primary-100/50">
            <CardHeader>
                <h2 className="text-xl font-bold text-slate-800">
                Sambutan Kepala Desa Palangsari
                </h2>
            </CardHeader>
            <CardContent className="text-left text-slate-600 space-y-3 leading-relaxed">
                <p>
                Selamat datang di Aplikasi Buku Digital Kesehatan Ibu dan Anak (KIA).
                </p>
                <p>
                Kami, Pemerintah Desa Palangsari, mendukung penuh inovasi digital ini untuk memudahkan warga memantau kesehatan ibu hamil, bayi, dan balita secara praktis dan aman.
                </p>
                <p>
                Terima kasih kepada M. Nur Salim (Perangkat Desa Palangsari) yang telah membuat dan mengembangkan aplikasi ini untuk kita semua.
                </p>
                <p>
                Mari bersama kita manfaatkan aplikasi ini untuk mewujudkan generasi sehat, cerdas, dan kuat demi masa depan Desa Palangsari yang lebih baik.
                </p>
                <p className="text-right font-semibold text-slate-700 mt-4 italic">
                — Kepala Desa Palangsari
                </p>
            </CardContent>
          </Card>
          
          <div className="mt-10 w-full max-w-xs animate-fade-in-up-long-delay">
            <Button 
              onClick={() => navigate('/login')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Lanjutkan ke Login
            </Button>
          </div>

          <div className="mt-12 text-center animate-fade-in-up-long-delay opacity-0" style={{animationDelay: '1s'}}>
              <p className="text-sm text-slate-500">
                  © 2024 Posyandu Desa Palangsari Puspo. All rights reserved.
              </p>
              <p className="text-sm text-slate-500 font-semibold mt-1">
                  Pengembang Aplikasi : M Nur Salim
              </p>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-fade-in-up-long-delay {
          animation: fade-in-up 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }
        @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.7; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 10s infinite ease-in-out;
        }
        .animation-delay-2000 {
            animation-delay: -2s;
        }
        .animation-delay-4000 {
            animation-delay: -4s;
        }
      `}</style>
    </>
  );
};

export default LandingPage;