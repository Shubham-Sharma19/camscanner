export type ToolCategory = 'scanner' | 'pdf' | 'editor' | 'resizer' | 'generator';

export interface ToolItem {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  href: string;
  category: ToolCategory;
  badge?: string;
  iconName: string;
  popular?: boolean;
}

export interface OCRWord {
  id: string;
  text: string;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  confidence: number;
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  fontColor: string;
  bgColor: string;
  isBold?: boolean;
  isItalic?: boolean;
}
