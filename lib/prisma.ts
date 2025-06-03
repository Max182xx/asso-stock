// On importe la classe PrismaClient générée par Prisma
import { PrismaClient } from "@prisma/client";

// Fonction qui crée une nouvelle instance de PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// On déclare un champ personnalisé "prismaGlobal" sur l'objet globalThis
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>; // donc un PrismaClient
} & typeof global; // on garde les autres propriétés standards de global

// Si globalThis.prismaGlobal existe déjà, on le réutilise
// Sinon, on crée une nouvelle instance
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// On exporte cette instance pour l'utiliser ailleurs dans le projet
export default prisma;

// En environnement développement uniquement, on sauvegarde l'instance dans globalThis
// Cela permet d'éviter de créer une nouvelle instance à chaque hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
