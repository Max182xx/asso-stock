import { ChartData } from "@/type";
import React, { useEffect, useState } from "react";
import { getProductCategoryDistribution } from "../actions";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  LabelList,
  Cell,
} from "recharts";
import EmptyState from "./EmptyState";

// Fonction composant qui prend un paramètre email
const CategoryChart = ({ email }: { email: string }) => {
  // Initialiser l'état avec un tableau vide
  const [data, setData] = useState<ChartData[]>([]);

  // Définir des constantes de couleur
  const COLORS = {
    default: "#F1D2BF",
  };

  // Fonction pour récupérer la répartition des catégories
  const fetchStats = async () => {
    try {
      if (email) {
        const data = await getProductCategoryDistribution(email);
        if (data) {
          setData(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Hook d'effet pour appeler fetchStats lorsque email change
  useEffect(() => {
    if (email) fetchStats();
  }, [email]);

  // Fonction de rendu du composant de charte
  const renderChart = (widthOverride?: string) => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        barCategoryGap={widthOverride ? 0 : "10"}
      >
        {/* Configuration de l'axe X */}
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 15,
            fill: "#793205",
            fontWeight: "bold",
          }}
        />

        {/* Cacher l'axe Y */}
        <YAxis hide />
        <Bar
          dataKey="value"
          radius={[8, 8, 0, 0]}
          // barSize={200}
        >
          {/* Ajouter des étiquettes aux barres */}
          <LabelList
            fill="#793205"
            dataKey="value"
            position="insideRight"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          />
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS.default}
              cursor="default"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Rendre soit le message d'état vide, soit le charte
  if (data.length == 0) {
    return (
      <div className="w-full border-2 border-base-200 mt-4 p-4 rounded-3xl">
        <h2 className="text-xl font-bold mb-4">
          5 catégories avec le plus de produits
        </h2>
        <EmptyState
          message='Aucune catégorie pour le moment"'
          IconComponent="Group"
        />
      </div>
    );
  }

  return (
    <div className="w-full border-2 border-base-200 mt-4 p-4 rounded-3xl">
      <h2 className="text-xl font-bold mb-4">
        5 catégories avec le plus de produits
      </h2>
      {renderChart()}
    </div>
  );
};

export default CategoryChart;
