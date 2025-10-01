import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import Benefits from '@/components/sections/benefits';
import Hook from '@/components/sections/hook';
import Story from '@/components/sections/story';
import ProductsHome from '@/components/sections/products-home';
import Reviews from '@/components/sections/reviews';
import Offer from '@/components/sections/offer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
        <Benefits />
        <Hook />
        <Story />
        <ProductsHome />
        <Reviews />
        <Offer />
      </main>
      <Footer />
    </>
  );
}