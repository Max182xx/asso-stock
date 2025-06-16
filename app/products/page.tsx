"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { Product } from "@/type";
import { deleteProduct, readProduct } from "../actions";
import EmptyState from "../components/EmptyState";
import ProductImage from "../components/ProductImage";
import Link from "next/link";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

const page = () => {
  const { user } = useUser(); // Récupère l'utilisateur connecté
  const email = user?.primaryEmailAddress?.emailAddress as string; // Obtient l'email de l'utilisateur
  const [products, setProducts] = useState<Product[]>([]); // État pour stocker les produits

  const fetchProducts = async () => {
    try {
      if (email) {
        const products = await readProduct(email); // Lit les produits par email
        if (products) {
          setProducts(products); // Met à jour l'état des produits
        }
      }
    } catch (error) {
      console.error(error); // Logue les erreurs dans la console
    }
  };

  useEffect(() => {
    if (email) fetchProducts(); // Appelle fetchProducts dès le chargement du composant si email existe
  }, [email]); // Dépendance de useEffect : email

  const handleDeleteProduct = async (product: Product) => {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    ); // Demande confirmation avant suppression
    if (!confirmDelete) return; // Annule si l'utilisateur ne confirme pas

    try {
      if (product.imageUrl) {
        const resDelete = await fetch("/api/upload", {
          method: "DELETE",
          body: JSON.stringify({ path: product.imageUrl }),
          headers: { "Content-Type": "application/json" },
        });
        const dataDelete = await resDelete.json();
        if (!dataDelete.success) {
          throw new Error("Erreur lors de la suppression de l'image.");
        } else {
          if (email) {
            await deleteProduct(product.id, email); // Supprime le produit
            await fetchProducts(); // Rafraîchit la liste des produits
            toast.success("Produit supprimé avec succès "); // Affiche une notification de succès
          }
        }
      }
    } catch (error) {
      console.error(error); // Logue les erreurs dans la console
    }
  };

  return (
    <Wrapper>
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <div>
            <EmptyState
              message="Aucun produit disponible"
              IconComponent="PackageSearch"
            />
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Image</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <th>{index + 1}</th>
                  <td>
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.imageUrl}
                      heightClass="h-12"
                      widthClass="w-12"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price} €</td>
                  <td className="capitalize">
                    {product.quantity} {product.unit}
                  </td>
                  <td>{product.categoryName}</td>
                  <td className="flex gap-2 flex-col">
                    <Link
                      className="btn btn-xs w-fit btn-primary"
                      href={`/update-product/${product.id}`}
                    >
                      Modifier
                    </Link>
                    <button
                      className="btn btn-xs w-fit"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Wrapper>
  );
};

export default page;
