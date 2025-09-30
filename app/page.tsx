import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import Benefits from '@/components/sections/benefits';
import Hook from '@/components/sections/hook';
import Story from '@/components/sections/story';
import ProductsHome from '@/components/sections/products-home';
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
        <Offer />
      </main>
      <Footer />
    </>
  );
}