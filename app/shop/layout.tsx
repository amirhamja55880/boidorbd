import { ShopProvider } from '../context/ShopContext';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ShopProvider>
  );
}
