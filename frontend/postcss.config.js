import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const unwrapThirdPartyLayers = () => {
  return {
    postcssPlugin: 'unwrap-third-party-layers',
    Once(root) {
      const file = root.source?.input?.file;
      root.walkAtRules('layer', (atRule) => {
        if (file && (file.includes('node_modules') || file.includes('react-core') || file.includes('a2ui-renderer'))) {
          if (atRule.nodes) {
            atRule.replaceWith(atRule.nodes);
          } else {
            atRule.remove();
          }
        }
      });
    }
  };
};
unwrapThirdPartyLayers.postcss = true;

export default {
  plugins: [
    unwrapThirdPartyLayers(),
    tailwindcss(),
    autoprefixer()
  ]
};
