import React from 'react';
import { CardBody} from "@nextui-org/react";

export default function RecipeInstructions({ instructions }) {
    return (
        <CardBody style={styles.cardBody}>
            <h3 style={styles.instructionsTitle}>Recipe Instructions</h3>
            <div style={styles.instructionsContent}>
                <p style={styles.instructionsText}>{instructions}</p>
            </div>
        </CardBody>
    );
}

const styles = {
    cardBody: {
        padding: '0 16px',
    },
    instructionsTitle: {
        marginBottom: '10px',
    },
    instructionsContent: {
        overflow: 'auto',
        maxHeight: 'calc(100% - 40px)',
    },
    instructionsText: {
        whiteSpace: 'pre-line',
    },
};
