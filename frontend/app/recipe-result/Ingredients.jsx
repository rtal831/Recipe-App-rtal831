import React from 'react';
import { Divider } from "@nextui-org/react";

export default function Ingredients({ ingredients }) {
    return (
        <div style={styles.ingredientsContainer}>
            <h3 style={styles.ingredientsHeader}>Ingredients:</h3>
            <Divider />
            <div style={styles.ingredientsList}>
                {ingredients.split('\n').filter(item => item.trim() !== '').map((ingredient, index) => (
                    <React.Fragment key={index}>
                        <small>{ingredient}</small>
                        {index < ingredients.split('\n').length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

const styles = {
    ingredientsContainer: {
        maxHeight: '200px',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px'
    },
    ingredientsHeader: {
        margin: 0,
        fontWeight: 'bold',
    },
    ingredientsList: {
        maxHeight: '150px',
        overflow: 'auto'
    },
};
