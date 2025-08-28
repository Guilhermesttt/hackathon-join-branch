import React from 'react';
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 py-16 md:py-20 border-t border-white/10 bg-white/5 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden bg-white/10 border border-white/20 backdrop-blur-md">
                <img 
                  src="/Logo-Sereno3.png" 
                  alt="Sereno Logo" 
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-2xl font-light text-white tracking-wide block">
                  Sereno
                </span>
                <p className="text-white/60 text-sm font-light">
                  Saúde mental para todos
                </p>
              </div>
            </div>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Conectando pessoas através da tecnologia e comunidade para promover o bem-estar mental e emocional.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-light">Sobre Nós</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-light">Nossos Serviços</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-light">Comunidade</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-light">Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-white/60 text-sm font-light">
                <Mail className="w-4 h-4" />
                <span>contato@sereno.com</span>
              </li>
              <li className="flex items-center space-x-3 text-white/60 text-sm font-light">
                <Phone className="w-4 h-4" />
                <span>+55 (11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-3 text-white/60 text-sm font-light">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <Instagram className="w-5 h-5 text-white/60 hover:text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <Facebook className="w-5 h-5 text-white/60 hover:text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <Twitter className="w-5 h-5 text-white/60 hover:text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <Linkedin className="w-5 h-5 text-white/60 hover:text-white" />
            </a>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6 md:mb-0">
            <a href="#" className="text-white/50 hover:text-white transition-all duration-300 text-sm font-light">Termos de Uso</a>
            <a href="#" className="text-white/50 hover:text-white transition-all duration-300 text-sm font-light">Política de Privacidade</a>
            <a href="#" className="text-white/50 hover:text-white transition-all duration-300 text-sm font-light">Cookies</a>
          </div>
          
          <p className="text-white/50 text-sm font-light text-center md:text-right">
            © {new Date().getFullYear()} Sereno. Feito com <Heart className="w-4 h-4 inline text-red-400" /> para você.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
