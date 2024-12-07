// GraphVisualization.jsx
import React, { useEffect, useRef } from 'react';
import { LGraph, LGraphCanvas } from 'litegraph.js';
import 'litegraph.js/css/litegraph.css';

const GraphVisualization = () => {
    const canvasRef = useRef(null);
    const graphRef = useRef(null);
    const canvasInstanceRef = useRef(null);

    useEffect(() => {
        // Initialize graph on component mount
        graphRef.current = new LGraph();
        canvasInstanceRef.current = new LGraphCanvas("#mycanvas", graphRef.current);

        // Define node types
        function ProductNode() {
            this.addOutput("output", "ingredient");
            this.size = [180, 55];
            this.properties = {
                name: "",
                volume: 0
            };
            this.addWidget("text", "Volume", "", function (v) { }, { readonly: true });
        }

        ProductNode.title = "Product";
        LiteGraph.registerNodeType("basic/product", ProductNode);

        function IngredientNode() {
            this.addInput("input", "ingredient");
            this.size = [120, 30];
            this.properties = { name: "" };
        }

        IngredientNode.title = "Ingredient";
        LiteGraph.registerNodeType("basic/ingredient", IngredientNode);

        // Make canvas responsive
        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Enable basic interactions
        if (canvasInstanceRef.current) {
            canvasInstanceRef.current.allow_dragcanvas = true;
            canvasInstanceRef.current.allow_dragnodes = true;
        }

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (graphRef.current) {
                graphRef.current.clear();
            }
        };
    }, []);

    const parseIngredients = (ingredientsStr) => {
        try {
            const cleanStr = ingredientsStr.trim().replace(/'/g, '"');
            return JSON.parse(cleanStr);
        } catch (e) {
            return ingredientsStr
                .replace(/[\[\]']/g, '')
                .split(',')
                .map(i => i.trim())
                .filter(i => i);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            graphRef.current.clear();

            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',');

            // Find indices for required columns
            const productIndex = headers.findIndex(h => h.trim() === 'product_name');
            const ingredientsIndex = headers.findIndex(h => h.trim() === 'ingredients');
            const volumeIndex = headers.findIndex(h => h.trim() === 'volume_ordered_quarterly');

            if (productIndex === -1 || ingredientsIndex === -1 || volumeIndex === -1) {
                console.error("Required columns not found");
                return;
            }

            // Process each line
            const productMap = new Map();

            lines.slice(1).forEach(line => {
                if (!line.trim()) return;

                const columns = line.split(/,(?![^\[]*\])/);
                if (columns.length <= Math.max(productIndex, ingredientsIndex, volumeIndex)) return;

                const product = columns[productIndex].trim();
                const ingredients = parseIngredients(columns[ingredientsIndex]);
                const volume = parseInt(columns[volumeIndex]) || 0;

                if (!productMap.has(product)) {
                    productMap.set(product, {
                        ingredients: new Set(ingredients),
                        volume: volume
                    });
                }
            });

            // Create nodes with spacing
            let x = 100;
            let y = 100;
            const productSpacing = 300;
            const nodesPerRow = 3;

            // Create product and ingredient nodes
            Array.from(productMap.entries()).forEach(([product, data], index) => {
                const productNode = LiteGraph.createNode("basic/product");
                productNode.title = product;
                productNode.properties.name = product;
                productNode.properties.volume = data.volume;
                productNode.widgets[0].value = `Volume: ${data.volume.toLocaleString()}`;
                productNode.color = "#2E4053";

                productNode.pos = [
                    x + (index % nodesPerRow) * productSpacing,
                    y + Math.floor(index / nodesPerRow) * productSpacing
                ];

                graphRef.current.add(productNode);

                const ingredientRadius = 100;
                const ingredientsList = Array.from(data.ingredients);
                ingredientsList.forEach((ingredient, i) => {
                    const angle = (i * 2 * Math.PI) / ingredientsList.length;

                    const ingredientNode = LiteGraph.createNode("basic/ingredient");
                    ingredientNode.title = ingredient;
                    ingredientNode.properties.name = ingredient;
                    ingredientNode.color = "#873600";

                    ingredientNode.pos = [
                        productNode.pos[0] + ingredientRadius * Math.cos(angle),
                        productNode.pos[1] + ingredientRadius * Math.sin(angle)
                    ];

                    graphRef.current.add(ingredientNode);

                    const link = productNode.connect(0, ingredientNode, 0);
                    if (link) {
                        link.color = "#E59866";
                        link.width = 2;
                    }
                });
            });

            graphRef.current.start();
        };

        reader.readAsText(file);
    };

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <div style={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                zIndex: 100
            }}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                />
            </div>
            <canvas
                ref={canvasRef}
                id="mycanvas"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default GraphVisualization;