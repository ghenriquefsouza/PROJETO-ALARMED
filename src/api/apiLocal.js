// src/api/apiLocal.js
export const apiLocal = {
  entities: {
    Medicamento: {
      async list() {
        return [];
      },
      async create(data) {
        console.log("Criar medicamento:", data);
      },
      async update(id, data) {
        console.log("Atualizar:", id, data);
      }
    },
    HistoricoTomada: {
  _data: [],
  async list() { return this._data; },
  async create(data) { this._data.push(data); console.log("Registrar tomada:", data); 
      }
    }
    
  }
};
