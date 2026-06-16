/**
 * Formata número para representação monetária em real brasileiro.
 * @param {number} value valor numérico
 * @returns {string} valor formatado (ex: "R$ 1.234,56")
 *
 * Observação: usa `toFixed` e troca ponto por vírgula para manter compatibilidade
 * com o layout estático do front-end; para internacionalização completa,
 * trocaria por `Intl.NumberFormat` quando necessário.
 */
export function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}