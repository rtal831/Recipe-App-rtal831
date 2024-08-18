import React from 'react';
import { Image } from "@nextui-org/react";

export default function RecipeImage({ src, alt }) {
    return (
        <Image
            alt={alt}
            className="object-cover rounded-xl"
            src={src}
            width={300}
            height={195}
            style={{ objectFit: 'cover' }}
        />
    );
}
