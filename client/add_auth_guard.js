const fs = require('fs');
const path = require('path');

function addAuthGuard(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add useRouter import if not exists
  if (!content.includes('import { useRouter }')) {
    content = content.replace(
      'import { useState, useEffect } from "react"',
      'import { useState, useEffect } from "react"\nimport { useRouter } from "next/navigation"'
    );
  }

  // Add state and useEffect inside the component
  const componentName = path.basename(path.dirname(filePath)) === 'dashboard' ? 'DashboardPage' : 'FeedbackPage';
  const componentStartRegex = new RegExp(`export default function ${componentName}\\(\\) \\{`);
  
  if (!content.includes('const [isAuthenticated, setIsAuthenticated] = useState(false)')) {
    content = content.replace(
      componentStartRegex,
      `export default function ${componentName}() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);`
    );
  }

  // Add return null before main return
  // We will find the last 'return (' that corresponds to the main component render
  // For both dashboard and feedback, they return a `<div className="flex h-screen bg-slate-950`
  if (!content.includes('if (!isAuthenticated) return null;')) {
    content = content.replace(
      /  return \(\s+<div className="flex h-screen bg-slate-950/,
      `  if (!isAuthenticated) return null;\n\n  return (\n    <div className="flex h-screen bg-slate-950`
    );
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${componentName}`);
}

addAuthGuard(path.join(__dirname, 'app', 'dashboard', 'page.tsx'));
addAuthGuard(path.join(__dirname, 'app', 'feedback', 'page.tsx'));
