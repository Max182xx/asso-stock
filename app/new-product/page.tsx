"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { Category } from "@prisma/client";
import { FormDataType } from "@/type";
import { readCategories } from "../actions";

/**
 * Composant principal pour afficher et gérer les produits
 */
const page = () => {
  // Utilisation de Clerk pour obtenir les informations de l'utilisateur connecté
  const { user } = useUser();

  // Récupération de l'email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setpreviewUrl] = useState<string | null>(null);
  const [categories, setcategories] = useState<Category[]>([]);
  const [formData, setformData] = useState<FormDataType>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    unit: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (email) {
          const data = await readCategories(email);
          if (data) setcategories(data);
        }
      } catch (error) {
        console.error("Erreur lours du chargement des catégories", error);
      }
    };
    fetchCategories();
  }, [email]);

  return (
    <Wrapper>
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Créer un produit</h1>

          <section className="flex md:flex-row flex-col">
            <div className="space-y-4 md:w-[450px]">
              <input
                type="text"
                name="name"
                placeholder="Nom"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="description"
                className="textarea textarea-bordered w-full"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <input
                type="number"
                name="price"
                placeholder="Prix"
                className="input input-bordered w-full"
                value={formData.price}
                onChange={handleChange}
              />

              <select
                className="select select-bordered w-full"
                value={formData.categoryId}
                onChange={handleChange}
                name="categoryId"
              >
                <option value=""> Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full"
                value={formData.unit}
                onChange={handleChange}
                name="unit"
              >
                <option value="">Sélectionner l'unité</option>
                <option value="g">Gramme</option>
                <option value="kg">Kilogramme</option>
                <option value="l">Litre</option>
                <option value="m">Mètre</option>
                <option value="cm">Centimètre</option>
                <option value="h">Heure</option>
                <option value="pcs">Pièces</option>
              </select>

              <input
                type="file"
                accept="image/"
                placeholder="Prix"
                className="file-input file-input-bordered w-full"
                // onChange={handleChange}
              />

            </div>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
