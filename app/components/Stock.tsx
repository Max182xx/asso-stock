import { Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { readProduct, replenishStockWithTransaction } from "../actions";
import ProductComponent from "./ProductComponent";
import { toast } from "react-toastify";

const Stock = () => {
  // Utilisez Clerk pour obtenir les informations de l'utilisateur
  const { user } = useUser();

  // Obtenir l'adresse email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;

  // Variables d'état pour gérer les produits et les données du formulaire
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      if (email) {
        const products = await readProduct(email); // Récupérer les produits pour l'email de l'utilisateur
        if (products) {
          setProducts(products); // Mettre à jour l'état des produits
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Hook d'effet pour récupérer les produits lorsque le composant s'affiche ou lorsque l'email change
  useEffect(() => {
    if (email) fetchProducts();
  }, [email]);

  // Fonction pour gérer le changement de sélection de produit
  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    setSelectedProductId(productId);
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valider le produit sélectionné et la quantité
    if (!selectedProductId || quantity <= 0) {
      toast.error("Veuillez sélectionner un produit et entrer une quantité valide.");
      return;
    }

    try {
      // Réapprovisionner le stock avec transaction
      if (email) {
        await replenishStockWithTransaction(selectedProductId, quantity, email);
      }
      
      // Afficher un message de succès et réinitialiser le formulaire
      toast.success("Le stock a été réapprovisionné avec succès.");
      fetchProducts();
      setSelectedProductId("");
      setQuantity(0);
      setSelectedProduct(null);

      // Fermer la boîte de dialogue
      const modal = document.getElementById("my_modal_stock") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Boîte de dialogue pour la gestion du stock */}
      <dialog id="my_modal_stock" className="modal">
        <div className="modal-box">
          {/* En-tête de la boîte de dialogue */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">×</button>
          </form>

          <h3 className="font-bold text-lg">Gestion du Stock</h3>
          <p className="py-4">
            Ajoutez des quantités aux produits disponibles dans votre stock.
          </p>

          {/* Formulaire pour sélectionner un produit et entrer une quantité */}
          <form className="space-y-2" onSubmit={handleSubmit}>
            <label className="block">Sélectionnez un produit</label>
            <select
              value={selectedProductId}
              className="select select-bordered w-full"
              required
              onChange={(e) => handleProductChange(e.target.value)}
            >
              <option value="">Sélectionnez un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.categoryName}
                </option>
              ))}
            </select>

            {/* Afficher les détails du produit sélectionné */}
            {selectedProduct && <ProductComponent product={selectedProduct} />}

            <label className="block">Quantité à ajouter</label>
            <input
              type="number"
              placeholder="Quantité à ajouter"
              value={quantity}
              required
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input input-bordered w-full"
            />

            <button type="submit" className="btn btn-primary w-fit">
              Ajouter au stock
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Stock;