Application de gestion – Next.js

Ce projet est une application de gestion développée avec Next.js.

Prérequis à l’installation

Assurez-vous d’avoir Node.js installé sur votre machine. Ensuite, installez les dépendances nécessaires à l’aide des commandes suivantes :

-Next.js cmd :  npx create-next-app@latest 
(mettre non à src/directory et import alias )

-Daisyui cmd : npm i -D daisyui@latest 

-Lucide React cmd : npm install lucide-react

-React Toastify cmd : npm install --save react-toastify

-Recharts : npm i recharts

-Prisma cmd : npm install prisma --save-dev 
              npx prisma init --datasource-provider sqlite

-Pour migrer la BDD prisma : npx prisma migrate dev --name init

-Pour créer les types : npx prisma generate

-Pour visualiser la BDD : npx prisma studio

-Créations de l'autentifications avec clerk choiser les Next.js et suivre les instructions d'installations.

Pour lancer l'appli : npm run dev
Ouvrir : http://localhost:3000/