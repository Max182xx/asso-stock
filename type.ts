import { Product as PrismaProduct } from "@prisma/client";
import { Transaction as PrismaTransaction } from "@prisma/client"

export interface Product extends PrismaProduct {
  categoryName: string;
}

// Interface pour les données du formulaire
export interface FormDataType {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  categoryId?: string;
  unit?: string;
  categoryName?: string;
  imageUrl?: string;
}

// Interface pour les données d'un article
export interface OrderItem {
    productId: string;
    quantity: number;
    unit: string;
    imageUrl: string;
    name: string;
    availableQuantity: number;
};

export interface Transaction extends PrismaTransaction {
    categoryName: string;
    productName: string;
    imageUrl?: string;
    price: number;
    unit: string;
}