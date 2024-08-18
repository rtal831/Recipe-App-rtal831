import React from 'react';
import { CardHeader, Image } from "@nextui-org/react";

export default function RecipeHeader({ title, onSave }) {
    return (
        <CardHeader style={styles.recipeHeader}>
            <h2 style={styles.recipeTitle}>{title}</h2>
            <button style={styles.saveButton} onClick={onSave}>
                <Image
                    src="/savebutton.png"
                    alt="Save Recipe"
                    width={50}
                    height={50}
                    style={{ height: 'auto', borderRadius: '8px' }}
                />
            </button>
        </CardHeader>
    );
}

const styles = {
    recipeHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: '0',
        fontWeight: 'bold',
    },
    recipeTitle: {
        fontSize: '30px',
        fontWeight: 'bold',
        margin: 0,
    },
    saveButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer'
    },
};
