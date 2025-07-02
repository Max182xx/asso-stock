"use client";

import { OrderItem, Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { deductStockWithTransaction, readProduct } from "../actions";
import Wrapper from "../components/Wrapper";
import ProductComponent from "../components/ProductComponent";
import EmptyState from "../components/EmptyState";
import ProductImage from "../components/ProductImage";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

const page = () => {
  // Utilisation de Clerk pour obtenir les informations de l'utilisateur connecté
  const { user } = useUser();

  // Récupération de l'email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [products, setProducts] = useState<Product[]>([]); // État pour stocker les produits
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProductIds, setselectedProductIds] = useState<string>("");

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

  const filteredAvailableProducts = products
    .filter((products) =>
      products.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => !selectedProductIds.includes(product.id))
    .slice(0, 10);

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = (product: Product) => {
    setOrder((prevOrder) => {
      const existingProduct = prevOrder.find(
        (item) => item.productId === product.id
      );
      let updateOrder;
      if (existingProduct) {
        updateOrder = prevOrder.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.quantity),
              }
            : item
        );
      } else {
        updateOrder = [
          ...prevOrder,
          {
            productId: product.id,
            quantity: 1,
            unit: product.unit,
            imageUrl: product.imageUrl,
            name: product.name,
            availableQuantity: product.quantity,
          },
        ];
      }

      setselectedProductIds((prevSelected) =>
        prevSelected.includes(product.id)
          ? prevSelected
          : [...prevSelected, product.id]
      );

      return updateOrder;
    });
  };

  // Fonction pour mettre à jour la quantité d'un produit dans le panier
  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // Fonction pour supprimer un produit du panier
  const handleRemoveFromCart = (productId: string) => {
    setOrder((prevOrder) => {
      const updatedOrder = prevOrder.filter(
        (item) => item.productId !== productId
      );
      setselectedProductIds((prevSelectedProductIds) =>
        prevSelectedProductIds.filter((id) => id !== productId)
      );
      return updatedOrder;
    });
  };

  // Fonction pour soumettre la commande
  const handleSubmit = async () => {
    try {
      if (order.length == 0) {
        toast.error("Veuillez ajouter des produits à la commande.");
        return;
      }
      const response = await deductStockWithTransaction(order, email);

      if (response?.success) {
        toast.success("Don confirmé avec succès !");
        setOrder([]);
        setselectedProductIds([]);
        fetchProducts();
      } else {
        toast.error(`${response?.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <div className="flex md:flex-row flex-col-reverse">
        <div className="md:w-1/3">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          <div className="space-y-4">
            {filteredAvailableProducts.length > 0 ? (
              filteredAvailableProducts.map((product, index) => (
                <ProductComponent
                  key={index}
                  add={true}
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <EmptyState
                message="Aucun produit disponible"
                IconComponent="PackageSearch"
              />
            )}
          </div>
        </div>
        <div className="md:w-2/3 p-4 md:ml-4 mb-4 md:mb-0 h-fit border-2 border-base-200 rounded-3xl overflow-x-auto ">
          {order.length > 0 ? (
            <div>
              <table className="table w-full scroll-auto">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Quantité</th>
                    <th>Unité</th>
                    <th>Action</th>{" "}
                  </tr>
                </thead>
                <tbody>
                  {order.map((item) => (
                    <tr key={item.productId}>
                      <td>
                        <ProductImage
                          src={item.imageUrl}
                          alt={item.imageUrl}
                          heightClass="h-12"
                          widthClass="w-12"
                        />
                      </td>

                      <td>{item.name}</td>

                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          max={item.availableQuantity}
                          className="input input-bordered w-20"
                          onChange={(e) =>
                            handleQuantityChange(
                              item.productId,
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td className="capitalize">{item.unit}</td>

                      <td>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleRemoveFromCart(item.productId)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={handleSubmit}
                className="btn btn-primary mt-4 w-fit "
              >
                Confirmer le Don
              </button>
            </div>
          ) : (
            <EmptyState
              message="Aucun produit dans le panier"
              IconComponent="HandHeart"
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
