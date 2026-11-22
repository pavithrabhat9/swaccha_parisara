import { register } from 'node:module';

register(
  'data:text/javascript,' +
    encodeURIComponent(`
      import fs from 'node:fs';
      import { fileURLToPath } from 'node:url';

      export async function resolve(specifier, context, nextResolve) {
        try {
          return await nextResolve(specifier, context);
        } catch (err) {
          if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\\.[a-z0-9]+$/i.test(specifier)) {
            for (const ext of ['.js', '.jsx', '.mjs', '.json']) {
              try {
                return await nextResolve(specifier + ext, context);
              } catch {}
            }
            for (const idx of ['/index.js', '/index.jsx', '/index.mjs']) {
              try {
                return await nextResolve(specifier + idx, context);
              } catch {}
            }
          }
          throw err;
        }
      }

      export async function load(url, context, nextLoad) {
        if (url.endsWith('.json')) {
          return nextLoad(url, { ...context, importAttributes: { ...context.importAttributes, type: 'json' } });
        }
        return nextLoad(url, context);
      }
    `)
);
