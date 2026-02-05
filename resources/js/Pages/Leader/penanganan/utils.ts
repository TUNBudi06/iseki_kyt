import {Canvas, Circle, FabricImage, Rect} from "fabric";
import {onMount} from "svelte";
// Use plain Svelte variables and explicit nullable types.
let canvasEl = $state<HTMLCanvasElement>();
let canvas = $state<Canvas>();
let history = $state<string[]>([]);
let redoStack = $state<string[]>([]);
let cropRect = $state<Rect | null>(null);
let kytImageUrl = $state<string>("");
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

function addHighlightYellow() {
    if (!canvas) return;
    const rect = new Rect({
        left: 100,
        top: 100,
        width: 120,
        height: 60,
        fill: "transparent",
        stroke: "#FACC15", // use a clear yellow (Tailwind amber-400 equivalent)
        strokeWidth: 2,
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
        strokeWidth: 2,
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
    // $form.foto_path = new File([blob], `kyt-edited-${timestamp}.png`, {
    //     type: "image/png"
    // });

    // Create URL for preview
    // savedImageUrl = URL.createObjectURL(blob);
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

export {

}
