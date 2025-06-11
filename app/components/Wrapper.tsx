import React from "react";
import { ToastContainer } from "react-toastify";
import NavBar from "./NavBar";

// Définition de l'interface des props pour le composant Wrapper
type WrapperProps = {
  children: React.ReactNode;
};

/**
 * Composant conteneur central qui encapsule tout le contenu de l'application
 * Il inclut un menu de navigation et un conteneur de notifications
 * @param {WrapperProps} props - Les propriétés du composant
 * @returns {JSX.Element} Le JSX à afficher
 */
const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Menu de navigation */}
      <NavBar />

      {/* Conteneur de notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* Zone principale pour afficher le contenu */}
      <div className="px-5 md:px-[10%] mt-8 mb-10">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;