<script lang="ts">
    import { onMount } from "svelte";
    import { Canvas, FabricImage, Rect, Circle } from "fabric";
    import AdminLayout from "$/Layouts/AdminLayout.svelte";
    import { Button } from "$shadcn/components/ui/button/index.js";
    import * as Card from "$shadcn/components/ui/card/index.js";
    let {bgKyt} = $props();

    // Use plain Svelte variables and explicit nullable types.
    let canvasEl = $state<HTMLCanvasElement>();
    let canvas = $state<Canvas>();
    let history = $state<string[]>([]);
    let redoStack = $state<string[]>([]);
    let cropRect = $state<Rect | null>(null);
    let savedImageUrl = $state<string>("");

    function saveState() {
        if (!canvas) return;
        const json = canvas.toJSON();
        history.push(JSON.stringify(json));
        if (history.length > 30) history.shift();
        redoStack = [];
    }

    function undo() {
        if (!canvas || !history.length) {
            return;
        }
        redoStack.push(JSON.stringify(canvas.toJSON()));
        const state = history.pop()!;
        canvas.loadFromJSON(state).then(() => canvas!.renderAll());
    }

    function redo() {
        if (!canvas || !redoStack.length) return;
        history.push(JSON.stringify(canvas.toJSON()));
        const state = redoStack.pop()!;
        canvas.loadFromJSON(state).then(() => canvas!.renderAll());
    }

    onMount(() => {
        // Wait until canvasEl is bound by Svelte. onMount runs after first render,
        // but guard to be safe in case of unexpected timing.
        if (!canvasEl) {
            return;
        }

        canvas = new Canvas(canvasEl, {
            selection: true,
            preserveObjectStacking: true
        });

        // Use setDimensions instead of setWidth/setHeight for Fabric v7
        canvas.setDimensions({
            width: 680,
            height: 500
        });

        canvas.on("object:added", saveState);
        canvas.on("object:modified", saveState);
        canvas.on("object:removed", saveState);

        return () => {
            canvas?.dispose();
        };
    });

    function loadImage(file: File) {
        if (!file || !canvas) return;
        const reader = new FileReader();
        reader.onload = () => {
            FabricImage.fromURL(reader.result as string).then((img) => {
                const canvasWidth = canvas!.getWidth();
                const canvasHeight = canvas!.getHeight();

                const scaleX = canvasWidth / (img.width || 1);
                const scaleY = canvasHeight / (img.height || 1);
                const scale = Math.min(scaleX, scaleY); // Use min to fit completely

                const scaledWidth = (img.width || 0) * scale;
                const scaledHeight = (img.height || 0) * scale;

                const left = (canvasWidth - scaledWidth) / 2;
                const top = (canvasHeight - scaledHeight) / 2;

                img.set({
                    originX: "left",
                    originY: "top",
                    scaleX: scale,
                    scaleY: scale,
                    left: left,
                    top: top,
                    lockMovementX: false,
                    lockMovementY: false,
                    lockScalingX: false,
                    lockScalingY: false,
                    lockRotation: false,
                    hasControls: true,
                    selectable: true,
                    evented: true,
                    hasBorders: true,
                });
                img.setCoords();

                canvas!.add(img);
                canvas!.setActiveObject(img);
                canvas!.renderAll();
                saveState();
            });
        };
        reader.readAsDataURL(file);
    }

    function addHighlight() {
        if (!canvas) return;
        const rect = new Rect({
            left: 100,
            top: 100,
            width: 120,
            height: 60,
            fill: "transparent",
            stroke: "orange",
            strokeWidth: 2,
            cornerColor: "orange"
        });
        canvas.add(rect);
    }

    function addCircle() {
        if (!canvas) return;
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
        if (cropRect || !canvas) return;
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
        if (!cropRect || !canvas) return;

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
            // By design this replaces the canvas with the cropped result. Keep the
            // behavior but guard canvas is present.
            canvas!.clear();

            // Get canvas dimensions
            const canvasWidth = canvas!.getWidth();
            const canvasHeight = canvas!.getHeight();

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

            canvas!.add(img);
            canvas!.renderAll();
            saveState();
        });

        cropRect = null;
    }

    function exportImage() {
        if (!canvas) return;
        // Add required multiplier parameter for Fabric v7
        const url = canvas.toDataURL({
            format: "png",
            multiplier: 1
        });

        // Store the image URL for preview
        savedImageUrl = url;

        // // Download the image
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "kyt-edited.png";
        // a.click();
    }

    function handleFileChange(e: Event) {
         const input = e.target as HTMLInputElement;
         if (input.files?.length) {
             Array.from(input.files).forEach((file) => loadImage(file));
             input.value = "";
         }
     }

    function bringForward() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringObjectForward(activeObject);
            canvas.renderAll();
            saveState();
        }
     }

    function sendBackward() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendObjectBackwards(activeObject);
            canvas.renderAll();
            saveState();
        }
     }

    function bringToFront() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringObjectToFront(activeObject);
            canvas.renderAll();
            saveState();
        }
     }

    function sendToBack() {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendObjectToBack(activeObject);
            canvas.renderAll();
            saveState();
        }
     }

    function removeSelected() {
        if (!canvas) return;
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
                            multiple
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
                    <Button variant="outline" onclick={bringForward}>
                        🔼 Bring Forward
                    </Button>
                    <Button variant="outline" onclick={sendBackward}>
                        🔽 Send Backward
                    </Button>
                    <Button variant="outline" onclick={bringToFront}>
                        ⏫ Bring To Front
                    </Button>
                    <Button variant="outline" onclick={sendToBack}>
                        ⏬ Send To Back
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
                <div class="overflow-x-auto overflow-y-auto max-w-full p-4 bg-white md:overflow-x-hidden md:overflow-y-hidden md:p-0 md:bg-transparent">
                    <canvas
                        bind:this={canvasEl}
                        class="border border-border rounded-lg"
                        style="width: 680px; height: 454px;"
                    ></canvas>
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title>Kiken Yochi Training - Preview</Card.Title>
                <Card.Description>
                    {#if savedImageUrl}
                        Hasil gambar yang telah disimpan
                    {:else}
                        Klik "💾 Save" untuk melihat hasil gambar di sini
                    {/if}
                </Card.Description>
            </Card.Header>
            <Card.Content class="p-4">
                <div class="overflow-x-auto">
                    {#if savedImageUrl}
                        <div class="relative mx-auto" style="width: 1280px; height: 720px;">
                            <!-- Background KYT Image - PPT Size 1280x720 -->
                            <img
                                src={bgKyt}
                                alt="KYT Background"
                                style="width: 1280px; height: 720px; object-fit: cover;"
                                class="rounded-lg border border-border"
                            />
                            <!-- Overlay Saved Image - Positioned to match PPT layout (offsetX calculation from controller) -->
                            <div class="absolute" style="left: 50px; top: 133px; width: 680px; height: 454px;">
                                <img
                                    src={savedImageUrl}
                                    alt="Hasil editing KYT"
                                    class="rounded shadow-lg object-contain"
                                />
                            </div>
                        </div>
                    {:else}
                        <div class="relative mx-auto" style="width: 1280px; height: 720px;">
                            <!-- Background KYT Image - PPT Size 1280x720 -->
                            <img
                                src={bgKyt}
                                alt="KYT Background"
                                style="width: 1280px; height: 720px; object-fit: cover;"
                                class="rounded-lg border border-border"
                            />
                            <!-- Placeholder text when no image saved -->
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="text-center text-muted-foreground bg-white/80 p-4 rounded-lg">
                                    <p class="text-sm font-medium">Belum ada gambar tersimpan</p>
                                    <p class="text-xs mt-1">Upload dan edit gambar, lalu klik Save</p>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</AdminLayout>

<style>
    canvas {
        touch-action: none;
    }
</style>
