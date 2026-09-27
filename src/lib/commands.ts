import { contact, experience, projects, site, skills } from "@/data/portfolio";
import type { Reply } from "./knowledge";

/**
 * Slash commands for the chat box. Anything that isn't a command is a normal question
 * and goes to the AI (or the offline answer engine).
 */

export type CommandId = "help" | "projects" | "experience" | "skills" | "contact" | "resume" | "open" | "theme" | "clear";

type Command = { id: CommandId; aliases: string[]; description: string; args?: string[] };

export const COMMANDS: Command[] = [
  { id: "help", aliases: ["/help", "/?"], description: "show commands" },
  { id: "projects", aliases: ["/projects", "/work"], description: "list my projects" },
  { id: "open", aliases: ["/open"], description: "open a project", args: projects.map((p) => p.slug) },
  { id: "experience", aliases: ["/experience", "/exp"], description: "where I've worked" },
  { id: "skills", aliases: ["/skills", "/stack"], description: "tools I use" },
  { id: "contact", aliases: ["/contact", "/email", "/hire"], description: "how to reach me" },
  { id: "resume", aliases: ["/resume", "/cv"], description: "download my resume" },
  { id: "theme", aliases: ["/theme"], description: "switch light / dark", args: ["light", "dark"] },
  { id: "clear", aliases: ["/clear"], description: "clear the chat" },
];

export type ParsedCommand = { id: CommandId; arg?: string };

export function parseCommand(raw: string): ParsedCommand | null {
  const input = raw.trim().toLowerCase();
  if (!input.startsWith("/")) return null;
  const [head, ...rest] = input.split(/\s+/);
  const command = COMMANDS.find((c) => c.aliases.includes(head));
  if (!command) return null;
  const argText = rest.join(" ");
  const arg =
    command.id === "open"
      ? projects.find((p) => p.slug === argText || p.title.toLowerCase() === argText || (argText && p.slug.startsWith(argText)))?.slug
      : command.args?.find((a) => a === argText);
  return { id: command.id, arg };
}

/** Canned replies for commands that just show information. */
export function commandReply(cmd: ParsedCommand): Reply | null {
  switch (cmd.id) {
    case "help":
      return { text: `Ask me anything in plain English, or use a command:\n${COMMANDS.map((c) => `${c.aliases[0].padEnd(12)} ${c.description}`).join("\n")}` };
    case "projects":
      return {
        text: projects.map((p) => `• ${p.title} — ${p.tagline}`).join("\n"),
        actions: projects.map((p) => ({ type: "open", slug: p.slug, label: p.title })),
      };
    case "experience":
      return {
        text: experience.map((r) => `• ${r.title} at ${r.company} (${r.period})`).join("\n"),
        actions: [{ type: "section", id: "experience", label: "See experience" }],
      };
    case "skills":
      return { text: skills.map((g) => `${g.label}: ${g.items.join(", ")}`).join("\n") };
    case "contact":
      return {
        text: [`Email: ${contact.email}`, ...contact.links.map((l) => `${l.label}: ${l.value}`)].join("\n"),
        actions: [{ type: "link", href: `mailto:${contact.email}`, label: "Email me" }],
      };
    case "resume":
      return site.resumeUrl
        ? { text: "Here you go:", actions: [{ type: "link", href: site.resumeUrl, label: "Download resume" }] }
        : { text: "My resume isn't uploaded yet — see the Experience section.", actions: [{ type: "section", id: "experience", label: "See experience" }] };
    case "open":
      return cmd.arg ? null : { text: `Which one? ${projects.map((p) => `/open ${p.slug}`).join(" · ")}` };
    default:
      return null;
  }
}

/** Autocomplete suggestions while the visitor types a slash command. */
export function suggest(input: string): { value: string; hint: string }[] {
  if (!input.startsWith("/")) return [];
  const lower = input.toLowerCase();
  const space = lower.indexOf(" ");
  if (space === -1) {
    return COMMANDS.filter((c) => c.aliases[0].startsWith(lower) && c.aliases[0] !== lower).map((c) => ({
      value: c.args ? `${c.aliases[0]} ` : c.aliases[0],
      hint: c.description,
    }));
  }
  const command = COMMANDS.find((c) => c.aliases.includes(lower.slice(0, space)));
  const partial = lower.slice(space + 1);
  return (command?.args ?? [])
    .filter((a) => a.startsWith(partial) && a !== partial)
    .map((a) => ({
      value: `${command!.aliases[0]} ${a}`,
      hint: command!.id === "open" ? (projects.find((p) => p.slug === a)?.title ?? "") : `${a} mode`,
    }));
}
