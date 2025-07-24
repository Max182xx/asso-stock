import React, { FC } from "react";
import { icons } from "lucide-react";

// Définition de l'interface des props pour le composant EmptyState
interface EmptyStateProps {
  IconComponent: keyof typeof icons;
  message: string;
}

/**
 * Composant d'État vide pour afficher un message avec une icône
 * @param {EmptyStateProps} props - Les propriétés du composant
 * @returns {JSX.Element} Le JSX à afficher
 */
const EmptyState: FC<EmptyStateProps> = ({ IconComponent, message }) => {
  // Sélection de l'icône basée sur la propriété IconComponent
  const SelectedIcon = icons[IconComponent];

  return (
    <div className="w-full h-full my-20 flex justify-center items-center flex-col">
      <div className="wiggle-animation">
        {" "}
        {/* Espace vide pour le effet d'animation */}
        <SelectedIcon strokeWidth={1} className="w-30 h-30 text-primary" />
        {/* Affichage du message */}
        <p className="text-sm ">{message}</p>
      </div>
    </div>
  );
};

export default EmptyState;
