// Server/build-time only. throwOnError: true so a bad equation fails the build
// instead of shipping a KaTeX error box.
import katex from 'katex';

export function renderLatex(latex: string): string {
  return katex.renderToString(latex, {
    output: 'htmlAndMathml',
    throwOnError: true,
    displayMode: true,
  });
}

export function renderLatexInline(latex: string): string {
  return katex.renderToString(latex, {
    output: 'htmlAndMathml',
    throwOnError: true,
    displayMode: false,
  });
}
