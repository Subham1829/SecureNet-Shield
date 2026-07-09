const fs = require('fs');
const path = require('path');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import
  if (!content.includes('catchAsync')) {
    if (content.includes('import { Request, Response } from "express";')) {
      content = content.replace('import { Request, Response } from "express";', 'import { Request, Response } from "express";\nimport { catchAsync } from "../utils/catchAsync.js";');
    } else {
      content = 'import { catchAsync } from "../utils/catchAsync.js";\n' + content;
    }
  }

  // Replace function definition
  content = content.replace(/export const (\w+) = async \(req: Request, res: Response\) => \{/g, 'export const $1 = catchAsync(async (req: Request, res: Response) => {');

  // Remove `try {` lines
  content = content.replace(/^\s*try \{\r?\n/gm, '');

  // Remove catch blocks
  // Note: we match `  } catch (error) {` up to `};`
  content = content.replace(/\s*\} catch \([\s\S]*?\};/g, '\n});');

  fs.writeFileSync(filePath, content);
  console.log(`Refactored ${filePath}`);
}

refactorFile('src/controllers/auth.controller.ts');
refactorFile('src/controllers/analysis.controller.ts');
refactorFile('src/controllers/blocked-ips.controller.ts');
