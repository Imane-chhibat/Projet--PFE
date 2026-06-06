import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate, useAnimation } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Award,
  Hammer,
  Zap,
  Droplet,
  Layers,
  Wrench,
  Brush,
  Compass,
  Wind,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Clock,
  CalendarCheck,
  MessageSquareHeart,
  UserCheck,
  Building,
  Building2,
  Calendar,
  Trash2,
  Megaphone,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  ClipboardList,
  Lightbulb,
  X,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../utils/api';
import { AuthAlertModal } from './AuthAlertModal';

// --- Sub-Components for Testimonials ---
interface PremiumTestimonial {
  id?: number;
  user_id?: number;
  text: string;
  image: string;
  name: string;
  role: string;
}

const premiumTestimonials: PremiumTestimonial[] = [
  {
    text: "Grâce à HandPro, j'ai trouvé un électricien diplômé de l'OFPPT en 10 minutes pour mon cabinet médical. Ponctuel et d'une compétence rare.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
    name: "Dr. Amina Tazi",
    role: "Casablanca",
  },
  {
    text: "La rénovation de notre maison d'hôtes était un défi. HandPro nous a permis de comparer les portfolios et trouver notre Maâlem Youssef.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
    name: "Laurent & Myriam",
    role: "Marrakech",
  },
  {
    text: "Le suivi GPS est formidable. Mon chauffe-eau a lâché un samedi soir, j'ai pu repérer le plombier le plus proche instantanément.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    name: "Omar Chraibi",
    role: "Rabat",
  },
  {
    text: "Un travail exceptionnel de peinture décorative stuc. Chantier extrêmement propre et finition haut de gamme. Je recommande vivement !",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
    name: "Nadia El Alami",
    role: "Tanger",
  },
  {
    text: "J'ai fait refaire toutes les portes en bois sculpté de mon riad par un menuisier qualifié de l'OFPPT. Magnifique travail d'art traditionnel.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150",
    name: "Karim Bensouda",
    role: "Fès",
  },
  {
    text: "Enfin une plateforme au Maroc qui valorise le travail bien fait avec des profils vérifiés et des assurances réelles sur les chantiers.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150",
    name: "Yassine Belkhayat",
    role: "Casablanca",
  },
  {
    text: "La zelligeuse Fatima a transformé notre fontaine murale en véritable chef-d'œuvre. Une patience et une précision incroyables.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150",
    name: "Sofia Mansouri",
    role: "Marrakech",
  },
  {
    text: "Recherche de fuite thermique faite sans aucune casse grâce au matériel infrarouge moderne de l'artisan. Très professionnel.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    name: "Mehdi Saidi",
    role: "Rabat",
  },
  {
    text: "Installation domotique complète de ma villa en un temps record. Ponctuel, transparent et très de confiance dans ses interventions.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150",
    name: "Hassan El Idrissi",
    role: "Casablanca",
  }
];

const firstColumn = premiumTestimonials.slice(0, 3);
const secondColumn = premiumTestimonials.slice(3, 6);
const thirdColumn = premiumTestimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: PremiumTestimonial[];
  duration?: number;
  paused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onDelete?: (id: number) => void;
  currentUserId?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: props.paused ? undefined : "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{ willChange: 'transform' }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ id, user_id, text, image, name, role }, i) => (
                <motion.li
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  onMouseEnter={() => props.onPause?.()}
                  onMouseLeave={() => props.onResume?.()}
                  whileHover={{
                    scale: 1.03,
                    y: -4,
                    boxShadow: "0 20px 40px -10px rgba(96, 58, 42, 0.15), 0 10px 10px -5px rgba(96, 58, 42, 0.05), 0 0 0 1px rgba(205, 181, 142, 0.2)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{
                    scale: 1.03,
                    y: -4,
                    boxShadow: "0 20px 40px -10px rgba(96, 58, 42, 0.15), 0 10px 10px -5px rgba(96, 58, 42, 0.05), 0 0 0 1px rgba(205, 181, 142, 0.2)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-6 rounded-2xl border border-[#CDB58E]/30 shadow-md max-w-xs w-full bg-[#fff8f0] transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-[#603A2A]/30 list-none"
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-xs sm:text-sm text-[#8E887F] font-sans leading-relaxed italic m-0 transition-colors duration-300">
                      "{text}"
                    </p>
                    <footer className="flex items-center gap-3 mt-5 pt-4 border-t border-[#8E887F]/10">
                      {image && !image.includes('ui-avatars') ? (
                        <img
                          width={48}
                          height={48}
                          src={image}
                          alt={`Avatar of ${name}`}
                          className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-[#CDB58E] shadow-sm group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                      ) : (
                        <div className="h-12 w-12 shrink-0 rounded-full border-2 border-[#CDB58E] bg-[#2A1B15] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 ease-in-out">
                          <span className="text-[#CDB58E] font-bold text-xl">{name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex flex-col text-left">
                        <cite className="font-sans font-bold text-xs text-[#2A1B15] not-italic leading-none">
                          {name}
                        </cite>
                      </div>
                      {props.currentUserId && user_id && props.currentUserId === user_id && props.onDelete && id && (
                        <button
                          onClick={() => props.onDelete!(id)}
                          className="ml-auto text-rose-400 hover:text-rose-600 transition-colors p-1"
                          title="Supprimer mon commentaire"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};


const getRelativeDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else if (diffDays >= 2 && diffDays <= 6) {
    return `Il y a ${diffDays} jours`;
  } else if (diffDays >= 7 && diffDays <= 27) {
    const weeks = Math.floor(diffDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
};

const useCountUp = (target: number, duration: number = 2500, delay: number = 0, start: boolean = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }
    if (!target || isNaN(target) || target <= 0) {
      setCount(target || 0);
      return;
    }

    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * eased);
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, duration, delay, start]);

  return count;
};

interface HomePageProps {
  onSearch: (city: string, specialty: string) => void;
  onSelectArtisan: (id: string) => void;
  onSelectCategory: (cat: string) => void;
  onViewAllAnnonces?: () => void;
}

export const HomePage = ({
  onSearch,
  onSelectArtisan,
  onSelectCategory,
  onViewAllAnnonces
}: HomePageProps) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // State variables for dynamic data
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [statistics, setStatistics] = useState({
    artisans: 0,      // total certified artisans on platform
    cities: 0,        // total cities covered
    clients: 0,       // total registered clients
  });
  
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // State for comment form
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  // Optional: store fetched comments (not displayed yet)
  const [comments, setComments] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [testimonialsPaused, setTestimonialsPaused] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');

  // Animated count-up values for hero stats
  const animatedArtisans = useCountUp(statistics.artisans, 2500, 0, statsVisible);
  const animatedCities = useCountUp(statistics.cities, 2000, 200, statsVisible);
  const animatedClients = useCountUp(statistics.clients, 2200, 400, statsVisible);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesData = await api.getCities().catch(() => []);
        const categoriesData = await api.getCategories().catch(() => []);
        const artisansData = await api.getArtisans().catch(() => []);
        const announcementsData = await api.getAnnouncements().catch(() => []);
        const commentsData = await api.getComments().catch(() => []);
        const publicStats = await api.getPublicStats().catch(() => ({
          artisans_count: 0,
          cities_count: 0,
          clients_count: 0,
        }));

        setCities(Array.isArray(citiesData) ? citiesData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setArtisans(Array.isArray(artisansData) ? artisansData : []);
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
        setComments(Array.isArray(commentsData) ? commentsData : []);

        const totalArtisans = Number(publicStats?.artisans_count) ||
          (Array.isArray(artisansData) ? artisansData.length : 0);

        const totalCities = Number(publicStats?.cities_count) ||
          (Array.isArray(citiesData) ? citiesData.length : 0);

        const totalClients = Number(publicStats?.clients_count) || 0;

        setStatistics({
          artisans: totalArtisans,
          cities: totalCities,
          clients: totalClients,
        });

      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedCity, selectedSpecialty);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem('auth_token')) {
      setShowAuthModal(true);
      return;
    }
    try {
      const newComment = await api.postComment({ body });
      // prepend new comment to list (if you later display them)
      setComments(prev => [newComment, ...prev]);
    } catch (err) {
      console.error('Error posting comment', err);
    }
    setBody('');
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await api.deleteClientComment(commentToDelete);
      setComments(comments.filter(c => c.id !== commentToDelete));
      setCommentToDelete(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  // Helper to render Category Icon dynamically
  const renderCategoryIcon = (iconName: string) => {
    const props = { size: 28, className: "text-[#603A2A] group-hover:text-[#CDB58E] stroke-[1.5] group-hover:scale-110 transition-all duration-300" };
    switch (iconName) {
      case 'Hammer': return <Hammer {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Droplet': return <Droplet {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      case 'Brush': return <Brush {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Wind': return <Wind {...props} />;
      default: return <Hammer {...props} />;
    }
  };

  // Only certified artisans for Section 2
  const certifiedArtisans = artisans.filter(a => a.isCertified);
  const duplicatedArtisans = [...certifiedArtisans, ...certifiedArtisans];

  // --- Auto-scroll and manual slider logic for certified artisans ---
  const sliderRef = useRef<HTMLDivElement>(null);
  const [halfScrollWidth, setHalfScrollWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(isHovered);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Technical requirements: useMotionValue and useAnimation
  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          } else {
            setStatsVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [statsRef.current]);

  useEffect(() => {
    if (sliderRef.current) {
      setHalfScrollWidth(sliderRef.current.scrollWidth / 2);
    }
  }, [certifiedArtisans]);

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        setHalfScrollWidth(sliderRef.current.scrollWidth / 2);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous loop animation
  useEffect(() => {
    let animationFrameId: number;

    const step = () => {
      if (!isHoveredRef.current && halfScrollWidth > 0) {
        const currentX = x.get();
        const nextX = currentX - 0.75; // Smooth continuous scroll
        if (nextX <= -halfScrollWidth) {
          x.set(0);
        } else {
          x.set(nextX);
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [halfScrollWidth]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Resume auto-scroll after a delay of 1 second
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 1000);
  };

  // Manual navigation buttons
  const scrollSlider = (direction: "left" | "right") => {
    handleMouseEnter(); // Pause auto-scroll immediately

    const currentX = x.get();
    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8;

    let targetX = direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    // Loop boundaries gracefully
    if (targetX > 0) {
      targetX = -halfScrollWidth + targetX;
    } else if (targetX < -halfScrollWidth) {
      targetX = targetX + halfScrollWidth;
    }

    animate(x, targetX, {
      type: "spring",
      stiffness: 120,
      damping: 20,
    });

    handleMouseLeave(); // Resume auto-scroll after 1 second delay
  };

  if (loading) { return <div className="flex justify-center items-center h-screen"><span className="text-[#603A2A]">Chargement...</span></div>; }

  return (
    <div className="w-full animate-fadeIn">

      {/* SECTION 1 : HERO */}
      <section className="relative bg-[#E8DCC8] text-[#F5EDE0] overflow-hidden border-b border-[#CDB58E]/10">

        {/* Subtle background grain texture / zellige background */}
        <div className="absolute inset-0 zellige-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Split layout — texte à gauche (60%) */}
            <div className="lg:col-span-7 z-10 space-y-4 text-center lg:text-left">
              <span className="inline-block px-3 py-1 bg-[#603A2A]/60 border border-[#CDB58E]/30 rounded-full text-xs font-badge tracking-wider text-[#2A1B15] uppercase">
                Artisanat Premium & Savoir-Faire d'Excellence
              </span>

              <h1 className="font-display text-4xl sm:text-5xl md:text-5xl font-bold text-[#2A1B15] leading-tight">
                Trouvez l'artisan qu'il vous faut,<br />près de chez vous
              </h1>

              <p className="font-sans text-[#8E887F] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                Connectez-vous instantanément avec des menuisiers, électriciens, plombiers et spécialistes marocains hautement qualifiés. Certifiés par l'État et évalués par vos pairs.
              </p>

              {/* Barre de recherche (montée ici) */}
              <div className="pt-4 w-full">
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-[#111B2F] p-3 rounded-xl sm:rounded-full shadow-2xl border border-[#CDB58E]/40 flex flex-col sm:flex-row items-center gap-3 w-full"
                >
                  <div className="flex items-center gap-2 px-3 w-full sm:w-auto sm:flex-1 border-b sm:border-b-0 sm:border-r border-[#8E887F]/30 pb-2 sm:pb-0">
                    <MapPin size={20} className="text-[#CDB58E] shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-[#F5EDE0] text-sm w-full focus:outline-none cursor-pointer py-1"
                    >
                      <option value="" className="bg-[#2A1B15] text-[#8E887F]">Toutes les Villes</option>
                      {cities.map(c => (
                        <option key={c} value={c} className="bg-[#2A1B15] text-[#F5EDE0]">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 px-3 w-full sm:w-auto sm:flex-1 pb-2 sm:pb-0">
                    <Search size={20} className="text-[#CDB58E] shrink-0" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="bg-transparent text-[#F5EDE0] text-sm w-full focus:outline-none cursor-pointer py-1"
                    >
                      <option value="" className="bg-[#2A1B15] text-[#8E887F]">Quel type d'artisan ?</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name} className="bg-[#2A1B15] text-[#F5EDE0]">{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 transition-all font-medium rounded-lg sm:rounded-full text-sm shrink-0 shadow flex items-center justify-center gap-2 border border-[#CDB58E]/20"
                  >
                    <span>Rechercher</span>
                    <ChevronRight size={16} className="text-[#CDB58E]" />
                  </button>
                </form>
              </div>
            </div>

            {/* Image floue artisan à droite avec overlay #603A2A à 40% d'opacité */}
            <div className="lg:col-span-5 relative flex justify-center hidden sm:flex">
              <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#CDB58E]/30">
                <img
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
                  alt="Artisan marocain travaillant le bois"
                  className="w-full h-full object-cover filter blur-[0.5px] scale-105"
                />
                {/* Overlay #603A2A à 40% d'opacité */}
                <div className="absolute inset-0 bg-[#603A2A] opacity-40 mix-blend-multiply" />
                {/* Decorative border frames */}
                <div className="absolute inset-3 border border-[#CDB58E]/40 rounded-xl pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#2A1B15]/90 backdrop-blur-sm p-4 rounded-xl border border-[#CDB58E]/30 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={16} className="text-[#CDB58E]" />
                    <span className="text-xs font-badge tracking-wider text-[#CDB58E] uppercase">Sceau d'Authenticité</span>
                  </div>
                  <p className="text-xs text-[#F5EDE0] italic font-subtitle">
                    "La rigueur de nos pères, sublimée par les exigences d'aujourd'hui."
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Stats rapides centrées en bas du hero (descendues ici) */}
          <div ref={statsRef} className="mt-8 relative z-20 max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-12 bg-[#111B2F]/5 p-4 rounded-2xl border border-[#CDB58E]/20 backdrop-blur-sm">
            <div className="text-center">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#111B2F] block">
                {animatedArtisans}+
              </span>
              <span className="text-sm text-[#8E887F] font-badge uppercase tracking-wider mt-1 block">
                Artisans Inscrits
              </span>
            </div>
            <div className="text-center border-l-0 sm:border-l border-[#8E887F]/20 pl-0 sm:pl-16">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#111B2F] block">
                {animatedCities}+
              </span>
              <span className="text-sm text-[#8E887F] font-badge uppercase tracking-wider mt-1 block">
                Villes Couvertes
              </span>
            </div>
            <div className="text-center border-l-0 sm:border-l border-[#8E887F]/20 pl-0 sm:pl-16">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#111B2F] block">
                {animatedClients}+
              </span>
              <span className="text-sm text-[#8E887F] font-badge uppercase tracking-wider mt-1 block">
                Clients Inscrits
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 : ARTISANS CERTIFIÉS - DRAGGABLE CARDS SLIDER */}
      <section id="ofppt-section" className="bg-[#F5EDE0] py-16 text-[#2A1B15] border-b border-[#CDB58E]/30 relative overflow-hidden">
        {/* Subtle background grain / zellige background */}
        <div className="absolute inset-0 zellige-pattern opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Titre section */}
          <div className="text-center max-w-3xl mx-auto mb-4">
            <div className="inline-flex items-center justify-center gap-2 bg-[#603A2A] text-[#CDB58E] px-4 py-1.5 rounded-full text-xs font-badge tracking-widest uppercase mb-3 shadow">
              <Award size={15} className="fill-[#CDB58E] text-[#603A2A]" />
              <span>Garantie de Qualification</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1B15] flex items-center justify-center gap-3 flex-wrap">
              <span>Artisans Certifiés</span>
            </h2>
            <p className="text-sm text-[#8E887F] font-sans mt-2">
              Découvrez nos lauréats des instituts spécialisés de l'OFPPT, arborant fièrement le badge de certification d'État pour une sécurité absolue sur vos chantiers.
            </p>
          </div>

          {/* Automatic Infinite Carousel */}
          <div className="w-full relative overflow-hidden py-2 group/slider">
            {/* Left and Right beautiful premium glassmorphism fades */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#F5EDE0] to-transparent md:w-32" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#F5EDE0] to-transparent md:w-32" />

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hidden md:block">
              <button
                onClick={() => scrollSlider("left")}
                className="h-12 w-12 rounded-full bg-[#fff8f0]/95 backdrop-blur-md border border-[#CDB58E]/40 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-95 text-[#603A2A] cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hidden md:block">
              <button
                onClick={() => scrollSlider("right")}
                className="h-12 w-12 rounded-full bg-[#fff8f0]/95 backdrop-blur-md border border-[#CDB58E]/40 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-95 text-[#603A2A] cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <motion.div
              ref={sliderRef}
              style={{ x }}
              className="flex gap-5 w-max transform-gpu"
            >
              {duplicatedArtisans.map((artisan, index) => (
                <motion.div
                  key={`${artisan.id}-${index}`}
                  className="min-w-[240px] sm:min-w-[260px] max-w-[260px] h-[310px]"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-[#CDB58E]/30 bg-[#fff8f0] shadow-md transition-all duration-500 hover:border-[#603A2A]/50 hover:shadow-2xl hover:shadow-[#603A2A]/10 flex flex-col justify-between">
                    {/* Image Section */}
                    <div className="relative h-36 overflow-hidden shrink-0">
                      <motion.img
                        src={artisan.coverPhoto}
                        alt={artisan.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B15]/90 via-[#2A1B15]/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-[#603A2A]/85 backdrop-blur-md border border-[#CDB58E]/30 text-[#CDB58E] text-[9px] font-badge tracking-wider uppercase px-2 py-0.5 rounded-full">
                          {artisan.specialty}
                        </span>
                      </div>

                      {/* Hover Overlay Action */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSelectArtisan(artisan.id)}
                          className="flex items-center gap-1.5 rounded-full bg-[#603A2A] px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-lg border border-[#CDB58E]/30"
                        >
                          Voir profil complet
                        </motion.button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3.5 sm:p-4 flex flex-col h-[calc(100%-9rem)] justify-between text-left">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-display font-bold leading-tight tracking-tight text-[#2A1B15] transition-colors group-hover:text-[#603A2A] line-clamp-1">
                          {artisan.name}
                        </h3>

                        {/* Note étoiles (#CDB58E) */}
                        <div className="flex items-center justify-start gap-1">
                          <div className="flex text-[#CDB58E]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={11}
                                className={i < Math.floor(artisan.rating) ? "fill-[#CDB58E] text-[#CDB58E]" : "opacity-30"}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#2A1B15]">{artisan.rating}</span>
                          <span className="text-[9px] text-[#8E887F]">({artisan.reviewCount} avis)</span>
                        </div>

                        <p className="line-clamp-2 text-[11px] text-[#8E887F] leading-snug font-sans mt-0.5">
                          {artisan.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-auto border-t border-[#8E887F]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden border border-[#CDB58E]/50 ring-2 ring-[#F5EDE0] shrink-0">
                            <img
                              src={artisan.avatar}
                              alt={artisan.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#2A1B15] leading-none">
                              {artisan.city}
                            </span>
                            <span className="text-[9px] text-[#8E887F] mt-1">
                              مهني معتمد
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[9px] font-medium text-[#603A2A] bg-[#F5EDE0] px-2 py-0.5 rounded-full">
                          <Clock className="h-2.5 w-2.5 text-[#603A2A]" />
                          <span>{artisan.experienceYears} ans exp.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 3 : CATÉGORIES D'ARTISANS */}
      <section className="bg-[#F5EDE0] py-8 md:py-10 text-[#2A1B15] border-b border-[#CDB58E]/30 relative overflow-hidden">
        {/* Subtle decorative zellige pattern overlay */}
        <div className="absolute inset-0 zellige-pattern opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Titre centré */}
          <div className="text-center mb-6">
            <span className="text-[10px] sm:text-xs font-badge tracking-widest text-[#8E887F] uppercase block mb-1">
              Expertise Ciblée
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2A1B15]">
              Explorez par Spécialité
            </h2>
            <div className="w-12 h-0.5 bg-[#603A2A] mx-auto mt-2" />
          </div>

          {/* Grille de catégories avec icône personnalisée */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group bg-white hover:bg-[#603A2A] p-4 rounded-xl border border-[#CDB58E]/30 hover:border-[#603A2A] transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5EDE0] group-hover:bg-[#2A1B15] flex items-center justify-center border border-[#CDB58E]/30 transition-colors">
                  <div className="scale-75 group-hover:text-white text-[#603A2A] transition-colors">
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                </div>
                <span className="font-sans font-medium text-xs sm:text-sm text-[#2A1B15] group-hover:text-white transition-colors block">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4 : COMMENT ÇA MARCHE */}
      <section className="bg-[#F5EDE0] py-16 text-[#2A1B15] border-b border-[#CDB58E]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#603A2A]">
              Comment ça marche ?
            </h2>
            <p className="text-sm text-[#8E887F] mt-2">
              Une démarche simplifiée et sécurisée pour concrétiser vos projets en toute confiance.
            </p>
          </div>

          {/* 4 étapes en timeline horizontale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">

            {/* Step 1 */}
            <div className="text-center relative p-4">
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#CDB58E]/40 hidden lg:block -z-0" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <Search className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                01
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Recherchez l'artisan
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Filtrez par ville, spécialité ou proximité immédiate par GPS.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative p-4">
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#CDB58E]/40 hidden lg:block -z-0" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <UserCheck className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                02
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Consultez le profil
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Vérifiez les certifications, le portfolio de réalisations et les avis clients réels.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative p-4">
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#CDB58E]/40 hidden lg:block -z-0" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <CalendarCheck className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                03
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Prenez rendez-vous
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Contactez directement le Maâlem par téléphone ou réservez un créneau sur son calendrier.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center relative p-4">
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <MessageSquareHeart className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                04
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Évaluez le service
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Contribuez à l'excellence en laissant une note et des commentaires constructifs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5 : ANNONCES & OFFRES D'EMPLOI */}
      <section id="annonces-section" className="bg-[#CDB58E] py-10 md:py-12 text-[#2A1B15] border-b border-[#603A2A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center text-center mb-10 gap-6">
            <div>
              <div className="flex items-center justify-center gap-2 text-[#603A2A] text-xs font-badge tracking-wider uppercase mb-1">
                <Briefcase size={14} />
                <span>Espace B2B & Recrutement Pro</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2A1B15]">
                Offres & Recrutement
              </h2>
              <p className="text-xs text-[#603A2A] mt-1 font-medium">
                Opportunités publiées par les entreprises du bâtiment et de l'artisanat marocain.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAnnouncementIndex(Math.max(0, announcementIndex - 1))}
                disabled={announcementIndex === 0}
                className="w-10 h-10 bg-[#2A1B15] text-[#CDB58E] hover:bg-[#2A1B15]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setAnnouncementIndex(Math.min(announcements.length - 3, announcementIndex + 1))}
                disabled={announcements.length <= 3 || announcementIndex >= announcements.length - 3}
                className="w-10 h-10 bg-[#2A1B15] text-[#CDB58E] hover:bg-[#2A1B15]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Announcements Grid */}
            <div className="w-full">
              {(!announcements || announcements.length === 0) ? (
                <div className="text-center py-12 text-[#603A2A] opacity-60">
                  <Briefcase size={40} className="mx-auto mb-3" />
                  <p className="font-sans text-sm">Aucune annonce disponible pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(announcements || []).slice(announcementIndex, announcementIndex + 3).map((ann) => (
                    <div
                      key={ann.id}
                      className="bg-[#09152e] rounded-2xl p-5 border border-[#8E887F]/20 hover:border-[#745b19]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-lg hover:shadow-xl cursor-pointer"
                      onClick={() => setSelectedAnnouncement(ann)}
                    >
                      <div>
                        <span className="inline-block px-3 py-1 bg-[#745b19] text-white text-[10px] font-bold tracking-wider uppercase rounded-full mb-3">
                          {ann.category || ann.specialty || 'Offre'}
                        </span>
                        <h3 className="font-sans font-bold text-base text-white line-clamp-1 mb-2 leading-tight">
                          {ann.company || ann.company_name || ''}
                        </h3>
                        <p className="text-sm text-[#745b19] font-semibold mb-3 flex items-center gap-1.5">
                          <Briefcase size={14} className="text-[#745b19]" /> {ann.title || ''}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-700/50 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-[#745b19]" />
                            {ann.city || ann.contact_address || ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {getRelativeDate(ann.created_at || ann.date || '')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedAnnouncement(ann); }}
                          className="w-full py-2.5 rounded-lg bg-[#745b19]/20 border border-[#745b19]/40 text-white font-semibold text-xs hover:bg-[#745b19] transition-colors duration-200"
                        >
                          Voir les détails →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button
                onClick={() => onViewAllAnnonces?.()}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#2A1B15] text-[#CDB58E] border border-[#745b19] rounded-full font-semibold text-sm hover:bg-[#745b19] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Voir toutes les offres
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION : PUBLIEZ VOTRE ANNONCE */}
      <section className="bg-[#F5EDE0] py-12 border-b border-[#CDB58E]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Title - same style as other sections */}
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-[#603A2A]/10 border border-[#603A2A]/30 rounded-full text-xs font-badge tracking-wider text-[#603A2A] uppercase mb-4">
              📢 Vous recrutez ?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1B15]">
              Publiez votre annonce
            </h2>
            <div className="w-12 h-0.5 bg-[#603A2A] mx-auto mt-2 mb-8" />
          </div>

          {/* Ticker bar */}
          <div className="rounded-xl overflow-hidden border border-[#5a4614]">
            <div className="bg-[#603A2A] h-[52px] flex items-center overflow-hidden whitespace-nowrap">
              <div className="marquee-ticker">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="inline-flex items-center">
                    <span className="mx-6 text-white text-[13px] font-semibold uppercase tracking-wide">
                      📢 PUBLIEZ VOTRE ANNONCE
                    </span>
                    <span className="text-[#CDB58E] mx-3">·</span>
                    <span className="text-white text-[13px] font-semibold uppercase tracking-wide mx-4">
                      Contactez l&apos;admin par email :
                    </span>
                    <a
                      href="mailto:admin@gmail.com"
                      className="text-[#CDB58E] font-bold text-[13px] uppercase tracking-wide mx-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      admin@gmail.com
                    </a>
                    <button
                      type="button"
                      title="Copier l'email"
                      className="ml-1 mr-2 p-1 rounded hover:bg-white/10 transition-colors text-[#CDB58E] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigator.clipboard.writeText('admin@gmail.com');
                        const btn = e.currentTarget;
                        btn.dataset.copied = 'true';
                        btn.querySelector('.icon-copy')?.classList.add('hidden');
                        btn.querySelector('.icon-check')?.classList.remove('hidden');
                        setTimeout(() => {
                          btn.dataset.copied = 'false';
                          btn.querySelector('.icon-copy')?.classList.remove('hidden');
                          btn.querySelector('.icon-check')?.classList.add('hidden');
                        }, 2000);
                      }}
                    >
                      <Copy size={13} className="icon-copy" />
                      <Check size={13} className="icon-check hidden text-green-400" />
                    </button>
                    <span className="text-[#CDB58E] mx-3">·</span>
                    <span className="text-white text-[13px] font-semibold uppercase tracking-wide mx-4">
                      Ou par téléphone :
                    </span>
                    <a
                      href="tel:+212622001122"
                      className="text-[#CDB58E] font-bold text-[13px] uppercase tracking-wide mx-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      +212 6 22 00 11 22
                    </a>
                    <button
                      type="button"
                      title="Copier le numéro"
                      className="ml-1 mr-2 p-1 rounded hover:bg-white/10 transition-colors text-[#CDB58E] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigator.clipboard.writeText('+212622001122');
                        const btn = e.currentTarget;
                        btn.querySelector('.icon-copy')?.classList.add('hidden');
                        btn.querySelector('.icon-check')?.classList.remove('hidden');
                        setTimeout(() => {
                          btn.querySelector('.icon-copy')?.classList.remove('hidden');
                          btn.querySelector('.icon-check')?.classList.add('hidden');
                        }, 2000);
                      }}
                    >
                      <Copy size={13} className="icon-copy" />
                      <Check size={13} className="icon-check hidden text-green-400" />
                    </button>
                    <span className="text-[#CDB58E] mx-3">·</span>
                    <span className="text-white text-[13px] font-semibold uppercase tracking-wide mx-6">
                      ANNONCE PUBLIÉE SOUS 24H
                    </span>
                    <span className="text-[#CDB58E] mx-3">·</span>
                    <span className="text-[#CDB58E] mx-3">·</span>
                    <span className="text-[#CDB58E] mx-3">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6 : TÉMOIGNAGES ANIMÉS */}
      <section className="bg-[#F5EDE0] py-16 text-[#2A1B15] border-t border-[#CDB58E]/20 overflow-hidden relative">
        {/* Decorative background zellige opacity */}

        <div className="absolute inset-0 zellige-pattern opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[#2A1B15]">
              La Voix de Nos Clients
            </h2>
            <p className="text-xs text-[#8E887F] mt-1 uppercase font-badge tracking-widest">
              Expériences authentiques certifiées
            </p>
            <div className="w-12 h-0.5 bg-[#CDB58E] mx-auto mt-2" />
          </div>

          {/* Grille de colonnes de témoignages défilants */}
          {(() => {
            const mappedComments = comments.map(c => ({
              id: c.id,
              user_id: c.user_id,
              text: c.body,
              name: c.user?.name || c.author || 'Client',
              role: c.user?.role === 'artisan' ? 'Artisan' : 'Client(e)',
              image: c.user?.avatar
                ? (c.user.avatar.startsWith('http') ? c.user.avatar : `http://localhost:8000/storage/${c.user.avatar}`)
                : null
            }));

            // On combine les vrais avis avec les avis de démonstration pour garder un design riche et fluide (3 colonnes)
            const combinedTestimonials = [...mappedComments, ...premiumTestimonials];

            const firstCol = combinedTestimonials.filter((_, i) => i % 3 === 0);
            const secondCol = combinedTestimonials.filter((_, i) => i % 3 === 1);
            const thirdCol = combinedTestimonials.filter((_, i) => i % 3 === 2);


            return (
              <div
                className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[420px] overflow-hidden"
                role="region"
                aria-label="Témoignages défilants"
              >
                <TestimonialsColumn testimonials={firstCol} duration={15} paused={testimonialsPaused} onPause={() => setTestimonialsPaused(true)} onResume={() => setTestimonialsPaused(false)} onDelete={setCommentToDelete} currentUserId={currentUser.id} />
                <TestimonialsColumn testimonials={secondCol} className="hidden md:block" duration={19} paused={testimonialsPaused} onPause={() => setTestimonialsPaused(true)} onResume={() => setTestimonialsPaused(false)} onDelete={setCommentToDelete} currentUserId={currentUser.id} />
                <TestimonialsColumn testimonials={thirdCol} className="hidden lg:block" duration={17} paused={testimonialsPaused} onPause={() => setTestimonialsPaused(true)} onResume={() => setTestimonialsPaused(false)} onDelete={setCommentToDelete} currentUserId={currentUser.id} />
              </div>
            );
          })()}

        </div>
      </section>

      {/* SECTION 7 : AJOUTER UN AVIS */}
      <section className="bg-[#F5EDE0] py-16 text-[#2A1B15] border-t border-[#CDB58E]/20 relative">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 zellige-pattern opacity-5 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#603A2A]/10 border border-[#603A2A]/30 rounded-full text-xs font-badge tracking-wider text-[#603A2A] uppercase mb-4">
              Votre opinion compte
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1B15] mb-2">
              Partagez votre avis
            </h2>
            <p className="text-sm text-[#603A2A] max-w-2xl mx-auto">
              Aidez-nous à améliorer continuellement l'expérience HandPro pour tous les utilisateurs.
            </p>
          </div>

          <div className="bg-[#CDB58E]/50 backdrop-blur-sm p-6 sm:p-10 rounded-2xl border border-[#CDB58E]/20 shadow-2xl">
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <MessageSquareHeart className="absolute top-4 left-4 text-[#CDB58E]/50" size={20} />
                <textarea
                  placeholder="Partagez votre expérience avec HandPro..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={4}
                  className="w-full bg-white text-[#2A1B15] placeholder-[#8E887F] border border-[#603A2A]/30 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#603A2A] focus:ring-1 focus:ring-[#603A2A] transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="self-center sm:self-end px-8 py-3 bg-[#603A2A] text-[#F5EDE0] hover:bg-[#CDB58E] hover:text-[#2A1B15] transition-all duration-300 font-bold rounded-full shadow-lg flex items-center gap-2 group"
              >
                <span>Ajouter Commentaire</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Auth Alert Modal */}
      <AuthAlertModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginClick={() => window.location.href = '/login'}
      />

      {/* Modal de confirmation de suppression de commentaire site */}
      {commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1B15]/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-[#CDB58E]/30 shadow-2xl relative text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <Trash2 className="text-rose-600" size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-[#2A1B15] mb-2">
              Supprimer le commentaire ?
            </h3>
            <p className="text-[#8E887F] text-sm mb-6">
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet avis du site ?
            </p>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setCommentToDelete(null)}
                className="flex-1 py-2.5 rounded-lg border border-[#8E887F]/30 text-[#8E887F] font-bold text-sm hover:bg-[#F5EDE0] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteComment}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors shadow-sm"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail d'annonce */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1B15]/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[520px] w-full shadow-2xl relative text-left flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#09152e] transition-colors text-2xl font-bold leading-none"
            >
              &times;
            </button>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#745b19] text-white text-[10px] font-bold tracking-wider uppercase rounded-full mb-3">
                {selectedAnnouncement.category}
              </span>
              <p className="text-2xl text-[#09152e] font-bold flex items-center gap-2">
                <Building2 size={22} className="text-[#745b19]" /> {selectedAnnouncement.company}
              </p>
            </div>

            {/* BODY (Scrollable if needed) */}
            <div className="overflow-y-auto pr-2 flex-1">
              <div className="mb-6">
                <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Titre de l'offre</p>
                <h3 className="font-sans font-bold text-xl text-[#09152e] leading-tight">
                  {selectedAnnouncement.title}
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Description</p>
                <p className="text-base text-gray-600 italic leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedAnnouncement.description}
                </p>
              </div>

              <hr className="border-gray-200 my-6" />

              {/* CONTACT SECTION */}
              <div className="bg-[#fdf8ee] rounded-xl p-4 mb-6">
                <h4 className="font-bold text-[#745b19] mb-4 flex items-center gap-2">
                  <ClipboardList size={16} className="text-[#745b19]" /> Informations de contact
                </h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><Mail size={12} className="text-[#745b19]" /> Email :</span>
                    <a href={`mailto:${selectedAnnouncement.email || 'contact@example.com'}`} className="text-[#745b19] hover:underline font-medium break-all">
                      {selectedAnnouncement.email || 'contact@example.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><Phone size={12} className="text-[#745b19]" /> Tél. :</span>
                    <a href={`tel:${selectedAnnouncement.phone || '+212600000000'}`} className="text-[#09152e] hover:underline font-medium">
                      {selectedAnnouncement.phone || '+212 6 00 00 00 00'}
                    </a>
                  </div>
                  {(selectedAnnouncement.address || selectedAnnouncement.city) && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><MapPin size={12} className="text-[#745b19]" /> Adresse :</span>
                      <span className="text-gray-600 flex-1">
                        {selectedAnnouncement.address || selectedAnnouncement.city}
                      </span>
                    </div>
                  )}
                  {selectedAnnouncement.website && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><Globe size={12} className="text-[#745b19]" /> Site web :</span>
                      <a href={selectedAnnouncement.website} target="_blank" rel="noopener noreferrer" className="text-[#745b19] hover:underline font-medium break-all">
                        {selectedAnnouncement.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <span className="text-sm text-gray-400 font-medium">
                Publié {getRelativeDate(selectedAnnouncement.created_at || selectedAnnouncement.date)}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-6 py-2.5 rounded-lg bg-[#09152e] text-white font-bold text-sm hover:bg-[#09152e]/90 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
