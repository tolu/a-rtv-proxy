export const IMAGE_VARIANTS = (Deno.env.get('IMAGE_VARIANTS') || '300,600')
  .split(',').map(parseFloat).filter(Boolean);
