
import { Play } from "lucide-react";

interface NFTCardProps {
  title: string;
  artist: string;
  image: string;
  price: string;
  onPlay: () => void;
}

const NFTCard = ({ title, artist, image, price, onPlay }: NFTCardProps) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover-translate">
      <div className="relative aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onPlay}
          className="absolute bottom-4 right-4 p-4 rounded-full bg-primary hover:bg-primary-hover 
                     transition-all duration-300 text-white shadow-lg"
        >
          <Play className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">{artist}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{price} SOL</span>
          <button className="premium-button px-4 py-2 text-sm">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
