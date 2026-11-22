import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import {
  construirObjectKeyEvidencia,
  formatearPrefijoVersion,
  sanitizarSegmentoRuta,
} from './reglas-archivo.util';

describe('reglas-archivo.util (Organización por versión en S3)', () => {
  describe('formatearPrefijoVersion', () => {
    it('debe aplicar zero-padding para versiones de un dígito', () => {
      expect(formatearPrefijoVersion(1)).toBe('v01');
      expect(formatearPrefijoVersion(9)).toBe('v09');
    });

    it('debe conservar todos los dígitos a partir de la versión 10', () => {
      expect(formatearPrefijoVersion(10)).toBe('v10');
      expect(formatearPrefijoVersion(100)).toBe('v100');
    });

    it('debe rechazar versiones menores a 1 o no enteras', () => {
      expect(() => formatearPrefijoVersion(0)).toThrow(ReglaNegocioException);
      expect(() => formatearPrefijoVersion(-2)).toThrow(ReglaNegocioException);
      expect(() => formatearPrefijoVersion(1.5)).toThrow(ReglaNegocioException);
    });
  });

  describe('sanitizarSegmentoRuta', () => {
    it('debe normalizar mayúsculas, tildes, espacios y evitar inyección de separadores', () => {
      expect(sanitizarSegmentoRuta('  CUCEI / Norte Á  ', 'general')).toBe(
        'cucei_norte_a',
      );
    });

    it('debe devolver el fallback cuando el segmento quede vacío', () => {
      expect(sanitizarSegmentoRuta('   ///   ', 'general')).toBe('general');
    });
  });

  describe('construirObjectKeyEvidencia', () => {
    it('debe construir la ruta jerárquica pre-asignada por versión', () => {
      const key = construirObjectKeyEvidencia({
        centroClave: 'CUCEI',
        anioFiscal: 2026,
        subActividadId: 'sub-uuid-123',
        versionDestino: 1,
        archivoId: 'arch-uuid-456',
        nombreSanitizado: 'reporte_marzo.pdf',
      });

      expect(key).toBe(
        'cucei/2026/subactividades/sub-uuid-123/v01/arch-uuid-456-reporte_marzo.pdf',
      );
    });

    it('debe rechazar años fiscales inválidos o identificadores vacíos', () => {
      expect(() =>
        construirObjectKeyEvidencia({
          centroClave: 'CUCEI',
          anioFiscal: 1999,
          subActividadId: 'sub-uuid-123',
          versionDestino: 1,
          archivoId: 'arch-uuid-456',
          nombreSanitizado: 'reporte.pdf',
        }),
      ).toThrow(ReglaNegocioException);

      expect(() =>
        construirObjectKeyEvidencia({
          centroClave: 'CUCEI',
          anioFiscal: 2026,
          subActividadId: '   ',
          versionDestino: 1,
          archivoId: 'arch-uuid-456',
          nombreSanitizado: 'reporte.pdf',
        }),
      ).toThrow(ReglaNegocioException);
    });
  });
});
