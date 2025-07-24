"use client";
import { readProductById, updateProduct } from "@/app/actions";
import ProductImage from "@/app/components/ProductImage";
import Wrapper from "@/app/components/Wrapper";
import { FormDataType, Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import { FileImage } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = ({ params }: { params: Promise<{ productId: string }> }) => {
  const { user } = useUser(); // Récupère l'utilisateur connecté
  const email = user?.primaryEmailAddress?.emailAddress as string; // Obtient l'email de l'utilisateur
  const [product, setProduct] = useState<Product | null>(null); // État pour stocker le produit
  const [file, setFile] = useState<File | null>(null); // État pour stocker le fichier téléchargé
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // État pour stocker l'URL de prévisualisation
  const [formData, setFormData] = useState<FormDataType>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    categoryName: "",
  }); // État pour stocker les données du formulaire

  const router = useRouter(); // Hook pour la navigation

  const fetchProduct = async () => {
    try {
      const { productId } = await params; // Récupère l'ID du produit
      if (email) {
        const fetchedProduct = await readProductById(productId, email); // Lit le produit par ID et email
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setFormData({
            id: fetchedProduct.id,
            name: fetchedProduct.name,
            description: fetchedProduct.description,
            price: fetchedProduct.price,
            imageUrl: fetchedProduct.imageUrl,
            categoryName: fetchedProduct.categoryName,
          }); // Met à jour les données du formulaire avec celles du produit récupéré
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [email]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Met à jour les données du formulaire lors d'un changement d'input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null; // Récupère le fichier sélectionné
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Crée une URL de prévisualisation pour le fichier
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    let imageUrl = formData?.imageUrl;

    e.preventDefault(); // Empêche la soumission du formulaire par défaut
    try {
      if (file) {
        const resDelete = await fetch("/api/upload", {
          method: "DELETE",
          body: JSON.stringify({ path: formData.imageUrl }),
          headers: { "Content-Type": "application/json" },
        });
        const dataDelete = await resDelete.json();
        if (!dataDelete.success) {
          throw new Error("Erreur lors de la suppression de l’image.");
        }

        const imageData = new FormData();
        imageData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: imageData,
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error("Erreur lors de l’upload de l’image.");
        }

        imageUrl = data.path;
        formData.imageUrl = imageUrl;

        await updateProduct(formData, email); // Met à jour le produit avec les nouvelles données
        toast.success("Produit mis à jour avec succès !");
        router.push("/products"); // Redirige vers la page des produits après la mise à jour
      }
    } catch (error: any) {
      console.error(error); // Logue les erreurs dans la console
      toast.error(error.message); // Affiche une notification d'erreur
    }
  };

  return (
    <Wrapper>
      <div>
        {product ? (
          <div>
            <h1 className="text-2xl font-bold  mb-4">Mise à jour du produit</h1>
            <div className="flex md:flex-row flex-col md:items-center">
              <form className="space-y-2" onSubmit={handleSubmit}>
                {/* Formulaire pour mettre à jour les informations du produit */}
                <div className="text-sm font-semibold mb-2">Nom</div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <div className="text-sm font-semibold mb-2">Description</div>
                <textarea
                  name="description"
                  placeholder="Description"
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>

                <div className="text-sm font-semibold mb-2">Catégorie</div>
                <input
                  type="text"
                  name="categoryName"
                  className="input input-bordered w-full"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  disabled
                />
                <div className="text-sm font-semibold mb-2">
                  Image / Prix Unitaire
                </div>

                <div className="flex">
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Prix"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                  />

                  <input
                    type="number"
                    name="price"
                    placeholder="Prix"
                    className="input input-bordered w-full ml-4"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                  Mettre à jour
                </button>
              </form>

              <div className="flex md:flex-col md:ml-4 mt-4 md:mt-0">
                <div className="md:ml-4 md:w-[200px] mt-4 md:mt-0 border-2 border-primary md:h-[200px] p-5  justify-center items-center rounded-3xl hidden md:flex">
                  {formData.imageUrl && formData.imageUrl !== "" ? (
                    <div>
                      <ProductImage
                        src={formData.imageUrl}
                        alt={product.name}
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

                <div className="md:ml-4 w-full md:w-[200px] mt-4 border-2 border-primary md:h-[200px] p-5 flex justify-center items-center rounded-3xl md:mt-4">
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
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full">
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default page;
