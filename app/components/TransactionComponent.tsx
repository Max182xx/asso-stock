import { Transaction } from "@/type";
import React from "react";
import ProductImage from "./ProductImage";

// Composant TransactionComponent qui prend un objet tx comme propriété
const TransactionComponent = ({ tx }: { tx: Transaction }) => {
  // Formater la date de création de la transaction
  const formattedDate = new Date(tx.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-4 border-2 border-base-200 rounded-3xl flex items-center w-full">
      <div>
        {/* Afficher l'image du produit si disponible */}
        {tx.imageUrl && (
          <ProductImage
            src={tx.imageUrl}
            alt={tx.imageUrl}
            heightClass="h-12"
            widthClass="w-12"
          />
        )}
      </div>
      <div className="ml-4 flex justify-between w-full items-center">
        <div>
          {/* Nom du produit */}
          <p className="font-semibold">{tx.productName}</p>
          {/* Catégorie du produit */}
          <div className="badge badge-soft badge-warning mt-2">
            {tx.categoryName}
          </div>
        </div>
        <div className="flex flex-cend flex-col">
          {/* Quantité du produit */}
          <div className="text-right">
            <div>
              {/* Afficher la quantité selon le type de transaction */}
              {tx.type == "IN" ? (
                <div>
                  <span className="text-success font-bold text-xl capitalize">
                    +{tx.quantity} {tx.unit}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-error font-bold text-xl capitalize">
                    -{tx.quantity} {tx.unit}
                  </span>
                </div>
              )}
            </div>
            {/* Date de la transaction */}
            <div className="txt-xs ">{formattedDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionComponent;
