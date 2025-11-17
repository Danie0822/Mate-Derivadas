// src/services/crudService.js

const { where } = require("sequelize");
const { Op } = require('sequelize'); // 📌 Importar operadores de Sequelize
class CrudService {
  /**
   * @param {object} model - Modelo de Sequelize (por ej. Area).
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Crea un nuevo registro.
   * @param {object} data - Datos a insertar en el modelo.
   * @returns {Promise<any>} - Registro creado.
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Retorna todos los registros del modelo.
   * @param {object} [options] - Opciones de consulta de Sequelize (ej. where, limit, offset, etc.).
   * @returns {Promise<any[]>} - Array de registros.
   */
  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  /**
   * Retorna un registro por su ID (en este caso, UUID).
   * @param {string} id - UUID del registro.
   * @returns {Promise<any|null>} - Registro o null si no existe.
   */
  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  /**
   * Retorna el primer registro que coincide con los criterios de búsqueda.
   * @param {object} options - Opciones de consulta de Sequelize (where, order, include, etc.).
   * @returns {Promise<any|null>} - Registro encontrado o null si no existe.
   */
  async findOne(options = {}) {
    // Si options ya tiene la estructura completa (con where, order, etc.), usarlo directamente
    // Si options es solo criterios simples, envolver en { where: options }
    if (options.where || options.order || options.include || options.limit) {
      return this.model.findOne(options);
    } else {
      return this.model.findOne({ where: options });
    }
  }

  /**
   * Retorna registros y el conteo total con paginación.
   * @param {object} [options] - Opciones de consulta de Sequelize (where, limit, offset, include, etc.).
   * @returns {Promise<{count: number, rows: any[]}>} - Objeto con count y rows.
   */
  async findAndCountAll(options = {}) {
    return this.model.findAndCountAll(options);
  }

  /**
   * Cuenta el número de registros que coinciden con los criterios.
   * @param {object} [options] - Opciones de consulta de Sequelize (where, include, etc.).
   * @returns {Promise<number>} - Número de registros.
   */
  async count(options = {}) {
    return this.model.count(options);
  }

  /**
   * Actualiza un registro por su ID (UUID).
   * @param {string} id - UUID del registro a actualizar.
   * @param {object} data - Datos nuevos a actualizar.
   * @returns {Promise<any|null>} - Registro actualizado o null si no existe.
   */
  async update(id, data) {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  /**a
   * Elimina (o soft-delete) un registro por su ID (UUID).
   * @param {string} id - UUID del registro a eliminar.
   * @returns {Promise<boolean>} - True si se eliminó, false si no existe.
   */
  async delete(id) {
    const record = await this.model.findByPk(id);
    if (!record) return false;
    await record.destroy(); // Soft delete si paranoid: true
    return true;
  }

  /**
 * Verifica si ya existe un registro con el valor dado en el campo especificado.
 * Retorna true si ningún registro tiene ese valor (es único), o false si ya existe uno.
 */
  async isUnique(field, value) {
    const existingRecord = await this.model.findOne({ where: { [field]: value } });
    return (existingRecord === null || existingRecord === undefined);
  }
  /**
   * Verifica si otro registro (distinto del id proporcionado) tiene el mismo valor en el campo especificado.
   * Retorna true si el valor es único para la actualización (ningún otro lo tiene), o false si otro registro ya lo usa.
   */
  async isUniqueForUpdate(id, field, value) {
    // Buscar un registro con el mismo valor en el campo, excluyendo el registro con el id dado
    const existingRecord = await this.model.findOne({
      where: {
        [field]: value,
        id: { [Op.ne]: id } // 📌 Usar Op.ne (not equal) en lugar de where.not
      }
    });
    return (existingRecord === null || existingRecord === undefined);
  }
}


module.exports = CrudService;