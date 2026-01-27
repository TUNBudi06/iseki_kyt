<script lang="ts">
    import { onMount } from "svelte";
    import { Canvas, FabricImage, Rect, Circle } from "fabric";
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";
    import * as Card from "$shadcn/components/ui/card/index.js";

    let canvasEl: HTMLCanvasElement;
    let canvas: Canvas;
    let history: string[] = [];
    let redoStack: string[] = [];
    let cropRect: Rect | null = null;

    function saveState() {
        history.push(JSON.stringify(canvas.toJSON()));
        if (history.length > 30) history.shift();
        redoStack = [];
    }

    function undo() {
        if (!history.length) return;
        redoStack.push(JSON.stringify(canvas.toJSON()));
        const state = history.pop()!;
        canvas.loadFromJSON(state).then(() => canvas.renderAll());
    }

    function redo() {
        if (!redoStack.length) return;
        history.push(JSON.stringify(canvas.toJSON()));
        const state = redoStack.pop()!;
        canvas.loadFromJSON(state).then(() => canvas.renderAll());
    }

    onMount(() => {
        canvas = new Canvas(canvasEl, {
            selection: true,
            preserveObjectStacking: true
        });

        // Use setDimensions instead of setWidth/setHeight for Fabric v7
        canvas.setDimensions({
            width: Math.min(window.innerWidth - 300, 1200),
            height: 600
        });

        canvas.on("object:added", saveState);
        canvas.on("object:modified", saveState);
        canvas.on("object:removed", saveState);

        return () => {
            canvas.dispose();
        };
    });

    function loadImage(file: File) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            FabricImage.fromURL(reader.result as string).then((img) => {
                // Get canvas dimensions
                const canvasWidth = canvas.getWidth();
                const canvasHeight = canvas.getHeight();

                // Calculate scale to FIT entire image within canvas (like CSS background-size: contain)
                const scaleX = canvasWidth / (img.width || 1);
                const scaleY = canvasHeight / (img.height || 1);
                const scale = Math.min(scaleX, scaleY); // Use min to fit completely

                // Calculate scaled dimensions
                const scaledWidth = (img.width || 0) * scale;
                const scaledHeight = (img.height || 0) * scale;

                // Center the image
                const left = (canvasWidth - scaledWidth) / 2;
                const top = (canvasHeight - scaledHeight) / 2;

                // Set image to full size and LOCK IT - cannot be moved
                img.set({
                    originX: "left",
                    originY: "top",
                    scaleX: scale,
                    scaleY: scale,
                    left: left,
                    top: top,
                    selectable: false,
                    evented: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                    hasControls: false,
                    hasBorders: false,
                });
                img.setCoords();

                canvas.clear();
                canvas.add(img);
                canvas.sendObjectToBack(img);
                canvas.renderAll();
                saveState();
            });
        };
        reader.readAsDataURL(file);
    }

    function addHighlight() {
        const rect = new Rect({
            left: 100,
            top: 100,
            width: 120,
            height: 60,
            fill: "rgba(255,255,0,0.3)",
            stroke: "orange",
            strokeWidth: 2,
            cornerColor: "orange"
        });
        canvas.add(rect);
    }

    function addCircle() {
        const circle = new Circle({
            left: 150,
            top: 150,
            radius: 40,
            fill: "transparent",
            stroke: "red",
            strokeWidth: 4
        });
        canvas.add(circle);
    }

    function startCrop() {
        if (cropRect) return;
        cropRect = new Rect({
            left: 80,
            top: 80,
            width: 200,
            height: 150,
            fill: "rgba(0,0,0,0.2)",
            stroke: "white",
            strokeDashArray: [6, 4],
            hasRotatingPoint: false,
            cornerColor: "white"
        });
        canvas.add(cropRect);
        canvas.setActiveObject(cropRect);
    }

    function applyCrop() {
        if (!cropRect) return;

        const rect = cropRect.getBoundingRect();
        // Add required multiplier parameter for Fabric v7
        const dataUrl = canvas.toDataURL({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            multiplier: 1,
            format: "png"
        });

        FabricImage.fromURL(dataUrl).then((img) => {
            canvas.clear();

            // Get canvas dimensions
            const canvasWidth = canvas.getWidth();
            const canvasHeight = canvas.getHeight();

            // Calculate scale to FIT entire image within canvas (like CSS background-size: contain)
            const scaleX = canvasWidth / (img.width || 1);
            const scaleY = canvasHeight / (img.height || 1);
            const scale = Math.min(scaleX, scaleY); // Use min to fit completely

            // Calculate scaled dimensions
            const scaledWidth = (img.width || 0) * scale;
            const scaledHeight = (img.height || 0) * scale;

            // Center the image
            const left = (canvasWidth - scaledWidth) / 2;
            const top = (canvasHeight - scaledHeight) / 2;

            // Set cropped image to full size and LOCK IT
            img.set({
                originX: "left",
                originY: "top",
                scaleX: scale,
                scaleY: scale,
                left: left,
                top: top,
                selectable: false,
                evented: false,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                hasControls: false,
                hasBorders: false,
            });
            img.setCoords();

            canvas.add(img);
            canvas.renderAll();
            saveState();
        });

        cropRect = null;
    }

    function exportImage() {
        // Add required multiplier parameter for Fabric v7
        const url = canvas.toDataURL({
            format: "png",
            multiplier: 1
        });
        const a = document.createElement("a");
        a.href = url;
        a.download = "edited.png";
        a.click();
    }

    function handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files?.[0]) {
            loadImage(input.files[0]);
        }
    }

    function removeSelected() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            saveState();
        }
    }
</script>

<AdminLayout>
    <div class="space-y-6">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Image Editor</h1>
            <p class="text-muted-foreground mt-1">Edit and annotate your images</p>
        </div>

        <Card.Root>
            <Card.Header>
                <Card.Title>Toolbar</Card.Title>
                <Card.Description>Upload an image and use the tools below to edit</Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="flex flex-wrap gap-2">
                    <div class="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onchange={handleFileChange}
                            class="block w-full text-sm text-muted-foreground
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-medium
                                file:bg-primary file:text-primary-foreground
                                hover:file:bg-primary/90 file:cursor-pointer"
                        />
                    </div>
                    <Button variant="outline" onclick={addHighlight}>
                        🟡 Highlight
                    </Button>
                    <Button variant="outline" onclick={addCircle}>
                        🔴 Circle
                    </Button>
                    <Button variant="outline" onclick={removeSelected}>
                        🗑️ Remove Selected
                    </Button>
                    <Button variant="outline" onclick={startCrop}>
                        ✂️ Crop
                    </Button>
                    <Button variant="outline" onclick={applyCrop}>
                        ✅ Apply Crop
                    </Button>
                    <Button variant="outline" onclick={undo}>
                        ↩️ Undo
                    </Button>
                    <Button variant="outline" onclick={redo}>
                        ↪️ Redo
                    </Button>
                    <Button onclick={exportImage}>
                        💾 Save
                    </Button>
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Content class="p-4">
                <canvas
                    bind:this={canvasEl}
                    class="border border-border rounded-lg w-full"
                ></canvas>
            </Card.Content>
        </Card.Root>
    </div>
</AdminLayout>

<style>
    canvas {
        touch-action: none;
    }
</style>
