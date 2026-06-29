import {assetUrl} from "@tunbudi06/inertia-route-helper";
import {toast} from "vue-sonner";

export async function downloadKytImage({result_path, title}: {result_path: string, title: string},dateparams:number) {
    try {
        const imageUrl = assetUrl(result_path,{query:{
                t: dateparams


            }});
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `KYT_${title.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Image downloaded successfully!');
    } catch (error) {
        toast.error('Failed to download image');
        console.error('Download error:', error);
    }
}
