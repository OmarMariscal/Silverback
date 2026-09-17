// frontend/src/types/dashboard-contratos.ts
// Este archivo define los tipos y contratos relacionados con la visualización de datos en el dashboard. Incluye interfaces para representar la información de los KPIs, gráficos, próximos vencimientos y bandeja de supervisión.
// En palabras sencillas: Este archivo es como un "manual de instrucciones" para los desarrolladores. Define cómo deben lucir los datos que se muestran en el dashboard y qué propiedades se esperan, asegurando que todos los componentes trabajen con la misma estructura de información.

export interface KpiCardProps {
  titulo: string;
  valorPrincipal: string | number;
  etiquetaPrincipal: string;
  valorSecundario?: string | number;
  etiquetaSecundaria?: string;
  colorBordeHover?: string;
}

export interface DonutChartProps {
  titulo: string;
  totalCentral: number;
  subtituloCentral: string;
  gradientStyle: string; // conic-gradient de Tailwind/CSS
  leyendas: {
    etiqueta: string;
    cantidad: number;
    colorHex: string;
  }[];
}

export interface ItemVencimientoProps {
  id: string;
  titulo: string;
  fechaTexto: string;
  etiquetaTiempo: string;
  colorSemaforo: 'red' | 'amber' | 'emerald';
}

export interface FilaSupervisionProps {
  id: string;
  titulo: string;
  tiempoTranscurrido: string;
  resolucionTexto: string;
  resolucionTipo: 'DEVUELTA_OBS' | 'DEVUELTA_REC' | 'CONCLUIDA';
  vencimientoTexto: string;
  vencimientoFecha: string;
}

export interface DashboardContralorUI {
  centroNombre: string;
  kpis: {
    devueltas: number;
    listasParaEmpezar: number;
    riesgoCritico: number;
    precaucion: number;
    tasaSolventacion: number;
  };
  graficaSemaforos: DonutChartProps;
  graficaFlujo: DonutChartProps;
  proximosVencimientos: ItemVencimientoProps[];
  bandejaSupervision: FilaSupervisionProps[];
}