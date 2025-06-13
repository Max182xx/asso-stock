"use client";

import { readProductById } from "@/app/actions";
import Wrapper from "@/app/components/Wrapper";
import { FormDataType, Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const page = ({ params }: { params: Promise<{ productId: string }> }) => {
  // Utilisation de Clerk pour obtenir les informations de l'utilisateur connecté
  const { user } = useUser();
  // Récupération de l'email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [product, setProduct] = useState<Product | null>(null);
  // États pour stocker les données du formulaire et l'image prévisualisée
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setpreviewUrl] = useState<string | null>(null);
  const [formData, setformData] = useState<FormDataType>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  });

  const fetchProduct = async () => {
    try {
      const { prodcutId } = await params;
      if (email) {
        const fetchProduct = await readProductById(prodcutId, email);
        if (fetchProduct) {
          setProduct(fetchProduct);
          setformData({
            id: fetchProduct.id,
            name: fetchProduct.name,
            description: fetchProduct.description,
            price: fetchProduct.price,
            imageUrl: fetchProduct.imageUrl,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour charger les catégories disponibles
  useEffect(() => {
    fetchProduct();
  }, [email]);

  // Fonction pour mettre à jour les valeurs du formulaire
  const handInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  return (
    <Wrapper>
      <div>
        {product ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Mise à jour du produit</h1>

            <div className="flex md:flex-row flex-col md:justify-center md:items-center">
              <form className="space-y-2">
                <div className="text-sm font-semibold mb-2">Nom</div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={handInputChange}
                />
              </form>
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
