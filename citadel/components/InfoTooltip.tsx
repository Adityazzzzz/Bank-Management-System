import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const InfoTooltip = ({ content }: { content: string }) => {
    return (
        <div className="group relative flex items-center justify-center">
            <Info size={16} className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors" />
            
            <div className="absolute bottom-full mb-2 hidden w-64 flex-col gap-1 rounded-lg bg-blue-100 p-3 text-xs text-white shadow-xl group-hover:flex z-50">
                <span className="font-semibold text-blue-700 uppercase tracking-wider mb-1">How to use</span>
                <p className="leading-relaxed text-blue-500">{content}</p>
            </div>
        </div>
    );
};

export default InfoTooltip;