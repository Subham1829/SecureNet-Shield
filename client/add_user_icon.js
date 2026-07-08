const fs = require('fs');
const path = require('path');

function addIcon(filePath, isDashboard) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure User is imported from lucide-react
  if (!content.includes('User,')) {
    content = content.replace(/import \{(.*?)\} from "lucide-react"/s, (match, p1) => {
      if (!p1.includes('User,')) {
        return `import {${p1} User, } from "lucide-react"`;
      }
      return match;
    });
  }
  
  if (!content.includes('import { User } from "lucide-react"')) {
    // some files might just import User directly or not have lucide-react block
  }

  const iconButton = `
              <Button size="icon" variant="ghost" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20" asChild>
                <Link href="/settings">
                  <User className="h-5 w-5" />
                </Link>
              </Button>`;

  if (isDashboard) {
    // Dashboard: add after Quick Export
    const targetDashboard = `              <Button
                size="sm"
                variant="outline"
                onClick={() => exportSecurityReport("json")}
                className="border-border text-muted-foreground hover:text-foreground hover:border-primary"
              >
                <Download className="mr-2 h-4 w-4" />
                Quick Export
              </Button>`;
    if (content.includes(targetDashboard) && !content.includes(iconButton.trim())) {
      content = content.replace(targetDashboard, targetDashboard + iconButton);
    }
  } else {
    // Feedback: add after the text block
    const targetFeedback = `            <div>
              <h1 className="text-2xl font-bold text-foreground">Feedback & Reviews</h1>
              <p className="text-muted-foreground">Share your thoughts on IP Guardian</p>
            </div>
          </div>`;
    // We need to change the parent div to justify-between
    if (content.includes(targetFeedback) && !content.includes(iconButton.trim())) {
      content = content.replace(
        '<div className="flex items-center gap-4">',
        '<div className="flex items-center justify-between w-full">\n            <div className="flex items-center gap-4">'
      );
      content = content.replace(
        targetFeedback,
        targetFeedback.replace('</div>\n          </div>', `</div>\n            </div>${iconButton}\n          </div>`)
      );
    }
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + path.basename(filePath));
}

addIcon(path.join(__dirname, 'app', 'dashboard', 'page.tsx'), true);
addIcon(path.join(__dirname, 'app', 'feedback', 'page.tsx'), false);
