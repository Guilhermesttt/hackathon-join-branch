@@ .. @@
 import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
 import { useNavigate } from 'react-router-dom';
-import { Heart, Users, Target, Sparkles, Brain, MessageCircle, Shield, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
+import { Heart, Users, Target, Sparkles, Brain, MessageCircle, Shield, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
 import Navbar from './Components/Navbar';
 import Plasma from './Components/Plasma';
 import HeroSection from './Components/HeroSection';
 import FeatureCard from './Components/FeatureCard';
 import CommunityCard from './Components/CommunityCard';
 import TestimonialCard from './Components/TestimonialCard';
 import Footer from './Components/Footer'; 

@@ .. @@
           <div className="flex flex-col sm:flex-row gap-3 justify-center">
             <button
               onClick={handleManualRedirect}
-              className="w-full py-3 px-6 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
+              className="group bg-white text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-white/90 text-lg tracking-wide hover:scale-105 hover:shadow-lg hover:shadow-white/20 relative overflow-hidden"
             >
-              Ir para Home Agora (Teste)
+              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
+              <span className="relative flex items-center justify-center space-x-2">
+                <span>Entrar na Rede Social</span>
+                <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1" />
+              </span>
             </button>
+            
+            <button 
+              onClick={() => navigate('/login')}
+              className="group relative bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl transition-all duration-300 text-lg font-light tracking-wide hover:bg-white/5 backdrop-blur-md hover:scale-105"
+            >
+              <span className="relative z-10 flex items-center justify-center space-x-2">
+                <span>Fazer Login</span>
+                <Heart className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
+              </span>
+            </button>
           </div>
@@ .. @@