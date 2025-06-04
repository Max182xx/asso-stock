// Utiliser le mode serveur côté serveur
"use server";

import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

// Fonction pour vérifier si une association existe et l'ajouter si elle n'existe pas
export async function checkAndAddAssociation(email: string, name: string) {
  // Vérifier si l'email est valide
  if (!email) return;

  try {
    // Rechercher une association existante par email
    const existingAssociation = await prisma.association.findUnique({
      where: {
        email,
      },
    });

    // Si l'association n'existe pas et qu'un nom est fourni, créer-la
    if (!existingAssociation && name) {
      await prisma.association.create({
        data: {
          email,
          name,
        },
      });
    }
  } catch (error) {
    console.error(error); // Loguer les erreurs
  }
}

// Fonction pour récupérer une association par email
export async function getAssociation(email: string) {
  // Vérifier si l'email est valide
  if (!email) return;

  try {
    // Rechercher une association existante par email
    const existingAssociation = await prisma.association.findUnique({
      where: {
        email,
      },
    });

    // Retourner l'association trouvée ou null
    return existingAssociation;
  } catch (error) {
    console.error(error); // Loguer les erreurs
  }
}

// Fonction pour créer une nouvelle catégorie associée à une association
export async function createCategory(
  name: string,
  email: string,
  description?: string
) {
  // Vérifier si l'email est valide
  if (!email) return;

  try {
    // Récupérer l'association par email
    const association = await getAssociation(email);

    // Si l'association n'est pas trouvée, lever une erreur
    if (!association) {
      throw new Error("Aucune association trouvée avec cet email.");
    }

    // Créer une nouvelle catégorie
    await prisma.category.create({
      data: {
        name,
        description: description || "", // Utiliser une valeur par défaut si description n'est pas fournie
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error); // Loguer les erreurs
  }
}

// Fonction pour mettre à jour une catégorie existante
export async function updateCategory(
  id: string,
  email: string,
  name: string,
  description?: string
) {
  // Vérifier si tous les paramètres obligatoires sont présents
  if (!id || !email || !name) {
    throw new Error(
      "L'id, l'email de l'association et le nom de la catégorie sont requis pour la mise à jour."
    );
  }

  try {
    // Récupérer l'association par email
    const association = await getAssociation(email);

    // Si l'association n'est pas trouvée, lever une erreur
    if (!association) {
      throw new Error("Aucune association trouvée avec cet email");
    }

    // Mettre à jour la catégorie
    await prisma.category.update({
      where: {
        id: id,
        associationId: association.id,
      },
      data: {
        name,
        description: description || "",
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error); // Loguer les erreurs
  }
}

// Fonction pour supprimer une catégorie
export async function deleteCategory(id: string, email: string) {
  // Vérifier si tous les paramètres obligatoires sont présents
  if (!id || !email) {
    throw new Error("L'id et l'email de l'association sont requis.");
  }

  try {
    // Récupérer l'association par email
    const association = await getAssociation(email);

    // Si l'association n'est pas trouvée, lever une erreur
    if (!association) {
      throw new Error("Aucune association trouvée avec cet email");
    }

    // Supprimer la catégorie
    await prisma.category.delete({
      where: {
        id: id,
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error); // Loguer les erreurs
  }
}

// Fonction pour récupérer toutes les catégories d'une association
export async function readCategories(email: string): Promise<Category[] | undefined> {
  // Vérifier si l'email est valide
  if (!email) {
    throw new Error("L'email de l'association est requis.");
  }

  try {
    // Récupérer l'association par email
    const association = await getAssociation(email);

    // Si l'association n'est pas trouvée, lever une erreur
    if (!association) {
      throw new Error("Aucune association trouvée avec cet email");
    }

    // Récupérer toutes les catégories associées à cette association
    const categories = await prisma.category.findMany({
      where: {
        associationId: association.id,
      },
    });

    // Retourner les catégories ou undefined si aucune n'a été trouvée
    return categories;
  } catch (error) {
    console.error(error); // Loguer les erreurs
  }
}