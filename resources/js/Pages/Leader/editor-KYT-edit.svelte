<script lang="ts">
    import {onMount} from "svelte";
    import {Canvas, Circle, FabricImage, Rect} from "fabric";
    import * as Card from "$shadcn/components/ui/card";
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import {Button} from "$shadcn/components/ui/button";
    import {useForm} from "@inertiajs/svelte";
    import KytPreview from "$/Components/KytPreview.svelte";
    import {kytupdate} from "$routes/leader";
    import {assetUrl, routeUrl} from "@tunbudi06/inertia-route-helper";
    import {toBlob} from "html-to-image";
    import {toast} from "svelte-sonner";
    import {maxChartTitleLength, maxKeteranganLength, maxPenangananLength, maxPicLength} from "./KytParameter.ts";
    import Dropzone, { type DropzoneEvent } from 'svelte-dropzone-runes';

    let {bgKyt,kytDate,kytTeam,kytData} = $props();

    let dateparams:number = $state(0);

    function handleFilesSelect(e: DropzoneEvent<File>) {
        console.log(e.acceptedFiles);
        e.acceptedFiles.forEach((file: File) => {
            loadImage(file);
        });
    }

    const form  = useForm({
        foto_path: null as File | null,
        result_path: null as File | null,
        penanganan: '',
        potensi: '',
        user_name: '',
        title: '',
    });

    // Use plain Svelte variables and explicit nullable types.
    let canvasEl = $state<HTMLCanvasElement>();
    let canvas = $state<Canvas>();
    let history = $state<string[]>([]);
    let redoStack = $state<string[]>([]);
    let isLoadingState = $state(false);
    let cropRect = $state<Rect | null>(null);
    let savedImageUrl = $state<string>("");
    let previewContainerEl = $state<HTMLDivElement>();
    let strokeSize = $state<number>(4);

    function saveState() {
        if (!canvas || isLoadingState) return;
        const json = JSON.stringify(canvas.toJSON());
        history = [...history, json];
        if (history.length > 30) history = history.slice(1);
        redoStack = [];
    }

    function undo() {
        if (!canvas || history.length === 0) return;

        isLoadingState = true;

        // Save current state to redo stack
        const currentState = JSON.stringify(canvas.toJSON());
        redoStack = [...redoStack, currentState];

        // Get previous state
        const previousState = history[history.length - 1];
        history = history.slice(0, -1);

        // Load previous state
        canvas.loadFromJSON(JSON.parse(previousState)).then(() => {
            canvas!.renderAll();
            isLoadingState = false;
        });
    }

    function redo() {
        if (!canvas || redoStack.length === 0) return;

        isLoadingState = true;

        // Save current state to history
        const currentState = JSON.stringify(canvas.toJSON());
        history = [...history, currentState];

        // Get next state from redo stack
        const nextState = redoStack[redoStack.length - 1];
        redoStack = redoStack.slice(0, -1);

        // Load next state
        canvas.loadFromJSON(JSON.parse(nextState)).then(() => {
            canvas!.renderAll();
            isLoadingState = false;
        });
    }

    onMount(() => {
        dateparams = Date.now();
        $form.penanganan = kytData?.penanganan || '';
        $form.potensi = kytData?.potensi || '';
        $form.user_name = kytData?.user_name || '';
        $form.title = kytData?.title || '';
        savedImageUrl = assetUrl(kytData?.foto_path || '',{
            query:{
                t: dateparams
            }
        });

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

        // Save initial empty state
        history = [JSON.stringify(canvas.toJSON())];

        // Save state after each action
        canvas.on("object:added", () => {
            if (!isLoadingState) saveState();
        });
        canvas.on("object:modified", () => {
            if (!isLoadingState) saveState();
        });
        canvas.on("object:removed", () => {
            if (!isLoadingState) saveState();
        });

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

    function addHighlightYellow() {
        if (!canvas) return;
        const rect = new Rect({
            left: 100,
            top: 100,
            width: 120,
            height: 60,
            fill: "transparent",
            stroke: "#FACC15", // use a clear yellow (Tailwind amber-400 equivalent)
            strokeWidth: strokeSize,
            cornerColor: "#FACC15"
        });
        canvas.add(rect);
    }
    function addHighlightRed() {
        if (!canvas) return;
        const rect = new Rect({
            left: 100,
            top: 100,
            width: 120,
            height: 60,
            fill: "transparent",
            stroke: "#EF4444", // red-500
            strokeWidth: strokeSize,
            cornerColor: "#EF4444"
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
            strokeWidth: strokeSize,
        });
        canvas.add(circle);
    }

    function startCrop() {
        if (cropRect || !canvas) return;

        // Get canvas dimensions
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Define crop rect size
        const cropWidth = 200;
        const cropHeight = 150;

        // Center the crop rectangle
        const left = (canvasWidth - cropWidth) / 2;
        const top = (canvasHeight - cropHeight) / 2;

        cropRect = new Rect({
            left: left,
            top: top,
            width: cropWidth,
            height: cropHeight,
            fill: "rgba(0,0,0,0.5)",
            stroke: "#FFFFFF",
            strokeWidth: 3,
            strokeDashArray: [10, 5],
            hasRotatingPoint: false,
            cornerColor: "#FFFFFF",
            cornerSize: 12,
            transparentCorners: false,
            cornerStrokeColor: "#000000",
            borderColor: "#FFFFFF"
        });

        // Add to canvas and bring to front to ensure it's on top
        canvas.add(cropRect);
        canvas.bringObjectToFront(cropRect);
        canvas.setActiveObject(cropRect);
        canvas.renderAll();
    }

    function applyCrop() {
        if (!cropRect || !canvas) return;

        // Save the bounding rect BEFORE removing the cropRect
        const rect = cropRect.getBoundingRect();

        // Get all objects in canvas (excluding the crop rectangle)
        const allObjects = canvas.getObjects().filter(obj => obj !== cropRect);

        // Find objects that are within or intersecting the crop rectangle
        const objectsToRemove: any[] = [];
        allObjects.forEach(obj => {
            const objBounds = obj.getBoundingRect();

            // Check if object intersects with crop rectangle
            const intersects = !(
                objBounds.left + objBounds.width < rect.left ||
                objBounds.left > rect.left + rect.width ||
                objBounds.top + objBounds.height < rect.top ||
                objBounds.top > rect.top + rect.height
            );

            if (intersects) {
                objectsToRemove.push(obj);
            }
        });

        // Remove crop rectangle from canvas FIRST
        canvas.remove(cropRect);
        cropRect = null;
        canvas.renderAll();

        // Capture the crop area (with objects that will be removed)
        const dataUrl = canvas.toDataURL({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            multiplier: 1,
            format: "png"
        });

        // Remove objects that were in the crop area
        objectsToRemove.forEach(obj => {
            canvas!.remove(obj);
        });

        // Load cropped image
        FabricImage.fromURL(dataUrl).then((img) => {
            // Get canvas dimensions
            const canvasWidth = canvas!.getWidth();
            const canvasHeight = canvas!.getHeight();

            // Calculate scale to fit cropped image within canvas (optional, keep original size if fits)
            const scaleX = canvasWidth / (img.width || 1);
            const scaleY = canvasHeight / (img.height || 1);
            const scale = Math.min(scaleX, scaleY, 1); // Don't upscale, max 1

            // Calculate scaled dimensions
            const scaledWidth = (img.width || 0) * scale;
            const scaledHeight = (img.height || 0) * scale;

            // Center the cropped image on canvas
            const left = (canvasWidth - scaledWidth) / 2;
            const top = (canvasHeight - scaledHeight) / 2;

            // Position the cropped image at center
            img.set({
                originX: "left",
                originY: "top",
                scaleX: scale,
                scaleY: scale,
                left: left,
                top: top,
                selectable: true,
                evented: true,
                lockMovementX: false,
                lockMovementY: false,
                lockScalingX: false,
                lockScalingY: false,
                lockRotation: false,
                hasControls: true,
                hasBorders: true,
            });
            img.setCoords();

            canvas!.add(img);
            canvas!.setActiveObject(img);
            canvas!.renderAll();
            saveState();
        });
    }

    async function exportImage() {
        if (!canvas) return;

        // Convert canvas to Blob
        const blob = await canvas.toBlob({
            format: "png",
            multiplier: 1
        });

        if (!blob) return;

        // Create File object from Blob with timestamp
        const timestamp = new Date().getTime();
        // Set file to form
        $form.foto_path = new File([blob], `kyt-edited-${timestamp}.png`, {
            type: "image/png"
        });

        // Create URL for preview
        savedImageUrl = URL.createObjectURL(blob);
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

    async function generatePreviewThumbnail() {
        if (!previewContainerEl) {
            console.error('Preview container not found');
            return false;
        }

        try {
            // Wait a bit for the preview to fully render
            await new Promise(resolve => setTimeout(resolve, 300));

            // Find all images with blob URLs and convert them to data URLs temporarily
            const images = previewContainerEl.querySelectorAll('img');
            const originalSrcs: Map<HTMLImageElement, string> = new Map();

            for (const img of Array.from(images)) {
                if (img.src.startsWith('blob:')) {
                    // Store original src
                    originalSrcs.set(img, img.src);

                    // Convert blob to data URL
                    try {
                        const response = await fetch(img.src);
                        const blob = await response.blob();
                        const dataUrl = await new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });
                        img.src = dataUrl;
                    } catch (err) {
                        console.warn('Failed to convert blob URL for image:', err);
                    }
                }
            }

            // Wait for images to be updated
            await new Promise(resolve => setTimeout(resolve, 100));

            // Convert the preview directly to Blob with 3x quality
            const blob = await toBlob(previewContainerEl, {
                quality: 1.0,
                pixelRatio: 3, // 3x quality for better image
                cacheBust: true,
                skipAutoScale: false,
                backgroundColor: '#ffffff',
            });

            // Restore original blob URLs
            for (const [img, src] of originalSrcs.entries()) {
                img.src = src;
            }

            if (!blob) {
                throw new Error('Failed to generate blob');
            }

            // Create File object from Blob with timestamp
            const timestamp = new Date().getTime();
            $form.result_path = new File([blob], `kyt-preview-${timestamp}.png`, {
                type: "image/png"
            });

            console.log('Preview thumbnail generated successfully', blob.size);
            return true;
        } catch (error) {
            console.error('Error generating preview thumbnail:', error);
            // Show user-friendly error message
            alert('Gagal membuat thumbnail preview. Silakan coba lagi.');
            return false;
        }
    }

    async function submitKyt() {
        // Generate the preview thumbnail before submitting
        const success = await generatePreviewThumbnail();

        if (!success) {
            console.error('Failed to generate preview thumbnail, aborting submission');
            return;
        }

        $form.post(routeUrl(kytupdate({id:kytData.id})), {
            preserveScroll: true,
            onSuccess: (e) => {
                console.log(e)
                toast.success('KYT berhasil disimpan!');
            },
            onError: (errors) => {
                console.error('Error submitting KYT:', errors);
            }
        });
    }
</script>

<svelte:window onkeydown={(e) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Undo: Ctrl+Z
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
        return;
    }

    // Delete: Delete or Backspace (only if an object is selected)
    if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
        e.preventDefault();
        removeSelected();
        return;
    }
}} />

<LeaderLayout>
    <div class="space-y-6">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Editor KYT</h1>
            <p class="text-muted-foreground mt-1">Edit dan anotasi gambar Kiken Yochi Training</p>
        </div>

        <Card.Root>
            <Card.Header>
                <Card.Title>Toolbar</Card.Title>
                <Card.Description>Upload gambar dan gunakan alat di bawah ini untuk mengedit</Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="kyt-title" class="text-sm font-medium">
                            Judul KYT
                            <span class="text-xs text-muted-foreground ml-2">
                                ({$form.title.length}/{maxChartTitleLength})
                            </span>
                        </label>
                        <input
                            id="kyt-title"
                            type="text"
                            bind:value={$form.title}
                            maxlength={maxChartTitleLength}
                            placeholder="Masukkan judul KYT..."
                            class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="kyt-pic" class="text-sm font-medium">
                            Disampaikan Oleh
                            <span class="text-xs text-muted-foreground ml-2">
                                ({$form.user_name.length}/{maxPicLength})
                            </span>
                        </label>
                        <input
                            id="kyt-pic"
                            type="text"
                            bind:value={$form.user_name}
                            maxlength={maxPicLength}
                            placeholder="Nama penanggung jawab..."
                            class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="kyt-potensi" class="text-sm font-medium">
                            Potensi Bahaya
                            <span class="text-xs text-muted-foreground ml-2">
                                ({$form.potensi.length}/{maxKeteranganLength})
                            </span>
                        </label>
                        <textarea
                            id="kyt-potensi"
                            bind:value={$form.potensi}
                            maxlength={maxKeteranganLength}
                            placeholder="Jelaskan potensi bahaya..."
                            rows="4"
                            class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        ></textarea>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="kyt-penanganan" class="text-sm font-medium">
                            Penanganan
                            <span class="text-xs text-muted-foreground ml-2">
                                ({$form.penanganan.length}/{maxPenangananLength})
                            </span>
                        </label>
                        <textarea
                            id="kyt-penanganan"
                            bind:value={$form.penanganan}
                            maxlength={maxPenangananLength}
                            placeholder="Jelaskan cara penanganan..."
                            rows="4"
                            class="px-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        ></textarea>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="stroke-size" class="text-sm font-medium">
                            Ketebalan Garis (Stroke Size)
                            <span class="text-xs text-muted-foreground ml-2">
                                ({strokeSize}px)
                            </span>
                        </label>
                        <input
                            id="stroke-size"
                            type="range"
                            bind:value={strokeSize}
                            min="1"
                            max="20"
                            step="1"
                            class="w-full"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="foto-upload" class="text-sm font-medium">
                            Upload Gambar
                        </label>
                        <Dropzone id="foto-upload" multiple onDrop={handleFilesSelect} />
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Canvas dan Toolbar - Responsive Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_auto] gap-6">
            <!-- Canvas Editor -->
            <Card.Root>
                <Card.Content class="p-4">
                    <div class="overflow-x-auto overflow-y-hidden bg-muted/30 p-4 rounded-lg touch-pan-x">
                        <div class="mx-auto bg-white min-w-[680px]" style="width: 680px; height: 502px;">
                            <canvas
                                bind:this={canvasEl}
                                class="border border-border rounded-lg shadow-sm"
                                style="width: 680px; height: 502px;"
                            ></canvas>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Toolbar Buttons (Drawing & Arranging) - Di samping canvas pada lg screen -->
            <Card.Root class="lg:w-64">
                <Card.Header>
                    <Card.Title class="text-base">Drawing Tools</Card.Title>
                    <Card.Description class="text-xs">Tools untuk menggambar dan mengatur</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="flex flex-col gap-2">
                        <div class="text-xs text-muted-foreground mb-1">
                            Ketebalan Garis: {strokeSize}px
                        </div>

                        <Button variant="outline" onclick={addHighlightRed} class="justify-start">
                            <span class="inline-block w-3 h-3 rounded-sm mr-2 bg-red-500" aria-hidden="true"></span>
                            Highlight Red
                        </Button>
                        <Button variant="outline" onclick={addHighlightYellow} class="justify-start">
                            <span class="inline-block w-3 h-3 rounded-sm mr-2 bg-yellow-500" aria-hidden="true"></span>
                            Highlight Yellow
                        </Button>
                        <Button variant="outline" onclick={addCircle} class="justify-start">
                            🔴 Circle
                        </Button>
                        <Button variant="outline" onclick={removeSelected} class="justify-start">
                            🗑️ Remove Selected
                        </Button>

                        <div class="border-t border-border my-2"></div>

                        <Button variant="outline" onclick={bringToFront} class="justify-start">
                            ⏫ Bring To Front
                        </Button>
                        <Button variant="outline" onclick={bringForward} class="justify-start">
                            🔼 Bring Forward
                        </Button>
                        <Button variant="outline" onclick={sendBackward} class="justify-start">
                            🔽 Send Backward
                        </Button>
                        <Button variant="outline" onclick={sendToBack} class="justify-start">
                            ⏬ Send To Back
                        </Button>

                        <div class="border-t border-border my-2"></div>

                        <Button variant="outline" onclick={startCrop} class="justify-start">
                            ✂️ Crop
                        </Button>
                        <Button variant="outline" onclick={applyCrop} class="justify-start">
                            ✅ Apply Crop
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Action Buttons (Undo/Redo/Save) - Di bawah canvas pada lg, di samping pada xl -->
            <Card.Root class="lg:col-span-2 xl:col-span-1 xl:w-64">
                <Card.Header>
                    <Card.Title class="text-base">Actions</Card.Title>
                    <Card.Description class="text-xs">Undo, Redo, dan Simpan</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="flex flex-row lg:flex-row xl:flex-col gap-2">
                        <Button variant="outline" onclick={undo} class="justify-start flex-1">
                            ↩️ Undo
                        </Button>
                        <Button variant="outline" onclick={redo} class="justify-start flex-1">
                            ↪️ Redo
                        </Button>
                        <Button onclick={exportImage} class="justify-start flex-1">
                            💾 Tambah Foto
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>

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
                    <KytPreview
                        bind:elementId={previewContainerEl}
                        {bgKyt}
                        {kytDate}
                        {kytTeam}
                        kytTitle={$form.title}
                        {savedImageUrl}
                        kytPic={$form.user_name}
                        kytPotensi={$form.potensi}
                        kytPenanganan={$form.penanganan}
                    />
                </div>
                <div class="mt-4">
                    <Button
                        onclick={submitKyt}
                        class="w-full"
                        disabled={$form.processing}
                    >
                        {$form.processing ? 'Menyimpan...' : 'Simpan KYT'}
                    </Button>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</LeaderLayout>

<style>
    canvas {
        touch-action: none;
    }
</style>
