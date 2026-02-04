<script lang="ts">
    import {onMount} from "svelte";
    import {Canvas, Circle, FabricImage, Rect} from "fabric";
    import * as Card from "$shadcn/components/ui/card";
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import {Button} from "$shadcn/components/ui/button";
    import {useForm} from "@inertiajs/svelte";
    import KytPreview from "$/Components/KytPreview.svelte";
    import {kytstore, kytupdate} from "$routes/leader";
    import {assetUrl, routeUrl} from "@tunbudi06/inertia-route-helper";
    import {toBlob} from "html-to-image";
    import {toast} from "svelte-sonner";

    let {bgKyt,kytDate,kytTeam,kytData} = $props();

    const form  = useForm({
        foto_path: null as File | null,
        result_path: null as File | null,
        penanganan: '',
        potensi: '',
        user_name: '',
        title: '',
    });

    onMount(() => {
        $form.penanganan = kytData?.penanganan || '';
        $form.potensi = kytData?.potensi || '';
        $form.user_name = kytData?.user_name || '';
        $form.title = kytData?.title || '';
        savedImageUrl = assetUrl(kytData?.foto_path || '',{query:{
                t: Date.now()
            }});
    });

    // Use plain Svelte variables and explicit nullable types.
    let canvasEl = $state<HTMLCanvasElement>();
    let canvas = $state<Canvas>();
    let history = $state<string[]>([]);
    let redoStack = $state<string[]>([]);
    let cropRect = $state<Rect | null>(null);
    let savedImageUrl = $state<string>("");
    let previewContainerEl = $state<HTMLDivElement>();

    const maxChartTitleLength = 95;
    const maxTeamLength = 26;
    const maxPicLength = 10;
    const maxKeteranganLength = 174;
    const maxPenangananLength = 180;

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
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Canvas dan Toolbar - Responsive Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_auto] gap-6">
            <!-- Canvas Editor -->
            <Card.Root>
                <Card.Content class="p-4">
                    <div class="overflow-x-auto overflow-y-auto max-w-full p-4 bg-white md:overflow-x-hidden md:overflow-y-hidden md:p-0 md:bg-transparent">
                        <canvas
                            bind:this={canvasEl}
                            class="border border-border rounded-lg w-170 h-125.5"
                        ></canvas>
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
                        <Button variant="outline" onclick={addHighlight} class="justify-start">
                            🟡 Highlight
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
