"use client";
import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import CategoryModal from "../components/CategoryModal";
import { createCategory, updateCategory } from "../actions";
import { toast } from "react-toastify";
import { useUser } from '@clerk/nextjs'

const page = () => {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

   const openCreateModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
  }

  const closeModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.close()
  }

  const handleCreateCategory = async () => {
    setLoading(true)
    if (email) {
      await createCategory(name, email, description)
    }
    closeModal()
    setLoading(false)
    toast.success("Catégorie créée avec succès.")
  }

  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return
    setLoading(true)
    if (email) {
      await updateCategory(editingCategoryId, email, name, description)
    }
    closeModal()
    setLoading(false)
    toast.success("Catégorie mise à jour avec succès.")
  }
  return (
    <Wrapper>
      <div>
        <div className="mb-4 ">
          <button className="btn bnt-primary" onClick={openCreateModal}>
            Ajouter une catégorie
          </button>
        </div>
      </div>

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
