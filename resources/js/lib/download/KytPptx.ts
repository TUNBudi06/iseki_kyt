import type PptxGenJS from "pptxgenjs";
import {assetUrl, buildRoute} from "@tunbudi06/inertia-route-helper";
import { PptEL, elInStyle, mmToIn, KYT_WIDTH_MM, KYT_HEIGHT_MM } from '$lib/kytDimensions.ts'

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
    },
    penanganans: {
        penanganan_title: string;
        foto_path?: string | null;
    }
}

export interface PenangananData {
	title: string;
	foto_path?: string | null;
	user_name?: string;
}

export async function downloadKytPptx(kytData: KytData, team: Team | null) {
    const pptx = await initPptxKyt(kytData.user_name, kytData.title);
    SliceAdderKyt(pptx, kytData, team);
        if(kytData.penanganans){
            PenangananSliceKyt(pptx, kytData.penanganans.penanganan_title, kytData.penanganans.foto_path);
        } else  {
            PenangananSliceKyt(pptx, "Penanganan Belum submit");
        }
    return pptx
}

export async function initPptxKyt(user_name:string, title:string) {
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = user_name;
    pptx.title = `KYT - ${title}`;
    return pptx;
}

const COLORS = {
  team: '404040',
  title: '000000',
  date: '2F5597',
  label: 'FF0000',
  value: '000000',
}

function shadow() {
  return {
    type: 'outer' as const,
    blur: 3,
    offset: 2.5,
    angle: 45,
    color: '000000',
    opacity: 0.4,
  }
}

export function SliceAdderKyt(pptx: PptxGenJS, kytData: KytData, team: Team | null) {
    const slide = pptx.addSlide();

    slide.addImage({
        path: buildRoute('/assets/img/bg-kyt.jpg'),
        x: 0, y: 0, w: '100%', h: '100%',
        sizing: { type: 'contain', w: '100%', h: '100%' }
    });

    if (team && team.team_name) {
        slide.addText(team.team_name, {
            ...elInStyle(PptEL.team),
            fontSize: PptEL.team.fontSizePt,
            bold: true,
            color: COLORS.team,
            align: 'center',
            valign: 'top',
            shadow: shadow()
        });
    }

    slide.addText(kytData.title.toUpperCase(), {
        ...elInStyle(PptEL.title),
        fontSize: PptEL.title.fontSizePt,
        bold: true,
        color: COLORS.title,
        align: 'center',
        valign: 'middle'
    });

    if (kytData.foto_path) {
        const fotoUrl = assetUrl(kytData.foto_path,{query:{ t: Date.now() }});
        slide.addImage({
            path: fotoUrl,
            ...elInStyle(PptEL.image),
            sizing: { type: 'contain' as const, ...elInStyle({ wMm: PptEL.image.wMm, hMm: PptEL.image.hMm } as any) }
        });
    }

    const formattedDate = new Date(kytData.kyt_date_list.kyt_date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    slide.addText(formattedDate, {
        ...elInStyle(PptEL.date),
        fontSize: PptEL.date.fontSizePt,
        bold: true,
        color: COLORS.date,
        align: 'right',
        valign: 'bottom',
        shadow: shadow()
    });

    slide.addText('DISAMPAIKAN OLEH :', {
        ...elInStyle(PptEL.picLabel),
        fontSize: PptEL.picLabel.fontSizePt,
        bold: true,
        color: COLORS.label,
        align: 'left',
        valign: 'top'
    });

    slide.addText(kytData.user_name, {
        ...elInStyle(PptEL.picValue),
        fontSize: PptEL.picValue.fontSizePt,
        bold: true,
        color: COLORS.value,
        align: 'left',
        valign: 'top'
    });

    slide.addText('POTENSI BAHAYA :', {
        ...elInStyle(PptEL.potLabel),
        fontSize: PptEL.potLabel.fontSizePt,
        bold: true,
        color: COLORS.label,
        align: 'left',
        valign: 'top'
    });

    slide.addText(kytData.potensi, {
        ...elInStyle(PptEL.potValue),
        fontSize: PptEL.potValue.fontSizePt,
        bold: false,
        color: COLORS.value,
        align: 'left',
        valign: 'top',
        wrap: true,
        bullet: true
    });

    slide.addText('PENANGANAN :', {
        ...elInStyle(PptEL.penLabel),
        fontSize: PptEL.penLabel.fontSizePt,
        bold: true,
        color: COLORS.label,
        align: 'left',
        valign: 'top'
    });

    slide.addText(kytData.penanganan, {
        ...elInStyle(PptEL.penValue),
        fontSize: PptEL.penValue.fontSizePt,
        bold: false,
        color: COLORS.value,
        align: 'left',
        valign: 'top',
        wrap: true,
        bullet: true
    });
}

export function PenangananSliceKyt(pptx: PptxGenJS, title: string, foto_path?: string | null) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFC0CB' };

    if (foto_path) {
        const fotoUrl = assetUrl(foto_path, { query: { t: Date.now() } });

        slide.addText(title.toUpperCase(), {
            x: mmToIn(12.7),
            y: mmToIn(5.08),
            w: mmToIn(228.6),
            h: mmToIn(15.24),
            fontSize: 24,
            bold: true,
            color: '000000',
            align: 'center',
            valign: 'middle'
        });

        slide.addImage({
            path: fotoUrl,
            x: mmToIn(10.16),
            y: mmToIn(22.86),
            w: mmToIn(233.68),
            h: mmToIn(116.84),
            sizing: { type: 'contain', w: mmToIn(233.68), h: mmToIn(116.84) }
        });
    } else {
        slide.addText(title.toUpperCase(), {
            x: mmToIn(12.7),
            y: mmToIn(58.42),
            w: mmToIn(228.6),
            h: mmToIn(25.4),
            fontSize: 36,
            bold: true,
            color: '000000',
            align: 'center',
            valign: 'middle'
        });
    }
}

export function EmptySliceAdderKyt(pptx: PptxGenJS,team: Team | null) {
    const slide = pptx.addSlide();

    slide.addImage({
        path: assetUrl('/assets/img/bg-kyt.jpg'),
        x: 0, y: 0, w: '100%', h: '100%',
        sizing: { type: 'contain', w: '100%', h: '100%' }
    });

    if (team && team.team_name) {
        slide.addText(team.team_name, {
            ...elInStyle(PptEL.team),
            fontSize: PptEL.team.fontSizePt,
            bold: true,
            color: COLORS.team,
            align: 'center',
            valign: 'top',
            shadow: shadow()
        });
    }

    slide.addText('NO KYT SUBMITTED', {
        x: mmToIn(50.8),
        y: mmToIn(76.2),
        w: mmToIn(152.4),
        h: mmToIn(25.4),
        fontSize: 32,
        bold: true,
        color: 'FF0000',
        align: 'center',
        valign: 'middle'
    });
}