/* "Let your AI set this up": the prompts, the copy buttons, the sprite and the toast. */
(() => {
  const sp = document.createElement('div');
  sp.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">\n  <symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="currentColor"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="currentColor"/></symbol>\n  <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>\n  <symbol id="i-ok" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>\n  <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2.2"/></symbol>\n  <symbol id="i-gh" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.59.69.49A10.2 10.2 0 0 0 22 12.23C22 6.58 17.52 2 12 2z" fill="currentColor"/></symbol>\n  <symbol id="i-server" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="13" width="18" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7.5h.01M7 16.5h.01" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></symbol>\n</svg>';
  document.body.prepend(sp.firstChild);
  const tz = document.createElement('div');
  tz.className = 'toast'; tz.id = 'toast'; tz.setAttribute('role', 'status');
  tz.innerHTML = '<svg><use href="#i-ok"/></svg><span>Copied. Paste it into your AI assistant.</span>';
  document.body.append(tz);
  const BULLET = (a) => a.map((l) => '- ' + l).join('\n');
  const NUM = (a) => a.map((l, i) => (i + 1) + '. ' + l).join('\n');
  const RULES = BULLET([
    'Language: answer in the language I write in. Use plain words and short sentences. The first time you use a technical word (terminal, Docker, port, certificate), explain it in one sentence.',
    'One thing at a time: ask me one question, or give me one step, then wait. Do not dump a long list of steps or questions at once.',
    'Permission: before I run, click, download, type or install anything, tell me what it does and wait for my OK. If you are an assistant that can run commands on my computer yourself, ask my permission before every kind of action (downloading, installing, anything with sudo or administrator rights, changing the firewall or system settings, editing files) and show me the exact command first. Never run anything silently.',
    'Secrets: never ask me to paste a password, key, token or setup code into this chat. Tell me where on my own screen to type it. If I paste one by mistake, tell me to change it.',
    'Sources: the official pages and repositories below are the source of truth. If you can open web pages, read them first. If you cannot, ask me to paste the relevant part. Do not invent commands, file names, versions or menu names. If you are not sure, say "I am not sure" and tell me how to check.',
    'Honesty: if something fails or you cannot verify it, say so plainly. Do not pretend a step worked. Do not call a download safe or a command harmless unless you have actually read it.',
    'Stay on the task: help me with this setup. If I ask something else about KRNL0 (cost, safety, licence, why a warning appears), answer briefly and honestly from the sources, then offer to go back to the setup. Do not push or sell. If I decide not to install it, that is a fine outcome.',
    'Keep a short log: after each phase, say in one line what is done and what comes next. At the end, summarise what was set up, where things are stored, and how to undo it.',
  ]);
  const FACTS = BULLET([
    'KRNL0 is a free day planner: a timer, to-dos, habits, a calendar, focus sounds and a whiteboard on one canvas. It started as a university project and is built in public by theMindDeveloper.',
    'It is a desktop app. There is no account and no tracking: my plans live in one file (board.json) in the Documents/krnl0 folder on my own computer. To back up, copy that folder.',
    'It goes online only for things I set up myself: calendars I sign in to, my own KRNL0 server, an assistant model I chose, and a check on GitHub for a new version.',
    'Updates: the Windows installer updates itself from GitHub Releases. On Mac and Linux the app tells me when a new version is out and links to the download.',
    'Its code is public (source-available under the PolyForm Shield license, not open source). Code: https://github.com/theMindDeveloper/krnl0 . Site: https://krnl0.com . If I ask about the licence, read LICENSE.md in the repository and quote it. Do not guess or summarise it from memory.',
  ]);
  const TRUST = BULLET([
    'Free: no subscription, no trial, no account. Say that plainly.',
    'Why Windows or macOS shows a warning: the installer is not signed by a publisher yet (a signing certificate costs money, and this is a free project built in public). The warning is expected; it does not by itself mean the file is bad, and it does not prove it is good either. Tell me how I can check: I should have downloaded it from the official releases page https://github.com/theMindDeveloper/krnl0/releases .',
    'Real or not: the code is public on GitHub with its history, releases and issues. That means anyone can inspect it. It does not mean you or I have read every line, so say what you could not verify.',
    'Where my data goes: nowhere. It stays on my computer (and on my own server if I set one up).',
  ]);

  const P = {
    windows: {
      task: 'Help me install KRNL0 on this Windows computer, step by step.',
      sources: ['Guide: https://krnl0.com/download.html', 'Newest installer: https://github.com/theMindDeveloper/krnl0/releases (the .exe, named like KRNL0-Setup-X.Y.Z.exe)'],
      ask: ['Which Windows do I have? (Settings, System, About. I need 10 or 11, 64-bit.)', 'Am I allowed to install programs on this computer, or is it a work or school computer?', 'Do I want the newest version or a specific one? (Default: the newest.)'],
      plan: ['Find the newest installer on the releases page and tell me its exact file name and size, so I can check what I downloaded.', 'Help me download the .exe and find it in my Downloads folder.', 'Open it. Prepare me for the warning "Windows protected your PC" before it appears: click "More info" (it is hidden until clicked), then "Run anyway". It installs just for my user, no administrator rights, in a few seconds, and Windows will not ask again.', 'Check that KRNL0 opened. Show me where it is (Start menu) and where to start: drop a first plan on today.', 'Mention that it updates itself from now on, and that my plans are in Documents/krnl0.'],
      trouble: ['No "Run anyway" button: I have to click "More info" first.', 'The file will not open or disappears: my antivirus may have blocked it. Tell me to check the antivirus history and to only restore it if I trust the source. Do not tell me to turn the antivirus off.', 'A "needs administrator" prompt: stop and ask me whether this is a work or school computer.', 'Nothing opens after install: look in the Start menu, then try installing again.'],
    },
    mac: {
      task: 'Help me install KRNL0 on this Mac, step by step.',
      sources: ['Guide: https://krnl0.com/download.html', 'Releases: https://github.com/theMindDeveloper/krnl0/releases (the .dmg)'],
      ask: ['Which Mac do I have? (Apple menu, About This Mac. I need to know whether it says Chip: Apple M1 or newer, or Processor: Intel.)', 'Which macOS version?'],
      plan: ['Check the releases page for a Mac build and tell me honestly whether it exists. The official guide says the Mac build is for Apple silicon (M1 and newer). If I have an Intel Mac, say so and offer to build from source instead (the "build it from source" guide).', 'Open the .dmg and drag KRNL0 into Applications, then eject the disk image.', 'Prepare me for the warning before it appears: KRNL0 is not signed by Apple yet, so macOS says it cannot check the app. Click Done, then System Settings, Privacy and Security, scroll down and click "Open Anyway" next to KRNL0, then confirm. On older macOS: right-click the app and choose Open.', 'Check that KRNL0 opened and show me where to start: drop a first plan on today.'],
      trouble: ['"Open Anyway" is missing: I have to try opening the app once first; the button appears afterwards for a while.', 'The app is damaged or cannot be opened: do not tell me to run terminal commands to remove protections unless you first explain exactly what they do and I agree.', 'Intel Mac: the Mac build may not run; offer building from source.'],
    },
    linux: {
      task: 'Help me run KRNL0 on this Linux computer, step by step.',
      sources: ['Guide: https://krnl0.com/download.html', 'Releases: https://github.com/theMindDeveloper/krnl0/releases (an .AppImage, one file)', 'Source, if there is no Linux file: https://github.com/theMindDeveloper/krnl0'],
      ask: ['Which Linux (distribution and version) and which desktop? Is it a computer with a screen?', 'Am I comfortable using a terminal? (If not, give me the graphical way first.)'],
      plan: ['Check the releases page for an .AppImage and tell me honestly whether one exists for the newest version. The guide may say Linux is "coming soon". If there is no AppImage, say so and offer to build it from source (the "build it from source" guide).', 'Help me download the .AppImage to a folder I choose (my home folder is fine).', 'Allow it to run: right-click, Properties, "Allow executing file as program" (or in a terminal: chmod +x KRNL0-*.AppImage). Explain that command first and wait for my OK.', 'Double-click it, or run ./KRNL0-*.AppImage. KRNL0 runs straight from the file; nothing else is installed.', 'Check that KRNL0 opened and show me where to start.'],
      trouble: ['The AppImage does not start on Ubuntu or similar: a common cause is a missing library called libfuse2. Explain it, and only install it with my OK (it needs administrator rights).', 'Nothing happens on double-click: run it from a terminal and ask me to paste the error text (not any password).', 'No desktop, only a terminal: KRNL0 is a desktop app and needs a screen. The server guide may be what I want instead.'],
    },
    source: {
      task: 'Help me build KRNL0 from its source code on my own computer, step by step.',
      sources: ['Source and README: https://github.com/theMindDeveloper/krnl0 (read the README and package.json first)', 'Guide: https://krnl0.com/download.html'],
      ask: ['Which computer (Windows, Mac or Linux)? Have I used a terminal before? If not, explain what one is in two sentences.', 'Are Git and Node.js already installed? Ask me to check with the version commands, and explain them first.'],
      plan: ['Read the README and tell me which tools are needed and which versions. Do not rely on memory.', 'Help me install anything missing, one tool at a time, with my OK before each.', 'Copy the code: git clone https://github.com/theMindDeveloper/krnl0 , then go into the folder.', 'Install the dependencies (npm install) and start the app (npm run dev). Verify both commands in the README or package.json before giving them. Explain each line first.', 'Check that the app opens. Explain that this is a development run and where my data goes (Documents/krnl0).'],
      trouble: ['An error while installing: ask me to paste the error text (not any password) and help from that. Do not guess.', 'Wrong Node.js version: tell me what the README says and how to switch, with my OK.', 'It builds but I want an installer: check the README for the build command, and tell me honestly if it is not documented.'],
    },
    docker: {
      task: 'Help me set up my own KRNL0 server with Docker, step by step.',
      sources: ['Guide: https://krnl0.com/server.html', 'Server repository: https://github.com/theMindDeveloper/krnl0-server (README, docs, docker.sh, docker.ps1, compose.yml, env.example)'],
      ask: ['Which machine will run it (a NAS, a Raspberry Pi, an old laptop, a PC that is always on)? Will it stay on all day? It works best if it does: my phone and other computers can only reach the server while it runs.', 'Is Docker installed there, and which system is it (Linux, Mac, Windows)? Docker Desktop on Windows and Mac works.', 'Do I want to reach it only at home, or also away from home? (Away from home needs Tailscale or my own domain; do not open router ports on your own advice. Explain the options and risks first.)', 'Do I already run KRNL0 with docker run? (The same command moves it over and keeps the data.)'],
      plan: ['Before running the script, download it, read it, and tell me in plain words what it does. Linux or Mac: curl -fsSL https://github.com/theMindDeveloper/krnl0-server/releases/latest/download/docker.sh | sh . Windows PowerShell: irm https://github.com/theMindDeveloper/krnl0-server/releases/latest/download/docker.ps1 | iex . Then wait for my OK.', 'It finds my address and time zone, sets up KRNL0 and its updater in a folder called krnl0 in my home folder, and starts them. It asks one question: "Update by itself at night?" Either way, updates are one click in the app. At the end it prints an address like https://192.168.1.20:8443 and a one-time setup code.', 'Open that address in a browser. The server makes its own certificate, so the browser warns once: choose Advanced, then Continue. (No warning at all: use my own domain or Tailscale.)', 'Type the setup code, then choose a password of twelve characters or more. It is my login on every device. I keep it myself; never ask me to paste it here.', 'Connect each computer that has the KRNL0 app (version 0.13 or newer): click "saved" in the top bar, then Connect server, type the address, press Find. KRNL0 shows the server fingerprint, eight groups of letters and numbers. Compare it with the one on the server: docker exec krnl0 krnl0 fingerprint . If they do NOT match, stop: do not connect and tell me why it matters. If they match, tick "It matches my server", type my password, press Connect. The badge should say "saved · synced".', 'Phone: open the same address in its browser on the same Wi-Fi, continue past the warning (on an iPhone: Show Details, then visit this website), log in. No app to install.', 'Finish: explain that it makes a backup every day by itself and before every update, and that everything lives in one folder on the server.'],
      trouble: ['Docker is not installed: help me install it from Docker\'s official site, one step at a time with my OK, or offer the Linux one-command way if it is a Linux machine.', 'Something looks wrong: ask me to run docker exec -it krnl0 krnl0 doctor . It checks everything and says how to fix what is not right. Also docker exec -it krnl0 krnl0 status shows if it is running, its address, fingerprint and whether a new version is out.', 'My phone cannot reach it: same Wi-Fi? Is the address typed with https and the port? Is the machine on? A firewall? Do not suggest opening ports to the internet.', 'Other useful commands (put docker exec -it krnl0 in front): krnl0 backup (a backup now), krnl0 devices (the connected computers), krnl0 update (and krnl0 update now), krnl0 2fa enable (a code from my phone at every login).'],
    },
    'linux-server': {
      task: 'Help me set up my own KRNL0 server on this Linux machine, step by step.',
      sources: ['Guide: https://krnl0.com/server.html', 'Server repository: https://github.com/theMindDeveloper/krnl0-server (read install.sh and the README)'],
      ask: ['Which machine and system (Raspberry Pi OS, Ubuntu, Debian ...)? 64-bit? Do I have a terminal on it, and can I use sudo?', 'Will it stay on all day? It works best if it does: my phone and other computers can only reach the server while it runs.', 'Do I want to reach it only at home, or also away from home? (Away from home needs Tailscale or my own domain; do not open router ports on your own advice. Explain the options and risks first.)'],
      plan: ['Download install.sh first, read it, and tell me in plain words what it installs: KRNL0 as a locked-down service with its own user, plus its updater. Then wait for my OK to run: curl -fsSL https://github.com/theMindDeveloper/krnl0-server/releases/latest/download/install.sh | sh', 'It checks the download, then asks a few questions in the terminal: what the server does (website, app sync), encryption, its address, my password, and whether it may update itself at night. Explain each question before I answer it, and never ask me for the password in this chat.', 'It ends with a QR code for my phone and an address like https://192.168.1.20:8443. Open that address in a browser; the server makes its own certificate, so the browser warns once: Advanced, then Continue.', 'Connect each computer that has the KRNL0 app (version 0.13 or newer): click "saved" in the top bar, then Connect server, type the address, press Find, and compare the fingerprint with the one from krnl0 fingerprint on the server. If they do NOT match, stop and explain why. If they match, tick "It matches my server", type my password, press Connect. The badge should say "saved · synced".', 'Phone: scan the QR code or type the address, continue past the warning (on an iPhone: Show Details, then visit this website), log in.', 'Finish: it makes a backup every day by itself and before every update; everything lives in one folder on the server.'],
      trouble: ['Something looks wrong: ask me to run krnl0 doctor . It checks everything and says how to fix what is not right. krnl0 status shows if it is running, its address, fingerprint and whether a new version is out.', 'My phone cannot reach it: same Wi-Fi? Is the address typed with https and the port? Is the machine on? A firewall? Do not suggest opening ports to the internet.', 'Other useful commands: krnl0 backup, krnl0 devices, krnl0 update (and krnl0 update now), krnl0 2fa enable.'],
    },
    real: {
      task: 'Help me decide whether KRNL0 is real and safe to use. I may not install it, and that is fine.',
      sources: ['Project: https://github.com/theMindDeveloper/krnl0', 'Server: https://github.com/theMindDeveloper/krnl0-server', 'Site: https://krnl0.com'],
      ask: ['What worries me most? (Is it a real project, is it safe, why does Windows warn me, what happens to my data, what does it cost.)', 'Do I know what GitHub is? If not, explain it before anything else.'],
      plan: ['Explain what GitHub is in a few plain sentences: a public website where developers keep the code of their projects, with every change recorded, so anyone can look.', 'Open the repository with me and show me where to find things: the README (what the app is), the releases (the installers, with dates and sizes), the history of changes (how long and how actively it has been worked on), the issues (what other people report), and the LICENSE file.', 'Explain honestly what that shows and what it does not. Public code means anyone can inspect it; it does not mean that you or I have read every line. Say what you could not check.', 'Suggest simple checks I can do myself: that the installer comes from the official releases page, its size and date, and scanning it on a site such as VirusTotal.', 'Answer my questions using the facts below, only as deeply as I ask. Do not try to persuade me.'],
      trouble: ['If you cannot open the pages, ask me to paste the README or the releases page, and say that your answer is based on what I pasted.', 'If I ask something you cannot verify (for example who is behind the project beyond what the repository shows), say so.'],
    },
  };

  const build = (k) => {
    const p = P[k];
    return [
      '# Task\n' + p.task,
      '# How to work with me (rules)\n' + RULES,
      '# Official sources\n' + BULLET(p.sources) + '\nIf you can open web pages, read these first. If not, ask me to paste what you need.',
      '# What KRNL0 is (facts you can rely on)\n' + FACTS,
      '# Ask me first (one question at a time)\n' + NUM(p.ask),
      '# The plan (stop after each step and wait for me)\n' + NUM(p.plan),
      '# If something goes wrong\n' + BULLET(p.trouble),
      '# If I ask about trust, cost or warnings\n' + TRUST,
      '# Done means\nKRNL0 (or the server) is working, I know where my data is, I know how to undo the setup, and I did not have to paste any secret into this chat.',
    ].join('\n\n');
  };

  const toast = document.getElementById('toast'); let tt = 0;
  const say = (m) => { toast.querySelector('span').textContent = m; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 2600); };
  const copyText = async (t) => {
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(t); return true; } } catch (e) { /* fall through */ }
    const a = document.createElement('textarea'); a.value = t; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(a); a.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) { /* none */ } a.remove(); return ok;
  };
  document.querySelectorAll('[data-prompt]').forEach((box) => {
    const key = box.dataset.prompt;
    const btn = box.matches('button') ? box : box.querySelector('.copy');
    const pre = box.querySelector('.prompt');
    if (pre) pre.textContent = build(key);
    btn.addEventListener('click', async () => {
      const ok = await copyText(build(key));
      if (!ok) { say('Could not copy. Open "Read exactly what you copied" and copy it by hand.'); box.classList.add('is-copied'); return; }
      if (box.matches('button')) { say('Copied. Paste it into your AI assistant.'); return; }
      // the steps and the prompt stay open once you have copied; only the button's "Copied" goes back
      box.classList.add('is-copied', 'just');
      clearTimeout(box._t); box._t = setTimeout(() => box.classList.remove('just'), 2600);
    });
    const peek = box.querySelector('.peek');
    if (peek) peek.addEventListener('click', () => { const o = pre.classList.toggle('is-open'); peek.setAttribute('aria-expanded', String(o)); });
  });
  document.querySelectorAll('[data-seq] .chat').forEach((c) => {
    if (!('IntersectionObserver' in window)) { c.classList.add('in'); return; }
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { c.classList.add('in'); o.disconnect(); } }, { threshold: 0.4 }).observe(c);
  });

})();
