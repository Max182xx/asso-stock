import React from "react";
import { Product } from "./../../type";
import ProductImage from "./ProductImage";
import { Plus } from "lucide-react";

interface ProductComponentProps {
  product?: Product | null;
  add?: boolean;
  handleAddToCart?: (product: Product) => void;
}

// Composant React pour afficher les détails d'un produit
const ProductComponent: React.FC<ProductComponentProps> = ({
  product,
  add,
  handleAddToCart,
}) => {
  // Si aucun produit n'est fourni, afficher un message d'attente
  if (!product) {
    return (
      <div className="border-2 border-base-200 p-4 rounded-3xl w-full flex items-center ">
        Sélectionner un produit pour voir ses détails
      </div>
    );
  }

  // Affiche les détails du produit
  return (
    <div className="border-2 border-base-200 p-4 rounded-3xl w-full flex items-center ">
      <div>
        <ProductImage
          src={product.imageUrl}
          alt={product.imageUrl}
          heightClass="h-30"
          widthClass="w-30"
        />
      </div>

      <div className="ml-4 space-y-2 flex flex-col">
        <h2 className="text-lg font-bold "> {product.name}</h2>

        <div className="badge badge-warning badge badge-soft">
          {" "}
          {product.categoryName}
        </div>
        <div className="badge badge-warning badge badge-soft">
          {" "}
          {product.quantity} {product.unit}
        </div>

        {/* Afficher le bouton d'ajout si add est true et handleAddToCart est défini */}
        {add && handleAddToCart && (
          <button
            onClick={() => handleAddToCart(product)}
            className="btn bnt-sm btn-circle btn-primary"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductComponent;
