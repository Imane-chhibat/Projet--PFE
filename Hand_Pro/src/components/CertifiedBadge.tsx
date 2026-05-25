import { Award } from 'lucide-react';

interface CertifiedBadgeProps {
  className?: string;
  compact?: boolean;
}

export const CertifiedBadge = ({ className = '', compact = false }: CertifiedBadgeProps) => {
  return (
    <div 
      className={`inline-flex items-center gap-1.5 bg-[#603A2A] text-[#CDB58E] font-badge tracking-wide rounded px-2.5 py-1 text-xs shadow-sm border border-[#CDB58E]/30 select-none ${className}`}
      title="Diplômé de centre de formation professionnelle agréé (OFPPT)"
    >
      <Award size={14} className="text-[#CDB58E] shrink-0" />
      <span className="font-semibold uppercase text-[11px]">
        {compact ? 'OFPPT' : 'مهني معتمد • OFPPT'}
      </span>
    </div>
  );
};
