import { ConfiguracionImagen } from '../../domain/interaces/ConfiguracionImagen';

export class ImagenUtil {
  static async procesarImagen(
    file: File,
    config: ConfiguracionImagen,
  ): Promise<File> {
    const imageBitmap = await this.cargarImagen(file);

    const dimensiones = this.calcularDimensiones(
      imageBitmap.width,
      imageBitmap.height,
      config,
    );

    const canvas = document.createElement('canvas');
    canvas.width = dimensiones.width;
    canvas.height = dimensiones.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas.');
    }

    ctx.drawImage(imageBitmap, 0, 0, dimensiones.width, dimensiones.height);

    let calidadActual = config.calidad;
    let blob = await this.canvasToBlob(
      canvas,
      config.formatoSalida,
      calidadActual,
    );

    const maxBytes = config.maxPesoMB * 1024 * 1024;

    while (blob.size > maxBytes && calidadActual > 0.4) {
      calidadActual -= 0.1;
      blob = await this.canvasToBlob(
        canvas,
        config.formatoSalida,
        calidadActual,
      );
    }

    const extension = this.obtenerExtension(config.formatoSalida);
    const nombreBase = file.name.replace(/\.[^/.]+$/, '');

    return new File([blob], `${nombreBase}.${extension}`, {
      type: config.formatoSalida,
    });
  }

  private static cargarImagen(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
        img.src = reader.result as string;
      };

      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsDataURL(file);
    });
  }

  private static calcularDimensiones(
    widthOriginal: number,
    heightOriginal: number,
    config: ConfiguracionImagen,
  ): { width: number; height: number } {
    const esCuadrada = widthOriginal === heightOriginal;
    const esHorizontal = widthOriginal > heightOriginal;

    let maxWidth: number;
    let maxHeight: number;

    if (esCuadrada) {
      maxWidth = config.maxAnchoCuadrada;
      maxHeight = config.maxAltoCuadrada;
    } else if (esHorizontal) {
      maxWidth = config.maxAnchoHorizontal;
      maxHeight = config.maxAltoHorizontal;
    } else {
      maxWidth = config.maxAnchoVertical;
      maxHeight = config.maxAltoVertical;
    }

    const ratio = Math.min(
      maxWidth / widthOriginal,
      maxHeight / heightOriginal,
      1,
    );

    return {
      width: Math.round(widthOriginal * ratio),
      height: Math.round(heightOriginal * ratio),
    };
  }

  private static canvasToBlob(
    canvas: HTMLCanvasElement,
    tipo: string,
    calidad: number,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('No se pudo convertir el canvas a blob.'));
            return;
          }
          resolve(blob);
        },
        tipo,
        calidad,
      );
    });
  }

  private static obtenerExtension(tipo: string): string {
    switch (tipo) {
      case 'image/webp':
        return 'webp';
      case 'image/png':
        return 'png';
      default:
        return 'jpg';
    }
  }
}
