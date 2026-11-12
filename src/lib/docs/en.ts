import { ic, kbd, type Block, type Doc } from "#lib/docs/shared";

const status: Block = { t: "callout", label: "Status", tone: "danger", html: "ene has not been released yet. Install instructions will appear here with the first release." };

export const docs: Doc[] = [
  { slug: "introduction", group: "Get started", title: "Introduction",
    lede: "Architecture diagrams show what is connected. ene shows what happens: which request goes first, where it waits, where it fails, and which path a cache miss takes.",
    sections: [
      { id: "how", h: "How it works", blocks: [{ t: "p", html: "You write steps as plain text, one per line. ene parses them, lays out the nodes and plays the steps in order: a dot travels each arrow." },
        { t: "player", label: "Order request", code: "title Order request\nuser[User] -> api[API Server] : POST /order\napi -> cache[Redis] : check stock\ncache --> api : miss\napi -> db[MySQL] : SELECT stock & api -> pay[Payment] : charge\ndb --> api : in stock\npay -x api : timeout\napi --> user : 502 retry later" }] },
      { id: "ways", h: "Two ways to use it", blocks: [{ t: "cards", items: [
        { href: "/docs/web-page", title: "In a web page", code: '<pre class="ene">', text: "A live player with play, pause, step and speed." },
        { href: "/docs/image", title: "As an image", code: "ene flow.ene -o flow.svg", text: "A self-playing SVG for READMEs and docs." }] }] },
      { id: "status", h: "Status", blocks: [status] }
    ] },
  { slug: "web-page", group: "Get started", title: "In a web page",
    lede: `Put your diagram in a ${ic("&lt;pre class=\"ene\"&gt;")} and load one script. Every block becomes a player.`,
    sections: [
      { id: "script", h: "Add the script", blocks: [{ t: "code", file: "index.html", code: '<pre class="ene">\nuser -> api : GET /\napi --> user : 200\n</pre>\n\n<script src="ene.js"></script>' },
        { t: "p", html: "The script finds every block with the class on load, parses it, lays it out and replaces it with a player. The text stays in your HTML, so it is readable without JavaScript." }] },
      { id: "result", h: "What you get", blocks: [{ t: "player", label: "Minimal example", code: "user -> api : GET /\napi --> user : 200" }] },
      { id: "keyboard", h: "Keyboard", blocks: [{ t: "p", html: `Click a player to focus it. ${kbd("Space")} plays or pauses. ${kbd("←")} and ${kbd("→")} step backward and forward.` }] }
    ] },
  { slug: "image", group: "Get started", title: "As an image",
    lede: "Render a diagram to an SVG that plays by itself. Put it anywhere an image goes.",
    sections: [
      { id: "render", h: "Render", blocks: [{ t: "code", file: "terminal", code: "$ ene flow.ene -o flow.svg" }, { t: "p", html: "The SVG loops on its own. No script is needed. It follows the viewer's dark mode and respects reduced motion." }] },
      { id: "embed", h: "Embed", blocks: [{ t: "code", file: "README.md", code: "## How checkout works\n\n![Order request](flow.svg)" }] },
      { id: "untrusted", h: "Rendering untrusted input", blocks: [{ t: "p", html: `When a server renders files you did not write, turn off remote icons with ${ic("--no-network")}, or allow only listed hosts with ${ic("--allow-host &lt;host&gt;")}. Use both together.` },
        { t: "code", file: "terminal", code: "$ ene flow.ene -o flow.svg --no-network\n$ ene flow.ene -o flow.svg --allow-host icons.example.com" },
        { t: "callout", label: "Note", html: "A failed icon never fails the render. The node is drawn without it and the reason is printed to stderr." }] }
    ] },
  { slug: "syntax", group: "Writing", title: "Syntax",
    lede: "One line is one step, played top to bottom. Everything else is optional.",
    sections: [
      { id: "reference", h: "Reference", blocks: [{ t: "table", head: ["Syntax", "Meaning", "What you see"], mono: [0], rows: [
        ["a -> b : label", "request", "The dot travels from a to b."], ["a --> b : label", "response", "Drawn dashed. Usually the way back."],
        ["a -x b : label", "failure", "The dot stops halfway and turns red."], ["a -> b & a -> c", "at the same time", "Both edges play in one step."],
        ["a -> b : label @2s", "duration", "This edge takes 2 seconds."], ["wait 0.5", "pause", "Waits before the next step, in seconds."],
        ["branch … / else … / end", "alternatives", "Paths the viewer chooses in the player."], ["loop 3 … end", "repeat", "Plays the enclosed steps three times."],
        ["group vpc[VPC] : a b", "container", "Draws a box around the listed nodes."], ["id[Label]{icon: …, shape: db, color: #f59e0b}", "node style", "Label, icon, shape and colour of a node."],
        ["diagram sequence", "layout", "Draws the flow as a sequence diagram."]] }] },
      { id: "try", h: "Try it", blocks: [{ t: "player", label: "Payment retry", code: "title Payment retry\norder[Order Service] -> pg[Payment Gateway] : authorize\npg -x order : timeout\nwait 1\norder -> pg : authorize (retry 1)\npg -x order : 503\nwait 2\norder -> pg : authorize (retry 2)\npg --> order : approved\norder -> ledger[Ledger] : record payment" }] }
    ] },
  { slug: "branches", group: "Writing", title: "Branches",
    lede: "Write two outcomes of the same step. The viewer picks which one plays.",
    sections: [
      { id: "write", h: "Write a branch", blocks: [{ t: "code", file: "cache.ene", code: "client[Client] -> api[API] : GET /product/42\napi -> redis[Redis] : GET product:42\nbranch cache hit\n  redis --> api : product\nelse cache miss\n  redis --> api : nil\n  api -> db[MySQL] : SELECT\n  db --> api : product\n  api -> redis : SET product:42\nend\napi --> client : 200" }] },
      { id: "player", h: "In the player", blocks: [{ t: "p", html: "A branch shows as a choice in the player. Choosing a path replays from the branch point. Steps after end play for both." },
        { t: "player", label: "Cache hit or miss", code: "title Cache hit / miss\nclient[Client] -> api[API] : GET /product/42\napi -> redis[Redis] : GET product:42\nbranch cache hit\n  redis --> api : product\nelse cache miss\n  redis --> api : nil\n  api -> db[MySQL] : SELECT\n  db --> api : product\n  api -> redis : SET product:42\nend\napi --> client : 200" }] },
      { id: "rules", h: "Rules", blocks: [{ t: "list", items: [`${ic("branch")} starts the first path; its text names the option.`, `Each ${ic("else")} adds another option.`, `${ic("end")} closes the block. Indentation is optional.`] }] }
    ] },
  { slug: "waits-and-loops", group: "Writing", title: "Waits and loops",
    lede: "Control timing: pause between steps, slow an edge down, run steps together or repeat them.",
    sections: [
      { id: "wait", h: "Wait", blocks: [{ t: "code", code: "pg -x order : timeout\nwait 1\norder -> pg : authorize (retry 1)" }, { t: "p", html: `${ic("wait 1")} pauses one second before the next step. Decimals work: ${ic("wait 0.5")}.` }] },
      { id: "duration", h: "Edge duration", blocks: [{ t: "code", code: "api -> db : full scan @2s" }, { t: "p", html: `${ic("@2s")} at the end of a step makes that one edge take two seconds.` }] },
      { id: "parallel", h: "At the same time", blocks: [{ t: "code", code: "api -> db : SELECT stock & api -> pay : charge" }, { t: "p", html: `Join steps with ${ic("&amp;")} to play them in one step, in parallel.` }] },
      { id: "loop", h: "Loop", blocks: [{ t: "code", code: "loop 3\n  worker -> queue : poll\n  queue --> worker : empty\nend" }, { t: "p", html: `${ic("loop 3")} repeats the enclosed steps three times.` }] }
    ] },
  { slug: "groups-and-styles", group: "Writing", title: "Groups and styles",
    lede: "Name nodes, give them icons and shapes, and draw boxes around related ones.",
    sections: [
      { id: "style", h: "Node label and style", blocks: [{ t: "code", code: "api[Order API]{icon: logos:aws-ec2} -> db[Orders DB]{shape: db, color: #f59e0b} : INSERT" },
        { t: "table", head: ["Key", "Values"], mono: [0], rows: [["icon", "A pack name such as logos:redis, or an SVG address"], ["shape", "circle, db, queue"], ["color", "A hex colour such as #f59e0b"]] }] },
      { id: "groups", h: "Groups", blocks: [{ t: "p", html: `${ic("group")} draws a box around the listed nodes. ${ic("in vpc")} nests one group inside another.` },
        { t: "player", label: "Order service in a VPC", code: "title Order service in a VPC\nuser[User]{icon: logos:chrome, shape: circle} -> alb[ALB]{icon: logos:aws-elb} : HTTPS\nalb -> api[Order API]{icon: logos:aws-ec2} : /orders\napi -> db[Orders DB]{icon: logos:aws-rds, shape: db} : INSERT\ndb --> api : OK\napi --> user : 201\ngroup vpc[VPC 10.0.0.0/16] : alb api db\ngroup priv[Private subnet] in vpc : api db" }] }
    ] },
  { slug: "sequence-diagrams", group: "Writing", title: "Sequence diagrams",
    lede: "The same steps, drawn as lifelines. Useful when order matters more than topology.",
    sections: [{ id: "switch", h: "Switch the layout", blocks: [{ t: "p", html: `Add ${ic("diagram sequence")} as the first line. Every other line stays the same, branches included.` },
      { t: "player", label: "Checkout sequence", code: "diagram sequence\ntitle Checkout sequence\nuser[User] -> api[Order API] : POST /checkout\napi -> redis[Redis]{shape: db} : check stock\nbranch in stock\n  redis --> api : OK\n  api -> pg[Payment Provider] : authorize\n  pg --> api : approved\n  api --> user : 201\nelse sold out\n  redis -x api : sold out\n  api --> user : 409\nend" }] }] },
  { slug: "player-controls", group: "Reference", title: "Player controls",
    lede: "Every player has the same controls, by mouse or keyboard.",
    sections: [
      { id: "buttons", h: "Buttons", blocks: [{ t: "list", items: ["Play and pause toggle playback.", "Step advances one step and pauses.", "Speed changes the playback rate.", "Branches appear as a choice when the diagram has them."] }] },
      { id: "keyboard", h: "Keyboard", blocks: [{ t: "p", html: "Click a player first to focus it." }, { t: "table", head: ["Key", "Action"], rows: [[kbd("Space"), "Play or pause"], [kbd("→"), "Next step"], [kbd("←"), "Previous step"]] }] }
    ] },
  { slug: "icon-loading", group: "Reference", title: "Icon loading",
    lede: "An icon is a pack name or an SVG address. ene limits what it fetches.",
    sections: [
      { id: "sources", h: "Sources", blocks: [{ t: "list", items: [`A pack name such as ${ic("logos:redis")}, from packs you register.`, `An SVG address: ${ic("http(s)://…")}, ${ic("./")}, ${ic("../")}, ${ic("/")} or ${ic("data:image/svg+xml,…")}.`] }] },
      { id: "limits", h: "Limits", blocks: [{ t: "stats", items: [["5 s", "Timeout per remote icon"], ["512 KiB", "Size limit, checked while streaming"], ["SVG", "The only accepted document type"]] }] },
      { id: "browser", h: "In the browser", blocks: [{ t: "code", file: "app.js", code: "ene.setIconLoading({ timeoutMs, maxBytes, allowHosts })" }] },
      { id: "cli", h: "On the command line", blocks: [{ t: "code", file: "terminal", code: "$ ene flow.ene -o flow.svg --no-network\n$ ene flow.ene -o flow.svg --allow-host icons.example.com" },
        { t: "callout", label: "Note", html: "A failed icon never fails the render. The node is drawn without it and a warning with the reason is printed." }] }
    ] },
  { slug: "security", group: "Reference", title: "Security",
    lede: "What ene does with content you did not write.",
    sections: [
      { id: "icons", h: "Icons are images", blocks: [{ t: "p", html: "Icons loaded from SVG files or URLs are embedded as images, so scripts inside them never run." }] },
      { id: "labels", h: "Labels are escaped", blocks: [{ t: "p", html: "Every label is escaped before it is drawn." }] },
      { id: "packs", h: "Packs are validated", blocks: [{ t: "p", html: "Icon packs are checked for prefix, icon bodies and numeric sizes before use, and pack bodies render as isolated images." }] },
      { id: "fetch", h: "Fetching is bounded", blocks: [{ t: "p", html: `Remote icons have a timeout and a size limit. On a server, use ${ic("--no-network")} or ${ic("--allow-host")}.` }] }
    ] }
];
export const groups = ["Get started", "Writing", "Reference"];
