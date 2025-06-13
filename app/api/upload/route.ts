// Importation des modules nécessaires
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

// Définition de la fonction POST pour gérer les requêtes HTTP POST
export async function POST(request: NextRequest) {
  try {
    // Récupération des données de la requête
    const data = await request.formData();

    // Récupération du fichier envoyé
    const file: File | null = data.get("file") as unknown as File;

    // Vérification si aucun fichier n'a été envoyé
    if (!file) {
      return NextResponse.json({ success: false });
    }

    // Conversion du fichier en tableau de bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Détermination du répertoire d'upload
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Création du répertoire si il n'existe pas
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Génération d'un nom unique pour le fichier
    const ext = file.name.split(".").pop();
    const UniqueName = crypto.randomUUID() + "." + ext;
    const filePath = join(uploadDir, UniqueName);

    // Ecriture du fichier sur le disque
    await writeFile(filePath, buffer);

    // Construction de la route publique pour l'image
    const publicPath = `/uploads/${UniqueName}`;

    // Retourne une réponse JSON avec succès et le chemin de l'image
    return NextResponse.json({ success: true, path: publicPath });
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { success: false, message: "Chemin invalide" },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), "public", path);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "Fichier non trouvé" },
        { status: 404 }
      );
    }

    await unlink(filePath);
    return NextResponse.json(
      { success: true, message: "Fichier supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
