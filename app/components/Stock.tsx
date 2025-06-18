import { Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { readProduct } from "../actions";

const Stock = () => {
  // Utilisation de Clerk pour obtenir les informations de l'utilisateur connecté
  const { user } = useUser();

  // Récupération de l'email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [products, setProducts] = useState<Product[]>([]); // État pour stocker les produits
  const [selectedProductID, setSelectedProductID] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  return (
    <div>
      <dialog id="my_modal_stock" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Gestion de stock</h3>
          <p className="py-4">
            Ajoutez des quantités aux produits disponibles dans votre stock.
          </p>

          <form className="space-y-2 ">
            <label className="block"> Sélectionner un produit</label>
            <select
              value={selectedProductID}
              className="select select-bordered w-full"
              required
            >
              <option value="">Sélectionner un produit </option>
              {products.map((product) => (
                
                <option key={product.id} value={product.id}>
                  {product.name} - {product.categoryName}

                </option>
              ))}
            </select>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Stock;
