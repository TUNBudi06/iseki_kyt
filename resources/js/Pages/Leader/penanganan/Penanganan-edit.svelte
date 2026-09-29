<script lang="ts">
    import LeaderLayout from "$/Layouts/LeaderLayout.svelte";
    import * as Card from "$shadcn/components/ui/card/index.ts";
    import * as Field from "$shadcn/components/ui/field/index.js";
    import * as Tooltip from "$shadcn/components/ui/tooltip/index.js";
    import {assetUrl, route} from "@tunbudi06/inertia-route-helper";
    import {useForm} from "@inertiajs/svelte";
    import {Input} from "$shadcn/components/ui/input";
    import {Button} from "$shadcn/components/ui/button";
    import {Canvas, Circle, FabricImage, Rect} from "fabric";
    import Dropzone, { type DropzoneEvent } from 'svelte-dropzone-runes';
    import {onMount} from "svelte";
    import {maxChartTitleLength} from "$/Pages/Leader/KytParameter.ts";
    import {toBlob} from "html-to-image";
    import {penangananupdate} from "$routes/leader";
    import {toast} from "svelte-sonner";

    let { kyt, penanganan } = $props();

    function handleFilesSelect(e: DropzoneEvent<File>) {
        e.acceptedFiles.forEach((file: File) => {
            loadImage(file);
        });
    }

    const form = useForm({
        title: penanganan.penanganan_title || '',
        foto_path: null as File | null,
        result_path: null as File | null,
    });

    let canvasEl = $state<HTMLCanvasElement>();
    let previewContainerEl = $state<HTMLDivElement>();
    let canvas = $state<Canvas>();
    let history = $state<string[]>([]);
    let redoStack = $state<string[]>([]);
    let isLoadingState = $state(false);
    let cropRect = $state<Rect | null>(null);
    let penangananUrlImage = $state<string>("");
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
        const currentState = JSON.stringify(canvas.toJSON());
        redoStack = [...redoStack, currentState];
        const previousState = history[history.length - 1];
        history = history.slice(0, -1);
        canvas.loadFromJSON(JSON.parse(previousState)).then(() => {
            canvas!.renderAll();
            isLoadingState = false;
        });
    }

    function redo() {
        if (!canvas || redoStack.length === 0) return;
        isLoadingState = true;
        const currentState = JSON.stringify(canvas.toJSON());
        history = [...history, currentState];
        const nextState = redoStack[redoStack.length - 1];
        redoStack = redoStack.slice(0, -1);
        canvas.loadFromJSON(JSON.parse(nextState)).then(() => {
            canvas!.renderAll();
            isLoadingState = false;
        });
    }

    onMount(() => {
        if (!canvasEl) return;

        canvas = new Canvas(canvasEl, {
            selection: true,
            preserveObjectStacking: true
        });

        canvas.setDimensions({ width: 1200, height: 600 });
        history = [JSON.stringify(canvas.toJSON())];

        // Load existing foto_path onto canvas if available
        if (penanganan.foto_path) {
            const existingUrl = assetUrl(penanganan.foto_path);
            FabricImage.fromURL(existingUrl).then((img) => {
                const canvasWidth = canvas!.getWidth();
                const canvasHeight = canvas!.getHeight();
                const scaleX = canvasWidth / (img.width || 1);
                const scaleY = canvasHeight / (img.height || 1);
                const scale = Math.min(scaleX, scaleY);
                const scaledWidth = (img.width || 0) * scale;
                const scaledHeight = (img.height || 0) * scale;
                img.set({
                    originX: "left",
                    originY: "top",
                    scaleX: scale,
                    scaleY: scale,
                    left: (canvasWidth - scaledWidth) / 2,
                    top: (canvasHeight - scaledHeight) / 2,
                    selectable: true,
                    evented: true,
                });
                img.setCoords();
                canvas!.add(img);
                canvas!.renderAll();
                saveState();
            });
        }

        canvas.on("object:added", () => { if (!isLoadingState) saveState(); });
        canvas.on("object:modified", () => { if (!isLoadingState) saveState(); });
        canvas.on("object:removed", () => { if (!isLoadingState) saveState(); });

        return () => { canvas?.dispose(); };
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
                const scale = Math.min(scaleX, scaleY);
                const scaledWidth = (img.width || 0) * scale;
                const scaledHeight = (img.height || 0) * scale;
                img.set({
                    originX: "left",
                    originY: "top",
                    scaleX: scale,
                    scaleY: scale,
                    left: (canvasWidth - scaledWidth) / 2,
                    top: (canvasHeight - scaledHeight) / 2,
                    selectable: true,
                    evented: true,
                    hasControls: true,
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
        canvas.add(new Rect({
            left: 100, top: 100, width: 120, height: 60,
            fill: "transparent", stroke: "#FACC15", strokeWidth: strokeSize, cornerColor: "#FACC15"
        }));
    }

    function addHighlightRed() {
        if (!canvas) return;
        canvas.add(new Rect({
            left: 100, top: 100, width: 120, height: 60,
            fill: "transparent", stroke: "#EF4444", strokeWidth: strokeSize, cornerColor: "#EF4444"
        }));
    }

    function addCircle() {
        if (!canvas) return;
        canvas.add(new Circle({
            left: 150, top: 150, radius: 40,
            fill: "transparent", stroke: "red", strokeWidth: strokeSize
        }));
    }

    function startCrop() {
        if (cropRect || !canvas) return;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const cropWidth = 300;
        const cropHeight = 200;
        cropRect = new Rect({
            left: (canvasWidth - cropWidth) / 2,
            top: (canvasHeight - cropHeight) / 2,
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
        canvas.add(cropRect);
        canvas.bringObjectToFront(cropRect);
        canvas.setActiveObject(cropRect);
        canvas.renderAll();
    }

    function applyCrop() {
        if (!cropRect || !canvas) return;
        const rect = cropRect.getBoundingRect();
        const allObjects = canvas.getObjects().filter(obj => obj !== cropRect);
        const objectsToRemove: any[] = [];
        allObjects.forEach(obj => {
            const objBounds = obj.getBoundingRect();
            const intersects = !(
                objBounds.left + objBounds.width < rect.left ||
                objBounds.left > rect.left + rect.width ||
                objBounds.top + objBounds.height < rect.top ||
                objBounds.top > rect.top + rect.height
            );
            if (intersects) objectsToRemove.push(obj);
        });
        canvas.remove(cropRect);
        cropRect = null;
        canvas.renderAll();
        const dataUrl = canvas.toDataURL({
            left: rect.left, top: rect.top, width: rect.width, height: rect.height,
            multiplier: 1, format: "png"
        });
        objectsToRemove.forEach(obj => canvas!.remove(obj));
        FabricImage.fromURL(dataUrl).then((img) => {
            const canvasWidth = canvas!.getWidth();
            const canvasHeight = canvas!.getHeight();
            const scale = Math.min(canvasWidth / (img.width || 1), canvasHeight / (img.height || 1), 1);
            const scaledWidth = (img.width || 0) * scale;
            const scaledHeight = (img.height || 0) * scale;
            img.set({
                originX: "left", originY: "top",
                scaleX: scale, scaleY: scale,
                left: (canvasWidth - scaledWidth) / 2,
                top: (canvasHeight - scaledHeight) / 2,
                selectable: true, evented: true,
                hasControls: true, hasBorders: true,
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
        const blob = await canvas.toBlob({ format: "png", multiplier: 1, enableRetinaScaling: true });
        if (!blob) return;
        const timestamp = new Date().getTime();
        $form.foto_path = new File([blob], `kyt-edited-${timestamp}.png`, { type: "image/png" });
        penangananUrlImage = URL.createObjectURL(blob);
    }

    function bringForward() {
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj) { canvas.bringObjectForward(obj); canvas.renderAll(); saveState(); }
    }

    function sendBackward() {
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj) { canvas.sendObjectBackwards(obj); canvas.renderAll(); saveState(); }
    }

    function bringToFront() {
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj) { canvas.bringObjectToFront(obj); canvas.renderAll(); saveState(); }
    }

    function sendToBack() {
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj) { canvas.sendObjectToBack(obj); canvas.renderAll(); saveState(); }
    }

    function removeSelected() {
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj) { canvas.remove(obj); saveState(); }
    }

    function keyPressFunction(event: KeyboardEvent) {
        if (!canvas) return;
        if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
            event.preventDefault(); undo(); return;
        }
        if ((event.ctrlKey && event.key === 'y') || (event.ctrlKey && event.shiftKey && event.key === 'z')) {
            event.preventDefault(); redo(); return;
        }
        if ((event.key === 'Delete' || event.key === 'Backspace') && canvas.getActiveObject()) {
            event.preventDefault(); removeSelected(); return;
        }
    }

    async function generatePreviewThumbnail() {
        if (!previewContainerEl) return false;
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const images = previewContainerEl.querySelectorAll('img');
            const originalSrcs: Map<HTMLImageElement, string> = new Map();
            for (const img of Array.from(images)) {
                if (img.src.startsWith('blob:')) {
                    originalSrcs.set(img, img.src);
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
                        console.warn('Failed to convert blob URL:', err);
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            const blob = await toBlob(previewContainerEl, {
                quality: 1.0, pixelRatio: 3, cacheBust: true,
                skipAutoScale: false, backgroundColor: '#ffffff',
            });
            for (const [img, src] of originalSrcs.entries()) { img.src = src; }
            if (!blob) throw new Error('Failed to generate blob');
            const timestamp = new Date().getTime();
            $form.result_path = new File([blob], `kyt-preview-${timestamp}.png`, { type: "image/png" });
            return true;
        } catch (error) {
            console.error('Error generating preview thumbnail:', error);
            alert('Gagal membuat thumbnail preview. Silakan coba lagi.');
            return false;
        }
    }

    async function submitForm(event: Event) {
        event.preventDefault();
        const success = await generatePreviewThumbnail();
        if (!success) return;

        $form.submit(route(penangananupdate({ id: penanganan.id })), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Penanganan berhasil diperbarui!');
            },
            onError: (errors) => {
                console.error('Error updating penanganan:', errors);
            }
        });
    }
</script>

<svelte:head>
    <title>Edit Penanganan - Leader Dashboard</title>
</svelte:head>

<svelte:window onkeydown={keyPressFunction} />

<LeaderLayout>
    <div class="space-y-6">
        <div>
            <h3 class="font-bold text-3xl tracking-tight">Edit Penanganan</h3>
            <span class="text-muted-foreground mt-1">Edit penanganan untuk kiken yochi training</span>
        </div>

        <Card.Root>
            <Card.Header class="space-y-0">
                <Card.Title class="w-full text-center font-bold text-3xl">KYT Preview</Card.Title>
                <Card.Description class="w-full text-center">
                    Berikut adalah preview KYT yang telah dibuat
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="overflow-x-auto">
                    <div class="relative mx-auto max-w-full" style="width: 1280px; height: 680px;">
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
                <Card.Title class="w-full text-center font-bold text-3xl">Form Edit Penanganan</Card.Title>
                <Card.Description class="w-full text-center">
                    Edit form penanganan pada KYT
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <Field.Set>
                    <Field.Group>
                        <Field.Field>
                            <Field.Label for="title">Masukkan Title:
                                <span class="text-xs text-muted-foreground ml-2">
                                    ({$form.title.length}/{maxChartTitleLength})
                                </span>
                            </Field.Label>
                            <Input type="text" maxlength={maxChartTitleLength} bind:value={$form.title} id="title" placeholder="Masukkan Title" />
                        </Field.Field>
                        <Field.Field>
                            <Field.Label for="foto_path">Upload Gambar Penanganan (kosongkan jika tidak ingin mengganti):</Field.Label>
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
                        <Field.Group class="flex-row">
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <Field.Label for="strokeSize">Stroke Size:</Field.Label>
                                    <Input type="number" id="strokeSize" min="1" max="20" bind:value={strokeSize} class="w-20" />
                                </Tooltip.Trigger>
                                <Tooltip.Content><p>Ukuran garis</p></Tooltip.Content>
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

                        <Button variant="outline" onclick={bringToFront} class="justify-start">⏫ Bring To Front</Button>
                        <Button variant="outline" onclick={bringForward} class="justify-start">🔼 Bring Forward</Button>
                        <Button variant="outline" onclick={sendBackward} class="justify-start">🔽 Send Backward</Button>
                        <Button variant="outline" onclick={sendToBack} class="justify-start">⏬ Send To Back</Button>

                        <div class="border-t border-border my-2"></div>

                        <Button variant="outline" onclick={startCrop} class="justify-start">✂️ Crop</Button>
                        <Button variant="outline" onclick={applyCrop} class="justify-start">✅ Apply Crop</Button>
                    </div>

                    <div class="overflow-x-auto overflow-y-hidden bg-muted/30 p-4 rounded-lg touch-pan-x">
                        <div class="mx-auto bg-white min-w-[1200px]" style="width: 1200px; height: 600px;">
                            <canvas
                                bind:this={canvasEl}
                                class="border border-border rounded-lg shadow-sm"
                                style="width: 1200px; height: 600px;"
                            ></canvas>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button variant="outline" onclick={undo} class="justify-start flex-1">↩️ Undo</Button>
                        <Button variant="outline" onclick={redo} class="justify-start flex-1">↪️ Redo</Button>
                        <Button onclick={exportImage} class="justify-start flex-1">💾 Lihat Hasil</Button>
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
                        <div bind:this={previewContainerEl} class="relative mx-auto w-300 h-170 bg-pink-200 border-4 p-2 border-black flex items-center justify-center">
                            {#if penangananUrlImage}
                                <div class="absolute top-0 left-0 w-full flex items-center max-w-300 justify-center pt-2">
                                    <span class="font-bold text-2xl leading-tight text-center text-black uppercase">
                                        {$form.title}
                                    </span>
                                </div>
                                <div class="absolute inset-0 left-0 top-16 w-300 h-150">
                                    <img src={penangananUrlImage} alt="Hasil editing KYT" class="rounded shadow-lg w-full h-full" />
                                </div>
                            {:else}
                                <span class="font-bold text-2xl leading-tight text-center max-w-300 text-wrap text-black uppercase">
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
                            {:else if $form.title}
                                Simpan Perubahan Penanganan
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

