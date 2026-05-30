import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductService } from "@/src/services/ProductService";
import { Product } from "@/src/types";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/button";
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  ChevronRight,
  ChevronLeft,
  Info,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Loader2,
  Plus,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Separator } from "@/src/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { ZoomIn, Search } from "lucide-react";
import ProductCard from "@/src/components/luxury/ProductCard";
import { toast } from "sonner";
import { useCart } from "@/src/contexts/CartContext";
import { useWishlist } from "@/src/contexts/WishlistContext";

const isVideo = (url: string) => /\.(mp4|webm|mov|mkv)$/i.test(url);

const ImageZoom = ({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-zoom-in group/zoom"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-200 ease-out ${isHovered ? "scale-[2.5]" : "scale-100"}`}
        style={
          isHovered
            ? {
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }
            : undefined
        }
        referrerPolicy="no-referrer"
      />
      {!isHovered && (
        <div className="absolute bottom-4 right-4 bg-white/95 shadow-sm p-2 rounded-full opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300">
          <Search className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
};

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const displayImages = useMemo(() => {
    if (!product) return [];
    
    let filtered: string[] = [];
    if (selectedColor) {
      const colorEncoded = encodeURIComponent(selectedColor);
      filtered = product.images.filter(img => 
        img.toLowerCase().includes(`_color_${colorEncoded.toLowerCase()}.`)
      );
    }
    
    if (filtered.length === 0) {
      filtered = product.images.filter(img => !img.includes('_color_'));
    }
    
    if (filtered.length === 0) {
      filtered = product.images;
    }
    
    return filtered;
  }, [product, selectedColor]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor, product]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await ProductService.getProduct(id);
        setProduct(data);

        // Fetch related products
        const related = await ProductService.getProducts({
          category: data.category,
        });
        setRelatedProducts(related.filter((p) => p.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  // Safeguard: Ensure quantity never exceeds stock
  useEffect(() => {
    if (product && product.stock > 0 && quantity > product.stock) {
      setQuantity(product.stock);
    } else if (product && product.stock === 0 && quantity !== 0) {
      setQuantity(0);
    }
  }, [product?.stock, quantity]);

  const handleAddToCart = () => {
    if (!product) return;
    if (
      !selectedSize &&
      product.sizes.length > 0 &&
      product.sizes[0] !== "Free Size"
    ) {
      toast.error("Please select a size");
      return;
    }
    addToCart(
      product,
      quantity,
      selectedSize || undefined,
      selectedColor || undefined,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
        <p className="text-sm font-serif italic text-muted-foreground uppercase tracking-widest">
          Unveiling the Masterpiece...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h2 className="text-3xl font-serif text-primary mb-6">
          Kirdaar Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The exquisite piece you're looking for might have been moved or is no
          longer available.
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 text-white px-10 h-14 rounded-none">
            Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="global-container pt-24">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-bold py-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to={`/category/${product.category.toLowerCase()}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="global-container section-padding">
        <div className="grid grid-cols-12 inner-spacing-md items-start">
          {/* Image Gallery */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted group">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        {isVideo(displayImages[selectedImage]) ? (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <video
                              src={displayImages[selectedImage]}
                              className="w-full h-full object-contain"
                              controls
                              autoPlay
                              muted
                              loop
                            />
                          </div>
                        ) : (
                          <ImageZoom
                            src={displayImages[selectedImage]}
                            alt={product.name}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
                  <DialogTitle className="sr-only">
                    Product Image Zoom
                  </DialogTitle>
                  <div className="relative w-full h-full flex items-center justify-center">
                    {isVideo(displayImages[selectedImage]) ? (
                      <video
                        src={displayImages[selectedImage]}
                        className="max-w-full max-h-[90vh] shadow-2xl"
                        controls
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={displayImages[selectedImage]}
                        alt={product.name}
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-black/40 border-none text-white hover:bg-black/60 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage((prev) =>
                            prev > 0 ? prev - 1 : displayImages.length - 1,
                          );
                        }}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-black/40 border-none text-white hover:bg-black/60 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage((prev) =>
                            prev < displayImages.length - 1 ? prev + 1 : 0,
                          );
                        }}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Image Navigation Arrows - Hidden on hover zoom to avoid interference */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-10 w-10 shadow-lg pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) =>
                      prev > 0 ? prev - 1 : displayImages.length - 1,
                    );
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-10 w-10 shadow-lg pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) =>
                      prev < displayImages.length - 1 ? prev + 1 : 0,
                    );
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-24 aspect-[3/4] overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {isVideo(img) ? (
                    <div className="relative h-full w-full bg-slate-900 flex items-center justify-center">
                      <video
                        src={img}
                        className="h-full w-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-span-12 lg:col-span-6 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-[0.3em] font-bold text-secondary">
                    {product.category}
                  </span>
                  <div className="flex gap-2">
                    {product.isNewArrival && (
                      <Badge className="bg-[#B4846C] text-white border-none rounded-none text-[8px] uppercase tracking-widest px-2 py-0.5">
                        New Arrival
                      </Badge>
                    )}
                    {product.isBestSeller && (
                      <Badge className="bg-primary text-white border-none rounded-none text-[8px] uppercase tracking-widest px-2 py-0.5">
                        Best Seller
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-secondary">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewsCount} Reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through italic">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 rounded-none px-3 py-1 font-bold"
                  >
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    % OFF
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Storytelling Section */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs text-secondary">
                The Story of this Kirdaar
              </h4>
              <p className="text-lg text-muted-foreground leading-relaxed font-light italic">
                "{product.story}"
              </p>
            </div>

            {/* Selection Options */}
            <div className="space-y-8">
              {/* Size Selection */}
              {product.sizes.length > 0 && product.sizes[0] !== "Free Size" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold uppercase tracking-widest text-xs text-secondary">
                      Select Size
                    </h4>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Info className="h-3 w-3" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[50px] h-12 flex items-center justify-center border transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-muted hover:border-primary/50 text-muted-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold uppercase tracking-widest text-xs text-secondary">
                    Select Color
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 h-12 flex items-center justify-center border transition-all ${
                          selectedColor === color
                            ? "border-primary bg-primary text-white"
                            : "border-muted hover:border-primary/50 text-muted-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center border border-muted h-16 px-4">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-muted-foreground hover:text-primary"
                    disabled={product.stock === 0}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">
                    {product.stock === 0 ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (product.stock !== null && quantity >= product.stock) {
                        toast.error(
                          `Apologies, only ${product.stock} units of this masterpiece are available.`,
                        );
                        return;
                      }
                      setQuantity((prev) => prev + 1);
                    }}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-grow bg-primary hover:bg-primary/90 text-white h-16 text-lg rounded-none shadow-xl disabled:bg-muted disabled:text-muted-foreground"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Collection"}
                </Button>
                <Button
                  onClick={() => toggleWishlist(product.id)}
                  variant="outline"
                  className={`h-16 w-16 border-muted hover:border-primary hover:text-primary rounded-none transition-colors ${
                    isInWishlist(product.id)
                      ? "bg-secondary/10 border-secondary text-secondary"
                      : ""
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 ${isInWishlist(product.id) ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-muted">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="h-6 w-6 text-secondary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Authentic Luxury
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-6 w-6 text-secondary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Global Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="h-6 w-6 text-secondary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Easy Returns
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <MessageCircle className="h-6 w-6 text-secondary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  24/7 Concierge
                </span>
              </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-muted p-0 h-auto">
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 uppercase tracking-widest text-xs font-bold"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="craftsmanship"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 uppercase tracking-widest text-xs font-bold"
                >
                  Craftsmanship
                </TabsTrigger>
                <TabsTrigger
                  value="styling"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 uppercase tracking-widest text-xs font-bold"
                >
                  Styling Tips
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="py-8 space-y-4">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Fabric
                  </span>
                  <span className="font-medium">{product.fabric}</span>
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Occasion
                  </span>
                  <span className="font-medium">
                    {product.occasion.join(", ")}
                  </span>
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Stock
                  </span>
                  <span className="font-medium">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed pt-4">
                  {product.description}
                </p>
              </TabsContent>
              <TabsContent value="craftsmanship" className="py-8">
                <p className="text-muted-foreground leading-relaxed italic">
                  {product.craftsmanship ||
                    "This piece is a testament to India's rich textile heritage, meticulously crafted by master artisans using traditional techniques passed down through generations."}
                </p>
              </TabsContent>
              <TabsContent value="styling" className="py-8">
                <ul className="space-y-4">
                  {(
                    product.stylingTips || [
                      "Pair with statement gold jewelry for a regal look.",
                      "Choose a contrasting clutch to add a modern touch.",
                      "Opt for a sleek bun to highlight the intricate neckline.",
                    ]
                  ).map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <section className="section-padding">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif text-primary">
              Complete Your Wedding Wardrobe
            </h2>
            <Link
              to={`/category/${product.category.toLowerCase()}`}
              className="text-primary hover:text-secondary transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2"
            >
              View Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 inner-spacing-sm">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-muted p-4 z-50 flex gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <Button
          onClick={() => toggleWishlist(product.id)}
          variant="outline"
          className={`h-14 w-14 rounded-none border-muted ${
            isInWishlist(product.id)
              ? "bg-secondary/10 border-secondary text-secondary"
              : ""
          }`}
        >
          <Heart
            className={`h-6 w-6 ${isInWishlist(product.id) ? "fill-current" : ""}`}
          />
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-grow bg-primary hover:bg-primary/90 text-white h-14 rounded-none font-bold uppercase tracking-widest text-xs disabled:bg-muted disabled:text-muted-foreground"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Collection"}
        </Button>
      </div>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
