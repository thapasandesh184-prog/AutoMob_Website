import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale } from 'lucide-react';

export default function CompareBar({ vehicles, onRemove, onClear }) {
  if (vehicles.length < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 text-white">
              <Scale className="w-5 h-5 text-[#C0A66A]" />
              <span className="font-medium">Compare</span>
              <span className="text-white/50 text-sm">({vehicles.length}/3)</span>
            </div>

            <div className="flex-1 flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center gap-3 bg-black/40 border border-white/10 pl-2 pr-3 py-2 flex-shrink-0">
                  <div className="relative w-10 h-10 overflow-hidden flex-shrink-0">
                    <img
                      src={vehicle.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate max-w-[140px] sm:max-w-[180px]">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(vehicle.id)}
                    className="p-1 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label={`Remove ${vehicle.make} ${vehicle.model} from compare`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClear}
                className="text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 text-sm transition-colors"
              >
                Clear All
              </button>
              <Link to="/compare" className="flex-1 sm:flex-initial">
                <button className="w-full px-4 py-2 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] text-sm transition-colors">
                  Compare
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
