/**
 * ARQUIVO: coupon.ts
 *
 * O QUE FAZ:
 *   Define a configuracao do cupom de desconto exibido na home page.
 *   Contem o codigo do cupom e o texto de validade mostrado ao usuario.
 *
 * USADO EM:
 *   - Coupon.astro (componente que renderiza o banner de cupom na home)
 *
 * CONCEITO ASTRO:
 *   Dados estaticos de build time. Ao alterar o cupom aqui, basta
 *   rebuildar o site para que a nova informacao apareca em producao.
 *   Nenhum JavaScript e enviado ao cliente — o valor e injetado no HTML
 *   durante a geracao estatica (SSG).
 */
export interface CouponConfig {
  code: string;
  expiresAtLabel: string;
}

export const HOME_COUPON: CouponConfig = {
  code: 'FEV2026',
  expiresAtLabel: 'Válido até 01/03/2026',
};
