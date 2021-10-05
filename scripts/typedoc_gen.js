// @ts-check

const td = require('typedoc');
const ts = require('typescript');

const typedocJson = require('./../typedoc.json');


/**
 * @param {Object} options
 *  @param {string} options.entryPoint
 *  @param {string} options.outDir
 * @param {Partial<import('typedoc').TypeDocOptions>} [typeDocOptions]
 */
(async () => {
  const app = new td.Application();
  app.options.addReader(new td.TSConfigReader());

  app.bootstrap({
    ...typedocJson,
    tsconfig: 'tsconfig.json',
  });

  const program = ts.createProgram(
    app.options.getFileNames(),
    app.options.getCompilerOptions()
  );

  const project = app.converter.convert(app.getEntryPoints() ?? []);

  if (project) {
    await app.generateDocs(project, './docs');
  } else {
    throw new Error(`Error creating the TypeScript API docs for ${entryPoint}.`);
  }
})()
