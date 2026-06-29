import { chromium } from "playwright";
import { GenaiService } from "./genai-service.js";
import { ModelContextService } from "./model-context-service.js";
import { TowerBeroDuskAgent } from "./tower-befor-dusk-agent.js";

const gameUrl = process.argv[2] ?? "http://localhost:5173";

async function main(): Promise<void> {
  const context = await chromium.launchPersistentContext(
    "./.chrome-agent-profile",
    {
      channel: "chrome",
      headless: false,
      args: ["--enable-experimental-web-platform-features"],
    },
  );

  const page = context.pages()[0] ?? await context.newPage();

  try {
    await page.goto(gameUrl, { waitUntil: "networkidle" });

    const genaiService = new GenaiService();
    const modelContextService = new ModelContextService();
    const agent = new TowerBeroDuskAgent(
      genaiService,
      modelContextService,
    );

    await agent.play(page);
    console.log("Levels 1 and 2 completed.");
  } catch (error) {
    await context.close();
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
