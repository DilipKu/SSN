import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { WeddingRole } from '@/src/types';
import { ProductService } from '@/src/services/ProductService';
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const ROLES = [
  { id: 'Bride', name: 'Bride', image: 'https://images.pexels.com/photos/11729317/pexels-photo-11729317.jpeg' },
  { id: 'Bridesmaid', name: 'Bridesmaid', image: 'https://images.pexels.com/photos/11205707/pexels-photo-11205707.jpeg' },
  { id: 'Family', name: 'Family', image: 'https://images.pexels.com/photos/35259282/pexels-photo-35259282.jpeg' },
  { id: 'Guest', name: 'Guest', image: 'https://images.pexels.com/photos/30155163/pexels-photo-30155163.jpeg' },
];


export default function WeddingExperienceEngine({ title = 'The Wedding Experience Engine' }: { title?: string }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [occasions, setOccasions] = useState<any[]>([]);

  // Fetch occasions from API
  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const data = await ProductService.getOccasions();
        const transformedData = data.map((occ) => ({
          id: occ.name,
          name: occ.name,
          image: occ.image_url,
        }));
        setOccasions(transformedData);
      } catch (error) {
        console.error('Error loading occasions:', error);
        setOccasions([]);
      }
    };
    fetchOccasions();
  }, []);

  const handleSearch = () => {
    if (!selectedRole || !selectedOccasion) return;
    setIsSearching(true);

    // Navigate with distinct filters for the curated experience
    const searchParams = new URLSearchParams();
    searchParams.set('role', selectedRole);
    searchParams.set('occasion', selectedOccasion);

    setTimeout(() => {
      navigate(`/styling-result?${searchParams.toString()}`);
      setIsSearching(false);
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && selectedRole) setStep(2);
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
  };

  return (
    <section className="section-padding bg-[#FDF8F1] overflow-hidden">
      <div className="global-container">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header - PERF FIX: Consolidated 3 separate whileInView animations
             into 1 wrapper. Fewer IntersectionObserver instances = less scroll overhead. */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-secondary font-medium tracking-[0.4em] uppercase text-[10px] block">
              Personalized Styling
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto font-light leading-relaxed">
              Tell us your role and the occasion, and we'll curate a collection of outfits that perfectly capture your Kirdaar.
            </p>
          </motion.div>

          {/* Experience Engine Card */}
          <div className="relative bg-white border border-[#E5D5D5] shadow-[0_20px_50px_rgba(128,0,0,0.05)] rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-muted/30">
              <motion.div
                className="h-full bg-secondary"
                initial={{ width: "0%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.6, ease: "circOut" }}
              />
            </div>

            <div className="p-8 md:p-12 flex-grow flex flex-col">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-10 flex-grow"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-serif text-primary">What is your role in the celebration?</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {ROLES.map((role) => (
                        <RoleCard
                          key={role.id}
                          role={role}
                          isSelected={selectedRole === role.id}
                          onClick={() => setSelectedRole(role.id)}
                          isDimmed={selectedRole !== null && selectedRole !== role.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-10 flex-grow"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-serif text-primary">Which occasion are you attending?</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
                      {occasions.map((occ) => (
                        <OccasionCard
                          key={occ.id}
                          occasion={occ}
                          isSelected={selectedOccasion === occ.id}
                          onClick={() => setSelectedOccasion(occ.id)}
                          isDimmed={selectedOccasion !== null && selectedOccasion !== occ.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Footer */}
              <div className="mt-12 pt-8 border-t border-muted flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="order-2 md:order-1">
                  {step === 2 && (
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                  )}
                </div>

                <div className="order-1 md:order-2 w-full md:w-auto">
                  {step === 1 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!selectedRole}
                      className="w-full md:w-auto bg-primary hover:bg-secondary text-white px-10 h-14 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl transition-all duration-500 disabled:opacity-50 disabled:grayscale"
                    >
                      Next Step <ArrowRight className="ml-3 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSearch}
                      disabled={!selectedOccasion || isSearching}
                      className="w-full md:w-auto bg-secondary hover:bg-primary text-white px-12 h-14 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl transition-all duration-500 disabled:opacity-50 group"
                    >
                      {isSearching ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin" /> Curating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Find My Look <Sparkles className="ml-2 h-4 w-4 group-hover:scale-125 transition-transform" />
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleCard({ role, isSelected, onClick, isDimmed }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative aspect-[4/5] rounded-[40px] overflow-hidden border-2 transition-[border-color,opacity,filter] duration-500 group",
        isSelected ? "border-secondary scale-[1.03] z-10 shadow-2xl" : "border-transparent",
        isDimmed && "opacity-60 grayscale-[0.3]"
      )}
    >
      <img
        src={role.image}
        alt={role.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isSelected ? "bg-primary/40" : "bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90"
      )} />

      {/* Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white z-20"
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </motion.div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-6 pb-8">
        <span className="text-xl md:text-2xl font-serif tracking-wide">{role.name}</span>
        {isSelected && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "20px" }}
            className="h-[1px] bg-white mt-2"
          />
        )}
      </div>
    </motion.button>
  );
}

function OccasionCard({ occasion, isSelected, onClick, isDimmed }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative aspect-[4/5] rounded-[40px] overflow-hidden border-2 transition-[border-color,opacity,filter] duration-500 group",
        isSelected ? "border-secondary scale-[1.03] z-10 shadow-2xl" : "border-transparent",
        isDimmed && "opacity-60 grayscale-[0.3]"
      )}
    >
      <img
        src={occasion.image}
        alt={occasion.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isSelected ? "bg-secondary/40" : "bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90"
      )} />

      {/* Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center text-secondary z-20"
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </motion.div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-6 pb-8">
        <span className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-center">{occasion.name}</span>
      </div>
    </motion.button>
  );
}