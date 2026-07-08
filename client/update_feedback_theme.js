const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'feedback', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
if (!content.includes('import { AppSidebar }')) {
  content = content.replace(
    'import { Star, Send, ArrowLeft, Shield, User } from \'lucide-react\'',
    'import { Star, Send, ArrowLeft, Shield, User, Menu } from \'lucide-react\'\nimport { AppSidebar } from "@/components/AppSidebar"\nimport { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"'
  );
}

// Add state for sidebar
if (!content.includes('sidebarOpen')) {
  content = content.replace(
    'const [submitted, setSubmitted] = useState(false)',
    'const [submitted, setSubmitted] = useState(false)\n  const [sidebarOpen, setSidebarOpen] = useState(false)'
  );
}

// Replace layout wrapper
const oldHeaderRegex = /<div className="min-h-screen bg-\[\#0d1224\] selection:bg-\[\#2f6bff\] selection:text-white font-sans text-\[\#f5f5f7\]">[\s\S]*?<main className="mx-auto max-w-6xl p-6 relative z-10 pt-10">/;

const newHeader = `<div className="flex h-screen bg-slate-950 font-sans text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-background">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-background">
                <AppSidebar />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Feedback & Reviews</h1>
              <p className="text-muted-foreground">Share your thoughts on IP Guardian</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl p-6 relative z-10 pt-4">`;

content = content.replace(oldHeaderRegex, newHeader);

// Close the extra divs at the bottom
if (!content.includes('      </div>\n    </div>\n  )')) {
  content = content.replace(
    '</main>\n      \n      {/* Global styles',
    '</main>\n      </div>\n      {/* Global styles'
  );
}

// Global color replacements
content = content.replace(/bg-\[\#0d1224\]/g, 'bg-background');
content = content.replace(/bg-\[\#10141f\]/g, 'bg-card');
content = content.replace(/text-\[\#f5f5f7\]/g, 'text-foreground');
content = content.replace(/text-\[\#8b93a7\]/g, 'text-muted-foreground');
content = content.replace(/bg-\[\#2f6bff\]/g, 'bg-primary');
content = content.replace(/text-\[\#2f6bff\]/g, 'text-primary');
content = content.replace(/fill-\[\#2f6bff\]/g, 'fill-primary');
content = content.replace(/via-\[\#2f6bff\]/g, 'via-primary');
content = content.replace(/border-\[\#2f6bff\]/g, 'border-primary');
content = content.replace(/from-\[\#2f6bff\]/g, 'from-primary');
content = content.replace(/to-\[\#2f6bff\]/g, 'to-primary');
content = content.replace(/bg-\[\#2563eb\]/g, 'bg-primary');
content = content.replace(/text-\[\#2563eb\]/g, 'text-primary');
content = content.replace(/border-white\/5/g, 'border-border');
content = content.replace(/bg-white\/5/g, 'bg-accent');
content = content.replace(/rgba\(47,107,255,/g, 'rgba(201,138,62,');

fs.writeFileSync(filePath, content);
console.log('Update complete.');
