'use client';

import FeaturedToday from "./components/homepage/FeatureToday";
import PopularCategories from "./components/homepage/PopularCategory";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <PopularCategories />
      </div>
      <div>
        <FeaturedToday />
      </div>
    </div>
  );
}
