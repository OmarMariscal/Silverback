// src/store/index.ts
import { usePoaStore as usePoaRealStore } from './poa.store';
import { usePoaMockStore } from './poa.mock-store';

// 🔴 CAMBIA ESTA BANDERA PARA ALTERNAR
// true  => Usa el MOCK con datos falsos
// false => Usa la API REAL de Emiliano
const USE_MOCK = true;

export const usePoaStore = USE_MOCK ? usePoaMockStore : usePoaRealStore;