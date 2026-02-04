import type PptxGenJS from "pptxgenjs";
import {assetUrl, buildRoute} from "@tunbudi06/inertia-route-helper";

    // Types for KYT data and Team
export interface Team {
	team_name: string;
    team_description: string;
	id?: number | string;
}

export interface KytData {
	user_name: string;
	title: string;
	foto_path?: string | null;
	created_at?: string | number | Date;
	potensi?: string | PptxGenJS.TextProps[];
	penanganan?: string | PptxGenJS.TextProps[];
	result_path?: string | null;
    kyt_date_list: {
        kyt_date: string | number | Date;
    }
}

export async function downloadKytPptx(kytData: KytData, team: Team | null) {
    const pptx = await initPptxKyt(kytData.user_name, kytData.title);
    // Create main KYT slide
    SliceAdderKyt(pptx, kytData, team);

    return pptx
}

export async function initPptxKyt(user_name:string, title:string) {
    // Import PptxGenJS dynamically
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();

    // Set presentation properties to match PPT size (1280x720 = 16:9)
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = user_name;
    pptx.title = `KYT - ${title}`;

    return pptx;
}

export function SliceAdderKyt(pptx: PptxGenJS, kytData: KytData, team: Team | null) {
    // Create main KYT slide
    const slide = pptx.addSlide();

    // 1. Add Background Image (bg-kyt.jpg) - Full slide
    slide.addImage({
        path: buildRoute('/assets/img/bg-kyt.jpg'),
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        sizing: {
            type: 'contain',
            w: '100%',
            h: '100%'
        }
    });

    // 2. Add Team Name (if available)
    // Position: offsetX: 750px, offsetY: 0px, width: 530px, height: 10px (in 1280x720)
    // Convert to inches: x=5.86", y=0", w=4.14", h=0.08"
    if (team && team.team_name) {
        slide.addText(team.team_name, {
            x: 5.86,
            y: 0,
            w: 4.14,
            h: 0.5,
            fontSize: 18,
            bold: true,
            color: '404040',
            align: 'center',
            valign: 'top',
            shadow: {
                type: 'outer',
                blur: 3,
                offset: 2.5,
                angle: 45,
                color: '000000',
                opacity: 0.4
            }
        });
    }

    // 3. Add Title Text Box
    // Position: offsetX: 50px, offsetY: 80px, width: 680px, height: 50px
    // Convert: x=0.39", y=0.63", w=5.31", h=0.39"
    slide.addText(kytData.title.toUpperCase(), {
        x: 0.39,
        y: 0.53,
        w: 5.31,
        h: 0.5,
        fontSize: 15,
        bold: true,
        color: '000000',
        align: 'center',
        valign: 'middle'
    });

    // 4. Add Edited Image (foto_path) - The edited canvas image
    // Position: offsetX: 50px, offsetY: 133px, width: 680px, height: 502px
    // Convert: x=0.39", y=1.04", w=5.31", h=3.92"
    if (kytData.foto_path) {
        const fotoUrl = assetUrl(kytData.foto_path,{query:{
                t: Date.now()
            }});
        slide.addImage({
            path: fotoUrl,
            x: 0.39,
            y: 1.04,
            w: 5.31,
            h: 3.92,
            sizing: {
                type: 'contain',
                w: 5.31,
                h: 3.92
            }
        });
    }

    // 5. Add Date (bottom right)
    // Position: offsetX: 780px, offsetY: 650px
    // Convert: x=6.09", y=5.08"
    const formattedDate = new Date(kytData.kyt_date_list.kyt_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    slide.addText(formattedDate, {
        x: 6.09,
        y: 5.08,
        w: 3.5,
        h: 0.5,
        fontSize: 28,
        bold: true,
        color: '2F5597',
        align: 'right',
        valign: 'bottom',
        shadow: {
            type: 'outer',
            blur: 3,
            offset: 2.5,
            angle: 45,
            color: '000000',
            opacity: 0.4
        }
    });

    // 6. Add "DISAMPAIKAN OLEH :" Label
    // Position: offsetX: 800px, offsetY: 100px, width: 430px, height: 35px
    // Convert: x=6.25", y=0.78", w=3.36", h=0.27"
    slide.addText('DISAMPAIKAN OLEH :', {
        x: 6.25,
        y: 0.78,
        w: 3.36,
        h: 0.35,
        fontSize: 18,
        bold: true,
        color: 'FF0000',
        align: 'left',
        valign: 'top'
    });

    // 7. Add PIC Name Value
    // Position: offsetX: 800px, offsetY: 125px, width: 430px, height: 40px
    // Convert: x=6.25", y=0.98", w=3.36", h=0.31"
    slide.addText(kytData.user_name, {
        x: 6.25,
        y: 1.03,
        w: 3.36,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: '000000',
        align: 'left',
        valign: 'top'
    });

    // 8. Add "POTENSI BAHAYA :" Label
    // Position: offsetX: 800px, offsetY: 180px, width: 430px, height: 35px
    // Convert: x=6.25", y=1.41", w=3.36", h=0.27"
    slide.addText('POTENSI BAHAYA :', {
        x: 6.25,
        y: 1.48,
        w: 3.36,
        h: 0.35,
        fontSize: 18,
        bold: true,
        color: 'FF0000',
        align: 'left',
        valign: 'top'
    });

    // 9. Add Potensi Bahaya Value
    // Position: offsetX: 800px, offsetY: 205px, width: 430px, height: 158px
    // Convert: x=6.25", y=1.60", w=3.36", h=1.23"
    // @ts-ignore
    slide.addText(kytData.potensi, {
        x: 6.25,
        y: 1.70,
        w: 3.36,
        h: 1.5,
        fontSize: 15,
        bold: false,
        color: '000000',
        align: 'left',
        valign: 'top',
        wrap: true,
        bullet: true
    });

    // 10. Add "PENANGANAN :" Label
    // Position: offsetX: 800px, offsetY: 380px, width: 430px, height: 35px
    // Convert: x=6.25", y=2.97", w=3.36", h=0.27"
    slide.addText('PENANGANAN :', {
        x: 6.25,
        y: 3.12,
        w: 3.36,
        h: 0.35,
        fontSize: 18,
        bold: true,
        color: 'FF0000',
        align: 'left',
        valign: 'top'
    });

    // 11. Add Penanganan Value
    // Position: offsetX: 800px, offsetY: 405px, width: 430px, height: 202px
    // Convert: x=6.25", y=3.16", w=3.36", h=1.58"
    // @ts-ignore
    slide.addText(kytData.penanganan, {
        x: 6.25,
        y: 3.35,
        w: 3.36,
        h: 1.7,
        fontSize: 15,
        bold: false,
        color: '000000',
        align: 'left',
        valign: 'top',
        wrap: true,
        bullet: true
    });


}

export function EmptySliceAdderKyt(pptx: PptxGenJS,team: Team | null) {
    // Create an empty slide
    const slide = pptx.addSlide();

    // Add Background Image (bg-kyt.jpg) - Full slide
    slide.addImage({
        path: buildRoute('/assets/img/bg-kyt.jpg'),
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        sizing: {
            type: 'contain',
            w: '100%',
            h: '100%'
        }
    });

    // 2. Add Team Name (if available)
    if (team && team.team_name) {
        slide.addText(team.team_name, {
            x: 5.86,
            y: 0,
            w: 4.14,
            h: 0.5,
            fontSize: 18,
            bold: true,
            color: '404040',
            align: 'center',
            valign: 'top',
            shadow: {
                type: 'outer',
                blur: 3,
                offset: 2.5,
                angle: 45,
                color: '000000',
                opacity: 0.4
            }
        });
    }

    // Add "No KYT Data" text in the center
    slide.addText('NO KYT SUBMITTED', {
        x: 2,
        y: 3,
        w: 6,
        h: 1,
        fontSize: 32,
        bold: true,
        color: 'FF0000',
        align: 'center',
        valign: 'middle'
    });
}
