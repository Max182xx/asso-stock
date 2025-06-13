import { UserButton, useUser } from "@clerk/nextjs";
import { ListTree, Menu, PackagePlus, ShoppingBasket, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { checkAndAddAssociation } from "../actions";

// Définir le composant NavBar fonctionnel
const NavBar = () => {
  const { user } = useUser();
  // Utiliser l'état pour gérer l'ouverture du menu Burger
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Définir les liens de navigation
  const navLinks = [
    { href: "/products", label: "Produits", icon: ShoppingBasket },
    { href: "/new-product", label: "Nouveau produit", icon: PackagePlus },
    { href: "/category", label: "Catégories", icon: ListTree }
  ];

  // Déclenche checkAndAddAssociation lorsque l'utilisateur est connecté et possède un email et un nom complet.
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddAssociation(
        user?.primaryEmailAddress?.emailAddress,
        user.fullName
      );
    }
  }, [user]);

  // Fonction pour rendre les liens de navigation
  const renderLinks = (baseClass: string) => (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        const activeClass = isActive ? "btn-primary" : "btn-gost";

        return (
          <Link
            href={href}
            key={href}
            className={`${baseClass} ${activeClass}btn-sm flex gap-2 items-center`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    // Structure JSX du composant NavBar
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-2">
            <PackagePlus className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl">AssoStock</span>
        </div>

        {/* Bouton pour ouvrir/cacher le menu Burger */}
        <button
          className="btn w-fit sm:hidden btn-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/*Liens de navigation pour les écrans larges*/}
        <div className="hidden space-x-2 sm:flex items-center">
          {renderLinks("btn")}
          <UserButton />
        </div>

        {/* Conteneur du menu Burger */}
        <div
          className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden z-50 ${
            menuOpen ? "left-0" : "left-full"
          }`}
        >
          <div className="flex justify-between">
            <UserButton />
            <button
              className="btn w-fit sm:hidden btn-sm"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {renderLinks("btn")}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
