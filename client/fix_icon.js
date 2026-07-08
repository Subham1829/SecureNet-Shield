const fs = require('fs');
const path = require('path');

function addIconDashboard(filePath) {
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

  const iconButton = `
              <Button size="icon" variant="ghost" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20" asChild>
                <Link href="/settings">
                  <User className="h-5 w-5" />
                </Link>
              </Button>`;

  // Use regex to match the Quick Export button and add the icon after it
  const rx = /(<Download className="mr-2 h-4 w-4" \/>\s+Quick Export\s+<\/Button>)/;
  if (rx.test(content) && !content.includes('Link href="/settings"')) {
    content = content.replace(rx, `$1${iconButton}`);
    fs.writeFileSync(filePath, content);
    console.log('Dashboard fixed');
  } else {
    console.log('Dashboard not matched or already has icon');
  }
}

function addIconFeedback(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure User is imported
  if (!content.includes('User,')) {
    content = content.replace(/import \{(.*?)\} from "lucide-react"/s, (match, p1) => {
      if (!p1.includes('User,')) {
        return `import {${p1} User, } from "lucide-react"`;
      }
      return match;
    });
  }

  const iconButton = `
            <Button size="icon" variant="ghost" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20" asChild>
              <Link href="/settings">
                <User className="h-5 w-5" />
              </Link>
            </Button>`;

  const rxFeedback = /(<h1 className="text-2xl font-bold text-foreground">Feedback & Reviews<\/h1>\s+<p className="text-muted-foreground">Share your thoughts on IP Guardian<\/p>\s+<\/div>\s+<\/div>)/;
  
  if (rxFeedback.test(content) && !content.includes('Link href="/settings"')) {
    content = content.replace(rxFeedback, `$1${iconButton}`);
    // Also we need to make the parent container justify-between
    // Find the header div that wraps this
    content = content.replace(
      '<header className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-50">\n          <div className="flex items-center gap-4">',
      '<header className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-50">\n          <div className="flex items-center justify-between w-full">\n            <div className="flex items-center gap-4">'
    );
    // Add the closing div for the new wrapper
    content = content.replace(
      `${iconButton}\n        </header>`,
      `</div>\n            ${iconButton}\n          </div>\n        </header>`
    );
    fs.writeFileSync(filePath, content);
    console.log('Feedback fixed');
  } else {
    console.log('Feedback not matched or already has icon');
  }
}

addIconDashboard(path.join(__dirname, 'app', 'dashboard', 'page.tsx'));
addIconFeedback(path.join(__dirname, 'app', 'feedback', 'page.tsx'));
