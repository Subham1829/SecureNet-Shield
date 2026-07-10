const { spawn } = require("child_process");

async function addEnv(cwd, name, value) {
  return new Promise((resolve, reject) => {
    console.log(`Adding ${name} in ${cwd}...`);
    // npx vercel env add <name> production
    const child = spawn("npx", ["vercel", "env", "add", name, "production"], { cwd, shell: true, stdio: ['pipe', 'pipe', 'pipe'] });

    let output = "";
    child.stdout.on("data", (data) => {
      const str = data.toString();
      output += str;
      if (str.includes("What's the value of")) {
        child.stdin.write(value + "\n");
        child.stdin.end();
      }
    });

    child.stderr.on("data", (data) => {
      output += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0 || output.includes("already exists")) {
        console.log(`Successfully added ${name}`);
        resolve();
      } else {
        console.error(`Failed to add ${name}. Code: ${code}\nOutput: ${output}`);
        resolve(); // Continue anyway, maybe it already exists
      }
    });
  });
}

async function main() {
  const serverDir = "e:\\secure\\SecureNet-Shield\\server";
  const clientDir = "e:\\secure\\SecureNet-Shield\\client";

  const serverEnvs = [
    { name: "CLIENT_URL", value: "https://client-gamma-azure-13.vercel.app" },
    { name: "MONGODB_URI", value: "mongodb+srv://Soumi:aagbankoGJykziFB@cluster0.reuzsje.mongodb.net/securenet" },
    { name: "JWT_SECRET", value: "c3c127de58d0866f36996e9a0985272c55687333ce2941f4781b5ee33485657f" },
    { name: "EMAIL_USER", value: "soumiisc2020@gmail.com" },
    { name: "EMAIL_PASSWORD", value: "lxps megb cfnf bjix" },
  ];

  for (const env of serverEnvs) {
    await addEnv(serverDir, env.name, env.value);
  }

  const clientEnvs = [
    { name: "NEXT_PUBLIC_API_URL", value: "https://server-tan-delta.vercel.app" }
  ];

  for (const env of clientEnvs) {
    await addEnv(clientDir, env.name, env.value);
  }

  console.log("All environment variables pushed!");
}

main();
