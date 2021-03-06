import parse = require("html-loader/lib/attributesParser");

const _htmlSymbol = Symbol("HTML dependencies");

function loader(this: Webpack.Loader, content: string) {
  this.cacheable && this.cacheable();
  this._module[_htmlSymbol] = loader.modules(content);
  return content;
}

namespace loader {
  export const htmlSymbol = _htmlSymbol;

  export let attributes = {
    "require": [ "from" ],
    "compose": [ "view", "view-model" ],
    "router-view": [ "layout-view", "layout-view-model" ],
  };

  export function modules(html: string) {
    return parse(html, (tag, attr) => {
      const attrs = loader.attributes[tag];
      return attrs && attrs.includes(attr);
    })
    // Ignore values that contain interpolated values
    .filter(attr => !/(^|[^\\])\$\{/.test(attr.value))
    .map(attr => attr.value);
  }
}

export = loader;
