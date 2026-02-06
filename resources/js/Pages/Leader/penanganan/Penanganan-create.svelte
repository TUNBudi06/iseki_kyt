<script lang="ts">
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import * as Tooltip from "$shadcn/components/ui/tooltip/index.ts";
    import * as Card from "$shadcn/components/ui/card";
    import * as Field from "$shadcn/components/ui/field";
    import {assetUrl, route} from "@tunbudi06/inertia-route-helper";
    import {useForm} from "@inertiajs/svelte";
    import {Input} from "$shadcn/components/ui/input";
    import {Button} from "$shadcn/components/ui/button";
    import {Canvas, Circle, FabricImage, Rect} from "fabric";
    import Dropzone, { type DropzoneEvent } from 'svelte-dropzone-runes';
    import {onMount} from "svelte";
    import {maxChartTitleLength} from "$/Pages/Leader/KytParameter.ts";
    import {toBlob} from "html-to-image";
    import {kytstore, penangananstore} from "$routes/leader";
    import {toast} from "svelte-sonner";

    let { kyt } = $props();

    let files = $state<File[]>();

    function handleFilesSelect(e: DropzoneEvent<File>) {
        console.log(e.acceptedFiles);
        e.acceptedFiles.forEach((e: File) => {
            loadImage(e);
        });
    }


    const form = useForm({
        title: '',
        kyt_list_id: 0,
        foto_path: null as File | null,
        result_path: null as File | null,
    });

    // Use plain Svelte variables and explicit nullable types.
    let canvasEl = $state<HTMLCanvasElement>();
    let previewContainerEl = $state<HTMLDivElement>();
    let canvas = $state<Canvas>();
    let history = $state<string[]>([]);
    let redoStack = $state<string[]>([]);
    let cropRect = $state<Rect | null>(null);
    let penangananUrlImage = $state<string>("");
    let strokeSize = $state<number>(4);
    let dateparams = $state()

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
        dateparams = Date.now();
        $form.kyt_list_id = kyt.id;

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
            width: 1200,
            height: 600
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
            multiplier: 1,
            enableRetinaScaling: true
        });

        if (!blob) return;

        // Create File object from Blob with timestamp
        const timestamp = new Date().getTime();
        // Set file to form
        $form.foto_path = new File([blob], `kyt-edited-${timestamp}.png`, {
            type: "image/png"
        });

        // Create URL for preview
        penangananUrlImage = URL.createObjectURL(blob);
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

    function keyPressFunction(event: KeyboardEvent) {
        if (event.key === "Delete") {
            if(!canvas?.getActiveObject()) return;
            removeSelected();
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

    async function submitForm(event: Event) {
        event.preventDefault();
        // Generate the preview thumbnail before submitting
        const success = await generatePreviewThumbnail();

        if (!success) {
            console.error('Failed to generate preview thumbnail, aborting submission');
            return;
        }

        $form.submit(route(penangananstore()), {
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

<svelte:head>
    <title>Create Penanganan - Leader Dashboard</title>
</svelte:head>

<svelte:window onkeydown={keyPressFunction} />

<LeaderLayout >
    <div class="space-y-6">
        <div>
            <h3 class="font-bold text-3xl tracking-tight">Tambahkan Penanganan</h3>
            <span class="text-muted-foreground mt-1">Tambahkan penanganan untuk kiken yochi training</span>
        </div>

        <Card.Root>
            <Card.Header class="space-y-0">
                <Card.Title class="w-full text-center font-bold text-3xl">Penanganan</Card.Title>
                <Card.Description class="w-full text-center">
                    Berikut adalah preview KYT yang telah dibuat
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="overflow-x-auto">
                    <div class="relative mx-auto max-w-full" style="width: 1280px; height: 680px;">
                        <!-- Background KYT Image - PPT Size 1280x680 -->
                        <img
                            src={assetUrl(kyt.result_path)}
                            alt="KYT Background"
                            class="rounded-lg border border-border object-contain w-full h-full"
                        />
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header class="space-y-0">
                <Card.Title class="w-full text-center font-bold text-3xl">Form Penanganan</Card.Title>
                <Card.Description class="w-full text-center">
                    Isi form berikut untuk menambahkan penanganan pada KYT
                </Card.Description>
            </Card.Header>
            <Card.Content>
                    <Field.Set>
                        <Field.Group>
                            <Field.Field>
                                <Field.Label for="title">Masukkkan Title: (Optional)
                                    <span class="text-xs text-muted-foreground ml-2">
                                        ({$form.title.length}/{maxChartTitleLength})
                                    </span>
                                </Field.Label>
                                <Input type="text" maxlength={maxChartTitleLength} bind:value={$form.title} id="title" placeholder="Masukkan Title" />
                            </Field.Field>
                            <Field.Field>
                                <Field.Label for="foto_path">Upload Gambar Penanganan:</Field.Label>
                                <Dropzone id="foto_path" multiple onDrop={handleFilesSelect} />
                            </Field.Field>
                        </Field.Group>
                    </Field.Set>
            </Card.Content>
        </Card.Root>
        <div class="space-y-6">
            <!-- Canvas Editor -->
            <Card.Root>
                <Card.Content class="p-4">
                    <div class="flex gap-2 pb-4 flex-wrap">
<!--                        add stroke size field-->
                        <Field.Group class="flex-row">
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <Field.Label for="strokeSize">Stroke Size:</Field.Label>
                                    <Input
                                        type="number"
                                        id="strokeSize"
                                        min="1"
                                        max="20"
                                        bind:value={strokeSize}
                                        class="w-20"
                                    />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p>Add to library</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Field.Group>

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
                    <div class="overflow-x-auto overflow-y-hidden bg-muted/30 p-4 rounded-lg">
                        <div class="mx-auto bg-white" style="width: 1200px; height: 600px;">
                            <canvas
                                bind:this={canvasEl}
                                class="border border-border rounded-lg shadow-sm w-7xl h-150"
                            ></canvas>
                        </div>
                    </div>
                    <div class="flex flex-row gap-2">
                        <Button variant="outline" onclick={undo} class="justify-start flex-1">
                            ↩️ Undo
                        </Button>
                        <Button variant="outline" onclick={redo} class="justify-start flex-1">
                            ↪️ Redo
                        </Button>
                        <Button onclick={exportImage} class="justify-start flex-1">
                            💾 Lihat Hasil
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header>
                    <Card.Title>Kiken Yochi Training - Preview</Card.Title>
                    <Card.Description>
                        {#if penangananUrlImage}
                            Hasil gambar yang telah disimpan
                        {:else}
                            Klik "💾 Lihat Hasil" untuk melihat hasil gambar di sini
                        {/if}
                    </Card.Description>
                </Card.Header>
                <Card.Content class="p-4">
                    <div class="overflow-x-auto">
                        <div bind:this={previewContainerEl} class="relative mx-auto w-7xl h-170 bg-pink-200 border-4 p-2 border-black flex items-center justify-center">
                            {#if (penangananUrlImage) }
                                <!-- Title at top when photo exists -->
                                <div class="absolute top-0 left-0 w-full flex items-center max-w-300 justify-center pt-2">
                                    <span
                                        class="font-bold text-2xl leading-tight text-center text-black uppercase"
                                    >
                                        {$form.title}
                                    </span>
                                </div>
                                <!-- Photo in the middle -->
                                <div class="absolute inset-0 left-10 top-16 w-300 h-150">
                                    <img
                                        src={penangananUrlImage}
                                        alt="Hasil editing KYT"
                                        class="rounded shadow-lg w-full h-full"
                                    />
                                </div>
                            {:else}
                                <!-- Title centered when no photo -->
                                <span
                                    class="font-bold text-2xl leading-tight text-center max-w-300 text-wrap text-black uppercase"
                                >
                                    {$form.title || 'Masukkan judul untuk preview'}
                                </span>

                            {/if}
                        </div>
                    </div>
                    <div class="mt-4">
                        <Button
                            onclick={submitForm}
                            class="w-full"
                            disabled={$form.processing || !$form.title}
                        >
                            {#if $form.processing}
                                Menyimpan...
                            {:else if ($form.title)}
                                Simpan Penanganan KYT
                            {:else}
                                Tambahkan judul terlebih dahulu
                            {/if}
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</LeaderLayout>
