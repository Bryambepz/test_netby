export interface ConfiguracionImagen {
  maxPesoMB: number;
  maxAnchoCuadrada: number;
  maxAltoCuadrada: number;
  maxAnchoHorizontal: number;
  maxAltoHorizontal: number;
  maxAnchoVertical: number;
  maxAltoVertical: number;
  formatoSalida: 'image/jpeg' | 'image/webp' | 'image/png';
  calidad: number;
}
