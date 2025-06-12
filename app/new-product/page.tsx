"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { Category } from "@prisma/client";
import { FormDataType } from "@/type";
import { createPoduct, readCategories } from "../actions";
import { FileImage } from "lucide-react";
import ProductImage from "../components/ProductImage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const page = () => {
  // Utilisation de Clerk pour obtenir les informations de l'utilisateur connecté
  const { user } = useUser();

  // Récupération de l'email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const router = useRouter();

  // États pour stocker les données du formulaire et l'image prévisualisée
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setpreviewUrl] = useState<string | null>(null);
  const [categories, setcategories] = useState<Category[]>([]);
  const [formData, setformData] = useState<FormDataType>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    unit: "",
    imageUrl: "",
  });

  // Fonction pour mettre à jour les valeurs du formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  // Fonction pour charger les catégories disponibles
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

  // Fonction pour gérer la sélection d'une image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slectedFile = e.target.files?.[0] || null;
    setFile(slectedFile);
    if (slectedFile) {
      setpreviewUrl(URL.createObjectURL(slectedFile));
    }
  };

  // Fonction pour soumettre le formulaire et créer un nouvel article
  const handleSumit = async () => {
    // Vérification si une image a été sélectionnée
    if (!file) {
      toast.error("Veuillez sélectionner une image.");
      return;
    }
    try {
      // Création d'un nouveau FormData pour envoyer l'image
      const imageData = new FormData();
      imageData.append("file", file);

      // Envoi de la requête POST à l'API d'upload
      const res = await fetch("/api/upload", {
        method: "POST",
        body: imageData,
      });

      // Récupération de la réponse JSON
      const data = await res.json();

      // Vérification du succès de l'upload
      if (!data.success) {
        throw new Error("Erreur lors de l'upload de l'image.");
      }

      // Ajout de l'image dans le formData
      formData.imageUrl = data.path;

      // Création du produit
      await createPoduct(formData, email);

      toast.success("Produit créé avec succès");
      router.push("/products");
    } catch (error) {
      console.log(error);
      toast.error("Il y a une erreur");
    }
  };

  return (
    <Wrapper>
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Créer un produit</h1>

          <section className="flex md:flex-row flex-col">
            <div className="space-y-4 md:w-[450px]">
              {/* Formulaire pour entrer les détails du produit */}
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

              {/* Sélection de la catégorie */}
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

              {/* Sélection de l'unité */}
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

              {/* Sélection de l'image */}
              <input
                type="file"
                accept="image/"
                placeholder="Prix"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />

              {/* Bouton pour soumettre le formulaire */}
              <button onClick={handleSumit} className="btn btn-primary">
                Créer le produit
              </button>
            </div>

            {/* Affichage de la prévisualisation de l'image */}
            <div className="md:ml-4 md:w-[300px] mt-4 md:mt-0 border-2 border-primary md:h-[300px] p-5 flex justify-center items-center rounded-3xl">
              {previewUrl && previewUrl !== "" ? (
                <div>
                  <ProductImage
                    src={previewUrl}
                    alt="preview"
                    heightClass="h-40"
                    widthClass="w-40"
                  />
                </div>
              ) : (
                <div className="wiggle-animation">
                  <FileImage
                    strokeWidth={1}
                    className="h-10 w-10 text-primary"
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
