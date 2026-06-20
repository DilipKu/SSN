import { Navbar } from "../components/layout/Navbar";
import { Hero } from "../components/layout/Hero";
import { Footer } from "../components/layout/Footer";

// Homepage subcomponents
import { CategoryShowcase } from "../components/home/CategoryShowcase";
import { Bestsellers } from "../components/home/Bestsellers";
import { FestivalCampaigns } from "../components/home/FestivalCampaigns";
import { HeritageStory } from "../components/home/HeritageStory";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { CorporateGifting } from "../components/home/CorporateGifting";
import { Testimonials } from "../components/home/Testimonials";
import { SocialGallery } from "../components/home/SocialGallery";
import { AppDownload } from "../components/home/AppDownload";

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />

      <main className="flex-grow pb-16 lg:pb-0">
        <Hero />
        <CategoryShowcase />
        <Bestsellers />
        <FestivalCampaigns />
        <HeritageStory />
        <WhyChooseUs />
        <CorporateGifting />
        {/* <Testimonials /> */}
        {/* <SocialGallery /> */}
        {/* <AppDownload /> */}
      </main>

      <Footer />
    </div>
  );
};
