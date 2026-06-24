import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Program, Programs } from 'src/app/interfaces/programming.model';


export const programmingArray: Program[]= [
  {
    name: 'NoetherVim',
    desc: 'A custom Neovim distribution built for mathematics and multilingual workflows. Designed around LaTeX editing, structured note-taking, and development across multiple languages, with a curated set of plugins and configurations out of the box.',
    link: 'https://github.com/Chiarandini/NoetherVim'
  },
  {
    name: 'noethervim-tex',
    desc: 'A LaTeX companion plugin for Neovim, built for mathematical writing. Provides context-aware LuaSnip snippets, treesitter textobject navigation, a preamble completion source, custom syntax highlights, and a spell dictionary of 900+ mathematical terms. Standalone by design, but integrates seamlessly with NoetherVim as part of its latex bundle.',
    link: 'https://github.com/Chiarandini/noethervim-tex'
  },
  {
    name: 'noethervim-typst',
    desc: 'A Typst companion plugin for Neovim, built for mathematical writing. Provides context-aware LuaSnip snippets, treesitter textobject navigation, custom syntax highlights, and a spell dictionary of 900+ mathematical terms. Standalone by design, but integrates seamlessly with NoetherVim as part of its typst bundle.',
    link: '#'
  },
  {
    name: 'noethervim-tableaux',
    desc: 'A collection of mathematical tableaux (dashboard scenes) for snacks.nvim. 31 presets ranging from animated number-theoretic processes (Sieve of Eratosthenes, Collatz trajectories, convergents of π) to live dynamical systems (Conway\'s Game of Life, Lorenz attractor) to topological objects (Königsberg bridges, fundamental polygons of closed surfaces) to contemplative scenes.',
    link: 'https://github.com/Chiarandini/noethervim-tableaux'
  },
  {
    name: 'macOS Dotfiles & Automated Setup',
    desc: 'My personal macOS dotfiles and an automated bootstrap script that turns a fresh Mac into a fully configured developer environment. Covers shell, terminals, Neovim, tmux, yabai tiling, git, and LaTeX setup.',
    link: 'https://github.com/Chiarandini/dotfiles'
  },
  {
    name: 'Trilingual Dictionary',
    desc: 'I couldn\'t find a good dictionary for japanese/chinese/english all at once, so I created one. The back-end is a GO library. It is wrapped in a CLI so that I can use it as a neovim plugin, but also exportable so that I can create an iOS app with it as well as host it on my website',
    link: 'https://github.com/Chiarandini/trilingual-dict'
  },
  {
    name: 'Fast Telescope Label/reference extension',
    desc: 'I did not find any good label finder plugin, so I made this one. Its aim was speed and being being aware of labels that are implicit in environments (ex. \\begin{theorem}{title}{label}).',
    link: 'https://github.com/Chiarandini/telescope-latex-references'
  },
  {
    name: 'Fast Telescope Heading Extension',
    desc: 'the default "Telescope headings" picker is very very slow on my huuuge latex files (ex. ~100k lines). This plugin is my solution to this problem',
    link: 'https://github.com/Chiarandini/telescope-cached-headings.nvim'
  },
  {
    name: 'Telescope PDF Browser',
    desc: 'A simple telescope extension to open pdfs (or really execute any file) after fuzzy seraching them',
    link: 'https://github.com/Chiarandini/telescope-pdf-browser.nvim'
  },
  {
    name: 'Obsidian Tools',
    desc: 'A collection of tools that help me organize my obsidian notes. Mainly a collection of API\'s for managing tags, improving syncing between phone/computer, and creating new notes.',
    link: 'https://github.com/Chiarandini/ObsidianTools'
  },
  {
    name: 'Website Tools',
    desc: 'A collection of tools that help me organize manage my website. Some programs to quickly create notes/books/blogs, edit templates, publish to website, and so forth.',
    link: 'https://github.com/Chiarandini/WebsiteTools'
  },
  {
    name: 'Keyboard Mode',
    desc: 'Creating a "keyboard mode" in neovim to be able to swtich keyboard layouts when in insert mode. Can choose which default and alternate keyboard. Good for writing text in insert mode with keyboards such as cyrillic, japanese, korean, chinese, devanagari, arabic, etc. ',
    link: 'https://github.com/Chiarandini/KeyboardMode'
  },

  // {
  //   name: 'Personal Website',
  //   desc: 'Angular-based website showcasing mathematical work, books, notes, and programming projects. Built with responsive design, PDF viewing capabilities, and modern web development practices.',
  //   link: 'https://github.com/yourusername/personal-website'
  // },
  {
    name: 'smart-actions.nvim',
    desc: 'AI-suggested code actions for Neovim, complementing the stock LSP code-action flow. Entry points include quickfix actions (grA), prose explanations of diagnostics (grE), language-appropriate suppression comments (grS), behaviour-preserving refactors (grR), single-test generation (grT), and broad review with severity-tagged findings (grV). All share a scope picker, a Claude Code CLI → Anthropic API provider layer with fallback, and a pluggable context system.',
    link: 'https://github.com/Chiarandini/smart-actions.nvim'
  }
];

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.scss']
})
export class ProgrammingComponent implements OnInit {
  programs = programmingArray;
  selectedProgram: Program | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openLink(program: Program) {
    if (program.link === '#') {
      return; // Do nothing for placeholder links
    }
    window.open(program.link, '_blank');
  }
}
