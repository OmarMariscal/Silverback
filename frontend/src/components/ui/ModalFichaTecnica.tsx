import React, { useState, useEffect } from 'react';
import { FormularioFichaTecnicaProps, DatosFormularioFicha } from '@/types/poa-contratos';

export const ModalEditarFichaTecnica: React.FC<FormularioFichaTecnicaProps> = ({
  valoresIniciales,
  listaAuditoresDisponibles,
  estaGuardando,
  onContinuarASubactividades,
  onCancelar,
}) => {
  const [formData, setFormData] = useState<DatosFormularioFicha>({
    titulo: '',
    justificacion: '',
    objetivoGeneral: '',
    objetivosParticulares: '',
    metaProyecto: '',
    indicadores: '',
    auditoresSeleccionadosIds: [],
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (valoresIniciales) {
      setFormData({
        titulo: valoresIniciales.titulo || '',
        justificacion: valoresIniciales.justificacion || '',
        objetivoGeneral: valoresIniciales.objetivoGeneral || '',
        objetivosParticulares: valoresIniciales.objetivosParticulares || '',
        metaProyecto: valoresIniciales.metaProyecto || '',
        indicadores: valoresIniciales.indicadores || '',
        auditoresSeleccionadosIds: valoresIniciales.auditoresSeleccionadosIds || [],
      });
    }
  }, [valoresIniciales]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAuditor = (id: string) => {
    setFormData((prev) => {
      const seleccionados = prev.auditoresSeleccionadosIds.includes(id)
        ? prev.auditoresSeleccionadosIds.filter((audId) => audId !== id)
        : [...prev.auditoresSeleccionadosIds, id];
      return { ...prev, auditoresSeleccionadosIds: seleccionados };
    });
  };

  // 1. Cálculo de Total Participantes (Auditores + 1 Líder)
  const totalParticipantes = formData.auditoresSeleccionadosIds.length + 1;

  // 2. Cálculo automático de Porcentaje según la fórmula
  const porcentajeCalculadoNumero = 100 / totalParticipantes;
  const porcentajePorAuditor = porcentajeCalculadoNumero.toFixed(1);

  // 3. Envío de datos incluyendo las métricas calculadas
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinuarASubactividades({
      ...formData,
      // Se agregan al objeto resultante por si el backend los recibe
      ...( { totalParticipantes, porcentajePorAuditor: porcentajeCalculadoNumero } as any )
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[900px]">
        
        {/* Cabecera */}
        <div className="px-6 sm:px-10 pt-6 pb-5 border-b border-slate-100 shrink-0 bg-white z-10 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Editar Ficha Técnica</h2>
            <p className="text-sm text-slate-500 mt-1">
              Actualiza los atributos generales y el equipo auditor asignado a esta actividad.
            </p>
          </div>
          <button
            onClick={onCancelar}
            type="button"
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario Principal */}
        <form id="form-ficha-tecnica" onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 sm:p-10 bg-slate-50/50 space-y-8">
          
          {/* Título de la Actividad */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Descripción / Título de la Actividad
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-300 rounded-xl px-5 py-4 text-base sm:text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              placeholder="Ej. Revisión al rubro de Obra Pública..."
            />
          </div>

          {/* Asignación de Equipo Auditor */}
          <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm ring-1 ring-indigo-50">
            <h3 className="text-sm font-bold text-slate-800 flex items-center mb-5 border-b border-slate-100 pb-3">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Asignación de Equipo Auditor
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-6">
              {/* Total Participantes (Sólo Lectura Calculada) */}
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Total Participantes (+ Líder)
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-[52px] flex items-center justify-center shadow-inner">
                  <span className="text-xl font-black text-slate-800">{totalParticipantes}</span>
                </div>
              </div>

              {/* Porcentaje Calculado */}
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  % Por Auditor
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-[52px] flex items-center justify-center shadow-inner">
                  <span className="text-xl font-black text-indigo-600">{porcentajePorAuditor}%</span>
                </div>
              </div>

              {/* Auditores Seleccionados */}
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Auditores Seleccionados
                </label>
                <div className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center justify-center text-xs font-semibold text-slate-600">
                  {formData.auditoresSeleccionadosIds.length} seleccionados
                </div>
              </div>
            </div>

            {/* Listado de Auditores Disponibles */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Seleccionar Integrantes del Catálogo
              </label>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                {listaAuditoresDisponibles?.map((auditor) => {
                  const seleccionado = formData.auditoresSeleccionadosIds.includes(auditor.id);
                  return (
                    <div
                      key={auditor.id}
                      onClick={() => toggleAuditor(auditor.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                        seleccionado ? 'bg-indigo-50 border border-indigo-200' : 'bg-white border border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800">{auditor.nombreCompleto}</span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{auditor.cargoVisible}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Justificación y Objetivo General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Justificación
              </label>
              <textarea
                name="justificacion"
                rows={4}
                value={formData.justificacion}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                placeholder="Argumentación de la realización..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Objetivo General
              </label>
              <textarea
                name="objetivoGeneral"
                rows={4}
                value={formData.objetivoGeneral}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                placeholder="Propósito global..."
              />
            </div>
          </div>

          {/* Objetivos Particulares */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Objetivos Particulares
            </label>
            <textarea
              name="objetivosParticulares"
              rows={3}
              value={formData.objetivosParticulares}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
              placeholder="Desglose de objetivos..."
            />
          </div>

          {/* Meta Proyecto e Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Meta del Proyecto
              </label>
              <textarea
                name="metaProyecto"
                rows={3}
                value={formData.metaProyecto}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                placeholder="Entregables y resultados esperados..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Indicadores
              </label>
              <textarea
                name="indicadores"
                rows={3}
                value={formData.indicadores}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                placeholder="Métricas de evaluación..."
              />
            </div>
          </div>

        </form>

        {/* Botonera de Acciones */}
        <div className="px-6 py-5 border-t border-slate-200 bg-white flex justify-end space-x-4 shrink-0 z-10">
          <button type="button" onClick={onCancelar} disabled={estaGuardando} className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50">
            Cancelar
          </button>
          
          <button type="submit" form="form-ficha-tecnica" disabled={estaGuardando} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center disabled:opacity-50">
            {estaGuardando ? 'Sincronizando...' : 'Guardar y Finalizar'}
          </button>
        </div>
      </div>
    </div>
  );
};