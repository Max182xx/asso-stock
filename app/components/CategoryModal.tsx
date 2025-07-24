import React from "react";

// Définition de l'interface des props pour le composant CategoryModal
interface Props {
  name: string;
  description: string;
  loading: boolean;
  onClose: () => void;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onSubmit: () => void;
  editMode?: boolean;
}

/**
 * Composant modal pour créer ou modifier une catégorie
 * @param {Props} props - Les propriétés du composant
 * @returns {JSX.Element} Le JSX à afficher dans le modal
 */
const CategoryModal: React.FC<Props> = ({
  name,
  description,
  loading,
  onClose,
  onChangeDescription,
  onChangeName,
  editMode,
  onSubmit,
}) => {
  return (
    <dialog id="category_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* Bouton pour fermer le modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mb-4">
          {editMode ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </h3>

        {/* Champ de texte pour le nom de la catégorie */}
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        {/* Champ de texte pour la description */}
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        {/* Bouton d'envoi avec gestion du chargement */}
        <button
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading
            ? editMode
              ? "Modification..."
              : "Ajout..."
            : editMode
            ? "Modifier"
            : "Ajouter"}
        </button>
      </div>
    </dialog>
  );
};

export default CategoryModal;
