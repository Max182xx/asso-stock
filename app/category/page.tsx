"use client";

// Importation des composants et des fonctions nécessaires
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import CategoryModal from "../components/CategoryModal";
import { createCategory, deleteCategory, readCategories, updateCategory } from "../actions";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { Category } from "@prisma/client";
import EmptyState from "../components/EmptyState";
import { Pencil, Trash } from "lucide-react";

/**
 * Composant principal pour afficher et gérer les catégories
 */
const page = () => {
  // Utilisation de Clerk pour obtenir les informations de l'utilisateur connecté
  const { user } = useUser();
  
  // Récupération de l'email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;

  // États pour gérer les champs de formulaire et les opérations
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * Charge les catégories pour l'utilisateur connecté
   */
  const loadCategories = async () => {
    if (email) {
      const data = await readCategories(email);
      if (data) setCategories(data);
    }
  };

  // Exécution initiale de loadCategories lors du montage du composant
  useEffect(() => {
    loadCategories();
  }, [email]);

  /**
   * Ouvre le modal de création/modification de catégorie
   */
  const openCreateModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.showModal();
  };

  /**
   * Ferme le modal de création/modification de catégorie
   */
  const closeModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.close();
  };

  /**
   * Crée une nouvelle catégorie
   */
  const handleCreateCategory = async () => {
    setLoading(true);
    if (email) {
      await createCategory(name, email, description);
    }
    await loadCategories();
    closeModal();
    setLoading(false);
    toast.success("Catégorie créée avec succès.");
  };

  /**
   * Met à jour une catégorie existante
   */
  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return;
    setLoading(true);
    if (email) {
      await updateCategory(editingCategoryId, email, name, description);
    }
    await loadCategories();
    closeModal();
    setLoading(false);
    toast.success("Catégorie mise à jour avec succès.");
  };

  /**
   * Ouvre le modal de modification d'une catégorie spécifique
   * @param {Category} category - La catégorie à modifier
   */
  const openEditModal = (category: Category) => {
    setName(category.name);
    setDescription(category.description || "");
    setEditMode(true);
    setEditingCategoryId(category.id);
    (document.getElementById("category_modal") as HTMLDialogElement)?.showModal();
  };

  /**
   * Supprime une catégorie
   * @param {string} categoryId - L'ID de la catégorie à supprimer
   */
  const handleDeleteCategory = async (categoryId: string) => {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer cette catégorie ? Tous les produits associés seront également supprimés");
    if (!confirmDelete) return;
    await deleteCategory(categoryId, email);
    await loadCategories();
    toast.success("Catégorie supprimée avec succès.");
  };

  return (
    <Wrapper>
      <div>
        {/* Bouton pour créer une nouvelle catégorie */}
        <div className="mb-4">
          <button className="btn btn-primary" onClick={openCreateModal}>
            Ajouter une catégorie
          </button>
        </div>

        {/* Affichage des catégories existantes */}
        {categories.length > 0 ? (
          <div>
            {categories.map((category) => (
              <div
                key={category.id}
                className="mb-2 p-5 border-base-200 rounded-3xl flex justify-between items-center"
              >
                <div>
                  <strong className="text-lg">{category.name}</strong>
                  <div className="text-sm">{category.description}</div>
                </div>

                <div className="flex gap-2">
                  {/* Icône pour modifier la catégorie */}
                  <button
                    className="btn btn-sm"
                    onClick={() => openEditModal(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Icône pour supprimer la catégorie */}
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="Aucune catégorie disponible"
            IconComponent="Group"
          />
        )}
      </div>

      {/* Modal pour créer/mettre à jour une catégorie */}
      <CategoryModal
        name={name}
        description={description}
        loading={loading}
        onclose={closeModal}
        onChangeName={setName}
        onChangeDescription={setDescription}
        onSubmit={editMode ? handleUpdateCategory : handleCreateCategory}
        editMode={editMode}
      />
    </Wrapper>
  );
};

export default page;