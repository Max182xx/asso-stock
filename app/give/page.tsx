"use client";

import { OrderItem, Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { readProduct } from "../actions";
import Wrapper from "../components/Wrapper";

const page = () => {
  // Utilisation de Clerk pour obtenir les informations de l'utilisateur connecté
  const { user } = useUser();

  // Récupération de l'email de l'utilisateur
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [products, setProducts] = useState<Product[]>([]); // État pour stocker les produits
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [searchQuery , setSearchQuery] = useState<string>("")
  const [selectedProductId , setselectedProductId] = useState<string>("")

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
    .filter((products)=> 
        products.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product)=> !selectedProductId.includes(product.id))
    .slice(0,10)


  return(
   <Wrapper>
    <div className="flex md:flew-row flex-col-reverse">
        <div className="md:w-1/3">
        <input 
        type="text" 
        placeholder="Rechercher un produit..."
        value={searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value)}
        className="input input-bordered w-full mb-4"
        />
        <div className="space-y-4">
            {filteredAvailableProducts.length > 0 ?(
                <div></div>
            ) :(
                <div>

                </div>
            
            )}

        </div>

        </div>

    </div>
    </Wrapper>)
};

export default page;
